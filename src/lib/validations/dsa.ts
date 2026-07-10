import { z } from "zod";

const languageEnum = z.enum(["python", "javascript", "java", "cpp"]);

export const executeSchema = z.object({
  slug: z.string().min(1),
  language: languageEnum,
  code: z.string().min(1).max(50000),
  customInput: z.string().max(20000).optional(),
});

export const submitSchema = z.object({
  slug: z.string().min(1),
  language: languageEnum,
  code: z.string().min(1).max(50000),
});

export type ExecuteInput = z.infer<typeof executeSchema>;
export type SubmitInput = z.infer<typeof submitSchema>;
