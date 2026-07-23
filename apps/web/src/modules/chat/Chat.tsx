'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/modules/chat/components/Sidebar';
import ChatCanvas from '@/src/modules/chat/components/ChatCanvas';
import SearchPanel from '@/src/modules/chat/components/SearchPanel';

type ChatProps = {
  conversationId?: string;
};

function Chat({ conversationId }: ChatProps) {
  const router = useRouter();
  const [activeConvId, setActiveConvId] = useState<string | null>(conversationId ?? null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setActiveConvId(conversationId ?? null);
  }, [conversationId]);

  const handleNewChat = useCallback(() => {
    setActiveConvId(null);
    setIsSearchOpen(false);
    router.push('/chat');
  }, [router]);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveConvId(id);
      setIsSearchOpen(false);
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
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <div className="relative flex-1 h-screen overflow-hidden">
        <ChatCanvas
          conversationId={activeConvId}
          onConversationCreated={handleConversationCreated}
        />
        {isSearchOpen && (
          <SearchPanel
            onClose={() => setIsSearchOpen(false)}
            onSelectConversation={handleSelectChat}
            onNewChat={handleNewChat}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
