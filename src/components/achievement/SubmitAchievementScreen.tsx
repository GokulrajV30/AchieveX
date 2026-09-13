// ─────────────────────────────────────────────────────────────
// AchieveX — Submit Achievement Screen (Main Orchestrator)
// Wizard control, validation, points breakdown, and fixed bottom tab bar
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AchievementHeader from './AchievementHeader';
import ProgressStepper, { type StepperIndex } from './ProgressStepper';
import CategorySelector from './CategorySelector';
import AchievementTypeSelector from './AchievementTypeSelector';
import ParticipationSelector, { type ParticipationData } from './ParticipationSelector';
import DynamicFormFields from './DynamicFormFields';
import CashPrizeSection from './CashPrizeSection';
import ProofUploader from './ProofUploader';
import PointPreview from './PointPreview';
import ReviewSummary from './ReviewSummary';
import SubmissionSuccess from './SubmissionSuccess';
import { PrimaryButton } from './FormComponents';
import StudentBottomTab from '../StudentBottomTab';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import {
  getCategoryById,
  getTypeById,
  getFieldsForType,
  getProofRequirements,
  calculateEstimatedPoints,
  LOGGED_IN_STUDENT,
} from '../../data/achievementConfig';
import { createTeamAchievement } from '../../data/teamAchievementData';

interface SubmitAchievementScreenProps {
  onGoBack: () => void;
  onSubmittedSuccess: () => void;
  onOpenLeaderboard?: () => void;
  onOpenProfile?: () => void;
  onOpenGoals?: () => void;
}

type InternalStep =
  | 'category'
  | 'type'
  | 'participation'
  | 'details'
  | 'proof'
  | 'review'
  | 'success';

export default function SubmitAchievementScreen({
  onGoBack,
  onSubmittedSuccess,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenGoals,
}: SubmitAchievementScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [step, setStep] = useState<InternalStep>('category');

  // Form selections accumulator
  const [categoryId, setCategoryId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [customType, setCustomType] = useState('');
  const [participation, setParticipation] = useState<ParticipationData>({
    mode: '',
    teamRole: '',
    teamName: '',
    teamMembers: [],
  });

  const [detailsData, setDetailsData] = useState<Record<string, any>>({
    description: '',
    hasCashPrize: false,
    prizeAmount: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const getStepperIndex = (): StepperIndex => {
    switch (step) {
      case 'category':
      case 'type':
      case 'participation':
        return 0;
      case 'details':
        return 1;
      case 'proof':
        return 2;
      case 'review':
      case 'success':
        return 3;
      default:
        return 0;
    }
  };

  const handleDetailsChange = (fieldId: string, value: any) => {
    setDetailsData((prev) => {
      const updated = { ...prev, [fieldId]: value };
      // If all required fields for this type are completed, auto-scroll to CTA button
      const fields = getFieldsForType(categoryId, typeId);
      const allFilled = fields.every((f) => {
        if (f.showWhen) {
          const parentValue = updated[f.showWhen.fieldId];
          const matchValues = Array.isArray(f.showWhen.value)
            ? f.showWhen.value
            : [f.showWhen.value];
          if (!matchValues.includes(parentValue)) return true;
        }
        if (!f.required) return true;
        const val = updated[f.id];
        return val !== undefined && val !== null && (typeof val === 'string' ? val.trim() !== '' : true);
      });
      if (allFilled) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
      return updated;
    });
    if (errors[fieldId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleFileChange = (reqId: string, file: any) => {
    setUploadedFiles((prev) => ({ ...prev, [reqId]: file }));
    if (errors[reqId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[reqId];
        return copy;
      });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'category') {
      if (!categoryId) {
        Alert.alert('Selection Required', 'Please select an achievement category to continue.');
        return false;
      }
    } else if (step === 'type') {
      if (!typeId) {
        Alert.alert('Selection Required', 'Please select an achievement type to continue.');
        return false;
      }
      if (typeId === 'other' && !customType.trim()) {
        newErrors.customType = 'Please enter achievement type';
      }
    } else if (step === 'participation') {
      if (!participation.mode) {
        Alert.alert('Selection Required', 'Please select how you participated.');
        return false;
      }
      if (participation.mode === 'team') {
        if (!participation.teamRole) {
          Alert.alert('Selection Required', 'Please select your role in the team.');
          return false;
        }
        if (participation.teamRole === 'lead') {
          if (!participation.teamName.trim()) {
            newErrors.teamName = 'Team name is required';
          }
          if (participation.teamMembers.length === 0) {
            Alert.alert('Action Required', 'Please add at least one team member.');
            return false;
          }
        }
      }
    } else if (step === 'details') {
      const fields = getFieldsForType(categoryId, typeId);

      // Validate required dynamic fields (respecting showWhen visibility)
      fields.forEach((f) => {
        // Skip fields hidden by showWhen
        if (f.showWhen) {
          const parentValue = detailsData[f.showWhen.fieldId];
          const matchValues = Array.isArray(f.showWhen.value)
            ? f.showWhen.value
            : [f.showWhen.value];
          if (!matchValues.includes(parentValue)) return;
        }

        if (f.required) {
          const val = detailsData[f.id];
          if (val === undefined || val === null || (typeof val === 'string' && !val.trim())) {
            newErrors[f.id] =
              f.id === 'semester'
                ? 'Please select a semester'
                : `${f.label} is required`;
          }
        }

        // Validate "Other" text fields if value is 'Other'
        const value = detailsData[f.id];
        if (value === 'Other') {
          const customVal = detailsData[`custom_${f.id}`];
          if (!customVal || !customVal.trim()) {
            newErrors[`custom_${f.id}`] = `Please specify custom ${f.label.toLowerCase()}`;
          }
        }
      });

      // Date Range Validation (Start < End) — check multiple date field pairs
      const dateRangePairs = [
        ['startDate', 'endDate'],
        ['eventDate', 'endDate'],
      ];
      for (const [startKey, endKey] of dateRangePairs) {
        if (detailsData[startKey] && detailsData[endKey]) {
          const start = new Date(detailsData[startKey]);
          const end = new Date(detailsData[endKey]);
          if (end < start) {
            newErrors[endKey] = 'End date must be after start date.';
          }
        }
      }

      // Cash Prize validation
      if (detailsData.hasCashPrize) {
        const amt = parseFloat(detailsData.prizeAmount);
        if (isNaN(amt) || amt <= 0) {
          newErrors.prizeAmount = 'Enter a valid cash prize amount';
        }
      }
    } else if (step === 'proof') {
      // Validate dynamic proof documents using new type+status-aware function
      const reqs = getProofRequirements(categoryId, typeId, detailsData);
      reqs.forEach((r) => {
        if (r.required && !uploadedFiles[r.id]) {
          newErrors[r.id] = `Please upload your ${r.label}`;
        }
      });

      if (detailsData.hasCashPrize && !uploadedFiles.cashPrizeProof) {
        newErrors.cashPrizeProof = 'Cash prize proof is required';
      }

      // Check offline geotag for categories that have location-based events
      const isOffline = detailsData.eventMode === 'Offline';
      if (isOffline && !uploadedFiles.geotaggedPhoto) {
        newErrors.geotaggedPhoto = 'Geotagged photo evidence is required';
      }

      // Step 3: Team Leader MUST upload their own individual certificate
      const isTeamLead = participation.mode === 'team' && participation.teamRole === 'lead';
      if (isTeamLead && !uploadedFiles.individualCertificate) {
        newErrors.individualCertificate = 'Please upload your individual certificate';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateStep()) return;

    scrollViewRef.current?.scrollTo({ y: 0, animated: false });

    if (step === 'category') {
      setStep('type');
    } else if (step === 'type') {
      setStep('participation');
    } else if (step === 'participation') {
      setStep('details');
    } else if (step === 'details') {
      setStep('proof');
    } else if (step === 'proof') {
      setStep('review');
    }
  };

  const handleBack = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    if (step === 'category') {
      onGoBack();
    } else if (step === 'type') {
      setStep('category');
    } else if (step === 'participation') {
      setStep('type');
    } else if (step === 'details') {
      setStep('participation');
    } else if (step === 'proof') {
      setStep('details');
    } else if (step === 'review') {
      setStep('proof');
    }
  };

  const handleSaveDraft = () => {
    showAchieveXDialog({
      type: 'success',
      title: 'Draft Saved',
      message: "Continue whenever you're ready.",
      primaryAction: {
        label: 'Done',
        onPress: onGoBack,
      },
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);

    const isTeamLead = participation.mode === 'team' && participation.teamRole === 'lead';

    if (isTeamLead) {
      // Step 2 & 3: Store common proofs once + leader individual certificate
      const commonProofs = Object.keys(uploadedFiles)
        .filter((key) => key !== 'individualCertificate' && uploadedFiles[key])
        .map((key, idx) => ({
          id: `TCP-${Date.now()}-${idx}`,
          label:
            key === 'cashPrizeProof'
              ? 'Cash Prize Official Proof'
              : key === 'geotaggedPhoto'
              ? 'Geotagged Photo'
              : key.replace(/([A-Z])/g, ' $1').trim(),
          fileName: uploadedFiles[key].name || `${key}_document.pdf`,
          fileType: (uploadedFiles[key].type || 'pdf') as 'pdf' | 'image',
          fileSize: uploadedFiles[key].size || '2.0 MB',
          uploadedAt: 'Just now',
        }));

      const leaderCertificate = uploadedFiles.individualCertificate
        ? {
            fileName: uploadedFiles.individualCertificate.name,
            fileType: (uploadedFiles.individualCertificate.type || 'pdf') as 'pdf' | 'image',
            fileSize: uploadedFiles.individualCertificate.size || '1.1 MB',
            uploadedAt: 'Just now',
          }
        : undefined;

      const eventName =
        detailsData.eventName ||
        detailsData.achievementTitle ||
        detailsData.title ||
        customType ||
        getTypeById(categoryId, typeId)?.label ||
        'Smart India Hackathon 2026';

      createTeamAchievement({
        categoryId,
        achievementType: getTypeById(categoryId, typeId)?.label || typeId || 'Hackathon',
        eventName,
        organizer: detailsData.organizer || 'Ministry of Education, Government of India',
        level: detailsData.level || detailsData.sportsLevel || 'National',
        eventDate: detailsData.eventDate || detailsData.startDate || '12 Aug 2026',
        semester: detailsData.semester || 'Semester 5',
        result: detailsData.result || detailsData.resultType || 'Winner',
        teamName: participation.teamName || 'Code Nexus',
        teamLeaderId: LOGGED_IN_STUDENT.rollNumber.toLowerCase(),
        teamLeaderName: LOGGED_IN_STUDENT.name,
        cashPrize: detailsData.hasCashPrize ? `₹${detailsData.prizeAmount}` : undefined,
        commonProofs,
        leaderCertificate,
        members: participation.teamMembers.map((m) => ({
          studentId: m.rollNumber.toLowerCase(),
          studentName: m.name,
          rollNumber: m.rollNumber,
          department: m.department || 'CSE (IoT)',
          year: m.year || '3rd Year',
        })),
      });
    }

    setTimeout(() => {
      setSubmitting(false);
      setStep('success');
    }, 1200);
  };

  const getReviewData = () => {
    return {
      categoryId,
      typeId: typeId === 'other' ? customType : typeId,
      participationMode: participation.mode,
      teamRole: participation.teamRole,
      teamName: participation.teamName,
      teamMembers: participation.teamMembers,
      ...detailsData,
      uploadedFiles,
    };
  };

  const getEstimatedPointsVal = (): number => {
    const selectedType = getTypeById(categoryId, typeId);
    if (!selectedType) return 0;

    const breakdown = calculateEstimatedPoints({
      basePoints: selectedType.scoring?.basePoints ?? 0,
      level: detailsData.level || detailsData.sportsLevel,
      result: detailsData.result || detailsData.resultType,
      cashPrize: parseFloat(detailsData.prizeAmount) || 0,
      isTeamLead: participation.mode === 'team' && participation.teamRole === 'lead',
    });
    return breakdown.total;
  };

  // Resolve the best title for success screen
  const getSuccessTitle = (): string => {
    // Try achievementTitle (custom or selected)
    const at = detailsData.achievementTitle;
    if (at && at !== 'Other') return at;
    if (at === 'Other' && detailsData.custom_achievementTitle) return detailsData.custom_achievementTitle;
    // Fallback to other title fields
    return detailsData.researchTitle || detailsData.patentTitle || detailsData.copyrightTitle
      || detailsData.otherTitle || customType || getTypeById(categoryId, typeId)?.label || 'New Achievement';
  };

  const activeType = getTypeById(categoryId, typeId);

  // Determine if this is an offline event (for geotag proof)
  const isOffline = detailsData.eventMode === 'Offline';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5F0" />
      <AchievementHeader
        onBack={handleBack}
        onSaveDraft={handleSaveDraft}
        showSaveDraft={step !== 'success'}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step !== 'success' && <ProgressStepper activeStep={getStepperIndex()} />}

          <View style={styles.contentCard}>
            {step === 'category' && (
              <CategorySelector
                selectedCategoryId={categoryId}
                onSelectCategory={(id) => {
                  setCategoryId(id);
                  setTypeId('');
                  setDetailsData({ description: '', hasCashPrize: false, prizeAmount: '' });
                  setUploadedFiles({});
                  // Auto-scroll directly down to Continue option so user doesn't have to scroll down
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 120);
                }}
              />
            )}

            {step === 'type' && (
              <AchievementTypeSelector
                categoryId={categoryId}
                selectedTypeId={typeId}
                onSelectType={(id) => {
                  setTypeId(id);
                  // Reset details when type changes to avoid stale data
                  setDetailsData({ description: '', hasCashPrize: false, prizeAmount: '' });
                  // Auto-scroll directly down to Continue option
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 120);
                }}
                customTypeValue={customType}
                onCustomTypeChange={setCustomType}
                error={errors.customType}
              />
            )}

            {step === 'participation' && (
              <ParticipationSelector
                data={participation}
                onChange={(p) => {
                  setParticipation(p);
                  if (p.mode === 'individual' || (p.mode === 'team' && p.teamRole === 'member')) {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 120);
                  }
                }}
              />
            )}

            {step === 'details' && (
              <View>
                <DynamicFormFields
                  categoryId={categoryId}
                  typeId={typeId}
                  formData={detailsData}
                  errors={errors}
                  onFieldChange={handleDetailsChange}
                />
                <CashPrizeSection
                  hasCashPrize={detailsData.hasCashPrize}
                  prizeAmount={detailsData.prizeAmount}
                  errors={errors}
                  onHasPrizeChange={(val) => handleDetailsChange('hasCashPrize', val)}
                  onAmountChange={(val) => handleDetailsChange('prizeAmount', val)}
                />
                {activeType && (
                  <PointPreview
                    categoryId={categoryId}
                    typeId={typeId}
                    basePoints={activeType.scoring?.basePoints ?? 0}
                    level={detailsData.level || detailsData.sportsLevel}
                    result={detailsData.result || detailsData.resultType}
                    cashPrizeAmount={detailsData.prizeAmount}
                    isTeamLead={participation.mode === 'team' && participation.teamRole === 'lead'}
                  />
                )}
              </View>
            )}

            {step === 'proof' && (
              <View>
                <ProofUploader
                  categoryId={categoryId}
                  typeId={typeId}
                  formData={detailsData}
                  hasCashPrize={detailsData.hasCashPrize}
                  isOffline={isOffline}
                  uploadedFiles={uploadedFiles}
                  errors={errors}
                  onFileChange={handleFileChange}
                  isTeamLead={participation.mode === 'team' && participation.teamRole === 'lead'}
                />

                {activeType && (
                  <PointPreview
                    categoryId={categoryId}
                    typeId={typeId}
                    basePoints={activeType.scoring?.basePoints ?? 0}
                    level={detailsData.level || detailsData.sportsLevel}
                    result={detailsData.result || detailsData.resultType}
                    cashPrizeAmount={detailsData.prizeAmount}
                    isTeamLead={participation.mode === 'team' && participation.teamRole === 'lead'}
                  />
                )}
              </View>
            )}

            {step === 'review' && (
              <ReviewSummary
                formData={getReviewData()}
                onEditSection={(stepIdx) => {
                  if (stepIdx === 0) setStep('category');
                  if (stepIdx === 1) setStep('details');
                  if (stepIdx === 2) setStep('proof');
                }}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                submitting={submitting}
              />
            )}

            {step === 'success' && (
              <SubmissionSuccess
                title={getSuccessTitle()}
                estimatedPoints={getEstimatedPointsVal()}
                onViewAchievement={() => {
                  onSubmittedSuccess();
                }}
                onBackToDashboard={onSubmittedSuccess}
              />
            )}
          </View>

          {['category', 'type', 'participation', 'details', 'proof'].includes(step) && (
            <View style={styles.footerActions}>
              <PrimaryButton
                title={step === 'proof' ? 'Go to Review' : 'Continue'}
                onPress={handleContinue}
                variant="primary"
                icon="arrow-forward"
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Unified Student Bottom Navigation Tab Bar ── */}
      <StudentBottomTab
        activeTab="achievements"
        onNavigate={(tab) => {
          if (tab === 'home') onGoBack();
          else if (tab === 'achievements') {
            /* already on submit achievement */
          } else if (tab === 'goals') {
            if (onOpenGoals) onOpenGoals();
          } else if (tab === 'leaderboard') {
            if (onOpenLeaderboard) onOpenLeaderboard();
          } else if (tab === 'profile') {
            if (onOpenProfile) onOpenProfile();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Margin to allow fixed tab bar visibility
  },
  contentCard: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  footerActions: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  /* Fixed Bottom Tab Bar matching DashboardScreen exactly */
  bottomTabBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: '#F8F5F0',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  bottomTabBar: {
    width: 337,
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
});
