import { Hono } from "hono";
import type { AppVariables } from "../../types/index.js";
import { searchWeb } from "../../services/search.service.js";
import { parseJsonBody, searchSchema } from "../../utils/validators.js";

export const searchRoute = new Hono<{ Variables: AppVariables }>();

searchRoute.post("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, searchSchema);
  const results = await searchWeb(input.query);

  return c.json({ results });
});
