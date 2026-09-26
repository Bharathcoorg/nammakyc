import { route } from "./routes/router";

export interface Env {
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    try {
      const response = await route(request);
      return response ?? Response.json(
        { error: { code: "NOT_FOUND", message: "Route not found" } },
        { status: 404 }
      );
    } catch {
      return Response.json(
        { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
        { status: 500 }
      );
    }
  }
};
