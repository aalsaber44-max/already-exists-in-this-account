import React from 'react';
import { ShieldAlert, Users, CheckCircle2, AlertOctagon } from 'lucide-react';

interface CapacityBarProps {
  boardedCount: number;
  maxCapacity: number;
  remainingSeats: number;
  isCapacityFull: boolean;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  boardedCount,
  maxCapacity,
  remainingSeats,
  isCapacityFull,
}) => {
  const percentage = Math.min(100, Math.round((boardedCount / maxCapacity) * 100));

  // Determine color states based on capacity
  let barGradient = 'from-emerald-500 to-teal-400';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (percentage >= 100) {
    barGradient = 'from-red-600 to-rose-500 animate-pulse';
    badgeColor = 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  } else if (percentage >= 80) {
    barGradient = 'from-amber-500 to-orange-500';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isCapacityFull 
        ? 'bg-rose-950/40 border-rose-600/70 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500' 
        : 'bg-slate-800/80 border-slate-700/80 shadow-md'
    }`}>
      {/* Top Header: Current count & Remaining seats */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isCapacityFull ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700/60 text-slate-300'}`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">الركاب الحاليين بالباص</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${isCapacityFull ? 'text-rose-400' : 'text-white'}`}>
                {boardedCount}
              </span>
              <span className="text-sm font-semibold text-slate-400 font-mono">
                / {maxCapacity} مقعد
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isCapacityFull ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 text-white shadow-md animate-bounce">
              <AlertOctagon className="w-4 h-4" />
              <span>مكتمل 100%</span>
            </div>
          ) : (
            <div className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold border ${badgeColor}`}>
              <span>متبقي {remainingSeats} مقاعد</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 sm:h-5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${barGradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Capacity Alert Lock Notification */}
      {isCapacityFull && (
        <div className="mt-3.5 p-3 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-start gap-2.5 text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-extrabold text-white block">
              ⚠️ نظام قفل المقاعد مفعل (25/25):
            </strong>
            اكتمل عدد المقاعد المسموح به لهذه الجولة تماماً! تم تعطيل كبسات الصعود تلقائياً لمنع أي زيادة في حمولة الباص حرصاً على سلامة الطلاب.
          </div>
        </div>
      )}
    </div>
  );
};
