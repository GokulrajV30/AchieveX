// ─────────────────────────────────────────────────────────────
// AchieveX — Principal College Performance & Executive Analytics
// Answers: Is our college improving across departments and categories?
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  principalDataStore,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalPerformanceProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

export default function PrincipalPerformance({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalPerformanceProps) {
  const departments = principalDataStore.getDepartments();
  const overview = principalDataStore.getOverviewStats();

  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [activeTab, setActiveTab] = useState<'monthly' | 'semester'>('monthly');

  // Trend data
  const monthlyTrends = [
    { month: 'Jun', count: 180, points: 2900 },
    { month: 'Jul', count: 280, points: 4600 },
    { month: 'Aug', count: 420, points: 7400 },
    { month: 'Sep', count: 580, points: 10200 },
    { month: 'Oct', count: 490, points: 8800 },
    { month: 'Nov', count: 410, points: 7100 },
  ];

  const maxPoints = Math.max(...monthlyTrends.map((t) => t.points));

  // Category breakdown
  const categoryShares = [
    { name: 'Research, Publication & IPR', share: 32, points: 15560, color: '#2563EB' },
    { name: 'Technical Competitions & Hackathons', share: 26, points: 12650, color: '#D97706' },
    { name: 'Industry Certifications & NPTEL', share: 20, points: 9730, color: '#059669' },
    { name: 'Funded Research Grants & Schemes', share: 14, points: 6810, color: '#7C3AED' },
    { name: 'Professional Societies & Honors', share: 8, points: 3900, color: '#EC4899' },
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
            <Text style={styles.screenTitle}>Executive Analytics</Text>
            <Text style={styles.screenSubtext}>College Performance Trends</Text>
          </View>
          <TouchableOpacity
            style={styles.leaderboardShortcutBtn}
            onPress={() => onNavigate('principalLeaderboard')}
          >
            <Ionicons name="trophy-outline" size={16} color="#B45309" style={{ marginRight: 4 }} />
            <Text style={styles.leaderboardShortcutText}>Rankings</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Analytics Hero */}
          <PrincipalHeroCard
            overline="COLLEGE ANALYTICS"
            title="Institutional Growth & Benchmarking"
            subtitle="Whole college longitudinal achievement tracking"
            icon="analytics"
            badgeText={selectedYear}
            primaryNumber={overview.totalAchievements.toLocaleString()}
            primaryLabel="Total Verified Records"
            secondaryMetrics={[
              { number: overview.totalPoints.toLocaleString(), label: 'Total Points' },
              { number: '94%', label: 'Compliance' },
            ]}
            compact
          />

          {/* Academic Year Selector Pills */}
          <View style={styles.yearSelectorRow}>
            {['2026-27', '2025-26', '2024-25'].map((yr) => (
              <TouchableOpacity
                key={yr}
                style={[styles.yearPill, selectedYear === yr && styles.yearPillActive]}
                onPress={() => setSelectedYear(yr)}
              >
                <Text style={[styles.yearPillText, selectedYear === yr && styles.yearPillTextActive]}>
                  {yr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dominant Trend Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Achievement Trend</Text>
                <Text style={styles.chartSub}>Verified points awarded by month</Text>
              </View>
              <View style={styles.chartToggle}>
                <TouchableOpacity
                  style={[styles.chartToggleBtn, activeTab === 'monthly' && styles.chartToggleBtnActive]}
                  onPress={() => setActiveTab('monthly')}
                >
                  <Text style={[styles.chartToggleText, activeTab === 'monthly' && styles.chartToggleTextActive]}>
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chartToggleBtn, activeTab === 'semester' && styles.chartToggleBtnActive]}
                  onPress={() => setActiveTab('semester')}
                >
                  <Text style={[styles.chartToggleText, activeTab === 'semester' && styles.chartToggleTextActive]}>
                    Semester
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Custom Bar Chart Visualization */}
            <View style={styles.barChartContainer}>
              {monthlyTrends.map((t, idx) => {
                const heightPercent = Math.round((t.points / maxPoints) * 100);
                return (
                  <View key={idx} style={styles.barCol}>
                    <Text style={styles.barValue}>{Math.round(t.points / 1000)}k</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                    </View>
                    <Text style={styles.barLabel}>{t.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Department Comparative Matrix */}
          <View style={styles.matrixCard}>
            <View style={styles.matrixHeader}>
              <Text style={styles.matrixTitle}>Department Comparative Benchmarking</Text>
              <TouchableOpacity onPress={() => onNavigate('principalDepartments')}>
                <Text style={styles.matrixLink}>View All →</Text>
              </TouchableOpacity>
            </View>

            {departments.slice(0, 5).map((d, idx) => {
              const sharePercent = Math.round((d.pointsTotal / overview.totalPoints) * 100);
              return (
                <View key={d.id} style={styles.matrixRow}>
                  <View style={styles.matrixDeptInfo}>
                    <Text style={styles.matrixDeptName} numberOfLines={1}>
                      {idx + 1}. {d.name}
                    </Text>
                    <Text style={styles.matrixDeptMeta}>
                      {d.achievementsCount} ach • {d.pointsTotal.toLocaleString()} pts ({sharePercent}%)
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${sharePercent * 2.5}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Category Institutional Breakdown */}
          <View style={styles.matrixCard}>
            <Text style={styles.matrixTitle}>Institutional Category Portfolio</Text>
            <View style={styles.catLegend}>
              {categoryShares.map((c, idx) => (
                <View key={idx} style={styles.catLegendItem}>
                  <View style={[styles.catLegendDot, { backgroundColor: c.color }]} />
                  <Text style={styles.catLegendName} numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text style={styles.catLegendShare}>{c.share}%</Text>
                  <Text style={styles.catLegendPoints}>{c.points.toLocaleString()} pts</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="reports" onNavigate={onNavigate} />
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
  leaderboardShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  leaderboardShortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  yearSelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  yearPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  yearPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  yearPillTextActive: {
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  chartSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  chartToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chartToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  chartToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  chartToggleTextActive: {
    color: '#0F172A',
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 90,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#D97706',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },
  matrixCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matrixHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  matrixTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  matrixLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  matrixRow: {
    marginBottom: 12,
  },
  matrixDeptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matrixDeptName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  matrixDeptMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  catLegend: {
    marginTop: 10,
  },
  catLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  catLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  catLegendName: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  catLegendShare: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    width: 36,
  },
  catLegendPoints: {
    fontSize: 11,
    color: '#64748B',
  },
});
