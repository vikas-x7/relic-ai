'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthGuard from '@/src/modules/auth/guards/AuthGuard';

const Chat = dynamic(() => import('@/src/modules/chat/Chat'), { ssr: false });

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return (
    <AuthGuard>
      <Chat conversationId={conversationId} />
    </AuthGuard>
  );
}
