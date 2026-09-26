import { route } from "./routes/router";
import { requestId, withSecurityHeaders } from "./security/headers";
import { validateRequest } from "./security/request";
export interface Env { ENVIRONMENT: string; DB?: D1Database; }
export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const id = requestId(request);
    try {
      validateRequest(request);
      const response = await route(request);
      return withSecurityHeaders(response ?? Response.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, { status: 404 }), id);
    } catch (error) {
      const status = error instanceof Error && "status" in error && typeof (error as {status?:unknown}).status === "number" ? (error as {status:number}).status : 500;
      const code = error instanceof Error && "code" in error && typeof (error as {code?:unknown}).code === "string" ? (error as {code:string}).code : "INTERNAL_ERROR";
      const message = status < 500 && error instanceof Error ? error.message : "Internal server error";
      return withSecurityHeaders(Response.json({ error: { code, message } }, { status }), id);
    }
  }
};
