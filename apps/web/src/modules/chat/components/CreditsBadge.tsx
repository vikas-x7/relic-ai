'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiZap } from 'react-icons/fi';
import { GoNorthStar } from 'react-icons/go';

export default function CreditsBadge() {
  const [isOpen, setIsOpen] = useState(false);

  const creditsUsed = 127;
  const creditsTotal = 500;
  const percent = Math.round((creditsUsed / creditsTotal) * 100);

  return (
    <div className="absolute top-4 right-4 z-40">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="nodrag nopan flex items-center gap-2 rounded-[5px] bg-[#1d1d1d] px-2 py-1 text-sm  shadow-xl shadow-black/40 transition-colors hover:bg-[#1e1e1e] hover:text-white"
      >
        <GoNorthStar size={15} />
        <span className="font-light text-white">
          {creditsUsed}/{creditsTotal} Credits
        </span>
        {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-[5px] bg-[#151515] p-4 shadow-2xl shadow-black/60">
          <div className="mb-3 flex items-center gap-2">
            <GoNorthStar size={15} />
            <span className="text-sm  text-white">Credits</span>
          </div>

          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-xs text-white/40">{creditsTotal - creditsUsed} credits remaining</p>

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Used</span>
              <span className="text-white/60">{creditsUsed}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-white/40">Total</span>
              <span className="text-white/60">{creditsTotal}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-white/40">Plan</span>
              <span className="text-white/60">Free</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
