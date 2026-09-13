// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Department Details
// Comprehensive institutional drill-down into an individual academic department.
// Structure:
// Safe Header -> Department Hero -> Responsibility Card -> Performance Summary ->
// Year-wise Breakdown -> Category Performance -> Recent Achievements (Read-only)
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
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  principalDataStore,
  type PrincipalDepartmentMetric,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';

interface PrincipalDepartmentDetailsProps {
  departmentId: string;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalDepartmentDetails({
  departmentId,
  onNavigate,
  onGoBack,
}: PrincipalDepartmentDetailsProps) {
  const [department, setDepartment] = useState<PrincipalDepartmentMetric | undefined>(
    principalDataStore.getDepartmentById(departmentId) || principalDataStore.getDepartments()[0]
  );

  useEffect(() => {
    return principalDataStore.subscribe(() => {
      setDepartment(principalDataStore.getDepartmentById(departmentId));
    });
  }, [departmentId]);

  if (!department) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Department Not Found</Text>
          <TouchableOpacity style={styles.errorBackBtn} onPress={onGoBack}>
            <Text style={styles.errorBackBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Simulated academic year breakdown
  const yearBreakdown = [
    { year: '1st Year', students: 60, achievements: 48, points: 720 },
    { year: '2nd Year', students: 60, achievements: 98, points: 1640 },
    { year: '3rd Year', students: 60, achievements: 142, points: 2680 },
    { year: '4th Year', students: 60, achievements: 132, points: 2380 },
  ];

  // Category distributions
  const categoryBreakdown = [
    { name: 'Research, Publication & IPR', count: 110, points: 2450, color: '#2563EB' },
    { name: 'Technical Competitions & Hackathons', count: 134, points: 2180, color: '#D97706' },
    { name: 'Industry Certification & NPTEL', count: 96, points: 1540, color: '#059669' },
    { name: 'Workshops & FDPs', count: 80, points: 1250, color: '#7C3AED' },
  ];

  // Read-only recent department achievements
  const recentAchievements = [
    {
      id: 'd_ach_1',
      studentName: 'Kavitha M (3rd Year)',
      title: 'Smart India Hackathon 1st Prize Winner',
      category: 'Technical Competitions',
      date: '2026-08-28',
      points: 150,
    },
    {
      id: 'd_ach_2',
      studentName: 'Dr. Arun Kumar (HOD)',
      title: 'AICTE Research Grant for Edge Computing Node',
      category: 'Funded Research Grants',
      date: '2026-08-20',
      points: 250,
    },
    {
      id: 'd_ach_3',
      studentName: 'Vignesh R (4th Year)',
      title: 'AWS Certified Solutions Architect Associate',
      category: 'Industry Certification',
      date: '2026-08-14',
      points: 80,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.identityCol}>
            <Text style={styles.screenTitle}>{department.name}</Text>
            <Text style={styles.screenSubtext}>Department Institutional Audit</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <PrincipalHeroCard
            overline="DEPARTMENT PERFORMANCE"
            title={department.name}
            subtitle={`HOD: ${department.hodName} • Dean: ${department.assignedDeanName}`}
            icon="business"
            badgeText={department.code}
            primaryNumber={department.achievementsCount}
            primaryLabel="Verified Achievements"
            secondaryMetrics={[
              { number: department.pointsTotal.toLocaleString(), label: 'Points' },
              { number: department.studentsCount, label: 'Students' },
              { number: department.facultyCount, label: 'Faculty' },
            ]}
            compact
          />

          {/* Responsibility Governance Card */}
          <View style={styles.responsibilityCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Institutional Governance Chain</Text>
              <TouchableOpacity
                style={styles.changeDeanBtn}
                onPress={() => onNavigate('principalDeanAssignments')}
              >
                <Text style={styles.changeDeanBtnText}>Manage Dean →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.governanceChain}>
              {/* Principal */}
              <View style={styles.governanceStep}>
                <View style={[styles.govIcon, { backgroundColor: '#FEFCE8' }]}>
                  <Ionicons name="school" size={16} color="#B45309" />
                </View>
                <View style={styles.govTextCol}>
                  <Text style={styles.govRole}>PRINCIPAL (INSTITUTIONAL HEAD)</Text>
                  <Text style={styles.govName}>Dr. S. Arumugam</Text>
                </View>
              </View>

              <View style={styles.govArrow}>
                <Ionicons name="arrow-down" size={14} color="#94A3B8" />
              </View>

              {/* Dean */}
              <View style={styles.governanceStep}>
                <View style={[styles.govIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="shield-checkmark" size={16} color="#2563EB" />
                </View>
                <View style={styles.govTextCol}>
                  <Text style={styles.govRole}>ASSIGNED DEAN (HOD VERIFICATION)</Text>
                  <Text style={[styles.govName, department.assignedDeanName === 'Unassigned' && { color: '#DC2626' }]}>
                    {department.assignedDeanName}
                  </Text>
                </View>
              </View>

              <View style={styles.govArrow}>
                <Ionicons name="arrow-down" size={14} color="#94A3B8" />
              </View>

              {/* HOD */}
              <View style={styles.governanceStep}>
                <View style={[styles.govIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="business" size={16} color="#16A34A" />
                </View>
                <View style={styles.govTextCol}>
                  <Text style={styles.govRole}>HEAD OF DEPARTMENT (FACULTY VERIFICATION)</Text>
                  <Text style={styles.govName}>
                    {department.hodName} ({department.hodEmployeeId})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Performance Summary Indicators */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Performance Indicators</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {Math.round((department.activeAchieversCount / department.studentsCount) * 100)}%
                </Text>
                <Text style={styles.summaryLabel}>Participation Rate</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {Math.round(department.pointsTotal / department.studentsCount)}
                </Text>
                <Text style={styles.summaryLabel}>Points Per Student</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{department.activeAchieversCount}</Text>
                <Text style={styles.summaryLabel}>Active Achievers</Text>
              </View>
            </View>
          </View>

          {/* Year-wise Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>Year-wise Achievement Distribution</Text>
            {yearBreakdown.map((item, idx) => (
              <View key={idx} style={[styles.yearRow, idx !== yearBreakdown.length - 1 && styles.yearRowBorder]}>
                <View style={styles.yearCol}>
                  <Text style={styles.yearName}>{item.year}</Text>
                  <Text style={styles.yearStudents}>{item.students} Students Enrolled</Text>
                </View>
                <View style={styles.yearScoreCol}>
                  <Text style={styles.yearPoints}>{item.points} pts</Text>
                  <Text style={styles.yearCount}>{item.achievements} verified</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Category Performance */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>Category Breakdown</Text>
            {categoryBreakdown.map((cat, idx) => (
              <View key={idx} style={styles.catRow}>
                <View style={styles.catLeft}>
                  <View style={[styles.catColorDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.catName} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </View>
                <View style={styles.catRight}>
                  <Text style={styles.catPoints}>{cat.points} pts</Text>
                  <Text style={styles.catCount}>({cat.count})</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recent Department Achievements (Read-only inspection) */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Recent Verified Achievements</Text>
              <Text style={styles.inspectionNotice}>Read-Only Inspection</Text>
            </View>

            {recentAchievements.map((item) => (
              <View key={item.id} style={styles.recentItemCard}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentStudentName}>{item.studentName}</Text>
                  <Text style={styles.recentPoints}>+{item.points} pts</Text>
                </View>
                <Text style={styles.recentTitle}>{item.title}</Text>
                <View style={styles.recentMetaRow}>
                  <Text style={styles.recentCategory}>{item.category}</Text>
                  <Text style={styles.recentDot}>•</Text>
                  <Text style={styles.recentDate}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 60 }} />
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
  mainContainer: {
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
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
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
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  screenSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  responsibilityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  changeDeanBtn: {
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  changeDeanBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  governanceChain: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  governanceStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  govIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  govTextCol: {
    flex: 1,
  },
  govRole: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  govName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  govArrow: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yearRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  yearCol: {
    flex: 1,
  },
  yearName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  yearStudents: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  yearScoreCol: {
    alignItems: 'flex-end',
  },
  yearPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  yearCount: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  catColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  catName: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  catRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 4,
  },
  catCount: {
    fontSize: 11,
    color: '#94A3B8',
  },
  inspectionNotice: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  recentItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recentStudentName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  recentPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  recentTitle: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
  },
  recentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentCategory: {
    fontSize: 10,
    color: '#64748B',
  },
  recentDot: {
    fontSize: 10,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  recentDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  errorBackBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  errorBackBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
