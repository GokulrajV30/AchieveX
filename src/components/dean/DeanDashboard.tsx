// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Dashboard (v2 — Student Design Grammar)
// Visual Source of Truth: Student DashboardScreen.tsx
// Content Focus: "What needs my verification?"
// Flow: Header → Hero → Quick Actions → Verification Overview →
//       Needs Your Review → Assigned Departments → Recent Activity → Bottom Nav
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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import {
  getDeanStore,
  subscribeDeanData,
  DEMO_DEAN_USER,
  type DeanHODSubmission,
  type DeanVerificationRecord,
  type DeanOverviewStats,
} from '../../data/deanWorkspaceData';
import DeanHeroCard from './DeanHeroCard';
import DeanBottomTab from './DeanBottomTab';
import { DEAN_SPACING } from './deanSpacing';

interface DeanDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  unreadNotificationCount?: number;
}

// Helpers for mobile-friendly dates and clean department names
function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day} ${months[monthIndex]}`;
    }
  }
  return dateStr;
}

function getDeptShortName(deptName?: string): string {
  if (!deptName) return '';
  if (deptName.includes('IoT')) return 'CSE (IoT)';
  if (deptName.toLowerCase().includes('computer science')) return 'CSE';
  if (deptName.toLowerCase().includes('information technology')) return 'IT';
  if (deptName.toLowerCase().includes('electrical')) return 'EEE';
  if (deptName.toLowerCase().includes('electronics')) return 'ECE';
  if (deptName.toLowerCase().includes('mechanical')) return 'MECH';
  if (deptName.toLowerCase().includes('artificial')) return 'AI&DS';
  if (deptName.toLowerCase().includes('biomedical')) return 'BME';
  return deptName;
}

export default function DeanDashboard({
  onOpenMenu,
  onNavigate,
  unreadNotificationCount = 2,
}: DeanDashboardProps) {
  const store = getDeanStore();
  const [stats, setStats] = useState<DeanOverviewStats>(store.getOverviewStats());
  const [assignedDepts, setAssignedDepts] = useState(store.getAssignedDepartments());
  const [submissions, setSubmissions] = useState<DeanHODSubmission[]>(store.getAuthorizedSubmissions());
  const [history, setHistory] = useState<DeanVerificationRecord[]>(store.getVerificationHistory());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    return subscribeDeanData(() => {
      setStats(store.getOverviewStats());
      setAssignedDepts(store.getAssignedDepartments());
      setSubmissions(store.getAuthorizedSubmissions());
      setHistory(store.getVerificationHistory());
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setStats(store.getOverviewStats());
      setAssignedDepts(store.getAssignedDepartments());
      setSubmissions(store.getAuthorizedSubmissions());
      setHistory(store.getVerificationHistory());
      setRefreshing(false);
    }, 400);
  };

  // High-priority submissions (Pending or Correction Required)
  const prioritySubmissions = submissions
    .filter((s) => s.status === 'Pending Review' || s.status === 'Correction Required')
    .slice(0, 3);

  // Recent 3 verification activities
  const recentActivities = history.slice(0, 3);

  // Total pending for hero
  const totalPending = stats.pendingCount + stats.correctionsCount;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT BODY
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* ════════════════════════════════════════════════
              1. HEADER — Matching Student DashboardScreen
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
                    {getGreeting()}, {DEMO_DEAN_USER.name}
                  </Text>
                  <Text style={styles.waveEmoji}>👋</Text>
                </View>
                <Text style={styles.collegeText}>{DEMO_DEAN_USER.institution}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.bellIconContainer}
              activeOpacity={0.7}
              onPress={() => onNavigate('deanNotifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
              {unreadNotificationCount > 0 && (
                <View style={styles.headerBellBadge}>
                  <Text style={styles.headerBellBadgeText}>
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              2. HERO CARD — Clean Left-Aligned Typography Hierarchy
              Answers: "What needs my attention?"
          ════════════════════════════════════════════════ */}
          {totalPending > 0 ? (
            <DeanHeroCard
              eyebrow="HOD VERIFICATION"
              value={totalPending}
              label="Pending Reviews"
              context={`Across ${stats.assignedDepartmentCount} departments`}
              ctaText="Review Now"
              onCtaPress={() => onNavigate('deanVerificationQueue')}
              icon="shield-checkmark"
              secondaryTitle="REVIEW STATUS"
              secondaryItems={[
                {
                  icon: 'checkmark-circle',
                  count: stats.verifiedCount,
                  label: 'Verified',
                  iconColor: '#86EFAC',
                },
                {
                  icon: 'alert-circle-outline',
                  count: stats.correctionsCount,
                  label: 'Corrections',
                  iconColor: '#FDBA74',
                },
              ]}
            />
          ) : (
            <DeanHeroCard
              eyebrow="HOD VERIFICATION"
              value="All Caught Up"
              label="No pending reviews"
              context="No HOD submissions currently need review"
              ctaText="View History"
              onCtaPress={() => onNavigate('deanVerificationHistory')}
              icon="checkmark-done-circle"
              secondaryTitle="REVIEW STATUS"
              secondaryItems={[
                {
                  icon: 'checkmark-circle',
                  count: stats.verifiedCount,
                  label: 'Verified',
                  iconColor: '#86EFAC',
                },
                {
                  icon: 'time-outline',
                  count: stats.totalHODCount,
                  label: 'HODs Active',
                  iconColor: '#93C5FD',
                },
              ]}
            />
          )}

          {/* ════════════════════════════════════════════════
              3. QUICK ACTIONS — Concise Single-Line Labels
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeaderTitle}>Your Workspace</Text>
            <View style={styles.workspaceGrid}>
              {/* Action 1: Review */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('deanVerificationQueue')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="checkbox-outline" size={22} color="#2563EB" />
                </View>
                <Text style={styles.workspaceItemText}>Review</Text>
              </TouchableOpacity>

              {/* Action 2: History */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('deanVerificationHistory')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="time-outline" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.workspaceItemText}>History</Text>
              </TouchableOpacity>

              {/* Action 3: Achievements */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('myAchievements')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="trophy-outline" size={22} color="#D97706" />
                </View>
                <Text style={styles.workspaceItemText}>Achievements</Text>
              </TouchableOpacity>

              {/* Action 4: Upload */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('submitAchievement')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="cloud-upload-outline" size={22} color="#059669" />
                </View>
                <Text style={styles.workspaceItemText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. VERIFICATION OVERVIEW — Count-Dominant Metric Cards
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScrollView}
          >
            {/* Pending */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('deanVerificationQueue', { statusFilter: 'Pending' })}
            >
              <View style={styles.metricCardContent}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="time-outline" size={17} color="#D97706" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {String(stats.pendingCount).padStart(2, '0')}
                  </Text>
                  <Text style={styles.metricStatusLabel} numberOfLines={1} ellipsizeMode="tail">
                    Pending
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Corrections */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('deanVerificationQueue', { statusFilter: 'Corrections' })}
            >
              <View style={styles.metricCardContent}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FFEDD5' }]}>
                  <Ionicons name="alert-circle-outline" size={17} color="#EA580C" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {String(stats.correctionsCount).padStart(2, '0')}
                  </Text>
                  <Text style={styles.metricStatusLabel} numberOfLines={1} ellipsizeMode="tail">
                    Corrections
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Verified */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('deanVerificationHistory', { decisionFilter: 'Verified' })}
            >
              <View style={styles.metricCardContent}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="checkmark-circle-outline" size={17} color="#16A34A" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {String(stats.verifiedCount).padStart(2, '0')}
                  </Text>
                  <Text style={styles.metricStatusLabel} numberOfLines={1} ellipsizeMode="tail">
                    Verified
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Rejected */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.8}
              onPress={() => onNavigate('deanVerificationHistory', { decisionFilter: 'Rejected' })}
            >
              <View style={styles.metricCardContent}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="close-circle-outline" size={17} color="#DC2626" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>
                    {String(stats.rejectedCount).padStart(2, '0')}
                  </Text>
                  <Text style={styles.metricStatusLabel} numberOfLines={1} ellipsizeMode="tail">
                    Rejected
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              5. NEEDS YOUR REVIEW — Compact Priority Cards
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Needs Your Review</Text>
              <TouchableOpacity onPress={() => onNavigate('deanVerificationQueue')}>
                <Text style={styles.viewAllAction}>
                  View All ({submissions.filter((s) => s.status === 'Pending Review' || s.status === 'Correction Required').length}) ›
                </Text>
              </TouchableOpacity>
            </View>

            {prioritySubmissions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle" size={36} color="#2563EB" style={{ marginBottom: 6 }} />
                <Text style={styles.emptyTitle}>You're All Caught Up!</Text>
                <Text style={styles.emptySubtitle}>
                  No HOD submissions need your review right now.
                </Text>
              </View>
            ) : (
              prioritySubmissions.map((sub, idx) => {
                const isCorrection = sub.status === 'Correction Required';

                return (
                  <View key={sub.id}>
                    {idx > 0 && <View style={styles.reviewDivider} />}
                    <TouchableOpacity
                      style={styles.reviewItem}
                      activeOpacity={0.7}
                      onPress={() => onNavigate('deanHODReview', { submissionId: sub.id })}
                    >
                      {/* Left: HOD Avatar */}
                      <View style={styles.reviewAvatarBox}>
                        <Ionicons name="person" size={16} color="#2563EB" />
                      </View>

                      {/* Center: Content */}
                      <View style={styles.reviewContent}>
                        <Text style={styles.reviewAchievementTitle} numberOfLines={1} ellipsizeMode="tail">
                          {sub.title}
                        </Text>
                        <Text style={styles.reviewHodInfo} numberOfLines={1} ellipsizeMode="tail">
                          {sub.hodName} • {getDeptShortName(sub.departmentName)}
                        </Text>
                        <Text
                          style={[
                            styles.reviewStatusLine,
                            isCorrection ? styles.textCorrection : styles.textPending,
                          ]}
                        >
                          {isCorrection ? 'Correction Required' : 'Pending Review'} • {formatFriendlyDate(sub.submittedAt)}
                        </Text>
                      </View>

                      {/* Right: Reserved Arrow Box */}
                      <View style={styles.reviewArrowBox}>
                        <Feather name="chevron-right" size={18} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>

          {/* ════════════════════════════════════════════════
              6. ASSIGNED DEPARTMENTS — Compact Summary Cards
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Assigned Departments</Text>
            <TouchableOpacity onPress={() => onNavigate('deanVerificationQueue')}>
              <Text style={styles.viewAllAction}>View All ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deptScrollContent}
            style={styles.deptScrollView}
          >
            {assignedDepts.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.deptCard}
                activeOpacity={0.8}
                onPress={() => onNavigate('deanVerificationQueue', { departmentFilter: d.id })}
              >
                <View style={styles.deptTopRow}>
                  <View style={styles.deptIconBox}>
                    <Ionicons name="business-outline" size={14} color="#2563EB" />
                  </View>
                  <Text style={styles.deptName} numberOfLines={1} ellipsizeMode="tail">
                    {getDeptShortName(d.name)}
                  </Text>
                </View>
                <View style={styles.deptBottomRow}>
                  <Text style={styles.deptPendingText}>
                    {d.pendingCount > 0 ? `${d.pendingCount} Pending` : 'No Pending'}
                  </Text>
                  <Feather name="arrow-right" size={13} color="#2563EB" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ════════════════════════════════════════════════
              7. RECENT ACTIVITY — Uncluttered Single Info Rows
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => onNavigate('deanVerificationHistory')}>
                <Text style={styles.viewAllAction}>View History ›</Text>
              </TouchableOpacity>
            </View>

            {recentActivities.length === 0 ? (
              <Text style={styles.emptySubtitle}>No recent verification records.</Text>
            ) : (
              recentActivities.map((item, idx) => {
                const isVerified = item.decision === 'Verified';
                const isCorrection = item.decision === 'Correction Required';

                return (
                  <View key={item.id}>
                    {idx > 0 && <View style={styles.activityDivider} />}
                    <View style={styles.activityItem}>
                      <View
                        style={[
                          styles.activityIconCircle,
                          isVerified
                            ? { backgroundColor: '#DCFCE7' }
                            : isCorrection
                            ? { backgroundColor: '#FEF3C7' }
                            : { backgroundColor: '#FEE2E2' },
                        ]}
                      >
                        <Ionicons
                          name={
                            isVerified
                              ? 'checkmark-circle'
                              : isCorrection
                              ? 'alert-circle'
                              : 'close-circle'
                          }
                          size={18}
                          color={isVerified ? '#16A34A' : isCorrection ? '#D97706' : '#DC2626'}
                        />
                      </View>

                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle} numberOfLines={1} ellipsizeMode="tail">
                          {item.achievementTitle}
                        </Text>
                        <Text style={styles.activitySubtitle} numberOfLines={1} ellipsizeMode="tail">
                          {item.hodName} • {getDeptShortName(item.departmentName)}
                        </Text>
                        <Text
                          style={[
                            styles.activityStatusLine,
                            isVerified
                              ? styles.textVerified
                              : isCorrection
                              ? styles.textCorrection
                              : styles.textRejected,
                          ]}
                        >
                          {item.decision} • {formatFriendlyDate(item.verifiedAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            8. BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <DeanBottomTab
          activeTab="home"
          onNavigate={(screen) => onNavigate(screen)}
          unreadCount={unreadNotificationCount}
        />
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES — All tokens derived from Student DashboardScreen.tsx
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  /* ── Layout ── */
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
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: DEAN_SPACING.screenTop,
    paddingBottom: DEAN_SPACING.bottomNavClearance,
  },

  /* ── Header (Student-matched) ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DEAN_SPACING.headerToHeroGap,
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

  /* ── Horizontal Metric Cards (Student-matched) ── */
  horizontalScrollView: {
    marginHorizontal: -DEAN_SPACING.screenHorizontal,
    marginBottom: DEAN_SPACING.betweenSections,
  },
  horizontalScrollContent: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    gap: DEAN_SPACING.horizontalCardGap,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: DEAN_SPACING.cardRadiusCompact,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 146,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  metricTextGroup: {
    justifyContent: 'center',
    flex: 1,
    flexShrink: 1,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  metricStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 1,
    lineHeight: 14,
  },
  metricSubtext: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    lineHeight: 12,
  },

  /* ── Generic Card Container (Student-matched) ── */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: DEAN_SPACING.cardRadius,
    padding: DEAN_SPACING.cardPadding,
    marginBottom: DEAN_SPACING.betweenSections,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    marginBottom: DEAN_SPACING.titleToContent,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllAction: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* ── Section Header (outside card containers) ── */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DEAN_SPACING.titleToContent,
  },

  /* ── Quick Actions / Workspace Grid (Student-matched) ── */
  workspaceGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  workspaceItem: {
    alignItems: 'center',
    flex: 1,
  },
  workspaceIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  workspaceItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },

  /* ── Empty State ── */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },

  /* ── Review Items (compact, matching Student activity) ── */
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DEAN_SPACING.rowPaddingVertical,
  },
  reviewAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  reviewContent: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  reviewAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  reviewHodInfo: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 3,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  reviewStatusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  badgePending: {
    backgroundColor: '#EFF6FF',
  },
  badgeCorrection: {
    backgroundColor: '#FFFBEB',
  },
  reviewStatusLine: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  reviewStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  textPending: {
    color: '#2563EB',
  },
  textCorrection: {
    color: '#D97706',
  },
  reviewArrowBox: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: DEAN_SPACING.dividerMarginVertical,
  },

  /* ── Assigned Department Cards (Compact Summary Layout) ── */
  deptScrollView: {
    marginHorizontal: -DEAN_SPACING.screenHorizontal,
    marginBottom: DEAN_SPACING.betweenSections,
  },
  deptScrollContent: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    gap: DEAN_SPACING.horizontalCardGap,
  },
  deptCard: {
    width: 144,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  deptTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deptIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  deptBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  deptPendingText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },

  /* ── Recent Activity (Clean Uncluttered Single Info Rows) ── */
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DEAN_SPACING.rowPaddingVertical,
  },
  activityIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 3,
  },
  activityStatusLine: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  textVerified: {
    color: '#16A34A',
  },
  textRejected: {
    color: '#DC2626',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: DEAN_SPACING.dividerMarginVertical,
  },
});
