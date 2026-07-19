import { getPrisma } from 'db';
import type { AnswerCitation } from '../../../agent/citations/citation.types';
import { saveMessageCitations } from '../../../agent/citations/citation.service';
import { extractMemoriesFromExchange } from '../../../agent/memory/memory.extractor';
import { getRelevantMemories } from '../../../agent/memory/memory.retriever';
import { persistExtractedMemories } from '../../../agent/memory/memory.service';
import { runChatGraph } from '../../../agent/orchestration/chat.graph';
import type { HistoryMessage } from '../../../agent/state/chat.state';
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

async function loadHistory(conversationId: number, limit = 20): Promise<HistoryMessage[]> {
  const prisma = getPrisma();
  const rows = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows
    .reverse()
    .map((row) => ({ role: row.role as HistoryMessage['role'], content: row.content }));
}

export async function createUserMessageWithReply(
  conversationId: number,
  userId: number,
  content: string,
) {
  await requireOwnedConversation(conversationId, userId);
  const prisma = getPrisma();

  const history = await loadHistory(conversationId);

  const userMessage = await prisma.message.create({
    data: { conversationId, role: 'USER' satisfies MessageRoleValue, content },
  });

  const memories = await getRelevantMemories(userId);

  const result = await runChatGraph({
    conversationId,
    userId,
    history,
    currentQuery: content,
    memories,
  });

  const assistantMessage = await prisma.message.create({
    data: {
      conversationId,
      role: 'ASSISTANT' satisfies MessageRoleValue,
      content: result.answer,
      webUsed: result.webUsed,
    },
  });

  let savedCitations: AnswerCitation[] = [];
  if (result.webUsed && result.citations.length) {
    await saveMessageCitations(assistantMessage.id, result.citations);
    savedCitations = result.citations;
  }

  try {
    const extraction = await extractMemoriesFromExchange(content, result.answer);
    if (extraction.shouldRemember && extraction.memories.length) {
      await persistExtractedMemories(userId, extraction.memories);
    }
  } catch (error) {
    console.error('[memory] pipeline failed:', error);
  }

  return { userMessage, assistantMessage, citations: savedCitations };
}

export async function getMessages(conversationId: number, userId: number) {
  await requireOwnedConversation(conversationId, userId);
  const prisma = getPrisma();
  const rows = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: {
      citations: {
        orderBy: { citationIndex: 'asc' },
        include: { source: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    conversationId: row.conversationId,
    role: row.role,
    content: row.content,
    webUsed: row.webUsed,
    model: row.model,
    inputTokens: row.inputTokens,
    outputTokens: row.outputTokens,
    createdAt: row.createdAt,
    citations: row.citations.map((c) => ({
      citationIndex: c.citationIndex,
      url: c.source.url,
      title: c.source.title,
    })),
  }));
}
