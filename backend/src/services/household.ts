import type { PdsProvider, PdsHousehold } from "../providers/pds/provider";
import { AppError } from "../domain/errors";
import { rationCardReferenceSchema } from "../validation/request";

export async function getHousehold(
  provider: PdsProvider,
  rationCardReference: string
): Promise<PdsHousehold> {
  const parsed = rationCardReferenceSchema.safeParse(rationCardReference);
  if (!parsed.success) {
    throw new AppError("INVALID_REQUEST", "Invalid ration card reference", 400);
  }

  try {
    return await provider.lookupHousehold(parsed.data);
  } catch {
    throw new AppError("UPSTREAM_UNAVAILABLE", "Household service unavailable", 503);
  }
}
