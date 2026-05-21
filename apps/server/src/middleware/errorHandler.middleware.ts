import { ZodError } from "zod";
import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof ZodError) {
    return c.json({ error: "Validation failed", issues: error.issues }, 400);
  }

  console.error(error);
  return c.json({ error: "Internal server error" }, 500);
};
