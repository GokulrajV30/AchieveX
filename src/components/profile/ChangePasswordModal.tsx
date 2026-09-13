// ─────────────────────────────────────────────────────────────
// AchieveX — Change Password Modal Component
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordModal({
  visible,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showAchieveXDialog({
        type: 'success',
        title: 'Password Updated',
        message: 'Your changes were saved.',
        primaryAction: {
          label: 'Done',
        },
      });
      if (onSuccess) onSuccess();
      handleClose();
    }, 600);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.sheetCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.handleBar} />

            <View style={styles.headerRow}>
              <Text style={styles.sheetTitle}>Change Password</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              Update your account password. Must be at least 8 characters.
            </Text>

            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Current Password</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.currentPassword ? styles.inputBoxError : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (errors.currentPassword) {
                      setErrors({ ...errors, currentPassword: '' });
                    }
                  }}
                  placeholder="Enter current password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showCurrent}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  activeOpacity={0.6}
                  style={styles.eyeBtn}
                >
                  <MaterialCommunityIcons
                    name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
              {!!errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>New Password</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.newPassword ? styles.inputBoxError : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: '' });
                    }
                  }}
                  placeholder="Enter new password (min. 8 characters)"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  activeOpacity={0.6}
                  style={styles.eyeBtn}
                >
                  <MaterialCommunityIcons
                    name={showNew ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
              {!!errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Confirm New Password</Text>
              <View
                style={[
                  styles.inputBox,
                  errors.confirmPassword ? styles.inputBoxError : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  activeOpacity={0.6}
                  style={styles.eyeBtn}
                >
                  <MaterialCommunityIcons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
              {!!errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Update Password Action Button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                isSubmitting && styles.submitBtnDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '85%',
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
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputBox: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBoxError: {
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 6,
  },
  errorText: {
    fontSize: 11.5,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#6D28D9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
