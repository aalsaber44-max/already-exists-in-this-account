import React, { useState } from 'react';
import { Student } from '../types';
import { Check, UserX, UserCheck, Trash2, ShieldCheck, Sparkles } from 'lucide-react';

interface WaitingListProps {
  students: Student[];
  onBoard: (studentId: string) => void;
  onMarkAbsent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenAddStudent: () => void;
  isCapacityFull: boolean;
  searchQuery: string;
}

export const WaitingList: React.FC<WaitingListProps> = ({
  students,
  onBoard,
  onMarkAbsent,
  onDeleteStudent,
  onOpenAddStudent,
  isCapacityFull,
  searchQuery,
}) => {
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-md">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            قائمة الانتظار <span className="text-xs text-slate-400 font-normal">(لم يصعدوا بعد)</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick toggle to enable/disable deletion from the list */}
          {students.length > 0 && (
            <button
              onClick={() => setDeleteMode(!deleteMode)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                deleteMode
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {deleteMode ? 'إلغاء وضع الحذف' : 'وضع حذف الأسماء 🗑️'}
            </button>
          )}

          <div className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 font-mono">
            {students.length} في الانتظار
          </div>
        </div>
      </div>

      {/* Empty State */}
      {students.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
          {searchQuery ? (
            <p className="text-sm text-slate-400">
              لا يوجد اسم مطابق للبحث في قائمة الانتظار.
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2.5 text-slate-400">
              <UserCheck className="w-10 h-10 text-emerald-400/70" />
              <p className="text-base font-bold text-slate-200">
                رائع! صعد جميع الركاب إلى الباص
              </p>
              <button
                onClick={onOpenAddStudent}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                + إضافة أسماء جديدة
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Students List */
        <div className="space-y-2.5">
          {students.map((student) => {
            const isSupervisor = student.isSupervisor;

            return (
              <div
                key={student.id}
                className={`rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5 transition-all shadow-sm ${
                  isSupervisor
                    ? 'bg-amber-500/10 hover:bg-amber-500/15 border-2 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {/* Student Info */}
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  {deleteMode && !isSupervisor && (
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف "${student.name}" من القائمة؟`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      title="حذف هذا الاسم فوراً"
                      className="p-2 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800/60 shrink-0 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-base sm:text-lg font-black truncate tracking-tight ${isSupervisor ? 'text-amber-300' : 'text-white'}`}>
                        {student.name}
                      </span>
                      {isSupervisor && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>مشرف الباص</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Mark Absent button (only for students, not supervisor) */}
                  {!isSupervisor && (
                    <button
                      onClick={() => onMarkAbsent(student.id)}
                      title="تسجيل غياب الطالب اليوم"
                      className="h-12 px-2.5 sm:px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-rose-950/40 hover:border-rose-700/50 hover:text-rose-400 text-slate-400 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                    >
                      <UserX className="w-4 h-4" />
                      <span className="hidden sm:inline">غائب</span>
                    </button>
                  )}

                  {/* Primary One-Tap Boarding Button: ركب */}
                  <button
                    onClick={() => onBoard(student.id)}
                    disabled={isCapacityFull}
                    aria-label={`تسجيل صعود ${student.name}`}
                    className={`h-12 px-4 sm:px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md select-none active:scale-95 ${
                      isCapacityFull
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        : isSupervisor
                        ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 border border-amber-300 shadow-amber-500/20 hover:scale-[1.02]'
                        : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400/40 shadow-emerald-950/40 ring-1 ring-emerald-400/30 hover:scale-[1.02]'
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>{isCapacityFull ? 'ممتلئ' : isSupervisor ? 'صعدت للباص ✓' : 'ركب'}</span>
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
