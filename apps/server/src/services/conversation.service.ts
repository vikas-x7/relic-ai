import { prisma } from "../lib/prisma.js";

export function createConversation(userId: string, title = "New chat") {
  return prisma.conversation.create({
    data: { userId, title },
  });
}

export function listConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getConversation(userId: string, conversationId: string) {
  return prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export function renameConversation(userId: string, conversationId: string, title: string) {
  return prisma.conversation.updateManyAndReturn({
    where: { id: conversationId, userId },
    data: { title },
  }).then((conversations) => conversations[0] ?? null);
}

export function deleteConversation(userId: string, conversationId: string) {
  return prisma.conversation.deleteMany({
    where: { id: conversationId, userId },
  }).then((result) => result.count > 0);
}
