import { Hono } from "hono";
import type { AppVariables } from "../../../types/index.js";
import {
  deleteConversation,
  getConversation,
  renameConversation,
} from "../../../services/conversation.service.js";
import { parseJsonBody, renameConversationSchema } from "../../../utils/validators.js";

export const conversationRoute = new Hono<{ Variables: AppVariables }>();

conversationRoute.get("/", async (c) => {
  const conversationId = c.req.param("conversationId");

  if (!conversationId) {
    return c.json({ error: "conversationId is required" }, 400);
  }

  const conversation = await getConversation(c.get("userId"), conversationId);

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json({ conversation });
});

conversationRoute.patch("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, renameConversationSchema);
  const conversationId = c.req.param("conversationId");

  if (!conversationId) {
    return c.json({ error: "conversationId is required" }, 400);
  }

  const conversation = await renameConversation(c.get("userId"), conversationId, input.title);

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json({ conversation });
});

conversationRoute.delete("/", async (c) => {
  const conversationId = c.req.param("conversationId");

  if (!conversationId) {
    return c.json({ error: "conversationId is required" }, 400);
  }

  const deleted = await deleteConversation(c.get("userId"), conversationId);

  if (!deleted) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json({ ok: true });
});
