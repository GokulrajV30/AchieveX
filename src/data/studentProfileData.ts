// ─────────────────────────────────────────────────────────────
// AchieveX — Student Profile Data & Single Source of Truth
// ─────────────────────────────────────────────────────────────

import { MOCK_ACHIEVEMENTS } from './achievementsData';

export interface AcademicBatchInfo {
  startYear: number;
  endYear: number;
  label: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  role: 'Student';
  collegeEmail: string;
  registerNumber: string;
  department: string;
  currentYear: string;
  academicBatch: AcademicBatchInfo;
  collegeName: string;
  profileImage: string | null;
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: 'student_001',
  fullName: 'Gokulraj V',
  role: 'Student',
  collegeEmail: '23ci011@nandhaengg.org',
  registerNumber: '23ci011',
  department: 'CSE(IoT)',
  currentYear: '3rd Year',
  academicBatch: {
    startYear: 2023,
    endYear: 2027,
    label: '2023 - 2027',
  },
  collegeName: 'Nandha Engineering College',
  profileImage: null,
};

export interface StudentStats {
  achievements: number;
  points: number;
  approved: number;
}

export function getStudentProfileStats(): StudentStats {
  const verifiedList = MOCK_ACHIEVEMENTS.filter(
    (a) => a.status === 'Verified'
  );
  
  return {
    achievements: MOCK_ACHIEVEMENTS.length > 0 ? MOCK_ACHIEVEMENTS.length : 12,
    points: 100, // Matched across Dashboard & Profile
    approved: verifiedList.length > 0 ? verifiedList.length : 12,
  };
}
