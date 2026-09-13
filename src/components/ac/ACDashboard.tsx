// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Dashboard
// Refined layout: Clean Header -> Hero -> Quick Actions -> Tappable Stat Cards -> Priority Review -> Recent Activity -> AC Bottom Nav
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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Circle } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  AC_SUMMARY_DATA,
  AC_EVENT_GROUPS,
  AC_RECENT_ACTIVITIES,
  type ACEventGroup,
} from '../../data/acWorkspaceData';
import { DEFAULT_FACULTY_USER, type FacultyUser } from '../../data/facultyWorkspaceData';
import ACBottomTab from './ACBottomTab';

interface ACDashboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectGroup?: (group: ACEventGroup) => void;
  facultyUser?: FacultyUser;
  unreadNotificationCount?: number;
}

export default function ACDashboard({
  onOpenMenu,
  onNavigate,
  onSelectGroup,
  facultyUser = DEFAULT_FACULTY_USER,
  unreadNotificationCount = 3,
}: ACDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);

  // Svg Donut Gauge Dimensions
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const readyPercent = AC_SUMMARY_DATA.readyPercentage; // 82%

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleOpenGroup = (group: ACEventGroup) => {
    if (onSelectGroup) {
      onSelectGroup(group);
    } else {
      onNavigate('acGroupReview', { groupId: group.id });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. HEADER BAR (Clean, Perfectly Aligned Metadata)
        ════════════════════════════════════════════════ */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7} onPress={onOpenMenu}>
            <Ionicons name="menu-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerGreeting}>Good Morning, {facultyUser.name.split(' ')[0]} 👋</Text>
            <View style={styles.headerMetaRow}>
              <Text style={styles.headerRoleText}>Academic Coordinator</Text>
              <Text style={styles.headerDotSeparator}>•</Text>
              <Text style={styles.headerScopeText}>
                {AC_SUMMARY_DATA.assignedScope.department} • Section A
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => onNavigate('acNotifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#0F172A" />
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
              2. BLUE → INDIGO PREMIUM HERO CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.heroCardWrapper}>
            <LinearGradient
              colors={['#2563EB', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              {/* Top Label */}
              <View style={styles.heroTopRow}>
                <View style={styles.heroLabelRow}>
                  <View style={styles.heroIconCircle}>
                    <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" />
                  </View>
                  <Text style={styles.heroLabelText}>VERIFICATION OVERVIEW</Text>
                </View>

                <TouchableOpacity
                  style={styles.heroActionBtn}
                  activeOpacity={0.8}
                  onPress={() => onNavigate('acVerificationQueue', { initialTab: 'All' })}
                >
                  <Text style={styles.heroActionBtnText}>Review Queue</Text>
                  <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Body: Numbers + Donut */}
              <View style={styles.heroBodyRow}>
                <View style={styles.heroLeftCol}>
                  <View style={styles.heroNumberGroup}>
                    <Text style={styles.heroBigNumber}>{AC_SUMMARY_DATA.totalPendingReviews}</Text>
                    <Text style={styles.heroBigNumberLabel}>Pending Reviews</Text>
                  </View>
                  <Text style={styles.heroCohortText}>
                    {AC_SUMMARY_DATA.totalEventGroups} Groups • {AC_SUMMARY_DATA.assignedScope.totalStudents} Students Scope
                  </Text>

                  {/* Compact Status Breakdown */}
                  <View style={styles.heroBreakdownRow}>
                    <View style={styles.heroBreakdownPill}>
                      <View style={[styles.heroStatusDot, { backgroundColor: '#4ADE80' }]} />
                      <Text style={styles.heroBreakdownText}>{AC_SUMMARY_DATA.readyCount} Ready</Text>
                    </View>

                    <View style={styles.heroBreakdownPill}>
                      <View style={[styles.heroStatusDot, { backgroundColor: '#FDE047' }]} />
                      <Text style={styles.heroBreakdownText}>
                        {AC_SUMMARY_DATA.needAttentionCount} Need Attention
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Donut Gauge */}
                <View style={styles.heroGaugeCol}>
                  <View style={styles.donutWrapper}>
                    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                      <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                        <Circle
                          cx={size / 2}
                          cy={size / 2}
                          r={radius}
                          stroke="rgba(255, 255, 255, 0.2)"
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
                          strokeDashoffset={circumference * (1 - readyPercent / 100)}
                          strokeLinecap="round"
                          fill="none"
                        />
                      </G>
                    </Svg>

                    <View style={styles.donutTextOverlay}>
                      <Text style={styles.donutPercentText}>{readyPercent}%</Text>
                      <Text style={styles.donutLabelText}>Ready</Text>
                      <Text style={styles.donutFractionText}>
                        {AC_SUMMARY_DATA.readyCount} of {AC_SUMMARY_DATA.totalPendingReviews}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ════════════════════════════════════════════════
              3. QUICK ACTIONS (Directly Below Hero for Operational Speed)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickShortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('acVerificationQueue', { initialTab: 'All' })}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="checkbox-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.shortcutLabel}>Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('acCreditRecords')}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="school-outline" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.shortcutLabel}>Credits</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('acStudentList')}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="people-outline" size={18} color="#16A34A" />
              </View>
              <Text style={styles.shortcutLabel}>Students</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('acReports')}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="document-text-outline" size={18} color="#D97706" />
              </View>
              <Text style={styles.shortcutLabel}>Reports</Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              4. OVERVIEW STAT CARDS (ALL TAPPABLE WITH CONTEXT)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>

          <View style={styles.overviewStatsGrid}>
            <TouchableOpacity
              style={styles.overviewStatCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('acVerificationQueue', { initialTab: 'All', status: 'Pending' })}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="time" size={15} color="#2563EB" />
              </View>
              <Text style={styles.overviewStatVal}>{AC_SUMMARY_DATA.totalPendingReviews}</Text>
              <Text style={styles.overviewStatLabel}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewStatCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('acVerificationQueue', { initialTab: 'Groups' })}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="layers" size={15} color="#4F46E5" />
              </View>
              <Text style={styles.overviewStatVal}>{AC_SUMMARY_DATA.totalEventGroups}</Text>
              <Text style={styles.overviewStatLabel}>Groups</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewStatCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('acVerificationQueue', { initialTab: 'Corrections' })}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="alert-circle" size={15} color="#D97706" />
              </View>
              <Text style={styles.overviewStatVal}>{AC_SUMMARY_DATA.needAttentionCount}</Text>
              <Text style={styles.overviewStatLabel}>Corrections</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewStatCard}
              activeOpacity={0.75}
              onPress={() => onNavigate('acVerificationQueue', { initialTab: 'All', filterStatus: 'Approved' })}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="checkmark-done-circle" size={15} color="#16A34A" />
              </View>
              <Text style={styles.overviewStatVal}>{AC_SUMMARY_DATA.verifiedTodayCount}</Text>
              <Text style={styles.overviewStatLabel}>Verified</Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              5. PRIORITY REVIEW SECTION (2-3 Groups Only)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Priority Review</Text>
            <TouchableOpacity onPress={() => onNavigate('acVerificationQueue', { initialTab: 'Groups' })}>
              <Text style={styles.sectionLinkText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {AC_EVENT_GROUPS.slice(0, 3).map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              activeOpacity={0.75}
              onPress={() => handleOpenGroup(group)}
            >
              <View style={styles.groupCardTopRow}>
                <View style={styles.groupTypePill}>
                  <Ionicons name="people" size={11} color="#2563EB" style={{ marginRight: 3 }} />
                  <Text style={styles.groupTypePillText}>EVENT GROUP</Text>
                </View>
                <Text style={styles.groupStudentCount}>{group.totalSubmissions} Students</Text>
              </View>

              <Text style={styles.groupEventName}>{group.eventName}</Text>

              <Text style={styles.groupMetaText}>
                {group.achievementType} • {group.level} • {group.semester}
              </Text>

              {/* Team Tag if present */}
              {group.teamGroups && group.teamGroups.length > 0 && (
                <View style={styles.teamTagRow}>
                  <View style={styles.teamTag}>
                    <Ionicons name="ribbon-outline" size={12} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={styles.teamTagText}>
                      Team: {group.teamGroups[0].teamName} ({group.teamGroups[0].memberCount} Members • Winner)
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.groupCardDivider} />

              <View style={styles.groupCardBottomRow}>
                <View style={styles.groupBreakdownCol}>
                  <Text style={styles.readyPillText}>{group.readyCount} Ready</Text>
                  {group.issuesCount > 0 && (
                    <Text style={styles.issuesPillText}>• {group.issuesCount} Issues</Text>
                  )}
                </View>

                <View style={styles.reviewGroupBtn}>
                  <Text style={styles.reviewGroupBtnText}>Review Group</Text>
                  <Ionicons name="chevron-forward" size={13} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* ════════════════════════════════════════════════
              6. RECENT VERIFICATION ACTIVITY
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityCard}>
            {AC_RECENT_ACTIVITIES.slice(0, 3).map((act) => (
              <View key={act.id} style={styles.activityItemRow}>
                <View
                  style={[
                    styles.activityDotCircle,
                    act.type === 'approved' && { backgroundColor: '#DCFCE7' },
                    act.type === 'correction' && { backgroundColor: '#FEF3C7' },
                  ]}
                >
                  <Ionicons
                    name={act.type === 'approved' ? 'checkmark' : 'alert'}
                    size={12}
                    color={act.type === 'approved' ? '#16A34A' : '#D97706'}
                  />
                </View>

                <View style={styles.activityContentCol}>
                  <Text style={styles.activityTitleText}>{act.title}</Text>
                  <Text style={styles.activityDescText}>{act.description}</Text>
                </View>

                <Text style={styles.activityTimeText}>{act.time}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. AC BOTTOM NAVIGATION (Standardized 5-Tab Bar)
        ════════════════════════════════════════════════ */}
        <ACBottomTab activeTab="home" onNavigate={onNavigate} />
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

  /* Header (Clean, Aligned Metadata) */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerRoleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  headerDotSeparator: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 5,
  },
  headerScopeText: {
    fontSize: 12,
    color: '#64748B',
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Scroll Content */
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 130, // Prevents bottom navigation overlap
  },

  /* Blue -> Indigo Hero Card */
  heroCardWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  heroLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.6,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroActionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 2,
  },
  heroBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeftCol: {
    flex: 1,
    marginRight: 10,
  },
  heroNumberGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  heroBigNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginRight: 6,
  },
  heroBigNumberLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroCohortText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  heroBreakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroBreakdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  heroBreakdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Donut Gauge */
  heroGaugeCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutWrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  donutLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FDE047',
    letterSpacing: 0.3,
  },
  donutFractionText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionLinkText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Quick Actions (4-button row) */
  quickShortcutsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  shortcutBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shortcutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  shortcutLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Overview 4-Stat Grid (Tappable Cards) */
  overviewStatsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  overviewStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  overviewStatVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  overviewStatLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
    textAlign: 'center',
  },

  /* Priority Group Card */
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  groupCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  groupTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupTypePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.4,
  },
  groupStudentCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  groupEventName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 3,
  },
  groupMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  teamTagRow: {
    marginTop: 6,
  },
  teamTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  teamTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  groupCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  groupCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupBreakdownCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readyPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  issuesPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  reviewGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewGroupBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },

  /* Activity Card */
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityDotCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityContentCol: {
    flex: 1,
  },
  activityTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityDescText: {
    fontSize: 11,
    color: '#64748B',
  },
  activityTimeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginLeft: 6,
  },
});
