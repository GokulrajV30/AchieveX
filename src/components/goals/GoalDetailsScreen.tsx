// ─────────────────────────────────────────────────────────────
// AchieveX — Goal Details Screen Component
// Interactive Milestone Checklist & Dynamic Proof Workflow
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  type Goal,
  type Milestone,
  type MilestoneProof,
  getDeadlineInfo,
} from '../../data/goalsData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import {
  getMilestoneProofRequirement,
  type MilestoneProofRequirement,
  DEFAULT_REQUIRED_PROOF,
} from '../../data/milestoneProofConfig';

import MilestoneItemRow from './MilestoneItemRow';
import MarkMilestoneCompleteSheet from './MarkMilestoneCompleteSheet';
import MilestoneProofPreviewModal from './MilestoneProofPreviewModal';
import StudentBottomTab from '../StudentBottomTab';
import { useBottomNavInset } from '../../hooks/useBottomNavInset';

interface GoalDetailsScreenProps {
  goal: Goal;
  onBack: () => void;
  onCompleteMilestone: (goalId: string, milestoneId: string, proof?: MilestoneProof) => void;
  onUpdateStatus: (goalId: string, status: 'Active' | 'Completed' | 'Paused') => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenHome?: () => void;
  onOpenAchievements?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenProfile?: () => void;
}

export default function GoalDetailsScreen({
  goal,
  onBack,
  onCompleteMilestone,
  onUpdateStatus,
  onDeleteGoal,
  onOpenHome,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenProfile,
}: GoalDetailsScreenProps) {
  const { contentBottomPadding } = useBottomNavInset();
  const [menuVisible, setMenuVisible] = useState(false);

  // ── Milestone Proof Modals State ──
  const [selectedMilestoneForProof, setSelectedMilestoneForProof] = useState<Milestone | null>(null);
  const [currentProofRequirement, setCurrentProofRequirement] = useState<MilestoneProofRequirement>(DEFAULT_REQUIRED_PROOF);
  const [previewMilestoneProof, setPreviewMilestoneProof] = useState<Milestone | null>(null);

  const isCompleted = goal.status === 'Completed';
  const isPaused = goal.status === 'Paused';

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;

  const deadlineInfo = getDeadlineInfo(
    goal.targetDate,
    isCompleted,
    goal.completedAt
  );

  const handleDelete = () => {
    setMenuVisible(false);
    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Delete Goal?',
      message: "This can't be undone.",
      secondaryAction: {
        label: 'Cancel',
      },
      primaryAction: {
        label: 'Delete',
        destructive: true,
        onPress: () => {
          onDeleteGoal(goal.id);
          onBack();
        },
      },
    });
  };

  const handleTogglePause = () => {
    setMenuVisible(false);
    if (isPaused) {
      onUpdateStatus(goal.id, 'Active');
    } else {
      onUpdateStatus(goal.id, 'Paused');
    }
  };

  const handleMarkComplete = () => {
    setMenuVisible(false);
    onUpdateStatus(goal.id, 'Completed');
  };

  // ── Initiate Milestone Completion Flow ──
  const handleInitiateMilestoneComplete = (milestone: Milestone) => {
    const requirement = getMilestoneProofRequirement(
      goal.categoryId,
      goal.goalTypeId,
      milestone.label
    );
    setCurrentProofRequirement(requirement);
    setSelectedMilestoneForProof(milestone);
  };

  const handleFinishMilestoneComplete = (milestoneId: string, proof?: MilestoneProof) => {
    onCompleteMilestone(goal.id, milestoneId, proof);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5F0" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
          <Text style={styles.backText}>Goals</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Goal Details</Text>

        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ════════════════════════════════════════════════════════
            1. HERO CARD
        ════════════════════════════════════════════════════════ */}
        <View style={styles.heroCard}>
          <View style={styles.heroMetaRow}>
            <Text style={styles.categoryTag} numberOfLines={1}>
              {goal.categoryTitle.toUpperCase()}
            </Text>

            {isPaused ? (
              <View style={[styles.priorityBadge, styles.pausedBadge]}>
                <Text style={styles.pausedBadgeText}>PAUSED</Text>
              </View>
            ) : isCompleted ? (
              <View style={[styles.priorityBadge, styles.completedBadge]}>
                <Ionicons name="checkmark-circle" size={12} color="#059669" style={{ marginRight: 2 }} />
                <Text style={styles.completedBadgeText}>COMPLETED</Text>
              </View>
            ) : (
              <View
                style={[
                  styles.priorityBadge,
                  goal.priority === 'High' && styles.priorityHigh,
                  goal.priority === 'Medium' && styles.priorityMedium,
                  goal.priority === 'Low' && styles.priorityLow,
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    goal.priority === 'High' && styles.priorityTextHigh,
                    goal.priority === 'Medium' && styles.priorityTextMedium,
                    goal.priority === 'Low' && styles.priorityTextLow,
                  ]}
                >
                  {goal.priority.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.goalTitle}>{goal.title}</Text>

          {goal.description ? (
            <Text style={styles.goalDescription}>{goal.description}</Text>
          ) : null}

          {/* Progress Bar & Percentage */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${goal.progress}%` },
                  isCompleted && styles.progressBarCompleted,
                  isPaused && styles.progressBarPaused,
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressPercentText,
                isCompleted && styles.progressPercentCompleted,
                isPaused && styles.progressPercentPaused,
              ]}
            >
              {goal.progress}%
            </Text>
          </View>

          {/* Milestone Counters & Target Deadline */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>
                {completedMilestones} of {totalMilestones}
              </Text>
              <Text style={styles.heroStatLabel}>Milestones Done</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{goal.targetOutcome}</Text>
              <Text style={styles.heroStatLabel}>Target Outcome</Text>
            </View>
          </View>

          {/* Deadline state pill */}
          <View style={styles.deadlineMetaRow}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle-outline' : 'time-outline'}
              size={14}
              color={isCompleted ? '#059669' : '#64748B'}
            />
            <Text
              style={[
                styles.deadlineMetaText,
                isCompleted && styles.deadlineMetaCompleted,
              ]}
            >
              {deadlineInfo.text}
            </Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════
            2. INTERACTIVE MILESTONES CHECKLIST
        ════════════════════════════════════════════════════════ */}
        {totalMilestones > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="list" size={16} color="#2563EB" />
              </View>
              <Text style={styles.sectionTitle}>Milestones Checklist</Text>
            </View>
            <Text style={styles.sectionHelperText}>
              Tap "Mark Complete" to provide required milestone evidence and advance your goal progress.
            </Text>

            <View style={styles.milestonesList}>
              {goal.milestones.map((m) => (
                <MilestoneItemRow
                  key={m.id}
                  milestone={m}
                  onMarkComplete={() => handleInitiateMilestoneComplete(m)}
                  onViewProof={() => setPreviewMilestoneProof(m)}
                />
              ))}
            </View>
          </View>
        )}

        {/* ════════════════════════════════════════════════════════
            3. GOAL INFORMATION DETAILS
        ════════════════════════════════════════════════════════ */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="information-circle-outline" size={17} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>Goal Information</Text>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Target Outcome</Text>
              <Text style={styles.infoValue}>{goal.targetOutcome}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Target Deadline</Text>
              <Text style={styles.infoValue}>{goal.targetDate}</Text>
            </View>
            {goal.purpose && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Purpose</Text>
                <Text style={styles.infoValue}>{goal.purpose}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Academic Batch</Text>
              <Text style={styles.infoValue}>{goal.academicYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created Date</Text>
              <Text style={styles.infoValue}>{goal.createdAt}</Text>
            </View>
          </View>

          {/* Motivation Note */}
          {goal.motivationNote ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>MOTIVATION NOTE</Text>
              <Text style={styles.noteText}>{goal.motivationNote}</Text>
            </View>
          ) : null}
        </View>

        {/* ════════════════════════════════════════════════════════
            4. STATUS ACTION BUTTONS
        ════════════════════════════════════════════════════════ */}
        <View style={styles.actionContainer}>
          {isCompleted ? (
            <View style={styles.completedBanner}>
              <Ionicons name="trophy" size={20} color="#059669" style={{ marginRight: 8 }} />
              <Text style={styles.completedBannerText}>
                Goal completed! Ready to submit official achievement for verification & points.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.completeGoalBtn}
              activeOpacity={0.85}
              onPress={handleMarkComplete}
            >
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.completeGoalBtnText}>Mark Goal as Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* ════════════════════════════════════════════════════════
          5. MILESTONE PROOF MODALS
      ════════════════════════════════════════════════════════ */}
      <MarkMilestoneCompleteSheet
        visible={!!selectedMilestoneForProof}
        milestone={selectedMilestoneForProof}
        proofRequirement={currentProofRequirement}
        onClose={() => setSelectedMilestoneForProof(null)}
        onComplete={handleFinishMilestoneComplete}
      />

      <MilestoneProofPreviewModal
        visible={!!previewMilestoneProof}
        milestone={previewMilestoneProof}
        onClose={() => setPreviewMilestoneProof(null)}
      />

      {/* Context Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuSheet}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={handleTogglePause}
            >
              <Ionicons
                name={isPaused ? 'play-outline' : 'pause-outline'}
                size={18}
                color="#1F2937"
              />
              <Text style={styles.menuItemText}>
                {isPaused ? 'Resume Goal' : 'Pause Goal'}
              </Text>
            </TouchableOpacity>

            {!isCompleted && (
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={handleMarkComplete}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#059669" />
                <Text style={[styles.menuItemText, { color: '#059669' }]}>
                  Mark Completed
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>
                Delete Goal
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Unified Student Bottom Navigation Tab Bar ── */}
      <StudentBottomTab
        activeTab="goals"
        onNavigate={(tab) => {
          if (tab === 'home') {
            if (onOpenHome) onOpenHome();
            else onBack();
          } else if (tab === 'achievements') {
            if (onOpenAchievements) onOpenAchievements();
          } else if (tab === 'goals') {
            /* already on goals */
            onBack();
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#F8F5F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  menuBtn: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.4,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
  },
  priorityLow: {
    backgroundColor: '#EFF6FF',
  },
  pausedBadge: {
    backgroundColor: '#F3F4F6',
  },
  completedBadge: {
    backgroundColor: '#DEF7EC',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  priorityTextHigh: {
    color: '#DC2626',
  },
  priorityTextMedium: {
    color: '#D97706',
  },
  priorityTextLow: {
    color: '#2563EB',
  },
  pausedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 6,
  },
  goalDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressBarCompleted: {
    backgroundColor: '#059669',
  },
  progressBarPaused: {
    backgroundColor: '#9CA3AF',
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    width: 40,
    textAlign: 'right',
  },
  progressPercentCompleted: {
    color: '#059669',
  },
  progressPercentPaused: {
    color: '#9CA3AF',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#111827',
  },
  heroStatLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  deadlineMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  deadlineMetaText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  deadlineMetaCompleted: {
    color: '#059669',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sectionHelperText: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  milestonesList: {
    marginTop: 4,
  },
  infoList: {
    gap: 8,
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    maxWidth: '55%',
    textAlign: 'right',
  },
  noteBox: {
    marginTop: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 10,
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
  actionContainer: {
    marginTop: 4,
    marginBottom: 10,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  completedBannerText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#03543F',
    lineHeight: 17,
  },
  completeGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  completeGoalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 6,
    width: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF8F5',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
    fontWeight: '500',
  },
});
