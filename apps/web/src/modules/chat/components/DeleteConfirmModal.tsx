'use client';

type DeleteConfirmModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[400px] rounded-[5px] bg-[#121212] p-6 shadow-2xl">
        <h3 className="mb-2 text-xl font-semibold text-white">Delete Node</h3>
        <p className="mb-6 text-[15px] text-white/60">
          Are you sure you want to delete this node? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-[3px] border border-[#303030] bg-transparent px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#202020]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[3px] bg-red-600/90 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
