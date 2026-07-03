'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { FiSquare } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';
import { IoMicSharp } from 'react-icons/io5';
import { LiaLinkSolid } from 'react-icons/lia';
import { FiTrash2 } from 'react-icons/fi';
import {
  CHAT_INPUT_MAX_HEIGHT,
  CHAT_TEXT_INTERACTION_CLASS,
} from '@/src/modules/chat/constants';
import ModelSelector from '@/src/modules/chat/components/ModelSelector';

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  placeholder?: string;
  onCollapse?: () => void;
  collapseTitle?: string;
  collapseIcon?: ReactNode;
  onDelete?: () => void;
  canDelete?: boolean;
  onFocus?: () => void;
};

export default function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
  placeholder = 'Ask a follow-up',
  onCollapse,
  collapseTitle = 'Collapse to node view',
  collapseIcon,
  onDelete,
  canDelete,
  onFocus,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = '0px';
    const nextHeight = Math.min(textarea.scrollHeight, CHAT_INPUT_MAX_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > CHAT_INPUT_MAX_HEIGHT ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    if (textareaRef.current) resizeTextarea(textareaRef.current);
  }, [value, resizeTextarea]);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
  };

  const toolButton =
    'flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white';

  return (
    <div className="border-t border-[#1f1f1f] bg-[#121212] px-4 pt-10 pb-5 shadow-lg">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${CHAT_TEXT_INTERACTION_CLASS} w-full resize-none overflow-y-hidden bg-transparent py-1 text-[16px] leading-6 text-gray-200 outline-none placeholder-white/40`}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        onFocus={onFocus}
      />

      <div className="mt-3 flex cursor-pointer items-center justify-between text-white/70">
        <ModelSelector />

        <div className="flex items-center gap-2">
          <DevTooltip content="This feature is under Development phase">
            <button type="button" className={`${toolButton} nodrag nopan`}>
              <IoMicSharp size={18} />
            </button>
          </DevTooltip>

          <DevTooltip content="This feature is under Development phase">
            <button type="button" className={`${toolButton} nodrag nopan`}>
              <LiaLinkSolid size={18} />
            </button>
          </DevTooltip>

          {onCollapse && (
            <button
              onClick={onCollapse}
              className={`${toolButton} nodrag nopan`}
              title={collapseTitle}
            >
              {collapseIcon}
            </button>
          )}

          {canDelete !== false && onDelete && (
            <button
              onClick={onDelete}
              className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] text-white/60 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
              title="Delete node"
            >
              <FiTrash2 size={15} />
            </button>
          )}

          {isStreaming ? (
            <button
              onClick={onStop}
              className="nodrag nopan ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] bg-white/20 text-red-500 transition-all hover:bg-white/80 active:scale-90"
              title="Stop generating"
            >
              <FiSquare size={18} className="fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!value.trim()}
              className="nodrag nopan ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] bg-white text-black/90 transition-all hover:bg-white/30 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white"
            >
              <IoMdArrowUp size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DevTooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <div className="nodrag nopan group relative">
      {children}
      <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[200] -translate-x-1/2 rounded-[5px] border border-white/10 bg-[#1a1a1a] px-2.5 py-1.5 text-[11px] whitespace-nowrap text-white/70 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
      </div>
    </div>
  );
}
