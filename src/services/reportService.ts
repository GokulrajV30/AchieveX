// ─────────────────────────────────────────────────────────────
// AchieveX — Accreditation & Institutional Report Service
// Final Redesign: Accreditation + Management Reporting System
// Concise quantitative summaries for NAAC, NBA, Annual,
// Department, Category, and Custom reports.
// Generates formal, print-standard summary PDFs via expo-print
// ─────────────────────────────────────────────────────────────

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { CollegeAchievementRecord } from '../data/headWorkspaceData';

// ── TYPES & INTERFACES ────────────────────────────────────────

export type NAACPeriodPreset = 'last5' | 'last3' | 'current' | 'custom';

export interface NAACFilterState {
  periodPreset: NAACPeriodPreset;
  fromAcademicYear: string;
  toAcademicYear: string;
  scope: 'all_categories' | 'category';
  categoryId: string; // 'ALL' or specific ID
  categoryTitle?: string;
}

export interface NBAFilterState {
  academicYear: string; // e.g. '2026–27'
  scope: 'all_programs' | 'program';
  program: string; // e.g. 'CSE (IoT)' or 'ALL'
}

export interface AnnualFilterState {
  academicYear: string;
  stakeholderScope: 'all' | 'students' | 'faculty';
}

export interface DepartmentFilterState {
  department: string;
  academicYear: string;
}

export interface CategoryFilterState {
  categoryId: string;
  categoryTitle: string;
  periodPreset: NAACPeriodPreset;
  fromAcademicYear: string;
  toAcademicYear: string;
}

export interface CustomFilterState {
  fromAcademicYear: string;
  toAcademicYear: string;
  department: string;
  studentYear: string;
  semester: string;
  categoryId: string;
  level: string;
  status: string;
  userType: 'student' | 'faculty' | 'ALL';
}

// Summary Row Breakdowns
export interface YearBreakdownRow {
  academicYear: string;
  studentsCount: number;
  achievementsCount: number;
  awardsCount: number;
  points: number;
}

export interface CategoryBreakdownRow {
  categoryId: string;
  categoryTitle: string;
  studentsCount: number;
  achievementsCount: number;
  awardsCount: number;
  points: number;
  percentage: number;
}

export interface LevelBreakdownRow {
  level: string;
  achievementsCount: number;
  awardsCount: number;
  points: number;
}

export interface OutcomeBreakdownRow {
  result: string;
  count: number;
  isAward: boolean;
}

export interface ProgramBreakdownRow {
  program: string;
  studentsCount: number;
  achievementsCount: number;
  awardsCount: number;
  nationalCount: number;
  internationalCount: number;
  points: number;
}

// High-level Report Models (Pure Summaries)
export interface NAACReportData {
  institutionName: string;
  reportingPeriodText: string;
  scope: 'all_categories' | 'category';
  selectedCategoryTitle?: string;
  uniqueStudentsCount: number;
  verifiedAchievementsCount: number;
  awardsCount: number;
  totalPoints: number;
  yearBreakdowns: YearBreakdownRow[];
  categorySummaries: CategoryBreakdownRow[];
  levelSummaries: LevelBreakdownRow[];
  outcomeSummaries: OutcomeBreakdownRow[];
  records: CollegeAchievementRecord[];
  generatedAt: string;
}

export interface NBAReportData {
  institutionName: string;
  academicYear: string;
  scope: 'all_programs' | 'program';
  selectedProgram?: string;
  programsIncludedCount: number;
  uniqueStudentsCount: number;
  verifiedAchievementsCount: number;
  awardsCount: number;
  totalPoints: number;
  programSummaries: ProgramBreakdownRow[];
  categorySummaries: CategoryBreakdownRow[];
  levelSummaries: LevelBreakdownRow[];
  outcomeSummaries: OutcomeBreakdownRow[];
  records: CollegeAchievementRecord[];
  generatedAt: string;
}

export interface AnnualReportData {
  institutionName: string;
  academicYear: string;
  stakeholderScope: 'all' | 'students' | 'faculty';
  uniqueAchieversCount: number;
  verifiedAchievementsCount: number;
  awardsCount: number;
  totalPoints: number;
  categorySummaries: CategoryBreakdownRow[];
  programSummaries: ProgramBreakdownRow[];
  levelSummaries: LevelBreakdownRow[];
  outcomeSummaries: OutcomeBreakdownRow[];
  records: CollegeAchievementRecord[];
  generatedAt: string;
}

export interface DepartmentReportData {
  institutionName: string;
  department: string;
  academicYear: string;
  studentsCount: number;
  verifiedAchievementsCount: number;
  awardsCount: number;
  totalPoints: number;
  categorySummaries: CategoryBreakdownRow[];
  levelSummaries: LevelBreakdownRow[];
  outcomeSummaries: OutcomeBreakdownRow[];
  records: CollegeAchievementRecord[];
  generatedAt: string;
}

export interface CategoryReportData {
  institutionName: string;
  categoryId: string;
  categoryTitle: string;
  reportingPeriodText: string;
  studentsCount: number;
  verifiedAchievementsCount: number;
  awardsCount: number;
  totalPoints: number;
  programSummaries: ProgramBreakdownRow[];
  yearBreakdowns: YearBreakdownRow[];
  levelSummaries: LevelBreakdownRow[];
  outcomeSummaries: OutcomeBreakdownRow[];
  records: CollegeAchievementRecord[];
  generatedAt: string;
}

export interface CustomReportData {
  institutionName: string;
  reportScopeText: string;
  recordsCount: number;
  uniqueUsersCount: number;
  awardsCount: number;
  totalPoints: number;
  levelSummaries: LevelBreakdownRow[];
  categorySummaries: CategoryBreakdownRow[];
  records: CollegeAchievementRecord[];
  generatedAt: string;
}

export interface GeneratedReportItem {
  id: string;
  type: 'NAAC' | 'NBA' | 'ANNUAL' | 'DEPARTMENT' | 'CATEGORY' | 'CUSTOM';
  title: string;
  subtitle: string;
  fileName: string;
  fileUri: string;
  generatedAt: string;
  periodOrProgram: string;
  totalRecords: number;
  totalPoints: number;
}

// ── PRESETS & MASTER CONSTANTS ────────────────────────────────

export const ORDERED_ACADEMIC_YEARS = [
  '2022–23',
  '2023–24',
  '2024–25',
  '2025–26',
  '2026–27',
];

export const NBA_PROGRAM_OPTIONS = [
  'CSE (IoT)',
  'CSE',
  'IT',
  'AI & DS',
  'ECE',
  'EEE',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const STANDARD_ACCREDITATION_CATEGORIES = [
  { id: 'cat_tech', title: 'Technical & Professional Innovation' },
  { id: 'cat_sports', title: 'Sports & Games' },
  { id: 'cat_cert', title: 'Certifications & Online Learning' },
  { id: 'cat_cult', title: 'Cultural & Co-Curricular' },
  { id: 'cat_research', title: 'Research, Publication & IPR' },
  { id: 'cat_social', title: 'Social Impact & Community' },
  { id: 'cat_awards', title: 'Awards, Honors & Recognition' },
  { id: 'cat_startup', title: 'Entrepreneurship & Startup' },
  { id: 'cat_leadership', title: 'Leadership & Student Responsibility' },
];

export function normalizeYear(year: string): string {
  return (year || '').replace('-', '–').trim();
}

export function getYearsForPreset(preset: NAACPeriodPreset, customFrom?: string, customTo?: string): string[] {
  switch (preset) {
    case 'current':
      return ['2026–27'];
    case 'last3':
      return ['2024–25', '2025–26', '2026–27'];
    case 'last5':
      return ['2022–23', '2023–24', '2024–25', '2025–26', '2026–27'];
    case 'custom': {
      const fromNorm = normalizeYear(customFrom || '2022–23');
      const toNorm = normalizeYear(customTo || '2026–27');
      const fromIdx = ORDERED_ACADEMIC_YEARS.indexOf(fromNorm);
      const toIdx = ORDERED_ACADEMIC_YEARS.indexOf(toNorm);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx <= toIdx) {
        return ORDERED_ACADEMIC_YEARS.slice(fromIdx, toIdx + 1);
      }
      return ORDERED_ACADEMIC_YEARS;
    }
    default:
      return ORDERED_ACADEMIC_YEARS;
  }
}

// ── RECOGNITION & TEAM-DEDUPLICATED AWARDS HELPERS ─────────────
// Prompt section 45 & 46:
// Keep "awards/wins" separate from "students represented".
// A team award (e.g. 5 students winning Smart India Hackathon)
// counts as 5 students represented, but 1 award for accreditation metrics.

export function isAwardWinningOutcome(result: string): boolean {
  const norm = (result || '').toLowerCase();
  return (
    norm.includes('winner') ||
    norm.includes('runner') ||
    norm.includes('gold') ||
    norm.includes('silver') ||
    norm.includes('bronze') ||
    norm.includes('best') ||
    norm.includes('1st') ||
    norm.includes('2nd') ||
    norm.includes('3rd') ||
    norm.includes('grant') ||
    norm.includes('honoree') ||
    norm.includes('award') ||
    norm.includes('rank 1') ||
    norm.includes('prize')
  );
}

export function countAwardsAndWins(records: CollegeAchievementRecord[]): number {
  const awardRecords = records.filter((r) => isAwardWinningOutcome(r.result));
  const distinctEventAwards = new Set<string>();
  let individualAwards = 0;

  awardRecords.forEach((r) => {
    // If multiple students share the same event milestone in the same year, count as 1 award
    const eventKey = `${normalizeYear(r.academicYear)}_${r.categoryId}_${(r.eventName || r.title).trim().toLowerCase()}`;
    if (distinctEventAwards.has(eventKey)) {
      return;
    }
    distinctEventAwards.add(eventKey);
    individualAwards++;
  });

  return individualAwards;
}

// Helper to compute standard Level breakdown
function computeLevelBreakdown(records: CollegeAchievementRecord[]): LevelBreakdownRow[] {
  const map = new Map<string, { count: number; awards: number; points: number }>();
  const order = ['International', 'National', 'State', 'Regional', 'Inter-Collegiate', 'College'];

  records.forEach((r) => {
    const lvl = r.level || 'Other';
    if (!map.has(lvl)) map.set(lvl, { count: 0, awards: 0, points: 0 });
    const e = map.get(lvl)!;
    e.count++;
    if (isAwardWinningOutcome(r.result)) e.awards++;
    e.points += r.awardedPoints || 0;
  });

  // Sort by defined order then descending count
  return Array.from(map.entries())
    .sort((a, b) => {
      const idxA = order.indexOf(a[0]);
      const idxB = order.indexOf(b[0]);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b[1].count - a[1].count;
    })
    .map(([level, data]) => ({
      level,
      achievementsCount: data.count,
      awardsCount: data.awards,
      points: data.points,
    }));
}

// Helper to compute Outcome breakdown
function computeOutcomeBreakdown(records: CollegeAchievementRecord[]): OutcomeBreakdownRow[] {
  const map = new Map<string, number>();
  records.forEach((r) => {
    const res = r.result || 'Participation';
    map.set(res, (map.get(res) || 0) + 1);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([result, count]) => ({
      result,
      count,
      isAward: isAwardWinningOutcome(result),
    }));
}

// Helper to compute Program breakdown
function computeProgramBreakdown(records: CollegeAchievementRecord[]): ProgramBreakdownRow[] {
  const map = new Map<
    string,
    {
      students: Set<string>;
      count: number;
      awards: number;
      national: number;
      intl: number;
      points: number;
    }
  >();

  NBA_PROGRAM_OPTIONS.forEach((p) => {
    map.set(p, {
      students: new Set(),
      count: 0,
      awards: 0,
      national: 0,
      intl: 0,
      points: 0,
    });
  });

  records.forEach((r) => {
    const dept = (r.department || r.departmentName || 'CSE (IoT)').trim();
    const matched = NBA_PROGRAM_OPTIONS.find(
      (p) => dept.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(dept.toLowerCase())
    );
    const key = matched || dept;
    if (!map.has(key)) {
      map.set(key, {
        students: new Set(),
        count: 0,
        awards: 0,
        national: 0,
        intl: 0,
        points: 0,
      });
    }
    const e = map.get(key)!;
    e.students.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    e.count++;
    if (isAwardWinningOutcome(r.result)) e.awards++;
    if ((r.level || '').toLowerCase() === 'national') e.national++;
    if ((r.level || '').toLowerCase() === 'international') e.intl++;
    e.points += r.awardedPoints || 0;
  });

  return Array.from(map.entries()).map(([prog, data]) => ({
    program: prog,
    studentsCount: data.students.size,
    achievementsCount: data.count,
    awardsCount: data.awards,
    nationalCount: data.national,
    internationalCount: data.intl,
    points: data.points,
  }));
}

// Helper to compute Category breakdown
function computeCategoryBreakdown(
  records: CollegeAchievementRecord[],
  totalVolume: number
): CategoryBreakdownRow[] {
  const catMap = new Map<string, { title: string; students: Set<string>; count: number; awards: number; points: number }>();

  records.forEach((r) => {
    const key = r.categoryTitle || r.categoryName || 'Technical & Professional';
    if (!catMap.has(key)) {
      catMap.set(key, { title: key, students: new Set(), count: 0, awards: 0, points: 0 });
    }
    const e = catMap.get(key)!;
    e.students.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    e.count++;
    if (isAwardWinningOutcome(r.result)) e.awards++;
    e.points += r.awardedPoints || 0;
  });

  return Array.from(catMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([title, data]) => ({
      categoryId: title.toLowerCase().replace(/\s+/g, '_'),
      categoryTitle: data.title,
      studentsCount: data.students.size,
      achievementsCount: data.count,
      awardsCount: data.awards,
      points: data.points,
      percentage: totalVolume > 0 ? Math.round((data.count / totalVolume) * 100) : 0,
    }));
}

// ── 1. NAAC COMPUTATION ENGINE ────────────────────────────────

export function computeNAACReportData(
  allAchievements: CollegeAchievementRecord[],
  filters: NAACFilterState,
  institutionName: string = 'Nandha Engineering College'
): NAACReportData {
  const allowedYears = getYearsForPreset(filters.periodPreset, filters.fromAcademicYear, filters.toAcademicYear);

  // 1. Filter student verified achievements within the allowed year window
  const windowRecords = allAchievements.filter((rec) => {
    if (rec.userType.toLowerCase() !== 'student') return false;
    if (rec.status !== 'Verified') return false;
    const recYear = normalizeYear(rec.academicYear);
    return allowedYears.includes(recYear);
  });

  // 2. Filter by scope (All Categories vs Specific Category)
  let activeRecords = windowRecords;
  if (filters.scope === 'category' && filters.categoryId && filters.categoryId !== 'ALL') {
    const targetId = filters.categoryId.toLowerCase();
    const targetTitle = (filters.categoryTitle || '').toLowerCase();
    activeRecords = windowRecords.filter((rec) => {
      const rCatId = (rec.categoryId || '').toLowerCase();
      const rCatTitle = (rec.categoryTitle || rec.categoryName || '').toLowerCase();
      return (
        rCatId === targetId ||
        rCatTitle === targetTitle ||
        rCatTitle.includes(targetTitle) ||
        targetTitle.includes(rCatTitle)
      );
    });
  }

  // 3. Unique students & total points
  const studentSet = new Set<string>();
  let totalPoints = 0;
  activeRecords.forEach((r) => {
    studentSet.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    totalPoints += r.awardedPoints || 0;
  });

  // 4. Team-deduplicated awards count
  const awardsCount = countAwardsAndWins(activeRecords);

  // 5. 5-Year Year-wise breakdown (Always show all allowed years in chronological order)
  const yearBreakdowns: YearBreakdownRow[] = allowedYears.map((ay) => {
    const yrRecs = activeRecords.filter((r) => normalizeYear(r.academicYear) === ay);
    const yrStudents = new Set<string>();
    let yrPoints = 0;
    yrRecs.forEach((r) => {
      yrStudents.add(r.rollOrEmpId || r.userRollOrId || r.userName);
      yrPoints += r.awardedPoints || 0;
    });
    return {
      academicYear: ay,
      studentsCount: yrStudents.size,
      achievementsCount: yrRecs.length,
      awardsCount: countAwardsAndWins(yrRecs),
      points: yrPoints,
    };
  });

  // 6. Category breakdown
  const categorySummaries = computeCategoryBreakdown(activeRecords, activeRecords.length);

  // 7. Level breakdown
  const levelSummaries = computeLevelBreakdown(activeRecords);

  // 8. Outcome breakdown
  const outcomeSummaries = computeOutcomeBreakdown(activeRecords);

  const periodText =
    allowedYears.length === 1
      ? allowedYears[0]
      : `${allowedYears[0]} to ${allowedYears[allowedYears.length - 1]}`;

  return {
    institutionName,
    reportingPeriodText: periodText,
    scope: filters.scope,
    selectedCategoryTitle: filters.categoryTitle,
    uniqueStudentsCount: studentSet.size,
    verifiedAchievementsCount: activeRecords.length,
    awardsCount,
    totalPoints,
    yearBreakdowns,
    categorySummaries,
    levelSummaries,
    outcomeSummaries,
    records: activeRecords,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// ── 2. NBA COMPUTATION ENGINE ─────────────────────────────────

export function computeNBAReportData(
  allAchievements: CollegeAchievementRecord[],
  filters: NBAFilterState,
  institutionName: string = 'Nandha Engineering College'
): NBAReportData {
  const normAY = normalizeYear(filters.academicYear || '2026–27');

  // 1. Filter student achievements for the selected Academic Year (Verified records)
  const ayRecords = allAchievements.filter((rec) => {
    if (rec.userType.toLowerCase() !== 'student') return false;
    if (rec.status !== 'Verified') return false;
    return normalizeYear(rec.academicYear) === normAY;
  });

  // 2. Filter by scope (All Programs vs Specific Program)
  let activeRecords = ayRecords;
  if (filters.scope === 'program' && filters.program && filters.program !== 'ALL') {
    const targetProg = filters.program.trim().toLowerCase();
    activeRecords = ayRecords.filter((rec) => {
      const recDept = (rec.department || rec.departmentName || '').trim().toLowerCase();
      return recDept.includes(targetProg) || targetProg.includes(recDept);
    });
  }

  // 3. Unique students & total points
  const studentSet = new Set<string>();
  let totalPoints = 0;
  activeRecords.forEach((r) => {
    studentSet.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    totalPoints += r.awardedPoints || 0;
  });

  const awardsCount = countAwardsAndWins(activeRecords);
  const programSummaries = computeProgramBreakdown(activeRecords);
  const categorySummaries = computeCategoryBreakdown(activeRecords, activeRecords.length);
  const levelSummaries = computeLevelBreakdown(activeRecords);
  const outcomeSummaries = computeOutcomeBreakdown(activeRecords);

  const activeProgramsCount =
    filters.scope === 'all_programs'
      ? programSummaries.filter((p) => p.achievementsCount > 0).length || NBA_PROGRAM_OPTIONS.length
      : 1;

  return {
    institutionName,
    academicYear: normAY,
    scope: filters.scope,
    selectedProgram: filters.program,
    programsIncludedCount: activeProgramsCount,
    uniqueStudentsCount: studentSet.size,
    verifiedAchievementsCount: activeRecords.length,
    awardsCount,
    totalPoints,
    programSummaries,
    categorySummaries,
    levelSummaries,
    outcomeSummaries,
    records: activeRecords,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// ── 3. ANNUAL ACHIEVEMENT REPORT ENGINE ────────────────────────

export function computeAnnualReportData(
  allAchievements: CollegeAchievementRecord[],
  filters: AnnualFilterState,
  institutionName: string = 'Nandha Engineering College'
): AnnualReportData {
  const normAY = normalizeYear(filters.academicYear || '2026–27');

  const filtered = allAchievements.filter((rec) => {
    if (rec.status !== 'Verified') return false;
    if (normalizeYear(rec.academicYear) !== normAY) return false;
    if (filters.stakeholderScope === 'students' && rec.userType.toLowerCase() !== 'student') return false;
    if (filters.stakeholderScope === 'faculty' && rec.userType.toLowerCase() !== 'faculty') return false;
    return true;
  });

  const achieverSet = new Set<string>();
  let totalPoints = 0;
  filtered.forEach((r) => {
    achieverSet.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    totalPoints += r.awardedPoints || 0;
  });

  return {
    institutionName,
    academicYear: normAY,
    stakeholderScope: filters.stakeholderScope,
    uniqueAchieversCount: achieverSet.size,
    verifiedAchievementsCount: filtered.length,
    awardsCount: countAwardsAndWins(filtered),
    totalPoints,
    categorySummaries: computeCategoryBreakdown(filtered, filtered.length),
    programSummaries: computeProgramBreakdown(filtered),
    levelSummaries: computeLevelBreakdown(filtered),
    outcomeSummaries: computeOutcomeBreakdown(filtered),
    records: filtered,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// ── 4. DEPARTMENT ACHIEVEMENT REPORT ENGINE ────────────────────

export function computeDepartmentReportData(
  allAchievements: CollegeAchievementRecord[],
  filters: DepartmentFilterState,
  institutionName: string = 'Nandha Engineering College'
): DepartmentReportData {
  const normAY = normalizeYear(filters.academicYear || '2026–27');
  const targetDept = (filters.department || 'CSE (IoT)').trim().toLowerCase();

  const filtered = allAchievements.filter((rec) => {
    if (rec.status !== 'Verified') return false;
    if (normalizeYear(rec.academicYear) !== normAY) return false;
    const dept = (rec.department || rec.departmentName || '').trim().toLowerCase();
    return dept.includes(targetDept) || targetDept.includes(dept);
  });

  const studentSet = new Set<string>();
  let totalPoints = 0;
  filtered.forEach((r) => {
    studentSet.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    totalPoints += r.awardedPoints || 0;
  });

  return {
    institutionName,
    department: filters.department,
    academicYear: normAY,
    studentsCount: studentSet.size,
    verifiedAchievementsCount: filtered.length,
    awardsCount: countAwardsAndWins(filtered),
    totalPoints,
    categorySummaries: computeCategoryBreakdown(filtered, filtered.length),
    levelSummaries: computeLevelBreakdown(filtered),
    outcomeSummaries: computeOutcomeBreakdown(filtered),
    records: filtered,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// ── 5. CATEGORY ACHIEVEMENT REPORT ENGINE ──────────────────────

export function computeCategoryReportData(
  allAchievements: CollegeAchievementRecord[],
  filters: CategoryFilterState,
  institutionName: string = 'Nandha Engineering College'
): CategoryReportData {
  const allowedYears = getYearsForPreset(filters.periodPreset, filters.fromAcademicYear, filters.toAcademicYear);
  const targetCat = (filters.categoryTitle || '').trim().toLowerCase();

  const filtered = allAchievements.filter((rec) => {
    if (rec.status !== 'Verified') return false;
    const recYear = normalizeYear(rec.academicYear);
    if (!allowedYears.includes(recYear)) return false;
    const cat = (rec.categoryTitle || rec.categoryName || '').trim().toLowerCase();
    return cat === targetCat || cat.includes(targetCat) || targetCat.includes(cat);
  });

  const studentSet = new Set<string>();
  let totalPoints = 0;
  filtered.forEach((r) => {
    studentSet.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    totalPoints += r.awardedPoints || 0;
  });

  const yearBreakdowns: YearBreakdownRow[] = allowedYears.map((ay) => {
    const yrRecs = filtered.filter((r) => normalizeYear(r.academicYear) === ay);
    const yrStudents = new Set<string>();
    let yrPoints = 0;
    yrRecs.forEach((r) => {
      yrStudents.add(r.rollOrEmpId || r.userRollOrId || r.userName);
      yrPoints += r.awardedPoints || 0;
    });
    return {
      academicYear: ay,
      studentsCount: yrStudents.size,
      achievementsCount: yrRecs.length,
      awardsCount: countAwardsAndWins(yrRecs),
      points: yrPoints,
    };
  });

  const periodText =
    allowedYears.length === 1
      ? allowedYears[0]
      : `${allowedYears[0]} to ${allowedYears[allowedYears.length - 1]}`;

  return {
    institutionName,
    categoryId: filters.categoryId,
    categoryTitle: filters.categoryTitle,
    reportingPeriodText: periodText,
    studentsCount: studentSet.size,
    verifiedAchievementsCount: filtered.length,
    awardsCount: countAwardsAndWins(filtered),
    totalPoints,
    programSummaries: computeProgramBreakdown(filtered),
    yearBreakdowns,
    levelSummaries: computeLevelBreakdown(filtered),
    outcomeSummaries: computeOutcomeBreakdown(filtered),
    records: filtered,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// ── 6. CUSTOM REPORT ENGINE ───────────────────────────────────

export function computeCustomReportData(
  allAchievements: CollegeAchievementRecord[],
  filters: CustomFilterState,
  institutionName: string = 'Nandha Engineering College'
): CustomReportData {
  const fromNorm = normalizeYear(filters.fromAcademicYear || '2022–23');
  const toNorm = normalizeYear(filters.toAcademicYear || '2026–27');
  const fromIdx = ORDERED_ACADEMIC_YEARS.indexOf(fromNorm);
  const toIdx = ORDERED_ACADEMIC_YEARS.indexOf(toNorm);
  const allowedYears =
    fromIdx !== -1 && toIdx !== -1 && fromIdx <= toIdx
      ? ORDERED_ACADEMIC_YEARS.slice(fromIdx, toIdx + 1)
      : ORDERED_ACADEMIC_YEARS;

  const targetDept = (filters.department || '').trim().toLowerCase();

  const filtered = allAchievements.filter((rec) => {
    if (filters.userType !== 'ALL' && rec.userType.toLowerCase() !== filters.userType.toLowerCase()) {
      return false;
    }
    const recYear = normalizeYear(rec.academicYear);
    if (!allowedYears.includes(recYear)) return false;

    if (targetDept && targetDept !== 'all') {
      const recDept = (rec.department || rec.departmentName || '').trim().toLowerCase();
      if (!recDept.includes(targetDept) && !targetDept.includes(recDept)) {
        return false;
      }
    }

    if (filters.studentYear !== 'ALL' && rec.studentYear !== filters.studentYear) return false;
    if (filters.semester !== 'ALL' && rec.semester !== filters.semester) return false;
    if (filters.categoryId !== 'ALL' && rec.categoryId !== filters.categoryId) return false;
    if (filters.level !== 'ALL' && rec.level !== filters.level) return false;

    if (filters.status === 'Verified') {
      if (rec.status !== 'Verified') return false;
    } else if (filters.status !== 'ALL') {
      if (rec.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    }

    return true;
  });

  const userSet = new Set<string>();
  let totalPoints = 0;
  filtered.forEach((r) => {
    userSet.add(r.rollOrEmpId || r.userRollOrId || r.userName);
    totalPoints += r.awardedPoints || 0;
  });

  const scopeParts: string[] = [];
  if (allowedYears.length === 1) {
    scopeParts.push(`AY ${allowedYears[0]}`);
  } else {
    scopeParts.push(`AY ${allowedYears[0]} – ${allowedYears[allowedYears.length - 1]}`);
  }
  if (filters.department && filters.department !== 'ALL') {
    scopeParts.push(filters.department);
  }
  if (filters.status && filters.status !== 'ALL') {
    scopeParts.push(filters.status);
  }

  return {
    institutionName,
    reportScopeText: scopeParts.join(' • '),
    recordsCount: filtered.length,
    uniqueUsersCount: userSet.size,
    awardsCount: countAwardsAndWins(filtered),
    totalPoints,
    levelSummaries: computeLevelBreakdown(filtered),
    categorySummaries: computeCategoryBreakdown(filtered, filtered.length),
    records: filtered,
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// ── FORMAL ACCREDITATION PRINT CSS ────────────────────────────
// Pure white background, black/slate typography, institutional letterhead,
// formal tables, no giant cards, no mobile screenshot UI.

const FORMAL_PRINT_CSS = `
  @page {
    size: A4 portrait;
    margin: 18mm 15mm 18mm 15mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    background: #FFFFFF;
    margin: 0;
    padding: 0;
    font-size: 9.5pt;
    line-height: 1.5;
  }
  .page-container {
    page-break-after: always;
  }
  .page-container:last-child {
    page-break-after: auto;
  }
  .inst-letterhead {
    text-align: center;
    border-bottom: 2px solid #0F172A;
    padding-bottom: 12px;
    margin-bottom: 18px;
  }
  .inst-name {
    font-size: 16pt;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin: 0 0 4px 0;
  }
  .inst-sub {
    font-size: 8.5pt;
    color: #4B5563;
    margin: 0 0 6px 0;
  }
  .doc-title-box {
    text-align: center;
    margin-bottom: 18px;
  }
  .doc-title {
    font-size: 13pt;
    font-weight: 800;
    color: #1E3A8A;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin: 0 0 4px 0;
  }
  .doc-badge {
    display: inline-block;
    font-size: 8pt;
    font-weight: 700;
    color: #1E40AF;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    padding: 3px 10px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .metadata-grid {
    display: flex;
    justify-content: space-between;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 4px;
    padding: 10px 14px;
    margin-bottom: 20px;
  }
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .meta-lbl {
    font-size: 7.5pt;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .meta-val {
    font-size: 9pt;
    font-weight: 700;
    color: #0F172A;
  }
  .section-title {
    font-size: 10.5pt;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
    border-bottom: 1.5px solid #CBD5E1;
    padding-bottom: 4px;
    margin-top: 20px;
    margin-bottom: 10px;
    letter-spacing: 0.3px;
  }
  .summary-metrics-grid {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }
  .metric-tile {
    flex: 1;
    border: 1px solid #E2E8F0;
    background: #F8FAFC;
    border-radius: 4px;
    padding: 10px 12px;
    text-align: center;
  }
  .metric-tile-val {
    font-size: 16pt;
    font-weight: 800;
    color: #1E3A8A;
    line-height: 1.2;
    margin-bottom: 2px;
  }
  .metric-tile-lbl {
    font-size: 7.5pt;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
  }
  .report-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;
    font-size: 9pt;
  }
  .report-table th {
    background: #F1F5F9;
    color: #0F172A;
    font-weight: 700;
    text-align: left;
    padding: 7px 10px;
    border: 1px solid #CBD5E1;
    font-size: 8pt;
    text-transform: uppercase;
  }
  .report-table td {
    padding: 7px 10px;
    border: 1px solid #E2E8F0;
    vertical-align: middle;
  }
  .report-table tr:nth-child(even) {
    background: #FAFAFA;
  }
  .report-table tr.total-row {
    background: #F8FAFC;
    font-weight: 800;
    border-top: 2px solid #94A3B8;
  }
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }
  .bold {
    font-weight: 700;
  }
  .secondary {
    color: #64748B;
  }
  .note-box {
    background: #F8FAFC;
    border-left: 3px solid #2563EB;
    padding: 8px 12px;
    font-size: 8pt;
    color: #475569;
    margin-top: 14px;
    margin-bottom: 16px;
    border-radius: 0 4px 4px 0;
  }
  .footer-bar {
    margin-top: 30px;
    padding-top: 8px;
    border-top: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: #94A3B8;
  }
`;

// Common Header HTML generator
function renderLetterhead(instName: string, docTitle: string, docTag: string, metadata: { [key: string]: string }) {
  const metaCols = Object.entries(metadata)
    .map(
      ([k, v]) => `
      <div class="meta-item">
        <span class="meta-lbl">${k}</span>
        <span class="meta-val">${v}</span>
      </div>`
    )
    .join('');

  return `
    <div class="inst-letterhead">
      <div class="inst-name">${instName}</div>
      <div class="inst-sub">Autonomous Institution • Approved by AICTE, New Delhi • Accredited by NAAC & NBA</div>
      <div class="inst-sub">Centralized Student Achievement & Accreditation Record Repository</div>
    </div>
    <div class="doc-title-box">
      <div class="doc-title">${docTitle}</div>
      <span class="doc-badge">${docTag}</span>
    </div>
    <div class="metadata-grid">
      ${metaCols}
    </div>
  `;
}

function renderFooter() {
  return `
    <div class="footer-bar">
      <span>Generated through AchieveX • Verified Institutional Achievement Data</span>
      <span>Official Accreditation Supporting Document</span>
    </div>
  `;
}

// ── HTML BUILDER: NAAC SUMMARY REPORT ─────────────────────────
// Section 16 & 17: Pure quantitative summary document, NO student dumps!

export function buildNAACHtml(report: NAACReportData): string {
  const scopeText =
    report.scope === 'all_categories'
      ? 'All Achievement Categories'
      : `Category: ${report.selectedCategoryTitle || 'Specific Category'}`;

  const headerHtml = renderLetterhead(
    report.institutionName,
    'NAAC Supporting Report — Five-Year Student Achievement Summary',
    'Criterion 5.3: Student Participation & Activities Evidence',
    {
      'Assessment Period': report.reportingPeriodText,
      'Report Scope': scopeText,
      'Generated Date': report.generatedAt,
      'Verification Status': '100% Institutional Verified',
    }
  );

  // Executive Metric Tiles
  const metricsTilesHtml = `
    <div class="summary-metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile-val">${report.verifiedAchievementsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Verified Achievements</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.uniqueStudentsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Students Represented</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.awardsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Awards / Winning Outcomes</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val" style="color: #64748B;">${report.totalPoints.toLocaleString()}</div>
        <div class="metric-tile-lbl">Institutional Points</div>
      </div>
    </div>
  `;

  // 1. Year-wise Achievement Summary Table
  const yearRows = report.yearBreakdowns
    .map(
      (y) => `
      <tr>
        <td class="bold">${y.academicYear}</td>
        <td class="center bold">${y.achievementsCount.toLocaleString()}</td>
        <td class="center">${y.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${y.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${y.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const yearTableHtml = `
    <div class="section-title">1. Five-Year Quantitative Progression Summary</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Academic Year</th>
          <th class="center">Verified Achievements</th>
          <th class="center">Students Represented</th>
          <th class="center">Awards / Wins</th>
          <th class="right">AchieveX Points</th>
        </tr>
      </thead>
      <tbody>
        ${yearRows}
        <tr class="total-row">
          <td>5-Year Cumulative Total</td>
          <td class="center bold">${report.verifiedAchievementsCount.toLocaleString()}</td>
          <td class="center bold">${report.uniqueStudentsCount.toLocaleString()}</td>
          <td class="center bold" style="color: #1E40AF;">${report.awardsCount.toLocaleString()}</td>
          <td class="right bold secondary">${report.totalPoints.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  `;

  // 2. Category Distribution Table
  const catRows = report.categorySummaries
    .map(
      (c, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${c.categoryTitle}</td>
        <td class="center bold">${c.achievementsCount.toLocaleString()}</td>
        <td class="center">${c.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${c.awardsCount.toLocaleString()}</td>
        <td class="center">${c.percentage}%</td>
        <td class="right secondary">${c.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const categoryTableHtml = `
    <div class="section-title">2. Category-Wise Achievement & Participation Breakdown</div>
    <table class="report-table">
      <thead>
        <tr>
          <th class="center">#</th>
          <th>Category Domain</th>
          <th class="center">Achievements</th>
          <th class="center">Students</th>
          <th class="center">Awards/Wins</th>
          <th class="center">Share (%)</th>
          <th class="right">Points</th>
        </tr>
      </thead>
      <tbody>
        ${catRows}
      </tbody>
    </table>
  `;

  // 3. Level & Outcome Breakdown Tables
  const levelRows = report.levelSummaries
    .map(
      (l) => `
      <tr>
        <td class="bold">${l.level}</td>
        <td class="center bold">${l.achievementsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${l.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${l.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const outcomeRows = report.outcomeSummaries
    .slice(0, 8)
    .map(
      (o) => `
      <tr>
        <td class="bold">${o.result}</td>
        <td class="center bold">${o.count.toLocaleString()}</td>
        <td class="center">${o.isAward ? '<span style="color:#16A34A; font-weight:700;">Award / Win</span>' : 'Participation'}</td>
      </tr>
    `
    )
    .join('');

  const levelOutcomeHtml = `
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1;">
        <div class="section-title">3. Recognition Level Distribution</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Event Level</th>
              <th class="center">Count</th>
              <th class="center">Awards</th>
              <th class="right">Points</th>
            </tr>
          </thead>
          <tbody>
            ${levelRows}
          </tbody>
        </table>
      </div>
      <div style="flex: 1;">
        <div class="section-title">4. Result & Outcome Breakdown</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Outcome Result</th>
              <th class="center">Records</th>
              <th class="center">Classification</th>
            </tr>
          </thead>
          <tbody>
            ${outcomeRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const noteHtml = `
    <div class="note-box">
      <strong>Accreditation Compliance Note:</strong> In accordance with NAAC guidelines for Criterion 5.3 (Student Support and Progression), awards in team events are consolidated per event milestone while counting all individual participating student beneficiaries under Students Represented. Primary verification proofs, certificates, and gazette letters remain safely cataloged within the institutional AchieveX repository.
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AchieveX NAAC Supporting Report</title>
        <style>${FORMAL_PRINT_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${headerHtml}
          ${metricsTilesHtml}
          ${yearTableHtml}
          ${categoryTableHtml}
          ${levelOutcomeHtml}
          ${noteHtml}
          ${renderFooter()}
        </div>
      </body>
    </html>
  `;
}

// ── HTML BUILDER: NBA SUMMARY REPORT ──────────────────────────
// Section 24 & 25: All Programs or Specific Program Summary Document, NO student dumps!

export function buildNBAHtml(report: NBAReportData): string {
  const isAllPrograms = report.scope === 'all_programs';
  const scopeText = isAllPrograms ? 'All Accredited Programs' : `Program: ${report.selectedProgram || 'Selected Program'}`;

  const headerHtml = renderLetterhead(
    report.institutionName,
    'NBA Supporting Achievement Report',
    'Criterion 4: Student Performance & External Recognitions',
    {
      'Academic Year': `AY ${report.academicYear}`,
      'Report Scope': scopeText,
      'Programs Included': `${report.programsIncludedCount} Programs`,
      'Generated Date': report.generatedAt,
    }
  );

  const metricsTilesHtml = `
    <div class="summary-metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile-val">${report.programsIncludedCount}</div>
        <div class="metric-tile-lbl">Programs Evaluated</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.verifiedAchievementsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Verified Achievements</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.uniqueStudentsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Students Represented</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.awardsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Awards / Wins</div>
      </div>
    </div>
  `;

  let bodyTablesHtml = '';

  if (isAllPrograms) {
    // 1. Program-wise Summary Table
    const progRows = report.programSummaries
      .map(
        (p, idx) => `
        <tr>
          <td class="center" style="width: 28px;">${idx + 1}</td>
          <td class="bold">${p.program}</td>
          <td class="center">${p.studentsCount.toLocaleString()}</td>
          <td class="center bold">${p.achievementsCount.toLocaleString()}</td>
          <td class="center bold" style="color: #1E40AF;">${p.awardsCount.toLocaleString()}</td>
          <td class="center">${p.nationalCount}</td>
          <td class="center">${p.internationalCount}</td>
          <td class="right secondary">${p.points.toLocaleString()}</td>
        </tr>
      `
      )
      .join('');

    bodyTablesHtml += `
      <div class="section-title">1. Program-Wise Performance Benchmark (AY ${report.academicYear})</div>
      <table class="report-table">
        <thead>
          <tr>
            <th class="center">#</th>
            <th>Program / Department</th>
            <th class="center">Students</th>
            <th class="center">Achievements</th>
            <th class="center">Awards/Wins</th>
            <th class="center">National</th>
            <th class="center">Int'l</th>
            <th class="right">Points</th>
          </tr>
        </thead>
        <tbody>
          ${progRows}
          <tr class="total-row">
            <td colspan="2">Institution Totals</td>
            <td class="center bold">${report.uniqueStudentsCount.toLocaleString()}</td>
            <td class="center bold">${report.verifiedAchievementsCount.toLocaleString()}</td>
            <td class="center bold" style="color: #1E40AF;">${report.awardsCount.toLocaleString()}</td>
            <td class="center bold" colspan="2">—</td>
            <td class="right bold secondary">${report.totalPoints.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  // Category Breakdown Table
  const catRows = report.categorySummaries
    .map(
      (c, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${c.categoryTitle}</td>
        <td class="center bold">${c.achievementsCount.toLocaleString()}</td>
        <td class="center">${c.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${c.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${c.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  bodyTablesHtml += `
    <div class="section-title">${isAllPrograms ? '2' : '1'}. Category-Wise Achievement Distribution</div>
    <table class="report-table">
      <thead>
        <tr>
          <th class="center">#</th>
          <th>Category Domain</th>
          <th class="center">Achievements</th>
          <th class="center">Students</th>
          <th class="center">Awards / Wins</th>
          <th class="right">AchieveX Points</th>
        </tr>
      </thead>
      <tbody>
        ${catRows}
      </tbody>
    </table>
  `;

  // Level & Outcome side-by-side
  const levelRows = report.levelSummaries
    .map(
      (l) => `
      <tr>
        <td class="bold">${l.level}</td>
        <td class="center bold">${l.achievementsCount}</td>
        <td class="center bold" style="color: #1E40AF;">${l.awardsCount}</td>
      </tr>
    `
    )
    .join('');

  const outcomeRows = report.outcomeSummaries
    .slice(0, 6)
    .map(
      (o) => `
      <tr>
        <td class="bold">${o.result}</td>
        <td class="center bold">${o.count}</td>
      </tr>
    `
    )
    .join('');

  bodyTablesHtml += `
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1;">
        <div class="section-title">${isAllPrograms ? '3' : '2'}. Level Distribution</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Level</th>
              <th class="center">Count</th>
              <th class="center">Awards</th>
            </tr>
          </thead>
          <tbody>${levelRows}</tbody>
        </table>
      </div>
      <div style="flex: 1;">
        <div class="section-title">${isAllPrograms ? '4' : '3'}. Outcome Summary</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Outcome</th>
              <th class="center">Records</th>
            </tr>
          </thead>
          <tbody>${outcomeRows}</tbody>
        </table>
      </div>
    </div>
  `;

  const noteHtml = `
    <div class="note-box">
      <strong>NBA Supporting Documentation Note:</strong> This report serves as verified supporting achievement evidence for NBA Criterion 4 (Students' Performance) preparation. Detailed student registries, individual certificates, and verification logs are maintained in the department audit archives within AchieveX.
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AchieveX NBA Supporting Report</title>
        <style>${FORMAL_PRINT_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${headerHtml}
          ${metricsTilesHtml}
          ${bodyTablesHtml}
          ${noteHtml}
          ${renderFooter()}
        </div>
      </body>
    </html>
  `;
}

// ── HTML BUILDER: ANNUAL ACHIEVEMENT REPORT ───────────────────
// Section 26: Complete institution achievement summary for one academic year

export function buildAnnualHtml(report: AnnualReportData): string {
  const scopeLabel =
    report.stakeholderScope === 'all'
      ? 'Entire Institution (Students & Faculty)'
      : report.stakeholderScope === 'students'
      ? 'Student Body'
      : 'Faculty Members';

  const headerHtml = renderLetterhead(
    report.institutionName,
    'Annual Institutional Achievement Report',
    'Board of Governance & Management Executive Summary',
    {
      'Academic Year': `AY ${report.academicYear}`,
      'Stakeholder Scope': scopeLabel,
      'Generated Date': report.generatedAt,
      'Audit Status': 'Certified Verified Records',
    }
  );

  const metricsTilesHtml = `
    <div class="summary-metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile-val">${report.verifiedAchievementsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Total Milestones</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.uniqueAchieversCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Active Achievers</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.awardsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Awards / Wins</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val" style="color: #64748B;">${report.totalPoints.toLocaleString()}</div>
        <div class="metric-tile-lbl">Total Points</div>
      </div>
    </div>
  `;

  const progRows = report.programSummaries
    .map(
      (p, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${p.program}</td>
        <td class="center">${p.studentsCount.toLocaleString()}</td>
        <td class="center bold">${p.achievementsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${p.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${p.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const catRows = report.categorySummaries
    .map(
      (c, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${c.categoryTitle}</td>
        <td class="center bold">${c.achievementsCount.toLocaleString()}</td>
        <td class="center">${c.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${c.awardsCount.toLocaleString()}</td>
        <td class="center">${c.percentage}%</td>
        <td class="right secondary">${c.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Annual Achievement Report AY ${report.academicYear}</title>
        <style>${FORMAL_PRINT_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${headerHtml}
          ${metricsTilesHtml}
          <div class="section-title">1. Department & Program Performance Summary</div>
          <table class="report-table">
            <thead>
              <tr>
                <th class="center">#</th>
                <th>Department / Branch</th>
                <th class="center">Achievers</th>
                <th class="center">Achievements</th>
                <th class="center">Awards/Wins</th>
                <th class="right">Points</th>
              </tr>
            </thead>
            <tbody>${progRows}</tbody>
          </table>

          <div class="section-title">2. Category Performance Breakdown</div>
          <table class="report-table">
            <thead>
              <tr>
                <th class="center">#</th>
                <th>Category Domain</th>
                <th class="center">Achievements</th>
                <th class="center">Achievers</th>
                <th class="center">Awards</th>
                <th class="center">Share</th>
                <th class="right">Points</th>
              </tr>
            </thead>
            <tbody>${catRows}</tbody>
          </table>
          ${renderFooter()}
        </div>
      </body>
    </html>
  `;
}

// ── HTML BUILDER: DEPARTMENT REPORT ───────────────────────────
// Section 27: Department performance and achievement summary

export function buildDepartmentHtml(report: DepartmentReportData): string {
  const headerHtml = renderLetterhead(
    report.institutionName,
    `Department Achievement Report — ${report.department}`,
    'HOD & Management Operational Review',
    {
      'Department': report.department,
      'Academic Year': `AY ${report.academicYear}`,
      'Generated Date': report.generatedAt,
      'Audit Status': 'Certified Records',
    }
  );

  const metricsTilesHtml = `
    <div class="summary-metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile-val">${report.verifiedAchievementsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Department Achievements</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.studentsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Achievers</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.awardsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Awards / Wins</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val" style="color: #64748B;">${report.totalPoints.toLocaleString()}</div>
        <div class="metric-tile-lbl">Department Points</div>
      </div>
    </div>
  `;

  const catRows = report.categorySummaries
    .map(
      (c, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${c.categoryTitle}</td>
        <td class="center bold">${c.achievementsCount.toLocaleString()}</td>
        <td class="center">${c.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${c.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${c.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Department Report - ${report.department}</title>
        <style>${FORMAL_PRINT_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${headerHtml}
          ${metricsTilesHtml}
          <div class="section-title">1. Category Breakdown for ${report.department}</div>
          <table class="report-table">
            <thead>
              <tr>
                <th class="center">#</th>
                <th>Category</th>
                <th class="center">Achievements</th>
                <th class="center">Students</th>
                <th class="center">Awards</th>
                <th class="right">Points</th>
              </tr>
            </thead>
            <tbody>${catRows}</tbody>
          </table>
          ${renderFooter()}
        </div>
      </body>
    </html>
  `;
}

// ── HTML BUILDER: CATEGORY REPORT ─────────────────────────────
// Section 28: Analyze achievements by category and level across institution

export function buildCategoryHtml(report: CategoryReportData): string {
  const headerHtml = renderLetterhead(
    report.institutionName,
    `Category Achievement Report — ${report.categoryTitle}`,
    'Institutional Domain Analysis',
    {
      'Category Domain': report.categoryTitle,
      'Assessment Period': report.reportingPeriodText,
      'Generated Date': report.generatedAt,
      'Audit Status': 'Certified Records',
    }
  );

  const metricsTilesHtml = `
    <div class="summary-metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile-val">${report.verifiedAchievementsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Total Milestones</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.studentsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Students Represented</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.awardsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Awards / Wins</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val" style="color: #64748B;">${report.totalPoints.toLocaleString()}</div>
        <div class="metric-tile-lbl">Category Points</div>
      </div>
    </div>
  `;

  const progRows = report.programSummaries
    .filter((p) => p.achievementsCount > 0)
    .map(
      (p, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${p.program}</td>
        <td class="center bold">${p.achievementsCount.toLocaleString()}</td>
        <td class="center">${p.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${p.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${p.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Category Report - ${report.categoryTitle}</title>
        <style>${FORMAL_PRINT_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${headerHtml}
          ${metricsTilesHtml}
          <div class="section-title">1. Departmental Contribution to ${report.categoryTitle}</div>
          <table class="report-table">
            <thead>
              <tr>
                <th class="center">#</th>
                <th>Department</th>
                <th class="center">Achievements</th>
                <th class="center">Students</th>
                <th class="center">Awards</th>
                <th class="right">Points</th>
              </tr>
            </thead>
            <tbody>${progRows}</tbody>
          </table>
          ${renderFooter()}
        </div>
      </body>
    </html>
  `;
}

// ── HTML BUILDER: CUSTOM REPORT ───────────────────────────────

export function buildCustomHtml(report: CustomReportData): string {
  const headerHtml = renderLetterhead(
    report.institutionName,
    'Custom Achievement Audit Report',
    'Ad-Hoc Institutional Query Results',
    {
      'Query Scope': report.reportScopeText,
      'Total Matches': `${report.recordsCount.toLocaleString()} Records`,
      'Unique Individuals': `${report.uniqueUsersCount.toLocaleString()} Stakeholders`,
      'Generated Date': report.generatedAt,
    }
  );

  const metricsTilesHtml = `
    <div class="summary-metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile-val">${report.recordsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Matching Records</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.uniqueUsersCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Stakeholders</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val">${report.awardsCount.toLocaleString()}</div>
        <div class="metric-tile-lbl">Awards / Wins</div>
      </div>
      <div class="metric-tile">
        <div class="metric-tile-val" style="color: #64748B;">${report.totalPoints.toLocaleString()}</div>
        <div class="metric-tile-lbl">Cumulative Points</div>
      </div>
    </div>
  `;

  const catRows = report.categorySummaries
    .map(
      (c, idx) => `
      <tr>
        <td class="center" style="width: 28px;">${idx + 1}</td>
        <td class="bold">${c.categoryTitle}</td>
        <td class="center bold">${c.achievementsCount.toLocaleString()}</td>
        <td class="center">${c.studentsCount.toLocaleString()}</td>
        <td class="center bold" style="color: #1E40AF;">${c.awardsCount.toLocaleString()}</td>
        <td class="right secondary">${c.points.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AchieveX Custom Report</title>
        <style>${FORMAL_PRINT_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${headerHtml}
          ${metricsTilesHtml}
          <div class="section-title">Query Results by Category Domain</div>
          <table class="report-table">
            <thead>
              <tr>
                <th class="center">#</th>
                <th>Category Domain</th>
                <th class="center">Records</th>
                <th class="center">Individuals</th>
                <th class="center">Awards</th>
                <th class="right">Points</th>
              </tr>
            </thead>
            <tbody>${catRows}</tbody>
          </table>
          ${renderFooter()}
        </div>
      </body>
    </html>
  `;
}

// ── RECENT REPORTS IN-MEMORY STORE ────────────────────────────

let RECENT_REPORTS_CACHE: GeneratedReportItem[] = [
  {
    id: 'rep_sample_naac_5yr',
    type: 'NAAC',
    title: 'NAAC Supporting Report',
    subtitle: 'Five-Year Student Achievement Summary (2022–23 — 2026–27)',
    fileName: 'AchieveX_NAAC_Supporting_Report_2022-23_2026-27.pdf',
    fileUri: '',
    generatedAt: 'Today, 10:45 AM',
    periodOrProgram: '2022–23 — 2026–27',
    totalRecords: 4286,
    totalPoints: 128450,
  },
  {
    id: 'rep_sample_nba_all',
    type: 'NBA',
    title: 'NBA Supporting Achievement Report',
    subtitle: 'All Programs • Academic Year 2026–27',
    fileName: 'AchieveX_NBA_Supporting_Report_All_Programs_2026-27.pdf',
    fileUri: '',
    generatedAt: 'Yesterday, 04:15 PM',
    periodOrProgram: 'All Programs • AY 2026–27',
    totalRecords: 1936,
    totalPoints: 58420,
  },
  {
    id: 'rep_sample_annual_26',
    type: 'ANNUAL',
    title: 'Annual Achievement Report',
    subtitle: 'Institutional Executive Review • AY 2025–26',
    fileName: 'AchieveX_Annual_Achievement_Report_2025-26.pdf',
    fileUri: '',
    generatedAt: '05 Sep 2026',
    periodOrProgram: 'AY 2025–26',
    totalRecords: 1014,
    totalPoints: 34200,
  },
];

export function getRecentReports(): GeneratedReportItem[] {
  return [...RECENT_REPORTS_CACHE];
}

export function addRecentReport(item: GeneratedReportItem) {
  RECENT_REPORTS_CACHE = [item, ...RECENT_REPORTS_CACHE.filter((r) => r.id !== item.id)].slice(0, 10);
}

// ── PDF GENERATION ACTIONS ────────────────────────────────────

export async function generateReportPDF(
  type: 'NAAC' | 'NBA' | 'ANNUAL' | 'DEPARTMENT' | 'CATEGORY' | 'CUSTOM',
  reportData: any
): Promise<{ fileUri: string; fileName: string; reportItem: GeneratedReportItem }> {
  let html = '';
  let fileName = '';
  let title = '';
  let subtitle = '';
  let periodOrProg = '';
  let totalRecs = 0;
  let totalPts = 0;

  if (type === 'NAAC') {
    const naac = reportData as NAACReportData;
    html = buildNAACHtml(naac);
    const scopeSlug =
      naac.scope === 'all_categories'
        ? 'All_Categories'
        : (naac.selectedCategoryTitle || 'Category').replace(/[^a-zA-Z0-9]/g, '_');
    const periodSlug = naac.reportingPeriodText.replace(/[^a-zA-Z0-9]/g, '-');
    fileName = `AchieveX_NAAC_${scopeSlug}_${periodSlug}.pdf`;
    title = 'NAAC Supporting Report';
    subtitle = `${naac.scope === 'all_categories' ? 'All Categories' : naac.selectedCategoryTitle} • ${naac.reportingPeriodText}`;
    periodOrProg = naac.reportingPeriodText;
    totalRecs = naac.verifiedAchievementsCount;
    totalPts = naac.totalPoints;
  } else if (type === 'NBA') {
    const nba = reportData as NBAReportData;
    html = buildNBAHtml(nba);
    const scopeSlug =
      nba.scope === 'all_programs'
        ? 'All_Programs'
        : (nba.selectedProgram || 'Program').replace(/[^a-zA-Z0-9]/g, '_');
    const aySlug = nba.academicYear.replace(/[^a-zA-Z0-9]/g, '-');
    fileName = `AchieveX_NBA_${scopeSlug}_${aySlug}.pdf`;
    title = 'NBA Supporting Achievement Report';
    subtitle = `${nba.scope === 'all_programs' ? 'All Programs' : nba.selectedProgram} • AY ${nba.academicYear}`;
    periodOrProg = `AY ${nba.academicYear}`;
    totalRecs = nba.verifiedAchievementsCount;
    totalPts = nba.totalPoints;
  } else if (type === 'ANNUAL') {
    const ann = reportData as AnnualReportData;
    html = buildAnnualHtml(ann);
    const aySlug = ann.academicYear.replace(/[^a-zA-Z0-9]/g, '-');
    fileName = `AchieveX_Annual_Report_${aySlug}.pdf`;
    title = 'Annual Achievement Report';
    subtitle = `Institutional Executive Review • AY ${ann.academicYear}`;
    periodOrProg = `AY ${ann.academicYear}`;
    totalRecs = ann.verifiedAchievementsCount;
    totalPts = ann.totalPoints;
  } else if (type === 'DEPARTMENT') {
    const dept = reportData as DepartmentReportData;
    html = buildDepartmentHtml(dept);
    const deptSlug = dept.department.replace(/[^a-zA-Z0-9]/g, '_');
    const aySlug = dept.academicYear.replace(/[^a-zA-Z0-9]/g, '-');
    fileName = `AchieveX_Department_${deptSlug}_${aySlug}.pdf`;
    title = 'Department Achievement Report';
    subtitle = `${dept.department} • AY ${dept.academicYear}`;
    periodOrProg = `${dept.department} • AY ${dept.academicYear}`;
    totalRecs = dept.verifiedAchievementsCount;
    totalPts = dept.totalPoints;
  } else if (type === 'CATEGORY') {
    const cat = reportData as CategoryReportData;
    html = buildCategoryHtml(cat);
    const catSlug = cat.categoryTitle.replace(/[^a-zA-Z0-9]/g, '_');
    fileName = `AchieveX_Category_${catSlug}.pdf`;
    title = 'Category Achievement Report';
    subtitle = `${cat.categoryTitle} • ${cat.reportingPeriodText}`;
    periodOrProg = cat.reportingPeriodText;
    totalRecs = cat.verifiedAchievementsCount;
    totalPts = cat.totalPoints;
  } else {
    const cust = reportData as CustomReportData;
    html = buildCustomHtml(cust);
    const timeSlug = Date.now().toString().slice(-6);
    fileName = `AchieveX_Custom_Report_${timeSlug}.pdf`;
    title = 'Custom Achievement Report';
    subtitle = cust.reportScopeText;
    periodOrProg = cust.reportScopeText;
    totalRecs = cust.recordsCount;
    totalPts = cust.totalPoints;
  }

  // Compile real native PDF via expo-print
  const { uri } = await Print.printToFileAsync({ html });

  const reportItem: GeneratedReportItem = {
    id: `rep_${Date.now()}`,
    type,
    title,
    subtitle,
    fileName,
    fileUri: uri,
    generatedAt: 'Just now',
    periodOrProgram: periodOrProg,
    totalRecords: totalRecs,
    totalPoints: totalPts,
  };

  addRecentReport(reportItem);

  return { fileUri: uri, fileName, reportItem };
}

export async function previewReportPDF(fileUri: string) {
  if (!fileUri) return;
  await Print.printAsync({ uri: fileUri });
}

export async function shareReportPDF(fileUri: string, dialogTitle: string = 'Share Report PDF') {
  if (!fileUri) return;
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      dialogTitle,
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  } else {
    throw new Error('Sharing not available on this device');
  }
}
