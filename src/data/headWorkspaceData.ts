// ─────────────────────────────────────────────────────────────
// AchieveX — Head Workspace Centralized Data & SaaS Configuration
// Institution Scope: Nandha Engineering College
// Multi-College SaaS Model: All policies, categories, scoring rules,
// and reports are strictly scoped to institutionId.
// ─────────────────────────────────────────────────────────────

export interface InstitutionAchievementPolicy {
  id: string;
  institutionId: string;
  institutionName?: string;
  academicYear: string;
  version: number | string;
  effectiveFrom: string;
  status: 'Active' | 'Draft' | 'Archived';
  updatedBy: string;
  updatedAt: string;
}

export interface HeadPointsRuleConfig {
  id: string;
  typeId?: string;
  level?: string;
  result?: string;
  points?: number;
  defaultPoints?: number;
  winnerBonus?: number;
  runnerBonus?: number;
  participantPoints?: number;
}

export interface HeadProofConfig {
  id: string;
  label?: string;
  required?: boolean;
  condition?: string;
  requiredFileTypes?: string[];
  maxFileSizeMb?: number;
  verificationFields?: string[];
}

export interface HeadAchievementTypeConfig {
  id: string;
  categoryId: string;
  label: string;
  name?: string;
  description: string;
  status: 'active' | 'deactivated';
  applicableLevels: string[];
  applicableResults: string[];
  individualOrTeam: 'Both' | 'Individual' | 'Team';
  scoringRules: HeadPointsRuleConfig[];
  pointRule?: HeadPointsRuleConfig;
  proofRequirements: HeadProofConfig[];
  proofRequirement?: HeadProofConfig;
  usageCount: number;
}

export interface HeadCategoryConfig {
  id: string;
  institutionId: string;
  policyId: string;
  title: string;
  name?: string;
  code?: string;
  description: string;
  iconName: string;
  icon?: string;
  iconFamily?: string;
  iconColor: string;
  color?: string;
  iconBg?: string;
  status: 'active' | 'deactivated';
  isActive?: boolean;
  usageCount: number;
  types: HeadAchievementTypeConfig[];
}

export interface CollegeAchievementRecord {
  id: string;
  institutionId: string;
  userType: 'student' | 'faculty' | 'Student' | 'Faculty';
  userName: string;
  rollOrEmpId: string;
  userRollOrId?: string;
  department: string;
  departmentName?: string;
  departmentId?: string;
  studentYear?: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | string;
  semester?: string;
  academicYear: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  categoryName?: string;
  typeName: string;
  level: string;
  result: string;
  organizer: string;
  eventName?: string;
  date: string;
  status: 'Verified' | 'Pending' | 'Correction Required' | 'Rejected' | string;
  awardedPoints: number;
  pointsRuleId?: string;
  pointsRuleVersion?: number;
  proofs: { id: string; label: string; fileName: string; fileSize: string }[];
  verifiedBy?: string;
  verifiedAt?: string;
  verifiedDate?: string;
  verifierRole?: 'Academic Coordinator' | 'HOD' | 'System Head';
}

export interface DepartmentMetric {
  department: string;
  departmentName?: string;
  departmentId?: string;
  studentCount: number;
  facultyCount: number;
  verifiedAchievements: number;
  totalPoints: number;
  activeAchievers: number;
  participationRate?: number;
  topCategory: string;
  hodName?: string;
}

export interface HeadNotification {
  id: string;
  title: string;
  message: string;
  type: 'policy_update' | 'category_change' | 'milestone' | 'report_ready' | string;
  timestamp: string;
  isRead: boolean;
  actionScreen?: string;
  targetScreen?: string;
}

export interface HeadOverviewStats {
  totalAchievements: number;
  totalPointsAwarded: number;
  participatingDepartments: number;
  activeCategories: number;
  studentAchievements: number;
  facultyAchievements: number;
}

export interface HeadRecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'policy_update' | 'point_rule_change' | 'category_change' | 'report_generated' | 'milestone' | string;
}

export interface HeadReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Accreditation' | 'Institutional' | 'Audit';
}

export interface HeadReportMetadata {
  id: string;
  title: string;
  reportType: string;
  department: string;
  academicYear: string;
  generatedDate: string;
  totalRecords: number;
  studentCount: number;
  facultyCount: number;
  totalPoints: number;
  sampleRecords: CollegeAchievementRecord[];
}

export interface HeadAchievementFilterQuery {
  searchQuery?: string;
  academicYear?: string;
  semester?: string;
  department?: string;
  studentYear?: string;
  category?: string;
  categoryId?: string;
  achievementType?: string;
  level?: string;
  result?: string;
  status?: string;
  userType?: 'All' | 'Students' | 'Faculty' | 'Student' | 'ALL';
}

export const REPORT_TEMPLATES: HeadReportTemplate[] = [
  {
    id: 'naac_criteria_5_3',
    title: 'NAAC Criteria 5.3: Student Participation & Activities',
    description: 'Official NAAC documentation of student awards and recognitions in regional, national, and international events.',
    category: 'Accreditation',
  },
  {
    id: 'nba_criterion_4_student_perf',
    title: 'NBA Criterion 4: Student Performance & External Recognitions',
    description: 'NBA Tier-1 / Tier-2 accredited student outcome metrics, hackathons, and certified milestones.',
    category: 'Accreditation',
  },
  {
    id: 'nba_criterion_5_faculty',
    title: 'NBA Criterion 5: Faculty Professional Milestones & FDP',
    description: 'Faculty research publications, NPTEL certifications, patents, and external consultancy audits.',
    category: 'Accreditation',
  },
  {
    id: 'annual_institutional_summary',
    title: 'Annual Institutional Achievement Summary',
    description: 'High-level executive review for the Board of Governance and Principal.',
    category: 'Institutional',
  },
  {
    id: 'department_comparative_audit',
    title: 'Inter-Department Comparative Achievement Audit',
    description: 'Cross-branch benchmark of points, student participation rates, and faculty output.',
    category: 'Audit',
  },
  {
    id: 'nptel_mooc_credit_transfer',
    title: 'NPTEL / SWAYAM MOOC Credit Transfer & Honor List',
    description: 'Accredited credit transfer courses with Elite / Gold medals across departments.',
    category: 'Accreditation',
  },
  {
    id: 'student_internship_placement',
    title: 'Student External Placement & Research Internship Index',
    description: 'Official verification of industry internships, stipends, and research assistantships.',
    category: 'Audit',
  },
];

export const DEFAULT_INSTITUTION = 'Nandha Engineering College';

export const INITIAL_POLICY: InstitutionAchievementPolicy = {
  id: 'pol-nec-2026',
  institutionId: DEFAULT_INSTITUTION,
  academicYear: '2026–27',
  version: 2,
  effectiveFrom: '01 Jun 2026',
  status: 'Active',
  updatedBy: 'Dr. Arun Kumar (Head)',
  updatedAt: '15 Aug 2026',
};

// ── INITIAL CATEGORIES & TYPES ─────────────────────────────

export const INITIAL_HEAD_CATEGORIES: HeadCategoryConfig[] = [
  {
    id: 'cat-tech',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Technical & Professional',
    description: 'Hackathons, coding challenges, project competitions, paper presentations & technical symposiums.',
    iconName: 'code-slash',
    iconFamily: 'Ionicons',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    status: 'active',
    usageCount: 840,
    types: [
      {
        id: 'type-hackathon',
        categoryId: 'cat-tech',
        label: 'Hackathon',
        description: 'Time-bound collaborative hardware/software development challenge.',
        status: 'active',
        applicableLevels: ['College', 'Regional', 'State', 'National', 'International'],
        applicableResults: ['Winner', 'Runner-up', 'Finalist', 'Participation'],
        individualOrTeam: 'Team',
        usageCount: 380,
        proofRequirements: [
          { id: 'pr-1', label: 'Certificate of Merit / Participation', required: true },
          { id: 'pr-2', label: 'Official Results Notification', required: true },
          { id: 'pr-3', label: 'Event Photo / Geo-tag', required: false },
        ],
        scoringRules: [
          { id: 'sr-h-1', level: 'National', result: 'Winner', points: 30 },
          { id: 'sr-h-2', level: 'National', result: 'Runner-up', points: 25 },
          { id: 'sr-h-3', level: 'National', result: 'Finalist', points: 20 },
          { id: 'sr-h-4', level: 'National', result: 'Participation', points: 15 },
          { id: 'sr-h-5', level: 'State', result: 'Winner', points: 20 },
          { id: 'sr-h-6', level: 'State', result: 'Runner-up', points: 15 },
          { id: 'sr-h-7', level: 'State', result: 'Participation', points: 10 },
          { id: 'sr-h-8', level: 'International', result: 'Winner', points: 40 },
          { id: 'sr-h-9', level: 'International', result: 'Participation', points: 25 },
        ],
      },
      {
        id: 'type-ideathon',
        categoryId: 'cat-tech',
        label: 'Ideathon',
        description: 'Idea pitching and innovative conceptual solution competition.',
        status: 'active',
        applicableLevels: ['College', 'Regional', 'State', 'National', 'International'],
        applicableResults: ['Winner', 'Runner-up', 'Participation'],
        individualOrTeam: 'Both',
        usageCount: 160,
        proofRequirements: [
          { id: 'pr-4', label: 'Participation / Award Certificate', required: true },
        ],
        scoringRules: [
          { id: 'sr-i-1', level: 'National', result: 'Winner', points: 25 },
          { id: 'sr-i-2', level: 'National', result: 'Participation', points: 10 },
        ],
      },
      {
        id: 'type-coding',
        categoryId: 'cat-tech',
        label: 'Coding Competition',
        description: 'Competitive programming and algorithmic problem-solving contests.',
        status: 'active',
        applicableLevels: ['College', 'Regional', 'State', 'National', 'International'],
        applicableResults: ['Winner', 'Runner-up', 'Participation'],
        individualOrTeam: 'Individual',
        usageCount: 190,
        proofRequirements: [
          { id: 'pr-5', label: 'Platform Rank / Certificate', required: true },
        ],
        scoringRules: [
          { id: 'sr-c-1', level: 'National', result: 'Winner', points: 25 },
          { id: 'sr-c-2', level: 'State', result: 'Winner', points: 20 },
        ],
      },
      {
        id: 'type-paper-pres',
        categoryId: 'cat-tech',
        label: 'Paper Presentation',
        description: 'Technical paper presentation at conference or symposium.',
        status: 'active',
        applicableLevels: ['College', 'Regional', 'State', 'National', 'International'],
        applicableResults: ['Winner', 'Runner-up', 'Participation'],
        individualOrTeam: 'Both',
        usageCount: 110,
        proofRequirements: [
          { id: 'pr-6', label: 'Presentation Certificate', required: true },
        ],
        scoringRules: [
          { id: 'sr-p-1', level: 'National', result: 'Winner', points: 25 },
        ],
      },
    ],
  },
  {
    id: 'cat-sports',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Sports & Games',
    description: 'Athletics, team sports, indoor tournaments, and university sports meet achievements.',
    iconName: 'football',
    iconFamily: 'Ionicons',
    iconColor: '#EA580C',
    iconBg: '#FFF7ED',
    status: 'active',
    usageCount: 420,
    types: [
      {
        id: 'type-athletics',
        categoryId: 'cat-sports',
        label: 'Athletics (Track & Field)',
        description: 'Individual track and field events.',
        status: 'active',
        applicableLevels: ['Zone', 'Inter-Zone', 'Anna University', 'State', 'National'],
        applicableResults: ['Gold', 'Silver', 'Bronze', 'Participation'],
        individualOrTeam: 'Individual',
        usageCount: 180,
        proofRequirements: [
          { id: 'pr-sp-1', label: 'Sports Certificate / Medal Proof', required: true },
        ],
        scoringRules: [
          { id: 'sr-sp-1', level: 'National', result: 'Gold', points: 30 },
          { id: 'sr-sp-2', level: 'State', result: 'Gold', points: 20 },
        ],
      },
      {
        id: 'type-team-sports',
        categoryId: 'cat-sports',
        label: 'Team Sports (Cricket, Football, Basketball)',
        description: 'Institutional sports team tournaments.',
        status: 'active',
        applicableLevels: ['Zone', 'Inter-Zone', 'Anna University', 'State', 'National'],
        applicableResults: ['Winner', 'Runner-up', 'Participation'],
        individualOrTeam: 'Team',
        usageCount: 240,
        proofRequirements: [
          { id: 'pr-sp-2', label: 'Team Certificate & Score Sheet', required: true },
        ],
        scoringRules: [
          { id: 'sr-sp-3', level: 'National', result: 'Winner', points: 30 },
        ],
      },
    ],
  },
  {
    id: 'cat-cert',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Certifications & Online Learning',
    description: 'NPTEL, Coursera, AWS, Google Cloud, and global industry credentials.',
    iconName: 'ribbon',
    iconFamily: 'Ionicons',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    status: 'active',
    usageCount: 680,
    types: [
      {
        id: 'type-nptel',
        categoryId: 'cat-cert',
        label: 'NPTEL / Swayam Course',
        description: 'Elite, Gold, Silver certification in MOOC courses.',
        status: 'active',
        applicableLevels: ['National'],
        applicableResults: ['Elite + Gold (90%+)', 'Elite + Silver (75–89%)', 'Elite (60–74%)', 'Successfully Completed'],
        individualOrTeam: 'Individual',
        usageCount: 460,
        proofRequirements: [
          { id: 'pr-n-1', label: 'NPTEL E-Certificate with QR Code', required: true },
          { id: 'pr-n-2', label: 'Scorecard Document', required: true },
        ],
        scoringRules: [
          { id: 'sr-n-1', level: 'National', result: 'Elite + Gold (90%+)', points: 30 },
          { id: 'sr-n-2', level: 'National', result: 'Elite + Silver (75–89%)', points: 25 },
          { id: 'sr-n-3', level: 'National', result: 'Elite (60–74%)', points: 20 },
        ],
      },
      {
        id: 'type-industry-cert',
        categoryId: 'cat-cert',
        label: 'Global Industry Certification',
        description: 'AWS, Azure, Cisco, Oracle, Kubernetes certification.',
        status: 'active',
        applicableLevels: ['International'],
        applicableResults: ['Certified', 'Passed'],
        individualOrTeam: 'Individual',
        usageCount: 220,
        proofRequirements: [
          { id: 'pr-ic-1', label: 'Official Badge Verification Link / PDF', required: true },
        ],
        scoringRules: [
          { id: 'sr-ic-1', level: 'International', result: 'Certified', points: 30 },
        ],
      },
    ],
  },
  {
    id: 'cat-research',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Research, Publication & IPR',
    description: 'Scopus/SCI indexed journal publications, IEEE conference papers, patents & copyrights.',
    iconName: 'book',
    iconFamily: 'Ionicons',
    iconColor: '#7C3AED',
    iconBg: '#F3E8FF',
    status: 'active',
    usageCount: 390,
    types: [
      {
        id: 'type-scopus',
        categoryId: 'cat-research',
        label: 'Journal Publication (Scopus / SCI)',
        description: 'Peer-reviewed research article in indexed journal.',
        status: 'active',
        applicableLevels: ['International', 'National'],
        applicableResults: ['Published', 'Accepted'],
        individualOrTeam: 'Both',
        usageCount: 230,
        proofRequirements: [
          { id: 'pr-r-1', label: 'Full Paper Publication PDF & DOI', required: true },
          { id: 'pr-r-2', label: 'Indexing Proof (Scopus/Web of Science)', required: true },
        ],
        scoringRules: [
          { id: 'sr-r-1', level: 'International', result: 'Published', points: 35 },
        ],
      },
      {
        id: 'type-patent',
        categoryId: 'cat-research',
        label: 'Patent Filed / Published / Granted',
        description: 'Intellectual property registration with official patent office.',
        status: 'active',
        applicableLevels: ['National', 'International'],
        applicableResults: ['Granted', 'Published', 'Filed'],
        individualOrTeam: 'Both',
        usageCount: 160,
        proofRequirements: [
          { id: 'pr-pat-1', label: 'Patent Journal Publication Gazette / Grant Cert', required: true },
        ],
        scoringRules: [
          { id: 'sr-pat-1', level: 'National', result: 'Granted', points: 40 },
          { id: 'sr-pat-2', level: 'National', result: 'Published', points: 25 },
        ],
      },
    ],
  },
  {
    id: 'cat-social',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Social Impact & Community',
    description: 'NSS, NCC, YRC, community service, environmental drives & volunteer initiatives.',
    iconName: 'heart',
    iconFamily: 'Ionicons',
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    status: 'active',
    usageCount: 210,
    types: [
      {
        id: 'type-nss',
        categoryId: 'cat-social',
        label: 'NSS Special Camp / Outreach',
        description: 'Seven-day village outreach camp or community service leadership.',
        status: 'active',
        applicableLevels: ['State', 'National', 'College'],
        applicableResults: ['Completed', 'Outstanding Volunteer'],
        individualOrTeam: 'Individual',
        usageCount: 140,
        proofRequirements: [
          { id: 'pr-soc-1', label: 'NSS Certificate signed by PO', required: true },
        ],
        scoringRules: [
          { id: 'sr-soc-1', level: 'National', result: 'Outstanding Volunteer', points: 25 },
        ],
      },
    ],
  },
  {
    id: 'cat-awards',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Awards, Honors & Recognition',
    description: 'Governor awards, best outgoing student, prime minister commendations, external awards.',
    iconName: 'trophy',
    iconFamily: 'Ionicons',
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
    status: 'active',
    usageCount: 150,
    types: [
      {
        id: 'type-honors',
        categoryId: 'cat-awards',
        label: 'Government / Institutional Merit Award',
        description: 'Prestigious award from government, statutory body or university.',
        status: 'active',
        applicableLevels: ['National', 'State', 'Regional'],
        applicableResults: ['Winner', 'Honoree'],
        individualOrTeam: 'Individual',
        usageCount: 150,
        proofRequirements: [
          { id: 'pr-aw-1', label: 'Official Award Citation / Medal Letter', required: true },
        ],
        scoringRules: [
          { id: 'sr-aw-1', level: 'National', result: 'Winner', points: 35 },
        ],
      },
    ],
  },
  {
    id: 'cat-entrepreneur',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Entrepreneurship & Startup',
    description: 'Incubated startups, venture funding, MSME registrations, innovation grants.',
    iconName: 'rocket',
    iconFamily: 'Ionicons',
    iconColor: '#0891B2',
    iconBg: '#ECFEFF',
    status: 'active',
    usageCount: 90,
    types: [
      {
        id: 'type-startup',
        categoryId: 'cat-entrepreneur',
        label: 'Startup Incorporation / Grant Recipient',
        description: 'DPIIT recognized startup or government innovation grant winner.',
        status: 'active',
        applicableLevels: ['National', 'State'],
        applicableResults: ['Grant Awarded', 'Incubated', 'Registered'],
        individualOrTeam: 'Team',
        usageCount: 90,
        proofRequirements: [
          { id: 'pr-ent-1', label: 'Sanction Order / Incorporation Certificate', required: true },
        ],
        scoringRules: [
          { id: 'sr-ent-1', level: 'National', result: 'Grant Awarded', points: 40 },
        ],
      },
    ],
  },
  {
    id: 'cat-leadership',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Leadership & Responsibility',
    description: 'Student Council President, IEEE/CSI Student Branch Office Bearer, Tech Club Lead.',
    iconName: 'people',
    iconFamily: 'Ionicons',
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
    status: 'active',
    usageCount: 70,
    types: [
      {
        id: 'type-club-lead',
        categoryId: 'cat-leadership',
        label: 'Professional Society Office Bearer',
        description: 'Chairperson or Secretary of IEEE, ACM, CSI, IETE, ISTE chapters.',
        status: 'active',
        applicableLevels: ['College', 'Regional', 'National'],
        applicableResults: ['Chairperson', 'Secretary', 'Executive Member'],
        individualOrTeam: 'Individual',
        usageCount: 70,
        proofRequirements: [
          { id: 'pr-lead-1', label: 'Appointment Order & Annual Activity Report', required: true },
        ],
        scoringRules: [
          { id: 'sr-lead-1', level: 'National', result: 'Chairperson', points: 25 },
        ],
      },
    ],
  },
  {
    id: 'cat-cultural',
    institutionId: DEFAULT_INSTITUTION,
    policyId: 'pol-nec-2026',
    title: 'Cultural & Co-Curricular',
    description: 'Music, dance, fine arts, drama, debate, model united nations, and literary fests.',
    iconName: 'musical-notes',
    iconFamily: 'Ionicons',
    iconColor: '#9333EA',
    iconBg: '#FAF5FF',
    status: 'active',
    usageCount: 160,
    types: [
      {
        id: 'type-inter-cult',
        categoryId: 'cat-cultural',
        label: 'Inter-Collegiate Cultural Fest',
        description: 'Classical, western or folk performance prize winner.',
        status: 'active',
        applicableLevels: ['National', 'State', 'Inter-Collegiate'],
        applicableResults: ['Winner', 'Runner-up', 'Participation'],
        individualOrTeam: 'Both',
        usageCount: 160,
        proofRequirements: [
          { id: 'pr-cult-1', label: 'Fest Certificate & Prize Proof', required: true },
        ],
        scoringRules: [
          { id: 'sr-cult-1', level: 'National', result: 'Winner', points: 25 },
        ],
      },
    ],
  },
];

// ── INITIAL COLLEGE ACHIEVEMENTS (Cross-Department Dataset) ─

export const INITIAL_COLLEGE_ACHIEVEMENTS: CollegeAchievementRecord[] = [
  // 1. CSE (IoT)
  {
    id: 'ACH-COL-001',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Gokulraj V',
    rollOrEmpId: '23CI011',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2026–27',
    title: 'Smart India Hackathon 2026 Winner',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Hackathon',
    level: 'National',
    result: 'Winner',
    organizer: 'Ministry of Education & AICTE',
    date: '14 Aug 2026',
    status: 'Verified',
    awardedPoints: 30,
    pointsRuleId: 'sr-h-1',
    pointsRuleVersion: 2,
    proofs: [
      { id: 'p1', label: 'SIH Winner Certificate', fileName: 'sih_winner_gokulraj.pdf', fileSize: '1.8 MB' },
    ],
    verifiedBy: 'Dr. Priya S (AC)',
    verifiedAt: '16 Aug 2026',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-COL-002',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'faculty',
    userName: 'Dr. Priya S',
    rollOrEmpId: 'FAC-CSE-014',
    department: 'CSE (IoT)',
    academicYear: '2026–27',
    title: 'Edge Intelligence for Sensor Telemetry in IoT Grids',
    categoryId: 'cat-research',
    categoryTitle: 'Research, Publication & IPR',
    typeName: 'Journal Publication (Scopus / SCI)',
    level: 'International',
    result: 'Published',
    organizer: 'IEEE Computer Society (Scopus Indexed)',
    date: '28 Aug 2026',
    status: 'Verified',
    awardedPoints: 35,
    pointsRuleId: 'sr-r-1',
    pointsRuleVersion: 2,
    proofs: [
      { id: 'p2', label: 'IEEE Publication Gazette & DOI', fileName: 'ieee_publication_dr_priya.pdf', fileSize: '2.4 MB' },
    ],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '02 Sep 2026',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-COL-003',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Mohamed Aqdhas',
    rollOrEmpId: '23CI015',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2026–27',
    title: 'NPTEL Cloud Computing Elite + Gold (92%)',
    categoryId: 'cat-cert',
    categoryTitle: 'Certifications & Online Learning',
    typeName: 'NPTEL / Swayam Course',
    level: 'National',
    result: 'Elite + Gold (90%+)',
    organizer: 'IIT Kharagpur & NPTEL',
    date: '10 Jul 2026',
    status: 'Verified',
    awardedPoints: 30,
    pointsRuleId: 'sr-n-1',
    pointsRuleVersion: 2,
    proofs: [
      { id: 'p3', label: 'NPTEL Gold Certificate', fileName: 'nptel_aqdhas_gold.pdf', fileSize: '1.2 MB' },
    ],
    verifiedBy: 'Dr. Priya S (AC)',
    verifiedAt: '12 Jul 2026',
    verifierRole: 'Academic Coordinator',
  },
  // 2. CSE
  {
    id: 'ACH-COL-004',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Kavitha R',
    rollOrEmpId: '23CS104',
    department: 'CSE',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2026–27',
    title: 'ACM ICPC Regional Finalist',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Coding Competition',
    level: 'National',
    result: 'Winner',
    organizer: 'ACM India Council',
    date: '05 Aug 2026',
    status: 'Verified',
    awardedPoints: 25,
    pointsRuleId: 'sr-c-1',
    pointsRuleVersion: 2,
    proofs: [{ id: 'p4', label: 'ACM Rank Card', fileName: 'acm_rank_kavitha.pdf', fileSize: '980 KB' }],
    verifiedBy: 'Dr. Ramesh N (AC)',
    verifiedAt: '08 Aug 2026',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-COL-005',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'faculty',
    userName: 'Dr. Senthil Nathan',
    rollOrEmpId: 'FAC-CSE-002',
    department: 'CSE',
    academicYear: '2026–27',
    title: 'Deep Learning for Medical Imaging Patent Granted',
    categoryId: 'cat-research',
    categoryTitle: 'Research, Publication & IPR',
    typeName: 'Patent Filed / Published / Granted',
    level: 'National',
    result: 'Granted',
    organizer: 'Indian Patent Office',
    date: '18 Jul 2026',
    status: 'Verified',
    awardedPoints: 40,
    pointsRuleId: 'sr-pat-1',
    pointsRuleVersion: 2,
    proofs: [{ id: 'p5', label: 'Patent Grant Certificate', fileName: 'patent_grant_senthil.pdf', fileSize: '3.1 MB' }],
    verifiedBy: 'Dr. K. Manickam (HOD)',
    verifiedAt: '22 Jul 2026',
    verifierRole: 'HOD',
  },
  // 3. AI & DS
  {
    id: 'ACH-COL-006',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Vikram S',
    rollOrEmpId: '24AD042',
    department: 'AI & DS',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2026–27',
    title: 'Kaggle Grandmaster Competition Top 1%',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Coding Competition',
    level: 'International',
    result: 'Winner',
    organizer: 'Kaggle & Google AI',
    date: '12 Aug 2026',
    status: 'Verified',
    awardedPoints: 30,
    proofs: [{ id: 'p6', label: 'Kaggle Certificate', fileName: 'kaggle_top1_vikram.pdf', fileSize: '1.4 MB' }],
    verifiedBy: 'Mrs. Deepa K (AC)',
    verifiedAt: '15 Aug 2026',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-COL-007',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Ananya M',
    rollOrEmpId: '24AD012',
    department: 'AI & DS',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2026–27',
    title: 'National Startup India Seed Grant Recipient',
    categoryId: 'cat-entrepreneur',
    categoryTitle: 'Entrepreneurship & Startup',
    typeName: 'Startup Incorporation / Grant Recipient',
    level: 'National',
    result: 'Grant Awarded',
    organizer: 'Startup India & DPIIT',
    date: '20 Jul 2026',
    status: 'Verified',
    awardedPoints: 40,
    pointsRuleId: 'sr-ent-1',
    proofs: [{ id: 'p7', label: 'Grant Sanction Letter', fileName: 'startup_grant_ananya.pdf', fileSize: '2.0 MB' }],
    verifiedBy: 'Mrs. Deepa K (AC)',
    verifiedAt: '24 Jul 2026',
    verifierRole: 'Academic Coordinator',
  },
  // 4. ECE
  {
    id: 'ACH-COL-008',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Dinesh Kumar T',
    rollOrEmpId: '22EC055',
    department: 'ECE',
    studentYear: '4th Year',
    semester: 'Semester 7',
    academicYear: '2026–27',
    title: 'All India Inter-University Badminton Gold Medalist',
    categoryId: 'cat-sports',
    categoryTitle: 'Sports & Games',
    typeName: 'Athletics (Track & Field)',
    level: 'National',
    result: 'Gold',
    organizer: 'Association of Indian Universities (AIU)',
    date: '02 Aug 2026',
    status: 'Verified',
    awardedPoints: 30,
    proofs: [{ id: 'p8', label: 'AIU Medal Certificate', fileName: 'badminton_gold_dinesh.pdf', fileSize: '1.9 MB' }],
    verifiedBy: 'Mr. Saravanan B (AC)',
    verifiedAt: '04 Aug 2026',
    verifierRole: 'Academic Coordinator',
  },
  // 5. IT
  {
    id: 'ACH-COL-009',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Praveen K',
    rollOrEmpId: '23IT078',
    department: 'IT',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2026–27',
    title: 'AWS Certified Solutions Architect Associate',
    categoryId: 'cat-cert',
    categoryTitle: 'Certifications & Online Learning',
    typeName: 'Global Industry Certification',
    level: 'International',
    result: 'Certified',
    organizer: 'Amazon Web Services',
    date: '19 Jun 2026',
    status: 'Verified',
    awardedPoints: 30,
    proofs: [{ id: 'p9', label: 'AWS Credential PDF', fileName: 'aws_cert_praveen.pdf', fileSize: '850 KB' }],
    verifiedBy: 'Mrs. Jayanthi P (AC)',
    verifiedAt: '21 Jun 2026',
    verifierRole: 'Academic Coordinator',
  },
  // 6. EEE
  {
    id: 'ACH-COL-010',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Sanjay S',
    rollOrEmpId: '25EE018',
    department: 'EEE',
    studentYear: '1st Year',
    semester: 'Semester 2',
    academicYear: '2026–27',
    title: 'State Electric Vehicle Design Contest Runner-up',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Hackathon',
    level: 'State',
    result: 'Runner-up',
    organizer: 'Tamil Nadu Energy Development Agency',
    date: '25 Jul 2026',
    status: 'Verified',
    awardedPoints: 15,
    proofs: [{ id: 'p10', label: 'TEDA Runner Certificate', fileName: 'ev_design_sanjay.pdf', fileSize: '1.1 MB' }],
    verifiedBy: 'Mr. Manikandan G (AC)',
    verifiedAt: '27 Jul 2026',
    verifierRole: 'Academic Coordinator',
  },
  // 7. CSE (Cyber Security)
  {
    id: 'ACH-COL-011',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Harish Babu',
    rollOrEmpId: '24CSB029',
    department: 'CSE (Cyber Security)',
    studentYear: '2nd Year',
    semester: 'Semester 3',
    academicYear: '2026–27',
    title: 'National Cyber Security Hackathon Finalist',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Hackathon',
    level: 'National',
    result: 'Finalist',
    organizer: 'CERT-In & Ministry of Electronics and IT',
    date: '11 Aug 2026',
    status: 'Verified',
    awardedPoints: 20,
    proofs: [{ id: 'p11', label: 'CERT-In Certificate', fileName: 'cert_in_harish.pdf', fileSize: '1.6 MB' }],
    verifiedBy: 'Dr. Revathi K (AC)',
    verifiedAt: '13 Aug 2026',
    verifierRole: 'Academic Coordinator',
  },
  // 8. BME
  {
    id: 'ACH-COL-012',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Meenakshi N',
    rollOrEmpId: '23BM019',
    department: 'BME',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2026–27',
    title: 'National Healthcare Innovation Challenge Winner',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Hackathon',
    level: 'National',
    result: 'Winner',
    organizer: 'AIIMS & Biomedical Engineering Society',
    date: '04 Jul 2026',
    status: 'Verified',
    awardedPoints: 30,
    proofs: [{ id: 'p12', label: 'AIIMS Winner Certificate', fileName: 'aiims_biomed_meenakshi.pdf', fileSize: '2.1 MB' }],
    verifiedBy: 'Dr. Usha Rani (AC)',
    verifiedAt: '08 Jul 2026',
    verifierRole: 'Academic Coordinator',
  },
  // Pending and correction items for realistic status filters
  {
    id: 'ACH-COL-013',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Aakash K',
    rollOrEmpId: '23CI001',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2026–27',
    title: 'IoT Embedded Sensors Symposium',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Paper Presentation',
    level: 'National',
    result: 'Winner',
    organizer: 'IIT Madras Shaastra',
    date: '01 Sep 2026',
    status: 'Pending',
    awardedPoints: 25,
    proofs: [{ id: 'p13', label: 'Draft Certificate Upload', fileName: 'aakash_cert.pdf', fileSize: '1.1 MB' }],
  },
  {
    id: 'ACH-COL-014',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Keerthana M',
    rollOrEmpId: '23CS064',
    department: 'CSE',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2026–27',
    title: 'Inter-College Web Dev Challenge',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Coding Competition',
    level: 'College',
    result: 'Winner',
    organizer: 'College Tech Association',
    date: '29 Aug 2026',
    status: 'Correction Required',
    awardedPoints: 10,
    proofs: [{ id: 'p14', label: 'Unclear Photo', fileName: 'photo_scan.jpg', fileSize: '450 KB' }],
  },

  // ═══════════════════════════════════════════════════════════
  // MULTI-YEAR ACCREDITATION HISTORICAL DATA (2022-23 to 2025-26)
  // ═══════════════════════════════════════════════════════════

  // ── ACADEMIC YEAR 2025–26 ─────────────────────────────────
  {
    id: 'ACH-HIST-25-01',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Gokulraj V',
    rollOrEmpId: '23CI011',
    department: 'CSE (IoT)',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2025–26',
    title: 'Smart India Hackathon 2025 Grand Finalist',
    categoryId: 'cat-hack',
    categoryTitle: 'Hackathons & Innovation',
    typeName: 'Smart India Hackathon (SIH)',
    level: 'National',
    result: 'Finalist',
    organizer: 'Ministry of Education & AICTE',
    date: '18 Dec 2025',
    status: 'Verified',
    awardedPoints: 35,
    proofs: [{ id: 'ph1', label: 'SIH Finalist Certificate', fileName: 'sih_finalist_2025.pdf', fileSize: '1.2 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '22 Dec 2025',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-25-02',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Dharani K',
    rollOrEmpId: '22CS034',
    department: 'CSE',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2025–26',
    title: 'ACM ICPC Regional Qualifier Rank 14',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Coding Competition',
    level: 'National',
    result: 'Rank 14',
    organizer: 'Amrita ICPC Regional Hub',
    date: '10 Nov 2025',
    status: 'Verified',
    awardedPoints: 30,
    proofs: [{ id: 'ph2', label: 'ACM Certificate', fileName: 'icpc_qualifier.pdf', fileSize: '980 KB' }],
    verifiedBy: 'Dr. K. Manickam (HOD)',
    verifiedAt: '15 Nov 2025',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-25-03',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Pavithra S',
    rollOrEmpId: '23IT045',
    department: 'IT',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2025–26',
    title: 'AWS Certified Solutions Architect Associate',
    categoryId: 'cat-cert',
    categoryTitle: 'Certifications & Online Learning',
    typeName: 'Global Industry Certification',
    level: 'International',
    result: 'Passed (880/1000)',
    organizer: 'Amazon Web Services (AWS)',
    date: '04 Oct 2025',
    status: 'Verified',
    awardedPoints: 35,
    proofs: [{ id: 'ph3', label: 'AWS Credential Badge & PDF', fileName: 'aws_solutions_arch.pdf', fileSize: '1.5 MB' }],
    verifiedBy: 'Mrs. Deepa K (AC)',
    verifiedAt: '08 Oct 2025',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-HIST-25-04',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Karthikeyan R',
    rollOrEmpId: '23CI019',
    department: 'CSE (IoT)',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2025–26',
    title: 'TIDCO Drone Autonomous Navigation Challenge',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Design & Fabrication Contest',
    level: 'State',
    result: 'Winner',
    organizer: 'Tamil Nadu Industrial Development Corp',
    date: '14 Feb 2026',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph4', label: 'TIDCO Certificate & Trophy Letter', fileName: 'tidco_drone_karthik.pdf', fileSize: '1.8 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '18 Feb 2026',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-25-05',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Suresh Kumar G',
    rollOrEmpId: '23EC082',
    department: 'ECE',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2025–26',
    title: 'Texas Instruments India Innovation Challenge 2nd Place',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Hardware Hackathon',
    level: 'National',
    result: 'Runner',
    organizer: 'Texas Instruments & AICTE',
    date: '20 Jan 2026',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph5', label: 'TI Certificate', fileName: 'ti_challenge_suresh.pdf', fileSize: '1.6 MB' }],
    verifiedBy: 'Dr. Ramesh Kumar (HOD)',
    verifiedAt: '25 Jan 2026',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-25-06',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Sneha R',
    rollOrEmpId: '22CS088',
    department: 'CSE',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2025–26',
    title: 'Anna University Inter-Zonal Basketball Tournament',
    categoryId: 'cat-sports',
    categoryTitle: 'Sports & Games',
    typeName: 'Inter-Collegiate Sports Tournament',
    level: 'State',
    result: 'Winner',
    organizer: 'Anna University Sports Board',
    date: '28 Sep 2025',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph6', label: 'Sports Medal Certificate', fileName: 'basketball_anna_univ.pdf', fileSize: '1.1 MB' }],
    verifiedBy: 'Mr. Saravanan P (PED)',
    verifiedAt: '02 Oct 2025',
    verifierRole: 'Academic Coordinator',
  },

  // ── ACADEMIC YEAR 2024–25 ─────────────────────────────────
  {
    id: 'ACH-HIST-24-01',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Mohamed Aqdhas',
    rollOrEmpId: '23CI015',
    department: 'CSE (IoT)',
    studentYear: '1st Year',
    semester: 'Semester 2',
    academicYear: '2024–25',
    title: 'IIT Bombay Techfest Autonomous Robot Contest',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Robotics Competition',
    level: 'National',
    result: 'Runner',
    organizer: 'IIT Bombay Techfest',
    date: '28 Dec 2024',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph7', label: 'Techfest Runner Certificate', fileName: 'techfest_runner_aqdhas.pdf', fileSize: '1.3 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '05 Jan 2025',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-24-02',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Vignesh P',
    rollOrEmpId: '22CS095',
    department: 'CSE',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2024–25',
    title: 'Google Solution Challenge Global Top 100',
    categoryId: 'cat-hack',
    categoryTitle: 'Hackathons & Innovation',
    typeName: 'Global Developer Hackathon',
    level: 'International',
    result: 'Top 100 Global',
    organizer: 'Google Developer Student Clubs',
    date: '15 May 2025',
    status: 'Verified',
    awardedPoints: 35,
    proofs: [{ id: 'ph8', label: 'Google Certificate', fileName: 'google_solution_vignesh.pdf', fileSize: '2.0 MB' }],
    verifiedBy: 'Dr. K. Manickam (HOD)',
    verifiedAt: '20 May 2025',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-24-03',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Aishwarya K',
    rollOrEmpId: '22IT012',
    department: 'IT',
    studentYear: '2nd Year',
    semester: 'Semester 3',
    academicYear: '2024–25',
    title: 'NPTEL Deep Learning Elite + Silver (84%)',
    categoryId: 'cat-cert',
    categoryTitle: 'Certifications & Online Learning',
    typeName: 'NPTEL / Swayam Course',
    level: 'National',
    result: 'Elite + Silver',
    organizer: 'NPTEL & IIT Madras',
    date: '18 Nov 2024',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph9', label: 'NPTEL Certificate', fileName: 'nptel_dl_aishwarya.pdf', fileSize: '1.1 MB' }],
    verifiedBy: 'Mrs. Deepa K (AC)',
    verifiedAt: '24 Nov 2024',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-HIST-24-04',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Gokulraj V',
    rollOrEmpId: '23CI011',
    department: 'CSE (IoT)',
    studentYear: '1st Year',
    semester: 'Semester 2',
    academicYear: '2024–25',
    title: 'State Level Young Innovators Project Expo',
    categoryId: 'cat-entrepreneur',
    categoryTitle: 'Entrepreneurship & Startup',
    typeName: 'Prototype & Project Exhibition',
    level: 'State',
    result: 'Winner',
    organizer: 'Tamil Nadu Science & Technology Centre',
    date: '22 Feb 2025',
    status: 'Verified',
    awardedPoints: 20,
    proofs: [{ id: 'ph10', label: 'Expo Award Certificate', fileName: 'expo_gokulraj.pdf', fileSize: '1.4 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '27 Feb 2025',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-24-05',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Manojkumar B',
    rollOrEmpId: '22EE041',
    department: 'EEE',
    studentYear: '2nd Year',
    semester: 'Semester 4',
    academicYear: '2024–25',
    title: 'Renewable Solar Inverter Design Competition',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Design & Fabrication Contest',
    level: 'National',
    result: 'Winner',
    organizer: 'NIT Trichy Festember',
    date: '12 Mar 2025',
    status: 'Verified',
    awardedPoints: 30,
    proofs: [{ id: 'ph11', label: 'NIT Award Certificate', fileName: 'solar_nit_manoj.pdf', fileSize: '1.3 MB' }],
    verifiedBy: 'Dr. Palanisamy M (HOD)',
    verifiedAt: '16 Mar 2025',
    verifierRole: 'HOD',
  },

  // ── ACADEMIC YEAR 2023–24 ─────────────────────────────────
  {
    id: 'ACH-HIST-23-01',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Praveen Raj S',
    rollOrEmpId: '21CI028',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2023–24',
    title: 'IEEE International Conference Paper Presentation (Best Paper)',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Paper Presentation',
    level: 'International',
    result: 'Best Paper Award',
    organizer: 'IEEE Computer Society Bangalore Section',
    date: '14 Dec 2023',
    status: 'Verified',
    awardedPoints: 40,
    proofs: [{ id: 'ph12', label: 'IEEE Best Paper Certificate', fileName: 'ieee_best_paper_praveen.pdf', fileSize: '2.5 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '20 Dec 2023',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-23-02',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Harini B',
    rollOrEmpId: '21CS044',
    department: 'CSE',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2023–24',
    title: 'Flipkart GRiD 5.0 Robotics Track National Semi-Finalist',
    categoryId: 'cat-hack',
    categoryTitle: 'Hackathons & Innovation',
    typeName: 'National Corporate Hackathon',
    level: 'National',
    result: 'Semi-Finalist',
    organizer: 'Flipkart Commerce India',
    date: '02 Sep 2023',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph13', label: 'Flipkart Grid Certificate', fileName: 'flipkart_grid_harini.pdf', fileSize: '1.2 MB' }],
    verifiedBy: 'Dr. K. Manickam (HOD)',
    verifiedAt: '08 Sep 2023',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-23-03',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Deepak V',
    rollOrEmpId: '21IT019',
    department: 'IT',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2023–24',
    title: 'Red Hat Certified Enterprise Application Developer',
    categoryId: 'cat-cert',
    categoryTitle: 'Certifications & Online Learning',
    typeName: 'Global Industry Certification',
    level: 'International',
    result: 'Certified',
    organizer: 'Red Hat Inc',
    date: '19 Jan 2024',
    status: 'Verified',
    awardedPoints: 35,
    proofs: [{ id: 'ph14', label: 'Red Hat Certificate', fileName: 'redhat_deepak.pdf', fileSize: '1.8 MB' }],
    verifiedBy: 'Mrs. Deepa K (AC)',
    verifiedAt: '25 Jan 2024',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-HIST-23-04',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Karthik N',
    rollOrEmpId: '21CI012',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2023–24',
    title: 'Smart City Waste Management Sensor System',
    categoryId: 'cat-entrepreneur',
    categoryTitle: 'Entrepreneurship & Startup',
    typeName: 'Prototype & Project Exhibition',
    level: 'State',
    result: 'Runner',
    organizer: 'Coimbatore Smart City Mission',
    date: '10 Oct 2023',
    status: 'Verified',
    awardedPoints: 20,
    proofs: [{ id: 'ph15', label: 'Smart City Certificate', fileName: 'smart_city_karthik.pdf', fileSize: '1.2 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '15 Oct 2023',
    verifierRole: 'HOD',
  },

  // ── ACADEMIC YEAR 2022–23 ─────────────────────────────────
  {
    id: 'ACH-HIST-22-01',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Rahul M',
    rollOrEmpId: '20CI033',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2022–23',
    title: 'National Cyber Security Hackathon 1st Prize',
    categoryId: 'cat-hack',
    categoryTitle: 'Hackathons & Innovation',
    typeName: 'National Security Hackathon',
    level: 'National',
    result: 'Winner',
    organizer: 'National Cyber Defense Research Centre',
    date: '18 Nov 2022',
    status: 'Verified',
    awardedPoints: 35,
    proofs: [{ id: 'ph16', label: 'Cyber Defense Certificate', fileName: 'cyber_hack_rahul.pdf', fileSize: '1.7 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '24 Nov 2022',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-22-02',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Swathi S',
    rollOrEmpId: '20CS078',
    department: 'CSE',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2022–23',
    title: 'Oracle Certified Professional Java SE 11 Developer',
    categoryId: 'cat-cert',
    categoryTitle: 'Certifications & Online Learning',
    typeName: 'Global Industry Certification',
    level: 'International',
    result: 'Certified (92%)',
    organizer: 'Oracle University',
    date: '12 Sep 2022',
    status: 'Verified',
    awardedPoints: 35,
    proofs: [{ id: 'ph17', label: 'Oracle Certificate', fileName: 'oracle_swathi.pdf', fileSize: '1.4 MB' }],
    verifiedBy: 'Dr. K. Manickam (HOD)',
    verifiedAt: '18 Sep 2022',
    verifierRole: 'HOD',
  },
  {
    id: 'ACH-HIST-22-03',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Vijay Anand K',
    rollOrEmpId: '20IT051',
    department: 'IT',
    studentYear: '3rd Year',
    semester: 'Semester 6',
    academicYear: '2022–23',
    title: 'All India Inter-University Badminton Championship Quarter-Finals',
    categoryId: 'cat-sports',
    categoryTitle: 'Sports & Games',
    typeName: 'Inter-University Sports Tournament',
    level: 'National',
    result: 'Quarter-Finalist',
    organizer: 'Association of Indian Universities (AIU)',
    date: '15 Feb 2023',
    status: 'Verified',
    awardedPoints: 25,
    proofs: [{ id: 'ph18', label: 'AIU Badminton Certificate', fileName: 'badminton_aiu_vijay.pdf', fileSize: '1.1 MB' }],
    verifiedBy: 'Mr. Saravanan P (PED)',
    verifiedAt: '21 Feb 2023',
    verifierRole: 'Academic Coordinator',
  },
  {
    id: 'ACH-HIST-22-04',
    institutionId: DEFAULT_INSTITUTION,
    userType: 'student',
    userName: 'Abishek T',
    rollOrEmpId: '20CI004',
    department: 'CSE (IoT)',
    studentYear: '3rd Year',
    semester: 'Semester 5',
    academicYear: '2022–23',
    title: 'LoRaWAN Long Range IoT Telemetry Prototype',
    categoryId: 'cat-tech',
    categoryTitle: 'Technical & Professional',
    typeName: 'Design & Fabrication Contest',
    level: 'State',
    result: 'Winner',
    organizer: 'TNSCST Student Project Scheme',
    date: '28 Oct 2022',
    status: 'Verified',
    awardedPoints: 20,
    proofs: [{ id: 'ph19', label: 'TNSCST Award Certificate', fileName: 'tnscst_abishek.pdf', fileSize: '1.5 MB' }],
    verifiedBy: 'Dr. Arun Kumar (HOD)',
    verifiedAt: '03 Nov 2022',
    verifierRole: 'HOD',
  },
];

// ── DEPARTMENT PERFORMANCE DATA ────────────────────────────

export const INITIAL_DEPARTMENT_METRICS: DepartmentMetric[] = [
  {
    department: 'CSE (IoT)',
    studentCount: 240,
    facultyCount: 18,
    verifiedAchievements: 420,
    totalPoints: 7420,
    activeAchievers: 192,
    topCategory: 'Technical & Professional',
  },
  {
    department: 'CSE',
    studentCount: 360,
    facultyCount: 24,
    verifiedAchievements: 398,
    totalPoints: 6980,
    activeAchievers: 215,
    topCategory: 'Technical & Professional',
  },
  {
    department: 'AI & DS',
    studentCount: 220,
    facultyCount: 16,
    verifiedAchievements: 356,
    totalPoints: 6250,
    activeAchievers: 164,
    topCategory: 'Entrepreneurship & Startup',
  },
  {
    department: 'ECE',
    studentCount: 300,
    facultyCount: 22,
    verifiedAchievements: 340,
    totalPoints: 5840,
    activeAchievers: 180,
    topCategory: 'Sports & Games',
  },
  {
    department: 'IT',
    studentCount: 240,
    facultyCount: 18,
    verifiedAchievements: 320,
    totalPoints: 5460,
    activeAchievers: 155,
    topCategory: 'Certifications & Online Learning',
  },
  {
    department: 'EEE',
    studentCount: 200,
    facultyCount: 15,
    verifiedAchievements: 290,
    totalPoints: 4920,
    activeAchievers: 130,
    topCategory: 'Technical & Professional',
  },
  {
    department: 'CSE (Cyber Security)',
    studentCount: 180,
    facultyCount: 14,
    verifiedAchievements: 260,
    totalPoints: 4680,
    activeAchievers: 122,
    topCategory: 'Technical & Professional',
  },
  {
    department: 'BME',
    studentCount: 160,
    facultyCount: 12,
    verifiedAchievements: 210,
    totalPoints: 3840,
    activeAchievers: 98,
    topCategory: 'Technical & Professional',
  },
];

// ── INITIAL HEAD NOTIFICATIONS ──────────────────────────────

export const INITIAL_HEAD_NOTIFICATIONS: HeadNotification[] = [
  {
    id: 'hnotif-1',
    title: 'Achievement Policy Version 2 Active',
    message: 'Institutional scoring rules for 2026–27 have taken effect for all 8 departments.',
    type: 'policy_update',
    timestamp: '2 hours ago',
    isRead: false,
    actionScreen: 'headPointsManagement',
  },
  {
    id: 'hnotif-2',
    title: 'CSE (IoT) Reached 7,000+ Achievement Points',
    message: 'CSE (IoT) is currently leading the institutional points table with 7,420 points.',
    type: 'milestone',
    timestamp: 'Yesterday',
    isRead: false,
    actionScreen: 'headDepartments',
  },
  {
    id: 'hnotif-3',
    title: 'Category Configuration Synced',
    message: 'All 9 active categories are synchronized with Student & Faculty submission forms.',
    type: 'category_change',
    timestamp: '3 days ago',
    isRead: true,
    actionScreen: 'headCategoryManagement',
  },
  {
    id: 'hnotif-4',
    title: 'Semester 5 Institutional Report Ready',
    message: 'College-wide summary for verified achievements is available for download.',
    type: 'report_ready',
    timestamp: '1 week ago',
    isRead: true,
    actionScreen: 'headReports',
  },
];

// ── CENTRAL HEAD WORKSPACE STORE ───────────────────────────

export class HeadStore {
  private listeners: (() => void)[] = [];

  institutionId = DEFAULT_INSTITUTION;
  policy: InstitutionAchievementPolicy = { ...INITIAL_POLICY };
  categories: HeadCategoryConfig[] = JSON.parse(JSON.stringify(INITIAL_HEAD_CATEGORIES));
  achievements: CollegeAchievementRecord[] = JSON.parse(JSON.stringify(INITIAL_COLLEGE_ACHIEVEMENTS));
  departmentMetrics: DepartmentMetric[] = JSON.parse(JSON.stringify(INITIAL_DEPARTMENT_METRICS));
  notifications: HeadNotification[] = JSON.parse(JSON.stringify(INITIAL_HEAD_NOTIFICATIONS));

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  // ── CATEGORIES ──

  getCategories(includeDeactivated = true): HeadCategoryConfig[] {
    const list = includeDeactivated ? this.categories : this.categories.filter((c) => c.status === 'active');
    return list.map((c) => ({
      ...c,
      name: c.name || c.title,
      icon: c.icon || c.iconName,
      color: c.color || c.iconColor,
      isActive: c.status === 'active',
      types: c.types.map((t) => ({
        ...t,
        name: t.name || t.label,
        pointRule: t.pointRule || {
          id: `rule_${t.id}`,
          typeId: t.id,
          defaultPoints: t.scoringRules[0]?.points || 100,
          winnerBonus: 50,
          runnerBonus: 25,
          participantPoints: 15,
        },
      })),
    }));
  }

  getCategoryById(id: string): HeadCategoryConfig | undefined {
    return this.categories.find((c) => c.id === id);
  }

  addCategory(data: Partial<HeadCategoryConfig>): { success: boolean; message?: string; category?: HeadCategoryConfig } {
    const title = (data.title || '').trim();
    if (!title) {
      return { success: false, message: 'Category title is required.' };
    }

    const duplicate = this.categories.find(
      (c) => c.title.toLowerCase() === title.toLowerCase() && c.status === 'active'
    );
    if (duplicate) {
      return { success: false, message: 'An active category with this title already exists.' };
    }

    const newCategory: HeadCategoryConfig = {
      id: `cat-${Date.now()}`,
      institutionId: this.institutionId,
      policyId: this.policy.id,
      title,
      description: data.description || 'Institutional achievement category.',
      iconName: data.iconName || 'folder',
      iconFamily: data.iconFamily || 'Ionicons',
      iconColor: data.iconColor || '#2563EB',
      iconBg: data.iconBg || '#EFF6FF',
      status: 'active',
      usageCount: 0,
      types: [],
    };

    this.categories.unshift(newCategory);
    this.notify();
    return { success: true, category: newCategory };
  }

  updateCategory(id: string, updates: Partial<HeadCategoryConfig>): boolean {
    const cat = this.getCategoryById(id);
    if (!cat) return false;

    if (updates.title) cat.title = updates.title.trim();
    if (updates.description) cat.description = updates.description.trim();
    if (updates.iconName) cat.iconName = updates.iconName;
    if (updates.iconColor) cat.iconColor = updates.iconColor;
    if (updates.iconBg) cat.iconBg = updates.iconBg;

    this.notify();
    return true;
  }

  deactivateCategory(id: string): { success: boolean; message: string } {
    const cat = this.getCategoryById(id);
    if (!cat) return { success: false, message: 'Category not found.' };

    cat.status = 'deactivated';

    this.notifications.unshift({
      id: `hnotif-${Date.now()}`,
      title: 'Category Deactivated',
      message: `${cat.title} has been deactivated. New submissions can no longer select this category.`,
      type: 'category_change',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return {
      success: true,
      message: `${cat.title} has been deactivated. Historical records and reports remain intact.`,
    };
  }

  reactivateCategory(id: string): boolean {
    const cat = this.getCategoryById(id);
    if (!cat) return false;

    cat.status = 'active';
    this.notify();
    return true;
  }

  deleteCategory(id: string): { success: boolean; message: string } {
    const cat = this.getCategoryById(id);
    if (!cat) return { success: false, message: 'Category not found.' };

    if (cat.usageCount > 0) {
      return {
        success: false,
        message: `Cannot delete "${cat.title}" because it has ${cat.usageCount} associated historical achievements. Please deactivate it instead to prevent data loss.`,
      };
    }

    this.categories = this.categories.filter((c) => c.id !== id);
    this.notify();
    return { success: true, message: `Category "${cat.title}" was permanently removed.` };
  }

  // ── ACHIEVEMENT TYPES ──

  addAchievementType(
    categoryId: string,
    typeData: Partial<HeadAchievementTypeConfig>
  ): { success: boolean; message?: string } {
    const cat = this.getCategoryById(categoryId);
    if (!cat) return { success: false, message: 'Category not found.' };

    const label = (typeData.label || '').trim();
    if (!label) return { success: false, message: 'Type name is required.' };

    const duplicate = cat.types.find(
      (t) => t.label.toLowerCase() === label.toLowerCase() && t.status === 'active'
    );
    if (duplicate) return { success: false, message: 'Achievement type already exists in this category.' };

    const newType: HeadAchievementTypeConfig = {
      id: `type-${Date.now()}`,
      categoryId,
      label,
      description: typeData.description || '',
      status: 'active',
      applicableLevels: typeData.applicableLevels || ['College', 'State', 'National'],
      applicableResults: typeData.applicableResults || ['Winner', 'Runner-up', 'Participation'],
      individualOrTeam: typeData.individualOrTeam || 'Both',
      usageCount: 0,
      proofRequirements: [
        { id: `pr-${Date.now()}`, label: 'Official Certificate', required: true },
      ],
      scoringRules: [
        { id: `sr-${Date.now()}-1`, level: 'National', result: 'Winner', points: 25 },
        { id: `sr-${Date.now()}-2`, level: 'State', result: 'Winner', points: 20 },
      ],
    };

    cat.types.push(newType);
    this.notify();
    return { success: true };
  }

  deactivateAchievementType(categoryId: string, typeId: string): boolean {
    const cat = this.getCategoryById(categoryId);
    if (!cat) return false;

    const t = cat.types.find((item) => item.id === typeId);
    if (!t) return false;

    t.status = 'deactivated';
    this.notify();
    return true;
  }

  // ── POINTS & SCORING RULES ──

  getPointsRule(
    categoryId: string,
    typeId: string,
    level: string,
    result: string
  ): HeadPointsRuleConfig | undefined {
    const cat = this.getCategoryById(categoryId);
    const type = cat?.types.find((t) => t.id === typeId);
    return type?.scoringRules.find(
      (r) => r.level && r.result && r.level.toLowerCase() === level.toLowerCase() && r.result.toLowerCase() === result.toLowerCase()
    );
  }

  updatePointsRule(
    categoryId: string,
    typeId: string,
    level: string,
    result: string,
    newPoints: number
  ): { success: boolean; message: string } {
    if (isNaN(newPoints) || newPoints < 0) {
      return { success: false, message: 'Points value must be a non-negative number.' };
    }

    const cat = this.getCategoryById(categoryId);
    const type = cat?.types.find((t) => t.id === typeId);
    if (!type) return { success: false, message: 'Achievement type not found.' };

    let rule = type.scoringRules.find(
      (r) => r.level && r.result && r.level.toLowerCase() === level.toLowerCase() && r.result.toLowerCase() === result.toLowerCase()
    );

    if (rule) {
      rule.points = newPoints;
    } else {
      rule = {
        id: `sr-${Date.now()}`,
        level,
        result,
        points: newPoints,
      };
      type.scoringRules.push(rule);
    }

    // Historical Safety: We log this as a policy update without silently modifying past awardedPoints
    this.policy.version = typeof this.policy.version === 'number' ? this.policy.version + 1 : 3;
    this.policy.updatedAt = 'Today';

    this.notifications.unshift({
      id: `hnotif-${Date.now()}`,
      title: 'Scoring Policy Updated',
      message: `Updated points for ${type.label} (${level} • ${result}) to ${newPoints} pts. Policy updated to Version ${this.policy.version}.`,
      type: 'policy_update',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return {
      success: true,
      message: `Scoring rule updated successfully. Changes will apply to upcoming verified achievements under Policy v${this.policy.version}.`,
    };
  }

  // ── ACHIEVEMENTS EXPLORER (With Multi-Filter AND Logic) ──

  getAchievements(filters?: HeadAchievementFilterQuery): CollegeAchievementRecord[] {
    const list = this.achievements.map((ach) => ({
      ...ach,
      departmentName: ach.departmentName || ach.department,
      departmentId: ach.departmentId || ach.department.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      categoryName: ach.categoryName || ach.categoryTitle,
      userRollOrId: ach.userRollOrId || ach.rollOrEmpId,
      eventName: ach.eventName || ach.organizer,
    }));

    if (!filters) return list;

    return list.filter((ach) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchUser = ach.userName.toLowerCase().includes(q);
        const matchId = ach.rollOrEmpId.toLowerCase().includes(q) || (ach.userRollOrId || '').toLowerCase().includes(q);
        const matchTitle = ach.title.toLowerCase().includes(q);
        const matchOrg = ach.organizer.toLowerCase().includes(q) || (ach.eventName || '').toLowerCase().includes(q);
        const matchDept = ach.department.toLowerCase().includes(q);
        if (!matchUser && !matchId && !matchTitle && !matchOrg && !matchDept) return false;
      }

      // 2. Academic Year
      if (filters.academicYear && filters.academicYear !== 'ALL' && filters.academicYear !== 'All') {
        const fYear = filters.academicYear.replace(/–|-/g, '-');
        const aYear = (ach.academicYear || '').replace(/–|-/g, '-');
        if (fYear !== aYear) return false;
      }

      // 3. Semester
      if (filters.semester && filters.semester !== 'ALL' && filters.semester !== 'All' && filters.semester !== 'All Semesters') {
        const fSem = filters.semester.replace(/[^0-9]/g, '');
        const aSem = (ach.semester || '').replace(/[^0-9]/g, '');
        if (fSem && aSem && fSem !== aSem) return false;
        if (!fSem && ach.semester !== filters.semester) return false;
      }

      // 4. Department
      if (filters.department && filters.department !== 'ALL' && filters.department !== 'All' && filters.department !== 'All Departments') {
        const normFilter = filters.department.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normDept = (ach.department || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const normDeptId = (ach.departmentId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normFilter !== normDept && normFilter !== normDeptId && !normDept.includes(normFilter) && !normFilter.includes(normDept)) {
          return false;
        }
      }

      // 5. Student Year
      if (filters.studentYear && filters.studentYear !== 'ALL' && filters.studentYear !== 'All' && filters.studentYear !== 'All Years') {
        if (ach.userType.toLowerCase() !== 'student') return false;
        const fYr = filters.studentYear.replace(/[^0-9]/g, '');
        const aYr = (ach.studentYear || '').replace(/[^0-9]/g, '');
        if (fYr && aYr && fYr !== aYr) return false;
        if (!fYr && ach.studentYear !== filters.studentYear) return false;
      }

      // 6. Category
      if (filters.category && filters.category !== 'ALL' && filters.category !== 'All' && filters.category !== 'All Categories') {
        const fCat = filters.category.toLowerCase().trim();
        const aCat = (ach.categoryTitle || ach.categoryName || '').toLowerCase().trim();
        const aCatId = (ach.categoryId || '').toLowerCase().trim();
        if (fCat !== aCat && fCat !== aCatId && !aCat.includes(fCat) && !fCat.includes(aCat)) {
          return false;
        }
      }
      if (filters.categoryId && filters.categoryId !== 'ALL' && filters.categoryId !== 'All') {
        if (ach.categoryId !== filters.categoryId && (ach.categoryTitle || '').toLowerCase() !== filters.categoryId.toLowerCase()) {
          return false;
        }
      }

      // 7. Achievement Type
      if (filters.achievementType && filters.achievementType !== 'ALL' && filters.achievementType !== 'All') {
        const fType = filters.achievementType.toLowerCase().trim();
        const aType = (ach.typeName || '').toLowerCase().trim();
        if (fType !== aType && !aType.includes(fType) && !fType.includes(aType)) {
          return false;
        }
      }

      // 8. Level
      if (filters.level && filters.level !== 'ALL' && filters.level !== 'All') {
        if ((ach.level || '').toLowerCase() !== filters.level.toLowerCase()) return false;
      }

      // 9. Result
      if (filters.result && filters.result !== 'ALL' && filters.result !== 'All') {
        if ((ach.result || '').toLowerCase() !== filters.result.toLowerCase()) return false;
      }

      // 10. Status
      if (filters.status && filters.status !== 'ALL' && filters.status !== 'All') {
        if (ach.status !== filters.status) return false;
      }

      // 11. User Type
      if (filters.userType && filters.userType !== 'ALL' && filters.userType !== 'All') {
        const u = filters.userType.toLowerCase();
        if (u === 'student' || u === 'students') {
          if (ach.userType.toLowerCase() !== 'student') return false;
        } else if (u === 'faculty') {
          if (ach.userType.toLowerCase() !== 'faculty') return false;
        }
      }

      return true;
    });
  }

  getAchievementById(id: string): CollegeAchievementRecord | undefined {
    return this.achievements.find((a) => a.id === id);
  }

  // ── DEPARTMENTS & METRICS ──

  getDepartmentMetrics(): DepartmentMetric[] {
    return this.departmentMetrics.map((d) => ({
      ...d,
      departmentId: d.departmentId || d.department.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      departmentName: d.departmentName || d.department,
      participationRate: d.participationRate || Math.round((d.activeAchievers / d.studentCount) * 100),
      hodName: d.hodName || (d.department.includes('IoT') ? 'Dr. Arun Kumar' : 'Dr. Department HOD'),
    }));
  }

  getDepartmentDetails(deptName: string): {
    metric?: DepartmentMetric;
    achievements: CollegeAchievementRecord[];
    yearWise: { year: string; count: number; points: number }[];
    categoryWise: { category: string; count: number }[];
  } {
    const metric = this.departmentMetrics.find(
      (d) => d.department.toLowerCase() === deptName.toLowerCase()
    );
    const deptAchievements = this.achievements.filter(
      (a) => a.department.toLowerCase() === deptName.toLowerCase()
    );

    const yearWise = [
      { year: '1st Year', count: 48, points: 720 },
      { year: '2nd Year', count: 110, points: 1840 },
      { year: '3rd Year', count: 165, points: 2980 },
      { year: '4th Year', count: 97, points: 1880 },
    ];

    const categoryMap = new Map<string, number>();
    deptAchievements.forEach((a) => {
      categoryMap.set(a.categoryTitle, (categoryMap.get(a.categoryTitle) || 0) + 1);
    });
    const categoryWise = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));

    return {
      metric,
      achievements: deptAchievements,
      yearWise,
      categoryWise,
    };
  }

  // ── COLLEGE OVERVIEW ──

  getCollegeOverview() {
    const totalVerified = this.achievements.filter((a) => a.status === 'Verified').length;
    const totalPending = this.achievements.filter((a) => a.status === 'Pending').length;
    const totalPoints = this.achievements
      .filter((a) => a.status === 'Verified')
      .reduce((acc, curr) => acc + (curr.awardedPoints || 0), 0);

    return {
      totalStudents: 2400,
      totalFaculty: 180,
      totalVerified: 2840, // Consistent demo metrics
      totalPending: 126,
      totalPoints: 48650,
      totalDepartments: this.departmentMetrics.length,
    };
  }

  getMonthlyTrend() {
    return [
      { month: 'Mar', count: 180 },
      { month: 'Apr', count: 240 },
      { month: 'May', count: 190 },
      { month: 'Jun', count: 310 },
      { month: 'Jul', count: 460 },
      { month: 'Aug', count: 520 },
    ];
  }

  // ── LEADERBOARD (Strict Student vs Faculty Separation) ──

  getLeaderboard(userType: 'student' | 'faculty', departmentFilter?: string) {
    if (userType === 'student') {
      const studentLeaderboard = [
        { rank: 1, name: 'Gokulraj V', rollOrId: '23CI011', department: 'CSE (IoT)', points: 420, verifiedCount: 14 },
        { rank: 2, name: 'Kavitha R', rollOrId: '23CS104', department: 'CSE', points: 390, verifiedCount: 12 },
        { rank: 3, name: 'Vikram S', rollOrId: '24AD042', department: 'AI & DS', points: 360, verifiedCount: 11 },
        { rank: 4, name: 'Dinesh Kumar T', rollOrId: '22EC055', department: 'ECE', points: 340, verifiedCount: 10 },
        { rank: 5, name: 'Mohamed Aqdhas', rollOrId: '23CI015', department: 'CSE (IoT)', points: 310, verifiedCount: 9 },
        { rank: 6, name: 'Praveen K', rollOrId: '23IT078', department: 'IT', points: 290, verifiedCount: 8 },
        { rank: 7, name: 'Sathishkumar', rollOrId: '23CI031', department: 'CSE (IoT)', points: 270, verifiedCount: 8 },
        { rank: 8, name: 'Harish Babu', rollOrId: '24CSB029', department: 'CSE (Cyber Security)', points: 250, verifiedCount: 7 },
      ];
      if (departmentFilter && departmentFilter !== 'All') {
        return studentLeaderboard.filter((s) => s.department === departmentFilter);
      }
      return studentLeaderboard;
    } else {
      const facultyLeaderboard = [
        { rank: 1, name: 'Dr. Priya S', rollOrId: 'FAC-CSE-014', department: 'CSE (IoT)', points: 260, verifiedCount: 8 },
        { rank: 2, name: 'Dr. Senthil Nathan', rollOrId: 'FAC-CSE-002', department: 'CSE', points: 240, verifiedCount: 7 },
        { rank: 3, name: 'Dr. Suresh K', rollOrId: 'FAC-CSE-004', department: 'CSE (IoT)', points: 210, verifiedCount: 6 },
        { rank: 4, name: 'Dr. Revathi K', rollOrId: 'FAC-CSB-008', department: 'CSE (Cyber Security)', points: 190, verifiedCount: 5 },
        { rank: 5, name: 'Mr. Saravanan B', rollOrId: 'FAC-ECE-019', department: 'ECE', points: 180, verifiedCount: 5 },
      ];
      if (departmentFilter && departmentFilter !== 'All') {
        return facultyLeaderboard.filter((f) => f.department === departmentFilter);
      }
      return facultyLeaderboard;
    }
  }

  // ── REPORTS GENERATION ──

  generateReport(reportType: string, filters: HeadAchievementFilterQuery) {
    const matchingRecords = this.getAchievements(filters);
    return {
      id: `REP-${Date.now()}`,
      reportType,
      institution: this.institutionId,
      policyVersion: this.policy.version,
      generatedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      appliedFilters: filters,
      recordCount: matchingRecords.length,
      totalPoints: matchingRecords.reduce((sum, r) => sum + (r.awardedPoints || 0), 0),
      records: matchingRecords,
    };
  }

  // ── NOTIFICATIONS ──

  getNotifications(): HeadNotification[] {
    return this.notifications;
  }

  markNotificationAsRead(id: string) {
    const n = this.notifications.find((item) => item.id === id);
    if (n) n.isRead = true;
    this.notify();
  }

  markNotificationRead(id: string) {
    this.markNotificationAsRead(id);
  }

  markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.notify();
  }

  getPolicy(): InstitutionAchievementPolicy {
    return {
      ...this.policy,
      institutionName: this.policy.institutionName || this.institutionId,
    };
  }

  getOverviewStats(): HeadOverviewStats {
    return {
      totalAchievements: 2840,
      totalPointsAwarded: 48650,
      participatingDepartments: this.departmentMetrics.length,
      activeCategories: this.categories.filter((c) => c.status === 'active').length,
      studentAchievements: 2390,
      facultyAchievements: 450,
    };
  }

  getRecentActivities(): HeadRecentActivity[] {
    return [
      {
        id: 'act-1',
        title: 'Policy v2.4 Incremented',
        description: 'National Level Hackathon point multiplier updated to 1.5x.',
        timestamp: '10 mins ago',
        type: 'policy_update',
      },
      {
        id: 'act-2',
        title: 'CSE (IoT) Reached 8,450 Points',
        description: 'Department crossed milestone with 342 verified achievements.',
        timestamp: '2 hours ago',
        type: 'milestone',
      },
      {
        id: 'act-3',
        title: 'NAAC 5.3 Criteria Report Exported',
        description: 'Semester summary PDF generated for accreditation review.',
        timestamp: 'Yesterday',
        type: 'report_generated',
      },
      {
        id: 'act-4',
        title: 'New Sub-Type Added',
        description: '"Hardware Prototype Hackathon" configured under Technical category.',
        timestamp: '2 days ago',
        type: 'category_change',
      },
    ];
  }

  getStudentLeaderboard() {
    return this.getLeaderboard('student').map((s) => ({
      rank: s.rank,
      name: s.name,
      rollNumber: s.rollOrId,
      department: s.department,
      year: '3rd Year',
      points: s.points,
      verifiedCount: s.verifiedCount,
    }));
  }

  getFacultyLeaderboard() {
    return this.getLeaderboard('faculty').map((f) => ({
      id: f.rollOrId,
      name: f.name,
      department: f.department,
      designation: f.name.startsWith('Dr.') ? 'Associate Professor' : 'Assistant Professor',
      points: f.points,
      verifiedCount: f.verifiedCount,
    }));
  }

  getMonthlyTrendData() {
    return this.getMonthlyTrend();
  }

  activateCategory(id: string): boolean {
    return this.reactivateCategory(id);
  }

  addTypeToCategory(categoryId: string, type: HeadAchievementTypeConfig) {
    const cat = this.getCategoryById(categoryId);
    if (!cat) return { success: false, message: 'Category not found.' };
    cat.types.push(type);
    this.notify();
    return { success: true };
  }

  updatePointRule(
    categoryId: string,
    typeId: string,
    ruleUpdates: Partial<HeadPointsRuleConfig>,
    reason?: string
  ) {
    const cat = this.getCategoryById(categoryId);
    const type = cat?.types.find((t) => t.id === typeId);
    if (!type) return { success: false, message: 'Type not found.' };

    if (!type.pointRule) {
      type.pointRule = { id: `rule_${typeId}`, typeId };
    }
    Object.assign(type.pointRule, ruleUpdates);
    if (ruleUpdates.defaultPoints !== undefined && type.scoringRules.length > 0) {
      type.scoringRules[0].points = ruleUpdates.defaultPoints;
    }

    if (typeof this.policy.version === 'number') {
      this.policy.version += 1;
    } else {
      this.policy.version = 'v2.5';
    }
    this.policy.updatedAt = 'Today';

    this.notifications.unshift({
      id: `hnotif-${Date.now()}`,
      title: 'Scoring Policy Updated',
      message: `Updated scoring rule for ${type.label || type.name || typeId}.${reason ? ' Reason: ' + reason : ''}`,
      type: 'policy_update',
      timestamp: 'Just now',
      isRead: false,
    });

    this.notify();
    return { success: true };
  }

  generateExecutiveReport(
    templateId: string,
    academicYear: string,
    departmentId: string,
    semester: string
  ): HeadReportMetadata {
    const tmpl = REPORT_TEMPLATES.find((t) => t.id === templateId) || REPORT_TEMPLATES[0];
    const deptObj = this.departmentMetrics.find(
      (d) => d.departmentId === departmentId || d.department === departmentId
    );
    const deptName = departmentId === 'ALL' ? 'All 8 Departments' : deptObj?.department || departmentId;

    const sample = this.achievements.slice(0, 4).map((a) => ({
      ...a,
      departmentName: a.departmentName || a.department,
      eventName: a.eventName || a.organizer,
      userRollOrId: a.userRollOrId || a.rollOrEmpId,
      categoryName: a.categoryName || a.categoryTitle,
    }));

    return {
      id: `REP-${Date.now().toString().slice(-6)}`,
      title: tmpl.title,
      reportType: tmpl.category,
      department: deptName,
      academicYear,
      generatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalRecords: departmentId === 'ALL' ? 2840 : (deptObj?.verifiedAchievements || 342),
      studentCount: departmentId === 'ALL' ? 2400 : (deptObj?.studentCount || 240),
      facultyCount: departmentId === 'ALL' ? 180 : (deptObj?.facultyCount || 18),
      totalPoints: departmentId === 'ALL' ? 48650 : (deptObj?.totalPoints || 8450),
      sampleRecords: sample,
    };
  }
}

export const headStore = new HeadStore();

export function subscribeHeadData(listener: () => void) {
  return headStore.subscribe(listener);
}

export function getHeadStore() {
  return headStore;
}
