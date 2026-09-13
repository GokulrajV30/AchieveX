// ─────────────────────────────────────────────────────────────
// AchieveX — Student Project Details Screen (V1)
// Summary → Overview → Problem & Description → Team & Responsibilities → Mentor
// Team Leader has Edit action; Team Member has Read-Only view
// ─────────────────────────────────────────────────────────────

import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getStudentProjectById,
  getFacultyMentor,
  type ProjectTeam,
} from '../../../data/studentProjectsData';
import { getHODStore } from '../../../data/hodWorkspaceData';

interface StudentProjectDetailsProps {
  projectId: string;
  currentStudentRoll?: string;
  onGoBack: () => void;
  onEditProject?: (projectId: string) => void;
}

export default function StudentProjectDetails({
  projectId,
  currentStudentRoll = '23CI011',
  onGoBack,
  onEditProject,
}: StudentProjectDetailsProps) {
  const insets = useSafeAreaInsets();
  const [tick, setTick] = useState(0);

  // Subscribe to updates so edits are reflected immediately
  useEffect(() => {
    const store = getHODStore();
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const project: ProjectTeam | undefined = useMemo(() => {
    return getStudentProjectById(projectId);
  }, [projectId, tick]);

  if (!project) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Project Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
          <Text style={styles.notFoundTitle}>Project Not Found</Text>
          <Text style={styles.notFoundSub}>The requested project could not be found.</Text>
          <TouchableOpacity style={styles.backHomeBtn} onPress={onGoBack}>
            <Text style={styles.backHomeBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isTeam = project.projectType === 'team';
  const isLeader =
    project.teamLeaderRoll.toLowerCase() === currentStudentRoll.toLowerCase() ||
    project.teamLeaderId.toLowerCase() === currentStudentRoll.toLowerCase() ||
    project.createdByStudentId.toLowerCase() === currentStudentRoll.toLowerCase();

  const assignedMentor = project.mentorFacultyId
    ? getFacultyMentor(project.mentorFacultyId)
    : undefined;

  const mentorDisplayName = project.mentorName || assignedMentor?.name;

  const statusLabel =
    project.status === 'completed'
      ? 'Completed'
      : project.status === 'draft'
      ? 'Draft'
      : 'Active';

  const displayCategory =
    project.projectCategory || (isTeam ? 'Team Project' : 'Individual Project');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onGoBack}
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Project Details</Text>
          <Text style={styles.headerSubtitle}>
            {isLeader ? 'You are Team Leader' : 'Managed by Team Leader'}
          </Text>
        </View>

        {isLeader && onEditProject ? (
          <TouchableOpacity
            style={styles.headerEditBtn}
            activeOpacity={0.7}
            onPress={() => onEditProject(project.id)}
          >
            <Ionicons name="pencil" size={16} color="#2563EB" />
            <Text style={styles.headerEditText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ════════════════════════════════════════════════
            1. PROJECT HERO / SUMMARY CARD
        ════════════════════════════════════════════════ */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.typeBadge}>
              <Ionicons
                name={isTeam ? 'people' : 'person'}
                size={14}
                color="#2563EB"
              />
              <Text style={styles.typeBadgeText}>{displayCategory}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                statusLabel === 'Completed'
                  ? styles.statusCompleted
                  : statusLabel === 'Draft'
                  ? styles.statusDraft
                  : styles.statusActive,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  statusLabel === 'Completed'
                    ? styles.dotCompleted
                    : statusLabel === 'Draft'
                    ? styles.dotDraft
                    : styles.dotActive,
                ]}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  statusLabel === 'Completed'
                    ? styles.textCompleted
                    : statusLabel === 'Draft'
                    ? styles.textDraft
                    : styles.textActive,
                ]}
              >
                {statusLabel}
              </Text>
            </View>
          </View>

          <Text style={styles.projectTitle}>{project.title}</Text>

          {project.teamName && (
            <Text style={styles.teamNameSub}>{project.teamName}</Text>
          )}

          <View style={styles.summaryMetaRow}>
            <View style={styles.domainPill}>
              <Ionicons name="pricetag-outline" size={13} color="#475569" />
              <Text style={styles.domainPillText}>{project.domain}</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="calendar-outline" size={13} color="#475569" />
              <Text style={styles.metaPillText}>{project.academicYear}</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            2. PROJECT OVERVIEW
        ════════════════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Project Overview</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Project Type</Text>
            <Text style={styles.infoValue}>{displayCategory}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Domain</Text>
            <Text style={styles.infoValue}>{project.domain}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Academic Year</Text>
            <Text style={styles.infoValue}>{project.academicYear}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student Year</Text>
            <Text style={styles.infoValue}>{project.studentYear}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>CSE (IoT)</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            3. PROBLEM STATEMENT & DESCRIPTION
        ════════════════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Problem Statement</Text>
        </View>
        <View style={styles.textCard}>
          <Text style={styles.bodyParagraph}>
            {project.problemStatement ||
              'No problem statement specified for this project.'}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Project Description</Text>
        </View>
        <View style={styles.textCard}>
          <Text style={styles.bodyParagraph}>
            {project.description ||
              'No detailed project description available.'}
          </Text>
        </View>

        {/* ════════════════════════════════════════════════
            4. TEAM MEMBERS & RESPONSIBILITIES
        ════════════════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderFlex}>
            <Text style={styles.sectionTitle}>
              {isTeam ? 'Team Members' : 'Project Owner'}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {project.members?.filter((m) => m.status === 'active').length || 1}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.teamCard}>
          {project.members?.map((member, index) => {
            const isMemLeader = member.role === 'team_leader';
            const isMemOwner = member.role === 'project_owner';
            const isLast = index === (project.members?.length || 1) - 1;

            const initials = member.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <View
                key={member.id || member.studentId}
                style={[styles.memberRow, isLast && { borderBottomWidth: 0 }]}
              >
                <View
                  style={[
                    styles.avatarWrap,
                    (isMemLeader || isMemOwner) && styles.leaderAvatarWrap,
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      (isMemLeader || isMemOwner) && styles.leaderAvatarText,
                    ]}
                  >
                    {initials}
                  </Text>
                </View>

                <View style={styles.memberInfoCol}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {isMemLeader && (
                      <View style={styles.leaderBadge}>
                        <Ionicons name="star" size={10} color="#D97706" />
                        <Text style={styles.leaderBadgeText}>Team Leader</Text>
                      </View>
                    )}
                    {isMemOwner && (
                      <View style={styles.ownerBadge}>
                        <Ionicons name="shield-checkmark" size={10} color="#2563EB" />
                        <Text style={styles.ownerBadgeText}>Owner</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.memberMetaText}>
                    {member.registerNumber} • {member.department || 'CSE (IoT)'} •{' '}
                    {member.yearLabel || '3rd Year'}
                  </Text>

                  {/* Responsibility Field */}
                  <View style={styles.responsibilityWrap}>
                    <Ionicons name="briefcase-outline" size={12} color="#4F46E5" />
                    <Text style={styles.responsibilityLabel}>Responsibility:</Text>
                    <Text style={styles.responsibilityValue}>
                      {member.responsibility ||
                        (isMemLeader ? 'Project Lead & Architecture' : 'Team Member')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ════════════════════════════════════════════════
            5. MENTOR DETAILS
        ════════════════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Mentor</Text>
        </View>

        <View style={styles.mentorCard}>
          {mentorDisplayName ? (
            <View style={styles.mentorRow}>
              <View style={styles.mentorAvatarWrap}>
                <Ionicons name="school" size={24} color="#047857" />
              </View>
              <View style={styles.mentorInfoCol}>
                <Text style={styles.mentorNameText}>{mentorDisplayName}</Text>
                <Text style={styles.mentorSubText}>
                  {assignedMentor?.designation || 'Assistant Professor'} •{' '}
                  {assignedMentor?.department || 'CSE (IoT)'}
                </Text>
                <Text style={styles.mentorNoteText}>
                  Assigned by Department for Project Guidance
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.unassignedMentorWrap}>
              <View style={styles.unassignedIconWrap}>
                <Ionicons name="person-outline" size={20} color="#94A3B8" />
              </View>
              <View style={styles.unassignedTextWrap}>
                <Text style={styles.unassignedTitle}>Mentor Not Assigned</Text>
                <Text style={styles.unassignedSubtitle}>
                  Your assigned mentor will appear here once the department assigns one.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ════════════════════════════════════════════════
            6. ACTION BUTTON OR PERMISSION NOTICE
        ════════════════════════════════════════════════ */}
        <View style={styles.actionContainer}>
          {isLeader && onEditProject ? (
            <TouchableOpacity
              style={styles.editProjectMainBtn}
              activeOpacity={0.8}
              onPress={() => onEditProject(project.id)}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.editProjectBtnText}>Edit Project</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.memberNoticeBox}>
              <Ionicons name="information-circle-outline" size={18} color="#64748B" />
              <Text style={styles.memberNoticeText}>
                This project is managed by Team Leader ({project.teamLeaderName}). Project
                information and team details are read-only.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  headerEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  headerEditText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 5,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusDraft: {
    backgroundColor: '#F1F5F9',
  },
  statusCompleted: {
    backgroundColor: '#F0FDF4',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#10B981',
  },
  dotDraft: {
    backgroundColor: '#64748B',
  },
  dotCompleted: {
    backgroundColor: '#059669',
  },
  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  textActive: {
    color: '#059669',
  },
  textDraft: {
    color: '#475569',
  },
  textCompleted: {
    color: '#047857',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  teamNameSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  summaryMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  domainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  domainPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  sectionHeader: {
    marginBottom: 8,
    marginTop: 6,
  },
  sectionHeaderFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  textCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  bodyParagraph: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderAvatarWrap: {
    backgroundColor: '#FEF3C7',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  leaderAvatarText: {
    color: '#D97706',
  },
  memberInfoCol: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  leaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  leaderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  memberMetaText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  responsibilityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  responsibilityLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  responsibilityValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4F46E5',
  },
  mentorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mentorAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mentorInfoCol: {
    flex: 1,
  },
  mentorNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  mentorSubText: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  mentorNoteText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  unassignedMentorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unassignedIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unassignedTextWrap: {
    flex: 1,
  },
  unassignedTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  unassignedSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  actionContainer: {
    marginTop: 4,
  },
  editProjectMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  editProjectBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  memberNoticeText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 18,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  notFoundSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  backHomeBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backHomeBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
