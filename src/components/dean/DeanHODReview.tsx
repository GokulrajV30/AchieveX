// ─────────────────────────────────────────────────────────────
// AchieveX — Dean HOD Achievement Review
// Core Verification Screen for HOD Achievements
// Flow: Detail Header -> HOD Summary -> Achievement Details -> Evidence/Proofs -> Points -> Sticky Actions (Approve, Request Correction, Reject)
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
  getDeanStore,
  type DeanHODSubmission,
  type DeanProofFile,
} from '../../data/deanWorkspaceData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import { DEAN_SPACING } from './deanSpacing';

interface DeanHODReviewProps {
  submissionId: string;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function DeanHODReview({
  submissionId,
  onNavigate,
  onGoBack,
}: DeanHODReviewProps) {
  const store = getDeanStore();
  const submission = store.getSubmissionById(submissionId) || store.getAuthorizedSubmissions()[0];

  // Modals
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [proofPreviewModalVisible, setProofPreviewModalVisible] = useState(false);
  const [selectedProof, setSelectedProof] = useState<DeanProofFile | null>(null);

  // Form Fields
  const [correctionReason, setCorrectionReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  if (!submission) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Submission Not Found</Text>
          <Text style={styles.errorSubtitle}>
            This submission may not be within your authorized department scope or was removed.
          </Text>
          <TouchableOpacity style={styles.errorBackBtn} onPress={onGoBack}>
            <Text style={styles.errorBackBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Action Handlers
  const handleConfirmApprove = () => {
    store.approveSubmission(submission.id);
    setApproveModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Achievement Verified',
      message: 'The HOD submission has been approved.',
      primaryAction: {
        label: 'Done',
        onPress: () => onNavigate('deanVerificationQueue'),
      },
    });
  };

  const handleConfirmCorrection = () => {
    if (!correctionReason.trim()) {
      showAchieveXDialog({
        type: 'warning',
        title: 'Reason Required',
        message: 'Please provide what the HOD needs to update.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }
    store.requestCorrection(submission.id, correctionReason.trim());
    setCorrectionModalVisible(false);
    showAchieveXDialog({
      type: 'warning',
      title: 'Correction Requested',
      message: 'The submitter has been notified.',
      primaryAction: {
        label: 'Done',
        onPress: () => onNavigate('deanVerificationQueue'),
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
    store.rejectSubmission(submission.id, rejectReason.trim());
    setRejectModalVisible(false);
    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Submission Rejected',
      message: 'The decision has been recorded.',
      primaryAction: {
        label: 'Done',
        destructive: true,
        onPress: () => onNavigate('deanVerificationQueue'),
      },
    });
  };

  const openProofPreview = (proof: DeanProofFile) => {
    setSelectedProof(proof);
    setProofPreviewModalVisible(true);
  };

  const quickCorrectionReasons = [
    'Certificate scan is unclear or cut off.',
    'Missing Scopus / DOI indexing confirmation page.',
    'Please attach official fund sanction letter.',
    'Achievement date does not match certificate date.',
    'Organizer / publisher name requires verification.',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. SAFE DETAIL HEADER
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>HOD Achievement Review</Text>
            <Text style={styles.headerSubtitle}>Submission ID: {submission.id}</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE DETAIL CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* Previous Correction Alert Banner if resubmitted */}
          {submission.previousCorrectionReason ? (
            <View style={styles.correctionAlertBox}>
              <View style={styles.correctionAlertHeader}>
                <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.correctionAlertTitle}>PREVIOUS CORRECTION FEEDBACK</Text>
              </View>
              <Text style={styles.correctionAlertDesc}>{submission.previousCorrectionReason}</Text>
            </View>
          ) : null}

          {/* ════════════════════════════════════════════════
              2. HOD SUMMARY CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.card}>
            <View style={styles.hodProfileRow}>
              <View style={styles.hodAvatarBig}>
                <Ionicons name="person" size={22} color="#0D9488" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.hodFullName}>{submission.hodName}</Text>
                <Text style={styles.hodRoleText}>Head of Department</Text>
                <Text style={styles.hodDeptText}>{submission.departmentName}</Text>
                <Text style={styles.hodEmpIdText}>ID: {submission.hodEmployeeId}</Text>
              </View>
              <View style={styles.scopeBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#0D9488" style={{ marginRight: 3 }} />
                <Text style={styles.scopeBadgeText}>Authorized</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              3. ACHIEVEMENT DETAILS CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>ACHIEVEMENT DETAILS</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Title</Text>
              <Text style={styles.detailValueBold}>{submission.title}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{submission.categoryTitle}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Achievement Type</Text>
              <Text style={styles.detailValue}>{submission.achievementType}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Level / Tier</Text>
              <Text style={styles.detailValue}>{submission.level}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Result / Status</Text>
              <Text style={styles.detailValue}>{submission.result}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Organizer / Publisher</Text>
              <Text style={styles.detailValue}>{submission.organizer}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Achievement Date</Text>
              <Text style={styles.detailValue}>{submission.date}</Text>
            </View>

            {submission.semester ? (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Semester</Text>
                  <Text style={styles.detailValue}>{submission.semester}</Text>
                </View>
              </>
            ) : null}

            <View style={styles.divider} />

            <View style={styles.detailRowStacked}>
              <Text style={styles.detailLabel}>Description & Scope</Text>
              <Text style={styles.descriptionText}>{submission.description}</Text>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. EVIDENCE & PROOFS
          ════════════════════════════════════════════════ */}
          <View style={styles.card}>
            <View style={styles.proofsHeaderRow}>
              <Text style={styles.sectionHeading}>EVIDENCE & PROOF DOCUMENTS</Text>
              <Text style={styles.proofCountText}>({submission.proofs.length} files)</Text>
            </View>

            {submission.proofs.map((proof) => (
              <View key={proof.id} style={styles.proofItemRow}>
                <View style={styles.proofFileIcon}>
                  <Ionicons name="document-text" size={18} color="#0D9488" />
                </View>
                <View style={{ flex: 1, marginLeft: 10, marginRight: 8 }}>
                  <Text style={styles.proofFileName} numberOfLines={1}>
                    {proof.fileName}
                  </Text>
                  <Text style={styles.proofFileMeta}>
                    {proof.label} • {proof.fileSize}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.proofViewBtn}
                  activeOpacity={0.75}
                  onPress={() => openProofPreview(proof)}
                >
                  <Ionicons name="eye-outline" size={13} color="#0D9488" style={{ marginRight: 4 }} />
                  <Text style={styles.proofViewBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* ════════════════════════════════════════════════
              5. EVALUATION & POINTS
          ════════════════════════════════════════════════ */}
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>EVALUATION & POLICY POINTS</Text>

            <View style={styles.pointsDisplayBox}>
              <View style={styles.pointsCol}>
                <Text style={styles.pointsNumber}>+{submission.configuredPoints}</Text>
                <Text style={styles.pointsLabel}>Configured Policy Points</Text>
              </View>
              <View style={styles.pointsInfoCol}>
                <Ionicons name="shield-checkmark" size={18} color="#0D9488" style={{ marginBottom: 4 }} />
                <Text style={styles.pointsInfoText}>
                  Points are evaluated in accordance with institutional policy v2.1. Awarded upon Dean approval.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            6. STICKY REVIEW ACTIONS BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.stickyActionsBar}>
          <TouchableOpacity
            style={styles.actionRejectBtn}
            activeOpacity={0.8}
            onPress={() => setRejectModalVisible(true)}
          >
            <Ionicons name="close-circle-outline" size={16} color="#DC2626" style={{ marginRight: 4 }} />
            <Text style={styles.actionRejectText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCorrectionBtn}
            activeOpacity={0.8}
            onPress={() => setCorrectionModalVisible(true)}
          >
            <Ionicons name="create-outline" size={16} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={styles.actionCorrectionText}>Correction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionApproveBtn}
            activeOpacity={0.85}
            onPress={() => setApproveModalVisible(true)}
          >
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.actionApproveText}>Approve</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            7. APPROVE CONFIRMATION MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={approveModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setApproveModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.confirmModalBox}>
              <View style={styles.approveIconCircle}>
                <Ionicons name="checkmark-circle" size={32} color="#0D9488" />
              </View>

              <Text style={styles.confirmTitle}>Approve HOD Achievement?</Text>
              <Text style={styles.confirmSubtitle}>
                You are verifying "{submission.title}" for {submission.hodName} ({submission.departmentName}).
              </Text>

              <View style={styles.confirmPointsBox}>
                <Text style={styles.confirmPointsVal}>+{submission.configuredPoints} Points</Text>
                <Text style={styles.confirmPointsLbl}>will be credited to Department HOD transcript</Text>
              </View>

              <View style={styles.confirmBtnRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  activeOpacity={0.7}
                  onPress={() => setApproveModalVisible(false)}
                >
                  <Text style={styles.cancelModalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmApproveBtn}
                  activeOpacity={0.85}
                  onPress={handleConfirmApprove}
                >
                  <Text style={styles.confirmApproveBtnText}>Confirm Approval</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. REQUEST CORRECTION MODAL (Bottom Sheet)
        ════════════════════════════════════════════════ */}
        <Modal
          visible={correctionModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCorrectionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setCorrectionModalVisible(false)} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Request Correction</Text>
                  <Text style={styles.sheetSubtitle}>Provide actionable feedback for {submission.hodName}</Text>
                </View>
                <TouchableOpacity onPress={() => setCorrectionModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Quick Reason Suggestions</Text>
                <View style={styles.quickChipsRow}>
                  {quickCorrectionReasons.map((r, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.quickChip}
                      onPress={() => setCorrectionReason(r)}
                    >
                      <Text style={styles.quickChipText}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.fieldLabel}>Specific Feedback / Instructions *</Text>
                <TextInput
                  style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Detail the exact missing proofs, document clarifications, or corrections required..."
                  placeholderTextColor="#94A3B8"
                  value={correctionReason}
                  onChangeText={setCorrectionReason}
                />
                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.sendCorrectionBtn}
                  activeOpacity={0.8}
                  onPress={handleConfirmCorrection}
                >
                  <Text style={styles.sendCorrectionBtnText}>Send Correction Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            9. REJECT CONFIRMATION MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={rejectModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setRejectModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setRejectModalVisible(false)} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={[styles.sheetTitle, { color: '#DC2626' }]}>Reject Achievement</Text>
                  <Text style={styles.sheetSubtitle}>Submission will not receive points; record preserved for audit</Text>
                </View>
                <TouchableOpacity onPress={() => setRejectModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Rejection Justification *</Text>
                <TextInput
                  style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Provide institutional rationale for rejection (e.g. ineligible category, duplicated submission)..."
                  placeholderTextColor="#94A3B8"
                  value={rejectReason}
                  onChangeText={setRejectReason}
                />
                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.confirmRejectBtn}
                  activeOpacity={0.8}
                  onPress={handleConfirmReject}
                >
                  <Text style={styles.confirmRejectBtnText}>Confirm Rejection</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            10. PROOF FILE PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={proofPreviewModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setProofPreviewModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.previewModalBox}>
              <View style={styles.previewHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle} numberOfLines={1}>
                    {selectedProof?.fileName}
                  </Text>
                  <Text style={styles.previewSubtitle}>
                    {selectedProof?.label} • {selectedProof?.fileSize}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setProofPreviewModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.simulatedDocument}>
                <Ionicons name="document-text" size={48} color="#0D9488" style={{ marginBottom: 12 }} />
                <Text style={styles.simDocTitle}>{selectedProof?.label}</Text>
                <Text style={styles.simDocSubtitle}>Document verified by Nandha Engineering College Digital Registry</Text>
                <View style={styles.simDocStamp}>
                  <Ionicons name="shield-checkmark" size={14} color="#059669" style={{ marginRight: 4 }} />
                  <Text style={styles.simDocStampText}>Digital Integrity Verified</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.previewDoneBtn}
                activeOpacity={0.8}
                onPress={() => setProofPreviewModalVisible(false)}
              >
                <Text style={styles.previewDoneBtnText}>Done</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: DEAN_SPACING.screenTop,
    paddingBottom: DEAN_SPACING.stickyActionClearance,
  },
  correctionAlertBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: DEAN_SPACING.titleToContent,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  correctionAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  correctionAlertTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  correctionAlertDesc: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: DEAN_SPACING.cardRadiusCompact,
    padding: DEAN_SPACING.cardPadding,
    marginBottom: DEAN_SPACING.betweenSections,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  hodProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hodAvatarBig: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hodFullName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  hodRoleText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 1,
  },
  hodDeptText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  hodEmpIdText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  scopeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#99F6E4',
    alignSelf: 'flex-start',
  },
  scopeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailRowStacked: {
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  detailValueBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1.5,
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginVertical: 2,
  },
  proofsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  proofCountText: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 6,
    marginBottom: 10,
  },
  proofItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofFileIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofFileName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  proofFileMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  proofViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  proofViewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  pointsDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  pointsCol: {
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#99F6E4',
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0D9488',
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 2,
  },
  pointsInfoCol: {
    flex: 1,
    paddingLeft: 12,
  },
  pointsInfoText: {
    fontSize: 11,
    color: '#115E59',
    lineHeight: 15,
  },
  stickyActionsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  actionRejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionRejectText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  actionCorrectionBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionCorrectionText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  actionApproveBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionApproveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  approveIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
  },
  confirmPointsBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  confirmPointsVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D9488',
  },
  confirmPointsLbl: {
    fontSize: 10,
    color: '#0F766E',
    marginTop: 2,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelModalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmApproveBtn: {
    flex: 1.5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
  },
  confirmApproveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    marginTop: 6,
  },
  quickChipsRow: {
    gap: 6,
    marginBottom: 12,
  },
  quickChip: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  quickChipText: {
    fontSize: 11,
    color: '#B45309',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sendCorrectionBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendCorrectionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmRejectBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmRejectBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  previewModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  simulatedDocument: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  simDocTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  simDocSubtitle: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 12,
  },
  simDocStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  simDocStampText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  previewDoneBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  previewDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  errorBackBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorBackBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
