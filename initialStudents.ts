import { Student } from '../types';

export const SUPERVISOR_NAME = 'ماهر الصابر';
export const DEPARTURE_TIME = '07:15 ص';

export const INITIAL_STUDENTS: Student[] = [
  // 1. مشرف الباص: ماهر الصابر (يسجل صعوده كأول راكب في الباص)
  { id: 'sup-maher', name: 'ماهر الصابر', isSupervisor: true },

  // قائمة الطلاب (21 طالباً)
  { id: 'std-01', name: 'حسين ابو طالب' },
  { id: 'std-02', name: 'نضال العطير' },
  { id: 'std-03', name: 'محمد ناصر عوادين' },
  { id: 'std-04', name: 'محمد مكاحله' },
  { id: 'std-05', name: 'حمزه الشقديح' },
  { id: 'std-06', name: 'إبراهيم العميصي' },
  { id: 'std-07', name: 'عبدالله يوسف' },
  { id: 'std-08', name: 'فراس العجل' },
  { id: 'std-09', name: 'ليث نصر' },
  { id: 'std-10', name: 'محمد يخدب' },
  { id: 'std-11', name: 'ايهم يخدب' },
  { id: 'std-12', name: 'عمر العجلوني' },
  { id: 'std-13', name: 'مصطفى أيوب' },
  { id: 'std-14', name: 'إبراهيم عيد' },
  { id: 'std-15', name: 'بشار عضايله' },
  { id: 'std-16', name: 'محمد الدعجه' },
  { id: 'std-17', name: 'محمود صالح' },
  { id: 'std-18', name: 'رعد المغربي' },
  { id: 'std-19', name: 'أحمد الهودلي' },
  { id: 'std-20', name: 'عبدالله السكر' },
  { id: 'std-21', name: 'محمد النعملي' },
];
