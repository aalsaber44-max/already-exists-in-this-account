import React, { useState } from 'react';
import { Student } from '../types';
import { Users, Trash2, X, RefreshCw, Plus, Search, ShieldCheck } from 'lucide-react';

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onDeleteStudent: (id: string) => void;
  onClearAll: () => void;
  onRestoreDefaults: () => void;
  onOpenAddStudent: () => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  isOpen,
  onClose,
  students,
  onDeleteStudent,
  onClearAll,
  onRestoreDefaults,
  onOpenAddStudent,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = students.filter((s) => {
    return !search.trim() || s.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                إدارة وحذف أسماء ركاب الباص
              </h3>
              <p className="text-xs text-slate-400">
                إجمالي الأسماء المسجلة: <span className="font-mono text-amber-400 font-bold">{students.length} راكب (المشرف والطلاب)</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 text-slate-400 top-2.5" />
              <input
                type="text"
                placeholder="ابحث عن اسم في القائمة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAddStudent();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أسماء</span>
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {students.length === 0 ? 'القائمة فارغة. يمكنك إضافة أسماء الآن!' : 'لا توجد نتائج مطابقة للبحث'}
            </div>
          ) : (
            filtered.map((student, idx) => (
              <div key={student.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1 flex items-center gap-2.5">
                  <span className="text-xs font-mono text-slate-500 w-6">#{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold truncate ${student.isSupervisor ? 'text-amber-300' : 'text-slate-100'}`}>
                      {student.name}
                    </span>
                    {student.isSupervisor && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        <span>مشرف الباص</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Instant Delete Button */}
                {!student.isSupervisor && (
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف اسم الطالب "${student.name}"؟`)) {
                        onDeleteStudent(student.id);
                      }
                    }}
                    title="حذف هذا الطالب"
                    className="p-2 text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors border border-transparent hover:border-rose-900/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {students.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('تحذير: هل أنت متأكد من مسح جميع الأسماء؟')) {
                    onClearAll();
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح كل الأسماء</span>
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('هل تريد استرجاع قائمة المشرف ماهر الصابر والـ 21 طالباً؟')) {
                  onRestoreDefaults();
                }
              }}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة القائمة الأصلية</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
