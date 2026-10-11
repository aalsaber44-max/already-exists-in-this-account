import React, { useState, useEffect } from 'react';
import { Bus, Volume2, VolumeX, UserPlus, Users, User, Clock, ShieldCheck } from 'lucide-react';
import { formatCurrentTimeArabic, formatFullArabicDate } from '../utils/formatters';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAddStudent: () => void;
  onOpenManageRoster: () => void;
  todayStr: string;
  totalStudentsCount: number;
  supervisorName: string;
  departureTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenAddStudent,
  onOpenManageRoster,
  todayStr,
  totalStudentsCount,
  supervisorName,
  departureTime,
}) => {
  const [currentTime, setCurrentTime] = useState<string>(formatCurrentTimeArabic);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatCurrentTimeArabic());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30 px-3 py-2.5 sm:px-6 sm:py-3 transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Brand / Title & Live Clock */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Bus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  باص المعهد
                </h1>
                <span className="text-amber-400 font-extrabold text-xs sm:text-sm bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  ترويحة
                </span>
                <span className="text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>المشرف: {supervisorName}</span>
                </span>
              </div>
              
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-medium flex-wrap">
                <span>{formatFullArabicDate(todayStr)}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>الانطلاق: {departureTime}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300 font-mono">{totalStudentsCount} ركاب مسجلين</span>
              </div>
            </div>
          </div>

          {/* Live digital clock for Mobile */}
          <div className="sm:hidden bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg text-amber-300 font-mono text-xs font-semibold tracking-wider">
            {currentTime}
          </div>
        </div>

        {/* Center Clock for Desktop */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl text-amber-300 font-mono text-sm font-bold shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{currentTime}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
            title={soundEnabled ? 'الصوت مفعّل (انقر للكتم)' : 'الصوت مكتوم (انقر للتفعيل)'}
            className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800 text-slate-400 border-slate-700/50 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden xs:inline">{soundEnabled ? 'صوت' : 'صامت'}</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onOpenAddStudent}
            className="px-2.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ إضافة</span>
          </button>

          {/* Manage / Delete Roster Button */}
          <button
            onClick={onOpenManageRoster}
            className="px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>إدارة الأسماء</span>
          </button>
        </div>
      </div>
    </header>
  );
};
