const fs = require('fs');

const parsed = JSON.parse(fs.readFileSync('scratch/parsed_programs.json', 'utf8'));

// Enhance departmentName mapping for AchieveX
parsed.forEach(p => {
  if (p.displayName === 'B.E. Computer Science and Engineering (Internet of Things)') {
    p.departmentName = 'CSE (IoT)';
  } else if (p.displayName === 'B.E. Computer Science and Engineering') {
    p.departmentName = 'CSE';
  } else if (p.displayName === 'B.E. Computer Science and Engineering (Cyber Security)') {
    p.departmentName = 'CSE (Cyber Security)';
  } else if (p.displayName === 'B.Tech. Information Technology') {
    p.departmentName = 'IT';
  } else if (p.displayName === 'B.Tech. Artificial Intelligence and Data Science') {
    p.departmentName = 'AI & DS';
  } else if (p.displayName === 'B.E. Electronics and Communication Engineering') {
    p.departmentName = 'ECE';
  } else if (p.displayName === 'B.E. Electrical and Electronics Engineering') {
    p.departmentName = 'EEE';
  } else if (p.displayName === 'B.E. Biomedical Engineering') {
    p.departmentName = 'BME';
  } else if (p.displayName === 'B.E. Mechanical Engineering') {
    p.departmentName = 'Mechanical Engineering';
  } else if (p.displayName === 'B.E. Civil Engineering') {
    p.departmentName = 'Civil Engineering';
  } else if (p.category === 'engineering') {
    p.departmentName = p.shortName;
  } else {
    p.departmentName = p.shortName;
  }
});

const fileHeader = `// ─────────────────────────────────────────────────────────────
// AchieveX — Tamil Nadu Engineering + Arts & Science Course Master
// Centralized programme catalogue and institution mapping.
// Compatible with future database tables: \`programs\` & \`institution_programs\`
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
  departmentName?: string;
  category: ProgramCategory;
  level: ProgramLevel;
  departmentId?: string;
  isActive: boolean;
}

export interface InstitutionProgram {
  id: string;
  institutionId: string;
  programId: string;
  departmentId?: string;
  isActive: boolean;
}

/**
 * Master Course / Programme Catalogue
 * 202 accredited courses across Engineering and Arts & Science disciplines in Tamil Nadu.
 */
export const PROGRAMS: Program[] = ${JSON.stringify(parsed, null, 2)};
`;

const nandhaProgramIds = [
  'prog_b_e_computer_science_and_engineering_internet_of_things',
  'prog_b_e_computer_science_and_engineering',
  'prog_b_tech_information_technology',
  'prog_b_tech_artificial_intelligence_and_data_science',
  'prog_b_e_electronics_and_communication_engineering',
  'prog_b_e_electrical_and_electronics_engineering',
  'prog_b_e_biomedical_engineering',
  'prog_b_e_mechanical_engineering',
  'prog_b_e_civil_engineering',
  'prog_b_e_computer_science_and_engineering_cyber_security',
  'prog_b_e_computer_science_and_engineering_artificial_intelligence_and_machine_learning',
  'prog_b_tech_computer_science_and_business_systems',
  'prog_b_tech_agricultural_engineering',
  'prog_b_tech_chemical_engineering',
  'prog_b_tech_biotechnology',
];

const konguProgramIds = [
  'prog_b_e_civil_engineering',
  'prog_b_e_mechanical_engineering',
  'prog_b_e_mechatronics_engineering',
  'prog_b_e_electrical_and_electronics_engineering',
  'prog_b_e_electronics_and_communication_engineering',
  'prog_b_e_computer_science_and_engineering',
  'prog_b_tech_information_technology',
  'prog_b_tech_artificial_intelligence_and_data_science',
  'prog_b_tech_chemical_engineering',
  'prog_b_tech_food_technology',
];

const bannariProgramIds = [
  'prog_b_e_aeronautical_engineering',
  'prog_b_tech_agricultural_engineering',
  'prog_b_tech_biotechnology',
  'prog_b_e_civil_engineering',
  'prog_b_e_computer_science_and_engineering',
  'prog_b_e_electronics_and_communication_engineering',
  'prog_b_e_electrical_and_electronics_engineering',
  'prog_b_tech_fashion_technology',
  'prog_b_tech_information_technology',
  'prog_b_e_mechanical_engineering',
  'prog_b_e_mechatronics_engineering',
];

const psgProgramIds = [
  'prog_b_e_automobile_engineering',
  'prog_b_e_biomedical_engineering',
  'prog_b_e_civil_engineering',
  'prog_b_e_computer_science_and_engineering',
  'prog_b_e_electrical_and_electronics_engineering',
  'prog_b_e_electronics_and_communication_engineering',
  'prog_b_e_mechanical_engineering',
  'prog_b_e_production_engineering',
  'prog_b_e_robotics_and_automation',
  'prog_b_tech_textile_technology',
];

const presidencyProgramIds = [
  'prog_b_a_tamil',
  'prog_b_a_english',
  'prog_b_a_history',
  'prog_b_a_economics',
  'prog_b_a_political_science',
  'prog_b_sc_mathematics',
  'prog_b_sc_physics',
  'prog_b_sc_chemistry',
  'prog_b_sc_botany',
  'prog_b_sc_zoology',
  'prog_b_sc_computer_science',
  'prog_b_com',
  'prog_b_com_corporate_secretaryship',
];

const govtArtsCoimbatoreProgramIds = [
  'prog_b_a_tamil',
  'prog_b_a_english',
  'prog_b_a_history',
  'prog_b_a_economics',
  'prog_b_sc_mathematics',
  'prog_b_sc_physics',
  'prog_b_sc_chemistry',
  'prog_b_sc_botany',
  'prog_b_sc_zoology',
  'prog_b_sc_computer_science',
  'prog_b_sc_information_technology',
  'prog_b_c_a_bachelor_of_computer_applications',
  'prog_b_com',
  'prog_b_com_computer_applications',
  'prog_b_b_a',
];

const institutionPrograms = [
  ...nandhaProgramIds.map((pid, idx) => ({
    id: `ip_nandha_${idx + 1}`,
    institutionId: 'inst_nandha_engineering_college_176',
    programId: pid,
    isActive: true,
  })),
  ...konguProgramIds.map((pid, idx) => ({
    id: `ip_kongu_${idx + 1}`,
    institutionId: 'inst_kongu_engineering_college_174',
    programId: pid,
    isActive: true,
  })),
  ...bannariProgramIds.map((pid, idx) => ({
    id: `ip_bit_${idx + 1}`,
    institutionId: 'inst_bannari_amman_institute_of_technology_171',
    programId: pid,
    isActive: true,
  })),
  ...psgProgramIds.map((pid, idx) => ({
    id: `ip_psg_${idx + 1}`,
    institutionId: 'inst_p_s_g_college_of_technology_38',
    programId: pid,
    isActive: true,
  })),
  ...presidencyProgramIds.map((pid, idx) => ({
    id: `ip_presidency_${idx + 1}`,
    institutionId: 'inst_presidency_college_autonomous_28',
    programId: pid,
    isActive: true,
  })),
  ...govtArtsCoimbatoreProgramIds.map((pid, idx) => ({
    id: `ip_gacc_${idx + 1}`,
    institutionId: 'inst_government_arts_college_autonomous_coimb_96',
    programId: pid,
    isActive: true,
  })),
];

const fileFooter = `
/**
 * Centralized mapping between institutions and the programmes they offer.
 * Designed to be replaced by \`institution_programs\` database table.
 */
export const INSTITUTION_PROGRAMS: InstitutionProgram[] = ${JSON.stringify(institutionPrograms, null, 2)};

/**
 * Returns the list of programmes configured for a specific institution.
 * Returns an empty array if the institution has no configured courses.
 */
export function getProgramsForInstitution(institutionId: string): Program[] {
  if (!institutionId) return [];
  const mapped = INSTITUTION_PROGRAMS.filter(
    (ip) => ip.institutionId === institutionId && ip.isActive
  );
  if (mapped.length === 0) return [];
  const programMap = new Map(PROGRAMS.map((p) => [p.id, p]));
  return mapped
    .map((ip) => programMap.get(ip.programId))
    .filter((p): p is Program => p !== undefined && p.isActive);
}

/**
 * Searches programmes configured for an institution by course name/specialization.
 */
export function searchProgramsForInstitution(
  institutionId: string,
  query: string
): Program[] {
  const list = getProgramsForInstitution(institutionId);
  if (!query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(
    (p) =>
      p.displayName.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      (p.specialization && p.specialization.toLowerCase().includes(q))
  );
}

/**
 * Looks up a programme by ID.
 */
export function getProgramById(programId: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === programId);
}

/**
 * Looks up a programme by exact display name.
 */
export function getProgramByName(displayName: string): Program | undefined {
  const norm = displayName.trim().toLowerCase();
  return PROGRAMS.find((p) => p.displayName.toLowerCase() === norm);
}

/**
 * Returns all master programmes, optionally filtered by category.
 */
export function getAllPrograms(category?: ProgramCategory): Program[] {
  if (!category) return PROGRAMS;
  return PROGRAMS.filter((p) => p.category === category);
}
`;

fs.writeFileSync('src/data/programs.ts', fileHeader + fileFooter);
console.log('Successfully wrote src/data/programs.ts!');
