// ─────────────────────────────────────────────────────────────
// AchieveX — Achievement Overview Hero Card Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AchievementOverviewHeroProps {
  verifiedCount: number;
  totalPoints: number;
  pendingCount: number;
  correctionCount: number;
}

export default function AchievementOverviewHero({
  verifiedCount,
  totalPoints,
  pendingCount,
  correctionCount,
}: AchievementOverviewHeroProps) {
  return (
    <LinearGradient
      colors={['#2563EB', '#4338CA', '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      {/* Decorative background shape */}
      <View style={styles.decorativeCircle} />

      {/* Header Label */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Achievement Overview</Text>
        <Text style={styles.headerSubtitle}>Verified Progress</Text>
      </View>

      {/* Primary & Secondary Metrics Row */}
      <View style={styles.mainMetricsRow}>
        <View style={styles.primaryMetricCol}>
          <Text style={styles.primaryNumber}>{verifiedCount}</Text>
          <Text style={styles.primaryLabel}>Verified Achievements</Text>
        </View>

        <View style={styles.pointsPill}>
          <Ionicons name="trophy" size={16} color="#FDE047" style={{ marginRight: 6 }} />
          <Text style={styles.pointsText}>{totalPoints} Pts</Text>
        </View>
      </View>

      {/* Subtle Divider */}
      <View style={styles.divider} />

      {/* Bottom Status Chips */}
      <View style={styles.statusChipsRow}>
        <View style={styles.statusChip}>
          <Ionicons name="time" size={12} color="#FDE68A" style={{ marginRight: 4 }} />
          <Text style={styles.statusChipText}>{pendingCount} Pending</Text>
        </View>

        {correctionCount > 0 ? (
          <View style={[styles.statusChip, styles.correctionChip]}>
            <Ionicons name="alert-circle" size={12} color="#FECACA" style={{ marginRight: 4 }} />
            <Text style={[styles.statusChipText, styles.correctionText]}>
              {correctionCount} Correction{correctionCount > 1 ? 's' : ''}
            </Text>
          </View>
        ) : (
          <View style={styles.statusChip}>
            <Ionicons name="checkmark-circle" size={12} color="#A7F3D0" style={{ marginRight: 4 }} />
            <Text style={styles.statusChipText}>All Clean</Text>
          </View>
        )}
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
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  mainMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryMetricCol: {
    justifyContent: 'center',
  },
  primaryNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  primaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E7FF',
    marginTop: 1,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 12,
  },
  statusChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  correctionChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(252, 165, 165, 0.35)',
  },
  correctionText: {
    color: '#FECACA',
  },
});
