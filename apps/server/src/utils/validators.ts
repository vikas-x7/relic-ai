import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(120).optional(),
});

export const renameConversationSchema = z.object({
  title: z.string().min(1).max(120),
});

export const chatSchema = z.object({
  message: z.string().min(1),
  useSearch: z.boolean().optional().default(false),
});

export const settingsSchema = z.object({
  preferences: z.record(z.string(), z.unknown()),
});

export const searchSchema = z.object({
  query: z.string().min(1),
});

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>) {
  const body = await request.json().catch(() => null);
  return schema.parse(body);
}
