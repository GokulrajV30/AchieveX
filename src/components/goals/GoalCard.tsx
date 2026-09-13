// ─────────────────────────────────────────────────────────────
// AchieveX — Goal Card Component
// Compact, Mobile SaaS Structured Goal Card
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Goal, getDeadlineInfo } from '../../data/goalsData';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
}

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const isCompleted = goal.status === 'Completed';
  const isPaused = goal.status === 'Paused';

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;

  const deadlineInfo = getDeadlineInfo(
    goal.targetDate,
    isCompleted,
    goal.completedAt
  );

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Top Meta Row: Category Tag & Priority Badge */}
      <View style={styles.topMetaRow}>
        <Text style={styles.categoryTag} numberOfLines={1}>
          {goal.categoryTitle.toUpperCase()}
        </Text>

        {isPaused ? (
          <View style={[styles.priorityBadge, styles.pausedBadge]}>
            <Text style={styles.pausedBadgeText}>PAUSED</Text>
          </View>
        ) : isCompleted ? (
          <View style={[styles.priorityBadge, styles.completedBadge]}>
            <Ionicons name="checkmark-circle" size={12} color="#059669" style={{ marginRight: 2 }} />
            <Text style={styles.completedBadgeText}>COMPLETED</Text>
          </View>
        ) : (
          <View
            style={[
              styles.priorityBadge,
              goal.priority === 'High' && styles.priorityHigh,
              goal.priority === 'Medium' && styles.priorityMedium,
              goal.priority === 'Low' && styles.priorityLow,
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                goal.priority === 'High' && styles.priorityTextHigh,
                goal.priority === 'Medium' && styles.priorityTextMedium,
                goal.priority === 'Low' && styles.priorityTextLow,
              ]}
            >
              {goal.priority.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Goal Title */}
      <Text style={styles.goalTitle} numberOfLines={2}>
        {goal.title}
      </Text>

      {/* Progress & Milestone Stat Row */}
      {isCompleted ? (
        <View style={styles.progressRow}>
          <View style={styles.completedStatusRow}>
            <Ionicons name="checkmark" size={14} color="#059669" />
            <Text style={styles.completedSuccessText}>Goal Achieved</Text>
          </View>
          {totalMilestones > 0 && (
            <Text style={styles.milestoneText}>
              {totalMilestones}/{totalMilestones} milestones
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.progressRow}>
          <Text style={styles.progressPercent}>{goal.progress}%</Text>
          {totalMilestones > 0 && (
            <Text style={styles.milestoneText}>
              {completedMilestones}/{totalMilestones} milestones
            </Text>
          )}
        </View>
      )}

      {/* Sleek Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            isCompleted
              ? styles.progressFillCompleted
              : isPaused
              ? styles.progressFillPaused
              : styles.progressFillActive,
            { width: `${Math.min(100, Math.max(0, goal.progress))}%` },
          ]}
        />
      </View>

      {/* Bottom Row: Deadline & View Action */}
      <View style={styles.bottomRow}>
        {/* Deadline Status Pill */}
        <View
          style={[
            styles.deadlinePill,
            deadlineInfo.urgency === 'completed' && styles.deadlineCompleted,
            deadlineInfo.urgency === 'comfortable' && styles.deadlineComfortable,
            deadlineInfo.urgency === 'approaching' && styles.deadlineApproaching,
            deadlineInfo.urgency === 'overdue' && styles.deadlineOverdue,
          ]}
        >
          {deadlineInfo.urgency === 'overdue' ? (
            <Ionicons name="alert-circle" size={13} color="#DC2626" style={{ marginRight: 3 }} />
          ) : deadlineInfo.urgency === 'approaching' ? (
            <Ionicons name="time" size={13} color="#D97706" style={{ marginRight: 3 }} />
          ) : deadlineInfo.urgency === 'completed' ? (
            <Ionicons name="calendar-outline" size={13} color="#059669" style={{ marginRight: 3 }} />
          ) : (
            <Ionicons name="calendar-outline" size={13} color="#059669" style={{ marginRight: 3 }} />
          )}

          <Text
            style={[
              styles.deadlineText,
              deadlineInfo.urgency === 'completed' && styles.deadlineTextCompleted,
              deadlineInfo.urgency === 'comfortable' && styles.deadlineTextComfortable,
              deadlineInfo.urgency === 'approaching' && styles.deadlineTextApproaching,
              deadlineInfo.urgency === 'overdue' && styles.deadlineTextOverdue,
            ]}
          >
            {deadlineInfo.text}
          </Text>
        </View>

        {/* View Link */}
        <View style={styles.viewLinkRow}>
          <Text style={styles.viewLinkText}>View</Text>
          <Ionicons name="chevron-forward" size={14} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.3,
    flex: 1,
    marginRight: 6,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityHigh: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  priorityLow: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  pausedBadge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  priorityTextHigh: {
    color: '#DC2626',
  },
  priorityTextMedium: {
    color: '#D97706',
  },
  priorityTextLow: {
    color: '#2563EB',
  },
  pausedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  completedStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedSuccessText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 3,
  },
  milestoneText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 2.5,
    marginVertical: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  progressFillActive: {
    backgroundColor: '#2563EB',
  },
  progressFillCompleted: {
    backgroundColor: '#059669',
  },
  progressFillPaused: {
    backgroundColor: '#94A3B8',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  deadlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  deadlineComfortable: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  deadlineApproaching: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  deadlineOverdue: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deadlineCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deadlineTextComfortable: {
    color: '#16A34A',
  },
  deadlineTextApproaching: {
    color: '#D97706',
  },
  deadlineTextOverdue: {
    color: '#DC2626',
  },
  deadlineTextCompleted: {
    color: '#16A34A',
  },
  viewLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLinkText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 1,
  },
});
