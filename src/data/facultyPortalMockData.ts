export interface FacultyProfileData {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  role: string;
}

export interface StudentData {
  name: string;
  registerNumber: string;
  department: string;
  year: string;
}

export interface AchievementItem {
  id: string;
  studentName: string;
  rollNumber: string;
  title: string;
  category: string;
  level: string;
  submittedDate: string;
  status: 'Pending' | 'Verified' | 'Resubmission Required' | 'Rejected';
  points: number;
}

export interface StudentRank {
  rank: string;
  name: string;
  department: string;
  year: string;
  points: number;
  verifiedCount: number;
}

export interface DepartmentRank {
  rank: string;
  name: string;
  points: number;
  verifiedCount: number;
}

export interface CategoryRank {
  rank: string;
  name: string;
  points: number;
  verifiedCount: number;
}

export interface NotificationEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: string;
  color: string;
}

export interface CertificateUploadRecord {
  id: string;
  studentName?: string;
  registerNumber?: string;
  category: string;
  achievementType: string;
  title: string;
  level: string;
  organizer: string;
  eventDate: string;
  proofFileName: string;
  uploadedBy: string;
  status: string;
  timestamp: string;
  points?: number;
}

// 1. Faculty Mock Profile Data
export const facultyMockData: Record<string, FacultyProfileData> = {
  Proctor: {
    id: 'FAC-2026-CS09',
    name: 'Dr. Velusamy Proctor',
    department: 'CSE (IoT)',
    designation: 'Associate Professor (CSE)',
    email: 'velusamy.cse@nandha.edu.in',
    phone: '+91 98421 98421',
    role: 'Proctor',
  },
  HOD: {
    id: 'FAC-2026-CS01',
    name: 'Dr. Gokulraj HOD',
    department: 'CSE (IoT)',
    designation: 'Professor & Head',
    email: 'gokulraj.cse@nandhaengg.org',
    phone: '+91 94432 94432',
    role: 'HOD',
  },
  'Academic Coordinator': {
    id: 'FAC-2026-CS02',
    name: 'Prof. Sathish Coordinator',
    department: 'CSE',
    designation: 'Professor (CSE)',
    email: 'coordinator.cse@nandha.edu.in',
    phone: '+91 98422 98422',
    role: 'Academic Coordinator',
  },
  Principal: {
    id: 'FAC-2026-ADMIN01',
    name: 'Dr. Jeeva Principal',
    department: 'Administration',
    designation: 'Principal',
    email: 'principal@nandhaengg.org',
    phone: '+91 98423 98423',
    role: 'Principal',
  },
};

// 2. Student Mock Selection Database
export const studentMockData: StudentData[] = [
  {
    name: 'Gokulraj Velusamy',
    registerNumber: '22CSE001',
    department: 'CSE (IoT)',
    year: '3rd Year',
  },
  {
    name: 'Sathish Kumar',
    registerNumber: '22CSE045',
    department: 'CSE',
    year: '3rd Year',
  },
  {
    name: 'Naveen Prasath',
    registerNumber: '22CSE099',
    department: 'IT',
    year: '3rd Year',
  },
  {
    name: 'Arun Kumar',
    registerNumber: '22ECE012',
    department: 'ECE',
    year: '3rd Year',
  },
];

// 3. Verification Achievement Queue
export const achievementMockData: AchievementItem[] = [
  {
    id: 'VER-001',
    studentName: 'Gokulraj Velusamy',
    rollNumber: '22CSE001',
    title: 'National Level Innovation Hackathon',
    category: 'Technical & Professional / Innovation',
    level: 'Regional',
    submittedDate: '18 Aug 2026',
    status: 'Pending',
    points: 30,
  },
  {
    id: 'VER-002',
    studentName: 'Sathish Kumar',
    rollNumber: '22CSE045',
    title: 'Zone Volleyball Championship',
    category: 'Sports & Games',
    level: 'Zone',
    submittedDate: '18 Aug 2026',
    status: 'Pending',
    points: 15,
  },
  {
    id: 'VER-003',
    studentName: 'Naveen Prasath',
    rollNumber: '22CSE099',
    title: 'Udemy Android Bootcamp Complete',
    category: 'Certifications & Online Learning',
    level: 'State',
    submittedDate: '16 Aug 2026',
    status: 'Resubmission Required',
    points: 20,
  },
  {
    id: 'VER-004',
    studentName: 'Jeeva',
    rollNumber: '22CSE102',
    title: 'Conference Research Paper Presentation',
    category: 'Research, Publication & Intellectual Property',
    level: 'National',
    submittedDate: '17 Aug 2026',
    status: 'Verified',
    points: 40,
  },
  {
    id: 'VER-005',
    studentName: 'Arun Kumar',
    rollNumber: '22ECE012',
    title: 'Inter-College Coding Battle',
    category: 'Technical & Professional / Innovation',
    level: 'Regional',
    submittedDate: '15 Aug 2026',
    status: 'Rejected',
    points: 0,
  },
];

// 4. Leaderboard Mock Rankings
export const leaderboardMockData = {
  students: [
    { rank: '01', name: 'Gokulraj Velusamy', department: 'CSE (IoT)', year: '3rd Year', points: 385, verifiedCount: 18 },
    { rank: '02', name: 'Sathish Kumar', department: 'CSE', year: '3rd Year', points: 310, verifiedCount: 12 },
    { rank: '03', name: 'Naveen Prasath', department: 'IT', year: '3rd Year', points: 285, verifiedCount: 9 },
    { rank: '04', name: 'Jeeva', department: 'CSE (IoT)', year: '3rd Year', points: 260, verifiedCount: 8 },
    { rank: '05', name: 'Arun Kumar', department: 'ECE', year: '3rd Year', points: 220, verifiedCount: 7 },
  ] as StudentRank[],

  departments: [
    { rank: '01', name: 'CSE (IoT)', points: 1820, verifiedCount: 124 },
    { rank: '02', name: 'ECE', points: 1540, verifiedCount: 109 },
    { rank: '03', name: 'CSE', points: 1480, verifiedCount: 98 },
    { rank: '04', name: 'IT', points: 1210, verifiedCount: 82 },
  ] as DepartmentRank[],

  categories: [
    { rank: '01', name: 'Technical & Innovation', points: 2450, verifiedCount: 160 },
    { rank: '02', name: 'Sports & Games', points: 1850, verifiedCount: 95 },
    { rank: '03', name: 'Certifications', points: 1200, verifiedCount: 110 },
  ] as CategoryRank[],
};

// 5. Notification Mock Events
export const notificationMockData: NotificationEvent[] = [
  {
    id: 'VER-001',
    title: 'Certificate Updated',
    description: 'Gokulraj uploaded the missing certificate for his regional hackathon achievement.',
    time: '5 min ago',
    unread: true,
    icon: 'document-text-outline',
    color: '#2563EB',
  },
  {
    id: 'VER-002',
    title: 'New Student Submission Received',
    description: 'Sathish Kumar submitted Zone Volleyball winner certificate.',
    time: '2 hours ago',
    unread: true,
    icon: 'football-outline',
    color: '#D97706',
  },
  {
    id: 'VER-003',
    title: 'Team Achievement Completed',
    description: 'Team members verified the Smart India Hackathon participation.',
    time: '1 day ago',
    unread: false,
    icon: 'people-outline',
    color: '#0E9F6E',
  },
  {
    id: 'UPLOAD-SUCCESS',
    title: 'Certificate Upload Successful',
    description: 'Department-level Innovation Award uploaded directly by Faculty has been verified.',
    time: '2 days ago',
    unread: false,
    icon: 'cloud-upload-outline',
    color: '#7C3AED',
  },
];

// 6. Direct Faculty Certificate Uploads Log (Faculty's Own achievements)
export const certificateMockData: CertificateUploadRecord[] = [
  {
    id: 'FAC-ACH-001',
    category: 'Research, Publication & Intellectual Property',
    achievementType: 'Journal Paper',
    title: 'Dynamic Query Optimization in Distributed DBs',
    level: 'International',
    organizer: 'IEEE Transactions on Computers',
    eventDate: '12 January 2026',
    proofFileName: 'IEEE_Query_Opt.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-01-12T10:00:00Z',
    points: 50,
  },
  {
    id: 'FAC-ACH-002',
    category: 'Certifications & Online Learning',
    achievementType: 'Coursera Certification',
    title: 'Google Cloud Architect Professional',
    level: 'International',
    organizer: 'Coursera / Google Cloud',
    eventDate: '24 February 2026',
    proofFileName: 'GCP_Architect_Cert.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-02-24T14:30:00Z',
    points: 40,
  },
  {
    id: 'FAC-ACH-003',
    category: 'Awards, Honors & Recognition',
    achievementType: 'Award',
    title: 'Best Researcher Award 2025',
    level: 'National',
    organizer: 'Nandha Engineering College',
    eventDate: '05 March 2026',
    proofFileName: 'Best_Researcher_NEC.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-03-05T09:15:00Z',
    points: 30,
  },
  {
    id: 'FAC-ACH-004',
    category: 'Leadership & Student Responsibility',
    achievementType: 'Recognition Certificate',
    title: 'Convener of National Hackathon 2026',
    level: 'National',
    organizer: 'CSI Nandha Student Chapter',
    eventDate: '18 March 2026',
    proofFileName: 'Convener_Certificate.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-03-18T16:00:00Z',
    points: 20,
  },
  {
    id: 'FAC-ACH-005',
    category: 'Research, Publication & Intellectual Property',
    achievementType: 'Journal Paper',
    title: 'Machine Learning Models for IoT Splicing',
    level: 'International',
    organizer: 'Springer Nature',
    eventDate: '02 April 2026',
    proofFileName: 'Springer_IoT_Splicing.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-04-02T11:45:00Z',
    points: 50,
  },
  {
    id: 'FAC-ACH-006',
    category: 'Certifications & Online Learning',
    achievementType: 'Coursera Certification',
    title: 'AWS Machine Learning Specialty',
    level: 'International',
    organizer: 'Amazon Web Services',
    eventDate: '15 April 2026',
    proofFileName: 'AWS_ML_Specialty.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-04-15T15:20:00Z',
    points: 45,
  },
  {
    id: 'FAC-ACH-007',
    category: 'Awards, Honors & Recognition',
    achievementType: 'Award',
    title: 'Outstanding Faculty Mentor 2026',
    level: 'Regional',
    organizer: 'Anna University Erode Zone',
    eventDate: '30 April 2026',
    proofFileName: 'Outstanding_Mentor.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-04-30T10:00:00Z',
    points: 30,
  },
  {
    id: 'FAC-ACH-008',
    category: 'Technical & Professional / Innovation',
    achievementType: 'Participation Certificate',
    title: 'AI Lab Setup Coordinator',
    level: 'Regional',
    organizer: 'Nandha Engineering College',
    eventDate: '10 May 2026',
    proofFileName: 'Lab_Coordinator.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-05-10T12:00:00Z',
    points: 25,
  },
  {
    id: 'FAC-ACH-009',
    category: 'Research, Publication & Intellectual Property',
    achievementType: 'Patent Granted',
    title: 'Patent: Smart Agricultural Irrigation Monitoring',
    level: 'National',
    organizer: 'Indian Patent Office',
    eventDate: '28 May 2026',
    proofFileName: 'Patent_Irrigation.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-05-28T09:00:00Z',
    points: 60,
  },
  {
    id: 'FAC-ACH-010',
    category: 'Certifications & Online Learning',
    achievementType: 'Coursera Certification',
    title: 'Coursera Deep Learning Specialization',
    level: 'International',
    organizer: 'DeepLearning.AI / Coursera',
    eventDate: '14 June 2026',
    proofFileName: 'DL_Specialization.pdf',
    uploadedBy: 'Faculty',
    status: 'Verified',
    timestamp: '2026-06-14T17:10:00Z',
    points: 40,
  },
  {
    id: 'FAC-ACH-011',
    category: 'Technical & Professional / Innovation',
    achievementType: 'Participation Certificate',
    title: 'National Seminar on IoT Security',
    level: 'National',
    organizer: 'PSG College of Technology',
    eventDate: '01 August 2026',
    proofFileName: 'IoT_Security_Seminar.pdf',
    uploadedBy: 'Faculty',
    status: 'Pending',
    timestamp: '2026-08-01T11:00:00Z',
    points: 0,
  },
  {
    id: 'FAC-ACH-012',
    category: 'Research, Publication & Intellectual Property',
    achievementType: 'Journal Paper',
    title: 'Journal: Scalable Blockchains for Smart Cities',
    level: 'International',
    organizer: 'Elsevier Computer Communications',
    eventDate: '12 August 2026',
    proofFileName: 'Elsevier_Blockchain.pdf',
    uploadedBy: 'Faculty',
    status: 'Pending',
    timestamp: '2026-08-12T13:45:00Z',
    points: 0,
  },
];
