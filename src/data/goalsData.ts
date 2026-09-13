// ─────────────────────────────────────────────────────────────
// AchieveX — Goals Data Model & Mock Dataset
// Structured for Student Achievement Goals & Milestone Tracking
// ─────────────────────────────────────────────────────────────

export interface MilestoneProof {
  uri: string;
  fileName: string;
  fileSize?: string;
  mimeType?: string;
  uploadedAt: string;
}

export interface Milestone {
  id: string;
  label: string;
  targetDate?: string;
  completed: boolean;
  completedAt?: string;
  proof?: MilestoneProof;
  linkedAchievementId?: string;
}

export interface RelatedAchievement {
  title: string;
  points: number;
  status: 'Verified' | 'Pending';
  verifiedAgo: string;
}

export type GoalPriority = 'High' | 'Medium' | 'Low';

export type GoalLifecycleStatus = 'Active' | 'Completed' | 'Paused';

export interface Goal {
  id: string;
  categoryId: string;
  categoryTitle: string;
  goalTypeId: string;
  goalTypeTitle: string;
  title: string;
  description?: string;
  targetOutcome: string;
  targetDate: string; // YYYY-MM-DD
  priority: GoalPriority;
  purpose?: string;
  motivationNote?: string;
  academicYear: string;
  milestones: Milestone[];
  progress: number; // 0 to 100
  status: GoalLifecycleStatus;
  relatedAchievements?: RelatedAchievement[];
  createdAt: string;
  completedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// Category Goal Templates & Target Outcomes
// ─────────────────────────────────────────────────────────────

export interface CategoryGoalConfig {
  categoryId: string;
  categoryTitle: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  goalTypes: {
    id: string;
    title: string;
    targetOutcomes: string[];
  }[];
}

export const CATEGORY_GOAL_CONFIGS: CategoryGoalConfig[] = [
  {
    categoryId: 'tech',
    categoryTitle: 'Technical & Professional',
    iconName: 'code-slash-outline',
    iconFamily: 'Ionicons',
    goalTypes: [
      {
        id: 'hackathon',
        title: 'Win Hackathon',
        targetOutcomes: ['Participate', 'Finalist', 'Runner-up', 'Winner'],
      },
      {
        id: 'tech_comp',
        title: 'Technical Competition',
        targetOutcomes: ['Participate', 'Finalist', 'Winner'],
      },
      {
        id: 'project_expo',
        title: 'Project Presentation',
        targetOutcomes: ['Participate', 'Best Project Award', 'Winner'],
      },
      {
        id: 'tech_symposium',
        title: 'Paper Presentation',
        targetOutcomes: ['Participate', 'Best Paper Award', 'Winner'],
      },
    ],
  },
  {
    categoryId: 'research',
    categoryTitle: 'Research & Intellectual Property',
    iconName: 'newspaper-outline',
    iconFamily: 'Ionicons',
    goalTypes: [
      {
        id: 'research_paper',
        title: 'Publish Research Paper',
        targetOutcomes: ['Submitted', 'Accepted', 'Published'],
      },
      {
        id: 'patent',
        title: 'Patent Filing',
        targetOutcomes: ['Applied', 'Published', 'Granted'],
      },
      {
        id: 'conference_paper',
        title: 'Conference Publication',
        targetOutcomes: ['Submitted', 'Accepted', 'Presented'],
      },
      {
        id: 'copyright',
        title: 'Software Copyright',
        targetOutcomes: ['Applied', 'Registered', 'Granted'],
      },
    ],
  },
  {
    categoryId: 'cert',
    categoryTitle: 'Certifications & Online Learning',
    iconName: 'school-outline',
    iconFamily: 'Ionicons',
    goalTypes: [
      {
        id: 'cloud_cert',
        title: 'Cloud Certification',
        targetOutcomes: ['Enrolled', 'Completed', 'Certified'],
      },
      {
        id: 'nptel_course',
        title: 'NPTEL Elite Course',
        targetOutcomes: ['Enrolled', 'Completed', 'Elite / Gold Certified'],
      },
      {
        id: 'global_cert',
        title: 'Industry Professional Cert',
        targetOutcomes: ['Enrolled', 'Completed', 'Certified'],
      },
    ],
  },
  {
    categoryId: 'leadership',
    categoryTitle: 'Leadership & Student Responsibility',
    iconName: 'people-outline',
    iconFamily: 'Ionicons',
    goalTypes: [
      {
        id: 'event_lead',
        title: 'Lead Student Event',
        targetOutcomes: ['Coordinator', 'Lead Organizer', 'President'],
      },
      {
        id: 'club_lead',
        title: 'Club Office Bearer',
        targetOutcomes: ['Executive Member', 'Secretary', 'Lead'],
      },
      {
        id: 'class_rep',
        title: 'Class Representative',
        targetOutcomes: ['Appointed', 'Elected'],
      },
    ],
  },
  {
    categoryId: 'sports',
    categoryTitle: 'Sports & Games',
    iconName: 'trophy-outline',
    iconFamily: 'Ionicons',
    goalTypes: [
      {
        id: 'zonal_sports',
        title: 'Zone Sports Championship',
        targetOutcomes: ['Participate', 'Runner-up', 'Winner / Gold'],
      },
      {
        id: 'inter_collegiate',
        title: 'Inter-Collegiate Tournament',
        targetOutcomes: ['Participate', 'Podium / Medaled', 'Winner'],
      },
      {
        id: 'intramural',
        title: 'Intramural Sports',
        targetOutcomes: ['Participate', 'Runner-up', 'Winner'],
      },
    ],
  },
  {
    categoryId: 'entrepreneurship',
    categoryTitle: 'Entrepreneurship & Startup',
    iconName: 'rocket-outline',
    iconFamily: 'Ionicons',
    goalTypes: [
      {
        id: 'startup_pitch',
        title: 'Startup Pitch Competition',
        targetOutcomes: ['Submitted', 'Selected', 'Incubated', 'Funded'],
      },
      {
        id: 'prototype_dev',
        title: 'Product Prototype Grant',
        targetOutcomes: ['Applied', 'Prototype Ready', 'Grant Awarded'],
      },
    ],
  },
];

export const GOAL_PURPOSES = [
  'Career',
  'Higher Studies',
  'Placement',
  'Skill Development',
  'Competition',
  'Personal Development',
];

// ─────────────────────────────────────────────────────────────
// Initial Mock Goals Dataset
// ─────────────────────────────────────────────────────────────

export const INITIAL_GOALS: Goal[] = [
  // ── Active Goal 1: Publish Research Paper ──
  {
    id: 'g1',
    categoryId: 'research',
    categoryTitle: 'Research & Intellectual Property',
    goalTypeId: 'research_paper',
    goalTypeTitle: 'Publish Research Paper',
    title: 'Publish a Research Paper',
    description: 'Publish a research manuscript on IoT-Edge computing in a peer-reviewed IEEE or Scopus journal.',
    targetOutcome: 'Published',
    targetDate: '2026-12-15',
    priority: 'High',
    purpose: 'Higher Studies',
    motivationNote: 'Key requirement for master admissions and academic standing.',
    academicYear: '2026–27',
    progress: 72,
    status: 'Active',
    createdAt: '2026-08-01',
    milestones: [
      { id: 'm1_1', label: 'Select research topic & hypothesis', completed: true, completedAt: '2026-08-02' },
      { id: 'm1_2', label: 'Literature review & dataset setup', completed: true, completedAt: '2026-08-08' },
      { id: 'm1_3', label: 'Complete research experiments', completed: true, completedAt: '2026-08-18' },
      { id: 'm1_4', label: 'Prepare manuscript draft', completed: true, completedAt: '2026-08-20' },
      { id: 'm1_5', label: 'Submission to IEEE journal', targetDate: '2026-10-15', completed: false },
      { id: 'm1_6', label: 'Journal publication & index verification', targetDate: '2026-12-15', completed: false },
    ],
    relatedAchievements: [
      { title: 'Conference Presentation in Symposium', points: 20, status: 'Verified', verifiedAgo: '1 week ago' },
    ],
  },

  // ── Active Goal 2: Win Hackathon ──
  {
    id: 'g2',
    categoryId: 'tech',
    categoryTitle: 'Technical & Professional',
    goalTypeId: 'hackathon',
    goalTypeTitle: 'Win Hackathon',
    title: 'Win Smart India Hackathon',
    description: 'Win a podium placement in the Grand Finale of SIH 2026 Hardware / Software edition.',
    targetOutcome: 'Winner',
    targetDate: '2026-09-20',
    priority: 'High',
    purpose: 'Placement',
    motivationNote: 'Showcase hands-on engineering skills to top tier recruiters.',
    academicYear: '2026–27',
    progress: 75,
    status: 'Active',
    createdAt: '2026-08-10',
    milestones: [
      { id: 'm2_1', label: 'Form 6-member team and pick problem statement', completed: true, completedAt: '2026-08-12' },
      { id: 'm2_2', label: 'Internal college round qualification', completed: true, completedAt: '2026-08-16' },
      { id: 'm2_3', label: 'Develop working functional prototype', completed: true, completedAt: '2026-08-24' },
      { id: 'm2_4', label: 'Final pitch & jury evaluation', targetDate: '2026-09-20', completed: false },
    ],
  },

  // ── Active Goal 3: Complete Professional Cloud Cert ──
  {
    id: 'g3',
    categoryId: 'cert',
    categoryTitle: 'Certifications & Online Learning',
    goalTypeId: 'cloud_cert',
    goalTypeTitle: 'Cloud Certification',
    title: 'AWS Solutions Architect Associate',
    description: 'Prepare and pass AWS Certified Solutions Architect Associate exam.',
    targetOutcome: 'Certified',
    targetDate: '2026-11-30',
    priority: 'Medium',
    purpose: 'Skill Development',
    academicYear: '2026–27',
    progress: 40,
    status: 'Active',
    createdAt: '2026-08-05',
    milestones: [
      { id: 'm3_1', label: 'Complete 30-hour course curriculum', completed: true, completedAt: '2026-08-22' },
      { id: 'm3_2', label: 'Build 3 cloud hands-on lab projects', completed: true, completedAt: '2026-08-28' },
      { id: 'm3_3', label: 'Pass 5 practice mock exams with >85%', targetDate: '2026-10-30', completed: false },
      { id: 'm3_4', label: 'Schedule and clear certification test', targetDate: '2026-11-30', completed: false },
    ],
  },

  // ── Active Goal 4: Lead Student Event ──
  {
    id: 'g4',
    categoryId: 'leadership',
    categoryTitle: 'Leadership & Student Responsibility',
    goalTypeId: 'event_lead',
    goalTypeTitle: 'Lead Student Event',
    title: 'Lead National Tech Symposium',
    description: 'Act as Chief Student Coordinator for the Annual Technical Symposium 2026.',
    targetOutcome: 'Lead Organizer',
    targetDate: '2026-10-10',
    priority: 'Medium',
    purpose: 'Personal Development',
    academicYear: '2026–27',
    progress: 66,
    status: 'Active',
    createdAt: '2026-07-20',
    milestones: [
      { id: 'm4_1', label: 'Brochure & budget approval', completed: true, completedAt: '2026-07-22' },
      { id: 'm4_2', label: 'Coordinate marketing & sponsorship', completed: true, completedAt: '2026-08-10' },
      { id: 'm4_3', label: 'Host actual event and submit summary', targetDate: '2026-10-10', completed: false },
    ],
  },

  // ── Completed Goals (7) ──
  {
    id: 'g5',
    categoryId: 'tech',
    categoryTitle: 'Technical & Professional',
    goalTypeId: 'tech_comp',
    goalTypeTitle: 'Technical Competition',
    title: 'Regional Hackathon Winner',
    description: 'Win a podium spot at the Inter-College Hackathon at Erode.',
    targetOutcome: 'Winner',
    targetDate: '2026-08-15',
    priority: 'High',
    purpose: 'Skill Development',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-07-15',
    completedAt: '2026-08-12',
    milestones: [
      { id: 'm5_1', label: 'Submit proposal', completed: true, completedAt: '2026-07-20' },
      { id: 'm5_2', label: 'Build MVP', completed: true, completedAt: '2026-08-01' },
      { id: 'm5_3', label: 'Grand finale demo', completed: true, completedAt: '2026-08-12' },
    ],
  },
  {
    id: 'g6',
    categoryId: 'cert',
    categoryTitle: 'Certifications & Online Learning',
    goalTypeId: 'cloud_cert',
    goalTypeTitle: 'Cloud Certification',
    title: 'Google Cloud Digital Leader',
    description: 'Earn the Google Cloud Certified Digital Leader certification.',
    targetOutcome: 'Certified',
    targetDate: '2026-07-30',
    priority: 'Medium',
    purpose: 'Career',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-06-10',
    completedAt: '2026-07-28',
    milestones: [
      { id: 'm6_1', label: 'Complete lectures', completed: true, completedAt: '2026-07-10' },
      { id: 'm6_2', label: 'Pass examination', completed: true, completedAt: '2026-07-28' },
    ],
  },
  {
    id: 'g7',
    categoryId: 'leadership',
    categoryTitle: 'Leadership & Student Responsibility',
    goalTypeId: 'class_rep',
    goalTypeTitle: 'Class Representative',
    title: 'Class Representative Tenure',
    description: 'Serve as the official student representative for CSE (IoT), 3rd Year.',
    targetOutcome: 'Appointed',
    targetDate: '2026-07-15',
    priority: 'Low',
    purpose: 'Personal Development',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-06-15',
    completedAt: '2026-07-10',
    milestones: [],
  },
  {
    id: 'g8',
    categoryId: 'sports',
    categoryTitle: 'Sports & Games',
    goalTypeId: 'zonal_sports',
    goalTypeTitle: 'Zone Sports Championship',
    title: 'Anna University Zone Basketball',
    description: 'Represent college in Anna University Zone 12 Basketball tournament.',
    targetOutcome: 'Winner / Gold',
    targetDate: '2026-06-25',
    priority: 'Medium',
    purpose: 'Competition',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-05-10',
    completedAt: '2026-06-24',
    milestones: [],
  },
  {
    id: 'g9',
    categoryId: 'tech',
    categoryTitle: 'Technical & Professional',
    goalTypeId: 'tech_symposium',
    goalTypeTitle: 'Paper Presentation',
    title: 'Symposium Technical Paper',
    description: 'Present paper on edge computing at National Technical Symposium.',
    targetOutcome: 'Best Paper Award',
    targetDate: '2026-05-20',
    priority: 'Medium',
    purpose: 'Skill Development',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-04-10',
    completedAt: '2026-05-18',
    milestones: [],
  },
  {
    id: 'g10',
    categoryId: 'cert',
    categoryTitle: 'Certifications & Online Learning',
    goalTypeId: 'nptel_course',
    goalTypeTitle: 'NPTEL Elite Course',
    title: 'NPTEL Cloud Computing Course',
    description: 'Complete 12-week NPTEL course with Elite Gold score.',
    targetOutcome: 'Elite / Gold Certified',
    targetDate: '2026-04-30',
    priority: 'High',
    purpose: 'Higher Studies',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-01-15',
    completedAt: '2026-04-28',
    milestones: [],
  },
  {
    id: 'g11',
    categoryId: 'research',
    categoryTitle: 'Research & Intellectual Property',
    goalTypeId: 'conference_paper',
    goalTypeTitle: 'Conference Publication',
    title: 'IEEE Conference Presentation',
    description: 'Present research paper at IEEE International Conference.',
    targetOutcome: 'Presented',
    targetDate: '2026-03-25',
    priority: 'High',
    purpose: 'Higher Studies',
    academicYear: '2026–27',
    progress: 100,
    status: 'Completed',
    createdAt: '2026-01-05',
    completedAt: '2026-03-24',
    milestones: [],
  },

  // ── Paused Goal ──
  {
    id: 'g12',
    categoryId: 'entrepreneurship',
    categoryTitle: 'Entrepreneurship & Startup',
    goalTypeId: 'startup_pitch',
    goalTypeTitle: 'Startup Pitch Competition',
    title: 'Smart Campus Startup Pitch',
    description: 'Pitch autonomous campus energy management system to state incubation committee.',
    targetOutcome: 'Incubated',
    targetDate: '2026-11-15',
    priority: 'Medium',
    purpose: 'Career',
    academicYear: '2026–27',
    progress: 30,
    status: 'Paused',
    createdAt: '2026-07-01',
    milestones: [
      { id: 'm12_1', label: 'Prepare business plan & pitch deck', completed: true, completedAt: '2026-07-20' },
      { id: 'm12_2', label: 'Build pilot hardware demonstration', completed: false },
    ],
  },
];

// Helper: Calculate days left / deadline string
export function getDeadlineInfo(deadlineDateStr: string, isCompleted: boolean = false, completedAt?: string): {
  text: string;
  urgency: 'comfortable' | 'approaching' | 'overdue' | 'completed';
} {
  if (isCompleted) {
    return {
      text: completedAt ? `Completed ${completedAt}` : 'Completed',
      urgency: 'completed',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(deadlineDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: overdueDays === 1 ? '1 day overdue' : `${overdueDays} days overdue`,
      urgency: 'overdue',
    };
  }
  if (diffDays === 0) {
    return {
      text: 'Due today',
      urgency: 'approaching',
    };
  }
  if (diffDays === 1) {
    return {
      text: 'Due tomorrow',
      urgency: 'approaching',
    };
  }
  if (diffDays <= 7) {
    return {
      text: `${diffDays} days left`,
      urgency: 'approaching',
    };
  }
  return {
    text: `${diffDays} days left`,
    urgency: 'comfortable',
  };
}
