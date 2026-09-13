// ─────────────────────────────────────────────────────────────
// AchieveX — Student Edit Project Screen (V1)
// Pre-fills all existing data → Modifies the SAME project record
// Permission restricted to Team Leader / Creator
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  PROJECT_TYPES,
  PROJECT_DOMAINS,
  RESPONSIBILITY_SUGGESTIONS,
  getStudentProjectById,
  updateStudentProject,
  getEligibleTeammates,
  getFacultyMentor,
  type ProjectTeam,
} from '../../../data/studentProjectsData';
import { showAchieveXDialog } from '../../feedback/AchieveXFeedback';
import { type StudentRecord } from '../../../data/achievementConfig';

interface StudentEditProjectProps {
  projectId: string;
  currentStudentRoll?: string;
  onGoBack: () => void;
  onViewProject: (projectId: string) => void;
}

export default function StudentEditProject({
  projectId,
  currentStudentRoll = '23CI011',
  onGoBack,
  onViewProject,
}: StudentEditProjectProps) {
  const insets = useSafeAreaInsets();

  const existingProject: ProjectTeam | undefined = getStudentProjectById(projectId);

  // Form State
  const [title, setTitle] = useState(existingProject?.title || '');
  const [participationType, setParticipationType] = useState<'Team' | 'Individual'>(
    existingProject?.participationType || (existingProject?.projectType === 'individual' ? 'Individual' : 'Team')
  );
  const [teamName, setTeamName] = useState(existingProject?.teamName || '');
  const [projectCategory, setProjectCategory] = useState<string>(
    existingProject?.projectCategory || 'Final Year Project'
  );
  const [customProjectType, setCustomProjectType] = useState(
    existingProject?.customProjectType || ''
  );
  const [domain, setDomain] = useState<string>(
    PROJECT_DOMAINS.includes(existingProject?.domain as any)
      ? existingProject?.domain || 'AIoT'
      : 'Other'
  );
  const [customDomain, setCustomDomain] = useState(
    PROJECT_DOMAINS.includes(existingProject?.domain as any)
      ? ''
      : existingProject?.domain || ''
  );
  const [problemStatement, setProblemStatement] = useState(
    existingProject?.problemStatement || ''
  );
  const [description, setDescription] = useState(existingProject?.description || '');

  // Members state
  const leaderMember = existingProject?.members.find(
    (m) => m.role === 'team_leader' || m.role === 'project_owner'
  );
  const [leaderResponsibility, setLeaderResponsibility] = useState(
    leaderMember?.responsibility || 'UI/UX & Frontend'
  );

  const initialOtherMembers =
    existingProject?.members
      .filter((m) => m.role !== 'team_leader' && m.role !== 'project_owner' && m.status === 'active')
      .map((m) => ({
        studentId: m.studentId,
        name: m.name,
        registerNumber: m.registerNumber,
        department: m.department,
        yearLabel: m.yearLabel,
        responsibility: m.responsibility || 'Backend & APIs',
      })) || [];

  const [members, setMembers] = useState(initialOtherMembers);

  // Teammate Search Modal State
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdowns
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [domainModalVisible, setDomainModalVisible] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isTeam = participationType === 'Team';

  // Permission Check
  const isLeader =
    existingProject &&
    (existingProject.teamLeaderRoll.toLowerCase() === currentStudentRoll.toLowerCase() ||
      existingProject.teamLeaderId.toLowerCase() === currentStudentRoll.toLowerCase() ||
      existingProject.createdByStudentId.toLowerCase() === currentStudentRoll.toLowerCase());

  if (!existingProject || !isLeader) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Project</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="lock-closed-outline" size={48} color="#94A3B8" />
          <Text style={styles.notFoundTitle}>Permission Denied</Text>
          <Text style={styles.notFoundSub}>
            Only the Project Owner or Team Leader can modify project details.
          </Text>
          <TouchableOpacity style={styles.backHomeBtn} onPress={onGoBack}>
            <Text style={styles.backHomeBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Eligible students for teammate addition
  const eligibleStudents = getEligibleTeammates(
    existingProject.teamLeaderRoll,
    members.map((m) => m.registerNumber),
    searchQuery
  );

  const handleAddMember = (student: StudentRecord) => {
    setMembers((prev) => [
      ...prev,
      {
        studentId: student.id,
        name: student.name,
        registerNumber: student.rollNumber,
        department: student.department,
        yearLabel: (student.year as any) || '3rd Year',
        responsibility: 'Backend & APIs',
      },
    ]);
    setSearchModalVisible(false);
    setSearchQuery('');
  };

  const handleRemoveMember = (regNum: string) => {
    setMembers((prev) => prev.filter((m) => m.registerNumber !== regNum));
  };

  const handleUpdateMemberResponsibility = (regNum: string, responsibility: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.registerNumber === regNum ? { ...m, responsibility } : m))
    );
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Enter your project title.';
    if (isTeam && !teamName.trim()) errs.teamName = 'Enter your team name.';
    if (projectCategory === 'Other' && !customProjectType.trim())
      errs.customProjectType = 'Specify your project type.';
    if (domain === 'Other' && !customDomain.trim())
      errs.customDomain = 'Specify your project domain.';
    if (!problemStatement.trim()) errs.problemStatement = 'Enter a brief problem statement.';
    if (!description.trim()) errs.description = 'Enter your project description.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;

    const allMembersPayload: any[] = [
      {
        studentId: existingProject.teamLeaderId,
        name: existingProject.teamLeaderName,
        registerNumber: existingProject.teamLeaderRoll,
        department: existingProject.departmentId || 'CSE (IoT)',
        yearLabel: existingProject.studentYear,
        role: isTeam ? 'team_leader' : 'project_owner',
        responsibility: leaderResponsibility.trim() || (isTeam ? 'Team Leader' : 'Full Project'),
      },
    ];

    if (isTeam) {
      members.forEach((m) => {
        allMembersPayload.push({
          studentId: m.studentId,
          name: m.name,
          registerNumber: m.registerNumber,
          department: m.department,
          yearLabel: m.yearLabel,
          role: 'team_member',
          responsibility: m.responsibility.trim() || 'Contributor',
        });
      });
    }

    updateStudentProject(projectId, {
      title: title.trim(),
      teamName: isTeam ? teamName.trim() : undefined,
      projectCategory,
      customProjectType: projectCategory === 'Other' ? customProjectType.trim() : undefined,
      domain,
      customDomain: domain === 'Other' ? customDomain.trim() : undefined,
      problemStatement: problemStatement.trim(),
      description: description.trim(),
      participationType,
      members: allMembersPayload,
    });

    showAchieveXDialog({
      type: 'success',
      title: 'Project Updated',
      message: 'Your project details have been updated.',
      primaryAction: {
        label: 'View Project',
        onPress: () => onViewProject(projectId),
      },
    });
  };

  const assignedMentor = existingProject.mentorFacultyId
    ? getFacultyMentor(existingProject.mentorFacultyId)
    : undefined;

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
          <Text style={styles.headerTitle}>Edit Project</Text>
          <Text style={styles.headerSubtitle}>{existingProject.title}</Text>
        </View>

        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ════════════════════════════════════════════════
              SECTION 1: PROJECT INFORMATION
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionNumberCircle}>
                <Text style={styles.sectionNumberText}>1</Text>
              </View>
              <Text style={styles.sectionCardTitle}>Project Information</Text>
            </View>

            {/* Project Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Project Title <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, errors.title ? styles.inputError : null]}
                placeholder="e.g., Terra View"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            {/* Participation Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Project Participation</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    participationType === 'Individual' && styles.toggleBtnActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setParticipationType('Individual')}
                >
                  <Ionicons
                    name="person"
                    size={16}
                    color={participationType === 'Individual' ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      participationType === 'Individual' && styles.toggleBtnTextActive,
                    ]}
                  >
                    Individual
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    participationType === 'Team' && styles.toggleBtnActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setParticipationType('Team')}
                >
                  <Ionicons
                    name="people"
                    size={16}
                    color={participationType === 'Team' ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      participationType === 'Team' && styles.toggleBtnTextActive,
                    ]}
                  >
                    Team
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Team Name (if Team) */}
            {isTeam && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Team Name <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.teamName ? styles.inputError : null]}
                  placeholder="e.g., Code Nexuss"
                  placeholderTextColor="#94A3B8"
                  value={teamName}
                  onChangeText={(t) => {
                    setTeamName(t);
                    if (errors.teamName) setErrors((prev) => ({ ...prev, teamName: '' }));
                  }}
                />
                {errors.teamName ? (
                  <Text style={styles.errorText}>{errors.teamName}</Text>
                ) : null}
              </View>
            )}

            {/* Project Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Project Type <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                activeOpacity={0.7}
                onPress={() => setTypeModalVisible(true)}
              >
                <Text style={styles.dropdownValueText}>{projectCategory}</Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {projectCategory === 'Other' && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Specify Project Type <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    errors.customProjectType ? styles.inputError : null,
                  ]}
                  placeholder="e.g., Sponsored Project"
                  placeholderTextColor="#94A3B8"
                  value={customProjectType}
                  onChangeText={setCustomProjectType}
                />
              </View>
            )}

            {/* Domain */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Domain <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                activeOpacity={0.7}
                onPress={() => setDomainModalVisible(true)}
              >
                <Text style={styles.dropdownValueText}>{domain}</Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {domain === 'Other' && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Specify Domain <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.customDomain ? styles.inputError : null]}
                  placeholder="e.g., Robotics"
                  placeholderTextColor="#94A3B8"
                  value={customDomain}
                  onChangeText={setCustomDomain}
                />
              </View>
            )}

            {/* Academic Information (Read Only) */}
            <View style={styles.academicInfoBox}>
              <View style={styles.academicCol}>
                <Text style={styles.academicLabel}>Department</Text>
                <Text style={styles.academicVal}>CSE (IoT)</Text>
              </View>
              <View style={styles.academicCol}>
                <Text style={styles.academicLabel}>Student Year</Text>
                <Text style={styles.academicVal}>{existingProject.studentYear}</Text>
              </View>
              <View style={styles.academicCol}>
                <Text style={styles.academicLabel}>Academic Year</Text>
                <Text style={styles.academicVal}>{existingProject.academicYear}</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              SECTION 2: PROBLEM & DESCRIPTION
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionNumberCircle}>
                <Text style={styles.sectionNumberText}>2</Text>
              </View>
              <Text style={styles.sectionCardTitle}>Problem & Description</Text>
            </View>

            {/* Problem Statement */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Problem Statement <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  errors.problemStatement ? styles.inputError : null,
                ]}
                placeholder="Briefly describe the problem your project addresses."
                placeholderTextColor="#94A3B8"
                value={problemStatement}
                onChangeText={(t) => {
                  setProblemStatement(t);
                  if (errors.problemStatement)
                    setErrors((prev) => ({ ...prev, problemStatement: '' }));
                }}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {errors.problemStatement ? (
                <Text style={styles.errorText}>{errors.problemStatement}</Text>
              ) : null}
            </View>

            {/* Project Description */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Project Description <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textArea, errors.description ? styles.inputError : null]}
                placeholder="Explain your proposed solution and what the project does."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={(t) => {
                  setDescription(t);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: '' }));
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              SECTION 3: TEAM & RESPONSIBILITIES
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionNumberCircle}>
                <Text style={styles.sectionNumberText}>3</Text>
              </View>
              <Text style={styles.sectionCardTitle}>
                {isTeam ? 'Team & Responsibilities' : 'Project Owner'}
              </Text>
            </View>

            {/* Team Leader Row */}
            <View style={styles.creatorCard}>
              <View style={styles.creatorAvatarWrap}>
                <Text style={styles.creatorAvatarText}>
                  {existingProject.teamLeaderName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </Text>
              </View>
              <View style={styles.creatorInfoCol}>
                <View style={styles.creatorRoleRow}>
                  <Text style={styles.creatorName}>
                    {existingProject.teamLeaderName}
                  </Text>
                  <View style={styles.leaderBadge}>
                    <Text style={styles.leaderBadgeText}>
                      {isTeam ? 'Team Leader' : 'Project Owner'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.creatorMeta}>
                  {existingProject.teamLeaderRoll} • CSE (IoT)
                </Text>

                <View style={styles.respInputWrap}>
                  <Text style={styles.respInputLabel}>Role / Responsibility:</Text>
                  <TextInput
                    style={styles.respInput}
                    value={leaderResponsibility}
                    onChangeText={setLeaderResponsibility}
                    placeholder="e.g., UI/UX & Frontend"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.suggestionRow}>
                  {RESPONSIBILITY_SUGGESTIONS.slice(0, 4).map((chip) => (
                    <TouchableOpacity
                      key={chip}
                      style={styles.suggestionChip}
                      onPress={() => setLeaderResponsibility(chip)}
                    >
                      <Text style={styles.suggestionChipText}>{chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Teammates */}
            {isTeam && (
              <View style={styles.teammatesSection}>
                <View style={styles.teammatesHeaderRow}>
                  <Text style={styles.teammatesSubHeader}>
                    Team Members ({members.length})
                  </Text>
                  <TouchableOpacity
                    style={styles.addTeammateBtn}
                    activeOpacity={0.7}
                    onPress={() => setSearchModalVisible(true)}
                  >
                    <Ionicons name="person-add-outline" size={14} color="#2563EB" />
                    <Text style={styles.addTeammateBtnText}>+ Add Member</Text>
                  </TouchableOpacity>
                </View>

                {members.length === 0 ? (
                  <View style={styles.noMembersBox}>
                    <Ionicons name="people-outline" size={20} color="#94A3B8" />
                    <Text style={styles.noMembersText}>
                      No additional members added.
                    </Text>
                  </View>
                ) : (
                  members.map((mem) => (
                    <View key={mem.registerNumber} style={styles.memberItemCard}>
                      <View style={styles.memberTopRow}>
                        <View style={styles.memberAvatarCircle}>
                          <Text style={styles.memberAvatarText}>
                            {mem.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberItemName}>{mem.name}</Text>
                          <Text style={styles.memberItemMeta}>
                            {mem.registerNumber} • {mem.department}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeMemberBtn}
                          onPress={() => handleRemoveMember(mem.registerNumber)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.respInputWrap}>
                        <Text style={styles.respInputLabel}>Role / Responsibility:</Text>
                        <TextInput
                          style={styles.respInput}
                          value={mem.responsibility}
                          onChangeText={(r) =>
                            handleUpdateMemberResponsibility(mem.registerNumber, r)
                          }
                          placeholder="e.g., Backend & APIs"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>

                      <View style={styles.suggestionRow}>
                        {RESPONSIBILITY_SUGGESTIONS.slice(1, 5).map((chip) => (
                          <TouchableOpacity
                            key={chip}
                            style={styles.suggestionChip}
                            onPress={() =>
                              handleUpdateMemberResponsibility(mem.registerNumber, chip)
                            }
                          >
                            <Text style={styles.suggestionChipText}>{chip}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>

          {/* ════════════════════════════════════════════════
              SECTION 4: ASSIGNED MENTOR (Read-Only)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="school-outline" size={18} color="#059669" />
              <Text style={styles.sectionCardTitle}>Assigned Mentor</Text>
            </View>

            {existingProject.mentorName || assignedMentor ? (
              <View style={styles.mentorRow}>
                <View style={styles.mentorAvatarWrap}>
                  <Ionicons name="school" size={22} color="#047857" />
                </View>
                <View style={styles.mentorInfoCol}>
                  <Text style={styles.mentorNameText}>
                    {existingProject.mentorName || assignedMentor?.name}
                  </Text>
                  <Text style={styles.mentorSubText}>
                    {assignedMentor?.designation || 'Assistant Professor'} • CSE (IoT)
                  </Text>
                  <Text style={styles.mentorReadonlyTag}>
                    Assigned Institutionally (Read-Only)
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.unassignedMentorBox}>
                <Text style={styles.unassignedTitle}>Mentor Not Assigned</Text>
                <Text style={styles.unassignedSubtitle}>
                  Your assigned mentor will appear here once the department assigns one.
                </Text>
              </View>
            )}
          </View>

          {/* ── Save Changes Button ── */}
          <TouchableOpacity
            style={styles.saveChangesBtn}
            activeOpacity={0.8}
            onPress={handleSaveChanges}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveChangesBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal: Add Teammate Search ── */}
      <Modal
        visible={searchModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.searchModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Team Member</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSearchModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by student name or register no."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              style={styles.candidateScrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {eligibleStudents.length === 0 ? (
                <View style={styles.noSearchResults}>
                  <Text style={styles.noSearchText}>No matching students found.</Text>
                </View>
              ) : (
                eligibleStudents.map((st) => (
                  <View key={st.rollNumber} style={styles.candidateItem}>
                    <View style={styles.candidateInfo}>
                      <Text style={styles.candidateName}>{st.name}</Text>
                      <Text style={styles.candidateMeta}>
                        {st.rollNumber} • {st.department} • {st.year}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addCandidateBtn}
                      activeOpacity={0.7}
                      onPress={() => handleAddMember(st)}
                    >
                      <Ionicons name="add" size={16} color="#FFFFFF" />
                      <Text style={styles.addCandidateBtnText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Project Type Picker ── */}
      <Modal
        visible={typeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTypeModalVisible(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerTitle}>Select Project Type</Text>
            {PROJECT_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.pickerItem,
                  projectCategory === t && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setProjectCategory(t);
                  setTypeModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    projectCategory === t && styles.pickerItemTextActive,
                  ]}
                >
                  {t}
                </Text>
                {projectCategory === t && (
                  <Ionicons name="checkmark" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Modal: Domain Picker ── */}
      <Modal
        visible={domainModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDomainModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDomainModalVisible(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerTitle}>Select Domain</Text>
            {PROJECT_DOMAINS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.pickerItem,
                  domain === d && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setDomain(d);
                  setDomainModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    domain === d && styles.pickerItemTextActive,
                  ]}
                >
                  {d}
                </Text>
                {domain === d && (
                  <Ionicons name="checkmark" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sectionNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  sectionCardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  textInput: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: '#0F172A',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
    minHeight: 80,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 11.5,
    color: '#DC2626',
    marginTop: 4,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  dropdownSelector: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dropdownValueText: {
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  academicInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  academicCol: {
    flex: 1,
  },
  academicLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  academicVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  creatorCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  creatorAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
  },
  creatorInfoCol: {
    flex: 1,
  },
  creatorRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  leaderBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  leaderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  creatorMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  respInputWrap: {
    marginTop: 8,
  },
  respInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  respInput: {
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12.5,
    color: '#0F172A',
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
  suggestionChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  suggestionChipText: {
    fontSize: 10.5,
    color: '#2563EB',
    fontWeight: '600',
  },
  teammatesSection: {
    marginTop: 16,
  },
  teammatesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teammatesSubHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  addTeammateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addTeammateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  noMembersBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
  },
  noMembersText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 16,
  },
  memberItemCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  memberTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  memberInfo: {
    flex: 1,
  },
  memberItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  memberItemMeta: {
    fontSize: 11.5,
    color: '#64748B',
  },
  removeMemberBtn: {
    padding: 6,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mentorAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mentorInfoCol: {
    flex: 1,
  },
  mentorNameText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  mentorSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  mentorReadonlyTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
  },
  unassignedMentorBox: {
    padding: 8,
  },
  unassignedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  unassignedSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  saveChangesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 4,
  },
  saveChangesBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchModalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  candidateScrollView: {
    maxHeight: 320,
  },
  noSearchResults: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noSearchText: {
    fontSize: 13,
    color: '#64748B',
  },
  candidateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  candidateInfo: {
    flex: 1,
    paddingRight: 10,
  },
  candidateName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  candidateMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  addCandidateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addCandidateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pickerModalCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerItemActive: {
    backgroundColor: '#F8FAFC',
  },
  pickerItemText: {
    fontSize: 13.5,
    color: '#334155',
  },
  pickerItemTextActive: {
    color: '#2563EB',
    fontWeight: '700',
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
    textAlign: 'center',
    lineHeight: 18,
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
