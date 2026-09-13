// ═══════════════════════════════════════════════════════════════
// AchieveX — Achievement Configuration v2
// Fully independent, category-specific form engine
// ═══════════════════════════════════════════════════════════════

import { COLLEGE_NAMES } from './institutions';

// ── Type Definitions ──

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'date'
  | 'dropdown'
  | 'searchable-dropdown'
  | 'toggle'
  | 'number'
  | 'url';

export interface FieldDef {
  id: string;
  label: string;
  placeholder?: string;
  kind: FieldKind;
  required?: boolean;
  options?: string[];
  /** Options that change based on the selected achievement type */
  optionsByType?: Record<string, string[]>;
  maxLength?: number;
  prefix?: string;
  /** Only render when another field has a specific value */
  showWhen?: { fieldId: string; value: string | string[] };
  /** Only render when the selected type is one of these */
  showWhenType?: string[];
  /** Label for the conditional "Other" text input */
  otherLabel?: string;
  /** Placeholder for the conditional "Other" text input */
  otherPlaceholder?: string;
}

export interface ProofDef {
  id: string;
  label: string;
  required?: boolean;
  /** Only show for these achievement types */
  showWhenType?: string[];
  /** Only show when a field has a specific value */
  showWhenField?: { fieldId: string; value: string | string[] };
}

export interface AchievementTypeDef {
  id: string;
  label: string;
  scoring?: { basePoints: number };
}

export interface ScoringRule {
  basePoints: number;
}

export interface CategoryDef {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconFamily: string;
  iconColor: string;
  iconBg: string;
  types: AchievementTypeDef[];
  fields: FieldDef[];
  proofs: ProofDef[];
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
}

// ── Constants ──

export const LEVEL_MULTIPLIER: Record<string, number> = {
  'College Level': 1.0, 'Regional Level': 1.2, 'State Level': 1.4,
  'National Level': 1.7, 'International Level': 2.0, 'Premier Level': 2.2,
  'College': 1.0, 'Regional': 1.2, 'State': 1.4, 'National': 1.7,
  'International': 2.0, 'Premier': 2.2,
  // Sports levels
  'Intramural': 1.0, 'Zone': 1.1, 'Inter-Zone': 1.3,
  'Anna University': 1.5, 'Open Tournament': 1.2,
};

export const RESULT_MULTIPLIER: Record<string, number> = {
  'Participation': 1.0, 'Finalist': 1.15, 'Third Place': 1.25,
  'Runner-up': 1.35, 'Runner': 1.35, 'Winner': 1.5,
  'Submitted': 1.0, 'Accepted': 1.2, 'Published': 1.4,
  'Applied': 1.0, 'Granted': 1.5, 'Registered': 1.3,
  'Qualified': 1.15, 'Rank': 1.3, 'Top Rank': 1.5,
  'Completed': 1.0, 'Passed': 1.1, 'Certified': 1.2,
  'Selected': 1.2, 'Incubated': 1.3, 'Funded': 1.5,
  'Appointed': 1.0, 'Elected': 1.2,
  'Member': 1.0, 'Coordinator': 1.15, 'Secretary': 1.25, 'President': 1.4,
};

export const CASH_PRIZE_TIERS = [
  { min: 500, max: 1999, bonus: 3 },
  { min: 2000, max: 4999, bonus: 5 },
  { min: 5000, max: 9999, bonus: 7 },
  { min: 10000, max: 24999, bonus: 8 },
  { min: 25000, max: Infinity, bonus: 10 },
] as const;

export function getCashPrizeBonus(amount: number): number {
  for (const tier of CASH_PRIZE_TIERS) {
    if (amount >= tier.min && amount <= tier.max) return tier.bonus;
  }
  return 0;
}

export const BADGE_LEVELS = [
  { name: 'Bronze', minPoints: 25 },
  { name: 'Silver', minPoints: 75 },
  { name: 'Gold', minPoints: 150 },
  { name: 'Platinum', minPoints: 300 },
  { name: 'Diamond', minPoints: 500 },
  { name: 'AchieveX Elite', minPoints: 750 },
] as const;

export const MAX_ACHIEVEMENT_POINTS = 50;
export const TEAM_LEAD_BONUS = 2;

// ── Point Calculator ──

export function calculateEstimatedPoints(opts: {
  basePoints: number;
  level?: string;
  result?: string;
  cashPrize?: number;
  isTeamLead?: boolean;
}): { base: number; levelMultiplied: number; cashBonus: number; teamLeadBonus: number; total: number } {
  const levelMul = opts.level ? (LEVEL_MULTIPLIER[opts.level] ?? 1) : 1;
  const resultMul = opts.result ? (RESULT_MULTIPLIER[opts.result] ?? 1) : 1;
  const levelMultiplied = Math.round(opts.basePoints * levelMul * resultMul);
  const cashBonus = opts.cashPrize ? getCashPrizeBonus(opts.cashPrize) : 0;
  const teamLeadBonus = opts.isTeamLead ? TEAM_LEAD_BONUS : 0;
  const total = Math.min(levelMultiplied + cashBonus + teamLeadBonus, MAX_ACHIEVEMENT_POINTS);
  return { base: opts.basePoints, levelMultiplied, cashBonus, teamLeadBonus, total };
}

// ── Student Database (Mock) ──

export const STUDENT_DATABASE: StudentRecord[] = [
  { id: 's1', name: 'Arun Kumar', rollNumber: '23CI002', department: 'CSE', year: '3rd Year' },
  { id: 's2', name: 'Mohamed Aqdhas', rollNumber: '23CI015', department: 'CSE (IoT)', year: '3rd Year' },
  { id: 's3', name: 'Jeeva M', rollNumber: '23CI019', department: 'CSE (IoT)', year: '3rd Year' },
  { id: 's4', name: 'Karthikeyan M', rollNumber: '23CI024', department: 'CSE (IoT)', year: '3rd Year' },
  { id: 's5', name: 'Sathishkumar', rollNumber: '23CI031', department: 'CSE (IoT)', year: '3rd Year' },
  { id: 's6', name: 'Meena S', rollNumber: '23CI009', department: 'CSE', year: '2nd Year' },
  { id: 's7', name: 'Deepika R', rollNumber: '23CI020', department: 'CSE (IoT)', year: '3rd Year' },
  { id: 's8', name: 'Sanjay V', rollNumber: '23ME005', department: 'Mechanical', year: '3rd Year' },
  { id: 's9', name: 'Vijay R', rollNumber: '23EC018', department: 'ECE', year: '3rd Year' },
  { id: 's10', name: 'Anitha B', rollNumber: '23EE002', department: 'EEE', year: '2nd Year' },
  { id: 's11', name: 'Gokulraj V', rollNumber: '23CI011', department: 'CSE (IoT)', year: '3rd Year' },
];

export const LOGGED_IN_STUDENT = {
  name: 'Gokulraj Velusamy',
  rollNumber: '23CI011',
  department: 'CSE (IoT)',
  year: '3rd Year',
  section: 'A',
};

// ═══════════════════════════════════════════════════════════════
//  HELPER: Generate title options [TypeLabel, 'Other'] for each type
// ═══════════════════════════════════════════════════════════════
function titleMap(types: AchievementTypeDef[]): Record<string, string[]> {
  const m: Record<string, string[]> = {};
  for (const t of types) {
    m[t.id] = t.id === 'other' ? ['Other'] : [t.label, 'Other'];
  }
  return m;
}

// Helper to generate competition-style title options
function compTitleMap(types: AchievementTypeDef[]): Record<string, string[]> {
  const m: Record<string, string[]> = {};
  for (const t of types) {
    if (t.id === 'other') { m[t.id] = ['Other']; continue; }
    if (t.label.includes('Workshop')) {
      m[t.id] = [`${t.label} Completion`, `${t.label} Active Participation`, 'Other'];
    } else {
      m[t.id] = [`${t.label} Winner`, `${t.label} Runner-up`, `${t.label} Finalist`, `${t.label} Participation`, 'Other'];
    }
  }
  return m;
}

// ── Comprehensive list of event organizers including Tamil Nadu colleges & premier institutions ──
export const ORGANIZER_COLLEGE_OPTIONS: string[] = [
  'Nandha Engineering College',
  'Anna University',
  'IIT Madras',
  'NIT Trichy',
  'PSG College of Technology',
  'Coimbatore Institute of Technology',
  'Kumaraguru College of Technology',
  'Thiagarajar College of Engineering',
  'Government College of Technology, Coimbatore',
  'Bannari Amman Institute of Technology',
  'Kongu Engineering College',
  ...COLLEGE_NAMES.filter(
    (n) =>
      ![
        'Nandha Engineering College',
        'Anna University',
        'IIT Madras',
        'NIT Trichy',
        'PSG College of Technology',
        'Coimbatore Institute of Technology',
        'Kumaraguru College of Technology',
        'Thiagarajar College of Engineering',
        'Government College of Technology, Coimbatore',
        'Bannari Amman Institute of Technology',
        'Kongu Engineering College',
      ].includes(n)
  ),
  'VIT',
  'SRM Institute of Science and Technology',
  'Other',
];

export const CULTURAL_ORGANIZER_OPTIONS: string[] = [
  'Nandha Engineering College',
  'Rotary Club',
  'YMCA',
  'District Administration',
  'State Government',
  ...ORGANIZER_COLLEGE_OPTIONS.filter(
    (o) => !['Nandha Engineering College', 'Other'].includes(o)
  ),
  'Other',
];

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 1: TECHNICAL & PROFESSIONAL
// ═══════════════════════════════════════════════════════════════

const TECHNICAL_TYPES: AchievementTypeDef[] = [
  { id: 'paper-presentation', label: 'Paper Presentation', scoring: { basePoints: 15 } },
  { id: 'project-presentation', label: 'Project Presentation', scoring: { basePoints: 15 } },
  { id: 'hackathon', label: 'Hackathon', scoring: { basePoints: 20 } },
  { id: 'ideathon', label: 'Ideathon', scoring: { basePoints: 18 } },
  { id: 'coding-competition', label: 'Coding Competition', scoring: { basePoints: 18 } },
  { id: 'technical-competition', label: 'Technical Competition', scoring: { basePoints: 17 } },
  { id: 'technical-symposium', label: 'Technical Symposium', scoring: { basePoints: 12 } },
  { id: 'technical-workshop', label: 'Technical Workshop', scoring: { basePoints: 10 } },
  { id: 'professional-workshop', label: 'Professional Workshop', scoring: { basePoints: 10 } },
  { id: 'technical-event', label: 'Technical Event', scoring: { basePoints: 10 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_TECHNICAL: CategoryDef = {
  id: 'technical',
  title: 'Technical & Professional',
  description: 'Technical competitions, presentations, hackathons and professional activities.',
  iconName: 'code-slash',
  iconFamily: 'Ionicons',
  iconColor: '#2563EB',
  iconBg: '#DBEAFE',
  types: TECHNICAL_TYPES,
  fields: [
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select achievement title',
      optionsByType: compTitleMap(TECHNICAL_TYPES),
      otherLabel: 'Enter Technical Achievement',
      otherPlaceholder: 'e.g. Robotics Challenge',
    },
    {
      id: 'eventCompetition', label: 'Event / Competition', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select technical event / competition',
      options: ['Smart India Hackathon', 'HackWithInfy', 'TCS CodeVita', 'Code Chef Contest', 'Google Code Jam', 'ACM ICPC', 'IEEE Xtreme', 'Microsoft Imagine Cup', 'NASA Space Apps Challenge', 'DRDO Hackathon', 'Inter-College Technical Fest', 'National Level Technical Symposium', 'Other'],
      otherLabel: 'Enter Technical Event Name',
      otherPlaceholder: 'e.g. National Robotics Challenge',
    },
    {
      id: 'organizer', label: 'Organizer', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select or enter organizer',
      options: ORGANIZER_COLLEGE_OPTIONS,
      otherLabel: 'Enter Organizer Name',
      otherPlaceholder: 'e.g. ABC Engineering College',
    },
    {
      id: 'level', label: 'Level', kind: 'dropdown', required: true,
      placeholder: 'Select level',
      options: ['College Level', 'Regional Level', 'State Level', 'National Level', 'International Level', 'Premier Level'],
    },
    {
      id: 'result', label: 'Result', kind: 'dropdown', required: true,
      placeholder: 'Select result',
      options: ['Participation', 'Finalist', 'Third Place', 'Runner-up', 'Winner'],
    },
    {
      id: 'eventMode', label: 'Event Mode', kind: 'dropdown', required: true,
      placeholder: 'Select mode',
      options: ['Offline', 'Online'],
    },
    {
      id: 'eventDate', label: 'Event Date', kind: 'date', required: true,
      placeholder: 'Select date',
    },
    {
      id: 'location', label: 'Event Location', kind: 'text', required: true,
      placeholder: 'Enter venue location',
      showWhen: { fieldId: 'eventMode', value: 'Offline' },
    },
    {
      id: 'eventPlatform', label: 'Event Platform', kind: 'text', required: true,
      placeholder: 'Enter online platform name',
      showWhen: { fieldId: 'eventMode', value: 'Online' },
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your achievement (optional)',
    },
  ],
  proofs: [
    { id: 'certificate', label: 'Achievement Certificate', required: true },
    { id: 'resultSheet', label: 'Result Sheet' },
    { id: 'projectProof', label: 'Project Proof' },
    { id: 'presentationProof', label: 'Presentation Proof' },
    { id: 'organizerConfirmation', label: 'Organizer Confirmation' },
    { id: 'eventPhoto', label: 'Event Photograph' },
    { id: 'geotagPhoto', label: 'Geotagged Photograph', showWhenField: { fieldId: 'eventMode', value: 'Offline' } },
    { id: 'eventScreenshot', label: 'Official Event Screenshot', showWhenField: { fieldId: 'eventMode', value: 'Online' } },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 2: SPORTS & GAMES
// ═══════════════════════════════════════════════════════════════

const SPORTS_TYPES: AchievementTypeDef[] = [
  { id: 'intramural-participation', label: 'Intramural Sport Participation', scoring: { basePoints: 3 } },
  { id: 'intramural-winner', label: 'Intramural Sport Winner', scoring: { basePoints: 8 } },
  { id: 'intramural-runner', label: 'Intramural Sport Runner', scoring: { basePoints: 6 } },
  { id: 'intramural-third', label: 'Intramural Sport Third Place', scoring: { basePoints: 5 } },
  { id: 'zone-participation', label: 'Zone Participation', scoring: { basePoints: 8 } },
  { id: 'zone-winner', label: 'Zone Prize Winner', scoring: { basePoints: 14 } },
  { id: 'zone-runner', label: 'Zone Runner', scoring: { basePoints: 12 } },
  { id: 'zone-second', label: 'Zone Second Place', scoring: { basePoints: 11 } },
  { id: 'zone-third', label: 'Zone Third Place', scoring: { basePoints: 10 } },
  { id: 'interzone-participation', label: 'Inter-Zone Participation', scoring: { basePoints: 12 } },
  { id: 'interzone-winner', label: 'Inter-Zone Winner', scoring: { basePoints: 18 } },
  { id: 'interzone-runner', label: 'Inter-Zone Runner', scoring: { basePoints: 16 } },
  { id: 'interzone-third', label: 'Inter-Zone Third Place', scoring: { basePoints: 14 } },
  { id: 'au-participation', label: 'Anna University Participation', scoring: { basePoints: 15 } },
  { id: 'au-winner', label: 'Anna University Winner', scoring: { basePoints: 22 } },
  { id: 'au-runner', label: 'Anna University Runner', scoring: { basePoints: 20 } },
  { id: 'open-participation', label: 'Open Tournament Participation', scoring: { basePoints: 10 } },
  { id: 'open-winner', label: 'Open Tournament Winner', scoring: { basePoints: 18 } },
  { id: 'open-runner', label: 'Open Tournament Runner', scoring: { basePoints: 15 } },
  { id: 'national-participation', label: 'National Level Participation', scoring: { basePoints: 18 } },
  { id: 'national-winner', label: 'National Level Winner', scoring: { basePoints: 28 } },
  { id: 'international-participation', label: 'International Level Participation', scoring: { basePoints: 22 } },
  { id: 'international-winner', label: 'International Level Winner', scoring: { basePoints: 35 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 8 } },
];

const CAT_SPORTS: CategoryDef = {
  id: 'sports',
  title: 'Sports & Games',
  description: 'Sports participation, tournaments and recognised sporting achievements.',
  iconName: 'fitness-outline',
  iconFamily: 'Ionicons',
  iconColor: '#16A34A',
  iconBg: '#DCFCE7',
  types: SPORTS_TYPES,
  fields: [
    {
      id: 'sport', label: 'Sport', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select sport',
      options: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'Athletics', 'Chess', 'Kabaddi', 'Hockey', 'Table Tennis', 'Tennis', 'Swimming', 'Other'],
      otherLabel: 'Enter Sport Name',
      otherPlaceholder: 'e.g. Archery, Karate, Boxing',
    },
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select sports achievement',
      optionsByType: titleMap(SPORTS_TYPES),
      otherLabel: 'Enter Sports Achievement',
      otherPlaceholder: 'e.g. University Best Player Award',
    },
    {
      id: 'tournamentEvent', label: 'Tournament / Event', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select tournament / event',
      options: ['Intramural Sports Meet', 'Anna University Zone Sports', 'Inter-Zone Tournament', 'State Level Championship', 'Anna University Championship', 'District Athletics Meet', 'Open State Tournament', 'National Games Selection', 'University Sports Day', 'Other'],
      otherLabel: 'Enter Tournament / Event Name',
      otherPlaceholder: 'e.g. District Athletics Meet',
    },
    {
      id: 'sportsLevel', label: 'Sports Level', kind: 'dropdown', required: true,
      placeholder: 'Select sports level',
      options: ['Intramural', 'Zone', 'Inter-Zone', 'Anna University', 'Open Tournament', 'State', 'National', 'International'],
    },
    {
      id: 'result', label: 'Result', kind: 'dropdown', required: true,
      placeholder: 'Select result',
      options: ['Participation', 'Winner', 'Runner', 'Third Place'],
    },
    {
      id: 'sportFormat', label: 'Sport Format', kind: 'dropdown', required: true,
      placeholder: 'Select format',
      options: ['Individual', 'Team'],
    },
    {
      id: 'eventDate', label: 'Event Date', kind: 'date', required: true,
      placeholder: 'Select date',
    },
    {
      id: 'location', label: 'Event Location', kind: 'text', required: true,
      placeholder: 'Enter venue location',
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your sports achievement (optional)',
    },
  ],
  proofs: [
    { id: 'certificate', label: 'Sports Achievement Certificate', required: true },
    { id: 'resultSheet', label: 'Result Sheet' },
    { id: 'teamSelectionProof', label: 'Team Selection Proof' },
    { id: 'medalPhoto', label: 'Medal / Trophy Photograph' },
    { id: 'tournamentPhoto', label: 'Tournament Photograph' },
    { id: 'organizerConfirmation', label: 'Organizer Confirmation' },
    { id: 'geotagPhoto', label: 'Geotagged Event Photograph' },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 3: CERTIFICATIONS & ONLINE LEARNING
// ═══════════════════════════════════════════════════════════════

const CERTIFICATION_TYPES: AchievementTypeDef[] = [
  { id: 'basic-skill', label: 'Basic Skill Certificate', scoring: { basePoints: 5 } },
  { id: 'recognized-course', label: 'Recognized Online Course', scoring: { basePoints: 8 } },
  { id: 'professional-cert', label: 'Professional Certificate', scoring: { basePoints: 12 } },
  { id: 'industry-cert', label: 'Industry Certification', scoring: { basePoints: 15 } },
  { id: 'advanced-tech-cert', label: 'Advanced Technical Certification', scoring: { basePoints: 18 } },
  { id: 'pro-industry-cert', label: 'Professional / Industry Recognized Certification', scoring: { basePoints: 22 } },
  { id: 'major-industry-cert', label: 'Major Industry Certification', scoring: { basePoints: 25 } },
  { id: 'multi-course-spec', label: 'Multiple-Course Specialization', scoring: { basePoints: 20 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_CERTIFICATIONS: CategoryDef = {
  id: 'certifications',
  title: 'Certifications & Online Learning',
  description: 'Recognised online certifications and professional skill credentials.',
  iconName: 'ribbon-outline',
  iconFamily: 'Ionicons',
  iconColor: '#7C3AED',
  iconBg: '#EDE9FE',
  types: CERTIFICATION_TYPES,
  fields: [
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select certification achievement',
      optionsByType: {
        'basic-skill': ['Basic Skill Certificate Completed', 'Other'],
        'recognized-course': ['Online Course Completed', 'Course Completion with Distinction', 'Other'],
        'professional-cert': ['Professional Certificate Earned', 'Other'],
        'industry-cert': ['Industry Certification Passed', 'Industry Certification Earned', 'Other'],
        'advanced-tech-cert': ['Advanced Technical Certification Earned', 'Other'],
        'pro-industry-cert': ['Professional Certification Earned', 'Industry Recognized Certificate', 'Other'],
        'major-industry-cert': ['Major Industry Certification Earned', 'Other'],
        'multi-course-spec': ['Specialization Completed', 'Multi-Course Program Completed', 'Other'],
        'other': ['Other'],
      },
      otherLabel: 'Enter Certification Type',
      otherPlaceholder: 'e.g. Professional Cloud Certification',
    },
    {
      id: 'platform', label: 'Platform', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select learning platform',
      options: ['Coursera', 'Udemy', 'LinkedIn Learning', 'Google', 'Microsoft', 'IBM', 'AWS', 'Cisco', 'Oracle', 'Other'],
      otherLabel: 'Enter Learning Platform',
      otherPlaceholder: 'e.g. Pluralsight',
    },
    {
      id: 'company', label: 'Issuing Company / Organization', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select issuing organization',
      options: ['Google', 'Microsoft', 'AWS', 'Cisco', 'Meta', 'IBM', 'Oracle', 'Coursera', 'Other'],
      otherLabel: 'Enter Issuing Organization',
      otherPlaceholder: 'e.g. HackerRank',
    },
    {
      id: 'courseName', label: 'Course / Certification Name', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select or search course name',
      options: ['Google Data Analytics', 'AWS Cloud Practitioner', 'Microsoft Azure Fundamentals', 'Cisco CCNA', 'Google IT Support', 'IBM Data Science', 'Meta Front-End Developer', 'Oracle Java Certification', 'Other'],
      otherLabel: 'Enter Course / Certification Name',
      otherPlaceholder: 'e.g. Advanced React Development',
    },
    {
      id: 'completionDate', label: 'Completion Date', kind: 'date', required: true,
      placeholder: 'Select completion date',
    },
    {
      id: 'credentialId', label: 'Credential ID', kind: 'text',
      placeholder: 'Enter credential ID',
    },
    {
      id: 'credentialUrl', label: 'Verification URL', kind: 'url',
      placeholder: 'Paste credential verification URL',
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe this certification (optional)',
    },
  ],
  proofs: [
    { id: 'certificate', label: 'Certificate', required: true },
    { id: 'assessmentProof', label: 'Assessment Proof' },
    { id: 'completionEmail', label: 'Completion Email' },
    { id: 'learningScreenshot', label: 'Learning Screenshot' },
    { id: 'projectProof', label: 'Project / Assignment Proof' },
    { id: 'credentialVerification', label: 'Credential Verification' },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 4: RESEARCH & INTELLECTUAL PROPERTY
// ═══════════════════════════════════════════════════════════════

const RESEARCH_TYPES: AchievementTypeDef[] = [
  { id: 'research-paper', label: 'Research Paper', scoring: { basePoints: 18 } },
  { id: 'conference-paper', label: 'Conference Paper', scoring: { basePoints: 16 } },
  { id: 'journal-pub', label: 'Journal Publication', scoring: { basePoints: 22 } },
  { id: 'patent', label: 'Patent', scoring: { basePoints: 30 } },
  { id: 'copyright', label: 'Copyright', scoring: { basePoints: 15 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_RESEARCH: CategoryDef = {
  id: 'research',
  title: 'Research & Intellectual Property',
  description: 'Research papers, publications, patents and copyright.',
  iconName: 'document-text-outline',
  iconFamily: 'Ionicons',
  iconColor: '#0284C7',
  iconBg: '#E0F2FE',
  types: RESEARCH_TYPES,
  fields: [
    // ── Paper / Conference / Journal fields ──
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select research achievement',
      optionsByType: {
        'research-paper': ['Research Paper Submitted', 'Research Paper Accepted', 'Research Paper Published', 'Other'],
        'conference-paper': ['Conference Paper Submitted', 'Conference Paper Accepted', 'Conference Paper Presented', 'Other'],
        'journal-pub': ['Journal Article Submitted', 'Journal Article Accepted', 'Journal Article Published', 'Other'],
        'patent': ['Patent Application Filed', 'Patent Published', 'Patent Granted', 'Other'],
        'copyright': ['Copyright Applied', 'Copyright Registered', 'Other'],
        'other': ['Other'],
      },
      otherLabel: 'Enter Research Achievement',
      otherPlaceholder: 'e.g. Book Chapter Published',
    },
    {
      id: 'researchTitle', label: 'Research / Work Title', kind: 'text', required: true,
      placeholder: 'Enter research paper title',
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
    },
    {
      id: 'pubStatus', label: 'Publication Status', kind: 'dropdown', required: true,
      placeholder: 'Select status',
      options: ['Submitted', 'Accepted', 'Published'],
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
    },
    {
      id: 'pubType', label: 'Publication Type', kind: 'dropdown', required: true,
      placeholder: 'Select type',
      options: ['Conference', 'Journal', 'Other'],
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
      otherLabel: 'Enter Publication Type',
      otherPlaceholder: 'e.g. Book Chapter',
    },
    {
      id: 'journalConference', label: 'Journal / Conference', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select journal or conference',
      options: ['IEEE Access', 'Springer Link', 'Elsevier', 'ACM Digital Library', 'IEEE Conference', 'Springer Conference', 'Other'],
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
      otherLabel: 'Enter Journal / Conference Name',
      otherPlaceholder: 'e.g. International Journal of AI Research',
    },
    {
      id: 'indexing', label: 'Indexing', kind: 'dropdown', required: true,
      placeholder: 'Select indexing',
      options: ['Scopus', 'Web of Science', 'Other', 'Not Indexed'],
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
    },
    {
      id: 'doi', label: 'DOI', kind: 'text',
      placeholder: 'Enter DOI (optional)',
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
    },
    {
      id: 'publicationDate', label: 'Publication Date', kind: 'date', required: true,
      placeholder: 'Select publication date',
      showWhenType: ['research-paper', 'conference-paper', 'journal-pub'],
    },
    // ── Patent fields ──
    {
      id: 'patentTitle', label: 'Patent Title', kind: 'text', required: true,
      placeholder: 'Enter patent title',
      showWhenType: ['patent'],
    },
    {
      id: 'patentStatus', label: 'Patent Status', kind: 'dropdown', required: true,
      placeholder: 'Select patent status',
      options: ['Applied', 'Published', 'Granted'],
      showWhenType: ['patent'],
    },
    {
      id: 'patentType', label: 'Patent Type', kind: 'dropdown', required: true,
      placeholder: 'Select patent type',
      options: ['Student Patent', 'Institutional Patent', 'Joint Patent', 'Other'],
      showWhenType: ['patent'],
      otherLabel: 'Enter Patent Type',
      otherPlaceholder: 'e.g. Design Patent',
    },
    {
      id: 'patentAppNumber', label: 'Application Number', kind: 'text', required: true,
      placeholder: 'Enter application number',
      showWhenType: ['patent'],
    },
    {
      id: 'patentNumber', label: 'Patent Number', kind: 'text',
      placeholder: 'Enter patent number',
      showWhenType: ['patent'],
      showWhen: { fieldId: 'patentStatus', value: ['Published', 'Granted'] },
    },
    {
      id: 'applicationDate', label: 'Application Date', kind: 'date', required: true,
      placeholder: 'Select application date',
      showWhenType: ['patent'],
    },
    // ── Copyright fields ──
    {
      id: 'copyrightTitle', label: 'Copyright Work Title', kind: 'text', required: true,
      placeholder: 'Enter copyright work title',
      showWhenType: ['copyright'],
    },
    {
      id: 'copyrightStatus', label: 'Copyright Status', kind: 'dropdown', required: true,
      placeholder: 'Select status',
      options: ['Applied', 'Registered'],
      showWhenType: ['copyright'],
    },
    {
      id: 'copyrightAppNumber', label: 'Application Number', kind: 'text', required: true,
      placeholder: 'Enter application number',
      showWhenType: ['copyright'],
    },
    {
      id: 'copyrightDate', label: 'Registration / Application Date', kind: 'date', required: true,
      placeholder: 'Select date',
      showWhenType: ['copyright'],
    },
    // ── Other type fields ──
    {
      id: 'otherTitle', label: 'Research / Work Title', kind: 'text', required: true,
      placeholder: 'Enter research or IP title',
      showWhenType: ['other'],
    },
    {
      id: 'otherDate', label: 'Date', kind: 'date', required: true,
      placeholder: 'Select date',
      showWhenType: ['other'],
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your research or IP work (optional)',
    },
  ],
  proofs: [
    // Paper / Journal / Conference
    { id: 'submissionProof', label: 'Submission Proof', showWhenType: ['research-paper', 'conference-paper', 'journal-pub'], showWhenField: { fieldId: 'pubStatus', value: 'Submitted' }, required: true },
    { id: 'acceptanceLetter', label: 'Acceptance Letter', showWhenType: ['research-paper', 'conference-paper', 'journal-pub'], showWhenField: { fieldId: 'pubStatus', value: 'Accepted' }, required: true },
    { id: 'publicationPage', label: 'Publication Page', showWhenType: ['research-paper', 'conference-paper', 'journal-pub'], showWhenField: { fieldId: 'pubStatus', value: 'Published' }, required: true },
    { id: 'journalProof', label: 'Journal / Conference Proof', showWhenType: ['research-paper', 'conference-paper', 'journal-pub'], showWhenField: { fieldId: 'pubStatus', value: 'Published' } },
    { id: 'doiEvidence', label: 'DOI Evidence', showWhenType: ['research-paper', 'conference-paper', 'journal-pub'], showWhenField: { fieldId: 'pubStatus', value: 'Published' } },
    // Patent
    { id: 'patentAppProof', label: 'Patent Application Proof', showWhenType: ['patent'], showWhenField: { fieldId: 'patentStatus', value: 'Applied' }, required: true },
    { id: 'patentPubProof', label: 'Patent Publication Proof', showWhenType: ['patent'], showWhenField: { fieldId: 'patentStatus', value: 'Published' }, required: true },
    { id: 'patentGrantCert', label: 'Patent Grant Certificate', showWhenType: ['patent'], showWhenField: { fieldId: 'patentStatus', value: 'Granted' }, required: true },
    // Copyright
    { id: 'copyrightAppProof', label: 'Copyright Application Proof', showWhenType: ['copyright'], showWhenField: { fieldId: 'copyrightStatus', value: 'Applied' }, required: true },
    { id: 'copyrightRegCert', label: 'Copyright Registration Certificate', showWhenType: ['copyright'], showWhenField: { fieldId: 'copyrightStatus', value: 'Registered' }, required: true },
    // Other
    { id: 'certificate', label: 'Certificate / Proof', showWhenType: ['other'], required: true },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 5: COMPETITIVE EXAMS
// ═══════════════════════════════════════════════════════════════

const EXAM_TYPES: AchievementTypeDef[] = [
  { id: 'participation', label: 'Participation', scoring: { basePoints: 5 } },
  { id: 'qualified', label: 'Qualified', scoring: { basePoints: 12 } },
  { id: 'rank', label: 'Rank', scoring: { basePoints: 20 } },
  { id: 'state-rank', label: 'State Rank', scoring: { basePoints: 20 } },
  { id: 'national-rank', label: 'National Rank', scoring: { basePoints: 25 } },
  { id: 'top-rank', label: 'Top Rank', scoring: { basePoints: 30 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_EXAMS: CategoryDef = {
  id: 'competitive-exams',
  title: 'Competitive Exams',
  description: 'Recognised competitive examinations, qualifications and rankings.',
  iconName: 'school-outline',
  iconFamily: 'Ionicons',
  iconColor: '#DC2626',
  iconBg: '#FEE2E2',
  types: EXAM_TYPES,
  fields: [
    {
      id: 'examName', label: 'Examination', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select examination',
      options: ['GATE', 'CAT', 'UPSC', 'SSC', 'Banking Examination', 'Government Examination', 'Other'],
      otherLabel: 'Enter Examination Name',
      otherPlaceholder: 'e.g. GRE',
    },
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select examination achievement',
      optionsByType: {
        'participation': ['Exam Appeared', 'Exam Participated', 'Other'],
        'qualified': ['Exam Qualified', 'Exam Cleared', 'Other'],
        'rank': ['Rank Achieved', 'Other'],
        'state-rank': ['State Rank Achieved', 'Other'],
        'national-rank': ['National Rank Achieved', 'Other'],
        'top-rank': ['Top Rank Achieved', 'AIR Under 100', 'Other'],
        'other': ['Other'],
      },
      otherLabel: 'Enter Examination Achievement',
      otherPlaceholder: 'e.g. National Rank',
    },
    {
      id: 'examYear', label: 'Exam Year', kind: 'number', required: true,
      placeholder: 'e.g. 2026',
    },
    {
      id: 'attempt', label: 'Attempt', kind: 'dropdown', required: true,
      placeholder: 'Select attempt',
      options: ['First Attempt', 'Second Attempt', 'Third Attempt', 'Other'],
    },
    {
      id: 'resultType', label: 'Result Type', kind: 'dropdown', required: true,
      placeholder: 'Select result type',
      options: ['Participation', 'Qualified', 'Rank', 'State Rank', 'National Rank', 'Top Rank', 'Other'],
    },
    {
      id: 'rank', label: 'Rank', kind: 'number',
      placeholder: 'Enter rank achieved',
      showWhen: { fieldId: 'resultType', value: ['Rank', 'State Rank', 'National Rank', 'Top Rank'] },
    },
    {
      id: 'score', label: 'Score / Percentile', kind: 'number',
      placeholder: 'Enter score or percentile',
    },
    {
      id: 'examDate', label: 'Exam Date', kind: 'date', required: true,
      placeholder: 'Select exam date',
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your exam achievement (optional)',
    },
  ],
  proofs: [
    { id: 'scorecard', label: 'Official Scorecard', required: true },
    { id: 'rankCard', label: 'Rank Card' },
    { id: 'qualCert', label: 'Qualification Certificate' },
    { id: 'officialResult', label: 'Official Result' },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 6: INTERNSHIP & PLACEMENT
// ═══════════════════════════════════════════════════════════════

const INTERNSHIP_TYPES: AchievementTypeDef[] = [
  { id: 'internship', label: 'Internship', scoring: { basePoints: 12 } },
  { id: 'placement', label: 'Placement', scoring: { basePoints: 20 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const COMPANY_OPTIONS = ['TCS', 'Infosys', 'Wipro', 'Zoho', 'Google', 'Microsoft', 'Amazon', 'Flipkart', 'HCL', 'Cognizant', 'Accenture', 'Other'];

const CAT_INTERNSHIP: CategoryDef = {
  id: 'internship-placement',
  title: 'Internship & Placement',
  description: 'Internships, professional selections and placement achievements.',
  iconName: 'briefcase-outline',
  iconFamily: 'Ionicons',
  iconColor: '#EA580C',
  iconBg: '#FFEDD5',
  types: INTERNSHIP_TYPES,
  fields: [
    // ── Internship fields ──
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select achievement',
      optionsByType: {
        'internship': ['Internship Completed', 'Internship with Recommendation', 'Internship with Assessment', 'Other'],
        'placement': ['Full-Time Offer Received', 'Pre-Placement Offer', 'Campus Placement', 'Off-Campus Placement', 'Other'],
        'other': ['Other'],
      },
      otherLabel: 'Enter Achievement',
      otherPlaceholder: 'e.g. Research Fellowship',
    },
    {
      id: 'company', label: 'Company', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select company',
      options: COMPANY_OPTIONS,
      otherLabel: 'Enter Company Name',
      otherPlaceholder: 'e.g. Freshworks',
    },
    // Internship-specific
    {
      id: 'internshipType', label: 'Internship Type', kind: 'dropdown', required: true,
      placeholder: 'Select internship type',
      options: ['Technical', 'Research', 'Product Development', 'Non-Technical', 'Other'],
      showWhenType: ['internship'],
      otherLabel: 'Enter Internship Type',
      otherPlaceholder: 'e.g. Research Internship',
    },
    {
      id: 'internshipMode', label: 'Mode', kind: 'dropdown', required: true,
      placeholder: 'Select mode',
      options: ['On-site', 'Hybrid', 'Remote'],
      showWhenType: ['internship'],
    },
    {
      id: 'duration', label: 'Duration', kind: 'dropdown', required: true,
      placeholder: 'Select duration',
      options: ['Less than 1 Month', '1–3 Months', '3–6 Months', '6+ Months'],
      showWhenType: ['internship'],
    },
    {
      id: 'projectIncluded', label: 'Project Included?', kind: 'dropdown', required: true,
      placeholder: 'Select',
      options: ['Yes', 'No'],
      showWhenType: ['internship'],
    },
    {
      id: 'recommendation', label: 'Recommendation?', kind: 'dropdown', required: true,
      placeholder: 'Select',
      options: ['Yes', 'No'],
      showWhenType: ['internship'],
    },
    {
      id: 'startDate', label: 'Start Date', kind: 'date', required: true,
      placeholder: 'Select start date',
      showWhenType: ['internship'],
    },
    {
      id: 'endDate', label: 'End Date', kind: 'date', required: true,
      placeholder: 'Select end date',
      showWhenType: ['internship'],
    },
    // Placement-specific
    {
      id: 'selectionType', label: 'Selection Type', kind: 'dropdown', required: true,
      placeholder: 'Select type',
      options: ['Internship Offer', 'Full-Time Offer', 'Placement Offer', 'Pre-Placement Offer', 'Other'],
      showWhenType: ['placement'],
      otherLabel: 'Enter Selection Type',
      otherPlaceholder: 'e.g. Research Fellowship',
    },
    {
      id: 'offerMode', label: 'Mode', kind: 'dropdown', required: true,
      placeholder: 'Select mode',
      options: ['On-Campus', 'Off-Campus'],
      showWhenType: ['placement'],
    },
    {
      id: 'selectionDate', label: 'Selection Date', kind: 'date', required: true,
      placeholder: 'Select date',
      showWhenType: ['placement'],
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe (optional)',
    },
  ],
  proofs: [
    // Internship
    { id: 'internshipCert', label: 'Internship Certificate', showWhenType: ['internship'], required: true },
    { id: 'offerLetter', label: 'Offer Letter', showWhenType: ['internship'] },
    { id: 'recommendationLetter', label: 'Recommendation Letter', showWhenType: ['internship'] },
    { id: 'assessment', label: 'Assessment', showWhenType: ['internship'] },
    { id: 'projectProof', label: 'Project Completion Proof', showWhenType: ['internship'] },
    { id: 'companyVerification', label: 'Company Verification', showWhenType: ['internship'] },
    // Placement
    { id: 'placementOffer', label: 'Offer Letter', showWhenType: ['placement'], required: true },
    { id: 'selectionProof', label: 'Selection Proof', showWhenType: ['placement'] },
    { id: 'companyConfirmation', label: 'Official Company Confirmation', showWhenType: ['placement'] },
    // Other
    { id: 'certificate', label: 'Certificate / Proof', showWhenType: ['other'], required: true },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 7: ENTREPRENEURSHIP
// ═══════════════════════════════════════════════════════════════

const ENTREPRENEURSHIP_TYPES: AchievementTypeDef[] = [
  { id: 'startup-idea', label: 'Startup Idea Competition', scoring: { basePoints: 8 } },
  { id: 'startup-finalist', label: 'Startup Competition Finalist', scoring: { basePoints: 12 } },
  { id: 'startup-winner', label: 'Startup Competition Winner', scoring: { basePoints: 18 } },
  { id: 'incubation', label: 'Incubation Program', scoring: { basePoints: 15 } },
  { id: 'startup-reg', label: 'Startup Registration', scoring: { basePoints: 12 } },
  { id: 'mvp-product', label: 'MVP / Product Development', scoring: { basePoints: 18 } },
  { id: 'product-launch', label: 'Product Launch', scoring: { basePoints: 22 } },
  { id: 'startup-funding', label: 'Startup Funding', scoring: { basePoints: 30 } },
  { id: 'recognized-startup', label: 'Recognized Startup Achievement', scoring: { basePoints: 25 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_ENTREPRENEURSHIP: CategoryDef = {
  id: 'entrepreneurship',
  title: 'Entrepreneurship',
  description: 'Startup, innovation, incubation and entrepreneurial achievements.',
  iconName: 'rocket-outline',
  iconFamily: 'Ionicons',
  iconColor: '#9333EA',
  iconBg: '#F3E8FF',
  types: ENTREPRENEURSHIP_TYPES,
  fields: [
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select entrepreneurship achievement',
      optionsByType: {
        'startup-idea': ['Startup Idea Pitched', 'Startup Idea Winner', 'Other'],
        'startup-finalist': ['Startup Competition Finalist', 'Other'],
        'startup-winner': ['Startup Competition Winner', 'Other'],
        'incubation': ['Incubation Program Selected', 'Incubation Program Completed', 'Other'],
        'startup-reg': ['Startup Registered', 'Company Incorporated', 'Other'],
        'mvp-product': ['MVP Developed', 'Product Prototype Completed', 'Other'],
        'product-launch': ['Product Launched', 'Other'],
        'startup-funding': ['Startup Funded', 'Grant Received', 'Other'],
        'recognized-startup': ['Recognized Startup Achievement', 'Other'],
        'other': ['Other'],
      },
      otherLabel: 'Enter Entrepreneurship Achievement',
      otherPlaceholder: 'e.g. Startup Pitch Winner',
    },
    {
      id: 'startupName', label: 'Startup / Project Name', kind: 'text', required: true,
      placeholder: 'Enter startup or project name',
    },
    {
      id: 'programCompetition', label: 'Program / Competition', kind: 'searchable-dropdown',
      placeholder: 'Select program or competition',
      options: ['Startup India Challenge', 'Atal Innovation Mission', 'NIDHI Program', 'IIT Incubation Program', 'University Startup Challenge', 'NASSCOM Startup Conclave', 'TiE Young Entrepreneurs', 'Startup Weekend', 'Other'],
      otherLabel: 'Enter Program Name',
      otherPlaceholder: 'e.g. University Startup Accelerator',
    },
    {
      id: 'organization', label: 'Organization / Incubator', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select organization',
      options: ['Nandha Incubation Centre', 'IIT Madras Incubation', 'IIITM Kerala', 'StartupTN', 'NASSCOM', 'Other'],
      otherLabel: 'Enter Organization Name',
      otherPlaceholder: 'e.g. District Innovation Hub',
    },
    {
      id: 'result', label: 'Result', kind: 'dropdown', required: true,
      placeholder: 'Select result',
      options: ['Participation', 'Finalist', 'Runner-up', 'Winner', 'Selected', 'Incubated', 'Funded'],
    },
    {
      id: 'regStatus', label: 'Registration Status', kind: 'dropdown',
      placeholder: 'Select status (if applicable)',
      options: ['Not Registered', 'Registered', 'Incorporated'],
    },
    {
      id: 'fundingStatus', label: 'Funding Status', kind: 'dropdown',
      placeholder: 'Select funding status',
      options: ['No Funding', 'Grant', 'Pre-seed', 'Seed', 'Other'],
    },
    {
      id: 'eventDate', label: 'Date', kind: 'date', required: true,
      placeholder: 'Select date',
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your entrepreneurship achievement (optional)',
    },
  ],
  proofs: [
    { id: 'competitionCert', label: 'Competition Certificate' },
    { id: 'incubationLetter', label: 'Incubation Selection Letter' },
    { id: 'startupRegProof', label: 'Startup Registration Proof' },
    { id: 'incorporationProof', label: 'Incorporation Proof' },
    { id: 'mvpProof', label: 'MVP / Product Proof' },
    { id: 'fundingConfirmation', label: 'Funding Confirmation' },
    { id: 'awardCert', label: 'Award Certificate' },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 8: LEADERSHIP
// ═══════════════════════════════════════════════════════════════

const LEADERSHIP_TYPES: AchievementTypeDef[] = [
  { id: 'class-rep', label: 'Class Representative', scoring: { basePoints: 5 } },
  { id: 'committee-member', label: 'Student Committee Member', scoring: { basePoints: 6 } },
  { id: 'event-volunteer', label: 'Event Volunteer', scoring: { basePoints: 5 } },
  { id: 'event-coordinator', label: 'Event Coordinator', scoring: { basePoints: 8 } },
  { id: 'club-coordinator', label: 'Club Coordinator', scoring: { basePoints: 10 } },
  { id: 'department-coordinator', label: 'Department Coordinator', scoring: { basePoints: 12 } },
  { id: 'placement-coordinator', label: 'Placement Coordinator', scoring: { basePoints: 14 } },
  { id: 'club-secretary', label: 'Club Secretary', scoring: { basePoints: 14 } },
  { id: 'joint-secretary', label: 'Joint Secretary', scoring: { basePoints: 15 } },
  { id: 'treasurer', label: 'Treasurer', scoring: { basePoints: 14 } },
  { id: 'vice-chairman', label: 'Vice Chairman', scoring: { basePoints: 18 } },
  { id: 'chairman', label: 'Chairman / President', scoring: { basePoints: 20 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_LEADERSHIP: CategoryDef = {
  id: 'leadership',
  title: 'Leadership',
  description: 'Leadership positions, student responsibilities and elected roles.',
  iconName: 'people-outline',
  iconFamily: 'Ionicons',
  iconColor: '#D97706',
  iconBg: '#FEF3C7',
  types: LEADERSHIP_TYPES,
  fields: [
    {
      id: 'achievementTitle', label: 'Leadership Role', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select leadership role',
      optionsByType: titleMap(LEADERSHIP_TYPES),
      otherLabel: 'Enter Leadership Role',
      otherPlaceholder: 'e.g. Technical Club Coordinator',
    },
    {
      id: 'organization', label: 'Organization / Club / Committee', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select organization',
      options: ['IEEE Student Branch', 'Rotaract Club', 'NSS Unit', 'NCC Unit', 'Fine Arts Club', 'Entrepreneurship Cell', 'Coding Club', 'Placement Cell', 'Department Association', 'Student Council', 'Other'],
      otherLabel: 'Enter Organization Name',
      otherPlaceholder: 'e.g. Department Innovation Club',
    },
    {
      id: 'academicYear', label: 'Academic Year', kind: 'dropdown', required: true,
      placeholder: 'Select academic year',
      options: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    {
      id: 'startDate', label: 'Start Date', kind: 'date', required: true,
      placeholder: 'Select start date',
    },
    {
      id: 'endDate', label: 'End Date', kind: 'date', required: true,
      placeholder: 'Select end date',
    },
    {
      id: 'faculty', label: 'Faculty Coordinator', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select faculty coordinator',
      options: ['Dr. Ramesh Kumar', 'Dr. Priya Sharma', 'Prof. Karthik M', 'Dr. Anitha B', 'Prof. Sathish R', 'Other'],
      otherLabel: 'Enter Faculty Name',
      otherPlaceholder: 'e.g. Dr. Vijay Kumar',
    },
    {
      id: 'description', label: 'Responsibility Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Describe your leadership duties (optional)',
    },
  ],
  proofs: [
    { id: 'appointmentLetter', label: 'Appointment Letter' },
    { id: 'electionResult', label: 'Election Result' },
    { id: 'facultyConfirmation', label: 'Faculty Confirmation', required: true },
    { id: 'officialCircular', label: 'Official Circular' },
    { id: 'leadershipCert', label: 'Leadership Certificate' },
    { id: 'responsibilityProof', label: 'Responsibility Proof' },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 9: SOCIAL & CULTURAL
// ═══════════════════════════════════════════════════════════════

const SOCIAL_TYPES: AchievementTypeDef[] = [
  { id: 'cultural', label: 'Cultural Competition', scoring: { basePoints: 10 } },
  { id: 'quiz', label: 'Quiz', scoring: { basePoints: 10 } },
  { id: 'debate', label: 'Debate', scoring: { basePoints: 10 } },
  { id: 'essay', label: 'Essay', scoring: { basePoints: 10 } },
  { id: 'literary', label: 'Literary Competition', scoring: { basePoints: 10 } },
  { id: 'drawing-painting', label: 'Drawing / Painting', scoring: { basePoints: 10 } },
  { id: 'photography', label: 'Photography', scoring: { basePoints: 8 } },
  { id: 'social-service', label: 'Social Service', scoring: { basePoints: 8 } },
  { id: 'nss', label: 'NSS Activity', scoring: { basePoints: 8 } },
  { id: 'ncc', label: 'NCC Activity', scoring: { basePoints: 10 } },
  { id: 'non-technical', label: 'Non-Technical Competition', scoring: { basePoints: 10 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_SOCIAL: CategoryDef = {
  id: 'social-cultural',
  title: 'Social & Cultural',
  description: 'Cultural, social-service and non-technical achievements.',
  iconName: 'color-palette-outline',
  iconFamily: 'Ionicons',
  iconColor: '#DB2777',
  iconBg: '#FCE7F3',
  types: SOCIAL_TYPES,
  fields: [
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select achievement',
      optionsByType: compTitleMap(SOCIAL_TYPES),
      otherLabel: 'Enter Activity Name',
      otherPlaceholder: 'e.g. Photography Exhibition',
    },
    {
      id: 'eventCompetition', label: 'Event / Competition', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select event / competition',
      options: ['Inter-College Cultural Fest', 'University Cultural Day', 'District Cultural Festival', 'State Level Arts Festival', 'NSS Camp', 'NCC Camp', 'Blood Donation Drive', 'Social Awareness Campaign', 'Republic Day Celebration', 'Independence Day Program', 'Other'],
      otherLabel: 'Enter Event Name',
      otherPlaceholder: 'e.g. District Cultural Festival',
    },
    {
      id: 'organizer', label: 'Organizer', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select organizer',
      options: CULTURAL_ORGANIZER_OPTIONS,
      otherLabel: 'Enter Organizer Name',
      otherPlaceholder: 'e.g. District Arts Council',
    },
    {
      id: 'level', label: 'Level', kind: 'dropdown', required: true,
      placeholder: 'Select level',
      options: ['College', 'Regional', 'State', 'National', 'International', 'Premier'],
    },
    {
      id: 'result', label: 'Result', kind: 'dropdown', required: true,
      placeholder: 'Select result',
      options: ['Participation', 'Finalist', 'Third Place', 'Runner-up', 'Winner'],
    },
    {
      id: 'eventMode', label: 'Event Mode', kind: 'dropdown', required: true,
      placeholder: 'Select mode',
      options: ['Offline', 'Online'],
    },
    {
      id: 'eventDate', label: 'Event Date', kind: 'date', required: true,
      placeholder: 'Select date',
    },
    {
      id: 'location', label: 'Location', kind: 'text', required: true,
      placeholder: 'Enter venue location',
      showWhen: { fieldId: 'eventMode', value: 'Offline' },
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your cultural or social achievement (optional)',
    },
  ],
  proofs: [
    { id: 'certificate', label: 'Achievement Certificate', required: true },
    { id: 'resultSheet', label: 'Result Sheet' },
    { id: 'eventPhoto', label: 'Event Photograph' },
    { id: 'organizerConfirmation', label: 'Organizer Confirmation' },
    { id: 'geotagPhoto', label: 'Geotagged Photograph', showWhenField: { fieldId: 'eventMode', value: 'Offline' } },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY 10: MEMBERSHIP & PROFESSIONAL ACTIVITIES
// ═══════════════════════════════════════════════════════════════

const MEMBERSHIP_TYPES: AchievementTypeDef[] = [
  { id: 'club-membership', label: 'Recognized Club Membership', scoring: { basePoints: 4 } },
  { id: 'society-membership', label: 'Professional Society Membership', scoring: { basePoints: 6 } },
  { id: 'chapter-membership', label: 'Student Chapter Membership', scoring: { basePoints: 6 } },
  { id: 'society-activity', label: 'Professional Society Activity', scoring: { basePoints: 10 } },
  { id: 'chapter-activity', label: 'Student Chapter Activity', scoring: { basePoints: 10 } },
  { id: 'active-contribution', label: 'Active Club Contribution', scoring: { basePoints: 8 } },
  { id: 'club-responsibility', label: 'Club Responsibility', scoring: { basePoints: 12 } },
  { id: 'org-leadership', label: 'Professional Organization Leadership', scoring: { basePoints: 16 } },
  { id: 'major-recognition', label: 'Major Professional Recognition', scoring: { basePoints: 22 } },
  { id: 'other', label: 'Other', scoring: { basePoints: 10 } },
];

const CAT_MEMBERSHIP: CategoryDef = {
  id: 'membership',
  title: 'Membership & Professional Activities',
  description: 'Professional societies, clubs and student organizations.',
  iconName: 'id-card-outline',
  iconFamily: 'Ionicons',
  iconColor: '#0891B2',
  iconBg: '#CFFAFE',
  types: MEMBERSHIP_TYPES,
  fields: [
    {
      id: 'achievementTitle', label: 'Achievement Title', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select achievement',
      optionsByType: titleMap(MEMBERSHIP_TYPES),
      otherLabel: 'Enter Membership Achievement',
      otherPlaceholder: 'e.g. Professional Student Member',
    },
    {
      id: 'organization', label: 'Organization', kind: 'searchable-dropdown', required: true,
      placeholder: 'Select organization',
      options: ['IEEE', 'ACM', 'CSI', 'ISTE', 'IEI', 'SAE India', 'Other'],
      otherLabel: 'Enter Organization Name',
      otherPlaceholder: 'e.g. Student Innovation Society',
    },
    {
      id: 'membershipType', label: 'Membership Type', kind: 'dropdown', required: true,
      placeholder: 'Select membership type',
      options: ['Member', 'Student Member', 'Volunteer', 'Coordinator', 'Office Bearer', 'Leadership', 'Other'],
      otherLabel: 'Enter Membership Type',
      otherPlaceholder: 'e.g. Professional Student Member',
    },
    {
      id: 'startDate', label: 'Start Date', kind: 'date', required: true,
      placeholder: 'Select start date',
    },
    {
      id: 'endDate', label: 'End Date', kind: 'date',
      placeholder: 'Select end date',
    },
    {
      id: 'description', label: 'Description', kind: 'textarea', maxLength: 300,
      placeholder: 'Briefly describe your membership activities (optional)',
    },
  ],
  proofs: [
    { id: 'membershipCert', label: 'Membership Certificate' },
    { id: 'membershipCard', label: 'Membership Card' },
    { id: 'officialConfirmation', label: 'Official Membership Confirmation' },
    { id: 'eventCert', label: 'Event Certificate' },
    { id: 'appointmentLetter', label: 'Appointment Letter' },
    { id: 'orgConfirmation', label: 'Organization Confirmation' },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORIES ARRAY
// ═══════════════════════════════════════════════════════════════

export const CATEGORIES: CategoryDef[] = [
  CAT_TECHNICAL,
  CAT_SPORTS,
  CAT_CERTIFICATIONS,
  CAT_RESEARCH,
  CAT_EXAMS,
  CAT_INTERNSHIP,
  CAT_ENTREPRENEURSHIP,
  CAT_LEADERSHIP,
  CAT_SOCIAL,
  CAT_MEMBERSHIP,
];

// ═══════════════════════════════════════════════════════════════
//  GETTER HELPERS
// ═══════════════════════════════════════════════════════════════

export function getCategoryById(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getTypeById(categoryId: string, typeId: string): AchievementTypeDef | undefined {
  const cat = getCategoryById(categoryId);
  return cat?.types.find((t) => t.id === typeId);
}

export const SEMESTER_OPTIONS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
] as const;

export const SEMESTER_FIELD: FieldDef = {
  id: 'semester',
  label: 'Semester',
  kind: 'dropdown',
  required: true,
  placeholder: 'Select semester',
  options: [...SEMESTER_OPTIONS],
};

/**
 * Returns fields for the given category+type.
 * Filters by showWhenType — omitting fields that don't apply to the current type.
 * Ensures the required Semester field is placed directly after the date field.
 */
export function getFieldsForType(categoryId: string, typeId: string): FieldDef[] {
  const cat = getCategoryById(categoryId);
  if (!cat) return [];
  const baseFields = cat.fields.filter((f) => {
    if (f.showWhenType && f.showWhenType.length > 0 && !f.showWhenType.includes(typeId)) {
      return false;
    }
    return true;
  });

  // If semester is already explicitly in baseFields, return as is
  if (baseFields.some((f) => f.id === 'semester')) {
    return baseFields;
  }

  // Insert Semester right after the first date field
  const dateIdx = baseFields.findIndex((f) => f.kind === 'date');
  if (dateIdx !== -1) {
    const newFields = [...baseFields];
    newFields.splice(dateIdx + 1, 0, SEMESTER_FIELD);
    return newFields;
  }

  // Fallback: append after third field or at end
  const insertPos = Math.min(3, baseFields.length);
  const newFields = [...baseFields];
  newFields.splice(insertPos, 0, SEMESTER_FIELD);
  return newFields;
}

/**
 * Returns proof requirements for the given category+type+formData.
 * Filters by showWhenType and showWhenField conditions.
 */
export function getProofRequirements(
  categoryId: string,
  typeId?: string,
  formData?: Record<string, any>,
): ProofDef[] {
  const cat = getCategoryById(categoryId);
  if (!cat) return [{ id: 'certificate', label: 'Certificate / Proof', required: true }];
  return cat.proofs.filter((p) => {
    if (typeId && p.showWhenType && p.showWhenType.length > 0 && !p.showWhenType.includes(typeId)) {
      return false;
    }
    if (formData && p.showWhenField) {
      const val = formData[p.showWhenField.fieldId];
      const matchValues = Array.isArray(p.showWhenField.value)
        ? p.showWhenField.value
        : [p.showWhenField.value];
      if (!matchValues.includes(val)) return false;
    }
    return true;
  });
}
