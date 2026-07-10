'use client';

import dynamic from 'next/dynamic';
import AuthGuard from '@/src/modules/auth/guards/AuthGuard';

const Chat = dynamic(() => import('@/src/modules/chat/Chat'), { ssr: false });

export default function ChatPage() {
  return (
    <AuthGuard>
      <Chat />
    </AuthGuard>
  );
}
