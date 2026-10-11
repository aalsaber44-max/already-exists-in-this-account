import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount?: number;
  totalWaitingCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount,
  totalWaitingCount,
}) => {
  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 absolute right-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="🔍 ابحث عن اسم الطالب..."
          className="w-full bg-slate-800/90 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl py-3 pr-11 pl-11 text-base font-semibold shadow-inner transition-all outline-none"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute left-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="مسح البحث"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {value.trim() && (
        <div className="flex items-center justify-between mt-1.5 px-1 text-xs text-slate-400">
          <span>نتائج البحث عن: "{value}"</span>
          <span className="font-mono text-amber-400 font-bold">{resultCount} طالب</span>
        </div>
      )}
    </div>
  );
};
