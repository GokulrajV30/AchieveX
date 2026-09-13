// ─────────────────────────────────────────────────────────────
// AchieveX — Role-Driven 2-Step Create Account Screen
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  PrimaryRoleId,
  ROLE_CONFIGS,
  ROLES_LIST,
  AdditionalResponsibility,
  HeadType,
  HEAD_TYPE_OPTIONS,
} from '../data/roles';
import {
  InstitutionType,
  INSTITUTIONS,
  getInstitutionById,
  validateInstitutionActivation,
} from '../data/institutions';
import {
  type Program,
  PROGRAMS,
  getProgramById,
  getAllPrograms,
  getProgramGroup,
} from '../data/programs';
import { showAchieveXDialog } from './feedback/AchieveXFeedback';
import { ACADEMIC_BATCHES, AcademicBatch } from '../data/academicBatches';
import RoleCard from './createAccount/RoleCard';
import CreateAccountInput from './createAccount/CreateAccountInput';
import SearchableSelectModal, { SelectOption } from './createAccount/SearchableSelectModal';
import MultiSelectModal from './createAccount/MultiSelectModal';

export interface CreatedAccountData {
  id: string;
  fullName: string;
  primaryRole: PrimaryRoleId;
  headType?: HeadType | null;
  customHeadType?: string | null;
  responsibilities: AdditionalResponsibility[];
  registerNumber: string | null;
  employeeId: string | null;
  institutionType?: InstitutionType | null;
  district?: string | null;
  institutionId: string;
  collegeName: string;
  collegeEmail: string;
  department: string | null;
  programId?: string | null;
  courseName?: string | null;
  customDepartmentName?: string | null;
  isCustomDepartment?: boolean;
  academicBatch: AcademicBatch | null;
  activationCode: string;
  accountStatus: 'active' | 'pendingRoleVerification';
  createdAt: string;
}

interface CreateAccountScreenProps {
  onCreateAccount: (accountData: CreatedAccountData) => void;
  onGoToLogin: () => void;
  onBack?: () => void;
}

export default function CreateAccountScreen({
  onCreateAccount,
  onGoToLogin,
  onBack,
}: CreateAccountScreenProps) {
  const insets = useSafeAreaInsets();

  // Step State: 1 = Choose Role, 2 = Enter Account Details
  const [step, setStep] = useState<1 | 2>(1);

  // Selected Role
  const [selectedRole, setSelectedRole] = useState<PrimaryRoleId | null>(null);

  // Head Responsibility State (when selectedRole === 'head')
  const [headType, setHeadType] = useState<HeadType | null>(null);
  const [customHeadType, setCustomHeadType] = useState('');
  const [showHeadModal, setShowHeadModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // Text Input Refs for natural keyboard flow
  const fullNameRef = useRef<TextInput>(null);
  const customCollegeRef = useRef<TextInput>(null);
  const customDepartmentRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const activationCodeRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const idValueRef = useRef<TextInput>(null);
  const customHeadRef = useRef<TextInput>(null);
  const customHeadStep1Ref = useRef<TextInput>(null);

  // Layout tracking for automatic focus-scrolling
  const step2Y = useRef(0);
  const fieldYPositions = useRef<Record<string, number>>({});

  const handleFieldFocus = (fieldKey: string) => {
    setTimeout(() => {
      const fieldOffset = fieldYPositions.current[fieldKey];
      if (fieldOffset !== undefined && scrollViewRef.current) {
        const targetY = Math.max(0, step2Y.current + fieldOffset - 50);
        scrollViewRef.current.scrollTo({ y: targetY, animated: true });
      }
    }, 60);
  };

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [password, setPassword] = useState('');

  // College & Department States
  const [institutionId, setInstitutionId] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [customCollegeName, setCustomCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [customDepartmentName, setCustomDepartmentName] = useState('');
  const [programId, setProgramId] = useState('');
  const [courseName, setCourseName] = useState('');

  const [idValue, setIdValue] = useState(''); // Register Number or Employee ID
  const [activationCode, setActivationCode] = useState('');
  const [selectedBatchLabel, setSelectedBatchLabel] = useState('');
  const [responsibilities, setResponsibilities] = useState<AdditionalResponsibility[]>([]);

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modals Visibility
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showRespModal, setShowRespModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // All Tamil Nadu colleges directly searchable + 'Other'
  const collegeOptions = useMemo(() => {
    const opts: SelectOption[] = INSTITUTIONS.map((c) => ({
      label: c.name,
      value: c.id,
      searchKeywords: `${c.district} ${c.institutionType === 'engineering' ? 'Engineering' : 'Arts and Science'}`,
    }));
    opts.push({
      label: 'Other',
      value: 'other',
      subtitle: 'Institution not listed',
    });
    return opts;
  }, []);

  // Complete master catalogue directly searchable with aliases (No subtitle/badges in row)
  const departmentOptions: SelectOption[] = useMemo(() => {
    const opts: SelectOption[] = PROGRAMS.map((p) => {
      const aliasStr = (p.aliases || []).join(' ');
      const aliasNoDots = (p.aliases || []).map((a) => a.replace(/\./g, '')).join(' ');
      return {
        label: p.displayName,
        value: p.id,
        group: getProgramGroup(p),
        searchKeywords: `${p.displayName} ${p.displayName.replace(/\./g, '')} ${p.shortName} ${p.name} ${p.specialization || ''} ${p.degree} ${p.degree.replace(/\./g, '')} ${aliasStr} ${aliasNoDots}`,
      };
    });
    // Append 'Other / Course Not Listed' at the END of the Department selector
    opts.push({
      label: 'Other / Course Not Listed',
      value: 'other',
      group: 'OTHER',
      searchKeywords: 'other custom course not listed not found',
    });
    return opts;
  }, []);

  const checkAndScrollToCTA = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handleCollegePress = () => {
    setShowCollegeModal(true);
  };

  const handleSelectCollege = (selectedInstId: string) => {
    setShowCollegeModal(false);

    if (selectedInstId !== institutionId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.collegeName;
        delete next.customCollegeName;
        return next;
      });
    }

    if (selectedInstId === 'other') {
      setInstitutionId('other');
      setCollegeName('Other');
      showAchieveXDialog({
        type: 'info',
        title: "AchieveX isn't available here yet",
        message:
          'Your institution has not been activated on AchieveX. If you have an institutional activation code, you may proceed.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }

    const inst = getInstitutionById(selectedInstId);
    if (!inst) return;

    setInstitutionId(inst.id);
    setCollegeName(inst.name);
    setCustomCollegeName('');

    if (!inst.isOnboarded) {
      showAchieveXDialog({
        type: 'info',
        title: "AchieveX isn't available here yet",
        message:
          'Your institution has not been activated on AchieveX. If you have an institutional activation code, you may proceed.',
        primaryAction: {
          label: 'Got It',
        },
      });
    }
  };

  const handleDepartmentPress = () => {
    setShowDeptModal(true);
  };

  const handleSelectDepartment = (progId: string) => {
    setShowDeptModal(false);

    if (progId === 'other') {
      setProgramId('other');
      setDepartment('Other / Course Not Listed');
      setCourseName('Other / Course Not Listed');
      setErrors((prev) => {
        const next = { ...prev };
        delete next.department;
        delete next.customDepartmentName;
        return next;
      });
      return;
    }

    const prog = getProgramById(progId);
    if (!prog) return;

    setProgramId(prog.id);
    setCourseName(prog.displayName);
    setDepartment(prog.displayName);
    setCustomDepartmentName('');
    setErrors((prev) => {
      const next = { ...prev };
      delete next.department;
      delete next.customDepartmentName;
      return next;
    });

    checkAndScrollToCTA();
  };

  const activeRoleConfig = selectedRole ? ROLE_CONFIGS[selectedRole] : null;
  const selectedHeadTypeOption = HEAD_TYPE_OPTIONS.find((h) => h.value === headType);
  const selectedHeadTypeLabel = selectedHeadTypeOption ? selectedHeadTypeOption.label : '';

  // ─────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────

  const handleRoleSelect = (roleId: PrimaryRoleId) => {
    if (roleId !== 'head') {
      setHeadType(null);
      setCustomHeadType('');
      setErrors((prev) => {
        const next = { ...prev };
        delete next.headType;
        delete next.customHeadType;
        return next;
      });
    }
    setSelectedRole(roleId);
    // Smoothly scroll down to Continue button so user does not need to scroll down manually
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBackPress = () => {
    if (step === 2) {
      setStep(1);
      setErrors({});
    } else {
      onGoToLogin();
    }
  };

  const handleNextStep = () => {
    if (!selectedRole) return;

    if (selectedRole === 'head') {
      const headErrors: Record<string, string> = {};
      if (!headType) {
        headErrors.headType = 'Please select your Head responsibility.';
      } else if (headType === 'other' && !customHeadType.trim()) {
        headErrors.customHeadType = 'Please enter your Head responsibility.';
      }

      if (Object.keys(headErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...headErrors }));
        return;
      }
    }

    setStep(2);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedRole === 'head') {
      if (!headType) {
        newErrors.headType = 'Please select your Head responsibility.';
      } else if (headType === 'other' && !customHeadType.trim()) {
        newErrors.customHeadType = 'Please enter your Head responsibility.';
      }
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }



    if (!collegeName.trim()) {
      newErrors.collegeName = 'Select your college.';
    } else if (collegeName === 'Other' && !customCollegeName.trim()) {
      newErrors.customCollegeName = 'Please enter your college name.';
    }

    if (!department.trim()) {
      newErrors.department = 'Please select your department.';
    } else if (
      (department === 'Other / Course Not Listed' || programId === 'other') &&
      !customDepartmentName.trim()
    ) {
      newErrors.customDepartmentName = 'Please enter your department / course name.';
    }

    if (activeRoleConfig?.idField === 'registerNumber' && !idValue.trim()) {
      newErrors.idValue = 'Register number is required';
    } else if (activeRoleConfig?.idField === 'employeeId' && !idValue.trim()) {
      newErrors.idValue = 'Employee ID is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!collegeEmail.trim()) {
      newErrors.collegeEmail = 'College email is required';
    } else if (!emailRegex.test(collegeEmail.trim())) {
      newErrors.collegeEmail = 'Please enter a valid email address';
    }

    const finalCollegeName = collegeName === 'Other' ? customCollegeName.trim() : collegeName;

    if (!activationCode.trim()) {
      newErrors.activationCode = 'Enter your activation code.';
    } else {
      const valResult = validateInstitutionActivation(finalCollegeName, activationCode);
      if (!valResult.valid) {
        newErrors.activationCode =
          valResult.message || 'Invalid activation code.';
      }
    }

    if (activeRoleConfig?.showAcademicBatch && !selectedBatchLabel) {
      newErrors.academicBatch = 'Academic year batch is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccountSubmit = () => {
    if (!selectedRole || !activeRoleConfig) return;

    if (!validateForm()) return;

    const finalCollegeName = collegeName === 'Other' ? customCollegeName.trim() : collegeName;
    const activationCheck = validateInstitutionActivation(finalCollegeName, activationCode);
    const matchedBatch = ACADEMIC_BATCHES.find((b) => b.label === selectedBatchLabel) || null;

    const isCustomCourse = programId === 'other' || department === 'Other / Course Not Listed';
    const finalDepartment = isCustomCourse ? customDepartmentName.trim() : department.trim();

    const newAccount: CreatedAccountData = {
      id: `user_${Date.now()}`,
      fullName: fullName.trim(),
      primaryRole: selectedRole,
      headType: selectedRole === 'head' ? headType : null,
      customHeadType: selectedRole === 'head' && headType === 'other' ? customHeadType.trim() : null,
      responsibilities: responsibilities,
      registerNumber: activeRoleConfig.idField === 'registerNumber' ? idValue.trim() : null,
      employeeId: activeRoleConfig.idField === 'employeeId' ? idValue.trim() : null,
      institutionType: (institutionId && institutionId !== 'other' ? getInstitutionById(institutionId)?.institutionType : null) || null,
      district: (institutionId && institutionId !== 'other' ? getInstitutionById(institutionId)?.district : null) || null,
      institutionId: institutionId || activationCheck.institutionId || 'inst_001',
      collegeName: finalCollegeName,
      collegeEmail: collegeEmail.trim().toLowerCase(),
      department: finalDepartment || null,
      programId: isCustomCourse ? null : (programId || null),
      courseName: finalDepartment || null,
      customDepartmentName: isCustomCourse ? customDepartmentName.trim() : null,
      isCustomDepartment: isCustomCourse,
      academicBatch: matchedBatch,
      activationCode: activationCode.trim().toUpperCase(),
      accountStatus:
        ['hod', 'head', 'dean', 'principal'].includes(selectedRole)
          ? 'pendingRoleVerification'
          : 'active',
      createdAt: new Date().toISOString(),
    };

    onCreateAccount(newAccount);
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        style={styles.keyboardContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(80, insets.bottom + 60) },
          ]}
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

          {/* Top Header Bar with Back Button */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Centered AchieveX Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/AchieveX logo (2).png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title & Subtitle */}
          <View style={styles.headingContainer}>
            <Text style={styles.mainTitle}>Create Account</Text>
            <Text style={styles.subtitleText}>
              {step === 1
                ? 'Choose your role to get started with AchieveX'
                : activeRoleConfig?.subtitle || 'Create your account'}
            </Text>
          </View>

          {/* Thin Divider Line */}
          <View style={styles.dividerLine} />

          {/* ════════════════════════════════════════════════════════════
              STEP 1: CHOOSE ROLE GRID
          ════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <View style={styles.step1Container}>
              <View style={styles.roleGrid}>
                {ROLES_LIST.map((role) => (
                  <View key={role.id} style={styles.gridItemWrapper}>
                    <RoleCard
                      role={role}
                      selected={selectedRole === role.id}
                      onSelect={() => handleRoleSelect(role.id)}
                    />
                  </View>
                ))}
              </View>

              {/* Dynamic Head of Fields (shown only when Role = Head) */}
              {selectedRole === 'head' && (
                <View style={styles.headFieldsContainer}>
                  <Text style={styles.inputLabel}>
                    Head of <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <CreateAccountInput
                    placeholder="Select responsibility"
                    value={selectedHeadTypeLabel}
                    isDropdown
                    onPress={() => setShowHeadModal(true)}
                    error={errors.headType}
                  />

                  {headType === 'other' && (
                    <View style={styles.customHeadWrapper}>
                      <Text style={styles.inputLabel}>
                        Head Responsibility <Text style={styles.requiredAsterisk}>*</Text>
                      </Text>
                      <CreateAccountInput
                        ref={customHeadStep1Ref}
                        placeholder="Enter responsibility"
                        value={customHeadType}
                        onChangeText={(text) => {
                          setCustomHeadType(text);
                          if (errors.customHeadType) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.customHeadType;
                              return next;
                            });
                          }
                        }}
                        error={errors.customHeadType}
                        autoCapitalize="words"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                      />
                    </View>
                  )}
                </View>
              )}

              {/* Next Step Button */}
              <View style={styles.actionBtnContainer}>
                <TouchableOpacity
                  style={[
                    styles.nextPillBtn,
                    !selectedRole && styles.nextPillBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleNextStep}
                  disabled={!selectedRole}
                >
                  <Text style={styles.nextBtnText}>Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ════════════════════════════════════════════════════════════
              STEP 2: ROLE-DRIVEN ACCOUNT DETAILS FORM
          ════════════════════════════════════════════════════════════ */}
          {step === 2 && activeRoleConfig && (
            <View
              style={styles.step2Container}
              onLayout={(e) => {
                step2Y.current = e.nativeEvent.layout.y;
              }}
            >
              {/* Field 1: Full Name */}
              <CreateAccountInput
                ref={fullNameRef}
                placeholder="Full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                rightIconName="person"
                error={errors.fullName}
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  if (collegeName === 'Other') {
                    customCollegeRef.current?.focus();
                  } else if (department === 'Other / Course Not Listed' || programId === 'other') {
                    customDepartmentRef.current?.focus();
                  } else {
                    emailRef.current?.focus();
                  }
                }}
                onFocus={() => handleFieldFocus('fullName')}
                onLayout={(e) => {
                  fieldYPositions.current['fullName'] = e.nativeEvent.layout.y;
                }}
              />

              {/* Field: College Name */}
              <CreateAccountInput
                placeholder="College Name"
                value={collegeName}
                isDropdown
                isDropdownOpen={showCollegeModal}
                onPress={handleCollegePress}
                error={errors.collegeName}
              />

              {/* Custom College Name (shown when College Name is 'Other') */}
              {collegeName === 'Other' && (
                <CreateAccountInput
                  ref={customCollegeRef}
                  placeholder="Enter your college name"
                  value={customCollegeName}
                  onChangeText={(text) => {
                    setCustomCollegeName(text);
                    if (errors.customCollegeName) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.customCollegeName;
                        return next;
                      });
                    }
                  }}
                  rightIconName="school-outline"
                  error={errors.customCollegeName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    if (department === 'Other / Course Not Listed' || programId === 'other') {
                      customDepartmentRef.current?.focus();
                    } else {
                      emailRef.current?.focus();
                    }
                  }}
                  onFocus={() => handleFieldFocus('customCollegeName')}
                  onLayout={(e) => {
                    fieldYPositions.current['customCollegeName'] = e.nativeEvent.layout.y;
                  }}
                />
              )}

              {/* Field: Department */}
              <CreateAccountInput
                placeholder="Department"
                value={
                  department === 'Other / Course Not Listed'
                    ? (customDepartmentName ? `Other (${customDepartmentName})` : 'Other / Course Not Listed')
                    : department
                }
                isDropdown
                isDropdownOpen={showDeptModal}
                onPress={handleDepartmentPress}
                error={errors.department}
              />

              {/* Custom Department / Course Name (shown when 'Other / Course Not Listed' is selected) */}
              {(department === 'Other / Course Not Listed' || programId === 'other') && (
                <CreateAccountInput
                  ref={customDepartmentRef}
                  placeholder="Enter Department / Course Name"
                  value={customDepartmentName}
                  onChangeText={(text) => {
                    setCustomDepartmentName(text);
                    if (errors.customDepartmentName) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.customDepartmentName;
                        return next;
                      });
                    }
                  }}
                  rightIconName="school-outline"
                  error={errors.customDepartmentName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    emailRef.current?.focus();
                  }}
                  onFocus={() => handleFieldFocus('customDepartmentName')}
                  onLayout={(e) => {
                    fieldYPositions.current['customDepartmentName'] = e.nativeEvent.layout.y;
                  }}
                />
              )}

              {/* Field 6: College Email */}
              <CreateAccountInput
                ref={emailRef}
                placeholder="College Email"
                value={collegeEmail}
                onChangeText={(text) => {
                  setCollegeEmail(text);
                  if (errors.collegeEmail) setErrors({ ...errors, collegeEmail: '' });
                }}
                rightIconName="at-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.collegeEmail}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  activationCodeRef.current?.focus();
                }}
                onFocus={() => handleFieldFocus('collegeEmail')}
                onLayout={(e) => {
                  fieldYPositions.current['collegeEmail'] = e.nativeEvent.layout.y;
                }}
              />

              {/* Field 7: Activation Code with info (i) tooltip icon */}
              <CreateAccountInput
                ref={activationCodeRef}
                placeholder="Enter activation code"
                value={activationCode}
                onChangeText={(text) => {
                  setActivationCode(text);
                  if (errors.activationCode) setErrors({ ...errors, activationCode: '' });
                }}
                rightIconName="key-outline"
                showInfoIcon
                onInfoPress={() => setShowInfoModal(true)}
                autoCapitalize="characters"
                error={errors.activationCode}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
                onFocus={() => handleFieldFocus('activationCode')}
                onLayout={(e) => {
                  fieldYPositions.current['activationCode'] = e.nativeEvent.layout.y;
                }}
              />

              {/* Field 8: Password with show/hide */}
              <CreateAccountInput
                ref={passwordRef}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                isPassword
                autoCapitalize="none"
                error={errors.password}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  idValueRef.current?.focus();
                }}
                onFocus={() => handleFieldFocus('password')}
                onLayout={(e) => {
                  fieldYPositions.current['password'] = e.nativeEvent.layout.y;
                }}
              />

              {/* Field 9: Register Number or Employee ID */}
              <CreateAccountInput
                ref={idValueRef}
                placeholder={activeRoleConfig.idLabel}
                value={idValue}
                onChangeText={(text) => {
                  setIdValue(text);
                  if (errors.idValue) setErrors({ ...errors, idValue: '' });
                }}
                rightIconName="badge-account-horizontal-outline"
                rightIconFamily="MaterialCommunityIcons"
                error={errors.idValue}
                autoCapitalize="characters"
                returnKeyType={selectedRole === 'head' && headType === 'other' ? 'next' : 'done'}
                blurOnSubmit={!(selectedRole === 'head' && headType === 'other')}
                onSubmitEditing={() => {
                  if (selectedRole === 'head' && headType === 'other') {
                    customHeadRef.current?.focus();
                  } else {
                    Keyboard.dismiss();
                    checkAndScrollToCTA();
                  }
                }}
                onFocus={() => handleFieldFocus('idValue')}
                onLayout={(e) => {
                  fieldYPositions.current['idValue'] = e.nativeEvent.layout.y;
                }}
              />

              {/* Head of responsibility (when Head role) */}
              {selectedRole === 'head' && (
                <>
                  <CreateAccountInput
                    placeholder="Head of"
                    value={selectedHeadTypeLabel}
                    isDropdown
                    onPress={() => setShowHeadModal(true)}
                    error={errors.headType}
                  />

                  {headType === 'other' && (
                    <CreateAccountInput
                      ref={customHeadRef}
                      placeholder="Head Responsibility"
                      value={customHeadType}
                      onChangeText={(text) => {
                        setCustomHeadType(text);
                        if (errors.customHeadType) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.customHeadType;
                            return next;
                          });
                        }
                      }}
                      error={errors.customHeadType}
                      autoCapitalize="words"
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                        checkAndScrollToCTA();
                      }}
                      onFocus={() => handleFieldFocus('customHeadType')}
                      onLayout={(e) => {
                        fieldYPositions.current['customHeadType'] = e.nativeEvent.layout.y;
                      }}
                    />
                  )}
                </>
              )}

              {/* Field 10: Academic Year Batch (Student only) */}
              {activeRoleConfig.showAcademicBatch && (
                <CreateAccountInput
                  placeholder="Academic Year"
                  value={selectedBatchLabel}
                  isDropdown
                  onPress={() => setShowBatchModal(true)}
                  error={errors.academicBatch}
                />
              )}

              {/* Field 11: Additional Responsibilities (Faculty, HOD, Dean) */}
              {activeRoleConfig.showResponsibilities && (
                <CreateAccountInput
                  placeholder="Additional Responsibilities"
                  value={
                    responsibilities.length > 0
                      ? responsibilities.join(', ')
                      : ''
                  }
                  isDropdown
                  onPress={() => setShowRespModal(true)}
                />
              )}

              {/* Create Account Action Button */}
              <View style={styles.createBtnContainer}>
                <TouchableOpacity
                  style={styles.createAccountPillBtn}
                  activeOpacity={0.8}
                  onPress={handleCreateAccountSubmit}
                >
                  <Text style={styles.createAccountBtnText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer: Already have an account? Sign In */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onGoToLogin} activeOpacity={0.7}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ════════════════════════════════════════════════════════════
          MODALS & SELECTORS
      ════════════════════════════════════════════════════════════ */}

      {/* College Searchable Modal */}
      <SearchableSelectModal
        visible={showCollegeModal}
        onClose={() => setShowCollegeModal(false)}
        title="Select College"
        options={collegeOptions}
        selectedValue={institutionId}
        onSelect={handleSelectCollege}
        searchPlaceholder="Search college name..."
        emptyTitle="No Colleges Found"
        emptySubtitle="Try another search term or select 'Other'."
        emptySearchTitle="No Matching College"
        emptySearchSubtitle="Try another college name or select 'Other'."
      />

      {/* Department Dropdown Modal */}
      <SearchableSelectModal
        visible={showDeptModal}
        onClose={() => setShowDeptModal(false)}
        title="Select Department"
        options={departmentOptions}
        selectedValue={programId || department}
        onSelect={handleSelectDepartment}
        searchPlaceholder="Search department..."
        emptyTitle="No Departments Available"
        emptySubtitle="No departments found."
        emptySearchTitle="No Matching Department"
        emptySearchSubtitle="Try another keyword e.g. 'iot', 'cyber', 'b.com'."
      />

      {/* Head of Responsibility Modal */}
      <SearchableSelectModal
        visible={showHeadModal}
        onClose={() => setShowHeadModal(false)}
        title="Select Responsibility"
        options={HEAD_TYPE_OPTIONS.map((opt) => ({
          label: opt.label,
          value: opt.value,
          subtitle: opt.subtitle,
        }))}
        selectedValue={headType || ''}
        onSelect={(val) => {
          const selected = val as HeadType;
          setHeadType(selected);
          if (errors.headType) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.headType;
              return next;
            });
          }
          if (selected !== 'other') {
            setCustomHeadType('');
            if (errors.customHeadType) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.customHeadType;
                return next;
              });
            }
          }
          checkAndScrollToCTA();
        }}
        searchable={false}
      />

      {/* Academic Year Batch Dropdown Modal */}
      <SearchableSelectModal
        visible={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="Select Academic Year / Batch"
        options={ACADEMIC_BATCHES.map((b) => ({
          label: b.label,
          value: b.label,
          subtitle: `Batch: ${b.startYear} - ${b.endYear}`,
        }))}
        selectedValue={selectedBatchLabel}
        onSelect={(val) => {
          setSelectedBatchLabel(val);
          if (errors.academicBatch) setErrors({ ...errors, academicBatch: '' });
          checkAndScrollToCTA();
        }}
        searchable={false}
      />

      {/* Additional Responsibilities Multi-Select Modal */}
      {activeRoleConfig?.showResponsibilities && (
        <MultiSelectModal
          visible={showRespModal}
          onClose={() => setShowRespModal(false)}
          title="Additional Responsibilities"
          options={activeRoleConfig.availableResponsibilities}
          selectedValues={responsibilities}
          onConfirm={(vals) => {
            setResponsibilities(vals);
            checkAndScrollToCTA();
          }}
        />
      )}

      {/* Activation Code Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <TouchableOpacity
          style={styles.infoModalOverlay}
          activeOpacity={1}
          onPress={() => setShowInfoModal(false)}
        >
          <View style={styles.infoModalCard} onStartShouldSetResponder={() => true}>
            <Ionicons name="information-circle" size={32} color="#6D28D9" style={{ marginBottom: 8 }} />
            <Text style={styles.infoModalTitle}>Activation Code</Text>
            <Text style={styles.infoModalBody}>
              Enter the activation code provided by your institution.
            </Text>
            <TouchableOpacity
              style={styles.infoModalBtn}
              onPress={() => setShowInfoModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.infoModalBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
  },

  // Faded decorative background icons
  bgDecorations: {
    ...StyleSheet.absoluteFill,
    opacity: 0.18,
  },
  bgIconCap: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
  },
  bgIconDoc: {
    position: 'absolute',
    top: 80,
    left: 24,
  },
  bgIconBook: {
    position: 'absolute',
    top: 80,
    right: 24,
  },
  bgIconTrophyL: {
    position: 'absolute',
    top: 170,
    left: 14,
  },
  bgIconTrophyR: {
    position: 'absolute',
    top: 170,
    right: 14,
  },

  // Top Nav Row
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  logoImage: {
    width: 152,
    height: 152,
  },

  // Heading
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },

  // Divider
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
    width: '96%',
    alignSelf: 'center',
  },

  // Step 1: Role Grid
  step1Container: {
    marginTop: 4,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: 2,
  },
  headFieldsContainer: {
    marginTop: 16,
    paddingHorizontal: 2,
  },
  customHeadWrapper: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginLeft: 4,
  },
  requiredAsterisk: {
    color: '#EF4444',
    fontWeight: '700',
  },

  actionBtnContainer: {
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  nextPillBtn: {
    backgroundColor: '#6D28D9',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 28,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  nextPillBtnDisabled: {
    backgroundColor: '#C4B5FD',
    shadowOpacity: 0.05,
    elevation: 0,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Step 2: Form
  step2Container: {
    marginTop: 4,
  },
  createBtnContainer: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  createAccountPillBtn: {
    backgroundColor: '#6D28D9',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 36,
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  createAccountBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Footer
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 13.5,
    color: '#6D28D9',
    fontWeight: '700',
  },

  // Info Modal
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  infoModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  infoModalBody: {
    fontSize: 13.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  infoModalBtn: {
    backgroundColor: '#6D28D9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModalBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
