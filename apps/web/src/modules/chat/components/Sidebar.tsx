'use client';

import { useEffect, useState } from 'react';
import {
  FiEdit2,
  FiMoreHorizontal,
  FiSearch,
  FiSidebar,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import { IoCreateOutline } from 'react-icons/io5';

interface Chat {
  id: string;
  title: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SAMPLE_CHATS: Chat[] = [
  {
    id: 'sample-1',
    title: 'How to train a model',
    isPinned: true,
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-12'),
  },
  {
    id: 'sample-2',
    title: 'React Flow integration',
    isPinned: false,
    createdAt: new Date('2026-08-09'),
    updatedAt: new Date('2026-08-11'),
  },
];

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>(SAMPLE_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Chat | null>(null);
  const [hoverStyle, setHoverStyle] = useState({ top: 0, height: 0, opacity: 0 });

  useEffect(() => {
    if (!menuChatId) return;
    const handler = () => setMenuChatId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuChatId]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setHoverStyle({ top: el.offsetTop, height: el.offsetHeight, opacity: 1 });
  };

  const handleMouseLeaveList = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const startRename = (chat: Chat) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
    setMenuChatId(null);
  };

  const submitRename = (chatId: string) => {
    const title = renameValue.trim();
    setRenamingChatId(null);
    if (!title) return;
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title, updatedAt: new Date() } : c)),
    );
  };

  const handleTogglePin = (chat: Chat) => {
    setMenuChatId(null);
    setChats((prev) =>
      prev
        .map((c) =>
          c.id === chat.id ? { ...c, isPinned: !c.isPinned, updatedAt: new Date() } : c,
        )
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }),
    );
  };

  const confirmDeleteChat = () => {
    if (!deleteTarget) return;
    setChats((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    if (activeChatId === deleteTarget.id) setActiveChatId(null);
    setDeleteTarget(null);
  };

  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <aside
        className={`relative flex flex-col border-white/10 bg-black transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[260px] border-r' : 'w-0 overflow-hidden border-r-0'
        } ${className}`}
      >
        <div className="flex h-full w-[260px] flex-col">
          <div className="flex items-center justify-between pr-3">
            <div className="flex items-center text-white">
              <img src="/images/logo.png" alt="" className="w-11" />
              <h1 className="mt-0.5 -ml-1 text-[19px] font-medium tracking-tight">Relic AI</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              title="Close Sidebar"
            >
              <FiSidebar size={18} />
            </button>
          </div>

          <div className="shrink-0 px-2 pt-4">
            <button
              onClick={handleNewChat}
              className="flex w-full cursor-pointer items-center gap-2 rounded-[3px] bg-white/5 px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]"
            >
              <IoCreateOutline size={18} className="mb-0.5 opacity-80" />
              New chat
            </button>
            <button className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-[3px] px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e] hover:text-white">
              <FiSearch size={17} className="opacity-80" />
              Search
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
            <div className="space-y">
              <p className="sticky top-0 z-10 mb-2 bg-black px-3 py-1 text-[13px] font-medium text-white/60">
                chats
              </p>
              {sortedChats.length === 0 && (
                <p className="px-3 py-2 text-sm text-white/35">No chats yet</p>
              )}

              <div className="relative" onMouseLeave={handleMouseLeaveList}>
                <div
                  className="absolute left-0 right-0 z-0 rounded-[2px] bg-[#1e1e1e] transition-all duration-300 ease-out"
                  style={{ top: hoverStyle.top, height: hoverStyle.height, opacity: hoverStyle.opacity }}
                />

                {sortedChats.map((chat) => {
                  const isActive = activeChatId === chat.id;
                  const isRenaming = renamingChatId === chat.id;
                  const isMenuOpen = menuChatId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onMouseEnter={handleMouseEnter}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative z-10 flex w-full cursor-pointer items-center rounded-[2px] px-2 py-1 text-sm transition-colors ${
                        isActive ? 'bg-[#242424] text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {isRenaming ? (
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => submitRename(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); submitRename(chat.id); }
                            if (e.key === 'Escape') setRenamingChatId(null);
                          }}
                          autoFocus
                          className="min-w-0 flex-1 px-2 py-1 text-sm text-white outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveChatId(chat.id)}
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 px-1 py-1 text-left"
                        >
                          {chat.isPinned && <FiStar size={12} className="shrink-0 fill-white/50 text-white/50" />}
                          <span className="truncate">{chat.title}</span>
                        </button>
                      )}

                      {!isRenaming && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMenuChatId(isMenuOpen ? null : chat.id); }}
                          className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-white/40 transition-colors hover:bg-white/10 hover:text-white ${
                            isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          title="Chat options"
                        >
                          <FiMoreHorizontal size={16} />
                        </button>
                      )}

                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-8 right-1 z-30 w-36 rounded-[7px] bg-[#202020] p-1 shadow-xl shadow-black/50"
                        >
                          <button
                            type="button"
                            onClick={() => startRename(chat)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white"
                          >
                            <FiEdit2 size={14} />
                            Rename
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePin(chat)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white"
                          >
                            <FiStar size={14} />
                            {chat.isPinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setMenuChatId(null); setDeleteTarget(chat); }}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-sm font-semibold text-white uppercase">
                U
              </div>
              <div className="flex flex-col">
                <span className="max-w-[120px] truncate text-[13px] font-medium text-white">User</span>
                <span className="max-w-[120px] truncate text-[11px] text-white/40">user@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-6 left-6 z-[100] rounded-md border border-[#303030] bg-[#1a1a1a] p-2 text-white/50 shadow-md transition-colors hover:text-white"
          title="Open Sidebar"
        >
          <FiSidebar size={20} />
        </button>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-[10px] bg-[#151515] p-4 text-white shadow-2xl shadow-black/60">
            <h2 className="text-[15px] font-medium">Delete chat?</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              This will permanently delete &quot;{deleteTarget.title}&quot;.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-[6px] px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteChat}
                className="rounded-[6px] bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
