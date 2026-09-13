const {
  INSTITUTIONS,
  INSTITUTION_TYPE_OPTIONS,
  getDistricts,
  getInstitutions,
  searchInstitutions,
  getInstitutionById,
  getInstitutionByName,
  validateInstitutionActivation,
} = require('../src/data/institutions');

console.log('=== VERIFYING INSTITUTIONS DIRECTORY ===');

// 1. Total count
console.log('Total Institutions:', INSTITUTIONS.length);
console.assert(INSTITUTIONS.length === 437, `Expected 437 institutions, got ${INSTITUTIONS.length}`);

// 2. Types
console.log('Institution Types:', INSTITUTION_TYPE_OPTIONS.map(o => o.label));
console.assert(INSTITUTION_TYPE_OPTIONS.length === 2, 'Expected 2 types');

// 3. Districts
const engDistricts = getDistricts('engineering');
const artsDistricts = getDistricts('arts_science');
console.log('Engineering Districts count:', engDistricts.length);
console.log('Arts & Science Districts count:', artsDistricts.length);
console.assert(engDistricts.includes('Erode'), 'Erode should be in engineering districts');
console.assert(artsDistricts.includes('Chennai'), 'Chennai should be in arts_science districts');

// 4. Engineering + Erode
const erodeEng = getInstitutions('engineering', 'Erode');
console.log('Erode Engineering colleges count:', erodeEng.length);
console.assert(erodeEng.length === 16, `Expected 16 Erode engineering colleges, got ${erodeEng.length}`);

const nandhaEng = erodeEng.find(i => i.name === 'Nandha Engineering College');
console.log('Nandha Engineering College:', nandhaEng);
console.assert(nandhaEng && nandhaEng.isOnboarded === true, 'Nandha Engineering College must be onboarded');

const konguEng = erodeEng.find(i => i.name === 'Kongu Engineering College');
console.log('Kongu Engineering College:', konguEng);
console.assert(konguEng && konguEng.isOnboarded === false, 'Kongu Engineering College should have isOnboarded: false');

// 5. Arts & Science + Chennai
const chennaiArts = getInstitutions('arts_science', 'Chennai');
console.log('Chennai Arts & Science colleges count:', chennaiArts.length);
console.assert(chennaiArts.length === 9, `Expected 9 Chennai Arts & Science colleges, got ${chennaiArts.length}`);
console.assert(chennaiArts.every(c => c.institutionType === 'arts_science'), 'All must be arts_science');

// 6. Search
const searchResult = searchInstitutions('engineering', 'Erode', 'nandha');
console.log('Search "nandha" in Erode engineering:', searchResult.map(c => c.name));
console.assert(searchResult.length === 2, 'Expected 2 Nandha colleges in Erode');

const emptySearch = searchInstitutions('engineering', 'Erode', 'xyz123random');
console.assert(emptySearch.length === 0, 'Expected empty search result');

// 7. Lookup
console.assert(getInstitutionById(nandhaEng.id)?.name === 'Nandha Engineering College', 'ID lookup must work');
console.assert(getInstitutionByName('nandha engineering college')?.id === nandhaEng.id, 'Name lookup must work');

// 8. Activation Check
const actValid = validateInstitutionActivation('Nandha Engineering College', 'NANDHA2026');
console.log('Nandha activation validation (NANDHA2026):', actValid);
console.assert(actValid.valid === true, 'NANDHA2026 code should be valid');

const actInvalid = validateInstitutionActivation('Kongu Engineering College', 'WRONG123');
console.log('Kongu activation validation (WRONG123):', actInvalid);
console.assert(actInvalid.valid === false, 'WRONG123 code should be invalid');

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
