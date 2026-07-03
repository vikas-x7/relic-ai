'use client';

import Sidebar from '@/src/modules/chat/components/Sidebar';
import ChatCanvas from '@/src/modules/chat/components/ChatCanvas';

function Chat() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-black font-cabin text-white">
      <Sidebar />
      <ChatCanvas />
    </div>
  );
}

export default Chat;
