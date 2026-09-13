// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Faculty Review Screen
// Faculty Summary -> Details -> Proofs -> Sticky Bottom Actions (Approve / Correction / Reject)
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHODStore,
  STANDARDIZED_CORRECTION_REASONS,
  type HODFacultySubmission,
  type FacultyProofItem,
} from '../../data/hodWorkspaceData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface HODFacultyReviewProps {
  submissionId: string;
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HODFacultyReview({
  submissionId,
  onGoBack,
  onNavigate,
}: HODFacultyReviewProps) {
  const store = getHODStore();
  const submission = store.getSubmissionById(submissionId) || store.submissions[0];

  // Modals
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [selectedProof, setSelectedProof] = useState<FacultyProofItem | null>(null);

  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  const [selectedReason, setSelectedReason] = useState(STANDARDIZED_CORRECTION_REASONS[0]);
  const [correctionNote, setCorrectionNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!submission) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Submission not found.</Text>
          <TouchableOpacity style={styles.errorBtn} onPress={onGoBack}>
            <Text style={styles.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenProof = (proof: FacultyProofItem) => {
    setSelectedProof(proof);
    setProofModalVisible(true);
  };

  const handleApproveConfirm = () => {
    store.approveSubmission(submission.id);
    setApproveModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Achievement Verified',
      message: 'The faculty submission has been verified.',
      primaryAction: {
        label: 'Done',
        onPress: onGoBack,
      },
    });
  };

  const handleCorrectionSubmit = () => {
    store.requestCorrection(submission.id, selectedReason, correctionNote);
    setCorrectionModalVisible(false);
    showAchieveXDialog({
      type: 'warning',
      title: 'Correction Requested',
      message: 'The submitter has been notified.',
      primaryAction: {
        label: 'Done',
        onPress: onGoBack,
      },
    });
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      showAchieveXDialog({
        type: 'warning',
        title: 'Reason Required',
        message: 'Please provide a valid reason for rejection.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }
    store.rejectSubmission(submission.id, rejectionReason);
    setRejectModalVisible(false);
    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Submission Rejected',
      message: 'The decision has been recorded.',
      primaryAction: {
        label: 'Done',
        destructive: true,
        onPress: onGoBack,
      },
    });
  };

  const isPending = submission.status === 'Pending';
  const isApproved = submission.status === 'Approved';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Review Submission</Text>
            <Text style={styles.headerSubtitle}>{submission.facultyName}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Status banner */}
          <View
            style={[
              styles.statusBanner,
              isApproved
                ? styles.statusBannerApproved
                : submission.status === 'Correction Required'
                ? styles.statusBannerCorrection
                : styles.statusBannerPending,
            ]}
          >
            <Ionicons
              name={
                isApproved
                  ? 'checkmark-circle'
                  : submission.status === 'Correction Required'
                  ? 'alert-circle'
                  : 'time'
              }
              size={18}
              color={
                isApproved
                  ? '#16A34A'
                  : submission.status === 'Correction Required'
                  ? '#EA580C'
                  : '#D97706'
              }
            />
            <Text
              style={[
                styles.statusBannerText,
                {
                  color: isApproved
                    ? '#16A34A'
                    : submission.status === 'Correction Required'
                    ? '#EA580C'
                    : '#D97706',
                },
              ]}
            >
              Status: {submission.status}
            </Text>
          </View>

          {/* 1. Faculty Summary Card */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="person-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Faculty Details</Text>
            </View>

            <View style={styles.facultyDetailsRow}>
              <View style={styles.facultyAvatarLarge}>
                <Ionicons name="person" size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.facultyNameText}>{submission.facultyName}</Text>
                <Text style={styles.facultyDesignationText}>{submission.designation}</Text>
                <Text style={styles.facultyMetaText}>
                  {submission.department} • {submission.facultyId}
                </Text>
              </View>
            </View>
          </View>

          {/* 2. Achievement Details */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="ribbon-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Achievement Information</Text>
            </View>

            <Text style={styles.achievementMainTitle}>{submission.achievementTitle}</Text>

            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Category</Text>
                <Text style={styles.gridValue}>{submission.category}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Achievement Type</Text>
                <Text style={styles.gridValue}>{submission.achievementType}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Organizer / Issuer</Text>
                <Text style={styles.gridValue}>{submission.organizer}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Level</Text>
                <Text style={styles.gridValue}>{submission.level}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Date of Event</Text>
                <Text style={styles.gridValue}>{submission.date}</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Result / Score</Text>
                <Text style={[styles.gridValue, { color: '#16A34A', fontWeight: '800' }]}>
                  {submission.result}
                </Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={styles.gridLabel}>Academic Year</Text>
                <Text style={styles.gridValue}>{submission.academicYear}</Text>
              </View>
              {submission.points ? (
                <View style={styles.gridRow}>
                  <Text style={styles.gridLabel}>Points Claimed</Text>
                  <Text style={[styles.gridValue, { color: '#2563EB', fontWeight: '800' }]}>
                    {submission.points} Points
                  </Text>
                </View>
              ) : null}
            </View>

            {submission.description ? (
              <View style={styles.descBox}>
                <Text style={styles.descLabel}>Description / Abstract:</Text>
                <Text style={styles.descText}>{submission.description}</Text>
              </View>
            ) : null}
          </View>

          {/* 3. Evidence / Proofs */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="document-attach-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>
                Uploaded Evidence ({submission.proofs.length})
              </Text>
            </View>

            {submission.proofs.map((proof) => (
              <View key={proof.id} style={styles.proofItemRow}>
                <View style={styles.proofIconBox}>
                  <Ionicons
                    name={proof.fileType === 'pdf' ? 'document-text' : 'image'}
                    size={18}
                    color="#2563EB"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.proofLabel}>{proof.label}</Text>
                  <Text style={styles.proofMeta}>
                    {proof.fileName} • {proof.fileSize}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewProofBtn}
                  activeOpacity={0.75}
                  onPress={() => handleOpenProof(proof)}
                >
                  <Text style={styles.viewProofBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 4. Sticky Bottom Action Area */}
        {isPending && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.rejectBtn}
              activeOpacity={0.8}
              onPress={() => setRejectModalVisible(true)}
            >
              <Ionicons name="close" size={16} color="#DC2626" />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.correctionBtn}
              activeOpacity={0.8}
              onPress={() => setCorrectionModalVisible(true)}
            >
              <Ionicons name="alert-circle-outline" size={16} color="#D97706" />
              <Text style={styles.correctionBtnText}>Correction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveBtn}
              activeOpacity={0.8}
              onPress={() => setApproveModalVisible(true)}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Proof Preview Modal */}
        <Modal
          visible={proofModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setProofModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProof?.label}</Text>
                <TouchableOpacity onPress={() => setProofModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
              <View style={styles.proofPreviewBody}>
                <Ionicons name="document-text" size={48} color="#2563EB" />
                <Text style={styles.proofPreviewFileName}>{selectedProof?.fileName}</Text>
                <Text style={styles.proofPreviewFileSize}>{selectedProof?.fileSize}</Text>
                <View style={styles.verifiedTag}>
                  <Ionicons name="shield-checkmark" size={13} color="#16A34A" style={{ marginRight: 4 }} />
                  <Text style={styles.verifiedTagText}>Official Faculty Submission Evidence</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closePreviewBtn}
                onPress={() => setProofModalVisible(false)}
              >
                <Text style={styles.closePreviewBtnText}>Close Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Approve Confirmation Modal */}
        <Modal
          visible={approveModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setApproveModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.confirmHeader}>
                <View style={styles.confirmIconBox}>
                  <Ionicons name="checkmark" size={24} color="#16A34A" />
                </View>
                <Text style={styles.confirmTitle}>Approve Faculty Achievement?</Text>
                <Text style={styles.confirmSub}>
                  Are you sure you want to approve this submission by {submission.facultyName}? This will verify their achievement and grant {submission.points || 25} points.
                </Text>
              </View>

              <View style={styles.confirmBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setApproveModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmApproveBtn}
                  onPress={handleApproveConfirm}
                >
                  <Text style={styles.confirmApproveBtnText}>Yes, Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Request Correction Modal */}
        <Modal
          visible={correctionModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCorrectionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Request Correction</Text>
                <TouchableOpacity onPress={() => setCorrectionModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalInstructionText}>
                Select the reason why revision is required:
              </Text>

              <ScrollView style={{ maxHeight: 200, marginVertical: 8 }}>
                {STANDARDIZED_CORRECTION_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <TouchableOpacity
                      key={reason}
                      style={[styles.reasonOptionRow, isSelected && styles.reasonOptionRowActive]}
                      onPress={() => setSelectedReason(reason)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={isSelected ? '#2563EB' : '#94A3B8'}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[styles.reasonText, isSelected && styles.reasonTextActive]}>
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TextInput
                style={styles.noteInput}
                placeholder="Additional instructions for faculty (optional)..."
                placeholderTextColor="#94A3B8"
                value={correctionNote}
                onChangeText={setCorrectionNote}
                multiline
              />

              <TouchableOpacity
                style={styles.submitCorrectionBtn}
                onPress={handleCorrectionSubmit}
              >
                <Text style={styles.submitCorrectionBtnText}>Send Correction Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Reject Modal */}
        <Modal
          visible={rejectModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setRejectModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Reject Submission</Text>
                <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalInstructionText}>
                Provide a reason for rejection (required):
              </Text>

              <TextInput
                style={[styles.noteInput, { height: 80 }]}
                placeholder="Explain why this submission cannot be accepted..."
                placeholderTextColor="#94A3B8"
                value={rejectionReason}
                onChangeText={setRejectionReason}
                multiline
              />

              <TouchableOpacity
                style={styles.submitRejectBtn}
                onPress={handleRejectSubmit}
              >
                <Text style={styles.submitRejectBtnText}>Confirm Rejection</Text>
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
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  statusBannerPending: {
    backgroundColor: '#FEF3C7',
  },
  statusBannerApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusBannerCorrection: {
    backgroundColor: '#FFF7ED',
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  facultyDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
  },
  facultyAvatarLarge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  facultyDesignationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 1,
  },
  facultyMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  achievementMainTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 10,
  },
  gridContainer: {
    gap: 6,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  gridLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  gridValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  descBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  descLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  descText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  proofItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  proofIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  viewProofBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  viewProofBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  correctionBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  correctionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  approveBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  proofPreviewBody: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  proofPreviewFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  proofPreviewFileSize: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 10,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  closePreviewBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 8,
  },
  closePreviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  confirmHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  confirmIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  confirmSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmApproveBtn: {
    flex: 1.5,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmApproveBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalInstructionText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  reasonOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  reasonOptionRowActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  reasonText: {
    fontSize: 12,
    color: '#334155',
  },
  reasonTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    height: 60,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  submitCorrectionBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  submitCorrectionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitRejectBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  submitRejectBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  errorBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  errorBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
