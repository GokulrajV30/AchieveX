const fs = require('fs');
const path = require('path');

const rawPrograms = [
  // ── 4. Civil / Infrastructure ──
  { displayName: 'B.E. Civil Engineering', category: 'engineering', shortName: 'CIVIL', departmentId: 'CIVIL' },
  { displayName: 'B.E. Civil Engineering (Environmental Engineering)', category: 'engineering', shortName: 'CIVIL (Env)', departmentId: 'CIVIL' },
  { displayName: 'B.E. Environmental Engineering', category: 'engineering', shortName: 'ENV', departmentId: 'CIVIL' },
  { displayName: 'B.E. Geoinformatics Engineering', category: 'engineering', shortName: 'GEO', departmentId: 'CIVIL' },
  { displayName: 'B.Tech. Agricultural Engineering', category: 'engineering', shortName: 'AGRI', departmentId: 'AGRI' },

  // ── 5. Mechanical / Automobile / Aerospace ──
  { displayName: 'B.E. Aeronautical Engineering', category: 'engineering', shortName: 'AERO', departmentId: 'MECH' },
  { displayName: 'B.E. Aerospace Engineering', category: 'engineering', shortName: 'AERO', departmentId: 'MECH' },
  { displayName: 'B.E. Automobile Engineering', category: 'engineering', shortName: 'AUTO', departmentId: 'MECH' },
  { displayName: 'B.E. Mechanical Engineering', category: 'engineering', shortName: 'MECH', departmentId: 'MECH' },
  { displayName: 'B.E. Mechanical Engineering (Specialized in Automobile)', category: 'engineering', shortName: 'MECH (Auto)', departmentId: 'MECH' },
  { displayName: 'B.E. Mechanical Engineering (Specialized in Smart Manufacturing)', category: 'engineering', shortName: 'MECH (Smart Mfg)', departmentId: 'MECH' },
  { displayName: 'B.E. Manufacturing Engineering', category: 'engineering', shortName: 'MFG', departmentId: 'MECH' },
  { displayName: 'B.E. Production Engineering', category: 'engineering', shortName: 'PROD', departmentId: 'MECH' },
  { displayName: 'B.E. Industrial Engineering', category: 'engineering', shortName: 'IND', departmentId: 'MECH' },
  { displayName: 'B.E. Industrial Engineering and Management', category: 'engineering', shortName: 'IEM', departmentId: 'MECH' },
  { displayName: 'B.E. Marine Engineering', category: 'engineering', shortName: 'MARINE', departmentId: 'MECH' },
  { displayName: 'B.E. Mechatronics Engineering', category: 'engineering', shortName: 'MCT', departmentId: 'MECH' },
  { displayName: 'B.E. Mechanical and Automation Engineering', category: 'engineering', shortName: 'MAE', departmentId: 'MECH' },
  { displayName: 'B.E. Robotics and Automation', category: 'engineering', shortName: 'ROBOTICS', departmentId: 'MECH' },
  { displayName: 'B.E. Materials Science and Engineering', category: 'engineering', shortName: 'MSE', departmentId: 'MECH' },
  { displayName: 'B.E. Mining Engineering', category: 'engineering', shortName: 'MINING', departmentId: 'MECH' },
  { displayName: 'B.E. Printing and Packaging Technology', category: 'engineering', shortName: 'PRINT', departmentId: 'MECH' },

  // ── 6. Electrical / Electronics ──
  { displayName: 'B.E. Electrical and Electronics Engineering', category: 'engineering', shortName: 'EEE', departmentId: 'EEE' },
  { displayName: 'B.E. Electrical and Computer Engineering', category: 'engineering', shortName: 'ECEng', departmentId: 'EEE' },
  { displayName: 'B.E. Electronics and Communication Engineering', category: 'engineering', shortName: 'ECE', departmentId: 'ECE' },
  { displayName: 'B.E. Electronics and Instrumentation Engineering', category: 'engineering', shortName: 'EIE', departmentId: 'ECE' },
  { displayName: 'B.E. Instrumentation and Control Engineering', category: 'engineering', shortName: 'ICE', departmentId: 'ECE' },
  { displayName: 'B.E. Electronics and Computer Engineering', category: 'engineering', shortName: 'ECM', departmentId: 'ECE' },
  { displayName: 'B.E. Electronics Engineering (VLSI Design and Technology)', category: 'engineering', shortName: 'VLSI', departmentId: 'ECE' },

  // ── 7. Computer / IT ──
  { displayName: 'B.E. Computer Science and Engineering', category: 'engineering', shortName: 'CSE', departmentId: 'CSE' },
  { displayName: 'B.E. Computer Science and Engineering (Artificial Intelligence)', category: 'engineering', shortName: 'CSE (AI)', departmentId: 'CSE' },
  { displayName: 'B.E. Computer Science and Engineering (Artificial Intelligence and Machine Learning)', category: 'engineering', shortName: 'CSE (AIML)', departmentId: 'CSE' },
  { displayName: 'B.E. Computer Science and Engineering (Data Science)', category: 'engineering', shortName: 'CSE (DS)', departmentId: 'CSE' },
  { displayName: 'B.E. Computer Science and Engineering (Internet of Things)', category: 'engineering', shortName: 'CSE (IoT)', departmentId: 'CSE (IoT)' },
  { displayName: 'B.E. Computer Science and Engineering (Cyber Security)', category: 'engineering', shortName: 'CSE (Cyber)', departmentId: 'CSE (Cyber)' },
  { displayName: 'B.E. Computer Science and Design', category: 'engineering', shortName: 'CSD', departmentId: 'CSE' },
  { displayName: 'B.E. Computer and Communication Engineering', category: 'engineering', shortName: 'CCE', departmentId: 'CSE' },
  { displayName: 'B.Tech. Information Technology', category: 'engineering', shortName: 'IT', departmentId: 'IT' },
  { displayName: 'B.Tech. Artificial Intelligence and Data Science', category: 'engineering', shortName: 'AIDS', departmentId: 'AIDS' },
  { displayName: 'B.Tech. Artificial Intelligence and Machine Learning', category: 'engineering', shortName: 'AIML', departmentId: 'AIDS' },
  { displayName: 'B.Tech. Computer Science and Business Systems', category: 'engineering', shortName: 'CSBS', departmentId: 'CSBS' },

  // ── 8. Biomedical ──
  { displayName: 'B.E. Biomedical Engineering', category: 'engineering', shortName: 'BME', departmentId: 'BME' },
  { displayName: 'B.E. Medical Electronics', category: 'engineering', shortName: 'MDE', departmentId: 'BME' },

  // ── 9. Chemical / Petroleum ──
  { displayName: 'B.Tech. Chemical Engineering', category: 'engineering', shortName: 'CHEM', departmentId: 'CHEM' },
  { displayName: 'B.Tech. Chemical and Electrochemical Engineering', category: 'engineering', shortName: 'CECE', departmentId: 'CHEM' },
  { displayName: 'B.Tech. Petroleum Engineering', category: 'engineering', shortName: 'PETRO', departmentId: 'CHEM' },
  { displayName: 'B.Tech. Petrochemical Technology', category: 'engineering', shortName: 'PCT', departmentId: 'CHEM' },
  { displayName: 'B.E. Petrochemical Engineering', category: 'engineering', shortName: 'PCE', departmentId: 'CHEM' },

  // ── 10. Biotech / Food / Pharma ──
  { displayName: 'B.Tech. Biotechnology', category: 'engineering', shortName: 'BIOTECH', departmentId: 'BIOTECH' },
  { displayName: 'B.Tech. Pharmaceutical Technology', category: 'engineering', shortName: 'PHARMA', departmentId: 'PHARMA' },
  { displayName: 'B.Tech. Food Technology', category: 'engineering', shortName: 'FOOD', departmentId: 'FOOD' },
  { displayName: 'B.Tech. Polymer Technology', category: 'engineering', shortName: 'POLYMER', departmentId: 'CHEM' },
  { displayName: 'B.Tech. Plastics Technology', category: 'engineering', shortName: 'PLASTIC', departmentId: 'CHEM' },

  // ── 11. Textile / Fashion ──
  { displayName: 'B.Tech. Textile Technology', category: 'engineering', shortName: 'TEXTILE', departmentId: 'TEXTILE' },
  { displayName: 'B.Tech. Textile Chemistry', category: 'engineering', shortName: 'TC', departmentId: 'TEXTILE' },
  { displayName: 'B.Tech. Fashion Technology', category: 'engineering', shortName: 'FASHION', departmentId: 'TEXTILE' },
  { displayName: 'B.Tech. Handloom and Textile Technology', category: 'engineering', shortName: 'HTT', departmentId: 'TEXTILE' },

  // ── 12. Architecture ──
  { displayName: 'B.Arch. Architecture', category: 'engineering', shortName: 'ARCH', departmentId: 'ARCH' },

  // ── 13. Arts & Science — B.A. ──
  { displayName: 'B.A. Tamil', category: 'arts_science', shortName: 'BA Tamil', departmentId: 'TAMIL' },
  { displayName: 'B.A. Tamil Literature', category: 'arts_science', shortName: 'BA Tamil Lit', departmentId: 'TAMIL' },
  { displayName: 'B.A. Applied Tamil', category: 'arts_science', shortName: 'BA App Tamil', departmentId: 'TAMIL' },
  { displayName: 'B.A. Tamil (Creative Writing)', category: 'arts_science', shortName: 'BA Tamil CW', departmentId: 'TAMIL' },
  { displayName: 'B.A. English', category: 'arts_science', shortName: 'BA English', departmentId: 'ENGLISH' },
  { displayName: 'B.A. English Literature', category: 'arts_science', shortName: 'BA Eng Lit', departmentId: 'ENGLISH' },
  { displayName: 'B.A. English Literature with Computer Applications', category: 'arts_science', shortName: 'BA Eng CA', departmentId: 'ENGLISH' },
  { displayName: 'B.A. History', category: 'arts_science', shortName: 'BA History', departmentId: 'HISTORY' },
  { displayName: 'B.A. Economics', category: 'arts_science', shortName: 'BA Economics', departmentId: 'ECONOMICS' },
  { displayName: 'B.A. Economics with Computer Applications', category: 'arts_science', shortName: 'BA Econ CA', departmentId: 'ECONOMICS' },
  { displayName: 'B.A. Economics with Banking and Insurance', category: 'arts_science', shortName: 'BA Econ BI', departmentId: 'ECONOMICS' },
  { displayName: 'B.A. Economics with Logistics and Freight Management', category: 'arts_science', shortName: 'BA Econ Log', departmentId: 'ECONOMICS' },
  { displayName: 'B.A. Political Science', category: 'arts_science', shortName: 'BA Pol Sci', departmentId: 'POLSCI' },
  { displayName: 'B.A. Public Administration', category: 'arts_science', shortName: 'BA Pub Admin', departmentId: 'PUBADMIN' },
  { displayName: 'B.A. Sociology', category: 'arts_science', shortName: 'BA Sociology', departmentId: 'SOCIOLOGY' },
  { displayName: 'B.A. Criminology', category: 'arts_science', shortName: 'BA Criminology', departmentId: 'CRIMINOLOGY' },
  { displayName: 'B.A. Criminology and Police Administration', category: 'arts_science', shortName: 'BA Crim PA', departmentId: 'CRIMINOLOGY' },
  { displayName: 'B.A. Defence Studies', category: 'arts_science', shortName: 'BA Def Studies', departmentId: 'DEFENCE' },
  { displayName: 'B.A. Defence and Strategic Studies', category: 'arts_science', shortName: 'BA Def Strat', departmentId: 'DEFENCE' },
  { displayName: 'B.A. Tourism and Travel Management', category: 'arts_science', shortName: 'BA Tourism', departmentId: 'TOURISM' },
  { displayName: 'B.A. Journalism and Mass Communication', category: 'arts_science', shortName: 'BA JMC', departmentId: 'JOURNALISM' },
  { displayName: 'B.A. Performing Arts', category: 'arts_science', shortName: 'BA Perf Arts', departmentId: 'ARTS' },
  { displayName: 'B.A. Carnatic Music', category: 'arts_science', shortName: 'BA Music', departmentId: 'MUSIC' },
  { displayName: 'B.A. Arabic', category: 'arts_science', shortName: 'BA Arabic', departmentId: 'LANG' },
  { displayName: 'B.A. Sanskrit', category: 'arts_science', shortName: 'BA Sanskrit', departmentId: 'LANG' },
  { displayName: 'B.A. Afzal-Ul-Ulama', category: 'arts_science', shortName: 'BA Afzal', departmentId: 'LANG' },
  { displayName: 'B.Litt. Tamil', category: 'arts_science', shortName: 'B.Litt Tamil', departmentId: 'TAMIL' },
  { displayName: 'B.S.W. Bachelor of Social Work', category: 'arts_science', shortName: 'BSW', departmentId: 'BSW' },

  // ── 14. Arts & Science — Computer / Technology ──
  { displayName: 'B.Sc. Computer Science', category: 'arts_science', shortName: 'BSc CS', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Computer Applications', category: 'arts_science', shortName: 'BSc CS (CA)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Data Science', category: 'arts_science', shortName: 'BSc CS (DS)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Artificial Intelligence', category: 'arts_science', shortName: 'BSc CS (AI)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Artificial Intelligence and Data Science', category: 'arts_science', shortName: 'BSc CS (AIDS)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Artificial Intelligence and Machine Learning', category: 'arts_science', shortName: 'BSc CS (AIML)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Cyber Security', category: 'arts_science', shortName: 'BSc CS (Cyber)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Data Analytics', category: 'arts_science', shortName: 'BSc CS (DA)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science with Cognitive Systems', category: 'arts_science', shortName: 'BSc CS (CogSys)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science (DevOps and Cloud)', category: 'arts_science', shortName: 'BSc CS (Cloud)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science (Full Stack Web Development)', category: 'arts_science', shortName: 'BSc CS (FullStack)', departmentId: 'CS' },
  { displayName: 'B.Sc. Computer Science (Data Science and Visualization)', category: 'arts_science', shortName: 'BSc CS (DSV)', departmentId: 'CS' },
  { displayName: 'B.Sc. Artificial Intelligence and Machine Learning', category: 'arts_science', shortName: 'BSc AIML', departmentId: 'AI' },
  { displayName: 'B.Sc. Artificial Intelligence and Data Science', category: 'arts_science', shortName: 'BSc AIDS', departmentId: 'AI' },
  { displayName: 'B.Sc. Data Science', category: 'arts_science', shortName: 'BSc Data Sci', departmentId: 'DS' },
  { displayName: 'B.Sc. Data Science and Analytics', category: 'arts_science', shortName: 'BSc DSA', departmentId: 'DS' },
  { displayName: 'B.Sc. Cyber Security', category: 'arts_science', shortName: 'BSc Cyber', departmentId: 'CYBER' },
  { displayName: 'B.Sc. Information Technology', category: 'arts_science', shortName: 'BSc IT', departmentId: 'IT' },
  { displayName: 'B.Sc. Computer Technology', category: 'arts_science', shortName: 'BSc CT', departmentId: 'CT' },
  { displayName: 'B.Sc. Software Systems', category: 'arts_science', shortName: 'BSc SS', departmentId: 'SS' },
  { displayName: 'B.Sc. Internet of Things', category: 'arts_science', shortName: 'BSc IoT', departmentId: 'IOT' },
  { displayName: 'B.Sc. Digital and Cyber Forensic Science', category: 'arts_science', shortName: 'BSc Forensic', departmentId: 'FORENSIC' },
  { displayName: 'B.C.A. Bachelor of Computer Applications', category: 'arts_science', shortName: 'BCA', departmentId: 'BCA' },

  // ── 15. Arts & Science — Basic Sciences ──
  { displayName: 'B.Sc. Mathematics', category: 'arts_science', shortName: 'BSc Maths', departmentId: 'MATHS' },
  { displayName: 'B.Sc. Mathematics with Computer Applications', category: 'arts_science', shortName: 'BSc Maths (CA)', departmentId: 'MATHS' },
  { displayName: 'B.Sc. Physics', category: 'arts_science', shortName: 'BSc Physics', departmentId: 'PHYSICS' },
  { displayName: 'B.Sc. Physics with Computer Applications', category: 'arts_science', shortName: 'BSc Physics (CA)', departmentId: 'PHYSICS' },
  { displayName: 'B.Sc. Chemistry', category: 'arts_science', shortName: 'BSc Chem', departmentId: 'CHEM' },
  { displayName: 'B.Sc. Statistics', category: 'arts_science', shortName: 'BSc Stats', departmentId: 'STATS' },
  { displayName: 'B.Sc. Botany', category: 'arts_science', shortName: 'BSc Botany', departmentId: 'BOTANY' },
  { displayName: 'B.Sc. Zoology', category: 'arts_science', shortName: 'BSc Zoology', departmentId: 'ZOOLOGY' },
  { displayName: 'B.Sc. Geography', category: 'arts_science', shortName: 'BSc Geography', departmentId: 'GEOGRAPHY' },
  { displayName: 'B.Sc. Geology', category: 'arts_science', shortName: 'BSc Geology', departmentId: 'GEOLOGY' },
  { displayName: 'B.Sc. Environmental Science', category: 'arts_science', shortName: 'BSc Env Sci', departmentId: 'ENV' },

  // ── 16. Arts & Science — Life Sciences ──
  { displayName: 'B.Sc. Biochemistry', category: 'arts_science', shortName: 'BSc Biochem', departmentId: 'BIOCHEM' },
  { displayName: 'B.Sc. Biochemistry with Nanotechnology', category: 'arts_science', shortName: 'BSc Biochem Nano', departmentId: 'BIOCHEM' },
  { displayName: 'B.Sc. Biotechnology', category: 'arts_science', shortName: 'BSc Biotech', departmentId: 'BIOTECH' },
  { displayName: 'B.Sc. Microbiology', category: 'arts_science', shortName: 'BSc Microbio', departmentId: 'MICROBIO' },
  { displayName: 'B.Sc. Plant Biology and Biotechnology', category: 'arts_science', shortName: 'BSc Plant Biotech', departmentId: 'BOTANY' },
  { displayName: 'B.Sc. Agri Biology', category: 'arts_science', shortName: 'BSc Agri Bio', departmentId: 'AGRI' },
  { displayName: 'B.Sc. Nutrition and Dietetics', category: 'arts_science', shortName: 'BSc Nutrition', departmentId: 'NUTRITION' },
  { displayName: 'B.Sc. Food Science and Nutrition', category: 'arts_science', shortName: 'BSc Food Sci', departmentId: 'FOOD' },
  { displayName: 'B.Sc. Home Science', category: 'arts_science', shortName: 'BSc Home Sci', departmentId: 'HOMESCI' },
  { displayName: 'B.Sc. Home Science - Nutrition and Dietetics', category: 'arts_science', shortName: 'BSc Home Sci ND', departmentId: 'HOMESCI' },
  { displayName: 'B.Sc. Psychology', category: 'arts_science', shortName: 'BSc Psychology', departmentId: 'PSYCHOLOGY' },

  // ── 17. Arts & Science — Electronics ──
  { displayName: 'B.Sc. Electronics', category: 'arts_science', shortName: 'BSc Electronics', departmentId: 'ELECTRONICS' },
  { displayName: 'B.Sc. Electronics and Communication Systems', category: 'arts_science', shortName: 'BSc ECS', departmentId: 'ELECTRONICS' },

  // ── 18. Arts & Science — Media / Design / Fashion ──
  { displayName: 'B.Sc. Visual Communication', category: 'arts_science', shortName: 'BSc VisCom', departmentId: 'VISCOM' },
  { displayName: 'B.Sc. Visual Communication (Electronic Media)', category: 'arts_science', shortName: 'BSc VisCom EM', departmentId: 'VISCOM' },
  { displayName: 'B.Sc. Animation and Visual Effects', category: 'arts_science', shortName: 'BSc Animation', departmentId: 'ANIMATION' },
  { displayName: 'B.Sc. Multimedia and Web Technology', category: 'arts_science', shortName: 'BSc Multimedia', departmentId: 'MULTIMEDIA' },
  { displayName: 'B.Sc. Apparel and Fashion Technology', category: 'arts_science', shortName: 'BSc AFT', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Apparel Fashion Designing', category: 'arts_science', shortName: 'BSc AFD', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Apparel Manufacturing and Merchandising', category: 'arts_science', shortName: 'BSc AMM', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Apparel Production Technology', category: 'arts_science', shortName: 'BSc APT', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Costume Design and Fashion', category: 'arts_science', shortName: 'BSc CDF', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Fashion Technology and Costume Designing', category: 'arts_science', shortName: 'BSc FTCD', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Fashion Apparel Management', category: 'arts_science', shortName: 'BSc FAM', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Interior Design', category: 'arts_science', shortName: 'BSc Interior Design', departmentId: 'DESIGN' },
  { displayName: 'B.Sc. Garment Design and Production', category: 'arts_science', shortName: 'BSc GDP', departmentId: 'FASHION' },
  { displayName: 'B.Sc. Beauty and Wellness', category: 'arts_science', shortName: 'BSc Beauty', departmentId: 'WELLNESS' },

  // ── 19. Arts & Science — Hospitality / Professional ──
  { displayName: 'B.Sc. Catering Science and Hotel Management', category: 'arts_science', shortName: 'BSc CSHM', departmentId: 'HOTEL' },
  { displayName: 'B.Sc. Hotel Management and Catering Science', category: 'arts_science', shortName: 'BSc HMCS', departmentId: 'HOTEL' },
  { displayName: 'B.Sc. Hospitality and Tourism Management', category: 'arts_science', shortName: 'BSc HTM', departmentId: 'HOTEL' },
  { displayName: 'B.Sc. Hospitality and Airline Catering Management', category: 'arts_science', shortName: 'BSc HACM', departmentId: 'HOTEL' },
  { displayName: 'B.Sc. Hospital Administration', category: 'arts_science', shortName: 'BSc Hosp Admin', departmentId: 'HOSPITAL' },
  { displayName: 'B.Sc. Aviation', category: 'arts_science', shortName: 'BSc Aviation', departmentId: 'AVIATION' },
  { displayName: 'B.Sc. Forensic Science', category: 'arts_science', shortName: 'BSc Forensic', departmentId: 'FORENSIC' },
  { displayName: 'B.Sc. Clinical Laboratory Technology', category: 'arts_science', shortName: 'BSc CLT', departmentId: 'CLINICAL' },
  { displayName: 'B.Sc. Physical Education', category: 'arts_science', shortName: 'BSc Phy Edu', departmentId: 'PHYEDU' },
  { displayName: 'B.Sc. Physical Education, Health Education and Sports', category: 'arts_science', shortName: 'BSc PE HES', departmentId: 'PHYEDU' },

  // ── 20. Commerce — B.Com. ──
  { displayName: 'B.Com.', category: 'arts_science', shortName: 'B.Com General', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Accounting and Finance', category: 'arts_science', shortName: 'B.Com (AF)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Accounting and Taxation', category: 'arts_science', shortName: 'B.Com (AT)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Actuarial Management', category: 'arts_science', shortName: 'B.Com (AM)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Applied', category: 'arts_science', shortName: 'B.Com (Applied)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Applied Business Accounting', category: 'arts_science', shortName: 'B.Com (ABA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Banking', category: 'arts_science', shortName: 'B.Com (Banking)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Bank Management', category: 'arts_science', shortName: 'B.Com (BM)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Banking and Finance', category: 'arts_science', shortName: 'B.Com (BF)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Banking and Insurance', category: 'arts_science', shortName: 'B.Com (BI)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Banking and Insurance Management', category: 'arts_science', shortName: 'B.Com (BIM)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Business Administration', category: 'arts_science', shortName: 'B.Com (BA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Business Analytics', category: 'arts_science', shortName: 'B.Com (B.Analytics)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Business Process Services', category: 'arts_science', shortName: 'B.Com (BPS)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Business Process Systems', category: 'arts_science', shortName: 'B.Com (BP Systems)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Capital Markets', category: 'arts_science', shortName: 'B.Com (CM)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Computer Applications', category: 'arts_science', shortName: 'B.Com (CA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Co-operation', category: 'arts_science', shortName: 'B.Com (Co-op)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Co-operation with Computer Applications', category: 'arts_science', shortName: 'B.Com (Co-op CA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Corporate Secretaryship', category: 'arts_science', shortName: 'B.Com (CS)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Corporate Secretaryship with Computer Applications', category: 'arts_science', shortName: 'B.Com (CS CA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Cost Accounting', category: 'arts_science', shortName: 'B.Com (Cost Acct)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Cost and Management Accounting', category: 'arts_science', shortName: 'B.Com (CMA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Digital Marketing and Data Mining', category: 'arts_science', shortName: 'B.Com (DMDM)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. E-Commerce', category: 'arts_science', shortName: 'B.Com (E-Com)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Finance', category: 'arts_science', shortName: 'B.Com (Finance)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Financial Services', category: 'arts_science', shortName: 'B.Com (FS)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Financial System', category: 'arts_science', shortName: 'B.Com (Fin System)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Foreign Trade', category: 'arts_science', shortName: 'B.Com (FT)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Goods and Services Tax', category: 'arts_science', shortName: 'B.Com (GST)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Information Technology', category: 'arts_science', shortName: 'B.Com (IT)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. International Business', category: 'arts_science', shortName: 'B.Com (IB)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. International Business and Finance', category: 'arts_science', shortName: 'B.Com (IBF)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Professional Accounting', category: 'arts_science', shortName: 'B.Com (PA)', departmentId: 'COMMERCE' },
  { displayName: 'B.Com. Retail Marketing', category: 'arts_science', shortName: 'B.Com (Retail)', departmentId: 'COMMERCE' },

  // ── 21. Management — BBA ──
  { displayName: 'B.B.A.', category: 'arts_science', shortName: 'BBA General', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Aviation Management', category: 'arts_science', shortName: 'BBA (Aviation)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Banking', category: 'arts_science', shortName: 'BBA (Banking)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Business Process Management', category: 'arts_science', shortName: 'BBA (BPM)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Computer Applications', category: 'arts_science', shortName: 'BBA (CA)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Information Systems', category: 'arts_science', shortName: 'BBA (IS)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. International Business', category: 'arts_science', shortName: 'BBA (IB)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Logistics', category: 'arts_science', shortName: 'BBA (Logistics)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Logistics and Supply Chain Management', category: 'arts_science', shortName: 'BBA (LSCM)', departmentId: 'MANAGEMENT' },
  { displayName: 'B.B.A. Retail Management', category: 'arts_science', shortName: 'BBA (Retail)', departmentId: 'MANAGEMENT' },
];

function generateId(displayName) {
  return 'prog_' + displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseProgram(p) {
  const disp = p.displayName;
  let degree = '';
  let rest = disp;

  const degrees = ['B.E.', 'B.Tech.', 'B.Arch.', 'B.A.', 'B.Litt.', 'B.S.W.', 'B.Sc.', 'B.C.A.', 'B.Com.', 'B.B.A.'];
  for (const d of degrees) {
    if (disp.startsWith(d)) {
      degree = d;
      rest = disp.slice(d.length).trim();
      break;
    }
  }

  let specialization = undefined;
  let name = rest;

  const parenMatch = rest.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    name = parenMatch[1].trim();
    specialization = parenMatch[2].trim();
  }

  const id = generateId(disp);

  return {
    id,
    degree: degree || 'UG Degree',
    name: name || disp,
    specialization,
    displayName: disp,
    shortName: p.shortName,
    category: p.category,
    level: 'UG',
    departmentId: p.departmentId,
    isActive: true,
  };
}

const parsed = rawPrograms.map(parseProgram);
console.log('Total parsed programs:', parsed.length);
console.log('Engineering:', parsed.filter(p => p.category === 'engineering').length);
console.log('Arts & Science:', parsed.filter(p => p.category === 'arts_science').length);

fs.writeFileSync('scratch/parsed_programs.json', JSON.stringify(parsed, null, 2));
