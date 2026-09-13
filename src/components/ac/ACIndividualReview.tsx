// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Individual Review
// Detailed inspection of single student submissions, proof validation,
// and exception resolution (Request Correction / Approve / Reject).
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SIH_STUDENT_SUBMISSIONS, type ACStudentSubmission } from '../../data/acWorkspaceData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface ACIndividualReviewProps {
  submission?: ACStudentSubmission;
  onGoBack: () => void;
  onActionComplete: () => void;
}

const CORRECTION_REASONS = [
  'Certificate missing',
  'Certificate unclear / blurry',
  'Wrong certificate uploaded',
  'Incorrect event details',
  'Incorrect result / rank',
  'Name mismatch on document',
  'Duplicate submission',
  'Other issue',
];

export default function ACIndividualReview({
  submission = SIH_STUDENT_SUBMISSIONS[4], // Default to Jeeva M (Needs Attention demo record)
  onGoBack,
  onActionComplete,
}: ACIndividualReviewProps) {
  const [currentSubmission, setCurrentSubmission] = useState<ACStudentSubmission>(submission);
  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(CORRECTION_REASONS[0]);
  const [customNote, setCustomNote] = useState('');
  const [proofPreviewVisible, setProofPreviewVisible] = useState(false);

  useEffect(() => {
    setCurrentSubmission(submission);
  }, [submission]);

  const isApproved = currentSubmission.status === 'Approved';
  const isCorrection = currentSubmission.status === 'Correction Required';

  const handleApprove = () => {
    setCurrentSubmission((prev) => ({
      ...prev,
      status: 'Approved',
      isReady: false,
    }));
    showAchieveXDialog({
      type: 'success',
      title: 'Achievement Verified',
      message: 'Verification completed successfully.',
      primaryAction: {
        label: 'Done',
        onPress: onActionComplete,
      },
    });
  };

  const handleSendCorrection = () => {
    setCurrentSubmission((prev) => ({
      ...prev,
      status: 'Correction Required',
      issueReason: selectedReason,
      feedback: customNote.trim() || undefined,
      isReady: false,
    }));
    setCorrectionModalVisible(false);
    showAchieveXDialog({
      type: 'warning',
      title: 'Correction Requested',
      message: 'The submitter has been notified.',
      primaryAction: {
        label: 'Done',
        onPress: onActionComplete,
      },
    });
  };

  const handleReject = () => {
    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Reject Achievement?',
      message: 'This submission will be marked as rejected.',
      secondaryAction: {
        label: 'Cancel',
      },
      primaryAction: {
        label: 'Reject',
        destructive: true,
        onPress: () => {
          setCurrentSubmission((prev) => ({
            ...prev,
            status: 'Rejected',
            isReady: false,
          }));
          showAchieveXDialog({
            type: 'actionRequired',
            title: 'Submission Rejected',
            message: 'The decision has been recorded.',
            primaryAction: {
              label: 'Done',
              onPress: onActionComplete,
            },
          });
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Review Submission</Text>
            <Text style={styles.headerSubtitle}>Individual Achievement Inspection</Text>
          </View>

          <TouchableOpacity style={styles.moreBtn} onPress={handleReject}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            MAIN SCROLLABLE CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Student Profile Card */}
          <View style={styles.studentCard}>
            <View style={styles.studentAvatar}>
              <Text style={styles.avatarText}>
                {currentSubmission.studentName.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentDetailsCol}>
              <Text style={styles.studentName}>{currentSubmission.studentName}</Text>
              <Text style={styles.studentSub}>
                {currentSubmission.rollNo} • {currentSubmission.department}
              </Text>
              <Text style={styles.studentScope}>
                Year {currentSubmission.year} • Section {currentSubmission.section}
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                isApproved && styles.statusPillApproved,
                currentSubmission.status === 'Needs Attention' && styles.statusPillAttention,
                isCorrection && styles.statusPillCorrection,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  isApproved && styles.statusPillTextApproved,
                  currentSubmission.status === 'Needs Attention' && styles.statusPillTextAttention,
                  isCorrection && styles.statusPillTextCorrection,
                ]}
              >
                {currentSubmission.status}
              </Text>
            </View>
          </View>

          {/* Issue Alert if Problem Exists */}
          {currentSubmission.issueReason && (
            <View style={styles.issueAlertBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.issueAlertTitle}>Validation Flag</Text>
                <Text style={styles.issueAlertDesc}>{currentSubmission.issueReason}</Text>
              </View>
            </View>
          )}

          {/* Achievement Details Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardSectionTitle}>Achievement Details</Text>

            <View style={styles.keyValueGrid}>
              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Event Title</Text>
                <Text style={styles.valText}>{currentSubmission.eventName}</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Category</Text>
                <Text style={styles.valText}>{currentSubmission.category}</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Achievement Type</Text>
                <Text style={styles.valText}>{currentSubmission.achievementType}</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Organizer</Text>
                <Text style={styles.valText}>{currentSubmission.organizer}</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Level</Text>
                <Text style={styles.valText}>{currentSubmission.level}</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Result / Standing</Text>
                <Text style={[styles.valText, { color: '#2563EB', fontWeight: '700' }]}>
                  {currentSubmission.result} {currentSubmission.teamRole ? `(${currentSubmission.teamRole})` : ''}
                </Text>
              </View>

              {currentSubmission.cashPrize && (
                <View style={styles.keyValRow}>
                  <Text style={styles.keyLabel}>Cash Prize</Text>
                  <Text style={[styles.valText, { color: '#16A34A', fontWeight: '700' }]}>
                    {currentSubmission.cashPrize}
                  </Text>
                </View>
              )}

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Date & Semester</Text>
                <Text style={styles.valText}>
                  {currentSubmission.date} • {currentSubmission.semester}
                </Text>
              </View>
            </View>
          </View>

          {/* Proof Evidence Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardSectionTitle}>Student Proof Documents</Text>

            {currentSubmission.hasIndividualProof ? (
              <TouchableOpacity
                style={styles.proofItemCard}
                activeOpacity={0.7}
                onPress={() => setProofPreviewVisible(true)}
              >
                <Ionicons name="document-text" size={24} color="#2563EB" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.proofTitle}>Individual Certificate</Text>
                  <Text style={styles.proofSub}>{currentSubmission.individualProofName}</Text>
                </View>
                <View style={styles.viewBadge}>
                  <Text style={styles.viewBadgeText}>Inspect ›</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.missingProofBox}>
                <Ionicons name="close-circle" size={20} color="#DC2626" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.missingProofTitle}>No Certificate Uploaded</Text>
                  <Text style={styles.missingProofDesc}>
                    The student has not attached an individual participation certificate.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Automatic Points Calculation */}
          <View style={styles.pointsRuleCard}>
            <View style={styles.pointsTopRow}>
              <Ionicons name="calculator" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.pointsRuleTitle}>Points Engine Rule (Automatic)</Text>
            </View>
            <Text style={styles.pointsRuleDesc}>
              Derived from: {currentSubmission.level} • {currentSubmission.category} • {currentSubmission.result}
            </Text>
            <View style={styles.pointsValRow}>
              <Text style={styles.pointsValLabel}>Calculated Points:</Text>
              <Text style={styles.pointsValNumber}>+{currentSubmission.calculatedPoints} pts</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            2. STICKY BOTTOM ACTIONS
        ════════════════════════════════════════════════ */}
        <View style={styles.bottomActionBar}>
          <TouchableOpacity
            style={styles.correctionBtn}
            activeOpacity={0.8}
            onPress={() => setCorrectionModalVisible(true)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#D97706" style={{ marginRight: 6 }} />
            <Text style={styles.correctionBtnText}>Request Correction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveBtn}
            activeOpacity={0.85}
            onPress={handleApprove}
          >
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            3. CORRECTION BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={correctionModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setCorrectionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.correctionSheetCard}>
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.modalSheetTitle}>Request Correction</Text>
                  <Text style={styles.modalSheetSub}>Select reason to notify {currentSubmission.studentName}</Text>
                </View>
                <TouchableOpacity onPress={() => setCorrectionModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.reasonsHeader}>CORRECTION REASON</Text>
              <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                {CORRECTION_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonOptionRow,
                      selectedReason === reason && styles.reasonOptionRowActive,
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <Ionicons
                      name={selectedReason === reason ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={selectedReason === reason ? '#2563EB' : '#94A3B8'}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={[
                        styles.reasonOptionText,
                        selectedReason === reason && styles.reasonOptionTextActive,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.noteLabel}>ADDITIONAL NOTE FOR STUDENT (OPTIONAL)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="e.g. Please upload the official PDF certificate with seal..."
                placeholderTextColor="#94A3B8"
                value={customNote}
                onChangeText={setCustomNote}
                multiline
              />

              <View style={styles.correctionActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setCorrectionModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sendCorrectionBtn}
                  onPress={handleSendCorrection}
                >
                  <Text style={styles.sendCorrectionText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            4. PROOF PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        {proofPreviewVisible && (
          <Modal
            visible={proofPreviewVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setProofPreviewVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.proofModalCard}>
                <View style={styles.modalHeaderRow}>
                  <View>
                    <Text style={styles.modalSheetTitle}>Proof Document</Text>
                    <Text style={styles.modalSheetSub}>{currentSubmission.individualProofName}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setProofPreviewVisible(false)}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.proofViewerBox}>
                  <Ionicons name="document-text" size={48} color="#2563EB" />
                  <Text style={styles.proofViewerName}>{currentSubmission.individualProofName}</Text>
                  <Text style={styles.proofViewerStatus}>
                    Submitted by {currentSubmission.studentName} ({currentSubmission.rollNo})
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.proofDoneBtn}
                  onPress={() => setProofPreviewVisible(false)}
                >
                  <Text style={styles.proofDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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

  /* Header */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Scroll Content */
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  /* Student Card */
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  studentDetailsCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  studentScope: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  statusPillApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusPillAttention: {
    backgroundColor: '#FEE2E2',
  },
  statusPillCorrection: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  statusPillTextApproved: {
    color: '#16A34A',
  },
  statusPillTextAttention: {
    color: '#DC2626',
  },
  statusPillTextCorrection: {
    color: '#D97706',
  },

  /* Issue Alert */
  issueAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  issueAlertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  issueAlertDesc: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 1,
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  keyValueGrid: {
    gap: 8,
  },
  keyValRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  valText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },

  /* Proof Card */
  proofItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  viewBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  missingProofBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
  },
  missingProofTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  missingProofDesc: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 1,
  },

  /* Points Engine Rule Card */
  pointsRuleCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 12,
  },
  pointsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pointsRuleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  pointsRuleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  pointsValRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
    paddingTop: 8,
  },
  pointsValLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pointsValNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* Bottom Actions */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  correctionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  correctionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  correctionSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSheetSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  reasonsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  reasonOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reasonOptionRowActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  reasonOptionText: {
    fontSize: 13,
    color: '#334155',
  },
  reasonOptionTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },
  noteInput: {
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  correctionActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  sendCorrectionBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCorrectionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Proof Modal */
  proofModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  proofViewerBox: {
    height: 180,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 14,
  },
  proofViewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  proofViewerStatus: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  proofDoneBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofDoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
