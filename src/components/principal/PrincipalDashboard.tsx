// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Dashboard
// Highest institutional oversight role.
// Structure:
// Safe Header -> College Performance Hero -> Quick Actions -> College Overview ->
// Needs Your Attention -> Department Performance -> Institution Responsibility ->
// Recent Activity -> Bottom Navigation
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
  principalDataStore,
  DEMO_PRINCIPAL_USER,
  type PrincipalDepartmentMetric,
  type PrincipalInstitutionAttentionItem,
  type DeanPersonalSubmission,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';
import { PRINCIPAL_SPACING } from './principalSpacing';

interface PrincipalDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  unreadNotificationCount?: number;
}

export default function PrincipalDashboard({
  onOpenMenu,
  onNavigate,
  unreadNotificationCount = 2,
}: PrincipalDashboardProps) {
  const [overview, setOverview] = useState(principalDataStore.getOverviewStats());
  const [attentionItems, setAttentionItems] = useState<PrincipalInstitutionAttentionItem[]>(
    principalDataStore.getAttentionItems()
  );
  const [departments, setDepartments] = useState<PrincipalDepartmentMetric[]>(
    principalDataStore.getDepartments()
  );
  const [submissions, setSubmissions] = useState<DeanPersonalSubmission[]>(
    principalDataStore.getSubmissions()
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    return principalDataStore.subscribe(() => {
      setOverview(principalDataStore.getOverviewStats());
      setAttentionItems(principalDataStore.getAttentionItems());
      setDepartments(principalDataStore.getDepartments());
      setSubmissions(principalDataStore.getSubmissions());
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setOverview(principalDataStore.getOverviewStats());
      setAttentionItems(principalDataStore.getAttentionItems());
      setDepartments(principalDataStore.getDepartments());
      setSubmissions(principalDataStore.getSubmissions());
      setRefreshing(false);
    }, 400);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const pendingDeanReviews = submissions.filter((s) => s.status === 'Pending Review').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. SAFE HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.identityCol}>
              <Text style={styles.greetingText}>
                {getGreeting()}, {DEMO_PRINCIPAL_USER.name}
              </Text>
              <Text style={styles.roleSubtext} numberOfLines={1}>
                Principal • {DEMO_PRINCIPAL_USER.institution}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            activeOpacity={0.7}
            onPress={() => onNavigate('principalNotifications')}
          >
            <Ionicons name="notifications-outline" size={21} color="#0F172A" />
            {unreadNotificationCount > 0 && (
              <View style={styles.notifDot}>
                <Text style={styles.notifDotText}>
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT BODY
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={[
            styles.bodyContent,
            { paddingBottom: PRINCIPAL_SPACING.bottomNavClearance },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* ════════════════════════════════════════════════
              2. COLLEGE PERFORMANCE HERO
          ════════════════════════════════════════════════ */}
          <PrincipalHeroCard
            overline="COLLEGE OVERVIEW"
            primaryNumber={overview.totalAchievements.toLocaleString()}
            primaryLabel="Verified Achievements"
            subtitle={`Across ${overview.departmentCount} active departments`}
            secondaryTitle="SNAPSHOT"
            secondaryMetrics={[
              { number: '48.6K', label: 'Points' },
              { number: `${overview.departmentCount}/${overview.departmentCount}`, label: 'Active Depts' },
            ]}
            ctaText="View Performance"
            onCtaPress={() => onNavigate('principalPerformance')}
          />

          {/* ════════════════════════════════════════════════
              3. QUICK ACTIONS (Matching Student Workspace Grid)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeaderTitle}>Quick Actions</Text>
            <View style={styles.workspaceGrid}>
              {/* Approvals */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('principalVerificationQueue')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="checkbox-outline" size={22} color="#2563EB" />
                  {pendingDeanReviews > 0 && (
                    <View style={styles.workspaceBadge}>
                      <Text style={styles.workspaceBadgeText}>{pendingDeanReviews}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.workspaceItemText}>Approvals</Text>
              </TouchableOpacity>

              {/* Departments */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('principalDepartments')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="business-outline" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.workspaceItemText}>Departments</Text>
              </TouchableOpacity>

              {/* Reports */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('principalReports')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="document-text-outline" size={22} color="#D97706" />
                </View>
                <Text style={styles.workspaceItemText}>Reports</Text>
              </TouchableOpacity>

              {/* Assign */}
              <TouchableOpacity
                style={styles.workspaceItem}
                activeOpacity={0.7}
                onPress={() => onNavigate('principalDeanAssignments')}
              >
                <View style={[styles.workspaceIconBg, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="people-outline" size={22} color="#059669" />
                </View>
                <Text style={styles.workspaceItemText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. INSTITUTION OVERVIEW (Compact Horizontal Cards)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Institution Overview</Text>
            <TouchableOpacity onPress={() => onNavigate('principalPerformance')}>
              <Text style={styles.sectionLink}>View Analytics ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardsScroll}
          >
            {/* Students */}
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('collegeStudentAchievements')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="school-outline" size={17} color="#2563EB" />
              </View>
              <Text style={styles.statNumber}>{overview.totalStudents.toLocaleString()}</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel} numberOfLines={1}>Students</Text>
                <Ionicons name="chevron-forward" size={11} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Faculty */}
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('collegeFacultyAchievements')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="person-outline" size={17} color="#16A34A" />
              </View>
              <Text style={styles.statNumber}>{overview.totalFaculty}</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel} numberOfLines={1}>Faculty</Text>
                <Ionicons name="chevron-forward" size={11} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Achievements */}
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('collegeStudentAchievements')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: '#FAF5FF' }]}>
                <Ionicons name="ribbon-outline" size={17} color="#9333EA" />
              </View>
              <Text style={styles.statNumber}>4,286</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel} numberOfLines={1}>Achievements</Text>
                <Ionicons name="chevron-forward" size={11} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Departments */}
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('principalDepartments')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: '#FEFCE8' }]}>
                <Ionicons name="business-outline" size={17} color="#D97706" />
              </View>
              <Text style={styles.statNumber}>{overview.departmentCount}</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel} numberOfLines={1}>Departments</Text>
                <Ionicons name="chevron-forward" size={11} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* ════════════════════════════════════════════════
              5. NEEDS YOUR ATTENTION (Clean Non-Alarming Cards)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.titleWithDot}>
              <View style={styles.attentionDot} />
              <Text style={styles.sectionTitle}>Needs Your Attention</Text>
            </View>
            <View style={styles.badgeCountPill}>
              <Text style={styles.badgeCountText}>{attentionItems.length}</Text>
            </View>
          </View>

          {attentionItems.length > 0 ? (
            attentionItems.map((item) => (
              <View key={item.id} style={styles.attentionCard}>
                <View style={[styles.attentionIconCircle, { backgroundColor: '#FFFBEB' }]}>
                  <Ionicons
                    name={item.type === 'dean_approval' ? 'checkbox-outline' : 'alert-circle-outline'}
                    size={18}
                    color="#D97706"
                  />
                </View>

                <View style={styles.attentionBodyCol}>
                  <Text style={styles.attentionTitle}>{item.title}</Text>
                  <Text style={styles.attentionDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.attentionActionBtn}
                  activeOpacity={0.8}
                  onPress={() => onNavigate(item.actionRoute, { targetId: item.targetId })}
                >
                  <Text style={styles.attentionActionText}>{item.actionText} →</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyAttentionCard}>
              <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
              <Text style={styles.emptyAttentionText}>
                You're all caught up! No institutional items require immediate authority.
              </Text>
            </View>
          )}

          {/* ════════════════════════════════════════════════
              6. DEPARTMENT PERFORMANCE (Compact Preview Rows)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Department Performance</Text>
              <TouchableOpacity onPress={() => onNavigate('principalDepartments')}>
                <Text style={styles.sectionLink}>View All ({departments.length}) ›</Text>
              </TouchableOpacity>
            </View>

            {departments.slice(0, 3).map((dept, idx) => (
              <View key={dept.id}>
                {idx > 0 && <View style={styles.deptRowDivider} />}
                <TouchableOpacity
                  style={styles.deptRowItem}
                  activeOpacity={0.7}
                  onPress={() => onNavigate('principalDepartmentDetails', { departmentId: dept.id })}
                >
                  <View style={styles.deptRankBadge}>
                    <Text style={styles.deptRankText}>#{idx + 1}</Text>
                  </View>

                  <View style={styles.deptInfoCol}>
                    <Text style={styles.deptNameText} numberOfLines={1}>
                      {dept.name}
                    </Text>
                    <Text style={styles.deptMetaText} numberOfLines={1}>
                      {dept.achievementsCount} Achievements • HOD: {dept.hodName}
                    </Text>
                  </View>

                  <View style={styles.deptScoreCol}>
                    <Text style={styles.deptPointsText}>{dept.pointsTotal.toLocaleString()} pts</Text>
                    <Ionicons name="chevron-forward" size={15} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* ════════════════════════════════════════════════
              7. RECENT ACTIVITY (Compact Structured Rows)
          ════════════════════════════════════════════════ */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Recent Activity</Text>
            </View>

            {/* Activity 1 */}
            <View style={styles.activityItem}>
              <View style={[styles.activityIconCircle, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="checkmark-done" size={15} color="#059669" />
              </View>
              <View style={styles.activityBodyCol}>
                <Text style={styles.activityTitle}>Dean Achievement Verified</Text>
                <Text style={styles.activityDesc}>Dr. K. S. Lakshmi • 100 pts</Text>
                <Text style={styles.activityTime}>Verified • 2 days ago</Text>
              </View>
            </View>

            <View style={styles.deptRowDivider} />

            {/* Activity 2 */}
            <View style={styles.activityItem}>
              <View style={[styles.activityIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="ribbon-outline" size={15} color="#2563EB" />
              </View>
              <View style={styles.activityBodyCol}>
                <Text style={styles.activityTitle}>Department Milestone</Text>
                <Text style={styles.activityDesc}>CSE surpassed 8,000 points</Text>
                <Text style={styles.activityTime}>Milestone • 3 days ago</Text>
              </View>
            </View>

            <View style={styles.deptRowDivider} />

            {/* Activity 3 */}
            <View style={styles.activityItem}>
              <View style={[styles.activityIconCircle, { backgroundColor: '#FEFCE8' }]}>
                <Ionicons name="people-outline" size={15} color="#D97706" />
              </View>
              <View style={styles.activityBodyCol}>
                <Text style={styles.activityTitle}>Dean Scope Updated</Text>
                <Text style={styles.activityDesc}>CSE (Cyber Security) • Dr. Kumar V</Text>
                <Text style={styles.activityTime}>Governance • 5 days ago</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            8. PRINCIPAL BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <PrincipalBottomTab
          activeTab="home"
          onNavigate={onNavigate}
          pendingApprovalsCount={pendingDeanReviews}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  identityCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  roleSubtext: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  titleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attentionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
    marginRight: 8,
  },
  badgeCountPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },

  /* Card Container (Student-matched) */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: PRINCIPAL_SPACING.cardRadius,
    padding: PRINCIPAL_SPACING.cardPadding,
    marginHorizontal: PRINCIPAL_SPACING.screenHorizontal,
    marginBottom: PRINCIPAL_SPACING.betweenSections,
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
    marginBottom: PRINCIPAL_SPACING.titleToContent,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Workspace Grid (Quick Actions) */
  workspaceGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  workspaceItem: {
    alignItems: 'center',
    flex: 1,
  },
  workspaceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  workspaceBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  workspaceBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  workspaceItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },

  /* Institution Overview Stat Cards */
  horizontalCardsScroll: {
    paddingLeft: PRINCIPAL_SPACING.screenHorizontal,
    paddingRight: 8,
    paddingBottom: 4,
    gap: 8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    width: 124,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  /* Needs Your Attention Cards */
  attentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: PRINCIPAL_SPACING.screenHorizontal,
    marginBottom: 8,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  attentionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  attentionBodyCol: {
    flex: 1,
    marginRight: 8,
  },
  attentionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  attentionDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  attentionActionBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  attentionActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyAttentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: PRINCIPAL_SPACING.screenHorizontal,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  emptyAttentionText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },

  /* Department Performance Rows */
  deptRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deptRowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  deptRankBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  deptRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  deptInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  deptNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  deptScoreCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deptPointsText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 4,
  },

  /* Recent Activity */
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  activityIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityBodyCol: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  activityTime: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
});
