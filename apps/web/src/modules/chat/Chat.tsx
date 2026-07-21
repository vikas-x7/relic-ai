'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/modules/chat/components/Sidebar';
import ChatCanvas from '@/src/modules/chat/components/ChatCanvas';

type ChatProps = {
  conversationId?: string;
};

function Chat({ conversationId }: ChatProps) {
  const router = useRouter();

  const handleNewChat = useCallback(() => {
    // Simply navigate to /chat — conversation will be created when user sends first message
    router.push('/chat');
  }, [router]);

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
      />
      <ChatCanvas conversationId={conversationId ?? null} />
    </div>
  );
}

export default Chat;
