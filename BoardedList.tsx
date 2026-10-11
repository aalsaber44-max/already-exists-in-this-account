import React from 'react';
import { BoardingLogEntry } from '../types';
import { CheckCircle2, Clock, Undo2, Bus, ShieldCheck } from 'lucide-react';

interface BoardedListProps {
  boardedLogs: BoardingLogEntry[];
  onUndoBoarding: (studentId: string) => void;
  maxCapacity: number;
}

export const BoardedList: React.FC<BoardedListProps> = ({
  boardedLogs,
  onUndoBoarding,
  maxCapacity,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-md">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
            <span>ركبوا الباص</span>
            <span className="text-xs text-slate-400 font-normal">(مع الوقت الموثق)</span>
          </h2>
        </div>
        <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20 font-mono">
          {boardedLogs.length} / {maxCapacity} صعدوا
        </div>
      </div>

      {/* Empty State */}
      {boardedLogs.length === 0 ? (
        <div className="text-center py-7 px-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
          <Bus className="w-9 h-9 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">
            لم يصعد أي راكب حتى الآن.
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            اضغط على كبسة "ركب" أمام اسمك وأسماء الطلاب لتسجيل الصعود وتوثيق الوقت فورياً.
          </p>
        </div>
      ) : (
        /* Boarded Students List */
        <div className="space-y-2">
          {boardedLogs.map((log) => {
            const isSupervisor = log.isSupervisor;

            return (
              <div
                key={log.studentId}
                className={`rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5 transition-all shadow-sm ${
                  isSupervisor
                    ? 'bg-amber-950/30 border border-amber-500/40 ring-1 ring-amber-500/20'
                    : 'bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                {/* Left side: Seat number, Checkmark and Name */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Seat / Order Index */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 ${
                    isSupervisor
                      ? 'bg-amber-500 text-slate-950 border border-amber-400'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    #{log.seatNumber}
                  </div>

                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${isSupervisor ? 'text-amber-400' : 'text-emerald-400'}`} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-base sm:text-lg font-bold truncate ${isSupervisor ? 'text-amber-300' : 'text-white'}`}>
                        {log.studentName}
                      </span>
                      {isSupervisor && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          <span>المشرف</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Timestamp & Undo */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Boarding Timestamp */}
                  <div className={`border px-2.5 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-inner ${
                    isSupervisor
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 border-slate-700/80 text-emerald-300'
                  }`}>
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span dir="ltr">{log.boardedAtTime}</span>
                  </div>

                  {/* Undo Button */}
                  <button
                    onClick={() => onUndoBoarding(log.studentId)}
                    title="تراجع عن الصعود وإعادة الاسم لقائمة الانتظار"
                    aria-label={`تراجع عن صعود ${log.studentName}`}
                    className="h-9 px-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-400 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                  >
                    <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">تراجع</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
