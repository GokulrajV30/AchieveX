// ─────────────────────────────────────────────────────────────
// AchieveX — College Overview Interactive Drill-Down Data
// Multi-College SaaS Scope: Nandha Engineering College
// Aggregates verified student and faculty achievements department-wise
// and person-wise. Guarantees sum(departments) === college total.
// ─────────────────────────────────────────────────────────────

export interface CollegeDepartmentBreakdown {
  id: string;
  code: string;
  name: string;
  countLabel: string; // e.g. "186 Students" or "24 Faculty"
  peopleCount: number;
  verifiedAchievementsCount: number;
}

export interface CollegePersonSummary {
  id: string;
  name: string;
  registerNumber?: string;
  designation?: string;
  year?: string;
  semester?: string;
  departmentCode: string;
  departmentName: string;
  verifiedAchievementsCount: number;
  points?: number;
  targetRole: 'student' | 'faculty';
}

// ─────────────────────────────────────────────────────────────
// DEPARTMENTS MASTER DATA
// ─────────────────────────────────────────────────────────────

export const COLLEGE_DEPARTMENTS_MASTER = [
  {
    id: 'CSE_IOT',
    code: 'CSE (IoT)',
    name: 'Computer Science & Engineering (IoT)',
    studentCount: 186,
    facultyCount: 24,
    studentAchievements: 624,
    facultyAchievements: 186,
  },
  {
    id: 'CSE',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    studentCount: 204,
    facultyCount: 28,
    studentAchievements: 782,
    facultyAchievements: 214,
  },
  {
    id: 'IT',
    code: 'IT',
    name: 'Information Technology',
    studentCount: 164,
    facultyCount: 20,
    studentAchievements: 536,
    facultyAchievements: 158,
  },
  {
    id: 'AIDS',
    code: 'AIDS',
    name: 'Artificial Intelligence & Data Science',
    studentCount: 172,
    facultyCount: 22,
    studentAchievements: 491,
    facultyAchievements: 142,
  },
  {
    id: 'ECE',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    studentCount: 190,
    facultyCount: 26,
    studentAchievements: 668,
    facultyAchievements: 196,
  },
  {
    id: 'EEE',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    studentCount: 148,
    facultyCount: 18,
    studentAchievements: 521,
    facultyAchievements: 138,
  },
  {
    id: 'BME',
    code: 'BME',
    name: 'Biomedical Engineering',
    studentCount: 124,
    facultyCount: 16,
    studentAchievements: 364,
    facultyAchievements: 114,
  },
  {
    id: 'CSE_CYBER',
    code: 'CSE (Cyber)',
    name: 'Computer Science & Engineering (Cyber Security)',
    studentCount: 112,
    facultyCount: 14,
    studentAchievements: 300,
    facultyAchievements: 96,
  },
];

// Calculate institution-wide verified totals
export const COLLEGE_TOTAL_STUDENT_ACHIEVEMENTS = COLLEGE_DEPARTMENTS_MASTER.reduce(
  (sum, d) => sum + d.studentAchievements,
  0
); // 4,286

export const COLLEGE_TOTAL_FACULTY_ACHIEVEMENTS = COLLEGE_DEPARTMENTS_MASTER.reduce(
  (sum, d) => sum + d.facultyAchievements,
  0
); // 1,248

// ─────────────────────────────────────────────────────────────
// DETAILED STUDENTS PER DEPARTMENT
// ─────────────────────────────────────────────────────────────

export const COLLEGE_DEPARTMENT_STUDENTS: Record<string, CollegePersonSummary[]> = {
  'CSE (IoT)': [
    {
      id: 's11',
      name: 'Gokulraj V',
      registerNumber: '23CSIoT041',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 12,
      points: 240,
      targetRole: 'student',
    },
    {
      id: 's22',
      name: 'Jishnu K',
      registerNumber: '23CSIoT022',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 9,
      points: 185,
      targetRole: 'student',
    },
    {
      id: 's18',
      name: 'Hamsha N',
      registerNumber: '23CSIoT018',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 8,
      points: 160,
      targetRole: 'student',
    },
    {
      id: 's15',
      name: 'Mohamed Aqdhas',
      registerNumber: '23CSIoT015',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 6,
      points: 130,
      targetRole: 'student',
    },
    {
      id: 's19',
      name: 'Jeeva M',
      registerNumber: '23CSIoT019',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 5,
      points: 110,
      targetRole: 'student',
    },
    {
      id: 's24',
      name: 'Karthikeyan M',
      registerNumber: '23CSIoT024',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 4,
      points: 85,
      targetRole: 'student',
    },
    {
      id: 's62',
      name: 'Vignesh R',
      registerNumber: '24CSIoT062',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 5,
      points: 95,
      targetRole: 'student',
    },
    {
      id: 's51',
      name: 'Sneha R',
      registerNumber: '25CSIoT051',
      year: '1st Year',
      semester: 'Semester 1',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 3,
      points: 60,
      targetRole: 'student',
    },
    {
      id: 's31',
      name: 'Sathishkumar S',
      registerNumber: '23CSIoT031',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 4,
      points: 80,
      targetRole: 'student',
    },
    {
      id: 's20',
      name: 'Deepika R',
      registerNumber: '23CSIoT020',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 4,
      points: 75,
      targetRole: 'student',
    },
  ],
  CSE: [
    {
      id: 'cs-stu-1',
      name: 'Arun Kumar S',
      registerNumber: '22CS014',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 14,
      points: 290,
      targetRole: 'student',
    },
    {
      id: 'cs-stu-2',
      name: 'Divya Bharathi P',
      registerNumber: '22CS022',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 11,
      points: 235,
      targetRole: 'student',
    },
    {
      id: 'cs-stu-3',
      name: 'Dharani K',
      registerNumber: '23CS034',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 8,
      points: 170,
      targetRole: 'student',
    },
    {
      id: 'cs-stu-4',
      name: 'Keerthana M',
      registerNumber: '23CS064',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 6,
      points: 125,
      targetRole: 'student',
    },
    {
      id: 'cs-stu-5',
      name: 'Meena S',
      registerNumber: '24CS009',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 5,
      points: 105,
      targetRole: 'student',
    },
    {
      id: 'cs-stu-6',
      name: 'Ashwin Balaji R',
      registerNumber: '25CS012',
      year: '1st Year',
      semester: 'Semester 1',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 2,
      points: 45,
      targetRole: 'student',
    },
  ],
  IT: [
    {
      id: 'it-stu-1',
      name: 'Praveen K',
      registerNumber: '22IT078',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 10,
      points: 215,
      targetRole: 'student',
    },
    {
      id: 'it-stu-2',
      name: 'Pavithra S',
      registerNumber: '23IT045',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 7,
      points: 155,
      targetRole: 'student',
    },
    {
      id: 'it-stu-3',
      name: 'Deepak V',
      registerNumber: '24IT019',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 5,
      points: 110,
      targetRole: 'student',
    },
    {
      id: 'it-stu-4',
      name: 'Rohit K',
      registerNumber: '25IT062',
      year: '1st Year',
      semester: 'Semester 1',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 3,
      points: 65,
      targetRole: 'student',
    },
  ],
  AIDS: [
    {
      id: 'ad-stu-1',
      name: 'Vikram S',
      registerNumber: '23AD042',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 11,
      points: 245,
      targetRole: 'student',
    },
    {
      id: 'ad-stu-2',
      name: 'Ananya M',
      registerNumber: '23AD012',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 8,
      points: 180,
      targetRole: 'student',
    },
    {
      id: 'ad-stu-3',
      name: 'Siddharth R',
      registerNumber: '24AD088',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 6,
      points: 130,
      targetRole: 'student',
    },
    {
      id: 'ad-stu-4',
      name: 'Kavya T',
      registerNumber: '25AD031',
      year: '1st Year',
      semester: 'Semester 1',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 3,
      points: 70,
      targetRole: 'student',
    },
  ],
  ECE: [
    {
      id: 'ec-stu-1',
      name: 'Dinesh Kumar T',
      registerNumber: '22EC055',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'ECE',
      departmentName: 'Electronics & Communication Engineering',
      verifiedAchievementsCount: 13,
      points: 275,
      targetRole: 'student',
    },
    {
      id: 'ec-stu-2',
      name: 'Vijay R',
      registerNumber: '23EC018',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'ECE',
      departmentName: 'Electronics & Communication Engineering',
      verifiedAchievementsCount: 8,
      points: 165,
      targetRole: 'student',
    },
    {
      id: 'ec-stu-3',
      name: 'Monisha S',
      registerNumber: '24EC039',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'ECE',
      departmentName: 'Electronics & Communication Engineering',
      verifiedAchievementsCount: 5,
      points: 110,
      targetRole: 'student',
    },
  ],
  EEE: [
    {
      id: 'ee-stu-1',
      name: 'Karthik Raja S',
      registerNumber: '22EE028',
      year: '4th Year',
      semester: 'Semester 7',
      departmentCode: 'EEE',
      departmentName: 'Electrical & Electronics Engineering',
      verifiedAchievementsCount: 11,
      points: 230,
      targetRole: 'student',
    },
    {
      id: 'ee-stu-2',
      name: 'Anitha B',
      registerNumber: '24EE002',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'EEE',
      departmentName: 'Electrical & Electronics Engineering',
      verifiedAchievementsCount: 6,
      points: 125,
      targetRole: 'student',
    },
  ],
  BME: [
    {
      id: 'bm-stu-1',
      name: 'Meenakshi N',
      registerNumber: '23BM019',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'BME',
      departmentName: 'Biomedical Engineering',
      verifiedAchievementsCount: 9,
      points: 195,
      targetRole: 'student',
    },
    {
      id: 'bm-stu-2',
      name: 'Sowmya G',
      registerNumber: '24BM041',
      year: '2nd Year',
      semester: 'Semester 3',
      departmentCode: 'BME',
      departmentName: 'Biomedical Engineering',
      verifiedAchievementsCount: 5,
      points: 110,
      targetRole: 'student',
    },
  ],
  'CSE (Cyber)': [
    {
      id: 'csb-stu-1',
      name: 'Harish Babu',
      registerNumber: '23CSB029',
      year: '3rd Year',
      semester: 'Semester 5',
      departmentCode: 'CSE (Cyber)',
      departmentName: 'Computer Science & Engineering (Cyber Security)',
      verifiedAchievementsCount: 8,
      points: 175,
      targetRole: 'student',
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// DETAILED FACULTY PER DEPARTMENT
// ─────────────────────────────────────────────────────────────

export const COLLEGE_DEPARTMENT_FACULTY: Record<string, CollegePersonSummary[]> = {
  'CSE (IoT)': [
    {
      id: 'fac-1',
      name: 'Dr. Priya S',
      designation: 'Assistant Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 14,
      points: 295,
      targetRole: 'faculty',
    },
    {
      id: 'fac-9',
      name: 'Mr. Kumar R',
      designation: 'Associate Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 11,
      points: 240,
      targetRole: 'faculty',
    },
    {
      id: 'fac-3',
      name: 'Ms. Anitha M',
      designation: 'Associate Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 17,
      points: 360,
      targetRole: 'faculty',
    },
    {
      id: 'fac-2',
      name: 'Mr. Karthik R',
      designation: 'Assistant Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 8,
      points: 175,
      targetRole: 'faculty',
    },
    {
      id: 'fac-6',
      name: 'Dr. Ramesh Kumar',
      designation: 'Assistant Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 10,
      points: 210,
      targetRole: 'faculty',
    },
    {
      id: 'fac-7',
      name: 'Mr. Vignesh P',
      designation: 'Assistant Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 6,
      points: 130,
      targetRole: 'faculty',
    },
    {
      id: 'fac-8',
      name: 'Ms. Deepika T',
      designation: 'Assistant Professor',
      departmentCode: 'CSE (IoT)',
      departmentName: 'Computer Science & Engineering (IoT)',
      verifiedAchievementsCount: 7,
      points: 150,
      targetRole: 'faculty',
    },
  ],
  CSE: [
    {
      id: 'cs-fac-1',
      name: 'Dr. Rajesh K',
      designation: 'Professor & HOD',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 18,
      points: 390,
      targetRole: 'faculty',
    },
    {
      id: 'cs-fac-2',
      name: 'Dr. Manickam K',
      designation: 'Professor',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 15,
      points: 320,
      targetRole: 'faculty',
    },
    {
      id: 'cs-fac-3',
      name: 'Mrs. Jayanthi V',
      designation: 'Associate Professor',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 12,
      points: 250,
      targetRole: 'faculty',
    },
    {
      id: 'cs-fac-4',
      name: 'Mr. Soundararajan M',
      designation: 'Assistant Professor',
      departmentCode: 'CSE',
      departmentName: 'Computer Science & Engineering',
      verifiedAchievementsCount: 9,
      points: 195,
      targetRole: 'faculty',
    },
  ],
  IT: [
    {
      id: 'it-fac-1',
      name: 'Dr. Saravanan K',
      designation: 'Professor & HOD',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 16,
      points: 340,
      targetRole: 'faculty',
    },
    {
      id: 'it-fac-2',
      name: 'Mrs. Deepa K',
      designation: 'Associate Professor',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 12,
      points: 260,
      targetRole: 'faculty',
    },
    {
      id: 'it-fac-3',
      name: 'Mr. Balaji S',
      designation: 'Assistant Professor',
      departmentCode: 'IT',
      departmentName: 'Information Technology',
      verifiedAchievementsCount: 8,
      points: 170,
      targetRole: 'faculty',
    },
  ],
  AIDS: [
    {
      id: 'ad-fac-1',
      name: 'Dr. Deepa N',
      designation: 'Professor & HOD',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 15,
      points: 330,
      targetRole: 'faculty',
    },
    {
      id: 'ad-fac-2',
      name: 'Dr. Karthikeyan B',
      designation: 'Associate Professor',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 11,
      points: 240,
      targetRole: 'faculty',
    },
    {
      id: 'ad-fac-3',
      name: 'Mrs. Shanthi P',
      designation: 'Assistant Professor',
      departmentCode: 'AIDS',
      departmentName: 'Artificial Intelligence & Data Science',
      verifiedAchievementsCount: 9,
      points: 190,
      targetRole: 'faculty',
    },
  ],
  ECE: [
    {
      id: 'ec-fac-1',
      name: 'Dr. Suresh M',
      designation: 'Professor & HOD',
      departmentCode: 'ECE',
      departmentName: 'Electronics & Communication Engineering',
      verifiedAchievementsCount: 17,
      points: 370,
      targetRole: 'faculty',
    },
    {
      id: 'ec-fac-2',
      name: 'Dr. Lakshmi K S',
      designation: 'Dean & Professor',
      departmentCode: 'ECE',
      departmentName: 'Electronics & Communication Engineering',
      verifiedAchievementsCount: 14,
      points: 310,
      targetRole: 'faculty',
    },
    {
      id: 'ec-fac-3',
      name: 'Mr. Saravanan B',
      designation: 'Assistant Professor',
      departmentCode: 'ECE',
      departmentName: 'Electronics & Communication Engineering',
      verifiedAchievementsCount: 10,
      points: 215,
      targetRole: 'faculty',
    },
  ],
  EEE: [
    {
      id: 'ee-fac-1',
      name: 'Dr. Ramesh V',
      designation: 'Professor & HOD',
      departmentCode: 'EEE',
      departmentName: 'Electrical & Electronics Engineering',
      verifiedAchievementsCount: 14,
      points: 300,
      targetRole: 'faculty',
    },
    {
      id: 'ee-fac-2',
      name: 'Mr. Manikandan G',
      designation: 'Associate Professor',
      departmentCode: 'EEE',
      departmentName: 'Electrical & Electronics Engineering',
      verifiedAchievementsCount: 9,
      points: 190,
      targetRole: 'faculty',
    },
  ],
  BME: [
    {
      id: 'bm-fac-1',
      name: 'Dr. Malathi K',
      designation: 'Professor & HOD',
      departmentCode: 'BME',
      departmentName: 'Biomedical Engineering',
      verifiedAchievementsCount: 12,
      points: 260,
      targetRole: 'faculty',
    },
    {
      id: 'bm-fac-2',
      name: 'Dr. Usha Rani S',
      designation: 'Associate Professor',
      departmentCode: 'BME',
      departmentName: 'Biomedical Engineering',
      verifiedAchievementsCount: 8,
      points: 175,
      targetRole: 'faculty',
    },
  ],
  'CSE (Cyber)': [
    {
      id: 'csb-fac-1',
      name: 'Dr. Chandran P',
      designation: 'Professor & HOD',
      departmentCode: 'CSE (Cyber)',
      departmentName: 'Computer Science & Engineering (Cyber Security)',
      verifiedAchievementsCount: 11,
      points: 240,
      targetRole: 'faculty',
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// QUERY HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Returns department breakdown for student achievements.
 */
export function getCollegeStudentDepartmentBreakdown(): CollegeDepartmentBreakdown[] {
  return COLLEGE_DEPARTMENTS_MASTER.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    countLabel: `${d.studentCount} Students`,
    peopleCount: d.studentCount,
    verifiedAchievementsCount: d.studentAchievements,
  }));
}

/**
 * Returns department breakdown for faculty achievements.
 */
export function getCollegeFacultyDepartmentBreakdown(): CollegeDepartmentBreakdown[] {
  return COLLEGE_DEPARTMENTS_MASTER.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    countLabel: `${d.facultyCount} Faculty`,
    peopleCount: d.facultyCount,
    verifiedAchievementsCount: d.facultyAchievements,
  }));
}

/**
 * Returns filtered list of students for a selected department.
 */
export function getDepartmentStudents(
  deptCode: string,
  yearFilter: string = 'All Years',
  searchQuery: string = ''
): CollegePersonSummary[] {
  // Find key matching deptCode or normalize
  const matchingKey = Object.keys(COLLEGE_DEPARTMENT_STUDENTS).find(
    (k) => k.toLowerCase() === deptCode.toLowerCase()
  ) || 'CSE (IoT)';

  const list = COLLEGE_DEPARTMENT_STUDENTS[matchingKey] || [];
  const q = searchQuery.trim().toLowerCase();

  return list.filter((st) => {
    const matchYear =
      yearFilter === 'All Years' ||
      st.year?.toLowerCase() === yearFilter.toLowerCase();

    const matchSearch =
      !q ||
      st.name.toLowerCase().includes(q) ||
      (st.registerNumber && st.registerNumber.toLowerCase().includes(q));

    return matchYear && matchSearch;
  });
}

/**
 * Returns filtered list of faculty for a selected department.
 */
export function getDepartmentFaculty(
  deptCode: string,
  searchQuery: string = ''
): CollegePersonSummary[] {
  const matchingKey = Object.keys(COLLEGE_DEPARTMENT_FACULTY).find(
    (k) => k.toLowerCase() === deptCode.toLowerCase()
  ) || 'CSE (IoT)';

  const list = COLLEGE_DEPARTMENT_FACULTY[matchingKey] || [];
  const q = searchQuery.trim().toLowerCase();

  return list.filter((fac) => {
    if (!q) return true;
    return (
      fac.name.toLowerCase().includes(q) ||
      (fac.designation && fac.designation.toLowerCase().includes(q))
    );
  });
}

/**
 * Get department info by code or id.
 */
export function getDepartmentMeta(deptCodeOrId: string) {
  return (
    COLLEGE_DEPARTMENTS_MASTER.find(
      (d) =>
        d.code.toLowerCase() === deptCodeOrId.toLowerCase() ||
        d.id.toLowerCase() === deptCodeOrId.toLowerCase()
    ) || COLLEGE_DEPARTMENTS_MASTER[0]
  );
}
