'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthGuard from '@/src/modules/auth/guards/AuthGuard';
import { useCreateConversation } from '@/src/modules/chat/hooks/useConversations';

const Chat = dynamic(() => import('@/src/modules/chat/Chat'), { ssr: false });

export default function ChatPage() {
  const router = useRouter();
  const createChat = useCreateConversation();
  const hasCreated = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;

    createChat.mutate(undefined, {
      onSuccess: (conversation) => {
        router.replace(`/chat/${conversation.id}`);
      },
      onError: (err: any) => {
        console.error('Failed to create conversation:', err);
        setError(err?.message || 'Failed to create chat. Please try again.');
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGuard>
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          {error ? (
            <>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  hasCreated.current = false;
                  createChat.mutate(undefined, {
                    onSuccess: (c) => router.replace(`/chat/${c.id}`),
                    onError: (e: any) => setError(e?.message || 'Failed.'),
                  });
                }}
                className="mt-2 rounded-[6px] bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span className="text-sm text-white/50">
                {createChat.isPending ? 'Creating new chat...' : 'Loading...'}
              </span>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
