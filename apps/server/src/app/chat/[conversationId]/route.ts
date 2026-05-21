import { Hono } from "hono";
import type { AppVariables } from "../../../types/index.js";
import { sendChatMessage } from "../../../services/chat.service.js";
import { chatSchema, parseJsonBody } from "../../../utils/validators.js";

export const chatRoute = new Hono<{ Variables: AppVariables }>();

chatRoute.post("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, chatSchema);
  const conversationId = c.req.param("conversationId");

  if (!conversationId) {
    return c.json({ error: "conversationId is required" }, 400);
  }

  const message = await sendChatMessage(c.get("userId"), conversationId, input.message, input.useSearch);

  if (!message) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json({ message });
});
