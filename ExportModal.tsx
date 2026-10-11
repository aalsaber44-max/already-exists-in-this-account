import React, { useState } from 'react';
import { BoardingLogEntry } from '../types';
import { generateCsvData, downloadCsvFile, generateWhatsAppReport } from '../utils/export';
import { formatFullArabicDate } from '../utils/formatters';
import { X, Download, Printer, Share2, Check, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardedLogs: BoardingLogEntry[];
  absentLogs: BoardingLogEntry[];
  todayStr: string;
  maxCapacity: number;
  supervisorName: string;
  departureTime: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  boardedLogs,
  absentLogs,
  todayStr,
  maxCapacity,
  supervisorName,
  departureTime,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const formattedDate = formatFullArabicDate(todayStr);

  const handleDownloadCsv = () => {
    const allLogs = [...boardedLogs, ...absentLogs];
    const csvContent = generateCsvData(allLogs, todayStr, supervisorName, departureTime);
    const filename = `كشف_باص_المعهد_${todayStr}.csv`;
    downloadCsvFile(csvContent, filename);
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppReport(
      boardedLogs,
      absentLogs,
      maxCapacity,
      todayStr,
      supervisorName,
      departureTime
    );
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                تصدير وتوثيق كشف الباص
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-cyan-400 font-bold">المشرف: {supervisorName}</span>
                <span>•</span>
                <span>انطلاق {departureTime}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-xs text-slate-400">صعدوا الباص</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{boardedLogs.length}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-xs text-slate-400">سعة الباص</div>
              <div className="text-xl font-bold font-mono text-amber-400">{maxCapacity}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-xs text-slate-400">الغياب</div>
              <div className="text-xl font-bold font-mono text-rose-400">{absentLogs.length}</div>
            </div>
          </div>

          {/* Table Preview */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-2.5 bg-slate-800/50 text-xs font-bold text-slate-300 border-b border-slate-800 flex justify-between">
              <span>معاينة كشف الصعود ({boardedLogs.length} طالب)</span>
              <span>المقعد / الوقت</span>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 text-xs">
              {boardedLogs.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  لم يسجل صعود أي طالب حتى الآن
                </div>
              ) : (
                boardedLogs.map(log => (
                  <div key={log.studentId} className="p-2.5 flex items-center justify-between hover:bg-slate-800/20">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">#{log.seatNumber}</span>
                      <span className="font-medium text-slate-200">{log.studentName}</span>
                    </div>
                    <span className="font-mono text-slate-400" dir="ltr">{log.boardedAtTime}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Button 1: Download CSV */}
            <button
              onClick={handleDownloadCsv}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold flex items-center justify-center gap-2.5 transition-colors active:scale-98"
            >
              <Download className="w-5 h-5 text-emerald-400" />
              <span>تحميل ملف إكسل / CSV (موثق بالدقيقة والثانية)</span>
            </button>

            {/* Button 2: WhatsApp Copy */}
            <button
              onClick={handleCopyWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2.5 transition-colors active:scale-98 shadow-md"
            >
              {copied ? <Check className="w-5 h-5 text-white" /> : <Share2 className="w-5 h-5 text-white" />}
              <span>{copied ? 'تم نسخ التقرير بنجاح! جاهز للصق في واتساب' : 'نسخ تقرير فوري لواتساب / إدارة المعهد'}</span>
            </button>

            {/* Button 3: Print / PDF */}
            <button
              onClick={handlePrint}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2.5 transition-colors active:scale-98"
            >
              <Printer className="w-5 h-5 text-cyan-400" />
              <span>طباعة كشف الحضور / حفظ كـ PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
