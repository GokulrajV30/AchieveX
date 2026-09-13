// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Student Details Screen
// In-depth academic & achievement monitoring view for an assigned student.
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type AssignedStudent,
  PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS,
  PROCTOR_STUDENT_GOALS,
  type StudentAchievementRecord,
} from '../../../data/facultyWorkspaceData';
import StudentAchievementDetailsModal, {
  type ReadOnlyAchievementData,
} from '../StudentAchievementDetailsModal';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorStudentDetailsProps {
  student: AssignedStudent;
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onViewAchievements: (student: AssignedStudent) => void;
  onViewLeaderboard?: () => void;
}

export default function ProctorStudentDetails({
  student,
  onGoBack,
  onNavigate,
  onViewAchievements,
  onViewLeaderboard,
}: ProctorStudentDetailsProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<ReadOnlyAchievementData | null>(null);

  const studentAchievements = PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS.filter(
    (a) => a.studentId === student.id
  );

  const studentGoals = PROCTOR_STUDENT_GOALS.filter(
    (g) => g.studentId === student.id
  );

  const handleOpenAchievement = (ach: StudentAchievementRecord) => {
    setSelectedAchievement({
      id: ach.id,
      studentName: ach.studentName,
      registerNumber: ach.rollNo,
      department: ach.department,
      title: ach.title,
      category: ach.category,
      event: ach.event,
      organizer: ach.organizer,
      semester: ach.semester,
      date: ach.date,
      status: ach.status,
      points: ach.points,
      proofDocumentName: ach.proofDocumentName,
      proofType: ach.proofType,
    });
  };

  const isAttention = student.needsAttention;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Details</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. STUDENT PROFILE SUMMARY CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.profileSummaryCard}>
            <View style={styles.profileTopRow}>
              <View
                style={[
                  styles.avatarContainer,
                  isAttention ? styles.avatarAttention : styles.avatarNormal,
                ]}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={isAttention ? '#DC2626' : '#2563EB'}
                />
              </View>

              <View style={styles.profileInfoCol}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentRollNo}>{student.registerNumber}</Text>
                <Text style={styles.studentDepartment}>
                  {student.departmentName} • {student.currentYear}rd Year ({student.section})
                </Text>
              </View>

              <View
                style={[
                  styles.statusTag,
                  isAttention ? styles.statusTagAttention : styles.statusTagActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusTagText,
                    isAttention
                      ? styles.statusTagTextAttention
                      : styles.statusTagTextActive,
                  ]}
                >
                  {isAttention ? 'Needs Attention' : 'Active'}
                </Text>
              </View>
            </View>

            {isAttention && (
              <View style={styles.attentionBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 8 }} />
                <Text style={styles.attentionBannerText}>{student.attentionReason}</Text>
              </View>
            )}

            {/* Embedded 3-Column Stats Row */}
            <View style={styles.statsBar}>
              <View style={styles.statCol}>
                <Ionicons name="trophy" size={18} color="#2563EB" />
                <Text style={styles.statNumber}>
                  {student.performance.verifiedAchievements}
                </Text>
                <Text style={styles.statLabel}>Verified</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <Ionicons name="star" size={18} color="#D97706" />
                <Text style={styles.statNumber}>{student.performance.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <MaterialCommunityIcons name="target" size={18} color="#7C3AED" />
                <Text style={styles.statNumber}>
                  {student.performance.activeGoals}
                </Text>
                <Text style={styles.statLabel}>Active Goals</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              2. QUICK ACTIONS
          ════════════════════════════════════════════════ */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.actionPillBtn}
              activeOpacity={0.8}
              onPress={() => onViewAchievements(student)}
            >
              <Ionicons name="ribbon-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.actionPillBtnText}>All Achievements</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPillBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('proctorPerformance')}
            >
              <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={16} color="#7C3AED" style={{ marginRight: 6 }} />
              <Text style={styles.actionPillBtnText}>Group Standing</Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              3. GOAL PROGRESS (If active goals exist)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderTitleGroup}>
                <MaterialCommunityIcons name="target" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                <Text style={styles.sectionHeaderTitle}>Goal Progress & Milestones</Text>
              </View>
              <Text style={styles.sectionCountText}>
                {studentGoals.length} {studentGoals.length === 1 ? 'Goal' : 'Goals'}
              </Text>
            </View>

            {studentGoals.length === 0 ? (
              <View style={styles.emptySectionBox}>
                <Text style={styles.emptySectionText}>No active goals created for this semester.</Text>
              </View>
            ) : (
              studentGoals.map((goal) => {
                const isOverdue = goal.status === 'Overdue';
                return (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeaderRow}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <View
                        style={[
                          styles.goalStatusTag,
                          isOverdue ? styles.goalStatusOverdue : styles.goalStatusProgress,
                        ]}
                      >
                        <Text
                          style={[
                            styles.goalStatusTagText,
                            isOverdue ? styles.goalStatusTextOverdue : styles.goalStatusTextProgress,
                          ]}
                        >
                          {goal.status}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${goal.percentage}%`,
                            backgroundColor: isOverdue ? '#DC2626' : '#2563EB',
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.goalFooterRow}>
                      <Text style={styles.milestonesCountText}>
                        {goal.completedMilestones} of {goal.totalMilestones} milestones completed
                      </Text>
                      <Text style={styles.percentageText}>{goal.percentage}%</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* ════════════════════════════════════════════════
              4. RECENT STUDENT ACTIVITY & PROOFS
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderTitleGroup}>
                <Ionicons name="time-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                <Text style={styles.sectionHeaderTitle}>Recent Submissions</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onViewAchievements(student)}
              >
                <Text style={styles.viewAllText}>View All ›</Text>
              </TouchableOpacity>
            </View>

            {studentAchievements.length === 0 ? (
              <View style={styles.emptySectionBox}>
                <Text style={styles.emptySectionText}>No achievement submissions recorded yet.</Text>
              </View>
            ) : (
              studentAchievements.slice(0, 3).map((ach) => {
                const isApproved = ach.status === 'Approved';
                const isPending = ach.status === 'Pending';

                return (
                  <View key={ach.id} style={styles.activityItemRow}>
                    <View style={styles.activityIconBox}>
                      <Ionicons name="ribbon" size={18} color="#2563EB" />
                    </View>

                    <View style={styles.activityInfoCol}>
                      <Text style={styles.activityTitle}>{ach.title}</Text>
                      <Text style={styles.activityCategory}>{ach.category}</Text>
                      <Text style={styles.activityMeta}>
                        {ach.date} •{' '}
                        <Text
                          style={{
                            color: isApproved
                              ? '#15803D'
                              : isPending
                              ? '#B45309'
                              : '#B91C1C',
                            fontWeight: '700',
                          }}
                        >
                          ● {ach.status}
                        </Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewRecordBtn}
                      activeOpacity={0.8}
                      onPress={() => handleOpenAchievement(ach)}
                    >
                      <Text style={styles.viewRecordBtnText}>View</Text>
                      <Ionicons name="arrow-forward" size={13} color="#FFFFFF" style={{ marginLeft: 3 }} />
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Read-Only Achievement Details Modal */}
        <StudentAchievementDetailsModal
          visible={selectedAchievement !== null}
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />

        {/* Bottom Tab Bar */}
        <StudentBottomTab
          variant="proctor"
          activeTab="students"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
            } else if (tab === 'goals') {
              onNavigate('proctorGoalsOverview');
            } else if (tab === 'leaderboard') {
              onNavigate('proctorLeaderboard');
            } else if (tab === 'profile') {
              onNavigate('facultyProfile');
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  profileSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarNormal: {
    backgroundColor: '#EFF6FF',
  },
  avatarAttention: {
    backgroundColor: '#FEF2F2',
  },
  profileInfoCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  studentRollNo: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginTop: 1,
  },
  studentDepartment: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagActive: {
    backgroundColor: '#DCFCE7',
  },
  statusTagAttention: {
    backgroundColor: '#FEE2E2',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTagTextActive: {
    color: '#15803D',
  },
  statusTagTextAttention: {
    color: '#B91C1C',
  },
  attentionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  attentionBannerText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionPillBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  goalCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 8,
  },
  goalStatusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  goalStatusProgress: {
    backgroundColor: '#EEF2FF',
  },
  goalStatusOverdue: {
    backgroundColor: '#FEE2E2',
  },
  goalStatusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  goalStatusTextProgress: {
    color: '#4F46E5',
  },
  goalStatusTextOverdue: {
    color: '#DC2626',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestonesCountText: {
    fontSize: 11,
    color: '#64748B',
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  activityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityInfoCol: {
    flex: 1,
    paddingRight: 6,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityCategory: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  activityMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  viewRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  viewRecordBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptySectionBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: 12.5,
    color: '#94A3B8',
  },
});
