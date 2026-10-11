import React from 'react';
import { RotateCcw, FileSpreadsheet, UserPlus } from 'lucide-react';

interface ActionFooterProps {
  onOpenResetConfirm: () => void;
  onOpenExportModal: () => void;
  onOpenAddStudent: () => void;
  boardedCount: number;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  onOpenResetConfirm,
  onOpenExportModal,
  onOpenAddStudent,
  boardedCount,
}) => {
  return (
    <div className="sticky bottom-0 z-20 bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4 backdrop-blur shadow-2xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Reset / Start New Day */}
        <button
          onClick={onOpenResetConfirm}
          className="flex-1 min-h-[50px] px-3 sm:px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">🔄 بدء يوم جديد</span>
        </button>

        {/* Export Day's Log */}
        <button
          onClick={onOpenExportModal}
          className="flex-1 min-h-[50px] px-3 sm:px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-amber-500/10"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-950 shrink-0" />
          <span className="truncate">📄 تصدير سجل اليوم</span>
        </button>
      </div>
    </div>
  );
};
