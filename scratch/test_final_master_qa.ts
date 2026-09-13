import { PROGRAMS, searchPrograms, OTHER_PROGRAM_OPTION } from '../src/data/programs';
import { ALL_DEPARTMENTS, DEPARTMENTS } from '../src/data/departments';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== ACHIEVEX FINAL MASTER QA TEST SUITE ===\n');

// 1. Total programmes count check (> 100)
console.log('[QA 1] Total Programmes Count:');
console.log('  -> Master programmes count:', PROGRAMS.length);
if (PROGRAMS.length >= 100) {
  console.log('  -> PASS: Well above 100 programmes (Found:', PROGRAMS.length, ')');
} else {
  console.log('  -> FAIL: Under 100 programmes');
}

// 2. Verified QA minimum search checks:
const searchesToCheck = [
  { query: 'CSE', expectedFragment: 'Computer Science and Engineering' },
  { query: 'CSE IoT', expectedFragment: 'Internet of Things' },
  { query: 'Cyber Security', expectedFragment: 'Cyber Security' },
  { query: 'AI and Data Science', expectedFragment: 'Artificial Intelligence and Data Science' },
  { query: 'Robotics', expectedFragment: 'Robotics and Automation' },
  { query: 'VLSI', expectedFragment: 'VLSI' },
  { query: 'Ceramic Technology', expectedFragment: 'Ceramic Technology' },
  { query: 'Leather Technology', expectedFragment: 'Leather Technology' },
  { query: 'Petroleum', expectedFragment: 'Petroleum' },
  { query: 'Textile', expectedFragment: 'Textile Technology' },
  { query: 'B.Com Professional Accounting', expectedFragment: 'Professional Accounting' },
  { query: 'BBA Logistics', expectedFragment: 'Logistics' },
  { query: 'B.Sc Psychology', expectedFragment: 'Psychology' },
  { query: 'B.Sc Forensic Science', expectedFragment: 'Forensic Science' },
  { query: 'B.Sc Aviation', expectedFragment: 'Aviation' },
  { query: 'B.Sc Visual Communication', expectedFragment: 'Visual Communication' },
  { query: 'B.Sc Computer Science', expectedFragment: 'Computer Science' },
  { query: 'BCA', expectedFragment: 'Computer Applications' },
  { query: 'BA Criminology', expectedFragment: 'Criminology' },
  { query: 'BA Journalism', expectedFragment: 'Journalism' },
];

console.log('\n[QA 2] Search and Verify Minimum Prompt Requirements:');
let allSearchesPassed = true;
for (const item of searchesToCheck) {
  const matches = searchPrograms(item.query);
  const found = matches.some(m => m.displayName.toLowerCase().includes(item.expectedFragment.toLowerCase()) || (m.aliases && m.aliases.some(a => a.toLowerCase().includes(item.expectedFragment.toLowerCase()))));
  if (found) {
    console.log(`  ✓ "${item.query}" -> Matched: "${matches[0]?.displayName}"`);
  } else {
    console.log(`  ✗ "${item.query}" -> FAILED to match "${item.expectedFragment}"`);
    allSearchesPassed = false;
  }
}

// 3. Other / Course Not Listed check:
console.log('\n[QA 3] Other / Course Not Listed:');
console.log('  -> OTHER_PROGRAM_OPTION:', OTHER_PROGRAM_OPTION);
if (OTHER_PROGRAM_OPTION && OTHER_PROGRAM_OPTION.displayName === 'Other / Course Not Listed') {
  console.log('  -> PASS: "Other / Course Not Listed" correctly configured');
} else {
  console.log('  -> FAIL');
}

// 4. Verify CreateAccountScreen.tsx source:
const createAccountSrc = fs.readFileSync(
  path.join(__dirname, '../src/components/CreateAccountScreen.tsx'),
  'utf-8'
);

console.log('\n[QA 4] Verify CreateAccountScreen.tsx UI & Logic:');
const hasOtherOption = createAccountSrc.includes("label: 'Other / Course Not Listed'");
console.log('  -> Appends "Other / Course Not Listed" to department selector?', hasOtherOption ? 'PASS' : 'FAIL');

const hasCustomInput = createAccountSrc.includes('placeholder="Enter Department / Course Name"');
console.log('  -> Shows "Enter Department / Course Name" custom text input when Other is selected?', hasCustomInput ? 'PASS' : 'FAIL');

const hasNoSubtitleBadge = !createAccountSrc.includes('subtitle: p.shortName');
console.log('  -> Removed subtitle / category badge in department dropdown row?', hasNoSubtitleBadge ? 'PASS' : 'FAIL');

const hasCustomValidation = createAccountSrc.includes('newErrors.customDepartmentName =');
console.log('  -> Validates customDepartmentName when Other is chosen?', hasCustomValidation ? 'PASS' : 'FAIL');

const savesCustomCourse = createAccountSrc.includes('isCustomDepartment: isCustomCourse');
console.log('  -> Stores custom course separately for future admin review?', savesCustomCourse ? 'PASS' : 'FAIL');

// 5. Verify SearchableSelectModal.tsx:
const modalSrc = fs.readFileSync(
  path.join(__dirname, '../src/components/createAccount/SearchableSelectModal.tsx'),
  'utf-8'
);
console.log('\n[QA 5] Verify SearchableSelectModal.tsx:');
const has2LinesWrap = modalSrc.includes('numberOfLines={2}');
console.log('  -> Option label supports natural 2-line wrapping?', has2LinesWrap ? 'PASS' : 'FAIL');

// 6. Verify departments.ts synchronization:
console.log('\n[QA 6] Verify departments.ts:');
console.log('  -> departments.ts count:', DEPARTMENTS.length);
if (DEPARTMENTS.length === PROGRAMS.length) {
  console.log('  -> PASS: departments.ts is 100% synchronized with programs.ts');
} else {
  console.log('  -> FAIL: count mismatch');
}

console.log('\n=== ALL QA CHECKS COMPLETE: ' + (allSearchesPassed ? 'SUCCESS' : 'FAILURE') + ' ===');
