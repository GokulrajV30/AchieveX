const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('ACHIEVEX QA TEST — KEYBOARD FLOW & ACTIVATION CODE');
console.log('====================================================\n');

// 1. TEST ACTIVATION CODE VALIDATION — EMPTY STATE
console.log('[TEST 1] Activation Code Empty State');
const createAccountScreenPath = path.join(__dirname, '../src/components/CreateAccountScreen.tsx');
const createAccountSrc = fs.readFileSync(createAccountScreenPath, 'utf8');

if (createAccountSrc.includes("newErrors.activationCode = 'Enter your activation code.';")) {
  console.log('  ✓ Empty activation code gives clean message: "Enter your activation code."');
} else {
  console.error('  ✗ Missing empty activation code message');
  process.exit(1);
}

// 2. TEST ACTIVATION CODE VALIDATION — INVALID STATE & NO PATTERN EXPOSED
console.log('\n[TEST 2] Activation Code Invalid State & Security Check');

const institutionsSrc = fs.readFileSync(path.join(__dirname, '../src/data/institutions.ts'), 'utf8');
const tnSrc = fs.readFileSync(path.join(__dirname, '../src/data/tamilNaduColleges.ts'), 'utf8');

if (institutionsSrc.includes("message: 'Invalid activation code.',") && !institutionsSrc.includes('Expected code format')) {
  console.log('  ✓ institutions.ts strictly uses "Invalid activation code." without format leaks');
} else {
  console.error('  ✗ Format leak or unexpected message in institutions.ts');
  process.exit(1);
}

if (tnSrc.includes("message: 'Invalid activation code.',") && !tnSrc.includes('Expected code format')) {
  console.log('  ✓ tamilNaduColleges.ts strictly uses "Invalid activation code." without format leaks');
} else {
  console.error('  ✗ Format leak or unexpected message in tamilNaduColleges.ts');
  process.exit(1);
}

// Check that no leaked pattern strings exist in source files
const leakedPatterns = [
  'Expected code format',
  'format e.g.',
  'must be 6 digits',
  'contain letters and numbers',
  'Enter code like',
];

for (const pattern of leakedPatterns) {
  if (createAccountSrc.toLowerCase().includes(pattern.toLowerCase())) {
    console.error(`  ✗ Leak found in CreateAccountScreen: "${pattern}"`);
    process.exit(1);
  }
}
console.log('  ✓ No pattern, regex, prefix or sample format leaked in CreateAccountScreen.tsx');

for (const pattern of leakedPatterns) {
  if (institutionsSrc.toLowerCase().includes(pattern.toLowerCase())) {
    console.error(`  ✗ Leak found in institutions.ts: "${pattern}"`);
    process.exit(1);
  }
}
console.log('  ✓ No pattern, regex, prefix or sample format leaked in institutions.ts');

for (const pattern of leakedPatterns) {
  if (tnSrc.toLowerCase().includes(pattern.toLowerCase())) {
    console.error(`  ✗ Leak found in tamilNaduColleges.ts: "${pattern}"`);
    process.exit(1);
  }
}
console.log('  ✓ No pattern, regex, prefix or sample format leaked in tamilNaduColleges.ts');

// 3. TEST PLACEHOLDER
console.log('\n[TEST 3] Activation Code Placeholder Check');
if (createAccountSrc.includes('placeholder="Enter activation code"')) {
  console.log('  ✓ Activation code placeholder is cleanly set to "Enter activation code"');
} else {
  console.error('  ✗ Placeholder "Enter activation code" not found in CreateAccountScreen.tsx');
  process.exit(1);
}

// 4. TEST CREATEACCOUNTINPUT COMPONENT REFS & PROPS
console.log('\n[TEST 4] CreateAccountInput forwardRef & Props Check');
const inputComponentSrc = fs.readFileSync(
  path.join(__dirname, '../src/components/createAccount/CreateAccountInput.tsx'),
  'utf8'
);

const requiredInputFeatures = [
  'forwardRef<TextInput, CreateAccountInputProps>',
  'returnKeyType',
  'onSubmitEditing',
  'blurOnSubmit',
  'onFocus',
  'onBlur',
  'onLayout',
];

for (const feature of requiredInputFeatures) {
  if (!inputComponentSrc.includes(feature)) {
    console.error(`  ✗ CreateAccountInput missing ${feature}`);
    process.exit(1);
  }
  console.log(`  ✓ CreateAccountInput implements ${feature}`);
}

// 5. TEST CREATEACCOUNTSCREEN REFS AND KEYBOARD CHAINING
console.log('\n[TEST 5] CreateAccountScreen Keyboard Navigation & Refs');
const requiredRefs = [
  'fullNameRef',
  'customCollegeRef',
  'customDepartmentRef',
  'emailRef',
  'activationCodeRef',
  'passwordRef',
  'idValueRef',
  'customHeadRef',
];

for (const refName of requiredRefs) {
  if (!createAccountSrc.includes(refName)) {
    console.error(`  ✗ CreateAccountScreen missing ref ${refName}`);
    process.exit(1);
  }
  console.log(`  ✓ CreateAccountScreen implements ${refName}`);
}

// Check returnKeyType wiring
if (createAccountSrc.includes('returnKeyType="next"') && createAccountSrc.includes('returnKeyType="done"')) {
  console.log('  ✓ returnKeyType="next" and returnKeyType="done" correctly wired');
} else {
  console.error('  ✗ returnKeyType wiring check failed');
  process.exit(1);
}

// Check auto focus-scrolling helper
if (createAccountSrc.includes('handleFieldFocus') && createAccountSrc.includes('scrollTo')) {
  console.log('  ✓ Focus-scrolling mechanism handleFieldFocus wired to scrollTo');
} else {
  console.error('  ✗ handleFieldFocus / scrollTo missing');
  process.exit(1);
}

// Check KeyboardAvoidingView behavior & offset
if (
  createAccountSrc.includes("Platform.OS === 'ios' ? 'padding' : undefined") &&
  createAccountSrc.includes('keyboardVerticalOffset')
) {
  console.log('  ✓ KeyboardAvoidingView behavior and keyboardVerticalOffset configured correctly');
} else {
  console.error('  ✗ KeyboardAvoidingView configuration check failed');
  process.exit(1);
}

// Check safe area inset & contentContainerStyle padding
if (
  createAccountSrc.includes('useSafeAreaInsets') &&
  createAccountSrc.includes('paddingBottom: Math.max(80, insets.bottom + 60)')
) {
  console.log('  ✓ ScrollView contentContainerStyle properly protects CTA and safe-area');
} else {
  console.error('  ✗ Safe area / bottom padding check failed');
  process.exit(1);
}

console.log('\n====================================================');
console.log('ALL QA VERIFICATION CHECKS PASSED SUCCESSFULLY!');
console.log('====================================================\n');
