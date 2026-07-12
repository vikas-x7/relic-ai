'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BsArrowsAngleContract } from 'react-icons/bs';
import type { ChatMessage } from '@/src/modules/chat/types';
import ChatComposer from '@/src/modules/chat/components/ChatComposer';
import MessageContent from '@/src/modules/chat/components/MessageContent';
import MessageActions from '@/src/modules/chat/components/MessageActions';
import StreamingDots from '@/src/modules/chat/components/StreamingDots';

type FullscreenChatProps = {
  nodeId: string;
  messages: ChatMessage[];
  isStreaming?: boolean;
  onSend: (nodeId: string, message: string) => void;
  onStop: (nodeId: string) => void;
  onClose: () => void;
  onRequestDelete?: (nodeId: string) => void;
  canDelete?: boolean;
  onTextSelection?: (nodeId: string, selectedText: string, selectionRect: DOMRect) => void;
};

export default function FullscreenChat({
  nodeId,
  messages,
  isStreaming = false,
  onSend,
  onStop,
  onClose,
  onRequestDelete,
  canDelete,
  onTextSelection,
}: FullscreenChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(nodeId, text);
    setInput('');
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selection || !selectedText || selection.rangeCount === 0) return;

    onTextSelection?.(nodeId, selectedText, selection.getRangeAt(0).getBoundingClientRect());
  };

  const handleRetry = (index: number) => {
    const prevUser = messages
      .slice(0, index)
      .reverse()
      .find((message) => message.role === 'user');
    if (prevUser) onSend(nodeId, prevUser.content);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[768px] px-4 py-6">
          {messages.map((msg, index) =>
            msg.role === 'user' ? (
              <div key={msg.id || index} className="mb-6 flex justify-end">
                <div
                  onMouseUp={handleTextSelection}
                  onTouchEnd={handleTextSelection}
                  className="max-w-[85%] rounded-[5px] rounded-br-sm bg-[#202020] px-4 py-2 text-[15px] leading-7 text-gray-200"
                >
                  <MessageContent content={msg.content} isUser />
                </div>
              </div>
            ) : (
              <div key={msg.id || index} className="mb-6 max-w-[85%]">
                <div
                  onMouseUp={handleTextSelection}
                  onTouchEnd={handleTextSelection}
                  className="wrap-anywhere rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] leading-7 text-gray-300"
                >
                  {msg.status === 'pending' && !msg.content ? (
                    <StreamingDots />
                  ) : (
                    <MessageContent content={msg.content} />
                  )}
                </div>

                {msg.status !== 'pending' && msg.content && (
                  <div className="mt-2 flex items-center pl-2 text-white/40">
                    <MessageActions content={msg.content} onRetry={() => handleRetry(index)} />
                  </div>
                )}
              </div>
            ),
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 bg-black px-4 py-4">
        <div className="mx-auto w-full max-w-[768px] rounded-[9px] bg-[#121212] px-4 py-3 shadow-lg">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={() => onStop(nodeId)}
            isStreaming={isStreaming}
            onCollapse={onClose}
            collapseTitle="Collapse to node view"
            collapseIcon={<BsArrowsAngleContract size={14} />}
            onDelete={() => onRequestDelete?.(nodeId)}
            canDelete={canDelete !== false}
          />
        </div>
      </div>
    </div>
  );
}
