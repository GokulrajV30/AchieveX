// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Credits Data Model & Centralized Dataset
// Tracks NPTEL, SWAYAM, VAC, and approved institutional academic credits
// (Completely isolated from AchieveX achievement points)
// ─────────────────────────────────────────────────────────────

export interface CourseProofFile {
  name: string;
  size: string;
  uri?: string;
  type?: string;
}

export interface CreditCourseRecord {
  id: string;
  studentId?: string;
  studentName?: string;
  rollNo?: string;
  department?: string;
  year?: number;
  section?: string;
  courseType: 'NPTEL Course' | 'SWAYAM Course' | 'Value Added Course (VAC)' | 'Other Approved Credit Course';
  courseName: string;
  courseCode?: string;
  provider: string;
  domain: string;
  duration: string;
  startDate?: string;
  completionDate: string;
  status: string; // 'Completed with Certification' | 'Completed'
  certificationStatus: string;
  certificateId?: string;
  verificationUrl?: string;
  nptelCategory?: string;
  finalScore?: string;
  examStatus?: 'Passed' | 'Appeared' | 'Exempted';
  creditApplicable: boolean;
  claimedCredits: number;
  recognizedCredits?: number;
  creditsEarned?: number; // legacy alias
  creditType?: string;
  semester: string;
  academicYear: string;
  verificationStatus: 'Verified' | 'Pending' | 'Correction' | 'Correction Required' | 'Resubmitted';
  proofs: CourseProofFile[]; // Course Certificate (Required)
  assessmentProof?: CourseProofFile; // Assessment / Exam Proof (Optional)
  comments?: string;
  correctionReason?: string;
  correctionNote?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  submittedAt?: string;
}

export const INITIAL_CREDIT_RECORDS: CreditCourseRecord[] = [
  {
    id: 'AX-CR-000101',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'NPTEL Course',
    courseName: 'Cloud Computing',
    provider: 'NPTEL / SWAYAM',
    domain: 'Computer Science',
    duration: '12 Weeks',
    startDate: '2026-06-01',
    completionDate: '2026-08-20',
    status: 'Completed with Certification',
    certificationStatus: 'Certificate Received',
    certificateId: 'NPTEL26CS102',
    verificationUrl: 'https://nptel.ac.in/verify/NPTEL26CS102',
    nptelCategory: 'Elite',
    finalScore: '78%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 3,
    creditsEarned: 3,
    creditType: 'Academic Credit',
    semester: 'Semester 7',
    academicYear: '2026–27',
    verificationStatus: 'Pending',
    proofs: [{ name: 'Cloud_Computing_Certificate.pdf', size: '2.1 MB' }],
    assessmentProof: { name: 'NPTEL_Scorecard.pdf', size: '1.1 MB' },
    submittedAt: '22 Aug 2026, 10:30 AM',
  },
  {
    id: 'AX-CR-000102',
    studentId: 'STU_002',
    studentName: 'Karthikeyan M',
    rollNo: '23CI024',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'NPTEL Course',
    courseName: 'Python for Data Science',
    provider: 'NPTEL / SWAYAM',
    domain: 'Data Science',
    duration: '8 Weeks',
    startDate: '2026-06-15',
    completionDate: '2026-08-15',
    status: 'Completed with Certification',
    certificationStatus: 'Certificate Received',
    certificateId: 'NPTEL26CS089',
    finalScore: '84%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 2,
    creditsEarned: 2,
    creditType: 'Academic Credit',
    semester: 'Semester 7',
    academicYear: '2026–27',
    verificationStatus: 'Pending',
    proofs: [{ name: 'Python_DataScience_Cert.pdf', size: '1.9 MB' }],
    // assessmentProof omitted intentionally: demonstrates optional proof handling!
    submittedAt: '24 Aug 2026, 11:00 AM',
  },
  {
    id: 'AX-CR-000103',
    studentId: 'STU_003',
    studentName: 'Jeeva M',
    rollNo: '23CI019',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'Value Added Course (VAC)',
    courseName: 'Full Stack Web Development',
    courseCode: 'VAC-2026-CSE-09',
    provider: 'College Department (CSE)',
    domain: 'Full Stack Development',
    duration: '4 Weeks',
    completionDate: '2026-05-15',
    status: 'Completed',
    certificationStatus: 'Certificate Received',
    certificateId: 'VAC-2026-CSE-09',
    finalScore: '88%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 2,
    recognizedCredits: 2,
    creditsEarned: 2,
    creditType: 'Institutional Credit',
    semester: 'Semester 6',
    academicYear: '2025–26',
    verificationStatus: 'Verified',
    verifiedBy: 'Dr. Gokulraj V (Academic Coordinator)',
    verifiedAt: '20 May 2026',
    proofs: [{ name: 'VAC_FullStack_Cert.pdf', size: '1.8 MB' }],
  },
  {
    id: 'AX-CR-000104',
    studentId: 'STU_005',
    studentName: 'Priya S',
    rollNo: '23CI042',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'Other Approved Credit Course',
    courseName: 'IoT Systems & Edge AI',
    provider: 'IIT Bombay / EdX',
    domain: 'Internet of Things',
    duration: '12 Weeks',
    completionDate: '2026-08-10',
    status: 'Completed with Certification',
    certificationStatus: 'Certificate Received',
    certificateId: 'EDX-IOT-992',
    verificationUrl: 'https://edx.org/verify/EDX-IOT-992',
    finalScore: '92%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 3,
    creditsEarned: 3,
    creditType: 'Academic Credit',
    semester: 'Semester 7',
    academicYear: '2026–27',
    verificationStatus: 'Pending',
    proofs: [{ name: 'Edge_AI_Certificate.pdf', size: '2.4 MB' }],
    assessmentProof: { name: 'Final_Grade_Report.pdf', size: '850 KB' },
    submittedAt: '25 Aug 2026, 09:15 AM',
  },
  {
    id: 'AX-CR-000105',
    studentId: 'STU_006',
    studentName: 'Aqdhas M',
    rollNo: '23CI005',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'Value Added Course (VAC)',
    courseName: 'Cybersecurity Fundamentals',
    courseCode: 'VAC-2026-CSE-12',
    provider: 'College Department (CSE)',
    domain: 'Security',
    duration: '4 Weeks',
    completionDate: '2026-08-18',
    status: 'Completed',
    certificationStatus: 'Certificate Received',
    certificateId: 'VAC-2026-CSE-12',
    finalScore: '85%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 2,
    creditsEarned: 2,
    creditType: 'Institutional Credit',
    semester: 'Semester 7',
    academicYear: '2026–27',
    verificationStatus: 'Pending',
    proofs: [{ name: 'Cybersecurity_VAC.pdf', size: '1.5 MB' }],
    submittedAt: '26 Aug 2026, 02:30 PM',
  },
  {
    id: 'AX-CR-000106',
    studentId: 'STU_007',
    studentName: 'Sathish K',
    rollNo: '23CI058',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'NPTEL Course',
    courseName: 'Machine Learning Specialization',
    provider: 'NPTEL / SWAYAM',
    domain: 'Machine Learning',
    duration: '12 Weeks',
    completionDate: '2026-08-05',
    status: 'Completed with Certification',
    certificationStatus: 'Certificate Received',
    finalScore: '70%',
    creditApplicable: true,
    claimedCredits: 3,
    creditsEarned: 3,
    creditType: 'Academic Credit',
    semester: 'Semester 7',
    academicYear: '2026–27',
    verificationStatus: 'Correction',
    correctionReason: 'Certificate unclear',
    correctionNote: 'Uploaded scanned image is illegible. Please upload the original PDF certificate.',
    proofs: [{ name: 'Sathish_Blurry_Cert.jpg', size: '450 KB' }],
    submittedAt: '20 Aug 2026, 04:00 PM',
  },
  {
    id: 'AX-CR-000107',
    studentId: 'STU_008',
    studentName: 'Divya Bharathi P',
    rollNo: '23CI022',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'NPTEL Course',
    courseName: 'Database Management Systems',
    provider: 'NPTEL / SWAYAM',
    domain: 'Computer Science',
    duration: '8 Weeks',
    completionDate: '2026-04-12',
    status: 'Completed with Certification',
    certificationStatus: 'Certificate Received',
    certificateId: 'NPTEL26CS45DBMS',
    finalScore: '86%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 2,
    recognizedCredits: 2,
    creditsEarned: 2,
    creditType: 'Academic Credit',
    semester: 'Semester 6',
    academicYear: '2025–26',
    verificationStatus: 'Verified',
    verifiedBy: 'Dr. Gokulraj V (Academic Coordinator)',
    verifiedAt: '25 Apr 2026',
    proofs: [{ name: 'DBMS_NPTEL_Cert.pdf', size: '2.0 MB' }],
  },
  {
    id: 'AX-CR-000108',
    studentId: 'STU_009',
    studentName: 'Deepak S',
    rollNo: '23CI015',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    courseType: 'Value Added Course (VAC)',
    courseName: 'Embedded System Design',
    courseCode: 'VAC-2026-CSE-15',
    provider: 'College Department (CSE)',
    domain: 'Embedded Systems',
    duration: '4 Weeks',
    completionDate: '2026-08-20',
    status: 'Completed',
    certificationStatus: 'Certificate Received',
    certificateId: 'VAC-2026-CSE-15',
    finalScore: '82%',
    examStatus: 'Passed',
    creditApplicable: true,
    claimedCredits: 2,
    creditsEarned: 2,
    creditType: 'Institutional Credit',
    semester: 'Semester 7',
    academicYear: '2026–27',
    verificationStatus: 'Pending',
    proofs: [{ name: 'Embedded_VAC_Cert.pdf', size: '1.7 MB' }],
    submittedAt: '27 Aug 2026, 01:15 PM',
  },
];

export const COURSE_TYPES = [
  'All Types',
  'NPTEL Course',
  'SWAYAM Course',
  'Value Added Course (VAC)',
  'Other Approved Credit Course',
] as const;

export const COURSE_STATUSES = [
  'All',
  'Pending',
  'Verified',
  'Correction',
] as const;
