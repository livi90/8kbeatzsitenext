import * as z from "zod";

export const createBeatSchema = z.object({
  name: z.string().min(1, "beat name is required"),
  genere: z.string().min(1, "Genere is required"),
  downloadUrl: z.string().url(),
  bpm: z.number().int().nonnegative("Bpm can not be negative"),
  image: z.any(),
});

export const createPackSchema = z.object({
  name: z.string().min(1, "beat name is required"),
  description: z.string(),
  downloadUrl: z.string().url(),
});

export const createAdsSchema = z.object({
  adUrl:z.string().url(),
  image: z.any(),
});
