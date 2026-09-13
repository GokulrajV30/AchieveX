// ─────────────────────────────────────────────────────────────
// AchieveX — Goal Insight Card Component (Next Best Step)
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface GoalInsightCardProps {
  insightText: string;
  onPressAction?: () => void;
  actionText?: string;
}

export default function GoalInsightCard({
  insightText,
  onPressAction,
  actionText = 'View Goal →',
}: GoalInsightCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.sparkleCircle}>
          <Ionicons name="sparkles" size={13} color="#2563EB" />
        </View>
        <Text style={styles.headerTitle}>Next Best Step</Text>
      </View>

      {/* Body Message */}
      <Text style={styles.bodyText}>{insightText}</Text>

      {/* Action Trigger */}
      {onPressAction && (
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.75}
          onPress={onPressAction}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sparkleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  bodyText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginVertical: 4,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
});
