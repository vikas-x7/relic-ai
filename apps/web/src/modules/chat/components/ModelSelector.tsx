'use client';

import { useState, createElement, type ComponentType } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { MODEL_ICON_SRC, MODELS } from '@/src/modules/chat/constants';
import type { ChatModel } from '@/src/modules/chat/types';

type ModelSelectorProps = {
  onSelect?: (model: ChatModel) => void;
};

export default function ModelSelector({ onSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(MODELS[0].id);

  const active = MODELS.find((model) => model.id === activeId) || MODELS[0];
  const Icon: ComponentType<{ size?: number }> | null = active.icon === 'fc-google' ? FcGoogle : null;

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-[#303030] px-2 py-1 text-[13px] transition-colors hover:bg-[#303030]"
      >
        {Icon ? (
          <Icon size={14} />
        ) : (
          <img src={MODEL_ICON_SRC[active.icon]} alt="" className="h-4 w-4 rounded-[3px] object-contain opacity-70" />
        )}
        <span>{active.name}</span>
        <FiChevronDown size={14} className="opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-52 rounded-[8px] border border-[#303030] bg-[#1a1a1a] p-1.5 shadow-2xl">
          {MODELS.map((model) => {
            const modelIcon = model.icon === 'fc-google' ? FcGoogle : null;

            return (
              <button
                key={model.id}
                disabled={!model.available}
                onClick={() => {
                  setActiveId(model.id);
                  setIsOpen(false);
                  onSelect?.(model);
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-[5px] px-2 py-1.5 text-left text-[13px] text-white hover:bg-[#303030] disabled:cursor-default disabled:text-white/50"
              >
                <span className="flex items-center gap-2">
                  {modelIcon ? (
                    createElement(modelIcon, { size: 14 })
                  ) : (
                    <img src={MODEL_ICON_SRC[model.icon]} alt="" className="h-4 w-4 rounded-[3px] object-contain opacity-70" />
                  )}
                  {model.name}
                </span>
                {model.id === activeId ? (
                  <FiCheck size={12} className="text-white/50" />
                ) : model.tag ? (
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">{model.tag}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
