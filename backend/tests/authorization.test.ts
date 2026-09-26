import { describe, expect, it } from "vitest";
import { authorizeRequest } from "../src/security/authorization";

describe("authorization boundary", () => {
  it("does not require production authorization in development", async () => {
    await expect(authorizeRequest({ ENVIRONMENT:"development" }, {
      action:"kyc.create",
      request:new Request("https://api.test/v1/kyc")
    })).resolves.toBeUndefined();
  });

  it("fails closed in production without an authorization policy", async () => {
    await expect(authorizeRequest({ ENVIRONMENT:"production" }, {
      action:"kyc.create",
      request:new Request("https://api.test/v1/kyc")
    })).rejects.toThrow("Production authorization policy is required");
  });

  it("delegates the exact action and request reference to the configured policy", async () => {
    const calls: Array<{action:string;requestId?:string}> = [];
    await authorizeRequest({
      ENVIRONMENT:"production",
      AUTHORIZATION:{
        authorize: async context => {
          calls.push({ action:context.action, requestId:context.requestId });
        }
      }
    }, {
      action:"kyc.status.read",
      request:new Request("https://api.test/v1/kyc/request-1"),
      requestId:"request-1"
    });
    expect(calls).toEqual([{action:"kyc.status.read",requestId:"request-1"}]);
  });
});
