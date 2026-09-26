export type AuthorizationAction = "household.read" | "kyc.create" | "kyc.status.read";

export interface AuthorizationContext {
  action: AuthorizationAction;
  request: Request;
  requestId?: string;
}

export interface AuthorizationPolicy {
  authorize(context: AuthorizationContext): Promise<void>;
}

export async function authorizeRequest(
  env: { ENVIRONMENT?: string; AUTHORIZATION?: AuthorizationPolicy },
  context: AuthorizationContext
): Promise<void> {
  if (env.ENVIRONMENT !== "production") return;
  if (!env.AUTHORIZATION) {
    throw new Error("Production authorization policy is required");
  }
  await env.AUTHORIZATION.authorize(context);
}
