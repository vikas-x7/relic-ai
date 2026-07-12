'use client';

import { FiPlus } from 'react-icons/fi';

type TextSelectionButtonProps = {
  x: number;
  y: number;
  onClick: () => void;
};

export default function TextSelectionButton({ x, y, onClick }: TextSelectionButtonProps) {
  return (
    <button
      id="new-node-btn"
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="fixed z-[70] flex -translate-x-1/2 items-center gap-1.5 rounded-[5px] border border-white/10 bg-[#202020] px-3 py-1 text-[13px] font-medium text-white shadow-2xl shadow-black/40 transition-colors hover:bg-[#303030]"
      style={{ left: x, top: y }}
      title="Create node from selection"
    >
      <FiPlus size={15} />
      New node
    </button>
  );
}
