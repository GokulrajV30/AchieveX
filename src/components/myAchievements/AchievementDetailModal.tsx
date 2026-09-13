// ─────────────────────────────────────────────────────────────
// AchieveX — Achievement Details Modal Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Achievement } from '../../data/achievementsData';

interface AchievementDetailModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
  onAction?: (actionType: 'correction' | 'draft') => void;
}

export default function AchievementDetailModal({
  visible,
  achievement,
  onClose,
  onAction,
}: AchievementDetailModalProps) {
  if (!achievement) return null;

  const isVerified = achievement.status === 'Verified';
  const isPending = achievement.status === 'Pending';
  const isCorrection =
    achievement.status === 'Correction Required' || achievement.status === 'Rejected';
  const isDraft = achievement.status === 'Draft';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.categoryTag}>{achievement.category.toUpperCase()}</Text>
              <Text style={styles.sheetTitle} numberOfLines={2}>
                {achievement.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {/* Status & Points Banner */}
            <View style={styles.statusPointsBanner}>
              <View style={styles.statusBadgeWrap}>
                {isVerified && (
                  <View style={[styles.statusBadge, styles.statusVerified]}>
                    <Ionicons name="checkmark-circle" size={14} color="#059669" style={{ marginRight: 4 }} />
                    <Text style={[styles.statusBadgeText, styles.statusVerifiedText]}>Verified</Text>
                  </View>
                )}
                {isPending && (
                  <View style={[styles.statusBadge, styles.statusPending]}>
                    <Ionicons name="time" size={14} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={[styles.statusBadgeText, styles.statusPendingText]}>Pending Verification</Text>
                  </View>
                )}
                {isCorrection && (
                  <View style={[styles.statusBadge, styles.statusCorrection]}>
                    <Ionicons name="alert-circle" size={14} color="#DC2626" style={{ marginRight: 4 }} />
                    <Text style={[styles.statusBadgeText, styles.statusCorrectionText]}>Correction Required</Text>
                  </View>
                )}
                {isDraft && (
                  <View style={[styles.statusBadge, styles.statusDraft]}>
                    <Ionicons name="document-outline" size={14} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={[styles.statusBadgeText, styles.statusDraftText]}>Draft</Text>
                  </View>
                )}
              </View>

              <View style={styles.pointsBlock}>
                <Text style={styles.pointsLabel}>SCORE</Text>
                <Text style={styles.pointsValue}>
                  {isVerified
                    ? `+${achievement.points} pts`
                    : `Est. +${achievement.points} pts`}
                </Text>
              </View>
            </View>

            {/* Correction Comment Alert */}
            {isCorrection && achievement.verificationComment && (
              <View style={styles.correctionAlert}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6, marginTop: 1 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.correctionAlertTitle}>Faculty Feedback</Text>
                  <Text style={styles.correctionAlertText}>{achievement.verificationComment}</Text>
                </View>
              </View>
            )}

            {/* Information Grid */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Achievement Details</Text>
              
              <View style={styles.infoGrid}>
                {achievement.organization ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Organization / Issuer</Text>
                    <Text style={styles.infoVal}>{achievement.organization}</Text>
                  </View>
                ) : null}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Event Date</Text>
                  <Text style={styles.infoVal}>{achievement.date}</Text>
                </View>

                {achievement.semester ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Academic Semester</Text>
                    <Text style={styles.infoVal}>Semester {achievement.semester}</Text>
                  </View>
                ) : null}

                {achievement.level ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Competition Level</Text>
                    <Text style={styles.infoVal}>{achievement.level}</Text>
                  </View>
                ) : null}

                {achievement.result ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Result / Outcome</Text>
                    <Text style={styles.infoVal}>{achievement.result}</Text>
                  </View>
                ) : null}

                {achievement.participation ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Participation</Text>
                    <Text style={styles.infoVal}>
                      {achievement.participation}
                      {achievement.teamRole ? ` • ${achievement.teamRole}` : ''}
                      {achievement.teamName ? ` (${achievement.teamName})` : ''}
                    </Text>
                  </View>
                ) : null}

                {achievement.cashPrize ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cash Prize</Text>
                    <Text style={[styles.infoVal, { color: '#059669' }]}>
                      {achievement.cashPrize}
                    </Text>
                  </View>
                ) : null}

                {achievement.proofId ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Proof Reference ID</Text>
                    <Text style={styles.infoVal}>{achievement.proofId}</Text>
                  </View>
                ) : null}

                {achievement.verificationDate ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Verified On</Text>
                    <Text style={styles.infoVal}>{achievement.verificationDate}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.actionRow}>
            {isCorrection ? (
              <TouchableOpacity
                style={[styles.primaryActionBtn, styles.correctionBtn]}
                activeOpacity={0.85}
                onPress={() => {
                  onClose();
                  if (onAction) onAction('correction');
                }}
              >
                <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionBtnText}>Update Proof Evidence</Text>
              </TouchableOpacity>
            ) : isDraft ? (
              <TouchableOpacity
                style={styles.primaryActionBtn}
                activeOpacity={0.85}
                onPress={() => {
                  onClose();
                  if (onAction) onAction('draft');
                }}
              >
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionBtnText}>Continue Submission</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.closeActionBtn}
                activeOpacity={0.75}
                onPress={onClose}
              >
                <Text style={styles.closeActionBtnText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  closeBtn: {
    padding: 4,
  },
  bodyScroll: {
    maxHeight: 400,
  },
  statusPointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 14,
  },
  statusBadgeWrap: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11.5,
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
  pointsBlock: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  pointsValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  correctionAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  correctionAlertTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 2,
  },
  correctionAlertText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'right',
    maxWidth: '55%',
  },
  actionRow: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  correctionBtn: {
    backgroundColor: '#DC2626',
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeActionBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
});
