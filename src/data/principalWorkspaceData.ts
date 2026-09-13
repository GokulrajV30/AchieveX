// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Workspace Data Store & Permissions Architecture
// Highest institutional oversight role.
// Authority:
// - Verifies DEAN PERSONAL ACHIEVEMENTS ONLY
// - Manages Dean Department Responsibilities (routes HOD submissions)
// - Oversees Institution Performance, Departments, Students & Faculty
// - Views Achievement Head Policy READ-ONLY
// - Generates & Previews Institutional Reports
// ─────────────────────────────────────────────────────────────

export interface DeanPersonalSubmission {
  id: string;
  deanId: string;
  deanName: string;
  deanEmployeeId: string;
  designation: string;
  departmentScope: string[];
  title: string;
  categoryId: string;
  categoryTitle: string;
  achievementType: string;
  level: 'College' | 'Zonal' | 'State' | 'National' | 'International';
  result: string;
  organizer: string;
  date: string;
  academicYear: string;
  semester?: string;
  description: string;
  proofs: {
    id: string;
    label: string;
    fileName: string;
    fileSize: string;
    fileType: 'pdf' | 'png' | 'jpg';
    status: 'Required' | 'Optional';
    uploadedAt: string;
  }[];
  configuredPoints: number;
  status: 'Pending Review' | 'Correction Required' | 'Verified' | 'Rejected';
  correctionReason?: string;
  previousCorrectionReason?: string;
  submittedAt: string;
  resubmittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  awardedPoints?: number;
}

export interface PrincipalVerificationRecord {
  id: string;
  submissionId: string;
  deanId: string;
  deanName: string;
  achievementTitle: string;
  categoryTitle: string;
  decision: 'Verified' | 'Correction Required' | 'Rejected';
  reason?: string;
  awardedPoints: number;
  verifiedBy: string;
  verificationRole: 'Principal';
  verifiedAt: string;
  proofCount: number;
}

export interface PrincipalDeanAssignment {
  id: string;
  institutionId: string;
  deanFacultyId: string;
  deanName: string;
  deanEmployeeId: string;
  deanDesignation: string;
  departmentId: string;
  departmentName: string;
  assignedByPrincipalId: string;
  assignedAt: string;
  removedAt?: string;
  removedBy?: string;
  status: 'active' | 'inactive';
}

export interface PrincipalInstitutionAttentionItem {
  id: string;
  type: 'dean_approval' | 'unassigned_department' | 'backlog_warning' | 'policy_update';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'info';
  actionText: string;
  actionRoute: string;
  targetId?: string;
  metadata?: any;
}

export interface PrincipalDepartmentMetric {
  id: string;
  code: string;
  name: string;
  hodName: string;
  hodEmployeeId: string;
  assignedDeanName: string;
  assignedDeanId?: string;
  studentsCount: number;
  facultyCount: number;
  achievementsCount: number;
  pointsTotal: number;
  activeAchieversCount: number;
  pendingReviewsCount: number;
  topCategory: string;
}

export interface PrincipalNotification {
  id: string;
  title: string;
  message: string;
  type: 'dean_submission' | 'correction_resubmitted' | 'assignment_updated' | 'system';
  timestamp: string;
  isRead: boolean;
  targetRoute?: string;
  submissionId?: string;
}

export const DEMO_PRINCIPAL_USER = {
  id: 'faculty_principal',
  name: 'Dr. S. Arumugam',
  designation: 'Principal & Institutional Head',
  employeeId: 'NEC-PRIN-001',
  email: 'principal@nandhaengg.org',
  institution: 'Nandha Engineering College',
  institutionId: 'inst_nandha',
  phone: '+91 98427 11223',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  stats: {
    totalDepartments: 8,
    totalStudents: 2400,
    totalFaculty: 180,
    verifiedAchievements: 2840,
    achievementPoints: 48650,
    pendingDeanReviews: 4,
  },
};

// ── Department Catalog ──
export const INITIAL_INSTITUTION_DEPARTMENTS: PrincipalDepartmentMetric[] = [
  {
    id: 'CSE_IOT',
    code: 'CSE (IoT)',
    name: 'Computer Science & Engineering (IoT)',
    hodName: 'Dr. Arun Kumar',
    hodEmployeeId: 'NEC-HOD-010',
    assignedDeanName: 'Dr. Kumar V',
    assignedDeanId: 'faculty_kumar',
    studentsCount: 240,
    facultyCount: 18,
    achievementsCount: 420,
    pointsTotal: 7420,
    activeAchieversCount: 172,
    pendingReviewsCount: 14,
    topCategory: 'Research, Publication & IPR',
  },
  {
    id: 'CSE',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hodName: 'Dr. Rajesh K',
    hodEmployeeId: 'NEC-HOD-011',
    assignedDeanName: 'Dr. Kumar V',
    assignedDeanId: 'faculty_kumar',
    studentsCount: 398,
    facultyCount: 24,
    achievementsCount: 480,
    pointsTotal: 8350,
    activeAchieversCount: 215,
    pendingReviewsCount: 8,
    topCategory: 'Technical Competitions & Hackathons',
  },
  {
    id: 'IT',
    code: 'IT',
    name: 'Information Technology',
    hodName: 'Dr. Priya S',
    hodEmployeeId: 'NEC-HOD-012',
    assignedDeanName: 'Dr. Kumar V',
    assignedDeanId: 'faculty_kumar',
    studentsCount: 280,
    facultyCount: 20,
    achievementsCount: 390,
    pointsTotal: 6780,
    activeAchieversCount: 160,
    pendingReviewsCount: 6,
    topCategory: 'Industry Certification & NPTEL',
  },
  {
    id: 'AIDS',
    code: 'AIDS',
    name: 'Artificial Intelligence & Data Science',
    hodName: 'Dr. Deepa N',
    hodEmployeeId: 'NEC-HOD-016',
    assignedDeanName: 'Unassigned',
    assignedDeanId: undefined,
    studentsCount: 356,
    facultyCount: 22,
    achievementsCount: 410,
    pointsTotal: 6950,
    activeAchieversCount: 184,
    pendingReviewsCount: 9,
    topCategory: 'Technical Competitions & Hackathons',
  },
  {
    id: 'ECE',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    hodName: 'Dr. Suresh M',
    hodEmployeeId: 'NEC-HOD-014',
    assignedDeanName: 'Dr. K. S. Lakshmi',
    assignedDeanId: 'faculty_lakshmi',
    studentsCount: 340,
    facultyCount: 26,
    achievementsCount: 360,
    pointsTotal: 6120,
    activeAchieversCount: 145,
    pendingReviewsCount: 4,
    topCategory: 'Patents & Intellectual Property',
  },
  {
    id: 'EEE',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    hodName: 'Dr. Ramesh V',
    hodEmployeeId: 'NEC-HOD-015',
    assignedDeanName: 'Dr. K. S. Lakshmi',
    assignedDeanId: 'faculty_lakshmi',
    studentsCount: 260,
    facultyCount: 20,
    achievementsCount: 290,
    pointsTotal: 4950,
    activeAchieversCount: 110,
    pendingReviewsCount: 5,
    topCategory: 'Funded Research Grants & Schemes',
  },
  {
    id: 'BME',
    code: 'BME',
    name: 'Biomedical Engineering',
    hodName: 'Dr. Malathi K',
    hodEmployeeId: 'NEC-HOD-017',
    assignedDeanName: 'Dr. K. S. Lakshmi',
    assignedDeanId: 'faculty_lakshmi',
    studentsCount: 220,
    facultyCount: 18,
    achievementsCount: 250,
    pointsTotal: 4280,
    activeAchieversCount: 98,
    pendingReviewsCount: 3,
    topCategory: 'Industry Consultancy & Healthcare',
  },
  {
    id: 'CSE_CS',
    code: 'CSE (Cyber)',
    name: 'Computer Science & Engineering (Cyber Security)',
    hodName: 'Dr. Chandran P',
    hodEmployeeId: 'NEC-HOD-018',
    assignedDeanName: 'Dr. Kumar V',
    assignedDeanId: 'faculty_kumar',
    studentsCount: 246,
    facultyCount: 18,
    achievementsCount: 240,
    pointsTotal: 3800,
    activeAchieversCount: 88,
    pendingReviewsCount: 7,
    topCategory: 'Workshops & Professional Training',
  },
];

// ── Dean Department Assignments ──
export const INITIAL_DEAN_ASSIGNMENTS: PrincipalDeanAssignment[] = [
  {
    id: 'assign_prin_01',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    deanDesignation: 'Dean of Academic Affairs',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_prin_02',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    deanDesignation: 'Dean of Academic Affairs',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_prin_03',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    deanDesignation: 'Dean of Academic Affairs',
    departmentId: 'IT',
    departmentName: 'Information Technology',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_prin_04',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    deanDesignation: 'Dean of Academic Affairs',
    departmentId: 'CSE_CS',
    departmentName: 'CSE (Cyber Security)',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-07-15',
    status: 'active',
  },
  {
    id: 'assign_prin_05',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    deanEmployeeId: 'NEC-DEAN-002',
    deanDesignation: 'Dean of Student Affairs & Technology',
    departmentId: 'ECE',
    departmentName: 'Electronics & Communication',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_prin_06',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    deanEmployeeId: 'NEC-DEAN-002',
    deanDesignation: 'Dean of Student Affairs & Technology',
    departmentId: 'EEE',
    departmentName: 'Electrical & Electronics',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_prin_07',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    deanEmployeeId: 'NEC-DEAN-002',
    deanDesignation: 'Dean of Student Affairs & Technology',
    departmentId: 'BME',
    departmentName: 'Biomedical Engineering',
    assignedByPrincipalId: 'faculty_principal',
    assignedAt: '2025-06-01',
    status: 'active',
  },
];

// ── Dean Personal Submissions (Verifiable by Principal) ──
export const INITIAL_DEAN_SUBMISSIONS: DeanPersonalSubmission[] = [
  {
    id: 'DEAN-SUB-001',
    deanId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    designation: 'Dean of Academic Affairs',
    departmentScope: ['CSE (IoT)', 'CSE', 'IT', 'CSE (Cyber Security)'],
    title: 'Research Paper Publication: Quantum-Resistant Cryptographic Primitives in Edge Computing',
    categoryId: 'cat_research',
    categoryTitle: 'Research, Publication & IPR',
    achievementType: 'SCI / Scopus Indexed Journal',
    level: 'International',
    result: 'Published in IEEE Transactions on Computers',
    organizer: 'IEEE Computer Society, USA',
    date: '2026-09-02',
    academicYear: '2026-27',
    semester: 'Odd Semester',
    description: 'Developed high-efficiency lattice-based signature scheme optimized for memory-constrained edge nodes. Paper accepted with zero major revisions.',
    proofs: [
      {
        id: 'proof_d01',
        label: 'IEEE Final Published PDF Reprint',
        fileName: 'ieee_tc_quantum_lattice_kumar.pdf',
        fileSize: '3.1 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-09-02',
      },
      {
        id: 'proof_d02',
        label: 'IEEE Acceptance Notice & Reviewer Ratings',
        fileName: 'acceptance_letter_ieee_tc.pdf',
        fileSize: '820 KB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-09-02',
      },
    ],
    configuredPoints: 200,
    status: 'Pending Review',
    submittedAt: '2026-09-02',
  },
  {
    id: 'DEAN-SUB-002',
    deanId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    designation: 'Dean of Academic Affairs',
    departmentScope: ['CSE (IoT)', 'CSE', 'IT'],
    title: 'AICTE National Technical Book Writing Grant: Advanced Distributed Operating Systems',
    categoryId: 'cat_grants',
    categoryTitle: 'Funded Research Grants & Schemes',
    achievementType: 'National Agency Sponsored Scheme',
    level: 'National',
    result: 'Sanctioned (₹3,50,000)',
    organizer: 'All India Council for Technical Education (AICTE), New Delhi',
    date: '2026-08-26',
    academicYear: '2026-27',
    semester: 'Odd Semester',
    description: 'Awarded textbook authoring grant in regional and English languages for diploma and undergraduate engineering curricula across India.',
    proofs: [
      {
        id: 'proof_d03',
        label: 'AICTE Sanction Letter',
        fileName: 'aicte_grant_sanction_order_2026.pdf',
        fileSize: '2.4 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-26',
      },
    ],
    configuredPoints: 250,
    status: 'Pending Review',
    submittedAt: '2026-08-29',
  },
  {
    id: 'DEAN-SUB-003',
    deanId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    deanEmployeeId: 'NEC-DEAN-002',
    designation: 'Dean of Student Affairs & Technology',
    departmentScope: ['ECE', 'EEE', 'BME'],
    title: 'IEEE Senior Member Recognition Citation & Outstanding Service Award',
    categoryId: 'cat_professional',
    categoryTitle: 'Professional Societies & Honors',
    achievementType: 'Fellow / Senior Member Elevation',
    level: 'International',
    result: 'Conferred Senior Membership Grade',
    organizer: 'Institute of Electrical and Electronics Engineers (IEEE), USA',
    date: '2026-08-14',
    academicYear: '2026-27',
    semester: 'Odd Semester',
    description: 'Elected as IEEE Senior Member following rigorous peer evaluation of significant engineering leadership and educational mentorship.',
    proofs: [
      {
        id: 'proof_d04',
        label: 'IEEE Senior Member Certificate & Letter',
        fileName: 'ieee_senior_member_lakshmi_citation.pdf',
        fileSize: '1.2 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-14',
      },
    ],
    configuredPoints: 180,
    status: 'Pending Review',
    submittedAt: '2026-08-20',
  },
  {
    id: 'DEAN-SUB-004',
    deanId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    deanEmployeeId: 'NEC-DEAN-001',
    designation: 'Dean of Academic Affairs',
    departmentScope: ['CSE (IoT)', 'CSE', 'IT'],
    title: 'Erode Municipal Smart City Traffic Optimization Consultancy',
    categoryId: 'cat_consultancy',
    categoryTitle: 'Industry Consultancy & Corporate Training',
    achievementType: 'Government / Municipal Consultancy Project',
    level: 'State',
    result: 'Completed (₹5,00,000 Institutional Revenue)',
    organizer: 'Erode City Municipal Corporation',
    date: '2026-07-20',
    academicYear: '2026-27',
    semester: 'Odd Semester',
    description: 'Designed adaptive traffic light sequencing algorithms and dynamic congestion routing system deployed across 14 central intersections.',
    proofs: [
      {
        id: 'proof_d05',
        label: 'Project Completion Order & Revenue Proof',
        fileName: 'erode_smart_city_consultancy_completion.pdf',
        fileSize: '4.8 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-07-20',
      },
    ],
    configuredPoints: 150,
    status: 'Correction Required',
    correctionReason: 'Please attach official bank receipt showing overhead institutional remittance copy from Erode City Corporation accounts branch.',
    previousCorrectionReason: 'Please attach official bank receipt showing overhead institutional remittance copy from Erode City Corporation accounts branch.',
    submittedAt: '2026-08-10',
  },
  {
    id: 'DEAN-SUB-005',
    deanId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    deanEmployeeId: 'NEC-DEAN-002',
    designation: 'Dean of Student Affairs & Technology',
    departmentScope: ['ECE', 'EEE', 'BME'],
    title: 'Keynote Address: Emerging Frontiers in AI & Healthcare at World Congress',
    categoryId: 'cat_fdp',
    categoryTitle: 'Faculty Development & Guest Lectures',
    achievementType: 'International Keynote Address',
    level: 'International',
    result: 'Delivered Plenary Keynote',
    organizer: 'World Bioengineering and Health Informatics Congress, Singapore',
    date: '2026-07-15',
    academicYear: '2026-27',
    semester: 'Odd Semester',
    description: 'Invited plenary speaker on non-invasive bio-impedance telemetry systems for neonatal intensive care monitoring.',
    proofs: [
      {
        id: 'proof_d06',
        label: 'Invitation Letter & Session Attendance Certificate',
        fileName: 'wbhe_singapore_keynote_invitation.pdf',
        fileSize: '2.1 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-07-15',
      },
    ],
    configuredPoints: 100,
    status: 'Verified',
    submittedAt: '2026-07-18',
    verifiedAt: '2026-07-25',
    verifiedBy: 'Dr. S. Arumugam',
    awardedPoints: 100,
  },
];

// ── Principal Verification History ──
export const INITIAL_PRINCIPAL_VERIFICATION_HISTORY: PrincipalVerificationRecord[] = [
  {
    id: 'PRIN-VER-001',
    submissionId: 'DEAN-HIST-001',
    deanId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    achievementTitle: 'Keynote Address: Emerging Frontiers in AI & Healthcare at World Congress',
    categoryTitle: 'Faculty Development & Guest Lectures',
    decision: 'Verified',
    awardedPoints: 100,
    verifiedBy: 'Dr. S. Arumugam',
    verificationRole: 'Principal',
    verifiedAt: '2026-07-25',
    proofCount: 1,
  },
  {
    id: 'PRIN-VER-002',
    submissionId: 'DEAN-HIST-002',
    deanId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    achievementTitle: 'Consultancy on Smart City Traffic Optimization Architecture',
    categoryTitle: 'Industry Consultancy & Corporate Training',
    decision: 'Correction Required',
    reason: 'Please attach official bank receipt showing overhead institutional remittance copy from Erode City Corporation accounts branch.',
    awardedPoints: 0,
    verifiedBy: 'Dr. S. Arumugam',
    verificationRole: 'Principal',
    verifiedAt: '2026-08-12',
    proofCount: 1,
  },
  {
    id: 'PRIN-VER-003',
    submissionId: 'DEAN-HIST-003',
    deanId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    achievementTitle: 'International Patent Granted: Real-Time Grid Load Balancer',
    categoryTitle: 'Research, Publication & IPR',
    decision: 'Verified',
    awardedPoints: 300,
    verifiedBy: 'Dr. S. Arumugam',
    verificationRole: 'Principal',
    verifiedAt: '2026-06-18',
    proofCount: 2,
  },
  {
    id: 'PRIN-VER-004',
    submissionId: 'DEAN-HIST-004',
    deanId: 'faculty_lakshmi',
    deanName: 'Dr. K. S. Lakshmi',
    achievementTitle: 'National Award for Excellence in Engineering Pedagogy',
    categoryTitle: 'Professional Societies & Honors',
    decision: 'Verified',
    awardedPoints: 200,
    verifiedBy: 'Dr. S. Arumugam',
    verificationRole: 'Principal',
    verifiedAt: '2026-05-30',
    proofCount: 2,
  },
  {
    id: 'PRIN-VER-005',
    submissionId: 'DEAN-HIST-005',
    deanId: 'faculty_kumar',
    deanName: 'Dr. Kumar V',
    achievementTitle: 'Private Course Completion Certificate Claim',
    categoryTitle: 'Workshops & Professional Training',
    decision: 'Rejected',
    reason: 'Personal participation in non-accredited private webinar without institutional participation letter.',
    awardedPoints: 0,
    verifiedBy: 'Dr. S. Arumugam',
    verificationRole: 'Principal',
    verifiedAt: '2026-05-14',
    proofCount: 1,
  },
];

// ── Principal Notifications ──
export const INITIAL_PRINCIPAL_NOTIFICATIONS: PrincipalNotification[] = [
  {
    id: 'pnotif_01',
    title: 'Dean Achievement Submitted',
    message: 'Dr. Kumar V (Dean) submitted "Research Paper Publication: Quantum-Resistant Cryptographic Primitives" for verification.',
    type: 'dean_submission',
    timestamp: '2 hours ago',
    isRead: false,
    submissionId: 'DEAN-SUB-001',
    targetRoute: 'principalDeanReview',
  },
  {
    id: 'pnotif_02',
    title: 'Unassigned Department Alert',
    message: 'Artificial Intelligence & Data Science (AIDS) has no active Dean assigned for HOD oversight.',
    type: 'assignment_updated',
    timestamp: '1 day ago',
    isRead: false,
    targetRoute: 'principalDeanAssignments',
  },
  {
    id: 'pnotif_03',
    title: 'Dean Achievement Submitted',
    message: 'Dr. K. S. Lakshmi (Dean) submitted "IEEE Senior Member Recognition Citation & Outstanding Service Award".',
    type: 'dean_submission',
    timestamp: '3 days ago',
    isRead: true,
    submissionId: 'DEAN-SUB-003',
    targetRoute: 'principalDeanReview',
  },
  {
    id: 'pnotif_04',
    title: 'Annual Accreditation Reports Ready',
    message: 'NAAC / NBA / NIRF institutional achievement summaries have been computed for Academic Year 2026–27.',
    type: 'system',
    timestamp: '5 days ago',
    isRead: true,
    targetRoute: 'principalReports',
  },
];

// ── Institution Attention Items ──
export const INITIAL_PRINCIPAL_ATTENTION_ITEMS: PrincipalInstitutionAttentionItem[] = [
  {
    id: 'att_01',
    type: 'dean_approval',
    title: 'DEAN APPROVALS',
    description: '4 Dean personal achievements require your executive verification review.',
    priority: 'high',
    actionText: 'Review Queue →',
    actionRoute: 'principalVerificationQueue',
  },
  {
    id: 'att_02',
    type: 'unassigned_department',
    title: 'UNASSIGNED DEPARTMENT',
    description: 'AIDS department currently has no active Dean assigned for HOD verification routing.',
    priority: 'high',
    actionText: 'Assign Dean →',
    actionRoute: 'principalDeanAssignments',
    targetId: 'AIDS',
  },
  {
    id: 'att_03',
    type: 'backlog_warning',
    title: 'VERIFICATION BACKLOG',
    description: 'CSE (IoT) has 14 student and faculty verification items awaiting proctor/HOD clearance.',
    priority: 'medium',
    actionText: 'View Department →',
    actionRoute: 'principalDepartmentDetails',
    targetId: 'CSE_IOT',
  },
];

// ─────────────────────────────────────────────────────────────
// REACTIVE PRINCIPAL DATA STORE
// ─────────────────────────────────────────────────────────────

type PrincipalSubscriber = () => void;

class PrincipalDataStore {
  private departments: PrincipalDepartmentMetric[] = [...INITIAL_INSTITUTION_DEPARTMENTS];
  private assignments: PrincipalDeanAssignment[] = [...INITIAL_DEAN_ASSIGNMENTS];
  private submissions: DeanPersonalSubmission[] = [...INITIAL_DEAN_SUBMISSIONS];
  private history: PrincipalVerificationRecord[] = [...INITIAL_PRINCIPAL_VERIFICATION_HISTORY];
  private notifications: PrincipalNotification[] = [...INITIAL_PRINCIPAL_NOTIFICATIONS];
  private attentionItems: PrincipalInstitutionAttentionItem[] = [...INITIAL_PRINCIPAL_ATTENTION_ITEMS];
  private subscribers: PrincipalSubscriber[] = [];

  public subscribe(cb: PrincipalSubscriber): () => void {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Principal store notify error:', e);
      }
    });
  }

  // ── Overview & Statistics ──
  public getOverviewStats() {
    const pendingCount = this.submissions.filter((s) => s.status === 'Pending Review').length;
    const verifiedCount = this.submissions.filter((s) => s.status === 'Verified').length;
    const correctionCount = this.submissions.filter((s) => s.status === 'Correction Required').length;
    const rejectedCount = this.submissions.filter((s) => s.status === 'Rejected').length;

    const totalStudents = this.departments.reduce((acc, d) => acc + d.studentsCount, 0);
    const totalFaculty = this.departments.reduce((acc, d) => acc + d.facultyCount, 0);
    const totalAchievements = this.departments.reduce((acc, d) => acc + d.achievementsCount, 0);
    const totalPoints = this.departments.reduce((acc, d) => acc + d.pointsTotal, 0);
    const activeAchievers = this.departments.reduce((acc, d) => acc + d.activeAchieversCount, 0);
    const unassignedCount = this.departments.filter((d) => d.assignedDeanName === 'Unassigned').length;

    return {
      pendingCount,
      verifiedCount,
      correctionCount,
      rejectedCount,
      totalStudents,
      totalFaculty,
      totalAchievements,
      totalPoints,
      activeAchievers,
      departmentCount: this.departments.length,
      unassignedDepartmentCount: unassignedCount,
    };
  }

  public getAttentionItems(): PrincipalInstitutionAttentionItem[] {
    const pendingCount = this.submissions.filter((s) => s.status === 'Pending Review').length;
    const unassignedDept = this.departments.find((d) => d.assignedDeanName === 'Unassigned');

    const items: PrincipalInstitutionAttentionItem[] = [];

    if (pendingCount > 0) {
      items.push({
        id: 'att_pending_dean',
        type: 'dean_approval',
        title: 'DEAN APPROVALS',
        description: `${pendingCount} Dean achievement${pendingCount > 1 ? 's require' : ' requires'} your executive verification.`,
        priority: 'high',
        actionText: 'Review Queue →',
        actionRoute: 'principalVerificationQueue',
      });
    }

    if (unassignedDept) {
      items.push({
        id: 'att_unassigned_' + unassignedDept.id,
        type: 'unassigned_department',
        title: 'UNASSIGNED DEPARTMENT',
        description: `${unassignedDept.code} currently has no active Dean assigned for HOD verification routing.`,
        priority: 'high',
        actionText: 'Assign Dean →',
        actionRoute: 'principalDeanAssignments',
        targetId: unassignedDept.id,
      });
    }

    const highBacklogDept = this.departments.find((d) => d.pendingReviewsCount > 10);
    if (highBacklogDept) {
      items.push({
        id: 'att_backlog_' + highBacklogDept.id,
        type: 'backlog_warning',
        title: 'VERIFICATION BACKLOG',
        description: `${highBacklogDept.code} has a high pending verification count (${highBacklogDept.pendingReviewsCount} items).`,
        priority: 'medium',
        actionText: 'View Department →',
        actionRoute: 'principalDepartmentDetails',
        targetId: highBacklogDept.id,
      });
    }

    return items;
  }

  // ── Departments ──
  public getDepartments(): PrincipalDepartmentMetric[] {
    return [...this.departments];
  }

  public getDepartmentById(id: string): PrincipalDepartmentMetric | undefined {
    return this.departments.find((d) => d.id === id);
  }

  // ── Dean Submissions & Verifications ──
  public getSubmissions(): DeanPersonalSubmission[] {
    return [...this.submissions];
  }

  public getSubmissionById(id: string): DeanPersonalSubmission | undefined {
    return this.submissions.find((s) => s.id === id);
  }

  public approveSubmission(id: string, notes?: string): boolean {
    const sub = this.submissions.find((s) => s.id === id);
    if (!sub) return false;

    sub.status = 'Verified';
    sub.verifiedAt = new Date().toISOString().split('T')[0];
    sub.verifiedBy = DEMO_PRINCIPAL_USER.name;
    sub.awardedPoints = sub.configuredPoints;

    this.history.unshift({
      id: `PRIN-VER-${Date.now()}`,
      submissionId: sub.id,
      deanId: sub.deanId,
      deanName: sub.deanName,
      achievementTitle: sub.title,
      categoryTitle: sub.categoryTitle,
      decision: 'Verified',
      reason: notes || 'Verified with valid supporting institutional proof.',
      awardedPoints: sub.configuredPoints,
      verifiedBy: DEMO_PRINCIPAL_USER.name,
      verificationRole: 'Principal',
      verifiedAt: new Date().toISOString().split('T')[0],
      proofCount: sub.proofs.length,
    });

    this.notifications.unshift({
      id: `pnotif_${Date.now()}`,
      title: 'Achievement Verified',
      message: `You verified "${sub.title}" for ${sub.deanName}. ${sub.configuredPoints} points awarded.`,
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return true;
  }

  public requestCorrection(id: string, reason: string): boolean {
    if (!reason.trim()) return false;
    const sub = this.submissions.find((s) => s.id === id);
    if (!sub) return false;

    sub.status = 'Correction Required';
    sub.correctionReason = reason;
    sub.previousCorrectionReason = reason;

    this.history.unshift({
      id: `PRIN-VER-${Date.now()}`,
      submissionId: sub.id,
      deanId: sub.deanId,
      deanName: sub.deanName,
      achievementTitle: sub.title,
      categoryTitle: sub.categoryTitle,
      decision: 'Correction Required',
      reason,
      awardedPoints: 0,
      verifiedBy: DEMO_PRINCIPAL_USER.name,
      verificationRole: 'Principal',
      verifiedAt: new Date().toISOString().split('T')[0],
      proofCount: sub.proofs.length,
    });

    this.notifications.unshift({
      id: `pnotif_${Date.now()}`,
      title: 'Correction Requested',
      message: `Correction requested for ${sub.deanName}'s submission: "${sub.title}".`,
      type: 'correction_resubmitted',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return true;
  }

  public rejectSubmission(id: string, reason: string): boolean {
    if (!reason.trim()) return false;
    const sub = this.submissions.find((s) => s.id === id);
    if (!sub) return false;

    sub.status = 'Rejected';
    sub.correctionReason = reason;

    this.history.unshift({
      id: `PRIN-VER-${Date.now()}`,
      submissionId: sub.id,
      deanId: sub.deanId,
      deanName: sub.deanName,
      achievementTitle: sub.title,
      categoryTitle: sub.categoryTitle,
      decision: 'Rejected',
      reason,
      awardedPoints: 0,
      verifiedBy: DEMO_PRINCIPAL_USER.name,
      verificationRole: 'Principal',
      verifiedAt: new Date().toISOString().split('T')[0],
      proofCount: sub.proofs.length,
    });

    this.notifications.unshift({
      id: `pnotif_${Date.now()}`,
      title: 'Achievement Rejected',
      message: `You rejected "${sub.title}" submitted by ${sub.deanName}. Reason: ${reason}.`,
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return true;
  }

  public getHistory(): PrincipalVerificationRecord[] {
    return [...this.history];
  }

  // ── Dean Responsibility Management ──
  public getAssignments(): PrincipalDeanAssignment[] {
    return [...this.assignments];
  }

  public getActiveDeans(): { id: string; name: string; designation: string; assignedDepartmentIds: string[] }[] {
    const deanMap = new Map<string, { id: string; name: string; designation: string; assignedDepartmentIds: string[] }>();

    // Seed known Deans
    deanMap.set('faculty_kumar', {
      id: 'faculty_kumar',
      name: 'Dr. Kumar V',
      designation: 'Dean of Academic Affairs',
      assignedDepartmentIds: [],
    });
    deanMap.set('faculty_lakshmi', {
      id: 'faculty_lakshmi',
      name: 'Dr. K. S. Lakshmi',
      designation: 'Dean of Student Affairs & Technology',
      assignedDepartmentIds: [],
    });

    this.assignments
      .filter((a) => a.status === 'active')
      .forEach((a) => {
        const existing = deanMap.get(a.deanFacultyId);
        if (existing) {
          existing.assignedDepartmentIds.push(a.departmentId);
        } else {
          deanMap.set(a.deanFacultyId, {
            id: a.deanFacultyId,
            name: a.deanName,
            designation: a.deanDesignation,
            assignedDepartmentIds: [a.departmentId],
          });
        }
      });

    return Array.from(deanMap.values());
  }

  public assignDepartmentToDean(
    deanFacultyId: string,
    deanName: string,
    deanDesignation: string,
    departmentId: string,
    forceReassign: boolean = false
  ): { success: boolean; conflict?: boolean; currentDeanName?: string } {
    const currentAssignment = this.assignments.find(
      (a) => a.departmentId === departmentId && a.status === 'active'
    );

    if (currentAssignment) {
      if (currentAssignment.deanFacultyId === deanFacultyId) {
        return { success: true }; // already assigned to this Dean
      }

      if (!forceReassign) {
        return {
          success: false,
          conflict: true,
          currentDeanName: currentAssignment.deanName,
        };
      }

      // Deactivate previous assignment
      currentAssignment.status = 'inactive';
      currentAssignment.removedAt = new Date().toISOString().split('T')[0];
      currentAssignment.removedBy = DEMO_PRINCIPAL_USER.name;
    }

    const dept = this.departments.find((d) => d.id === departmentId);
    const departmentName = dept ? dept.name : departmentId;

    this.assignments.push({
      id: `assign_prin_${Date.now()}`,
      institutionId: 'inst_nandha',
      deanFacultyId,
      deanName,
      deanEmployeeId: deanFacultyId === 'faculty_kumar' ? 'NEC-DEAN-001' : 'NEC-DEAN-002',
      deanDesignation,
      departmentId,
      departmentName,
      assignedByPrincipalId: 'faculty_principal',
      assignedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    });

    // Update department state
    if (dept) {
      dept.assignedDeanName = deanName;
      dept.assignedDeanId = deanFacultyId;
    }

    this.notifications.unshift({
      id: `pnotif_${Date.now()}`,
      title: 'Dean Responsibility Assigned',
      message: `${departmentName} is now assigned to ${deanName} for HOD oversight.`,
      type: 'assignment_updated',
      timestamp: 'Just now',
      isRead: false,
      targetRoute: 'principalDeanAssignments',
    });

    this.notify();
    return { success: true };
  }

  public removeDepartmentFromDean(deanFacultyId: string, departmentId: string): boolean {
    const assignment = this.assignments.find(
      (a) => a.deanFacultyId === deanFacultyId && a.departmentId === departmentId && a.status === 'active'
    );
    if (!assignment) return false;

    assignment.status = 'inactive';
    assignment.removedAt = new Date().toISOString().split('T')[0];
    assignment.removedBy = DEMO_PRINCIPAL_USER.name;

    const dept = this.departments.find((d) => d.id === departmentId);
    if (dept) {
      dept.assignedDeanName = 'Unassigned';
      dept.assignedDeanId = undefined;
    }

    this.notifications.unshift({
      id: `pnotif_${Date.now()}`,
      title: 'Dean Scope Updated',
      message: `${assignment.departmentName} has been unassigned from ${assignment.deanName}.`,
      type: 'assignment_updated',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return true;
  }

  // ── Notifications ──
  public getNotifications(): PrincipalNotification[] {
    return [...this.notifications];
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  public markAllNotificationsRead() {
    this.notifications.forEach((n) => {
      n.isRead = true;
    });
    this.notify();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.isRead = true;
      this.notify();
    }
  }
}

export const principalDataStore = new PrincipalDataStore();
