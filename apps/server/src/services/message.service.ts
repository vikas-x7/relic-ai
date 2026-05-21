import type { Prisma } from "@prisma/client";
import type { MessageInput } from "../types/index.js";
import { prisma } from "../lib/prisma.js";

export function listMessages(userId: string, conversationId: string) {
  return prisma.message.findMany({
    where: {
      conversation: {
        id: conversationId,
        userId,
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function saveMessage(conversationId: string, message: MessageInput) {
  return prisma.message.create({
    data: {
      conversationId,
      role: message.role,
      content: message.content,
      tokenCount: message.tokenCount,
      metadata: message.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function buildConversationHistory(userId: string, conversationId: string) {
  const messages = await listMessages(userId, conversationId);

  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}
