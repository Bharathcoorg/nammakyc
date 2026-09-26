import { healthResponse } from "./health";
import { AppError } from "../domain/errors";
import { MockPdsProvider } from "../providers/pds/mock";
import { MockAadhaarProvider } from "../providers/aadhaar/mock";
import { MockKycProvider } from "../providers/kyc/mock";
import { InMemoryTransactionRepository } from "../repositories/transaction";
import { getHousehold } from "../services/household";
import { startKyc } from "../services/transactions";
const repository = new InMemoryTransactionRepository();
const pds = new MockPdsProvider(); const aadhaar = new MockAadhaarProvider(); const kyc = new MockKycProvider();
function errorResponse(error: unknown): Response {
  if (error instanceof AppError) return Response.json({ error: { code: error.code, message: error.message } }, { status: error.status });
  return Response.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, { status: 500 });
}
export async function route(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  try {
    if (request.method === "GET" && url.pathname === "/health") return healthResponse();
    const householdMatch = url.pathname.match(/^\/v1\/households\/([^/]+)$/);
    if (request.method === "GET" && householdMatch) return Response.json(await getHousehold(pds, decodeURIComponent(householdMatch[1])));
    if (url.pathname === "/v1/kyc" && request.method === "POST") {
      const idempotencyKey = request.headers.get("Idempotency-Key");
      if (!idempotencyKey) return Response.json({ error: { code: "INVALID_REQUEST", message: "Idempotency-Key header is required" } }, { status: 400 });
      const body = await request.json().catch(() => null) as { householdReference?: unknown; memberReference?: unknown; consentReference?: unknown } | null;
      if (!body || typeof body.householdReference !== "string" || typeof body.memberReference !== "string" || typeof body.consentReference !== "string")
        return Response.json({ error: { code: "INVALID_REQUEST", message: "Invalid KYC request body" } }, { status: 400 });
      const result = await startKyc(repository, pds, aadhaar, kyc, { householdReference: body.householdReference, memberReference: body.memberReference, consentReference: body.consentReference, idempotencyKey });
      return Response.json({ requestId: result.transaction.requestId, status: result.transaction.status, ...(result.transaction.providerReference ? { reference: result.transaction.providerReference } : {}) }, { status: 202, headers: result.replayed ? { "X-Idempotent-Replay": "true" } : undefined });
    }
    const statusMatch = url.pathname.match(/^\/v1\/kyc\/([^/]+)$/);
    if (request.method === "GET" && statusMatch) {
      const transaction = await repository.getByRequestId(decodeURIComponent(statusMatch[1]));
      if (!transaction) throw new AppError("NOT_FOUND", "KYC transaction not found", 404);
      return Response.json({ requestId: transaction.requestId, status: transaction.status, ...(transaction.providerReference ? { reference: transaction.providerReference } : {}) });
    }
  } catch (error) { return errorResponse(error); }
  return undefined;
}
