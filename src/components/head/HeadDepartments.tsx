// ─────────────────────────────────────────────────────────────
// AchieveX — College Departments Overview (Head Workspace)
// Institutional performance and drill-downs across all 8 academic departments
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHeadStore,
  type DepartmentMetric,
} from '../../data/headWorkspaceData';
import HeadHeroCard from './HeadHeroCard';
import StudentBottomTab from '../StudentBottomTab';

interface HeadDepartmentsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HeadDepartments({
  onOpenMenu,
  onNavigate,
}: HeadDepartmentsProps) {
  const store = getHeadStore();
  const departments = store.getDepartmentMetrics();
  const [searchQuery, setSearchQuery] = useState('');

  const sortedDepts = [...departments].sort((a, b) => b.totalPoints - a.totalPoints);
  const filteredDepts = sortedDepts.filter((d) => {
    const name = d.departmentName || d.department;
    const id = d.departmentId || d.department;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPoints = departments.reduce((acc, d) => acc + d.totalPoints, 0);
  const totalVerified = departments.reduce((acc, d) => acc + d.verifiedAchievements, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#1E293B" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Departments</Text>
              <Text style={styles.headerSubtitle}>Institutional department benchmarking</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE BODY
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* ════════════════════════════════════════════════
              2. SHARED HEAD HERO
          ════════════════════════════════════════════════ */}
          <HeadHeroCard
            overline="COLLEGE DEPARTMENTS"
            title="Department Benchmarking"
            subtitle="Cross-department achievement tracking & audit"
            icon="business"
            badgeText={`${departments.length} Depts`}
            primaryNumber={`${departments.length} Depts`}
            primaryLabel="Active Academic Branches"
            secondaryMetrics={[
              { number: totalPoints.toLocaleString(), label: 'Points' },
              { number: totalVerified.toLocaleString(), label: 'Verified' },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. SEARCH BAR
          ════════════════════════════════════════════════ */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search department name or branch code..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. DEPARTMENTS LIST
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionTitle}>PERFORMANCE RANKING ({filteredDepts.length})</Text>

          {filteredDepts.map((dept, index) => {
            const rankColor =
              index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : '#64748B';

            return (
              <TouchableOpacity
                key={dept.departmentId || dept.department}
                style={styles.deptCard}
                activeOpacity={0.75}
                onPress={() => onNavigate('headDepartmentDetails', { departmentId: dept.departmentId || dept.department })}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.rankBox, { backgroundColor: rankColor + '15' }]}>
                    <Text style={[styles.rankText, { color: rankColor }]}>#{index + 1}</Text>
                  </View>
                  <View style={styles.deptInfoCol}>
                    <Text style={styles.deptNameText} numberOfLines={1} ellipsizeMode="tail">
                      {dept.departmentName || dept.department}
                    </Text>
                    <Text style={styles.deptCodeText}>ID: {dept.departmentId || dept.department}</Text>
                  </View>
                  <View style={styles.pointsCol}>
                    <Text style={styles.pointsVal}>{dept.totalPoints.toLocaleString()}</Text>
                    <Text style={styles.pointsLbl}>points</Text>
                  </View>
                </View>

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>VERIFIED</Text>
                    <Text style={styles.metricVal}>{dept.verifiedAchievements}</Text>
                  </View>
                  <View style={styles.metricDiv} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>PARTICIPATION</Text>
                    <Text style={[styles.metricVal, { color: '#059669' }]}>{dept.participationRate ?? 85}%</Text>
                  </View>
                  <View style={styles.metricDiv} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>STUDENTS</Text>
                    <Text style={styles.metricVal}>{dept.studentCount}</Text>
                  </View>
                  <View style={styles.metricDiv} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>FACULTY</Text>
                    <Text style={styles.metricVal}>{dept.facultyCount}</Text>
                  </View>
                </View>

                {/* Card Footer Link */}
                <View style={styles.cardFooter}>
                  <Text style={styles.footerHint}>View department audit & achievements</Text>
                  <Ionicons name="chevron-forward" size={14} color="#4F46E5" />
                </View>
              </TouchableOpacity>
            );
          })}

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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    paddingTop: 16,
    paddingBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  deptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
  },
  deptInfoCol: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  deptNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptCodeText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  pointsCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  pointsVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4F46E5',
  },
  pointsLbl: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  metricDiv: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerHint: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
