// ─────────────────────────────────────────────────────────────
// AchieveX — New Course Record Multi-Step Flow Component
// 4 Steps: 1 Type -> 2 Details -> 3 Proof -> 4 Review + Success
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  type CreditCourseRecord,
  type CourseProofFile,
} from '../../data/academicCreditsData';

interface NewCourseRecordFlowProps {
  visible: boolean;
  onClose: () => void;
  onSubmitCourse: (course: CreditCourseRecord) => void;
  onViewRecord?: (course: CreditCourseRecord) => void;
}

const COURSE_TYPES_OPTIONS = [
  {
    type: 'NPTEL Course' as const,
    title: 'NPTEL Course',
    subtitle: 'Elite, Silver, Gold certifications from IITs/IISc',
    icon: 'school-outline',
  },
  {
    type: 'SWAYAM Course' as const,
    title: 'SWAYAM Course',
    subtitle: 'National MOOCs portal online learning courses',
    icon: 'globe-outline',
  },
  {
    type: 'Value Added Course (VAC)' as const,
    title: 'Value Added Course (VAC)',
    subtitle: 'College department certified industry skill courses',
    icon: 'ribbon-outline',
  },
  {
    type: 'Other Approved Credit Course' as const,
    title: 'Other Approved Credit Course',
    subtitle: 'Institution recognized curriculum credit programs',
    icon: 'document-text-outline',
  },
];

const SEMESTER_OPTIONS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const CREDIT_OPTIONS = [1, 2, 3, 4, 6];

export default function NewCourseRecordFlow({
  visible,
  onClose,
  onSubmitCourse,
  onViewRecord,
}: NewCourseRecordFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [courseType, setCourseType] = useState<
    'NPTEL Course' | 'SWAYAM Course' | 'Value Added Course (VAC)' | 'Other Approved Credit Course'
  >('NPTEL Course');
  const [courseName, setCourseName] = useState('');
  const [provider, setProvider] = useState('NPTEL / SWAYAM');
  const [domain, setDomain] = useState('');
  const [duration, setDuration] = useState('12 Weeks');
  const [startDate, setStartDate] = useState('2026-01-15');
  const [completionDate, setCompletionDate] = useState('2026-04-10');
  const [finalScore, setFinalScore] = useState('');
  const [examStatus, setExamStatus] = useState<'Passed' | 'Appeared' | 'Exempted'>('Passed');
  const [certificationStatus, setCertificationStatus] = useState('Certificate Received');
  const [creditApplicable, setCreditApplicable] = useState(true);
  const [creditsEarned, setCreditsEarned] = useState(4);
  const [semester, setSemester] = useState('Semester 5');
  const [academicYear, setAcademicYear] = useState('2026–27');

  // Proofs & Declaration
  const [certificateProof, setCertificateProof] = useState<CourseProofFile | null>(null);
  const [assessmentProof, setAssessmentProof] = useState<CourseProofFile | null>(null);
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);

  // Success State
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lastSubmittedCourse, setLastSubmittedCourse] = useState<CreditCourseRecord | null>(null);

  // Validation Check: Date Order
  const isDateInvalid = Boolean(
    startDate && completionDate && new Date(completionDate) < new Date(startDate)
  );

  const resetForm = () => {
    setStep(1);
    setCourseType('NPTEL Course');
    setCourseName('');
    setProvider('NPTEL / SWAYAM');
    setDomain('');
    setDuration('12 Weeks');
    setStartDate('2026-01-15');
    setCompletionDate('2026-04-10');
    setFinalScore('');
    setExamStatus('Passed');
    setCertificationStatus('Certificate Received');
    setCreditApplicable(true);
    setCreditsEarned(4);
    setSemester('Semester 5');
    setAcademicYear('2026–27');
    setCertificateProof(null);
    setAssessmentProof(null);
    setDeclarationConfirmed(false);
    setSuccessModalVisible(false);
    setLastSubmittedCourse(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectType = (selected: typeof courseType) => {
    setCourseType(selected);
    if (selected === 'NPTEL Course') {
      setProvider('NPTEL / SWAYAM');
      setDuration('12 Weeks');
    } else if (selected === 'SWAYAM Course') {
      setProvider('SWAYAM Portal');
      setDuration('8 Weeks');
    } else if (selected === 'Value Added Course (VAC)') {
      setProvider('College Department');
      setDuration('4 Weeks');
    } else {
      setProvider('Institution Approved');
      setDuration('4 Weeks');
    }
  };

  // Simulate proof pickers
  const handlePickCertificate = () => {
    setCertificateProof({
      name: `${courseName ? courseName.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'course'}_certificate.pdf`,
      size: '1.8 MB',
    });
  };

  const handlePickAssessment = () => {
    setAssessmentProof({
      name: `${courseName ? courseName.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'course'}_scorecard.pdf`,
      size: '1.2 MB',
    });
  };

  const handleSubmit = (isDraft: boolean = false) => {
    const newCourse: CreditCourseRecord = {
      id: `AX-CR-${Math.floor(100000 + Math.random() * 900000)}`,
      courseType,
      courseName: courseName.trim() || 'Course Record',
      provider: provider.trim() || 'Academic Provider',
      domain: domain.trim() || 'Computer Science & Engineering',
      duration,
      startDate,
      completionDate,
      status: isDraft ? 'Draft' : 'Completed with Certification',
      certificationStatus,
      finalScore: finalScore ? `${finalScore.replace('%', '')}%` : undefined,
      examStatus,
      creditApplicable,
      claimedCredits: creditApplicable ? creditsEarned : 0,
      creditsEarned: creditApplicable ? creditsEarned : 0,
      creditType: courseType.includes('VAC') ? 'Institutional Credit' : 'Academic Credit',
      semester,
      academicYear,
      verificationStatus: isDraft ? 'Pending' : 'Pending',
      proofs: certificateProof ? [certificateProof] : [{ name: 'course_proof.pdf', size: '1.4 MB' }],
      assessmentProof: assessmentProof || undefined,
    };

    onSubmitCourse(newCourse);
    setLastSubmittedCourse(newCourse);
    setSuccessModalVisible(true);
  };

  const handleSuccessView = () => {
    if (lastSubmittedCourse && onViewRecord) {
      onViewRecord(lastSubmittedCourse);
    }
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={step === 1 ? handleClose : () => setStep((s) => (s - 1) as any)}>
              <Ionicons name="arrow-back" size={20} color="#1F2937" />
              <Text style={styles.backText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
            </TouchableOpacity>

            <Text style={styles.screenTitle}>New Course Record</Text>

            <TouchableOpacity style={styles.closeHeaderBtn} activeOpacity={0.7} onPress={handleClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Stepper Bar */}
          <View style={styles.stepperContainer}>
            {[
              { num: 1, label: 'Type' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Proof' },
              { num: 4, label: 'Review' },
            ].map((s, idx) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <View style={styles.stepNode}>
                    <View
                      style={[
                        styles.stepCircle,
                        isDone && styles.stepCircleDone,
                        isCurrent && styles.stepCircleCurrent,
                      ]}
                    >
                      {isDone ? (
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      ) : (
                        <Text
                          style={[
                            styles.stepNumText,
                            isCurrent && styles.stepNumTextCurrent,
                          ]}
                        >
                          {s.num}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabelText,
                        (isCurrent || isDone) && styles.stepLabelTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </View>
                  {idx < 3 && (
                    <View
                      style={[
                        styles.stepLine,
                        step > idx + 1 && styles.stepLineActive,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Form Step Body */}
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ════════════════════════════════════════════════════
                STEP 1: COURSE TYPE
            ════════════════════════════════════════════════════ */}
            {step === 1 && (
              <View>
                <Text style={styles.stepTitle}>Course Type</Text>
                <Text style={styles.stepSubtitle}>
                  Select the type of academic credit course you completed.
                </Text>

                <View style={styles.typeCardsList}>
                  {COURSE_TYPES_OPTIONS.map((opt) => {
                    const isSelected = courseType === opt.type;
                    return (
                      <TouchableOpacity
                        key={opt.type}
                        style={[
                          styles.typeCard,
                          isSelected && styles.typeCardSelected,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleSelectType(opt.type)}
                      >
                        <View
                          style={[
                            styles.typeIconBox,
                            isSelected && styles.typeIconBoxSelected,
                          ]}
                        >
                          <Ionicons
                            name={opt.icon as any}
                            size={22}
                            color={isSelected ? '#2563EB' : '#64748B'}
                          />
                        </View>

                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text
                            style={[
                              styles.typeCardTitle,
                              isSelected && styles.typeCardTitleSelected,
                            ]}
                          >
                            {opt.title}
                          </Text>
                          <Text style={styles.typeCardSubtitle}>{opt.subtitle}</Text>
                        </View>

                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Next CTA */}
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  activeOpacity={0.85}
                  onPress={() => setStep(2)}
                >
                  <Text style={styles.primaryActionBtnText}>Continue to Details</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}

            {/* ════════════════════════════════════════════════════
                STEP 2: COURSE DETAILS
            ════════════════════════════════════════════════════ */}
            {step === 2 && (
              <View>
                <Text style={styles.stepTitle}>Course Details</Text>
                <Text style={styles.stepSubtitle}>
                  Enter the course specifications, duration, and credit details.
                </Text>

                {/* Section A: Course Information */}
                <Text style={styles.inputSectionHeading}>COURSE INFORMATION</Text>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Course Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Introduction to Data Science"
                    placeholderTextColor="#94A3B8"
                    value={courseName}
                    onChangeText={setCourseName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Provider / Organization *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. NPTEL / SWAYAM or College Department"
                    placeholderTextColor="#94A3B8"
                    value={provider}
                    onChangeText={setProvider}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Course Domain *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Data Science, Artificial Intelligence, Cloud"
                    placeholderTextColor="#94A3B8"
                    value={domain}
                    onChangeText={setDomain}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Course Duration *</Text>
                  <View style={styles.durationRow}>
                    {['4 Weeks', '8 Weeks', '12 Weeks'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.durationChip, duration === d && styles.durationChipActive]}
                        onPress={() => setDuration(d)}
                      >
                        <Text style={[styles.durationChipText, duration === d && styles.durationChipTextActive]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Section B: Timeline */}
                <Text style={styles.inputSectionHeading}>TIMELINE</Text>
                <View style={styles.twoColRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Start Date</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94A3B8"
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Completion Date *</Text>
                    <TextInput
                      style={[styles.textInput, isDateInvalid && styles.textInputError]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94A3B8"
                      value={completionDate}
                      onChangeText={setCompletionDate}
                    />
                  </View>
                </View>

                {/* Strict Date Validation Error */}
                {isDateInvalid && (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={14} color="#DC2626" style={{ marginRight: 6 }} />
                    <Text style={styles.errorBannerText}>
                      Completion date cannot be earlier than the start date.
                    </Text>
                  </View>
                )}

                {/* Section C: Result & Certification */}
                <Text style={styles.inputSectionHeading}>COURSE RESULT</Text>
                <View style={styles.twoColRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Final Score (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. 88%"
                      placeholderTextColor="#94A3B8"
                      value={finalScore}
                      onChangeText={setFinalScore}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Exam Status</Text>
                    <View style={styles.examStatusRow}>
                      {(['Passed', 'Appeared'] as const).map((es) => (
                        <TouchableOpacity
                          key={es}
                          style={[styles.miniChip, examStatus === es && styles.miniChipActive]}
                          onPress={() => setExamStatus(es)}
                        >
                          <Text style={[styles.miniChipText, examStatus === es && styles.miniChipTextActive]}>
                            {es}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Section D: Academic Credit */}
                <Text style={styles.inputSectionHeading}>ACADEMIC CREDIT</Text>
                <View style={styles.creditToggleCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleTitle}>Credit Applicable?</Text>
                    <Text style={styles.toggleSubtitle}>
                      Will this course count towards degree learning credits?
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggleBtn, creditApplicable && styles.toggleBtnActive]}
                    activeOpacity={0.8}
                    onPress={() => setCreditApplicable(!creditApplicable)}
                  >
                    <Text style={[styles.toggleBtnText, creditApplicable && styles.toggleBtnTextActive]}>
                      {creditApplicable ? 'YES' : 'NO'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {creditApplicable && (
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Credits Earned *</Text>
                    <View style={styles.creditOptionsRow}>
                      {CREDIT_OPTIONS.map((cr) => (
                        <TouchableOpacity
                          key={cr}
                          style={[styles.creditChip, creditsEarned === cr && styles.creditChipActive]}
                          onPress={() => setCreditsEarned(cr)}
                        >
                          <Text style={[styles.creditChipText, creditsEarned === cr && styles.creditChipTextActive]}>
                            {cr} {cr === 1 ? 'Credit' : 'Credits'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.twoColRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Completed Semester *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Semester 5"
                      placeholderTextColor="#94A3B8"
                      value={semester}
                      onChangeText={setSemester}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Academic Year *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. 2026–27"
                      placeholderTextColor="#94A3B8"
                      value={academicYear}
                      onChangeText={setAcademicYear}
                    />
                  </View>
                </View>

                {/* Action CTA */}
                <TouchableOpacity
                  style={[
                    styles.primaryActionBtn,
                    (!courseName.trim() || isDateInvalid) && styles.primaryActionBtnDisabled,
                  ]}
                  activeOpacity={0.85}
                  disabled={!courseName.trim() || isDateInvalid}
                  onPress={() => setStep(3)}
                >
                  <Text style={styles.primaryActionBtnText}>Continue to Proof</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}

            {/* ════════════════════════════════════════════════════
                STEP 3: PROOF UPLOAD
            ════════════════════════════════════════════════════ */}
            {step === 3 && (
              <View>
                <Text style={styles.stepTitle}>Course Proof</Text>
                <Text style={styles.stepSubtitle}>
                  Upload documents that confirm your course completion and score.
                </Text>

                {/* Required: Course Certificate */}
                <Text style={styles.inputSectionHeading}>REQUIRED PROOF</Text>
                <View style={styles.proofCard}>
                  <View style={styles.proofCardHeader}>
                    <Ionicons name="ribbon" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.proofCardTitle}>Course Certificate *</Text>
                      <Text style={styles.proofCardHint}>Official completion certificate (PDF, JPG or PNG)</Text>
                    </View>
                  </View>

                  {!certificateProof ? (
                    <TouchableOpacity
                      style={styles.uploadBox}
                      activeOpacity={0.75}
                      onPress={handlePickCertificate}
                    >
                      <Ionicons name="cloud-upload-outline" size={20} color="#2563EB" style={{ marginRight: 6 }} />
                      <Text style={styles.uploadBoxText}>Upload Certificate</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.attachedFileBox}>
                      <Ionicons name="document-text" size={18} color="#059669" style={{ marginRight: 6 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.attachedFileName} numberOfLines={1}>
                          {certificateProof.name}
                        </Text>
                        <Text style={styles.attachedFileSize}>{certificateProof.size}</Text>
                      </View>
                      <TouchableOpacity onPress={handlePickCertificate}>
                        <Text style={styles.changeLinkText}>Replace</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Optional: Assessment Scorecard */}
                <Text style={styles.inputSectionHeading}>OPTIONAL PROOF</Text>
                <View style={styles.proofCard}>
                  <View style={styles.proofCardHeader}>
                    <Ionicons name="bar-chart-outline" size={20} color="#4F46E5" style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.proofCardTitle}>Assessment / Exam Result</Text>
                      <Text style={styles.proofCardHint}>Scorecard or result portal screenshot</Text>
                    </View>
                  </View>

                  {!assessmentProof ? (
                    <TouchableOpacity
                      style={styles.uploadBox}
                      activeOpacity={0.75}
                      onPress={handlePickAssessment}
                    >
                      <Ionicons name="cloud-upload-outline" size={20} color="#4F46E5" style={{ marginRight: 6 }} />
                      <Text style={[styles.uploadBoxText, { color: '#4F46E5' }]}>Upload Scorecard</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.attachedFileBox}>
                      <Ionicons name="document-text" size={18} color="#059669" style={{ marginRight: 6 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.attachedFileName} numberOfLines={1}>
                          {assessmentProof.name}
                        </Text>
                        <Text style={styles.attachedFileSize}>{assessmentProof.size}</Text>
                      </View>
                      <TouchableOpacity onPress={handlePickAssessment}>
                        <Text style={styles.changeLinkText}>Replace</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Genuine Declaration Checkbox */}
                <TouchableOpacity
                  style={styles.declarationRow}
                  activeOpacity={0.8}
                  onPress={() => setDeclarationConfirmed(!declarationConfirmed)}
                >
                  <View
                    style={[
                      styles.checkboxCircle,
                      declarationConfirmed && styles.checkboxCircleActive,
                    ]}
                  >
                    {declarationConfirmed && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.declarationText}>
                    I confirm that the submitted course information and documents are genuine and belong to me.
                  </Text>
                </TouchableOpacity>

                {/* Action CTA */}
                <TouchableOpacity
                  style={[
                    styles.primaryActionBtn,
                    (!certificateProof || !declarationConfirmed) && styles.primaryActionBtnDisabled,
                  ]}
                  activeOpacity={0.85}
                  disabled={!certificateProof || !declarationConfirmed}
                  onPress={() => setStep(4)}
                >
                  <Text style={styles.primaryActionBtnText}>Review Submission</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}

            {/* ════════════════════════════════════════════════════
                STEP 4: REVIEW & SUBMIT
            ════════════════════════════════════════════════════ */}
            {step === 4 && (
              <View>
                <Text style={styles.stepTitle}>Review Course</Text>
                <Text style={styles.stepSubtitle}>
                  Check your course information and proofs before submitting.
                </Text>

                {/* Points Isolation Banner */}
                <View style={styles.infoBanner}>
                  <Ionicons name="information-circle" size={16} color="#2563EB" style={{ marginRight: 6 }} />
                  <Text style={styles.infoBannerText}>
                    Academic credit records do not add to achievement points.
                  </Text>
                </View>

                {/* Section 1: Course */}
                <View style={styles.reviewCard}>
                  <View style={styles.reviewCardHeader}>
                    <Text style={styles.reviewCardSectionTitle}>1. Course Information</Text>
                    <TouchableOpacity onPress={() => setStep(2)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.reviewCourseTitle}>{courseName}</Text>
                  <Text style={styles.reviewCourseType}>{courseType}</Text>

                  <View style={styles.reviewGrid}>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Provider</Text>
                      <Text style={styles.reviewItemValue}>{provider}</Text>
                    </View>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Domain</Text>
                      <Text style={styles.reviewItemValue}>{domain || 'General'}</Text>
                    </View>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Duration</Text>
                      <Text style={styles.reviewItemValue}>{duration}</Text>
                    </View>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Completion</Text>
                      <Text style={styles.reviewItemValue}>{completionDate}</Text>
                    </View>
                  </View>
                </View>

                {/* Section 2: Result & Certification */}
                <View style={styles.reviewCard}>
                  <View style={styles.reviewCardHeader}>
                    <Text style={styles.reviewCardSectionTitle}>2. Result & Examination</Text>
                    <TouchableOpacity onPress={() => setStep(2)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.reviewGrid}>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Final Score</Text>
                      <Text style={styles.reviewItemValue}>{finalScore ? `${finalScore}%` : 'Passed'}</Text>
                    </View>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Exam Status</Text>
                      <Text style={styles.reviewItemValue}>{examStatus}</Text>
                    </View>
                  </View>
                </View>

                {/* Section 3: Academic Credit */}
                <View style={styles.reviewCard}>
                  <View style={styles.reviewCardHeader}>
                    <Text style={styles.reviewCardSectionTitle}>3. Academic Credit</Text>
                    <TouchableOpacity onPress={() => setStep(2)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.reviewGrid}>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Credits</Text>
                      <Text style={[styles.reviewItemValue, { color: '#2563EB', fontWeight: '800' }]}>
                        {creditApplicable ? `${creditsEarned} Credits` : '0 (Non-credit)'}
                      </Text>
                    </View>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Semester</Text>
                      <Text style={styles.reviewItemValue}>{semester}</Text>
                    </View>
                    <View style={styles.reviewItem}>
                      <Text style={styles.reviewItemLabel}>Academic Year</Text>
                      <Text style={styles.reviewItemValue}>{academicYear}</Text>
                    </View>
                  </View>
                </View>

                {/* Section 4: Proofs */}
                <View style={styles.reviewCard}>
                  <View style={styles.reviewCardHeader}>
                    <Text style={styles.reviewCardSectionTitle}>4. Attached Proofs</Text>
                    <TouchableOpacity onPress={() => setStep(3)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  {certificateProof && (
                    <View style={styles.proofReviewRow}>
                      <Ionicons name="document-text" size={16} color="#2563EB" style={{ marginRight: 6 }} />
                      <Text style={styles.proofReviewName} numberOfLines={1}>
                        {certificateProof.name}
                      </Text>
                    </View>
                  )}

                  {assessmentProof && (
                    <View style={styles.proofReviewRow}>
                      <Ionicons name="bar-chart" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
                      <Text style={styles.proofReviewName} numberOfLines={1}>
                        {assessmentProof.name}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  activeOpacity={0.85}
                  onPress={() => handleSubmit(false)}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryActionBtnText}>Submit Course Record</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryActionBtn}
                  activeOpacity={0.8}
                  onPress={() => handleSubmit(true)}
                >
                  <Text style={styles.secondaryActionBtnText}>Save as Draft</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ════════════════════════════════════════════════════
          SUBMISSION SUCCESS MODAL
      ════════════════════════════════════════════════════ */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#16A34A" />
            </View>

            <Text style={styles.successTitle}>Course Record Submitted</Text>
            <Text style={styles.successMessage}>
              Your academic credit record has been submitted successfully for coordinator verification.
            </Text>

            <TouchableOpacity
              style={styles.successPrimaryBtn}
              activeOpacity={0.85}
              onPress={handleSuccessView}
            >
              <Text style={styles.successPrimaryBtnText}>View Record</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.successSecondaryBtn}
              activeOpacity={0.75}
              onPress={handleClose}
            >
              <Text style={styles.successSecondaryBtnText}>Back to Academic Credits</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FAF8F5',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 2,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeHeaderBtn: {
    padding: 4,
    minWidth: 60,
    alignItems: 'flex-end',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepNode: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepCircleCurrent: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  stepCircleDone: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  stepNumTextCurrent: {
    color: '#FFFFFF',
  },
  stepLabelText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepLabelTextActive: {
    color: '#0F172A',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepLineActive: {
    backgroundColor: '#16A34A',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 30,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  typeCardsList: {
    gap: 10,
    marginBottom: 20,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
  },
  typeCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFF',
  },
  typeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIconBoxSelected: {
    backgroundColor: '#EFF6FF',
  },
  typeCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  typeCardTitleSelected: {
    color: '#2563EB',
  },
  typeCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  inputSectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
  },
  textInputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  durationChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  durationChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  durationChipTextActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
  },
  examStatusRow: {
    flexDirection: 'row',
    gap: 6,
    height: 50,
    alignItems: 'center',
  },
  miniChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  miniChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  miniChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  miniChipTextActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  creditToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  toggleBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#2563EB',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  creditOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  creditChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  creditChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  creditChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  creditChipTextActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  proofCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  proofCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  proofCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofCardHint: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#F8FAFF',
  },
  uploadBoxText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  attachedFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 10,
  },
  attachedFileName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#166534',
  },
  attachedFileSize: {
    fontSize: 11,
    color: '#15803D',
  },
  changeLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    paddingHorizontal: 6,
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 8,
    marginBottom: 18,
  },
  checkboxCircle: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxCircleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  declarationText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
    flex: 1,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    paddingBottom: 6,
  },
  reviewCardSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  reviewCourseTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  reviewCourseType: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 10,
  },
  reviewGrid: {
    gap: 6,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewItemLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  reviewItemValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofReviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  proofReviewName: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginTop: 8,
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  successPrimaryBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  successPrimaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successSecondaryBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  successSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
