// ─────────────────────────────────────────────────────────────
// AchieveX — Student & Faculty Side Menu Drawer
// Clean SaaS Drawer with 5 organized sections, unread badge, and profile footer
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LOGGED_IN_STUDENT, STUDENT_DATABASE, type StudentRecord } from '../data/achievementConfig';
import { FACULTY_PROFILES } from '../data/facultyMockData';
import { type FacultyWorkspaceId } from '../data/facultyWorkspaceData';
import SwitchWorkspaceModal, { WorkspaceOption } from './feedback/SwitchWorkspaceModal';
import { showAchieveXDialog } from './feedback/AchieveXFeedback';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.84, 340);

interface MenuItemProps {
  label: string;
  iconName: keyof typeof Ionicons.name | string;
  isActive: boolean;
  onPress: () => void;
  badgeCount?: number;
}

function MenuItem({ label, iconName, isActive, onPress, badgeCount }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <Ionicons
          name={iconName as any}
          size={20}
          color={isActive ? '#2563EB' : '#64748B'}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
          {label}
        </Text>
      </View>
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionItems}>{children}</View>
    </View>
  );
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  currentScreen: string;
  onNavigate: (screen: string, params?: any) => void;
  userRole: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean';
  activeWorkspace?: FacultyWorkspaceId;
  onSwitchRole: (role: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean') => void;
  currentStudent?: StudentRecord;
  onSelectStudent?: (student: StudentRecord) => void;
  unreadNotificationCount?: number;
  onLogout?: () => void;
}

export default function SideMenu({
  visible,
  onClose,
  currentScreen,
  onNavigate,
  userRole = 'Student',
  activeWorkspace = 'faculty',
  onSwitchRole,
  currentStudent,
  onSelectStudent,
  unreadNotificationCount = 3,
  onLogout,
}: SideMenuProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleNavigation = (screen: string, params?: any) => {
    handleClose();
    setTimeout(() => {
      onNavigate(screen, params);
    }, 150);
  };

  const handleOpenSwitchModal = () => {
    setShowSwitchModal(true);
  };

  const handleSelectWorkspaceOption = (option: WorkspaceOption) => {
    setShowSwitchModal(false);
    handleClose();
    setTimeout(() => {
      if (option.role === 'Student' && onSelectStudent && currentStudent) {
        const s = STUDENT_DATABASE.find((item) => item.rollNumber === '23CI011') || LOGGED_IN_STUDENT;
        onSelectStudent(s as any);
      }
      onSwitchRole(option.role);
    }, 120);
  };

  const handleLogoutFromDrawer = () => {
    handleClose();
    setTimeout(() => {
      showAchieveXDialog({
        type: 'confirmation',
        title: 'Log Out?',
        message: "You'll need to sign in again.",
        secondaryAction: {
          label: 'Cancel',
        },
        primaryAction: {
          label: 'Log Out',
          destructive: true,
          onPress: () => {
            onLogout?.();
          },
        },
      });
    }, 220);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isStudent = userRole === 'Student';
  const isPrincipalWs = !isStudent && (userRole === 'Principal' || activeWorkspace === 'principal');
  const isDeanWs = !isStudent && !isPrincipalWs && (userRole === 'Dean' || activeWorkspace === 'dean');
  const isHeadWs = !isStudent && !isPrincipalWs && !isDeanWs && (userRole === 'Head' || activeWorkspace === 'head');
  const isHODWs = !isStudent && !isPrincipalWs && !isDeanWs && !isHeadWs && (userRole === 'HOD' || activeWorkspace === 'hod');
  const isACWs = !isStudent && !isPrincipalWs && !isDeanWs && !isHeadWs && !isHODWs && activeWorkspace === 'academic_coordinator';
  const isMentorWs = !isStudent && !isPrincipalWs && !isDeanWs && !isHeadWs && !isHODWs && activeWorkspace === 'mentor';
  const isProctorWs = !isStudent && !isPrincipalWs && !isDeanWs && !isHeadWs && !isHODWs && activeWorkspace === 'proctor';
  const isFacultyWs = !isStudent && !isPrincipalWs && !isDeanWs && !isHeadWs && !isHODWs && activeWorkspace === 'faculty';

  const profileName = isStudent
    ? (currentStudent?.name || LOGGED_IN_STUDENT.name)
    : isPrincipalWs
    ? 'Dr. S. Arumugam'
    : isDeanWs
    ? 'Dr. Kumar V'
    : isHeadWs
    ? 'Dr. S. Ramesh'
    : isHODWs
    ? 'Dr. Arun Kumar'
    : 'Gokulraj V';
  const profileSubtitle = isStudent
    ? `${currentStudent?.department || LOGGED_IN_STUDENT.department} • ${currentStudent?.rollNumber || LOGGED_IN_STUDENT.rollNumber}`
    : isPrincipalWs
    ? 'Principal • Nandha Engineering College'
    : isDeanWs
    ? 'Dean • Nandha Engineering College'
    : isHeadWs
    ? 'Head • Nandha Engg College'
    : isHODWs
    ? 'Head of Department • CSE (IoT)'
    : isACWs
    ? 'Academic Coordinator • CSE (IoT)'
    : isMentorWs
    ? 'Assistant Professor • CSE (IoT)'
    : isProctorWs
    ? 'Proctor Workspace • CSE (IoT)'
    : 'Associate Professor • CSE';

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
        onTouchStart={handleClose}
      />

      <Animated.View
        style={[
          styles.drawerContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left']}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Image
                source={require('../../assets/AchieveX logo (2).png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandTitle}>AchieveX</Text>
                <Text style={styles.brandSubtitle}>
                  {isStudent
                    ? 'Student Workspace'
                    : isPrincipalWs
                    ? 'Principal Workspace'
                    : isDeanWs
                    ? 'Dean Workspace'
                    : isHeadWs
                    ? 'Head Workspace'
                    : isHODWs
                    ? 'HOD Workspace'
                    : isACWs
                    ? 'Academic Coordinator'
                    : isMentorWs
                    ? 'Mentor Workspace'
                    : isProctorWs
                    ? 'Proctor Workspace'
                    : 'Faculty Workspace'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.6}
              onPress={handleClose}
            >
              <Ionicons name="close-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ════════════════════════════════════════════════
                PRINCIPAL WORKSPACE SECTIONS (INSTITUTIONAL)
            ════════════════════════════════════════════════ */}
            {isPrincipalWs && (
              <>
                <MenuSection title="OVERVIEW">
                  <MenuItem
                    label="Dashboard"
                    iconName={currentScreen === 'principalDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'principalDashboard'}
                    onPress={() => handleNavigation('principalDashboard')}
                  />
                  <MenuItem
                    label="Dean Approvals"
                    iconName={
                      currentScreen === 'principalVerificationQueue' ||
                      currentScreen === 'principalDeanReview'
                        ? 'checkbox'
                        : 'checkbox-outline'
                    }
                    isActive={
                      currentScreen === 'principalVerificationQueue' ||
                      currentScreen === 'principalDeanReview'
                    }
                    onPress={() => handleNavigation('principalVerificationQueue')}
                  />
                  <MenuItem
                    label="Verification History"
                    iconName={
                      currentScreen === 'principalVerificationHistory'
                        ? 'time'
                        : 'time-outline'
                    }
                    isActive={currentScreen === 'principalVerificationHistory'}
                    onPress={() => handleNavigation('principalVerificationHistory')}
                  />
                </MenuSection>

                <MenuSection title="INSTITUTION">
                  <MenuItem
                    label="Departments"
                    iconName={
                      currentScreen === 'principalDepartments' ||
                      currentScreen === 'principalDepartmentDetails'
                        ? 'business'
                        : 'business-outline'
                    }
                    isActive={
                      currentScreen === 'principalDepartments' ||
                      currentScreen === 'principalDepartmentDetails'
                    }
                    onPress={() => handleNavigation('principalDepartments')}
                  />
                  <MenuItem
                    label="Dean Responsibilities"
                    iconName={
                      currentScreen === 'principalDeanAssignments'
                        ? 'people'
                        : 'people-outline'
                    }
                    isActive={currentScreen === 'principalDeanAssignments'}
                    onPress={() => handleNavigation('principalDeanAssignments')}
                  />
                  <MenuItem
                    label="Institution Structure"
                    iconName={
                      currentScreen === 'principalInstitutionStructure'
                        ? 'git-network'
                        : 'git-network-outline'
                    }
                    isActive={currentScreen === 'principalInstitutionStructure'}
                    onPress={() => handleNavigation('principalInstitutionStructure')}
                  />
                </MenuSection>

                <MenuSection title="GOVERNANCE & AUDIT">
                  <MenuItem
                    label="Executive Analytics"
                    iconName={
                      currentScreen === 'principalPerformance'
                        ? 'bar-chart'
                        : 'bar-chart-outline'
                    }
                    isActive={currentScreen === 'principalPerformance'}
                    onPress={() => handleNavigation('principalPerformance')}
                  />
                  <MenuItem
                    label="Institutional Rankings"
                    iconName={
                      currentScreen === 'principalLeaderboard'
                        ? 'trophy'
                        : 'trophy-outline'
                    }
                    isActive={currentScreen === 'principalLeaderboard'}
                    onPress={() => handleNavigation('principalLeaderboard')}
                  />
                  <MenuItem
                    label="Accreditation Reports"
                    iconName={
                      currentScreen === 'principalReports'
                        ? 'document-text'
                        : 'document-text-outline'
                    }
                    isActive={currentScreen === 'principalReports'}
                    onPress={() => handleNavigation('principalReports')}
                  />
                  <MenuItem
                    label="Scoring Policy"
                    iconName={
                      currentScreen === 'principalAchievementPolicy'
                        ? 'shield-checkmark'
                        : 'shield-checkmark-outline'
                    }
                    isActive={currentScreen === 'principalAchievementPolicy'}
                    onPress={() => handleNavigation('principalAchievementPolicy')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Alerts"
                    iconName={
                      currentScreen === 'principalNotifications'
                        ? 'notifications'
                        : 'notifications-outline'
                    }
                    isActive={currentScreen === 'principalNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('principalNotifications')}
                  />
                  <MenuItem
                    label="Profile"
                    iconName={
                      currentScreen === 'facultyProfile' ? 'person' : 'person-outline'
                    }
                    isActive={currentScreen === 'facultyProfile'}
                    onPress={() => handleNavigation('facultyProfile')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                DEAN WORKSPACE SECTIONS (VERIFICATION)
            ════════════════════════════════════════════════ */}
            {isDeanWs && (
              <>
                <MenuSection title="OVERVIEW">
                  <MenuItem
                    label="Dashboard"
                    iconName={currentScreen === 'deanDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'deanDashboard'}
                    onPress={() => handleNavigation('deanDashboard')}
                  />
                </MenuSection>

                <MenuSection title="VERIFICATION">
                  <MenuItem
                    label="HOD Reviews"
                    iconName={currentScreen === 'deanVerificationQueue' ? 'checkbox' : 'checkbox-outline'}
                    isActive={currentScreen === 'deanVerificationQueue'}
                    onPress={() => handleNavigation('deanVerificationQueue')}
                  />
                  <MenuItem
                    label="Verification History"
                    iconName={currentScreen === 'deanVerificationHistory' ? 'time' : 'time-outline'}
                    isActive={currentScreen === 'deanVerificationHistory'}
                    onPress={() => handleNavigation('deanVerificationHistory')}
                  />
                </MenuSection>

                <MenuSection title="MY ACTIVITY">
                  <MenuItem
                    label="My Achievements"
                    iconName={currentScreen === 'myAchievements' ? 'trophy' : 'trophy-outline'}
                    isActive={currentScreen === 'myAchievements'}
                    onPress={() => handleNavigation('myAchievements')}
                  />
                  <MenuItem
                    label="Submit Achievement"
                    iconName={currentScreen === 'submitAchievement' ? 'add-circle' : 'add-circle-outline'}
                    isActive={currentScreen === 'submitAchievement'}
                    onPress={() => handleNavigation('submitAchievement')}
                  />
                  <MenuItem
                    label="Goals"
                    iconName={currentScreen === 'goals' ? 'compass' : 'compass-outline'}
                    isActive={currentScreen === 'goals'}
                    onPress={() => handleNavigation('goals')}
                  />
                  <MenuItem
                    label="Leaderboard"
                    iconName={currentScreen === 'leaderboard' ? 'bar-chart' : 'bar-chart-outline'}
                    isActive={currentScreen === 'leaderboard'}
                    onPress={() => handleNavigation('leaderboard')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Notifications"
                    iconName={currentScreen === 'deanNotifications' ? 'notifications' : 'notifications-outline'}
                    isActive={currentScreen === 'deanNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('deanNotifications')}
                  />
                  <MenuItem
                    label="Profile"
                    iconName={currentScreen === 'facultyProfile' ? 'person' : 'person-outline'}
                    isActive={currentScreen === 'facultyProfile'}
                    onPress={() => handleNavigation('facultyProfile')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                00. HEAD WORKSPACE SECTIONS (GOVERNANCE)
            ════════════════════════════════════════════════ */}
            {isHeadWs && (
              <>
                <MenuSection title="OVERVIEW">
                  <MenuItem
                    label="Dashboard"
                    iconName={currentScreen === 'headDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'headDashboard'}
                    onPress={() => handleNavigation('headDashboard')}
                  />
                </MenuSection>

                <MenuSection title="COLLEGE">
                  <MenuItem
                    label="Achievements Explorer"
                    iconName={currentScreen === 'headCollegeAchievements' ? 'trophy' : 'trophy-outline'}
                    isActive={currentScreen === 'headCollegeAchievements'}
                    onPress={() => handleNavigation('headCollegeAchievements')}
                  />
                  <MenuItem
                    label="Departments"
                    iconName={
                      currentScreen === 'headDepartments' || currentScreen === 'headDepartmentDetails'
                        ? 'business'
                        : 'business-outline'
                    }
                    isActive={
                      currentScreen === 'headDepartments' || currentScreen === 'headDepartmentDetails'
                    }
                    onPress={() => handleNavigation('headDepartments')}
                  />
                  <MenuItem
                    label="Analytics & Leaderboards"
                    iconName={currentScreen === 'headAnalytics' ? 'bar-chart' : 'bar-chart-outline'}
                    isActive={currentScreen === 'headAnalytics'}
                    onPress={() => handleNavigation('headAnalytics')}
                  />
                </MenuSection>

                <MenuSection title="CONFIGURATION">
                  <MenuItem
                    label="Points & Scoring Rules"
                    iconName={currentScreen === 'headPointsManagement' ? 'calculator' : 'calculator-outline'}
                    isActive={currentScreen === 'headPointsManagement'}
                    onPress={() => handleNavigation('headPointsManagement')}
                  />
                  <MenuItem
                    label="Achievement Categories"
                    iconName={currentScreen === 'headCategoryManagement' ? 'layers' : 'layers-outline'}
                    isActive={currentScreen === 'headCategoryManagement'}
                    onPress={() => handleNavigation('headCategoryManagement')}
                  />
                </MenuSection>

                <MenuSection title="REPORTS">
                  <MenuItem
                    label="Executive Reports"
                    iconName={currentScreen === 'headReports' ? 'document-text' : 'document-text-outline'}
                    isActive={currentScreen === 'headReports'}
                    onPress={() => handleNavigation('headReports')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Notifications"
                    iconName={currentScreen === 'headNotifications' ? 'notifications' : 'notifications-outline'}
                    isActive={currentScreen === 'headNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('headNotifications')}
                  />
                  <MenuItem
                    label="Profile"
                    iconName={currentScreen === 'facultyProfile' ? 'person' : 'person-outline'}
                    isActive={currentScreen === 'facultyProfile'}
                    onPress={() => handleNavigation('facultyProfile')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                0. HOD WORKSPACE SECTIONS
            ════════════════════════════════════════════════ */}
            {isHODWs && (
              <>
                <MenuSection title="OVERVIEW">
                  <MenuItem
                    label="Dashboard"
                    iconName={currentScreen === 'hodDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'hodDashboard'}
                    onPress={() => handleNavigation('hodDashboard')}
                  />
                </MenuSection>

                <MenuSection title="MY ACTIVITY">
                  <MenuItem
                    label="My Achievements"
                    iconName={currentScreen === 'myAchievements' ? 'trophy' : 'trophy-outline'}
                    isActive={currentScreen === 'myAchievements'}
                    onPress={() => handleNavigation('myAchievements')}
                  />
                  <MenuItem
                    label="Submit Achievement"
                    iconName={currentScreen === 'submitAchievement' ? 'add-circle' : 'add-circle-outline'}
                    isActive={currentScreen === 'submitAchievement'}
                    onPress={() => handleNavigation('submitAchievement')}
                  />
                  <MenuItem
                    label="Goals"
                    iconName={currentScreen === 'goals' ? 'compass' : 'compass-outline'}
                    isActive={currentScreen === 'goals'}
                    onPress={() => handleNavigation('goals')}
                  />
                  <MenuItem
                    label="Leaderboard"
                    iconName={currentScreen === 'leaderboard' ? 'bar-chart' : 'bar-chart-outline'}
                    isActive={currentScreen === 'leaderboard'}
                    onPress={() => handleNavigation('leaderboard')}
                  />
                </MenuSection>

                <MenuSection title="DEPARTMENT">
                  <MenuItem
                    label="Faculty"
                    iconName={
                      currentScreen === 'hodFacultyList' || currentScreen === 'hodFacultyDetails'
                        ? 'briefcase'
                        : 'briefcase-outline'
                    }
                    isActive={
                      currentScreen === 'hodFacultyList' || currentScreen === 'hodFacultyDetails'
                    }
                    onPress={() => handleNavigation('hodFacultyList')}
                  />
                  <MenuItem
                    label="Students"
                    iconName={
                      currentScreen === 'hodStudentList' || currentScreen === 'hodStudentDetails'
                        ? 'people'
                        : 'people-outline'
                    }
                    isActive={
                      currentScreen === 'hodStudentList' || currentScreen === 'hodStudentDetails'
                    }
                    onPress={() => handleNavigation('hodStudentList')}
                  />
                  <MenuItem
                    label="Faculty Assignments"
                    iconName={
                      currentScreen === 'hodAssignments' ||
                      currentScreen === 'hodProctorAssignments' ||
                      currentScreen === 'hodMentorAssignments'
                        ? 'git-network'
                        : 'git-network-outline'
                    }
                    isActive={
                      currentScreen === 'hodAssignments' ||
                      currentScreen === 'hodProctorAssignments' ||
                      currentScreen === 'hodMentorAssignments'
                    }
                    onPress={() => handleNavigation('hodAssignments')}
                  />
                  <MenuItem
                    label="Faculty Verification"
                    iconName={
                      currentScreen === 'hodVerificationQueue' || currentScreen === 'hodFacultyReview'
                        ? 'shield-checkmark'
                        : 'shield-checkmark-outline'
                    }
                    isActive={
                      currentScreen === 'hodVerificationQueue' || currentScreen === 'hodFacultyReview'
                    }
                    badgeCount={8}
                    onPress={() => handleNavigation('hodVerificationQueue')}
                  />
                  <MenuItem
                    label="Department Performance"
                    iconName={
                      currentScreen === 'hodDepartmentPerformance' ? 'pie-chart' : 'pie-chart-outline'
                    }
                    isActive={currentScreen === 'hodDepartmentPerformance'}
                    onPress={() => handleNavigation('hodDepartmentPerformance')}
                  />
                </MenuSection>

                <MenuSection title="REPORTS">
                  <MenuItem
                    label="Reports"
                    iconName={currentScreen === 'hodReports' ? 'document-text' : 'document-text-outline'}
                    isActive={currentScreen === 'hodReports'}
                    onPress={() => handleNavigation('hodReports')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Notifications"
                    iconName={currentScreen === 'hodNotifications' ? 'notifications' : 'notifications-outline'}
                    isActive={currentScreen === 'hodNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('hodNotifications')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                1. ACADEMIC COORDINATOR (AC) WORKSPACE SECTIONS
            ════════════════════════════════════════════════ */}
            {isACWs && (
              <>
                <MenuSection title="OVERVIEW">
                  <MenuItem
                    label="Dashboard"
                    iconName={
                      currentScreen === 'acDashboard' || currentScreen === 'facultyDashboard'
                        ? 'grid'
                        : 'grid-outline'
                    }
                    isActive={
                      currentScreen === 'acDashboard' || currentScreen === 'facultyDashboard'
                    }
                    onPress={() => handleNavigation('acDashboard')}
                  />
                </MenuSection>

                <MenuSection title="VERIFICATION">
                  <MenuItem
                    label="Submissions"
                    iconName={
                      currentScreen === 'acVerificationQueue' ||
                      currentScreen === 'acGroupReview' ||
                      currentScreen === 'acTeamReview' ||
                      currentScreen === 'acIndividualReview'
                        ? 'file-tray-full'
                        : 'file-tray-full-outline'
                    }
                    isActive={
                      currentScreen === 'acVerificationQueue' ||
                      currentScreen === 'acGroupReview' ||
                      currentScreen === 'acTeamReview' ||
                      currentScreen === 'acIndividualReview'
                    }
                    badgeCount={38}
                    onPress={() => handleNavigation('acVerificationQueue')}
                  />
                  <MenuItem
                    label="Credit Records"
                    iconName={
                      currentScreen === 'acCreditRecords' ||
                      currentScreen === 'acCreditRecordReview'
                        ? 'school'
                        : 'school-outline'
                    }
                    isActive={
                      currentScreen === 'acCreditRecords' ||
                      currentScreen === 'acCreditRecordReview'
                    }
                    badgeCount={8}
                    onPress={() => handleNavigation('acCreditRecords')}
                  />
                  <MenuItem
                    label="Verification History"
                    iconName="receipt-outline"
                    isActive={false}
                    onPress={() => handleNavigation('acVerificationQueue')}
                  />
                </MenuSection>

                <MenuSection title="STUDENTS">
                  <MenuItem
                    label="Students"
                    iconName={
                      currentScreen === 'acStudentList' || currentScreen === 'acStudentDetails'
                        ? 'people'
                        : 'people-outline'
                    }
                    isActive={
                      currentScreen === 'acStudentList' || currentScreen === 'acStudentDetails'
                    }
                    onPress={() => handleNavigation('acStudentList')}
                  />
                </MenuSection>

                <MenuSection title="REPORTS">
                  <MenuItem
                    label="Reports"
                    iconName={currentScreen === 'acReports' ? 'document-text' : 'document-text-outline'}
                    isActive={currentScreen === 'acReports'}
                    onPress={() => handleNavigation('acReports')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Notifications"
                    iconName={
                      currentScreen === 'acNotifications'
                        ? 'notifications'
                        : 'notifications-outline'
                    }
                    isActive={currentScreen === 'acNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('acNotifications')}
                  />
                  <MenuItem
                    label="Profile"
                    iconName={currentScreen === 'facultyProfile' ? 'person' : 'person-outline'}
                    isActive={currentScreen === 'facultyProfile'}
                    onPress={() => handleNavigation('facultyProfile')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                0.5 MENTOR WORKSPACE SECTIONS
            ════════════════════════════════════════════════ */}
            {isMentorWs && (
              <>
                <MenuSection title="OVERVIEW">
                  <MenuItem
                    label="Dashboard"
                    iconName={currentScreen === 'mentorDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'mentorDashboard'}
                    onPress={() => handleNavigation('mentorDashboard')}
                  />
                </MenuSection>

                <MenuSection title="MENTEES">
                  <MenuItem
                    label="My Mentees"
                    iconName={
                      currentScreen === 'mentorMentees' || currentScreen === 'mentorMenteeDetails'
                        ? 'people'
                        : 'people-outline'
                    }
                    isActive={
                      currentScreen === 'mentorMentees' || currentScreen === 'mentorMenteeDetails'
                    }
                    badgeCount={12}
                    onPress={() => handleNavigation('mentorMentees')}
                  />
                </MenuSection>

                <MenuSection title="PROJECTS">
                  <MenuItem
                    label="Projects"
                    iconName={
                      currentScreen === 'mentorProjects' || currentScreen === 'mentorProjectDetails'
                        ? 'folder'
                        : 'folder-outline'
                    }
                    isActive={
                      currentScreen === 'mentorProjects' || currentScreen === 'mentorProjectDetails'
                    }
                    badgeCount={6}
                    onPress={() => handleNavigation('mentorProjects')}
                  />
                  <MenuItem
                    label="Project Reports"
                    iconName={currentScreen === 'mentorReports' ? 'document-text' : 'document-text-outline'}
                    isActive={currentScreen === 'mentorReports'}
                    onPress={() => handleNavigation('mentorReports')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Notifications"
                    iconName={
                      currentScreen === 'mentorNotifications'
                        ? 'notifications'
                        : 'notifications-outline'
                    }
                    isActive={currentScreen === 'mentorNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('mentorNotifications')}
                  />
                  <MenuItem
                    label="Profile"
                    iconName={currentScreen === 'facultyProfile' ? 'person' : 'person-outline'}
                    isActive={currentScreen === 'facultyProfile'}
                    onPress={() => handleNavigation('facultyProfile')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                1. PROCTOR WORKSPACE SECTIONS
            ════════════════════════════════════════════════ */}
            {isProctorWs && (
              <>
                <MenuSection title="PROCTOR WORKSPACE">
                  <MenuItem
                    label="Proctor Dashboard"
                    iconName={currentScreen === 'facultyDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'facultyDashboard'}
                    onPress={() => handleNavigation('facultyDashboard')}
                  />
                  <MenuItem
                    label="Assigned Students"
                    iconName={currentScreen === 'proctorAssignedStudents' ? 'people' : 'people-outline'}
                    isActive={currentScreen === 'proctorAssignedStudents'}
                    onPress={() => handleNavigation('proctorAssignedStudents')}
                  />
                  <MenuItem
                    label="Student Goals"
                    iconName={currentScreen === 'proctorGoalsOverview' ? 'compass' : 'compass-outline'}
                    isActive={currentScreen === 'proctorGoalsOverview'}
                    onPress={() => handleNavigation('proctorGoalsOverview')}
                  />
                  <MenuItem
                    label="Group Performance"
                    iconName={currentScreen === 'proctorPerformance' ? 'pie-chart' : 'pie-chart-outline'}
                    isActive={currentScreen === 'proctorPerformance'}
                    onPress={() => handleNavigation('proctorPerformance')}
                  />
                  <MenuItem
                    label="Assigned Leaderboard"
                    iconName={currentScreen === 'proctorLeaderboard' ? 'bar-chart' : 'bar-chart-outline'}
                    isActive={currentScreen === 'proctorLeaderboard'}
                    onPress={() => handleNavigation('proctorLeaderboard')}
                  />
                </MenuSection>

                <MenuSection title="REPORTS & ALERTS">
                  <MenuItem
                    label="Official Reports"
                    iconName={currentScreen === 'proctorReports' ? 'document-text' : 'document-text-outline'}
                    isActive={currentScreen === 'proctorReports'}
                    onPress={() => handleNavigation('proctorReports')}
                  />
                  <MenuItem
                    label="Notifications"
                    iconName={currentScreen === 'proctorNotifications' ? 'notifications' : 'notifications-outline'}
                    isActive={currentScreen === 'proctorNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('proctorNotifications')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                2. FACULTY WORKSPACE SECTIONS
            ════════════════════════════════════════════════ */}
            {isFacultyWs && (
              <>
                <MenuSection title="MAIN">
                  <MenuItem
                    label="Faculty Dashboard"
                    iconName={currentScreen === 'facultyDashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'facultyDashboard'}
                    onPress={() => handleNavigation('facultyDashboard')}
                  />
                  <MenuItem
                    label="My Achievements"
                    iconName={currentScreen === 'facultyAchievements' ? 'trophy' : 'trophy-outline'}
                    isActive={currentScreen === 'facultyAchievements'}
                    onPress={() => handleNavigation('facultyAchievements')}
                  />
                  <MenuItem
                    label="Add Achievement"
                    iconName={currentScreen === 'facultyAddAchievement' ? 'add-circle' : 'add-circle-outline'}
                    isActive={currentScreen === 'facultyAddAchievement'}
                    onPress={() => handleNavigation('facultyAddAchievement')}
                  />
                  <MenuItem
                    label="Professional Goals"
                    iconName={currentScreen === 'facultyGoals' ? 'compass' : 'compass-outline'}
                    isActive={currentScreen === 'facultyGoals'}
                    onPress={() => handleNavigation('facultyGoals')}
                  />
                  <MenuItem
                    label="Faculty Leaderboard"
                    iconName={currentScreen === 'facultyLeaderboard' ? 'bar-chart' : 'bar-chart-outline'}
                    isActive={currentScreen === 'facultyLeaderboard'}
                    onPress={() => handleNavigation('facultyLeaderboard')}
                  />
                </MenuSection>

                <MenuSection title="VERIFICATION">
                  <MenuItem
                    label="Review Achievements"
                    iconName="shield-checkmark-outline"
                    isActive={currentScreen === 'facultySubmissions'}
                    onPress={() => handleNavigation('facultySubmissions')}
                    badgeCount={4}
                  />
                  <MenuItem
                    label="Resubmission Required"
                    iconName="alert-circle-outline"
                    isActive={currentScreen === 'resubmissionRequired'}
                    onPress={() => handleNavigation('resubmissionRequired')}
                    badgeCount={1}
                  />
                  <MenuItem
                    label="Verification History"
                    iconName="receipt-outline"
                    isActive={currentScreen === 'verificationHistory'}
                    onPress={() => handleNavigation('verificationHistory')}
                  />
                </MenuSection>

                <MenuSection title="ALERTS & REPORTS">
                  <MenuItem
                    label="Reports"
                    iconName="document-text-outline"
                    isActive={currentScreen === 'reports'}
                    onPress={() => handleNavigation('reports')}
                  />
                  <MenuItem
                    label="Notifications"
                    iconName={currentScreen === 'facultyNotifications' ? 'notifications' : 'notifications-outline'}
                    isActive={currentScreen === 'facultyNotifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('facultyNotifications')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                3. STUDENT WORKSPACE SECTIONS
            ════════════════════════════════════════════════ */}
            {isStudent && (
              <>
                <MenuSection title="MAIN">
                  <MenuItem
                    label="Dashboard"
                    iconName={currentScreen === 'dashboard' ? 'grid' : 'grid-outline'}
                    isActive={currentScreen === 'dashboard'}
                    onPress={() => handleNavigation('dashboard')}
                  />
                </MenuSection>

                <MenuSection title="ACHIEVEMENTS">
                  <MenuItem
                    label="My Achievements"
                    iconName={currentScreen === 'myAchievements' ? 'trophy' : 'trophy-outline'}
                    isActive={currentScreen === 'myAchievements'}
                    onPress={() => handleNavigation('myAchievements')}
                  />
                  <MenuItem
                    label="Submit Achievement"
                    iconName={currentScreen === 'submitAchievement' ? 'add-circle' : 'add-circle-outline'}
                    isActive={currentScreen === 'submitAchievement'}
                    onPress={() => handleNavigation('submitAchievement')}
                  />
                </MenuSection>

                <MenuSection title="LEARNING">
                  <MenuItem
                    label="Academic Credits"
                    iconName={currentScreen === 'nptelCredits' ? 'school' : 'school-outline'}
                    isActive={currentScreen === 'nptelCredits'}
                    onPress={() => handleNavigation('nptelCredits')}
                  />
                  <MenuItem
                    label="Goals"
                    iconName={currentScreen === 'goals' ? 'compass' : 'compass-outline'}
                    isActive={currentScreen === 'goals'}
                    onPress={() => handleNavigation('goals')}
                  />
                </MenuSection>

                <MenuSection title="PERFORMANCE">
                  <MenuItem
                    label="Leaderboard"
                    iconName={currentScreen === 'leaderboard' ? 'bar-chart' : 'bar-chart-outline'}
                    isActive={currentScreen === 'leaderboard'}
                    onPress={() => handleNavigation('leaderboard')}
                  />
                </MenuSection>

                <MenuSection title="ACCOUNT">
                  <MenuItem
                    label="Notifications"
                    iconName={currentScreen === 'notifications' ? 'notifications' : 'notifications-outline'}
                    isActive={currentScreen === 'notifications'}
                    badgeCount={unreadNotificationCount}
                    onPress={() => handleNavigation('notifications')}
                  />
                </MenuSection>
              </>
            )}

            {/* ════════════════════════════════════════════════
                SHARED PROFILE & ACCOUNT ITEMS
            ════════════════════════════════════════════════ */}
            <MenuSection title="ACCOUNT">
              <MenuItem
                label="Profile"
                iconName={currentScreen === 'profile' || currentScreen === 'facultyProfile' ? 'person' : 'person-outline'}
                isActive={currentScreen === 'profile' || currentScreen === 'facultyProfile'}
                onPress={() =>
                  handleNavigation(isStudent ? 'profile' : 'facultyProfile')
                }
              />
              {!!onLogout && (
                <MenuItem
                  label="Log Out"
                  iconName="log-out-outline"
                  isActive={false}
                  onPress={handleLogoutFromDrawer}
                />
              )}
            </MenuSection>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              REDESIGNED DRAWER USER CARD FOOTER
          ════════════════════════════════════════════════ */}
          <TouchableOpacity
            style={styles.profileFooter}
            activeOpacity={0.8}
            onPress={() => handleNavigation(userRole === 'Student' ? 'profile' : 'facultyProfile')}
            onLongPress={handleOpenSwitchModal}
          >
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{getInitials(profileName)}</Text>
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profileName}
                </Text>
                <Text style={styles.profileDept} numberOfLines={1}>
                  {profileSubtitle}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleOpenSwitchModal}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  backgroundColor: '#EFF6FF',
                  paddingHorizontal: 7,
                  paddingVertical: 4,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#DBEAFE',
                  marginRight: 6,
                }}
              >
                <Ionicons name="swap-horizontal" size={15} color="#2563EB" />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      {/* AchieveX Global Switch Workspace Modal */}
      <SwitchWorkspaceModal
        visible={showSwitchModal}
        currentRole={userRole}
        activeWorkspace={activeWorkspace}
        onClose={() => setShowSwitchModal(false)}
        onSelectOption={handleSelectWorkspaceOption}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    zIndex: 999,
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  sectionContainer: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 4,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
  },
  sectionItems: {
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: '#EFF6FF',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
  },
  menuLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  badgeContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  profileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileDept: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
});
