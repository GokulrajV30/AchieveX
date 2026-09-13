// ─────────────────────────────────────────────────────────────
// AchieveX — Mark Milestone Complete Bottom Sheet Component
// Requests proof only when required based on goal & milestone type
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Milestone, type MilestoneProof } from '../../data/goalsData';
import { type MilestoneProofRequirement } from '../../data/milestoneProofConfig';

interface MarkMilestoneCompleteSheetProps {
  visible: boolean;
  milestone: Milestone | null;
  proofRequirement: MilestoneProofRequirement;
  onClose: () => void;
  onComplete: (milestoneId: string, proof?: MilestoneProof) => void;
}

export default function MarkMilestoneCompleteSheet({
  visible,
  milestone,
  proofRequirement,
  onClose,
  onComplete,
}: MarkMilestoneCompleteSheetProps) {
  const [selectedProof, setSelectedProof] = useState<MilestoneProof | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  // Reset proof selection on open/close
  useEffect(() => {
    if (visible) {
      setSelectedProof(null);
      setIsPicking(false);
    }
  }, [visible, milestone]);

  if (!milestone) return null;

  const isProofRequired = proofRequirement.required;

  // Handle Simulated / Native Document Picking
  const handlePickDocument = () => {
    setIsPicking(true);
    setTimeout(() => {
      const sanitizedName = (proofRequirement.proofType || 'milestone_proof')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');
      const ext = sanitizedName.includes('photo') || sanitizedName.includes('screenshot') ? 'png' : 'pdf';
      const sizeMb = (Math.random() * 1.5 + 0.5).toFixed(1);

      setSelectedProof({
        uri: `file://achievex/proofs/${sanitizedName}_${Date.now()}.${ext}`,
        fileName: `${sanitizedName}_evidence.${ext}`,
        fileSize: `${sizeMb} MB`,
        mimeType: ext === 'pdf' ? 'application/pdf' : 'image/png',
        uploadedAt: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      });
      setIsPicking(false);
    }, 400);
  };

  const handleConfirm = () => {
    if (isProofRequired && !selectedProof) return;
    onComplete(milestone.id, selectedProof || undefined);
    onClose();
  };

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
          {/* Grabber Handle */}
          <View style={styles.grabber} />

          {/* ════════════════════════════════════════════════════════
              CASE A: NO PROOF REQUIRED (Planning / Preparatory Step)
          ════════════════════════════════════════════════════════ */}
          {!isProofRequired ? (
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.sheetTitle}>Complete Milestone?</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.confirmationPrompt}>
                Mark <Text style={styles.milestoneHighlight}>"{milestone.label}"</Text> as completed?
              </Text>

              <View style={styles.noProofInfoBox}>
                <Ionicons name="information-circle-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                <Text style={styles.noProofInfoText}>
                  No proof document required for this planning milestone.
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  activeOpacity={0.75}
                  onPress={onClose}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.completeBtn}
                  activeOpacity={0.85}
                  onPress={handleConfirm}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.completeBtnText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ════════════════════════════════════════════════════════
               CASE B: PROOF REQUIRED (Dynamic Proof Uploader)
            ════════════════════════════════════════════════════════ */
            <View>
              <View style={styles.headerRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.sheetTitle}>Mark Milestone as Complete</Text>
                  <Text style={styles.sheetSubtitle}>
                    Upload one proof to confirm this milestone.
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Milestone Name Badge */}
              <View style={styles.milestoneTargetBox}>
                <Ionicons name="flag-outline" size={14} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.milestoneTargetText} numberOfLines={2}>
                  {milestone.label}
                </Text>
              </View>

              {/* Required Proof Specification */}
              <Text style={styles.sectionHeading}>Required Proof</Text>
              <View style={styles.proofRequirementCard}>
                <Ionicons name="document-attach" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.proofLabelText}>
                    {proofRequirement.label || 'Completion Proof'}
                  </Text>
                  {proofRequirement.hint ? (
                    <Text style={styles.proofHintText}>{proofRequirement.hint}</Text>
                  ) : null}
                </View>
              </View>

              {/* Uploader Box / Attached File Preview */}
              {!selectedProof ? (
                <TouchableOpacity
                  style={styles.uploadBox}
                  activeOpacity={0.75}
                  onPress={handlePickDocument}
                  disabled={isPicking}
                >
                  {isPicking ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                  ) : (
                    <>
                      <View style={styles.uploadIconCircle}>
                        <Ionicons name="cloud-upload-outline" size={22} color="#2563EB" />
                      </View>
                      <Text style={styles.uploadMainText}>Upload Proof</Text>
                      <Text style={styles.uploadFormatsText}>PDF, JPG or PNG</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.attachedFileBox}>
                  <View style={styles.attachedFileLeft}>
                    <Ionicons
                      name={selectedProof.mimeType === 'application/pdf' ? 'document-text' : 'image'}
                      size={20}
                      color="#059669"
                      style={{ marginRight: 8 }}
                    />
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={styles.attachedFileName} numberOfLines={1}>
                        ✓ {selectedProof.fileName}
                      </Text>
                      <Text style={styles.attachedFileSize}>{selectedProof.fileSize}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.changeFileBtn}
                    activeOpacity={0.7}
                    onPress={handlePickDocument}
                  >
                    <Text style={styles.changeFileText}>Change</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  activeOpacity={0.75}
                  onPress={onClose}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.completeBtn,
                    !selectedProof && styles.completeBtnDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleConfirm}
                  disabled={!selectedProof}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.completeBtnText}>Mark as Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  confirmationPrompt: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 14,
  },
  milestoneHighlight: {
    fontWeight: '700',
    color: '#0F172A',
  },
  noProofInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 12,
    marginBottom: 18,
  },
  noProofInfoText: {
    fontSize: 12.5,
    color: '#1E40AF',
    fontWeight: '600',
    flex: 1,
  },
  milestoneTargetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  milestoneTargetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  proofRequirementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 12,
    marginBottom: 14,
  },
  proofLabelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E40AF',
  },
  proofHintText: {
    fontSize: 11.5,
    color: '#3B82F6',
    marginTop: 1,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadMainText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  uploadFormatsText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  attachedFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  attachedFileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachedFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  attachedFileSize: {
    fontSize: 11,
    color: '#059669',
    marginTop: 1,
  },
  changeFileBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeFileText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  completeBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  completeBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  completeBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
