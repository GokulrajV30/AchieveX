// ─────────────────────────────────────────────────────────────
// AchieveX — Create Goal Wizard Bottom Sheet (4 Steps)
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  CATEGORY_GOAL_CONFIGS,
  GOAL_PURPOSES,
  type Goal,
  type GoalPriority,
  type Milestone,
} from '../../data/goalsData';

interface CreateGoalSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreateGoal: (newGoal: Goal) => void;
  onViewCreatedGoal: (goalId: string) => void;
}

export default function CreateGoalSheet({
  visible,
  onClose,
  onCreateGoal,
  onViewCreatedGoal,
}: CreateGoalSheetProps) {
  // Wizard Step (1 | 2 | 3 | 4)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedGoalTypeId, setSelectedGoalTypeId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedTargetOutcome, setSelectedTargetOutcome] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-15');
  const [priority, setPriority] = useState<GoalPriority>('High');
  const [purpose, setPurpose] = useState('Skill Development');
  const [motivationNote, setMotivationNote] = useState('');
  const [milestones, setMilestones] = useState<{ id: string; label: string }[]>([
    { id: 'm1', label: 'Complete initial preparation and research' },
    { id: 'm2', label: 'Execute project tasks & milestones' },
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Success Sheet state
  const [createdGoalId, setCreatedGoalId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const activeCategoryConfig = CATEGORY_GOAL_CONFIGS.find(
    (c) => c.categoryId === selectedCategoryId
  );

  const activeGoalTypeConfig = activeCategoryConfig?.goalTypes.find(
    (t) => t.id === selectedGoalTypeId
  );

  const handleResetForm = () => {
    setStep(1);
    setSelectedCategoryId('');
    setSelectedGoalTypeId('');
    setCustomTitle('');
    setSelectedTargetOutcome('');
    setTargetDate('2026-12-15');
    setPriority('High');
    setPurpose('Skill Development');
    setMotivationNote('');
    setMilestones([
      { id: 'm1', label: 'Complete initial preparation and research' },
      { id: 'm2', label: 'Execute project tasks & milestones' },
    ]);
    setNewMilestoneText('');
    setCreatedGoalId(null);
    setShowSuccessModal(false);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: `m_${Date.now()}`, label: newMilestoneText.trim() },
    ]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFinalSubmit = () => {
    const goalTitle =
      customTitle.trim() ||
      activeGoalTypeConfig?.title ||
      'New Achievement Goal';

    const goalMilestones: Milestone[] = milestones.map((m) => ({
      id: m.id,
      label: m.label,
      completed: false,
    }));

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      categoryId: selectedCategoryId,
      categoryTitle: activeCategoryConfig?.categoryTitle || 'General',
      goalTypeId: selectedGoalTypeId,
      goalTypeTitle: activeGoalTypeConfig?.title || 'Goal',
      title: goalTitle,
      targetOutcome: selectedTargetOutcome || 'Completed',
      targetDate: targetDate || '2026-12-31',
      priority,
      purpose,
      motivationNote,
      academicYear: '2026–27',
      progress: 0,
      status: 'Active',
      milestones: goalMilestones,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateGoal(newGoal);
    setCreatedGoalId(newGoal.id);
    setShowSuccessModal(true);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        handleResetForm();
        onClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            handleResetForm();
            onClose();
          }}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabber} />

          {/* Wizard Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.sheetTitle}>Create Goal</Text>
              <Text style={styles.stepSubtitle}>
                Step {step} of 4 —{' '}
                {step === 1
                  ? 'Choose Goal'
                  : step === 2
                  ? 'Define Success'
                  : step === 3
                  ? 'Plan Goal'
                  : 'Review'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                handleResetForm();
                onClose();
              }}
              activeOpacity={0.7}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Stepper Progress Indicator */}
          <View style={styles.stepperDotsRow}>
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <View
                  style={[
                    styles.stepDot,
                    s === step
                      ? styles.stepDotActive
                      : s < step
                      ? styles.stepDotCompleted
                      : styles.stepDotPending,
                  ]}
                >
                  {s < step ? (
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepDotNum,
                        s === step && styles.stepDotNumActive,
                      ]}
                    >
                      {s}
                    </Text>
                  )}
                </View>
                {s < 4 && (
                  <View
                    style={[
                      styles.stepConnector,
                      s < step && styles.stepConnectorCompleted,
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Scrollable Content for Current Step */}
          <ScrollView style={styles.stepScroll} showsVerticalScrollIndicator={false}>
            {/* ════════════════════════════════════════════════════════
                STEP 1: CHOOSE YOUR GOAL
            ════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <View>
                <Text style={styles.stepSectionTitle}>Choose Your Goal</Text>
                <Text style={styles.stepSectionDesc}>
                  What achievement area would you like to target?
                </Text>

                {/* Categories */}
                <View style={styles.categoryList}>
                  {CATEGORY_GOAL_CONFIGS.map((cat) => {
                    const isSelected = selectedCategoryId === cat.categoryId;
                    return (
                      <TouchableOpacity
                        key={cat.categoryId}
                        style={[
                          styles.categoryCard,
                          isSelected && styles.categoryCardSelected,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => {
                          setSelectedCategoryId(cat.categoryId);
                          setSelectedGoalTypeId('');
                          setSelectedTargetOutcome('');
                        }}
                      >
                        <View
                          style={[
                            styles.categoryIconCircle,
                            isSelected && styles.categoryIconCircleSelected,
                          ]}
                        >
                          <Ionicons
                            name={cat.iconName as any}
                            size={18}
                            color={isSelected ? '#2563EB' : '#64748B'}
                          />
                        </View>
                        <Text
                          style={[
                            styles.categoryCardText,
                            isSelected && styles.categoryCardTextSelected,
                          ]}
                        >
                          {cat.categoryTitle}
                        </Text>
                        <Ionicons
                          name={
                            isSelected
                              ? 'checkmark-circle'
                              : 'chevron-forward'
                          }
                          size={18}
                          color={isSelected ? '#2563EB' : '#CBD5E1'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Sub-goal types if category chosen */}
                {activeCategoryConfig && (
                  <View style={styles.goalTypeSection}>
                    <Text style={styles.goalTypeHeading}>
                      Select Goal Type for {activeCategoryConfig.categoryTitle}
                    </Text>
                    <View style={styles.goalTypeList}>
                      {activeCategoryConfig.goalTypes.map((t) => {
                        const isTypeSelected = selectedGoalTypeId === t.id;
                        return (
                          <TouchableOpacity
                            key={t.id}
                            style={[
                              styles.goalTypeRow,
                              isTypeSelected && styles.goalTypeRowSelected,
                            ]}
                            activeOpacity={0.75}
                            onPress={() => {
                              setSelectedGoalTypeId(t.id);
                              setSelectedTargetOutcome(t.targetOutcomes[0] || '');
                            }}
                          >
                            <View
                              style={[
                                styles.radioCircle,
                                isTypeSelected && styles.radioCircleSelected,
                              ]}
                            >
                              {isTypeSelected && <View style={styles.radioInner} />}
                            </View>
                            <Text
                              style={[
                                styles.goalTypeText,
                                isTypeSelected && styles.goalTypeTextSelected,
                              ]}
                            >
                              {t.title}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* ════════════════════════════════════════════════════════
                STEP 2: DEFINE SUCCESS
            ════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <View>
                <Text style={styles.stepSectionTitle}>Define Success</Text>
                <Text style={styles.stepSectionDesc}>
                  Choose the target outcome that completes this goal.
                </Text>

                {/* Optional Custom Title Input */}
                <Text style={styles.inputLabel}>Custom Goal Title (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={`e.g. ${activeGoalTypeConfig?.title || 'Publish Research Paper'}`}
                  placeholderTextColor="#94A3B8"
                  value={customTitle}
                  onChangeText={setCustomTitle}
                />

                {/* Dynamic Target Outcomes */}
                <Text style={[styles.inputLabel, { marginTop: 14 }]}>
                  Target Outcome
                </Text>
                <View style={styles.outcomesList}>
                  {activeGoalTypeConfig?.targetOutcomes.map((outcome) => {
                    const isSelected = selectedTargetOutcome === outcome;
                    return (
                      <TouchableOpacity
                        key={outcome}
                        style={[
                          styles.outcomeCard,
                          isSelected && styles.outcomeCardSelected,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => setSelectedTargetOutcome(outcome)}
                      >
                        <View style={styles.outcomeLeft}>
                          <View
                            style={[
                              styles.radioCircle,
                              isSelected && styles.radioCircleSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <Text
                            style={[
                              styles.outcomeText,
                              isSelected && styles.outcomeTextSelected,
                            ]}
                          >
                            {outcome}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.targetBadge}>
                            <Text style={styles.targetBadgeText}>Target</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ════════════════════════════════════════════════════════
                STEP 3: PLAN YOUR GOAL & MILESTONES
            ════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <View>
                <Text style={styles.stepSectionTitle}>Plan Your Goal</Text>
                <Text style={styles.stepSectionDesc}>
                  Set a target deadline and break it down into steps.
                </Text>

                {/* Target Date Input */}
                <Text style={styles.inputLabel}>Target Deadline (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="2026-12-15"
                  placeholderTextColor="#94A3B8"
                  value={targetDate}
                  onChangeText={setTargetDate}
                />

                {/* Priority Selector */}
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Priority</Text>
                <View style={styles.priorityRow}>
                  {(['Low', 'Medium', 'High'] as GoalPriority[]).map((pri) => {
                    const isSelected = priority === pri;
                    return (
                      <TouchableOpacity
                        key={pri}
                        style={[
                          styles.priorityOption,
                          isSelected && styles.priorityOptionActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setPriority(pri)}
                      >
                        <Text
                          style={[
                            styles.priorityOptionText,
                            isSelected && styles.priorityOptionTextActive,
                          ]}
                        >
                          {pri}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Goal Purpose */}
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Purpose</Text>
                <View style={styles.chipWrap}>
                  {GOAL_PURPOSES.map((purp) => {
                    const isSelected = purpose === purp;
                    return (
                      <TouchableOpacity
                        key={purp}
                        style={[styles.purposeChip, isSelected && styles.purposeChipActive]}
                        activeOpacity={0.75}
                        onPress={() => setPurpose(purp)}
                      >
                        <Text
                          style={[
                            styles.purposeChipText,
                            isSelected && styles.purposeChipTextActive,
                          ]}
                        >
                          {purp}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Motivation Note (Optional) */}
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                  Why is this goal important? (Optional)
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Add a short note to keep yourself motivated..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={2}
                  value={motivationNote}
                  onChangeText={setMotivationNote}
                />

                {/* Milestones Section */}
                <View style={styles.milestonesSection}>
                  <Text style={styles.milestonesHeading}>Milestones</Text>
                  <Text style={styles.milestonesSubheading}>
                    Break your goal into actionable steps (Optional)
                  </Text>

                  {/* Added Milestones */}
                  <View style={styles.milestoneList}>
                    {milestones.map((m, idx) => (
                      <View key={m.id} style={styles.milestoneItemRow}>
                        <View style={styles.milestoneIndexBadge}>
                          <Text style={styles.milestoneIndexText}>{idx + 1}</Text>
                        </View>
                        <Text style={styles.milestoneLabelText}>{m.label}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveMilestone(m.id)}
                          activeOpacity={0.7}
                          style={styles.trashBtn}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Add New Milestone Input */}
                  <View style={styles.addMilestoneBox}>
                    <TextInput
                      style={styles.addMilestoneInput}
                      placeholder="Add milestone step..."
                      placeholderTextColor="#94A3B8"
                      value={newMilestoneText}
                      onChangeText={setNewMilestoneText}
                    />
                    <TouchableOpacity
                      style={styles.addMilestoneBtn}
                      activeOpacity={0.8}
                      onPress={handleAddMilestone}
                    >
                      <Ionicons name="add" size={18} color="#FFFFFF" />
                      <Text style={styles.addMilestoneBtnText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* ════════════════════════════════════════════════════════
                STEP 4: REVIEW GOAL
            ════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <View>
                <Text style={styles.stepSectionTitle}>Review Goal</Text>
                <Text style={styles.stepSectionDesc}>
                  Verify your goal details before saving.
                </Text>

                {/* Compact 2-Column Summary Card */}
                <View style={styles.reviewSummaryCard}>
                  <Text style={styles.reviewGoalTitle}>
                    {customTitle.trim() || activeGoalTypeConfig?.title}
                  </Text>
                  <Text style={styles.reviewCategoryText}>
                    {activeCategoryConfig?.categoryTitle}
                  </Text>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewGrid}>
                    <View style={styles.reviewCol}>
                      <Text style={styles.reviewLabel}>TARGET OUTCOME</Text>
                      <Text style={styles.reviewVal}>{selectedTargetOutcome}</Text>
                    </View>
                    <View style={styles.reviewCol}>
                      <Text style={styles.reviewLabel}>TARGET DEADLINE</Text>
                      <Text style={styles.reviewVal}>{targetDate}</Text>
                    </View>
                    <View style={styles.reviewCol}>
                      <Text style={styles.reviewLabel}>PRIORITY</Text>
                      <Text style={styles.reviewVal}>{priority}</Text>
                    </View>
                    <View style={styles.reviewCol}>
                      <Text style={styles.reviewLabel}>PURPOSE</Text>
                      <Text style={styles.reviewVal}>{purpose}</Text>
                    </View>
                  </View>

                  {/* Milestones count */}
                  <View style={styles.reviewMilestonesRow}>
                    <Ionicons name="list" size={15} color="#2563EB" />
                    <Text style={styles.reviewMilestonesText}>
                      {milestones.length} Milestone step{milestones.length !== 1 ? 's' : ''} planned
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Sticky Bottom Actions */}
          <View style={styles.bottomActions}>
            {step > 1 ? (
              <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.75}
                onPress={() => setStep((prev) => (prev - 1) as any)}
              >
                <Ionicons name="arrow-back" size={16} color="#475569" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.75}
                onPress={() => {
                  handleResetForm();
                  onClose();
                }}
              >
                <Text style={styles.backBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}

            {step < 4 ? (
              <TouchableOpacity
                style={[
                  styles.continueBtn,
                  step === 1 && (!selectedCategoryId || !selectedGoalTypeId) && styles.btnDisabled,
                  step === 2 && !selectedTargetOutcome && styles.btnDisabled,
                ]}
                activeOpacity={0.85}
                disabled={
                  (step === 1 && (!selectedCategoryId || !selectedGoalTypeId)) ||
                  (step === 2 && !selectedTargetOutcome)
                }
                onPress={() => setStep((prev) => (prev + 1) as any)}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.85}
                onPress={handleFinalSubmit}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.continueBtnText}>Create Goal</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ════════════════════════════════════════════════════════
          SUCCESS MODAL
      ════════════════════════════════════════════════════════ */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#059669" />
            </View>

            <Text style={styles.successTitle}>Goal Created</Text>
            <Text style={styles.successDesc}>
              Your achievement goal is set. Start making progress toward your first milestone.
            </Text>

            <View style={styles.successButtonsRow}>
              <TouchableOpacity
                style={styles.successDoneBtn}
                activeOpacity={0.8}
                onPress={() => {
                  handleResetForm();
                  onClose();
                }}
              >
                <Text style={styles.successDoneBtnText}>Done</Text>
              </TouchableOpacity>

              {createdGoalId && (
                <TouchableOpacity
                  style={styles.successViewBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    const gid = createdGoalId;
                    handleResetForm();
                    onClose();
                    onViewCreatedGoal(gid);
                  }}
                >
                  <Text style={styles.successViewBtnText}>View Goal</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    height: '88%',
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
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  stepperDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#2563EB',
  },
  stepDotCompleted: {
    backgroundColor: '#16A34A',
  },
  stepDotPending: {
    backgroundColor: '#F1F5F9',
  },
  stepDotNum: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepDotNumActive: {
    color: '#FFFFFF',
  },
  stepConnector: {
    width: 32,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  stepConnectorCompleted: {
    backgroundColor: '#16A34A',
  },
  stepScroll: {
    flex: 1,
    marginVertical: 6,
  },
  stepSectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepSectionDesc: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },

  // Categories
  categoryList: {
    gap: 8,
    marginBottom: 14,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  categoryCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  categoryIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryIconCircleSelected: {
    backgroundColor: '#DBEAFE',
  },
  categoryCardText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  categoryCardTextSelected: {
    color: '#2563EB',
  },

  // Goal Types
  goalTypeSection: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  goalTypeHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  goalTypeList: {
    gap: 6,
  },
  goalTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  goalTypeRowSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#2563EB',
  },
  goalTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  goalTypeTextSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },

  // Form Inputs
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  outcomesList: {
    gap: 6,
  },
  outcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  outcomeCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  outcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outcomeText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  outcomeTextSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },
  targetBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  targetBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Step 3 Priority & Purpose
  priorityRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  priorityOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priorityOptionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  priorityOptionTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  purposeChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  purposeChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  purposeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  purposeChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  // Milestones
  milestonesSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  milestonesHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  milestonesSubheading: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 10,
  },
  milestoneList: {
    gap: 6,
    marginBottom: 8,
  },
  milestoneItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  milestoneIndexBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  milestoneIndexText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  milestoneLabelText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  trashBtn: {
    padding: 4,
  },
  addMilestoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  addMilestoneInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#0F172A',
  },
  addMilestoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addMilestoneBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 2,
  },

  // Step 4 Review
  reviewSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  reviewGoalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  reviewCategoryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  reviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  reviewCol: {
    width: '50%',
  },
  reviewLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  reviewVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewMilestonesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  reviewMilestonesText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 6,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  backBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnDisabled: {
    backgroundColor: '#93C5FD',
    elevation: 0,
    shadowOpacity: 0,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Success Modal
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  successDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 18,
  },
  successButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  successDoneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  successDoneBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  successViewBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  successViewBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
