export function healthResponse(): Response {
  return Response.json({ service: "namma-kyc-api", status: "ok" });
}
