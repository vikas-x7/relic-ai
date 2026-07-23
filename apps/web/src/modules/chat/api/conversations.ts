import api from '@/src/lib/api/axios';

export type Conversation = {
  id: string;
  userId: number;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SearchResultConversation = {
  id: string;
  title: string | null;
  updatedAt: string;
  messages: Array<{
    id: number;
    role: string;
    content: string;
    nodeId: string;
    createdAt: string;
  }>;
};

export async function searchConversations(q: string): Promise<SearchResultConversation[]> {
  const { data } = await api.get<SearchResultConversation[]>('/conversations/search', {
    params: { q },
  });
  return data;
}

export async function listConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>('/conversations');
  return data;
}

export async function createConversation(title?: string): Promise<Conversation> {
  const { data } = await api.post<Conversation>('/conversations', title ? { title } : {});
  return data;
}

export async function renameConversation(id: string, title: string): Promise<Conversation> {
  const { data } = await api.patch<Conversation>(`/conversations/${id}`, { title });
  return data;
}

export async function deleteConversation(id: string): Promise<void> {
  await api.delete(`/conversations/${id}`);
}

type PersistedCanvas = {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data?: { customId: string; initialInput?: string };
  }>;
  edges: Array<{
    id: string;
    source: string;
    sourceHandle?: string | null;
    target: string;
    targetHandle?: string | null;
    type?: string;
    animated?: boolean;
  }>;
};

export async function saveCanvasApi(id: string, canvas: PersistedCanvas): Promise<void> {
  await api.patch(`/conversations/${id}/canvas`, { canvas });
}
