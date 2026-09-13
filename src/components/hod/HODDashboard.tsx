// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Dashboard
// Clean Mobile Dashboard: Header -> Performance Hero -> Quick Actions -> Overview -> Needs Your Review -> Recent Activity -> Bottom Nav
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
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHODStore,
  subscribeHODData,
  type HODUser,
  type HODFacultySubmission,
  type HODRecentActivity,
} from '../../data/hodWorkspaceData';
import HODHeroCard from './HODHeroCard';
import HODBottomTab from './HODBottomTab';

interface HODDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  unreadNotificationCount?: number;
}

export default function HODDashboard({
  onOpenMenu,
  onNavigate,
  unreadNotificationCount = 2,
}: HODDashboardProps) {
  const store = getHODStore();
  const [user, setUser] = useState<HODUser>(store.user);
  const [submissions, setSubmissions] = useState<HODFacultySubmission[]>(store.submissions);
  const [activities, setActivities] = useState<HODRecentActivity[]>(store.activities);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    return subscribeHODData(() => {
      setUser({ ...store.user });
      setSubmissions([...store.submissions]);
      setActivities([...store.activities]);
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setUser({ ...store.user });
      setSubmissions([...store.submissions]);
      setActivities([...store.activities]);
      setRefreshing(false);
    }, 600);
  };

  const pendingList = submissions.filter((s) => s.status === 'Pending').slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
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
                <Text style={styles.greetingText}>Good Morning, Dr. Arun</Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <View style={styles.roleBadgeRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>HOD — CSE (IoT)</Text>
                </View>
                <Text style={styles.collegeText}>Nandha Engg College</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellIconContainer}
            activeOpacity={0.7}
            onPress={() => onNavigate('hodNotifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            {unreadNotificationCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadNotificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            MAIN SCROLLABLE CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
        >
          {/* ════════════════════════════════════════════════
              2. STANDARDIZED HOD HERO CARD
          ════════════════════════════════════════════════ */}
          <HODHeroCard
            title="DEPARTMENT PERFORMANCE"
            subtitle={user.department.name}
            icon="business"
            primaryNumber={user.stats.totalAchievements}
            primaryLabel="Achievements"
            primarySubtext="Across Students & Faculty"
            gaugePercent={user.stats.achieversPercentage}
            gaugeNumber={`${user.stats.achieversPercentage}%`}
            gaugeLabel="Achievers"
            gaugeSubtext="Rate"
            ctaText="View Performance"
            onCtaPress={() => onNavigate('hodDepartmentPerformance')}
          />

          {/* ════════════════════════════════════════════════
              3. QUICK ACTIONS (Exact match to Student)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeaderTitle}>Quick Actions</Text>
            <View style={styles.workspaceGrid}>
              {/* Action 1: Verify */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('hodVerificationQueue')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="checkbox-outline" size={22} color="#2563EB" />
                </View>
                <Text style={styles.workspaceItemText}>Verify</Text>
              </TouchableOpacity>

              {/* Action 2: Assign */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('hodAssignments')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#CCFBF1' }]}>
                  <Ionicons name="people-circle" size={22} color="#0F766E" />
                </View>
                <Text style={styles.workspaceItemText}>Assign</Text>
              </TouchableOpacity>

              {/* Action 3: Upload */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('submitAchievement')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="cloud-upload" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.workspaceItemText}>Upload</Text>
              </TouchableOpacity>

              {/* Action 4: Reports */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('hodReports')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="document-text" size={22} color="#16A34A" />
                </View>
                <Text style={styles.workspaceItemText}>Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. DEPARTMENT OVERVIEW (Horizontal Scrolling Row)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Department Overview</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScrollView}
          >
            {/* Card 1: Pending */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.7}
              onPress={() => onNavigate('hodVerificationQueue')}
            >
              <Text style={styles.metricCardTitle}>Pending</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="hourglass" size={16} color="#D97706" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={[styles.metricNumber, { color: '#D97706' }]}>
                    {user.stats.pendingReviewsCount}
                  </Text>
                  <Text style={styles.metricSubtext}>Reviews</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 2: Faculty */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.7}
              onPress={() => onNavigate('hodFacultyList')}
            >
              <Text style={styles.metricCardTitle}>Faculty</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="briefcase" size={16} color="#2563EB" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>{user.stats.facultyCount}</Text>
                  <Text style={styles.metricSubtext}>Members</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 3: Students */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.7}
              onPress={() => onNavigate('hodStudentList')}
            >
              <Text style={styles.metricCardTitle}>Students</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="people" size={16} color="#16A34A" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>{user.stats.studentsCount}</Text>
                  <Text style={styles.metricSubtext}>Enrolled</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 4: Achievements */}
            <TouchableOpacity
              style={styles.metricCard}
              activeOpacity={0.7}
              onPress={() => onNavigate('hodDepartmentPerformance')}
            >
              <Text style={styles.metricCardTitle}>Achievements</Text>
              <View style={styles.metricCardBody}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="trophy" size={16} color="#7C3AED" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={styles.metricNumber}>{user.stats.totalAchievements}</Text>
                  <Text style={styles.metricSubtext}>Total</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              5. NEEDS YOUR REVIEW (COMPACT CARDS)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Needs Your Review</Text>
              <Text style={styles.sectionSubTitle}>Faculty submissions awaiting verification</Text>
            </View>
            <TouchableOpacity
              onPress={() => onNavigate('hodVerificationQueue')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllLink}>View All ({user.stats.pendingReviewsCount})</Text>
            </TouchableOpacity>
          </View>

          {pendingList.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#16A34A" />
              <Text style={styles.emptyCardTitle}>You're all caught up!</Text>
              <Text style={styles.emptyCardSub}>No faculty submissions waiting for review.</Text>
            </View>
          ) : (
            pendingList.map((sub) => (
              <View key={sub.id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <View style={styles.facultyAvatar}>
                    <Ionicons name="person" size={14} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.facultyNameText}>{sub.facultyName}</Text>
                    <Text style={styles.facultySubText}>
                      {sub.designation} • {sub.facultyId}
                    </Text>
                  </View>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>Pending Review</Text>
                  </View>
                </View>

                <Text style={styles.achievementTitleText}>{sub.achievementTitle}</Text>
                <Text style={styles.achievementMetaText}>
                  {sub.achievementType} • {sub.level} • {sub.semester || 'Current Semester'}
                </Text>

                <View style={styles.reviewCardFooter}>
                  <Text style={styles.submittedAtText}>Submitted {sub.submittedAt}</Text>
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    activeOpacity={0.75}
                    onPress={() => onNavigate('hodFacultyReview', { submissionId: sub.id })}
                  >
                    <Text style={styles.reviewBtnText}>Review</Text>
                    <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* ════════════════════════════════════════════════
              6. RECENT DEPARTMENT ACTIVITY
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Department Activity</Text>
          </View>

          <View style={styles.activityCardContainer}>
            {activities.map((act, index) => (
              <View
                key={act.id}
                style={[
                  styles.activityItemRow,
                  index < activities.length - 1 && styles.activityItemBorder,
                ]}
              >
                <View style={[styles.activityIconBox, { backgroundColor: `${act.badgeColor}15` }]}>
                  <Ionicons name={act.iconName as any} size={16} color={act.badgeColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{act.title}</Text>
                  <Text style={styles.activitySubtitle}>{act.subtitle}</Text>
                </View>
                <Text style={styles.activityTimestamp}>{act.timestamp}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            BOTTOM NAVIGATION (HOD-SPECIFIC)
        ════════════════════════════════════════════════ */}
        <HODBottomTab activeTab="home" onNavigate={onNavigate} />
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
    paddingTop: 12,
    paddingBottom: 16,
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
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  roleBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  collegeText: {
    fontSize: 12,
    color: '#6B7280',
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
  bellBadge: {
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
  bellBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubTitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  workspaceGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
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
    marginBottom: 8,
  },
  workspaceItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 15,
  },
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
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  metricCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTextGroup: {
    flex: 1,
  },
  metricNumber: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 22,
  },
  metricSubtext: {
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  facultyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  facultySubText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  achievementTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  achievementMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  reviewCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submittedAtText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  reviewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activityCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  activityItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  activityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  activitySubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  activityTimestamp: {
    fontSize: 10,
    color: '#94A3B8',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyCardSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
});
