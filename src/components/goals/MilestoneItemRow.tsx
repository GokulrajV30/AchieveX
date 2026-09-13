// ─────────────────────────────────────────────────────────────
// AchieveX — Milestone Item Row Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Milestone } from '../../data/goalsData';

interface MilestoneItemRowProps {
  milestone: Milestone;
  onMarkComplete: () => void;
  onViewProof: () => void;
}

export default function MilestoneItemRow({
  milestone,
  onMarkComplete,
  onViewProof,
}: MilestoneItemRowProps) {
  const isCompleted = milestone.completed;
  const hasProof = !!milestone.proof;

  return (
    <View style={[styles.rowContainer, isCompleted && styles.rowCompleted]}>
      {/* Status Icon */}
      <View style={styles.iconContainer}>
        {isCompleted ? (
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
        ) : (
          <Ionicons name="ellipse-outline" size={20} color="#94A3B8" />
        )}
      </View>

      {/* Milestone Text & Metadata */}
      <View style={styles.textContainer}>
        <Text
          style={[styles.milestoneTitle, isCompleted && styles.milestoneTitleCompleted]}
          numberOfLines={2}
        >
          {milestone.label}
        </Text>

        <View style={styles.metaRow}>
          {isCompleted ? (
            <Text style={styles.completedMetaText}>
              Completed{hasProof ? ' • Proof attached' : ''}
            </Text>
          ) : milestone.targetDate ? (
            <Text style={styles.targetDateText}>Target: {milestone.targetDate}</Text>
          ) : (
            <Text style={styles.targetDateText}>Not started</Text>
          )}
        </View>
      </View>

      {/* Action CTA */}
      <View style={styles.actionContainer}>
        {isCompleted && hasProof ? (
          <TouchableOpacity
            style={styles.viewProofBtn}
            activeOpacity={0.7}
            onPress={onViewProof}
          >
            <Ionicons name="eye-outline" size={13} color="#2563EB" style={{ marginRight: 3 }} />
            <Text style={styles.viewProofBtnText}>View Proof</Text>
          </TouchableOpacity>
        ) : !isCompleted ? (
          <TouchableOpacity
            style={styles.markCompleteBtn}
            activeOpacity={0.75}
            onPress={onMarkComplete}
          >
            <Text style={styles.markCompleteBtnText}>Mark Complete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  rowCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  milestoneTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  milestoneTitleCompleted: {
    color: '#64748B',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  completedMetaText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  targetDateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  viewProofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewProofBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  markCompleteBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  markCompleteBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
