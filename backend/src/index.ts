import { route } from "./routes/router";

export interface Env {
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const response = route(request);
    return response ?? Response.json(
      { error: { code: "NOT_FOUND", message: "Route not found" } },
      { status: 404 }
    );
  }
};
