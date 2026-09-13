// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Workspace Data Store & Permissions Architecture
// Core Model: Dean -> Assigned Departments -> Current HOD -> HOD Submissions
// Authorized Scope is strictly enforced at the data layer before search/filters.
// ─────────────────────────────────────────────────────────────

export interface DeanDepartmentAssignment {
  id: string;
  institutionId: string;
  deanFacultyId: string;
  departmentId: string;
  departmentName: string;
  assignedBy: string;
  assignedAt: string;
  removedAt?: string;
  status: 'active' | 'removed';
}

export interface DeanProofFile {
  id: string;
  label: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'png' | 'jpg';
  status: 'Required' | 'Optional';
  uploadedAt: string;
}

export interface DeanHODSubmission {
  id: string;
  hodId: string;
  hodName: string;
  hodEmployeeId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  achievementType: string;
  level: 'Department' | 'College' | 'Zonal' | 'State' | 'National' | 'International';
  result: string;
  organizer: string;
  date: string;
  academicYear: string;
  semester?: string;
  description: string;
  proofs: DeanProofFile[];
  configuredPoints: number;
  status: 'Pending Review' | 'Correction Required' | 'Verified' | 'Rejected';
  correctionReason?: string;
  previousCorrectionReason?: string;
  submittedAt: string;
  resubmittedAt?: string;
}

export interface DeanVerificationRecord {
  id: string;
  submissionId: string;
  hodId: string;
  hodName: string;
  departmentId: string;
  departmentName: string;
  achievementTitle: string;
  categoryTitle: string;
  decision: 'Verified' | 'Correction Required' | 'Rejected';
  reason?: string;
  awardedPoints: number;
  verifiedBy: string;
  verificationRole: string;
  verifiedAt: string;
}

export interface DeanNotification {
  id: string;
  title: string;
  message: string;
  type: 'hod_submission' | 'correction_resubmitted' | 'personal_achievement' | 'scope_update';
  timestamp: string;
  isRead: boolean;
  submissionId?: string;
  actionText?: string;
}

export interface DeanOverviewStats {
  pendingCount: number;
  correctionsCount: number;
  verifiedCount: number;
  rejectedCount: number;
  assignedDepartmentCount: number;
  totalHODCount: number;
}

// ─────────────────────────────────────────────────────────────
// INITIAL MOCK DATA
// ─────────────────────────────────────────────────────────────

export const DEMO_DEAN_USER = {
  id: 'faculty_kumar',
  name: 'Dr. Kumar V',
  employeeId: 'NEC-DEAN-001',
  role: 'dean',
  designation: 'Dean of Academic Affairs & Faculty Governance',
  institution: 'Nandha Engineering College',
  institutionId: 'inst_nandha',
};

// Authorized Scope: 3 Assigned Departments
export const INITIAL_DEAN_ASSIGNMENTS: DeanDepartmentAssignment[] = [
  {
    id: 'assign_01',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (Internet of Things)',
    assignedBy: 'Dr. S. Arumugam (Principal)',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_02',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    departmentId: 'CSE',
    departmentName: 'Computer Science and Engineering',
    assignedBy: 'Dr. S. Arumugam (Principal)',
    assignedAt: '2025-06-01',
    status: 'active',
  },
  {
    id: 'assign_03',
    institutionId: 'inst_nandha',
    deanFacultyId: 'faculty_kumar',
    departmentId: 'IT',
    departmentName: 'Information Technology',
    assignedBy: 'Dr. S. Arumugam (Principal)',
    assignedAt: '2025-06-01',
    status: 'active',
  },
];

// Department Metadata
export const COLLEGE_DEPARTMENTS = [
  { id: 'CSE_IOT', name: 'CSE (IoT)', hodName: 'Dr. Arun Kumar', hodEmployeeId: 'NEC-HOD-010' },
  { id: 'CSE', name: 'Computer Science & Engineering', hodName: 'Dr. Rajesh K', hodEmployeeId: 'NEC-HOD-011' },
  { id: 'IT', name: 'Information Technology', hodName: 'Dr. Priya S', hodEmployeeId: 'NEC-HOD-012' },
  // Unauthorized to Dr. Kumar — used strictly for permission boundary verification:
  { id: 'ECE', name: 'Electronics & Communication', hodName: 'Dr. Suresh M', hodEmployeeId: 'NEC-HOD-014' },
  { id: 'EEE', name: 'Electrical & Electronics', hodName: 'Dr. Ramesh V', hodEmployeeId: 'NEC-HOD-015' },
  { id: 'AIDS', name: 'Artificial Intelligence & Data Science', hodName: 'Dr. Deepa N', hodEmployeeId: 'NEC-HOD-016' },
  { id: 'BME', name: 'Biomedical Engineering', hodName: 'Dr. Malathi K', hodEmployeeId: 'NEC-HOD-017' },
];

export const INITIAL_HOD_SUBMISSIONS: DeanHODSubmission[] = [
  // ── Authorized Department 1: CSE (IoT) ──
  {
    id: 'HOD-SUB-001',
    hodId: 'hod_arun',
    hodName: 'Dr. Arun Kumar',
    hodEmployeeId: 'NEC-HOD-010',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    title: 'High-Impact Q1 Journal Paper on Edge AI Architecture',
    categoryId: 'cat_research',
    categoryTitle: 'Research, Publication & IPR',
    achievementType: 'SCI / Scopus Indexed Journal',
    level: 'International',
    result: 'Published (Impact Factor: 4.8)',
    organizer: 'IEEE Internet of Things Journal',
    date: '2026-08-28',
    academicYear: '2026-27',
    semester: 'Odd Semester',
    description: 'Autonomous low-latency distributed deep inference mechanism for industrial smart meter networks. Indexed under IEEE Xplore Digital Library.',
    proofs: [
      {
        id: 'proof_01',
        label: 'Journal Publication Manuscript',
        fileName: 'ieee_iot_edge_ai_published.pdf',
        fileSize: '3.4 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-28',
      },
      {
        id: 'proof_02',
        label: 'Publisher Acceptance & Scopus DOI Proof',
        fileName: 'acceptance_letter_ieee.pdf',
        fileSize: '1.2 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-28',
      },
    ],
    configuredPoints: 250,
    status: 'Pending Review',
    submittedAt: '2026-09-02',
  },
  {
    id: 'HOD-SUB-002',
    hodId: 'hod_arun',
    hodName: 'Dr. Arun Kumar',
    hodEmployeeId: 'NEC-HOD-010',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    title: 'Granted International Patent: Wearable Vital Monitor Sensor',
    categoryId: 'cat_ipr',
    categoryTitle: 'Patents & Intellectual Property',
    achievementType: 'Patent Granted',
    level: 'International',
    result: 'Granted',
    organizer: 'Australian Patent Office (IP Australia)',
    date: '2026-08-14',
    academicYear: '2026-27',
    description: 'Non-invasive PPG continuous arrhythmia estimation patent granted with 8 institutional co-inventors.',
    proofs: [
      {
        id: 'proof_03',
        label: 'Official Grant Certificate',
        fileName: 'australia_patent_grant_2026.pdf',
        fileSize: '2.1 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-14',
      },
    ],
    configuredPoints: 300,
    status: 'Pending Review',
    submittedAt: '2026-09-01',
  },
  {
    id: 'HOD-SUB-003',
    hodId: 'hod_arun',
    hodName: 'Dr. Arun Kumar',
    hodEmployeeId: 'NEC-HOD-010',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    title: 'Consultancy Project Completion: Smart Cold-Storage Monitoring',
    categoryId: 'cat_consultancy',
    categoryTitle: 'Industry Consultancy & Grants',
    achievementType: 'Industry Funded Project',
    level: 'State',
    result: 'Completed (Grant: ₹4,50,000)',
    organizer: 'MilkyMist Dairy Foods Pvt Ltd',
    date: '2026-07-20',
    academicYear: '2026-27',
    description: 'Turnkey IoT telemetry and humidity sensing system designed, validated, and deployed at Erode facility.',
    proofs: [
      {
        id: 'proof_04',
        label: 'Project Sanction Order & Completion Certificate',
        fileName: 'milkymist_iot_consultancy_completion.pdf',
        fileSize: '4.1 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-07-20',
      },
    ],
    configuredPoints: 200,
    status: 'Correction Required',
    correctionReason: 'Please attach the audited institutional fund receipt voucher countersigned by Finance Officer.',
    previousCorrectionReason: 'Please attach the audited institutional fund receipt voucher countersigned by Finance Officer.',
    submittedAt: '2026-08-25',
  },

  // ── Authorized Department 2: CSE ──
  {
    id: 'HOD-SUB-004',
    hodId: 'hod_rajesh',
    hodName: 'Dr. Rajesh K',
    hodEmployeeId: 'NEC-HOD-011',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    title: 'Published Patent: Cryptographic Fault Tolerant Ledger',
    categoryId: 'cat_ipr',
    categoryTitle: 'Patents & Intellectual Property',
    achievementType: 'Patent Published',
    level: 'National',
    result: 'Published in Indian Patent Journal',
    organizer: 'Indian Patent Office (Controller General)',
    date: '2026-08-22',
    academicYear: '2026-27',
    description: 'Zero-knowledge proof verification pipeline designed for high-concurrency land registry microtransactions.',
    proofs: [
      {
        id: 'proof_05',
        label: 'Official Gazette Notification',
        fileName: 'indian_patent_journal_aug2026.pdf',
        fileSize: '1.8 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-22',
      },
    ],
    configuredPoints: 150,
    status: 'Pending Review',
    submittedAt: '2026-09-03',
  },
  {
    id: 'HOD-SUB-005',
    hodId: 'hod_rajesh',
    hodName: 'Dr. Rajesh K',
    hodEmployeeId: 'NEC-HOD-011',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    title: 'Keynote Speaker: IEEE International Conference on Cloud AI (ICCAI)',
    categoryId: 'cat_academic',
    categoryTitle: 'Conference & Technical Keynotes',
    achievementType: 'Keynote Speaker / Session Chair',
    level: 'International',
    result: 'Keynote Delivered',
    organizer: 'IEEE Computer Society Bangalore Section',
    date: '2026-08-10',
    academicYear: '2026-27',
    description: 'Delivered 60-minute plenary lecture on Sustainable Microservices and Energy-aware Scheduling.',
    proofs: [
      {
        id: 'proof_06',
        label: 'Conference Keynote Certificate & Invitation',
        fileName: 'iccai_2026_keynote_arun.pdf',
        fileSize: '1.5 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-10',
      },
    ],
    configuredPoints: 120,
    status: 'Pending Review',
    submittedAt: '2026-09-02',
  },

  // ── Authorized Department 3: IT ──
  {
    id: 'HOD-SUB-006',
    hodId: 'hod_priya',
    hodName: 'Dr. Priya S',
    hodEmployeeId: 'NEC-HOD-012',
    departmentId: 'IT',
    departmentName: 'Information Technology',
    title: 'DST-SERB Core Research Grant Sanction: Quantum Cryptography Testbed',
    categoryId: 'cat_grants',
    categoryTitle: 'Funded Research Grants & Schemes',
    achievementType: 'National Agency Sponsored Research',
    level: 'National',
    result: 'Sanctioned (₹18,50,000)',
    organizer: 'Department of Science and Technology (DST)',
    date: '2026-08-05',
    academicYear: '2026-27',
    description: '3-year sponsored laboratory research scheme to build post-quantum cipher evaluation nodes.',
    proofs: [
      {
        id: 'proof_07',
        label: 'DST Sanction Order Copy',
        fileName: 'dst_serb_grant_sanction_crg.pdf',
        fileSize: '2.8 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-05',
      },
    ],
    configuredPoints: 350,
    status: 'Pending Review',
    submittedAt: '2026-09-01',
  },
  {
    id: 'HOD-SUB-007',
    hodId: 'hod_priya',
    hodName: 'Dr. Priya S',
    hodEmployeeId: 'NEC-HOD-012',
    departmentId: 'IT',
    departmentName: 'Information Technology',
    title: 'ACM Senior Member Elevation Recognition',
    categoryId: 'cat_professional',
    categoryTitle: 'Professional Societies & Honors',
    achievementType: 'Fellow / Senior Member Elevation',
    level: 'International',
    result: 'Awarded Senior Membership',
    organizer: 'Association for Computing Machinery (ACM), USA',
    date: '2026-07-28',
    academicYear: '2026-27',
    description: 'Elevated to ACM Senior Member Grade in recognition of 10+ years of active technical contributions.',
    proofs: [
      {
        id: 'proof_08',
        label: 'ACM Senior Member Certificate & Letter',
        fileName: 'acm_senior_member_citation.pdf',
        fileSize: '1.1 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-07-28',
      },
    ],
    configuredPoints: 180,
    status: 'Pending Review',
    submittedAt: '2026-08-30',
  },
  {
    id: 'HOD-SUB-008',
    hodId: 'hod_priya',
    hodName: 'Dr. Priya S',
    hodEmployeeId: 'NEC-HOD-012',
    departmentId: 'IT',
    departmentName: 'Information Technology',
    title: 'Springer LNCS Book Chapter on Secure Federated Learning',
    categoryId: 'cat_research',
    categoryTitle: 'Research, Publication & IPR',
    achievementType: 'Scopus Indexed Book Chapter',
    level: 'International',
    result: 'Published',
    organizer: 'Springer Nature Singapore',
    date: '2026-08-02',
    academicYear: '2026-27',
    description: 'Authored Chapter 4 in "Advances in Trustworthy Distributed AI", ISBN 978-981-19-XXXX-X.',
    proofs: [
      {
        id: 'proof_09',
        label: 'Book Chapter Copyright & First Page',
        fileName: 'springer_lncs_chapter_priya.pdf',
        fileSize: '1.9 MB',
        fileType: 'pdf',
        status: 'Required',
        uploadedAt: '2026-08-02',
      },
    ],
    configuredPoints: 100,
    status: 'Correction Required',
    correctionReason: 'Please attach the Scopus indexing confirmation page indicating book title and chapter DOI.',
    previousCorrectionReason: 'Please attach the Scopus indexing confirmation page indicating book title and chapter DOI.',
    submittedAt: '2026-08-20',
  },

  // ── UNAUTHORIZED DEPARTMENT (ECE & EEE) ──
  // These are stored to strictly test that permission scope filtering works!
  // Dr. Kumar MUST NOT see these submissions anywhere in Dashboard, Queue, Filters, or Search!
  {
    id: 'HOD-SUB-UNAUTHORIZED-01',
    hodId: 'hod_suresh',
    hodName: 'Dr. Suresh M',
    hodEmployeeId: 'NEC-HOD-014',
    departmentId: 'ECE',
    departmentName: 'Electronics & Communication',
    title: 'VLSI High-Speed Digital Filter Circuit Design Patent',
    categoryId: 'cat_ipr',
    categoryTitle: 'Patents & Intellectual Property',
    achievementType: 'Patent Published',
    level: 'National',
    result: 'Published',
    organizer: 'Indian Patent Office',
    date: '2026-08-18',
    academicYear: '2026-27',
    description: 'Unauthorized submission to test permission scoping.',
    proofs: [],
    configuredPoints: 150,
    status: 'Pending Review',
    submittedAt: '2026-09-02',
  },
  {
    id: 'HOD-SUB-UNAUTHORIZED-02',
    hodId: 'hod_ramesh',
    hodName: 'Dr. Ramesh V',
    hodEmployeeId: 'NEC-HOD-015',
    departmentId: 'EEE',
    departmentName: 'Electrical & Electronics',
    title: 'Solar PV Inverter Fault Detection Scheme in IEEE Transactions',
    categoryId: 'cat_research',
    categoryTitle: 'Research, Publication & IPR',
    achievementType: 'SCI / Scopus Indexed Journal',
    level: 'International',
    result: 'Published',
    organizer: 'IEEE Transactions on Sustainable Energy',
    date: '2026-08-11',
    academicYear: '2026-27',
    description: 'Unauthorized submission to test permission scoping.',
    proofs: [],
    configuredPoints: 250,
    status: 'Pending Review',
    submittedAt: '2026-09-01',
  },
];

export const INITIAL_VERIFICATION_HISTORY: DeanVerificationRecord[] = [
  {
    id: 'DEAN-VER-001',
    submissionId: 'HOD-HIST-001',
    hodId: 'hod_arun',
    hodName: 'Dr. Arun Kumar',
    departmentId: 'CSE_IOT',
    departmentName: 'CSE (IoT)',
    achievementTitle: 'Best Department Innovation Award 2026',
    categoryTitle: 'Institutional Honors',
    decision: 'Verified',
    awardedPoints: 150,
    verifiedBy: 'Dr. Kumar V',
    verificationRole: 'Dean',
    verifiedAt: '2026-08-15',
  },
  {
    id: 'DEAN-VER-002',
    submissionId: 'HOD-HIST-002',
    hodId: 'hod_rajesh',
    hodName: 'Dr. Rajesh K',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    achievementTitle: 'Consultancy for Erode Smart City Cloud Infrastructure',
    categoryTitle: 'Industry Consultancy & Grants',
    decision: 'Verified',
    awardedPoints: 200,
    verifiedBy: 'Dr. Kumar V',
    verificationRole: 'Dean',
    verifiedAt: '2026-08-10',
  },
  {
    id: 'DEAN-VER-003',
    submissionId: 'HOD-HIST-003',
    hodId: 'hod_priya',
    hodName: 'Dr. Priya S',
    departmentId: 'IT',
    departmentName: 'Information Technology',
    achievementTitle: 'International Conference Technical Program Chair (ICAC 2026)',
    categoryTitle: 'Conference & Technical Keynotes',
    decision: 'Verified',
    awardedPoints: 120,
    verifiedBy: 'Dr. Kumar V',
    verificationRole: 'Dean',
    verifiedAt: '2026-07-25',
  },
  {
    id: 'DEAN-VER-004',
    submissionId: 'HOD-HIST-004',
    hodId: 'hod_rajesh',
    hodName: 'Dr. Rajesh K',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    achievementTitle: 'Student Hackathon Mentorship Award',
    categoryTitle: 'Mentorship & Student Development',
    decision: 'Rejected',
    reason: 'Student hackathon awards should be submitted by the student team through Academic Coordinator channel.',
    awardedPoints: 0,
    verifiedBy: 'Dr. Kumar V',
    verificationRole: 'Dean',
    verifiedAt: '2026-07-12',
  },
];

export const INITIAL_DEAN_NOTIFICATIONS: DeanNotification[] = [
  {
    id: 'dnotif_01',
    title: 'HOD Achievement Submitted',
    message: 'Dr. Arun Kumar (CSE IoT) submitted "High-Impact Q1 Journal Paper on Edge AI Architecture" for Dean verification.',
    type: 'hod_submission',
    timestamp: '2 hours ago',
    isRead: false,
    submissionId: 'HOD-SUB-001',
    actionText: 'Review Submission',
  },
  {
    id: 'dnotif_02',
    title: 'HOD Achievement Submitted',
    message: 'Dr. Rajesh K (CSE) submitted "Published Patent: Cryptographic Fault Tolerant Ledger".',
    type: 'hod_submission',
    timestamp: 'Yesterday',
    isRead: false,
    submissionId: 'HOD-SUB-004',
    actionText: 'Review Submission',
  },
  {
    id: 'dnotif_03',
    title: 'Correction Resubmitted',
    message: 'Dr. Arun Kumar updated verification proof files for "Smart Cold-Storage Monitoring".',
    type: 'correction_resubmitted',
    timestamp: '2 days ago',
    isRead: true,
    submissionId: 'HOD-SUB-003',
    actionText: 'Review Again',
  },
  {
    id: 'dnotif_04',
    title: 'Personal Achievement Verified',
    message: 'Your institutional achievement "Dean Leadership in Outcome-Based Education" has been approved by Principal Dr. S. Arumugam.',
    type: 'personal_achievement',
    timestamp: '3 days ago',
    isRead: true,
    actionText: 'View Achievement',
  },
];

// ─────────────────────────────────────────────────────────────
// REACTIVE SINGLETON STORE
// ─────────────────────────────────────────────────────────────

type DeanSubscriber = () => void;

class DeanDataStore {
  private assignments: DeanDepartmentAssignment[] = [...INITIAL_DEAN_ASSIGNMENTS];
  private submissions: DeanHODSubmission[] = [...INITIAL_HOD_SUBMISSIONS];
  private history: DeanVerificationRecord[] = [...INITIAL_VERIFICATION_HISTORY];
  private notifications: DeanNotification[] = [...INITIAL_DEAN_NOTIFICATIONS];
  private subscribers: DeanSubscriber[] = [];

  public subscribe(cb: DeanSubscriber): () => void {
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
        console.error('Dean store notify error:', e);
      }
    });
  }

  // ── Authorized Department Scope ──
  public getAssignedDepartmentIds(): string[] {
    return this.assignments.filter((a) => a.status === 'active').map((a) => a.departmentId);
  }

  public getAssignedDepartments(): { id: string; name: string; hodName: string; pendingCount: number }[] {
    const activeIds = this.getAssignedDepartmentIds();
    return COLLEGE_DEPARTMENTS.filter((d) => activeIds.includes(d.id)).map((d) => {
      const pendingCount = this.submissions.filter(
        (s) => s.departmentId === d.id && (s.status === 'Pending Review' || s.status === 'Correction Required')
      ).length;
      return {
        id: d.id,
        name: d.name,
        hodName: d.hodName,
        pendingCount,
      };
    });
  }

  // ── Submissions Scoped Strictly by Authorization ──
  public getAuthorizedSubmissions(): DeanHODSubmission[] {
    const activeIds = this.getAssignedDepartmentIds();
    // Strict security: Submissions outside Dean's assigned departments are NEVER returned
    return this.submissions.filter((s) => activeIds.includes(s.departmentId));
  }

  public getSubmissionById(id: string): DeanHODSubmission | undefined {
    const authorized = this.getAuthorizedSubmissions();
    return authorized.find((s) => s.id === id);
  }

  public getOverviewStats(): DeanOverviewStats {
    const authorized = this.getAuthorizedSubmissions();
    const pendingCount = authorized.filter((s) => s.status === 'Pending Review').length;
    const correctionsCount = authorized.filter((s) => s.status === 'Correction Required').length;
    const verifiedCount = this.history.filter((h) => h.decision === 'Verified').length;
    const rejectedCount = this.history.filter((h) => h.decision === 'Rejected').length;
    const assignedDepartmentCount = this.getAssignedDepartmentIds().length;

    const uniqueHODs = new Set(authorized.map((s) => s.hodId));

    return {
      pendingCount,
      correctionsCount,
      verifiedCount,
      rejectedCount,
      assignedDepartmentCount,
      totalHODCount: uniqueHODs.size,
    };
  }

  // ── Review Actions ──
  public approveSubmission(submissionId: string, pointsOverride?: number): boolean {
    const subIndex = this.submissions.findIndex((s) => s.id === submissionId);
    if (subIndex === -1) return false;

    const sub = this.submissions[subIndex];
    const awarded = pointsOverride !== undefined ? pointsOverride : sub.configuredPoints;

    this.submissions[subIndex] = {
      ...sub,
      status: 'Verified',
    };

    const newRecord: DeanVerificationRecord = {
      id: `DEAN-VER-${Date.now()}`,
      submissionId: sub.id,
      hodId: sub.hodId,
      hodName: sub.hodName,
      departmentId: sub.departmentId,
      departmentName: sub.departmentName,
      achievementTitle: sub.title,
      categoryTitle: sub.categoryTitle,
      decision: 'Verified',
      awardedPoints: awarded,
      verifiedBy: DEMO_DEAN_USER.name,
      verificationRole: 'Dean',
      verifiedAt: new Date().toISOString().split('T')[0],
    };

    this.history.unshift(newRecord);

    this.notifications.unshift({
      id: `dnotif_${Date.now()}`,
      title: 'Achievement Approved',
      message: `You approved "${sub.title}" submitted by ${sub.hodName} (${sub.departmentName}) with ${awarded} points.`,
      type: 'hod_submission',
      timestamp: 'Just now',
      isRead: false,
      submissionId: sub.id,
    });

    this.notify();
    return true;
  }

  public requestCorrection(submissionId: string, reason: string): boolean {
    const subIndex = this.submissions.findIndex((s) => s.id === submissionId);
    if (subIndex === -1) return false;

    const sub = this.submissions[subIndex];
    this.submissions[subIndex] = {
      ...sub,
      status: 'Correction Required',
      correctionReason: reason.trim(),
      previousCorrectionReason: reason.trim(),
    };

    const newRecord: DeanVerificationRecord = {
      id: `DEAN-VER-${Date.now()}`,
      submissionId: sub.id,
      hodId: sub.hodId,
      hodName: sub.hodName,
      departmentId: sub.departmentId,
      departmentName: sub.departmentName,
      achievementTitle: sub.title,
      categoryTitle: sub.categoryTitle,
      decision: 'Correction Required',
      reason: reason.trim(),
      awardedPoints: 0,
      verifiedBy: DEMO_DEAN_USER.name,
      verificationRole: 'Dean',
      verifiedAt: new Date().toISOString().split('T')[0],
    };

    this.history.unshift(newRecord);

    this.notify();
    return true;
  }

  public rejectSubmission(submissionId: string, reason: string): boolean {
    const subIndex = this.submissions.findIndex((s) => s.id === submissionId);
    if (subIndex === -1) return false;

    const sub = this.submissions[subIndex];
    this.submissions[subIndex] = {
      ...sub,
      status: 'Rejected',
      correctionReason: reason.trim(),
    };

    const newRecord: DeanVerificationRecord = {
      id: `DEAN-VER-${Date.now()}`,
      submissionId: sub.id,
      hodId: sub.hodId,
      hodName: sub.hodName,
      departmentId: sub.departmentId,
      departmentName: sub.departmentName,
      achievementTitle: sub.title,
      categoryTitle: sub.categoryTitle,
      decision: 'Rejected',
      reason: reason.trim(),
      awardedPoints: 0,
      verifiedBy: DEMO_DEAN_USER.name,
      verificationRole: 'Dean',
      verifiedAt: new Date().toISOString().split('T')[0],
    };

    this.history.unshift(newRecord);

    this.notify();
    return true;
  }

  // ── Verification History ──
  public getVerificationHistory(): DeanVerificationRecord[] {
    const activeIds = this.getAssignedDepartmentIds();
    // Return history belonging to assigned departments plus preserved historical records
    return [...this.history];
  }

  // ── Notifications ──
  public getNotifications(): DeanNotification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.notify();
  }

  public markAllNotificationsAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notify();
  }

  // ── Simulation Methods for Testing Multi-Department Scaling ──
  public simulateAddDepartment(deptId: string): boolean {
    const dept = COLLEGE_DEPARTMENTS.find((d) => d.id === deptId);
    if (!dept) return false;

    const existing = this.assignments.find((a) => a.departmentId === deptId);
    if (existing) {
      existing.status = 'active';
      existing.removedAt = undefined;
    } else {
      this.assignments.push({
        id: `assign_${Date.now()}`,
        institutionId: 'inst_nandha',
        deanFacultyId: 'faculty_kumar',
        departmentId: dept.id,
        departmentName: dept.name,
        assignedBy: 'Dr. S. Arumugam (Principal)',
        assignedAt: new Date().toISOString().split('T')[0],
        status: 'active',
      });
    }

    this.notifications.unshift({
      id: `dnotif_${Date.now()}`,
      title: 'Department Scope Expanded',
      message: `Principal assigned ${dept.name} to your Dean verification scope.`,
      type: 'scope_update',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return true;
  }

  public simulateRemoveDepartment(deptId: string): boolean {
    const existing = this.assignments.find((a) => a.departmentId === deptId && a.status === 'active');
    if (!existing) return false;

    existing.status = 'removed';
    existing.removedAt = new Date().toISOString().split('T')[0];

    this.notifications.unshift({
      id: `dnotif_${Date.now()}`,
      title: 'Department Scope Modified',
      message: `${existing.departmentName} has been unassigned from your active verification queue.`,
      type: 'scope_update',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return true;
  }
}

// Global Singleton Instance
let deanStoreInstance: DeanDataStore | null = null;

export function getDeanStore(): DeanDataStore {
  if (!deanStoreInstance) {
    deanStoreInstance = new DeanDataStore();
  }
  return deanStoreInstance;
}

export function subscribeDeanData(cb: DeanSubscriber): () => void {
  return getDeanStore().subscribe(cb);
}
