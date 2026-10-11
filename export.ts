import { BoardingLogEntry } from '../types';
import { formatFullArabicDate } from './formatters';

export function generateCsvData(
  logs: BoardingLogEntry[],
  date: string,
  supervisorName: string,
  departureTime: string
): string {
  // UTF-8 BOM so Excel opens Arabic correctly without garbled symbols
  const BOM = '\uFEFF';
  const meta = `# كشف ترويحة باص المعهد | المشرف: ${supervisorName} | موعد الانطلاق: ${departureTime} | التاريخ: ${date}\r\n`;
  const headers = ['رقم المقعد/الترتيب', 'اسم الطالب', 'التاريخ', 'وقت الصعود', 'الحالة'];
  
  const rows = logs.map((log) => [
    log.status === 'boarded' ? log.seatNumber : '-',
    `"${log.studentName.replace(/"/g, '""')}"`,
    log.date,
    log.boardedAtTime,
    log.status === 'boarded' ? 'صعد الباص' : log.status === 'absent' ? 'غائب' : 'في الانتظار'
  ]);

  const csvContent = meta + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  return BOM + csvContent;
}

export function downloadCsvFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateWhatsAppReport(
  boardedLogs: BoardingLogEntry[],
  absentLogs: BoardingLogEntry[],
  totalCapacity: number,
  todayStr: string,
  supervisorName: string,
  departureTime: string
): string {
  const formattedDate = formatFullArabicDate(todayStr);

  const boardedList = boardedLogs
    .sort((a, b) => a.seatNumber - b.seatNumber)
    .map(l => `▫️ #${l.seatNumber} ${l.studentName} (${l.boardedAtTime})`)
    .join('\n');

  const absentList = absentLogs.length > 0
    ? absentLogs.map(l => `❌ ${l.studentName}`).join('\n')
    : 'لا يوجد غياب (الجميع صعد بالباص)';

  return `🚌 *تقرير ترويحة باص المعهد*
👤 المشرف: *${supervisorName}*
⏰ موعد الانطلاق: *${departureTime}*
📅 التاريخ: ${formattedDate}
👥 عدد الركاب الصاعدين: ${boardedLogs.length} من أصل ${totalCapacity} مقعد (${Math.round((boardedLogs.length / totalCapacity) * 100)}%)

*قائمة الطلاب الصاعدين:*
${boardedList || 'لم يصعد أي طالب بعد'}

*الطلاب الغائبون:*
${absentList}

توثيق إلكتروني دقيق بالدقيقة والثانية بواسطة تطبيق مشرف الباص.`;
}
