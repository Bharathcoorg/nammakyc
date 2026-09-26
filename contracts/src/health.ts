import { z } from "zod";

export const healthResponseSchema = z.object({
  service: z.literal("namma-kyc-api"),
  status: z.literal("ok")
});
