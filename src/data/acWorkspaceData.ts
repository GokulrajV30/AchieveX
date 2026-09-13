// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Workspace Centralized Data
// Structured Event Groups, Team Groups, Student Submissions, and Scope Data.
// ─────────────────────────────────────────────────────────────

export interface ACCommonProof {
  id: string;
  label: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  uploadedAt: string;
  previewUrl?: string;
}

export interface ACStudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  year: number;
  section: string;
  eventGroupId: string;
  teamGroupId?: string;
  eventName: string;
  category: string;
  achievementType: string;
  organizer: string;
  level: string;
  date: string;
  semester: string;
  result: string; // 'Winner' | 'Runner-up' | 'Participant' | 'First Author' | etc.
  isTeam: boolean;
  teamRole?: string; // 'Team Leader' | 'Member'
  individualProofName?: string;
  individualProofType?: string;
  hasIndividualProof: boolean;
  isReady: boolean;
  status: 'Pending' | 'Ready' | 'Needs Attention' | 'Correction Required' | 'Resubmitted' | 'Approved' | 'Rejected';
  issueReason?: string; // 'Certificate Missing' | 'Certificate Unclear' | 'Duplicate Suspected' | 'Name Mismatch'
  calculatedPoints: number;
  cashPrize?: string;
  submittedAt: string;
  feedback?: string;
}

export interface ACTeamGroup {
  id: string;
  eventGroupId: string;
  teamName: string;
  teamLeadStudentId: string;
  teamLeadName: string;
  memberCount: number;
  result: string;
  commonProofs: ACCommonProof[];
  memberSubmissionIds: string[];
  readyCount: number;
  attentionCount: number;
}

export interface ACEventGroup {
  id: string;
  eventName: string;
  category: string;
  achievementType: string;
  organizer: string;
  level: string;
  eventDate: string;
  semester: string;
  totalSubmissions: number;
  readyCount: number;
  issuesCount: number;
  resubmittedCount: number;
  commonProofs: ACCommonProof[];
  teamGroups?: ACTeamGroup[];
  memberSubmissionIds: string[];
}

export interface ACVerificationActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'approved' | 'correction' | 'rejected';
  count: number;
}

export interface ACNotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  targetType: 'group' | 'individual' | 'correction' | 'team';
  targetId: string;
  eventGroupId?: string;
  submissionId?: string;
  teamAchievementId?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. AC WORKSPACE SUMMARY DATA
// ─────────────────────────────────────────────────────────────
export const AC_SUMMARY_DATA = {
  totalPendingReviews: 38,
  totalEventGroups: 12,
  readyCount: 31,
  needAttentionCount: 7,
  verifiedTodayCount: 24,
  readyPercentage: 82, // 31 / 38 = 82%
  assignedScope: {
    institution: 'Nandha Engineering College',
    department: 'CSE (IoT)',
    year: '3rd Year',
    section: 'Section A',
    totalStudents: 60,
    activeAchievers: 48,
    attentionStudents: 12,
  },
};

// ─────────────────────────────────────────────────────────────
// 2. COMMON PROOFS FOR DEMO EVENTS & TEAMS
// ─────────────────────────────────────────────────────────────
export const SIH_COMMON_PROOFS: ACCommonProof[] = [
  {
    id: 'PROOF-SIH-01',
    label: 'Official Event Poster & Schedule',
    fileName: 'sih2026_official_poster.jpg',
    fileType: 'image',
    fileSize: '2.4 MB',
    uploadedAt: '31 Aug 2026',
  },
  {
    id: 'PROOF-SIH-02',
    label: 'Official Ministry Merit List & Results',
    fileName: 'sih2026_grand_finale_results.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadedAt: '31 Aug 2026',
  },
  {
    id: 'PROOF-SIH-03',
    label: 'Stage Award Presentation Photo',
    fileName: 'sih2026_stage_award.jpg',
    fileType: 'image',
    fileSize: '3.1 MB',
    uploadedAt: '31 Aug 2026',
  },
];

export const CODE_NEXUS_TEAM_PROOFS: ACCommonProof[] = [
  {
    id: 'PROOF-TEAM-01',
    label: 'Official Winner Merit Notification',
    fileName: 'code_nexus_winner_award.pdf',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    uploadedAt: '31 Aug 2026',
  },
  {
    id: 'PROOF-TEAM-02',
    label: 'Team Prize Cheque Presentation',
    fileName: 'code_nexus_cheque_photo.jpg',
    fileType: 'image',
    fileSize: '2.8 MB',
    uploadedAt: '31 Aug 2026',
  },
];

export const IEEE_COMMON_PROOFS: ACCommonProof[] = [
  {
    id: 'PROOF-IEEE-01',
    label: 'Conference Proceedings & Indexing',
    fileName: 'ieee_conference_proceedings.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    uploadedAt: '18 Aug 2026',
  },
  {
    id: 'PROOF-IEEE-02',
    label: 'Technical Session Schedule',
    fileName: 'ieee_session_schedule.pdf',
    fileType: 'pdf',
    fileSize: '890 KB',
    uploadedAt: '18 Aug 2026',
  },
];

export const SPORTS_COMMON_PROOFS: ACCommonProof[] = [
  {
    id: 'PROOF-SPORT-01',
    label: 'Official Anna University Zonal Fixtures & Results',
    fileName: 'zonal_athletics_official_results.pdf',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    uploadedAt: '10 Aug 2026',
  },
];

// ─────────────────────────────────────────────────────────────
// 3. STUDENT SUBMISSIONS DATASETS (ISOLATED PER GROUP)
// ─────────────────────────────────────────────────────────────

// Group 1: Smart India Hackathon 2026 (42 Submissions)
export const SIH_STUDENT_SUBMISSIONS: ACStudentSubmission[] = [
  // Team Code Nexus (6 Members)
  {
    id: 'SUB-SIH-001',
    studentId: 'STU_001',
    studentName: 'Gokulraj V',
    rollNo: '23CI011',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    teamGroupId: 'TEAM_CODE_NEXUS',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Winner',
    isTeam: true,
    teamRole: 'Team Leader',
    individualProofName: 'Gokulraj_SIH_Winner_Certificate.pdf',
    individualProofType: 'Individual Winner Certificate',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 50,
    cashPrize: '₹1,00,000',
    submittedAt: '31 Aug 2026, 09:30 AM',
  },
  {
    id: 'SUB-SIH-002',
    studentId: 'STU_002',
    studentName: 'Aqdhas M',
    rollNo: '23CI005',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    teamGroupId: 'TEAM_CODE_NEXUS',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Winner',
    isTeam: true,
    teamRole: 'Member',
    individualProofName: 'Aqdhas_SIH_Winner_Certificate.pdf',
    individualProofType: 'Individual Winner Certificate',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 50,
    cashPrize: '₹1,00,000',
    submittedAt: '31 Aug 2026, 09:35 AM',
  },
  {
    id: 'SUB-SIH-003',
    studentId: 'STU_003',
    studentName: 'Karthikeyan M',
    rollNo: '23CI024',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    teamGroupId: 'TEAM_CODE_NEXUS',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Winner',
    isTeam: true,
    teamRole: 'Member',
    individualProofName: 'Karthikeyan_SIH_Winner_Certificate.pdf',
    individualProofType: 'Individual Winner Certificate',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 50,
    cashPrize: '₹1,00,000',
    submittedAt: '31 Aug 2026, 09:40 AM',
  },
  {
    id: 'SUB-SIH-004',
    studentId: 'STU_004',
    studentName: 'Priya S',
    rollNo: '23CI042',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    teamGroupId: 'TEAM_CODE_NEXUS',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Winner',
    isTeam: true,
    teamRole: 'Member',
    individualProofName: 'Priya_SIH_Winner_Certificate.pdf',
    individualProofType: 'Individual Winner Certificate',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 50,
    cashPrize: '₹1,00,000',
    submittedAt: '31 Aug 2026, 09:45 AM',
  },
  {
    id: 'SUB-SIH-005',
    studentId: 'STU_005',
    studentName: 'Jeeva M',
    rollNo: '23CI019',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    teamGroupId: 'TEAM_CODE_NEXUS',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Winner',
    isTeam: true,
    teamRole: 'Member',
    hasIndividualProof: false,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Certificate Missing',
    calculatedPoints: 50,
    cashPrize: '₹1,00,000',
    submittedAt: '31 Aug 2026, 10:00 AM',
  },
  {
    id: 'SUB-SIH-006',
    studentId: 'STU_006',
    studentName: 'Sathish K',
    rollNo: '23CI058',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    teamGroupId: 'TEAM_CODE_NEXUS',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Winner',
    isTeam: true,
    teamRole: 'Member',
    individualProofName: 'Sathish_Blurry_Scan.jpg',
    individualProofType: 'Scanned Copy',
    hasIndividualProof: true,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Certificate Unclear',
    calculatedPoints: 50,
    cashPrize: '₹1,00,000',
    submittedAt: '31 Aug 2026, 10:05 AM',
  },

  // Other Participants & Winners from Department (36 more records)
  {
    id: 'SUB-SIH-007',
    studentId: 'STU_007',
    studentName: 'Arun Kumar',
    rollNo: '23CI018',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: '1st Runner Up',
    isTeam: true,
    teamRole: 'Team Lead',
    individualProofName: 'Arun_RunnerUp_Certificate.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 35,
    cashPrize: '₹50,000',
    submittedAt: '31 Aug 2026, 10:15 AM',
  },
  {
    id: 'SUB-SIH-008',
    studentId: 'STU_008',
    studentName: 'Divya Bharathi P',
    rollNo: '23CI022',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: '1st Runner Up',
    isTeam: true,
    teamRole: 'Member',
    individualProofName: 'Divya_RunnerUp_Certificate.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 35,
    cashPrize: '₹50,000',
    submittedAt: '31 Aug 2026, 10:20 AM',
  },
  {
    id: 'SUB-SIH-009',
    studentId: 'STU_009',
    studentName: 'Deepak S',
    rollNo: '23CI015',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Participation',
    isTeam: false,
    individualProofName: 'Deepak_Participation.pdf',
    hasIndividualProof: true,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Duplicate Suspected',
    calculatedPoints: 10,
    submittedAt: '31 Aug 2026, 10:30 AM',
  },
  {
    id: 'SUB-SIH-010',
    studentId: 'STU_010',
    studentName: 'Kavitha M',
    rollNo: '23CI026',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    date: '31 Aug 2026',
    semester: 'Semester 7',
    result: 'Participation',
    isTeam: false,
    individualProofName: 'Kavitha_Updated_Cert.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Resubmitted',
    calculatedPoints: 10,
    submittedAt: '31 Aug 2026, 10:45 AM',
  },
  // Submissions 11 to 42
  ...Array.from({ length: 32 }).map((_, i) => {
    const idx = i + 11;
    const pad = idx < 10 ? `0${idx}` : `${idx}`;
    const nameList = [
      'Anand R', 'Bhuvanesh T', 'Chandran S', 'Dhanush K', 'Elango V',
      'Ganesh P', 'Harish N', 'Iswarya S', 'Janani B', 'Keerthana M',
      'Logesh W', 'Manoj C', 'Naveen K', 'Oviya S', 'Pavithra R',
      'Rajesh K', 'Sangeetha M', 'Tamilselvan P', 'Uma V', 'Varun K',
      'Yogesh S', 'Vignesh P', 'Surya K', 'Ramya D', 'Nithish B',
      'Muthu S', 'Lavanya K', 'Hemalatha P', 'Gowtham R', 'Dinesh T',
      'Charan M', 'Abirami S'
    ];
    const name = nameList[i] || `Student ${pad}`;
    return {
      id: `SUB-SIH-${pad}`,
      studentId: `STU_${pad}`,
      studentName: name,
      rollNo: `23CI0${pad}`,
      department: 'CSE (IoT)',
      year: 3,
      section: 'A',
      eventGroupId: 'EVENT_GROUP_SIH_2026',
      eventName: 'Smart India Hackathon 2026',
      category: 'Technical & Professional',
      achievementType: 'Hackathon',
      organizer: 'AICTE & MoE, New Delhi',
      level: 'National Level',
      date: '31 Aug 2026',
      semester: 'Semester 7',
      result: 'Participation',
      isTeam: false,
      individualProofName: `${name.replace(' ', '_')}_Participation.pdf`,
      hasIndividualProof: true,
      isReady: true,
      status: 'Ready' as const,
      calculatedPoints: 10,
      submittedAt: '31 Aug 2026, 11:00 AM',
    };
  }),
];

// Group 2: IEEE International Paper Presentation (18 Submissions)
export const IEEE_STUDENT_SUBMISSIONS: ACStudentSubmission[] = [
  {
    id: 'SUB-IEEE-001',
    studentId: 'STU_004',
    studentName: 'Priya S',
    rollNo: '23CI042',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_IEEE_2026',
    eventName: 'IEEE International Paper Presentation',
    category: 'Research & Intellectual Property',
    achievementType: 'Conference Presentation',
    organizer: 'IEEE Computer Society',
    level: 'International Level',
    date: '18 Aug 2026',
    semester: 'Semester 7',
    result: 'First Author',
    isTeam: false,
    individualProofName: 'Priya_IEEE_Presentation_Certificate.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 40,
    submittedAt: '18 Aug 2026, 02:00 PM',
  },
  {
    id: 'SUB-IEEE-002',
    studentId: 'STU_002',
    studentName: 'Aqdhas M',
    rollNo: '23CI005',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_IEEE_2026',
    eventName: 'IEEE International Paper Presentation',
    category: 'Research & Intellectual Property',
    achievementType: 'Conference Presentation',
    organizer: 'IEEE Computer Society',
    level: 'International Level',
    date: '18 Aug 2026',
    semester: 'Semester 7',
    result: 'Co-Author',
    isTeam: false,
    individualProofName: 'Aqdhas_IEEE_Certificate.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 25,
    submittedAt: '18 Aug 2026, 02:15 PM',
  },
  {
    id: 'SUB-IEEE-003',
    studentId: 'STU_009',
    studentName: 'Deepak S',
    rollNo: '23CI015',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_IEEE_2026',
    eventName: 'IEEE International Paper Presentation',
    category: 'Research & Intellectual Property',
    achievementType: 'Conference Presentation',
    organizer: 'IEEE Computer Society',
    level: 'International Level',
    date: '18 Aug 2026',
    semester: 'Semester 7',
    result: 'Author',
    isTeam: false,
    hasIndividualProof: false,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Certificate Missing',
    calculatedPoints: 25,
    submittedAt: '18 Aug 2026, 02:30 PM',
  },
  {
    id: 'SUB-IEEE-004',
    studentId: 'STU_017',
    studentName: 'Harish N',
    rollNo: '23CI017',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_IEEE_2026',
    eventName: 'IEEE International Paper Presentation',
    category: 'Research & Intellectual Property',
    achievementType: 'Conference Presentation',
    organizer: 'IEEE Computer Society',
    level: 'International Level',
    date: '18 Aug 2026',
    semester: 'Semester 7',
    result: 'Author',
    isTeam: false,
    individualProofName: 'Harish_Receipt_Only.jpg',
    hasIndividualProof: true,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Certificate Unclear',
    calculatedPoints: 25,
    submittedAt: '18 Aug 2026, 02:45 PM',
  },
  ...Array.from({ length: 14 }).map((_, i) => {
    const idx = i + 5;
    const pad = idx < 10 ? `0${idx}` : `${idx}`;
    const nameList = [
      'Karthikeyan M', 'Gokulraj V', 'Divya Bharathi P', 'Kavitha M', 'Anand R',
      'Bhuvanesh T', 'Chandran S', 'Dhanush K', 'Elango V', 'Ganesh P',
      'Iswarya S', 'Janani B', 'Keerthana M', 'Logesh W'
    ];
    const name = nameList[i] || `IEEE Student ${pad}`;
    return {
      id: `SUB-IEEE-${pad}`,
      studentId: `STU_${pad}`,
      studentName: name,
      rollNo: `23CI0${pad}`,
      department: 'CSE (IoT)',
      year: 3,
      section: 'A',
      eventGroupId: 'EVENT_GROUP_IEEE_2026',
      eventName: 'IEEE International Paper Presentation',
      category: 'Research & Intellectual Property',
      achievementType: 'Conference Presentation',
      organizer: 'IEEE Computer Society',
      level: 'International Level',
      date: '18 Aug 2026',
      semester: 'Semester 7',
      result: 'Author',
      isTeam: false,
      individualProofName: `${name.replace(' ', '_')}_IEEE_Presentation.pdf`,
      hasIndividualProof: true,
      isReady: true,
      status: 'Ready' as const,
      calculatedPoints: 25,
      submittedAt: '18 Aug 2026, 03:00 PM',
    };
  }),
];

// Group 3: Anna University Zonal Athletic Meet (12 Submissions)
export const SPORTS_STUDENT_SUBMISSIONS: ACStudentSubmission[] = [
  {
    id: 'SUB-SPORT-001',
    studentId: 'STU_006',
    studentName: 'Sathish K',
    rollNo: '23CI058',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SPORTS_2026',
    eventName: 'Anna University Zonal Athletic Meet',
    category: 'Sports & Games',
    achievementType: 'Athletics Meet',
    organizer: 'Anna University Sports Board',
    level: 'Zone Level',
    date: '10 Aug 2026',
    semester: 'Semester 7',
    result: 'Gold Medal (100m)',
    isTeam: false,
    individualProofName: 'Sathish_100m_Gold_Certificate.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 30,
    submittedAt: '10 Aug 2026, 11:00 AM',
  },
  {
    id: 'SUB-SPORT-002',
    studentId: 'STU_007',
    studentName: 'Arun Kumar',
    rollNo: '23CI018',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SPORTS_2026',
    eventName: 'Anna University Zonal Athletic Meet',
    category: 'Sports & Games',
    achievementType: 'Athletics Meet',
    organizer: 'Anna University Sports Board',
    level: 'Zone Level',
    date: '10 Aug 2026',
    semester: 'Semester 7',
    result: 'Silver Medal (200m)',
    isTeam: false,
    individualProofName: 'Arun_200m_Silver_Certificate.pdf',
    hasIndividualProof: true,
    isReady: true,
    status: 'Ready',
    calculatedPoints: 20,
    submittedAt: '10 Aug 2026, 11:15 AM',
  },
  {
    id: 'SUB-SPORT-003',
    studentId: 'STU_012',
    studentName: 'Manoj C',
    rollNo: '23CI028',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SPORTS_2026',
    eventName: 'Anna University Zonal Athletic Meet',
    category: 'Sports & Games',
    achievementType: 'Athletics Meet',
    organizer: 'Anna University Sports Board',
    level: 'Zone Level',
    date: '10 Aug 2026',
    semester: 'Semester 7',
    result: 'Participation',
    isTeam: false,
    hasIndividualProof: false,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Certificate Missing',
    calculatedPoints: 10,
    submittedAt: '10 Aug 2026, 11:30 AM',
  },
  {
    id: 'SUB-SPORT-004',
    studentId: 'STU_020',
    studentName: 'Varun K',
    rollNo: '23CI030',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    eventGroupId: 'EVENT_GROUP_SPORTS_2026',
    eventName: 'Anna University Zonal Athletic Meet',
    category: 'Sports & Games',
    achievementType: 'Athletics Meet',
    organizer: 'Anna University Sports Board',
    level: 'Zone Level',
    date: '10 Aug 2026',
    semester: 'Semester 7',
    result: 'Participation',
    isTeam: false,
    individualProofName: 'Varun_College_Track.jpg',
    hasIndividualProof: true,
    isReady: false,
    status: 'Needs Attention',
    issueReason: 'Name Mismatch',
    calculatedPoints: 10,
    submittedAt: '10 Aug 2026, 11:45 AM',
  },
  ...Array.from({ length: 8 }).map((_, i) => {
    const idx = i + 5;
    const pad = idx < 10 ? `0${idx}` : `${idx}`;
    const nameList = [
      'Divya Bharathi P', 'Jeeva M', 'Priya S', 'Karthikeyan M',
      'Gokulraj V', 'Aqdhas M', 'Deepak S', 'Kavitha M'
    ];
    const name = nameList[i] || `Athlete ${pad}`;
    return {
      id: `SUB-SPORT-${pad}`,
      studentId: `STU_${pad}`,
      studentName: name,
      rollNo: `23CI0${pad}`,
      department: 'CSE (IoT)',
      year: 3,
      section: 'A',
      eventGroupId: 'EVENT_GROUP_SPORTS_2026',
      eventName: 'Anna University Zonal Athletic Meet',
      category: 'Sports & Games',
      achievementType: 'Athletics Meet',
      organizer: 'Anna University Sports Board',
      level: 'Zone Level',
      date: '10 Aug 2026',
      semester: 'Semester 7',
      result: 'Participation',
      isTeam: false,
      individualProofName: `${name.replace(' ', '_')}_Zone_Participation.pdf`,
      hasIndividualProof: true,
      isReady: true,
      status: 'Ready' as const,
      calculatedPoints: 10,
      submittedAt: '10 Aug 2026, 12:00 PM',
    };
  }),
];

// All Submissions Combined for Scope
export const ALL_AC_STUDENT_SUBMISSIONS: ACStudentSubmission[] = [
  ...SIH_STUDENT_SUBMISSIONS,
  ...IEEE_STUDENT_SUBMISSIONS,
  ...SPORTS_STUDENT_SUBMISSIONS,
];

// ─────────────────────────────────────────────────────────────
// 4. EVENT GROUPS DATASET
// ─────────────────────────────────────────────────────────────
export const AC_EVENT_GROUPS: ACEventGroup[] = [
  {
    id: 'EVENT_GROUP_SIH_2026',
    eventName: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    achievementType: 'Hackathon',
    organizer: 'AICTE & MoE, New Delhi',
    level: 'National Level',
    eventDate: '31 Aug 2026',
    semester: 'Semester 7',
    totalSubmissions: 42,
    readyCount: 38,
    issuesCount: 3,
    resubmittedCount: 1,
    commonProofs: SIH_COMMON_PROOFS,
    teamGroups: [
      {
        id: 'TEAM_CODE_NEXUS',
        eventGroupId: 'EVENT_GROUP_SIH_2026',
        teamName: 'Code Nexus',
        teamLeadStudentId: 'STU_001',
        teamLeadName: 'Gokulraj V',
        memberCount: 6,
        result: 'Winner',
        commonProofs: CODE_NEXUS_TEAM_PROOFS,
        memberSubmissionIds: [
          'SUB-SIH-001',
          'SUB-SIH-002',
          'SUB-SIH-003',
          'SUB-SIH-004',
          'SUB-SIH-005',
          'SUB-SIH-006',
        ],
        readyCount: 4,
        attentionCount: 2,
      },
    ],
    memberSubmissionIds: SIH_STUDENT_SUBMISSIONS.map((s) => s.id),
  },
  {
    id: 'EVENT_GROUP_IEEE_2026',
    eventName: 'IEEE International Paper Presentation',
    category: 'Research & Intellectual Property',
    achievementType: 'Conference Presentation',
    organizer: 'IEEE Computer Society',
    level: 'International Level',
    eventDate: '18 Aug 2026',
    semester: 'Semester 7',
    totalSubmissions: 18,
    readyCount: 16,
    issuesCount: 2,
    resubmittedCount: 0,
    commonProofs: IEEE_COMMON_PROOFS,
    memberSubmissionIds: IEEE_STUDENT_SUBMISSIONS.map((s) => s.id),
  },
  {
    id: 'EVENT_GROUP_SPORTS_2026',
    eventName: 'Anna University Zonal Athletic Meet',
    category: 'Sports & Games',
    achievementType: 'Athletics Meet',
    organizer: 'Anna University Sports Board',
    level: 'Zone Level',
    eventDate: '10 Aug 2026',
    semester: 'Semester 7',
    totalSubmissions: 12,
    readyCount: 10,
    issuesCount: 2,
    resubmittedCount: 0,
    commonProofs: SPORTS_COMMON_PROOFS,
    memberSubmissionIds: SPORTS_STUDENT_SUBMISSIONS.map((s) => s.id),
  },
];

// ─────────────────────────────────────────────────────────────
// 5. QUERY HELPERS (GUARANTEES STRICT GROUP ISOLATION)
// ─────────────────────────────────────────────────────────────
export function getGroupById(groupId: string): ACEventGroup {
  return AC_EVENT_GROUPS.find((g) => g.id === groupId) || AC_EVENT_GROUPS[0];
}

export function getGroupSubmissions(groupId: string): ACStudentSubmission[] {
  if (groupId === 'EVENT_GROUP_SIH_2026') return SIH_STUDENT_SUBMISSIONS;
  if (groupId === 'EVENT_GROUP_IEEE_2026') return IEEE_STUDENT_SUBMISSIONS;
  if (groupId === 'EVENT_GROUP_SPORTS_2026') return SPORTS_STUDENT_SUBMISSIONS;
  return ALL_AC_STUDENT_SUBMISSIONS.filter((s) => s.eventGroupId === groupId);
}

export function getTeamGroup(eventGroupId: string, teamGroupId: string): ACTeamGroup | undefined {
  const group = getGroupById(eventGroupId);
  return group.teamGroups?.find((t) => t.id === teamGroupId);
}

export function getTeamSubmissions(eventGroupId: string, teamGroupId: string): ACStudentSubmission[] {
  const groupSubs = getGroupSubmissions(eventGroupId);
  return groupSubs.filter((s) => s.teamGroupId === teamGroupId);
}

// ─────────────────────────────────────────────────────────────
// 6. RECENT VERIFICATION ACTIVITY AUDIT LOG
// ─────────────────────────────────────────────────────────────
export const AC_RECENT_ACTIVITIES: ACVerificationActivity[] = [
  {
    id: 'ACT-001',
    title: 'Smart India Hackathon 2026',
    description: '38 group submissions approved via bulk verification',
    time: '10:42 AM',
    type: 'approved',
    count: 38,
  },
  {
    id: 'ACT-002',
    title: 'Project Expo Presentation',
    description: '2 correction requests sent for missing certificates',
    time: '09:30 AM',
    type: 'correction',
    count: 2,
  },
  {
    id: 'ACT-003',
    title: 'Anna University Zonal Sports',
    description: '12 team submissions verified officially',
    time: 'Yesterday',
    type: 'approved',
    count: 12,
  },
  {
    id: 'ACT-004',
    title: 'NPTEL Cloud Computing Course',
    description: '8 credit verification requests verified',
    time: '28 Aug 2026',
    type: 'approved',
    count: 8,
  },
];

// ─────────────────────────────────────────────────────────────
// 7. AC NOTIFICATIONS (GROUPED FOR LOW NOISE)
// ─────────────────────────────────────────────────────────────
export const AC_NOTIFICATIONS_DATA: ACNotificationItem[] = [
  {
    id: 'NOTIF-AC-00',
    title: 'Team Achievement Submitted • Code Nexus',
    description: 'Smart India Hackathon 2026 — Team Code Nexus. 5 Members • 1 / 5 Certificates Uploaded.',
    time: 'Just now',
    isRead: false,
    targetType: 'team',
    targetId: 'TA-SIH-2026-001',
    teamAchievementId: 'TA-SIH-2026-001',
  },
  {
    id: 'NOTIF-AC-01',
    title: '42 Submissions Received • Smart India Hackathon',
    description: 'Group ready for verification: 38 ready, 3 issues, 1 resubmission.',
    time: '15 mins ago',
    isRead: false,
    targetType: 'group',
    targetId: 'EVENT_GROUP_SIH_2026',
    eventGroupId: 'EVENT_GROUP_SIH_2026',
  },
  {
    id: 'NOTIF-AC-02',
    title: 'Proof Resubmitted by Jeeva M',
    description: 'Jeeva uploaded corrected certificate for Smart India Hackathon 2026.',
    time: '1 hour ago',
    isRead: false,
    targetType: 'individual',
    targetId: 'SUB-SIH-005',
    submissionId: 'SUB-SIH-005',
  },
  {
    id: 'NOTIF-AC-03',
    title: '18 Submissions Received • IEEE Paper Presentation',
    description: '16 submissions verified ready for bulk approval.',
    time: '3 hours ago',
    isRead: false,
    targetType: 'group',
    targetId: 'EVENT_GROUP_IEEE_2026',
    eventGroupId: 'EVENT_GROUP_IEEE_2026',
  },
  {
    id: 'NOTIF-AC-04',
    title: 'Batch Report Generated Successfully',
    description: 'CSE (IoT) 3rd Year Section A achievement summary is ready for download.',
    time: 'Yesterday',
    isRead: true,
    targetType: 'group',
    targetId: 'EVENT_GROUP_SPORTS_2026',
  },
];

let currentACNotifications: ACNotificationItem[] = [...AC_NOTIFICATIONS_DATA];
type ACNotifListener = () => void;
const acListeners = new Set<ACNotifListener>();

export function subscribeACNotifications(listener: ACNotifListener): () => void {
  acListeners.add(listener);
  return () => acListeners.delete(listener);
}

export function getAllACNotifications(): ACNotificationItem[] {
  return [...currentACNotifications];
}

export function addACNotification(notif: ACNotificationItem): void {
  currentACNotifications = [notif, ...currentACNotifications.filter((n) => n.id !== notif.id)];
  acListeners.forEach((l) => l());
}

export function updateACTeamNotification(teamAchievementId: string, description: string): void {
  currentACNotifications = currentACNotifications.map((n) => {
    if (n.teamAchievementId === teamAchievementId) {
      return { ...n, description, time: 'Just now' };
    }
    return n;
  });
  acListeners.forEach((l) => l());
}


// ─────────────────────────────────────────────────────────────
// 8. STUDENTS IN ACADEMIC SCOPE (60 Students Cohort)
// ─────────────────────────────────────────────────────────────
export interface ACScopedStudent {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  year: number;
  section: string;
  verifiedAchievementsCount: number;
  pendingCount: number;
  correctionsCount: number;
  points: number;
  needsAttention: boolean;
  attentionReason?: string;
}

export const AC_SCOPED_STUDENTS: ACScopedStudent[] = [
  {
    id: 'STU_001',
    name: 'Gokulraj V',
    registerNumber: '23CI011',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 12,
    pendingCount: 1,
    correctionsCount: 0,
    points: 850,
    needsAttention: false,
  },
  {
    id: 'STU_002',
    name: 'Karthikeyan M',
    registerNumber: '23CI024',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 9,
    pendingCount: 2,
    correctionsCount: 0,
    points: 620,
    needsAttention: false,
  },
  {
    id: 'STU_003',
    name: 'Jeeva M',
    registerNumber: '23CI019',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 8,
    pendingCount: 1,
    correctionsCount: 1,
    points: 540,
    needsAttention: true,
    attentionReason: 'Certificate missing for Hackathon submission',
  },
  {
    id: 'STU_004',
    name: 'Arun Kumar',
    registerNumber: '23CI018',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 0,
    pendingCount: 0,
    correctionsCount: 0,
    points: 0,
    needsAttention: true,
    attentionReason: 'No verified achievements submitted this semester',
  },
  {
    id: 'STU_005',
    name: 'Priya S',
    registerNumber: '23CI042',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 14,
    pendingCount: 1,
    correctionsCount: 0,
    points: 980,
    needsAttention: false,
  },
  {
    id: 'STU_006',
    name: 'Aqdhas M',
    registerNumber: '23CI005',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 10,
    pendingCount: 1,
    correctionsCount: 0,
    points: 710,
    needsAttention: false,
  },
  {
    id: 'STU_007',
    name: 'Sathish K',
    registerNumber: '23CI058',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 5,
    pendingCount: 2,
    correctionsCount: 1,
    points: 320,
    needsAttention: true,
    attentionReason: 'Unclear certificate submitted for verification',
  },
  {
    id: 'STU_008',
    name: 'Divya Bharathi P',
    registerNumber: '23CI022',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 11,
    pendingCount: 0,
    correctionsCount: 0,
    points: 760,
    needsAttention: false,
  },
  {
    id: 'STU_009',
    name: 'Deepak S',
    registerNumber: '23CI015',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 4,
    pendingCount: 1,
    correctionsCount: 0,
    points: 210,
    needsAttention: true,
    attentionReason: 'Duplicate submission suspected for Hackathon',
  },
  {
    id: 'STU_010',
    name: 'Kavitha M',
    registerNumber: '23CI026',
    department: 'CSE (IoT)',
    year: 3,
    section: 'A',
    verifiedAchievementsCount: 7,
    pendingCount: 1,
    correctionsCount: 0,
    points: 430,
    needsAttention: false,
  },
];
