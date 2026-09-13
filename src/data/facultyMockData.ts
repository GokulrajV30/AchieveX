export interface FacultyProfile {
  name: string;
  id: string;
  designation: string;
  department: string;
  email: string;
  assignedStudentsCount?: number;
  role: 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
}

export interface StudentRecord {
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  verifiedCount: number;
  points: number;
  rank: number;
  pendingCount: number;
}

export interface TeamMember {
  name: string;
  rollNumber: string;
  verified: boolean;
  assignedProctor: boolean;
}

export interface VerificationItem {
  id: string;
  studentName: string;
  rollNumber: string;
  title: string;
  category: string;
  type: string;
  date: string;
  organization: string;
  level: string;
  result: string;
  points: number;
  participation: 'Individual' | 'Team';
  submittedDate: string;
  proofId: string;
  proofFiles: string[];
  teamMembers?: TeamMember[];
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Resubmission Required';
  rejectionReason?: string;
}

export interface CreditVerificationItem {
  id: string;
  studentName: string;
  rollNumber: string;
  courseType: 'NPTEL' | 'VAC' | 'Credit Course' | 'Other';
  courseName: string;
  provider: string;
  completionDate: string;
  status: 'Completed' | 'Pending';
  credits: number;
  score?: string;
  proofFile: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  rejectionReason?: string;
}

export const FACULTY_PROFILES: Record<string, FacultyProfile> = {
  Proctor: {
    name: 'Dr. Velusamy Proctor',
    id: 'FAC-2026-CS09',
    designation: 'Associate Professor (CSE)',
    department: 'CSE (IoT)',
    email: 'velusamy.cse@nandha.edu.in',
    assignedStudentsCount: 20,
    role: 'Proctor',
  },
  HOD: {
    name: 'Dr. Anand HOD',
    id: 'FAC-2026-CS01',
    designation: 'Professor & HOD',
    department: 'CSE',
    email: 'hod.cse@nandha.edu.in',
    role: 'HOD',
  },
  'Academic Coordinator': {
    name: 'Dr. Ramesh Coordinator',
    id: 'FAC-2026-AC03',
    designation: 'Professor (IT)',
    department: 'Information Technology',
    email: 'ramesh.ac@nandha.edu.in',
    role: 'Academic Coordinator',
  },
  Principal: {
    name: 'Dr. Senthil Principal',
    id: 'FAC-2026-PR01',
    designation: 'Principal',
    department: 'Administration',
    email: 'principal@nandha.edu.in',
    role: 'Principal',
  },
};

export const MOCK_ASSIGNED_STUDENTS: StudentRecord[] = [
  {
    name: 'Gokulraj Velusamy',
    rollNumber: '23CI011',
    department: 'CSE (IoT)',
    year: '3rd Year',
    verifiedCount: 14,
    points: 242,
    rank: 18,
    pendingCount: 1,
  },
  {
    name: 'Arun Kumar',
    rollNumber: '23CI003',
    department: 'CSE (IoT)',
    year: '3rd Year',
    verifiedCount: 6,
    points: 110,
    rank: 42,
    pendingCount: 1,
  },
  {
    name: 'Harish Kumar',
    rollNumber: '23CS045',
    department: 'CSE',
    year: '3rd Year',
    verifiedCount: 3,
    points: 45,
    rank: 120,
    pendingCount: 1,
  },
  {
    name: 'Divya Bharathi',
    rollNumber: '23CS022',
    department: 'CSE',
    year: '3rd Year',
    verifiedCount: 10,
    points: 195,
    rank: 25,
    pendingCount: 0,
  },
  {
    name: 'Naveen Prasath',
    rollNumber: '23CS078',
    department: 'CSE',
    year: '3rd Year',
    verifiedCount: 5,
    points: 75,
    rank: 85,
    pendingCount: 1,
  },
];

export const MOCK_VERIFICATION_QUEUE: VerificationItem[] = [
  {
    id: 'VER-001',
    studentName: 'Gokulraj Velusamy',
    rollNumber: '23CI011',
    title: 'Smart India Hackathon 2026',
    category: 'Technical & Professional',
    type: 'Hackathon',
    date: '18 Aug 2026',
    organization: 'Ministry of Education, GoI',
    level: 'National',
    result: 'Winner',
    points: 100,
    participation: 'Team',
    submittedDate: '19 Aug 2026',
    proofId: 'AX-PR-2311',
    proofFiles: ['SIH_Winner_Certificate.pdf', 'SIH_Team_Photo.jpg'],
    teamMembers: [
      { name: 'Gokulraj Velusamy', rollNumber: '23CI011', verified: false, assignedProctor: true },
      { name: 'Arun Kumar', rollNumber: '23CI003', verified: false, assignedProctor: true },
      { name: 'Rahul', rollNumber: '23CS089', verified: false, assignedProctor: false },
      { name: 'Karthik', rollNumber: '23CS052', verified: true, assignedProctor: false },
      { name: 'Vijay', rollNumber: '23CS110', verified: true, assignedProctor: false },
    ],
    status: 'Pending',
  },
  {
    id: 'VER-002',
    studentName: 'Harish Kumar',
    rollNumber: '23CS045',
    title: 'Zonal Basketball Championship',
    category: 'Sports & Games',
    type: 'Basketball',
    date: '12 Aug 2026',
    organization: 'Anna University Sports Board',
    level: 'Zonal',
    result: 'Runner',
    points: 40,
    participation: 'Individual',
    submittedDate: '15 Aug 2026',
    proofId: 'AX-PR-2312',
    proofFiles: ['AnnaUni_Basketball_Cert.pdf'],
    status: 'Pending',
  },
  {
    id: 'VER-003',
    studentName: 'Arun Kumar',
    rollNumber: '23CI003',
    title: 'AWS Certified Cloud Practitioner',
    category: 'Certifications & Online Learning',
    type: 'Certification',
    date: '08 Aug 2026',
    organization: 'Amazon Web Services',
    level: 'Global',
    result: 'Completed',
    points: 30,
    participation: 'Individual',
    submittedDate: '10 Aug 2026',
    proofId: 'AX-PR-2313',
    proofFiles: ['AWS_Practitioner_Badge.pdf'],
    status: 'Pending',
  },
  {
    id: 'VER-004',
    studentName: 'Naveen Prasath',
    rollNumber: '23CS078',
    title: 'IEEE Conference Paper Presentation',
    category: 'Research & IPR',
    type: 'Paper Presentation',
    date: '02 Aug 2026',
    organization: 'PSG College of Technology',
    level: 'National',
    result: 'Participation',
    points: 25,
    participation: 'Individual',
    submittedDate: '04 Aug 2026',
    proofId: 'AX-PR-2314',
    proofFiles: ['IEEE_PSG_Certificate.pdf'],
    status: 'Pending',
  },
];

export const MOCK_VERIFICATION_HISTORY: VerificationItem[] = [
  {
    id: 'VER-HIS-001',
    studentName: 'Gokulraj Velusamy',
    rollNumber: '23CI011',
    title: 'State Level Debate Competition',
    category: 'Cultural & Co-Curricular',
    type: 'Debate',
    date: '05 Aug 2026',
    organization: 'Anna University',
    level: 'State',
    result: 'Winner',
    points: 35,
    participation: 'Individual',
    submittedDate: '06 Aug 2026',
    proofId: 'AX-PR-1899',
    proofFiles: ['Debate_Winner_Certificate.pdf'],
    status: 'Verified',
  },
  {
    id: 'VER-HIS-002',
    studentName: 'Divya Bharathi',
    rollNumber: '23CS022',
    title: 'TCS HackQuest Phase 1',
    category: 'Technical & Professional',
    type: 'Hackathon',
    date: '28 Jul 2026',
    organization: 'Tata Consultancy Services',
    level: 'National',
    result: 'Selected',
    points: 50,
    participation: 'Individual',
    submittedDate: '30 Jul 2026',
    proofId: 'AX-PR-1877',
    proofFiles: ['TCS_Selected_Certificate.pdf'],
    status: 'Verified',
  },
  {
    id: 'VER-HIS-003',
    studentName: 'Arun Kumar',
    rollNumber: '23CI003',
    title: 'Inter-College Coding Battle',
    category: 'Technical & Professional',
    type: 'Coding Contest',
    date: '20 Jul 2026',
    organization: 'Kongu Engineering College',
    level: 'Inter-College',
    result: 'Third Place',
    points: 15,
    participation: 'Individual',
    submittedDate: '22 Jul 2026',
    proofId: 'AX-PR-1854',
    proofFiles: ['Kongu_ThirdPlace_Cert.pdf'],
    status: 'Rejected',
    rejectionReason: 'Invalid document type. Uploaded a registration receipt instead of completion certificate.',
  },
];

export const MOCK_RESUBMISSION_QUEUE: VerificationItem[] = [
  {
    id: 'VER-RES-001',
    studentName: 'Naveen Prasath',
    rollNumber: '23CS078',
    title: 'Android App Dev Bootcamp',
    category: 'Certifications & Online Learning',
    type: 'Course Completion',
    date: '10 Jul 2026',
    organization: 'Udemy',
    level: 'Global',
    result: 'Completed',
    points: 20,
    participation: 'Individual',
    submittedDate: '12 Jul 2026',
    proofId: 'AX-PR-1785',
    proofFiles: ['Udemy_Android_Receipt.pdf'],
    status: 'Resubmission Required',
    rejectionReason: 'Please upload the final course completion certificate containing the Udemy logo and verification ID instead of the purchase invoice.',
  },
];

export const MOCK_CREDITS_VERIFICATION_QUEUE: CreditVerificationItem[] = [
  {
    id: 'CRE-001',
    studentName: 'Gokulraj Velusamy',
    rollNumber: '23CI011',
    courseType: 'NPTEL',
    courseName: 'Cloud Computing',
    provider: 'NPTEL / IIT Kharagpur',
    completionDate: '12 Aug 2026',
    status: 'Completed',
    credits: 3,
    score: '85%',
    proofFile: 'NPTEL_CloudComputing_Scorecard.pdf',
    verificationStatus: 'Pending',
  },
  {
    id: 'CRE-002',
    studentName: 'Arun Kumar',
    rollNumber: '23CI003',
    courseType: 'VAC',
    courseName: 'Web Development Fundamentals',
    provider: 'Nandha Engineering College CSE Dept',
    completionDate: '05 Aug 2026',
    status: 'Completed',
    credits: 2,
    proofFile: 'VAC_WebDev_Certificate.pdf',
    verificationStatus: 'Pending',
  },
  {
    id: 'CRE-003',
    studentName: 'Harish Kumar',
    rollNumber: '23CS045',
    courseType: 'Credit Course',
    courseName: 'Problem Solving through Python',
    provider: 'NPTEL / IIT Madras',
    completionDate: '28 Jul 2026',
    status: 'Completed',
    credits: 4,
    score: '91%',
    proofFile: 'NPTEL_Python_Scorecard.pdf',
    verificationStatus: 'Pending',
  },
];

export interface FacultyAchievement {
  id: string;
  category: string;
  type: string;
  title: string;
  organization: string;
  date: string;
  level: string;
  result: string;
  points: number;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Resubmission Required';
  proofs: string[];
}

export const MOCK_FACULTY_ACHIEVEMENTS: FacultyAchievement[] = [
  {
    id: 'FAC-ACH-001',
    category: 'Research & Publications',
    type: 'Journal Publication',
    title: 'Research Paper on IoT-based Smart Irrigation System',
    organization: 'IEEE Internet of Things Journal',
    date: '10 May 2026',
    level: 'International',
    result: 'Published',
    points: 50,
    status: 'Verified',
    proofs: ['IEEE_IoT_Journal_Paper.pdf'],
  },
  {
    id: 'FAC-ACH-002',
    category: 'Patents & IPR',
    type: 'Patent Grant',
    title: 'Method and System for Multi-layered Wireless Security',
    organization: 'Indian Patent Office',
    date: '18 Apr 2026',
    level: 'National',
    result: 'Granted',
    points: 100,
    status: 'Verified',
    proofs: ['Patent_Grant_Certificate.pdf'],
  },
  {
    id: 'FAC-ACH-003',
    category: 'Awards & Honors',
    type: 'Best Teacher Award',
    title: 'Outstanding Academic Performance Award 2025-26',
    organization: 'Nandha Engineering College Management',
    date: '05 Jan 2026',
    level: 'Institutional',
    result: 'Winner',
    points: 30,
    status: 'Verified',
    proofs: ['Best_Teacher_Award_2026.pdf'],
  },
  {
    id: 'FAC-ACH-004',
    category: 'Research & Publications',
    type: 'Conference Presentation',
    title: 'AI in Smart Agriculture: Challenges and Opportunities',
    organization: 'IEEE International Conference on AI & IoT',
    date: '12 Aug 2026',
    level: 'International',
    result: 'Presented',
    points: 25,
    status: 'Pending',
    proofs: ['IEEE_AI_Conference_Presentation.pdf'],
  },
];
