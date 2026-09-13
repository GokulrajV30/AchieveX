// ─────────────────────────────────────────────────────────────
// AchieveX — Point Preview Component
// Sticky points summary showing estimated score breakdown
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { calculateEstimatedPoints } from '../../data/achievementConfig';

interface PointPreviewProps {
  basePoints: number;
  level?: string;
  result?: string;
  cashPrizeAmount: string;
  isTeamLead: boolean;
  categoryId: string;
  typeId: string;
}

export default function PointPreview({
  basePoints,
  level,
  result,
  cashPrizeAmount,
  isTeamLead,
  categoryId,
  typeId,
}: PointPreviewProps) {
  // If VAC or NPTEL credit course, points are 0 and no estimation breakdown is shown
  const isVacOrNptel = typeId === 'nptel-credit' || typeId === 'value-added-course';

  const cashPrizeNum = parseFloat(cashPrizeAmount) || 0;
  const breakdown = calculateEstimatedPoints({
    basePoints: isVacOrNptel ? 0 : basePoints,
    level,
    result,
    cashPrize: cashPrizeNum,
    isTeamLead,
  });

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const percentage = isVacOrNptel ? 0 : Math.min(breakdown.total / 50, 1);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estimated Achievement Points</Text>

      {isVacOrNptel ? (
        <View style={styles.academicWrapper}>
          <Text style={styles.academicText}>Academic Credit Activity</Text>
          <Text style={styles.academicSubText}>0 Points Awarded</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Svg gauge indicator */}
          <View style={styles.gaugeContainer}>
            <Svg height="90" width="90" viewBox="0 0 90 90">
              <G rotation="-90" origin="45, 45">
                <Circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="#F3F4F6"
                  strokeWidth="8"
                  fill="transparent"
                />
                <Circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="#2563EB"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </G>
            </Svg>
            <View style={styles.gaugeCenterText}>
              <Text style={styles.gaugeNumber}>{breakdown.total}</Text>
              <Text style={styles.gaugeMax}>/ 50</Text>
            </View>
          </View>

          {/* Points Breakdown */}
          <View style={styles.breakdown}>
            <View style={styles.row}>
              <Text style={styles.label}>Base Points (Level & Result)</Text>
              <Text style={styles.value}>{breakdown.levelMultiplied}</Text>
            </View>
            {breakdown.cashBonus > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Cash Prize Bonus</Text>
                <Text style={[styles.value, styles.bonusValue]}>+{breakdown.cashBonus}</Text>
              </View>
            )}
            {breakdown.teamLeadBonus > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Team Lead Bonus</Text>
                <Text style={[styles.value, styles.bonusValue]}>+{breakdown.teamLeadBonus}</Text>
              </View>
            )}
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>{breakdown.total} Pts</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.helperText}>
        Estimated — Final points are calculated and verified by institutional faculty.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 14,
  },
  academicWrapper: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
  },
  academicText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  academicSubText: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gaugeContainer: {
    position: 'relative',
    marginRight: 16,
  },
  gaugeCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gaugeNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  gaugeMax: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  breakdown: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  bonusValue: {
    color: '#16A34A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 6,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  helperText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
