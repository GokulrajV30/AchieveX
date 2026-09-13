// ─────────────────────────────────────────────────────────────
// AchieveX — Student Projects Centralized Data & Service Layer (V1)
// Connects Student Project screens with shared HOD/Mentor project store
// ─────────────────────────────────────────────────────────────

import {
  getHODStore,
  type ProjectTeam,
  type ProjectMember,
  type HODFacultyMember,
} from './hodWorkspaceData';
import { STUDENT_DATABASE, type StudentRecord } from './achievementConfig';

export type { ProjectTeam, ProjectMember };

export const PROJECT_TYPES = [
  'Mini Project',
  'Final Year Project',
  'Academic Project',
  'Research Project',
  'Other',
] as const;

export const PROJECT_DOMAINS = [
  'AIoT',
  'Artificial Intelligence',
  'IoT',
  'Web Development',
  'Mobile Application',
  'Cybersecurity',
  'Data Science',
  'Other',
] as const;

export const RESPONSIBILITY_SUGGESTIONS = [
  'UI/UX & Frontend',
  'Backend & APIs',
  'Hardware & Sensors',
  'Testing & QA',
  'Documentation',
  'System Architecture',
  'Data Pipeline',
] as const;

export interface CreateStudentProjectInput {
  title: string;
  teamName?: string;
  projectCategory: string;
  customProjectType?: string;
  domain: string;
  customDomain?: string;
  problemStatement: string;
  description: string;
  participationType: 'Individual' | 'Team';
  academicYear: string;
  studentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  department?: string;
  teamLeader: {
    studentId: string;
    name: string;
    registerNumber: string;
    department: string;
    yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
    responsibility?: string;
  };
  members?: Array<{
    studentId: string;
    name: string;
    registerNumber: string;
    department: string;
    yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
    role: 'team_leader' | 'team_member' | 'project_owner';
    responsibility?: string;
  }>;
  mentorFacultyId?: string;
  mentorName?: string;
}

export interface UpdateStudentProjectInput {
  title?: string;
  teamName?: string;
  projectCategory?: string;
  customProjectType?: string;
  domain?: string;
  customDomain?: string;
  problemStatement?: string;
  description?: string;
  participationType?: 'Individual' | 'Team';
  members?: Array<{
    studentId: string;
    name: string;
    registerNumber: string;
    department: string;
    yearLabel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
    role: 'team_leader' | 'team_member' | 'project_owner';
    responsibility?: string;
  }>;
}

/**
 * Fetch all projects where the given student is either Team Leader / Creator or an active team member.
 */
export function getProjectsForStudent(studentIdOrRoll: string): ProjectTeam[] {
  const store = getHODStore();
  return store.getProjectsForStudent(studentIdOrRoll);
}

/**
 * Fetch a single project by ID from the centralized store.
 */
export function getStudentProjectById(id: string): ProjectTeam | undefined {
  const store = getHODStore();
  return store.getProjectById(id);
}

/**
 * Save a new project created by a student.
 */
export function createStudentProject(input: CreateStudentProjectInput): ProjectTeam {
  const store = getHODStore();
  const projectId = `proj-${Date.now()}`;
  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const effectiveDomain =
    input.domain === 'Other' && input.customDomain?.trim()
      ? input.customDomain.trim()
      : input.domain;

  const isIndividual = input.participationType === 'Individual';

  const memberRecords: ProjectMember[] = [];

  // Add Leader / Owner as first member
  memberRecords.push({
    id: `pm-${Date.now()}-1`,
    projectId,
    studentId: input.teamLeader.studentId,
    name: input.teamLeader.name,
    registerNumber: input.teamLeader.registerNumber,
    department: input.teamLeader.department,
    yearLabel: input.teamLeader.yearLabel,
    role: isIndividual ? 'project_owner' : 'team_leader',
    responsibility: input.teamLeader.responsibility || (isIndividual ? 'Full Project' : 'Team Leader'),
    addedAt: nowStr,
    status: 'active',
  });

  // Add additional teammates if Team
  if (!isIndividual && input.members && input.members.length > 0) {
    input.members.forEach((m, idx) => {
      // Avoid duplicate leader
      if (
        m.studentId === input.teamLeader.studentId ||
        m.registerNumber.toLowerCase() === input.teamLeader.registerNumber.toLowerCase()
      ) {
        return;
      }
      memberRecords.push({
        id: `pm-${Date.now()}-${idx + 2}`,
        projectId,
        studentId: m.studentId,
        name: m.name,
        registerNumber: m.registerNumber,
        department: m.department,
        yearLabel: m.yearLabel,
        role: 'team_member',
        responsibility: m.responsibility || 'Contributor',
        addedAt: nowStr,
        status: 'active',
      });
    });
  }

  const newProject: ProjectTeam = {
    id: projectId,
    institutionId: 'Nandha Engineering College',
    departmentId: 'CSE_IOT',
    title: input.title.trim(),
    teamName: isIndividual ? undefined : (input.teamName?.trim() || `${input.title.trim()} Team`),
    projectCategory: input.projectCategory,
    customProjectType: input.customProjectType,
    projectType: isIndividual ? 'individual' : 'team',
    participationType: input.participationType,
    domain: effectiveDomain,
    customDomain: input.customDomain,
    problemStatement: input.problemStatement.trim(),
    description: input.description.trim(),
    academicYear: input.academicYear,
    studentYear: input.studentYear,
    teamLeaderId: input.teamLeader.studentId,
    teamLeaderName: input.teamLeader.name,
    teamLeaderRoll: input.teamLeader.registerNumber,
    mentorFacultyId: input.mentorFacultyId,
    mentorName: input.mentorName,
    createdByStudentId: input.teamLeader.studentId,
    createdAt: nowStr,
    status: 'active',
    members: memberRecords,
  };

  return store.createProject(newProject);
}

/**
 * Update an existing project record in place (Team Leader only).
 */
export function updateStudentProject(
  id: string,
  input: UpdateStudentProjectInput
): ProjectTeam | undefined {
  const store = getHODStore();
  const existing = store.getProjectById(id);
  if (!existing) return undefined;

  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const effectiveDomain =
    input.domain === 'Other' && input.customDomain?.trim()
      ? input.customDomain.trim()
      : input.domain || existing.domain;

  const updates: Partial<ProjectTeam> = {};

  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.teamName !== undefined) updates.teamName = input.teamName.trim();
  if (input.projectCategory !== undefined) updates.projectCategory = input.projectCategory;
  if (input.customProjectType !== undefined) updates.customProjectType = input.customProjectType;
  if (input.domain !== undefined) updates.domain = effectiveDomain;
  if (input.customDomain !== undefined) updates.customDomain = input.customDomain;
  if (input.problemStatement !== undefined) updates.problemStatement = input.problemStatement.trim();
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.participationType !== undefined) {
    updates.participationType = input.participationType;
    updates.projectType = input.participationType === 'Individual' ? 'individual' : 'team';
  }

  if (input.members !== undefined) {
    // Map input members into ProjectMember format preserving existing addedAt
    const updatedMembers: ProjectMember[] = input.members.map((m, idx) => {
      const existingMem = existing.members.find(
        (em) => em.studentId === m.studentId || em.registerNumber.toLowerCase() === m.registerNumber.toLowerCase()
      );
      return {
        id: existingMem?.id || `pm-${Date.now()}-${idx + 1}`,
        projectId: id,
        studentId: m.studentId,
        name: m.name,
        registerNumber: m.registerNumber,
        department: m.department,
        yearLabel: m.yearLabel,
        role: m.role,
        responsibility: m.responsibility || existingMem?.responsibility || 'Contributor',
        addedAt: existingMem?.addedAt || nowStr,
        status: 'active',
      };
    });
    updates.members = updatedMembers;
  }

  return store.updateProject(id, updates);
}

/**
 * Get faculty mentor details if assigned
 */
export function getFacultyMentor(facultyId?: string): HODFacultyMember | undefined {
  if (!facultyId) return undefined;
  const store = getHODStore();
  return store.getFacultyById(facultyId);
}

/**
 * Query eligible students from the institution database for teammate addition.
 * Excludes already chosen members and current student.
 */
export function getEligibleTeammates(
  currentStudentRoll: string,
  existingMemberRolls: string[],
  query: string
): StudentRecord[] {
  const cleanQuery = query.trim().toLowerCase();
  const excludedSet = new Set(
    [currentStudentRoll, ...existingMemberRolls].map((r) => r.toLowerCase())
  );

  return STUDENT_DATABASE.filter((student) => {
    if (excludedSet.has(student.rollNumber.toLowerCase())) {
      return false;
    }
    if (!cleanQuery) return true;
    return (
      student.name.toLowerCase().includes(cleanQuery) ||
      student.rollNumber.toLowerCase().includes(cleanQuery) ||
      student.department.toLowerCase().includes(cleanQuery)
    );
  });
}
