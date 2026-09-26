export interface Env { ENVIRONMENT: string; }

export default {
  async fetch(_request: Request, _env: Env): Promise<Response> {
    return Response.json({ service: "namma-kyc-api", status: "ok" });
  }
};
