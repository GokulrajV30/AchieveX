// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Credits Hero Summary Card
// Gradient hero card displaying verified credits & courses
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AcademicCreditsHeroProps {
  totalCredits: number;
  verifiedCoursesCount: number;
  academicYear?: string;
}

export default function AcademicCreditsHero({
  totalCredits,
  verifiedCoursesCount,
  academicYear = '2026–27',
}: AcademicCreditsHeroProps) {
  return (
    <LinearGradient
      colors={['#2563EB', '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroContainer}
    >
      {/* Background Watermark Icon */}
      <View style={styles.watermarkIconContainer}>
        <Ionicons name="school" size={110} color="rgba(255, 255, 255, 0.08)" />
      </View>

      {/* Hero Header */}
      <View style={styles.topRow}>
        <Text style={styles.heroSubHeader}>ACADEMIC CREDIT SUMMARY</Text>
        <View style={styles.academicYearPill}>
          <Text style={styles.academicYearText}>{academicYear}</Text>
        </View>
      </View>

      {/* Main Metric */}
      <View style={styles.metricRow}>
        <Text style={styles.metricValue}>{totalCredits}</Text>
        <View style={styles.metricLabelCol}>
          <Text style={styles.metricLabelPrimary}>Verified Credits</Text>
          <Text style={styles.metricLabelSecondary}>
            {verifiedCoursesCount} Verified Course{verifiedCoursesCount === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      {/* Bottom context pill */}
      <View style={styles.bottomMetaRow}>
        <Ionicons name="shield-checkmark" size={13} color="#93C5FD" style={{ marginRight: 4 }} />
        <Text style={styles.bottomMetaText}>
          Institution-approved academic curriculum learning records
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  watermarkIconContainer: {
    position: 'absolute',
    right: -15,
    bottom: -20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroSubHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BFDBFE',
    letterSpacing: 0.6,
  },
  academicYearPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  academicYearText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
    marginRight: 10,
  },
  metricLabelCol: {
    justifyContent: 'center',
  },
  metricLabelPrimary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricLabelSecondary: {
    fontSize: 12,
    color: '#DBEAFE',
    fontWeight: '500',
    marginTop: 1,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 8,
  },
  bottomMetaText: {
    fontSize: 11,
    color: '#BFDBFE',
    fontWeight: '500',
    flex: 1,
  },
});
