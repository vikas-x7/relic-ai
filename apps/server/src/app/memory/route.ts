import { Hono } from "hono";
import type { AppVariables } from "../../types/index.js";
import { listMemories } from "../../services/memory.service.js";

export const memoryRoute = new Hono<{ Variables: AppVariables }>();

memoryRoute.get("/", async (c) => {
  const memories = await listMemories(c.get("userId"));
  return c.json({ memories });
});
