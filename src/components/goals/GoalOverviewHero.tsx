// ─────────────────────────────────────────────────────────────
// AchieveX — Goal Overview Hero Card Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

interface GoalOverviewHeroProps {
  activeCount: number;
  completedCount: number;
  overallProgress: number;
  academicYear: string;
  onPressYear?: () => void;
}

export default function GoalOverviewHero({
  activeCount,
  completedCount,
  overallProgress,
  academicYear,
  onPressYear,
}: GoalOverviewHeroProps) {
  return (
    <LinearGradient
      colors={['#2563EB', '#4338CA', '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      {/* Top Header Row with Year Dropdown */}
      <View style={styles.topRow}>
        <Text style={styles.headerLabel}>Your Goal Progress</Text>
        <TouchableOpacity
          style={styles.yearBadge}
          activeOpacity={0.8}
          onPress={onPressYear}
        >
          <Text style={styles.yearText}>{academicYear}</Text>
          <Ionicons name="chevron-down" size={13} color="#FFFFFF" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>

      {/* Main Stat Numbers */}
      <View style={styles.statRow}>
        <View>
          <Text style={styles.activeGoalsTitle}>{activeCount} Active Goals</Text>
        </View>
        <View style={styles.progressNumBlock}>
          <Text style={styles.progressPercentText}>{overallProgress}%</Text>
          <Text style={styles.progressLabel}>Overall Progress</Text>
        </View>
      </View>

      {/* Thin Sleek Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, Math.max(0, overallProgress))}%` },
          ]}
        />
      </View>

      {/* Bottom Summary */}
      <View style={styles.bottomRow}>
        <Ionicons name="checkmark-circle" size={14} color="#A7F3D0" />
        <Text style={styles.completedSummaryText}>
          {completedCount} goal{completedCount !== 1 ? 's' : ''} completed
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  activeGoalsTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  progressNumBlock: {
    alignItems: 'flex-end',
  },
  progressPercentText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  progressLabel: {
    fontSize: 11,
    color: '#E0E7FF',
    marginTop: 1,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 3,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedSummaryText: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '600',
    marginLeft: 5,
  },
});
