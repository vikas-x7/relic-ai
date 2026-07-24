'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/modules/chat/components/Sidebar';
import ChatCanvas from '@/src/modules/chat/components/ChatCanvas';
import SearchPanel from '@/src/modules/chat/components/SearchPanel';
import SettingsPanel from '@/src/modules/chat/components/SettingsPanel';

type ChatProps = {
  conversationId?: string;
};

function Chat({ conversationId }: ChatProps) {
  const router = useRouter();
  const [activeConvId, setActiveConvId] = useState<string | null>(conversationId ?? null);
  const [prevConversationId, setPrevConversationId] = useState<string | undefined>(conversationId);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (prevConversationId !== conversationId) {
    setPrevConversationId(conversationId);
    setActiveConvId(conversationId ?? null);
  }

  const handleNewChat = useCallback(() => {
    setActiveConvId(null);
    setIsSearchOpen(false);
    setIsSettingsOpen(false);
    router.push('/chat');
  }, [router]);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveConvId(id);
      setIsSearchOpen(false);
      setIsSettingsOpen(false);
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
        onOpenSearch={() => {
          setIsSettingsOpen(false);
          setIsSearchOpen(true);
        }}
        onOpenSettings={() => {
          setIsSearchOpen(false);
          setIsSettingsOpen(true);
        }}
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
        {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
      </div>
    </div>
  );
}

export default Chat;
