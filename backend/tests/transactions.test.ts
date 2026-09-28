import { describe, expect, it } from "vitest";
import { InMemoryTransactionRepository } from "../src/repositories/transaction";
import { TransactionService } from "../src/services/transactions";
import type { PdsProvider } from "../src/providers/pds/provider";
import type { AadhaarProvider } from "../src/providers/aadhaar/provider";
import type { KycProvider } from "../src/providers/kyc/provider";
import { AppError } from "../src/domain/errors";
import type { MetricName, MetricsSink } from "../src/observability/metrics";

class RecordingMetrics implements MetricsSink {
  events: MetricName[]=[];
  increment(name: MetricName): void { this.events.push(name); }
}

const pds: PdsProvider={lookupHousehold:async ref=>({householdReference:ref,members:[{memberReference:"M-1",displayName:"Demo Citizen",kycRequired:true}]})};

describe("TransactionService",()=>{
 it("replays the same idempotent request",async()=>{
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,{startAuthentication:async()=>({accepted:true,providerReference:"auth-1"})},{submit:async()=>({success:true,providerReference:"kyc-1"})});
  const input={householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-1",idempotencyKey:"0000000000000000"};
  const first=await service.start(input);const second=await service.start(input);
  expect(second.requestId).toBe(first.requestId);expect(second.status).toBe("success");
 });
 it("retries transient household provider failures before creating the transaction",async()=>{
  let calls=0;
  const flakyPds:PdsProvider={lookupHousehold:async ref=>{
    calls++;
    if(calls===1) throw new AppError("UPSTREAM_UNAVAILABLE","temporary household outage",503);
    return {householdReference:ref,members:[{memberReference:"M-1",displayName:"Demo Citizen",kycRequired:true}]};
  }};
  const service=new TransactionService(new InMemoryTransactionRepository(),flakyPds,{startAuthentication:async()=>({accepted:true,providerReference:"auth-pds-retry"})},{submit:async()=>({success:true,providerReference:"kyc-pds-retry"})});
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-pds-retry",idempotencyKey:"1212121212121212"});
  expect(created.status).toBe("aadhaar_pending");
  expect(calls).toBe(2);
 });

 it("moves retryable provider failures to retrying",async()=>{
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,{startAuthentication:async()=>{throw new AppError("UPSTREAM_UNAVAILABLE","temporary",503)}},{submit:async()=>({success:true,providerReference:"kyc-1"})});
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-1",idempotencyKey:"1111111111111111"});
  await expect(service.process({transactionId:created.requestId})).rejects.toMatchObject({code:"UPSTREAM_UNAVAILABLE"});
  expect((await service.get(created.requestId))?.status).toBe("retrying");
 });
 it("rejects reusing an idempotency key for different input",async()=>{
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,{startAuthentication:async()=>({accepted:true,providerReference:"auth-1"})},{submit:async()=>({success:true,providerReference:"kyc-1"})});
  const key="0000000000000000";await service.start({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-1",idempotencyKey:key});
  await expect(service.start({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-2",idempotencyKey:key})).rejects.toMatchObject({code:"DUPLICATE_REQUEST",status:409});
 });
 it("treats authentication method as part of idempotency",async()=>{
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,{startAuthentication:async()=>({accepted:true,providerReference:"auth-method"})},{submit:async()=>({success:true,providerReference:"pds-method"})});
  const key="2222222222222222";
  await service.start({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-method",authenticationMethod:"otp",idempotencyKey:key});
  await expect(service.start({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-method",authenticationMethod:"face",idempotencyKey:key})).rejects.toMatchObject({code:"DUPLICATE_REQUEST",status:409});
 });
 it("allows only one concurrent worker to claim an in-flight transaction",async()=>{
  let authCalls=0;let releaseAuth!:()=>void;const authGate=new Promise<void>(resolve=>{releaseAuth=resolve});
  const aadhaar:AadhaarProvider={startAuthentication:async()=>{authCalls++;await authGate;return {accepted:true,providerReference:"auth-concurrent"}}};
  const kyc:KycProvider={submit:async()=>({success:true,providerReference:"kyc-concurrent"})};
  const repository=new InMemoryTransactionRepository();const service=new TransactionService(repository,pds,aadhaar,kyc);
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-concurrent",idempotencyKey:"3333333333333333"});
  const first=service.process({transactionId:created.requestId});
  await new Promise(resolve=>setTimeout(resolve,0));
  const second=service.process({transactionId:created.requestId});
  await new Promise(resolve=>setTimeout(resolve,0));
  expect(await service.get(created.requestId)).toMatchObject({status:"aadhaar_authenticating",processingClaimId:expect.any(String)});expect(authCalls).toBe(1);
  releaseAuth();await expect(first).resolves.toMatchObject({status:"success"});await expect(second).resolves.toMatchObject({status:"aadhaar_authenticating"});expect(authCalls).toBe(1);
 });

 it("binds provider calls to persisted transaction data",async()=>{
  let seenMember=""; let seenConsent="";
  const aadhaar:AadhaarProvider={startAuthentication:async request=>{seenMember=request.memberReference;seenConsent=request.consentReference;return {accepted:true,providerReference:"auth-persisted"}}};
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,aadhaar,{submit:async()=>({success:true,providerReference:"pds-persisted"})});
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-persisted",idempotencyKey:"4444444444444444"});
  const result=await service.process({transactionId:created.requestId});
  expect(result.status).toBe("success"); expect(seenMember).toBe("M-1"); expect(seenConsent).toBe("consent-persisted");
 });
 it("records terminal failure metrics",async()=>{
  const metrics=new RecordingMetrics();
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,{startAuthentication:async()=>({accepted:true,providerReference:"5555555555555555"})},{submit:async()=>({success:true,providerReference:"kyc-fail"})},undefined,metrics);
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-fail",idempotencyKey:"6666666666666666"});
  const failed=await service.markFailed(created.requestId);
  expect(failed.status).toBe("failed");
  expect(metrics.events).toEqual(["kyc.created","kyc.failed"]);
 });

 it("records transaction outcome metrics without identifiers",async()=>{
  const metrics=new RecordingMetrics();
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,{startAuthentication:async()=>({accepted:true,providerReference:"auth-metrics"})},{submit:async()=>({success:true,providerReference:"kyc-metrics"})},undefined,metrics);
  const result=await service.start({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-metrics",idempotencyKey:"7777777777777777"});
  expect(result.status).toBe("success");
  expect(metrics.events).toEqual(["kyc.created","kyc.succeeded"]);
 });

});


describe("processing claim fencing",()=>{
 it("does not let a stale worker overwrite a newer claim",async()=>{
  const repository=new InMemoryTransactionRepository();
  const service=new TransactionService(repository,pds,{startAuthentication:async()=>({accepted:true,providerReference:"auth-fence"})},{submit:async()=>({success:true,providerReference:"kyc-fence"})});
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-fence",idempotencyKey:"8888888888888888"});
  const first=await repository.claimForProcessing(created.requestId,"claim-old","2026-09-26T12:00:00.000Z","2026-09-26T11:59:00.000Z");
  const second=await repository.claimForProcessing(created.requestId,"claim-new","2026-09-26T12:01:00.000Z","2026-09-26T12:00:30.000Z");
  expect(first).toBe(true); expect(second).toBe(true);
  const stale=await repository.update({...created,status:"failed",updatedAt:"2026-09-26T12:01:01.000Z",processingClaimId:undefined},"claim-old");
  expect(stale).toBe(false);
  expect((await repository.get(created.requestId))?.processingClaimId).toBe("claim-new");
 });
});


describe("provider lifecycle boundaries",()=>{
 it("does not call PDS e-KYC when Aadhaar authentication fails",async()=>{
  let pdsCalls=0;
  const aadhaar:AadhaarProvider={startAuthentication:async()=>({accepted:false,providerReference:undefined})};
  const kyc:KycProvider={submit:async()=>{pdsCalls++;return {success:true,providerReference:"pds-should-not-run"}}};
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,aadhaar,kyc);
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-auth-fail",idempotencyKey:"9999999999999999"});
  await expect(service.process({transactionId:created.requestId})).rejects.toMatchObject({code:"AUTHENTICATION_FAILED"});
  expect(pdsCalls).toBe(0);
  expect((await service.get(created.requestId))?.status).toBe("failed");
 });

 it("keeps Aadhaar and PDS references separate",async()=>{
  const service=new TransactionService(new InMemoryTransactionRepository(),pds,
    {startAuthentication:async()=>({accepted:true,providerReference:"aadhaar-auth-ref",sessionReference:"aadhaar-session-ref"})},
    {submit:async()=>({success:true,providerReference:"pds-kyc-ref"})});
  const result=await service.start({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-separated",idempotencyKey:"1010101010101010"});
  expect(result.status).toBe("success");
  expect(result.aadhaarAuthenticationReference).toBe("aadhaar-auth-ref");
  expect(result.aadhaarSessionReference).toBe("aadhaar-session-ref");
  expect(result.pdsTransactionReference).toBe("pds-kyc-ref");
 });

 it("does not repeat accepted Aadhaar authentication during a PDS retry",async()=>{
  let authCalls=0; let pdsCalls=0;
  const aadhaar:AadhaarProvider={startAuthentication:async()=>{authCalls++;return {accepted:true,providerReference:"aadhaar-once"}}};
  const kyc:KycProvider={submit:async()=>{pdsCalls++;if(pdsCalls<=3)throw new AppError("UPSTREAM_UNAVAILABLE","temporary",503);return {success:true,providerReference:"pds-after-retry"}}};
  const repository=new InMemoryTransactionRepository();
  const service=new TransactionService(repository,pds,aadhaar,kyc);
  const created=await service.create({householdReference:"RC-1",memberReference:"M-1",consentReference:"consent-retry-boundary",idempotencyKey:"1111111111111111"});
  await expect(service.process({transactionId:created.requestId})).rejects.toMatchObject({code:"UPSTREAM_UNAVAILABLE"});
  expect((await service.get(created.requestId))?.status).toBe("retrying");
  const result=await service.process({transactionId:created.requestId});
  expect(result.status).toBe("success");
  expect(authCalls).toBe(1);
  expect(pdsCalls).toBe(4);
 });
});
