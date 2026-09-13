// ─────────────────────────────────────────────────────────────
// AchieveX — Goal Quick Stats Component (3-Card Layout)
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GoalQuickStatsProps {
  activeCount: number;
  completedCount: number;
  avgProgress: number;
}

export default function GoalQuickStats({
  activeCount,
  completedCount,
  avgProgress,
}: GoalQuickStatsProps) {
  return (
    <View style={styles.container}>
      {/* Stat 1: Active */}
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Active</Text>
        <Text style={styles.statValue}>{activeCount}</Text>
      </View>

      {/* Stat 2: Completed */}
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Completed</Text>
        <Text style={[styles.statValue, styles.completedValue]}>{completedCount}</Text>
      </View>

      {/* Stat 3: Avg Progress */}
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Avg Progress</Text>
        <Text style={[styles.statValue, styles.progressValue]}>{avgProgress}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  completedValue: {
    color: '#059669',
  },
  progressValue: {
    color: '#2563EB',
  },
});
