// ─────────────────────────────────────────────────────────────
// AchieveX — Compact Student Achievement Card Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Achievement } from '../../data/achievementsData';

interface AchievementCardProps {
  achievement: Achievement;
  onPress: () => void;
  onActionPress?: () => void;
}

export default function AchievementCard({
  achievement,
  onPress,
  onActionPress,
}: AchievementCardProps) {
  const isVerified = achievement.status === 'Verified';
  const isPending = achievement.status === 'Pending';
  const isCorrection =
    achievement.status === 'Correction Required' || achievement.status === 'Rejected';
  const isDraft = achievement.status === 'Draft';

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.75}
      onPress={onPress}
    >
      {/* 1. Category Tag */}
      <Text style={styles.categoryTag} numberOfLines={1}>
        {achievement.category.toUpperCase()}
      </Text>

      {/* 2. Achievement Title */}
      <Text style={styles.achievementTitle} numberOfLines={2}>
        {achievement.title}
      </Text>

      {/* 3. Context: Organization & Date/Semester */}
      <View style={styles.contextBlock}>
        {achievement.organization ? (
          <Text style={styles.organizationText} numberOfLines={1}>
            {achievement.organization}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {achievement.semester ? (
            <Text style={styles.metaText}>
              Semester {achievement.semester} • {achievement.date}
            </Text>
          ) : (
            <Text style={styles.metaText}>{achievement.date}</Text>
          )}
        </View>
      </View>

      {/* 4. Bottom Row: Status Badge & Points / Action */}
      <View style={styles.bottomRow}>
        {/* Status Badge */}
        {isVerified && (
          <View style={[styles.statusBadge, styles.statusVerified]}>
            <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 3 }} />
            <Text style={[styles.statusBadgeText, styles.statusVerifiedText]}>Verified</Text>
          </View>
        )}

        {isPending && (
          <View style={[styles.statusBadge, styles.statusPending]}>
            <Ionicons name="time" size={13} color="#D97706" style={{ marginRight: 3 }} />
            <Text style={[styles.statusBadgeText, styles.statusPendingText]}>Pending Verification</Text>
          </View>
        )}

        {isCorrection && (
          <View style={[styles.statusBadge, styles.statusCorrection]}>
            <Ionicons name="alert-circle" size={13} color="#DC2626" style={{ marginRight: 3 }} />
            <Text style={[styles.statusBadgeText, styles.statusCorrectionText]}>Correction Required</Text>
          </View>
        )}

        {isDraft && (
          <View style={[styles.statusBadge, styles.statusDraft]}>
            <Ionicons name="document-outline" size={13} color="#475569" style={{ marginRight: 3 }} />
            <Text style={[styles.statusBadgeText, styles.statusDraftText]}>Draft</Text>
          </View>
        )}

        {/* Right Side: Points or Action */}
        <View style={styles.rightActionContainer}>
          {isVerified && (
            <Text style={styles.verifiedPointsText}>+{achievement.points} pts</Text>
          )}

          {isPending && achievement.points > 0 && (
            <Text style={styles.pendingPointsText}>Est. +{achievement.points} pts</Text>
          )}

          {isCorrection && (
            <TouchableOpacity
              style={styles.actionLinkRow}
              activeOpacity={0.7}
              onPress={onActionPress || onPress}
            >
              <Text style={styles.correctionActionText}>Update Proof</Text>
              <Ionicons name="arrow-forward" size={13} color="#DC2626" />
            </TouchableOpacity>
          )}

          {isDraft && (
            <TouchableOpacity
              style={styles.actionLinkRow}
              activeOpacity={0.7}
              onPress={onActionPress || onPress}
            >
              <Text style={styles.draftActionText}>Continue</Text>
              <Ionicons name="arrow-forward" size={13} color="#2563EB" />
            </TouchableOpacity>
          )}
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
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 4,
  },
  contextBlock: {
    marginBottom: 8,
  },
  organizationText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#475569',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusVerified: {
    backgroundColor: '#ECFDF5',
  },
  statusVerifiedText: {
    color: '#059669',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingText: {
    color: '#D97706',
  },
  statusCorrection: {
    backgroundColor: '#FEF2F2',
  },
  statusCorrectionText: {
    color: '#DC2626',
  },
  statusDraft: {
    backgroundColor: '#F1F5F9',
  },
  statusDraftText: {
    color: '#475569',
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedPointsText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  pendingPointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  correctionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  draftActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
