import * as fs from 'fs';
import * as path from 'path';
import { ALL_ITEMS } from './generate_final_master';

function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
}

// Generate the programs array
const programs = ALL_ITEMS.map((item, index) => {
  const id = `prog_${generateSlug(item.displayName)}_${index + 1}`;
  return {
    id,
    degree: item.degree,
    name: item.name,
    specialization: item.specialization,
    displayName: item.displayName,
    shortName: item.shortName,
    aliases: item.aliases,
    category: item.category,
    group: item.group,
    level: 'UG' as const,
    source: item.source,
    isActive: true,
  };
});

const fileHeader = `// ─────────────────────────────────────────────────────────────
// AchieveX — Verified Tamil Nadu Department & Course Master
// Compiled from official university sources:
// - Anna University (B.E./B.Tech/B.Arch/B.Plan/B.Des curricula)
// - Bharathiar University (UG affiliated-college catalogue)
// - Bharathidasan University (UG syllabus catalogue)
// ─────────────────────────────────────────────────────────────

export type ProgramCategory = 'engineering' | 'arts_science';
export type ProgramLevel = 'UG' | 'PG';

export interface Program {
  id: string;
  degree: string;
  name: string;
  specialization?: string;
  displayName: string;
  shortName: string;
  aliases?: string[];
  departmentName?: string;
  category: ProgramCategory;
  group: string;
  level: ProgramLevel;
  source?: string;
  isActive: boolean;
}

export interface CustomProgramSelection {
  programId: null;
  customProgramName: string;
  isCustom: true;
}

/**
 * Standard option appended to the department selector allowing custom entry.
 */
export const OTHER_PROGRAM_OPTION = {
  id: 'other',
  displayName: 'Other / Course Not Listed',
  shortName: 'Other',
  category: 'arts_science' as ProgramCategory,
  group: 'OTHER',
  level: 'UG' as ProgramLevel,
  isActive: true,
};

/**
 * Master Course / Programme Catalogue
 * ${programs.length} verified UG accredited courses across Tamil Nadu colleges.
 */
export const PROGRAMS: Program[] = ${JSON.stringify(programs, null, 2)};

/**
 * Look up a programme by unique ID.
 */
export function getProgramById(programId: string): Program | undefined {
  if (programId === 'other') {
    return OTHER_PROGRAM_OPTION as Program;
  }
  return PROGRAMS.find((p) => p.id === programId);
}

/**
 * Look up a programme by exact display name (case-insensitive).
 */
export function getProgramByName(displayName: string): Program | undefined {
  const norm = displayName.trim().toLowerCase();
  return PROGRAMS.find(
    (p) =>
      p.displayName.toLowerCase() === norm ||
      p.aliases?.some((a) => a.toLowerCase() === norm)
  );
}

/**
 * Returns all master programmes, optionally filtered by category.
 */
export function getAllPrograms(category?: ProgramCategory): Program[] {
  if (!category) return PROGRAMS;
  return PROGRAMS.filter((p) => p.category === category);
}

/**
 * Returns the navigation group heading for a programme.
 */
export function getProgramGroup(p: Program): string {
  if (p.group) return p.group;
  if (p.category === 'engineering') return 'TECHNOLOGY';
  if (p.degree === 'B.Com.') return 'COMMERCE';
  if (p.degree === 'B.B.A.') return 'MANAGEMENT';
  return 'SCIENCE';
}

/**
 * Search programmes across display name, short name, degree, and aliases.
 */
export function searchPrograms(query: string, category?: ProgramCategory): Program[] {
  const q = query.trim().toLowerCase();
  const list = category ? getAllPrograms(category) : PROGRAMS;
  if (!q) return list;

  return list.filter((p) => {
    if (p.displayName.toLowerCase().includes(q)) return true;
    if (p.shortName.toLowerCase().includes(q)) return true;
    if (p.degree.toLowerCase().includes(q)) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.specialization && p.specialization.toLowerCase().includes(q)) return true;
    if (p.aliases && p.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * Backwards-compatibility helper for institution-specific programs.
 */
export function getProgramsForInstitution(institutionId?: string): Program[] {
  return PROGRAMS;
}

export function searchProgramsForInstitution(
  institutionId: string,
  query: string
): Program[] {
  return searchPrograms(query);
}

/**
 * Flat array of all distinct course display names.
 */
export const PROGRAM_NAMES: string[] = PROGRAMS.map((p) => p.displayName);
`;

const outputPath = path.join(__dirname, '../src/data/programs.ts');
fs.writeFileSync(outputPath, fileHeader, 'utf-8');
console.log('Successfully written to:', outputPath);
console.log('Total programmes:', programs.length);
