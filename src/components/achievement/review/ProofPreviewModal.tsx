// ─────────────────────────────────────────────────────────────
// AchieveX — Proof Document Preview Modal
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ProofPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  proofLabel: string;
  fileName: string;
  fileType?: 'pdf' | 'image';
  fileSize?: string;
}

export default function ProofPreviewModal({
  visible,
  onClose,
  proofLabel,
  fileName,
  fileType = 'pdf',
  fileSize = '1.8 MB',
}: ProofPreviewModalProps) {
  const isPdf = fileType === 'pdf' || fileName.toLowerCase().endsWith('.pdf');

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

        <View style={styles.sheetCard}>
          {/* Grabber Handle */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                {proofLabel}
              </Text>
              <Text style={styles.sheetSubtitle} numberOfLines={1}>
                {fileName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mock Document Visual Area */}
          <View style={styles.previewContainer}>
            {isPdf ? (
              <View style={styles.docBox}>
                <MaterialCommunityIcons name="file-pdf-box" size={48} color="#DC2626" />
                <Text style={styles.docTitle}>{proofLabel}</Text>
                <Text style={styles.docMeta}>PDF Document • {fileSize}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <Text style={styles.verifiedText}>Uploaded Evidence</Text>
                </View>
              </View>
            ) : (
              <View style={styles.docBox}>
                <MaterialCommunityIcons name="file-image" size={48} color="#2563EB" />
                <Text style={styles.docTitle}>{proofLabel}</Text>
                <Text style={styles.docMeta}>Image Photo • {fileSize}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <Text style={styles.verifiedText}>Uploaded Evidence</Text>
                </View>
              </View>
            )}
          </View>

          {/* Close Action */}
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.doneBtnText}>Close Preview</Text>
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
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  previewContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minHeight: 160,
  },
  docBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  docMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
  doneBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  doneBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#334155',
  },
});
