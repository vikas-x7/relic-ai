'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthGuard from '@/src/modules/auth/guards/AuthGuard';
import { useCreateConversation } from '@/src/modules/chat/hooks/useConversations';

const Chat = dynamic(() => import('@/src/modules/chat/Chat'), { ssr: false });

export default function ChatPage() {
  const router = useRouter();
  const createChat = useCreateConversation();
  const hasCreated = useRef(false);

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;

    createChat.mutate(undefined, {
      onSuccess: (conversation) => {
        router.replace(`/chat/${conversation.id}`);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGuard>
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <span className="text-sm text-white/50">
            {createChat.isPending ? 'Creating new chat...' : 'Loading...'}
          </span>
        </div>
      </div>
    </AuthGuard>
  );
}
