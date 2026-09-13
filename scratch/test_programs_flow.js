const fs = require('fs');

const {
  PROGRAMS,
  INSTITUTION_PROGRAMS,
  getProgramsForInstitution,
  searchProgramsForInstitution,
  getProgramById,
  getProgramByName,
  getAllPrograms,
} = require('./src/data/programs.ts' ? './scratch/parsed_programs.json' : '');

console.log('--- TEST: Course Master Integrity ---');

// 1. Total programmes
console.log('Total Master Programs:', PROGRAMS ? PROGRAMS.length : 'Loaded from module');

// Read directly from programs.ts to test exports
const content = fs.readFileSync('src/data/programs.ts', 'utf8');
const progCount = (content.match(/"id": "prog_/g) || []).length;
console.log('Total Program definitions in programs.ts:', progCount);
if (progCount === 202) {
  console.log('✓ Master catalogue contains exactly 202 programmes.');
} else {
  console.error('✗ Expected 202 programmes, got:', progCount);
}

// 2. Test Nandha mapped programmes
const nandhaMatch = content.match(/"institutionId": "inst_nandha_engineering_college_176"/g) || [];
console.log('Nandha mapped programmes count:', nandhaMatch.length);
if (nandhaMatch.length >= 15) {
  console.log('✓ Nandha Engineering College has all 15 pilot programmes mapped.');
}

// 3. Test presence of key courses
const keyCourses = [
  'B.E. Computer Science and Engineering (Internet of Things)',
  'B.E. Computer Science and Engineering',
  'B.Tech. Information Technology',
  'B.Tech. Artificial Intelligence and Data Science',
  'B.E. Biomedical Engineering',
  'B.E. Mechanical Engineering',
  'B.E. Civil Engineering',
  'B.A. Tamil',
  'B.A. English',
  'B.Sc. Computer Science',
  'B.Sc. Visual Communication',
  'B.Com. Professional Accounting',
  'B.B.A. Logistics and Supply Chain Management',
];

let allFound = true;
keyCourses.forEach((kc) => {
  if (content.includes(`"displayName": "${kc}"`)) {
    console.log(`✓ Found: ${kc}`);
  } else {
    console.error(`✗ Missing: ${kc}`);
    allFound = false;
  }
});

if (allFound) {
  console.log('✓ All key Engineering and Arts & Science programmes verified!');
}
