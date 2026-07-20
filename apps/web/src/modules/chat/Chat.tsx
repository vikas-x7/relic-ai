'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/modules/chat/components/Sidebar';
import ChatCanvas from '@/src/modules/chat/components/ChatCanvas';
import { useCreateConversation } from '@/src/modules/chat/hooks/useConversations';

type ChatProps = {
  conversationId?: string;
};

function Chat({ conversationId }: ChatProps) {
  const router = useRouter();
  const createChat = useCreateConversation();

  const handleNewChat = useCallback(() => {
    createChat.mutate(undefined, {
      onSuccess: (conversation) => {
        router.push(`/chat/${conversation.id}`);
      },
    });
  }, [createChat, router]);

  const handleSelectChat = useCallback(
    (id: string) => {
      router.push(`/chat/${id}`);
    },
    [router],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black font-cabin text-white">
      <Sidebar
        activeConversationId={conversationId ?? null}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isCreatingChat={createChat.isPending}
      />
      <ChatCanvas conversationId={conversationId ?? null} />
    </div>
  );
}

export default Chat;
