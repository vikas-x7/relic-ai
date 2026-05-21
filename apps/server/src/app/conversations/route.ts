import { Hono } from "hono";
import type { AppVariables } from "../../types/index.js";
import { createConversation, listConversations } from "../../services/conversation.service.js";
import { createConversationSchema, parseJsonBody } from "../../utils/validators.js";

export const conversationsRoute = new Hono<{ Variables: AppVariables }>();

conversationsRoute.get("/", async (c) => {
  const conversations = await listConversations(c.get("userId"));
  return c.json({ conversations });
});

conversationsRoute.post("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, createConversationSchema);
  const conversation = await createConversation(c.get("userId"), input.title);
  return c.json({ conversation }, 201);
});
