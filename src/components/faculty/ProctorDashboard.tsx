// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Dashboard Component (Exact UI Match)
// Matches uploaded screenshots: Student Performance hero (20 Students, 85% Achievers),
// Overview stat chips, Student Progress (Top Performer), Needs Attention,
// Your Workspace actions (Students, Performance, Leaderboard, Reports),
// and Recent Student Activity with Read-Only View actions.
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Svg, { Circle, G } from 'react-native-svg';
import {
  DEFAULT_FACULTY_USER,
  PROCTOR_SUMMARY_DATA,
  PROCTOR_TOP_PERFORMER,
  PROCTOR_NEEDS_ATTENTION,
  PROCTOR_STUDENT_ACTIVITIES,
  type FacultyUser,
} from '../../data/facultyWorkspaceData';
import {
  getCertificateProgress,
  subscribeTeamAchievements,
} from '../../data/teamAchievementData';
import ProctorAssignedStudentsModal from './ProctorAssignedStudentsModal';
import StudentAchievementDetailsModal, {
  type ReadOnlyAchievementData,
} from './StudentAchievementDetailsModal';
import StudentBottomTab from '../StudentBottomTab';

interface ProctorDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  facultyUser?: FacultyUser;
  unreadNotificationCount?: number;
}

export default function ProctorDashboard({
  onOpenMenu,
  onNavigate,
  facultyUser = DEFAULT_FACULTY_USER,
  unreadNotificationCount = 3,
}: ProctorDashboardProps) {
  const [studentsModalVisible, setStudentsModalVisible] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<ReadOnlyAchievementData | null>(null);

  const [, setTeamTick] = useState(0);

  useEffect(() => {
    return subscribeTeamAchievements(() => setTeamTick((t) => t + 1));
  }, []);

  const teamProgress = getCertificateProgress('TA-SIH-2026-001');

  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2; // (136 - 20) / 2 = 58
  const circumference = 2 * Math.PI * radius;
  const achieverPercent = PROCTOR_SUMMARY_DATA.achieverPercentage; // 85%

  const handleOpenAchievementDetails = (item: typeof PROCTOR_STUDENT_ACTIVITIES[0]) => {
    setSelectedAchievement({
      id: item.id,
      studentName: item.studentName || 'Student',
      registerNumber: item.rollNo || '23CI011',
      department: 'CSE (IoT)',
      title: item.title,
      category: item.category,
      event: item.title,
      organizer: 'Nandha Engineering College',
      semester: 'Semester 5',
      date: item.date,
      status: item.status as any,
      points: item.points,
      proofDocumentName: `${item.title.replace(/\s+/g, '_')}_Proof.pdf`,
      proofType: 'Certificate / Proof Document',
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
          {/* ════════════════════════════════════════════════
              1. TOP HEADER (Student/Faculty Identical)
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
                    Good Morning,{facultyUser.name.split(' ')[0]}
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
              onPress={() => onNavigate('proctorNotifications')}
            >
              <Ionicons name="notifications" size={22} color="#0D4733" />
              {unreadNotificationCount > 0 && (
                <View style={styles.headerBellBadge}>
                  <Text style={styles.headerBellBadgeText}>{unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              2. STUDENT PERFORMANCE HERO (Exact Match)
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Top Row: Users Icon + Title */}
            <View style={styles.heroTopRow}>
              <View style={styles.usersBadgeCircle}>
                <Ionicons name="people" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.heroTitleGroup}>
                <Text style={styles.heroTitle}>Student Performance</Text>
                <Text style={styles.heroSubtitle}>Overview of your assigned students</Text>
              </View>
            </View>

            {/* Middle Section: Left Students Count & Right Donut Gauge */}
            <View style={styles.heroContentRow}>
              {/* Left Column: 20 Students + Under your guidance + Button */}
              <View style={styles.heroLeftColumn}>
                <View style={styles.studentsCountGroup}>
                  <Text style={styles.studentsCountNumber}>
                    {PROCTOR_SUMMARY_DATA.assignedStudents}
                  </Text>
                  <Text style={styles.studentsCountLabel}>Students</Text>
                </View>

                <Text style={styles.guidanceSubtext}>Under your guidance</Text>

                {/* View Students Button */}
                <TouchableOpacity
                  style={styles.viewStudentsBtn}
                  activeOpacity={0.85}
                  onPress={() => onNavigate('proctorAssignedStudents')}
                >
                  <Text style={styles.viewStudentsBtnText}>View Students</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              </View>

              {/* Vertical Divider */}
              <View style={styles.metricDivider} />

              {/* Right Column: Donut Gauge (85% Achievers, 17 of 20) */}
              <View style={styles.gaugeContainer}>
                <View style={styles.svgWrapper}>
                  <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                      {/* Background Ring */}
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(99, 102, 241, 0.45)"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      {/* Gold Progress Arc */}
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FDE047"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - achieverPercent / 100)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  <View style={styles.gaugeTextOverlay}>
                    <Text style={styles.gaugePercentage}>{achieverPercent}%</Text>
                    <Text style={styles.gaugeAchieversText}>Achievers</Text>
                    <Text style={styles.gaugeFractionText}>
                      {PROCTOR_SUMMARY_DATA.achieverStudents} of {PROCTOR_SUMMARY_DATA.assignedStudents}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              3. HORIZONTAL OVERVIEW METRIC CARDS (Exact Match)
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScrollContent}
            style={styles.statsScrollView}
          >
            {/* Card 1: Students */}
            <TouchableOpacity
              style={styles.statChipCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('proctorAssignedStudents')}
            >
              <Text style={styles.statChipTitle}>Students</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people" size={16} color="#2563EB" />
                </View>
                <Text style={styles.statChipValue}>{PROCTOR_SUMMARY_DATA.assignedStudents}</Text>
              </View>
              <Text style={styles.statChipSubtext}>Assigned</Text>
            </TouchableOpacity>

            {/* Card 2: Achievements */}
            <TouchableOpacity
              style={styles.statChipCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('proctorAssignedStudents')}
            >
              <Text style={styles.statChipTitle}>Achievements</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#FFF7ED' }]}>
                  <Ionicons name="trophy" size={16} color="#F97316" />
                </View>
                <Text style={styles.statChipValue}>{PROCTOR_SUMMARY_DATA.totalSubmitted}</Text>
              </View>
              <Text style={styles.statChipSubtext}>Submitted</Text>
            </TouchableOpacity>

            {/* Card 3: Verified */}
            <TouchableOpacity
              style={styles.statChipCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('proctorPerformance')}
            >
              <Text style={styles.statChipTitle}>Verified</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                </View>
                <Text style={styles.statChipValue}>{PROCTOR_SUMMARY_DATA.totalApproved}</Text>
              </View>
              <Text style={styles.statChipSubtext}>Approved</Text>
            </TouchableOpacity>

            {/* Card 4: Pending */}
            <TouchableOpacity
              style={styles.statChipCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('proctorPerformance')}
            >
              <Text style={styles.statChipTitle}>Pending</Text>
              <View style={styles.statChipBody}>
                <View style={[styles.statIconBox, { backgroundColor: '#FFFBEB' }]}>
                  <Ionicons name="hourglass" size={16} color="#D97706" />
                </View>
                <Text style={styles.statChipValue}>{PROCTOR_SUMMARY_DATA.totalPending}</Text>
              </View>
              <Text style={styles.statChipSubtext}>In Review</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              4. STUDENT PROGRESS / TOP PERFORMER CARD
          ════════════════════════════════════════════════ */}
          <TouchableOpacity
            style={styles.studentProgressCard}
            activeOpacity={0.8}
            onPress={() => onNavigate('proctorLeaderboard')}
          >
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressHeaderTitle}>Student Progress</Text>
              <Ionicons name="chevron-forward" size={18} color="#2563EB" />
            </View>

            <View style={styles.topPerformerBody}>
              <View style={styles.sparkleIconCircle}>
                <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={26} color="#4F46E5" />
              </View>

              <View style={styles.topPerformerInfoCol}>
                <Text style={styles.topPerformerBadge}>Top Performer</Text>
                <Text style={styles.topPerformerName}>
                  {PROCTOR_TOP_PERFORMER.name} <Text style={{ color: '#64748B' }}>/ {PROCTOR_TOP_PERFORMER.registerNumber}</Text>
                </Text>
                <Text style={styles.topPerformerStats}>
                  {PROCTOR_TOP_PERFORMER.achievementsCount} Achievements •{' '}
                  <Text style={styles.pointsHighlight}>{PROCTOR_TOP_PERFORMER.points}</Text> Points
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* ════════════════════════════════════════════════
              5. STUDENTS NEEDING ATTENTION (Exception Monitor)
          ════════════════════════════════════════════════ */}
          <View style={styles.attentionSectionCard}>
            <View style={styles.attentionHeaderRow}>
              <View>
                <Text style={styles.attentionTitle}>Needs Attention</Text>
                <Text style={styles.attentionSubtitle}>
                  Students with low or no recent achievement activity
                </Text>
              </View>
              <View style={styles.attentionBadge}>
                <Text style={styles.attentionBadgeText}>2 Students</Text>
              </View>
            </View>

            <View style={styles.attentionList}>
              {PROCTOR_NEEDS_ATTENTION.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.attentionItemRow}
                  activeOpacity={0.75}
                  onPress={() => onNavigate('proctorAssignedStudents')}
                >
                  <View style={styles.attentionAvatar}>
                    <Ionicons name="person-outline" size={18} color="#B91C1C" />
                  </View>
                  <View style={styles.attentionInfoCol}>
                    <Text style={styles.attentionStudentName}>
                      {item.name} • <Text style={{ fontWeight: '500', color: '#64748B' }}>{item.registerNumber}</Text>
                    </Text>
                    <Text style={styles.attentionIssueText}>{item.issue}</Text>
                  </View>
                  <View style={styles.attentionActionPill}>
                    <Text style={styles.attentionActionText}>View</Text>
                    <Ionicons name="chevron-forward" size={13} color="#2563EB" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              6. YOUR WORKSPACE (Proctor Shortcuts)
          ════════════════════════════════════════════════ */}
          <View style={styles.workspaceCardContainer}>
            <Text style={styles.workspaceCardTitle}>Your Workspace</Text>

            <View style={styles.workspaceGridRow}>
              {/* Shortcut 1: Students */}
              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('proctorAssignedStudents')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people" size={22} color="#2563EB" />
                </View>
                <Text style={styles.wsLabel}>Students</Text>
              </TouchableOpacity>

              {/* Shortcut 2: Performance */}
              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('proctorPerformance')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#F5F3FF' }]}>
                  <MaterialCommunityIcons name="chart-timeline-variant" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.wsLabel}>Performance</Text>
              </TouchableOpacity>

              {/* Shortcut 3: Leaderboard */}
              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('proctorLeaderboard')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="bar-chart" size={22} color="#CA8A04" />
                </View>
                <Text style={styles.wsLabel}>Leaderboard</Text>
              </TouchableOpacity>

              {/* Shortcut 4: Reports */}
              <TouchableOpacity
                style={styles.workspaceGridItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('proctorReports')}
              >
                <View style={[styles.wsIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="document-text" size={22} color="#16A34A" />
                </View>
                <Text style={styles.wsLabel}>Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              7. RECENT STUDENT ACTIVITY (Exact Match)
          ════════════════════════════════════════════════ */}
          <View style={styles.recentActivityCard}>
            <View style={styles.recentActivityHeader}>
              <Text style={styles.recentActivityTitle}>Recent Activity</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onNavigate('proctorAssignedStudents')}
              >
                <Text style={styles.viewAllText}>View all ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {/* ── Team Achievement Live Activity Item ── */}
              <TouchableOpacity
                style={styles.teamActivityItem}
                activeOpacity={0.75}
                onPress={() => onNavigate('proctorTeamView')}
              >
                <View style={[styles.activityIconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="people" size={18} color="#4F46E5" />
                </View>

                <View style={styles.activityContentCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.activityCategoryText, { color: '#4F46E5' }]}>Team Achievement</Text>
                    <View style={styles.teamMonitorPill}>
                      <Text style={styles.teamMonitorPillText}>Monitor Only</Text>
                    </View>
                  </View>
                  <Text style={styles.activityStudentName}>
                    Smart India Hackathon 2026
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#475569', marginTop: 1 }}>
                    Team Code Nexus • 5 Students
                  </Text>
                  <View style={[styles.dateStatusRow, { marginTop: 4 }]}>
                    <Ionicons name="time-outline" size={12} color="#D97706" style={{ marginRight: 3 }} />
                    <Text style={[styles.activityDateText, { color: '#D97706', fontWeight: '700' }]}>
                      {teamProgress.uploaded} / {teamProgress.total} Certificates Uploaded
                    </Text>
                  </View>
                </View>

                <View style={styles.viewTeamLinkPill}>
                  <Text style={styles.viewTeamLinkText}>View →</Text>
                </View>
              </TouchableOpacity>

              {PROCTOR_STUDENT_ACTIVITIES.map((activity) => {
                const isApproved = activity.status === 'Approved';

                return (
                  <View key={activity.id} style={styles.activityRow}>
                    <View style={styles.activityIconCircle}>
                      <Ionicons name="trophy" size={18} color="#2563EB" />
                    </View>

                    <View style={styles.activityContentCol}>
                      <Text style={styles.activityStudentName}>
                        {activity.studentName} <Text style={{ color: '#CBD5E1' }}>•</Text> {activity.rollNo}
                      </Text>
                      <Text style={styles.activityCategoryText}>{activity.title}</Text>
                      <View style={styles.dateStatusRow}>
                        <Text style={styles.activityDateText}>{activity.date}</Text>
                        <Text style={{ color: '#94A3B8', marginHorizontal: 4 }}>•</Text>
                        <View style={styles.statusDotRow}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: isApproved ? '#15803D' : '#B45309' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: isApproved ? '#15803D' : '#B45309' },
                            ]}
                          >
                            {activity.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* View Button */}
                    <TouchableOpacity
                      style={styles.viewActionButton}
                      activeOpacity={0.8}
                      onPress={() => handleOpenAchievementDetails(activity)}
                    >
                      <Text style={styles.viewActionButtonText}>View</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 3 }} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Assigned Students Modal */}
        <ProctorAssignedStudentsModal
          visible={studentsModalVisible}
          onClose={() => setStudentsModalVisible(false)}
        />

        {/* Read-Only Achievement Details Modal */}
        <StudentAchievementDetailsModal
          visible={selectedAchievement !== null}
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />

        {/* ── Unified Floating 5-Tab Bottom Bar ── */}
        <StudentBottomTab
          variant="proctor"
          activeTab="home"
          onNavigate={(tab) => {
            if (tab === 'home') {
              /* already on home */
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
            } else if (tab === 'goals') {
              onNavigate('proctorGoalsOverview');
            } else if (tab === 'leaderboard') {
              onNavigate('proctorLeaderboard');
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
  usersBadgeCircle: {
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
  heroLeftColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  studentsCountGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  studentsCountNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
    marginRight: 6,
  },
  studentsCountLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guidanceSubtext: {
    fontSize: 12,
    color: '#FDE047',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  viewStudentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  viewStudentsBtnText: {
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
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
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
  studentProgressCard: {
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
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  topPerformerBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topPerformerInfoCol: {
    flex: 1,
  },
  topPerformerBadge: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 2,
  },
  topPerformerName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  topPerformerStats: {
    fontSize: 12,
    color: '#64748B',
  },
  pointsHighlight: {
    fontWeight: '800',
    color: '#4F46E5',
  },
  attentionSectionCard: {
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
  attentionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  attentionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  attentionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  attentionBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  attentionBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B91C1C',
  },
  attentionList: {
    gap: 8,
  },
  attentionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  attentionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  attentionInfoCol: {
    flex: 1,
  },
  attentionStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  attentionIssueText: {
    fontSize: 11.5,
    color: '#B91C1C',
    marginTop: 1,
  },
  attentionActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  attentionActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
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
    backgroundColor: '#EFF6FF',
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
  dateStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
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
  teamActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  teamMonitorPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  teamMonitorPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  viewTeamLinkPill: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'center',
  },
  viewTeamLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
