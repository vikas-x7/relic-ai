import api from '@/src/lib/api/axios';
import type { Conversation } from '@/src/modules/chat/api/conversations';

export type ConversationDetail = Conversation & {
  canvas: unknown;
  messages: Array<{
    id: number;
    conversationId: string;
    nodeId: string;
    role: string;
    content: string;
    webUsed: boolean;
    citations: Array<{
      citationIndex: number;
      url: string;
      title: string;
    }>;
  }>;
};

export async function getConversationDetail(id: string): Promise<ConversationDetail> {
  const { data } = await api.get<ConversationDetail>(`/conversations/${id}/detail`);
  return data;
}
