import { z } from "zod";

export const rationCardReferenceSchema = z
  .string()
  .trim()
  .min(1)
  .max(64);

export const requestIdSchema = z
  .string()
  .trim()
  .min(16)
  .max(128);
