'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/modules/chat/components/Sidebar';
import ChatCanvas from '@/src/modules/chat/components/ChatCanvas';

type ChatProps = {
  conversationId?: string;
};

function Chat({ conversationId }: ChatProps) {
  const router = useRouter();
  const [activeConvId, setActiveConvId] = useState<string | null>(conversationId ?? null);

  useEffect(() => {
    setActiveConvId(conversationId ?? null);
  }, [conversationId]);

  const handleNewChat = useCallback(() => {
    setActiveConvId(null);
    router.push('/chat');
  }, [router]);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveConvId(id);
      router.push(`/chat/${id}`);
    },
    [router],
  );

  const handleConversationCreated = useCallback((id: string) => {
    setActiveConvId(id);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black font-cabin text-white">
      <Sidebar
        activeConversationId={activeConvId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <ChatCanvas conversationId={activeConvId} onConversationCreated={handleConversationCreated} />
    </div>
  );
}

export default Chat;
