import type { IdempotencyRecord } from "../domain/kyc/idempotency";
import type { KycTransaction } from "../domain/kyc/transaction";
import type { ConsentArtifact } from "../domain/kyc/consent";
import type { TransactionRepository } from "./transaction";

export interface D1DatabaseLike{prepare(query:string):{bind(...values:unknown[]):any};batch(statements:any[]):Promise<any[]>}

export class D1TransactionRepository implements TransactionRepository{
 constructor(private readonly db:D1DatabaseLike){}

 async get(requestId:string){
  const r=await this.db.prepare("SELECT * FROM kyc_transactions WHERE request_id = ?").bind(requestId).first();
  return r?{requestId:r.request_id,householdReference:r.household_reference,memberReference:r.member_reference,status:r.status,createdAt:r.created_at,updatedAt:r.updated_at,providerReference:r.provider_reference??undefined}:undefined;
 }

 async getIdempotency(key:string){
  const r=await this.db.prepare("SELECT * FROM idempotency_keys WHERE idempotency_key = ?").bind(key).first();
  return r?{key:r.idempotency_key,requestFingerprint:r.request_fingerprint,requestId:r.request_id,createdAt:r.created_at}:undefined;
 }

 async createIfAbsent(tx:KycTransaction,record:IdempotencyRecord,consent:ConsentArtifact){
  const statements=[
   this.db.prepare("INSERT INTO kyc_transactions (request_id,household_reference,member_reference,status,created_at,updated_at,provider_reference) VALUES (?,?,?,?,?,?,?)")
    .bind(tx.requestId,tx.householdReference,tx.memberReference,tx.status,tx.createdAt,tx.updatedAt,tx.providerReference??null),
   this.db.prepare("INSERT INTO idempotency_keys (idempotency_key,request_fingerprint,request_id,created_at) VALUES (?,?,?,?)")
    .bind(record.key,record.requestFingerprint,record.requestId,record.createdAt),
   this.db.prepare("INSERT INTO consent_artifacts (consent_reference,purpose,policy_version,language,captured_at,transaction_reference) VALUES (?,?,?,?,?,?)")
    .bind(consent.consentReference,consent.purpose,consent.policyVersion,consent.language,consent.capturedAt,consent.transactionReference)
  ];
  try{
   const results=await this.db.batch(statements);
   return results.every(r=>(r.meta?.changes??0)>0);
  }catch(error){
   const [transaction,idempotency]=await Promise.all([
    this.get(tx.requestId),
    this.getIdempotency(record.key)
   ]);
   if(transaction||idempotency)return false;
   throw error;
  }
 }

 async update(tx:KycTransaction){
  await this.db.prepare("UPDATE kyc_transactions SET status=?,updated_at=?,provider_reference=?,household_reference=?,member_reference=? WHERE request_id=?")
   .bind(tx.status,tx.updatedAt,tx.providerReference??null,tx.householdReference,tx.memberReference,tx.requestId).run();
 }
}
