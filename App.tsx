/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useBusAttendance } from './hooks/useBusAttendance';
import { Header } from './components/Header';
import { TourBanner } from './components/TourBanner';
import { CapacityBar } from './components/CapacityBar';
import { SearchBar } from './components/SearchBar';
import { WaitingList } from './components/WaitingList';
import { BoardedList } from './components/BoardedList';
import { AbsentSection } from './components/AbsentSection';
import { ActionFooter } from './components/ActionFooter';
import { ExportModal } from './components/ExportModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ManageStudentsModal } from './components/ManageStudentsModal';
import { ConfirmResetModal } from './components/ConfirmResetModal';
import { PrintableReport } from './components/PrintableReport';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const {
    todayStr,
    supervisorName,
    departureTime,
    students,
    waitingStudents,
    boardedStudents,
    absentList,
    boardedCount,
    isCapacityFull,
    remainingSeats,
    maxCapacity,
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
  } = useBusAttendance();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isManageRosterOpen, setIsManageRosterOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Transient feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered waiting students based on search input
  const filteredWaitingStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return waitingStudents;
    return waitingStudents.filter(s => s.name.toLowerCase().includes(q));
  }, [waitingStudents, searchQuery]);

  // Handle board action with capacity check
  const handleBoard = (studentId: string) => {
    const res = boardStudent(studentId);
    if (!res.success && res.message) {
      showToast(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Header with Clock, Supervisor Maher Al-Saber & 07:15 Departure */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        onOpenManageRoster={() => setIsManageRosterOpen(true)}
        todayStr={todayStr}
        totalStudentsCount={students.length}
        supervisorName={supervisorName}
        departureTime={departureTime}
      />

      {/* Main Bus Supervisor Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 space-y-4 sm:space-y-5 pb-24">
        
        {/* Toast Warning */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-xl flex items-center gap-2.5 animate-bounce sticky top-16 z-40 border border-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2. Tour Info Banner (انطلاق 07:15 ص) */}
        <TourBanner
          departureTime={departureTime}
          supervisorName={supervisorName}
          boardedCount={boardedCount}
          maxCapacity={maxCapacity}
        />

        {/* 3. Passenger Capacity Gauge & Lock Alert at 25/25 */}
        <CapacityBar
          boardedCount={boardedCount}
          maxCapacity={maxCapacity}
          remainingSeats={remainingSeats}
          isCapacityFull={isCapacityFull}
        />

        {/* 4. Instant Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredWaitingStudents.length}
          totalWaitingCount={waitingStudents.length}
        />

        {/* 5. Waiting List with Maher's Students */}
        <WaitingList
          students={filteredWaitingStudents}
          onBoard={handleBoard}
          onMarkAbsent={markAbsent}
          onDeleteStudent={deleteStudent}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          isCapacityFull={isCapacityFull}
          searchQuery={searchQuery}
        />

        {/* 6. Boarded Students List (ركبوا الباص مع الوقت) */}
        <BoardedList
          boardedLogs={boardedStudents}
          onUndoBoarding={undoBoarding}
          maxCapacity={maxCapacity}
        />

        {/* 7. Absent Students List */}
        <AbsentSection
          absentLogs={absentList}
          onUndoAbsent={undoAbsent}
        />
      </main>

      {/* 8. Sticky Action Footer */}
      <ActionFooter
        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        boardedCount={boardedCount}
      />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        boardedLogs={boardedStudents}
        absentLogs={absentList}
        todayStr={todayStr}
        maxCapacity={maxCapacity}
        supervisorName={supervisorName}
        departureTime={departureTime}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddSingle={(name) => {
          addStudent(name);
          showToast(`تمت إضافة الطالب "${name}" بنجاح`);
        }}
        onAddBulk={(names) => {
          const count = addBulkStudents(names);
          showToast(`تمت إضافة ${count} أسماء جديدة بنجاح!`);
          return count;
        }}
      />

      {/* Manage / Delete Students Modal */}
      <ManageStudentsModal
        isOpen={isManageRosterOpen}
        onClose={() => setIsManageRosterOpen(false)}
        students={students}
        onDeleteStudent={(id) => {
          deleteStudent(id);
          showToast('تم حذف الاسم من القائمة');
        }}
        onClearAll={() => {
          clearAllStudents();
          showToast('تم مسح جميع الأسماء.');
        }}
        onRestoreDefaults={() => {
          resetToDefaultRoster();
          showToast('تمت استعادة قائمة طلاب الأستاذ ماهر (21 اسماً)');
        }}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
      />

      {/* Start New Day Confirmation */}
      <ConfirmResetModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={() => {
          startNewDay();
          showToast('تم بدء يوم جديد وتصفير سجل الصعود بنجاح');
        }}
      />

      {/* Printable Sheet */}
      <PrintableReport
        boardedLogs={boardedStudents}
        absentLogs={absentList}
        todayStr={todayStr}
        maxCapacity={maxCapacity}
        supervisorName={supervisorName}
        departureTime={departureTime}
      />
    </div>
  );
}
