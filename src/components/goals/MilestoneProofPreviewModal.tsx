// ─────────────────────────────────────────────────────────────
// AchieveX — Milestone Proof Preview Modal Component
// Displays attached milestone evidence metadata and preview
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Milestone } from '../../data/goalsData';

interface MilestoneProofPreviewModalProps {
  visible: boolean;
  milestone: Milestone | null;
  onClose: () => void;
}

export default function MilestoneProofPreviewModal({
  visible,
  milestone,
  onClose,
}: MilestoneProofPreviewModalProps) {
  if (!milestone || !milestone.proof) return null;

  const isPdf = milestone.proof.mimeType === 'application/pdf' || milestone.proof.fileName.endsWith('.pdf');

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
            <Text style={styles.sheetTitle}>Milestone Proof Evidence</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Milestone Target */}
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneLabel}>{milestone.label}</Text>
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 3 }} />
              <Text style={styles.completedBadgeText}>Completed</Text>
            </View>
          </View>

          {/* File Card Preview */}
          <View style={styles.fileCard}>
            <View style={styles.fileIconBox}>
              <Ionicons
                name={isPdf ? 'document-text' : 'image'}
                size={28}
                color={isPdf ? '#2563EB' : '#059669'}
              />
            </View>

            <View style={styles.fileDetailsCol}>
              <Text style={styles.fileName} numberOfLines={1}>
                {milestone.proof.fileName}
              </Text>
              <Text style={styles.fileMeta}>
                {milestone.proof.fileSize ? `${milestone.proof.fileSize} • ` : ''}
                Uploaded {milestone.proof.uploadedAt}
              </Text>
            </View>
          </View>

          {/* Institutional note */}
          <View style={styles.infoNote}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
            <Text style={styles.infoNoteText}>
              Proof attached as milestone progress evidence. Official institution verification occurs upon final achievement submission.
            </Text>
          </View>

          {/* Close Action */}
          <TouchableOpacity
            style={styles.closeActionBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.closeActionBtnText}>Close</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 14,
  },
  milestoneLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    paddingRight: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  fileIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileDetailsCol: {
    flex: 1,
  },
  fileName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  fileMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 18,
  },
  infoNoteText: {
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
    flex: 1,
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
