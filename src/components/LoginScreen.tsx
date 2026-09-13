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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { STUDENT_DATABASE, type StudentRecord } from '../data/achievementConfig';
import { showAchieveXDialog } from './feedback/AchieveXFeedback';

interface LoginScreenProps {
  onLogin: (
    role: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean',
    studentUser?: StudentRecord
  ) => void;
  onGoToCreateAccount?: () => void;
}

export default function LoginScreen({ onLogin, onGoToCreateAccount }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

    if (matchedStudent && (trimmedPass === '1' || trimmedPass === 'password')) {
      onLogin('Student', matchedStudent);
      return;
    }

    if (trimmedEmail === '23ci011@nandhaengg.org' && trimmedPass === '1') {
      const gokul = STUDENT_DATABASE.find((s) => s.rollNumber.toUpperCase() === '23CI011');
      onLogin('Student', gokul);
    } else if (
      (trimmedEmail === 'principal@nandhaengg.org' || trimmedEmail === 'principal') &&
      (trimmedPass === '1' || trimmedPass === 'principal')
    ) {
      onLogin('Principal');
    } else if (
      (trimmedEmail === 'dean@nandhaengg.org' || trimmedEmail === 'dean') &&
      (trimmedPass === '1' || trimmedPass === 'dean')
    ) {
      onLogin('Dean');
    } else if (
      (trimmedEmail === 'head@nandhaengg.org' || trimmedEmail === 'head') &&
      (trimmedPass === '1' || trimmedPass === 'head')
    ) {
      onLogin('Head');
    } else if (
      (trimmedEmail === 'gokulrajiot@nandhaengg.org' || trimmedEmail === 'proctor') &&
      (trimmedPass === '2' || trimmedPass === '1')
    ) {
      onLogin('Proctor');
    } else if (
      (trimmedEmail === 'ac@nandhaengg.org' || trimmedEmail === 'ac' || trimmedEmail === 'coordinator') &&
      (trimmedPass === '3' || trimmedPass === '1')
    ) {
      onLogin('Academic Coordinator');
    } else if (
      (trimmedEmail === 'hodiot@nandhaengg.org' || trimmedEmail === 'hod') &&
      (trimmedPass === '3' || trimmedPass === '1')
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
              onPress={() =>
                showAchieveXDialog({
                  type: 'info',
                  title: 'Forgot Password?',
                  message: 'Contact your college administrator to reset your account credentials.',
                  primaryAction: {
                    label: 'Got It',
                  },
                })
              }
            >
              <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
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
});
