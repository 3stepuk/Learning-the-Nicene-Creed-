import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDark: boolean;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDark
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="reset-confirm-modal-backdrop"
    >
      <div 
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
          isDark 
            ? 'bg-[#111318] border-white/10 text-slate-300' 
            : 'bg-white border-rose-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
        id="reset-confirm-modal-content"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-serif italic font-medium text-lg text-slate-100">
              Reset Memorisation Progress?
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
            id="close-reset-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400 leading-relaxed">
          This will reset the mastery status of all 13 Nicene Creed cards back to <strong className="text-slate-200">Not Started</strong> in your local browser storage. This cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
            id="cancel-reset-btn"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-900/30"
            id="confirm-reset-btn"
          >
            Yes, Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
