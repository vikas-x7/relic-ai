'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { MdVerified } from 'react-icons/md';
import { IoIosLogOut } from 'react-icons/io';
import { FiX } from 'react-icons/fi';
import { useUser, useLogout } from '@/src/modules/auth/hooks/useAuth';
import { useConversations } from '@/src/modules/chat/hooks/useConversations';
import SettingsSidebar, { SettingsTabId, SETTINGS_GROUPS } from './SettingsSidebar';

type SettingsPanelProps = {
  onClose: () => void;
};

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { data: userData } = useUser();
  const user = userData?.user;
  const logout = useLogout();
  const { data: conversations } = useConversations();

  const [activeTab, setActiveTab] = useState<SettingsTabId>('account');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const jobsCreatedCount = conversations?.length || 0;

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 220);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLogoutModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isLogoutModalOpen]);

  // Find active item info
  let activeItemInfo = { label: 'Account', icon: SETTINGS_GROUPS[0].items[0].icon };
  for (const group of SETTINGS_GROUPS) {
    const found = group.items.find((item) => item.id === activeTab);
    if (found) {
      activeItemInfo = found;
      break;
    }
  }

  const ActiveIcon = activeItemInfo.icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLogoutModalOpen) {
          handleClose();
        }
      }}
    >
      {/* Settings Popup Modal Box */}
      <div
        className={`relative w-full max-w-[70vw]  h-[90vh] bg-[#181818] rounded-[10px] shadow-2xl overflow-hidden flex font-cabin text-white ${
          isClosing ? 'animate-modal-out' : 'animate-modal-pop'
        }`}
      >
        {/* Settings Sidebar on Left */}
        <SettingsSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Settings Content Area on Right */}
        <div className="flex-1 h-full overflow-y-auto bg-[#141414] relative ">
          {/* Sleek Close Button inside popup */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-5 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            title="Close"
          >
            <FiX size={18} />
          </button>

          <div className="w-full space-y-6">
            {activeTab === 'account' ? (
              /* Account Tab Content */
              <div className="bg-[#1F1F1F]  overflow-hidden shadow-xl">
                {/* User Profile Banner & Header */}
                <div className="bg-neutral-900/50 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 w-full relative">
                    <div className="absolute inset-0 bg-white/5 opacity-50" />
                  </div>
                  <div className="px-6 pb-6 relative">
                    <div className="relative -mt-12 h-24 w-24">
                      {user?.avatar && !imageError ? (
                        <Image
                          src={user.avatar}
                          alt={user.name || 'User'}
                          width={96}
                          height={96}
                          unoptimized
                          className="h-24 w-24 rounded-[4px] object-cover ring-4 ring-[#1F1F1F] shadow-lg"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-2xl bg-neutral-800 ring-4 ring-[#1F1F1F] flex items-center justify-center text-4xl font-semibold text-neutral-300 shadow-lg">
                          {(
                            user?.email?.trim().charAt(0) ||
                            user?.name?.charAt(0) ||
                            'U'
                          ).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pb-2">
                      <h2 className="text-[22px] font-medium text-white">{user?.name || 'User'}</h2>
                      <p className="text-[12px] text-neutral-400 mt-0.5">{user?.email}</p>
                      <div className="mt-4 flex items-center space-x-3">
                        <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-[11px] font-medium rounded ring-1 ring-inset ring-emerald-500/20">
                          <MdVerified size={14} />
                          <span>Verified</span>
                        </span>
                        <span className="inline-flex items-center space-x-1.5 bg-neutral-800 text-neutral-300 px-2.5 py-1 text-[11px] font-medium rounded ring-1 ring-inset ring-neutral-700">
                          <FcGoogle size={14} />
                          <span>Google</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-neutral-900/50 overflow-hidden border-t border-neutral-800">
                  <div className="px-6 py-4 border-b border-neutral-800">
                    <h3 className="text-[14px] font-medium text-white">Account Details</h3>
                  </div>
                  <div className="px-6 py-2">
                    <ul className="text-[13px] divide-y divide-neutral-800/60">
                      <li className="flex justify-between py-4">
                        <span className="text-neutral-400">Full name</span>
                        <span className="text-white font-medium">{user?.name || 'User'}</span>
                      </li>
                      <li className="flex justify-between py-4">
                        <span className="text-neutral-400">Email address</span>
                        <span className="text-white font-medium">{user?.email}</span>
                      </li>
                      <li className="flex justify-between py-4">
                        <span className="text-neutral-400">Jobs & chats created</span>
                        <span className="text-white font-medium">{jobsCreatedCount}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-neutral-900/50 overflow-hidden border-t border-neutral-800">
                  <div className="px-6 py-4 border-b border-neutral-800">
                    <h3 className="text-[14px] font-medium text-white">Account Actions</h3>
                  </div>
                  <div>
                    <ul className="text-[13px] divide-y divide-neutral-800/60">
                      <li className="flex items-center justify-between px-6 py-5">
                        <div>
                          <p className="font-medium text-neutral-200">Log Out</p>
                          <p className="text-[12px] text-neutral-400 mt-0.5">
                            Sign out of your account on this device
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsLogoutModalOpen(true)}
                          className="bg-white/90 text-black hover:bg-neutral-200 transition px-3 py-1.5 rounded-[4px] text-[12px] font-medium cursor-pointer flex items-center gap-2"
                        >
                          <IoIosLogOut size={16} />
                          Log Out
                        </button>
                      </li>
                      <li className="flex items-center justify-between px-6 py-5">
                        <div>
                          <p className="font-medium text-neutral-200">Export Data</p>
                          <p className="text-[12px] text-neutral-400 mt-0.5">
                            Download all your cron jobs and execution logs
                          </p>
                        </div>
                        <span className="inline-flex items-center bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-400 rounded ring-1 ring-inset ring-neutral-700">
                          Coming Soon
                        </span>
                      </li>

                      <li className="flex items-center justify-between px-6 py-5 bg-red-500/5">
                        <div>
                          <p className="font-medium text-red-400">Delete Account</p>
                          <p className="text-[12px] text-red-400/70 mt-0.5">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <span className="inline-flex items-center bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-500 rounded ring-1 ring-inset ring-neutral-700">
                          Coming Soon
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* Other Tabs UI Placeholder */
              <div className="bg-[#1F1F1F] rounded-[10px] overflow-hidden shadow-xl border border-white/5 p-6 sm:p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                  <div className="p-3 bg-white/5 rounded-xl text-white">
                    <ActiveIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-white">{activeItemInfo.label}</h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Manage your {activeItemInfo.label.toLowerCase()} settings and preferences.
                    </p>
                  </div>
                </div>

                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <ActiveIcon size={22} />
                  </div>
                  <h3 className="text-base font-medium text-white">
                    {activeItemInfo.label} Controls
                  </h3>
                  <p className="text-xs text-white/40 max-w-md">
                    Configure and customize {activeItemInfo.label.toLowerCase()} options for your
                    workspace.
                  </p>
                  <span className="mt-2 inline-flex items-center bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-400 rounded-md ring-1 ring-inset ring-neutral-700">
                    UI Ready • Feature Coming Soon
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1c1c1c] border border-white/10 p-6 rounded-[8px] w-full max-w-sm shadow-2xl">
            <h2 className="text-lg text-white font-medium mb-2">Confirm Logout</h2>
            <p className="text-[13px] text-neutral-400 mb-6">
              Are you sure you want to sign out? You will need to log in again to access your
              dashboard.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-[12px] rounded-[4px] text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="px-4 py-2 text-[12px] rounded-[4px] text-black bg-white hover:bg-white/90 transition cursor-pointer disabled:opacity-50"
              >
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
