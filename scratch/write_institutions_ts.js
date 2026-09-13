const fs = require('fs');
const path = require('path');

const parsed = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed_institutions.json'), 'utf-8'));

// Format as TypeScript file
let code = `// ─────────────────────────────────────────────────────────────
// AchieveX — Centralized Tamil Nadu College Directory
// Initial seed data compiled from TNEA & TNGASA/DCE directory.
// Ready for future backend/database integration.
// ─────────────────────────────────────────────────────────────

export type InstitutionType = 'engineering' | 'arts_science';

export interface Institution {
  id: string;
  name: string;
  institutionType: InstitutionType;
  district: string;
  sourceType: 'TNEA' | 'TNGASA_DCE';
  isActive: boolean;
  isOnboarded: boolean;
  activationCode?: string;
}

export interface InstitutionTypeOption {
  label: string;
  value: InstitutionType;
}

export const INSTITUTION_TYPE_OPTIONS: InstitutionTypeOption[] = [
  { label: 'Engineering College', value: 'engineering' },
  { label: 'Arts & Science College', value: 'arts_science' },
];

export const INSTITUTIONS: Institution[] = ${JSON.stringify(parsed, null, 2)};

/**
 * Returns available institution types for selector
 */
export function getInstitutionTypes(): InstitutionTypeOption[] {
  return INSTITUTION_TYPE_OPTIONS;
}

/**
 * Returns distinct districts that have institutions of the specified type.
 */
export function getDistricts(type?: InstitutionType): string[] {
  const filtered = type
    ? INSTITUTIONS.filter((inst) => inst.institutionType === type && inst.isActive)
    : INSTITUTIONS.filter((inst) => inst.isActive);

  const districtSet = new Set<string>();
  for (const inst of filtered) {
    districtSet.add(inst.district);
  }

  return Array.from(districtSet).sort();
}

/**
 * Returns institutions matching both institutionType and district.
 * Only returns active institutions.
 */
export function getInstitutions(type: InstitutionType, district: string): Institution[] {
  if (!type || !district) return [];
  const normalizedDistrict = district.trim().toLowerCase();
  return INSTITUTIONS.filter(
    (inst) =>
      inst.institutionType === type &&
      inst.district.toLowerCase() === normalizedDistrict &&
      inst.isActive
  );
}

/**
 * Searches institutions within a selected type and district.
 */
export function searchInstitutions(
  type: InstitutionType,
  district: string,
  query: string
): Institution[] {
  const list = getInstitutions(type, district);
  if (!query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter((inst) => inst.name.toLowerCase().includes(q));
}

/**
 * Looks up institution by ID
 */
export function getInstitutionById(id: string): Institution | undefined {
  return INSTITUTIONS.find((inst) => inst.id === id);
}

/**
 * Looks up institution by exact or normalized name
 */
export function getInstitutionByName(name: string): Institution | undefined {
  const norm = name.trim().toLowerCase();
  return INSTITUTIONS.find((inst) => inst.name.toLowerCase() === norm);
}

/**
 * Activation validation function compatible with existing Create Account flow.
 */
export function validateInstitutionActivation(
  collegeName: string,
  inputCode: string
): { valid: boolean; institutionId: string; collegeCode: string; message?: string } {
  const trimmedCode = inputCode.trim().toUpperCase();
  const inst = getInstitutionByName(collegeName);

  if (!inst) {
    if (trimmedCode.length >= 4) {
      return {
        valid: true,
        institutionId: 'inst_custom',
        collegeCode: 'CUSTOM',
      };
    }
    return {
      valid: false,
      institutionId: '',
      collegeCode: '',
      message: 'Please select a valid institution from the list.',
    };
  }

  // Check matched college activation code or universal demo codes
  const isMatch =
    trimmedCode === 'ACHIEVE2026' ||
    trimmedCode === 'NANDHA2026' ||
    (inst.activationCode && trimmedCode === inst.activationCode.toUpperCase()) ||
    trimmedCode === 'DEMO2026';

  if (isMatch) {
    return {
      valid: true,
      institutionId: inst.id,
      collegeCode: 'ACHIEVE',
    };
  }

  return {
    valid: false,
    institutionId: inst.id,
    collegeCode: 'ACHIEVE',
    message: \`Invalid activation code for \${inst.name}. Expected code format e.g. NANDHA2026\`,
  };
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'institutions.ts'), code, 'utf-8');
console.log('Generated src/data/institutions.ts successfully.');
