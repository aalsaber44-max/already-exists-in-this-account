import React from 'react';
import { BoardingLogEntry } from '../types';
import { formatFullArabicDate, formatCurrentTimeArabic } from '../utils/formatters';

interface PrintableReportProps {
  boardedLogs: BoardingLogEntry[];
  absentLogs: BoardingLogEntry[];
  todayStr: string;
  maxCapacity: number;
  supervisorName: string;
  departureTime: string;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  boardedLogs,
  absentLogs,
  todayStr,
  maxCapacity,
  supervisorName,
  departureTime,
}) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans text-right" dir="rtl">
      {/* Official Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black mb-1">كشف ترويحة باص المعهد اليومي</h1>
          <h2 className="text-lg font-bold text-gray-700">سجل صعود الطلاب (موعد الانطلاق: {departureTime})</h2>
          <p className="text-sm font-semibold text-gray-800 mt-1">مشرف الباص: {supervisorName}</p>
        </div>
        <div className="text-left text-sm font-medium">
          <p>التاريخ: <strong>{formatFullArabicDate(todayStr)}</strong></p>
          <p>وقت الطباعة: <strong>{formatCurrentTimeArabic()}</strong></p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-4 gap-4 mb-6 text-center border p-3 rounded-lg bg-gray-50">
        <div>
          <span className="text-xs text-gray-500 block">سعة الباص القصوى</span>
          <span className="text-xl font-bold">{maxCapacity} مقعد</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block">الركاب الصاعدين</span>
          <span className="text-xl font-bold text-green-700">{boardedLogs.length}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block">نسبة الإشغال</span>
          <span className="text-xl font-bold">{Math.round((boardedLogs.length / maxCapacity) * 100)}%</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block">عدد الغائبين</span>
          <span className="text-xl font-bold text-red-700">{absentLogs.length}</span>
        </div>
      </div>

      {/* Boarded Students Table */}
      <div className="mb-6">
        <h3 className="font-bold text-base mb-2 border-b pb-1">قائمة الطلاب الذين صعدوا الباص (موثق بالدقيقة والثانية)</h3>
        {boardedLogs.length === 0 ? (
          <p className="text-sm text-gray-500">لا يوجد ركاب مسجلين كصاعدين</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 w-16 text-center">المقعد</th>
                <th className="border border-gray-300 p-2">اسم الطالب</th>
                <th className="border border-gray-300 p-2 text-center">وقت الصعود الدقيق</th>
                <th className="border border-gray-300 p-2 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {boardedLogs.map((log) => (
                <tr key={log.studentId} className="even:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center font-bold">#{log.seatNumber}</td>
                  <td className="border border-gray-300 p-2 font-bold">{log.studentName}</td>
                  <td className="border border-gray-300 p-2 text-center font-mono" dir="ltr">{log.boardedAtTime}</td>
                  <td className="border border-gray-300 p-2 text-center text-green-700 font-bold">صعد ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Absent Students Table */}
      {absentLogs.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-base mb-2 border-b pb-1 text-red-700">قائمة الطلاب الغائبين عن الترويحة</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm text-right">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-gray-300 p-2 w-12 text-center">#</th>
                <th className="border border-gray-300 p-2">اسم الطالب</th>
                <th className="border border-gray-300 p-2 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {absentLogs.map((log, idx) => (
                <tr key={log.studentId}>
                  <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                  <td className="border border-gray-300 p-2 font-bold">{log.studentName}</td>
                  <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">غائب</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Signatures */}
      <div className="mt-12 pt-6 border-t border-gray-400 grid grid-cols-2 gap-8 text-center text-sm">
        <div>
          <p className="font-bold mb-8">مشرف الباص: {supervisorName}</p>
          <div className="border-b border-gray-400 w-48 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-1">التوقيع</p>
        </div>
        <div>
          <p className="font-bold mb-8">إدارة المعهد / السائق:</p>
          <div className="border-b border-gray-400 w-48 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-1">التوقيع</p>
        </div>
      </div>
    </div>
  );
};
