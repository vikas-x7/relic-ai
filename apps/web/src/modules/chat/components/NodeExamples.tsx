import type { IconType } from 'react-icons';
import { FiCode, FiMail, FiMessageSquare, FiUser } from 'react-icons/fi';
import { EXAMPLE_PROMPTS } from '@/src/modules/chat/constants';

const PROMPT_ICONS: Record<string, IconType> = {
  user: FiUser,
  mail: FiMail,
  message: FiMessageSquare,
  code: FiCode,
};

type NodeExamplesProps = {
  onSelect: (prompt: string) => void;
};

export default function NodeExamples({ onSelect }: NodeExamplesProps) {
  return (
    <div className="absolute top-full left-1/2 mt-8 flex w-[750px] -translate-x-1/2 flex-col gap-3">
      <span className="text-[19px] text-white">Get started with an example below</span>
      <div className="grid grid-cols-4 gap-3">
        {EXAMPLE_PROMPTS.map((prompt) => {
          const Icon = PROMPT_ICONS[prompt.icon] || FiUser;

          return (
            <button
              key={prompt.text}
              onClick={() => onSelect(prompt.text)}
              className="nodrag nopan flex h-[120px] flex-col justify-between rounded-[6px] border border-[#303030] bg-[#1a1a1a] p-4 text-left transition-colors hover:bg-[#252525]"
            >
              <span className="text-[13px] leading-relaxed text-white/80">{prompt.text}</span>
              <Icon size={18} className="text-white/40" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
