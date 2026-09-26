import { route } from "./routes/router";
import { requestId, withSecurityHeaders } from "./security/headers";
export interface Env { ENVIRONMENT: string; }
export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const id = requestId(request);
    try {
      const response = await route(request);
      return withSecurityHeaders(response ?? Response.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, { status: 404 }), id);
    } catch {
      return withSecurityHeaders(Response.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, { status: 500 }), id);
    }
  }
};
