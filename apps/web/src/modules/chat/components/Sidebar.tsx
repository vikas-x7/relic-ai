'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BsPinAngle } from 'react-icons/bs';
import {
  FiEdit2,
  FiEyeOff,
  FiFolder,
  FiFolderPlus,
  FiMoreHorizontal,
  FiSearch,
  FiSettings,
  FiSidebar,
  FiTrash2,
} from 'react-icons/fi';
import { IoCreateOutline } from 'react-icons/io5';
import { useUser } from '@/src/modules/auth/hooks/useAuth';
import type { Conversation } from '@/src/modules/chat/api/conversations';
import {
  useConversations,
  useDeleteConversation,
  useRenameConversation,
} from '@/src/modules/chat/hooks/useConversations';
import { GoDot } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';

type SidebarProps = {
  className?: string;
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onOpenSearch: () => void;
  onOpenSettings?: () => void;
};

function conversationLabel(conversation: Conversation): string {
  return conversation.title?.trim() || 'New chat';
}

export default function Sidebar({
  className,
  activeConversationId,
  onNewChat,
  onSelectChat,
  onOpenSearch,
  onOpenSettings,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [hoverStyle, setHoverStyle] = useState({ top: 0, height: 0, opacity: 0 });
  const [imageError, setImageError] = useState(false);

  const { data: user } = useUser();
  const { data: conversations = [], isLoading, isError, refetch } = useConversations();
  const renameChat = useRenameConversation();
  const deleteChat = useDeleteConversation();

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

  const startRename = (chat: Conversation) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title?.trim() || '');
    setMenuChatId(null);
  };

  const submitRename = (chatId: string) => {
    const title = renameValue.trim();
    setRenamingChatId(null);
    if (!title) return;
    renameChat.mutate({ id: chatId, title });
  };

  const confirmDeleteChat = () => {
    if (!deleteTarget) return;
    const wasActive = activeConversationId === deleteTarget.id;
    deleteChat.mutate(deleteTarget.id);
    setDeleteTarget(null);
    if (wasActive) {
      onNewChat();
    }
  };

  const sortedChats = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const displayName = user?.user?.name?.trim() || 'User';
  const displayEmail = user?.user?.email ?? '';
  const avatar = user?.user?.avatar;
  const avatarInitial = (displayEmail.trim().charAt(0) || displayName.charAt(0)).toUpperCase();

  return (
    <>
      <aside
        className={`relative z-50 flex flex-col border-white/10 bg-[#0F0F0F] transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[270px] border-r' : 'w-0 overflow-hidden border-r-0'
        } ${className}`}
      >
        <div className="flex h-full w-[270px] flex-col">
          <div className="flex items-center justify-between  ">
            <div className="flex items-center text-white">
              <div className="relative h-11 w-11 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt=""
                  fill
                  sizes="44px"
                  priority
                  className="object-contain"
                />
              </div>
              <h1 className="mt-0.5 -ml-2 text-[19px] font-medium tracking-tight">Relic AI</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-[5px] p-1 text-white/40 transition-colors hover:bg-[#0099FF] cursor-pointer hover:text-white mr-2"
              title="Close Sidebar"
            >
              <FiSidebar size={18} />
            </button>
          </div>

          <div className="shrink-0 px-2 pt-4">
            <button
              onClick={onNewChat}
              className="flex w-full cursor-pointer items-center gap-2 rounded-[5px]  px-2 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]"
            >
              <IoCreateOutline size={18} className="mb-0.5 opacity-80 " />
              New chat
            </button>
            <button
              onClick={onOpenSearch}
              className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-[3px] px-2 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e] hover:text-white "
            >
              <FiSearch size={17} className="opacity-80" />
              Search
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4 ">
            <div className="space-y">
              <p className="sticky top-0 z-10 mb-2  px-3 py-1 text-[13px] font-light text-white/80 flex items-center gap-1">
                Pinned
                <IoIosArrowForward size={10} />
              </p>
              <p className="sticky top-0 z-10 mb-2  px-3 py-1 text-[13px] font-light text-white/80 flex items-center gap-1">
                Recent conversation
                <IoIosArrowForward size={10} />
              </p>

              {isLoading && (
                <div className="space-y-2 px-3">
                  {[0, 1, 2].map((key) => (
                    <div key={key} className="h-4 animate-pulse rounded bg-white/10" />
                  ))}
                </div>
              )}

              {isError && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="px-3 py-2 text-sm text-red-300/80 transition-colors hover:text-red-200"
                >
                  Failed to load chats. Retry
                </button>
              )}

              {!isLoading && !isError && sortedChats.length === 0 && (
                <p className="px-3 py-2 text-sm text-white/35">No chats yet</p>
              )}

              {!isLoading && !isError && (
                <div className="relative" onMouseLeave={handleMouseLeaveList}>
                  <div
                    className="absolute left-0 right-0 z-0 rounded-[2px] bg-[#1e1e1e] transition-all duration-300 ease-out"
                    style={{
                      top: hoverStyle.top,
                      height: hoverStyle.height,
                      opacity: hoverStyle.opacity,
                    }}
                  />

                  {sortedChats.map((chat) => {
                    const isActive = activeConversationId === chat.id;
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
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                submitRename(chat.id);
                              }
                              if (e.key === 'Escape') setRenamingChatId(null);
                            }}
                            autoFocus
                            className="min-w-0 flex-1 px-2 py-1 text-sm text-white outline-none"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectChat(chat.id)}
                            className="flex min-w-0 flex-1 cursor-pointer items-center gap-1 px-1 py-1 text-left"
                          >
                            <GoDot className="shrink-0 text-white/50" size={14} />
                            <span className="truncate">{conversationLabel(chat)}</span>
                          </button>
                        )}

                        {!isRenaming && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMenuPos({ x: rect.right - 16, y: rect.bottom + 4 });
                              setMenuChatId(isMenuOpen ? null : chat.id);
                            }}
                            className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-white/40 transition-colors hover:bg-white/10 hover:text-white ${
                              isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                            title="Chat options"
                          >
                            <FiMoreHorizontal size={16} />
                          </button>
                        )}

                        {isMenuOpen &&
                          typeof window !== 'undefined' &&
                          createPortal(
                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'fixed',
                                left: menuPos.x,
                                top: menuPos.y,
                                transform: 'translateY(-110%)',

                                zIndex: 9000,
                              }}
                              className="w-44 rounded-[8px] border border-white/10 bg-[#1c1c1c] p-1.5 shadow-2xl shadow-black/80"
                            >
                              <button
                                type="button"
                                onClick={() => setMenuChatId(null)}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13.5px] font-normal text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <BsPinAngle size={15} className="opacity-75" />
                                Pin
                              </button>
                              <button
                                type="button"
                                onClick={() => setMenuChatId(null)}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13.5px] font-normal text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <FiEyeOff size={15} className="opacity-75" />
                                Mark as unread
                              </button>
                              <button
                                type="button"
                                onClick={() => startRename(chat)}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13.5px] font-normal text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <FiEdit2 size={15} className="opacity-75" />
                                Rename
                              </button>
                              <button
                                type="button"
                                onClick={() => setMenuChatId(null)}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13.5px] font-normal text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <FiFolderPlus size={15} className="opacity-75" />
                                Add to project
                              </button>
                              <button
                                type="button"
                                onClick={() => setMenuChatId(null)}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13.5px] font-normal text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <FiFolder size={15} className="opacity-75" />
                                Move to group
                              </button>

                              <div className="my-1 border-t border-white/10" />

                              <button
                                type="button"
                                onClick={() => {
                                  setMenuChatId(null);
                                  setDeleteTarget(chat);
                                }}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13.5px] font-normal text-[#ff6b6b] transition-colors hover:bg-red-500/10 hover:text-red-300"
                              >
                                <FiTrash2 size={15} />
                                Delete
                              </button>
                            </div>,
                            document.body,
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-2 py-1">
            <div className="flex items-center gap-3">
              {avatar && !imageError ? (
                <Image
                  src={avatar}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  onError={() => setImageError(true)}
                  className="h-8 w-8 shrink-0 rounded-[4px] object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-white/10 text-sm font-semibold text-white uppercase">
                  {avatarInitial}
                </div>
              )}
              <div className="flex flex-col">
                <span className="max-w-[120px] truncate text-[13px] font-light text-white">
                  {displayName}
                </span>
                <span className="max-w-[120px] truncate text-[11px] text-white/40">
                  {displayEmail}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                  title="Settings"
                >
                  <FiSettings size={15} />
                </button>
              )}
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
              This will permanently delete &quot;{conversationLabel(deleteTarget)}&quot;.
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
