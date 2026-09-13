// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Dashboard Screen
// Header & Hero Card exactly matching Student, Faculty, and Proctor UI:
// Unified Top Header → Gradient Donut Hero Card → Horizontal Stat Carousel →
// Quick Actions → Overview Stats → Recent Projects → Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G } from 'react-native-svg';
import MentorBottomTab from './MentorBottomTab';
import {
  MENTOR_SUMMARY_DATA,
  getProjectsForMentor,
  getDerivedMenteesFromProjects,
  type MentorProject,
} from '../../data/mentorWorkspaceData';
import {
  DEFAULT_FACULTY_USER,
  type FacultyUser,
} from '../../data/facultyWorkspaceData';
import { subscribeHODData } from '../../data/hodWorkspaceData';

interface MentorDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectProject?: (project: MentorProject) => void;
  facultyUser?: FacultyUser;
  unreadNotificationCount?: number;
}

export default function MentorDashboard({
  onOpenMenu,
  onNavigate,
  onSelectProject,
  facultyUser = DEFAULT_FACULTY_USER,
  unreadNotificationCount = 2,
}: MentorDashboardProps) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribeHODData(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const mentorFacultyId = facultyUser?.id || 'fac-1';
  const assignedProjects = useMemo(() => getProjectsForMentor(mentorFacultyId), [mentorFacultyId, tick]);
  const derivedMentees = useMemo(() => getDerivedMenteesFromProjects(mentorFacultyId), [mentorFacultyId, tick]);
  const recentProjects = assignedProjects.slice(0, 3);

  const totalMentees = derivedMentees.length;
  const activeProjectsCount = assignedProjects.length;
  const teamProjectsCount = assignedProjects.filter((p) => p.projectType === 'Team').length;
  const individualProjectsCount = assignedProjects.filter((p) => p.projectType === 'Individual').length;

  const firstName = facultyUser?.name ? facultyUser.name.split(' ')[0] : 'Gokulraj';
  const collegeName = facultyUser?.institution || 'Nandha Engineering College';

  // Donut Gauge Dimensions - exact match to Student & Faculty & Proctor Hero
  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2; // 58
  const circumference = 2 * Math.PI * radius;
  const activePercent = totalMentees > 0 ? 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER (Exact Student / Faculty Match)
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
                <Text style={styles.greetingText}>Good Morning, {firstName}</Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <Text style={styles.collegeText}>{collegeName}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellIconContainer}
            activeOpacity={0.7}
            onPress={() => onNavigate('mentorNotifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            {unreadNotificationCount > 0 && (
              <View style={styles.headerBellBadge}>
                <Text style={styles.headerBellBadgeText}>{unreadNotificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              2. HERO BANNER CARD (Exact Student & Faculty Match)
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Top Row: People/Trophy Badge + Title + Subtitle */}
            <View style={styles.topRow}>
              <View style={styles.trophyBadgeCircle}>
                <Ionicons name="people" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.titleColumn}>
                <Text style={styles.journeyTitle}>Mentee Project Guidance</Text>
                <Text style={styles.levelSubtitle}>Overview of Assigned Mentees</Text>
              </View>
            </View>

            {/* Main Content: Left Column, Vertical Divider, Right Donut Gauge */}
            <View style={styles.contentRow}>
              {/* Left Column: Number & View Button */}
              <View style={styles.leftColumn}>
                <View style={styles.pointsWrapper}>
                  <Text style={styles.pointsNumber}>{totalMentees}</Text>
                  <Text style={styles.pointsLabel}>Mentees</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewAchievementsButton}
                  activeOpacity={0.85}
                  onPress={() => onNavigate('mentorMentees')}
                >
                  <Text style={styles.viewAchievementsButtonText}>View Mentees</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              </View>

              {/* Vertical Divider */}
              <View style={styles.verticalDivider} />

              {/* Right Column: Donut Gauge */}
              <View style={styles.rightGaugeColumn}>
                <View style={styles.svgContainer}>
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
                        strokeDashoffset={circumference * (1 - activePercent / 100)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  {/* Inner Center Text */}
                  <View style={styles.gaugeCenterTextWrapper}>
                    <Text style={styles.gaugeNumberText}>{activePercent}%</Text>
                    <Text style={styles.gaugeSubText}>Projects</Text>
                    <Text style={styles.gaugeLevelText}>{activeProjectsCount} Active Projects</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              3. HORIZONTAL METRIC CARDS SCROLL (Exact Match)
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScrollView}
          >
            {/* Card 1: Mentees */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorMentees')}
            >
              <Text style={styles.metricCardTitle}>Mentees</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people" size={16} color="#2563EB" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>{totalMentees}</Text>
                  <Text style={styles.metricSubtext}>Assigned</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 2: Active Projects */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects')}
            >
              <Text style={styles.metricCardTitle}>Projects</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="folder-open" size={16} color="#7C3AED" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {activeProjectsCount < 10 ? `0${activeProjectsCount}` : activeProjectsCount}
                  </Text>
                  <Text style={styles.metricSubtext}>Active</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 3: Team Projects */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects', { initialTab: 'Team' })}
            >
              <Text style={styles.metricCardTitle}>Team Projects</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="people-circle" size={16} color="#D97706" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {teamProjectsCount < 10 ? `0${teamProjectsCount}` : teamProjectsCount}
                  </Text>
                  <Text style={styles.metricSubtext}>In Progress</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 4: Individual */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects', { initialTab: 'Individual' })}
            >
              <Text style={styles.metricCardTitle}>Individual</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="person" size={16} color="#CA8A04" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {individualProjectsCount < 10 ? `0${individualProjectsCount}` : individualProjectsCount}
                  </Text>
                  <Text style={styles.metricSubtext}>Assigned</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              4. QUICK ACTIONS
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorMentees')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people" size={22} color="#2563EB" />
              </View>
              <Text style={styles.quickActionLabel}>Mentees</Text>
              <Text style={styles.quickActionSub}>{totalMentees} Students</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="folder" size={22} color="#7C3AED" />
              </View>
              <Text style={styles.quickActionLabel}>Projects</Text>
              <Text style={styles.quickActionSub}>{activeProjectsCount} Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorReports')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="document-text" size={22} color="#059669" />
              </View>
              <Text style={styles.quickActionLabel}>Reports</Text>
              <Text style={styles.quickActionSub}>PDF Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorNotifications')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="notifications" size={22} color="#D97706" />
              </View>
              <Text style={styles.quickActionLabel}>Updates</Text>
              <Text style={styles.quickActionSub}>Activity</Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              5. OVERVIEW STATS (Actionable Cards)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorMentees')}
            >
              <View style={styles.statCardTop}>
                <Text style={styles.statNumber}>12</Text>
                <View style={[styles.statIconBadge, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people" size={16} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.statLabel}>Assigned Mentees</Text>
              <Text style={styles.statActionText}>View Roster →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects')}
            >
              <View style={styles.statCardTop}>
                <Text style={styles.statNumber}>6</Text>
                <View style={[styles.statIconBadge, { backgroundColor: '#F5F3FF' }]}>
                  <Ionicons name="folder" size={16} color="#7C3AED" />
                </View>
              </View>
              <Text style={styles.statLabel}>Total Projects</Text>
              <Text style={styles.statActionText}>View All →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects', { initialTab: 'Team' })}
            >
              <View style={styles.statCardTop}>
                <Text style={styles.statNumber}>4</Text>
                <View style={[styles.statIconBadge, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="people-circle" size={16} color="#059669" />
                </View>
              </View>
              <Text style={styles.statLabel}>Team Projects</Text>
              <Text style={styles.statActionText}>View Team →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('mentorProjects', { initialTab: 'Individual' })}
            >
              <View style={styles.statCardTop}>
                <Text style={styles.statNumber}>2</Text>
                <View style={[styles.statIconBadge, { backgroundColor: '#FFF7ED' }]}>
                  <Ionicons name="person-circle" size={16} color="#EA580C" />
                </View>
              </View>
              <Text style={styles.statLabel}>Individual</Text>
              <Text style={styles.statActionText}>View Solo →</Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              6. RECENT PROJECTS (Max 3 compact cards)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderBetween}>
            <Text style={styles.sectionTitle}>Recent Projects</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate('mentorProjects')}
            >
              <Text style={styles.viewAllText}>View All ({activeProjectsCount}) →</Text>
            </TouchableOpacity>
          </View>

          {recentProjects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              activeOpacity={0.85}
              onPress={() => {
                if (onSelectProject) {
                  onSelectProject(project);
                } else {
                  onNavigate('mentorProjectDetails', { projectId: project.id });
                }
              }}
            >
              <View style={styles.projectCardHeader}>
                <View style={styles.projectIconWrap}>
                  <Ionicons
                    name={project.projectType === 'Team' ? 'people' : 'person'}
                    size={18}
                    color="#2563EB"
                  />
                </View>
                <View style={styles.projectTitleContainer}>
                  <Text style={styles.projectTitle} numberOfLines={1}>
                    {project.title}
                  </Text>
                  <View style={styles.projectMetaRow}>
                    <Text style={styles.projectDomainText}>{project.domain}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.projectYearText}>{project.studentYear}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.projectTypeTag,
                    {
                      backgroundColor:
                        project.projectType === 'Team' ? '#EFF6FF' : '#F8FAFC',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.projectTypeTagText,
                      {
                        color:
                          project.projectType === 'Team' ? '#2563EB' : '#64748B',
                      },
                    ]}
                  >
                    {project.projectType}
                  </Text>
                </View>
              </View>

              <Text style={styles.projectDescription} numberOfLines={2}>
                {project.description}
              </Text>

              <View style={styles.projectCardFooter}>
                <View style={styles.projectLeadInfo}>
                  <Text style={styles.leadLabel}>
                    {project.projectType === 'Team' ? 'Lead: ' : 'Owner: '}
                    <Text style={styles.leadName}>{project.teamLeader.name}</Text>
                  </Text>
                  {project.projectType === 'Team' && (
                    <Text style={styles.memberCountText}>
                      • {project.teamMembers.length} Members
                    </Text>
                  )}
                </View>
                <View style={styles.viewLinkWrap}>
                  <Text style={styles.viewLinkText}>View Project</Text>
                  <Ionicons name="arrow-forward" size={13} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. LOCKED 5-TAB BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <MentorBottomTab activeTab="home" onNavigate={onNavigate} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  waveEmoji: {
    fontSize: 16,
    marginLeft: 4,
  },
  collegeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  headerBellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  headerBellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroCard: {
    width: '100%',
    maxWidth: 356,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trophyBadgeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  journeyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  levelSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FDE047',
    marginTop: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minHeight: 120,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  pointsWrapper: {
    marginBottom: 12,
  },
  pointsNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  pointsLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 1,
  },
  viewAchievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAchievementsButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  verticalDivider: {
    width: 1,
    height: 78,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 12,
  },
  rightGaugeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'relative',
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNumberText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  gaugeSubText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 13,
  },
  gaugeLevelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FDE047',
    lineHeight: 16,
  },
  horizontalScrollView: {
    marginBottom: 18,
  },
  horizontalScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    width: 130,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  metricCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTextGroup: {
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  metricSubtext: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickActionSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  statActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  projectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  projectTitleContainer: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  projectMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  projectDomainText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  metaDot: {
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  projectYearText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  projectTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  projectTypeTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  projectDescription: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  projectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  projectLeadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  leadName: {
    fontWeight: '700',
    color: '#0F172A',
  },
  memberCountText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 4,
  },
  viewLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
