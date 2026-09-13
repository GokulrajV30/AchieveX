// ─────────────────────────────────────────────────────────────
// AchieveX — Submission Success Screen
// Post-submission success state with points summary and next actions
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SectionCard, PrimaryButton } from './FormComponents';

interface SubmissionSuccessProps {
  title: string;
  estimatedPoints: number;
  onViewAchievement: () => void;
  onBackToDashboard: () => void;
}

export default function SubmissionSuccess({
  title,
  estimatedPoints,
  onViewAchievement,
  onBackToDashboard,
}: SubmissionSuccessProps) {
  return (
    <View style={styles.container}>
      {/* Visual Header Icon */}
      <View style={styles.successIconCircle}>
        <Ionicons name="checkmark-circle" size={48} color="#16A34A" />
      </View>

      <Text style={styles.successTitle}>Achievement Submitted</Text>
      <Text style={styles.successDesc}>
        Sent for verification.
      </Text>

      {/* Summary Card */}
      <SectionCard>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Achievement</Text>
          <Text style={styles.summaryValue} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estimated Points</Text>
          <Text style={styles.pointsValue}>{estimatedPoints} / 50</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Pending Verification</Text>
          </View>
        </View>
      </SectionCard>

      {/* Info Message Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginRight: 8 }} />
        <Text style={styles.infoText}>
          You will receive a notification on your dashboard once the faculty completes the verification.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          title="Back to Dashboard"
          onPress={onBackToDashboard}
          variant="primary"
          icon="home-outline"
        />
        <View style={{ height: 10 }} />
        <PrimaryButton
          title="View Submission"
          onPress={onViewAchievement}
          variant="outline"
          icon="eye-outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    maxWidth: '65%',
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 28,
    alignItems: 'flex-start',
    marginHorizontal: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    paddingHorizontal: 4,
  },
});
