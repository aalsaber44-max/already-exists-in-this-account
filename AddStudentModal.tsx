import React, { useState } from 'react';
import { UserPlus, X, ListPlus } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSingle: (name: string) => void;
  onAddBulk: (names: string[]) => number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddSingle,
  onAddBulk,
}) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [name, setName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسم الطالب');
      return;
    }

    onAddSingle(name.trim());
    setName('');
    setError('');
    onClose();
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      setError('يرجى لصق أو كتابة اسم واحد على الأقل');
      return;
    }

    onAddBulk(lines);
    setBulkText('');
    setError('');
    onClose();
  };

  const bulkCount = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <span>إضافة طلاب لباص المعهد</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Mode: Single or Bulk Paste */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl text-xs font-bold mb-4">
          <button
            type="button"
            onClick={() => { setMode('single'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'single' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>اسم فردي</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('bulk'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'bulk' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span>لصق قائمة (عدة أسماء)</span>
          </button>
        </div>

        {/* Single Mode Form */}
        {mode === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                اسم الطالب الكامل <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="مثال: يوسف حسام العبادي"
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-xl py-3 px-3.5 text-white font-medium outline-none text-sm"
                autoFocus
              />
              {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-md active:scale-98"
              >
                + إضافة الطالب
              </button>
            </div>
          </form>
        ) : (
          /* Bulk Mode Form */
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  الصق أسماء الطلاب هنا (كل اسم بسطر منفصل):
                </label>
                {bulkCount > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {bulkCount} أسماء مكتشفة
                  </span>
                )}
              </div>
              <textarea
                rows={6}
                value={bulkText}
                onChange={(e) => {
                  setBulkText(e.target.value);
                  if (error) setError('');
                }}
                placeholder="حسين ابو طالب&#10;نضال العطير&#10;محمد ناصر عوادين..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-white font-medium outline-none text-sm leading-relaxed"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                💡 يمكنك نسخ ولصق أي قائمة أسماء مباشرة من الواتساب دفعة واحدة.
              </p>
              {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-md active:scale-98"
              >
                إضافة القائمة ({bulkCount})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
