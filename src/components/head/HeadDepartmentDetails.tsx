// ─────────────────────────────────────────────────────────────
// AchieveX — Department Drill-Down Details (Head Workspace)
// Comprehensive department audit, verified achievements, and report triggers
// ─────────────────────────────────────────────────────────────

import React from 'react';
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

import {
  getHeadStore,
  type DepartmentMetric,
} from '../../data/headWorkspaceData';
import StudentBottomTab from '../StudentBottomTab';

interface HeadDepartmentDetailsProps {
  departmentId?: string;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HeadDepartmentDetails({
  departmentId = 'CSE_IOT',
  onNavigate,
}: HeadDepartmentDetailsProps) {
  const store = getHeadStore();
  const departments = store.getDepartmentMetrics();
  const dept = departments.find((d) => d.departmentId === departmentId) || departments[0];

  // Achievements from this department
  const deptAchievements = store.getAchievements().filter((a) => a.departmentId === dept.departmentId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => onNavigate('headDepartments')}
          >
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
              {dept.departmentName}
            </Text>
            <Text style={styles.headerSubtitle}>Institutional Department Audit</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* ════════════════════════════════════════════════
              2. DEPARTMENT HERO CARD (Deep Indigo Family)
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#1E1B4B', '#312E81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.deptOverline}>DEPARTMENT PERFORMANCE PROFILE</Text>
                <Text style={styles.deptMainTitle} numberOfLines={1} ellipsizeMode="tail">
                  {dept.departmentName}
                </Text>
                <Text style={styles.hodNameText} numberOfLines={1}>
                  HOD: {dept.hodName}
                </Text>
              </View>
              <View style={styles.deptIdBadge}>
                <Text style={styles.deptIdText}>{dept.departmentId}</Text>
              </View>
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatVal}>{dept.totalPoints.toLocaleString()}</Text>
                <Text style={styles.heroStatLbl}>Total Points</Text>
              </View>
              <View style={styles.heroStatDiv} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatVal}>{dept.verifiedAchievements}</Text>
                <Text style={styles.heroStatLbl}>Verified</Text>
              </View>
              <View style={styles.heroStatDiv} />
              <View style={styles.heroStatItem}>
                <Text style={[styles.heroStatVal, { color: '#34D399' }]}>{dept.participationRate ?? 85}%</Text>
                <Text style={styles.heroStatLbl}>Participation</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deptReportBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('headReports', { departmentId: dept.departmentId || dept.department })}
            >
              <Ionicons name="document-text-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.deptReportBtnText}>Generate Department Audit Report</Text>
              <Ionicons name="arrow-forward" size={13} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              3. DEMOGRAPHIC BREAKDOWN
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionSubtitle}>FACULTY & STUDENT DEMOGRAPHICS</Text>
          <View style={styles.demoGrid}>
            <View style={styles.demoCard}>
              <View style={styles.demoTop}>
                <Text style={styles.demoLabel}>STUDENTS</Text>
                <Ionicons name="school-outline" size={16} color="#4F46E5" />
              </View>
              <Text style={styles.demoNum}>{dept.studentCount}</Text>
              <Text style={styles.demoSub}>{dept.participationRate ?? 85}% submitted achievements</Text>
            </View>

            <View style={styles.demoCard}>
              <View style={styles.demoTop}>
                <Text style={styles.demoLabel}>FACULTY</Text>
                <Ionicons name="briefcase-outline" size={16} color="#059669" />
              </View>
              <Text style={styles.demoNum}>{dept.facultyCount}</Text>
              <Text style={styles.demoSub}>Mentors, Proctors & ACs</Text>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. RECENT VERIFIED ACHIEVEMENTS FROM THIS DEPT
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionSubtitle}>
            RECENT VERIFIED SUBMISSIONS ({deptAchievements.length})
          </Text>

          {deptAchievements.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No verified achievements in this sample cycle.</Text>
            </View>
          ) : (
            deptAchievements.map((item) => (
              <View key={item.id} style={styles.achieveCard}>
                <View style={styles.achieveHeader}>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>{item.userType}</Text>
                  </View>
                  <Text style={styles.ptsBadge}>+{item.awardedPoints} pts</Text>
                </View>

                <Text style={styles.achieveTitle} numberOfLines={1} ellipsizeMode="tail">
                  {item.title}
                </Text>
                <Text style={styles.achieveEvent} numberOfLines={1} ellipsizeMode="tail">
                  {item.eventName || item.organizer}
                </Text>

                <View style={styles.achieveFooter}>
                  <Text style={styles.achieveUser} numberOfLines={1}>
                    {item.userName} ({item.userRollOrId || item.rollOrEmpId})
                  </Text>
                  <Text style={styles.achieveCategory}>{item.categoryName || item.categoryTitle}</Text>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            BOTTOM NAVIGATION TAB BAR
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          activeTab="home"
          variant="head"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('headDashboard');
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
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  deptOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A5B4FC',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  deptMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hodNameText: {
    fontSize: 12,
    color: '#C7D2FE',
    fontWeight: '600',
    marginTop: 2,
  },
  deptIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  deptIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLbl: {
    fontSize: 10,
    color: '#C7D2FE',
    marginTop: 2,
  },
  heroStatDiv: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  deptReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    borderRadius: 10,
  },
  deptReportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  demoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  demoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  demoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  demoNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  demoSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  achieveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  achieveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  ptsBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  achieveTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  achieveEvent: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  achieveFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  achieveUser: {
    fontSize: 10,
    color: '#475569',
    flex: 1,
    marginRight: 8,
  },
  achieveCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    flexShrink: 0,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
