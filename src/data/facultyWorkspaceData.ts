// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Workspace & Multi-Responsibility Architecture
// One Account -> Assigned Responsibilities -> Active Workspace
// ─────────────────────────────────────────────────────────────

export type FacultyWorkspaceId =
  | 'faculty'
  | 'tutor'
  | 'proctor'
  | 'mentor'
  | 'academic_coordinator'
  | 'hod'
  | 'head'
  | 'dean'
  | 'principal';

export interface FacultyResponsibility {
  id: FacultyWorkspaceId;
  label: string;
  description: string;
  enabled: boolean;
  assignmentDetails?: string;
  icon: string;
  permissions: string[];
}

export interface FacultyUser {
  id: string;
  name: string;
  email: string;
  role: 'faculty';
  designation: string;
  department: {
    id: string;
    name: string;
  };
  institution: string;
  profileImage?: string;
  stats: {
    achievements: number;
    points: number;
    approved: number;
  };
  responsibilities: FacultyResponsibility[];
  activeWorkspace: FacultyWorkspaceId;
}

export const DEFAULT_FACULTY_USER: FacultyUser = {
  id: 'FAC-024',
  name: 'Gokulraj V',
  email: 'gokulraj@nandhaengg.org',
  role: 'faculty',
  designation: 'Assistant Professor',
  department: {
    id: 'CSE_IOT',
    name: 'CSE (IoT)',
  },
  institution: 'Nandha Engineering College',
  stats: {
    achievements: 12,
    points: 100,
    approved: 12,
  },
  responsibilities: [
    {
      id: 'faculty',
      label: 'Faculty',
      description: 'Manage your personal professional achievements, points, and goals.',
      enabled: true,
      assignmentDetails: 'CSE (IoT)',
      icon: 'briefcase-outline',
      permissions: ['own_achievements.create', 'own_achievements.view', 'own_goals.manage'],
    },
    {
      id: 'tutor',
      label: 'Tutor',
      description: 'Class academic progress, attendance, and student performance tracking.',
      enabled: true,
      assignmentDetails: 'CSE (IoT) • 3rd Year • Section A (58 Students)',
      icon: 'people-outline',
      permissions: ['students.view_assigned', 'student_activity.view', 'class_performance.view'],
    },
    {
      id: 'proctor',
      label: 'Proctor',
      description: 'Student proctoring, achievement guidance, and attention list monitoring.',
      enabled: true,
      assignmentDetails: '24 Assigned Students',
      icon: 'shield-checkmark-outline',
      permissions: ['proctees.view', 'proctees_activity.view'],
    },
    {
      id: 'mentor',
      label: 'Mentor',
      description: 'Student project mentoring, goal tracking, and career pathway reviews.',
      enabled: true,
      assignmentDetails: '12 Assigned Mentees',
      icon: 'heart-outline',
      permissions: ['mentees.view', 'mentees_goals.view'],
    },
    {
      id: 'academic_coordinator',
      label: 'Academic Coordinator',
      description: 'Department achievement verification, group reviews, and bulk approvals.',
      enabled: true,
      assignmentDetails: 'CSE (IoT) • 3rd Year • Section A',
      icon: 'school-outline',
      permissions: ['verifications.bulk_approve', 'verifications.review_groups', 'verifications.manage'],
    },
    {
      id: 'hod',
      label: 'Head of Department',
      description: 'Department leadership, faculty achievement verification, and institutional monitoring.',
      enabled: true,
      assignmentDetails: 'CSE (IoT) Department (18 Faculty • 240 Students)',
      icon: 'business-outline',
      permissions: ['faculty.verify', 'faculty.review', 'department.reports', 'department.monitor'],
    },
    {
      id: 'head',
      label: 'Head',
      description: 'Institution-wide achievement governance, scoring policies, categories, and executive analytics.',
      enabled: true,
      assignmentDetails: 'Nandha Engineering College (College Governance)',
      icon: 'school-outline',
      permissions: ['policy.manage', 'categories.manage', 'points.configure', 'reports.executive', 'college.monitor'],
    },
    {
      id: 'dean',
      label: 'Dean',
      description: 'HOD achievement verification and faculty governance across assigned departments.',
      enabled: true,
      assignmentDetails: 'Assigned Scope: CSE (IoT), CSE, IT (3 Departments)',
      icon: 'shield-checkmark-outline',
      permissions: ['hod.verify', 'assigned_departments.view', 'dean_history.audit'],
    },
    {
      id: 'principal',
      label: 'Principal',
      description: 'Institutional leadership, Dean verification, department governance, and college-wide oversight.',
      enabled: true,
      assignmentDetails: 'Nandha Engineering College (Institutional Head)',
      icon: 'crown',
      permissions: ['dean.verify', 'institution.oversight', 'departments.manage_dean', 'reports.institutional'],
    },
  ],
  activeWorkspace: 'faculty',
};

export const ALL_AVAILABLE_RESPONSIBILITIES: FacultyResponsibility[] = [
  {
    id: 'faculty',
    label: 'Faculty',
    description: 'Manage your personal professional achievements, points, and goals.',
    enabled: true,
    assignmentDetails: 'CSE (IoT)',
    icon: 'briefcase-outline',
    permissions: ['own_achievements.create', 'own_achievements.view', 'own_goals.manage'],
  },
  {
    id: 'tutor',
    label: 'Tutor',
    description: 'Class academic progress, attendance, and student performance tracking.',
    enabled: true,
    assignmentDetails: 'CSE (IoT) • 3rd Year • Section A (58 Students)',
    icon: 'people-outline',
    permissions: ['students.view_assigned', 'student_activity.view', 'class_performance.view'],
  },
  {
    id: 'proctor',
    label: 'Proctor',
    description: 'Student proctoring, achievement guidance, and attention list monitoring.',
    enabled: true,
    assignmentDetails: '24 Assigned Students',
    icon: 'shield-checkmark-outline',
    permissions: ['proctees.view', 'proctees_activity.view'],
  },
  {
    id: 'mentor',
    label: 'Mentor',
    description: 'Student project mentoring, goal tracking, and career pathway reviews.',
    enabled: true,
    assignmentDetails: '12 Assigned Mentees',
    icon: 'heart-outline',
    permissions: ['mentees.view', 'mentees_goals.view'],
  },
  {
    id: 'academic_coordinator',
    label: 'Academic Coordinator',
    description: 'Department verification queue, accreditation reports, and approval workflows.',
    enabled: true,
    assignmentDetails: 'CSE (IoT) Department',
    icon: 'ribbon-outline',
    permissions: ['achievements.verify', 'achievements.reject', 'reports.generate'],
  },
  {
    id: 'hod',
    label: 'Head of Department',
    description: 'Department leadership, faculty achievement verification, and institutional monitoring.',
    enabled: true,
    assignmentDetails: 'CSE (IoT) Department (18 Faculty • 240 Students)',
    icon: 'business-outline',
    permissions: ['faculty.verify', 'faculty.review', 'department.reports', 'department.monitor'],
  },
  {
    id: 'head',
    label: 'Head',
    description: 'Institution-wide achievement governance, scoring policies, categories, and executive analytics.',
    enabled: true,
    assignmentDetails: 'Nandha Engineering College (College Governance)',
    icon: 'school-outline',
    permissions: ['policy.manage', 'categories.manage', 'points.configure', 'reports.executive', 'college.monitor'],
  },
  {
    id: 'dean',
    label: 'Dean',
    description: 'HOD achievement verification and faculty governance across assigned departments.',
    enabled: true,
    assignmentDetails: 'Assigned Scope: CSE (IoT), CSE, IT (3 Departments)',
    icon: 'shield-checkmark-outline',
    permissions: ['hod.verify', 'assigned_departments.view', 'dean_history.audit'],
  },
  {
    id: 'principal',
    label: 'Principal',
    description: 'Institutional leadership, Dean verification, department governance, and college-wide oversight.',
    enabled: true,
    assignmentDetails: 'Nandha Engineering College (Institutional Head)',
    icon: 'crown',
    permissions: ['dean.verify', 'institution.oversight', 'departments.manage_dean', 'reports.institutional'],
  },
];

// ── Workspace Specific Datasets ──

export interface FacultyActivityItem {
  id: string;
  title: string;
  category: string;
  status: 'Approved' | 'Pending' | 'Correction';
  date: string;
  points?: number;
  studentName?: string;
  rollNo?: string;
}

export const FACULTY_OWN_ACTIVITIES: FacultyActivityItem[] = [
  {
    id: 'FA-01',
    title: 'Research Paper Published in Scopus Journal',
    category: 'Journal Publication',
    status: 'Approved',
    date: '12 Aug 2026',
    points: 30,
  },
  {
    id: 'FA-02',
    title: '5-Day Workshop on Edge AI & IoT Architectures',
    category: 'Technical & Professional',
    status: 'Pending',
    date: '08 Aug 2026',
    points: 15,
  },
  {
    id: 'FA-03',
    title: 'Patent Applied — Smart Agriculture Monitoring',
    category: 'Research & IPR',
    status: 'Approved',
    date: '02 Aug 2026',
    points: 40,
  },
  {
    id: 'FA-04',
    title: 'Faculty Development Program (FDP) on Cloud Native Computing',
    category: 'FDP & Training',
    status: 'Approved',
    date: '22 Jul 2026',
    points: 15,
  },
];

export const TUTOR_STUDENT_ACTIVITIES: FacultyActivityItem[] = [
  {
    id: 'TA-01',
    studentName: 'Arun Kumar',
    rollNo: '23CI012',
    title: 'Smart India Hackathon 2026 Winner',
    category: 'National Hackathon',
    status: 'Approved',
    date: 'Today',
    points: 50,
  },
  {
    id: 'TA-02',
    studentName: 'Priya S',
    rollNo: '23CI045',
    title: 'NPTEL Introduction to Data Science (Elite)',
    category: 'Credit Course',
    status: 'Approved',
    date: 'Yesterday',
    points: 30,
  },
  {
    id: 'TA-03',
    studentName: 'Dharun Raj',
    rollNo: '23CI019',
    title: 'IEEE Conference Paper Presentation',
    category: 'Paper Presentation',
    status: 'Pending',
    date: '2 days ago',
    points: 20,
  },
  {
    id: 'TA-04',
    studentName: 'Kavya M',
    rollNo: '23CI031',
    title: 'Inter-College Coding Olympiad 2nd Place',
    category: 'Coding Contest',
    status: 'Approved',
    date: '3 days ago',
    points: 25,
  },
];

export interface AssignedStudent {
  id: string;
  name: string;
  registerNumber: string;
  departmentId: string;
  departmentName: string;
  academicYear: string;
  currentYear: number;
  section: string;
  assignedProctorId: string;
  performance: {
    verifiedAchievements: number;
    pendingAchievements: number;
    points: number;
    activeGoals: number;
  };
  hasVerifiedThisSemester: boolean;
  needsAttention?: boolean;
  attentionReason?: string;
}

export const PROCTOR_ASSIGNED_STUDENTS: AssignedStudent[] = [
  {
    id: 'STU_001',
    name: 'Gokulraj V',
    registerNumber: '23CI011',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    assignedProctorId: 'FAC_024',
    performance: {
      verifiedAchievements: 12,
      pendingAchievements: 1,
      points: 850,
      activeGoals: 2,
    },
    hasVerifiedThisSemester: true,
  },
  {
    id: 'STU_002',
    name: 'Karthikeyan M',
    registerNumber: '23CI024',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 8,
      pendingAchievements: 2,
      points: 540,
      activeGoals: 1,
    },
    hasVerifiedThisSemester: true,
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_003',
    name: 'Jeeva M',
    registerNumber: '23CI019',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 6,
      pendingAchievements: 0,
      points: 420,
      activeGoals: 2,
    },
    hasVerifiedThisSemester: true,
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_004',
    name: 'Arun Kumar',
    registerNumber: '23CI018',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 0,
      pendingAchievements: 0,
      points: 0,
      activeGoals: 0,
    },
    hasVerifiedThisSemester: false,
    needsAttention: true,
    attentionReason: 'No achievements this semester',
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_005',
    name: 'Priya S',
    registerNumber: '23CI027',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 4,
      pendingAchievements: 2,
      points: 340,
      activeGoals: 1,
    },
    hasVerifiedThisSemester: true,
    needsAttention: true,
    attentionReason: '2 submissions need correction',
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_006',
    name: 'Dharun Raj',
    registerNumber: '23CI009',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'B',
    performance: {
      verifiedAchievements: 5,
      pendingAchievements: 1,
      points: 380,
      activeGoals: 1,
    },
    hasVerifiedThisSemester: true,
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_007',
    name: 'Kavya M',
    registerNumber: '23CI031',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'B',
    performance: {
      verifiedAchievements: 7,
      pendingAchievements: 0,
      points: 490,
      activeGoals: 2,
    },
    hasVerifiedThisSemester: true,
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_008',
    name: 'Sanjay M',
    registerNumber: '23CI052',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 4,
      pendingAchievements: 0,
      points: 290,
      activeGoals: 1,
    },
    hasVerifiedThisSemester: true,
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_009',
    name: 'Naveen K',
    registerNumber: '23CI038',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 3,
      pendingAchievements: 1,
      points: 210,
      activeGoals: 1,
    },
    hasVerifiedThisSemester: true,
    assignedProctorId: 'FAC_024',
  },
  {
    id: 'STU_010',
    name: 'Rithika V',
    registerNumber: '23CI049',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    academicYear: '2023-2027',
    currentYear: 3,
    section: 'A',
    performance: {
      verifiedAchievements: 2,
      pendingAchievements: 1,
      points: 150,
      activeGoals: 0,
    },
    hasVerifiedThisSemester: true,
    needsAttention: true,
    attentionReason: 'Correction needed on certificate proof',
    assignedProctorId: 'FAC_024',
  },
];

export interface StudentAchievementRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  title: string;
  category: string;
  event: string;
  organizer: string;
  level: string;
  semester: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Correction' | 'Rejected';
  points?: number;
  isTeam?: boolean;
  teamRole?: string;
  cashPrize?: string;
  proofDocumentName?: string;
  proofType?: string;
}

export const PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS: StudentAchievementRecord[] = [
  {
    id: 'ACH-001',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    title: 'Smart India Hackathon 2026 Winner',
    category: 'Technical & Professional',
    event: 'Smart India Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    semester: 'Semester 5',
    date: '31 Aug 2026',
    status: 'Approved',
    points: 50,
    isTeam: true,
    teamRole: 'Team Leader',
    cashPrize: '₹1,00,000',
    proofDocumentName: 'SIH_Winner_Certificate.pdf',
    proofType: 'Certificate & Merit Letter',
  },
  {
    id: 'ACH-002',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    title: 'NPTEL Cloud Computing (Elite + Gold)',
    category: 'Academic & Courses',
    event: 'NPTEL Online Certification',
    organizer: 'IIT Kharagpur',
    level: 'National Level',
    semester: 'Semester 5',
    date: '24 Aug 2026',
    status: 'Approved',
    points: 40,
    isTeam: false,
    proofDocumentName: 'NPTEL_Cloud_Elite_Gold.pdf',
    proofType: 'Course Marksheet & Certificate',
  },
  {
    id: 'ACH-003',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    title: 'Research Paper on Edge AI Architecture',
    category: 'Research & IPR',
    event: 'IEEE International Conference',
    organizer: 'IEEE Computer Society',
    level: 'International Level',
    semester: 'Semester 5',
    date: '18 Aug 2026',
    status: 'Pending',
    points: 30,
    isTeam: true,
    teamRole: 'First Author',
    proofDocumentName: 'IEEE_Acceptance_Letter.pdf',
    proofType: 'Acceptance Letter',
  },
  {
    id: 'ACH-004',
    studentId: 'STU_002',
    studentName: 'Karthikeyan M',
    rollNo: '23CI024',
    department: 'CSE (IoT)',
    title: 'Inter-College Project Expo 1st Prize',
    category: 'Technical & Professional',
    event: 'InnovateX 2026',
    organizer: 'PSG College of Technology',
    level: 'State Level',
    semester: 'Semester 5',
    date: '30 Aug 2026',
    status: 'Approved',
    points: 30,
    isTeam: true,
    teamRole: 'Lead Hardware Engineer',
    cashPrize: '₹15,000',
    proofDocumentName: 'InnovateX_1st_Prize.pdf',
    proofType: 'Certificate',
  },
  {
    id: 'ACH-005',
    studentId: 'STU_002',
    studentName: 'Karthikeyan M',
    rollNo: '23CI024',
    department: 'CSE (IoT)',
    title: 'AWS Certified Cloud Practitioner',
    category: 'Technical & Professional',
    event: 'AWS Certification',
    organizer: 'Amazon Web Services',
    level: 'Global Certification',
    semester: 'Semester 5',
    date: '20 Aug 2026',
    status: 'Pending',
    points: 25,
    isTeam: false,
    proofDocumentName: 'AWS_Badge_Verification.pdf',
    proofType: 'Certification Badge',
  },
  {
    id: 'ACH-006',
    studentId: 'STU_003',
    studentName: 'Jeeva M',
    rollNo: '23CI019',
    department: 'CSE (IoT)',
    title: 'Paper Presentation 1st Prize',
    category: 'Research & IPR',
    event: 'National Technical Symposium',
    organizer: 'Kongu Engineering College',
    level: 'National Level',
    semester: 'Semester 5',
    date: '30 Aug 2026',
    status: 'Approved',
    points: 40,
    isTeam: false,
    proofDocumentName: 'Paper_Presentation_Cert.pdf',
    proofType: 'Certificate',
  },
  {
    id: 'ACH-007',
    studentId: 'STU_005',
    studentName: 'Priya S',
    rollNo: '23CI027',
    department: 'CSE (IoT)',
    title: 'State Level Badminton Tournament Runner Up',
    category: 'Sports & Games',
    event: 'Anna University Zonal Sports',
    organizer: 'Anna University Chennai',
    level: 'State Level',
    semester: 'Semester 5',
    date: '25 Aug 2026',
    status: 'Correction',
    points: 20,
    isTeam: false,
    proofDocumentName: 'Zonal_Sports_ID_Proof.pdf',
    proofType: 'ID & Certificate',
  },
];

export interface GoalMilestone {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: string;
  dueText?: string;
  proofRequired?: boolean;
  proofName?: string;
  proofSize?: string;
}

export interface GoalProofAttachment {
  id: string;
  milestoneId: string;
  type: string;
  label: string;
  fileName: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileSize: string;
  uploadedAt: string;
  verificationStatus: 'submitted' | 'verified' | 'not_required';
  verificationAuthority?: string;
}

export interface RecentGoalActivityItem {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  type: 'milestone' | 'creation' | 'proof';
}

export interface StudentGoalProgress {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  currentYear: number;
  section: string;
  avatarInitials?: string;
  title: string;
  category: string;
  targetOutcome: string;
  priority: 'High' | 'Medium' | 'Standard';
  createdDate: string;
  targetDate: string;
  deadlineContext: string;
  percentage: number;
  completedMilestones: number;
  totalMilestones: number;
  status: 'Active' | 'Completed' | 'Overdue' | 'Paused';
  semester: string;
  milestones: GoalMilestone[];
  proofAttachment?: GoalProofAttachment;
  recentActivity?: RecentGoalActivityItem[];
}

export const PROCTOR_STUDENT_GOALS: StudentGoalProgress[] = [
  {
    id: 'GL-01',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'GV',
    title: 'Publish a Research Paper in IEEE / Scopus',
    category: 'Research & IPR',
    targetOutcome: 'Published in Journal',
    priority: 'High',
    createdDate: '12 Aug 2026',
    targetDate: '20 Sep 2026',
    deadlineContext: '18 days remaining',
    percentage: 60,
    completedMilestones: 3,
    totalMilestones: 5,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Topic Selection & Problem Formulation',
        status: 'completed',
        completedAt: '14 Aug 2026',
        proofRequired: false,
      },
      {
        id: 'm2',
        title: 'Literature Survey & Initial Draft Formulation',
        status: 'completed',
        completedAt: '22 Aug 2026',
        proofRequired: true,
        proofName: 'Literature_Survey_Draft.pdf',
        proofSize: '1.4 MB',
      },
      {
        id: 'm3',
        title: 'Conference Paper Submission to IEEE',
        status: 'completed',
        completedAt: '30 Aug 2026',
        proofRequired: true,
        proofName: 'IEEE_Paper_Submission_Confirmation.pdf',
        proofSize: '1.2 MB',
      },
      {
        id: 'm4',
        title: 'Peer Review Revisions & Camera-Ready Copy',
        status: 'in_progress',
        dueText: 'Due 15 Sep 2026',
        proofRequired: false,
      },
      {
        id: 'm5',
        title: 'Conference Presentation & Publication',
        status: 'pending',
        dueText: 'Due 20 Sep 2026',
        proofRequired: true,
      },
    ],
    proofAttachment: {
      id: 'PRF-01',
      milestoneId: 'm3',
      type: 'paper_submission_acknowledgement',
      label: 'Submission Confirmation',
      fileName: 'IEEE_Paper_Submission_Confirmation.pdf',
      fileType: 'pdf',
      fileSize: '1.2 MB',
      uploadedAt: '30 Aug 2026',
      verificationStatus: 'submitted',
    },
    recentActivity: [
      {
        id: 'act-1',
        date: '30 Aug 2026',
        title: 'Milestone completed',
        subtitle: 'Conference Paper Submission to IEEE (Proof attached)',
        type: 'milestone',
      },
      {
        id: 'act-2',
        date: '22 Aug 2026',
        title: 'Milestone completed',
        subtitle: 'Literature Survey & Initial Draft Formulation',
        type: 'milestone',
      },
      {
        id: 'act-3',
        date: '12 Aug 2026',
        title: 'Goal created',
        subtitle: 'Target outcome: Published in Journal',
        type: 'creation',
      },
    ],
  },
  {
    id: 'GL-02',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'GV',
    title: 'Complete AWS Certified Cloud Practitioner Certification',
    category: 'Certifications & Online Learning',
    targetOutcome: 'Certified Credential',
    priority: 'Medium',
    createdDate: '05 Aug 2026',
    targetDate: '15 Oct 2026',
    deadlineContext: '43 days remaining',
    percentage: 40,
    completedMilestones: 2,
    totalMilestones: 5,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'AWS Cloud Essentials Course Modules 1-4',
        status: 'completed',
        completedAt: '18 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Practice Assessment Exams (Score > 85%)',
        status: 'completed',
        completedAt: '28 Aug 2026',
        proofRequired: true,
        proofName: 'AWS_Practice_Exam_Report.pdf',
        proofSize: '820 KB',
      },
      {
        id: 'm3',
        title: 'Schedule Exam Slot via Pearson VUE',
        status: 'in_progress',
        dueText: 'Due 20 Sep 2026',
      },
      {
        id: 'm4',
        title: 'Appear for Proctored Certification Exam',
        status: 'pending',
        dueText: 'Due 10 Oct 2026',
      },
      {
        id: 'm5',
        title: 'Upload Verified AWS Digital Badge',
        status: 'pending',
        dueText: 'Due 15 Oct 2026',
      },
    ],
    proofAttachment: {
      id: 'PRF-02',
      milestoneId: 'm2',
      type: 'assessment_report',
      label: 'Practice Test Scorecard',
      fileName: 'AWS_Practice_Exam_Report.pdf',
      fileType: 'pdf',
      fileSize: '820 KB',
      uploadedAt: '28 Aug 2026',
      verificationStatus: 'submitted',
    },
    recentActivity: [
      {
        id: 'act-1',
        date: '28 Aug 2026',
        title: 'Milestone completed',
        subtitle: 'Practice Assessment Exams (Score > 85%)',
        type: 'milestone',
      },
      {
        id: 'act-2',
        date: '05 Aug 2026',
        title: 'Goal created',
        subtitle: 'Target outcome: Certified Credential',
        type: 'creation',
      },
    ],
  },
  {
    id: 'GL-03',
    studentId: 'STU_002',
    studentName: 'Karthikeyan M',
    rollNo: '23CI024',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'KM',
    title: 'Build IoT Smart Agriculture Sensor Prototype',
    category: 'Technical & Professional',
    targetOutcome: 'Working Hardware Prototype',
    priority: 'High',
    createdDate: '01 Aug 2026',
    targetDate: '25 Sep 2026',
    deadlineContext: '23 days remaining',
    percentage: 75,
    completedMilestones: 3,
    totalMilestones: 4,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Circuit Design & Component Procurement',
        status: 'completed',
        completedAt: '10 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Sensor Calibration & Firmware Coding',
        status: 'completed',
        completedAt: '20 Aug 2026',
      },
      {
        id: 'm3',
        title: 'Cloud Dashboard & Real-Time Telemetry Sync',
        status: 'completed',
        completedAt: '29 Aug 2026',
        proofRequired: true,
        proofName: 'IoT_Telemetry_Dashboard_Report.pdf',
        proofSize: '1.8 MB',
      },
      {
        id: 'm4',
        title: 'Field Testing & Demo Video Recording',
        status: 'in_progress',
        dueText: 'Due 25 Sep 2026',
      },
    ],
    proofAttachment: {
      id: 'PRF-03',
      milestoneId: 'm3',
      type: 'project_report',
      label: 'Telemetry Dashboard Report',
      fileName: 'IoT_Telemetry_Dashboard_Report.pdf',
      fileType: 'pdf',
      fileSize: '1.8 MB',
      uploadedAt: '29 Aug 2026',
      verificationStatus: 'submitted',
    },
  },
  {
    id: 'GL-04',
    studentId: 'STU_003',
    studentName: 'Jeeva M',
    rollNo: '23CI019',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'JM',
    title: 'Present Technical Paper at National Conference',
    category: 'Research & IPR',
    targetOutcome: 'Paper Presented & Published',
    priority: 'High',
    createdDate: '15 Jul 2026',
    targetDate: '30 Aug 2026',
    deadlineContext: 'Completed on 30 Aug 2026',
    percentage: 100,
    completedMilestones: 4,
    totalMilestones: 4,
    status: 'Completed',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Draft Paper & Internal Evaluation',
        status: 'completed',
        completedAt: '25 Jul 2026',
      },
      {
        id: 'm2',
        title: 'Submit Paper to Symposium',
        status: 'completed',
        completedAt: '05 Aug 2026',
      },
      {
        id: 'm3',
        title: 'Acceptance & Registration',
        status: 'completed',
        completedAt: '18 Aug 2026',
      },
      {
        id: 'm4',
        title: 'Oral Presentation & Winner Certificate',
        status: 'completed',
        completedAt: '30 Aug 2026',
        proofRequired: true,
        proofName: 'Kongu_Symposium_1stPrize_Certificate.pdf',
        proofSize: '1.5 MB',
      },
    ],
    proofAttachment: {
      id: 'PRF-04',
      milestoneId: 'm4',
      type: 'presentation_certificate',
      label: 'First Prize Certificate',
      fileName: 'Kongu_Symposium_1stPrize_Certificate.pdf',
      fileType: 'pdf',
      fileSize: '1.5 MB',
      uploadedAt: '30 Aug 2026',
      verificationStatus: 'verified',
      verificationAuthority: 'Academic Coordinator',
    },
  },
  {
    id: 'GL-05',
    studentId: 'STU_003',
    studentName: 'Jeeva M',
    rollNo: '23CI019',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'JM',
    title: 'Complete NPTEL Course on Deep Learning for Vision',
    category: 'Certifications & Online Learning',
    targetOutcome: 'Elite + Silver Certificate',
    priority: 'Medium',
    createdDate: '10 Aug 2026',
    targetDate: '18 Oct 2026',
    deadlineContext: '46 days remaining',
    percentage: 50,
    completedMilestones: 2,
    totalMilestones: 4,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Weekly Assignments 1-4 Submission',
        status: 'completed',
        completedAt: '25 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Mid-term Lab Evaluation',
        status: 'completed',
        completedAt: '01 Sep 2026',
      },
      {
        id: 'm3',
        title: 'Assignments 5-8 Submission',
        status: 'in_progress',
        dueText: 'Due 25 Sep 2026',
      },
      {
        id: 'm4',
        title: 'Final Proctored Examination',
        status: 'pending',
        dueText: 'Due 18 Oct 2026',
      },
    ],
  },
  {
    id: 'GL-06',
    studentId: 'STU_005',
    studentName: 'Priya S',
    rollNo: '23CI027',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'PS',
    title: 'Win Top 3 in State Badminton Championship',
    category: 'Sports & Games',
    targetOutcome: 'Tournament Podium Finish',
    priority: 'High',
    createdDate: '01 Jul 2026',
    targetDate: '25 Aug 2026',
    deadlineContext: 'Completed on 25 Aug 2026',
    percentage: 100,
    completedMilestones: 3,
    totalMilestones: 3,
    status: 'Completed',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'District Level Selection Trial',
        status: 'completed',
        completedAt: '15 Jul 2026',
      },
      {
        id: 'm2',
        title: 'State Quarter-Final & Semi-Final Matches',
        status: 'completed',
        completedAt: '12 Aug 2026',
      },
      {
        id: 'm3',
        title: 'State Finals & Runner Up Trophy',
        status: 'completed',
        completedAt: '25 Aug 2026',
        proofRequired: true,
        proofName: 'Anna_Univ_Zonal_RunnerUp_Cert.pdf',
        proofSize: '2.1 MB',
      },
    ],
    proofAttachment: {
      id: 'PRF-06',
      milestoneId: 'm3',
      type: 'sports_certificate',
      label: 'Tournament Runner Up Certificate',
      fileName: 'Anna_Univ_Zonal_RunnerUp_Cert.pdf',
      fileType: 'pdf',
      fileSize: '2.1 MB',
      uploadedAt: '25 Aug 2026',
      verificationStatus: 'verified',
      verificationAuthority: 'Physical Education Dept',
    },
  },
  {
    id: 'GL-07',
    studentId: 'STU_006',
    studentName: 'Dharun Raj',
    rollNo: '23CI009',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'B',
    avatarInitials: 'DR',
    title: 'Publish Open-Source Flutter State Management Library',
    category: 'Technical & Professional',
    targetOutcome: 'Package on pub.dev',
    priority: 'Medium',
    createdDate: '15 Aug 2026',
    targetDate: '30 Sep 2026',
    deadlineContext: '28 days remaining',
    percentage: 50,
    completedMilestones: 2,
    totalMilestones: 4,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Core Engine Architecture & Unit Tests',
        status: 'completed',
        completedAt: '22 Aug 2026',
      },
      {
        id: 'm2',
        title: 'GitHub Repository & CI/CD Pipeline',
        status: 'completed',
        completedAt: '30 Aug 2026',
      },
      {
        id: 'm3',
        title: 'Documentation & Example App',
        status: 'in_progress',
        dueText: 'Due 15 Sep 2026',
      },
      {
        id: 'm4',
        title: 'Publish Version 1.0.0 to pub.dev',
        status: 'pending',
        dueText: 'Due 30 Sep 2026',
      },
    ],
  },
  {
    id: 'GL-08',
    studentId: 'STU_007',
    studentName: 'Kavya M',
    rollNo: '23CI031',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'B',
    avatarInitials: 'KM',
    title: 'Complete LeetCode 150 Interview Preparation Milestone',
    category: 'Technical & Professional',
    targetOutcome: '150 Problems Solved',
    priority: 'High',
    createdDate: '01 Aug 2026',
    targetDate: '10 Nov 2026',
    deadlineContext: '69 days remaining',
    percentage: 80,
    completedMilestones: 4,
    totalMilestones: 5,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Arrays, Strings & Two Pointers (30 Qs)',
        status: 'completed',
        completedAt: '10 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Linked Lists, Stacks & Queues (30 Qs)',
        status: 'completed',
        completedAt: '20 Aug 2026',
      },
      {
        id: 'm3',
        title: 'Trees & Graphs (30 Qs)',
        status: 'completed',
        completedAt: '28 Aug 2026',
      },
      {
        id: 'm4',
        title: 'Dynamic Programming & Greedy (30 Qs)',
        status: 'completed',
        completedAt: '01 Sep 2026',
        proofRequired: true,
        proofName: 'LeetCode_Profile_120_Solved.png',
        proofSize: '650 KB',
      },
      {
        id: 'm5',
        title: 'Mock Coding Interviews (10 Sessions)',
        status: 'in_progress',
        dueText: 'Due 10 Nov 2026',
      },
    ],
    proofAttachment: {
      id: 'PRF-08',
      milestoneId: 'm4',
      type: 'credential_page',
      label: 'LeetCode Profile Screenshot',
      fileName: 'LeetCode_Profile_120_Solved.png',
      fileType: 'png',
      fileSize: '650 KB',
      uploadedAt: '01 Sep 2026',
      verificationStatus: 'submitted',
    },
  },
  {
    id: 'GL-09',
    studentId: 'STU_007',
    studentName: 'Kavya M',
    rollNo: '23CI031',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'B',
    avatarInitials: 'KM',
    title: 'NPTEL 8-Week Course: Cloud Architecture',
    category: 'Certifications & Online Learning',
    targetOutcome: 'Certification with 75%+',
    priority: 'Medium',
    createdDate: '10 Jul 2026',
    targetDate: '20 Aug 2026',
    deadlineContext: 'Completed on 20 Aug 2026',
    percentage: 100,
    completedMilestones: 4,
    totalMilestones: 4,
    status: 'Completed',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Weeks 1-4 Assignments',
        status: 'completed',
        completedAt: '25 Jul 2026',
      },
      {
        id: 'm2',
        title: 'Weeks 5-8 Assignments',
        status: 'completed',
        completedAt: '08 Aug 2026',
      },
      {
        id: 'm3',
        title: 'Proctored Final Exam',
        status: 'completed',
        completedAt: '18 Aug 2026',
      },
      {
        id: 'm4',
        title: 'Certificate Issuance',
        status: 'completed',
        completedAt: '20 Aug 2026',
        proofRequired: true,
        proofName: 'NPTEL_Cloud_Architecture_Certificate.pdf',
        proofSize: '1.1 MB',
      },
    ],
    proofAttachment: {
      id: 'PRF-09',
      milestoneId: 'm4',
      type: 'course_certificate',
      label: 'NPTEL Course Certificate',
      fileName: 'NPTEL_Cloud_Architecture_Certificate.pdf',
      fileType: 'pdf',
      fileSize: '1.1 MB',
      uploadedAt: '20 Aug 2026',
      verificationStatus: 'verified',
      verificationAuthority: 'Academic Coordinator',
    },
  },
  {
    id: 'GL-10',
    studentId: 'STU_008',
    studentName: 'Sanjay M',
    rollNo: '23CI052',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'SM',
    title: 'Organize College Robotics Workshop & Hackathon',
    category: 'Leadership',
    targetOutcome: 'Event Completed with 80+ Attendees',
    priority: 'Medium',
    createdDate: '10 Aug 2026',
    targetDate: '28 Sep 2026',
    deadlineContext: '26 days remaining',
    percentage: 50,
    completedMilestones: 2,
    totalMilestones: 4,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Speaker & Resource Person Finalization',
        status: 'completed',
        completedAt: '20 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Lab Booking & Kit Procurement',
        status: 'completed',
        completedAt: '30 Aug 2026',
      },
      {
        id: 'm3',
        title: 'Registration Drive (Target: 80 students)',
        status: 'in_progress',
        dueText: 'Due 15 Sep 2026',
      },
      {
        id: 'm4',
        title: 'Event Execution & Report Generation',
        status: 'pending',
        dueText: 'Due 28 Sep 2026',
      },
    ],
  },
  {
    id: 'GL-11',
    studentId: 'STU_009',
    studentName: 'Naveen K',
    rollNo: '23CI038',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'NK',
    title: 'Develop Rural Water Quality Monitoring System',
    category: 'Social Impact',
    targetOutcome: 'Community Deployment',
    priority: 'High',
    createdDate: '05 Aug 2026',
    targetDate: '15 Oct 2026',
    deadlineContext: '43 days remaining',
    percentage: 33,
    completedMilestones: 1,
    totalMilestones: 3,
    status: 'Active',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Field Survey & Water Sample Testing',
        status: 'completed',
        completedAt: '22 Aug 2026',
      },
      {
        id: 'm2',
        title: 'IoT Sensor Node Deployment in Village Tank',
        status: 'in_progress',
        dueText: 'Due 20 Sep 2026',
      },
      {
        id: 'm3',
        title: 'SMS Alert Dashboard for Village Panchayat',
        status: 'pending',
        dueText: 'Due 15 Oct 2026',
      },
    ],
  },
  {
    id: 'GL-12',
    studentId: 'STU_004',
    studentName: 'Arun Kumar',
    rollNo: '23CI018',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'AK',
    title: 'NPTEL 8-Week Course: Python for Data Science',
    category: 'Certifications & Online Learning',
    targetOutcome: 'Complete Weekly Assignments',
    priority: 'High',
    createdDate: '15 Jul 2026',
    targetDate: '25 Aug 2026',
    deadlineContext: 'Overdue by 8 days',
    percentage: 20,
    completedMilestones: 1,
    totalMilestones: 5,
    status: 'Overdue',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Week 1-2 Assignment Submission',
        status: 'completed',
        completedAt: '02 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Week 3-4 Assignment Submission',
        status: 'pending',
        dueText: 'Overdue (Target 15 Aug)',
      },
      {
        id: 'm3',
        title: 'Week 5-6 Assignment Submission',
        status: 'pending',
        dueText: 'Overdue (Target 25 Aug)',
      },
      {
        id: 'm4',
        title: 'Week 7-8 Assignment Submission',
        status: 'pending',
        dueText: 'Overdue (Target 28 Aug)',
      },
      {
        id: 'm5',
        title: 'Final Exam Registration',
        status: 'pending',
        dueText: 'Target 05 Sep',
      },
    ],
  },
  {
    id: 'GL-13',
    studentId: 'STU_010',
    studentName: 'Rithika V',
    rollNo: '23CI049',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'RV',
    title: 'Google Cloud Associate Cloud Engineer Certification',
    category: 'Certifications & Online Learning',
    targetOutcome: 'Certification Exam Pass',
    priority: 'High',
    createdDate: '20 Jul 2026',
    targetDate: '28 Aug 2026',
    deadlineContext: 'Overdue by 5 days',
    percentage: 25,
    completedMilestones: 1,
    totalMilestones: 4,
    status: 'Overdue',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Complete Cloud Architecture Pathway on Coursera',
        status: 'completed',
        completedAt: '05 Aug 2026',
      },
      {
        id: 'm2',
        title: 'GCP Hands-on Lab Quests (5 Quests)',
        status: 'pending',
        dueText: 'Overdue (Target 20 Aug)',
      },
      {
        id: 'm3',
        title: 'Official Practice Exam',
        status: 'pending',
        dueText: 'Overdue (Target 28 Aug)',
      },
      {
        id: 'm4',
        title: 'Schedule Proctored ACE Exam',
        status: 'pending',
        dueText: 'Target 15 Sep',
      },
    ],
  },
  {
    id: 'GL-14',
    studentId: 'STU_005',
    studentName: 'Priya S',
    rollNo: '23CI027',
    department: 'CSE (IoT)',
    currentYear: 3,
    section: 'A',
    avatarInitials: 'PS',
    title: 'Smart City Energy Optimization Algorithm Draft',
    category: 'Research & IPR',
    targetOutcome: 'Algorithm Benchmark Report',
    priority: 'Medium',
    createdDate: '01 Aug 2026',
    targetDate: '01 Sep 2026',
    deadlineContext: 'Overdue by 1 day',
    percentage: 40,
    completedMilestones: 2,
    totalMilestones: 5,
    status: 'Overdue',
    semester: 'Semester 5',
    milestones: [
      {
        id: 'm1',
        title: 'Grid Data Collection & Normalization',
        status: 'completed',
        completedAt: '12 Aug 2026',
      },
      {
        id: 'm2',
        title: 'Heuristic Optimization Model Formulation',
        status: 'completed',
        completedAt: '24 Aug 2026',
      },
      {
        id: 'm3',
        title: 'MATLAB Simulation & Benchmark Tests',
        status: 'pending',
        dueText: 'Overdue (Target 01 Sep)',
      },
      {
        id: 'm4',
        title: 'Draft Research Paper Submission',
        status: 'pending',
        dueText: 'Target 15 Sep',
      },
      {
        id: 'm5',
        title: 'Submit to IEEE SmartGrid Conference',
        status: 'pending',
        dueText: 'Target 30 Sep',
      },
    ],
  },
];

export interface ProctorNotificationItem {
  id: string;
  type: 'submission' | 'approved' | 'correction' | 'goal' | 'assigned' | 'team_achievement';
  title: string;
  message: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
  isRead: boolean;
  studentName: string;
  studentId?: string;
  achievementId?: string;
  teamAchievementId?: string; // for team_achievement notifications (read-only monitoring)
}

export const PROCTOR_NOTIFICATIONS: ProctorNotificationItem[] = [
  {
    id: 'PN-01',
    type: 'submission',
    title: 'Achievement Submitted',
    message: 'Gokulraj V submitted a Hackathon achievement for verification.',
    time: '2 hours ago',
    dateGroup: 'Today',
    isRead: false,
    studentName: 'Gokulraj V',
    studentId: 'STU_001',
    achievementId: 'ACH-001',
  },
  {
    id: 'PN-02',
    type: 'approved',
    title: 'Achievement Approved',
    message: "Gokulraj V's Smart India Hackathon achievement was verified (+50 Pts).",
    time: '5 hours ago',
    dateGroup: 'Today',
    isRead: false,
    studentName: 'Gokulraj V',
    studentId: 'STU_001',
    achievementId: 'ACH-001',
  },
  {
    id: 'PN-03',
    type: 'correction',
    title: 'Correction Required',
    message: 'Priya S needs to re-upload official ID proof for Sports Achievement.',
    time: 'Yesterday, 4:30 PM',
    dateGroup: 'Yesterday',
    isRead: true,
    studentName: 'Priya S',
    studentId: 'STU_005',
    achievementId: 'ACH-007',
  },
  {
    id: 'PN-04',
    type: 'goal',
    title: 'Goal Progress Updated',
    message: 'Gokulraj V completed Milestone 3 of 5: Research Paper Acceptance.',
    time: 'Yesterday, 11:15 AM',
    dateGroup: 'Yesterday',
    isRead: true,
    studentName: 'Gokulraj V',
    studentId: 'STU_001',
  },
  {
    id: 'PN-05',
    type: 'assigned',
    title: 'New Student Assigned',
    message: 'Jeeva M (23CI019) has been assigned to your Proctor guidance group.',
    time: '3 days ago',
    dateGroup: 'Earlier',
    isRead: true,
    studentName: 'Jeeva M',
    studentId: 'STU_003',
  },
  {
    id: 'PN-06',
    type: 'team_achievement',
    title: 'Team Achievement Submitted',
    message:
      'Team Code Nexus submitted Smart India Hackathon 2026. 5 students — 4 of 5 certificates uploaded. Sathishkumar’s certificate is still missing.',
    time: '4 days ago',
    dateGroup: 'Earlier',
    isRead: false,
    studentName: 'Gokulraj V',
    studentId: 'STU_001',
    teamAchievementId: 'TA-SIH-2026-001',
  },
];

let currentProctorNotifications: ProctorNotificationItem[] = [...PROCTOR_NOTIFICATIONS];
type ProctorNotifListener = () => void;
const proctorListeners = new Set<ProctorNotifListener>();

export function subscribeProctorNotifications(listener: ProctorNotifListener): () => void {
  proctorListeners.add(listener);
  return () => proctorListeners.delete(listener);
}

export function getAllProctorNotifications(): ProctorNotificationItem[] {
  return [...currentProctorNotifications];
}

export function addProctorNotification(notif: ProctorNotificationItem): void {
  currentProctorNotifications = [notif, ...currentProctorNotifications.filter((n) => n.id !== notif.id)];
  proctorListeners.forEach((l) => l());
}

export function updateProctorTeamNotification(teamAchievementId: string, message: string): void {
  currentProctorNotifications = currentProctorNotifications.map((n) => {
    if (n.type === 'team_achievement' && n.teamAchievementId === teamAchievementId) {
      return { ...n, message, time: 'Just now', dateGroup: 'Today' };
    }
    return n;
  });
  proctorListeners.forEach((l) => l());
}

export const PROCTOR_SUMMARY_DATA = {
  assignedStudents: 10,
  achieverStudents: 7,
  attentionStudents: 3,
  achieverPercentage: 70, // 7 / 10 = 70%
  totalSubmitted: 28,
  totalApproved: 18,
  totalPending: 7,
  totalCorrections: 3,
};

export const PROCTOR_TOP_PERFORMER = {
  name: 'Gokulraj V',
  registerNumber: '23CI011',
  department: 'CSE (IoT)',
  achievementsCount: 12,
  points: 850,
};

export const PROCTOR_NEEDS_ATTENTION = [
  {
    id: 'ATT-01',
    studentId: 'STU_004',
    name: 'Arun Kumar',
    registerNumber: '23CI018',
    department: 'CSE (IoT)',
    issue: 'No achievements this semester',
    tag: 'No Activity',
  },
  {
    id: 'ATT-02',
    studentId: 'STU_005',
    name: 'Priya S',
    registerNumber: '23CI027',
    department: 'CSE (IoT)',
    issue: '2 submissions need correction',
    tag: 'Action Required',
  },
];

export const PROCTOR_STUDENT_ACTIVITIES: FacultyActivityItem[] = [
  {
    id: 'PA-01',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    title: 'Hackathon Participation',
    category: 'Technical & Innovation',
    status: 'Approved',
    date: '31.08.2026',
    points: 50,
  },
  {
    id: 'PA-02',
    studentName: 'Karthikeyan M',
    rollNo: '23CI024',
    title: 'Hackathon Participation',
    category: 'Technical & Innovation',
    status: 'Pending',
    date: '30.08.2026',
    points: 30,
  },
  {
    id: 'PA-03',
    studentName: 'Jeeva M',
    rollNo: '23CI019',
    title: 'Hackathon Participation',
    category: 'Technical & Innovation',
    status: 'Approved',
    date: '30.08.2026',
    points: 40,
  },
];

export const MENTOR_STUDENT_ACTIVITIES: FacultyActivityItem[] = [
  {
    id: 'MA-01',
    studentName: 'Autonomous Campus Drone Team',
    rollNo: 'Batch 2026-A',
    title: 'Milestone 3 of 4: Drone Autopilot Test completed',
    category: 'Capstone Project',
    status: 'Approved',
    date: 'Today',
    points: 40,
  },
  {
    id: 'MA-02',
    studentName: 'AI Agri-Sensor Project Team',
    rollNo: 'Batch 2026-B',
    title: 'Patent Specification Draft Uploaded',
    category: 'Innovation / IPR',
    status: 'Pending',
    date: 'Yesterday',
    points: 30,
  },
];

export const WORKSPACE_CONFIG: Record<
  FacultyWorkspaceId,
  {
    label: string;
    badgeLabel: string;
    subtitle: string;
    icon: string;
    heroTitle: string;
    primaryMetricNumber: string | number;
    primaryMetricLabel: string;
    secondaryMetric1: string;
    secondaryMetric2: string;
    gaugePercentage: number;
    quickActions: Array<{
      id: string;
      title: string;
      icon: string;
      color: string;
      bgColor: string;
      route?: string;
    }>;
  }
> = {
  faculty: {
    label: 'Faculty',
    badgeLabel: 'Faculty Workspace',
    subtitle: 'CSE (IoT)',
    icon: 'briefcase-outline',
    heroTitle: 'Faculty Performance',
    primaryMetricNumber: 100,
    primaryMetricLabel: 'Points',
    secondaryMetric1: '12 Achievements',
    secondaryMetric2: '12 Approved',
    gaugePercentage: 80,
    quickActions: [
      {
        id: 'add_achievement',
        title: 'Add Achievement',
        icon: 'add-circle-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'facultyAddAchievement',
      },
      {
        id: 'my_achievements',
        title: 'My Achievements',
        icon: 'trophy-outline',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        route: 'facultyAchievements',
      },
      {
        id: 'goals',
        title: 'Goals',
        icon: 'compass-outline',
        color: '#0891B2',
        bgColor: '#ECFEFF',
        route: 'goals',
      },
    ],
  },
  tutor: {
    label: 'Tutor',
    badgeLabel: 'Tutor Workspace',
    subtitle: 'CSE (IoT) • 3rd Year A',
    icon: 'people-outline',
    heroTitle: 'My Class Overview',
    primaryMetricNumber: 58,
    primaryMetricLabel: 'Students',
    secondaryMetric1: '42 Achievers',
    secondaryMetric2: '73% Participation',
    gaugePercentage: 73,
    quickActions: [
      {
        id: 'assigned_students',
        title: 'Class Students',
        icon: 'people-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'assignedStudents',
      },
      {
        id: 'student_activity',
        title: 'Student Activity',
        icon: 'pulse-outline',
        color: '#16A34A',
        bgColor: '#F0FDF4',
        route: 'assignedStudents',
      },
      {
        id: 'class_performance',
        title: 'Class Leaderboard',
        icon: 'bar-chart-outline',
        color: '#D97706',
        bgColor: '#FFFBEB',
        route: 'facultyLeaderboard',
      },
    ],
  },
  proctor: {
    label: 'Proctor',
    badgeLabel: 'Proctor Workspace',
    subtitle: '24 Assigned Students',
    icon: 'shield-checkmark-outline',
    heroTitle: 'My Proctees',
    primaryMetricNumber: 24,
    primaryMetricLabel: 'Proctees',
    secondaryMetric1: '18 Active Achievers',
    secondaryMetric2: '6 Need Attention',
    gaugePercentage: 75,
    quickActions: [
      {
        id: 'my_proctees',
        title: 'My Proctees',
        icon: 'person-circle-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'assignedStudents',
      },
      {
        id: 'attention_list',
        title: 'Attention List',
        icon: 'alert-circle-outline',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        route: 'resubmissionRequired',
      },
      {
        id: 'verification_history',
        title: 'Verification Log',
        icon: 'receipt-outline',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        route: 'verificationHistory',
      },
    ],
  },
  mentor: {
    label: 'Mentor',
    badgeLabel: 'Mentor Workspace',
    subtitle: '12 Assigned Mentees',
    icon: 'heart-outline',
    heroTitle: 'My Mentees & Projects',
    primaryMetricNumber: 12,
    primaryMetricLabel: 'Mentees',
    secondaryMetric1: '8 Active Goals',
    secondaryMetric2: '5 Recent Honors',
    gaugePercentage: 67,
    quickActions: [
      {
        id: 'my_mentees',
        title: 'My Mentees',
        icon: 'people-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'assignedStudents',
      },
      {
        id: 'goal_progress',
        title: 'Goal Tracking',
        icon: 'flag-outline',
        color: '#0891B2',
        bgColor: '#ECFEFF',
        route: 'goals',
      },
      {
        id: 'project_reviews',
        title: 'Project Reviews',
        icon: 'documents-outline',
        color: '#16A34A',
        bgColor: '#F0FDF4',
        route: 'assignedStudents',
      },
    ],
  },
  academic_coordinator: {
    label: 'Academic Coordinator',
    badgeLabel: 'AC Workspace',
    subtitle: 'CSE (IoT) • All Years',
    icon: 'clipboard-outline',
    heroTitle: 'Department Overview',
    primaryMetricNumber: 248,
    primaryMetricLabel: 'Approved',
    secondaryMetric1: '12 Pending Verification',
    secondaryMetric2: '94% Compliance',
    gaugePercentage: 94,
    quickActions: [
      {
        id: 'review_queue',
        title: 'Review Queue',
        icon: 'shield-checkmark-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'facultySubmissions',
      },
      {
        id: 'resubmissions',
        title: 'Resubmissions',
        icon: 'alert-circle-outline',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        route: 'resubmissionRequired',
      },
      {
        id: 'reports',
        title: 'Dept Reports',
        icon: 'document-text-outline',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        route: 'reports',
      },
    ],
  },
  hod: {
    label: 'Head of Department',
    badgeLabel: 'HOD Workspace',
    subtitle: 'CSE (IoT) — Nandha Engg College',
    icon: 'school-outline',
    heroTitle: 'Department Performance',
    primaryMetricNumber: 320,
    primaryMetricLabel: 'Achievements',
    secondaryMetric1: '18 Faculty Members',
    secondaryMetric2: '85% Achievers Rate',
    gaugePercentage: 85,
    quickActions: [
      {
        id: 'verify',
        title: 'Verify Submissions',
        icon: 'shield-checkmark-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'hodVerificationQueue',
      },
      {
        id: 'faculty_list',
        title: 'Faculty Directory',
        icon: 'briefcase-outline',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        route: 'hodFacultyList',
      },
      {
        id: 'student_list',
        title: 'Student Monitoring',
        icon: 'people-outline',
        color: '#16A34A',
        bgColor: '#F0FDF4',
        route: 'hodStudentList',
      },
      {
        id: 'reports',
        title: 'Official Reports',
        icon: 'document-text-outline',
        color: '#7C3AED',
        bgColor: '#F5F3FF',
        route: 'hodReports',
      },
    ],
  },
  head: {
    label: 'Head',
    badgeLabel: 'Head Workspace',
    subtitle: 'Nandha Engineering College (Governance)',
    icon: 'school-outline',
    heroTitle: 'College Achievement Matrix',
    primaryMetricNumber: 2840,
    primaryMetricLabel: 'Verified Records',
    secondaryMetric1: '48,650 Points Awarded',
    secondaryMetric2: '8/8 Active Departments',
    gaugePercentage: 92,
    quickActions: [
      {
        id: 'scoring_rules',
        title: 'Scoring Rules',
        icon: 'calculator-outline',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        route: 'headPointsManagement',
      },
      {
        id: 'categories',
        title: 'Categories',
        icon: 'layers-outline',
        color: '#059669',
        bgColor: '#ECFDF5',
        route: 'headCategoryManagement',
      },
      {
        id: 'all_achievements',
        title: 'All Achievements',
        icon: 'trophy-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'headCollegeAchievements',
      },
      {
        id: 'reports',
        title: 'Executive Reports',
        icon: 'document-text-outline',
        color: '#D97706',
        bgColor: '#FFFBEB',
        route: 'headReports',
      },
    ],
  },
  dean: {
    label: 'Dean',
    badgeLabel: 'Dean Workspace',
    subtitle: 'Nandha Engineering College (Assigned Scope: 3 Depts)',
    icon: 'shield-checkmark-outline',
    heroTitle: 'HOD Governance & Verification',
    primaryMetricNumber: 3,
    primaryMetricLabel: 'Pending HOD Reviews',
    secondaryMetric1: '37 Total Decisions',
    secondaryMetric2: '3 Departments Scoped',
    gaugePercentage: 88,
    quickActions: [
      {
        id: 'hod_reviews',
        title: 'HOD Reviews',
        icon: 'checkbox-outline',
        color: '#0D9488',
        bgColor: '#F0FDFA',
        route: 'deanVerificationQueue',
      },
      {
        id: 'review_history',
        title: 'Audit History',
        icon: 'time-outline',
        color: '#059669',
        bgColor: '#ECFDF5',
        route: 'deanVerificationHistory',
      },
      {
        id: 'my_achievements',
        title: 'My Achievements',
        icon: 'trophy-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'myAchievements',
      },
      {
        id: 'notifications',
        title: 'Dean Alerts',
        icon: 'notifications-outline',
        color: '#D97706',
        bgColor: '#FFFBEB',
        route: 'deanNotifications',
      },
    ],
  },
  principal: {
    label: 'Principal',
    badgeLabel: 'Principal Workspace',
    subtitle: 'Nandha Engineering College (Institutional Head)',
    icon: 'crown',
    heroTitle: 'College Institutional Oversight',
    primaryMetricNumber: 2840,
    primaryMetricLabel: 'Verified Achievements',
    secondaryMetric1: '48,650 Points Awarded',
    secondaryMetric2: '8 Active Departments',
    gaugePercentage: 96,
    quickActions: [
      {
        id: 'approvals',
        title: 'Approvals',
        icon: 'checkbox-outline',
        color: '#D97706',
        bgColor: '#FEFCE8',
        route: 'principalVerificationQueue',
      },
      {
        id: 'departments',
        title: 'Departments',
        icon: 'business-outline',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        route: 'principalDepartments',
      },
      {
        id: 'reports',
        title: 'Reports',
        icon: 'document-text-outline',
        color: '#4F46E5',
        bgColor: '#EEF2FF',
        route: 'principalReports',
      },
      {
        id: 'assign',
        title: 'Assign',
        icon: 'people-outline',
        color: '#059669',
        bgColor: '#ECFDF5',
        route: 'principalDeanAssignments',
      },
    ],
  },
};
