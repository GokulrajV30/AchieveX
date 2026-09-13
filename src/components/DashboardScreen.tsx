import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import FacultyDashboard from './faculty/FacultyDashboard';
import StudentBottomTab from './StudentBottomTab';
import AchievementJourneyHeroCard from './dashboard/AchievementJourneyHeroCard';
import { useBottomNavInset } from '../hooks/useBottomNavInset';
import {
  getCertificateProgress,
  getTeamAchievementById,
  isTeamLeader,
  getMemberRecord,
  subscribeTeamAchievements,
} from '../data/teamAchievementData';

interface DashboardScreenProps {
  onOpenSubmitAchievement?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenGoals?: () => void;
  onOpenMenu?: () => void;
  onOpenProfile?: () => void;
  onOpenMyAchievements?: () => void;
  onOpenTeamAchievements?: () => void;
  onOpenProjects?: () => void;
  userRole?: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
  onNavigate?: (screen: string, params?: any) => void;
  onSelectVerification?: (itemId: string) => void;
  unreadNotificationCount?: number;
  currentStudentId?: string;
}

export default function DashboardScreen({
  onOpenSubmitAchievement,
  onOpenLeaderboard,
  onOpenGoals,
  onOpenMenu,
  onOpenProfile,
  onOpenMyAchievements,
  onOpenTeamAchievements,
  onOpenProjects,
  userRole = 'Student',
  onNavigate,
  onSelectVerification,
  unreadNotificationCount = 3,
  currentStudentId = '23ci011',
}: DashboardScreenProps) {
  const { contentBottomPadding } = useBottomNavInset();
  const [, setTeamTick] = useState(0);

  useEffect(() => {
    return subscribeTeamAchievements(() => setTeamTick((t: number) => t + 1));
  }, []);

  const activeStudentNorm = currentStudentId.toLowerCase();
  const sihTeam = getTeamAchievementById('TA-SIH-2026-001');
  const isLeader = sihTeam ? isTeamLeader(sihTeam, activeStudentNorm) : true;
  const memberRecord = sihTeam ? getMemberRecord(sihTeam.id, activeStudentNorm) : undefined;
  const isMemberCertUploaded =
    memberRecord?.certificateStatus === 'Uploaded' ||
    memberRecord?.certificateStatus === 'Verified';

  const teamProgress = getCertificateProgress('TA-SIH-2026-001');
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  if (userRole !== 'Student') {
    return (
      <FacultyDashboard
        onOpenMenu={onOpenMenu || (() => {})}
        onNavigate={onNavigate || (() => {})}
        onSelectVerification={onSelectVerification || (() => {})}
        userRole={userRole}
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
          contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
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
                  <Text style={styles.greetingText}>Good Morning, Gokulraj</Text>
                  <Text style={styles.waveEmoji}>👋</Text>
                </View>
                <Text style={styles.collegeText}>Nandha Engineering College</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.bellIconContainer}
              activeOpacity={0.7}
              onPress={() => (onNavigate ? onNavigate('notifications') : null)}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
              {unreadNotificationCount > 0 && (
                <View style={styles.headerBellBadge}>
                  <Text style={styles.headerBellBadgeText}>{unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Hero Banner Card - Exact Match */}
          <AchievementJourneyHeroCard
            points={120}
            level="Bronze Level"
            pointsToNextLevel={80}
            nextLevelName="Gold"
            progressPercent={35}
            onViewAchievements={onOpenMyAchievements}
          />

          {/* Horizontal Metric Cards Scroll */}
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

          {/* Section: My Next Goal */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>My Next Goal</Text>
              <TouchableOpacity onPress={onOpenGoals} activeOpacity={0.7}>
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

          {/* Section: Quick Actions */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeaderTitle}>Quick Actions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickActionsScrollView}
              contentContainerStyle={styles.quickActionsScrollContent}
            >
              {/* Action 1: Upload Certificate */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={onOpenSubmitAchievement}
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
                onPress={onOpenMyAchievements}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="trophy-outline" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.workspaceItemText}>My{'\n'}Achievement</Text>
              </TouchableOpacity>

              {/* Action 3: Projects */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (onOpenProjects) onOpenProjects();
                  else if (onNavigate) onNavigate('studentProjects');
                }}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="folder" size={22} color="#2563EB" />
                </View>
                <Text style={styles.workspaceItemText}>Projects</Text>
              </TouchableOpacity>

              {/* Action 4: Team Achievements */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (onOpenTeamAchievements) onOpenTeamAchievements();
                  else if (onNavigate) onNavigate('studentTeamAchievements');
                }}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="people" size={22} color="#4F46E5" />
                </View>
                <Text style={styles.workspaceItemText}>Team{'\n'}Achievements</Text>
              </TouchableOpacity>

              {/* Action 5: My Goals */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={onOpenGoals}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="target" size={22} color="#9333EA" />
                </View>
                <Text style={styles.workspaceItemText}>My{'\n'}Goals</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* ════════════════════════════════════════════════
              NEW: MY TEAM ACHIEVEMENTS (DIRECT VISIBLE ENTRY)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="people" size={18} color="#4F46E5" />
                <Text style={styles.cardHeaderTitle}>My Team Achievements</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (onOpenTeamAchievements) onOpenTeamAchievements();
                  else if (onNavigate) onNavigate('studentTeamAchievements');
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#2563EB' }}>View All ›</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Team Code Nexus Highlight Card */}
            <TouchableOpacity
              style={styles.teamHighlightCard}
              activeOpacity={0.8}
              onPress={() => {
                if (onNavigate) {
                  if (isLeader || isMemberCertUploaded) {
                    onNavigate('studentTeamAchievementDetails', {
                      teamAchievementId: 'TA-SIH-2026-001',
                    });
                  } else {
                    onNavigate('teamMemberCertificate', {
                      teamAchievementId: 'TA-SIH-2026-001',
                      studentId: activeStudentNorm,
                    });
                  }
                }
              }}
            >
              <View style={styles.teamHighlightTopRow}>
                <View style={styles.teamHighlightIconCircle}>
                  <Ionicons name="people" size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.teamHighlightName}>Team Code Nexus</Text>
                    <View
                      style={[
                        styles.teamLeaderBadge,
                        !isLeader && { backgroundColor: '#F5F3FF', borderColor: '#EDE9FE' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.teamLeaderBadgeText,
                          !isLeader && { color: '#7C3AED' },
                        ]}
                      >
                        {isLeader ? 'Leader' : 'Member'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.teamHighlightEvent}>Smart India Hackathon 2026</Text>

                  {isLeader ? (
                    <Text style={styles.teamHighlightMeta}>
                      5 Members • {teamProgress.uploaded} / {teamProgress.total} Certificates Uploaded
                    </Text>
                  ) : !isMemberCertUploaded ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <View style={[styles.teamLeaderBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', paddingHorizontal: 6, paddingVertical: 2 }]}>
                        <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#B45309' }}>
                          🟠 Certificate Required
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <View style={[styles.teamLeaderBadge, { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0', paddingHorizontal: 6, paddingVertical: 2 }]}>
                        <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#16A34A' }}>
                          🟢 Certificate Uploaded • Pending Verification
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {isLeader ? (
                <View style={styles.teamHighlightFooter}>
                  <View style={styles.teamProgressTrack}>
                    <View
                      style={[
                        styles.teamProgressFill,
                        {
                          width: `${teamProgress.total > 0 ? (teamProgress.uploaded / teamProgress.total) * 100 : 0}%`,
                          backgroundColor: teamProgress.uploaded === teamProgress.total ? '#16A34A' : '#4F46E5',
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.viewTeamCta}>
                    <Text style={styles.viewTeamCtaText}>View Team →</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.teamHighlightFooter, { justifyContent: 'space-between' }]}>
                  <Text style={{ fontSize: 11.5, color: '#64748B', flex: 1, marginRight: 8 }} numberOfLines={1}>
                    {!isMemberCertUploaded
                      ? 'Common proofs submitted • Upload your certificate'
                      : 'Submitted • Awaiting AC verification'}
                  </Text>
                  <View
                    style={[
                      styles.viewTeamCta,
                      !isMemberCertUploaded && { backgroundColor: '#2563EB' },
                    ]}
                  >
                    <Text style={styles.viewTeamCtaText}>
                      {!isMemberCertUploaded ? 'Upload Certificate →' : 'View Details →'}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Section: Recent Activity */}
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
        </ScrollView>

        {/* ── Unified Student Bottom Navigation Tab Bar ── */}
        <StudentBottomTab
          activeTab="home"
          onNavigate={(tab) => {
            if (tab === 'home') {
              /* already on home */
            } else if (tab === 'achievements') {
              if (onOpenMyAchievements) onOpenMyAchievements();
              else if (onNavigate) onNavigate('myAchievements');
            } else if (tab === 'goals') {
              if (onOpenGoals) onOpenGoals();
              else if (onNavigate) onNavigate('goals');
            } else if (tab === 'leaderboard') {
              if (onOpenLeaderboard) onOpenLeaderboard();
              else if (onNavigate) onNavigate('leaderboard');
            } else if (tab === 'profile') {
              if (onOpenProfile) onOpenProfile();
              else if (onNavigate) onNavigate('profile');
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

  /* Hero Banner Card - Responsive up to 356 */
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
    marginBottom: 8,
  },
  trophyBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  journeyTextContainer: {},
  journeyLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  levelLabel: {
    color: '#FDE047',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 1,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  heroLeftColumn: {
    justifyContent: 'space-between',
    height: 118,
    paddingVertical: 2,
  },
  pointsContainer: {
    alignItems: 'flex-start',
  },
  pointsNumber: {
    fontSize: 35,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
  },
  pointsLabel: {
    fontSize: 18,
    color: '#E0E7FF',
    fontWeight: '500',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    width: 131,
    height: 131,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    color: '#FDE047',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },
  viewAchievementsBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    width: 164,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAchievementsText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Horizontal Scroll Metric Cards */
  horizontalScrollView: {
    marginHorizontal: -16,
    marginBottom: 20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: 140,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricCardTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  metricCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTextGroup: {
    alignItems: 'flex-start',
  },
  metricNumber: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 22,
  },
  metricSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  /* Generic Card Container */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardHeaderSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 12,
  },

  /* Goal Section */
  goalContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTargetIconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  goalDetailsContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  goalPtsText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#E0E7FF',
    borderRadius: 3.5,
    marginVertical: 7,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3.5,
  },
  goalRemainingText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },

  /* Quick Actions (Horizontal Scroll) */
  quickActionsScrollView: {
    marginHorizontal: -16,
    marginTop: 8,
  },
  quickActionsScrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 26,
  },
  workspaceItem: {
    alignItems: 'center',
    width: 72,
  },
  workspaceIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  workspaceItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 15,
  },

  /* Team Highlight Card */
  teamHighlightCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 4,
  },
  teamHighlightTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  teamHighlightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamHighlightName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  teamLeaderBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  teamLeaderBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  teamHighlightEvent: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginTop: 1,
  },
  teamHighlightMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  teamHighlightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  teamProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  teamProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewTeamCta: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewTeamCtaText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Recent Activity */
  activityList: {
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  activityCollege: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 42,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },

  /* Bottom Tab Bar Container - size 337 x 59 */
  bottomTabBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    backgroundColor: '#FAF8F5',
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
});
