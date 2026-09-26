import { healthResponse } from "./health";

export function route(request: Request): Response | undefined {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    return healthResponse();
  }

  return undefined;
}
