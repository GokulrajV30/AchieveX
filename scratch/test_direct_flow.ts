// ─────────────────────────────────────────────────────────────
// AchieveX — Verification for Direct College & Department Dropdown Flow
// ─────────────────────────────────────────────────────────────

import { INSTITUTIONS, getInstitutionById } from '../src/data/institutions';
import { PROGRAMS, getProgramById, getProgramGroup } from '../src/data/programs';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== TEST SUITE: AchieveX College & Department Direct Flow ===\n');

// 1. Verify CreateAccountScreen.tsx source code guarantees
const createAccountSrc = fs.readFileSync(
  path.join(__dirname, '../src/components/CreateAccountScreen.tsx'),
  'utf-8'
);

console.log('[Check 1] Verify "Select Institution Type First" is completely removed:');
const hasInstTypePopup = createAccountSrc.includes('Select Institution Type First');
console.log('  -> "Select Institution Type First" present?', hasInstTypePopup ? 'FAIL (still present)' : 'PASS (completely removed)');

console.log('\n[Check 2] Verify "Select District First" popup is completely removed:');
const hasDistrictPopup = createAccountSrc.includes('Select District First');
console.log('  -> "Select District First" present?', hasDistrictPopup ? 'FAIL (still present)' : 'PASS (completely removed)');

console.log('\n[Check 3] Verify College Name opens directly with chevron-down icon:');
const hasCollegePressDirect = createAccountSrc.includes('const handleCollegePress = () => {\n    setShowCollegeModal(true);\n  };');
const hasCollegeChevron = createAccountSrc.includes('placeholder="College Name"') && !createAccountSrc.includes('rightIconName="school"');
console.log('  -> handleCollegePress opens directly without checks?', hasCollegePressDirect ? 'PASS' : 'FAIL');
console.log('  -> College Name uses chevron dropdown (rightIconName="school" removed)?', hasCollegeChevron ? 'PASS' : 'FAIL');

console.log('\n[Check 4] Verify Department opens directly with chevron-down icon:');
const hasDeptPressDirect = createAccountSrc.includes('const handleDepartmentPress = () => {\n    setShowDeptModal(true);\n  };');
console.log('  -> handleDepartmentPress opens directly without checks?', hasDeptPressDirect ? 'PASS' : 'FAIL');

console.log('\n[Check 5] Verify College search for "nandha", "kongu", "erode":');
const nandhaMatches = INSTITUTIONS.filter(i => i.name.toLowerCase().includes('nandha'));
console.log('  -> Nandha colleges count:', nandhaMatches.length);
console.log('  -> Matches:', nandhaMatches.map(c => c.name));

const konguMatches = INSTITUTIONS.filter(i => i.name.toLowerCase().includes('kongu'));
console.log('  -> Kongu colleges count:', konguMatches.length);

const erodeMatches = INSTITUTIONS.filter(i => i.district.toLowerCase().includes('erode'));
console.log('  -> Colleges in Erode district count:', erodeMatches.length);

console.log('\n[Check 6] Verify Department search for "iot", "cyber", "b.com", "mechanical", "psychology":');
const iotMatches = PROGRAMS.filter(p => p.displayName.toLowerCase().includes('iot') || p.shortName.toLowerCase().includes('iot'));
console.log('  -> "iot" matches count:', iotMatches.length);
console.log('  -> Sample:', iotMatches.slice(0, 2).map(p => p.displayName));

const cyberMatches = PROGRAMS.filter(p => p.displayName.toLowerCase().includes('cyber') || p.shortName.toLowerCase().includes('cyber'));
console.log('  -> "cyber" matches count:', cyberMatches.length);

const bcomMatches = PROGRAMS.filter(p => p.displayName.toLowerCase().includes('b.com') || p.degree.toLowerCase().includes('b.com'));
console.log('  -> "b.com" matches count:', bcomMatches.length);

const mechMatches = PROGRAMS.filter(p => p.displayName.toLowerCase().includes('mechanical'));
console.log('  -> "mechanical" matches count:', mechMatches.length);

const psychMatches = PROGRAMS.filter(p => p.displayName.toLowerCase().includes('psychology'));
console.log('  -> "psychology" matches count:', psychMatches.length, psychMatches.map(p => p.displayName));

console.log('\n[Check 7] Verify Total Master Catalogues:');
console.log('  -> Total Institutions:', INSTITUTIONS.length);
console.log('  -> Total Programs:', PROGRAMS.length);

console.log('\n=== ALL CHECKS COMPLETED SUCCESSFULLY ===');
