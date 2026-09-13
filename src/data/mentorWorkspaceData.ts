// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Workspace Centralized Data Models & Dataset
// Focus: Mentees and Project Monitoring (Read-Only)
// ─────────────────────────────────────────────────────────────

export interface MentorMentee {
  id: string;
  studentId: string;
  name: string;
  registerNumber: string;
  department: string;
  year: number; // 1, 2, 3, 4
  yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  section: string;
  avatarUrl?: string;
  hasProject: boolean;
  projectId?: string;
  projectName?: string;
  projectDomain?: string;
  projectRole?: 'Team Leader' | 'Team Member' | 'Project Owner';
  projectType?: 'Team' | 'Individual';
}

export interface MentorProjectMember {
  studentId: string;
  name: string;
  registerNumber: string;
  department: string;
  yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  isMentee: boolean;
}

export interface MentorProject {
  id: string;
  title: string;
  description: string;
  domain: string;
  projectType: 'Individual' | 'Team';
  studentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  academicYear: string;
  department: string;
  teamLeader: {
    studentId: string;
    name: string;
    registerNumber: string;
    department: string;
    yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  };
  teamMembers: MentorProjectMember[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface MentorNotification {
  id: string;
  studentId?: string;
  studentName?: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  type: 'project_added' | 'project_updated' | 'mentee_assigned';
  targetScreen: 'mentorProjectDetails' | 'mentorMenteeDetails';
  targetId: string;
}

// ─────────────────────────────────────────────────────────────
// 1. STABLE MENTEE COHORT (12 Mentees across 1st-4th Year)
// ─────────────────────────────────────────────────────────────
export const MENTOR_ASSIGNED_MENTEES: MentorMentee[] = [
  {
    id: 'MM-001',
    studentId: 'STU_001',
    name: 'Gokulraj V',
    registerNumber: '23CI011',
    department: 'CSE (IoT)',
    year: 4,
    yearLabel: '4th Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-001',
    projectName: 'Smart Crop Monitoring System',
    projectDomain: 'AgriTech / IoT',
    projectRole: 'Team Leader',
    projectType: 'Team',
  },
  {
    id: 'MM-002',
    studentId: 'STU_034',
    name: 'Arun Kumar',
    registerNumber: '23CI034',
    department: 'CSE (IoT)',
    year: 4,
    yearLabel: '4th Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-001',
    projectName: 'Smart Crop Monitoring System',
    projectDomain: 'AgriTech / IoT',
    projectRole: 'Team Member',
    projectType: 'Team',
  },
  {
    id: 'MM-003',
    studentId: 'STU_027',
    name: 'Priya S',
    registerNumber: '23CI027',
    department: 'CSE (IoT)',
    year: 4,
    yearLabel: '4th Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-002',
    projectName: 'Cyber Threat Detection Dashboard',
    projectDomain: 'Cybersecurity',
    projectRole: 'Project Owner',
    projectType: 'Individual',
  },
  {
    id: 'MM-004',
    studentId: 'STU_015',
    name: 'Mohamed Aqdhas',
    registerNumber: '23CI015',
    department: 'CSE (IoT)',
    year: 4,
    yearLabel: '4th Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-001',
    projectName: 'Smart Crop Monitoring System',
    projectDomain: 'AgriTech / IoT',
    projectRole: 'Team Member',
    projectType: 'Team',
  },
  {
    id: 'MM-005',
    studentId: 'STU_024',
    name: 'Karthikeyan M',
    registerNumber: '23CI024',
    department: 'CSE (IoT)',
    year: 4,
    yearLabel: '4th Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-001',
    projectName: 'Smart Crop Monitoring System',
    projectDomain: 'AgriTech / IoT',
    projectRole: 'Team Member',
    projectType: 'Team',
  },
  {
    id: 'MM-006',
    studentId: 'STU_019',
    name: 'Jeeva M',
    registerNumber: '23CI019',
    department: 'CSE (IoT)',
    year: 4,
    yearLabel: '4th Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-001',
    projectName: 'Smart Crop Monitoring System',
    projectDomain: 'AgriTech / IoT',
    projectRole: 'Team Member',
    projectType: 'Team',
  },
  {
    id: 'MM-007',
    studentId: 'STU_058',
    name: 'Sathish K',
    registerNumber: '23CI058',
    department: 'CSE (IoT)',
    year: 3,
    yearLabel: '3rd Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-003',
    projectName: 'AI Health Diagnostics Support',
    projectDomain: 'Healthcare / AI',
    projectRole: 'Team Leader',
    projectType: 'Team',
  },
  {
    id: 'MM-008',
    studentId: 'STU_022',
    name: 'Divya Bharathi P',
    registerNumber: '23CI022',
    department: 'CSE (IoT)',
    year: 3,
    yearLabel: '3rd Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-003',
    projectName: 'AI Health Diagnostics Support',
    projectDomain: 'Healthcare / AI',
    projectRole: 'Team Member',
    projectType: 'Team',
  },
  {
    id: 'MM-009',
    studentId: 'STU_016',
    name: 'Deepak S',
    registerNumber: '23CI016',
    department: 'CSE (IoT)',
    year: 2,
    yearLabel: '2nd Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-004',
    projectName: 'Autonomous Rover Platform',
    projectDomain: 'Robotics / Embedded Systems',
    projectRole: 'Team Leader',
    projectType: 'Team',
  },
  {
    id: 'MM-010',
    studentId: 'STU_062',
    name: 'Vignesh R',
    registerNumber: '23CI062',
    department: 'CSE (IoT)',
    year: 2,
    yearLabel: '2nd Year',
    section: 'A',
    hasProject: true,
    projectId: 'MP-004',
    projectName: 'Autonomous Rover Platform',
    projectDomain: 'Robotics / Embedded Systems',
    projectRole: 'Team Member',
    projectType: 'Team',
  },
  {
    id: 'MM-011',
    studentId: 'STU_051',
    name: 'Sneha R',
    registerNumber: '23CI051',
    department: 'CSE (IoT)',
    year: 1,
    yearLabel: '1st Year',
    section: 'A',
    hasProject: false,
  },
  {
    id: 'MM-012',
    studentId: 'STU_030',
    name: 'Kavitha N',
    registerNumber: '23CI030',
    department: 'CSE (IoT)',
    year: 1,
    yearLabel: '1st Year',
    section: 'A',
    hasProject: false,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. STABLE MENTEE PROJECTS DATASET (6 Projects across 12 Mentees)
// ─────────────────────────────────────────────────────────────
export const MENTOR_PROJECTS: MentorProject[] = [
  {
    id: 'proj-1',
    title: 'Terra View',
    description:
      'An IoT-based smart agricultural solution that monitors crop and environmental conditions to support better farming decisions and precision irrigation.',
    domain: 'AgriTech',
    projectType: 'Team',
    studentYear: '3rd Year',
    academicYear: '2026–27',
    department: 'CSE (IoT)',
    teamLeader: {
      studentId: 's11',
      name: 'Gokulraj V',
      registerNumber: '23CI011',
      department: 'CSE (IoT)',
      yearLabel: '3rd Year',
    },
    teamMembers: [
      { studentId: 's18', name: 'Hamsha S', registerNumber: '23CI018', department: 'CSE (IoT)', yearLabel: '3rd Year', isMentee: true },
      { studentId: 's22', name: 'Jishnu K', registerNumber: '23CI022', department: 'CSE (IoT)', yearLabel: '3rd Year', isMentee: true },
    ],
    githubUrl: 'https://github.com/achievex/terra-view-iot',
  },
  {
    id: 'MP-002',
    title: 'Cyber Threat Detection Dashboard',
    description:
      'A real-time cybersecurity monitoring dashboard for detecting suspicious network activity and inspecting anomalous packet streams.',
    domain: 'Cybersecurity',
    projectType: 'Individual',
    studentYear: '4th Year',
    academicYear: '2026–27',
    department: 'CSE (IoT)',
    teamLeader: {
      studentId: 'STU_027',
      name: 'Priya S',
      registerNumber: '23CI027',
      department: 'CSE (IoT)',
      yearLabel: '4th Year',
    },
    teamMembers: [
      { studentId: 'STU_027', name: 'Priya S', registerNumber: '23CI027', department: 'CSE (IoT)', yearLabel: '4th Year', isMentee: true },
    ],
    githubUrl: 'https://github.com/achievex/cyber-threat-dashboard',
  },
  {
    id: 'MP-003',
    title: 'AI Health Diagnostics Support',
    description:
      'Computer-vision assisted preliminary chest X-ray classification using convolutional neural networks and an interactive clinician dashboard.',
    domain: 'Healthcare / AI',
    projectType: 'Team',
    studentYear: '3rd Year',
    academicYear: '2025–26',
    department: 'CSE (IoT)',
    teamLeader: {
      studentId: 'STU_058',
      name: 'Sathish K',
      registerNumber: '23CI058',
      department: 'CSE (IoT)',
      yearLabel: '3rd Year',
    },
    teamMembers: [
      { studentId: 'STU_022', name: 'Divya Bharathi P', registerNumber: '23CI022', department: 'CSE (IoT)', yearLabel: '3rd Year', isMentee: true },
      { studentId: 'STU_EXT_10', name: 'Naveen Kumar K', registerNumber: '23CI039', department: 'CSE (IoT)', yearLabel: '3rd Year', isMentee: false },
    ],
  },
  {
    id: 'MP-004',
    title: 'Autonomous Rover Platform',
    description:
      'Microcontroller-driven 4-wheel rover with ultrasonic distance sensing, LiDAR obstacle avoidance, and telemetry reporting over Wi-Fi/LoRa.',
    domain: 'Robotics / Embedded Systems',
    projectType: 'Team',
    studentYear: '2nd Year',
    academicYear: '2024–25',
    department: 'CSE (IoT)',
    teamLeader: {
      studentId: 'STU_016',
      name: 'Deepak S',
      registerNumber: '23CI016',
      department: 'CSE (IoT)',
      yearLabel: '2nd Year',
    },
    teamMembers: [
      { studentId: 'STU_062', name: 'Vignesh R', registerNumber: '23CI062', department: 'CSE (IoT)', yearLabel: '2nd Year', isMentee: true },
    ],
  },
  {
    id: 'MP-005',
    title: 'Student Academic Portfolio Web App',
    description:
      'Full-stack responsive web application showcasing verified academic credentials, published projects, and department achievements.',
    domain: 'Web Development',
    projectType: 'Individual',
    studentYear: '4th Year',
    academicYear: '2026–27',
    department: 'CSE (IoT)',
    teamLeader: {
      studentId: 'STU_022',
      name: 'Divya Bharathi P',
      registerNumber: '23CI022',
      department: 'CSE (IoT)',
      yearLabel: '4th Year',
    },
    teamMembers: [
      { studentId: 'STU_022', name: 'Divya Bharathi P', registerNumber: '23CI022', department: 'CSE (IoT)', yearLabel: '4th Year', isMentee: true },
    ],
    demoUrl: 'https://portfolio.achievex.edu',
  },
  {
    id: 'MP-006',
    title: 'Mobile Campus Navigator',
    description:
      'Interactive React Native mobile app providing indoor positioning, route mapping, and building directory navigation for campus events.',
    domain: 'Mobile App',
    projectType: 'Team',
    studentYear: '3rd Year',
    academicYear: '2025–26',
    department: 'CSE (IoT)',
    teamLeader: {
      studentId: 'STU_015',
      name: 'Mohamed Aqdhas',
      registerNumber: '23CI015',
      department: 'CSE (IoT)',
      yearLabel: '3rd Year',
    },
    teamMembers: [
      { studentId: 'STU_051', name: 'Sneha R', registerNumber: '23CI051', department: 'CSE (IoT)', yearLabel: '1st Year', isMentee: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 3. STABLE MENTOR NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
export const MENTOR_NOTIFICATIONS: MentorNotification[] = [
  {
    id: 'NOTIF-M1',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    title: 'Project Repository Updated',
    message: 'Gokulraj V updated repository links on "Smart Crop Monitoring System".',
    timeAgo: '2 hours ago',
    isRead: false,
    type: 'project_updated',
    targetScreen: 'mentorProjectDetails',
    targetId: 'MP-001',
  },
  {
    id: 'NOTIF-M2',
    studentId: 'STU_015',
    studentName: 'Mohamed Aqdhas',
    title: 'New Team Project Registered',
    message: 'Mohamed Aqdhas registered "Mobile Campus Navigator" as a team project.',
    timeAgo: '1 day ago',
    isRead: false,
    type: 'project_added',
    targetScreen: 'mentorProjectDetails',
    targetId: 'MP-006',
  },
  {
    id: 'NOTIF-M3',
    studentId: 'STU_027',
    studentName: 'Priya S',
    title: 'Project Details Updated',
    message: 'Priya S updated domain details on "Cyber Threat Detection Dashboard".',
    timeAgo: '3 days ago',
    isRead: true,
    type: 'project_updated',
    targetScreen: 'mentorProjectDetails',
    targetId: 'MP-002',
  },
];

// ─────────────────────────────────────────────────────────────
// 4. MENTOR WORKSPACE SUMMARY METRICS
// ─────────────────────────────────────────────────────────────
export const MENTOR_SUMMARY_DATA = {
  totalMentees: 12,
  activeProjectsCount: 6,
  teamProjectsCount: 4,
  individualProjectsCount: 2,
  assignedScope: {
    department: 'CSE (IoT)',
    section: 'Section A',
  },
};

// ─────────────────────────────────────────────────────────────
// 5. QUERY & HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
export function getMenteeById(studentId: string): MentorMentee | undefined {
  return MENTOR_ASSIGNED_MENTEES.find((m) => m.studentId === studentId || m.id === studentId);
}

export function getMenteesList(): MentorMentee[] {
  return MENTOR_ASSIGNED_MENTEES;
}

export function getProjectById(projectId: string): MentorProject | undefined {
  const storeProject = getHODStore().getProjectById(projectId);
  if (storeProject) {
    return {
      id: storeProject.id,
      title: storeProject.title,
      description: storeProject.description,
      domain: storeProject.domain,
      projectType: storeProject.projectType === 'team' ? 'Team' : 'Individual',
      studentYear: storeProject.studentYear,
      academicYear: storeProject.academicYear,
      department: 'CSE (IoT)',
      teamLeader: {
        studentId: storeProject.teamLeaderId,
        name: storeProject.teamLeaderName,
        registerNumber: storeProject.teamLeaderRoll,
        department: 'CSE (IoT)',
        yearLabel: storeProject.studentYear,
      },
      teamMembers: storeProject.members.map((m) => ({
        studentId: m.studentId,
        name: m.name,
        registerNumber: m.registerNumber,
        department: m.department,
        yearLabel: m.yearLabel,
        isMentee: true,
      })),
    };
  }
  return MENTOR_PROJECTS.find((p) => p.id === projectId);
}

export function getProjectsByStudent(studentId: string): MentorProject[] {
  return MENTOR_PROJECTS.filter(
    (p) =>
      p.teamLeader.studentId === studentId ||
      p.teamMembers.some((m) => m.studentId === studentId)
  );
}

// ─────────────────────────────────────────────────────────────
// 6. DERIVED MENTOR REPOSITORY (Integrated with HOD Project Store)
// ─────────────────────────────────────────────────────────────
import { getHODStore } from './hodWorkspaceData';

export function getProjectsForMentor(facultyId?: string): MentorProject[] {
  const hodStore = getHODStore();
  const effectiveFacId = facultyId || 'fac-1'; // Default demo is Dr. Priya S
  const assigned = hodStore.getProjectsForFacultyMentor(effectiveFacId);

  if (assigned.length > 0) {
    return assigned.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      domain: p.domain,
      projectType: p.projectType === 'team' ? 'Team' : 'Individual',
      studentYear: p.studentYear,
      academicYear: p.academicYear,
      department: 'CSE (IoT)',
      teamLeader: {
        studentId: p.teamLeaderId,
        name: p.teamLeaderName,
        registerNumber: p.teamLeaderRoll,
        department: 'CSE (IoT)',
        yearLabel: p.studentYear,
      },
      teamMembers: p.members.map((m) => ({
        studentId: m.studentId,
        name: m.name,
        registerNumber: m.registerNumber,
        department: m.department,
        yearLabel: m.yearLabel,
        isMentee: true,
      })),
    }));
  }

  // Fallback to static MENTOR_PROJECTS if none in store
  return MENTOR_PROJECTS;
}

export function getDerivedMenteesFromProjects(facultyId?: string): MentorMentee[] {
  const hodStore = getHODStore();
  const effectiveFacId = facultyId || 'fac-1';
  const derived = hodStore.getDerivedMenteesForFaculty(effectiveFacId);

  if (derived.length > 0) {
    return derived.map((item, idx) => ({
      id: `derived-mentee-${idx + 1}`,
      studentId: item.student.id,
      name: item.student.name,
      registerNumber: item.student.rollNumber,
      department: item.student.department,
      year: item.student.year === '1st Year' ? 1 : item.student.year === '2nd Year' ? 2 : item.student.year === '3rd Year' ? 3 : 4,
      yearLabel: item.student.year as any,
      section: item.student.section,
      hasProject: true,
      projectId: item.project.id,
      projectName: item.project.title,
      projectDomain: item.project.domain,
      projectRole: item.role as any,
      projectType: item.project.projectType === 'team' ? 'Team' : 'Individual',
    }));
  }

  // Fallback to initial cohort
  return MENTOR_ASSIGNED_MENTEES;
}

