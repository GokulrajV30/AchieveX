// ─────────────────────────────────────────────────────────────
// AchieveX — Student Profile Screen (Pixel-Perfect Figma Redesign)
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  DEFAULT_STUDENT_PROFILE,
  StudentProfile,
  getStudentProfileStats,
} from '../data/studentProfileData';
import { showAchieveXDialog } from './feedback/AchieveXFeedback';
import { FACULTY_PROFILES } from '../data/facultyMockData';
import ProfileHeroCard from './profile/ProfileHeroCard';
import ProfileInfoCard from './profile/ProfileInfoCard';
import ProfileSectionHeader from './profile/ProfileSectionHeader';
import PhotoUploadModal from './profile/PhotoUploadModal';
import ChangePasswordModal from './profile/ChangePasswordModal';
import StudentBottomTab from './StudentBottomTab';
import { getHODStore } from '../data/hodWorkspaceData';
import { useBottomNavInset } from '../hooks/useBottomNavInset';

interface ProfileScreenProps {
  onGoBack: () => void;
  onOpenMenu?: () => void;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
  userRole?: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
}

export default function ProfileScreen({
  onGoBack,
  onOpenMenu,
  onNavigate,
  onLogout,
  userRole = 'Student',
}: ProfileScreenProps) {
  const { contentBottomPadding } = useBottomNavInset();
  // Student Profile local state
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
  const stats = getStudentProfileStats();

  // Modals state
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // Logout Handler
  // ─────────────────────────────────────────────────────────────
  const handleLogoutPress = () => {
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
          if (onLogout) {
            onLogout();
          } else {
            onNavigate('login');
          }
        },
      },
    });
  };

  // ─────────────────────────────────────────────────────────────
  // Faculty Profile Fallback (Preserved for non-student roles)
  // ─────────────────────────────────────────────────────────────
  if (userRole !== 'Student') {
    const facProfile = FACULTY_PROFILES[userRole] || FACULTY_PROFILES.Proctor;
    const initials = facProfile.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
        <View style={styles.mainContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={onGoBack}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Faculty Profile</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.facultyHeaderCard}>
              <View style={styles.facultyAvatarCircle}>
                <Text style={styles.facultyAvatarInitials}>{initials}</Text>
              </View>
              <Text style={styles.facultyName}>{facProfile.name}</Text>
              <Text style={styles.facultyMeta}>
                {facProfile.designation} • {facProfile.department}
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <ProfileSectionHeader
                title="Employment Details"
                iconName="briefcase-outline"
                iconFamily="Ionicons"
              />
              <ProfileInfoCard
                iconName="business-outline"
                label="Institution"
                value="Nandha Engineering College"
              />
              <ProfileInfoCard
                iconName="office-building"
                iconFamily="MaterialCommunityIcons"
                label="Department"
                value={facProfile.department}
              />
              <ProfileInfoCard
                iconName="badge-account-horizontal-outline"
                iconFamily="MaterialCommunityIcons"
                label="Faculty ID"
                value={facProfile.id}
              />
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              activeOpacity={0.85}
              onPress={handleLogoutPress}
            >
              <Text style={styles.logoutBtnText}>Logout</Text>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={22}
                color="#FFFFFF"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STUDENT PROFILE (EXACT FIGMA REPLICA)
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.mainContainer}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Hero Gradient Profile Card with Embedded Stats */}
          <ProfileHeroCard
            profile={profile}
            stats={stats}
            onPressCamera={() => setPhotoModalVisible(true)}
          />

          {/* 2. Personal Information Section */}
          <View style={styles.sectionContainer}>
            <ProfileSectionHeader
              title="Personal Information"
              iconName="person"
              iconFamily="Ionicons"
            />

            {/* College Email */}
            <ProfileInfoCard
              iconName="mail"
              iconFamily="Ionicons"
              label="College Email"
              value={profile.collegeEmail}
            />

            {/* Register Number */}
            <ProfileInfoCard
              iconName="badge-account"
              iconFamily="MaterialCommunityIcons"
              label="Register Number"
              value={profile.registerNumber}
            />

            {/* Department */}
            <ProfileInfoCard
              iconName="office-building"
              iconFamily="MaterialCommunityIcons"
              label="Department"
              value={profile.department}
            />

            {/* Academic Year */}
            <ProfileInfoCard
              iconName="calendar-month"
              iconFamily="MaterialCommunityIcons"
              label="Academic Year"
              value={profile.academicBatch.label}
            />
          </View>

          {/* Institutional Advisors Section (Read-Only) */}
          <View style={styles.sectionContainer}>
            <ProfileSectionHeader
              title="Faculty Advisors"
              iconName="school"
              iconFamily="Ionicons"
            />
            <ProfileInfoCard
              iconName="shield-checkmark-outline"
              iconFamily="Ionicons"
              label="Assigned Proctor"
              value={
                getHODStore().getStudentProctor(profile.registerNumber)
                  ? `${getHODStore().getStudentProctor(profile.registerNumber)?.name} (${
                      getHODStore().getStudentProctor(profile.registerNumber)?.designation
                    })`
                  : 'Not Assigned'
              }
            />
            <ProfileInfoCard
              iconName="school-outline"
              iconFamily="Ionicons"
              label="Assigned Mentor"
              value={
                getHODStore().getStudentMentor(profile.registerNumber)
                  ? `${getHODStore().getStudentMentor(profile.registerNumber)?.name} (${
                      getHODStore().getStudentMentor(profile.registerNumber)?.designation
                    })`
                  : 'Not Assigned'
              }
            />
          </View>

          {/* 3. Account Section */}
          <View style={styles.sectionContainer}>
            <ProfileSectionHeader
              title="Account"
              iconName="account-cog"
              iconFamily="MaterialCommunityIcons"
            />

            {/* Change Password Card */}
            <ProfileInfoCard
              iconName="lock-reset"
              iconFamily="MaterialCommunityIcons"
              label="Change Password"
              value="Update your account password"
              isAction
              onPress={() => setPasswordModalVisible(true)}
            />
          </View>

          {/* 4. Logout Action Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={22}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* ── Unified Student Bottom Navigation Tab Bar ── */}
        <StudentBottomTab
          activeTab="profile"
          onNavigate={(tab) => {
            if (tab === 'home') onNavigate('dashboard');
            else if (tab === 'achievements') onNavigate('myAchievements');
            else if (tab === 'goals') onNavigate('goals');
            else if (tab === 'leaderboard') onNavigate('leaderboard');
            else if (tab === 'profile') {
              /* already on profile */
            }
          }}
        />

        {/* 6. Photo Upload Modal */}
        <PhotoUploadModal
          visible={photoModalVisible}
          onClose={() => setPhotoModalVisible(false)}
          onSelectImage={(uri) => {
            setProfile((prev) => ({ ...prev, profileImage: uri }));
          }}
        />

        {/* 7. Change Password Modal */}
        <ChangePasswordModal
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerRightPlaceholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginHorizontal: 16,
  },

  // Logout Button matching Figma
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 22,
    height: 48,
    marginHorizontal: 36,
    marginTop: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Bottom Navigation Bar - size 337 x 59
  bottomTabBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    backgroundColor: '#FFFFFF',
  },
  bottomTabBar: {
    width: 337,
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },

  // Faculty profile styles fallback
  facultyHeaderCard: {
    backgroundColor: '#0D4733',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  facultyAvatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1B6A4C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  facultyAvatarInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  facultyName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  facultyMeta: {
    fontSize: 13,
    color: '#D1FAE5',
    marginTop: 4,
  },
});
