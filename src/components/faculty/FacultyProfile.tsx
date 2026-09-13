// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Profile Screen (Exact UI Match)
// Matches uploaded screenshots: Gradient Hero, Embedded Stats,
// Workspace & Responsibilities Card with "+ Add" pill button,
// Personal Info, Account Section with Manage Responsibilities (Delete & Switch),
// and Red Logout button.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { showAchieveXDialog, showAchieveXToast } from '../feedback/AchieveXFeedback';
import {
  DEFAULT_FACULTY_USER,
  type FacultyUser,
  type FacultyResponsibility,
  type FacultyWorkspaceId,
} from '../../data/facultyWorkspaceData';
import { getWorkspaceRoute } from '../../navigation/workspaceRoutes';
import { HOD_DEMO_USER } from '../../data/hodWorkspaceData';
import AddResponsibilityModal from './AddResponsibilityModal';
import ManageResponsibilitiesModal from './ManageResponsibilitiesModal';
import PhotoUploadModal from '../profile/PhotoUploadModal';
import ChangePasswordModal from '../profile/ChangePasswordModal';
import StudentBottomTab from '../StudentBottomTab';
import HODBottomTab from '../hod/HODBottomTab';
import DeanBottomTab from '../dean/DeanBottomTab';

interface FacultyProfileScreenProps {
  onGoBack: () => void;
  onOpenMenu?: () => void;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
  facultyUser?: FacultyUser;
  activeWorkspace?: FacultyWorkspaceId;
  onSelectWorkspace?: (workspace: FacultyWorkspaceId) => void;
}

export default function FacultyProfileScreen({
  onGoBack,
  onNavigate,
  onLogout,
  facultyUser = DEFAULT_FACULTY_USER,
  activeWorkspace = 'faculty',
  onSelectWorkspace,
}: FacultyProfileScreenProps) {
  const [profile, setProfile] = useState<FacultyUser>(facultyUser);
  const [currentWs, setCurrentWs] = useState<FacultyWorkspaceId>(activeWorkspace);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  useEffect(() => {
    setCurrentWs(activeWorkspace);
    if (activeWorkspace === 'hod') {
      setProfile({
        id: HOD_DEMO_USER.id,
        name: HOD_DEMO_USER.name,
        email: HOD_DEMO_USER.email,
        role: 'faculty',
        institution: HOD_DEMO_USER.institution,
        department: {
          id: HOD_DEMO_USER.department.id,
          name: HOD_DEMO_USER.department.name,
        },
        designation: HOD_DEMO_USER.designation,
        profileImage: HOD_DEMO_USER.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        stats: {
          achievements: 320,
          points: 2450,
          approved: 42,
        },
        activeWorkspace: 'hod',
        responsibilities: [
          {
            id: 'hod',
            label: 'HOD',
            description: 'Head of Department — CSE (IoT)',
            enabled: true,
            icon: 'school-outline',
            permissions: ['verify_faculty', 'monitor_department', 'generate_reports'],
          },
          {
            id: 'faculty',
            label: 'Faculty',
            description: 'Teaching & Personal Achievements',
            enabled: true,
            icon: 'briefcase-outline',
            permissions: ['submit_achievements', 'view_leaderboard'],
          },
        ],
      });
    } else if (activeWorkspace === 'principal') {
      setProfile((prev) => ({
        ...prev,
        activeWorkspace: 'principal',
        name: 'Dr. S. Arumugam',
        designation: 'Principal & Institutional Head',
        department: { id: 'PRINCIPAL', name: 'Executive Administration' },
        stats: {
          achievements: 2840,
          points: 48650,
          approved: 2840,
        },
      }));
    } else if (activeWorkspace === 'head') {
      setProfile((prev) => ({
        ...prev,
        activeWorkspace: 'head',
        designation: 'Head - College Governance',
        stats: {
          achievements: 2840,
          points: 48650,
          approved: 2840,
        },
      }));
    } else if (activeWorkspace === 'dean') {
      setProfile((prev) => ({
        ...prev,
        activeWorkspace: 'dean',
        designation: 'Dean of Academic Affairs',
        stats: {
          achievements: 37,
          points: 1250,
          approved: 34,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, activeWorkspace }));
    }
  }, [activeWorkspace]);

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

  const handleWorkspaceSwitch = (ws: FacultyWorkspaceId) => {
    // 1. Dismiss modal FIRST
    setManageModalVisible(false);

    if (ws === currentWs) {
      return;
    }

    // 2. Update activeWorkspace state
    setCurrentWs(ws);
    setProfile((prev) => ({ ...prev, activeWorkspace: ws }));
    if (onSelectWorkspace) {
      onSelectWorkspace(ws);
    }

    // 3. Reset/navigate to target dashboard
    if (ws === 'principal') {
      onNavigate('principalDashboard');
    } else if (ws === 'dean') {
      onNavigate('deanDashboard');
    } else if (ws === 'head') {
      onNavigate('headDashboard');
    } else if (ws === 'hod') {
      onNavigate('hodDashboard');
    } else if (ws === 'academic_coordinator') {
      onNavigate('acDashboard');
    } else if (ws === 'mentor') {
      onNavigate('mentorDashboard');
    } else {
      onNavigate('facultyDashboard');
    }
  };

  const handleAddResponsibility = (role: FacultyResponsibility) => {
    setProfile((prev) => {
      const alreadyExists = prev.responsibilities.some((r) => r.id === role.id);
      if (alreadyExists) return prev;
      return {
        ...prev,
        responsibilities: [...prev.responsibilities, role],
      };
    });

    showAchieveXToast({
      type: 'success',
      message: `${role.label} responsibility added to profile.`,
    });
  };

  const handleDeleteResponsibility = (roleId: FacultyWorkspaceId) => {
    setProfile((prev) => {
      const updated = prev.responsibilities.filter((r) => r.id !== roleId);
      let nextWs = currentWs;
      if (currentWs === roleId) {
        nextWs = updated[0]?.id || 'faculty';
        handleWorkspaceSwitch(nextWs);
      }
      return {
        ...prev,
        responsibilities: updated,
        activeWorkspace: nextWs,
      };
    });
  };

  const handlePhotoSelect = (uri: string) => {
    setProfile((prev) => ({ ...prev, profileImage: uri }));
    setPhotoModalVisible(false);
  };

  // Active workspace label formatting
  const activeRole = profile.responsibilities.find((r) => r.id === currentWs);
  const activeWorkspaceName =
    currentWs === 'dean'
      ? `Dean - 3 Assigned Departments Scope`
      : currentWs === 'head'
      ? `Head - College Governance`
      : currentWs === 'hod'
      ? `Head of Department - ${profile.department.name}`
      : currentWs === 'faculty'
      ? `Faculty - ${profile.department.name}`
      : currentWs === 'tutor'
      ? `Tutor - ${profile.department.name} (3rd Year A)`
      : currentWs === 'proctor'
      ? `Proctor - 24 Students`
      : currentWs === 'mentor'
      ? `Mentor - 12 Mentees`
      : `Academic Coordinator`;

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
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. GRADIENT PROFILE HERO CARD (Exact Match)
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#2563EB', '#3B82F6', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Circular Avatar + Camera Badge */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  {profile.profileImage ? (
                    <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                      }}
                      style={styles.avatarImage}
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cameraBadge}
                  activeOpacity={0.8}
                  onPress={() => setPhotoModalVisible(true)}
                >
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Faculty Name */}
            <Text style={styles.facultyName}>{profile.name}</Text>

            {/* Designation Pill */}
            <View style={styles.designationPill}>
              <Text style={styles.designationPillText}>{profile.designation}</Text>
            </View>

            {/* Department */}
            <Text style={styles.facultyDepartment}>{profile.department.name}</Text>

            {/* Embedded White Stats Bar */}
            <View style={styles.statsCard}>
              <View style={styles.statCol}>
                <Ionicons name="trophy" size={20} color="#2563EB" />
                <Text style={styles.statNumber}>{profile.stats.achievements}</Text>
                <Text style={styles.statTitle}>Achievements</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <MaterialCommunityIcons name="star-circle" size={22} color="#2563EB" />
                <Text style={styles.statNumber}>{profile.stats.points}</Text>
                <Text style={styles.statTitle}>Points</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <MaterialCommunityIcons name="text-box-check" size={20} color="#2563EB" />
                <Text style={styles.statNumber}>{profile.stats.approved}</Text>
                <Text style={styles.statTitle}>Approved</Text>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              2. WORKSPACE & RESPONSIBILITIES CARD (Screenshot Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons name="briefcase-outline" size={20} color="#6D28D9" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Workspace & Responsibilities</Text>
            </View>

            <View style={styles.workspaceCard}>
              <Text style={styles.workspaceLabel}>Current Workspace</Text>
              <Text style={styles.workspaceValue}>{activeWorkspaceName}</Text>
              <Text style={styles.workspaceSubtitle}>{profile.designation}</Text>

              <View style={styles.cardDivider} />

              <Text style={styles.responsibilitiesHeader}>Responsibilities</Text>
              <View style={styles.responsibilitiesRow}>
                {/* Active & Assigned Responsibility Pills */}
                {profile.responsibilities.map((resp) => {
                  const isActive = resp.id === currentWs;
                  return (
                    <TouchableOpacity
                      key={resp.id}
                      style={[
                        styles.respPill,
                        isActive ? styles.activeRespPill : styles.inactiveRespPill,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleWorkspaceSwitch(resp.id)}
                    >
                      <Text
                        style={[
                          styles.respPillText,
                          isActive ? styles.activeRespPillText : styles.inactiveRespPillText,
                        ]}
                      >
                        {resp.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* + Add Responsibility Button Pill */}
                <TouchableOpacity
                  style={styles.addRespPill}
                  activeOpacity={0.75}
                  onPress={() => setAddModalVisible(true)}
                >
                  <Ionicons name="add" size={15} color="#6D28D9" style={{ marginRight: 2 }} />
                  <Text style={styles.addRespPillText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              3. PERSONAL INFORMATION (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="person" size={18} color="#1E293B" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            {/* Card 1: College Email */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>College Email</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            </View>

            {/* Card 2: Faculty ID */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="briefcase" size={18} color="#2563EB" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Faculty ID</Text>
                <Text style={styles.infoValue}>{profile.id}</Text>
              </View>
            </View>

            {/* Card 3: Department */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <MaterialCommunityIcons name="office-building" size={18} color="#2563EB" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{profile.department.name}</Text>
              </View>
            </View>

            {/* Card 4: Designation */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="person-outline" size={18} color="#2563EB" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Designation</Text>
                <Text style={styles.infoValue}>{profile.designation}</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. ACCOUNT SECTION (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="people" size={18} color="#1E293B" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Account</Text>
            </View>

            {/* Change Password */}
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.75}
              onPress={() => setPasswordModalVisible(true)}
            >
              <View style={styles.infoIconCircle}>
                <Ionicons name="lock-closed-outline" size={18} color="#2563EB" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.actionCardTitle}>Change Password</Text>
                <Text style={styles.actionCardSubtitle}>Update your account password</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Workspace & Responsibilities (Manage, Switch, Delete Roles) */}
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.75}
              onPress={() => setManageModalVisible(true)}
            >
              <View style={styles.infoIconCircle}>
                <Ionicons name="people-outline" size={18} color="#2563EB" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.actionCardTitle}>Workspace & responsibilities</Text>
                <Text style={styles.actionCardSubtitle}>Manage, switch, or remove roles</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              5. LOGOUT BUTTON (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.logoutWrapper}>
            <TouchableOpacity
              style={styles.logoutBtn}
              activeOpacity={0.85}
              onPress={handleLogoutPress}
            >
              <Text style={styles.logoutBtnText}>Logout</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Bottom spacing for floating bottom navigation */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Add Responsibility Modal */}
        <AddResponsibilityModal
          visible={addModalVisible}
          currentResponsibilities={profile.responsibilities}
          onClose={() => setAddModalVisible(false)}
          onAddResponsibility={handleAddResponsibility}
        />

        {/* Manage Responsibilities Modal (With Delete & Switch) */}
        <ManageResponsibilitiesModal
          visible={manageModalVisible}
          currentWorkspace={currentWs}
          responsibilities={profile.responsibilities}
          onClose={() => setManageModalVisible(false)}
          onSelectWorkspace={handleWorkspaceSwitch}
          onDeleteResponsibility={handleDeleteResponsibility}
          onOpenAddModal={() => setAddModalVisible(true)}
        />

        {/* Photo Upload Modal */}
        <PhotoUploadModal
          visible={photoModalVisible}
          onClose={() => setPhotoModalVisible(false)}
          onSelectImage={handlePhotoSelect}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
        />

        {/* Floating 5-Tab Bottom Navigation (Profile Active) */}
        {currentWs === 'hod' ? (
          <HODBottomTab
            activeTab="profile"
            onNavigate={(screen) => {
              if (screen === 'profile' || screen === 'facultyProfile') return;
              onNavigate(screen);
            }}
          />
        ) : currentWs === 'dean' ? (
          <DeanBottomTab
            activeTab="profile"
            onNavigate={(screen) => {
              if (screen === 'profile' || screen === 'facultyProfile') return;
              onNavigate(screen);
            }}
          />
        ) : (
          <StudentBottomTab
            activeTab="profile"
            variant={
              currentWs === 'academic_coordinator'
                ? 'ac'
                : currentWs === 'mentor'
                ? 'mentor'
                : currentWs === 'proctor'
                ? 'proctor'
                : currentWs === 'head'
                ? 'head'
                : 'faculty'
            }
            onNavigate={(tab) => {
              if (tab === 'profile') return;
              const targetRoute = getWorkspaceRoute(currentWs, tab as any);
              onNavigate(targetRoute);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    width: 86,
    height: 86,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4338CA',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  designationPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  designationPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  facultyDepartment: {
    fontSize: 13,
    color: '#DBEAFE',
    fontWeight: '600',
    marginBottom: 14,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  statTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  workspaceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  workspaceLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  workspaceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  workspaceSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  responsibilitiesHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  responsibilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  respPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  activeRespPill: {
    backgroundColor: '#6D28D9',
  },
  inactiveRespPill: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  respPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeRespPillText: {
    color: '#FFFFFF',
  },
  inactiveRespPillText: {
    color: '#6D28D9',
  },
  addRespPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  addRespPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D28D9',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  infoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  logoutWrapper: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF2B2D',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: '#EF2B2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
