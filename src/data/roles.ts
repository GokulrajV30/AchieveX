// ─────────────────────────────────────────────────────────────
// AchieveX — Role Configurations & Metadata
// ─────────────────────────────────────────────────────────────

export type PrimaryRoleId = 'student' | 'faculty' | 'hod' | 'head' | 'dean' | 'principal';

export type AdditionalResponsibility = 'Faculty' | 'HOD' | 'Tutor' | 'Proctor' | 'Mentor';

export type HeadType =
  | 'achievement'
  | 'sports'
  | 'research_ipr'
  | 'placement_training'
  | 'entrepreneurship_innovation'
  | 'nss_social'
  | 'cultural'
  | 'other';

export interface HeadTypeOption {
  label: string;
  value: HeadType;
  subtitle?: string;
}

export const HEAD_TYPE_OPTIONS: HeadTypeOption[] = [
  { label: 'Achievement Head', value: 'achievement', subtitle: 'Institutional student & faculty achievements' },
  { label: 'Sports Head', value: 'sports', subtitle: 'Athletics, games, and sports events' },
  { label: 'Research & IPR Head', value: 'research_ipr', subtitle: 'Publications, patents, grants & IPR' },
  { label: 'Placement & Training Head', value: 'placement_training', subtitle: 'Campus recruitment and training' },
  { label: 'Entrepreneurship / Innovation Head', value: 'entrepreneurship_innovation', subtitle: 'Startups, incubation & IIC' },
  { label: 'NSS / Social Activities Head', value: 'nss_social', subtitle: 'NSS, community service & outreach' },
  { label: 'Cultural Activities Head', value: 'cultural', subtitle: 'Arts, literary, and cultural events' },
  { label: 'Other', value: 'other', subtitle: 'Custom institutional head responsibility' },
];

export interface RoleConfig {
  id: PrimaryRoleId;
  title: string;
  subtitle: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  iconBg: string;
  iconColor: string;
  idLabel: 'Register Number' | 'Employee ID';
  idField: 'registerNumber' | 'employeeId';
  showDepartment: boolean;
  showAcademicBatch: boolean;
  showResponsibilities: boolean;
  availableResponsibilities: AdditionalResponsibility[];
}

export const ROLE_CONFIGS: Record<PrimaryRoleId, RoleConfig> = {
  student: {
    id: 'student',
    title: 'Student',
    subtitle: 'Create your student account',
    iconName: 'school',
    iconFamily: 'Ionicons',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    idLabel: 'Register Number',
    idField: 'registerNumber',
    showDepartment: true,
    showAcademicBatch: true,
    showResponsibilities: false,
    availableResponsibilities: [],
  },
  faculty: {
    id: 'faculty',
    title: 'Faculty',
    subtitle: 'Create your faculty account',
    iconName: 'human-male-board',
    iconFamily: 'MaterialCommunityIcons',
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    idLabel: 'Employee ID',
    idField: 'employeeId',
    showDepartment: true,
    showAcademicBatch: false,
    showResponsibilities: true,
    availableResponsibilities: ['Tutor', 'Proctor', 'Mentor'],
  },
  hod: {
    id: 'hod',
    title: 'HOD',
    subtitle: 'Create your HOD account',
    iconName: 'office-building',
    iconFamily: 'MaterialCommunityIcons',
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    idLabel: 'Employee ID',
    idField: 'employeeId',
    showDepartment: true,
    showAcademicBatch: false,
    showResponsibilities: true,
    availableResponsibilities: ['Faculty', 'Tutor', 'Proctor', 'Mentor'],
  },
  head: {
    id: 'head',
    title: 'Head',
    subtitle: 'Create your Head account',
    iconName: 'account-tie',
    iconFamily: 'MaterialCommunityIcons',
    iconBg: '#FAF5FF',
    iconColor: '#7C3AED',
    idLabel: 'Employee ID',
    idField: 'employeeId',
    showDepartment: true,
    showAcademicBatch: false,
    showResponsibilities: true,
    availableResponsibilities: ['Faculty', 'HOD', 'Tutor', 'Proctor', 'Mentor'],
  },
  dean: {
    id: 'dean',
    title: 'Dean',
    subtitle: 'Create your Dean account',
    iconName: 'domain',
    iconFamily: 'MaterialCommunityIcons',
    iconBg: '#F0FDFA',
    iconColor: '#0D9488',
    idLabel: 'Employee ID',
    idField: 'employeeId',
    showDepartment: false,
    showAcademicBatch: false,
    showResponsibilities: true,
    availableResponsibilities: ['Faculty', 'HOD', 'Tutor', 'Proctor', 'Mentor'],
  },
  principal: {
    id: 'principal',
    title: 'Principal',
    subtitle: 'Create your principal account',
    iconName: 'crown',
    iconFamily: 'MaterialCommunityIcons',
    iconBg: '#FEFCE8',
    iconColor: '#D97706',
    idLabel: 'Employee ID',
    idField: 'employeeId',
    showDepartment: false,
    showAcademicBatch: false,
    showResponsibilities: false,
    availableResponsibilities: [],
  },
};

export const ROLES_LIST: RoleConfig[] = [
  ROLE_CONFIGS.student,
  ROLE_CONFIGS.faculty,
  ROLE_CONFIGS.hod,
  ROLE_CONFIGS.head,
  ROLE_CONFIGS.dean,
  ROLE_CONFIGS.principal,
];
