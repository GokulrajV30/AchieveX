// ─────────────────────────────────────────────────────────────
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
 * 198 verified UG accredited courses across Tamil Nadu colleges.
 */
export const PROGRAMS: Program[] = [
  {
    "id": "prog_b_e_civil_engineering_1",
    "degree": "B.E.",
    "name": "Civil Engineering",
    "displayName": "B.E. Civil Engineering",
    "shortName": "CIVIL",
    "aliases": [
      "Civil",
      "Civil Engg",
      "BE Civil",
      "B.E Civil"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_geoinformatics_engineering_2",
    "degree": "B.E.",
    "name": "Geoinformatics Engineering",
    "displayName": "B.E. Geoinformatics Engineering",
    "shortName": "GEO",
    "aliases": [
      "B.E. Geo Informatics Engineering",
      "Geo Informatics",
      "Geoinformatics",
      "GIS",
      "Remote Sensing"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_environmental_engineering_3",
    "degree": "B.E.",
    "name": "Environmental Engineering",
    "displayName": "B.E. Environmental Engineering",
    "shortName": "ENV",
    "aliases": [
      "Environmental",
      "BE Environmental",
      "B.E Environmental Engineering"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_civil_engineering_environmental_engineering_4",
    "degree": "B.E.",
    "name": "Civil Engineering",
    "specialization": "Environmental Engineering",
    "displayName": "B.E. Civil Engineering (Environmental Engineering)",
    "shortName": "CIVIL (Env)",
    "aliases": [
      "Civil Environmental",
      "B.E. Civil (Environmental Engineering)"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_environmental_science_and_technology_5",
    "degree": "B.E.",
    "name": "Environmental Science and Technology",
    "displayName": "B.E. Environmental Science and Technology",
    "shortName": "EST",
    "aliases": [
      "Environmental Science and Technology",
      "EST"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_arch_architecture_6",
    "degree": "B.Arch.",
    "name": "Architecture",
    "displayName": "B.Arch. Architecture",
    "shortName": "B.Arch",
    "aliases": [
      "B.Arch.",
      "B.Arch",
      "Architecture",
      "Bachelor of Architecture"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_plan_bachelor_of_planning_7",
    "degree": "B.Plan.",
    "name": "Planning",
    "displayName": "B.Plan. Bachelor of Planning",
    "shortName": "B.Plan",
    "aliases": [
      "B.Plan.",
      "B.Plan",
      "Bachelor of Planning",
      "Town Planning",
      "Urban Planning"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_des_bachelor_of_design_8",
    "degree": "B.Des.",
    "name": "Design",
    "displayName": "B.Des. Bachelor of Design",
    "shortName": "B.Des",
    "aliases": [
      "B.Des.",
      "B.Des",
      "Bachelor of Design",
      "Design"
    ],
    "category": "engineering",
    "group": "CIVIL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_mechanical_engineering_9",
    "degree": "B.E.",
    "name": "Mechanical Engineering",
    "displayName": "B.E. Mechanical Engineering",
    "shortName": "MECH",
    "aliases": [
      "Mechanical",
      "Mech Engg",
      "BE Mechanical",
      "B.E Mech",
      "MECH"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_materials_science_and_engineering_10",
    "degree": "B.E.",
    "name": "Materials Science and Engineering",
    "displayName": "B.E. Materials Science and Engineering",
    "shortName": "MSE",
    "aliases": [
      "Materials Science",
      "Materials Engineering",
      "MSE"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_mining_engineering_11",
    "degree": "B.E.",
    "name": "Mining Engineering",
    "displayName": "B.E. Mining Engineering",
    "shortName": "MINING",
    "aliases": [
      "Mining",
      "Mining Engg"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_printing_and_packaging_technology_12",
    "degree": "B.E.",
    "name": "Printing and Packaging Technology",
    "displayName": "B.E. Printing and Packaging Technology",
    "shortName": "PRINT",
    "aliases": [
      "Printing Technology",
      "Packaging Technology",
      "Printing and Packaging"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_manufacturing_engineering_13",
    "degree": "B.E.",
    "name": "Manufacturing Engineering",
    "displayName": "B.E. Manufacturing Engineering",
    "shortName": "MFG",
    "aliases": [
      "Manufacturing",
      "Manufacturing Engg"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_industrial_engineering_14",
    "degree": "B.E.",
    "name": "Industrial Engineering",
    "displayName": "B.E. Industrial Engineering",
    "shortName": "IE",
    "aliases": [
      "Industrial",
      "Industrial Engg",
      "IE"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_aeronautical_engineering_15",
    "degree": "B.E.",
    "name": "Aeronautical Engineering",
    "displayName": "B.E. Aeronautical Engineering",
    "shortName": "AERO",
    "aliases": [
      "Aeronautical",
      "Aero Engg",
      "Aeronautics"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_automobile_engineering_16",
    "degree": "B.E.",
    "name": "Automobile Engineering",
    "displayName": "B.E. Automobile Engineering",
    "shortName": "AUTO",
    "aliases": [
      "Automobile",
      "Auto Engg",
      "Automotive"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_production_engineering_17",
    "degree": "B.E.",
    "name": "Production Engineering",
    "displayName": "B.E. Production Engineering",
    "shortName": "PROD",
    "aliases": [
      "Production",
      "Production Engg"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_robotics_and_automation_engineering_18",
    "degree": "B.E.",
    "name": "Robotics and Automation Engineering",
    "displayName": "B.E. Robotics and Automation Engineering",
    "shortName": "ROBOTICS",
    "aliases": [
      "B.E. Robotics and Automation",
      "Robotics",
      "Automation",
      "Robotics Engineering",
      "Robotics and Automation"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_mechatronics_engineering_19",
    "degree": "B.E.",
    "name": "Mechatronics Engineering",
    "displayName": "B.E. Mechatronics Engineering",
    "shortName": "MECHATRONICS",
    "aliases": [
      "Mechatronics",
      "Mechatronics Engg"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_mechanical_and_automation_engineering_20",
    "degree": "B.E.",
    "name": "Mechanical and Automation Engineering",
    "displayName": "B.E. Mechanical and Automation Engineering",
    "shortName": "MAE",
    "aliases": [
      "Mechanical and Automation",
      "MAE"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_industrial_engineering_and_management_21",
    "degree": "B.E.",
    "name": "Industrial Engineering and Management",
    "displayName": "B.E. Industrial Engineering and Management",
    "shortName": "IEM",
    "aliases": [
      "IEM",
      "Industrial Management"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_marine_engineering_22",
    "degree": "B.E.",
    "name": "Marine Engineering",
    "displayName": "B.E. Marine Engineering",
    "shortName": "MARINE",
    "aliases": [
      "Marine",
      "Marine Engg",
      "Nautical"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_aerospace_engineering_23",
    "degree": "B.E.",
    "name": "Aerospace Engineering",
    "displayName": "B.E. Aerospace Engineering",
    "shortName": "AEROSPACE",
    "aliases": [
      "Aerospace",
      "Aerospace Engg"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_mechanical_engineering_specialized_in_automobi_24",
    "degree": "B.E.",
    "name": "Mechanical Engineering",
    "specialization": "Automobile",
    "displayName": "B.E. Mechanical Engineering (Specialized in Automobile)",
    "shortName": "MECH (Auto)",
    "aliases": [
      "Mechanical Automobile",
      "B.E. Mechanical (Automobile)"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_mechanical_engineering_specialized_in_smart_ma_25",
    "degree": "B.E.",
    "name": "Mechanical Engineering",
    "specialization": "Smart Manufacturing",
    "displayName": "B.E. Mechanical Engineering (Specialized in Smart Manufacturing)",
    "shortName": "MECH (Smart Mfg)",
    "aliases": [
      "Smart Manufacturing",
      "Industry 4.0",
      "B.E. Mechanical (Smart Manufacturing)"
    ],
    "category": "engineering",
    "group": "MECHANICAL",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electrical_and_electronics_engineering_26",
    "degree": "B.E.",
    "name": "Electrical and Electronics Engineering",
    "displayName": "B.E. Electrical and Electronics Engineering",
    "shortName": "EEE",
    "aliases": [
      "EEE",
      "Electrical",
      "B.E EEE",
      "Electrical & Electronics",
      "BE EEE"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electrical_and_computer_engineering_27",
    "degree": "B.E.",
    "name": "Electrical and Computer Engineering",
    "displayName": "B.E. Electrical and Computer Engineering",
    "shortName": "ECompE",
    "aliases": [
      "Electrical and Computer",
      "ECompE"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electronics_and_instrumentation_engineering_28",
    "degree": "B.E.",
    "name": "Electronics and Instrumentation Engineering",
    "displayName": "B.E. Electronics and Instrumentation Engineering",
    "shortName": "EIE",
    "aliases": [
      "EIE",
      "Instrumentation",
      "Electronics & Instrumentation"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_instrumentation_and_control_engineering_29",
    "degree": "B.E.",
    "name": "Instrumentation and Control Engineering",
    "displayName": "B.E. Instrumentation and Control Engineering",
    "shortName": "ICE",
    "aliases": [
      "ICE",
      "Instrumentation and Control",
      "Instrumentation & Control"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electrical_and_electronics_engineering_trainin_30",
    "degree": "B.E.",
    "name": "Electrical and Electronics Engineering",
    "specialization": "Training Integrated Programme",
    "displayName": "B.E. Electrical and Electronics Engineering (Training Integrated Programme)",
    "shortName": "EEE (Sandwich)",
    "aliases": [
      "EEE Training Integrated",
      "EEE Sandwich",
      "B.E. EEE (Training Integrated Programme)"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electronics_and_communication_engineering_31",
    "degree": "B.E.",
    "name": "Electronics and Communication Engineering",
    "displayName": "B.E. Electronics and Communication Engineering",
    "shortName": "ECE",
    "aliases": [
      "ECE",
      "Electronics",
      "Electronics & Communication",
      "B.E ECE",
      "BE ECE"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_biomedical_engineering_32",
    "degree": "B.E.",
    "name": "Biomedical Engineering",
    "displayName": "B.E. Biomedical Engineering",
    "shortName": "BME",
    "aliases": [
      "BME",
      "Biomedical",
      "Biomedical Engg",
      "B.E BME",
      "BE BME"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_medical_electronics_33",
    "degree": "B.E.",
    "name": "Medical Electronics",
    "displayName": "B.E. Medical Electronics",
    "shortName": "MedElec",
    "aliases": [
      "Medical Electronics"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electronics_and_computer_engineering_34",
    "degree": "B.E.",
    "name": "Electronics and Computer Engineering",
    "displayName": "B.E. Electronics and Computer Engineering",
    "shortName": "ECE (Comp)",
    "aliases": [
      "Electronics and Computer",
      "Electronics & Computer"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_electronics_and_telecommunication_engineering_35",
    "degree": "B.E.",
    "name": "Electronics and Telecommunication Engineering",
    "displayName": "B.E. Electronics and Telecommunication Engineering",
    "shortName": "ETE",
    "aliases": [
      "Telecommunication",
      "Telecommunication Engg",
      "ETE"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_electronics_engineering_vlsi_design_and_tec_36",
    "degree": "B.Tech.",
    "name": "Electronics Engineering",
    "specialization": "VLSI Design and Technology",
    "displayName": "B.Tech. Electronics Engineering (VLSI Design and Technology)",
    "shortName": "VLSI",
    "aliases": [
      "VLSI",
      "VLSI Design",
      "B.Tech VLSI",
      "B.E. VLSI",
      "Electronics Engineering VLSI",
      "VLSI Design and Technology"
    ],
    "category": "engineering",
    "group": "ELECTRICAL / ELECTRONICS",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_engineering_37",
    "degree": "B.E.",
    "name": "Computer Science and Engineering",
    "displayName": "B.E. Computer Science and Engineering",
    "shortName": "CSE",
    "aliases": [
      "CSE",
      "Computer Science",
      "BE CSE",
      "B.E CSE",
      "CS",
      "Computer Science and Engineering"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_and_communication_engineering_38",
    "degree": "B.E.",
    "name": "Computer and Communication Engineering",
    "displayName": "B.E. Computer and Communication Engineering",
    "shortName": "CCE",
    "aliases": [
      "CCE",
      "Computer and Communication",
      "Computer & Communication"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_engineering_data_science_39",
    "degree": "B.E.",
    "name": "Computer Science and Engineering",
    "specialization": "Data Science",
    "displayName": "B.E. Computer Science and Engineering (Data Science)",
    "shortName": "CSE (DS)",
    "aliases": [
      "CSE DS",
      "CSE Data Science",
      "Data Science Engineering",
      "B.E. CSE (Data Science)"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_engineering_cyber_securit_40",
    "degree": "B.E.",
    "name": "Computer Science and Engineering",
    "specialization": "Cyber Security",
    "displayName": "B.E. Computer Science and Engineering (Cyber Security)",
    "shortName": "CSE (CS)",
    "aliases": [
      "CSE CS",
      "CSE Cyber Security",
      "Cyber Security",
      "Cyber",
      "B.E. CSE (Cyber Security)"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_engineering_internet_of_t_41",
    "degree": "B.E.",
    "name": "Computer Science and Engineering",
    "specialization": "Internet of Things",
    "displayName": "B.E. Computer Science and Engineering (Internet of Things)",
    "shortName": "CSE (IoT)",
    "aliases": [
      "CSE IoT",
      "CSE (IoT)",
      "IoT",
      "Internet of Things",
      "B.E. CSE (IoT)",
      "B.E. CSE (Internet of Things)"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_engineering_artificial_in_42",
    "degree": "B.E.",
    "name": "Computer Science and Engineering",
    "specialization": "Artificial Intelligence",
    "displayName": "B.E. Computer Science and Engineering (Artificial Intelligence)",
    "shortName": "CSE (AI)",
    "aliases": [
      "CSE AI",
      "CSE Artificial Intelligence",
      "AI Engineering",
      "B.E. CSE (AI)"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_engineering_artificial_in_43",
    "degree": "B.E.",
    "name": "Computer Science and Engineering",
    "specialization": "Artificial Intelligence and Machine Learning",
    "displayName": "B.E. Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
    "shortName": "CSE (AIML)",
    "aliases": [
      "CSE AIML",
      "CSE AI ML",
      "AI and Machine Learning",
      "AIML",
      "B.E. CSE (AIML)"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_computer_science_and_design_44",
    "degree": "B.E.",
    "name": "Computer Science and Design",
    "displayName": "B.E. Computer Science and Design",
    "shortName": "CSD",
    "aliases": [
      "CSD",
      "Computer Science and Design",
      "CS and Design"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_information_technology_45",
    "degree": "B.Tech.",
    "name": "Information Technology",
    "displayName": "B.Tech. Information Technology",
    "shortName": "IT",
    "aliases": [
      "IT",
      "Info Tech",
      "B.Tech IT",
      "B.Tech Information Technology",
      "Information Technology"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_artificial_intelligence_and_data_science_46",
    "degree": "B.Tech.",
    "name": "Artificial Intelligence and Data Science",
    "displayName": "B.Tech. Artificial Intelligence and Data Science",
    "shortName": "AI & DS",
    "aliases": [
      "AIDS",
      "AI & DS",
      "AI and Data Science",
      "B.Tech AIDS",
      "B.Tech AI & DS",
      "Artificial Intelligence & Data Science"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_artificial_intelligence_and_machine_learnin_47",
    "degree": "B.Tech.",
    "name": "Artificial Intelligence and Machine Learning",
    "displayName": "B.Tech. Artificial Intelligence and Machine Learning",
    "shortName": "AI & ML",
    "aliases": [
      "AIML",
      "AI & ML",
      "AI and Machine Learning",
      "B.Tech AIML",
      "B.Tech AI & ML",
      "Artificial Intelligence & Machine Learning"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_computer_science_and_business_systems_48",
    "degree": "B.Tech.",
    "name": "Computer Science and Business Systems",
    "displayName": "B.Tech. Computer Science and Business Systems",
    "shortName": "CSBS",
    "aliases": [
      "CSBS",
      "CS and Business Systems",
      "B.Tech CSBS",
      "TCS CSBS"
    ],
    "category": "engineering",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_agricultural_engineering_49",
    "degree": "B.Tech.",
    "name": "Agricultural Engineering",
    "displayName": "B.Tech. Agricultural Engineering",
    "shortName": "AGRI",
    "aliases": [
      "Agri",
      "Agricultural",
      "B.Tech Agri",
      "B.Tech Agricultural Engineering"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_chemical_engineering_50",
    "degree": "B.Tech.",
    "name": "Chemical Engineering",
    "displayName": "B.Tech. Chemical Engineering",
    "shortName": "CHEM",
    "aliases": [
      "Chemical",
      "Chem Engg",
      "B.Tech Chemical Engineering"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_chemical_and_electrochemical_engineering_51",
    "degree": "B.Tech.",
    "name": "Chemical and Electrochemical Engineering",
    "displayName": "B.Tech. Chemical and Electrochemical Engineering",
    "shortName": "ELECTROCHEM",
    "aliases": [
      "Electrochemical",
      "B.Tech Chemical and Electrochemical Engineering"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_ceramic_technology_52",
    "degree": "B.Tech.",
    "name": "Ceramic Technology",
    "displayName": "B.Tech. Ceramic Technology",
    "shortName": "CERAMIC",
    "aliases": [
      "Ceramic",
      "Ceramic Technology",
      "B.Tech Ceramic Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_industrial_biotechnology_53",
    "degree": "B.Tech.",
    "name": "Industrial Biotechnology",
    "displayName": "B.Tech. Industrial Biotechnology",
    "shortName": "IND BIOTECH",
    "aliases": [
      "Industrial Biotech",
      "B.Tech Industrial Biotechnology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_biotechnology_54",
    "degree": "B.Tech.",
    "name": "Biotechnology",
    "displayName": "B.Tech. Biotechnology",
    "shortName": "BIOTECH",
    "aliases": [
      "Biotech",
      "Bio-Technology",
      "B.Tech Biotech",
      "B.Tech Biotechnology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_food_technology_55",
    "degree": "B.Tech.",
    "name": "Food Technology",
    "displayName": "B.Tech. Food Technology",
    "shortName": "FOOD TECH",
    "aliases": [
      "Food Tech",
      "Food Technology",
      "B.Tech Food Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_pharmaceutical_technology_56",
    "degree": "B.Tech.",
    "name": "Pharmaceutical Technology",
    "displayName": "B.Tech. Pharmaceutical Technology",
    "shortName": "PHARMA TECH",
    "aliases": [
      "Pharma Tech",
      "Pharmaceutical",
      "B.Tech Pharmaceutical Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_leather_technology_57",
    "degree": "B.Tech.",
    "name": "Leather Technology",
    "displayName": "B.Tech. Leather Technology",
    "shortName": "LEATHER",
    "aliases": [
      "Leather Tech",
      "Leather",
      "B.Tech Leather Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_petroleum_engineering_58",
    "degree": "B.Tech.",
    "name": "Petroleum Engineering",
    "displayName": "B.Tech. Petroleum Engineering",
    "shortName": "PETROLEUM",
    "aliases": [
      "B.Tech. Petroleum Engineering and Technology",
      "Petroleum",
      "Petroleum Engineering",
      "Petroleum Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_petrochemical_technology_59",
    "degree": "B.Tech.",
    "name": "Petrochemical Technology",
    "displayName": "B.Tech. Petrochemical Technology",
    "shortName": "PETROCHEM",
    "aliases": [
      "Petrochemical",
      "Petrochemical Technology",
      "B.Tech Petrochemical Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_e_petrochemical_engineering_60",
    "degree": "B.E.",
    "name": "Petrochemical Engineering",
    "displayName": "B.E. Petrochemical Engineering",
    "shortName": "PETROCHEM ENG",
    "aliases": [
      "Petrochemical Engg",
      "B.E Petrochemical Engineering"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_plastics_technology_61",
    "degree": "B.Tech.",
    "name": "Plastics Technology",
    "displayName": "B.Tech. Plastics Technology",
    "shortName": "PLASTICS",
    "aliases": [
      "B.Tech. Plastic Technology",
      "Plastic Technology",
      "Plastics Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_polymer_technology_62",
    "degree": "B.Tech.",
    "name": "Polymer Technology",
    "displayName": "B.Tech. Polymer Technology",
    "shortName": "POLYMER",
    "aliases": [
      "Polymer",
      "Polymer Technology",
      "B.Tech Polymer Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_rubber_and_plastics_technology_63",
    "degree": "B.Tech.",
    "name": "Rubber and Plastics Technology",
    "displayName": "B.Tech. Rubber and Plastics Technology",
    "shortName": "RUBBER & PLASTICS",
    "aliases": [
      "Rubber Technology",
      "Rubber and Plastics",
      "B.Tech Rubber and Plastics Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_textile_technology_64",
    "degree": "B.Tech.",
    "name": "Textile Technology",
    "displayName": "B.Tech. Textile Technology",
    "shortName": "TEXTILE",
    "aliases": [
      "Textile",
      "Textile Technology",
      "B.Tech Textile Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_textile_chemistry_65",
    "degree": "B.Tech.",
    "name": "Textile Chemistry",
    "displayName": "B.Tech. Textile Chemistry",
    "shortName": "TEXTILE CHEM",
    "aliases": [
      "Textile Chemistry",
      "B.Tech Textile Chemistry"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_fashion_technology_66",
    "degree": "B.Tech.",
    "name": "Fashion Technology",
    "displayName": "B.Tech. Fashion Technology",
    "shortName": "FASHION TECH",
    "aliases": [
      "Fashion Tech",
      "Fashion Technology",
      "B.Tech Fashion Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_apparel_technology_67",
    "degree": "B.Tech.",
    "name": "Apparel Technology",
    "displayName": "B.Tech. Apparel Technology",
    "shortName": "APPAREL TECH",
    "aliases": [
      "Apparel Tech",
      "Apparel Technology",
      "B.Tech Apparel Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_tech_handloom_and_textile_technology_68",
    "degree": "B.Tech.",
    "name": "Handloom and Textile Technology",
    "displayName": "B.Tech. Handloom and Textile Technology",
    "shortName": "HANDLOOM",
    "aliases": [
      "Handloom",
      "Handloom Technology",
      "B.Tech Handloom and Textile Technology"
    ],
    "category": "engineering",
    "group": "TECHNOLOGY",
    "level": "UG",
    "source": "Anna University",
    "isActive": true
  },
  {
    "id": "prog_b_a_tamil_literature_69",
    "degree": "B.A.",
    "name": "Tamil Literature",
    "displayName": "B.A. Tamil Literature",
    "shortName": "BA Tamil Lit",
    "aliases": [
      "B.A. Tamil",
      "Tamil",
      "Tamil Literature",
      "BA Tamil"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_tamil_creative_writing_70",
    "degree": "B.A.",
    "name": "Tamil",
    "specialization": "Creative Writing",
    "displayName": "B.A. Tamil (Creative Writing)",
    "shortName": "BA Tamil CW",
    "aliases": [
      "Tamil Creative Writing",
      "BA Tamil Creative Writing"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_applied_tamil_71",
    "degree": "B.A.",
    "name": "Applied Tamil",
    "displayName": "B.A. Applied Tamil",
    "shortName": "BA Applied Tamil",
    "aliases": [
      "Applied Tamil"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_english_literature_72",
    "degree": "B.A.",
    "name": "English Literature",
    "displayName": "B.A. English Literature",
    "shortName": "BA English Lit",
    "aliases": [
      "B.A. English",
      "English",
      "English Literature",
      "BA English"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_english_literature_with_computer_applications_73",
    "degree": "B.A.",
    "name": "English Literature",
    "specialization": "Computer Applications",
    "displayName": "B.A. English Literature with Computer Applications",
    "shortName": "BA English (CA)",
    "aliases": [
      "English CA",
      "English with Computer Applications",
      "BA English CA"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_history_74",
    "degree": "B.A.",
    "name": "History",
    "displayName": "B.A. History",
    "shortName": "BA History",
    "aliases": [
      "History",
      "BA History"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_sociology_75",
    "degree": "B.A.",
    "name": "Sociology",
    "displayName": "B.A. Sociology",
    "shortName": "BA Sociology",
    "aliases": [
      "Sociology",
      "BA Sociology"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_economics_76",
    "degree": "B.A.",
    "name": "Economics",
    "displayName": "B.A. Economics",
    "shortName": "BA Economics",
    "aliases": [
      "Economics",
      "BA Economics"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_political_science_77",
    "degree": "B.A.",
    "name": "Political Science",
    "displayName": "B.A. Political Science",
    "shortName": "BA Pol Science",
    "aliases": [
      "Political Science",
      "Pol Science",
      "BA Political Science"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_public_administration_78",
    "degree": "B.A.",
    "name": "Public Administration",
    "displayName": "B.A. Public Administration",
    "shortName": "BA Public Admin",
    "aliases": [
      "Public Administration",
      "Public Admin",
      "BA Public Administration"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_tourism_and_travel_management_79",
    "degree": "B.A.",
    "name": "Tourism and Travel Management",
    "displayName": "B.A. Tourism and Travel Management",
    "shortName": "BA Tourism",
    "aliases": [
      "Tourism",
      "Travel Management",
      "Tourism and Travel Management",
      "BA Tourism"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_economics_with_computer_applications_80",
    "degree": "B.A.",
    "name": "Economics",
    "specialization": "Computer Applications",
    "displayName": "B.A. Economics with Computer Applications",
    "shortName": "BA Econ (CA)",
    "aliases": [
      "Economics CA",
      "Economics with CA",
      "BA Economics CA"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_economics_with_banking_and_insurance_81",
    "degree": "B.A.",
    "name": "Economics",
    "specialization": "Banking and Insurance",
    "displayName": "B.A. Economics with Banking and Insurance",
    "shortName": "BA Econ (BI)",
    "aliases": [
      "Economics Banking and Insurance",
      "Economics BI"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_carnatic_music_82",
    "degree": "B.A.",
    "name": "Carnatic Music",
    "displayName": "B.A. Carnatic Music",
    "shortName": "BA Music",
    "aliases": [
      "Carnatic Music",
      "Music",
      "BA Music"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_defence_studies_83",
    "degree": "B.A.",
    "name": "Defence Studies",
    "displayName": "B.A. Defence Studies",
    "shortName": "BA Defence",
    "aliases": [
      "B.A. Defence and Strategic Studies",
      "Defence",
      "Defence Studies",
      "Strategic Studies",
      "BA Defence"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_economics_with_logistics_and_freight_managemen_84",
    "degree": "B.A.",
    "name": "Economics",
    "specialization": "Logistics and Freight Management",
    "displayName": "B.A. Economics with Logistics and Freight Management",
    "shortName": "BA Econ (Logistics)",
    "aliases": [
      "Economics Logistics",
      "Economics Freight Management"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_performing_arts_85",
    "degree": "B.A.",
    "name": "Performing Arts",
    "displayName": "B.A. Performing Arts",
    "shortName": "BA Performing Arts",
    "aliases": [
      "Performing Arts",
      "Drama",
      "Dance",
      "Theatre"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_criminology_86",
    "degree": "B.A.",
    "name": "Criminology",
    "displayName": "B.A. Criminology",
    "shortName": "BA Criminology",
    "aliases": [
      "B.A. Criminology and Police Administration",
      "Criminology",
      "Police Administration",
      "BA Criminology"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_journalism_and_mass_communication_87",
    "degree": "B.A.",
    "name": "Journalism and Mass Communication",
    "displayName": "B.A. Journalism and Mass Communication",
    "shortName": "BA Journalism",
    "aliases": [
      "Journalism",
      "Mass Communication",
      "BA Journalism",
      "BA Mass Comm"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_a_arabic_88",
    "degree": "B.A.",
    "name": "Arabic",
    "displayName": "B.A. Arabic",
    "shortName": "BA Arabic",
    "aliases": [
      "Arabic",
      "BA Arabic"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathidasan University",
    "isActive": true
  },
  {
    "id": "prog_b_a_sanskrit_89",
    "degree": "B.A.",
    "name": "Sanskrit",
    "displayName": "B.A. Sanskrit",
    "shortName": "BA Sanskrit",
    "aliases": [
      "Sanskrit",
      "BA Sanskrit"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathidasan University",
    "isActive": true
  },
  {
    "id": "prog_b_a_afzal_ul_ulama_90",
    "degree": "B.A.",
    "name": "Afzal-Ul-Ulama",
    "displayName": "B.A. Afzal-Ul-Ulama",
    "shortName": "BA Afzal-Ul-Ulama",
    "aliases": [
      "Afzal-Ul-Ulama",
      "Islamic Studies"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathidasan University",
    "isActive": true
  },
  {
    "id": "prog_b_a_literature_91",
    "degree": "B.A.",
    "name": "Literature",
    "displayName": "B.A. Literature",
    "shortName": "BA Literature",
    "aliases": [
      "Literature",
      "BA Literature"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_litt_tamil_92",
    "degree": "B.Litt.",
    "name": "Tamil",
    "displayName": "B.Litt. Tamil",
    "shortName": "B.Litt",
    "aliases": [
      "B.Litt.",
      "B.Litt",
      "B.Litt Tamil",
      "Bachelor of Literature"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_s_w_bachelor_of_social_work_93",
    "degree": "B.S.W.",
    "name": "Social Work",
    "displayName": "B.S.W. Bachelor of Social Work",
    "shortName": "BSW",
    "aliases": [
      "B.S.W.",
      "BSW",
      "Bachelor of Social Work",
      "Social Work"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_s_w_pulavar_degree_94",
    "degree": "B.S.W.",
    "name": "Pulavar Degree",
    "displayName": "B.S.W. Pulavar Degree",
    "shortName": "BSW Pulavar",
    "aliases": [
      "Pulavar",
      "Pulavar Degree"
    ],
    "category": "arts_science",
    "group": "ARTS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_95",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "displayName": "B.B.A.",
    "shortName": "BBA",
    "aliases": [
      "BBA",
      "Bachelor of Business Administration",
      "Business Administration"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_aviation_management_96",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Aviation Management",
    "displayName": "B.B.A. Aviation Management",
    "shortName": "BBA Aviation",
    "aliases": [
      "BBA Aviation",
      "Aviation Management"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_banking_97",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Banking",
    "displayName": "B.B.A. Banking",
    "shortName": "BBA Banking",
    "aliases": [
      "BBA Banking"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_business_process_management_98",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Business Process Management",
    "displayName": "B.B.A. Business Process Management",
    "shortName": "BBA BPM",
    "aliases": [
      "BBA BPM",
      "BPM",
      "Business Process Management"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_information_systems_99",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Information Systems",
    "displayName": "B.B.A. Information Systems",
    "shortName": "BBA IS",
    "aliases": [
      "BBA Information Systems",
      "BBA IS"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_international_business_100",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "International Business",
    "displayName": "B.B.A. International Business",
    "shortName": "BBA IB",
    "aliases": [
      "BBA IB",
      "International Business",
      "BBA International Business"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_logistics_and_supply_chain_management_101",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Logistics and Supply Chain Management",
    "displayName": "B.B.A. Logistics and Supply Chain Management",
    "shortName": "BBA Logistics",
    "aliases": [
      "B.B.A. Logistics",
      "BBA Logistics",
      "Logistics",
      "Supply Chain Management",
      "SCM",
      "Logistics and Supply Chain Management"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_retail_management_102",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Retail Management",
    "displayName": "B.B.A. Retail Management",
    "shortName": "BBA Retail",
    "aliases": [
      "BBA Retail",
      "Retail Management"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_computer_applications_103",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Computer Applications",
    "displayName": "B.B.A. Computer Applications",
    "shortName": "BBA CA",
    "aliases": [
      "BBA CA",
      "BBA Computer Applications"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_financial_management_104",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Financial Management",
    "displayName": "B.B.A. Financial Management",
    "shortName": "BBA FM",
    "aliases": [
      "BBA Finance",
      "Financial Management",
      "BBA FM"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_b_a_investment_105",
    "degree": "B.B.A.",
    "name": "Business Administration",
    "specialization": "Investment",
    "displayName": "B.B.A. Investment",
    "shortName": "BBA Investment",
    "aliases": [
      "BBA Investment",
      "Investment Management"
    ],
    "category": "arts_science",
    "group": "MANAGEMENT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_c_a_bachelor_of_computer_applications_106",
    "degree": "B.C.A.",
    "name": "Computer Applications",
    "displayName": "B.C.A. Bachelor of Computer Applications",
    "shortName": "BCA",
    "aliases": [
      "B.C.A.",
      "BCA",
      "Bachelor of Computer Applications",
      "Computer Applications",
      "CA"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_107",
    "degree": "B.Com.",
    "name": "Commerce",
    "displayName": "B.Com.",
    "shortName": "B.Com",
    "aliases": [
      "B.Com",
      "BCom",
      "Bachelor of Commerce",
      "General Commerce"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_accounting_and_taxation_108",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Accounting and Taxation",
    "displayName": "B.Com. Accounting and Taxation",
    "shortName": "B.Com (A&T)",
    "aliases": [
      "BCom Accounting and Taxation",
      "Taxation",
      "Tax"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_actuarial_management_109",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Actuarial Management",
    "displayName": "B.Com. Actuarial Management",
    "shortName": "B.Com (Actuarial)",
    "aliases": [
      "Actuarial Management",
      "Actuarial"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_applied_business_accounting_110",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Applied Business Accounting",
    "displayName": "B.Com. Applied Business Accounting",
    "shortName": "B.Com (ABA)",
    "aliases": [
      "Applied Business Accounting"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_banking_and_finance_111",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Banking and Finance",
    "displayName": "B.Com. Banking and Finance",
    "shortName": "B.Com (BF)",
    "aliases": [
      "B.Com. Banking",
      "Banking and Finance",
      "Banking",
      "BCom Banking",
      "Finance"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_banking_and_insurance_112",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Banking and Insurance",
    "displayName": "B.Com. Banking and Insurance",
    "shortName": "B.Com (BI)",
    "aliases": [
      "B.Com. Banking and Insurance Management",
      "Banking and Insurance",
      "Insurance"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_business_administration_113",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Business Administration",
    "displayName": "B.Com. Business Administration",
    "shortName": "B.Com (BA)",
    "aliases": [
      "BCom Business Administration"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_business_analytics_114",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Business Analytics",
    "displayName": "B.Com. Business Analytics",
    "shortName": "B.Com (Analytics)",
    "aliases": [
      "Business Analytics",
      "BCom Analytics"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_business_process_services_115",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Business Process Services",
    "displayName": "B.Com. Business Process Services",
    "shortName": "B.Com (BPS)",
    "aliases": [
      "B.Com. Business Process Systems",
      "BPS",
      "Business Process Services"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_capital_markets_116",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Capital Markets",
    "displayName": "B.Com. Capital Markets",
    "shortName": "B.Com (Capital Markets)",
    "aliases": [
      "Capital Markets",
      "Stock Market"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_co_operation_117",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Co-Operation",
    "displayName": "B.Com. Co-Operation",
    "shortName": "B.Com (Co-Op)",
    "aliases": [
      "B.Com. Co-Operative Management",
      "B.Com. with Diploma in Cooperative Management",
      "Co-operation",
      "Cooperative Management"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_co_operation_with_computer_applications_118",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Co-Operation with Computer Applications",
    "displayName": "B.Com. Co-Operation with Computer Applications",
    "shortName": "B.Com (Co-Op CA)",
    "aliases": [
      "Cooperation CA",
      "Cooperative with CA"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_corporate_secretaryship_119",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Corporate Secretaryship",
    "displayName": "B.Com. Corporate Secretaryship",
    "shortName": "B.Com (CS)",
    "aliases": [
      "B.Com CS",
      "Corporate Secretaryship",
      "Corporate",
      "BCom CS"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_corporate_secretaryship_with_computer_applic_120",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Corporate Secretaryship with Computer Applications",
    "displayName": "B.Com. Corporate Secretaryship with Computer Applications",
    "shortName": "B.Com (CS CA)",
    "aliases": [
      "Corporate Secretaryship CA",
      "CS with CA",
      "BCom CS CA"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_cost_accounting_121",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Cost Accounting",
    "displayName": "B.Com. Cost Accounting",
    "shortName": "B.Com (Cost)",
    "aliases": [
      "B.Com. Cost and Management Accounting",
      "Cost Accounting",
      "CMA",
      "Cost & Management"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_digital_marketing_and_data_mining_122",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Digital Marketing and Data Mining",
    "displayName": "B.Com. Digital Marketing and Data Mining",
    "shortName": "B.Com (DM)",
    "aliases": [
      "Digital Marketing",
      "Data Mining",
      "BCom Digital Marketing"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_e_commerce_123",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "E-Commerce",
    "displayName": "B.Com. E-Commerce",
    "shortName": "B.Com (E-Com)",
    "aliases": [
      "E-Commerce",
      "BCom E-Commerce"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_finance_124",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Finance",
    "displayName": "B.Com. Finance",
    "shortName": "B.Com (Finance)",
    "aliases": [
      "B.Com. Financial Services",
      "B.Com. Financial System",
      "Finance",
      "Financial Services"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_foreign_trade_125",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Foreign Trade",
    "displayName": "B.Com. Foreign Trade",
    "shortName": "B.Com (FT)",
    "aliases": [
      "Foreign Trade",
      "BCom Foreign Trade"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_goods_and_services_tax_126",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Goods and Services Tax",
    "displayName": "B.Com. Goods and Services Tax",
    "shortName": "B.Com (GST)",
    "aliases": [
      "GST",
      "Goods and Services Tax",
      "BCom GST"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_international_business_127",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "International Business",
    "displayName": "B.Com. International Business",
    "shortName": "B.Com (IB)",
    "aliases": [
      "B.Com. International Business and Finance",
      "International Business",
      "BCom IB"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_professional_accounting_128",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Professional Accounting",
    "displayName": "B.Com. Professional Accounting",
    "shortName": "B.Com (PA)",
    "aliases": [
      "B.Com PA",
      "Professional Accounting",
      "BCom PA",
      "BCom Professional Accounting",
      "PA"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_retail_marketing_129",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Retail Marketing",
    "displayName": "B.Com. Retail Marketing",
    "shortName": "B.Com (Retail)",
    "aliases": [
      "Retail Marketing",
      "BCom Retail"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_accounting_and_finance_130",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Accounting and Finance",
    "displayName": "B.Com. Accounting and Finance",
    "shortName": "B.Com (A&F)",
    "aliases": [
      "B.Com AF",
      "Accounting and Finance",
      "BCom Accounting and Finance",
      "Accounting & Finance"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_computer_applications_131",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Computer Applications",
    "displayName": "B.Com. Computer Applications",
    "shortName": "B.Com (CA)",
    "aliases": [
      "B.Com CA",
      "BCom CA",
      "Commerce with Computer Applications",
      "CA"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_information_technology_132",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Information Technology",
    "displayName": "B.Com. Information Technology",
    "shortName": "B.Com (IT)",
    "aliases": [
      "B.Com IT",
      "BCom IT",
      "Commerce with IT"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_applied_133",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Applied",
    "displayName": "B.Com. Applied",
    "shortName": "B.Com (Applied)",
    "aliases": [
      "Applied Commerce"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_com_bank_management_134",
    "degree": "B.Com.",
    "name": "Commerce",
    "specialization": "Bank Management",
    "displayName": "B.Com. Bank Management",
    "shortName": "B.Com (Bank Mgmt)",
    "aliases": [
      "Bank Management"
    ],
    "category": "arts_science",
    "group": "COMMERCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_135",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "displayName": "B.Sc. Computer Science",
    "shortName": "B.Sc CS",
    "aliases": [
      "B.Sc CS",
      "BSc CS",
      "BSc Computer Science",
      "Computer Science"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_graphic_and_creative_design_136",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Graphic and Creative Design",
    "displayName": "B.Sc. Computer Science (Graphic and Creative Design)",
    "shortName": "B.Sc CS (Graphics)",
    "aliases": [
      "Graphic and Creative Design",
      "Graphic Design"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_data_science_137",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Data Science",
    "displayName": "B.Sc. Computer Science (Data Science)",
    "shortName": "B.Sc CS (DS)",
    "aliases": [
      "Data Science",
      "Data Analytics",
      "B.Sc. Computer Science with Data Analytics"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_artificial_intelligence_138",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Artificial Intelligence",
    "displayName": "B.Sc. Computer Science (Artificial Intelligence)",
    "shortName": "B.Sc CS (AI)",
    "aliases": [
      "B.Sc AI",
      "Artificial Intelligence"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_artificial_intelligence_and__139",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Artificial Intelligence and Data Science",
    "displayName": "B.Sc. Computer Science (Artificial Intelligence and Data Science)",
    "shortName": "B.Sc CS (AIDS)",
    "aliases": [
      "B.Sc AIDS",
      "B.Sc AI & DS"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_with_cognitive_systems_140",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Cognitive Systems",
    "displayName": "B.Sc. Computer Science with Cognitive Systems",
    "shortName": "B.Sc CS (Cognitive)",
    "aliases": [
      "Cognitive Systems",
      "CS Cognitive Systems"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_with_cyber_security_141",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Cyber Security",
    "displayName": "B.Sc. Computer Science with Cyber Security",
    "shortName": "B.Sc CS (Cyber)",
    "aliases": [
      "B.Sc. Cyber Security",
      "Cyber Security",
      "Cyber",
      "B.Sc Cyber Security"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_and_applications_142",
    "degree": "B.Sc.",
    "name": "Computer Science and Applications",
    "displayName": "B.Sc. Computer Science and Applications",
    "shortName": "B.Sc CSA",
    "aliases": [
      "Computer Science and Applications"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_technology_143",
    "degree": "B.Sc.",
    "name": "Computer Technology",
    "displayName": "B.Sc. Computer Technology",
    "shortName": "B.Sc CT",
    "aliases": [
      "Computer Technology",
      "BSc CT"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_devops_and_cloud_144",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "DevOps and Cloud",
    "displayName": "B.Sc. Computer Science (DevOps and Cloud)",
    "shortName": "B.Sc CS (Cloud)",
    "aliases": [
      "DevOps",
      "Cloud",
      "DevOps and Cloud"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_data_science_and_visualizati_145",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Data Science and Visualization",
    "displayName": "B.Sc. Computer Science (Data Science and Visualization)",
    "shortName": "B.Sc CS (Vis)",
    "aliases": [
      "Data Visualization",
      "Data Science and Visualization"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_computer_science_full_stack_web_development_146",
    "degree": "B.Sc.",
    "name": "Computer Science",
    "specialization": "Full Stack Web Development",
    "displayName": "B.Sc. Computer Science (Full Stack Web Development)",
    "shortName": "B.Sc CS (Full Stack)",
    "aliases": [
      "Full Stack",
      "Web Development",
      "Full Stack Web Development"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_artificial_intelligence_and_machine_learning_147",
    "degree": "B.Sc.",
    "name": "Artificial Intelligence and Machine Learning",
    "displayName": "B.Sc. Artificial Intelligence and Machine Learning",
    "shortName": "B.Sc AIML",
    "aliases": [
      "AIML",
      "BSc AIML",
      "AI and Machine Learning",
      "B.Sc AI & ML"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_artificial_intelligence_and_data_science_148",
    "degree": "B.Sc.",
    "name": "Artificial Intelligence and Data Science",
    "displayName": "B.Sc. Artificial Intelligence and Data Science",
    "shortName": "B.Sc AI & DS",
    "aliases": [
      "AIDS",
      "BSc AIDS",
      "AI and Data Science",
      "B.Sc AI & DS"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_data_science_149",
    "degree": "B.Sc.",
    "name": "Data Science",
    "displayName": "B.Sc. Data Science",
    "shortName": "B.Sc Data Science",
    "aliases": [
      "Data Science",
      "BSc Data Science",
      "B.Sc Data Analytics"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_data_science_and_analytics_150",
    "degree": "B.Sc.",
    "name": "Data Science and Analytics",
    "displayName": "B.Sc. Data Science and Analytics",
    "shortName": "B.Sc DSA",
    "aliases": [
      "Data Analytics",
      "Data Science & Analytics",
      "DSA"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_digital_and_cyber_forensic_science_151",
    "degree": "B.Sc.",
    "name": "Digital and Cyber Forensic Science",
    "displayName": "B.Sc. Digital and Cyber Forensic Science",
    "shortName": "B.Sc Cyber Forensic",
    "aliases": [
      "Digital Forensics",
      "Cyber Forensics",
      "Forensic Science"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_cyber_security_152",
    "degree": "B.Sc.",
    "name": "Cyber Security",
    "displayName": "B.Sc. Cyber Security",
    "shortName": "B.Sc Cyber Security",
    "aliases": [
      "Cyber Security",
      "Cyber",
      "BSc Cyber Security"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_information_technology_153",
    "degree": "B.Sc.",
    "name": "Information Technology",
    "displayName": "B.Sc. Information Technology",
    "shortName": "B.Sc IT",
    "aliases": [
      "B.Sc IT",
      "BSc IT",
      "Information Technology"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_internet_of_things_154",
    "degree": "B.Sc.",
    "name": "Internet of Things",
    "displayName": "B.Sc. Internet of Things",
    "shortName": "B.Sc IoT",
    "aliases": [
      "B.Sc IoT",
      "BSc IoT",
      "IoT",
      "Internet of Things"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_software_systems_155",
    "degree": "B.Sc.",
    "name": "Software Systems",
    "displayName": "B.Sc. Software Systems",
    "shortName": "B.Sc SS",
    "aliases": [
      "Software Systems",
      "BSc SS"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_hardware_system_and_networking_156",
    "degree": "B.Sc.",
    "name": "Hardware System and Networking",
    "displayName": "B.Sc. Hardware System and Networking",
    "shortName": "B.Sc Hardware",
    "aliases": [
      "Hardware and Networking",
      "Networking",
      "Hardware Systems"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_information_systems_management_157",
    "degree": "B.Sc.",
    "name": "Information Systems Management",
    "displayName": "B.Sc. Information Systems Management",
    "shortName": "B.Sc ISM",
    "aliases": [
      "ISM",
      "Information Systems Management"
    ],
    "category": "arts_science",
    "group": "COMPUTER / IT",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_mathematics_158",
    "degree": "B.Sc.",
    "name": "Mathematics",
    "displayName": "B.Sc. Mathematics",
    "shortName": "B.Sc Maths",
    "aliases": [
      "Mathematics",
      "Maths",
      "BSc Maths"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_mathematics_with_computer_applications_159",
    "degree": "B.Sc.",
    "name": "Mathematics",
    "specialization": "Computer Applications",
    "displayName": "B.Sc. Mathematics with Computer Applications",
    "shortName": "B.Sc Maths (CA)",
    "aliases": [
      "Maths CA",
      "Mathematics with CA",
      "BSc Maths CA"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_physics_160",
    "degree": "B.Sc.",
    "name": "Physics",
    "displayName": "B.Sc. Physics",
    "shortName": "B.Sc Physics",
    "aliases": [
      "Physics",
      "BSc Physics"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_physics_with_computer_applications_161",
    "degree": "B.Sc.",
    "name": "Physics",
    "specialization": "Computer Applications",
    "displayName": "B.Sc. Physics with Computer Applications",
    "shortName": "B.Sc Physics (CA)",
    "aliases": [
      "Physics CA",
      "Physics with CA"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_chemistry_162",
    "degree": "B.Sc.",
    "name": "Chemistry",
    "displayName": "B.Sc. Chemistry",
    "shortName": "B.Sc Chemistry",
    "aliases": [
      "Chemistry",
      "BSc Chemistry"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_statistics_163",
    "degree": "B.Sc.",
    "name": "Statistics",
    "displayName": "B.Sc. Statistics",
    "shortName": "B.Sc Stats",
    "aliases": [
      "Statistics",
      "Stats",
      "BSc Stats"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_botany_164",
    "degree": "B.Sc.",
    "name": "Botany",
    "displayName": "B.Sc. Botany",
    "shortName": "B.Sc Botany",
    "aliases": [
      "Botany",
      "Plant Science",
      "BSc Botany"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_zoology_165",
    "degree": "B.Sc.",
    "name": "Zoology",
    "displayName": "B.Sc. Zoology",
    "shortName": "B.Sc Zoology",
    "aliases": [
      "Zoology",
      "Animal Science",
      "BSc Zoology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_geography_166",
    "degree": "B.Sc.",
    "name": "Geography",
    "displayName": "B.Sc. Geography",
    "shortName": "B.Sc Geography",
    "aliases": [
      "Geography",
      "BSc Geography"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_geology_167",
    "degree": "B.Sc.",
    "name": "Geology",
    "displayName": "B.Sc. Geology",
    "shortName": "B.Sc Geology",
    "aliases": [
      "Geology",
      "Earth Science",
      "BSc Geology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_environmental_science_168",
    "degree": "B.Sc.",
    "name": "Environmental Science",
    "displayName": "B.Sc. Environmental Science",
    "shortName": "B.Sc Env Science",
    "aliases": [
      "Environmental Science",
      "BSc Environmental Science"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_renewable_energy_169",
    "degree": "B.Sc.",
    "name": "Renewable Energy",
    "displayName": "B.Sc. Renewable Energy",
    "shortName": "B.Sc Energy",
    "aliases": [
      "Renewable Energy",
      "Solar Energy",
      "Green Energy"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_wild_life_biology_170",
    "degree": "B.Sc.",
    "name": "Wild Life Biology",
    "displayName": "B.Sc. Wild Life Biology",
    "shortName": "B.Sc Wildlife",
    "aliases": [
      "Wildlife Biology",
      "Wildlife",
      "Wild Life"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_agri_biology_171",
    "degree": "B.Sc.",
    "name": "Agri Biology",
    "displayName": "B.Sc. Agri Biology",
    "shortName": "B.Sc Agri Bio",
    "aliases": [
      "Agri Biology",
      "Agricultural Biology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_biochemistry_172",
    "degree": "B.Sc.",
    "name": "Biochemistry",
    "displayName": "B.Sc. Biochemistry",
    "shortName": "B.Sc Biochem",
    "aliases": [
      "B.Sc. Biochemistry with Nanotechnology",
      "Biochemistry",
      "BSc Biochem"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_biotechnology_173",
    "degree": "B.Sc.",
    "name": "Biotechnology",
    "displayName": "B.Sc. Biotechnology",
    "shortName": "B.Sc Biotech",
    "aliases": [
      "Biotechnology",
      "Biotech",
      "BSc Biotech"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_microbiology_174",
    "degree": "B.Sc.",
    "name": "Microbiology",
    "displayName": "B.Sc. Microbiology",
    "shortName": "B.Sc Micro",
    "aliases": [
      "B.Sc. Microbiology with Nanotechnology",
      "Microbiology",
      "BSc Microbiology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_plant_biology_and_biotechnology_175",
    "degree": "B.Sc.",
    "name": "Plant Biology and Biotechnology",
    "displayName": "B.Sc. Plant Biology and Biotechnology",
    "shortName": "B.Sc Plant Biotech",
    "aliases": [
      "Plant Biology",
      "Plant Biotechnology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_food_processing_technology_and_management_176",
    "degree": "B.Sc.",
    "name": "Food Processing Technology and Management",
    "displayName": "B.Sc. Food Processing Technology and Management",
    "shortName": "B.Sc Food Proc",
    "aliases": [
      "Food Processing",
      "Food Technology and Management"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_food_sciences_and_nutrition_177",
    "degree": "B.Sc.",
    "name": "Food Sciences and Nutrition",
    "displayName": "B.Sc. Food Sciences and Nutrition",
    "shortName": "B.Sc Food & Nut",
    "aliases": [
      "Food Science",
      "Food Sciences and Nutrition",
      "B.Sc. Food Science and Nutrition"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_nutrition_and_dietetics_178",
    "degree": "B.Sc.",
    "name": "Nutrition and Dietetics",
    "displayName": "B.Sc. Nutrition and Dietetics",
    "shortName": "B.Sc Nut & Diet",
    "aliases": [
      "B.Sc. Nutrition Food Service Management and Dietetics",
      "Nutrition",
      "Dietetics"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_home_science_179",
    "degree": "B.Sc.",
    "name": "Home Science",
    "displayName": "B.Sc. Home Science",
    "shortName": "B.Sc Home Science",
    "aliases": [
      "B.Sc. Home Science - Nutrition and Dietetics",
      "Home Science"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_psychology_180",
    "degree": "B.Sc.",
    "name": "Psychology",
    "displayName": "B.Sc. Psychology",
    "shortName": "B.Sc Psychology",
    "aliases": [
      "Psychology",
      "BSc Psychology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_electronics_181",
    "degree": "B.Sc.",
    "name": "Electronics",
    "displayName": "B.Sc. Electronics",
    "shortName": "B.Sc Electronics",
    "aliases": [
      "B.Sc. Electronics and Communication Systems",
      "Electronics",
      "ECS"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_animation_and_visual_effects_182",
    "degree": "B.Sc.",
    "name": "Animation and Visual Effects",
    "displayName": "B.Sc. Animation and Visual Effects",
    "shortName": "B.Sc Animation",
    "aliases": [
      "Animation",
      "VFX",
      "Visual Effects"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_costume_design_and_fashion_183",
    "degree": "B.Sc.",
    "name": "Costume Design and Fashion",
    "displayName": "B.Sc. Costume Design and Fashion",
    "shortName": "B.Sc Fashion",
    "aliases": [
      "B.Sc. Apparel Fashion Designing",
      "B.Sc. Apparel Manufacturing and Merchandising",
      "B.Sc. Apparel Production Technology",
      "B.Sc. Fashion Apparel Management",
      "B.Sc. Fashion Technology and Costume Designing",
      "B.Sc. Garment Design and Production",
      "B.Sc. Apparel and Fashion Technology",
      "Fashion Designing",
      "Costume Design",
      "Fashion Technology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_interior_design_184",
    "degree": "B.Sc.",
    "name": "Interior Design",
    "displayName": "B.Sc. Interior Design",
    "shortName": "B.Sc Interior Design",
    "aliases": [
      "B.Sc. Interior Design with Computer Applications",
      "Interior Design"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_multimedia_and_web_technology_185",
    "degree": "B.Sc.",
    "name": "Multimedia and Web Technology",
    "displayName": "B.Sc. Multimedia and Web Technology",
    "shortName": "B.Sc Multimedia",
    "aliases": [
      "Multimedia",
      "Web Technology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_visual_communication_186",
    "degree": "B.Sc.",
    "name": "Visual Communication",
    "displayName": "B.Sc. Visual Communication",
    "shortName": "B.Sc Viscom",
    "aliases": [
      "B.Sc. Visual Communication (Electronic Media)",
      "Viscom",
      "Visual Communication"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_beauty_and_wellness_187",
    "degree": "B.Sc.",
    "name": "Beauty and Wellness",
    "displayName": "B.Sc. Beauty and Wellness",
    "shortName": "B.Sc Wellness",
    "aliases": [
      "Beauty and Wellness",
      "Cosmetology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_catering_science_and_hotel_management_188",
    "degree": "B.Sc.",
    "name": "Catering Science and Hotel Management",
    "displayName": "B.Sc. Catering Science and Hotel Management",
    "shortName": "B.Sc Catering",
    "aliases": [
      "B.Sc. Hotel Management and Catering Science",
      "Catering Science",
      "Hotel Management"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_clinical_laboratory_technology_189",
    "degree": "B.Sc.",
    "name": "Clinical Laboratory Technology",
    "displayName": "B.Sc. Clinical Laboratory Technology",
    "shortName": "B.Sc CLT",
    "aliases": [
      "CLT",
      "Clinical Lab",
      "Medical Laboratory Technology"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_hospitality_and_airline_catering_management_190",
    "degree": "B.Sc.",
    "name": "Hospitality and Airline Catering Management",
    "displayName": "B.Sc. Hospitality and Airline Catering Management",
    "shortName": "B.Sc Airline Catering",
    "aliases": [
      "B.Sc. Hospitality and Tourism Management",
      "Airline Catering",
      "Hospitality Management"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_hospital_administration_191",
    "degree": "B.Sc.",
    "name": "Hospital Administration",
    "displayName": "B.Sc. Hospital Administration",
    "shortName": "B.Sc Hospital Admin",
    "aliases": [
      "Hospital Administration",
      "Hospital Management"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_aviation_192",
    "degree": "B.Sc.",
    "name": "Aviation",
    "displayName": "B.Sc. Aviation",
    "shortName": "B.Sc Aviation",
    "aliases": [
      "Aviation",
      "BSc Aviation"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_forensic_science_193",
    "degree": "B.Sc.",
    "name": "Forensic Science",
    "displayName": "B.Sc. Forensic Science",
    "shortName": "B.Sc Forensic",
    "aliases": [
      "Forensic Science",
      "Criminology Science"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_sc_physical_education_194",
    "degree": "B.Sc.",
    "name": "Physical Education",
    "displayName": "B.Sc. Physical Education",
    "shortName": "B.Sc Physical Ed",
    "aliases": [
      "B.Sc. Physical Education, Health Education and Sports",
      "Physical Education",
      "Sports Science"
    ],
    "category": "arts_science",
    "group": "SCIENCE",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_lib_i_sc_bachelor_of_library_and_information_sci_195",
    "degree": "B.Lib.I.Sc.",
    "name": "Library and Information Science",
    "displayName": "B.Lib.I.Sc. Bachelor of Library and Information Science",
    "shortName": "B.Lib.I.Sc",
    "aliases": [
      "B.Lib.I.Sc.",
      "BLISc",
      "Library Science",
      "Bachelor of Library and Information Science"
    ],
    "category": "arts_science",
    "group": "VOCATIONAL & OTHERS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_voc_multimedia_and_animation_196",
    "degree": "B.Voc.",
    "name": "Multimedia and Animation",
    "displayName": "B.Voc. Multimedia and Animation",
    "shortName": "B.Voc Animation",
    "aliases": [
      "B.Voc Animation",
      "Multimedia and Animation"
    ],
    "category": "arts_science",
    "group": "VOCATIONAL & OTHERS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_voc_business_process_and_data_analytics_197",
    "degree": "B.Voc.",
    "name": "Business Process and Data Analytics",
    "displayName": "B.Voc. Business Process and Data Analytics",
    "shortName": "B.Voc Analytics",
    "aliases": [
      "B.Voc Analytics",
      "Business Process and Data Analytics"
    ],
    "category": "arts_science",
    "group": "VOCATIONAL & OTHERS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  },
  {
    "id": "prog_b_p_ed_bachelor_of_physical_education_198",
    "degree": "B.P.Ed.",
    "name": "Physical Education",
    "displayName": "B.P.Ed. Bachelor of Physical Education",
    "shortName": "B.P.Ed",
    "aliases": [
      "B.P.Ed.",
      "BPEd",
      "Bachelor of Physical Education"
    ],
    "category": "arts_science",
    "group": "VOCATIONAL & OTHERS",
    "level": "UG",
    "source": "Bharathiar University",
    "isActive": true
  }
];

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
  const qNoDots = q.replace(/\./g, '');
  const list = category ? getAllPrograms(category) : PROGRAMS;
  if (!q) return list;

  return list.filter((p) => {
    const disp = p.displayName.toLowerCase();
    const dispNoDots = disp.replace(/\./g, '');
    if (disp.includes(q) || dispNoDots.includes(qNoDots)) return true;
    if (p.shortName.toLowerCase().includes(q)) return true;
    if (p.degree.toLowerCase().replace(/\./g, '').includes(qNoDots)) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.specialization && p.specialization.toLowerCase().includes(q)) return true;
    if (
      p.aliases &&
      p.aliases.some(
        (a) =>
          a.toLowerCase().includes(q) ||
          a.toLowerCase().replace(/\./g, '').includes(qNoDots)
      )
    ) {
      return true;
    }
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

export interface InstitutionProgram {
  id: string;
  institutionId: string;
  programId: string;
  departmentId?: string;
  isActive: boolean;
}

export const INSTITUTION_PROGRAMS: InstitutionProgram[] = [];

/**
 * Flat array of all distinct course display names.
 */
export const PROGRAM_NAMES: string[] = PROGRAMS.map((p) => p.displayName);

