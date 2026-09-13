// ─────────────────────────────────────────────────────────────
// AchieveX — College Achievement Overview (Level 1 Drill-Down)
// Shared across Head and Principal workspaces.
// Displays department-wise breakdown cards with verified totals.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getCollegeStudentDepartmentBreakdown,
  getCollegeFacultyDepartmentBreakdown,
  type CollegeDepartmentBreakdown,
} from '../../data/collegeDrilldownData';

interface CollegeAchievementOverviewProps {
  targetType: 'student' | 'faculty';
  viewerRole: 'head' | 'principal';
  onGoBack: () => void;
  onSelectDepartment: (department: CollegeDepartmentBreakdown) => void;
}

export default function CollegeAchievementOverview({
  targetType,
  viewerRole,
  onGoBack,
  onSelectDepartment,
}: CollegeAchievementOverviewProps) {
  const insets = useSafeAreaInsets();
  const isStudent = targetType === 'student';

  const departments = isStudent
    ? getCollegeStudentDepartmentBreakdown()
    : getCollegeFacultyDepartmentBreakdown();

  const title = isStudent ? 'Student Achievements' : 'Faculty Achievements';
  const subtitle = isStudent
    ? 'Achievement activity across departments.'
    : 'Faculty milestone activity across departments.';

  // Bottom clearance ensuring smooth scrolling above bottom navigation
  const bottomPadding = insets.bottom + 80;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={onGoBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            2. DEPARTMENT LIST
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionOverline}>ALL DEPARTMENTS</Text>
            <Text style={styles.deptCountPill}>{departments.length} Branches</Text>
          </View>

          {departments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name={isStudent ? 'school-outline' : 'briefcase-outline'}
                size={36}
                color="#94A3B8"
              />
              <Text style={styles.emptyTitle}>
                {isStudent ? 'No Student Achievements' : 'No Faculty Achievements'}
              </Text>
              <Text style={styles.emptySub}>
                {isStudent
                  ? 'No verified student achievements are available for this department.'
                  : 'No verified faculty achievements are available for this department.'}
              </Text>
            </View>
          ) : (
            departments.map((dept) => (
              <TouchableOpacity
                key={dept.id}
                style={styles.departmentCard}
                activeOpacity={0.75}
                onPress={() => onSelectDepartment(dept)}
              >
                <View style={styles.cardLeftCol}>
                  <Text style={styles.deptCodeText}>{dept.code}</Text>
                  <Text style={styles.deptFullNameText} numberOfLines={1}>
                    {dept.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.peopleCountText}>{dept.countLabel}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.achievementCountText}>
                      <Text style={styles.achievementBold}>
                        {dept.verifiedAchievementsCount.toLocaleString()}
                      </Text>{' '}
                      Achievements
                    </Text>
                  </View>
                </View>

                <View style={styles.chevronWrapper}>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  sectionOverline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#64748B',
  },
  deptCountPill: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  departmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardLeftCol: {
    flex: 1,
    paddingRight: 8,
  },
  deptCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptFullNameText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  peopleCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  achievementCountText: {
    fontSize: 12,
    color: '#475569',
  },
  achievementBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  chevronWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    maxWidth: 280,
  },
});
