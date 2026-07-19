import api from '@/src/lib/api/axios';
import type { Citation } from '@/src/modules/chat/types';

type ChatApiMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type StreamChatParams = {
  nodeId: string;
  messages: ChatApiMessage[];
  signal: AbortSignal;
  onChunk: (content: string) => void;
};

type ConversationDto = {
  id: number;
  title: string | null;
};

type MessagePairResponse = {
  userMessage: { id: number; content: string };
  assistantMessage: { id: number; content: string };
  citations?: Citation[];
};

const conversationIds = new Map<string, number>();

function assertLive(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}

async function ensureConversation(nodeId: string, firstMessage: string): Promise<number> {
  const existing = conversationIds.get(nodeId);

  if (existing) return existing;

  const { data } = await api.post<ConversationDto>('/conversations', {
    title: firstMessage.slice(0, 200),
  });

  conversationIds.set(nodeId, data.id);
  return data.id;
}

async function revealContent(
  content: string,
  signal: AbortSignal,
  onChunk: (accumulated: string) => void,
): Promise<void> {
  const step = Math.max(2, Math.ceil(content.length / 220));

  for (let index = step; index <= content.length; index += step) {
    assertLive(signal);
    onChunk(content.slice(0, index));
    await new Promise((resolve) => setTimeout(resolve, 8));
  }

  assertLive(signal);
  onChunk(content);
}

export async function streamChat({
  nodeId,
  messages,
  signal,
  onChunk,
}: StreamChatParams): Promise<{ content: string; citations: Citation[] }> {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  const content = lastUserMessage?.content.trim();

  if (!content) throw new Error('Message is empty.');

  assertLive(signal);

  let reply: string;
  let citations: Citation[] = [];

  try {
    const conversationId = await ensureConversation(nodeId, content);
    assertLive(signal);

    const { data } = await api.post<MessagePairResponse>(
      `/conversations/${conversationId}/messages`,
      { content },
      { signal },
    );

    reply = data.assistantMessage.content;
    citations = data.citations ?? [];
  } catch (error) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    const responseError = error as {
      response?: { data?: { error?: string } };
      isAxiosError?: boolean;
    };

    if (responseError.isAxiosError) {
      throw new Error(responseError.response?.data?.error || 'AI response failed.');
    }

    throw error instanceof Error ? error : new Error('AI response failed.');
  }

  await revealContent(reply, signal, onChunk);
  return { content: reply, citations };
}
