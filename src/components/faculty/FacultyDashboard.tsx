// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Dashboard Component
// Exact match to Student Dashboard UI with full metrics, journey hero,
// overview cards, My Next Goal, Your Workspace, and Recent Activity.
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Svg, { Circle, G } from 'react-native-svg';
import {
  DEFAULT_FACULTY_USER,
  type FacultyUser,
  type FacultyWorkspaceId,
} from '../../data/facultyWorkspaceData';
import WorkspaceSwitcherModal from './WorkspaceSwitcherModal';
import StudentBottomTab from '../StudentBottomTab';
import AchievementJourneyHeroCard from '../dashboard/AchievementJourneyHeroCard';
import ProctorDashboard from './ProctorDashboard';
import MentorDashboard from '../mentor/MentorDashboard';
import TutorDashboard from './TutorDashboard';
import ACDashboard from '../ac/ACDashboard';
import HeadDashboard from '../head/HeadDashboard';
import HODDashboard from '../hod/HODDashboard';
import DeanDashboard from '../dean/DeanDashboard';
import PrincipalDashboard from '../principal/PrincipalDashboard';

interface FacultyDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  onSelectVerification?: (itemId: string) => void;
  userRole?: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'faculty';
  facultyUser?: FacultyUser;
  activeWorkspace?: FacultyWorkspaceId;
  onSelectWorkspace?: (workspace: FacultyWorkspaceId) => void;
  unreadNotificationCount?: number;
}

export default function FacultyDashboard({
  onOpenMenu,
  onNavigate,
  facultyUser = DEFAULT_FACULTY_USER,
  activeWorkspace = 'faculty',
  onSelectWorkspace,
  unreadNotificationCount = 3,
}: FacultyDashboardProps) {
  const [workspaceModalVisible, setWorkspaceModalVisible] = useState(false);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  // Dynamically render according to activeWorkspace
  if (activeWorkspace === 'principal') {
    return (
      <PrincipalDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'dean') {
    return (
      <DeanDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'head') {
    return (
      <HeadDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'hod') {
    return (
      <HODDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'academic_coordinator') {
    return (
      <ACDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        facultyUser={facultyUser}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'proctor') {
    return (
      <ProctorDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        facultyUser={facultyUser}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'mentor') {
    return (
      <MentorDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        facultyUser={facultyUser}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  if (activeWorkspace === 'tutor') {
    return (
      <TutorDashboard
        onOpenMenu={onOpenMenu}
        onNavigate={onNavigate}
        facultyUser={facultyUser}
        unreadNotificationCount={unreadNotificationCount}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Main Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. TOP HEADER (Exact Student Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.menuIconContainer}
                activeOpacity={0.7}
                onPress={onOpenMenu}
              >
                <Ionicons name="menu-outline" size={22} color="#0D4733" />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <View style={styles.greetingRow}>
                  <Text style={styles.greetingText}>
                    Good Morning, {facultyUser.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.waveEmoji}>👋</Text>
                </View>
                <Text style={styles.collegeText}>{facultyUser.institution}</Text>
              </View>
            </View>

            {/* Notification Bell with Badge */}
            <TouchableOpacity
              style={styles.bellIconContainer}
              activeOpacity={0.7}
              onPress={() => onNavigate('notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
              {unreadNotificationCount > 0 && (
                <View style={styles.headerBellBadge}>
                  <Text style={styles.headerBellBadgeText}>{unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              2. HERO BANNER CARD (Achievement Journey - Exact Match)
          ════════════════════════════════════════════════ */}
          <AchievementJourneyHeroCard
            points={120}
            level="Bronze Level"
            pointsToNextLevel={80}
            nextLevelName="Gold"
            progressPercent={35}
            onViewAchievements={() => onNavigate('myAchievements')}
          />

          {/* ════════════════════════════════════════════════
              3. HORIZONTAL METRIC CARDS SCROLL (All Details)
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScrollView}
          >
            {/* Card 1: Achievements */}
            <View style={styles.metricCard}>
              <Text style={styles.metricCardTitle}>Achievements</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="trophy" size={16} color="#2563EB" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>18</Text>
                  <Text style={styles.metricSubtext}>Submitted</Text>
                </View>
              </View>
            </View>

            {/* Card 2: Verified */}
            <View style={styles.metricCard}>
              <Text style={styles.metricCardTitle}>Verified</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="star" size={16} color="#7C3AED" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>15</Text>
                  <Text style={styles.metricSubtext}>Approved</Text>
                </View>
              </View>
            </View>

            {/* Card 3: Pending */}
            <View style={styles.metricCard}>
              <Text style={styles.metricCardTitle}>Pending</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="hourglass" size={16} color="#D97706" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>05</Text>
                  <Text style={styles.metricSubtext}>Awaiting</Text>
                </View>
              </View>
            </View>

            {/* Card 4: Awards Won */}
            <View style={styles.metricCard}>
              <Text style={styles.metricCardTitle}>Awards Won</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEF9C3' }]}>
                  <FontAwesome5 name="award" size={16} color="#CA8A04" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>03</Text>
                  <Text style={styles.metricSubtext}>Awarded</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              4. SECTION: MY NEXT GOAL (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>My Next Goal</Text>
              <TouchableOpacity onPress={() => onNavigate('goals')} activeOpacity={0.7}>
                <Feather name="chevron-right" size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
            <View style={styles.goalContentRow}>
              <View style={styles.goalTargetIconBg}>
                <MaterialCommunityIcons name="target" size={28} color="#4F46E5" />
              </View>
              <View style={styles.goalDetailsContainer}>
                <Text style={styles.goalTitle}>Reach Gold Level</Text>
                <Text style={styles.goalPtsText}>120 / 200 Pts</Text>
                {/* Progress Bar */}
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '60%' }]} />
                </View>
                <Text style={styles.goalRemainingText}>80 points remaining</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              5. SECTION: YOUR WORKSPACE (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeaderTitle}>Your Workspace</Text>
            <View style={styles.workspaceGrid}>
              {/* Action 1: Upload Certificate */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('submitAchievement')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="cloud-upload" size={22} color="#2563EB" />
                </View>
                <Text style={styles.workspaceItemText}>Upload{'\n'}Certificate</Text>
              </TouchableOpacity>

              {/* Action 2: My Achievement */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('myAchievements')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="trophy-outline" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.workspaceItemText}>My{'\n'}Achievement</Text>
              </TouchableOpacity>

              {/* Action 3: My Goals */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('goals')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="target" size={22} color="#9333EA" />
                </View>
                <Text style={styles.workspaceItemText}>My{'\n'}Goals</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              6. SECTION: RECENT ACTIVITY (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeaderTitle}>Recent Activity</Text>
            <Text style={styles.cardHeaderSubtitle}>Your latest achievements and updates</Text>

            <View style={styles.activityList}>
              {/* Activity Item 1 */}
              <View style={styles.activityItem}>
                <View style={styles.activityIconCircle}>
                  <Ionicons name="trophy-outline" size={20} color="#2563EB" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityCategory, { color: '#2563EB' }]}>
                    Technical & Innovation
                  </Text>
                  <Text style={styles.activityTitle}>National Hackathon 2026</Text>
                  <Text style={styles.activityCollege}>Nandha Engineering College</Text>
                </View>
                <View style={styles.activityMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: '#DEF7EC' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#0E9F6E' }]}>Verified</Text>
                  </View>
                  <Text style={styles.activityDate}>14-08-2026</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.activityDivider} />

              {/* Activity Item 2 */}
              <View style={styles.activityItem}>
                <View style={styles.activityIconCircle}>
                  <MaterialCommunityIcons name="medal-outline" size={22} color="#2563EB" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityCategory, { color: '#D97706' }]}>Culture</Text>
                  <Text style={styles.activityTitle}>Drama</Text>
                  <Text style={styles.activityCollege}>Kongu Engineering College</Text>
                </View>
                <View style={styles.activityMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#D97706' }]}>Pending</Text>
                  </View>
                  <Text style={styles.activityDate}>09-08-2026</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Workspace Switcher Modal */}
        <WorkspaceSwitcherModal
          visible={workspaceModalVisible}
          currentWorkspace={activeWorkspace}
          responsibilities={facultyUser.responsibilities}
          onClose={() => setWorkspaceModalVisible(false)}
          onSelectWorkspace={(ws) => {
            setWorkspaceModalVisible(false);
            if (onSelectWorkspace) {
              onSelectWorkspace(ws);
            }
          }}
        />

        {/* ── Unified Student Bottom Navigation Tab Bar ── */}
        <StudentBottomTab
          activeTab="home"
          onNavigate={(tab) => {
            if (tab === 'home') {
              /* already home */
            } else if (tab === 'achievements') {
              onNavigate('facultyAchievements');
            } else if (tab === 'goals') {
              onNavigate('facultyGoals');
            } else if (tab === 'leaderboard') {
              onNavigate('facultyLeaderboard');
            } else if (tab === 'profile') {
              onNavigate('facultyProfile');
            }
          }}
        />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0D4733',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FAF8F5',
  },
  userInfo: {
    justifyContent: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  waveEmoji: {
    fontSize: 17,
    marginLeft: 4,
  },
  collegeText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  bellIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },

  /* Hero Banner Card */
  heroCard: {
    width: '100%',
    maxWidth: 356,
    height: 198,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trophyBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  journeyTextContainer: {
    justifyContent: 'center',
  },
  journeyLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCD34D',
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  heroLeftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
    marginRight: 6,
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewAchievementsBtn: {
    width: 164,
    height: 26,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  viewAchievementsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  metricDivider: {
    width: 1,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    position: 'relative',
    width: 131,
    height: 131,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  gaugeCenterLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FDE047',
    textAlign: 'center',
    lineHeight: 14,
  },

  /* Horizontal Scrollable Metric Cards */
  horizontalScrollView: {
    marginBottom: 20,
  },
  horizontalScrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  metricCard: {
    width: 118,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricCardTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  metricCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  metricTextGroup: {
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 14,
  },
  metricSubtext: {
    fontSize: 9,
    color: '#9CA3AF',
  },

  /* Section Containers */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardHeaderSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 12,
  },

  /* Goal Card Content */
  goalContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTargetIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalDetailsContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  goalPtsText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  goalRemainingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 4,
  },

  /* Workspace Grid */
  workspaceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 8,
  },
  workspaceItem: {
    alignItems: 'center',
    flex: 1,
  },
  workspaceIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  workspaceItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
  },

  /* Recent Activity List */
  activityList: {
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityCategory: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  activityCollege: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
});
