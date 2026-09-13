// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Dashboard Component
// Focuses on Mentee Progress, Capstone Guidance, Goals, and Milestone Reviews.
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Svg, { Circle, G } from 'react-native-svg';
import {
  DEFAULT_FACULTY_USER,
  type FacultyUser,
} from '../../data/facultyWorkspaceData';
import StudentAchievementDetailsModal, {
  type ReadOnlyAchievementData,
} from './StudentAchievementDetailsModal';
import StudentBottomTab from '../StudentBottomTab';

interface MentorDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  facultyUser?: FacultyUser;
  unreadNotificationCount?: number;
}

const MENTOR_ACTIVITIES = [
  {
    id: 'MA-01',
    studentName: 'Autonomous Campus Drone Team',
    rollNo: 'Batch 2026-A',
    department: 'CSE (IoT)',
    title: 'Milestone 3 of 4: Drone Autopilot Test Completed',
    category: 'Capstone Project',
    event: 'Smart Campus Initiative 2026',
    organizer: 'Nandha Engineering College',
    semester: 'Semester 7',
    date: '31.08.2026',
    status: 'Approved' as const,
    points: 40,
  },
  {
    id: 'MA-02',
    studentName: 'AI Agri-Sensor Project Team',
    rollNo: 'Batch 2026-B',
    department: 'CSE (IoT)',
    title: 'Patent Specification Draft Uploaded',
    category: 'Innovation / IPR',
    event: 'IPR & Patents 2026',
    organizer: 'Patent Office Chennai',
    semester: 'Semester 7',
    date: '30.08.2026',
    status: 'Pending' as const,
    points: 30,
  },
  {
    id: 'MA-03',
    studentName: 'Edge AI Edge-Node Device Team',
    rollNo: 'Batch 2026-C',
    department: 'CSE (IoT)',
    title: 'Prototype Ready for Testing',
    category: 'Project Milestone',
    event: 'IoT Innovation Expo',
    organizer: 'Kongu Engineering College',
    semester: 'Semester 7',
    date: '28.08.2026',
    status: 'Approved' as const,
    points: 25,
  },
];

export default function MentorDashboard({
  onOpenMenu,
  onNavigate,
  facultyUser = DEFAULT_FACULTY_USER,
  unreadNotificationCount = 3,
}: MentorDashboardProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<ReadOnlyAchievementData | null>(null);

  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const goalCompletionPercent = 75; // 6 of 8 goals on track = 75%

  const handleOpenDetails = (item: typeof MENTOR_ACTIVITIES[0]) => {
    setSelectedAchievement({
      id: item.id,
      studentName: item.studentName,
      registerNumber: item.rollNo,
      department: item.department,
      title: item.title,
      category: item.category,
      event: item.event,
      organizer: item.organizer,
      semester: item.semester,
      date: item.date,
      status: item.status,
      points: item.points,
      proofDocumentName: `${item.title.replace(/\s+/g, '_')}_Milestone.pdf`,
      proofType: 'Project Report / Milestone Proof',
    });
  };

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
          {/* Header */}
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

            <TouchableOpacity
              style={styles.bellIconContainer}
              activeOpacity={0.7}
              onPress={() => onNavigate('notifications')}
            >
              <Ionicons name="notifications" size={22} color="#0D4733" />
              {unreadNotificationCount > 0 && (
                <View style={styles.headerBellBadge}>
                  <Text style={styles.headerBellBadgeText}>{unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Hero Banner Card: Mentee Progress */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.badgeCircle}>
                <Ionicons name="heart" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.heroTitleGroup}>
                <Text style={styles.heroTitle}>Mentee Progress</Text>
                <Text style={styles.heroSubtitle}>Project teams & student guidance</Text>
              </View>
            </View>

            <View style={styles.heroContentRow}>
              <View style={styles.heroLeftCol}>
                <View style={styles.countGroup}>
                  <Text style={styles.countNumber}>12</Text>
                  <Text style={styles.countLabel}>Students</Text>
                </View>
                <Text style={styles.subGuidanceText}>Under your mentorship</Text>

                <TouchableOpacity
                  style={styles.viewProjectsBtn}
                  activeOpacity={0.85}
                  onPress={() => onNavigate('goals')}
                >
                  <Text style={styles.viewProjectsBtnText}>View Projects</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.gaugeContainer}>
                <View style={styles.svgWrapper}>
                  <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(99, 102, 241, 0.45)"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FDE047"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - goalCompletionPercent / 100)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  <View style={styles.gaugeTextOverlay}>
                    <Text style={styles.gaugePercentage}>8</Text>
                    <Text style={styles.gaugeAchieversText}>Active Goals</Text>
                    <Text style={styles.gaugeFractionText}>6 on track</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Horizontal Metric Overview Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScrollContent}
            style={styles.statsScrollView}
          >
            <View style={styles.statChipCard}>
              <Text style={styles.statChipTitle}>Mentees</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#FFE4E6' }]}>
                  <Ionicons name="heart" size={16} color="#E11D48" />
                </View>
                <Text style={styles.statChipValue}>12</Text>
              </View>
              <Text style={styles.statChipSubtext}>Assigned</Text>
            </View>

            <View style={styles.statChipCard}>
              <Text style={styles.statChipTitle}>Active Goals</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="target" size={16} color="#7C3AED" />
                </View>
                <Text style={styles.statChipValue}>8</Text>
              </View>
              <Text style={styles.statChipSubtext}>In Progress</Text>
            </View>

            <View style={styles.statChipCard}>
              <Text style={styles.statChipTitle}>Achievements</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="trophy" size={16} color="#2563EB" />
                </View>
                <Text style={styles.statChipValue}>15</Text>
              </View>
              <Text style={styles.statChipSubtext}>Verified</Text>
            </View>

            <View style={styles.statChipCard}>
              <Text style={styles.statChipTitle}>Needs Attention</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                </View>
                <Text style={styles.statChipValue}>2</Text>
              </View>
              <Text style={styles.statChipSubtext}>Overdue Goals</Text>
            </View>
          </ScrollView>

          {/* Your Workspace Shortcuts */}
          <View style={styles.workspaceCardContainer}>
            <Text style={styles.workspaceCardTitle}>Your Workspace</Text>

            <View style={styles.workspaceGridRow}>
              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('goals')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people" size={22} color="#2563EB" />
                </View>
                <Text style={styles.wsLabel}>Mentees</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('goals')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#F5F3FF' }]}>
                  <MaterialCommunityIcons name="target" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.wsLabel}>Goals</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('leaderboard')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#FEF9C3' }]}>
                  <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={22} color="#CA8A04" />
                </View>
                <Text style={styles.wsLabel}>Progress</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('myAchievements')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="time-outline" size={22} color="#16A34A" />
                </View>
                <Text style={styles.wsLabel}>Activity</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Mentee Activity */}
          <View style={styles.recentActivityCard}>
            <View style={styles.recentActivityHeader}>
              <Text style={styles.recentActivityTitle}>Recent Mentee Activity</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onNavigate('myAchievements')}
              >
                <Text style={styles.viewAllText}>View all ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {MENTOR_ACTIVITIES.map((activity) => (
                <View key={activity.id} style={styles.activityRow}>
                  <View style={styles.activityIconCircle}>
                    <Ionicons name="heart" size={18} color="#E11D48" />
                  </View>

                  <View style={styles.activityContentCol}>
                    <Text style={styles.activityStudentName}>{activity.studentName}</Text>
                    <Text style={styles.activityCategoryText}>{activity.title}</Text>
                    <Text style={styles.activityDateText}>
                      {activity.date} • <Text style={{ color: '#15803D', fontWeight: '700' }}>● {activity.status}</Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewActionButton}
                    activeOpacity={0.8}
                    onPress={() => handleOpenDetails(activity)}
                  >
                    <Text style={styles.viewActionButtonText}>View</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 3 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Read-Only Details Modal */}
        <StudentAchievementDetailsModal
          visible={selectedAchievement !== null}
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />

        {/* Floating 5-Tab Navigation Bar */}
        <StudentBottomTab
          activeTab="home"
          onNavigate={(tab) => {
            if (tab === 'home') {
              /* already home */
            } else if (tab === 'achievements') {
              onNavigate('myAchievements');
            } else if (tab === 'goals') {
              onNavigate('goals');
            } else if (tab === 'leaderboard') {
              onNavigate('leaderboard');
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
    paddingTop: 10,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF8F5',
    borderWidth: 2,
    borderColor: '#0D4733',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
    fontSize: 12.5,
    color: '#6B7280',
    marginTop: 1,
    fontWeight: '500',
  },
  bellIconContainer: {
    width: 38,
    height: 38,
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
  heroCard: {
    width: '100%',
    maxWidth: 356,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroTitleGroup: {
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  heroLeftCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  countGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
    marginRight: 6,
  },
  countLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subGuidanceText: {
    fontSize: 12,
    color: '#FDE047',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  viewProjectsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  viewProjectsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  metricDivider: {
    width: 1,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 12,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    position: 'relative',
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugePercentage: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  gaugeAchieversText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 14,
  },
  gaugeFractionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FDE047',
    lineHeight: 15,
  },
  statsScrollView: {
    marginBottom: 16,
  },
  statsScrollContent: {
    gap: 10,
  },
  statChipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 110,
  },
  statChipTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  statChipBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statChipValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statChipSubtext: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  workspaceCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  workspaceCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  workspaceGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  workspaceGridItem: {
    alignItems: 'center',
    flex: 1,
  },
  wsIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  wsLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  recentActivityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recentActivityTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  activityList: {
    gap: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityContentCol: {
    flex: 1,
    paddingRight: 6,
  },
  activityStudentName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  activityCategoryText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  activityDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  viewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewActionButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
