// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Student Goal Details Modal (Read-Only)
// Allows a proctor to inspect assigned student goal progress & milestones without modification authority.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type StudentGoalProgress } from '../../../data/facultyWorkspaceData';

interface ProctorStudentGoalDetailsModalProps {
  visible: boolean;
  goal: StudentGoalProgress | null;
  onClose: () => void;
}

export default function ProctorStudentGoalDetailsModal({
  visible,
  goal,
  onClose,
}: ProctorStudentGoalDetailsModalProps) {
  const [proofPreviewOpen, setProofPreviewOpen] = useState(false);

  if (!goal) return null;

  const handleOpenProof = (milestoneName: string) => {
    Alert.alert(
      'Attached Milestone Proof 📄',
      `Document: ${milestoneName.replace(/\s+/g, '_')}_Proof.pdf\n\nUploaded by ${goal.studentName} (${goal.rollNo})\nStatus: Verified Submission`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const isOverdue = goal.status === 'Overdue';
  const isCompleted = goal.status === 'Completed';

  // Sample milestone data for this goal
  const milestones = [
    {
      id: 'm1',
      title: 'Topic Selection & Problem Formulation',
      completed: true,
      date: '10 Aug 2026',
      proofName: 'Topic_Approval_Doc.pdf',
    },
    {
      id: 'm2',
      title: 'Literature Survey & Initial Draft Formulation',
      completed: true,
      date: '22 Aug 2026',
      proofName: 'Literature_Survey_Draft.pdf',
    },
    {
      id: 'm3',
      title: 'Conference Paper Submission & Proof Attachment',
      completed: goal.completedMilestones >= 3,
      date: '01 Sep 2026',
      proofName: 'IEEE_Paper_Submission_Proof.pdf',
    },
    {
      id: 'm4',
      title: 'Peer Review Revisions & Camera-Ready Copy',
      completed: goal.completedMilestones >= 4,
      date: 'Due 15 Sep 2026',
      proofName: null,
    },
    {
      id: 'm5',
      title: 'Oral Presentation & Final Proceedings Publication',
      completed: goal.completedMilestones >= 5,
      date: 'Due 20 Sep 2026',
      proofName: null,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContent} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleCol}>
              <View style={styles.monitoringTag}>
                <Ionicons name="eye-outline" size={12} color="#4338CA" style={{ marginRight: 4 }} />
                <Text style={styles.monitoringTagText}>STUDENT GOAL MONITORING</Text>
              </View>
              <Text style={styles.modalTitle}>Goal Inspection</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={onClose}>
              <Ionicons name="close" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Student Context Card */}
            <View style={styles.studentContextCard}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={20} color="#2563EB" />
              </View>
              <View style={styles.studentInfoCol}>
                <Text style={styles.studentNameText}>{goal.studentName}</Text>
                <Text style={styles.studentRollText}>
                  {goal.rollNo} • {goal.department}
                </Text>
              </View>
            </View>

            {/* Goal Overview Card */}
            <View style={styles.goalCard}>
              <View style={styles.goalCategoryBadge}>
                <Text style={styles.goalCategoryBadgeText}>{goal.category}</Text>
              </View>

              <Text style={styles.goalTitle}>{goal.title}</Text>

              <View style={styles.deadlineRow}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.deadlineText}>Target Deadline: {goal.targetDate}</Text>
              </View>

              {/* Progress Gauge */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Milestones Completed</Text>
                  <Text style={styles.progressPercentText}>{goal.percentage}%</Text>
                </View>

                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${goal.percentage}%`,
                        backgroundColor: isOverdue ? '#DC2626' : isCompleted ? '#16A34A' : '#2563EB',
                      },
                    ]}
                  />
                </View>

                <Text style={styles.milestoneCounterText}>
                  {goal.completedMilestones} of {goal.totalMilestones} Milestones Completed
                </Text>
              </View>
            </View>

            {/* Read-Only Milestones Timeline */}
            <View style={styles.milestonesSection}>
              <Text style={styles.sectionHeading}>Milestones Timeline</Text>

              <View style={styles.timelineList}>
                {milestones.map((m, idx) => (
                  <View key={m.id} style={styles.milestoneRow}>
                    <View style={styles.timelineLeftCol}>
                      <View
                        style={[
                          styles.timelineDot,
                          m.completed ? styles.timelineDotDone : styles.timelineDotPending,
                        ]}
                      >
                        {m.completed ? (
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        ) : (
                          <Text style={styles.timelineNumberText}>{idx + 1}</Text>
                        )}
                      </View>
                      {idx < milestones.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            m.completed ? styles.timelineLineDone : styles.timelineLinePending,
                          ]}
                        />
                      )}
                    </View>

                    <View style={styles.milestoneContentCol}>
                      <View style={styles.milestoneTitleRow}>
                        <Text
                          style={[
                            styles.milestoneTitle,
                            m.completed && styles.milestoneTitleDone,
                          ]}
                        >
                          {m.title}
                        </Text>
                      </View>

                      <Text style={styles.milestoneDateText}>{m.date}</Text>

                      {m.proofName && (
                        <TouchableOpacity
                          style={styles.proofBadgeBtn}
                          activeOpacity={0.7}
                          onPress={() => handleOpenProof(m.title)}
                        >
                          <Ionicons name="document-text-outline" size={13} color="#2563EB" style={{ marginRight: 4 }} />
                          <Text style={styles.proofBadgeText}>Proof Attached</Text>
                          <Ionicons name="open-outline" size={12} color="#2563EB" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Read-Only Notice */}
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.noticeText}>
                Goal milestone modifications and proof uploads are managed directly by the student.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeActionBtn} activeOpacity={0.8} onPress={onClose}>
              <Text style={styles.closeActionBtnText}>Close Monitoring View</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitleCol: {
    flex: 1,
  },
  monitoringTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  monitoringTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    gap: 12,
  },
  studentContextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentInfoCol: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  studentRollText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  goalCategoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  goalCategoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deadlineText: {
    fontSize: 12,
    color: '#64748B',
  },
  progressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  milestoneCounterText: {
    fontSize: 11,
    color: '#64748B',
  },
  milestonesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  timelineList: {
    gap: 0,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeftCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: {
    backgroundColor: '#16A34A',
  },
  timelineDotPending: {
    backgroundColor: '#E2E8F0',
  },
  timelineNumberText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  timelineLine: {
    width: 2,
    height: 44,
  },
  timelineLineDone: {
    backgroundColor: '#86EFAC',
  },
  timelineLinePending: {
    backgroundColor: '#E2E8F0',
  },
  milestoneContentCol: {
    flex: 1,
    paddingBottom: 16,
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  milestoneTitleDone: {
    color: '#334155',
  },
  milestoneDateText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  proofBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  proofBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noticeText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
    lineHeight: 16,
  },
  modalFooter: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  closeActionBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
