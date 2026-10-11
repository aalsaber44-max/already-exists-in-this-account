// Date and Time formatting helpers for bus supervisor

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatCurrentTimeArabic(): string {
  const d = new Date();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'م' : 'ص';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 12-hour format
  const hoursStr = String(hours).padStart(2, '0');

  return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
}

export function formatFullArabicDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('ar-EG');
  }
}
