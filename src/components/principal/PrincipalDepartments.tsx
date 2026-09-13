// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Departments Screen
// Institutional directory of all 8 college departments with performance metrics.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
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
  principalDataStore,
  type PrincipalDepartmentMetric,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';
import { PRINCIPAL_SPACING } from './principalSpacing';

interface PrincipalDepartmentsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

export default function PrincipalDepartments({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalDepartmentsProps) {
  const [departments, setDepartments] = useState<PrincipalDepartmentMetric[]>(
    principalDataStore.getDepartments()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'achievements' | 'students'>('points');

  useEffect(() => {
    return principalDataStore.subscribe(() => {
      setDepartments(principalDataStore.getDepartments());
    });
  }, []);

  const filteredDepts = departments
    .filter((dept) => {
      if (searchQuery.trim().length === 0) return true;
      const q = searchQuery.toLowerCase();
      return (
        dept.name.toLowerCase().includes(q) ||
        dept.code.toLowerCase().includes(q) ||
        dept.hodName.toLowerCase().includes(q) ||
        dept.assignedDeanName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'points') return b.pointsTotal - a.pointsTotal;
      if (sortBy === 'achievements') return b.achievementsCount - a.achievementsCount;
      return b.studentsCount - a.studentsCount;
    });

  const totalPoints = departments.reduce((acc, d) => acc + d.pointsTotal, 0);
  const totalAchievements = departments.reduce((acc, d) => acc + d.achievementsCount, 0);

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
            <Text style={styles.screenTitle}>College Departments</Text>
            <Text style={styles.screenSubtext}>Institutional Academic Divisions</Text>
          </View>
        </View>

        {/* Scrollable Body */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <PrincipalHeroCard
            overline="COLLEGE DEPARTMENTS"
            primaryNumber={departments.length}
            primaryLabel="Academic Divisions"
            subtitle="Whole college departmental performance benchmarking"
            secondaryTitle="TOTALS"
            secondaryMetrics={[
              { number: totalAchievements.toLocaleString(), label: 'Achievements', icon: 'ribbon-outline' },
              { number: totalPoints.toLocaleString(), label: 'Total Points', icon: 'star-outline' },
            ]}
          />

          {/* Search Box */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search department, HOD, or Dean..."
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

          {/* Sort Buttons */}
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>SORT BY:</Text>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'points' && styles.sortBtnActive]}
              onPress={() => setSortBy('points')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'points' && styles.sortBtnTextActive]}>
                Points
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'achievements' && styles.sortBtnActive]}
              onPress={() => setSortBy('achievements')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'achievements' && styles.sortBtnTextActive]}>
                Achievements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'students' && styles.sortBtnActive]}
              onPress={() => setSortBy('students')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'students' && styles.sortBtnTextActive]}>
                Enrollment
              </Text>
            </TouchableOpacity>
          </View>

          {/* Department Cards List */}
          <View style={styles.listContainer}>
            {filteredDepts.map((dept, idx) => (
              <TouchableOpacity
                key={dept.id}
                style={styles.deptCard}
                activeOpacity={0.8}
                onPress={() => onNavigate('principalDepartmentDetails', { departmentId: dept.id })}
              >
                <View style={styles.deptCardTopRow}>
                  <View style={styles.rankCircle}>
                    <Text style={styles.rankText}>#{idx + 1}</Text>
                  </View>
                  <View style={styles.deptTitleCol}>
                    <Text style={styles.deptNameText}>{dept.name}</Text>
                    <Text style={styles.deptCodeText}>
                      HOD: {dept.hodName}
                    </Text>
                  </View>
                  <View style={styles.pointsPill}>
                    <Text style={styles.pointsNumber}>{dept.pointsTotal.toLocaleString()}</Text>
                    <Text style={styles.pointsLabel}>Points</Text>
                  </View>
                </View>

                {/* Footer: Achievements Summary & View Details */}
                <View style={styles.deptCardFooter}>
                  <View style={styles.statsSummary}>
                    <Ionicons name="ribbon-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.statsSummaryText}>
                      <Text style={{ fontWeight: '700', color: '#0F172A' }}>{dept.achievementsCount}</Text> achievements
                    </Text>
                    <Text style={styles.statsDot}>•</Text>
                    <Text style={styles.statsSummaryText}>
                      <Text style={{ fontWeight: '700', color: '#0F172A' }}>{dept.studentsCount}</Text> students
                    </Text>
                  </View>

                  <View style={styles.viewDetailsRow}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={13} color="#2563EB" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="departments" onNavigate={onNavigate} />
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
    paddingBottom: PRINCIPAL_SPACING.bottomNavClearance,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginRight: 8,
  },
  sortBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  sortBtnTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  deptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  deptCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  deptTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  deptNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptCodeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pointsPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  pointsNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  deptCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  statsSummaryText: {
    fontSize: 11,
    color: '#64748B',
  },
  statsDot: {
    fontSize: 10,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 4,
  },
});
