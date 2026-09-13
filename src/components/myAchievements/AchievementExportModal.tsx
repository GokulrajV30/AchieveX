// ─────────────────────────────────────────────────────────────
// AchieveX — Achievement Export Bottom Sheet Component
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AchievementExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (scope: 'all' | 'filtered') => void;
  totalCount: number;
  filteredCount: number;
  generationState: 'idle' | 'generating' | 'success' | 'error';
  onSharePdf: () => void;
}

export default function AchievementExportModal({
  visible,
  onClose,
  onExport,
  totalCount,
  filteredCount,
  generationState,
  onSharePdf,
}: AchievementExportModalProps) {
  const [selectedScope, setSelectedScope] = useState<'all' | 'filtered'>('all');

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
          onPress={generationState === 'idle' ? onClose : undefined}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabber} />

          {/* 1. IDLE STATE: Form Options */}
          {generationState === 'idle' && (
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.sheetTitle}>Export Achievements</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionLabel}>Export Scope</Text>

              {/* Scope Option 1: All Achievements */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedScope === 'all' && styles.optionCardActive,
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedScope('all')}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, selectedScope === 'all' && styles.radioActive]}>
                    {selectedScope === 'all' && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={[styles.optionTitle, selectedScope === 'all' && styles.optionTitleActive]}>
                      All Achievements
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      Full record • {totalCount} total achievements
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Scope Option 2: Current Filtered Results */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedScope === 'filtered' && styles.optionCardActive,
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedScope('filtered')}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, selectedScope === 'filtered' && styles.radioActive]}>
                    {selectedScope === 'filtered' && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={[styles.optionTitle, selectedScope === 'filtered' && styles.optionTitleActive]}>
                      Current Filtered Results
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      Active view • {filteredCount} matching achievements
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Document Format</Text>
              <View style={styles.formatBox}>
                <Ionicons name="document-text" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.formatTitle}>Institutional Verified PDF</Text>
                  <Text style={styles.formatSubtitle}>Official transcript with QR code verification</Text>
                </View>
              </View>

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
                  style={styles.exportBtn}
                  activeOpacity={0.85}
                  onPress={() => onExport(selectedScope)}
                >
                  <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.exportBtnText}>Generate PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 2. GENERATING LOADING STATE */}
          {generationState === 'generating' && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#2563EB" style={{ marginBottom: 14 }} />
              <Text style={styles.loadingTitle}>Generating Achievement Record...</Text>
              <Text style={styles.loadingSubtitle}>
                Preparing verified records and student credentials.
              </Text>
            </View>
          )}

          {/* 3. SUCCESS STATE */}
          {generationState === 'success' && (
            <View style={styles.centerBox}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={32} color="#059669" />
              </View>
              <Text style={styles.successTitle}>PDF Ready ✓</Text>
              <Text style={styles.successSubtitle}>
                Your verified achievement record has been generated successfully.
              </Text>

              <TouchableOpacity
                style={styles.downloadActionBtn}
                activeOpacity={0.85}
                onPress={onSharePdf}
              >
                <Ionicons name="share-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.downloadActionText}>Share / Save PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneBtn}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <Text style={styles.doneBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 4. ERROR STATE */}
          {generationState === 'error' && (
            <View style={styles.centerBox}>
              <Ionicons name="close-circle" size={44} color="#DC2626" style={{ marginBottom: 10 }} />
              <Text style={styles.errorTitle}>Generation Failed</Text>
              <Text style={styles.errorSubtitle}>
                Unable to prepare achievement PDF. Please try again.
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exportBtn}
                  onPress={() => onExport(selectedScope)}
                >
                  <Text style={styles.exportBtnText}>Retry</Text>
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
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  optionCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  optionCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  optionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  optionTitleActive: {
    color: '#2563EB',
  },
  optionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  formatBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  formatTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  formatSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  exportBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  exportBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centerBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  loadingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  successCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#059669',
  },
  successSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  downloadActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    marginBottom: 10,
  },
  downloadActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 14,
  },
});
