// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Workspace Data Model & Centralized Store
// Scoped to Institution (Nandha Engineering College) + Department (CSE (IoT))
// ─────────────────────────────────────────────────────────────

export interface HODUser {
  id: string;
  name: string;
  email: string;
  role: 'Head of Department';
  designation: string;
  department: {
    id: string;
    name: string;
  };
  institution: string;
  profileImage?: string;
  stats: {
    facultyCount: number;
    studentsCount: number;
    totalAchievements: number;
    pendingReviewsCount: number;
    achieversPercentage: number;
  };
}

export const HOD_DEMO_USER: HODUser = {
  id: 'HOD-CSE-001',
  name: 'Dr. Arun Kumar',
  email: 'hodiot@nandhaengg.org',
  role: 'Head of Department',
  designation: 'Professor & Head',
  department: {
    id: 'CSE_IOT',
    name: 'CSE (IoT)',
  },
  institution: 'Nandha Engineering College',
  stats: {
    facultyCount: 18,
    studentsCount: 240,
    totalAchievements: 320,
    pendingReviewsCount: 8,
    achieversPercentage: 85,
  },
};

export interface HODFacultyMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  facultyId: string;
  department: string;
  achievementsCount: number;
  verifiedCount: number;
  pendingCount: number;
  specialization: string;
  phone?: string;
  joiningDate: string;
}

import { addStudentNotification } from './notificationsData';

export const HOD_YEAR_OPTIONS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const;
export type HODYearOption = (typeof HOD_YEAR_OPTIONS)[number];

export const INITIAL_HOD_FACULTY: HODFacultyMember[] = [
  {
    id: 'fac-9',
    name: 'Mr. Rajesh K',
    email: 'rajesh.k@nandhaengg.org',
    designation: 'Assistant Professor',
    facultyId: 'FAC-CSE-007',
    department: 'CSE (IoT)',
    achievementsCount: 10,
    verifiedCount: 9,
    pendingCount: 1,
    specialization: 'Hardware Systems & Robotics',
    joiningDate: 'June 2020',
  },
  {
    id: 'fac-1',
    name: 'Dr. Priya S',
    email: 'priya.s@nandhaengg.org',
    designation: 'Assistant Professor',
    facultyId: 'FAC-CSE-014',
    department: 'CSE (IoT)',
    achievementsCount: 14,
    verifiedCount: 12,
    pendingCount: 2,
    specialization: 'Edge AI & IoT Systems',
    joiningDate: 'June 2021',
  },
  {
    id: 'fac-2',
    name: 'Mr. Karthik R',
    email: 'karthik.r@nandhaengg.org',
    designation: 'Assistant Professor',
    facultyId: 'FAC-CSE-019',
    department: 'CSE (IoT)',
    achievementsCount: 9,
    verifiedCount: 8,
    pendingCount: 1,
    specialization: 'Cloud Computing & DevOps',
    joiningDate: 'July 2022',
  },
  {
    id: 'fac-3',
    name: 'Ms. Anitha M',
    email: 'anitha.m@nandhaengg.org',
    designation: 'Associate Professor',
    facultyId: 'FAC-CSE-008',
    department: 'CSE (IoT)',
    achievementsCount: 18,
    verifiedCount: 17,
    pendingCount: 1,
    specialization: 'Deep Learning & Sensor Networks',
    joiningDate: 'January 2019',
  },
  {
    id: 'fac-4',
    name: 'Dr. Suresh K',
    email: 'suresh.k@nandhaengg.org',
    designation: 'Professor',
    facultyId: 'FAC-CSE-003',
    department: 'CSE (IoT)',
    achievementsCount: 22,
    verifiedCount: 21,
    pendingCount: 1,
    specialization: 'Embedded Systems & Wireless Protocols',
    joiningDate: 'August 2016',
  },
  {
    id: 'fac-5',
    name: 'Mr. Gokulraj V',
    email: 'gokulraj@nandhaengg.org',
    designation: 'Assistant Professor & AC',
    facultyId: 'FAC-CSE-024',
    department: 'CSE (IoT)',
    achievementsCount: 12,
    verifiedCount: 12,
    pendingCount: 0,
    specialization: 'IoT Architecture & System Design',
    joiningDate: 'July 2023',
  },
  {
    id: 'fac-6',
    name: 'Dr. Meenakshi N',
    email: 'meenakshi.n@nandhaengg.org',
    designation: 'Assistant Professor',
    facultyId: 'FAC-CSE-028',
    department: 'CSE (IoT)',
    achievementsCount: 11,
    verifiedCount: 10,
    pendingCount: 1,
    specialization: 'Cyber Physical Security',
    joiningDate: 'September 2022',
  },
  {
    id: 'fac-7',
    name: 'Mr. Vignesh P',
    email: 'vignesh.p@nandhaengg.org',
    designation: 'Assistant Professor',
    facultyId: 'FAC-CSE-031',
    department: 'CSE (IoT)',
    achievementsCount: 7,
    verifiedCount: 6,
    pendingCount: 1,
    specialization: 'Industrial IoT & Automation',
    joiningDate: 'January 2024',
  },
  {
    id: 'fac-8',
    name: 'Ms. Deepika T',
    email: 'deepika.t@nandhaengg.org',
    designation: 'Assistant Professor',
    facultyId: 'FAC-CSE-033',
    department: 'CSE (IoT)',
    achievementsCount: 8,
    verifiedCount: 7,
    pendingCount: 1,
    specialization: 'Smart Agriculture & Sensors',
    joiningDate: 'November 2023',
  },
];

export interface HODStudentMember {
  id: string;
  name: string;
  rollNumber: string;
  year: string;
  semester: string;
  section: string;
  department: string;
  achievementsCount: number;
  verifiedCount: number;
  pendingCount: number;
  nptelCredits: number;
  proctorFacultyId?: string;
  mentorFacultyId?: string;
}

export const INITIAL_HOD_STUDENTS: HODStudentMember[] = [
  {
    id: 's11',
    name: 'Gokulraj V',
    rollNumber: '23CI011',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 6,
    verifiedCount: 5,
    pendingCount: 1,
    nptelCredits: 3,
  },
  {
    id: 's15',
    name: 'Mohamed Aqdhas',
    rollNumber: '23CI015',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 4,
    verifiedCount: 3,
    pendingCount: 1,
    nptelCredits: 3,
    proctorFacultyId: 'fac-9',
    mentorFacultyId: 'fac-1',
  },
  {
    id: 's14',
    name: 'Karthikeyan M',
    rollNumber: '23CI014',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 3,
    verifiedCount: 2,
    pendingCount: 1,
    nptelCredits: 2,
    proctorFacultyId: undefined,
    mentorFacultyId: undefined,
  },
  {
    id: 's32',
    name: 'Jeeva M',
    rollNumber: '23CI032',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 3,
    verifiedCount: 2,
    pendingCount: 1,
    nptelCredits: 2,
  },
  {
    id: 's31',
    name: 'Sathishkumar S',
    rollNumber: '23CI031',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 3,
    verifiedCount: 2,
    pendingCount: 1,
    nptelCredits: 0,
  },
  {
    id: 's01',
    name: 'Aakash K',
    rollNumber: '23CI001',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 5,
    verifiedCount: 4,
    pendingCount: 1,
    nptelCredits: 3,
  },
  {
    id: 's22',
    name: 'Naveen Kumar P',
    rollNumber: '23CI022',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section B',
    department: 'CSE (IoT)',
    achievementsCount: 4,
    verifiedCount: 4,
    pendingCount: 0,
    nptelCredits: 2,
  },
  {
    id: 's18',
    name: 'Monisha R',
    rollNumber: '23CI018',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'Section B',
    department: 'CSE (IoT)',
    achievementsCount: 5,
    verifiedCount: 5,
    pendingCount: 0,
    nptelCredits: 3,
  },
  {
    id: 's40',
    name: 'Vijay S',
    rollNumber: '22CI045',
    year: '4th Year',
    semester: 'Semester 8',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 7,
    verifiedCount: 7,
    pendingCount: 0,
    nptelCredits: 6,
  },
  {
    id: 's50',
    name: 'Swetha B',
    rollNumber: '24CI012',
    year: '2nd Year',
    semester: 'Semester 4',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 2,
    verifiedCount: 1,
    pendingCount: 1,
    nptelCredits: 0,
  },
  // 1st Year Students
  {
    id: 's001',
    name: 'Aravind K',
    rollNumber: '25CI001',
    year: '1st Year',
    semester: 'Semester 2',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 2,
    verifiedCount: 2,
    pendingCount: 0,
    nptelCredits: 0,
  },
  {
    id: 's008',
    name: 'Bhavya R',
    rollNumber: '25CI008',
    year: '1st Year',
    semester: 'Semester 2',
    section: 'Section A',
    department: 'CSE (IoT)',
    achievementsCount: 1,
    verifiedCount: 1,
    pendingCount: 0,
    nptelCredits: 0,
  },
  {
    id: 's015',
    name: 'Chandran S',
    rollNumber: '25CI015',
    year: '1st Year',
    semester: 'Semester 2',
    section: 'Section B',
    department: 'CSE (IoT)',
    achievementsCount: 2,
    verifiedCount: 1,
    pendingCount: 1,
    nptelCredits: 0,
  },
  {
    id: 's021',
    name: 'Divya M',
    rollNumber: '25CI021',
    year: '1st Year',
    semester: 'Semester 2',
    section: 'Section B',
    department: 'CSE (IoT)',
    achievementsCount: 1,
    verifiedCount: 1,
    pendingCount: 0,
    nptelCredits: 0,
  },
];

export interface ProctorAssignment {
  id: string;
  institutionId: string;
  departmentId: string;
  facultyId: string;
  academicYear: string;
  year: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'All Years'
  section: string; // 'Section A' | 'Section B' | 'All Sections'
  assignedByHodId: string;
  assignedAt: string;
  status: 'active' | 'removed';
}

export interface ProctorStudent {
  id: string;
  proctorAssignmentId: string;
  facultyId: string;
  studentId: string;
  addedByFacultyId: string;
  addedAt: string;
  removedAt?: string;
  status: 'active' | 'removed';
}

export interface ProjectMember {
  id: string;
  projectId: string;
  studentId: string;
  name: string;
  registerNumber: string;
  department: string;
  yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  role: 'team_leader' | 'team_member' | 'project_owner';
  responsibility?: string;
  addedAt: string;
  status: 'active' | 'removed';
}

export interface ProjectTeam {
  id: string;
  institutionId: string;
  departmentId: string;
  title: string;
  description: string;
  domain: string;
  projectType: 'team' | 'individual';
  projectCategory?: 'Mini Project' | 'Final Year Project' | 'Academic Project' | 'Research Project' | 'Other' | string;
  customProjectType?: string;
  customDomain?: string;
  participationType?: 'Individual' | 'Team';
  problemStatement?: string;
  teamName?: string;
  teamLeaderId: string;
  teamLeaderName: string;
  teamLeaderRoll: string;
  academicYear: string;
  studentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  mentorFacultyId?: string;
  mentorName?: string;
  createdByStudentId: string;
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'completed' | 'draft' | string;
  members: ProjectMember[];
}

export const INITIAL_PROCTOR_ASSIGNMENTS: ProctorAssignment[] = [
  {
    id: 'pa-1',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    facultyId: 'fac-9', // Mr. Rajesh K
    academicYear: '2026–27',
    year: '3rd Year',
    section: 'Section A',
    assignedByHodId: 'HOD-CSE-001',
    assignedAt: '1 Aug 2026',
    status: 'active',
  },
  {
    id: 'pa-2',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    facultyId: 'fac-1', // Dr. Priya S
    academicYear: '2026–27',
    year: '2nd Year',
    section: 'Section B',
    assignedByHodId: 'HOD-CSE-001',
    assignedAt: '1 Aug 2026',
    status: 'active',
  },
  {
    id: 'pa-3',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    facultyId: 'fac-4', // Dr. Suresh K
    academicYear: '2026–27',
    year: '4th Year',
    section: 'Section A',
    assignedByHodId: 'HOD-CSE-001',
    assignedAt: '1 Aug 2026',
    status: 'active',
  },
  {
    id: 'pa-4',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    facultyId: 'fac-2', // Mr. Karthik R
    academicYear: '2026–27',
    year: '1st Year',
    section: 'Section A',
    assignedByHodId: 'HOD-CSE-001',
    assignedAt: '10 Aug 2026',
    status: 'active',
  },
];

export const INITIAL_PROCTOR_STUDENTS: ProctorStudent[] = [
  // Mr. Rajesh K (fac-9) scope: 3rd Year Section A
  {
    id: 'ps-1',
    proctorAssignmentId: 'pa-1',
    facultyId: 'fac-9',
    studentId: 's11', // Gokulraj V
    addedByFacultyId: 'fac-9',
    addedAt: '2 Aug 2026',
    status: 'active',
  },
  {
    id: 'ps-2',
    proctorAssignmentId: 'pa-1',
    facultyId: 'fac-9',
    studentId: 's15', // Mohamed Aqdhas
    addedByFacultyId: 'fac-9',
    addedAt: '2 Aug 2026',
    status: 'active',
  },
  {
    id: 'ps-3',
    proctorAssignmentId: 'pa-1',
    facultyId: 'fac-9',
    studentId: 's31', // Sathishkumar
    addedByFacultyId: 'fac-9',
    addedAt: '2 Aug 2026',
    status: 'active',
  },
  // Dr. Suresh K (fac-4) scope: 4th Year Section A
  {
    id: 'ps-4',
    proctorAssignmentId: 'pa-3',
    facultyId: 'fac-4',
    studentId: 's32', // Jeeva M
    addedByFacultyId: 'fac-4',
    addedAt: '2 Aug 2026',
    status: 'active',
  },
  {
    id: 'ps-5',
    proctorAssignmentId: 'pa-3',
    facultyId: 'fac-4',
    studentId: 's01', // Aakash K
    addedByFacultyId: 'fac-4',
    addedAt: '2 Aug 2026',
    status: 'active',
  },
  // Mr. Karthik R (fac-2) scope: 1st Year Section A
  {
    id: 'ps-6',
    proctorAssignmentId: 'pa-4',
    facultyId: 'fac-2',
    studentId: 's001', // Aravind K
    addedByFacultyId: 'fac-2',
    addedAt: '11 Aug 2026',
    status: 'active',
  },
];

export const INITIAL_PROJECT_TEAMS: ProjectTeam[] = [
  // 1. Terra View (Dr. Priya S is Mentor)
  {
    id: 'proj-1',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Terra View',
    teamName: 'Code Nexuss',
    projectCategory: 'Final Year Project',
    projectType: 'team',
    participationType: 'Team',
    domain: 'AIoT',
    problemStatement:
      'Manual soil and micro-climate observation leads to delayed disease detection and sub-optimal irrigation scheduling for smallholder farming.',
    description:
      'IoT-based agricultural terrain monitoring and environmental sensor telemetry for crop intelligence and precision agriculture.',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    teamLeaderId: 's11',
    teamLeaderName: 'Gokulraj V',
    teamLeaderRoll: '23CI011',
    mentorFacultyId: 'fac-1', // Dr. Priya S
    mentorName: 'Dr. Priya S',
    createdByStudentId: 's11',
    createdAt: '15 Jul 2026',
    status: 'active',
    members: [
      {
        id: 'pm-1',
        projectId: 'proj-1',
        studentId: 's11',
        name: 'Gokulraj V',
        registerNumber: '23CI011',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_leader',
        responsibility: 'UI/UX & Frontend Architecture',
        addedAt: '15 Jul 2026',
        status: 'active',
      },
      {
        id: 'pm-2',
        projectId: 'proj-1',
        studentId: 's18',
        name: 'Hamsha S',
        registerNumber: '23CI018',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_member',
        responsibility: 'Hardware & Sensor Telemetry',
        addedAt: '15 Jul 2026',
        status: 'active',
      },
      {
        id: 'pm-3',
        projectId: 'proj-1',
        studentId: 's22',
        name: 'Jishnu K',
        registerNumber: '23CI022',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_member',
        responsibility: 'Backend & APIs',
        addedAt: '15 Jul 2026',
        status: 'active',
      },
    ],
  },
  // 2. AI Resume Analyzer (Dr. Priya S is Mentor)
  {
    id: 'proj-2',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'AI Resume Analyzer',
    description: 'NLP and deep learning candidate skill extraction and ATS benchmark analyzer for campus placements.',
    domain: 'Artificial Intelligence',
    projectType: 'individual',
    teamLeaderId: 's15',
    teamLeaderName: 'Mohamed Aqdhas',
    teamLeaderRoll: '23CI015',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: 'fac-1', // Dr. Priya S
    createdByStudentId: 's15',
    createdAt: '20 Jul 2026',
    status: 'active',
    members: [
      {
        id: 'pm-4',
        projectId: 'proj-2',
        studentId: 's15',
        name: 'Mohamed Aqdhas',
        registerNumber: '23CI015',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'project_owner',
        addedAt: '20 Jul 2026',
        status: 'active',
      },
    ],
  },
  // 3. Smart Irrigation System (Unassigned - awaiting mentor)
  {
    id: 'proj-3',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Smart Irrigation System',
    description: 'Automated LoRa soil moisture sensing network with solar pump modulation for water conservation.',
    domain: 'IoT',
    projectType: 'team',
    teamName: 'AgroTech',
    teamLeaderId: 's15',
    teamLeaderName: 'Mohamed Aqdhas',
    teamLeaderRoll: '23CI015',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting HOD Mentor Assignment!
    createdByStudentId: 's15',
    createdAt: '1 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-5',
        projectId: 'proj-3',
        studentId: 's15',
        name: 'Mohamed Aqdhas',
        registerNumber: '23CI015',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_leader',
        addedAt: '1 Aug 2026',
        status: 'active',
      },
      {
        id: 'pm-6',
        projectId: 'proj-3',
        studentId: 's32',
        name: 'Jeeva M',
        registerNumber: '23CI019',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_member',
        addedAt: '1 Aug 2026',
        status: 'active',
      },
      {
        id: 'pm-7',
        projectId: 'proj-3',
        studentId: 's31',
        name: 'Sathishkumar S',
        registerNumber: '23CI031',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_member',
        addedAt: '1 Aug 2026',
        status: 'active',
      },
    ],
  },
  // 4. AI Attendance System (Dr. Suresh K)
  {
    id: 'proj-4',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'AI Attendance System',
    description: 'Real-time multi-face biometric verification for lecture halls using edge computing.',
    domain: 'Artificial Intelligence',
    projectType: 'team',
    teamName: 'Team Innovators',
    teamLeaderId: 's01',
    teamLeaderName: 'Aakash K',
    teamLeaderRoll: '23CI001',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: 'fac-4', // Dr. Suresh K
    createdByStudentId: 's01',
    createdAt: '25 Jul 2026',
    status: 'active',
    members: [
      {
        id: 'pm-8',
        projectId: 'proj-4',
        studentId: 's01',
        name: 'Aakash K',
        registerNumber: '23CI001',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_leader',
        addedAt: '25 Jul 2026',
        status: 'active',
      },
      {
        id: 'pm-9',
        projectId: 'proj-4',
        studentId: 's14',
        name: 'Karthikeyan M',
        registerNumber: '23CI024',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_member',
        addedAt: '25 Jul 2026',
        status: 'active',
      },
      {
        id: 'pm-10',
        projectId: 'proj-4',
        studentId: 's34',
        name: 'Arun Kumar S',
        registerNumber: '23CI034',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_member',
        addedAt: '25 Jul 2026',
        status: 'active',
      },
    ],
  },
  // 5. Autonomous Rover Platform (Mr. Rajesh K)
  {
    id: 'proj-5',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Autonomous Rover Platform',
    description: 'Microcontroller 4-wheel rover with LiDAR obstacle avoidance and telemetry reporting.',
    domain: 'Robotics',
    projectType: 'team',
    teamName: 'RoboMinds',
    teamLeaderId: 's016',
    teamLeaderName: 'Deepak S',
    teamLeaderRoll: '24CI016',
    studentYear: '2nd Year',
    academicYear: '2026–27',
    mentorFacultyId: 'fac-9', // Mr. Rajesh K
    createdByStudentId: 's016',
    createdAt: '28 Jul 2026',
    status: 'active',
    members: [
      {
        id: 'pm-11',
        projectId: 'proj-5',
        studentId: 's016',
        name: 'Deepak S',
        registerNumber: '24CI016',
        department: 'CSE (IoT)',
        yearLabel: '2nd Year',
        role: 'team_leader',
        addedAt: '28 Jul 2026',
        status: 'active',
      },
      {
        id: 'pm-12',
        projectId: 'proj-5',
        studentId: 's062',
        name: 'Vignesh R',
        registerNumber: '24CI062',
        department: 'CSE (IoT)',
        yearLabel: '2nd Year',
        role: 'team_member',
        addedAt: '28 Jul 2026',
        status: 'active',
      },
    ],
  },
  // 6. Cyber Threat Detection Dashboard (Mr. Karthik R)
  {
    id: 'proj-6',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Cyber Threat Detection Dashboard',
    description: 'Real-time cybersecurity packet anomaly inspection and intrusion alerting dashboard.',
    domain: 'Cybersecurity',
    projectType: 'individual',
    teamLeaderId: 's27',
    teamLeaderName: 'Priya S',
    teamLeaderRoll: '23CI027',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: 'fac-2', // Mr. Karthik R
    createdByStudentId: 's27',
    createdAt: '5 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-13',
        projectId: 'proj-6',
        studentId: 's27',
        name: 'Priya S',
        registerNumber: '23CI027',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'project_owner',
        addedAt: '5 Aug 2026',
        status: 'active',
      },
    ],
  },
  // Additional unassigned projects (total 6 awaiting mentor)
  {
    id: 'proj-7',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Smart Health Diagnostics Support',
    description: 'Computer-vision assisted preliminary screening dashboard for clinical records.',
    domain: 'Healthcare',
    projectType: 'team',
    teamName: 'HealthTech',
    teamLeaderId: 's021',
    teamLeaderName: 'Divya M',
    teamLeaderRoll: '25CI021',
    studentYear: '1st Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting
    createdByStudentId: 's021',
    createdAt: '10 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-14',
        projectId: 'proj-7',
        studentId: 's021',
        name: 'Divya M',
        registerNumber: '25CI021',
        department: 'CSE (IoT)',
        yearLabel: '1st Year',
        role: 'team_leader',
        addedAt: '10 Aug 2026',
        status: 'active',
      },
    ],
  },
  {
    id: 'proj-8',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Campus Navigation AR App',
    description: 'Augmented reality mobile indoor wayfinding and building asset locator for campus.',
    domain: 'Mobile App',
    projectType: 'team',
    teamName: 'GeoAR',
    teamLeaderId: 's015',
    teamLeaderName: 'Chandran S',
    teamLeaderRoll: '25CI015',
    studentYear: '1st Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting
    createdByStudentId: 's015',
    createdAt: '12 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-15',
        projectId: 'proj-8',
        studentId: 's015',
        name: 'Chandran S',
        registerNumber: '25CI015',
        department: 'CSE (IoT)',
        yearLabel: '1st Year',
        role: 'team_leader',
        addedAt: '12 Aug 2026',
        status: 'active',
      },
    ],
  },
  {
    id: 'proj-9',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Microgrid Energy Optimizer',
    description: 'IoT energy logging and peak demand shaving algorithm for institutional solar arrays.',
    domain: 'Cloud',
    projectType: 'team',
    teamName: 'PowerGrid',
    teamLeaderId: 's008',
    teamLeaderName: 'Bhavya R',
    teamLeaderRoll: '25CI008',
    studentYear: '1st Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting
    createdByStudentId: 's008',
    createdAt: '14 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-16',
        projectId: 'proj-9',
        studentId: 's008',
        name: 'Bhavya R',
        registerNumber: '25CI008',
        department: 'CSE (IoT)',
        yearLabel: '1st Year',
        role: 'team_leader',
        addedAt: '14 Aug 2026',
        status: 'active',
      },
    ],
  },
  {
    id: 'proj-10',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Blockchain Credential Verifier',
    description: 'Decentralized verifiable credentials for academic achievements and merit seals.',
    domain: 'Web Development',
    projectType: 'individual',
    teamLeaderId: 's31',
    teamLeaderName: 'Sathishkumar S',
    teamLeaderRoll: '23CI031',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting
    createdByStudentId: 's31',
    createdAt: '16 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-17',
        projectId: 'proj-10',
        studentId: 's31',
        name: 'Sathishkumar S',
        registerNumber: '23CI031',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'project_owner',
        addedAt: '16 Aug 2026',
        status: 'active',
      },
    ],
  },
  {
    id: 'proj-11',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Autonomous Drone Delivery',
    description: 'GPS waypoint navigation and obstacle avoidance for intra-campus parcel transit.',
    domain: 'Robotics',
    projectType: 'team',
    teamName: 'AeroIoT',
    teamLeaderId: 's34',
    teamLeaderName: 'Arun Kumar S',
    teamLeaderRoll: '23CI034',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting
    createdByStudentId: 's34',
    createdAt: '18 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-18',
        projectId: 'proj-11',
        studentId: 's34',
        name: 'Arun Kumar S',
        registerNumber: '23CI034',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_leader',
        addedAt: '18 Aug 2026',
        status: 'active',
      },
    ],
  },
  {
    id: 'proj-12',
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: 'Edge AI Wildlife Monitor',
    description: 'Battery-powered solar edge camera for wildlife sanctuary perimeter surveillance.',
    domain: 'Artificial Intelligence',
    projectType: 'team',
    teamName: 'WildGuard',
    teamLeaderId: 's14',
    teamLeaderName: 'Karthikeyan M',
    teamLeaderRoll: '23CI024',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    mentorFacultyId: undefined, // Awaiting
    createdByStudentId: 's14',
    createdAt: '19 Aug 2026',
    status: 'active',
    members: [
      {
        id: 'pm-19',
        projectId: 'proj-12',
        studentId: 's14',
        name: 'Karthikeyan M',
        registerNumber: '23CI024',
        department: 'CSE (IoT)',
        yearLabel: '3rd Year',
        role: 'team_leader',
        addedAt: '19 Aug 2026',
        status: 'active',
      },
    ],
  },
];

export interface FacultyProofItem {
  id: string;
  label: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'image';
}

export type HODVerificationStatus = 'Pending' | 'Approved' | 'Correction Required' | 'Rejected';

export interface HODFacultySubmission {
  id: string;
  facultyId: string;
  facultyName: string;
  designation: string;
  department: string;
  achievementTitle: string;
  category: string;
  achievementType: string;
  organizer: string;
  level: string;
  date: string;
  submittedAt: string;
  result: string;
  semester?: string;
  academicYear: string;
  description: string;
  status: HODVerificationStatus;
  points?: number;
  correctionReason?: string;
  correctionNote?: string;
  rejectionReason?: string;
  proofs: FacultyProofItem[];
  verifiedAt?: string;
}

export const INITIAL_HOD_SUBMISSIONS: HODFacultySubmission[] = [
  {
    id: 'SUB-FAC-001',
    facultyId: 'FAC-CSE-014',
    facultyName: 'Dr. Priya S',
    designation: 'Assistant Professor',
    department: 'CSE (IoT)',
    achievementTitle: 'International Conference on IoT & Edge Intelligence',
    category: 'Research & Publication',
    achievementType: 'Research Publication',
    organizer: 'IEEE Computer Society',
    level: 'International',
    date: '28 Aug 2026',
    submittedAt: '02 Sep 2026',
    result: 'Presented & Published',
    semester: 'Semester 6',
    academicYear: '2025-2026',
    description:
      'Paper titled "Energy-Efficient Edge Intelligence for Smart Sensor Grids in IoT" accepted and published in IEEE Xplore proceedings (Scopus Indexed).',
    status: 'Pending',
    points: 25,
    proofs: [
      {
        id: 'p1',
        label: 'Conference Certificate',
        fileName: 'dr_priya_ieee_certificate.pdf',
        fileSize: '2.1 MB',
        fileType: 'pdf',
      },
      {
        id: 'p2',
        label: 'Acceptance & Publication Proof',
        fileName: 'ieee_publication_proof.pdf',
        fileSize: '850 KB',
        fileType: 'pdf',
      },
    ],
  },
  {
    id: 'SUB-FAC-002',
    facultyId: 'FAC-CSE-019',
    facultyName: 'Mr. Karthik R',
    designation: 'Assistant Professor',
    department: 'CSE (IoT)',
    achievementTitle: 'Faculty Development Programme on GenAI & Cloud Computing',
    category: 'Faculty Development',
    achievementType: 'Certification',
    organizer: 'AICTE-ATAL Academy & IIT Madras',
    level: 'National',
    date: '24 Aug 2026',
    submittedAt: '01 Sep 2026',
    result: 'Completed (Grade A)',
    semester: 'Semester 6',
    academicYear: '2025-2026',
    description:
      'Two-week intensive FDP covering Large Language Models, Multi-Agent Systems, and enterprise deployment on Azure Cloud.',
    status: 'Pending',
    points: 15,
    proofs: [
      {
        id: 'p3',
        label: 'Completion Certificate',
        fileName: 'karthik_aicte_fdp_cert.pdf',
        fileSize: '1.4 MB',
        fileType: 'pdf',
      },
    ],
  },
  {
    id: 'SUB-FAC-003',
    facultyId: 'FAC-CSE-008',
    facultyName: 'Ms. Anitha M',
    designation: 'Associate Professor',
    department: 'CSE (IoT)',
    achievementTitle: 'NPTEL Swayam Elite+Gold: Deep Learning for Vision',
    category: 'Certifications',
    achievementType: 'NPTEL Course',
    organizer: 'IIT Kharagpur / Swayam',
    level: 'National',
    date: '20 Aug 2026',
    submittedAt: '31 Aug 2026',
    result: 'Elite + Gold (92%)',
    semester: 'Semester 6',
    academicYear: '2025-2026',
    description:
      '12-week NPTEL course with top 1% national rank in Deep Learning architectures and computer vision applications.',
    status: 'Pending',
    points: 20,
    proofs: [
      {
        id: 'p4',
        label: 'NPTEL Certificate',
        fileName: 'anitha_nptel_elite_gold.pdf',
        fileSize: '1.8 MB',
        fileType: 'pdf',
      },
    ],
  },
  {
    id: 'SUB-FAC-004',
    facultyId: 'FAC-CSE-003',
    facultyName: 'Dr. Suresh K',
    designation: 'Professor',
    department: 'CSE (IoT)',
    achievementTitle: 'Patent Filing: Ultra Low Power IoT Node for Soil Telemetry',
    category: 'Research & IPR',
    achievementType: 'Patent',
    organizer: 'Indian Patent Office',
    level: 'National',
    date: '10 Aug 2026',
    submittedAt: '29 Aug 2026',
    result: 'Published',
    semester: 'Semester 6',
    academicYear: '2025-2026',
    description:
      'Application No. 202641029188 filed and published in the Official Indian Patent Gazette.',
    status: 'Correction Required',
    points: 30,
    correctionReason: 'Official gazette publication notification page missing.',
    correctionNote: 'Please attach the CBR receipt with the gazette journal page.',
    proofs: [
      {
        id: 'p5',
        label: 'Patent Filing Receipt',
        fileName: 'patent_filing_receipt.pdf',
        fileSize: '920 KB',
        fileType: 'pdf',
      },
    ],
  },
  {
    id: 'SUB-FAC-005',
    facultyId: 'FAC-CSE-014',
    facultyName: 'Dr. Priya S',
    designation: 'Assistant Professor',
    department: 'CSE (IoT)',
    achievementTitle: 'Best Paper Award — IEEE International Conference ICET',
    category: 'Awards & Recognition',
    achievementType: 'Award',
    organizer: 'IEEE Madras Section',
    level: 'International',
    date: '15 Aug 2026',
    submittedAt: '18 Aug 2026',
    result: 'Winner / 1st Prize',
    semester: 'Semester 6',
    academicYear: '2025-2026',
    description:
      'Received the Best Research Paper citation out of 142 accepted international track submissions.',
    status: 'Approved',
    points: 35,
    verifiedAt: '20 Aug 2026',
    proofs: [
      {
        id: 'p6',
        label: 'Best Paper Citation',
        fileName: 'priya_best_paper_award.pdf',
        fileSize: '1.6 MB',
        fileType: 'pdf',
      },
    ],
  },
];

export interface HODRecentActivity {
  id: string;
  title: string;
  subtitle: string;
  category: 'student_verified' | 'faculty_submitted' | 'faculty_verified' | 'hod_personal' | 'department_activity';
  timestamp: string;
  iconName: string;
  badgeColor: string;
}

export const INITIAL_HOD_ACTIVITIES: HODRecentActivity[] = [
  {
    id: 'act-1',
    title: 'Student Achievement Verified',
    subtitle: 'Smart India Hackathon 2026 • AC verified 4 student records',
    category: 'student_verified',
    timestamp: '2 hours ago',
    iconName: 'checkmark-done-circle',
    badgeColor: '#16A34A',
  },
  {
    id: 'act-2',
    title: 'Faculty Achievement Submitted',
    subtitle: 'Dr. Priya S submitted "Research Publication"',
    category: 'faculty_submitted',
    timestamp: 'Yesterday',
    iconName: 'document-text',
    badgeColor: '#2563EB',
  },
  {
    id: 'act-3',
    title: 'Faculty Achievement Verified',
    subtitle: 'Mr. Karthik R • Professional Certification verified',
    category: 'faculty_verified',
    timestamp: '2 days ago',
    iconName: 'ribbon',
    badgeColor: '#4F46E5',
  },
];

export interface HODNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'faculty_submission' | 'correction_resubmitted' | 'hod_own' | 'department_activity';
  timestamp: string;
  isRead: boolean;
  submissionId?: string;
}

export const INITIAL_HOD_NOTIFICATIONS: HODNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Faculty Submission',
    message: 'Dr. Priya S submitted a Research Publication for IEEE Conference.',
    type: 'faculty_submission',
    timestamp: '10:30 AM',
    isRead: false,
    submissionId: 'SUB-FAC-001',
  },
  {
    id: 'notif-2',
    title: 'Correction Resubmitted',
    message: 'Mr. Karthik R resubmitted the requested FDP certificate.',
    type: 'correction_resubmitted',
    timestamp: 'Yesterday',
    isRead: false,
    submissionId: 'SUB-FAC-002',
  },
  {
    id: 'notif-3',
    title: 'Your Achievement Under Review',
    message: 'Your Research Publication is under review by Principal / Administrator.',
    type: 'hod_own',
    timestamp: '3 days ago',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'Department Milestone',
    message: 'CSE (IoT) passed 300 verified achievements this academic year!',
    type: 'department_activity',
    timestamp: '5 days ago',
    isRead: true,
  },
];

export const STANDARDIZED_CORRECTION_REASONS = [
  'Certificate unclear / blurry',
  'Wrong certificate uploaded',
  'Missing proof / gazette copy',
  'Incorrect achievement details',
  'Incorrect result / score',
  'Name mismatch with record',
  'Duplicate submission',
  'Other',
];

// ─────────────────────────────────────────────────────────────
// CENTRALIZED REACTIVE STATE
// ─────────────────────────────────────────────────────────────

class HODStore {
  user: HODUser = { ...HOD_DEMO_USER };
  faculty: HODFacultyMember[] = [...INITIAL_HOD_FACULTY];
  students: HODStudentMember[] = [...INITIAL_HOD_STUDENTS];
  submissions: HODFacultySubmission[] = [...INITIAL_HOD_SUBMISSIONS];
  activities: HODRecentActivity[] = [...INITIAL_HOD_ACTIVITIES];
  notifications: HODNotificationItem[] = [...INITIAL_HOD_NOTIFICATIONS];
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  getPendingSubmissions(): HODFacultySubmission[] {
    return this.submissions.filter((s) => s.status === 'Pending');
  }

  getSubmissionById(id: string): HODFacultySubmission | undefined {
    return this.submissions.find((s) => s.id === id);
  }

  getFacultyById(id: string): HODFacultyMember | undefined {
    return this.faculty.find((f) => f.id === id || f.facultyId === id);
  }

  getStudentById(id: string): HODStudentMember | undefined {
    return this.students.find((s) => s.id === id || s.rollNumber.toLowerCase() === id.toLowerCase());
  }

  approveSubmission(submissionId: string) {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    sub.status = 'Approved';
    sub.verifiedAt = 'Today';

    // Update faculty stats
    const fac = this.faculty.find((f) => f.facultyId === sub.facultyId || f.name === sub.facultyName);
    if (fac) {
      fac.verifiedCount += 1;
      fac.pendingCount = Math.max(0, fac.pendingCount - 1);
    }

    // Update global dashboard stats
    this.user.stats.pendingReviewsCount = Math.max(
      0,
      this.submissions.filter((s) => s.status === 'Pending').length
    );

    // Prepend activity
    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'Faculty Achievement Verified',
      subtitle: `${sub.facultyName} • ${sub.achievementTitle}`,
      category: 'faculty_verified',
      timestamp: 'Just now',
      iconName: 'ribbon',
      badgeColor: '#16A34A',
    });

    this.notify();
  }

  requestCorrection(submissionId: string, reason: string, note?: string) {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    sub.status = 'Correction Required';
    sub.correctionReason = reason;
    sub.correctionNote = note;

    this.user.stats.pendingReviewsCount = Math.max(
      0,
      this.submissions.filter((s) => s.status === 'Pending').length
    );

    this.notify();
  }

  rejectSubmission(submissionId: string, reason: string) {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    sub.status = 'Rejected';
    sub.rejectionReason = reason;

    const fac = this.faculty.find((f) => f.facultyId === sub.facultyId || f.name === sub.facultyName);
    if (fac) {
      fac.pendingCount = Math.max(0, fac.pendingCount - 1);
    }

    this.user.stats.pendingReviewsCount = Math.max(
      0,
      this.submissions.filter((s) => s.status === 'Pending').length
    );

    this.notify();
  }

  markNotificationAsRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.isRead = true;
      this.notify();
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.notify();
  }

  proctorAssignments: ProctorAssignment[] = [...INITIAL_PROCTOR_ASSIGNMENTS];
  proctorStudents: ProctorStudent[] = [...INITIAL_PROCTOR_STUDENTS];
  projects: ProjectTeam[] = [...INITIAL_PROJECT_TEAMS];

  // ── PROCTOR RESPONSIBILITY (Scope-Based) ───────────────────

  getProctorAssignments(): ProctorAssignment[] {
    return this.proctorAssignments.filter((pa) => pa.status === 'active');
  }

  getProctorAssignmentForFaculty(facultyId: string): ProctorAssignment | undefined {
    return this.proctorAssignments.find(
      (pa) => (pa.facultyId === facultyId || pa.id === facultyId) && pa.status === 'active'
    );
  }

  assignFacultyProctorScope(
    facultyId: string,
    year: string,
    section: string,
    academicYear = '2026–27'
  ): ProctorAssignment {
    const fac = this.getFacultyById(facultyId);
    if (!fac) throw new Error(`Faculty not found: ${facultyId}`);

    // Deactivate previous proctor assignment for this faculty if exists
    const existing = this.proctorAssignments.find(
      (pa) => (pa.facultyId === fac.id || pa.facultyId === fac.facultyId) && pa.status === 'active'
    );
    if (existing) {
      existing.status = 'removed';
    }

    const newAssignment: ProctorAssignment = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      institutionId: 'Nandha Engineering College',
      departmentId: 'CSE_IOT',
      facultyId: fac.id,
      academicYear,
      year,
      section,
      assignedByHodId: 'HOD-CSE-001',
      assignedAt: 'Today',
      status: 'active',
    };

    this.proctorAssignments.unshift(newAssignment);

    // HOD Activity
    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'Proctor Responsibility Assigned',
      subtitle: `${fac.name} • ${year} • ${section}`,
      category: 'department_activity',
      timestamp: 'Just now',
      iconName: 'shield-checkmark',
      badgeColor: '#0F766E',
    });

    this.notify();
    return newAssignment;
  }

  updateProctorScope(
    assignmentId: string,
    year: string,
    section: string,
    academicYear: string
  ): ProctorAssignment | undefined {
    const asg = this.proctorAssignments.find((pa) => pa.id === assignmentId);
    if (!asg) return undefined;

    asg.year = year;
    asg.section = section;
    asg.academicYear = academicYear;

    const fac = this.getFacultyById(asg.facultyId);
    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'Proctor Scope Updated',
      subtitle: `${fac?.name || 'Faculty'} • ${year} • ${section}`,
      category: 'department_activity',
      timestamp: 'Just now',
      iconName: 'sync-outline',
      badgeColor: '#0891B2',
    });

    this.notify();
    return asg;
  }

  removeProctorAssignment(assignmentId: string): ProctorAssignment | undefined {
    const asg = this.proctorAssignments.find((pa) => pa.id === assignmentId);
    if (!asg) return undefined;

    asg.status = 'removed';

    // Remove active proctor students under this assignment
    this.proctorStudents.forEach((ps) => {
      if (ps.proctorAssignmentId === assignmentId) {
        ps.status = 'removed';
        ps.removedAt = 'Today';
        const st = this.getStudentById(ps.studentId);
        if (st && st.proctorFacultyId === asg.facultyId) {
          st.proctorFacultyId = undefined;
        }
      }
    });

    const fac = this.getFacultyById(asg.facultyId);
    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'Proctor Responsibility Removed',
      subtitle: `${fac?.name || 'Faculty'} • ${asg.year} • ${asg.section}`,
      category: 'department_activity',
      timestamp: 'Just now',
      iconName: 'close-circle',
      badgeColor: '#DC2626',
    });

    this.notify();
    return asg;
  }

  getProctorStudents(facultyId: string): HODStudentMember[] {
    const fac = this.getFacultyById(facultyId);
    if (!fac) return [];
    const activeStudentIds = this.proctorStudents
      .filter((ps) => (ps.facultyId === fac.id || ps.facultyId === fac.facultyId) && ps.status === 'active')
      .map((ps) => ps.studentId);
    return this.students.filter(
      (s) => activeStudentIds.includes(s.id) || activeStudentIds.includes(s.rollNumber)
    );
  }

  getEligibleStudentsForScope(year: string, section: string): HODStudentMember[] {
    return this.students.filter((st) => {
      const matchYear = year === 'All Years' || st.year === year;
      const matchSection = section === 'All Sections' || st.section === section;
      return matchYear && matchSection;
    });
  }

  addStudentsToProctor(facultyId: string, studentIds: string[]): void {
    const fac = this.getFacultyById(facultyId);
    if (!fac) return;
    const assignment = this.getProctorAssignmentForFaculty(facultyId);
    if (!assignment) return;

    studentIds.forEach((sId) => {
      const st = this.getStudentById(sId);
      if (!st) return;

      // Prevent duplicate active proctor
      const existing = this.proctorStudents.find(
        (ps) =>
          (ps.studentId === st.id || ps.studentId === st.rollNumber) &&
          ps.status === 'active' &&
          (ps.facultyId === fac.id || ps.facultyId === fac.facultyId)
      );
      if (!existing) {
        this.proctorStudents.unshift({
          id: `ps-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          proctorAssignmentId: assignment.id,
          facultyId: fac.id,
          studentId: st.id,
          addedByFacultyId: fac.id,
          addedAt: 'Today',
          status: 'active',
        });
      }
      st.proctorFacultyId = fac.id;

      // Send student notification
      addStudentNotification({
        id: `NOT_ASG_${Date.now()}_${Math.random().toString(36).substring(2, 4)}`,
        userId: st.rollNumber.toLowerCase(),
        type: 'faculty_assigned',
        title: 'New Proctor Assigned',
        message: `${fac.name} added you to their Proctor group.`,
        isRead: false,
        createdAt: 'Just now',
        timeGroup: 'TODAY',
        targetType: 'profile',
      });
    });

    this.notify();
  }

  removeStudentFromProctor(facultyId: string, studentId: string): void {
    const fac = this.getFacultyById(facultyId);
    if (!fac) return;

    const record = this.proctorStudents.find(
      (ps) =>
        (ps.facultyId === fac.id || ps.facultyId === fac.facultyId) &&
        (ps.studentId === studentId || ps.studentId === studentId.toLowerCase()) &&
        ps.status === 'active'
    );
    if (record) {
      record.status = 'removed';
      record.removedAt = 'Today';
    }

    const st = this.getStudentById(studentId);
    if (st && (st.proctorFacultyId === fac.id || st.proctorFacultyId === fac.facultyId)) {
      st.proctorFacultyId = undefined;
    }

    this.notify();
  }

  // ── PROJECT & MENTOR RESPONSIBILITY (Team-Based) ─────────────

  getAllProjects(): ProjectTeam[] {
    return this.projects;
  }

  getProjectById(projectId: string): ProjectTeam | undefined {
    return this.projects.find((p) => p.id === projectId);
  }

  getProjectsAwaitingMentor(): ProjectTeam[] {
    return this.projects.filter((p) => !p.mentorFacultyId && p.status === 'active');
  }

  getActiveProjectsCount(): number {
    return this.projects.filter((p) => p.status === 'active').length;
  }

  getProjectsForStudent(studentIdOrRoll: string): ProjectTeam[] {
    const term = studentIdOrRoll.trim().toLowerCase();
    return this.projects.filter((p) => {
      const isLeader =
        p.teamLeaderId.toLowerCase() === term ||
        p.teamLeaderRoll.toLowerCase() === term ||
        p.createdByStudentId.toLowerCase() === term;
      const isMember = p.members.some(
        (m) =>
          m.status === 'active' &&
          (m.studentId.toLowerCase() === term || m.registerNumber.toLowerCase() === term)
      );
      return isLeader || isMember;
    });
  }

  updateProject(projectId: string, updates: Partial<ProjectTeam>): ProjectTeam | undefined {
    const idx = this.projects.findIndex((p) => p.id === projectId);
    if (idx === -1) return undefined;
    this.projects[idx] = {
      ...this.projects[idx],
      ...updates,
      updatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    this.notify();
    return this.projects[idx];
  }

  deleteProject(projectId: string): boolean {
    const idx = this.projects.findIndex((p) => p.id === projectId);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    this.notify();
    return true;
  }

  getProjectsForFacultyMentor(facultyId: string): ProjectTeam[] {
    const fac = this.getFacultyById(facultyId);
    if (!fac) return [];
    return this.projects.filter(
      (p) => (p.mentorFacultyId === fac.id || p.mentorFacultyId === fac.facultyId) && p.status === 'active'
    );
  }

  getDerivedMenteesForFaculty(
    facultyId: string
  ): { student: HODStudentMember; project: ProjectTeam; role: string }[] {
    const assignedProjects = this.getProjectsForFacultyMentor(facultyId);
    const menteeMap = new Map<string, { student: HODStudentMember; project: ProjectTeam; role: string }>();

    assignedProjects.forEach((proj) => {
      proj.members.forEach((mem) => {
        if (mem.status === 'active' && !menteeMap.has(mem.studentId)) {
          const st = this.getStudentById(mem.studentId);
          if (st) {
            const roleLabel =
              mem.role === 'team_leader'
                ? 'Team Leader'
                : mem.role === 'project_owner'
                ? 'Project Owner'
                : 'Team Member';
            menteeMap.set(mem.studentId, {
              student: st,
              project: proj,
              role: roleLabel,
            });
          }
        }
      });
    });

    return Array.from(menteeMap.values());
  }

  getFacultyProjectMentoredCount(facultyId: string): number {
    return this.getProjectsForFacultyMentor(facultyId).length;
  }

  assignProjectMentor(projectId: string, facultyId: string): void {
    const project = this.getProjectById(projectId);
    const fac = this.getFacultyById(facultyId);
    if (!project || !fac) return;

    project.mentorFacultyId = fac.id;

    // Send notification to faculty
    this.notifications.unshift({
      id: `notif-pm-${Date.now()}`,
      title: 'Project Assigned',
      message: `You have been assigned as Mentor for ${project.title} • ${project.teamName || 'Project Team'}.`,
      type: 'faculty_submission',
      timestamp: 'Just now',
      isRead: false,
    });

    // Notify project members
    project.members.forEach((mem) => {
      addStudentNotification({
        id: `NOT_PRJ_MNT_${Date.now()}_${Math.random().toString(36).substring(2, 4)}`,
        userId: mem.registerNumber.toLowerCase(),
        type: 'faculty_assigned',
        title: 'Project Mentor Assigned',
        message: `${fac.name} has been assigned as Mentor for ${project.title}.`,
        isRead: false,
        createdAt: 'Just now',
        timeGroup: 'TODAY',
        targetType: 'profile',
      });
    });

    // Add HOD Activity
    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'Project Mentor Assigned',
      subtitle: `${project.title} → ${fac.name}`,
      category: 'department_activity',
      timestamp: 'Just now',
      iconName: 'school',
      badgeColor: '#0F766E',
    });

    this.notify();
  }

  changeProjectMentor(projectId: string, newFacultyId: string): void {
    this.assignProjectMentor(projectId, newFacultyId);
  }

  removeProjectMentor(projectId: string): void {
    const project = this.getProjectById(projectId);
    if (!project) return;

    const oldFaculty = project.mentorFacultyId ? this.getFacultyById(project.mentorFacultyId) : undefined;
    project.mentorFacultyId = undefined;

    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'Project Mentor Removed',
      subtitle: `${project.title} unassigned from ${oldFaculty?.name || 'Mentor'}`,
      category: 'department_activity',
      timestamp: 'Just now',
      iconName: 'close-circle',
      badgeColor: '#DC2626',
    });

    this.notify();
  }

  createProject(projectData: Partial<ProjectTeam>): ProjectTeam {
    const newProject: ProjectTeam = {
      id: projectData.id || `proj-${Date.now()}`,
      institutionId: projectData.institutionId || 'Nandha Engineering College',
      departmentId: projectData.departmentId || 'CSE_IOT',
      title: projectData.title || 'Untitled Project',
      description: projectData.description || '',
      domain: projectData.domain || 'IoT',
      projectCategory: projectData.projectCategory || 'Academic Project',
      customProjectType: projectData.customProjectType,
      customDomain: projectData.customDomain,
      participationType:
        projectData.participationType ||
        (projectData.projectType === 'individual' ? 'Individual' : 'Team'),
      problemStatement: projectData.problemStatement || '',
      projectType: projectData.projectType || 'team',
      teamName: projectData.teamName || '',
      teamLeaderId: projectData.teamLeaderId || 's11',
      teamLeaderName: projectData.teamLeaderName || 'Gokulraj V',
      teamLeaderRoll: projectData.teamLeaderRoll || '23CI011',
      studentYear: projectData.studentYear || '3rd Year',
      academicYear: projectData.academicYear || '2026–27',
      mentorFacultyId: projectData.mentorFacultyId,
      mentorName: projectData.mentorName,
      createdByStudentId: projectData.createdByStudentId || projectData.teamLeaderId || 's11',
      createdAt:
        projectData.createdAt ||
        new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: projectData.status || 'active',
      members: projectData.members || [],
    };

    this.projects.unshift(newProject);

    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: 'New Student Project Created',
      subtitle: `${newProject.title} • ${newProject.mentorName || 'Awaiting Mentor'}`,
      category: 'department_activity',
      timestamp: 'Just now',
      iconName: 'folder-outline',
      badgeColor: '#2563EB',
    });

    this.notify();
    return newProject;
  }

  // ── RESOLVERS & BACKWARD COMPATIBILITY ────────────────────

  getStudentProctor(studentId: string): HODFacultyMember | undefined {
    const student = this.getStudentById(studentId);
    if (!student) return undefined;

    const ps = this.proctorStudents.find(
      (p) => (p.studentId === student.id || p.studentId === student.rollNumber) && p.status === 'active'
    );
    if (ps) return this.getFacultyById(ps.facultyId);
    if (student.proctorFacultyId) return this.getFacultyById(student.proctorFacultyId);
    return undefined;
  }

  getStudentActiveProject(studentId: string): ProjectTeam | undefined {
    const student = this.getStudentById(studentId);
    if (!student) return undefined;

    return this.projects.find(
      (p) =>
        p.status === 'active' &&
        (p.teamLeaderId === student.id ||
          p.teamLeaderRoll === student.rollNumber ||
          p.members.some(
            (m) =>
              (m.studentId === student.id || m.registerNumber === student.rollNumber) &&
              m.status === 'active'
          ))
    );
  }

  getStudentMentor(studentId: string): HODFacultyMember | undefined {
    const proj = this.getStudentActiveProject(studentId);
    if (proj && proj.mentorFacultyId) {
      return this.getFacultyById(proj.mentorFacultyId);
    }
    const student = this.getStudentById(studentId);
    if (student && student.mentorFacultyId) {
      return this.getFacultyById(student.mentorFacultyId);
    }
    return undefined;
  }

  getFacultyAssignedStudents(facultyId: string, responsibility: 'proctor' | 'mentor'): HODStudentMember[] {
    if (responsibility === 'proctor') {
      return this.getProctorStudents(facultyId);
    } else {
      return this.getDerivedMenteesForFaculty(facultyId).map((item) => item.student);
    }
  }

  assignFacultyToStudent(
    studentId: string,
    facultyId: string,
    responsibility: 'proctor' | 'mentor',
    _assignedBy = 'Dr. Arun Kumar (HOD)'
  ): { oldFaculty?: HODFacultyMember; newFaculty?: HODFacultyMember; student?: HODStudentMember } {
    const student = this.getStudentById(studentId);
    const newFaculty = this.getFacultyById(facultyId);
    if (!student || !newFaculty) return {};

    if (responsibility === 'proctor') {
      this.addStudentsToProctor(newFaculty.id, [student.id]);
    } else {
      const proj = this.getStudentActiveProject(student.id);
      if (proj) {
        this.assignProjectMentor(proj.id, newFaculty.id);
      } else {
        student.mentorFacultyId = newFaculty.id;
      }
    }

    return { newFaculty, student };
  }

  removeFacultyAssignment(
    studentId: string,
    responsibility: 'proctor' | 'mentor'
  ): { removedFaculty?: HODFacultyMember; student?: HODStudentMember } {
    const student = this.getStudentById(studentId);
    if (!student) return {};

    if (responsibility === 'proctor') {
      const proctor = this.getStudentProctor(student.id);
      if (proctor) {
        this.removeStudentFromProctor(proctor.id, student.id);
      }
      return { removedFaculty: proctor, student };
    } else {
      const proj = this.getStudentActiveProject(student.id);
      const mentor = this.getStudentMentor(student.id);
      if (proj) {
        this.removeProjectMentor(proj.id);
      }
      student.mentorFacultyId = undefined;
      return { removedFaculty: mentor, student };
    }
  }

  bulkAssignStudents(
    studentIds: string[],
    facultyId: string,
    responsibility: 'proctor' | 'mentor'
  ): void {
    if (responsibility === 'proctor') {
      this.addStudentsToProctor(facultyId, studentIds);
    } else {
      studentIds.forEach((sId) => this.assignFacultyToStudent(sId, facultyId, responsibility));
    }
  }

  resetDemo() {
    this.user = { ...HOD_DEMO_USER };
    this.faculty = [...INITIAL_HOD_FACULTY];
    this.students = [...INITIAL_HOD_STUDENTS];
    this.submissions = [...INITIAL_HOD_SUBMISSIONS];
    this.activities = [...INITIAL_HOD_ACTIVITIES];
    this.notifications = [...INITIAL_HOD_NOTIFICATIONS];
    this.proctorAssignments = [...INITIAL_PROCTOR_ASSIGNMENTS];
    this.proctorStudents = [...INITIAL_PROCTOR_STUDENTS];
    this.projects = [...INITIAL_PROJECT_TEAMS];
    this.notify();
  }
}

export const hodStore = new HODStore();

export function subscribeHODData(listener: () => void) {
  return hodStore.subscribe(listener);
}
export function getHODStore() {
  return hodStore;
}
