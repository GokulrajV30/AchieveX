// ─────────────────────────────────────────────────────────────
// AchieveX — Submit Achievement Confirmation Bottom Sheet
// ─────────────────────────────────────────────────────────────

import React from 'react';
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

interface SubmitConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export default function SubmitConfirmModal({
  visible,
  onClose,
  onConfirm,
  submitting,
}: SubmitConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={submitting ? undefined : onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={submitting ? undefined : onClose}
        />

        <View style={styles.sheetCard}>
          <View style={styles.handleBar} />

          <View style={styles.iconCircle}>
            <Ionicons name="paper-plane" size={26} color="#2563EB" />
          </View>

          <Text style={styles.sheetTitle}>Submit Achievement?</Text>
          <Text style={styles.sheetSubtitle}>
            Check your details before submitting.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.8}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelBtnText}>Not Yet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit</Text>
              )}
            </TouchableOpacity>
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
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    alignItems: 'center',
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
    marginBottom: 16,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#475569',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
