// ─────────────────────────────────────────────────────────────
// AchieveX — Head Dashboard (College-Wide Governance)
// Configure -> Monitor -> Analyze -> Report
// Visual Source of Truth: Achieved with unified AchieveX styling,
// shared HeadHeroCard, safe area insets, and horizontal Governance cards.
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

import {
  getHeadStore,
  subscribeHeadData,
  type HeadOverviewStats,
  type DepartmentMetric,
  type HeadRecentActivity,
  type InstitutionAchievementPolicy,
} from '../../data/headWorkspaceData';
import HeadHeroCard from './HeadHeroCard';
import StudentBottomTab from '../StudentBottomTab';

interface HeadDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  unreadNotificationCount?: number;
}

export default function HeadDashboard({
  onOpenMenu,
  onNavigate,
  unreadNotificationCount = 2,
}: HeadDashboardProps) {
  const store = getHeadStore();
  const [stats, setStats] = useState<HeadOverviewStats>(store.getOverviewStats());
  const [policy, setPolicy] = useState<InstitutionAchievementPolicy>(store.getPolicy());
  const [departments, setDepartments] = useState<DepartmentMetric[]>(store.getDepartmentMetrics());
  const [activities, setActivities] = useState<HeadRecentActivity[]>(store.getRecentActivities());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    return subscribeHeadData(() => {
      setStats(store.getOverviewStats());
      setPolicy(store.getPolicy());
      setDepartments([...store.getDepartmentMetrics()]);
      setActivities([...store.getRecentActivities()]);
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setStats(store.getOverviewStats());
      setPolicy(store.getPolicy());
      setDepartments([...store.getDepartmentMetrics()]);
      setActivities([...store.getRecentActivities()]);
      setRefreshing(false);
    }, 500);
  };

  const sortedDepts = [...departments].sort((a, b) => b.totalPoints - a.totalPoints);
  const top4Depts = sortedDepts.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR (Exact Match to Student/HOD Header)
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuIconContainer}
              activeOpacity={0.7}
              onPress={onOpenMenu}
            >
              <Ionicons name="menu-outline" size={22} color="#1E1B4B" />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingText} numberOfLines={1}>
                  Dr. S. Ramesh
                </Text>
                <View style={styles.governanceBadge}>
                  <Text style={styles.governanceBadgeText}>HEAD</Text>
                </View>
              </View>
              <Text style={styles.collegeSubtext} numberOfLines={1}>
                {policy.institutionName || 'Nandha Engineering College'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellIconContainer}
            activeOpacity={0.7}
            onPress={() => onNavigate('headNotifications')}
          >
            <Ionicons name="notifications-outline" size={21} color="#1E1B4B" />
            {unreadNotificationCount > 0 && (
              <View style={styles.notificationDot}>
                <Text style={styles.dotText}>{unreadNotificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" />
          }
        >
          {/* ════════════════════════════════════════════════
              2. STANDARDIZED HEAD HERO CARD
          ════════════════════════════════════════════════ */}
          <HeadHeroCard
            overline="COLLEGE PERFORMANCE"
            title={policy.institutionName || 'Nandha Engineering College'}
            badgeText={`v${policy.version}`}
            primaryNumber="2,840"
            primaryLabel="Verified Achievements"
            secondaryMetrics={[
              { number: '48,650', label: 'Points' },
              { number: '8', label: 'Departments' },
            ]}
            ctaText="View Performance →"
            onCtaPress={() => onNavigate('headAnalytics')}
          />

          {/* ════════════════════════════════════════════════
              3. QUICK ACTIONS ROW (Compact 4-Item Grid)
          ════════════════════════════════════════════════ */}
          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.75}
              onPress={() => onNavigate('headCollegeAchievements')}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="trophy-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.quickActionText} numberOfLines={1}>
                Achievements
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.75}
              onPress={() => onNavigate('headPointsManagement')}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="calculator-outline" size={20} color="#D97706" />
              </View>
              <Text style={styles.quickActionText} numberOfLines={1}>
                Point Rules
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.75}
              onPress={() => onNavigate('headReports')}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="document-text-outline" size={20} color="#059669" />
              </View>
              <Text style={styles.quickActionText} numberOfLines={1}>
                Reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.75}
              onPress={() => onNavigate('headDepartments')}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="business-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.quickActionText} numberOfLines={1}>
                Departments
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              4. COLLEGE OVERVIEW (Compact Breakdown Cards)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>College Overview</Text>
          </View>

          <View style={styles.breakdownRow}>
            <TouchableOpacity
              style={styles.breakdownCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('collegeStudentAchievements')}
            >
              <View style={styles.breakdownTop}>
                <Text style={styles.breakdownLabel}>STUDENT ACHIEVEMENTS</Text>
                <Ionicons name="school" size={15} color="#4F46E5" />
              </View>
              <Text style={styles.breakdownValue}>4,286</Text>
              <View style={styles.breakdownFooterRow}>
                <Text style={styles.breakdownSub}>84.1% of college total</Text>
                <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.breakdownCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('collegeFacultyAchievements')}
            >
              <View style={styles.breakdownTop}>
                <Text style={styles.breakdownLabel}>FACULTY ACHIEVEMENTS</Text>
                <Ionicons name="briefcase" size={15} color="#059669" />
              </View>
              <Text style={styles.breakdownValue}>1,248</Text>
              <View style={styles.breakdownFooterRow}>
                <Text style={styles.breakdownSub}>15.9% milestones</Text>
                <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              5. GOVERNANCE & OPERATIONS (Horizontal Scrolling Cards)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Governance & Operations</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScrollView}
          >
            {/* Card 1: Categories */}
            <TouchableOpacity
              style={styles.governanceCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('headCategoryManagement')}
            >
              <View style={[styles.govIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="layers" size={18} color="#4F46E5" />
              </View>
              <View style={styles.govTextGroup}>
                <Text style={styles.govTitle} numberOfLines={1}>
                  Categories
                </Text>
                <Text style={styles.govSubtitle} numberOfLines={1}>
                  Manage categories
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Card 2: Points & Rules */}
            <TouchableOpacity
              style={styles.governanceCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('headPointsManagement')}
            >
              <View style={[styles.govIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="calculator" size={18} color="#D97706" />
              </View>
              <View style={styles.govTextGroup}>
                <Text style={styles.govTitle} numberOfLines={1}>
                  Points & Rules
                </Text>
                <Text style={styles.govSubtitle} numberOfLines={1}>
                  Configure scoring
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Card 3: Departments */}
            <TouchableOpacity
              style={styles.governanceCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('headDepartments')}
            >
              <View style={[styles.govIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="business" size={18} color="#2563EB" />
              </View>
              <View style={styles.govTextGroup}>
                <Text style={styles.govTitle} numberOfLines={1}>
                  Departments
                </Text>
                <Text style={styles.govSubtitle} numberOfLines={1}>
                  College performance
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Card 4: Proof Rules */}
            <TouchableOpacity
              style={styles.governanceCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('headCategoryManagement')}
            >
              <View style={[styles.govIconCircle, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#059669" />
              </View>
              <View style={styles.govTextGroup}>
                <Text style={styles.govTitle} numberOfLines={1}>
                  Proof Rules
                </Text>
                <Text style={styles.govSubtitle} numberOfLines={1}>
                  Evidence requirements
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#CBD5E1" />
            </TouchableOpacity>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              6. DEPARTMENT PERFORMANCE BENCHMARK
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Department Performance</Text>
              <Text style={styles.sectionSub}>Ranked by achievement points</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate('headDepartments')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>View All 8</Text>
              <Ionicons name="chevron-forward" size={13} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          <View style={styles.deptListCard}>
            {top4Depts.map((dept, index) => {
              const rankColor =
                index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : '#64748B';
              return (
                <TouchableOpacity
                  key={dept.departmentId}
                  style={[styles.deptItemRow, index < top4Depts.length - 1 && styles.deptBorderBottom]}
                  activeOpacity={0.7}
                  onPress={() => onNavigate('headDepartmentDetails', { departmentId: dept.departmentId })}
                >
                  <View style={[styles.rankBadge, { backgroundColor: rankColor + '18' }]}>
                    <Text style={[styles.rankText, { color: rankColor }]}>#{index + 1}</Text>
                  </View>
                  <View style={styles.deptInfoCol}>
                    <Text style={styles.deptNameText} numberOfLines={1}>
                      {dept.departmentName}
                    </Text>
                    <Text style={styles.deptMetaText} numberOfLines={1}>
                      {dept.verifiedAchievements} verified • {dept.studentCount} students
                    </Text>
                  </View>
                  <View style={styles.deptPointsCol}>
                    <Text style={styles.deptPointsVal}>{dept.totalPoints.toLocaleString()}</Text>
                    <Text style={styles.deptPointsLbl}>pts</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={15} color="#CBD5E1" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ════════════════════════════════════════════════
              7. RECENT GOVERNANCE ACTIVITY
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityListCard}>
            {activities.slice(0, 4).map((act, index) => {
              const iconName =
                act.type === 'category_change'
                  ? 'layers-outline'
                  : act.type === 'point_rule_change'
                  ? 'calculator-outline'
                  : act.type === 'report_generated'
                  ? 'document-text-outline'
                  : 'ribbon-outline';
              const iconBg =
                act.type === 'category_change'
                  ? '#EEF2FF'
                  : act.type === 'point_rule_change'
                  ? '#FEF3C7'
                  : act.type === 'report_generated'
                  ? '#ECFDF5'
                  : '#EFF6FF';
              const iconColor =
                act.type === 'category_change'
                  ? '#4F46E5'
                  : act.type === 'point_rule_change'
                  ? '#D97706'
                  : act.type === 'report_generated'
                  ? '#059669'
                  : '#2563EB';

              return (
                <View
                  key={act.id}
                  style={[styles.activityRow, index < 3 && styles.deptBorderBottom]}
                >
                  <View style={[styles.activityIconBox, { backgroundColor: iconBg }]}>
                    <Ionicons name={iconName as any} size={16} color={iconColor} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle} numberOfLines={1}>
                      {act.title}
                    </Text>
                    <Text style={styles.activityDesc} numberOfLines={2}>
                      {act.description}
                    </Text>
                    <Text style={styles.activityTime}>{act.timestamp}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Bottom spacing for bottom navigation */}
          <View style={{ height: 90 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            8. HEAD WORKSPACE BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          activeTab="home"
          variant="head"
          onNavigate={(tab) => {
            if (tab === 'home') {
              // already on headDashboard
            } else if (tab === 'achievements') {
              onNavigate('headCollegeAchievements');
            } else if (tab === 'analytics') {
              onNavigate('headAnalytics');
            } else if (tab === 'reports') {
              onNavigate('headReports');
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

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
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
    borderWidth: 2,
    borderColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FAF8F5',
    flexShrink: 0,
  },
  userInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  governanceBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  governanceBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  collegeSubtext: {
    fontSize: 12,
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
    flexShrink: 0,
    marginLeft: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  /* Scrollable Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  /* Quick Actions Row */
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 2,
  },

  /* Breakdown Cards */
  breakdownRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  breakdownCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  breakdownTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  breakdownValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  breakdownSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  breakdownFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  /* Governance Horizontal Cards */
  horizontalScrollView: {
    marginBottom: 20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  governanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    width: 175,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  govIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  govTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  govTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  govSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },

  /* Department Benchmark List */
  deptListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  deptItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  deptBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
  },
  deptInfoCol: {
    flex: 1,
  },
  deptNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  deptPointsCol: {
    alignItems: 'flex-end',
    marginRight: 4,
  },
  deptPointsVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4F46E5',
  },
  deptPointsLbl: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* Recent Activity */
  activityListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'flex-start',
  },
  activityIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  activityTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
});
