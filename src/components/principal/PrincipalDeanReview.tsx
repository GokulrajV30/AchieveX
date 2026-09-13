// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Dean Achievement Review
// Verification Screen for Dean Personal Achievements
// Flow: Detail Header -> Dean Summary -> Details -> Evidence/Proofs -> Points -> Sticky Actions
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  principalDataStore,
  type DeanPersonalSubmission,
} from '../../data/principalWorkspaceData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface PrincipalDeanReviewProps {
  submissionId: string;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalDeanReview({
  submissionId,
  onNavigate,
  onGoBack,
}: PrincipalDeanReviewProps) {
  const submission =
    principalDataStore.getSubmissionById(submissionId) ||
    principalDataStore.getSubmissions()[0];

  // Modals
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [proofPreviewModalVisible, setProofPreviewModalVisible] = useState(false);
  const [selectedProof, setSelectedProof] = useState<any>(null);

  // Form Fields
  const [approvalNotes, setApprovalNotes] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  if (!submission) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Submission Not Found</Text>
          <Text style={styles.errorSubtitle}>
            This submission may have been removed or does not exist.
          </Text>
          <TouchableOpacity style={styles.errorBackBtn} onPress={onGoBack}>
            <Text style={styles.errorBackBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Quick reasons for correction
  const quickCorrectionReasons = [
    'Official proof document unclear or unreadable',
    'Missing institutional finance/revenue endorsement',
    'Incorrect level or result category selected',
    'Please attach original sanction order / gazette copy',
    'Other clarification required',
  ];

  const handleConfirmApprove = () => {
    principalDataStore.approveSubmission(submission.id, approvalNotes.trim());
    setApproveModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Achievement Verified',
      message: 'The Dean submission has been approved.',
      primaryAction: {
        label: 'Done',
        onPress: () => onNavigate('principalVerificationQueue'),
      },
    });
  };

  const handleConfirmCorrection = () => {
    if (!correctionReason.trim()) {
      showAchieveXDialog({
        type: 'warning',
        title: 'Reason Required',
        message: 'Please provide what the Dean needs to update.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }
    principalDataStore.requestCorrection(submission.id, correctionReason.trim());
    setCorrectionModalVisible(false);
    showAchieveXDialog({
      type: 'warning',
      title: 'Correction Requested',
      message: 'The submitter has been notified.',
      primaryAction: {
        label: 'Done',
        onPress: () => onNavigate('principalVerificationQueue'),
      },
    });
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      showAchieveXDialog({
        type: 'warning',
        title: 'Reason Required',
        message: 'Please provide a reason for rejecting this submission.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }
    principalDataStore.rejectSubmission(submission.id, rejectReason.trim());
    setRejectModalVisible(false);
    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Submission Rejected',
      message: 'The decision has been recorded.',
      primaryAction: {
        label: 'Done',
        destructive: true,
        onPress: () => onNavigate('principalVerificationQueue'),
      },
    });
  };

  const isActionable =
    submission.status === 'Pending Review' || submission.status === 'Correction Required';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.identityCol}>
            <Text style={styles.screenTitle}>Dean Achievement Review</Text>
            <Text style={styles.screenSubtext}>ID: {submission.id}</Text>
          </View>
          <View style={styles.statusBadgeTop}>
            <Text style={styles.statusBadgeTopText}>{submission.status}</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Previous Correction Alert (if applicable) */}
          {submission.previousCorrectionReason && (
            <View style={styles.correctionNoticeCard}>
              <View style={styles.correctionNoticeHeader}>
                <Ionicons name="alert-circle" size={18} color="#C2410C" style={{ marginRight: 6 }} />
                <Text style={styles.correctionNoticeTitle}>Previous Correction Feedback</Text>
              </View>
              <Text style={styles.correctionNoticeBody}>
                {submission.previousCorrectionReason}
              </Text>
            </View>
          )}

          {/* 1. Dean Profile Summary */}
          <View style={styles.deanCard}>
            <View style={styles.deanAvatar}>
              <Text style={styles.deanAvatarText}>
                {submission.deanName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={styles.deanInfo}>
              <Text style={styles.deanName}>{submission.deanName}</Text>
              <Text style={styles.deanDesignation}>{submission.designation}</Text>
              <Text style={styles.deanInstitution}>
                Nandha Engineering College • {submission.deanEmployeeId}
              </Text>
            </View>
          </View>

          {/* 2. Achievement Details */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionHeader}>Achievement Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Title</Text>
              <Text style={styles.detailValueBold}>{submission.title}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{submission.categoryTitle}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Achievement Type</Text>
              <Text style={styles.detailValue}>{submission.achievementType}</Text>
            </View>

            <View style={styles.splitRow}>
              <View style={[styles.detailRow, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.detailLabel}>Level</Text>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>{submission.level}</Text>
                </View>
              </View>

              <View style={[styles.detailRow, { flex: 1 }]}>
                <Text style={styles.detailLabel}>Academic Year</Text>
                <Text style={styles.detailValue}>{submission.academicYear}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Result / Impact</Text>
              <Text style={styles.detailValue}>{submission.result}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Organizer / Publisher</Text>
              <Text style={styles.detailValue}>{submission.organizer}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Achievement Date</Text>
              <Text style={styles.detailValue}>{submission.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailDescText}>{submission.description}</Text>
            </View>
          </View>

          {/* 3. Evidence & Proofs */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Evidence & Proofs</Text>
              <Text style={styles.proofCountLabel}>
                {submission.proofs.length} File{submission.proofs.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {submission.proofs.map((proof) => (
              <View key={proof.id} style={styles.proofCard}>
                <View style={styles.proofIconBox}>
                  <Ionicons name="document-text" size={20} color="#2563EB" />
                </View>
                <View style={styles.proofInfoCol}>
                  <Text style={styles.proofLabelText}>{proof.label}</Text>
                  <Text style={styles.proofMetaText}>
                    {proof.fileName} • {proof.fileSize}
                  </Text>
                </View>
                <View style={styles.proofStatusBadge}>
                  <Text style={styles.proofStatusBadgeText}>{proof.status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.proofViewBtn}
                  onPress={() => {
                    setSelectedProof(proof);
                    setProofPreviewModalVisible(true);
                  }}
                >
                  <Ionicons name="eye-outline" size={16} color="#0F172A" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.proofRuleNotice}>
              <Ionicons name="information-circle-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.proofRuleNoticeText}>
                Proof standards established under institutional policy by Achievement Head.
              </Text>
            </View>
          </View>

          {/* 4. Points & Governance Policy */}
          <View style={styles.pointsCard}>
            <View style={styles.pointsTopRow}>
              <View>
                <Text style={styles.pointsLabel}>Configured Institutional Points</Text>
                <Text style={styles.pointsSub}>Per Achievement Head Scoring Matrix</Text>
              </View>
              <View style={styles.pointsPill}>
                <Text style={styles.pointsPillNumber}>{submission.configuredPoints}</Text>
                <Text style={styles.pointsPillLabel}>Points</Text>
              </View>
            </View>
            <View style={styles.pointsDivider} />
            <Text style={styles.pointsFooterText}>
              Principal authorization verifies the legitimacy of institutional activity. Final points awarded upon verification match policy.
            </Text>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: isActionable ? 140 : 60 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            STICKY ACTION BAR (APPROVE, CORRECTION, REJECT)
        ════════════════════════════════════════════════ */}
        {isActionable && (
          <View style={styles.stickyActionBar}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              activeOpacity={0.8}
              onPress={() => setRejectModalVisible(true)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#DC2626" style={{ marginRight: 4 }} />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.correctionBtn]}
              activeOpacity={0.8}
              onPress={() => setCorrectionModalVisible(true)}
            >
              <Ionicons name="create-outline" size={18} color="#D97706" style={{ marginRight: 4 }} />
              <Text style={styles.correctionBtnText}>Correction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              activeOpacity={0.8}
              onPress={() => setApproveModalVisible(true)}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ════════════════════════════════════════════════
            APPROVE CONFIRMATION MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={approveModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setApproveModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.approveIconCircle}>
                <Ionicons name="checkmark" size={28} color="#16A34A" />
              </View>

              <Text style={styles.confirmModalTitle}>Approve Achievement?</Text>
              <Text style={styles.confirmModalSubtitle}>
                {submission.deanName} • {submission.title}
              </Text>

              <View style={styles.awardPointsBox}>
                <Text style={styles.awardPointsLabel}>Configured Points to Award</Text>
                <Text style={styles.awardPointsNumber}>{submission.configuredPoints} Points</Text>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="Optional executive endorsement notes..."
                placeholderTextColor="#94A3B8"
                value={approvalNotes}
                onChangeText={setApprovalNotes}
              />

              <Text style={styles.confirmNoteText}>
                This achievement will be officially verified in institutional records and attributed to {submission.deanName}.
              </Text>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setApproveModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmApproveBtn}
                  onPress={handleConfirmApprove}
                >
                  <Text style={styles.modalConfirmApproveBtnText}>Confirm Approval</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            REQUEST CORRECTION MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={correctionModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setCorrectionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Request Correction</Text>
                <TouchableOpacity onPress={() => setCorrectionModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.correctionHelperText}>
                Specify required adjustments for {submission.deanName}. The Dean will update and resubmit the same record.
              </Text>

              {/* Quick Reason Chips */}
              <Text style={styles.quickLabel}>QUICK REASONS</Text>
              <View style={styles.quickChipsRow}>
                {quickCorrectionReasons.map((reason, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.quickChip}
                    onPress={() => setCorrectionReason(reason)}
                  >
                    <Text style={styles.quickChipText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.quickLabel}>SPECIFIC FEEDBACK *</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Detail what needs correction or re-upload..."
                placeholderTextColor="#94A3B8"
                value={correctionReason}
                onChangeText={setCorrectionReason}
              />

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setCorrectionModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSendCorrectionBtn}
                  onPress={handleConfirmCorrection}
                >
                  <Text style={styles.modalSendCorrectionBtnText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            REJECT MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={rejectModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setRejectModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={[styles.approveIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="close" size={28} color="#DC2626" />
              </View>

              <Text style={styles.confirmModalTitle}>Reject Achievement?</Text>
              <Text style={styles.confirmModalSubtitle}>
                This record will be permanently marked as rejected. No points will be awarded.
              </Text>

              <Text style={[styles.quickLabel, { marginTop: 12 }]}>JUSTIFICATION / REASON *</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                placeholder="Mandatory reason for rejection..."
                placeholderTextColor="#94A3B8"
                value={rejectReason}
                onChangeText={setRejectReason}
              />

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setRejectModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalRejectBtn}
                  onPress={handleConfirmReject}
                >
                  <Text style={styles.modalRejectBtnText}>Confirm Rejection</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            PROOF PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={proofPreviewModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setProofPreviewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProof?.label || 'Proof Preview'}</Text>
                <TouchableOpacity onPress={() => setProofPreviewModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <View style={styles.previewSimulationBox}>
                <Ionicons name="document-attach-outline" size={48} color="#2563EB" />
                <Text style={styles.previewSimTitle}>{selectedProof?.fileName}</Text>
                <Text style={styles.previewSimMeta}>
                  File Size: {selectedProof?.fileSize} • Uploaded: {selectedProof?.uploadedAt}
                </Text>
                <Text style={styles.previewSimNotice}>
                  Official document certified by {submission.deanName}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.previewCloseBtn}
                onPress={() => setProofPreviewModalVisible(false)}
              >
                <Text style={styles.previewCloseBtnText}>Close Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  identityCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  screenSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadgeTop: {
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  statusBadgeTopText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
  },
  correctionNoticeCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  correctionNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  correctionNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  correctionNoticeBody: {
    fontSize: 12,
    color: '#9A3412',
    lineHeight: 16,
  },
  deanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deanAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEFCE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  deanAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
  },
  deanInfo: {
    flex: 1,
  },
  deanName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  deanDesignation: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 1,
  },
  deanInstitution: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  detailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  proofCountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  detailRow: {
    marginBottom: 10,
  },
  splitRow: {
    flexDirection: 'row',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
  },
  detailValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
  },
  detailDescText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  levelPill: {
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  levelPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  proofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  proofInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  proofLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  proofMetaText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  proofStatusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  proofStatusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  proofViewBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofRuleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  proofRuleNoticeText: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },
  pointsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  pointsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  pointsSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pointsPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  pointsPillNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  pointsPillLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  pointsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  pointsFooterText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  stickyActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  correctionBtn: {
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  correctionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  approveBtn: {
    backgroundColor: '#16A34A',
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorBackBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  errorBackBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  approveIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  confirmModalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  awardPointsBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  awardPointsLabel: {
    fontSize: 11,
    color: '#2563EB',
  },
  awardPointsNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
    marginTop: 2,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 10,
  },
  confirmNoteText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 15,
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 6,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirmApproveBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  modalConfirmApproveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  correctionHelperText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  quickChip: {
    backgroundColor: '#FEFCE8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginRight: 6,
    marginBottom: 6,
  },
  quickChipText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    textAlignVertical: 'top',
    height: 80,
    marginBottom: 14,
  },
  modalSendCorrectionBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  modalSendCorrectionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalRejectBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  modalRejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewSimulationBox: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
  },
  previewSimTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  previewSimMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  previewSimNotice: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
  },
  previewCloseBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  previewCloseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
