import React, { useState, useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AchieveXFeedbackProvider, dismissAllFeedback } from './src/components/feedback/AchieveXFeedback';
import SplashScreen from './src/components/SplashScreen';
import LoginScreen from './src/components/LoginScreen';
import CreateAccountScreen from './src/components/CreateAccountScreen';
import DashboardScreen from './src/components/DashboardScreen';
import SubmitAchievementScreen from './src/components/achievement/SubmitAchievementScreen';
import LeaderboardScreen from './src/components/LeaderboardScreen';
import GoalsScreen from './src/components/GoalsScreen';
import SideMenu from './src/components/SideMenu';
import PlaceholderScreen from './src/components/PlaceholderScreen';
import ProfileScreen from './src/components/ProfileScreen';
import MyAchievementsScreen from './src/components/MyAchievementsScreen';
import NptelCreditCourseScreen from './src/components/NptelCreditCourseScreen';
import PendingVerification from './src/components/faculty/PendingVerification';
import VerificationDetails from './src/components/faculty/VerificationDetails';
import AssignedStudents from './src/components/faculty/AssignedStudents';
import VerificationHistory from './src/components/faculty/VerificationHistory';
import ResubmissionRequired from './src/components/faculty/ResubmissionRequired';
import FacultyReports from './src/components/faculty/FacultyReports';

import FacultySubmissions from './src/components/faculty/FacultySubmissions';
import FacultyReviewAchievement from './src/components/faculty/FacultyReviewAchievement';
import FacultyAchievements from './src/components/faculty/FacultyAchievements';
import FacultyNotifications from './src/components/faculty/FacultyNotifications';
import FacultyProfile from './src/components/faculty/FacultyProfile';
import FacultyDashboard from './src/components/faculty/FacultyDashboard';
import FacultyLeaderboard from './src/components/faculty/FacultyLeaderboard';
import FacultyAddAchievement from './src/components/faculty/FacultyAddAchievement';
import StudentNotificationsScreen from './src/components/StudentNotificationsScreen';
import { certificateMockData } from './src/data/facultyPortalMockData';
import {
  INITIAL_NOTIFICATIONS,
  getNotificationsForStudent,
  subscribeStudentNotifications,
  markStudentNotificationAsRead,
  markAllStudentNotificationsAsRead,
  type StudentNotification,
} from './src/data/notificationsData';
import { STUDENT_DATABASE, LOGGED_IN_STUDENT, type StudentRecord } from './src/data/achievementConfig';
import ProctorAssignedStudents from './src/components/faculty/proctor/ProctorAssignedStudents';
import ProctorStudentDetails from './src/components/faculty/proctor/ProctorStudentDetails';
import ProctorStudentAchievements from './src/components/faculty/proctor/ProctorStudentAchievements';
import ProctorPerformance from './src/components/faculty/proctor/ProctorPerformance';
import ProctorLeaderboard from './src/components/faculty/proctor/ProctorLeaderboard';
import ProctorReports from './src/components/faculty/proctor/ProctorReports';
import ProctorNotifications from './src/components/faculty/proctor/ProctorNotifications';
import ProctorGoalsOverview from './src/components/faculty/proctor/ProctorGoalsOverview';
import ProctorStudentGoalDetails from './src/components/faculty/proctor/ProctorStudentGoalDetails';
import FacultyGoals from './src/components/faculty/FacultyGoals';
import ACDashboard from './src/components/ac/ACDashboard';
import ACVerificationQueue from './src/components/ac/ACVerificationQueue';
import ACGroupReview from './src/components/ac/ACGroupReview';
import ACTeamReview from './src/components/ac/ACTeamReview';
import ACIndividualReview from './src/components/ac/ACIndividualReview';
import ACStudentList from './src/components/ac/ACStudentList';
import ACStudentDetails from './src/components/ac/ACStudentDetails';
import ACReports from './src/components/ac/ACReports';
import ACNotifications from './src/components/ac/ACNotifications';
import ACCreditRecords from './src/components/ac/ACCreditRecords';
import ACCreditRecordReview from './src/components/ac/ACCreditRecordReview';
import MentorDashboard from './src/components/mentor/MentorDashboard';
import MentorMentees from './src/components/mentor/MentorMentees';
import MentorMenteeDetails from './src/components/mentor/MentorMenteeDetails';
import MentorProjects from './src/components/mentor/MentorProjects';
import MentorProjectDetails from './src/components/mentor/MentorProjectDetails';
import MentorReports from './src/components/mentor/MentorReports';
import MentorNotifications from './src/components/mentor/MentorNotifications';
import StudentProjects from './src/components/student/projects/StudentProjects';
import StudentProjectDetails from './src/components/student/projects/StudentProjectDetails';
import StudentCreateProject from './src/components/student/projects/StudentCreateProject';
import StudentEditProject from './src/components/student/projects/StudentEditProject';
import TeamMemberCertificateScreen from './src/components/achievement/TeamMemberCertificateScreen';
import TeamLeaderMonitorScreen from './src/components/achievement/TeamLeaderMonitorScreen';
import StudentTeamAchievementsScreen from './src/components/achievement/StudentTeamAchievementsScreen';
import StudentTeamAchievementDetailsScreen from './src/components/achievement/StudentTeamAchievementDetailsScreen';
import ProctorTeamView from './src/components/faculty/proctor/ProctorTeamView';
import HODDashboard from './src/components/hod/HODDashboard';
import HODVerificationQueue from './src/components/hod/HODVerificationQueue';
import HODFacultyReview from './src/components/hod/HODFacultyReview';
import HODFacultyList from './src/components/hod/HODFacultyList';
import HODFacultyDetails from './src/components/hod/HODFacultyDetails';
import HODStudentList from './src/components/hod/HODStudentList';
import HODStudentDetails from './src/components/hod/HODStudentDetails';
import HODDepartmentPerformance from './src/components/hod/HODDepartmentPerformance';
import HODReports from './src/components/hod/HODReports';
import HODNotifications from './src/components/hod/HODNotifications';
import HODAssignments from './src/components/hod/HODAssignments';
import HODProctorAssignments from './src/components/hod/HODProctorAssignments';
import HODMentorAssignments from './src/components/hod/HODMentorAssignments';
import HeadDashboard from './src/components/head/HeadDashboard';
import HeadCollegeAchievements from './src/components/head/HeadCollegeAchievements';
import HeadPointsManagement from './src/components/head/HeadPointsManagement';
import HeadCategoryManagement from './src/components/head/HeadCategoryManagement';
import HeadAnalytics from './src/components/head/HeadAnalytics';
import HeadReports from './src/components/head/HeadReports';
import HeadNAACReport from './src/components/head/HeadNAACReport';
import HeadNBAReport from './src/components/head/HeadNBAReport';
import HeadAnnualReport from './src/components/head/HeadAnnualReport';
import HeadDepartmentReport from './src/components/head/HeadDepartmentReport';
import HeadCategoryReport from './src/components/head/HeadCategoryReport';
import HeadCustomReport from './src/components/head/HeadCustomReport';
import HeadReportRecords from './src/components/head/HeadReportRecords';
import HeadDepartments from './src/components/head/HeadDepartments';
import HeadDepartmentDetails from './src/components/head/HeadDepartmentDetails';
import HeadNotifications from './src/components/head/HeadNotifications';
import DeanDashboard from './src/components/dean/DeanDashboard';
import DeanVerificationQueue from './src/components/dean/DeanVerificationQueue';
import DeanHODReview from './src/components/dean/DeanHODReview';
import DeanVerificationHistory from './src/components/dean/DeanVerificationHistory';
import DeanNotifications from './src/components/dean/DeanNotifications';
import PrincipalDashboard from './src/components/principal/PrincipalDashboard';
import PrincipalVerificationQueue from './src/components/principal/PrincipalVerificationQueue';
import PrincipalDeanReview from './src/components/principal/PrincipalDeanReview';
import PrincipalVerificationHistory from './src/components/principal/PrincipalVerificationHistory';
import PrincipalDeanAssignments from './src/components/principal/PrincipalDeanAssignments';
import PrincipalDepartments from './src/components/principal/PrincipalDepartments';
import PrincipalDepartmentDetails from './src/components/principal/PrincipalDepartmentDetails';
import PrincipalPerformance from './src/components/principal/PrincipalPerformance';
import PrincipalLeaderboard from './src/components/principal/PrincipalLeaderboard';
import PrincipalReports from './src/components/principal/PrincipalReports';
import PrincipalAchievementPolicy from './src/components/principal/PrincipalAchievementPolicy';
import PrincipalInstitutionStructure from './src/components/principal/PrincipalInstitutionStructure';
import PrincipalNotifications from './src/components/principal/PrincipalNotifications';
import CollegeAchievementOverview from './src/components/college/CollegeAchievementOverview';
import DepartmentAchievementList from './src/components/college/DepartmentAchievementList';
import { type CollegePersonSummary } from './src/data/collegeDrilldownData';
import {
  MENTOR_ASSIGNED_MENTEES,
  MENTOR_PROJECTS,
  type MentorMentee,
  type MentorProject,
  getProjectById,
  getMenteeById,
} from './src/data/mentorWorkspaceData';
import {
  INITIAL_CREDIT_RECORDS,
  type CreditCourseRecord,
} from './src/data/academicCreditsData';
import {
  AC_EVENT_GROUPS,
  SIH_STUDENT_SUBMISSIONS,
  AC_SCOPED_STUDENTS,
  type ACEventGroup,
  type ACStudentSubmission,
  type ACScopedStudent,
} from './src/data/acWorkspaceData';
import { resolveTargetScreen, getWorkspaceRoute } from './src/navigation/workspaceRoutes';
import {
  DEFAULT_FACULTY_USER,
  type FacultyWorkspaceId,
  type FacultyUser,
  type AssignedStudent,
  type StudentGoalProgress,
  PROCTOR_ASSIGNED_STUDENTS,
  PROCTOR_STUDENT_GOALS,
} from './src/data/facultyWorkspaceData';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    | 'splash'
    | 'login'
    | 'createAccount'
    | 'dashboard'
    | 'submitAchievement'
    | 'leaderboard'
    | 'goals'
    | 'myAchievements'
    | 'achievementHistory'
    | 'myPoints'
    | 'nptelCredits'
    | 'notifications'
    | 'profile'
    | 'settings'
    | 'pendingVerification'
    | 'verificationDetails'
    | 'assignedStudents'
    | 'verificationHistory'
    | 'resubmissionRequired'
    | 'reports'
    | 'facultyDashboard'
    | 'facultySubmissions'
    | 'facultyReviewAchievement'
    | 'facultyAchievements'
    | 'facultyNotifications'
    | 'facultyProfile'
    | 'facultyLeaderboard'
    | 'facultyAddAchievement'
    | 'facultyGoals'
    | 'proctorAssignedStudents'
    | 'proctorStudentDetails'
    | 'proctorStudentAchievements'
    | 'proctorGoalsOverview'
    | 'proctorStudentGoalDetails'
    | 'proctorPerformance'
    | 'proctorLeaderboard'
    | 'proctorReports'
    | 'proctorNotifications'
    | 'acDashboard'
    | 'acVerificationQueue'
    | 'acCreditRecords'
    | 'acCreditRecordReview'
    | 'acGroupReview'
    | 'acTeamReview'
    | 'acIndividualReview'
    | 'acStudentList'
    | 'acStudentDetails'
    | 'acReports'
    | 'acNotifications'
    | 'mentorDashboard'
    | 'mentorMentees'
    | 'mentorMenteeDetails'
    | 'mentorProjects'
    | 'mentorProjectDetails'
    | 'mentorReports'
    | 'mentorNotifications'
    | 'teamMemberCertificate'   // Team member uploading own certificate
    | 'teamLeaderMonitor'       // Team leader monitoring certificate progress
    | 'studentProjects'
    | 'studentProjectDetails'
    | 'studentCreateProject'
    | 'studentEditProject'
    | 'studentTeamAchievements' // Student Team Achievements overview
    | 'studentTeamAchievementDetails' // Student Team Details with member certificates
    | 'proctorTeamView'         // Proctor read-only team monitoring
    | 'hodDashboard'
    | 'hodVerificationQueue'
    | 'hodFacultyReview'
    | 'hodFacultyList'
    | 'hodFacultyDetails'
    | 'hodStudentList'
    | 'hodStudentDetails'
    | 'hodDepartmentPerformance'
    | 'hodReports'
    | 'hodNotifications'
    | 'hodAssignments'
    | 'hodProctorAssignments'
    | 'hodMentorAssignments'
    | 'headDashboard'
    | 'headCollegeAchievements'
    | 'headPointsManagement'
    | 'headCategoryManagement'
    | 'headAnalytics'
    | 'headReports'
    | 'headNAACReport'
    | 'headNBAReport'
    | 'headAnnualReport'
    | 'headDepartmentReport'
    | 'headCategoryReport'
    | 'headCustomReport'
    | 'headReportRecords'
    | 'headDepartments'
    | 'headDepartmentDetails'
    | 'headNotifications'
    | 'deanDashboard'
    | 'deanVerificationQueue'
    | 'deanHODReview'
    | 'deanVerificationHistory'
    | 'deanNotifications'
    | 'principalDashboard'
    | 'principalVerificationQueue'
    | 'principalDeanReview'
    | 'principalVerificationHistory'
    | 'principalDeanAssignments'
    | 'principalDepartments'
    | 'principalDepartmentDetails'
    | 'principalPerformance'
    | 'principalLeaderboard'
    | 'principalReports'
    | 'principalAchievementPolicy'
    | 'principalInstitutionStructure'
    | 'principalNotifications'
    | 'collegeStudentAchievements'
    | 'collegeFacultyAchievements'
    | 'departmentStudentAchievements'
    | 'departmentFacultyAchievements'
  >('splash');

  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<
    'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean'
  >('Student');
  const [selectedHeadDeptId, setSelectedHeadDeptId] = useState<string>('CSE_IOT');
  const [drilldownDeptCode, setDrilldownDeptCode] = useState<string>('CSE (IoT)');
  const [drilldownDeptName, setDrilldownDeptName] = useState<string>('Computer Science & Engineering (IoT)');
  const [drilldownOriginRole, setDrilldownOriginRole] = useState<'head' | 'principal'>('head');
  const [personDetailsPreviousScreen, setPersonDetailsPreviousScreen] = useState<string | null>(null);
  const [headReportRecordsContext, setHeadReportRecordsContext] = useState<{
    reportTitle: string;
    contextText: string;
    records: any[];
    sourceScreen?:
      | 'headNAACReport'
      | 'headNBAReport'
      | 'headAnnualReport'
      | 'headDepartmentReport'
      | 'headCategoryReport'
      | 'headCustomReport';
  } | null>(null);
  const [selectedDeanSubmissionId, setSelectedDeanSubmissionId] = useState<string>('HOD-SUB-001');
  const [selectedPrincipalSubmissionId, setSelectedPrincipalSubmissionId] = useState<string>('dean_sub_1');
  const [selectedPrincipalDeptId, setSelectedPrincipalDeptId] = useState<string>('dept_cse_iot');
  const [deanInitialStatusFilter, setDeanInitialStatusFilter] = useState<string>('Pending');
  const [deanInitialDeptFilter, setDeanInitialDeptFilter] = useState<string | undefined>(undefined);
  const [selectedVerificationId, setSelectedVerificationId] = useState<string>('');
  const [facultyAchievementsList, setFacultyAchievementsList] = useState(certificateMockData);
  const [notifications, setNotifications] = useState<StudentNotification[]>(INITIAL_NOTIFICATIONS);
  const [facultyUser, setFacultyUser] = useState<FacultyUser>(DEFAULT_FACULTY_USER);
  const [activeFacultyWorkspace, setActiveFacultyWorkspace] = useState<FacultyWorkspaceId>('faculty');
  const [selectedProctorStudent, setSelectedProctorStudent] = useState<AssignedStudent | null>(null);
  const [selectedProctorGoal, setSelectedProctorGoal] = useState<StudentGoalProgress | null>(null);
  const [selectedACEventGroupId, setSelectedACEventGroupId] = useState<string>('EVENT_GROUP_SIH_2026');
  const [selectedACTeamGroupId, setSelectedACTeamGroupId] = useState<string>('TEAM_CODE_NEXUS');
  const [selectedACSubmission, setSelectedACSubmission] = useState<ACStudentSubmission | null>(null);
  const [selectedACStudent, setSelectedACStudent] = useState<ACScopedStudent | null>(null);
  const [selectedCreditRecord, setSelectedCreditRecord] = useState<CreditCourseRecord>(
    INITIAL_CREDIT_RECORDS[0]
  );
  const [selectedMentee, setSelectedMentee] = useState<MentorMentee>(MENTOR_ASSIGNED_MENTEES[0]);
  const [selectedMentorProject, setSelectedMentorProject] = useState<MentorProject>(MENTOR_PROJECTS[0]);
  const [selectedStudentProjectId, setSelectedStudentProjectId] = useState<string>('proj-1');
  const [mentorInitialFilter, setMentorInitialFilter] = useState<string | undefined>(undefined);
  const [acQueueTab, setAcQueueTab] = useState<'All' | 'Groups' | 'Individual' | 'Corrections'>('All');
  const [acFilterStatus, setAcFilterStatus] = useState<string | undefined>(undefined);
  // Team Achievement navigation state & active persona
  const [activeTeamAchievementId, setActiveTeamAchievementId] = useState<string>('TA-SIH-2026-001');
  const [activeMemberStudentId, setActiveMemberStudentId] = useState<string | null>(null);
  const [selectedHODSubmissionId, setSelectedHODSubmissionId] = useState<string>('HOD-SUB-001');
  const [selectedHODFacultyId, setSelectedHODFacultyId] = useState<string>('HOD-FAC-001');
  const [selectedHODStudentId, setSelectedHODStudentId] = useState<string>('s15');
  const [hodQueueTab, setHodQueueTab] = useState<'All' | 'Pending' | 'Corrections' | 'Verified'>('All');
  const [currentStudent, setCurrentStudent] = useState<StudentRecord>({
    id: 's11',
    name: 'Gokulraj V',
    rollNumber: '23CI011',
    department: 'CSE (IoT)',
    year: '3rd Year',
  });
  const currentStudentId = currentStudent.rollNumber.toLowerCase();

  useEffect(() => {
    ScreenCapture.allowScreenCaptureAsync().catch(() => {});
  }, []);

  // Reactive subscription to student notifications
  useEffect(() => {
    setNotifications(getNotificationsForStudent(currentStudent.rollNumber));
    const unsubscribe = subscribeStudentNotifications(() => {
      setNotifications(getNotificationsForStudent(currentStudent.rollNumber));
    });
    return unsubscribe;
  }, [currentStudent.rollNumber]);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkNotificationAsRead = (id: string) => {
    markStudentNotificationAsRead(id);
    setNotifications(getNotificationsForStudent(currentStudent.rollNumber));
  };

  const handleMarkAllNotificationsAsRead = () => {
    markAllStudentNotificationsAsRead(currentStudent.rollNumber);
    setNotifications(getNotificationsForStudent(currentStudent.rollNumber));
  };

  const isFaculty = userRole !== 'Student';
  const homeScreen = isFaculty
    ? activeFacultyWorkspace === 'dean'
      ? 'deanDashboard'
      : activeFacultyWorkspace === 'head'
      ? 'headDashboard'
      : activeFacultyWorkspace === 'hod'
      ? 'hodDashboard'
      : activeFacultyWorkspace === 'academic_coordinator'
      ? 'acDashboard'
      : activeFacultyWorkspace === 'mentor'
      ? 'mentorDashboard'
      : 'facultyDashboard'
    : 'dashboard';
  const profileScreen = isFaculty ? 'facultyProfile' : 'profile';

  const handleNavigate = (targetScreen: string, params?: any) => {
    if (params?.teamAchievementId) {
      setActiveTeamAchievementId(params.teamAchievementId);
    }
    if (params?.studentId) {
      setActiveMemberStudentId(params.studentId);
      setSelectedHODStudentId(params.studentId);
    }
    if (params?.submissionId) {
      setSelectedHODSubmissionId(params.submissionId);
    }
    if (params?.facultyId) {
      setSelectedHODFacultyId(params.facultyId);
    }
    if (params?.initialTab && (targetScreen === 'hodVerificationQueue' || targetScreen === 'submissions')) {
      setHodQueueTab(params.initialTab);
    }
    if (targetScreen === 'hodVerify') {
      setCurrentScreen('hodVerificationQueue');
      return;
    }
    if (targetScreen === 'hodUpload') {
      setCurrentScreen('submitAchievement');
      return;
    }
    if (targetScreen === 'hodGoals') {
      setCurrentScreen('facultyGoals');
      return;
    }
    if (targetScreen === 'hodReports') {
      setCurrentScreen('hodReports');
      return;
    }
    if (targetScreen === 'hodDashboard') {
      setCurrentScreen('hodDashboard');
      return;
    }
    if (targetScreen === 'hodVerificationQueue') {
      setCurrentScreen('hodVerificationQueue');
      return;
    }
    if (targetScreen === 'hodFacultyReview') {
      setCurrentScreen('hodFacultyReview');
      return;
    }
    if (targetScreen === 'hodFacultyList') {
      setCurrentScreen('hodFacultyList');
      return;
    }
    if (targetScreen === 'hodFacultyDetails') {
      setCurrentScreen('hodFacultyDetails');
      return;
    }
    if (targetScreen === 'hodStudentList') {
      setCurrentScreen('hodStudentList');
      return;
    }
    if (targetScreen === 'hodStudentDetails') {
      if (params?.studentId) {
        setSelectedHODStudentId(params.studentId);
      }
      setCurrentScreen('hodStudentDetails');
      return;
    }
    if (targetScreen === 'hodDepartmentPerformance') {
      setCurrentScreen('hodDepartmentPerformance');
      return;
    }
    if (targetScreen === 'hodNotifications') {
      setCurrentScreen('hodNotifications');
      return;
    }
    if (targetScreen === 'hodAssignments') {
      setCurrentScreen('hodAssignments');
      return;
    }
    if (targetScreen === 'hodProctorAssignments') {
      setCurrentScreen('hodProctorAssignments');
      return;
    }
    if (targetScreen === 'hodMentorAssignments') {
      setCurrentScreen('hodMentorAssignments');
      return;
    }
    if (params?.departmentId) {
      setSelectedHeadDeptId(params.departmentId);
    }
    if (targetScreen === 'headDashboard') {
      setCurrentScreen('headDashboard');
      return;
    }
    if (targetScreen === 'headCollegeAchievements') {
      setCurrentScreen('headCollegeAchievements');
      return;
    }
    if (targetScreen === 'headPointsManagement') {
      setCurrentScreen('headPointsManagement');
      return;
    }
    if (targetScreen === 'headCategoryManagement') {
      setCurrentScreen('headCategoryManagement');
      return;
    }
    if (targetScreen === 'headAnalytics') {
      setCurrentScreen('headAnalytics');
      return;
    }
    if (targetScreen === 'headReports') {
      setCurrentScreen('headReports');
      return;
    }
    if (targetScreen === 'headNAACReport') {
      setCurrentScreen('headNAACReport');
      return;
    }
    if (targetScreen === 'headNBAReport') {
      setCurrentScreen('headNBAReport');
      return;
    }
    if (targetScreen === 'headCustomReport') {
      setCurrentScreen('headCustomReport');
      return;
    }
    if (targetScreen === 'headDepartments') {
      setCurrentScreen('headDepartments');
      return;
    }
    if (targetScreen === 'headDepartmentDetails') {
      if (params?.departmentId) {
        setSelectedHeadDeptId(params.departmentId);
      }
      setCurrentScreen('headDepartmentDetails');
      return;
    }
    if (targetScreen === 'headNotifications') {
      setCurrentScreen('headNotifications');
      return;
    }
    if (params?.submissionId) {
      setSelectedDeanSubmissionId(params.submissionId);
    }
    if (params?.statusFilter) {
      setDeanInitialStatusFilter(params.statusFilter);
    }
    if (params?.departmentFilter) {
      setDeanInitialDeptFilter(params.departmentFilter);
    }
    if (targetScreen === 'deanDashboard') {
      setCurrentScreen('deanDashboard');
      return;
    }
    if (targetScreen === 'deanVerificationQueue') {
      setCurrentScreen('deanVerificationQueue');
      return;
    }
    if (targetScreen === 'deanHODReview') {
      setCurrentScreen('deanHODReview');
      return;
    }
    if (targetScreen === 'deanVerificationHistory') {
      setCurrentScreen('deanVerificationHistory');
      return;
    }
    if (targetScreen === 'deanNotifications') {
      setCurrentScreen('deanNotifications');
      return;
    }
    if (params?.principalSubmissionId || (targetScreen === 'principalDeanReview' && params?.submissionId)) {
      setSelectedPrincipalSubmissionId(params.principalSubmissionId || params.submissionId);
    }
    if (params?.principalDeptId || (targetScreen === 'principalDepartmentDetails' && params?.departmentId)) {
      setSelectedPrincipalDeptId(params.principalDeptId || params.departmentId);
    }
    if (targetScreen === 'principalDashboard') {
      setCurrentScreen('principalDashboard');
      return;
    }
    if (targetScreen === 'principalVerificationQueue') {
      setCurrentScreen('principalVerificationQueue');
      return;
    }
    if (targetScreen === 'principalDeanReview') {
      setCurrentScreen('principalDeanReview');
      return;
    }
    if (targetScreen === 'principalVerificationHistory') {
      setCurrentScreen('principalVerificationHistory');
      return;
    }
    if (targetScreen === 'principalDeanAssignments') {
      setCurrentScreen('principalDeanAssignments');
      return;
    }
    if (targetScreen === 'principalDepartments') {
      setCurrentScreen('principalDepartments');
      return;
    }
    if (targetScreen === 'principalDepartmentDetails') {
      setCurrentScreen('principalDepartmentDetails');
      return;
    }
    if (targetScreen === 'principalPerformance') {
      setCurrentScreen('principalPerformance');
      return;
    }
    if (targetScreen === 'principalLeaderboard') {
      setCurrentScreen('principalLeaderboard');
      return;
    }
    if (targetScreen === 'principalReports') {
      setCurrentScreen('principalReports');
      return;
    }
    if (targetScreen === 'principalAchievementPolicy') {
      setCurrentScreen('principalAchievementPolicy');
      return;
    }
    if (targetScreen === 'principalInstitutionStructure') {
      setCurrentScreen('principalInstitutionStructure');
      return;
    }
    if (targetScreen === 'principalNotifications') {
      setCurrentScreen('principalNotifications');
      return;
    }
    if (targetScreen === 'collegeStudentAchievements') {
      setDrilldownOriginRole(userRole === 'Principal' ? 'principal' : 'head');
      setCurrentScreen('collegeStudentAchievements');
      return;
    }
    if (targetScreen === 'collegeFacultyAchievements') {
      setDrilldownOriginRole(userRole === 'Principal' ? 'principal' : 'head');
      setCurrentScreen('collegeFacultyAchievements');
      return;
    }
    if (targetScreen === 'departmentStudentAchievements') {
      if (params?.deptCode) setDrilldownDeptCode(params.deptCode);
      if (params?.deptName) setDrilldownDeptName(params.deptName);
      if (params?.viewerRole) setDrilldownOriginRole(params.viewerRole);
      setCurrentScreen('departmentStudentAchievements');
      return;
    }
    if (targetScreen === 'departmentFacultyAchievements') {
      if (params?.deptCode) setDrilldownDeptCode(params.deptCode);
      if (params?.deptName) setDrilldownDeptName(params.deptName);
      if (params?.viewerRole) setDrilldownOriginRole(params.viewerRole);
      setCurrentScreen('departmentFacultyAchievements');
      return;
    }
    if (targetScreen === 'TeamCertificateUpload' || targetScreen === 'teamMemberCertificate') {
      setCurrentScreen('teamMemberCertificate');
      return;
    }
    if (targetScreen === 'teamLeaderMonitor') {
      setCurrentScreen('teamLeaderMonitor');
      return;
    }
    if (targetScreen === 'acTeamReview') {
      setCurrentScreen('acTeamReview');
      return;
    }
    if (targetScreen === 'studentProjects') {
      setCurrentScreen('studentProjects');
      return;
    }
    if (targetScreen === 'studentProjectDetails') {
      if (params?.projectId) {
        setSelectedStudentProjectId(params.projectId);
      }
      setCurrentScreen('studentProjectDetails');
      return;
    }
    if (targetScreen === 'studentCreateProject') {
      setCurrentScreen('studentCreateProject');
      return;
    }
    if (targetScreen === 'studentEditProject') {
      if (params?.projectId) {
        setSelectedStudentProjectId(params.projectId);
      }
      setCurrentScreen('studentEditProject');
      return;
    }
    if (targetScreen === 'studentTeamAchievements') {
      setCurrentScreen('studentTeamAchievements');
      return;
    }
    if (targetScreen === 'studentTeamAchievementDetails') {
      setCurrentScreen('studentTeamAchievementDetails');
      return;
    }
    if (targetScreen === 'proctorTeamView') {
      setCurrentScreen('proctorTeamView');
      return;
    }
    if (targetScreen === 'proctorNotifications') {
      setActiveFacultyWorkspace('proctor');
      setCurrentScreen('proctorNotifications');
      return;
    }
    if (params?.initialTab) {
      setAcQueueTab(params.initialTab);
    }
    if (params?.filterStatus) {
      setAcFilterStatus(params.filterStatus);
    } else if (params?.initialTab) {
      setAcFilterStatus(undefined);
    }
    if (params?.groupId) {
      setSelectedACEventGroupId(params.groupId);
    }
    if (params?.teamGroupId) {
      setSelectedACTeamGroupId(params.teamGroupId);
    }
    if (params?.projectId) {
      const foundProj = getProjectById(params.projectId);
      if (foundProj) setSelectedMentorProject(foundProj);
    }
    if (params?.studentId) {
      const foundMentee = getMenteeById(params.studentId);
      if (foundMentee) setSelectedMentee(foundMentee);
    }
    const resolved = resolveTargetScreen(targetScreen, isFaculty, activeFacultyWorkspace);
    setCurrentScreen(resolved as any);
  };

  const handleNotificationNavigateToTarget = (targetType: string, targetId?: string) => {
    if (targetType === 'achievement') {
      handleNavigate('myAchievements');
    } else if (targetType === 'goal') {
      handleNavigate('goals');
    } else if (targetType === 'academic_credit') {
      handleNavigate('nptelCredits');
    } else if (targetType === 'profile') {
      handleNavigate('profile');
    } else if (targetType === 'team_achievement') {
      // Navigate to team member certificate upload screen
      if (targetId) setActiveTeamAchievementId(targetId);
      handleNavigate('teamMemberCertificate');
    } else {
      handleNavigate('home');
    }
  };

  const isPlaceholderScreen = (screen: string) => {
    return [
      'achievementHistory',
      'myPoints',
      'settings',
    ].includes(screen);
  };

  const getPlaceholderTitle = (screen: string) => {
    switch (screen) {
      case 'myAchievements':
        return 'My Achievements';
      case 'achievementHistory':
        return 'Achievement History';
      case 'myPoints':
        return 'My Points';
      case 'settings':
        return 'Settings';
      default:
        return 'AchieveX';
    }
  };

  // Helper to render current screen
  const renderScreen = () => {
    if (currentScreen === 'splash') {
      return (
        <SplashScreen
          onFinish={() => {
            setCurrentScreen('login');
          }}
        />
      );
    }

    if (currentScreen === 'login') {
      return (
        <LoginScreen
          onLogin={(role: any, studentUser?: StudentRecord) => {
            setUserRole(role);
            if (studentUser) {
              setCurrentStudent(studentUser);
            }
            if (role === 'Student') {
              setCurrentScreen('dashboard');
            } else if (role === 'Principal') {
              setActiveFacultyWorkspace('principal');
              setCurrentScreen('principalDashboard');
            } else if (role === 'Dean') {
              setActiveFacultyWorkspace('dean');
              setCurrentScreen('deanDashboard');
            } else if (role === 'Head') {
              setActiveFacultyWorkspace('head');
              setCurrentScreen('headDashboard');
            } else if (role === 'HOD') {
              setActiveFacultyWorkspace('hod');
              setCurrentScreen('hodDashboard');
            } else if (role === 'Academic Coordinator') {
              setActiveFacultyWorkspace('academic_coordinator');
              setCurrentScreen('acDashboard');
            } else if (role === 'Proctor') {
              setActiveFacultyWorkspace('proctor');
              setCurrentScreen('facultyDashboard');
            } else {
              setCurrentScreen('facultyDashboard');
            }
          }}
          onGoToCreateAccount={() => setCurrentScreen('createAccount')}
        />
      );
    }

    if (currentScreen === 'createAccount') {
      return (
        <CreateAccountScreen
          onCreateAccount={(account: any) => {
            if (account.primaryRole === 'student') {
              setUserRole('Student');
              setCurrentScreen('dashboard');
            } else {
              if (account.primaryRole === 'principal') {
                setUserRole('Principal');
                setActiveFacultyWorkspace('principal');
                setCurrentScreen('principalDashboard');
              } else if (account.primaryRole === 'dean') {
                setUserRole('Dean');
                setActiveFacultyWorkspace('dean');
                setCurrentScreen('deanDashboard');
              } else if (account.primaryRole === 'head') {
                setUserRole('Head');
                if (account.headType === 'achievement') {
                  setActiveFacultyWorkspace('head');
                  setCurrentScreen('headDashboard');
                } else {
                  // Other Head types do NOT receive access to Achievement Head workspace
                  setActiveFacultyWorkspace('faculty');
                  setCurrentScreen('facultyDashboard');
                }
              } else if (account.primaryRole === 'hod') {
                setUserRole('HOD');
                setActiveFacultyWorkspace('hod');
                setCurrentScreen('hodDashboard');
              } else {
                setUserRole('Proctor');
                setCurrentScreen('facultyDashboard');
              }
            }
          }}
          onGoToLogin={() => setCurrentScreen('login')}
        />
      );
    }

    if (currentScreen === 'submitAchievement') {
      return (
        <SubmitAchievementScreen
          onGoBack={() => setCurrentScreen(homeScreen)}
          onSubmittedSuccess={() => setCurrentScreen(homeScreen)}
          onOpenLeaderboard={() => handleNavigate('leaderboard')}
          onOpenProfile={() => handleNavigate('profile')}
          onOpenGoals={() => handleNavigate('goals')}
        />
      );
    }

    if (currentScreen === 'leaderboard') {
      return (
        <LeaderboardScreen
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenSubmitAchievement={() => setCurrentScreen('submitAchievement')}
          onOpenGoals={() => handleNavigate('goals')}
          onOpenProfile={() => handleNavigate('profile')}
          onOpenMyAchievements={() => handleNavigate('myAchievements')}
        />
      );
    }

    if (currentScreen === 'goals') {
      return (
        <GoalsScreen
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenSubmitAchievement={() => setCurrentScreen('submitAchievement')}
          onOpenLeaderboard={() => handleNavigate('leaderboard')}
          onOpenMyAchievements={() => handleNavigate('myAchievements')}
          onOpenProfile={() => handleNavigate('profile')}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'myAchievements') {
      return (
        <MyAchievementsScreen
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen, params) => handleNavigate(screen, params)}
          onOpenProfile={() => handleNavigate(profileScreen)}
          onOpenLeaderboard={() => handleNavigate('leaderboard')}
          currentStudentId={currentStudentId}
        />
      );
    }

    if (currentScreen === 'facultyDashboard') {
      return (
        <FacultyDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
          onSelectVerification={(id: string) => {
            setSelectedVerificationId(id);
            setCurrentScreen('facultyReviewAchievement');
          }}
          userRole={userRole as any}
          facultyUser={facultyUser}
          activeWorkspace={activeFacultyWorkspace}
          onSelectWorkspace={(ws) => {
            setActiveFacultyWorkspace(ws);
            setSelectedProctorStudent(null);
            if (ws === 'principal') {
              setUserRole('Principal');
              setCurrentScreen('principalDashboard');
            } else if (ws === 'dean') {
              setUserRole('Dean');
              setCurrentScreen('deanDashboard');
            } else if (ws === 'head') {
              setUserRole('Head');
              setCurrentScreen('headDashboard');
            } else if (ws === 'hod') {
              setUserRole('HOD');
              setCurrentScreen('hodDashboard');
            } else if (ws === 'academic_coordinator') {
              setUserRole('Academic Coordinator');
              setCurrentScreen('acDashboard');
            } else if (ws === 'mentor') {
              setUserRole('Proctor');
              setCurrentScreen('mentorDashboard');
            } else {
              setUserRole('Proctor');
              setCurrentScreen('facultyDashboard');
            }
          }}
        />
      );
    }

    if (currentScreen === 'facultySubmissions') {
      return (
        <FacultySubmissions
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
          onSelectVerification={(id: string) => {
            setSelectedVerificationId(id);
            setCurrentScreen('facultyReviewAchievement');
          }}
        />
      );
    }

    if (currentScreen === 'facultyReviewAchievement') {
      return (
        <FacultyReviewAchievement
          itemId={selectedVerificationId}
          onGoBack={() => setCurrentScreen('facultySubmissions')}
          onActionComplete={() => setCurrentScreen('facultySubmissions')}
        />
      );
    }

    if (currentScreen === 'facultyAchievements') {
      return (
        <FacultyAchievements
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
          achievementsList={facultyAchievementsList}
        />
      );
    }

    if (currentScreen === 'facultyNotifications') {
      return (
        <FacultyNotifications
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
          onSelectNotification={(id: string) => {
            setSelectedVerificationId(id);
            setCurrentScreen('facultyReviewAchievement');
          }}
        />
      );
    }

    if (currentScreen === 'facultyProfile') {
      return (
        <FacultyProfile
          onGoBack={() => {
            if (activeFacultyWorkspace === 'dean') {
              setCurrentScreen('deanDashboard');
            } else if (activeFacultyWorkspace === 'head') {
              setCurrentScreen('headDashboard');
            } else if (activeFacultyWorkspace === 'hod') {
              setCurrentScreen('hodDashboard');
            } else if (activeFacultyWorkspace === 'academic_coordinator') {
              setCurrentScreen('acDashboard');
            } else if (activeFacultyWorkspace === 'mentor') {
              setCurrentScreen('mentorDashboard');
            } else {
              setCurrentScreen('facultyDashboard');
            }
          }}
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
          onLogout={() => {
            dismissAllFeedback();
            setMenuOpen(false);
            setUserRole('Student');
            setCurrentScreen('login');
          }}
          facultyUser={facultyUser}
          activeWorkspace={activeFacultyWorkspace}
          onSelectWorkspace={(ws) => {
            setActiveFacultyWorkspace(ws);
            setSelectedProctorStudent(null);
            if (ws === 'principal') {
              setUserRole('Principal');
              setCurrentScreen('principalDashboard');
            } else if (ws === 'dean') {
              setUserRole('Dean');
              setCurrentScreen('deanDashboard');
            } else if (ws === 'head') {
              setUserRole('Head');
              setCurrentScreen('headDashboard');
            } else if (ws === 'hod') {
              setUserRole('HOD');
              setCurrentScreen('hodDashboard');
            } else if (ws === 'academic_coordinator') {
              setUserRole('Academic Coordinator');
              setCurrentScreen('acDashboard');
            } else if (ws === 'mentor') {
              setUserRole('Proctor');
              setCurrentScreen('mentorDashboard');
            } else {
              setUserRole('Proctor');
              setCurrentScreen('facultyDashboard');
            }
          }}
        />
      );
    }

    if (currentScreen === 'facultyLeaderboard') {
      return (
        <FacultyLeaderboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'facultyAddAchievement') {
      return (
        <FacultyAddAchievement
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onAdd={(record) => {
            setFacultyAchievementsList((prev: any) => [record, ...prev]);
          }}
        />
      );
    }

    if (currentScreen === 'facultyGoals') {
      return (
        <FacultyGoals
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
          onOpenMenu={() => setMenuOpen(true)}
        />
      );
    }

    if (currentScreen === 'proctorAssignedStudents') {
      return (
        <ProctorAssignedStudents
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
          onSelectStudent={(student) => {
            setSelectedProctorStudent(student);
            setCurrentScreen('proctorStudentDetails');
          }}
        />
      );
    }

    if (currentScreen === 'proctorStudentDetails') {
      return (
        <ProctorStudentDetails
          student={selectedProctorStudent || PROCTOR_ASSIGNED_STUDENTS[0]}
          onGoBack={() => setCurrentScreen('proctorAssignedStudents')}
          onNavigate={(screen) => handleNavigate(screen)}
          onViewAchievements={(student) => {
            setSelectedProctorStudent(student);
            setCurrentScreen('proctorStudentAchievements');
          }}
          onViewLeaderboard={() => setCurrentScreen('proctorLeaderboard')}
        />
      );
    }

    if (currentScreen === 'proctorStudentAchievements') {
      return (
        <ProctorStudentAchievements
          student={selectedProctorStudent || PROCTOR_ASSIGNED_STUDENTS[0]}
          onGoBack={() => setCurrentScreen('proctorStudentDetails')}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'proctorGoalsOverview') {
      return (
        <ProctorGoalsOverview
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
          onSelectGoal={(goal) => {
            setSelectedProctorGoal(goal);
            setCurrentScreen('proctorStudentGoalDetails');
          }}
        />
      );
    }

    if (currentScreen === 'proctorStudentGoalDetails') {
      return (
        <ProctorStudentGoalDetails
          goal={selectedProctorGoal || PROCTOR_STUDENT_GOALS[0]}
          onGoBack={() => setCurrentScreen('proctorGoalsOverview')}
          onNavigate={(screen) => handleNavigate(screen)}
          onSelectStudent={(student) => {
            setSelectedProctorStudent(student);
            setCurrentScreen('proctorStudentDetails');
          }}
          onViewAchievements={(student) => {
            setSelectedProctorStudent(student);
            setCurrentScreen('proctorStudentAchievements');
          }}
        />
      );
    }

    if (currentScreen === 'proctorPerformance') {
      return (
        <ProctorPerformance
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
          onSelectStudent={(student) => {
            setSelectedProctorStudent(student);
            setCurrentScreen('proctorStudentDetails');
          }}
        />
      );
    }

    if (currentScreen === 'proctorLeaderboard') {
      return (
        <ProctorLeaderboard
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
          onSelectStudent={(student) => {
            setSelectedProctorStudent(student);
            setCurrentScreen('proctorStudentDetails');
          }}
        />
      );
    }

    if (currentScreen === 'proctorReports') {
      return (
        <ProctorReports
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'proctorNotifications') {
      return (
        <ProctorNotifications
          onGoBack={() => setCurrentScreen('facultyDashboard')}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'acDashboard') {
      return (
        <ACDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onSelectGroup={(group) => {
            setSelectedACEventGroupId(group.id);
            setCurrentScreen('acGroupReview');
          }}
          facultyUser={facultyUser}
          unreadNotificationCount={unreadNotificationCount}
        />
      );
    }

    if (currentScreen === 'acVerificationQueue') {
      return (
        <ACVerificationQueue
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          initialTab={acQueueTab}
          filterStatus={acFilterStatus}
          onSelectGroup={(group) => {
            setSelectedACEventGroupId(group.id);
            setCurrentScreen('acGroupReview');
          }}
          onSelectSubmission={(submission) => {
            setSelectedACSubmission(submission);
            setCurrentScreen('acIndividualReview');
          }}
        />
      );
    }

    if (currentScreen === 'acCreditRecords') {
      return (
        <ACCreditRecords
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onSelectRecord={(rec) => {
            setSelectedCreditRecord(rec);
            setCurrentScreen('acCreditRecordReview');
          }}
        />
      );
    }

    if (currentScreen === 'acCreditRecordReview') {
      return (
        <ACCreditRecordReview
          record={selectedCreditRecord}
          onGoBack={() => setCurrentScreen('acCreditRecords')}
          onActionComplete={() => setCurrentScreen('acCreditRecords')}
        />
      );
    }

    if (currentScreen === 'acGroupReview') {
      return (
        <ACGroupReview
          groupId={selectedACEventGroupId}
          onGoBack={() => setCurrentScreen('acVerificationQueue')}
          onSelectTeam={(eventGroupId, teamGroupId) => {
            setSelectedACEventGroupId(eventGroupId);
            setSelectedACTeamGroupId(teamGroupId);
            setCurrentScreen('acTeamReview');
          }}
          onSelectSubmission={(submission) => {
            setSelectedACSubmission(submission);
            setCurrentScreen('acIndividualReview');
          }}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'acTeamReview') {
      return (
        <ACTeamReview
          teamAchievementId={activeTeamAchievementId}
          eventGroupId={selectedACEventGroupId}
          teamGroupId={selectedACTeamGroupId}
          onGoBack={() => setCurrentScreen('acGroupReview')}
          onSelectSubmission={(submission) => {
            setSelectedACSubmission(submission);
            setCurrentScreen('acIndividualReview');
          }}
        />
      );
    }

    if (currentScreen === 'acIndividualReview') {
      return (
        <ACIndividualReview
          submission={selectedACSubmission || SIH_STUDENT_SUBMISSIONS[4]}
          onGoBack={() => {
            if (selectedACTeamGroupId && selectedACSubmission?.teamGroupId) {
              setCurrentScreen('acTeamReview');
            } else if (selectedACEventGroupId) {
              setCurrentScreen('acGroupReview');
            } else {
              setCurrentScreen('acVerificationQueue');
            }
          }}
          onActionComplete={() => {
            if (selectedACTeamGroupId && selectedACSubmission?.teamGroupId) {
              setCurrentScreen('acTeamReview');
            } else if (selectedACEventGroupId) {
              setCurrentScreen('acGroupReview');
            } else {
              setCurrentScreen('acVerificationQueue');
            }
          }}
        />
      );
    }

    if (currentScreen === 'acStudentList') {
      return (
        <ACStudentList
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
          onSelectStudent={(student) => {
            setSelectedACStudent(student);
            setCurrentScreen('acStudentDetails');
          }}
        />
      );
    }

    if (currentScreen === 'acStudentDetails') {
      return (
        <ACStudentDetails
          student={selectedACStudent || AC_SCOPED_STUDENTS[0]}
          onGoBack={() => setCurrentScreen('acStudentList')}
          onSelectSubmission={(submission) => {
            setSelectedACSubmission(submission);
            setCurrentScreen('acIndividualReview');
          }}
        />
      );
    }

    if (currentScreen === 'acReports') {
      return (
        <ACReports
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen: string) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'acNotifications') {
      return (
        <ACNotifications
          onGoBack={() => setCurrentScreen('acDashboard')}
          onNavigate={(screen: string) => handleNavigate(screen)}
          onSelectGroup={(group) => {
            setSelectedACEventGroupId(group.id);
            setCurrentScreen('acGroupReview');
          }}
          onSelectSubmission={(submission) => {
            setSelectedACSubmission(submission);
            setCurrentScreen('acIndividualReview');
          }}
        />
      );
    }

    if (currentScreen === 'mentorDashboard') {
      return (
        <MentorDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onSelectProject={(project) => {
            setSelectedMentorProject(project);
            setCurrentScreen('mentorProjectDetails');
          }}
          unreadNotificationCount={unreadNotificationCount}
        />
      );
    }

    if (currentScreen === 'mentorMentees') {
      return (
        <MentorMentees
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onSelectMentee={(mentee) => {
            setSelectedMentee(mentee);
            setCurrentScreen('mentorMenteeDetails');
          }}
          initialFilter={mentorInitialFilter}
        />
      );
    }

    if (currentScreen === 'mentorMenteeDetails') {
      return (
        <MentorMenteeDetails
          mentee={selectedMentee}
          onGoBack={() => setCurrentScreen('mentorMentees')}
          onNavigate={handleNavigate}
          onSelectProject={(project) => {
            setSelectedMentorProject(project);
            setCurrentScreen('mentorProjectDetails');
          }}
        />
      );
    }

    if (currentScreen === 'mentorProjects') {
      return (
        <MentorProjects
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onSelectProject={(project) => {
            setSelectedMentorProject(project);
            setCurrentScreen('mentorProjectDetails');
          }}
        />
      );
    }

    if (currentScreen === 'mentorProjectDetails') {
      return (
        <MentorProjectDetails
          project={selectedMentorProject}
          onGoBack={() => setCurrentScreen('mentorProjects')}
          onSelectMentee={(mentee) => {
            setSelectedMentee(mentee);
            setCurrentScreen('mentorMenteeDetails');
          }}
        />
      );
    }

    if (currentScreen === 'mentorReports') {
      return (
        <MentorReports
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'mentorNotifications') {
      return (
        <MentorNotifications
          onGoBack={() => setCurrentScreen('mentorDashboard')}
          onNavigate={handleNavigate}
          onSelectProject={(project) => {
            setSelectedMentorProject(project);
            setCurrentScreen('mentorProjectDetails');
          }}
          onSelectMentee={(mentee) => {
            setSelectedMentee(mentee);
            setCurrentScreen('mentorMenteeDetails');
          }}
        />
      );
    }

    if (currentScreen === 'studentProjects') {
      return (
        <StudentProjects
          currentStudentRoll={currentStudent?.rollNumber || '23CI011'}
          onGoBack={() => setCurrentScreen('dashboard')}
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onViewProject={(id) => {
            setSelectedStudentProjectId(id);
            setCurrentScreen('studentProjectDetails');
          }}
          onCreateProject={() => setCurrentScreen('studentCreateProject')}
        />
      );
    }

    if (currentScreen === 'studentProjectDetails') {
      return (
        <StudentProjectDetails
          projectId={selectedStudentProjectId}
          currentStudentRoll={currentStudent?.rollNumber || '23CI011'}
          onGoBack={() => setCurrentScreen('studentProjects')}
          onEditProject={(id) => {
            setSelectedStudentProjectId(id);
            setCurrentScreen('studentEditProject');
          }}
        />
      );
    }

    if (currentScreen === 'studentCreateProject') {
      return (
        <StudentCreateProject
          currentStudent={currentStudent}
          onGoBack={() => setCurrentScreen('studentProjects')}
          onViewProject={(id) => {
            setSelectedStudentProjectId(id);
            setCurrentScreen('studentProjectDetails');
          }}
          onDone={() => setCurrentScreen('studentProjects')}
        />
      );
    }

    if (currentScreen === 'studentEditProject') {
      return (
        <StudentEditProject
          projectId={selectedStudentProjectId}
          currentStudentRoll={currentStudent?.rollNumber || '23CI011'}
          onGoBack={() => setCurrentScreen('studentProjectDetails')}
          onViewProject={(id) => {
            setSelectedStudentProjectId(id);
            setCurrentScreen('studentProjectDetails');
          }}
        />
      );
    }

    if (currentScreen === 'nptelCredits') {
      return (
        <NptelCreditCourseScreen
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen as any)}
          onOpenProfile={() => setCurrentScreen(profileScreen)}
          onOpenLeaderboard={() => setCurrentScreen('leaderboard')}
          userRole={(userRole === 'Head' ? 'HOD' : userRole) as any}
        />
      );
    }

    if (currentScreen === 'profile') {
      return (
        <ProfileScreen
          onGoBack={() => setCurrentScreen('dashboard')}
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen as any)}
          onLogout={() => {
            dismissAllFeedback();
            setMenuOpen(false);
            setUserRole('Student');
            setCurrentScreen('login');
          }}
          userRole={(userRole === 'Head' ? 'HOD' : userRole) as any}
        />
      );
    }

    if (currentScreen === 'pendingVerification') {
      return (
        <PendingVerification
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
          onSelectVerification={(id) => {
            setSelectedVerificationId(id);
            setCurrentScreen('verificationDetails');
          }}
        />
      );
    }

    if (currentScreen === 'verificationDetails') {
      return (
        <VerificationDetails
          itemId={selectedVerificationId}
          onGoBack={() => setCurrentScreen('pendingVerification')}
          onActionComplete={() => {
            setCurrentScreen('pendingVerification');
          }}
        />
      );
    }

    if (currentScreen === 'assignedStudents') {
      return (
        <AssignedStudents
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
          userRole={userRole as any}
        />
      );
    }

    if (currentScreen === 'verificationHistory') {
      return (
        <VerificationHistory
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
        />
      );
    }

    if (currentScreen === 'resubmissionRequired') {
      return (
        <ResubmissionRequired
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
        />
      );
    }

    if (currentScreen === 'reports') {
      return (
        <FacultyReports
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
          userRole={userRole as any}
        />
      );
    }

    if (currentScreen === 'notifications') {
      return (
        <StudentNotificationsScreen
          notifications={notifications}
          onBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onNavigateToTarget={handleNotificationNavigateToTarget}
          onNavigate={(screen) => setCurrentScreen(screen as any)}
        />
      );
    }

    // ── Team Achievement Screens ──────────────────────────────

    if (currentScreen === 'teamMemberCertificate') {
      return (
        <TeamMemberCertificateScreen
          teamAchievementId={activeTeamAchievementId}
          currentStudentId={activeMemberStudentId || currentStudentId}
          onGoBack={() => {
            setActiveMemberStudentId(null);
            setCurrentScreen('myAchievements');
          }}
          onSubmitted={() => {
            setActiveMemberStudentId(null);
            setCurrentScreen('myAchievements');
          }}
          onNavigate={(screen: string) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'teamLeaderMonitor') {
      return (
        <TeamLeaderMonitorScreen
          teamAchievementId={activeTeamAchievementId}
          onGoBack={() => setCurrentScreen('myAchievements')}
          onNavigate={(screen: string) => handleNavigate(screen)}
        />
      );
    }

    if (currentScreen === 'studentTeamAchievements') {
      return (
        <StudentTeamAchievementsScreen
          onGoBack={() => setCurrentScreen('dashboard')}
          onNavigate={(screen: string, params?: any) => handleNavigate(screen, params)}
          currentStudentId={currentStudentId}
        />
      );
    }

    if (currentScreen === 'studentTeamAchievementDetails') {
      return (
        <StudentTeamAchievementDetailsScreen
          teamAchievementId={activeTeamAchievementId}
          currentStudentId={currentStudentId}
          onGoBack={() => setCurrentScreen('studentTeamAchievements')}
          onNavigate={(screen: string, params?: any) => handleNavigate(screen, params)}
        />
      );
    }

    if (currentScreen === 'proctorTeamView') {
      return (
        <ProctorTeamView
          teamAchievementId={activeTeamAchievementId}
          onGoBack={() => setCurrentScreen('facultyDashboard')}
        />
      );
    }

    // ── HOD Workspace Screens ──────────────────────────────────

    if (currentScreen === 'hodDashboard') {
      return (
        <HODDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          unreadNotificationCount={unreadNotificationCount}
        />
      );
    }

    if (currentScreen === 'hodVerificationQueue') {
      return (
        <HODVerificationQueue
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
          initialTab={hodQueueTab}
        />
      );
    }

    if (currentScreen === 'hodFacultyReview') {
      return (
        <HODFacultyReview
          submissionId={selectedHODSubmissionId}
          onGoBack={() => setCurrentScreen('hodVerificationQueue')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodFacultyList') {
      return (
        <HODFacultyList
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
          onSelectFaculty={(faculty) => {
            setSelectedHODFacultyId(faculty.id);
            setCurrentScreen('hodFacultyDetails');
          }}
        />
      );
    }

    if (currentScreen === 'hodFacultyDetails') {
      return (
        <HODFacultyDetails
          facultyId={selectedHODFacultyId}
          onGoBack={() => {
            if (personDetailsPreviousScreen) {
              const back = personDetailsPreviousScreen as any;
              setPersonDetailsPreviousScreen(null);
              setCurrentScreen(back);
            } else {
              setCurrentScreen('hodFacultyList');
            }
          }}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodStudentList') {
      return (
        <HODStudentList
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
          onSelectStudent={(student) => {
            setSelectedHODStudentId(student.id);
            setCurrentScreen('hodStudentDetails');
          }}
        />
      );
    }

    if (currentScreen === 'hodStudentDetails') {
      return (
        <HODStudentDetails
          studentId={selectedHODStudentId}
          onGoBack={() => {
            if (personDetailsPreviousScreen) {
              const back = personDetailsPreviousScreen as any;
              setPersonDetailsPreviousScreen(null);
              setCurrentScreen(back);
            } else {
              setCurrentScreen('hodStudentList');
            }
          }}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodDepartmentPerformance') {
      return (
        <HODDepartmentPerformance
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodReports') {
      return (
        <HODReports
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodNotifications') {
      return (
        <HODNotifications
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodAssignments') {
      return (
        <HODAssignments
          onGoBack={() => setCurrentScreen('hodDashboard')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodProctorAssignments') {
      return (
        <HODProctorAssignments
          onGoBack={() => setCurrentScreen('hodAssignments')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'hodMentorAssignments') {
      return (
        <HODMentorAssignments
          onGoBack={() => setCurrentScreen('hodAssignments')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headDashboard') {
      return (
        <HeadDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          unreadNotificationCount={unreadNotificationCount}
        />
      );
    }

    if (currentScreen === 'headCollegeAchievements') {
      return (
        <HeadCollegeAchievements
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headPointsManagement') {
      return (
        <HeadPointsManagement
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headCategoryManagement') {
      return (
        <HeadCategoryManagement
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headAnalytics') {
      return (
        <HeadAnalytics
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headReports') {
      return (
        <HeadReports
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headNAACReport') {
      return (
        <HeadNAACReport
          onGoBack={() => handleNavigate('headReports')}
          onNavigate={handleNavigate}
          onViewRecords={(records, title, context) => {
            setHeadReportRecordsContext({
              records,
              reportTitle: title || 'NAAC Achievement Records',
              contextText: context || 'NAAC Report Scope',
              sourceScreen: 'headNAACReport',
            });
            setCurrentScreen('headReportRecords');
          }}
        />
      );
    }

    if (currentScreen === 'headNBAReport') {
      return (
        <HeadNBAReport
          onGoBack={() => handleNavigate('headReports')}
          onNavigate={handleNavigate}
          onViewRecords={(records, title, context) => {
            setHeadReportRecordsContext({
              records,
              reportTitle: title || 'NBA Achievement Records',
              contextText: context || 'NBA Report Scope',
              sourceScreen: 'headNBAReport',
            });
            setCurrentScreen('headReportRecords');
          }}
        />
      );
    }

    if (currentScreen === 'headAnnualReport') {
      return (
        <HeadAnnualReport
          onGoBack={() => handleNavigate('headReports')}
          onNavigate={handleNavigate}
          onViewRecords={(records, title, context) => {
            setHeadReportRecordsContext({
              records,
              reportTitle: title || 'Annual Achievement Records',
              contextText: context || 'Annual Report Scope',
              sourceScreen: 'headAnnualReport',
            });
            setCurrentScreen('headReportRecords');
          }}
        />
      );
    }

    if (currentScreen === 'headDepartmentReport') {
      return (
        <HeadDepartmentReport
          onGoBack={() => handleNavigate('headReports')}
          onNavigate={handleNavigate}
          onViewRecords={(records, title, context) => {
            setHeadReportRecordsContext({
              records,
              reportTitle: title || 'Department Achievement Records',
              contextText: context || 'Department Report Scope',
              sourceScreen: 'headDepartmentReport',
            });
            setCurrentScreen('headReportRecords');
          }}
        />
      );
    }

    if (currentScreen === 'headCategoryReport') {
      return (
        <HeadCategoryReport
          onGoBack={() => handleNavigate('headReports')}
          onNavigate={handleNavigate}
          onViewRecords={(records, title, context) => {
            setHeadReportRecordsContext({
              records,
              reportTitle: title || 'Category Achievement Records',
              contextText: context || 'Category Report Scope',
              sourceScreen: 'headCategoryReport',
            });
            setCurrentScreen('headReportRecords');
          }}
        />
      );
    }

    if (currentScreen === 'headCustomReport') {
      return (
        <HeadCustomReport
          onGoBack={() => handleNavigate('headReports')}
          onNavigate={handleNavigate}
          onViewRecords={(records, title, context) => {
            setHeadReportRecordsContext({
              records,
              reportTitle: title || 'Custom Report Records',
              contextText: context || 'Custom Scope',
              sourceScreen: 'headCustomReport',
            });
            setCurrentScreen('headReportRecords');
          }}
        />
      );
    }

    if (currentScreen === 'headReportRecords') {
      return (
        <HeadReportRecords
          reportTitle={headReportRecordsContext?.reportTitle || 'Achievement Records'}
          contextText={headReportRecordsContext?.contextText || ''}
          records={headReportRecordsContext?.records || []}
          onGoBack={() => setCurrentScreen(headReportRecordsContext?.sourceScreen || 'headReports')}
        />
      );
    }

    if (currentScreen === 'headDepartments') {
      return (
        <HeadDepartments
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headDepartmentDetails') {
      return (
        <HeadDepartmentDetails
          departmentId={selectedHeadDeptId}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'headNotifications') {
      return (
        <HeadNotifications
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'deanDashboard') {
      return (
        <DeanDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          unreadNotificationCount={unreadNotificationCount}
        />
      );
    }

    if (currentScreen === 'deanVerificationQueue') {
      return (
        <DeanVerificationQueue
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          initialStatusFilter={deanInitialStatusFilter}
          initialDepartmentFilter={deanInitialDeptFilter}
        />
      );
    }

    if (currentScreen === 'deanHODReview') {
      return (
        <DeanHODReview
          submissionId={selectedDeanSubmissionId}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('deanVerificationQueue')}
        />
      );
    }

    if (currentScreen === 'deanVerificationHistory') {
      return (
        <DeanVerificationHistory
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'deanNotifications') {
      return (
        <DeanNotifications
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    // ── Principal Workspace Screens ────────────────────────────

    if (currentScreen === 'principalDashboard') {
      return (
        <PrincipalDashboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          unreadNotificationCount={unreadNotificationCount}
        />
      );
    }

    if (currentScreen === 'principalVerificationQueue') {
      return (
        <PrincipalVerificationQueue
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentScreen === 'principalDeanReview') {
      return (
        <PrincipalDeanReview
          submissionId={selectedPrincipalSubmissionId}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalVerificationQueue')}
        />
      );
    }

    if (currentScreen === 'principalVerificationHistory') {
      return (
        <PrincipalVerificationHistory
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalDeanAssignments') {
      return (
        <PrincipalDeanAssignments
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalDepartments') {
      return (
        <PrincipalDepartments
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalDepartmentDetails') {
      return (
        <PrincipalDepartmentDetails
          departmentId={selectedPrincipalDeptId}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDepartments')}
        />
      );
    }

    if (currentScreen === 'principalPerformance') {
      return (
        <PrincipalPerformance
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalLeaderboard') {
      return (
        <PrincipalLeaderboard
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalReports') {
      return (
        <PrincipalReports
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalAchievementPolicy') {
      return (
        <PrincipalAchievementPolicy
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalInstitutionStructure') {
      return (
        <PrincipalInstitutionStructure
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    if (currentScreen === 'principalNotifications') {
      return (
        <PrincipalNotifications
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={handleNavigate}
          onGoBack={() => setCurrentScreen('principalDashboard')}
        />
      );
    }

    // ── Shared College Overview Drill-Down Screens ─────────────

    if (currentScreen === 'collegeStudentAchievements') {
      return (
        <CollegeAchievementOverview
          targetType="student"
          viewerRole={drilldownOriginRole}
          onGoBack={() =>
            setCurrentScreen(drilldownOriginRole === 'principal' ? 'principalDashboard' : 'headDashboard')
          }
          onSelectDepartment={(dept) => {
            setDrilldownDeptCode(dept.code);
            setDrilldownDeptName(dept.name);
            setCurrentScreen('departmentStudentAchievements');
          }}
        />
      );
    }

    if (currentScreen === 'collegeFacultyAchievements') {
      return (
        <CollegeAchievementOverview
          targetType="faculty"
          viewerRole={drilldownOriginRole}
          onGoBack={() =>
            setCurrentScreen(drilldownOriginRole === 'principal' ? 'principalDashboard' : 'headDashboard')
          }
          onSelectDepartment={(dept) => {
            setDrilldownDeptCode(dept.code);
            setDrilldownDeptName(dept.name);
            setCurrentScreen('departmentFacultyAchievements');
          }}
        />
      );
    }

    if (currentScreen === 'departmentStudentAchievements') {
      return (
        <DepartmentAchievementList
          departmentCode={drilldownDeptCode}
          departmentName={drilldownDeptName}
          targetType="student"
          viewerRole={drilldownOriginRole}
          onGoBack={() => setCurrentScreen('collegeStudentAchievements')}
          onSelectPerson={(person: CollegePersonSummary) => {
            setSelectedHODStudentId(person.id);
            setPersonDetailsPreviousScreen('departmentStudentAchievements');
            setCurrentScreen('hodStudentDetails');
          }}
        />
      );
    }

    if (currentScreen === 'departmentFacultyAchievements') {
      return (
        <DepartmentAchievementList
          departmentCode={drilldownDeptCode}
          departmentName={drilldownDeptName}
          targetType="faculty"
          viewerRole={drilldownOriginRole}
          onGoBack={() => setCurrentScreen('collegeFacultyAchievements')}
          onSelectPerson={(person: CollegePersonSummary) => {
            setSelectedHODFacultyId(person.id);
            setPersonDetailsPreviousScreen('departmentFacultyAchievements');
            setCurrentScreen('hodFacultyDetails');
          }}
        />
      );
    }

    if (isPlaceholderScreen(currentScreen)) {
      return (
        <PlaceholderScreen
          title={getPlaceholderTitle(currentScreen)}
          onGoBack={() => setCurrentScreen(homeScreen)}
          onOpenMenu={() => setMenuOpen(true)}
        />
      );
    }

    return (
      <DashboardScreen
        onOpenSubmitAchievement={() => setCurrentScreen('submitAchievement')}
        onOpenLeaderboard={() => setCurrentScreen('leaderboard')}
        onOpenGoals={() => setCurrentScreen('goals')}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenProfile={() => setCurrentScreen('profile')}
        onOpenMyAchievements={() => setCurrentScreen('myAchievements')}
        onOpenTeamAchievements={() => handleNavigate('studentTeamAchievements')}
        onOpenProjects={() => setCurrentScreen('studentProjects')}
        userRole={(userRole === 'Principal' ? 'HOD' : userRole === 'Head' ? 'HOD' : userRole === 'Dean' ? 'HOD' : userRole) as any}
        onNavigate={(screen, params) => handleNavigate(screen, params)}
        onSelectVerification={(id) => {
          setSelectedVerificationId(id);
          setCurrentScreen('verificationDetails');
        }}
        unreadNotificationCount={unreadNotificationCount}
        currentStudentId={currentStudentId}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <AchieveXFeedbackProvider>
        {renderScreen()}
        <SideMenu
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          userRole={userRole}
          activeWorkspace={activeFacultyWorkspace}
          onSwitchRole={(role) => {
            setUserRole(role);
            if (role === 'Principal') {
              setActiveFacultyWorkspace('principal');
              setCurrentScreen('principalDashboard');
            } else if (role === 'Dean') {
              setActiveFacultyWorkspace('dean');
              setCurrentScreen('deanDashboard');
            } else if (role === 'Head') {
              setActiveFacultyWorkspace('head');
              setCurrentScreen('headDashboard');
            } else if (role === 'HOD') {
              setActiveFacultyWorkspace('hod');
              setCurrentScreen('hodDashboard');
            } else if (role === 'Academic Coordinator') {
              setActiveFacultyWorkspace('academic_coordinator');
              setCurrentScreen('acDashboard');
            } else if (role === 'Proctor') {
              setActiveFacultyWorkspace('proctor');
              setCurrentScreen('facultyDashboard');
            } else if (role === 'Student') {
              setCurrentScreen('dashboard');
            } else {
              setCurrentScreen('facultyDashboard');
            }
          }}
          currentStudent={currentStudent}
          onSelectStudent={(s) => {
            setCurrentStudent(s);
            setUserRole('Student');
            setCurrentScreen('dashboard');
          }}
          unreadNotificationCount={unreadNotificationCount}
          onLogout={() => {
            dismissAllFeedback();
            setMenuOpen(false);
            setUserRole('Student');
            setCurrentScreen('login');
          }}
        />
      </AchieveXFeedbackProvider>
    </SafeAreaProvider>
  );
}


