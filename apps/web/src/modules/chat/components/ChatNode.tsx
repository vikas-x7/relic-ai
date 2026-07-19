'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { CHAT_NODE_HANDLE_IDS, CHAT_TEXT_INTERACTION_CLASS } from '@/src/modules/chat/constants';
import type { ChatNodeData } from '@/src/modules/chat/types';
import ChatComposer from '@/src/modules/chat/components/ChatComposer';
import MessageContent from '@/src/modules/chat/components/MessageContent';
import MessageActions from '@/src/modules/chat/components/MessageActions';
import StreamingDots from '@/src/modules/chat/components/StreamingDots';
import NodeExamples from '@/src/modules/chat/components/NodeExamples';

const baseHandleStyle = {
  width: 17,
  height: 17,
  borderRadius: '50%',
  border: '4px solid #d6d6d6',
  zIndex: 10,
} as const;

export default function ChatNode({ data }: NodeProps<Node<ChatNodeData>>) {
  const {
    customId,
    initialInput,
    messages = [],
    isStreaming = false,
    onInteract,
    onResponseHeightChange,
    onSend,
    onStop,
    onExpand,
    onFocusNode,
    onRequestDelete,
    onTextSelection,
    canDelete,
  } = data;

  const [input, setInput] = useState(() => initialInput ?? '');
  const responseSectionRef = useRef<HTMLDivElement>(null);
  const previousResponseHeightRef = useRef(0);

  useLayoutEffect(() => {
    const nextHeight = responseSectionRef.current?.getBoundingClientRect().height ?? 0;
    const delta = nextHeight - previousResponseHeightRef.current;

    if (delta) {
      previousResponseHeightRef.current = nextHeight;
      onResponseHeightChange?.(customId, delta);
    }
  }, [customId, onResponseHeightChange, messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !onSend) return;
    onSend(customId, text);
    setInput('');
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selection || !selectedText || selection.rangeCount === 0) return;

    onTextSelection?.(customId, selectedText, selection.getRangeAt(0).getBoundingClientRect());
  };

  const handleChange = (nextValue: string) => {
    if (!input.length && nextValue.length) onInteract?.();
    setInput(nextValue);
  };

  const handleRetry = (index: number) => {
    const prevUser = messages
      .slice(0, index)
      .reverse()
      .find((message) => message.role === 'user');
    if (prevUser) onSend?.(customId, prevUser.content);
  };

  return (
    <div className="group relative w-[750px] rounded-[8px] border border-[#303030] bg-[#121212] shadow-xl transition-all">
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0"
        style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
      />
      <div className="flex items-center justify-between border-b border-[#1f1f1f] p-3 py-4" />

      {messages.length > 0 && (
        <div ref={responseSectionRef} className="space-y-3 px-4 py-3">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
              className={`${CHAT_TEXT_INTERACTION_CLASS} wrap-anywhere rounded-[5px] px-4 py-3 text-[18px] leading-7 text-gray-200 ${
                msg.role === 'user' ? 'ml-8 bg-[#202020]' : 'mr-8'
              }`}
            >
              {msg.status === 'pending' && !msg.content ? (
                <StreamingDots />
              ) : (
                <>
                  <MessageContent
                    content={msg.content}
                    isUser={msg.role === 'user'}
                    citations={msg.citations}
                  />
                  {msg.status === 'pending' && (
                    <span className="stream-cursor" aria-hidden="true" />
                  )}
                  {msg.role === 'assistant' && msg.status !== 'pending' && msg.content && (
                    <MessageActions content={msg.content} onRetry={() => handleRetry(index)} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ChatComposer
        value={input}
        onChange={handleChange}
        onSend={handleSend}
        onStop={() => onStop?.(customId)}
        isStreaming={isStreaming}
        onCollapse={() => onExpand?.(customId)}
        collapseTitle="Open fullscreen chat"
        collapseIcon={<BsArrowsFullscreen size={14} />}
        onDelete={() => onRequestDelete?.(customId)}
        canDelete={canDelete !== false}
        onFocus={() => onFocusNode?.(customId)}
      />

      <Handle
        type="source"
        id={CHAT_NODE_HANDLE_IDS.right}
        position={Position.Right}
        className="scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
        style={{ ...baseHandleStyle, right: 25, top: 20 }}
      />
      <Handle
        type="source"
        id={CHAT_NODE_HANDLE_IDS.left}
        position={Position.Left}
        className="scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
        style={{ ...baseHandleStyle, left: 25, top: 20 }}
      />

      {!messages.length && (
        <NodeExamples
          onSelect={(prompt) => {
            onInteract?.();
            setInput(prompt);
          }}
        />
      )}
    </div>
  );
}
