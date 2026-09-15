const { AC_SCOPED_STUDENTS, AC_EVENT_GROUPS } = require('../src/data/acWorkspaceData');
const { INITIAL_CREDIT_RECORDS } = require('../src/data/academicCreditsData');
const { DEFAULT_FACULTY_USER } = require('../src/data/facultyWorkspaceData');

console.log('AC_SCOPED_STUDENTS count:', AC_SCOPED_STUDENTS.length);
console.log('AC_EVENT_GROUPS count:', AC_EVENT_GROUPS.length);
console.log('INITIAL_CREDIT_RECORDS count:', INITIAL_CREDIT_RECORDS.length);
console.log('DEFAULT_FACULTY_USER:', DEFAULT_FACULTY_USER.name, DEFAULT_FACULTY_USER.institution);

// Check if generating HTML for each works without throwing
try {
  const rows1 = AC_SCOPED_STUDENTS.map((st, idx) => `<tr><td>${idx+1}</td><td>${st.name}</td></tr>`).join('');
  console.log('student_achievement HTML rows length:', rows1.length);
  
  const rows2 = INITIAL_CREDIT_RECORDS.map((c, idx) => `<tr><td>${idx+1}</td><td>${c.courseName}</td></tr>`).join('');
  console.log('academic_credit HTML rows length:', rows2.length);

  const rows3 = AC_EVENT_GROUPS.map((g, idx) => `<tr><td>${idx+1}</td><td>${g.eventName}</td></tr>`).join('');
  console.log('verification_summary HTML rows length:', rows3.length);
} catch (err) {
  console.error('Error generating HTML:', err);
}
