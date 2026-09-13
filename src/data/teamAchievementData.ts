// ─────────────────────────────────────────────────────────────
// AchieveX — Team Achievement Data Model & Centralized Store
// Core data structures and reactive state for Team Achievement Workflow.
//
// ARCHITECTURE:
//   TeamAchievement (shared: event details + common proofs + member list)
//   └── TeamAchievementMember[] (individual: own certificate + status)
//
// KEY PRINCIPLE: Common details/proofs are uploaded ONCE by the Team Leader.
//               Each member only provides their own individual certificate.
// ─────────────────────────────────────────────────────────────

import { addStudentNotification } from './notificationsData';
import { addProctorNotification, updateProctorTeamNotification } from './facultyWorkspaceData';
import { addACNotification, updateACTeamNotification } from './acWorkspaceData';

// ─── Certificate Status ─────────────────────────────────────
// UI-facing vocabulary. Do NOT use internal field names in the UI.
export type CertificateStatus =
  | 'Not Uploaded'
  | 'Uploaded'
  | 'Correction Required'
  | 'Verified';

export type MemberRole = 'team_leader' | 'team_member';

export type TeamAchievementStatus =
  | 'Pending'
  | 'Under Review'
  | 'Partially Verified'
  | 'Verified';

// ─── Common Proof File ──────────────────────────────────────
// Uploaded ONCE by the Team Leader. Shared across all members.
export interface TeamCommonProof {
  id: string;
  label: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  uploadedAt: string;
}

// ─── Individual Certificate ──────────────────────────────────
// Uploaded separately by each member (including the team leader).
export interface IndividualCertificate {
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  uploadedAt: string;
}

// ─── Team Achievement Member ─────────────────────────────────
// One record per student in the team.
export interface TeamAchievementMember {
  id: string;                         // unique member record id
  teamAchievementId: string;          // FK → TeamAchievement.id
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  year: string;
  role: MemberRole;
  individualCertificate?: IndividualCertificate;
  certificateStatus: CertificateStatus;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  verifiedPoints?: number;
}

// ─── Team Achievement ────────────────────────────────────────
// One logical record per team. Contains the shared event details
// and common proofs. Members are stored as an array.
export interface TeamAchievement {
  id: string;
  institutionId: string;
  categoryId: string;
  achievementType: string;
  eventName: string;
  organizer: string;
  level: string;
  eventDate: string;
  semester: string;
  result: string;
  teamName: string;
  teamLeaderId: string;
  teamLeaderName: string;
  cashPrize?: string;
  commonProofs: TeamCommonProof[];
  members: TeamAchievementMember[];
  status: TeamAchievementStatus;
  submittedAt: string;
}

// ─────────────────────────────────────────────────────────────
// INITIAL STATE (Step 22 exact data):
// Team: Code Nexus
// Event: Smart India Hackathon 2026
// Leader: Gokulraj V (Uploaded)
// Members: Mohamed Aqdhas (Missing), Karthikeyan M (Missing),
//          Jeeva M (Missing), Sathishkumar (Missing)
// Initial Progress: 1 / 5 Uploaded
// ─────────────────────────────────────────────────────────────

const INITIAL_TEAM_ACHIEVEMENT: TeamAchievement = {
  id: 'TA-SIH-2026-001',
  institutionId: 'NEC-CSE-IOT',
  categoryId: 'technical',
  achievementType: 'Hackathon',
  eventName: 'Smart India Hackathon 2026',
  organizer: 'Ministry of Education, Government of India',
  level: 'National',
  eventDate: '12 Aug 2026',
  semester: 'Semester 5',
  result: 'Winner',
  teamName: 'Code Nexus',
  teamLeaderId: '23ci011',
  teamLeaderName: 'Gokulraj V',
  cashPrize: '₹1,00,000',
  commonProofs: [
    {
      id: 'TCP-001',
      label: 'Event Poster',
      fileName: 'sih2026_event_poster.jpg',
      fileType: 'image',
      fileSize: '2.4 MB',
      uploadedAt: '12 Aug 2026',
    },
    {
      id: 'TCP-002',
      label: 'Official Result',
      fileName: 'sih2026_official_results.pdf',
      fileType: 'pdf',
      fileSize: '1.8 MB',
      uploadedAt: '12 Aug 2026',
    },
    {
      id: 'TCP-003',
      label: 'Team Photo',
      fileName: 'code_nexus_team_photo.jpg',
      fileType: 'image',
      fileSize: '3.1 MB',
      uploadedAt: '12 Aug 2026',
    },
  ],
  members: [
    {
      id: 'TAM-001',
      teamAchievementId: 'TA-SIH-2026-001',
      studentId: '23ci011',
      studentName: 'Gokulraj V',
      rollNumber: '23CI011',
      department: 'CSE (IoT)',
      year: '3rd Year',
      role: 'team_leader',
      individualCertificate: {
        fileName: 'gokulraj_sih2026_certificate.pdf',
        fileType: 'pdf',
        fileSize: '890 KB',
        uploadedAt: '12 Aug 2026',
      },
      certificateStatus: 'Uploaded',
      verificationStatus: 'Pending',
    },
    {
      id: 'TAM-002',
      teamAchievementId: 'TA-SIH-2026-001',
      studentId: '23ci015',
      studentName: 'Mohamed Aqdhas',
      rollNumber: '23CI015',
      department: 'CSE (IoT)',
      year: '3rd Year',
      role: 'team_member',
      certificateStatus: 'Not Uploaded',
      verificationStatus: 'Pending',
    },
    {
      id: 'TAM-003',
      teamAchievementId: 'TA-SIH-2026-001',
      studentId: '23ci024',
      studentName: 'Karthikeyan M',
      rollNumber: '23CI024',
      department: 'CSE (IoT)',
      year: '3rd Year',
      role: 'team_member',
      certificateStatus: 'Not Uploaded',
      verificationStatus: 'Pending',
    },
    {
      id: 'TAM-004',
      teamAchievementId: 'TA-SIH-2026-001',
      studentId: '23ci019',
      studentName: 'Jeeva M',
      rollNumber: '23CI019',
      department: 'CSE (IoT)',
      year: '3rd Year',
      role: 'team_member',
      certificateStatus: 'Not Uploaded',
      verificationStatus: 'Pending',
    },
    {
      id: 'TAM-005',
      teamAchievementId: 'TA-SIH-2026-001',
      studentId: '23ci031',
      studentName: 'Sathishkumar',
      rollNumber: '23CI031',
      department: 'CSE (IoT)',
      year: '3rd Year',
      role: 'team_member',
      certificateStatus: 'Not Uploaded',
      verificationStatus: 'Pending',
    },
  ],
  status: 'Under Review',
  submittedAt: '12 Aug 2026, 3:45 PM',
};

// ─────────────────────────────────────────────────────────────
// CENTRALIZED STORE STATE & SUBSCRIBERS
// ─────────────────────────────────────────────────────────────

export let MOCK_TEAM_ACHIEVEMENTS: TeamAchievement[] = [
  JSON.parse(JSON.stringify(INITIAL_TEAM_ACHIEVEMENT)),
];

type TeamListener = () => void;
const listeners = new Set<TeamListener>();

export function subscribeTeamAchievements(listener: TeamListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS & SELECTORS
// ─────────────────────────────────────────────────────────────

export function getTeamAchievements(): TeamAchievement[] {
  return MOCK_TEAM_ACHIEVEMENTS;
}

export function getTeamAchievementById(id: string): TeamAchievement | undefined {
  return MOCK_TEAM_ACHIEVEMENTS.find((ta) => ta.id === id);
}

export function getTeamAchievementsAsLeader(studentId: string): TeamAchievement[] {
  const norm = studentId.toLowerCase();
  return MOCK_TEAM_ACHIEVEMENTS.filter((ta) => ta.teamLeaderId.toLowerCase() === norm);
}

export function getTeamAchievementsForStudent(studentId: string): TeamAchievement[] {
  const norm = studentId.toLowerCase();
  return MOCK_TEAM_ACHIEVEMENTS.filter(
    (ta) =>
      ta.teamLeaderId.toLowerCase() === norm ||
      ta.members.some(
        (m) => m.studentId.toLowerCase() === norm || m.rollNumber.toLowerCase() === norm
      )
  );
}

export function isTeamLeader(team: TeamAchievement, studentId: string): boolean {
  const norm = studentId.toLowerCase();
  return team.teamLeaderId.toLowerCase() === norm;
}

export function isTeamMember(team: TeamAchievement, studentId: string): boolean {
  const norm = studentId.toLowerCase();
  return (
    team.teamLeaderId.toLowerCase() !== norm &&
    team.members.some(
      (m) => m.studentId.toLowerCase() === norm || m.rollNumber.toLowerCase() === norm
    )
  );
}

export function getMemberRecord(
  teamAchievementId: string,
  studentId: string
): TeamAchievementMember | undefined {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return undefined;
  const norm = studentId.toLowerCase();
  return ta.members.find(
    (m) => m.studentId.toLowerCase() === norm || m.rollNumber.toLowerCase() === norm
  );
}

export function getCertificateProgress(teamAchievementId: string): {
  uploaded: number;
  total: number;
} {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return { uploaded: 0, total: 0 };
  const uploaded = ta.members.filter(
    (m) => m.certificateStatus === 'Uploaded' || m.certificateStatus === 'Verified'
  ).length;
  return { uploaded, total: ta.members.length };
}

export function getMissingCertificateMembers(
  teamAchievementId: string
): TeamAchievementMember[] {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return [];
  return ta.members.filter(
    (m) =>
      m.certificateStatus === 'Not Uploaded' ||
      m.certificateStatus === 'Correction Required'
  );
}

export function getCertificateStatusLabel(status: CertificateStatus): string {
  switch (status) {
    case 'Not Uploaded':
      return 'Certificate Missing';
    case 'Uploaded':
      return 'Certificate Uploaded';
    case 'Correction Required':
      return 'Correction Required';
    case 'Verified':
      return 'Verified';
  }
}

export function getRoleLabel(role: MemberRole): string {
  return role === 'team_leader' ? 'Team Leader' : 'Team Member';
}

// ─────────────────────────────────────────────────────────────
// STATE MUTATIONS (Create, Upload, Verify, Simulate)
// ─────────────────────────────────────────────────────────────

export interface CreateTeamAchievementInput {
  categoryId: string;
  achievementType: string;
  eventName: string;
  organizer: string;
  level: string;
  eventDate: string;
  semester: string;
  result: string;
  teamName: string;
  teamLeaderId: string;
  teamLeaderName: string;
  cashPrize?: string;
  commonProofs: TeamCommonProof[];
  leaderCertificate?: IndividualCertificate;
  members: Array<{
    studentId: string;
    studentName: string;
    rollNumber: string;
    department: string;
    year: string;
  }>;
}

export function createTeamAchievement(data: CreateTeamAchievementInput): TeamAchievement {
  const id = `TA-${Date.now()}`;

  // Leader member record
  const leaderMember: TeamAchievementMember = {
    id: `TAM-${Date.now()}-001`,
    teamAchievementId: id,
    studentId: data.teamLeaderId.toLowerCase(),
    studentName: data.teamLeaderName,
    rollNumber: data.teamLeaderId.toUpperCase(),
    department: 'CSE (IoT)',
    year: '3rd Year',
    role: 'team_leader',
    individualCertificate: data.leaderCertificate,
    certificateStatus: data.leaderCertificate ? 'Uploaded' : 'Not Uploaded',
    verificationStatus: 'Pending',
  };

  // Other member records
  const otherMembers: TeamAchievementMember[] = data.members.map((m, idx) => ({
    id: `TAM-${Date.now()}-${idx + 2}`,
    teamAchievementId: id,
    studentId: m.studentId.toLowerCase(),
    studentName: m.studentName,
    rollNumber: m.rollNumber,
    department: m.department || 'CSE (IoT)',
    year: m.year || '3rd Year',
    role: 'team_member',
    certificateStatus: 'Not Uploaded',
    verificationStatus: 'Pending',
  }));

  const allMembers = [leaderMember, ...otherMembers];

  const newAchievement: TeamAchievement = {
    id,
    institutionId: 'NEC-CSE-IOT',
    categoryId: data.categoryId,
    achievementType: data.achievementType,
    eventName: data.eventName,
    organizer: data.organizer,
    level: data.level,
    eventDate: data.eventDate,
    semester: data.semester,
    result: data.result,
    teamName: data.teamName,
    teamLeaderId: data.teamLeaderId.toLowerCase(),
    teamLeaderName: data.teamLeaderName,
    cashPrize: data.cashPrize,
    commonProofs: data.commonProofs,
    members: allMembers,
    status: 'Under Review',
    submittedAt: 'Just now',
  };

  // Add to centralized list
  MOCK_TEAM_ACHIEVEMENTS = [newAchievement, ...MOCK_TEAM_ACHIEVEMENTS];

  const initialUploaded = leaderMember.certificateStatus === 'Uploaded' ? 1 : 0;
  const totalCount = allMembers.length;

  // 1. Create notifications for each team member (except leader)
  otherMembers.forEach((member) => {
    addStudentNotification({
      id: `TNOT_${Date.now()}_${member.studentId}`,
      userId: member.studentId.toLowerCase(),
      type: 'team_certificate_required',
      title: 'Team Achievement — Certificate Required',
      message: `${data.teamLeaderName} added you to ${data.eventName} — Team ${data.teamName}. Upload your individual certificate to complete your record.`,
      isRead: false,
      createdAt: 'Just now',
      timeGroup: 'TODAY',
      targetType: 'team_achievement',
      targetId: id,
      teamAchievementId: id,
    });
  });

  // 2. Create Proctor notification (monitoring only)
  addProctorNotification({
    id: `PN-TEAM-${Date.now()}`,
    type: 'team_achievement',
    title: 'Team Achievement Submitted',
    message: `${data.eventName} — Team ${data.teamName}. ${totalCount} Students • ${initialUploaded} / ${totalCount} Certificates Uploaded.`,
    time: 'Just now',
    dateGroup: 'Today',
    isRead: false,
    studentName: data.teamLeaderName,
    studentId: data.teamLeaderId.toLowerCase(),
    teamAchievementId: id,
  });

  // 3. Create AC notification (verification)
  addACNotification({
    id: `NOTIF-AC-${Date.now()}`,
    title: `Team Achievement Submitted • ${data.teamName}`,
    description: `${data.eventName} — Team ${data.teamName}. ${totalCount} Members • ${initialUploaded} / ${totalCount} Certificates Uploaded.`,
    time: 'Just now',
    isRead: false,
    targetType: 'team',
    targetId: id,
    teamAchievementId: id,
  });

  notifyListeners();
  return newAchievement;
}

export function updateMemberCertificate(
  teamAchievementId: string,
  studentId: string,
  certificate: IndividualCertificate
): boolean {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return false;

  const norm = studentId.toLowerCase();
  const member = ta.members.find(
    (m) => m.studentId.toLowerCase() === norm || m.rollNumber.toLowerCase() === norm
  );
  if (!member) return false;

  member.individualCertificate = certificate;
  member.certificateStatus = 'Uploaded';
  member.verificationStatus = 'Pending';

  const progress = getCertificateProgress(teamAchievementId);
  const msg = `${ta.eventName} — Team ${ta.teamName}. ${progress.total} Students • ${progress.uploaded} / ${progress.total} Certificates Uploaded.`;

  updateProctorTeamNotification(teamAchievementId, msg);
  updateACTeamNotification(teamAchievementId, msg);

  notifyListeners();
  return true;
}

export function approveTeamMembers(
  teamAchievementId: string,
  memberIds: string[]
): void {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return;

  ta.members.forEach((m) => {
    if (memberIds.includes(m.id) && (m.certificateStatus === 'Uploaded' || m.certificateStatus === 'Verified')) {
      m.certificateStatus = 'Verified';
      m.verificationStatus = 'Verified';
      m.verifiedPoints = 50;
    }
  });

  notifyListeners();
}

/**
 * Step 22 simulation helper:
 * Simulates Mohamed, Karthikeyan, and Jeeva uploading their certificates.
 * Result: 4 / 5 Uploaded, Sathishkumar remains Missing.
 */
export function simulateMemberUploads(teamAchievementId: string = 'TA-SIH-2026-001'): void {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return;

  const certsToUpload = [
    {
      studentId: '23ci015',
      name: 'Mohamed Aqdhas',
      fileName: 'aqdhas_sih2026_certificate.pdf',
    },
    {
      studentId: '23ci024',
      name: 'Karthikeyan M',
      fileName: 'karthikeyan_sih2026_certificate.pdf',
    },
    {
      studentId: '23ci019',
      name: 'Jeeva M',
      fileName: 'jeeva_sih2026_certificate.pdf',
    },
  ];

  certsToUpload.forEach((item) => {
    const member = ta.members.find(
      (m) => m.studentId.toLowerCase() === item.studentId.toLowerCase()
    );
    if (member && member.certificateStatus === 'Not Uploaded') {
      member.individualCertificate = {
        fileName: item.fileName,
        fileType: 'pdf',
        fileSize: '910 KB',
        uploadedAt: 'Just now',
      };
      member.certificateStatus = 'Uploaded';
      member.verificationStatus = 'Pending';
    }
  });

  const progress = getCertificateProgress(teamAchievementId);
  const msg = `${ta.eventName} — Team ${ta.teamName}. ${progress.total} Students • ${progress.uploaded} / ${progress.total} Certificates Uploaded.`;
  updateProctorTeamNotification(teamAchievementId, msg);
  updateACTeamNotification(teamAchievementId, msg);

  notifyListeners();
}

/**
 * Step 17 simulation helper:
 * Simulates Sathishkumar uploading his certificate.
 * Result: 4 / 5 becomes 5 / 5 Uploaded.
 */
export function simulateSathishkumarUpload(teamAchievementId: string = 'TA-SIH-2026-001'): void {
  const ta = getTeamAchievementById(teamAchievementId);
  if (!ta) return;

  const member = ta.members.find(
    (m) => m.studentId.toLowerCase() === '23ci031' || m.rollNumber.toLowerCase() === '23ci031'
  );
  if (member) {
    member.individualCertificate = {
      fileName: 'sathishkumar_sih2026_certificate.pdf',
      fileType: 'pdf',
      fileSize: '895 KB',
      uploadedAt: 'Just now',
    };
    member.certificateStatus = 'Uploaded';
    member.verificationStatus = 'Pending';
  }

  const progress = getCertificateProgress(teamAchievementId);
  const msg = `${ta.eventName} — Team ${ta.teamName}. ${progress.total} Students • ${progress.uploaded} / ${progress.total} Certificates Uploaded.`;
  updateProctorTeamNotification(teamAchievementId, msg);
  updateACTeamNotification(teamAchievementId, msg);

  notifyListeners();
}

/**
 * Reset to initial Step 22 state (1 / 5 Uploaded)
 */
export function resetTeamAchievements(): void {
  MOCK_TEAM_ACHIEVEMENTS = [JSON.parse(JSON.stringify(INITIAL_TEAM_ACHIEVEMENT))];
  notifyListeners();
}
