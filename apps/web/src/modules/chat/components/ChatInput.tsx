'use client';

import { useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end gap-2 rounded-[12px] border border-white/10 bg-[#171717] px-3 py-2 transition-colors focus-within:border-white/30">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Message Relic AI..."
          rows={1}
          className="max-h-40 flex-1 resize-none bg-transparent py-2 text-[15px] text-white outline-none placeholder:text-white/30"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-white text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Send message"
        >
          <FiArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
