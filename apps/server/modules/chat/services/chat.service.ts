import { getPrisma } from 'db';
import { generateReply } from '../../../intelligence/models/model.provider';
import type { MessageRoleValue } from '../types/chat.types';

export class ConversationNotFoundError extends Error {
  constructor() {
    super('Conversation not found');
    this.name = 'ConversationNotFoundError';
  }
}

export class ConversationAccessDeniedError extends Error {
  constructor() {
    super('Access denied');
    this.name = 'ConversationAccessDeniedError';
  }
}

async function requireOwnedConversation(id: number, userId: number) {
  const prisma = getPrisma();
  const conversation = await prisma.conversation.findUnique({ where: { id } });

  if (!conversation) {
    throw new ConversationNotFoundError();
  }
  if (conversation.userId !== userId) {
    throw new ConversationAccessDeniedError();
  }
  return conversation;
}

export async function createConversation(userId: number, title?: string) {
  const prisma = getPrisma();
  return prisma.conversation.create({
    data: { userId, title: title ?? null },
  });
}

export async function getConversations(userId: number) {
  const prisma = getPrisma();
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getConversation(id: number, userId: number) {
  return requireOwnedConversation(id, userId);
}

export async function renameConversation(id: number, userId: number, title: string) {
  await requireOwnedConversation(id, userId);
  const prisma = getPrisma();
  return prisma.conversation.update({ where: { id }, data: { title } });
}

export async function deleteConversation(id: number, userId: number) {
  await requireOwnedConversation(id, userId);
  const prisma = getPrisma();
  await prisma.conversation.delete({ where: { id } });
}

export async function createUserMessageWithReply(
  conversationId: number,
  userId: number,
  content: string,
) {
  await requireOwnedConversation(conversationId, userId);
  const prisma = getPrisma();

  const userMessage = await prisma.message.create({
    data: { conversationId, role: 'USER' satisfies MessageRoleValue, content },
  });

  const reply = await generateReply(content);

  const assistantMessage = await prisma.message.create({
    data: { conversationId, role: 'ASSISTANT' satisfies MessageRoleValue, content: reply },
  });

  return { userMessage, assistantMessage };
}

export async function getMessages(conversationId: number, userId: number) {
  await requireOwnedConversation(conversationId, userId);
  const prisma = getPrisma();
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}
