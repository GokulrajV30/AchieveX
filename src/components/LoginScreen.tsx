import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { STUDENT_DATABASE, type StudentRecord } from '../data/achievementConfig';
import { showAchieveXDialog, showAchieveXToast } from './feedback/AchieveXFeedback';

interface LoginScreenProps {
  onLogin: (
    role: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean',
    studentUser?: StudentRecord
  ) => void;
  onGoToCreateAccount?: () => void;
}

// In-memory demo password store for MVP V1 (can be replaced by backend API in production)
const USER_CUSTOM_PASSWORDS: Record<string, string> = {};

export default function LoginScreen({ onLogin, onGoToCreateAccount }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetShowPassword, setResetShowPassword] = useState(false);
  const [resetErrors, setResetErrors] = useState<{
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const isValidEmail = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isAlias = [
      'principal',
      'dean',
      'head',
      'proctor',
      'ac',
      'coordinator',
      'hod',
      'student',
    ].includes(trimmed);
    return EMAIL_REGEX.test(trimmed) || isAlias;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      if (text.trim() && isValidEmail(text)) {
        setEmailError('');
      }
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      if (text.trim().length > 0) {
        setPasswordError('');
      }
    }
  };

  // Password-check helper that honors custom updated passwords as well as default demo passwords
  const isPasswordMatch = (accountKey: string, validDefaults: string[]) => {
    const custom = USER_CUSTOM_PASSWORDS[accountKey.toLowerCase()];
    if (custom) {
      return password.trim() === custom;
    }
    return validDefaults.includes(password.trim());
  };

  const handleUpdatePassword = () => {
    const trimmedEmail = resetEmail.trim().toLowerCase();
    const trimmedNewPass = resetNewPassword.trim();
    const trimmedConfirmPass = resetConfirmPassword.trim();
    const errs: { email?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!trimmedEmail) {
      errs.email = 'Enter your college email.';
    }
    if (!trimmedNewPass) {
      errs.newPassword = 'Enter a new password.';
    }
    if (!trimmedConfirmPass) {
      errs.confirmPassword = 'Confirm your new password.';
    } else if (trimmedNewPass && trimmedNewPass !== trimmedConfirmPass) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setResetErrors(errs);
      return;
    }

    // Verify whether account exists in Student database or role presets
    const studentExists = STUDENT_DATABASE.some(
      (s) =>
        s.rollNumber.toLowerCase() === trimmedEmail ||
        `${s.rollNumber.toLowerCase()}@nandhaengg.org` === trimmedEmail ||
        s.name.toLowerCase() === trimmedEmail
    );
    const roleEmails = [
      'principal@nandhaengg.org',
      'principal',
      'dean@nandhaengg.org',
      'dean',
      'head@nandhaengg.org',
      'head',
      'gokulrajiot@nandhaengg.org',
      'proctor',
      'ac@nandhaengg.org',
      'ac',
      'coordinator',
      'hodiot@nandhaengg.org',
      'hod',
      '23ci011@nandhaengg.org',
      'student',
    ];
    const roleExists = roleEmails.includes(trimmedEmail);

    if (!studentExists && !roleExists) {
      setResetErrors({ email: 'Account not found.' });
      return;
    }

    // Update in-memory credentials for this session
    USER_CUSTOM_PASSWORDS[trimmedEmail] = trimmedNewPass;
    setShowChangePasswordModal(false);
    setResetEmail('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetErrors({});

    showAchieveXToast({
      type: 'success',
      message: 'Password updated successfully.',
    });
  };

  const handleLoginPress = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    let hasError = false;
    let newEmailError = '';
    let newPasswordError = '';

    if (!trimmedEmail) {
      newEmailError = 'Enter your college email.';
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      newEmailError = 'Enter a valid college email.';
      hasError = true;
    }

    if (!trimmedPass) {
      newPasswordError = 'Enter your password.';
      hasError = true;
    }

    setEmailError(newEmailError);
    setPasswordError(newPasswordError);

    if (hasError) {
      return;
    }

    const matchedStudent = STUDENT_DATABASE.find(
      (s) =>
        s.rollNumber.toLowerCase() === trimmedEmail ||
        `${s.rollNumber.toLowerCase()}@nandhaengg.org` === trimmedEmail ||
        s.name.toLowerCase() === trimmedEmail
    );

    if (matchedStudent && isPasswordMatch(trimmedEmail, ['1', 'password'])) {
      onLogin('Student', matchedStudent);
      return;
    }

    if (trimmedEmail === '23ci011@nandhaengg.org' && isPasswordMatch(trimmedEmail, ['1'])) {
      const gokul = STUDENT_DATABASE.find((s) => s.rollNumber.toUpperCase() === '23CI011');
      onLogin('Student', gokul);
    } else if (
      (trimmedEmail === 'principal@nandhaengg.org' || trimmedEmail === 'principal') &&
      isPasswordMatch(trimmedEmail, ['1', 'principal'])
    ) {
      onLogin('Principal');
    } else if (
      (trimmedEmail === 'dean@nandhaengg.org' || trimmedEmail === 'dean') &&
      isPasswordMatch(trimmedEmail, ['1', 'dean'])
    ) {
      onLogin('Dean');
    } else if (
      (trimmedEmail === 'head@nandhaengg.org' || trimmedEmail === 'head') &&
      isPasswordMatch(trimmedEmail, ['1', 'head'])
    ) {
      onLogin('Head');
    } else if (
      (trimmedEmail === 'gokulrajiot@nandhaengg.org' || trimmedEmail === 'proctor') &&
      isPasswordMatch(trimmedEmail, ['2', '1'])
    ) {
      onLogin('Proctor');
    } else if (
      (trimmedEmail === 'ac@nandhaengg.org' || trimmedEmail === 'ac' || trimmedEmail === 'coordinator') &&
      isPasswordMatch(trimmedEmail, ['3', '1'])
    ) {
      onLogin('Academic Coordinator');
    } else if (
      (trimmedEmail === 'hodiot@nandhaengg.org' || trimmedEmail === 'hod') &&
      isPasswordMatch(trimmedEmail, ['3', '1'])
    ) {
      onLogin('HOD');
    } else {
      showAchieveXDialog({
        type: 'error',
        title: 'Sign In Failed',
        message: 'Email or password is incorrect.',
        primaryAction: {
          label: 'Try Again',
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Faded Background Decorative Academic Icons */}
          <View style={styles.bgDecorations} pointerEvents="none">
            <Ionicons name="school-outline" size={54} color="#CBD5E1" style={styles.bgIconCap} />
            <Ionicons name="document-text-outline" size={40} color="#CBD5E1" style={styles.bgIconDoc} />
            <Ionicons name="book-outline" size={42} color="#CBD5E1" style={styles.bgIconBook} />
            <Ionicons name="trophy-outline" size={46} color="#CBD5E1" style={styles.bgIconTrophyL} />
            <Ionicons name="trophy-outline" size={46} color="#CBD5E1" style={styles.bgIconTrophyR} />
          </View>

          {/* Centered AchieveX Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/AchieveX logo (2).png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Heading Section */}
          <View style={styles.headingContainer}>
            <Text style={styles.mainTitle}>Welcome Back 👋</Text>
            <Text style={styles.subtitleText}>
              Sign in using your college account to continue.
            </Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* College Email Input */}
            <View style={[styles.inputBox, !!emailError && styles.inputBoxError]}>
              <TextInput
                style={styles.textInputField}
                placeholder="College email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.rightIconWrapper}>
                <Ionicons
                  name="at-outline"
                  size={20}
                  color={emailError ? '#DC2626' : '#64748B'}
                />
              </View>
            </View>
            {!!emailError && (
              <Text style={styles.inlineErrorText}>{emailError}</Text>
            )}

            {/* Password Input */}
            <View style={[styles.inputBox, !!passwordError && styles.inputBoxError]}>
              <TextInput
                style={styles.textInputField}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.rightIconWrapper}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'lock-open-outline' : 'lock-outline'}
                  size={20}
                  color={passwordError ? '#DC2626' : '#64748B'}
                />
              </TouchableOpacity>
            </View>
            {!!passwordError && (
              <Text style={styles.inlineErrorText}>{passwordError}</Text>
            )}

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
              onPress={() => {
                setResetEmail(email.trim());
                setResetNewPassword('');
                setResetConfirmPassword('');
                setResetErrors({});
                setShowChangePasswordModal(true);
              }}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <View style={styles.actionBtnContainer}>
              <TouchableOpacity
                style={styles.continuePillBtn}
                activeOpacity={0.8}
                onPress={handleLoginPress}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer: First time using AchieveX? Activate Account */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>First time using AchieveX? </Text>
            <TouchableOpacity onPress={onGoToCreateAccount} activeOpacity={0.7}>
              <Text style={styles.activateLink}>Activate Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ════════════════════════════════════════════════
          CHANGE PASSWORD MODAL (MVP V1)
      ════════════════════════════════════════════════ */}
      <Modal
        visible={showChangePasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBackdrop} />
          <View style={styles.modalCard}>
            {/* Lock Icon */}
            <View style={styles.modalIconCircle}>
              <Ionicons name="lock-closed" size={24} color="#2563EB" />
            </View>

            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your account email and set a new password.
            </Text>

            {/* Field 1: College Email */}
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>College Email</Text>
              <View
                style={[
                  styles.modalInputBox,
                  !!resetErrors.email && styles.modalInputBoxError,
                ]}
              >
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Enter college email"
                  placeholderTextColor="#94A3B8"
                  value={resetEmail}
                  onChangeText={(t) => {
                    setResetEmail(t);
                    if (resetErrors.email) {
                      setResetErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={resetErrors.email ? '#DC2626' : '#64748B'}
                />
              </View>
              {!!resetErrors.email && (
                <Text style={styles.modalInlineError}>{resetErrors.email}</Text>
              )}
            </View>

            {/* Field 2: New Password */}
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>New Password</Text>
              <View
                style={[
                  styles.modalInputBox,
                  !!resetErrors.newPassword && styles.modalInputBoxError,
                ]}
              >
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Enter new password"
                  placeholderTextColor="#94A3B8"
                  value={resetNewPassword}
                  onChangeText={(t) => {
                    setResetNewPassword(t);
                    if (resetErrors.newPassword) {
                      setResetErrors((prev) => ({ ...prev, newPassword: undefined }));
                    }
                  }}
                  secureTextEntry={!resetShowPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setResetShowPassword(!resetShowPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialCommunityIcons
                    name={resetShowPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={resetErrors.newPassword ? '#DC2626' : '#64748B'}
                  />
                </TouchableOpacity>
              </View>
              {!!resetErrors.newPassword && (
                <Text style={styles.modalInlineError}>{resetErrors.newPassword}</Text>
              )}
            </View>

            {/* Field 3: Confirm Password */}
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.modalInputBox,
                  !!resetErrors.confirmPassword && styles.modalInputBoxError,
                ]}
              >
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#94A3B8"
                  value={resetConfirmPassword}
                  onChangeText={(t) => {
                    setResetConfirmPassword(t);
                    if (resetErrors.confirmPassword) {
                      setResetErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  secureTextEntry={!resetShowPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setResetShowPassword(!resetShowPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialCommunityIcons
                    name={resetShowPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={resetErrors.confirmPassword ? '#DC2626' : '#64748B'}
                  />
                </TouchableOpacity>
              </View>
              {!!resetErrors.confirmPassword && (
                <Text style={styles.modalInlineError}>{resetErrors.confirmPassword}</Text>
              )}
            </View>

            {/* Actions */}
            <View style={styles.modalActionCol}>
              <TouchableOpacity
                style={styles.updatePasswordBtn}
                activeOpacity={0.8}
                onPress={handleUpdatePassword}
              >
                <Text style={styles.updatePasswordBtnText}>Update Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelModalBtn}
                activeOpacity={0.7}
                onPress={() => setShowChangePasswordModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
    position: 'relative',
  },

  // Faded Background Decorative Academic Icons
  bgDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
  },
  bgIconCap: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
  bgIconDoc: {
    position: 'absolute',
    top: 110,
    left: 20,
  },
  bgIconBook: {
    position: 'absolute',
    top: 110,
    right: 20,
  },
  bgIconTrophyL: {
    position: 'absolute',
    top: 200,
    left: 16,
  },
  bgIconTrophyR: {
    position: 'absolute',
    top: 200,
    right: 16,
  },

  // Centered AchieveX Logo
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 213,
    height: 213,
  },

  // Heading
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 20,
  },

  // Form Container
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputBox: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  inputBoxError: {
    borderColor: '#DC2626',
  },
  inlineErrorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  textInputField: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  rightIconWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2563EB',
  },

  // Action Button
  actionBtnContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  continuePillBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 36,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Footer Row
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 13.5,
    color: '#64748B',
  },
  activateLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Change Password Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  modalFieldGroup: {
    width: '100%',
    marginBottom: 12,
  },
  modalFieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 5,
  },
  modalInputBox: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalInputBoxError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  modalTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  modalInlineError: {
    fontSize: 11.5,
    color: '#DC2626',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
  modalActionCol: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  updatePasswordBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  updatePasswordBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  cancelModalBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cancelModalBtnText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '600',
  },
});
