import { Hono } from "hono";
import type { AppVariables } from "../../../types/index.js";
import { deleteMemory } from "../../../services/memory.service.js";

export const memoryItemRoute = new Hono<{ Variables: AppVariables }>();

memoryItemRoute.delete("/", async (c) => {
  const memoryId = c.req.param("memoryId");

  if (!memoryId) {
    return c.json({ error: "memoryId is required" }, 400);
  }

  const deleted = await deleteMemory(c.get("userId"), memoryId);

  if (!deleted) {
    return c.json({ error: "Memory not found" }, 404);
  }

  return c.json({ ok: true });
});
