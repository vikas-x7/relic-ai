import { getPrisma } from 'db';
import { AppError } from '../../../errors/AppError';
import { logger, redactError } from '../../../lib/logger';
import type { AnswerCitation } from '../../../agent/citations/citation.types';
import { saveMessageCitations } from '../../../agent/citations/citation.service';
import { extractMemoriesFromExchange } from '../../../agent/memory/memory.extractor';
import { getRelevantMemories } from '../../../agent/memory/memory.retriever';
import { persistExtractedMemories } from '../../../agent/memory/memory.service';
import { runChatGraph } from '../../../agent/orchestration/chat.graph';
import type { HistoryMessage } from '../../../agent/state/chat.state';
import type { MessageRoleValue } from '../types/chat.types';

export class ConversationNotFoundError extends AppError {
  constructor() {
    super({
      message: 'Conversation not found',
      statusCode: 404,
      errorCode: 'CONVERSATION_NOT_FOUND',
    });
    this.name = 'ConversationNotFoundError';
  }
}

export class ConversationAccessDeniedError extends AppError {
  constructor() {
    super({
      message: 'Access denied',
      statusCode: 403,
      errorCode: 'CONVERSATION_ACCESS_DENIED',
    });
    this.name = 'ConversationAccessDeniedError';
  }
}

async function requireOwnedConversation(id: string, userId: number) {
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

export async function getConversation(id: string, userId: number) {
  return requireOwnedConversation(id, userId);
}

export async function getConversationWithMessages(id: string, userId: number) {
  await requireOwnedConversation(id, userId);
  const prisma = getPrisma();
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          citations: {
            orderBy: { citationIndex: 'asc' },
            include: { source: true },
          },
        },
      },
    },
  });
}

export async function renameConversation(id: string, userId: number, title: string) {
  await requireOwnedConversation(id, userId);
  const prisma = getPrisma();
  return prisma.conversation.update({ where: { id }, data: { title } });
}

export async function deleteConversation(id: string, userId: number) {
  await requireOwnedConversation(id, userId);
  const prisma = getPrisma();
  await prisma.conversation.delete({ where: { id } });
}

export async function saveCanvas(id: string, userId: number, canvas: Record<string, unknown>) {
  await requireOwnedConversation(id, userId);
  const prisma = getPrisma();
  return prisma.conversation.update({ where: { id }, data: { canvas: canvas as never } });
}

async function loadHistory(conversationId: string, limit = 20): Promise<HistoryMessage[]> {
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
  conversationId: string,
  userId: number,
  content: string,
  nodeId: string = 'root',
) {
  await requireOwnedConversation(conversationId, userId);
  const prisma = getPrisma();

  const history = await loadHistory(conversationId);

  const userMessage = await prisma.message.create({
    data: { conversationId, nodeId, role: 'USER' satisfies MessageRoleValue, content },
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
      nodeId,
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
    logger.error({ err: redactError(error) }, 'Memory pipeline failed');
  }

  return { userMessage, assistantMessage, citations: savedCitations };
}

export type SearchResultConversation = {
  id: string;
  title: string | null;
  updatedAt: Date;
  messages: Array<{
    id: number;
    role: string;
    content: string;
    nodeId: string;
    createdAt: Date;
  }>;
};

export async function searchConversations(
  userId: number,
  query: string,
): Promise<SearchResultConversation[]> {
  const prisma = getPrisma();

  const [messages, titleConvs] = await Promise.all([
    prisma.message.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' },
        conversation: { userId },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        role: true,
        content: true,
        nodeId: true,
        createdAt: true,
        conversation: { select: { id: true, title: true, updatedAt: true } },
      },
    }),
    prisma.conversation.findMany({
      where: { userId, title: { contains: query, mode: 'insensitive' } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
  ]);

  const byConversation = new Map<string, SearchResultConversation>();
  const ensure = (conv: { id: string; title: string | null; updatedAt: Date }) => {
    let entry = byConversation.get(conv.id);
    if (!entry) {
      entry = { id: conv.id, title: conv.title, updatedAt: conv.updatedAt, messages: [] };
      byConversation.set(conv.id, entry);
    }
    return entry;
  };

  for (const m of messages) {
    ensure(m.conversation).messages.push({
      id: m.id,
      role: m.role,
      content: m.content,
      nodeId: m.nodeId,
      createdAt: m.createdAt,
    });
  }
  for (const c of titleConvs) {
    ensure(c);
  }

  return [...byConversation.values()].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getMessages(conversationId: string, userId: number) {
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
    nodeId: row.nodeId,
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
