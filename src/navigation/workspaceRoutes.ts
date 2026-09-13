// ─────────────────────────────────────────────────────────────
// AchieveX — Central Workspace Routes & Navigation Resolver
// Strict isolation for Student, Faculty, Proctor, Mentor, and Tutor workspaces.
// ─────────────────────────────────────────────────────────────

import { type FacultyWorkspaceId } from '../data/facultyWorkspaceData';

export type AppWorkspaceType = 'student' | FacultyWorkspaceId;

export interface WorkspaceRoutesConfig {
  home: string;
  achievements: string;
  submissions?: string;
  students?: string;
  goals: string;
  performance?: string;
  leaderboard: string;
  analytics?: string;
  departments?: string;
  reports?: string;
  notifications: string;
  profile: string;
}

export const WORKSPACE_ROUTES: Record<AppWorkspaceType, WorkspaceRoutesConfig> = {
  faculty: {
    home: 'facultyDashboard',
    achievements: 'facultyAchievements',
    goals: 'facultyGoals',
    leaderboard: 'facultyLeaderboard',
    notifications: 'facultyNotifications',
    profile: 'facultyProfile',
  },
  proctor: {
    home: 'facultyDashboard', // Renders ProctorDashboard within facultyDashboard shell
    students: 'proctorAssignedStudents',
    achievements: 'proctorAssignedStudents',
    goals: 'proctorGoalsOverview',
    performance: 'proctorPerformance',
    leaderboard: 'proctorLeaderboard',
    reports: 'proctorReports',
    notifications: 'proctorNotifications',
    profile: 'facultyProfile',
  },
  mentor: {
    home: 'mentorDashboard',
    students: 'mentorMentees',
    achievements: 'mentorMentees',
    goals: 'mentorProjects',
    performance: 'mentorReports',
    reports: 'mentorReports',
    leaderboard: 'mentorReports',
    notifications: 'mentorNotifications',
    profile: 'facultyProfile',
  },
  tutor: {
    home: 'facultyDashboard',
    students: 'facultyDashboard',
    achievements: 'facultyDashboard',
    goals: 'facultyGoals',
    leaderboard: 'facultyLeaderboard',
    notifications: 'facultyNotifications',
    profile: 'facultyProfile',
  },
  academic_coordinator: {
    home: 'acDashboard',
    submissions: 'acVerificationQueue',
    students: 'acStudentList',
    achievements: 'acVerificationQueue',
    goals: 'acVerificationQueue',
    leaderboard: 'acReports',
    reports: 'acReports',
    notifications: 'acNotifications',
    profile: 'facultyProfile',
  },
  hod: {
    home: 'hodDashboard',
    achievements: 'myAchievements',
    submissions: 'hodVerificationQueue',
    students: 'hodStudentList',
    goals: 'goals',
    performance: 'hodDepartmentPerformance',
    leaderboard: 'leaderboard',
    reports: 'hodReports',
    notifications: 'hodNotifications',
    profile: 'facultyProfile',
  },
  head: {
    home: 'headDashboard',
    achievements: 'headCollegeAchievements',
    goals: 'headAnalytics',
    analytics: 'headAnalytics',
    leaderboard: 'headAnalytics',
    reports: 'headReports',
    notifications: 'headNotifications',
    profile: 'facultyProfile',
  },
  dean: {
    home: 'deanDashboard',
    achievements: 'deanVerificationQueue',
    submissions: 'deanVerificationQueue',
    goals: 'deanDashboard',
    leaderboard: 'deanDashboard',
    reports: 'deanVerificationHistory',
    notifications: 'deanNotifications',
    profile: 'facultyProfile',
  },
  principal: {
    home: 'principalDashboard',
    achievements: 'principalVerificationQueue',
    submissions: 'principalVerificationQueue',
    departments: 'principalDepartments',
    goals: 'principalPerformance',
    leaderboard: 'principalLeaderboard',
    reports: 'principalReports',
    notifications: 'principalNotifications',
    profile: 'facultyProfile',
  },
  student: {
    home: 'dashboard',
    achievements: 'myAchievements',
    goals: 'goals',
    leaderboard: 'leaderboard',
    notifications: 'notifications',
    profile: 'profile',
  },
};

/**
 * Resolves the precise screen route for a given feature within the active workspace.
 * Prevents accidental role mixing across navigation transitions.
 */
export function getWorkspaceRoute(
  workspace: AppWorkspaceType,
  feature: keyof WorkspaceRoutesConfig
): string {
  const routes = WORKSPACE_ROUTES[workspace] || WORKSPACE_ROUTES.faculty;
  return routes[feature] || routes.home;
}

/**
 * Safely resolves any generic navigation target string (e.g. 'goals', 'leaderboard', 'myAchievements')
 * to the appropriate workspace-specific destination.
 */
export function resolveTargetScreen(
  targetScreen: string,
  isFacultyUser: boolean,
  activeWorkspace: FacultyWorkspaceId
): string {
  if (!isFacultyUser) {
    // Student context
    return targetScreen;
  }

  // HOD Workspace
  if (activeWorkspace === 'hod') {
    switch (targetScreen) {
      case 'dashboard':
      case 'home':
        return 'hodDashboard';
      case 'submissions':
      case 'verificationQueue':
      case 'hodVerificationQueue':
        return 'hodVerificationQueue';
      case 'faculty':
      case 'hodFacultyList':
        return 'hodFacultyList';
      case 'students':
      case 'assignedStudents':
      case 'hodStudentList':
        return 'hodStudentList';
      case 'performance':
      case 'departmentPerformance':
      case 'hodDepartmentPerformance':
        return 'hodDepartmentPerformance';
      case 'reports':
      case 'hodReports':
        return 'hodReports';
      case 'notifications':
      case 'hodNotifications':
        return 'hodNotifications';
      case 'profile':
      case 'facultyProfile':
        return 'facultyProfile';
      case 'myAchievements':
        return 'myAchievements';
      case 'goals':
        return 'goals';
      case 'leaderboard':
        return 'leaderboard';
      default:
        return targetScreen;
    }
  }

  // Academic Coordinator Workspace
  if (activeWorkspace === 'academic_coordinator') {
    switch (targetScreen) {
      case 'dashboard':
      case 'home':
        return 'acDashboard';
      case 'submissions':
      case 'achievements':
      case 'myAchievements':
        return 'acVerificationQueue';
      case 'creditRecords':
      case 'acCreditRecords':
        return 'acCreditRecords';
      case 'students':
      case 'assignedStudents':
        return 'acStudentList';
      case 'reports':
      case 'leaderboard':
        return 'acReports';
      case 'notifications':
        return 'acNotifications';
      case 'profile':
        return 'facultyProfile';
      default:
        return targetScreen;
    }
  }

  // Mentor Workspace
  if (activeWorkspace === 'mentor') {
    switch (targetScreen) {
      case 'dashboard':
      case 'home':
        return 'mentorDashboard';
      case 'mentees':
      case 'students':
      case 'assignedStudents':
        return 'mentorMentees';
      case 'projects':
      case 'goals':
        return 'mentorProjects';
      case 'reports':
      case 'progress':
      case 'performance':
      case 'leaderboard':
        return 'mentorReports';
      case 'notifications':
        return 'mentorNotifications';
      case 'profile':
        return 'facultyProfile';
      default:
        return targetScreen;
    }
  }

  // Head Workspace
  if (activeWorkspace === 'head') {
    switch (targetScreen) {
      case 'dashboard':
      case 'home':
      case 'facultyDashboard':
        return 'headDashboard';
      case 'achievements':
      case 'collegeAchievements':
      case 'myAchievements':
        return 'headCollegeAchievements';
      case 'points':
      case 'pointsManagement':
      case 'headPoints':
        return 'headPointsManagement';
      case 'categories':
      case 'categoryManagement':
      case 'headCategories':
        return 'headCategoryManagement';
      case 'analytics':
      case 'goals':
      case 'leaderboard':
        return 'headAnalytics';
      case 'reports':
        return 'headReports';
      case 'departments':
        return 'headDepartments';
      case 'notifications':
        return 'headNotifications';
      case 'profile':
      case 'facultyProfile':
        return 'facultyProfile';
      default:
        return targetScreen;
    }
  }

  // Dean Workspace
  if (activeWorkspace === 'dean') {
    switch (targetScreen) {
      case 'dashboard':
      case 'home':
      case 'facultyDashboard':
        return 'deanDashboard';
      case 'achievements':
      case 'reviews':
      case 'verificationQueue':
      case 'submissions':
        return 'deanVerificationQueue';
      case 'history':
      case 'reports':
        return 'deanVerificationHistory';
      case 'notifications':
        return 'deanNotifications';
      case 'profile':
      case 'facultyProfile':
        return 'facultyProfile';
      default:
        return targetScreen;
    }
  }

  // Principal Workspace
  if (activeWorkspace === 'principal') {
    switch (targetScreen) {
      case 'dashboard':
      case 'home':
      case 'facultyDashboard':
        return 'principalDashboard';
      case 'achievements':
      case 'reviews':
      case 'verificationQueue':
      case 'submissions':
      case 'approvals':
        return 'principalVerificationQueue';
      case 'history':
        return 'principalVerificationHistory';
      case 'departments':
        return 'principalDepartments';
      case 'performance':
      case 'goals':
        return 'principalPerformance';
      case 'leaderboard':
        return 'principalLeaderboard';
      case 'reports':
        return 'principalReports';
      case 'assignments':
      case 'deanAssignments':
        return 'principalDeanAssignments';
      case 'policy':
      case 'achievementPolicy':
        return 'principalAchievementPolicy';
      case 'institutionStructure':
      case 'structure':
        return 'principalInstitutionStructure';
      case 'notifications':
        return 'principalNotifications';
      case 'profile':
      case 'facultyProfile':
        return 'facultyProfile';
      default:
        return targetScreen;
    }
  }

  // Faculty account with active responsibility
  switch (targetScreen) {
    case 'dashboard':
    case 'home':
      return 'facultyDashboard';

    case 'goals':
      return activeWorkspace === 'proctor' ? 'proctorGoalsOverview' : 'facultyGoals';

    case 'leaderboard':
      return activeWorkspace === 'proctor' ? 'proctorLeaderboard' : 'facultyLeaderboard';

    case 'myAchievements':
    case 'achievements':
      return activeWorkspace === 'proctor' ? 'proctorAssignedStudents' : 'facultyAchievements';

    case 'notifications':
      return activeWorkspace === 'proctor' ? 'proctorNotifications' : 'facultyNotifications';

    case 'profile':
      return 'facultyProfile';

    case 'reports':
      return activeWorkspace === 'proctor' ? 'proctorReports' : 'reports';

    case 'assignedStudents':
    case 'students':
      return activeWorkspace === 'proctor' ? 'proctorAssignedStudents' : 'assignedStudents';

    default:
      return targetScreen;
  }
}
