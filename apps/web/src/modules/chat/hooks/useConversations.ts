import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createConversation,
  deleteConversation,
  listConversations,
  renameConversation,
  type Conversation,
} from '@/src/modules/chat/api/conversations';

import { getConversationDetail } from '@/src/modules/chat/api/conversationDetail';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: listConversations,
    staleTime: 30 * 1000,
  });
}

export function useConversationDetail(id: string | null) {
  return useQuery({
    queryKey: ['conversationDetail', id],
    queryFn: () => getConversationDetail(id!),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: (conversation) => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (prev) => [
        conversation,
        ...(prev ?? []),
      ]);
    },
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameConversation(id, title),
    onSuccess: (updated) => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (prev) =>
        (prev ?? []).map((conversation) =>
          conversation.id === updated.id ? updated : conversation,
        ),
      );
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (prev) =>
        (prev ?? []).filter((conversation) => conversation.id !== id),
      );
    },
  });
}
