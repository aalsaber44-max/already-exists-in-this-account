import React from 'react';
import { Bus, Clock, User, ShieldCheck } from 'lucide-react';

interface TourBannerProps {
  departureTime: string;
  supervisorName: string;
  boardedCount: number;
  maxCapacity: number;
}

export const TourBanner: React.FC<TourBannerProps> = ({
  departureTime,
  supervisorName,
  boardedCount,
  maxCapacity,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-800/90 via-slate-800/80 to-slate-850/90 p-3 sm:p-3.5 rounded-2xl border border-slate-700/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Tour details */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
          <Bus className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white">جولة الصباح المعتمدة</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>جولة نشطة</span>
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-medium">
            <span className="flex items-center gap-1 text-slate-300">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>المشرف: <strong className="text-white">{supervisorName}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Departure Clock Badge */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 bg-slate-900/80 border border-slate-700/80 px-3.5 py-2 rounded-xl">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">موعد الانطلاق:</span>
        </div>
        <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 tracking-wider">
          {departureTime}
        </span>
      </div>
    </div>
  );
};
