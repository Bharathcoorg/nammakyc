export function requestId(request: Request): string {
  return request.headers.get("X-Request-Id")?.trim() || crypto.randomUUID();
}

export function withSecurityHeaders(response: Response, id: string): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Request-Id", id);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Permissions-Policy", "camera=(self), microphone=(), geolocation=()");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
