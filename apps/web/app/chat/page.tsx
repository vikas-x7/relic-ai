'use client';

import dynamic from 'next/dynamic';

const Chat = dynamic(() => import('@/src/modules/chat/Chat'), { ssr: false });

export default function ChatPage() {
  return <Chat />;
}
