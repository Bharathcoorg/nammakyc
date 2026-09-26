import { z } from "zod";

export const rationCardReferenceSchema = z.string().trim().min(1).max(64);

export const householdMemberSchema = z.object({
  memberReference: z.string().min(1).max(128),
  displayName: z.string().min(1).max(200),
  kycRequired: z.boolean(),
  lastVerifiedAt: z.string().datetime().optional()
});

export const householdSchema = z.object({
  householdReference: z.string().min(1).max(128),
  members: z.array(householdMemberSchema)
});

export type Household = z.infer<typeof householdSchema>;
export type HouseholdMember = z.infer<typeof householdMemberSchema>;
