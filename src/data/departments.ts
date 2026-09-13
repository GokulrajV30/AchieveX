// ─────────────────────────────────────────────────────────────
// AchieveX — Centralized Departments Master
// Derived from programs.ts master catalogue.
// ─────────────────────────────────────────────────────────────

import { PROGRAMS, PROGRAM_NAMES } from './programs';

/**
 * All verified course display names (198+ accredited programmes)
 */
export const ALL_DEPARTMENTS: string[] = PROGRAM_NAMES;

/**
 * Common short codes / department identifiers for compact filter chips
 */
export const DEPARTMENT_SHORT_CODES: string[] = Array.from(
  new Set(PROGRAMS.map((p) => p.shortName))
);

/**
 * Full master list of departments across AchieveX
 */
export const DEPARTMENTS: string[] = PROGRAM_NAMES;

export default DEPARTMENTS;
