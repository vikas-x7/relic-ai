import { Role } from "@prisma/client";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { getAnthropicClient } from "../lib/anthropic.js";
import { countTokens } from "../lib/tokenCounter.js";
import { getConversation } from "./conversation.service.js";
import { buildConversationHistory, saveMessage } from "./message.service.js";
import { searchWeb } from "./search.service.js";

export async function sendChatMessage(userId: string, conversationId: string, message: string, useSearch = false) {
  const conversation = await getConversation(userId, conversationId);

  if (!conversation) {
    return null;
  }

  const searchResults = useSearch ? await searchWeb(message) : [];
  const history = await buildConversationHistory(userId, conversationId);
  const context =
    searchResults.length > 0
      ? `Use these web results when helpful:\n${searchResults.map((result) => `${result.title}: ${result.content} (${result.url})`).join("\n")}`
      : undefined;

  await saveMessage(conversationId, {
    role: Role.user,
    content: message,
    tokenCount: countTokens(message),
  });

  const messages: MessageParam[] = [
    ...history
      .filter((item) => item.role !== Role.system)
      .map((item): MessageParam => ({
        role: item.role === Role.assistant ? "assistant" : "user",
        content: item.content,
      })),
    { role: "user", content: message },
  ];

  const response = await getAnthropicClient().messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
    max_tokens: 1024,
    system: context,
    messages,
  });

  const assistantText = response.content
    .map((block) => ("text" in block ? block.text : ""))
    .join("")
    .trim();

  const assistantMessage = await saveMessage(conversationId, {
    role: Role.assistant,
    content: assistantText,
    tokenCount: countTokens(assistantText),
    metadata: searchResults.length > 0 ? { searchResults } : undefined,
  });

  return assistantMessage;
}
