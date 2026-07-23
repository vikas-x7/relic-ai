'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiSearch, FiX, FiChevronDown, FiMessageSquare } from 'react-icons/fi';
import { useConversations } from '@/src/modules/chat/hooks/useConversations';
import type { Conversation } from '@/src/modules/chat/api/conversations';

type SearchPanelProps = {
  onClose: () => void;
  onSelectConversation: (id: string) => void;
  onNewChat?: () => void;
};

function formatRelativeDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSeconds) || diffSeconds < 0) return 'Just now';
  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SearchPanel({
  onClose,
  onSelectConversation,
  onNewChat,
}: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Recent'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: conversations = [], isLoading } = useConversations();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const filteredConversations = sortedConversations.filter((conv) => {
    if (!query.trim()) return true;
    const title = conv.title?.toLowerCase() || 'new chat';
    return title.includes(query.trim().toLowerCase());
  });

  const handleSelect = useCallback(
    (id: string) => {
      onSelectConversation(id);
      onClose();
    },
    [onSelectConversation, onClose],
  );

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#141414] font-cabin text-white">
      {/* Header Bar matching Claude 'Chats and tasks' layout */}
      <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
        <h1 className="text-3xl font-medium tracking-tight text-white/90">Chats and tasks</h1>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#1c1c1c] px-3 py-1.5 transition-colors focus-within:border-white/30">
            <FiSearch size={16} className="text-white/40" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
              }}
              placeholder="Search..."
              className="w-40 min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-white/40 sm:w-56"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-white/40 hover:text-white"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-[#1c1c1c] px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span>
                Filter by <strong className="font-medium text-white">{filter}</strong>
              </span>
              <FiChevronDown size={14} className="opacity-60" />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-md border border-white/10 bg-[#202020] p-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setFilter('All');
                    setIsFilterOpen(false);
                  }}
                  className="w-full rounded px-2.5 py-1.5 text-left text-xs text-white/80 hover:bg-white/10 hover:text-white"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilter('Recent');
                    setIsFilterOpen(false);
                  }}
                  className="w-full rounded px-2.5 py-1.5 text-left text-xs text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Recent
                </button>
              </div>
            )}
          </div>

          {/* Select button */}
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-white/15 bg-[#1c1c1c] px-3.5 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Select
          </button>

          {/* New Chat Button */}
          {onNewChat && (
            <button
              type="button"
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="cursor-pointer rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition-colors hover:bg-white/90"
            >
              New
            </button>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Main List Area */}
      <div className="flex-1 overflow-y-auto px-8 py-4 font-light">
        <div className="mx-auto max-w-6xl space-y-1">
          {isLoading && (
            <div className="space-y-3 py-4">
              {[0, 1, 2, 3, 4].map((key) => (
                <div key={key} className="h-12 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          )}

          {!isLoading && filteredConversations.length === 0 && (
            <div className="py-20 text-center text-sm text-white/40">
              {query ? `No chats found matching "${query}"` : 'No conversations yet'}
            </div>
          )}

          {!isLoading &&
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelect(conv.id)}
                className="group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3.5 transition-colors hover:bg-white/5"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <FiMessageSquare
                    size={17}
                    className="shrink-0 text-white/40 transition-colors group-hover:text-white/80"
                  />
                  <span className="truncate text-[14.5px] font-normal text-white/90 transition-colors group-hover:text-white">
                    {conv.title?.trim() || 'New chat'}
                  </span>
                </div>
                <span className="ml-4 shrink-0 text-xs font-light text-white/40">
                  {formatRelativeDate(conv.updatedAt)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
