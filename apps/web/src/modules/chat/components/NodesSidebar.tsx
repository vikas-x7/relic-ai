'use client';

import { FiX } from 'react-icons/fi';
import type { ChatMessage, ChatNodeData } from '@/src/modules/chat/types';
import type { Node } from '@xyflow/react';
import { CHAT_NODE_WIDTH } from '@/src/modules/chat/constants';

type NodesSidebarProps = {
  isOpen: boolean;
  nodes: Node<ChatNodeData>[];
  nodeMessages: Record<string, ChatMessage[]>;
  activeNodeId: string;
  onClose: () => void;
  onSelectNode: (nodeId: string, x: number, y: number) => void;
};

export default function NodesSidebar({
  isOpen,
  nodes,
  nodeMessages,
  activeNodeId,
  onClose,
  onSelectNode,
}: NodesSidebarProps) {
  return (
    <div
      className={`absolute top-0 right-0 z-[60] flex h-full w-60 flex-col bg-[#121212] shadow-2xl transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-[12px] text-white">Nodes ({nodes.length})</h2>
        <button
          onClick={onClose}
          className="text-white/60 transition-colors hover:text-white"
        >
          <FiX size={14} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {nodes.map((node, index) => {
          const fullMsg =
            nodeMessages[node.data.customId]?.find((m) => m.role === 'user')
              ?.content ||
            node.data.initialInput ||
            `Node ${index + 1}`;
          const firstUserMsg =
            fullMsg.length > 35
              ? fullMsg.slice(0, 35).trim() + '...'
              : fullMsg;

          return (
            <button
              key={node.id}
              onClick={() =>
                onSelectNode(
                  node.id,
                  node.position.x + CHAT_NODE_WIDTH / 2,
                  node.position.y + 100,
                )
              }
              className={`w-full shrink-0 rounded-[3px] p-1 px-2 text-left transition-all duration-150 ease-out ${
                activeNodeId === node.id
                  ? 'bg-[#252525]'
                  : 'bg-[#151515] hover:bg-[#1f1f1f]'
              }`}
            >
              <span className="block w-full truncate text-[11px] font-medium text-white/90">
                {firstUserMsg}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
