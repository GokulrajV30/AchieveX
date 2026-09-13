// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Credit Record Review Screen
// Detailed inspection of student credit course records, proof documents,
// recognized credit confirmation, and correction requests.
// Zero achievement points awarded.
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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';

import {
  INITIAL_CREDIT_RECORDS,
  type CreditCourseRecord,
  type CourseProofFile,
} from '../../data/academicCreditsData';

interface ACCreditRecordReviewProps {
  record?: CreditCourseRecord;
  onGoBack: () => void;
  onActionComplete: () => void;
}

const CORRECTION_REASONS = [
  'Certificate unclear',
  'Wrong certificate',
  'Student name mismatch',
  'Course details incorrect',
  'Credit information incorrect',
  'Certificate incomplete',
  'Other',
];

export default function ACCreditRecordReview({
  record = INITIAL_CREDIT_RECORDS[0],
  onGoBack,
  onActionComplete,
}: ACCreditRecordReviewProps) {
  const [currentRecord, setCurrentRecord] = useState<CreditCourseRecord>(record);
  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(CORRECTION_REASONS[0]);
  const [customNote, setCustomNote] = useState('');
  const [recognizedCreditsInput, setRecognizedCreditsInput] = useState(
    String(record.recognizedCredits || record.claimedCredits || 3)
  );
  const [proofModalFile, setProofModalFile] = useState<CourseProofFile | null>(null);

  useEffect(() => {
    setCurrentRecord(record);
    setRecognizedCreditsInput(String(record.recognizedCredits || record.claimedCredits || 3));
  }, [record]);

  const isVerified = currentRecord.verificationStatus === 'Verified';
  const isCorrection =
    currentRecord.verificationStatus === 'Correction' ||
    currentRecord.verificationStatus === 'Correction Required';

  const handleConfirmVerify = () => {
    const creditsNum = parseInt(recognizedCreditsInput, 10) || currentRecord.claimedCredits || 3;

    setCurrentRecord((prev) => ({
      ...prev,
      verificationStatus: 'Verified',
      recognizedCredits: creditsNum,
      creditsEarned: creditsNum,
      verifiedBy: 'Dr. Gokulraj V (Academic Coordinator)',
      verifiedAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    }));

    setVerifyModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Credit Verified',
      message: 'The course credit has been approved.',
      primaryAction: {
        label: 'Done',
        onPress: onActionComplete,
      },
    });
  };

  const handleSendCorrection = () => {
    setCurrentRecord((prev) => ({
      ...prev,
      verificationStatus: 'Correction Required',
      correctionReason: selectedReason,
      correctionNote: customNote.trim() || undefined,
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

  const handleOpenCredential = () => {
    if (currentRecord.verificationUrl) {
      Linking.openURL(currentRecord.verificationUrl).catch(() => {
        showAchieveXDialog({
          type: 'error',
          title: 'Unable to Open Link',
          message: 'Could not open the verification link.',
          primaryAction: {
            label: 'Got It',
          },
        });
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Review Credit Record</Text>
            <Text style={styles.headerSubtitle}>{currentRecord.courseName}</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              isVerified && { backgroundColor: '#DCFCE7' },
              isCorrection && { backgroundColor: '#FEE2E2' },
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                isVerified && { color: '#16A34A' },
                isCorrection && { color: '#DC2626' },
              ]}
            >
              {currentRecord.verificationStatus}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. STUDENT INFORMATION MINI-CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.studentCard}>
            <View style={styles.studentAvatarCircle}>
              <Text style={styles.avatarInitials}>
                {(currentRecord.studentName || 'Student').substring(0, 2).toUpperCase()}
              </Text>
            </View>

            <View style={styles.studentDetailsCol}>
              <Text style={styles.studentName}>{currentRecord.studentName || 'Gokulraj V'}</Text>
              <Text style={styles.studentMeta}>
                {currentRecord.rollNo || '23CI011'} • {currentRecord.department || 'CSE (IoT)'} • Section A
              </Text>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              2. COURSE DETAILS
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="book-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Course Details</Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Course Name</Text>
                <Text style={styles.detailVal}>{currentRecord.courseName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Course Type</Text>
                <Text style={styles.detailVal}>{currentRecord.courseType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Provider</Text>
                <Text style={styles.detailVal}>{currentRecord.provider}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Domain</Text>
                <Text style={styles.detailVal}>{currentRecord.domain}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailVal}>{currentRecord.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Completion Date</Text>
                <Text style={styles.detailVal}>{currentRecord.completionDate}</Text>
              </View>
              {currentRecord.finalScore && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Final Score / Grade</Text>
                  <Text style={[styles.detailVal, { color: '#2563EB', fontWeight: '700' }]}>
                    {currentRecord.finalScore} {currentRecord.nptelCategory ? `(${currentRecord.nptelCategory})` : ''}
                  </Text>
                </View>
              )}
              {currentRecord.certificateId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Certificate ID</Text>
                  <Text style={styles.detailVal}>{currentRecord.certificateId}</Text>
                </View>
              )}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              3. ACADEMIC CREDIT DETAILS
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="ribbon-outline" size={18} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Academic Credit Details</Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Semester</Text>
                <Text style={styles.detailVal}>{currentRecord.semester}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Academic Year</Text>
                <Text style={styles.detailVal}>{currentRecord.academicYear}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isVerified ? 'Recognized Academic Credit' : 'Claimed Academic Credit'}
                </Text>
                <Text style={[styles.detailVal, { color: '#4F46E5', fontWeight: '800', fontSize: 13 }]}>
                  {isVerified
                    ? `${currentRecord.recognizedCredits || currentRecord.claimedCredits} Credits (Verified)`
                    : `${currentRecord.claimedCredits} Credits (Pending AC Review)`}
                </Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. PROOFS REVIEW
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="document-attach-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Uploaded Proofs</Text>
            </View>

            {/* Required Course Certificate */}
            <View style={styles.proofItem}>
              <Ionicons name="document-text" size={22} color="#2563EB" style={{ marginRight: 10 }} />
              <View style={styles.proofInfoCol}>
                <Text style={styles.proofLabel}>Course Certificate * (Required)</Text>
                <Text style={styles.proofFileName}>
                  {currentRecord.proofs[0]?.name || 'Course_Certificate.pdf'} (
                  {currentRecord.proofs[0]?.size || '2.1 MB'})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewProofBtn}
                onPress={() => setProofModalFile(currentRecord.proofs[0] || { name: 'Course_Certificate.pdf', size: '2.1 MB' })}
              >
                <Text style={styles.viewProofBtnText}>View</Text>
              </TouchableOpacity>
            </View>

            {/* Optional Assessment Proof */}
            <View style={styles.proofItem}>
              <Ionicons
                name={currentRecord.assessmentProof ? 'document-text' : 'information-circle-outline'}
                size={22}
                color={currentRecord.assessmentProof ? '#4F46E5' : '#94A3B8'}
                style={{ marginRight: 10 }}
              />
              <View style={styles.proofInfoCol}>
                <Text style={styles.proofLabel}>Assessment / Exam Proof (Optional)</Text>
                {currentRecord.assessmentProof ? (
                  <Text style={styles.proofFileName}>
                    {currentRecord.assessmentProof.name} ({currentRecord.assessmentProof.size})
                  </Text>
                ) : (
                  <Text style={styles.proofOptionalText}>Not provided • Optional</Text>
                )}
              </View>
              {currentRecord.assessmentProof && (
                <TouchableOpacity
                  style={styles.viewProofBtn}
                  onPress={() => setProofModalFile(currentRecord.assessmentProof!)}
                >
                  <Text style={styles.viewProofBtnText}>View</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Credential Link if present */}
            {currentRecord.verificationUrl && (
              <View style={styles.credentialBox}>
                <Ionicons name="link-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.credentialTitle}>Online Credential Verification</Text>
                  <Text style={styles.credentialSub}>
                    ID: {currentRecord.certificateId || 'Verified Link'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.openCredBtn} onPress={handleOpenCredential}>
                  <Text style={styles.openCredBtnText}>Open Credential</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ════════════════════════════════════════════════
              5. ACTION BUTTONS (VERIFY / REQUEST CORRECTION)
          ════════════════════════════════════════════════ */}
          {!isVerified && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.requestCorrectionBtn}
                activeOpacity={0.8}
                onPress={() => setCorrectionModalVisible(true)}
              >
                <Ionicons name="alert-circle-outline" size={16} color="#DC2626" style={{ marginRight: 6 }} />
                <Text style={styles.requestCorrectionBtnText}>Request Correction</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.verifyCreditBtn}
                activeOpacity={0.85}
                onPress={() => setVerifyModalVisible(true)}
              >
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.verifyCreditBtnText}>Verify Credit</Text>
              </TouchableOpacity>
            </View>
          )}

          {isVerified && (
            <View style={styles.verifiedBannerBox}>
              <Ionicons name="checkmark-circle" size={22} color="#16A34A" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.verifiedBannerTitle}>Verified Academic Credit</Text>
                <Text style={styles.verifiedBannerSub}>
                  {currentRecord.verifiedBy || 'Academic Coordinator'} • {currentRecord.verifiedAt || 'Certified'}
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            VERIFY CREDIT CONFIRMATION MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={verifyModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setVerifyModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconBox}>
                <Ionicons name="school" size={28} color="#2563EB" />
              </View>

              <Text style={styles.confirmTitle}>Verify Academic Credit?</Text>
              <Text style={styles.confirmSub}>
                {currentRecord.courseName} • {currentRecord.studentName}
              </Text>

              <View style={styles.creditAdjustmentBox}>
                <Text style={styles.creditAdjTitle}>Recognized Academic Credits:</Text>
                <TextInput
                  style={styles.creditInput}
                  keyboardType="numeric"
                  value={recognizedCreditsInput}
                  onChangeText={setRecognizedCreditsInput}
                />
              </View>

              <Text style={styles.creditExplanationText}>
                Official academic credits will be added to the student's certified academic record.
                Zero achievement points will be awarded.
              </Text>

              <View style={styles.confirmActionsRow}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setVerifyModalVisible(false)}
                >
                  <Text style={styles.cancelModalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmModalBtn} onPress={handleConfirmVerify}>
                  <Text style={styles.confirmModalBtnText}>Confirm & Verify</Text>
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
          transparent={true}
          onRequestClose={() => setCorrectionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Request Correction</Text>
                <TouchableOpacity onPress={() => setCorrectionModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sheetSubtitle}>
                Select the primary issue with this credit record:
              </Text>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
                {CORRECTION_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonOption,
                      selectedReason === reason && styles.reasonOptionActive,
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <Ionicons
                      name={selectedReason === reason ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={selectedReason === reason ? '#2563EB' : '#94A3B8'}
                      style={{ marginRight: 8 }}
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

              <Text style={styles.noteLabel}>Additional Instructions for Student:</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="e.g. Please upload the official PDF certificate with clear score."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={customNote}
                onChangeText={setCustomNote}
              />

              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={styles.sendCorrectionBtn}
                  onPress={handleSendCorrection}
                >
                  <Text style={styles.sendCorrectionBtnText}>Send Correction Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            PROOF PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        {proofModalFile && (
          <Modal
            visible={!!proofModalFile}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setProofModalFile(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.proofPreviewCard}>
                <View style={styles.proofPreviewHeader}>
                  <Text style={styles.proofPreviewTitle}>{proofModalFile.name}</Text>
                  <TouchableOpacity onPress={() => setProofModalFile(null)}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.docBox}>
                  <Ionicons name="document-text" size={48} color="#2563EB" />
                  <Text style={styles.docFileName}>{proofModalFile.name}</Text>
                  <Text style={styles.docFileSize}>{proofModalFile.size}</Text>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={() => setProofModalFile(null)}>
                  <Text style={styles.doneBtnText}>Done</Text>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
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
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  studentAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 14,
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
  studentMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailsGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  proofItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofInfoCol: {
    flex: 1,
  },
  proofLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofFileName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  proofOptionalText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 1,
  },
  viewProofBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  viewProofBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  credentialBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  credentialTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  credentialSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 1,
  },
  openCredBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  openCredBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  requestCorrectionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  requestCorrectionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  verifyCreditBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  verifyCreditBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 10,
  },
  verifiedBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  verifiedBannerSub: {
    fontSize: 11.5,
    color: '#15803D',
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  confirmIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  creditAdjustmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  creditAdjTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  creditInput: {
    width: 48,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  creditExplanationText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 16,
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelModalBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  confirmModalBtn: {
    flex: 1.5,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reasonOptionActive: {
    backgroundColor: '#F0F7FF',
  },
  reasonOptionText: {
    fontSize: 13,
    color: '#475569',
  },
  reasonOptionTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    height: 60,
    textAlignVertical: 'top',
  },
  sheetActions: {
    marginTop: 14,
  },
  sendCorrectionBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCorrectionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  proofPreviewCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  proofPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  proofPreviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  docBox: {
    height: 150,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  docFileName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 8,
  },
  docFileSize: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  doneBtn: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
