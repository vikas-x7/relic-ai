'use client';

import { useState } from 'react';
import {
  FiUser,
  FiSliders,
  FiToggleLeft,
  FiCpu,
  FiBell,
  FiSettings,
  FiZap,
  FiGrid,
  FiLock,
  FiBookOpen,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import { MdOutlineBusiness } from 'react-icons/md';
import { IoRocketOutline } from 'react-icons/io5';

export type SettingsTabId =
  | 'account'
  | 'preferences'
  | 'personalization'
  | 'memory-settings'
  | 'notifications'
  | 'configuration'
  | 'connectors'
  | 'skills'
  | 'memory'
  | 'credential-vault'
  | 'upgrade-enterprise'
  | 'about-enterprise'
  | 'api-platform';

export type SettingsItem = {
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export type SettingsGroup = {
  title: string;
  items: SettingsItem[];
};

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: 'Account',
    items: [
      { id: 'account', label: 'Account', icon: FiUser },
      { id: 'preferences', label: 'Preferences', icon: FiSliders },
      { id: 'personalization', label: 'Personalization', icon: FiToggleLeft },
      { id: 'memory-settings', label: 'Memory settings', icon: FiCpu },
      { id: 'notifications', label: 'Notifications', icon: FiBell },
    ],
  },
  {
    title: 'Computer',
    items: [
      { id: 'configuration', label: 'Configuration', icon: FiSettings },
      { id: 'connectors', label: 'Connectors', icon: FiZap },
      { id: 'skills', label: 'Skills', icon: FiGrid },
      { id: 'memory', label: 'Memory', icon: FiCpu },
      { id: 'credential-vault', label: 'Credential vault', icon: FiLock },
    ],
  },
  {
    title: 'Other',
    items: [
      { id: 'upgrade-enterprise', label: 'Upgrade to Enterprise', icon: IoRocketOutline },
      { id: 'about-enterprise', label: 'About Enterprise', icon: MdOutlineBusiness },
      { id: 'api-platform', label: 'API Platform', icon: FiBookOpen },
    ],
  },
];

type SettingsSidebarProps = {
  activeTab: SettingsTabId;
  onSelectTab: (tabId: SettingsTabId) => void;
};

export default function SettingsSidebar({ activeTab, onSelectTab }: SettingsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = SETTINGS_GROUPS.map((group) => {
    const filteredItems = group.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
    return { ...group, items: filteredItems };
  }).filter((group) => group.items.length > 0);

  return (
    <div className="w-64 sm:w-72 shrink-0 h-full bg-[#121212] border-r border-white/10 flex flex-col p-4 select-none">
      {/* Search Settings Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
          <FiSearch size={15} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search settings"
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/30 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-white/40 hover:text-white"
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 slim-scrollbar">
        {filteredGroups.length === 0 ? (
          <p className="text-xs text-white/40 px-3 py-4 text-center">No settings found</p>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
                {group.title}
              </h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-[3px] text-[13px] font-normal transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#242424] text-white font-medium shadow-sm'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
