import { healthResponse } from "./health";
import { MockPdsProvider } from "../providers/pds/mock";
import { MockAadhaarProvider } from "../providers/aadhaar/mock";
import { MockKycProvider } from "../providers/kyc/mock";
import { HouseholdService } from "../services/household";
import { TransactionService } from "../services/transactions";
import { InMemoryTransactionRepository } from "../repositories/transaction";
import { AppError } from "../domain/errors";

const pds = new MockPdsProvider();
const householdService = new HouseholdService(pds);
const transactionService = new TransactionService(
  new InMemoryTransactionRepository(), pds, new MockAadhaarProvider(), new MockKycProvider()
);

const jsonHeaders = { "Cache-Control": "no-store" };

export async function route(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname === "/health") return healthResponse();

  const householdMatch = url.pathname.match(/^\/v1\/households\/([^/]+)$/);
  if (request.method === "GET" && householdMatch) {
    try {
      return Response.json(await householdService.lookup(decodeURIComponent(householdMatch[1])), { headers: jsonHeaders });
    } catch {
      return Response.json({ error: { code: "INVALID_REQUEST", message: "Invalid ration card reference" } }, { status: 400, headers: jsonHeaders });
    }
  }

  if (request.method === "POST" && url.pathname === "/v1/kyc") {
    const key = request.headers.get("Idempotency-Key") ?? "";
    try {
      const body = await request.json() as Record<string, unknown>;
      if (typeof body.householdReference !== "string" || typeof body.memberReference !== "string" || typeof body.consentReference !== "string") {
        throw new AppError("INVALID_REQUEST","Invalid KYC request",400);
      }
      const tx = await transactionService.start({
        householdReference: body.householdReference,
        memberReference: body.memberReference,
        consentReference: body.consentReference,
        idempotencyKey: key
      });
      return Response.json({ requestId: tx.requestId, status: tx.status, reference: tx.providerReference }, { status: 202, headers: jsonHeaders });
    } catch (error) {
      const e = error instanceof AppError ? error : new AppError("INTERNAL_ERROR","Internal server error",500);
      return Response.json({ error: { code: e.code, message: e.message } }, { status: e.status, headers: jsonHeaders });
    }
  }

  const statusMatch = url.pathname.match(/^\/v1\/kyc\/([^/]+)$/);
  if (request.method === "GET" && statusMatch) {
    const message = { error: { code: "NOT_FOUND", message: "KYC transaction not found" } };
    return Response.json(message, { status: 404, headers: jsonHeaders });
  }
  return undefined;
}
