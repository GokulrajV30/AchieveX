// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Student Goal Details Screen (Full Screen)
// Read-only monitoring of an assigned student's goal progress, milestones, and evidence.
// Clean SaaS layout with zero modification/verification controls.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  type StudentGoalProgress,
  type AssignedStudent,
  PROCTOR_ASSIGNED_STUDENTS,
} from '../../../data/facultyWorkspaceData';

interface ProctorStudentGoalDetailsProps {
  goal: StudentGoalProgress;
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onSelectStudent?: (student: AssignedStudent) => void;
  onViewAchievements?: (student: AssignedStudent) => void;
}

export default function ProctorStudentGoalDetails({
  goal,
  onGoBack,
  onNavigate,
  onSelectStudent,
  onViewAchievements,
}: ProctorStudentGoalDetailsProps) {
  const [proofModalVisible, setProofModalVisible] = useState(false);

  // Match the assigned student from the dataset
  const student =
    PROCTOR_ASSIGNED_STUDENTS.find((s) => s.id === goal.studentId || s.registerNumber === goal.rollNo) ||
    PROCTOR_ASSIGNED_STUDENTS[0];

  const handleOpenStudentDetails = () => {
    if (onSelectStudent) {
      onSelectStudent(student);
    } else {
      onNavigate('proctorStudentDetails');
    }
  };

  const handleOpenStudentAchievements = () => {
    if (onViewAchievements) {
      onViewAchievements(student);
    } else {
      onNavigate('proctorStudentAchievements');
    }
  };

  const isCompleted = goal.status === 'Completed';
  const isOverdue = goal.status === 'Overdue';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Goal Details</Text>
            <Text style={styles.headerSubtitle}>Student progress overview</Text>
          </View>
          <View style={styles.viewOnlyBadge}>
            <Ionicons name="eye-outline" size={12} color="#4F46E5" style={{ marginRight: 4 }} />
            <Text style={styles.viewOnlyBadgeText}>VIEW ONLY</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              2. STUDENT MINI PROFILE CARD
          ════════════════════════════════════════════════ */}
          <TouchableOpacity
            style={styles.studentMiniCard}
            activeOpacity={0.7}
            onPress={handleOpenStudentDetails}
          >
            <View style={styles.studentAvatarCircle}>
              <Text style={styles.studentAvatarText}>{goal.avatarInitials || 'ST'}</Text>
            </View>

            <View style={styles.studentMiniInfo}>
              <Text style={styles.studentMiniName} numberOfLines={1}>
                {goal.studentName}
              </Text>
              <Text style={styles.studentMiniMeta}>
                {goal.rollNo} • {goal.department} • {goal.currentYear || 3}rd Year {goal.section || 'A'}
              </Text>
            </View>

            <View style={styles.viewStudentRow}>
              <Text style={styles.viewStudentText}>View Student</Text>
              <Ionicons name="chevron-forward" size={14} color="#2563EB" />
            </View>
          </TouchableOpacity>

          {/* ════════════════════════════════════════════════
              3. GOAL HERO CARD
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={isCompleted ? ['#059669', '#10B981'] : isOverdue ? ['#DC2626', '#EA580C'] : ['#2563EB', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goalHeroCard}
          >
            {/* Category Tag */}
            <View style={styles.heroCategoryPill}>
              <Text style={styles.heroCategoryPillText}>{goal.category.toUpperCase()}</Text>
            </View>

            {/* Goal Title */}
            <Text style={styles.heroGoalTitle}>{goal.title}</Text>

            {/* Progress Bar & Percentage */}
            <View style={styles.heroProgressSection}>
              <View style={styles.heroProgressHeader}>
                <Text style={styles.heroProgressLabel}>Overall Progress</Text>
                <Text style={styles.heroProgressPercent}>{goal.percentage}%</Text>
              </View>

              <View style={styles.heroProgressBarTrack}>
                <View
                  style={[
                    styles.heroProgressBarFill,
                    { width: `${Math.min(goal.percentage, 100)}%` },
                  ]}
                />
              </View>

              <Text style={styles.heroMilestonesCount}>
                {goal.completedMilestones} of {goal.totalMilestones} milestones completed
              </Text>
            </View>

            {/* Bottom Meta Row */}
            <View style={styles.heroBottomRow}>
              <View style={styles.heroDeadlineBox}>
                <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.9)" style={{ marginRight: 5 }} />
                <Text style={styles.heroDeadlineText}>{goal.deadlineContext || `Due ${goal.targetDate}`}</Text>
              </View>

              <View style={styles.heroStatusPill}>
                <Text style={styles.heroStatusPillText}>{goal.status}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              4. GOAL INFORMATION CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>GOAL INFORMATION</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Target Outcome</Text>
                <Text style={styles.infoValue}>{goal.targetOutcome || 'Skill / Milestone'}</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Priority</Text>
                <View style={styles.priorityPill}>
                  <Text style={styles.priorityPillText}>{goal.priority || 'Medium'} Priority</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Created Date</Text>
                <Text style={styles.infoValue}>{goal.createdDate || '12 Aug 2026'}</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Target Date</Text>
                <Text style={styles.infoValue}>{goal.targetDate}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Academic Semester</Text>
                <Text style={styles.infoValue}>{goal.semester || 'Semester 5'}</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Proctor Supervision</Text>
                <Text style={styles.infoValue}>Assigned Cohort</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              5. MILESTONE PROGRESS TIMELINE
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              MILESTONES ({goal.completedMilestones} OF {goal.totalMilestones} COMPLETED)
            </Text>
          </View>

          <View style={styles.milestonesCard}>
            {goal.milestones && goal.milestones.length > 0 ? (
              goal.milestones.map((milestone, idx) => {
                const isMilestoneCompleted = milestone.status === 'completed';
                const isMilestoneInProgress = milestone.status === 'in_progress';
                const isLast = idx === goal.milestones.length - 1;

                return (
                  <View key={milestone.id || String(idx)} style={styles.milestoneItemRow}>
                    {/* Left Timeline Indicator */}
                    <View style={styles.timelineCol}>
                      <View
                        style={[
                          styles.timelineDot,
                          isMilestoneCompleted && styles.timelineDotCompleted,
                          isMilestoneInProgress && styles.timelineDotInProgress,
                        ]}
                      >
                        {isMilestoneCompleted ? (
                          <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                        ) : isMilestoneInProgress ? (
                          <View style={styles.inProgressInnerDot} />
                        ) : (
                          <View style={styles.pendingDot} />
                        )}
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            isMilestoneCompleted && styles.timelineLineCompleted,
                          ]}
                        />
                      )}
                    </View>

                    {/* Right Content */}
                    <View style={styles.milestoneContentCol}>
                      <Text
                        style={[
                          styles.milestoneTitle,
                          isMilestoneCompleted && styles.milestoneTitleCompleted,
                        ]}
                      >
                        {milestone.title}
                      </Text>

                      <View style={styles.milestoneMetaRow}>
                        <Text
                          style={[
                            styles.milestoneDateText,
                            isMilestoneCompleted && { color: '#16A34A' },
                            isMilestoneInProgress && { color: '#2563EB' },
                          ]}
                        >
                          {isMilestoneCompleted
                            ? `Completed • ${milestone.completedAt || 'Recently'}`
                            : milestone.dueText || 'Pending'}
                        </Text>

                        {milestone.proofRequired && (
                          <View style={styles.proofTag}>
                            <Ionicons name="document-text-outline" size={11} color="#4F46E5" style={{ marginRight: 3 }} />
                            <Text style={styles.proofTagText}>Proof attached</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyNote}>No milestone breakdown configured.</Text>
            )}
          </View>

          {/* ════════════════════════════════════════════════
              6. EVIDENCE & ATTACHMENTS
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EVIDENCE & ATTACHMENTS</Text>
          </View>

          {goal.proofAttachment ? (
            <View style={styles.proofCard}>
              <View style={styles.proofIconBox}>
                <Ionicons
                  name={goal.proofAttachment.fileType === 'pdf' ? 'document-text' : 'image'}
                  size={24}
                  color="#2563EB"
                />
              </View>

              <View style={styles.proofInfoCol}>
                <View style={styles.proofTitleStatusRow}>
                  <Text style={styles.proofLabel}>{goal.proofAttachment.label}</Text>
                  <View
                    style={[
                      styles.proofStatusTag,
                      goal.proofAttachment.verificationStatus === 'verified' && styles.proofStatusTagVerified,
                    ]}
                  >
                    <Text
                      style={[
                        styles.proofStatusTagText,
                        goal.proofAttachment.verificationStatus === 'verified' && { color: '#16A34A' },
                      ]}
                    >
                      {goal.proofAttachment.verificationStatus === 'verified' ? 'Verified' : 'Evidence Attached'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.proofFileName} numberOfLines={1}>
                  {goal.proofAttachment.fileName}
                </Text>

                <Text style={styles.proofFileSize}>
                  {goal.proofAttachment.fileType.toUpperCase()} • {goal.proofAttachment.fileSize} • Uploaded on{' '}
                  {goal.proofAttachment.uploadedAt}
                </Text>

                <TouchableOpacity
                  style={styles.viewProofBtn}
                  activeOpacity={0.8}
                  onPress={() => setProofModalVisible(true)}
                >
                  <Ionicons name="eye-outline" size={14} color="#2563EB" style={{ marginRight: 4 }} />
                  <Text style={styles.viewProofBtnText}>Inspect Proof Document</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noProofCard}>
              <Ionicons name="information-circle-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <Text style={styles.noProofText}>No proof document attached for this goal progress yet.</Text>
            </View>
          )}

          {/* ════════════════════════════════════════════════
              7. RECENT GOAL ACTIVITY AUDIT
          ════════════════════════════════════════════════ */}
          {goal.recentActivity && goal.recentActivity.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
              </View>

              <View style={styles.activityCard}>
                {goal.recentActivity.map((act, index) => (
                  <View key={act.id || String(index)} style={styles.activityRow}>
                    <View style={styles.activityDateBox}>
                      <Text style={styles.activityDateText}>{act.date}</Text>
                    </View>
                    <View style={styles.activityInfoCol}>
                      <Text style={styles.activityTitle}>{act.title}</Text>
                      <Text style={styles.activitySubtitle}>{act.subtitle}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ════════════════════════════════════════════════
              8. SECONDARY ACTION
          ════════════════════════════════════════════════ */}
          <TouchableOpacity
            style={styles.secondaryActionCard}
            activeOpacity={0.8}
            onPress={handleOpenStudentAchievements}
          >
            <Ionicons name="trophy-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryActionText}>
              View {goal.studentName}'s Verified Achievements
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            DOCUMENT PROOF PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        {goal.proofAttachment && (
          <Modal
            visible={proofModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setProofModalVisible(false)}
          >
            <View style={styles.previewModalOverlay}>
              <View style={styles.previewModalCard}>
                <View style={styles.previewModalHeader}>
                  <View style={styles.previewModalTitleCol}>
                    <Text style={styles.previewModalTitle}>{goal.proofAttachment.label}</Text>
                    <Text style={styles.previewModalSubtitle}>{goal.proofAttachment.fileName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.previewModalClose}
                    onPress={() => setProofModalVisible(false)}
                  >
                    <Ionicons name="close" size={20} color="#0F172A" />
                  </TouchableOpacity>
                </View>

                {/* Simulated Document Preview Area */}
                <View style={styles.documentPreviewSheet}>
                  <Ionicons
                    name={goal.proofAttachment.fileType === 'pdf' ? 'document-text' : 'image'}
                    size={48}
                    color="#2563EB"
                  />
                  <Text style={styles.docPreviewMainTitle}>{goal.proofAttachment.label}</Text>
                  <Text style={styles.docPreviewSub}>Uploaded by {goal.studentName}</Text>
                  <Text style={styles.docPreviewRoll}>{goal.rollNo} • {goal.department}</Text>
                  <View style={styles.docVerifiedPill}>
                    <Ionicons name="shield-checkmark" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                    <Text style={styles.docVerifiedPillText}>
                      {goal.proofAttachment.verificationStatus === 'verified'
                        ? 'Official Institution Verified Document'
                        : 'Authentic Student Submission Record'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.docCloseActionBtn}
                  onPress={() => setProofModalVisible(false)}
                >
                  <Text style={styles.docCloseActionBtnText}>Close Preview</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  viewOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  viewOnlyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
    letterSpacing: 0.4,
  },

  /* Scroll Content */
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Student Mini Card */
  studentMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  studentAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 10,
  },
  studentAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  studentMiniInfo: {
    flex: 1,
  },
  studentMiniName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentMiniMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  viewStudentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStudentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 2,
  },

  /* Goal Hero Card */
  goalHeroCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  heroCategoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  heroCategoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroGoalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 23,
    marginBottom: 14,
  },
  heroProgressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  heroProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroProgressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroProgressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroProgressBarTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  heroProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  heroMilestonesCount: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroDeadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroDeadlineText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  heroStatusPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Section Headers */
  sectionHeader: {
    marginTop: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  /* Info Card */
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  priorityPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },

  /* Milestones Timeline */
  milestonesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  milestoneItemRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineDotCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  timelineDotInProgress: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  inProgressInnerDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  timelineLineCompleted: {
    backgroundColor: '#86EFAC',
  },
  milestoneContentCol: {
    flex: 1,
    paddingTop: 1,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 3,
  },
  milestoneTitleCompleted: {
    color: '#1E293B',
  },
  milestoneMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  milestoneDateText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  proofTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  proofTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4F46E5',
  },
  emptyNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 10,
  },

  /* Proof Card */
  proofCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  proofIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  proofInfoCol: {
    flex: 1,
  },
  proofTitleStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  proofLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofStatusTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proofStatusTagVerified: {
    backgroundColor: '#DCFCE7',
  },
  proofStatusTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  proofFileName: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    marginTop: 2,
  },
  proofFileSize: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 8,
  },
  viewProofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  viewProofBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  noProofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  noProofText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },

  /* Activity Card */
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityDateBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityDateText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  activityInfoCol: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  activitySubtitle: {
    fontSize: 11,
    color: '#64748B',
  },

  /* Secondary Action */
  secondaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },

  /* Proof Preview Modal */
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  previewModalTitleCol: {
    flex: 1,
  },
  previewModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewModalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  previewModalClose: {
    padding: 4,
  },
  documentPreviewSheet: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 8,
  },
  docPreviewMainTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
  },
  docPreviewSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  docPreviewRoll: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  docVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 12,
  },
  docVerifiedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  docCloseActionBtn: {
    height: 42,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  docCloseActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
