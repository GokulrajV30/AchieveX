// ─────────────────────────────────────────────────────────────
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

export const INSTITUTIONS: Institution[] = [
  {
    "id": "inst_university_departments_of_anna_universit_1",
    "name": "University Departments of Anna University – CEG Campus (College of Engineering, Guindy)",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_departments_of_anna_universit_2",
    "name": "University Departments of Anna University – ACT Campus",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_departments_of_anna_universit_3",
    "name": "University Departments of Anna University – MIT Campus (Madras Institute of Technology)",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_meenakshi_sundararajan_engineering_colle_4",
    "name": "Meenakshi Sundararajan Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_loyola_icam_college_of_engineering_and_t_5",
    "name": "Loyola-ICAM College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jeppiaar_engineering_college_6",
    "name": "Jeppiaar Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jerusalem_college_of_engineering_7",
    "name": "Jerusalem College of Engineering",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_easwari_engineering_college_8",
    "name": "Easwari Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_meenakshi_college_of_engineering_9",
    "name": "Meenakshi College of Engineering",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_c_g_college_of_technology_10",
    "name": "K.C.G. College of Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_joseph_s_college_of_engineering_11",
    "name": "St. Joseph's College of Engineering",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_thangavelu_engineering_college_12",
    "name": "Thangavelu Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_sairam_institute_of_technology_13",
    "name": "Sri Sairam Institute of Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_sairam_engineering_college_14",
    "name": "Sri Sairam Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_tagore_engineering_college_15",
    "name": "Tagore Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_loyola_institute_of_technology_16",
    "name": "Loyola Institute of Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vel_tech_17",
    "name": "Vel Tech",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_panimalar_engineering_college_18",
    "name": "Panimalar Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_panimalar_institute_of_technology_19",
    "name": "Panimalar Institute of Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_velammal_engineering_college_20",
    "name": "Velammal Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sa_engineering_college_21",
    "name": "SA Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_chennai_institute_of_technology_22",
    "name": "Chennai Institute of Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rajalakshmi_institute_of_technology_23",
    "name": "Rajalakshmi Institute of Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_madha_engineering_college_24",
    "name": "Madha Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_madha_institute_of_engineering_and_techn_25",
    "name": "Madha Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_prince_shri_venkateshwara_padmavathy_eng_26",
    "name": "Prince Shri Venkateshwara Padmavathy Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_meenakshi_engineering_college_27",
    "name": "Meenakshi Engineering College",
    "institutionType": "engineering",
    "district": "Chennai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_presidency_college_autonomous_28",
    "name": "Presidency College (Autonomous)",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_queen_mary_s_college_autonomous_29",
    "name": "Queen Mary's College (Autonomous)",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_bharathi_women_s_college_autonomous_30",
    "name": "Bharathi Women's College (Autonomous)",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_autonomous_nanda_31",
    "name": "Government Arts College (Autonomous), Nandanam",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_ambedkar_government_arts_college_auto_32",
    "name": "Dr. Ambedkar Government Arts College (Autonomous)",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_r_k__33",
    "name": "Government Arts and Science College, R.K. Nagar",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thir_34",
    "name": "Government Arts and Science College, Thiruvottiyur",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_alan_35",
    "name": "Government Arts and Science College, Alandur",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_quaid_e_millath_government_college_for_w_36",
    "name": "Quaid-E-Millath Government College for Women (Autonomous)",
    "institutionType": "arts_science",
    "district": "Chennai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_college_of_technology_37",
    "name": "Government College of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_p_s_g_college_of_technology_38",
    "name": "P.S.G. College of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_coimbatore_institute_of_technology_39",
    "name": "Coimbatore Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rathinam_technical_campus_40",
    "name": "Rathinam Technical Campus",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_ranganathar_institute_of_engineering_41",
    "name": "Sri Ranganathar Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pollachi_institute_of_engineering_and_te_42",
    "name": "Pollachi Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_v_s_b_college_of_engineering_technical_c_43",
    "name": "V.S.B. College of Engineering Technical Campus",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_nightingale_institute_of_technology_44",
    "name": "Nightingale Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_suguna_college_of_engineering_45",
    "name": "Suguna College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_adhiyamaan_college_of_engineering_46",
    "name": "Adhiyamaan College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_christ_the_king_engineering_college_47",
    "name": "Christ The King Engineering College",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sree_sakthi_engineering_college_48",
    "name": "Sree Sakthi Engineering College",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_coimbatore_institute_of_engineering_and__49",
    "name": "Coimbatore Institute of Engineering and Information Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_mahalingam_college_of_engineering_and_50",
    "name": "Dr. Mahalingam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_hindusthan_college_of_engineering_and_te_51",
    "name": "Hindusthan College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_karpagam_college_of_engineering_52",
    "name": "Karpagam College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kumaraguru_college_of_technology_53",
    "name": "Kumaraguru College of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_park_college_of_engineering_technology_54",
    "name": "Park College of Engineering Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_krishna_college_of_engineering_and_t_55",
    "name": "Sri Krishna College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_ramakrishna_engineering_college_56",
    "name": "Sri Ramakrishna Engineering College",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_tamilnadu_college_of_engineering_57",
    "name": "Tamilnadu College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_v_l_b_janakiammal_college_of_engineering_58",
    "name": "V.L.B. Janakiammal College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maharaja_prithvi_engineering_college_59",
    "name": "Maharaja Prithvi Engineering College",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_ramakrishna_institute_of_technology_60",
    "name": "Sri Ramakrishna Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sns_college_of_technology_61",
    "name": "SNS College of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_shakthi_institute_of_engineering_and_62",
    "name": "Sri Shakthi Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_nehru_institute_of_engineering_and_techn_63",
    "name": "Nehru Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maharaja_institute_of_technology_64",
    "name": "Maharaja Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rvs_college_of_engineering_and_technolog_65",
    "name": "RVS College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_info_institute_of_engineering_66",
    "name": "Info Institute of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sns_college_of_engineering_67",
    "name": "SNS College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_karpagam_institute_of_technology_68",
    "name": "Karpagam Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_n_g_p_institute_of_technology_69",
    "name": "Dr. N.G.P. Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ranganathan_engineering_college_70",
    "name": "Ranganathan Engineering College",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_eashwar_engineering_college_71",
    "name": "Sri Eashwar Engineering College",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_hindustan_institute_of_technology_72",
    "name": "Hindustan Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_p_a_college_of_engineering_73",
    "name": "P.A. College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ssk_college_of_engineering_and_technolog_74",
    "name": "SSK College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_adithya_institute_of_technology_75",
    "name": "Adithya Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kathir_college_of_engineering_76",
    "name": "Kathir College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ktvr_knowledge_park_for_engineering_and__77",
    "name": "KTVR Knowledge Park for Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_easa_college_of_engineering_and_technolo_78",
    "name": "Easa College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kalasignar_karunanidhi_institute_of_tech_79",
    "name": "Kalasignar Karunanidhi Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kgisl_institute_of_technology_80",
    "name": "KGISL Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ppg_institute_of_technology_81",
    "name": "PPG Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jawaharlal_institute_of_technology_82",
    "name": "Jawaharlal Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_indus_college_of_engineering_83",
    "name": "Indus College of Engineering",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_tejaa_shakthi_institute_of_technology_fo_84",
    "name": "Tejaa Shakthi Institute of Technology for Women",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_united_institute_of_technology_85",
    "name": "United Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jansons_institute_of_technology_86",
    "name": "Jansons Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_akshaya_college_of_engineering_and_techn_87",
    "name": "Akshaya College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_p_r_institute_of_engineering_and_techn_88",
    "name": "K.P.R. Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sriguru_institute_of_technology_89",
    "name": "Sriguru Institute of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_park_college_of_technology_90",
    "name": "Park College of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_j_c_t_college_of_engineering_and_technol_91",
    "name": "J.C.T. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kalaivani_college_of_technology_92",
    "name": "Kalaivani College of Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_nalini_institute_of_engineering_and_t_93",
    "name": "Dr. Nalini Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_c_m_s_college_of_engineering_and_technol_94",
    "name": "C.M.S. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rvs_technical_campus_95",
    "name": "RVS Technical Campus",
    "institutionType": "engineering",
    "district": "Coimbatore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_autonomous_coimb_96",
    "name": "Government Arts College (Autonomous), Coimbatore",
    "institutionType": "arts_science",
    "district": "Coimbatore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_mett_97",
    "name": "Government Arts and Science College, Mettupalayam",
    "institutionType": "arts_science",
    "district": "Coimbatore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_valp_98",
    "name": "Government Arts and Science College, Valparai",
    "institutionType": "arts_science",
    "district": "Coimbatore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_poll_99",
    "name": "Government Arts and Science College, Pollachi",
    "institutionType": "arts_science",
    "district": "Coimbatore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thon_100",
    "name": "Government Arts and Science College, Thondamuthur",
    "institutionType": "arts_science",
    "district": "Coimbatore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_for__101",
    "name": "Government Arts and Science College for Women, Puliyakulam",
    "institutionType": "arts_science",
    "district": "Coimbatore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_thiagarajar_college_of_engineering_102",
    "name": "Thiagarajar College of Engineering",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_c_r_engineering_college_103",
    "name": "C.R. Engineering College",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vaigai_college_of_engineering_104",
    "name": "Vaigai College of Engineering",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kamaraj_college_of_engineering_and_techn_105",
    "name": "Kamaraj College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_p_t_r_college_of_engineering_and_technol_106",
    "name": "P.T.R. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_raja_college_of_engineering_and_technolo_107",
    "name": "Raja College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sacs_m_a_v_m_m_engineering_college_108",
    "name": "SACS M.A.V.M.M. Engineering College",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vickram_college_of_engineering_109",
    "name": "Vickram College of Engineering",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_fatima_michael_college_of_engineering_an_110",
    "name": "Fatima Michael College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ultra_college_of_engineering_and_technol_111",
    "name": "Ultra College of Engineering and Technology for Women",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_velammal_college_of_engineering_and_tech_112",
    "name": "Velammal College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_latha_mathavan_engineering_college_113",
    "name": "Latha Mathavan Engineering College",
    "institutionType": "engineering",
    "district": "Madurai",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thir_114",
    "name": "Government Arts and Science College, Thirumangalam",
    "institutionType": "arts_science",
    "district": "Madurai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_melur_115",
    "name": "Government Arts College, Melur",
    "institutionType": "arts_science",
    "district": "Madurai",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_departments_of_anna_universit_116",
    "name": "University Departments of Anna University – BIT Campus, Tiruchirappalli",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mahalakshmi_engineering_college_117",
    "name": "Mahalakshmi Engineering College",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dhanalakshmi_srinivasan_institute_of_tec_118",
    "name": "Dhanalakshmi Srinivasan Institute of Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sureya_college_of_engineering_119",
    "name": "Sureya College of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_ramakrishnan_college_of_technology_120",
    "name": "K. Ramakrishnan College of Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_oas_institute_of_technology_and_manageme_121",
    "name": "OAS Institute of Technology and Management",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_a_m_school_of_engineering_122",
    "name": "M.A.M. School of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_trp_engineering_college_123",
    "name": "TRP Engineering College",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shri_angala_amman_college_of_engineering_124",
    "name": "Shri Angala Amman College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_j_j_college_of_engineering_and_technolog_125",
    "name": "J.J. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jayaram_college_of_engineering_and_techn_126",
    "name": "Jayaram College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kurinji_college_of_engineering_and_techn_127",
    "name": "Kurinji College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mam_college_of_engineering_128",
    "name": "MAM College of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_i_e_t_engineering_college_129",
    "name": "M.I.E.T. Engineering College",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_oxford_engineering_college_130",
    "name": "Oxford Engineering College",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pavendar_bharathidasan_college_of_engine_131",
    "name": "Pavendar Bharathidasan College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_saranathan_college_of_engineering_132",
    "name": "Saranathan College of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_trichy_engineering_college_133",
    "name": "Trichy Engineering College",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kongunadu_college_of_engineering_and_tec_134",
    "name": "Kongunadu College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_cauvery_college_of_engineering_and_techn_135",
    "name": "Cauvery College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_a_m_college_of_engineering_and_technol_136",
    "name": "M.A.M. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_ramakrishnan_college_of_engineering_137",
    "name": "K. Ramakrishnan College of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_indra_ganesan_college_of_engineering_138",
    "name": "Indra Ganesan College of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_c_a_r_e_school_of_engineering_139",
    "name": "C.A.R.E. School of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shivani_engineering_college_140",
    "name": "Shivani Engineering College",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_imayam_college_of_engineering_141",
    "name": "Imayam College of Engineering",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vetri_vinayaha_college_of_engineering_an_142",
    "name": "Vetri Vinayaha College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shivani_institute_of_technology_143",
    "name": "Shivani Institute of Technology",
    "institutionType": "engineering",
    "district": "Trichy",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_trichy_144",
    "name": "Government Arts College, Trichy",
    "institutionType": "arts_science",
    "district": "Trichy",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_mana_145",
    "name": "Government Arts and Science College, Manapparai",
    "institutionType": "arts_science",
    "district": "Trichy",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_lalg_146",
    "name": "Government Arts and Science College, Lalgudi",
    "institutionType": "arts_science",
    "district": "Trichy",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_shanmugha_college_of_engineering_and_147",
    "name": "Sri Shanmugha College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ganesh_college_of_engineering_148",
    "name": "Ganesh College of Engineering",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dhirajlal_gandhi_college_of_technology_149",
    "name": "Dhirajlal Gandhi College of Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shree_sathyam_college_of_engineering_and_150",
    "name": "Shree Sathyam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_college_of_engineering_salem_151",
    "name": "Government College of Engineering, Salem",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sona_college_of_technology_152",
    "name": "SONA College of Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maha_college_of_engineering_153",
    "name": "Maha College of Engineering",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_the_kavery_engineering_college_154",
    "name": "The Kavery Engineering College",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_avs_engineering_college_155",
    "name": "AVS Engineering College",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_narasu_s_sarathy_institute_of_technology_156",
    "name": "Narasu's Sarathy Institute of Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_bharathiyar_institute_of_engineering_for_157",
    "name": "Bharathiyar Institute of Engineering for Women",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_greentech_college_of_engineering_for_wom_158",
    "name": "Greentech College of Engineering for Women",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rabindranath_tagore_college_of_engineeri_159",
    "name": "Rabindranath Tagore College of Engineering for Women",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_tagore_institute_of_engineering_and_tech_160",
    "name": "Tagore Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_annapoorana_engineering_college_161",
    "name": "Annapoorana Engineering College",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_knowledge_institute_of_technology_162",
    "name": "Knowledge Institute of Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vsa_educational_and_charitable_trust_s_g_163",
    "name": "VSA Educational and Charitable Trust's Group of Institutions",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_salem_college_of_engineering_and_technol_164",
    "name": "Salem College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_s_r_s_college_of_engineering_and_technol_165",
    "name": "S.R.S. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Salem",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_mett_166",
    "name": "Government Arts and Science College, Mettur",
    "institutionType": "arts_science",
    "district": "Salem",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_idap_167",
    "name": "Government Arts and Science College, Idappadi",
    "institutionType": "arts_science",
    "district": "Salem",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_arignar_anna_government_arts_college_ath_168",
    "name": "Arignar Anna Government Arts College, Athur",
    "institutionType": "arts_science",
    "district": "Salem",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_aishwarya_college_of_engineering_and_tec_169",
    "name": "Aishwarya College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vidhya_mandhir_institute_of_technology_170",
    "name": "Vidhya Mandhir Institute of Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_bannari_amman_institute_of_technology_171",
    "name": "Bannari Amman Institute of Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_erode_sengunthar_engineering_college_172",
    "name": "Erode Sengunthar Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_institute_of_road_and_transport_technolo_173",
    "name": "Institute of Road and Transport Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kongu_engineering_college_174",
    "name": "Kongu Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_p_nachimuthu_m_jaganathan_engineering__175",
    "name": "M.P. Nachimuthu M. Jaganathan Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_nandha_engineering_college_176",
    "name": "Nandha Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": true
  },
  {
    "id": "inst_vellalar_college_of_engineering_and_tech_177",
    "name": "Vellalar College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maharaja_engineering_college_for_women_178",
    "name": "Maharaja Engineering College for Women",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shree_venkateswara_hi_tech_engineering_c_179",
    "name": "Shree Venkateswara Hi-Tech Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_surya_engineering_college_180",
    "name": "Surya Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_nandha_institute_of_technology_181",
    "name": "Nandha Institute of Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_ramanathan_engineering_college_182",
    "name": "Sri Ramanathan Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jkk_muniraja_institute_of_technology_183",
    "name": "JKK Muniraja Institute of Technology",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_al_ameen_engineering_college_184",
    "name": "Al-Ameen Engineering College",
    "institutionType": "engineering",
    "district": "Erode",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_sath_185",
    "name": "Government Arts and Science College, Sathyamangalam",
    "institutionType": "arts_science",
    "district": "Erode",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thaa_186",
    "name": "Government Arts and Science College, Thaalavadi",
    "institutionType": "arts_science",
    "district": "Erode",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_anth_187",
    "name": "Government Arts and Science College, Anthiyur",
    "institutionType": "arts_science",
    "district": "Erode",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_moda_188",
    "name": "Government Arts and Science College, Modakurichi",
    "institutionType": "arts_science",
    "district": "Erode",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thit_189",
    "name": "Government Arts and Science College, Thittamalai",
    "institutionType": "arts_science",
    "district": "Erode",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jairupaa_college_of_engineering_190",
    "name": "Jairupaa College of Engineering",
    "institutionType": "engineering",
    "district": "Tiruppur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jai_sriram_college_of_technology_191",
    "name": "Jai Sriram College of Technology",
    "institutionType": "engineering",
    "district": "Tiruppur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sasurie_college_of_engineering_192",
    "name": "Sasurie College of Engineering",
    "institutionType": "engineering",
    "district": "Tiruppur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_angel_college_of_engineering_and_technol_193",
    "name": "Angel College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tiruppur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_erode_builder_educational_trust_s_group__194",
    "name": "Erode Builder Educational Trust's Group of Institutions",
    "institutionType": "engineering",
    "district": "Tiruppur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_professional_educational_trust_s_group_o_195",
    "name": "Professional Educational Trust's Group of Institutions",
    "institutionType": "engineering",
    "district": "Tiruppur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_kang_196",
    "name": "Government Arts and Science College, Kangeyam",
    "institutionType": "arts_science",
    "district": "Tiruppur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_dhar_197",
    "name": "Government Arts and Science College, Dharapuram",
    "institutionType": "arts_science",
    "district": "Tiruppur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_avin_198",
    "name": "Government Arts and Science College, Avinashi",
    "institutionType": "arts_science",
    "district": "Tiruppur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_udumalpet_199",
    "name": "Government Arts College, Udumalpet",
    "institutionType": "arts_science",
    "district": "Tiruppur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_muthayammal_technical_campus_200",
    "name": "Muthayammal Technical Campus",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_s_r_institute_for_engineering_and_tech_201",
    "name": "K.S.R. Institute for Engineering and Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_annai_mathammal_sheela_engineering_colle_202",
    "name": "Annai Mathammal Sheela Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_s_rangaswamy_college_of_technology_203",
    "name": "K.S. Rangaswamy College of Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mahendra_engineering_college_204",
    "name": "Mahendra Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_muthayammal_engineering_college_205",
    "name": "Muthayammal Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_paavai_engineering_college_206",
    "name": "Paavai Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_p_g_p_college_of_engineering_and_technol_207",
    "name": "P.G.P. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_s_r_college_of_engineering_208",
    "name": "K.S.R. College of Engineering",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_s_s_m_college_of_engineering_209",
    "name": "S.S.M. College of Engineering",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sengunthar_engineering_college_210",
    "name": "Sengunthar Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vivekanandha_college_of_engineering_for__211",
    "name": "Vivekanandha College of Engineering for Women",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_paavai_group_of_institutions_212",
    "name": "Paavai Group of Institutions",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_gnanamani_college_of_technology_213",
    "name": "Gnanamani College of Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vivekanandha_institute_of_engineering_an_214",
    "name": "Vivekanandha Institute of Engineering and Technology for Women",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_selvam_college_of_technology_215",
    "name": "Selvam College of Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_paavai_college_of_engineering_216",
    "name": "Paavai College of Engineering",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sengunthar_college_of_engineering_for_wo_217",
    "name": "Sengunthar College of Engineering for Women",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_king_college_of_technology_218",
    "name": "King College of Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mahendra_institute_of_technology_219",
    "name": "Mahendra Institute of Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vidhya_vikkas_college_of_engineering_and_220",
    "name": "Vidhya Vikkas College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_excel_engineering_college_221",
    "name": "Excel Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_cms_college_of_engineering_222",
    "name": "CMS College of Engineering",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_excel_college_of_engineering_for_women_223",
    "name": "Excel College of Engineering for Women",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mahendra_engineering_college_for_women_224",
    "name": "Mahendra Engineering College for Women",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_j_k_k_nataraja_college_of_engineering_an_225",
    "name": "J.K.K. Nataraja College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pavai_college_of_technology_226",
    "name": "Pavai College of Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_gnanamani_college_of_engineering_227",
    "name": "Gnanamani College of Engineering",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_nagarathinam_s_college_of_engineering_228",
    "name": "Dr. Nagarathinam's College of Engineering",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_excel_college_of_engineering_and_technol_229",
    "name": "Excel College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mahendra_institute_of_engineering_and_te_230",
    "name": "Mahendra Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_srg_engineering_college_231",
    "name": "SRG Engineering College",
    "institutionType": "engineering",
    "district": "Namakkal",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_arignar_anna_government_arts_college_nam_232",
    "name": "Arignar Anna Government Arts College, Namakkal",
    "institutionType": "arts_science",
    "district": "Namakkal",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_koma_233",
    "name": "Government Arts and Science College, Komarapalayam",
    "institutionType": "arts_science",
    "district": "Namakkal",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_smr_east_coast_college_of_engineering_an_234",
    "name": "SMR East Coast College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_k_s_k_college_of_engineering_and_technol_235",
    "name": "K.S.K. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_star_lion_college_of_engineering_and_tec_236",
    "name": "Star Lion College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_p_r_engineering_college_237",
    "name": "P.R. Engineering College",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ponnaiyah_ramajayam_college_of_engineeri_238",
    "name": "Ponnaiyah Ramajayam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_joseph_s_college_of_engineering_and_t_239",
    "name": "St. Joseph's College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_parisutham_institute_of_science_and_tech_240",
    "name": "Parisutham Institute of Science and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vandayar_engineering_college_241",
    "name": "Vandayar Engineering College",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_annai_college_of_engineering_and_technol_242",
    "name": "Annai College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_as_salam_college_of_engineering_and_tech_243",
    "name": "As-Salam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thanjavur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thir_244",
    "name": "Government Arts and Science College, Thirukattupalli",
    "institutionType": "arts_science",
    "district": "Thanjavur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_pera_245",
    "name": "Government Arts and Science College, Peravurani",
    "institutionType": "arts_science",
    "district": "Thanjavur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_for_women_kumbak_246",
    "name": "Government Arts College for Women, Kumbakonam",
    "institutionType": "arts_science",
    "district": "Thanjavur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_departments_of_anna_universit_247",
    "name": "University Departments of Anna University of Technology, Tirunelveli",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_thamirabharani_engineering_college_248",
    "name": "Thamirabharani Engineering College",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_universal_college_of_engineering_and_tec_249",
    "name": "Universal College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_a_r_college_of_engineering_and_technolog_250",
    "name": "A.R. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_psn_institute_of_technology_and_science_251",
    "name": "PSN Institute of Technology and Science",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_national_college_of_engineering_252",
    "name": "National College of Engineering",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_psn_college_of_engineering_and_technolog_253",
    "name": "PSN College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pet_college_of_engineering_254",
    "name": "PET College of Engineering",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_s_veerasamy_chettiar_college_of_engineer_255",
    "name": "S. Veerasamy Chettiar College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sardar_raja_college_of_engineering_256",
    "name": "Sardar Raja College of Engineering",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_scad_college_of_engineering_and_technolo_257",
    "name": "SCAD College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_the_rajaas_engineering_college_258",
    "name": "The Rajaas Engineering College",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_college_of_engineering_tirune_259",
    "name": "Government College of Engineering, Tirunelveli",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_einstein_college_of_engineering_260",
    "name": "Einstein College of Engineering",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_psn_engineering_college_261",
    "name": "PSN Engineering College",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jp_college_of_engineering_262",
    "name": "JP College of Engineering",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mahakavi_bharathiyar_college_of_engineer_263",
    "name": "Mahakavi Bharathiyar College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Tirunelveli",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_maan_264",
    "name": "Government Arts and Science College, Maanur",
    "institutionType": "arts_science",
    "district": "Tirunelveli",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_annai_mira_college_of_engineering_and_te_265",
    "name": "Annai Mira College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_c_abdul_hakeem_college_of_engineering_an_266",
    "name": "C. Abdul Hakeem College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_g_g_r_college_of_engineering_267",
    "name": "G.G.R. College of Engineering",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ganadipathy_tulsi_s_engineering_college_268",
    "name": "Ganadipathy Tulsi's Engineering College",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_priyadarshini_engineering_college_269",
    "name": "Priyadarshini Engineering College",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ranippettai_engineering_college_270",
    "name": "Ranippettai Engineering College",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_nandhanam_college_of_engineering_and_271",
    "name": "Sri Nandhanam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_saraswathi_velu_college_of_engineering_272",
    "name": "Saraswathi Velu College of Engineering",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_thanthai_periyar_government_institute_of_273",
    "name": "Thanthai Periyar Government Institute of Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_bharathidasan_engineering_college_274",
    "name": "Bharathidasan Engineering College",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kingston_engineering_college_275",
    "name": "Kingston Engineering College",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shri_sapthagiri_institute_of_technology_276",
    "name": "Shri Sapthagiri Institute of Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_global_institute_of_engineering_and_tech_277",
    "name": "Global Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_podhigai_college_of_engineering_and_tech_278",
    "name": "Podhigai College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_krishna_college_of_engineering_279",
    "name": "Sri Krishna College of Engineering",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_john_s_college_of_engineering_and_tec_280",
    "name": "St. John's College of Engineering and Technology for Women",
    "institutionType": "engineering",
    "district": "Vellore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_serk_281",
    "name": "Government Arts and Science College, Serkadu",
    "institutionType": "arts_science",
    "district": "Vellore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_college_of_engineering_kanchi_282",
    "name": "University College of Engineering, Kanchipuram",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pallava_raja_college_of_engineering_283",
    "name": "Pallava Raja College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jeppiaar_institute_of_technology_284",
    "name": "Jeppiaar Institute of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_joseph_s_institute_of_technology_285",
    "name": "St. Joseph's Institute of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_arignar_anna_institute_of_science_and_te_286",
    "name": "Arignar Anna Institute of Science and Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dmi_college_of_engineering_287",
    "name": "DMI College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kalsar_college_of_engineering_288",
    "name": "Kalsar College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_lord_venkateshwara_engineering_college_289",
    "name": "Lord Venkateshwara Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maamallan_institute_of_technology_290",
    "name": "Maamallan Institute of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kings_engineering_college_291",
    "name": "Kings Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kanchi_pallavan_engineering_college_292",
    "name": "Kanchi Pallavan Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pallavan_college_of_engineering_293",
    "name": "Pallavan College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rajalakshmi_engineering_college_294",
    "name": "Rajalakshmi Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rajiv_gandhi_college_of_engineering_295",
    "name": "Rajiv Gandhi College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sakthi_mariamman_engineering_college_296",
    "name": "Sakthi Mariamman Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_saveetha_engineering_college_297",
    "name": "Saveetha Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_muthukumaran_institute_of_technology_298",
    "name": "Sri Muthukumaran Institute of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_venkateswara_college_of_engineering_299",
    "name": "Sri Venkateswara College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pb_college_of_engineering_300",
    "name": "PB College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pt_lee_chengalvaraya_naicker_college_of__301",
    "name": "PT Lee Chengalvaraya Naicker College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_alpha_college_of_engineering_302",
    "name": "Alpha College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_apollo_engineering_college_303",
    "name": "Apollo Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_adhi_college_of_engineering_and_technolo_304",
    "name": "Adhi College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_indira_institute_of_engineering_and_tech_305",
    "name": "Indira Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jei_mathaajee_college_of_engineering_306",
    "name": "JEI Mathaajee College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kcg_college_of_technology_307",
    "name": "KCG College of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ssn_college_of_engineering_308",
    "name": "SSN College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_joseph_s_college_of_engineering_309",
    "name": "St. Joseph's College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_chennai_institute_of_technology_310",
    "name": "Chennai Institute of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_adhiparasakthi_engineering_college_311",
    "name": "Adhiparasakthi Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dhanalakshmi_college_of_engineering_312",
    "name": "Dhanalakshmi College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_karpaga_vinayaga_college_of_engineering__313",
    "name": "Karpaga Vinayaga College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_venkateswaraa_college_of_technology_314",
    "name": "Sri Venkateswaraa College of Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_prince_dr_k_vasudevan_college_of_enginee_315",
    "name": "Prince Dr. K. Vasudevan College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_tagore_engineering_college_316",
    "name": "Tagore Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_valliammai_engineering_college_317",
    "name": "Valliammai Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dhaanish_ahmed_college_of_engineering_318",
    "name": "Dhaanish Ahmed College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shri_andal_alagar_college_of_engineering_319",
    "name": "Shri Andal Alagar College of Engineering",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_prince_shri_venkateshwara_padmavathy_eng_320",
    "name": "Prince Shri Venkateshwara Padmavathy Engineering College",
    "institutionType": "engineering",
    "district": "Kanchipuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_srip_321",
    "name": "Government Arts and Science College, Sriperambatur",
    "institutionType": "arts_science",
    "district": "Kanchipuram",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_college_of_engineering_dharma_322",
    "name": "Government College of Engineering, Dharmapuri",
    "institutionType": "engineering",
    "district": "Dharmapuri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jayam_college_of_engineering_and_technol_323",
    "name": "Jayam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dharmapuri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sapthagiri_college_of_engineering_324",
    "name": "Sapthagiri College of Engineering",
    "institutionType": "engineering",
    "district": "Dharmapuri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jayalakshmi_institute_of_technology_325",
    "name": "Jayalakshmi Institute of Technology",
    "institutionType": "engineering",
    "district": "Dharmapuri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_varuvan_vadivelan_institute_of_technolog_326",
    "name": "Varuvan Vadivelan Institute of Technology",
    "institutionType": "engineering",
    "district": "Dharmapuri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_shreenivasa_engineering_college_327",
    "name": "Shreenivasa Engineering College",
    "institutionType": "engineering",
    "district": "Dharmapuri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_eriy_328",
    "name": "Government Arts and Science College, Eriyur",
    "institutionType": "arts_science",
    "district": "Dharmapuri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_penn_329",
    "name": "Government Arts and Science College, Pennagaram",
    "institutionType": "arts_science",
    "district": "Dharmapuri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_haru_330",
    "name": "Government Arts and Science College, Harur",
    "institutionType": "arts_science",
    "district": "Dharmapuri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_papp_331",
    "name": "Government Arts and Science College, Pappyreddipatti",
    "institutionType": "arts_science",
    "district": "Dharmapuri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_dharmapuri_332",
    "name": "Government Arts College, Dharmapuri",
    "institutionType": "arts_science",
    "district": "Dharmapuri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_college_of_engineering_bargur_333",
    "name": "Government College of Engineering, Bargur",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_venkateshwara_institute_of_engineeri_334",
    "name": "Sri Venkateshwara Institute of Engineering",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_hosur_institute_of_technology_and_scienc_335",
    "name": "Hosur Institute of Technology and Science",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_adhiyamaan_college_of_engineering_336",
    "name": "Adhiyamaan College of Engineering",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_er_perumal_manimekalai_college_of_engine_337",
    "name": "Er. Perumal Manimekalai College of Engineering",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_p_s_v_college_of_engineering_and_technol_338",
    "name": "P.S.V. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_archana_institute_of_technology_339",
    "name": "Archana Institute of Technology",
    "institutionType": "engineering",
    "district": "Krishnagiri",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_hosu_340",
    "name": "Government Arts and Science College, Hosur",
    "institutionType": "arts_science",
    "district": "Krishnagiri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thal_341",
    "name": "Government Arts and Science College, Thally",
    "institutionType": "arts_science",
    "district": "Krishnagiri",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ssm_institute_of_engineering_and_technol_342",
    "name": "SSM Institute of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_christian_college_of_engineering_and_tec_343",
    "name": "Christian College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_subramanya_college_of_engineering_an_344",
    "name": "Sri Subramanya College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_n_p_r_college_of_engineering_and_technol_345",
    "name": "N.P.R. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_pannaikadu_veerammal_paramasivam_college_346",
    "name": "Pannaikadu Veerammal Paramasivam College of Engineering and Technology for Women",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_r_v_s_school_of_engineering_and_technolo_347",
    "name": "R.V.S. School of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_kodaikanal_institute_of_technology_348",
    "name": "Kodaikanal Institute of Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_psna_college_of_engineering_and_technolo_349",
    "name": "PSNA College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sbm_college_of_engineering_and_technolog_350",
    "name": "SBM College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_r_v_s_college_of_engineering_and_technol_351",
    "name": "R.V.S. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Dindigul",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_odda_352",
    "name": "Government Arts and Science College, Oddanchatram",
    "institutionType": "arts_science",
    "district": "Dindigul",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_redd_353",
    "name": "Government Arts and Science College, Reddiarchatram",
    "institutionType": "arts_science",
    "district": "Dindigul",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_veda_354",
    "name": "Government Arts and Science College, Vedasandur",
    "institutionType": "arts_science",
    "district": "Dindigul",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_n_s_n_college_of_engineering_and_technol_355",
    "name": "N.S.N. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_cheran_college_of_engineering_356",
    "name": "Cheran College of Engineering",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_arulmuruga_technical_campus_357",
    "name": "Arulmuruga Technical Campus",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_v_s_b_engineering_college_358",
    "name": "V.S.B. Engineering College",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_chettinad_college_of_engineering_and_tec_359",
    "name": "Chettinad College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_karur_college_of_engineering_360",
    "name": "Karur College of Engineering",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_v_k_s_college_of_engineering_and_technol_361",
    "name": "V.K.S. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_kumaraswamy_college_of_engineering_362",
    "name": "M. Kumaraswamy College of Engineering",
    "institutionType": "engineering",
    "district": "Karur",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_arav_363",
    "name": "Government Arts and Science College, Aravakurichi",
    "institutionType": "arts_science",
    "district": "Karur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_thar_364",
    "name": "Government Arts and Science College, Tharagampadi",
    "institutionType": "arts_science",
    "district": "Karur",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_krishnasamy_college_of_engineering_and_t_365",
    "name": "Krishnasamy College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Cuddalore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_jayaram_engineering_college_366",
    "name": "Sri Jayaram Engineering College",
    "institutionType": "engineering",
    "district": "Cuddalore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_navalar_nedunchezhiyan_college_of_eng_367",
    "name": "Dr. Navalar Nedunchezhiyan College of Engineering",
    "institutionType": "engineering",
    "district": "Cuddalore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_r_k_institute_of_technology_368",
    "name": "M.R.K. Institute of Technology",
    "institutionType": "engineering",
    "district": "Cuddalore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_anne_s_college_of_engineering_and_tec_369",
    "name": "St. Anne's College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Cuddalore",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_vada_370",
    "name": "Government Arts and Science College, Vadalur",
    "institutionType": "arts_science",
    "district": "Cuddalore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_chidambaram_371",
    "name": "Government Arts College, Chidambaram",
    "institutionType": "arts_science",
    "district": "Cuddalore",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_college_of_engineering_villup_372",
    "name": "University College of Engineering, Villupuram",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_college_of_engineering_tindiv_373",
    "name": "University College of Engineering, Tindivanam",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vedhantha_institute_of_technology_374",
    "name": "Vedhantha Institute of Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_annai_teresa_college_of_engineering_375",
    "name": "Annai Teresa College of Engineering",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_paul_s_engineering_college_376",
    "name": "Dr. Paul's Engineering College",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_i_f_e_t_college_of_engineering_377",
    "name": "I.F.E.T. College of Engineering",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mailam_engineering_college_378",
    "name": "Mailam Engineering College",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_t_s_m_jain_college_of_technology_379",
    "name": "T.S.M. Jain College of Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_v_r_s_college_of_engineering_and_technol_380",
    "name": "V.R.S. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_e_s_college_of_engineering_and_technolog_381",
    "name": "E.S. College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maha_bharathi_engineering_college_382",
    "name": "Maha Bharathi Engineering College",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_aravindar_engineering_college_383",
    "name": "Sri Aravindar Engineering College",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_surya_college_of_engineering_and_technol_384",
    "name": "Surya College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_a_r_engineering_college_385",
    "name": "A.R. Engineering College",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_a_k_t_memorial_college_of_engineering_an_386",
    "name": "A.K.T. Memorial College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sri_rangapoopathi_college_of_engineering_387",
    "name": "Sri Rangapoopathi College of Engineering",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_saraswathy_college_of_engineering_and_te_388",
    "name": "Saraswathy College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_idhaya_engineering_college_for_women_389",
    "name": "Idhaya Engineering College for Women",
    "institutionType": "engineering",
    "district": "Villupuram",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_arignar_anna_government_arts_college_vil_390",
    "name": "Arignar Anna Government Arts College, Villupuram",
    "institutionType": "arts_science",
    "district": "Villupuram",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_ging_391",
    "name": "Government Arts and Science College, Gingee",
    "institutionType": "arts_science",
    "district": "Villupuram",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_tiru_392",
    "name": "Government Arts and Science College, Tiruvennainallur",
    "institutionType": "arts_science",
    "district": "Villupuram",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_vanu_393",
    "name": "Government Arts and Science College, Vanur",
    "institutionType": "arts_science",
    "district": "Villupuram",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_vocational_college_of_enginee_394",
    "name": "University Vocational College of Engineering, Thoothukudi",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_v_v_college_of_engineering_395",
    "name": "V.V. College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_chandy_college_of_engineering_396",
    "name": "Chandy College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_mother_theresa_engineering_college_397",
    "name": "St. Mother Theresa Engineering College",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_holy_cross_engineering_college_398",
    "name": "Holy Cross Engineering College",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_scad_college_of_engineering_399",
    "name": "SCAD College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_unnamalai_institute_of_technology_400",
    "name": "Unnamalai Institute of Technology",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_sivanthi_aditanar_college_of_engineer_401",
    "name": "Dr. Sivanthi Aditanar College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dr_g_u_pope_college_of_engineering_402",
    "name": "Dr. G.U. Pope College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_infant_jesus_college_of_engineering_403",
    "name": "Infant Jesus College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jayaraj_annapackiam_csi_college_of_engin_404",
    "name": "Jayaraj Annapackiam CSI College of Engineering",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_infant_jesus_college_of_engineering_and__405",
    "name": "Infant Jesus College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Thoothukudi",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_naga_406",
    "name": "Government Arts and Science College, Nagalapuram",
    "institutionType": "arts_science",
    "district": "Thoothukudi",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_college_kovilpatti_407",
    "name": "Government Arts College, Kovilpatti",
    "institutionType": "arts_science",
    "district": "Thoothukudi",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_university_college_of_engineering_nagerc_408",
    "name": "University College of Engineering, Nagercoil",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rohini_college_of_engineering_and_techno_409",
    "name": "Rohini College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_maria_college_of_engineering_and_technol_410",
    "name": "Maria College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_mar_ephraem_college_of_engineering_and_t_411",
    "name": "Mar Ephraem College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_m_e_t_engineering_college_412",
    "name": "M.E.T. Engineering College",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_immanuel_arasar_j_j_college_of_engineeri_413",
    "name": "Immanuel Arasar J.J. College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sivaji_college_of_engineering_and_techno_414",
    "name": "Sivaji College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_satyam_college_of_engineering_and_techno_415",
    "name": "Satyam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_arunachala_college_of_engineering_for_wo_416",
    "name": "Arunachala College of Engineering for Women",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vins_christian_women_s_college_of_engine_417",
    "name": "Vins Christian Women's College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_dmi_engineering_college_418",
    "name": "DMI Engineering College",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_rajas_international_institute_of_technol_419",
    "name": "Rajas International Institute of Technology for Women",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_tamizhan_college_of_engineering_and_tech_420",
    "name": "Tamizhan College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_c_s_i_institute_of_technology_421",
    "name": "C.S.I. Institute of Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_jayamatha_engineering_college_422",
    "name": "Jayamatha Engineering College",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_st_xavier_s_catholic_college_of_engineer_423",
    "name": "St. Xavier's Catholic College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_sun_college_of_engineering_and_technolog_424",
    "name": "Sun College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_narayana_guru_college_of_engineering_425",
    "name": "Narayana Guru College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_udaya_school_of_engineering_426",
    "name": "Udaya School of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_ponjesly_college_of_engineering_427",
    "name": "Ponjesly College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_vins_christian_college_of_engineering_428",
    "name": "Vins Christian College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_lord_jegannath_college_of_engineering_an_429",
    "name": "Lord Jegannath College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_marthandam_college_of_engineering_and_te_430",
    "name": "Marthandam College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_knsk_college_of_engineering_431",
    "name": "KNSK College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_james_college_of_engineering_and_technol_432",
    "name": "James College of Engineering and Technology",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_bethlahem_institute_of_engineering_433",
    "name": "Bethlahem Institute of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_loyola_institute_of_technology_and_scien_434",
    "name": "Loyola Institute of Technology and Science",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_annai_vailankanni_college_of_engineering_435",
    "name": "Annai Vailankanni College of Engineering",
    "institutionType": "engineering",
    "district": "Nagercoil",
    "sourceType": "TNEA",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_nage_436",
    "name": "Government Arts and Science College, Nagercoil",
    "institutionType": "arts_science",
    "district": "Nagercoil",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  },
  {
    "id": "inst_government_arts_and_science_college_kany_437",
    "name": "Government Arts and Science College, Kanyakumari",
    "institutionType": "arts_science",
    "district": "Nagercoil",
    "sourceType": "TNGASA_DCE",
    "isActive": true,
    "isOnboarded": false
  }
];

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
      message: 'Invalid activation code.',
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
    message: 'Invalid activation code.',
  };
}

/**
 * All distinct college names for dropdowns/organizers across the app
 */
export const COLLEGE_NAMES: string[] = Array.from(new Set(INSTITUTIONS.map((c) => c.name)));
export const ALL_COLLEGES: Institution[] = INSTITUTIONS;
