import { useState, useEffect, useMemo, useCallback } from 'react';
import { Student, BoardingLogEntry } from '../types';
import { INITIAL_STUDENTS, SUPERVISOR_NAME, DEPARTURE_TIME } from '../data/initialStudents';
import { getTodayDateString, formatCurrentTimeArabic } from '../utils/formatters';
import { soundFx } from '../utils/sound';

const STORAGE_KEYS = {
  STUDENTS: 'maher_bus_students_v7',
  LOGS: 'maher_bus_logs_v7',
  SOUND_ENABLED: 'maher_bus_sound_enabled_v7',
  SUPERVISOR: 'maher_bus_supervisor_v7',
  DEPARTURE: 'maher_bus_departure_v7',
};

export const MAX_BUS_CAPACITY = 25;

export function useBusAttendance() {
  const [todayStr] = useState<string>(getTodayDateString);
  const [supervisorName, setSupervisorName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SUPERVISOR) || SUPERVISOR_NAME;
  });
  const [departureTime, setDepartureTime] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.DEPARTURE) || DEPARTURE_TIME;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? saved === 'true' : true;
  });

  // Students roster (starts with Maher Al-Saber + 21 students)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  // Boarding logs map
  const [logs, setLogs] = useState<Record<string, BoardingLogEntry>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {};
  });

  // Persist students
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  // Persist logs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }, [logs]);

  // Persist supervisor name
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPERVISOR, supervisorName);
  }, [supervisorName]);

  // Persist departure time
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPARTURE, departureTime);
  }, [departureTime]);

  // Sync sound setting
  useEffect(() => {
    soundFx.enabled = soundEnabled;
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Today's logs
  const todayLogs = useMemo(() => {
    return Object.values(logs).filter(l => l.date === todayStr);
  }, [logs, todayStr]);

  // Boarded list (sorted by seat order)
  const boardedStudents = useMemo(() => {
    return todayLogs
      .filter(l => l.status === 'boarded')
      .sort((a, b) => a.seatNumber - b.seatNumber);
  }, [todayLogs]);

  // Absent student IDs
  const absentStudentIds = useMemo(() => {
    const map = new Set<string>();
    todayLogs.forEach(l => {
      if (l.status === 'absent') map.add(l.studentId);
    });
    return map;
  }, [todayLogs]);

  const absentList = useMemo(() => {
    return todayLogs
      .filter(l => l.status === 'absent')
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [todayLogs]);

  // Waiting list
  const boardedStudentIds = useMemo(() => {
    return new Set(boardedStudents.map(b => b.studentId));
  }, [boardedStudents]);

  const waitingStudents = useMemo(() => {
    return students.filter(
      s => !boardedStudentIds.has(s.id) && !absentStudentIds.has(s.id)
    );
  }, [students, boardedStudentIds, absentStudentIds]);

  // Capacity calculations
  const boardedCount = boardedStudents.length;
  const isCapacityFull = boardedCount >= MAX_BUS_CAPACITY;
  const remainingSeats = Math.max(0, MAX_BUS_CAPACITY - boardedCount);

  // One-Tap Boarding Action with strict 25 capacity lock
  const boardStudent = useCallback((studentId: string): { success: boolean; message?: string } => {
    if (boardedCount >= MAX_BUS_CAPACITY) {
      soundFx.playCapacityFull();
      return {
        success: false,
        message: `اكتمل العدد الأقصى للمقاعد (${MAX_BUS_CAPACITY} راكب)! تم قفل الصعود تلقائياً.`
      };
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'الاسم غير موجود' };

    const timeStr = formatCurrentTimeArabic();
    const newSeatNumber = boardedCount + 1;
    const logKey = `${studentId}_${todayStr}`;

    const newEntry: BoardingLogEntry = {
      id: logKey,
      studentId: student.id,
      studentName: student.name,
      isSupervisor: student.isSupervisor,
      date: todayStr,
      boardedAtTime: timeStr,
      timestamp: Date.now(),
      seatNumber: newSeatNumber,
      status: 'boarded',
    };

    setLogs(prev => ({
      ...prev,
      [logKey]: newEntry,
    }));

    if (newSeatNumber >= MAX_BUS_CAPACITY) {
      soundFx.playCapacityFull();
    } else {
      soundFx.playBoarding();
    }

    return { success: true };
  }, [boardedCount, students, todayStr]);

  // Undo boarding
  const undoBoarding = useCallback((studentId: string) => {
    const logKey = `${studentId}_${todayStr}`;
    setLogs(prev => {
      if (!prev[logKey]) return prev;
      const copy = { ...prev };
      delete copy[logKey];

      // Re-index seat numbers
      const remainingLogs = Object.values(copy).filter(
        l => l.date === todayStr && l.status === 'boarded'
      ).sort((a, b) => a.timestamp - b.timestamp);

      remainingLogs.forEach((item, index) => {
        copy[`${item.studentId}_${todayStr}`] = {
          ...item,
          seatNumber: index + 1,
        };
      });

      return copy;
    });

    soundFx.playUndo();
  }, [todayStr]);

  // Mark absent
  const markAbsent = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const logKey = `${studentId}_${todayStr}`;
    const timeStr = formatCurrentTimeArabic();

    setLogs(prev => ({
      ...prev,
      [logKey]: {
        id: logKey,
        studentId: student.id,
        studentName: student.name,
        isSupervisor: student.isSupervisor,
        date: todayStr,
        boardedAtTime: timeStr,
        timestamp: Date.now(),
        seatNumber: 0,
        status: 'absent',
      },
    }));

    soundFx.playAbsent();
  }, [students, todayStr]);

  // Undo absent
  const undoAbsent = useCallback((studentId: string) => {
    const logKey = `${studentId}_${todayStr}`;
    setLogs(prev => {
      if (!prev[logKey]) return prev;
      const copy = { ...prev };
      delete copy[logKey];
      return copy;
    });
    soundFx.playUndo();
  }, [todayStr]);

  // Start new day
  const startNewDay = useCallback(() => {
    setLogs(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(key => {
        const item = copy[key];
        if (item.date === todayStr) {
          delete copy[key];
        }
      });
      return copy;
    });
  }, [todayStr]);

  // Add single student
  const addStudent = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const id = `std_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const studentObj: Student = {
      id,
      name: trimmed,
    };
    setStudents(prev => [...prev, studentObj]);
    return studentObj;
  }, []);

  // Bulk add students from list of names
  const addBulkStudents = useCallback((names: string[]) => {
    const validNames = names
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (validNames.length === 0) return 0;

    const newStudents: Student[] = validNames.map((name, idx) => ({
      id: `std_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      name,
    }));

    setStudents(prev => [...prev, ...newStudents]);
    return newStudents.length;
  }, []);

  // Delete student
  const deleteStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setLogs(prev => {
      const copy = { ...prev };
      delete copy[`${studentId}_${todayStr}`];
      return copy;
    });
  }, [todayStr]);

  // Clear all students
  const clearAllStudents = useCallback(() => {
    setStudents([]);
    setLogs({});
  }, []);

  // Reset to Maher's default list
  const resetToDefaultRoster = useCallback(() => {
    setStudents(INITIAL_STUDENTS);
  }, []);

  return {
    todayStr,
    supervisorName,
    setSupervisorName,
    departureTime,
    setDepartureTime,
    students,
    waitingStudents,
    boardedStudents,
    absentList,
    boardedCount,
    isCapacityFull,
    remainingSeats,
    maxCapacity: MAX_BUS_CAPACITY,
    soundEnabled,
    toggleSound,
    boardStudent,
    undoBoarding,
    markAbsent,
    undoAbsent,
    startNewDay,
    addStudent,
    addBulkStudents,
    deleteStudent,
    clearAllStudents,
    resetToDefaultRoster,
  };
}
