import { Hono } from "hono";
import type { AppVariables } from "../../../../types/index.js";
import { listMessages } from "../../../../services/message.service.js";

export const conversationMessagesRoute = new Hono<{ Variables: AppVariables }>();

conversationMessagesRoute.get("/", async (c) => {
  const conversationId = c.req.param("conversationId");

  if (!conversationId) {
    return c.json({ error: "conversationId is required" }, 400);
  }

  const messages = await listMessages(c.get("userId"), conversationId);
  return c.json({ messages });
});
