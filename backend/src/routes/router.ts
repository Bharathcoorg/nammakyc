import { healthResponse } from "./health";
import { MockPdsProvider } from "../providers/pds/mock";
import { HouseholdService } from "../services/household";

const householdService = new HouseholdService(new MockPdsProvider());

export async function route(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    return healthResponse();
  }

  const householdMatch = url.pathname.match(/^\/v1\/households\/([^/]+)$/);
  if (request.method === "GET" && householdMatch) {
    try {
      const result = await householdService.lookup(decodeURIComponent(householdMatch[1]));
      return Response.json(result, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch {
      return Response.json(
        { error: { code: "INVALID_REQUEST", message: "Invalid ration card reference" } },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  return undefined;
}
