import {
  INSTITUTIONS,
  INSTITUTION_TYPE_OPTIONS,
  getDistricts,
  getInstitutions,
  getInstitutionById,
} from '../src/data/institutions';
import {
  PROGRAMS,
  getProgramsForInstitution,
  getProgramById,
  getAllPrograms,
  getProgramGroup,
} from '../src/data/programs';

console.log('═══════════════════════════════════════════════════════════');
console.log(' ACHIEVEX — COLLEGE & DEPARTMENT DROPDOWNS VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

// 1. Institution Type Options
console.log('[1] Testing Institution Type Options:');
console.log('    Options:', INSTITUTION_TYPE_OPTIONS.map((o) => o.label).join(', '));
if (
  INSTITUTION_TYPE_OPTIONS.some((o) => o.value === 'engineering') &&
  INSTITUTION_TYPE_OPTIONS.some((o) => o.value === 'arts_science')
) {
  console.log('    ✓ Engineering and Arts & Science options verified');
} else {
  throw new Error('Missing institution types');
}

// 2. District Filtering for Engineering
console.log('\n[2] Testing Districts for Engineering:');
const engDistricts = getDistricts('engineering');
console.log(`    Total Engineering districts: ${engDistricts.length}`);
if (engDistricts.includes('Erode') && engDistricts.includes('Chennai') && engDistricts.includes('Coimbatore')) {
  console.log('    ✓ Erode, Chennai, Coimbatore are available in Engineering districts');
} else {
  throw new Error('Expected districts missing');
}

// 3. College Name Filtered by Type (engineering) + District (Erode)
console.log('\n[3] Testing Colleges for Engineering in Erode:');
const erodeEngColleges = getInstitutions('engineering', 'Erode');
console.log(`    Total Erode Engineering colleges: ${erodeEngColleges.length}`);
erodeEngColleges.forEach((c) => console.log(`    - ${c.name}`));

const hasNandha = erodeEngColleges.some((c) => c.name.includes('Nandha Engineering College'));
const hasKongu = erodeEngColleges.some((c) => c.name.includes('Kongu Engineering College'));
const hasBannari = erodeEngColleges.some((c) => c.name.includes('Bannari Amman'));
const hasChennai = erodeEngColleges.some((c) => c.district.toLowerCase() === 'chennai');

if (hasNandha && hasKongu && hasBannari && !hasChennai) {
  console.log('    ✓ Erode Engineering colleges verified (Nandha, Kongu, Bannari present, Chennai excluded)');
} else {
  throw new Error('Erode college filtering failed');
}

// 4. Department Options for Nandha Engineering College
console.log('\n[4] Testing Department Options for Nandha Engineering College:');
const nandha = erodeEngColleges.find((c) => c.name.includes('Nandha Engineering College'))!;
const nandhaDeptOptions = getProgramsForInstitution(nandha.id);
console.log(`    Nandha mapped branches count: ${nandhaDeptOptions.length}`);
nandhaDeptOptions.forEach((p) => {
  console.log(`    - ${p.displayName} [${p.shortName}] (Group: ${getProgramGroup(p)})`);
});

const iotBranch = nandhaDeptOptions.find((p) =>
  p.displayName.toLowerCase().includes('internet of things')
);
if (iotBranch && iotBranch.displayName === 'B.E. Computer Science and Engineering (Internet of Things)') {
  console.log('    ✓ Nandha CSE (IoT) correctly available: ' + iotBranch.displayName);
} else {
  throw new Error('Nandha CSE (IoT) missing');
}

// 5. Search test for "iot", "cyber", "b.com"
console.log('\n[5] Testing Search functionality:');
const allEng = getAllPrograms('engineering');
const iotEng = allEng.filter((p) => p.displayName.toLowerCase().includes('iot') || p.displayName.toLowerCase().includes('internet of things'));
console.log(`    Engineering "iot" search result: ${iotEng.map((p) => p.displayName).join(', ')}`);

const cyberEng = allEng.filter((p) => p.displayName.toLowerCase().includes('cyber'));
console.log(`    Engineering "cyber" search result: ${cyberEng.map((p) => p.displayName).join(', ')}`);

const allArts = getAllPrograms('arts_science');
const bcomArts = allArts.filter((p) => p.displayName.toLowerCase().startsWith('b.com') || p.degree === 'B.Com.');
console.log(`    Arts & Science "b.com" search results count: ${bcomArts.length}`);

if (iotEng.length > 0 && cyberEng.length > 0 && bcomArts.length >= 30) {
  console.log('    ✓ Search for iot, cyber, and b.com verified');
} else {
  throw new Error('Search filtering failed');
}

// 6. Section Labels
console.log('\n[6] Testing Section Group Labels:');
const groups = new Set(PROGRAMS.map((p) => getProgramGroup(p)));
console.log('    Active Program Groups:', Array.from(groups).join(', '));
if (groups.has('ENGINEERING') && groups.has('ARTS & SCIENCE') && groups.has('COMMERCE') && groups.has('MANAGEMENT')) {
  console.log('    ✓ All 4 section groups verified (ENGINEERING, ARTS & SCIENCE, COMMERCE, MANAGEMENT)');
} else {
  throw new Error('Missing section groups');
}

// 7. Arts & Science College selection & Department fallback
console.log('\n[7] Testing Arts & Science Flow:');
const artsDistricts = getDistricts('arts_science');
const cbeArtsColleges = getInstitutions('arts_science', 'Coimbatore');
console.log(`    Coimbatore Arts & Science colleges: ${cbeArtsColleges.length}`);
console.log(`    Total Arts & Science master programmes for fallback: ${allArts.length}`);
if (cbeArtsColleges.length > 0 && allArts.length === 144) {
  console.log('    ✓ Arts & Science colleges and master fallback (144 programmes) verified');
} else {
  throw new Error('Arts & Science flow failed');
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(' ALL TESTS PASSED SUCCESSFULLY!');
console.log('═══════════════════════════════════════════════════════════\n');
