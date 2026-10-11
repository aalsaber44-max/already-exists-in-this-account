export type StudentStatus = 'waiting' | 'boarded' | 'absent';

export interface Student {
  id: string;
  name: string;
  isSupervisor?: boolean;
  phone?: string;
  notes?: string;
}

export interface BoardingLogEntry {
  id: string;
  studentId: string;
  studentName: string;
  isSupervisor?: boolean;
  date: string; // YYYY-MM-DD
  boardedAtTime: string; // e.g. "07:14:35 ص"
  timestamp: number; // Date.now() for sorting
  seatNumber: number; // 1 to 25
  status: StudentStatus;
}
