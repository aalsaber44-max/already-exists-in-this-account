import React, { useState } from 'react';
import { BoardingLogEntry } from '../types';
import { UserX, Undo2, ChevronDown, ChevronUp } from 'lucide-react';

interface AbsentSectionProps {
  absentLogs: BoardingLogEntry[];
  onUndoAbsent: (studentId: string) => void;
}

export const AbsentSection: React.FC<AbsentSectionProps> = ({
  absentLogs,
  onUndoAbsent,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (absentLogs.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-rose-950/60 rounded-2xl p-3 sm:p-4 transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
          <span className="text-sm sm:text-base font-bold text-rose-300">
            الطلاب الغائبون اليوم ({absentLogs.length})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-rose-400/80 font-semibold">
          <span>{isExpanded ? 'إخفاء' : 'عرض'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          {absentLogs.map((log) => (
            <div
              key={log.studentId}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-300 truncate">
                  {log.studentName}
                </div>
              </div>

              <button
                onClick={() => onUndoAbsent(log.studentId)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 active:scale-95"
              >
                <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                <span>إلغاء الغياب</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
