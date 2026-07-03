'use client';

import { FiColumns, FiCrosshair, FiList, FiMinus, FiPlus } from 'react-icons/fi';

type CanvasToolbarProps = {
  onZoomOut: () => void;
  onZoomIn: () => void;
  onArrangeNodes: () => void;
  onFocusActiveNode: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  arrangeDisabled: boolean;
  focusDisabled: boolean;
};

export default function CanvasToolbar({
  onZoomOut,
  onZoomIn,
  onArrangeNodes,
  onFocusActiveNode,
  isSidebarOpen,
  onToggleSidebar,
  arrangeDisabled,
  focusDisabled,
}: CanvasToolbarProps) {
  const base =
    'nodrag nopan flex h-9 w-9 items-center justify-center rounded-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white';
  const disabled =
    'disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white/60';

  return (
    <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-[8px] bg-[#151515] p-1 shadow-xl shadow-black/40">
      <button type="button" onClick={onZoomOut} className={base} title="Zoom out">
        <FiMinus size={18} />
      </button>
      <button type="button" onClick={onZoomIn} className={base} title="Zoom in">
        <FiPlus size={18} />
      </button>
      <button
        type="button"
        onClick={onArrangeNodes}
        disabled={arrangeDisabled}
        className={`${base} ${disabled}`}
        title="Arrange nodes side by side"
      >
        <FiColumns size={18} />
      </button>
      <button
        type="button"
        onClick={onFocusActiveNode}
        disabled={focusDisabled}
        className={`${base} ${disabled}`}
        title="Focus current node"
      >
        <FiCrosshair size={18} />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button
        type="button"
        onClick={onToggleSidebar}
        className={`${base} ${isSidebarOpen ? 'bg-white/15 text-white' : ''}`}
        title="Toggle nodes sidebar"
      >
        <FiList size={18} />
      </button>
    </div>
  );
}
