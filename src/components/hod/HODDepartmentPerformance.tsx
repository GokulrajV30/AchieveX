// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Department Performance Screen
// Mobile-optimized departmental analytics & category breakdown
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
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getHODStore } from '../../data/hodWorkspaceData';
import HODHeroCard from './HODHeroCard';
import HODBottomTab from './HODBottomTab';

interface HODDepartmentPerformanceProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HODDepartmentPerformance({
  onGoBack,
  onNavigate,
}: HODDepartmentPerformanceProps) {
  const store = getHODStore();
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  // Category distribution data
  const categoryData = [
    { name: 'Research & Publications', count: 48, percentage: 15, color: '#2563EB' },
    { name: 'Hackathons & Competitions', count: 112, percentage: 35, color: '#4F46E5' },
    { name: 'Certifications & NPTEL', count: 86, percentage: 27, color: '#16A34A' },
    { name: 'Faculty Development (FDP)', count: 38, percentage: 12, color: '#D97706' },
    { name: 'Patents & IPR', count: 18, percentage: 6, color: '#DC2626' },
    { name: 'Sports & Cultural', count: 18, percentage: 5, color: '#8B5CF6' },
  ];

  // Year-wise student participation
  const yearWiseData = [
    { year: '4th Year (Batch 2022-26)', total: 60, achievers: 54, rate: '90%' },
    { year: '3rd Year (Batch 2023-27)', total: 60, achievers: 52, rate: '86%' },
    { year: '2nd Year (Batch 2024-28)', total: 60, achievers: 48, rate: '80%' },
    { year: '1st Year (Batch 2025-29)', total: 60, achievers: 50, rate: '83%' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Department Performance</Text>
            <Text style={styles.headerSubtitle}>CSE (IoT) Analytics</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Standard HOD Hero Card */}
          <HODHeroCard
            title="ANNUAL PERFORMANCE"
            subtitle="AY 2025-2026"
            icon="stats-chart"
            primaryNumber="320"
            primaryLabel="Total Achievements"
            gaugePercent={85}
            gaugeNumber="85%"
            gaugeLabel="Achievers"
            gaugeSubtext="Rate"
            ctaText="Performance Analytics →"
          />

          {/* Breakdown Cards: Students vs Faculty */}
          <View style={styles.breakdownRow}>
            <View style={styles.splitCard}>
              <View style={styles.splitCardHeader}>
                <Ionicons name="people" size={16} color="#4F46E5" />
                <Text style={styles.splitCardTitle}>Students</Text>
              </View>
              <Text style={styles.splitCardCount}>268</Text>
              <Text style={styles.splitCardSub}>Achievements across 240 students</Text>
            </View>

            <View style={styles.splitCard}>
              <View style={styles.splitCardHeader}>
                <Ionicons name="briefcase" size={16} color="#2563EB" />
                <Text style={styles.splitCardTitle}>Faculty</Text>
              </View>
              <Text style={styles.splitCardCount}>52</Text>
              <Text style={styles.splitCardSub}>Achievements across 18 faculty</Text>
            </View>
          </View>

          {/* Category Distribution */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pie-chart-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Category Distribution</Text>
            </View>

            {categoryData.map((cat) => (
              <View key={cat.name} style={styles.catRow}>
                <View style={styles.catRowTop}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={styles.catCount}>
                    {cat.count} ({cat.percentage}%)
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${cat.percentage * 2.5}%`, backgroundColor: cat.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Student Year-wise Participation */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="school-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Year-wise Student Participation</Text>
            </View>

            {yearWiseData.map((item) => (
              <View key={item.year} style={styles.yearRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.yearTitle}>{item.year}</Text>
                  <Text style={styles.yearMeta}>
                    {item.achievers} of {item.total} active achievers
                  </Text>
                </View>
                <View style={styles.ratePill}>
                  <Text style={styles.ratePillText}>{item.rate}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Nav */}
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
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  splitCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  splitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  splitCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  splitCardCount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 6,
  },
  splitCardSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  catRow: {
    marginBottom: 10,
  },
  catRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  catCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  barTrack: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  yearTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  yearMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  ratePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  ratePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
});
