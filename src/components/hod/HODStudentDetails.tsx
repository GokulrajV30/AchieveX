import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHODStore,
  subscribeHODData,
  type HODFacultyMember,
} from '../../data/hodWorkspaceData';

interface HODStudentDetailsProps {
  studentId: string;
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HODStudentDetails({
  studentId,
  onGoBack,
  onNavigate,
}: HODStudentDetailsProps) {
  const [, setTick] = useState(0);
  const store = getHODStore();

  useEffect(() => {
    const unsub = subscribeHODData(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const student = store.getStudentById(studentId) || store.students[0];
  const proctor = store.getStudentProctor(student.id);
  const mentor = store.getStudentMentor(student.id);
  const activeProject = store.getStudentActiveProject(student.id);
  const proctorAssignment = proctor ? store.getProctorAssignmentForFaculty(proctor.id) : undefined;

  // ════════════════════════════════════════════════
  // Faculty Assignment State (Proctor & Mentor)
  // ════════════════════════════════════════════════
  const [modalMode, setModalMode] = useState<'assign' | 'change' | 'remove' | null>(null);
  const [targetResp, setTargetResp] = useState<'proctor' | 'mentor'>('proctor');
  const [facultySearch, setFacultySearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<HODFacultyMember | null>(null);
  const [confirmStep, setConfirmStep] = useState(false);

  const currentAssignedFaculty = targetResp === 'proctor' ? proctor : mentor;

  const openAssignModal = (resp: 'proctor' | 'mentor') => {
    setTargetResp(resp);
    setFacultySearch('');
    setSelectedFaculty(null);
    setConfirmStep(false);
    setModalMode('assign');
  };

  const openChangeModal = (resp: 'proctor' | 'mentor') => {
    setTargetResp(resp);
    setFacultySearch('');
    setSelectedFaculty(null);
    setConfirmStep(false);
    setModalMode('change');
  };

  const openRemoveModal = (resp: 'proctor' | 'mentor') => {
    setTargetResp(resp);
    setModalMode('remove');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedFaculty(null);
    setConfirmStep(false);
  };

  const eligibleFaculty = store.faculty.filter((f) => {
    // If in change mode, exclude current faculty from candidates
    if (modalMode === 'change' && currentAssignedFaculty?.id === f.id) {
      return false;
    }
    if (!facultySearch.trim()) return true;
    const q = facultySearch.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.facultyId.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q)
    );
  });

  const handleSelectFaculty = (f: HODFacultyMember) => {
    setSelectedFaculty(f);
    setConfirmStep(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedFaculty) return;
    store.assignFacultyToStudent(student.id, selectedFaculty.id, targetResp);
    closeModal();
  };

  const handleConfirmRemove = () => {
    store.removeFacultyAssignment(student.id, targetResp);
    closeModal();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Student Details</Text>
            <Text style={styles.headerSubtitle}>{student.name}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Read-only Alert Notice */}
          <View style={styles.authorityNotice}>
            <Ionicons name="information-circle" size={16} color="#0F766E" style={{ marginRight: 6 }} />
            <Text style={styles.authorityNoticeText}>
              Department Monitoring View • HOD manages Proctor & Mentor assignments. Verification is handled by Academic Coordinator.
            </Text>
          </View>

          {/* Student Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Ionicons name="school" size={28} color="#0F766E" />
            </View>
            <Text style={styles.nameText}>{student.name}</Text>
            <Text style={styles.rollText}>{student.rollNumber}</Text>
            <Text style={styles.deptText}>
              {student.department} • {student.year} • {student.section}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{student.achievementsCount}</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: '#16A34A' }]}>{student.verifiedCount}</Text>
                <Text style={styles.statLabel}>Verified by AC</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: '#0F766E' }]}>{student.nptelCredits} Cr</Text>
                <Text style={styles.statLabel}>NPTEL Credits</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              FACULTY SUPPORT (PROCTOR & PROJECT MENTOR)
              Clean Responsibility Model
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#0F766E" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>FACULTY SUPPORT</Text>
            </View>

            {/* 1. PROCTOR ROW */}
            <View style={styles.assignmentBlock}>
              <View style={styles.assignmentHeaderRow}>
                <View style={[styles.respBadge, { backgroundColor: '#CCFBF1' }]}>
                  <Ionicons name="shield" size={12} color="#0F766E" style={{ marginRight: 4 }} />
                  <Text style={[styles.respBadgeText, { color: '#0F766E' }]}>PROCTOR</Text>
                </View>
                {proctor && (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>Active</Text>
                  </View>
                )}
              </View>

              {proctor ? (
                <View style={styles.assignedContent}>
                  <View style={styles.facultyInfoRow}>
                    <View style={styles.facultyMiniAvatar}>
                      <Ionicons name="person" size={16} color="#0F766E" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.assignedFacultyName}>{proctor.name}</Text>
                      <Text style={styles.assignedFacultyMeta}>
                        {proctor.designation} • {proctor.department}
                      </Text>
                      <Text style={{ fontSize: 11.5, color: '#0F766E', marginTop: 2, fontWeight: '600' }}>
                        Scope: {proctorAssignment?.year || student.year} • {proctorAssignment?.section || student.section}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.changeActionBtn}
                      activeOpacity={0.7}
                      onPress={() => onNavigate('hodProctorAssignments')}
                    >
                      <Ionicons name="eye-outline" size={13} color="#0F766E" style={{ marginRight: 4 }} />
                      <Text style={styles.changeActionText}>View Proctor Scope →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.unassignedContent}>
                  <View style={styles.unassignedRow}>
                    <Ionicons name="alert-circle-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
                    <Text style={styles.unassignedTitle}>No Proctor Assigned</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.assignNewBtn}
                    activeOpacity={0.8}
                    onPress={() => onNavigate('hodProctorAssignments')}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.assignNewBtnText}>Assign Proctor in Scope →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* DIVIDER BETWEEN PROCTOR & MENTOR */}
            <View style={styles.assignmentDivider} />

            {/* 2. PROJECT MENTOR ROW */}
            <View style={styles.assignmentBlock}>
              <View style={styles.assignmentHeaderRow}>
                <View style={[styles.respBadge, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="school" size={12} color="#7C3AED" style={{ marginRight: 4 }} />
                  <Text style={[styles.respBadgeText, { color: '#7C3AED' }]}>PROJECT MENTOR</Text>
                </View>
                {mentor && (
                  <View style={[styles.activePill, { backgroundColor: '#F3E8FF' }]}>
                    <Text style={[styles.activePillText, { color: '#7C3AED' }]}>Active</Text>
                  </View>
                )}
              </View>

              {activeProject ? (
                <View style={styles.assignedContent}>
                  <View style={{ backgroundColor: '#F8FAFC', borderRadius: 8, padding: 8, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
                    <Text style={{ fontSize: 12, color: '#475569' }}>
                      Project: <Text style={{ fontWeight: '700', color: '#1E293B' }}>{activeProject.title}</Text>{' '}
                      ({activeProject.projectType === 'team' ? activeProject.teamName || 'Team' : 'Individual'})
                    </Text>
                  </View>

                  {mentor ? (
                    <View style={styles.facultyInfoRow}>
                      <View style={[styles.facultyMiniAvatar, { backgroundColor: '#FAF5FF' }]}>
                        <Ionicons name="person" size={16} color="#7C3AED" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.assignedFacultyName}>{mentor.name}</Text>
                        <Text style={styles.assignedFacultyMeta}>
                          {mentor.designation} • {mentor.department}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.unassignedRow, { marginVertical: 4 }]}>
                      <Ionicons name="alert-circle-outline" size={15} color="#D97706" style={{ marginRight: 6 }} />
                      <Text style={[styles.unassignedTitle, { color: '#D97706' }]}>
                        Awaiting Mentor Assignment
                      </Text>
                    </View>
                  )}

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.changeActionBtn, { borderColor: '#E9D5FF', backgroundColor: '#FAF5FF' }]}
                      activeOpacity={0.7}
                      onPress={() => onNavigate('hodMentorAssignments')}
                    >
                      <Ionicons name="settings-outline" size={13} color="#7C3AED" style={{ marginRight: 4 }} />
                      <Text style={[styles.changeActionText, { color: '#7C3AED' }]}>
                        Manage Project Mentor →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.unassignedContent}>
                  <View style={styles.unassignedRow}>
                    <Ionicons name="information-circle-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
                    <Text style={styles.unassignedTitle}>No Project Registered Yet</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#64748B', lineHeight: 17, marginTop: 4 }}>
                    Faculty Mentors are assigned to student project teams by HOD. Once a project team is formed, the assigned Mentor will appear here.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Academic Profile Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Academic Information</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Register / Roll Number</Text>
              <Text style={styles.infoValue}>{student.rollNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Semester</Text>
              <Text style={styles.infoValue}>{student.semester}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Year & Section</Text>
              <Text style={styles.infoValue}>
                {student.year} • {student.section}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Institution</Text>
              <Text style={styles.infoValue}>Nandha Engineering College</Text>
            </View>
          </View>

          {/* Achievements Summary List */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>
                Verified Achievements ({student.verifiedCount})
              </Text>
            </View>

            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Smart India Hackathon 2026</Text>
                <Text style={styles.itemMeta}>Hackathon • National • Winner • AC Verified</Text>
              </View>
              <View style={styles.verifiedTag}>
                <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 3 }} />
                <Text style={styles.verifiedTagText}>Verified</Text>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>NPTEL Elite Certificate: Internet of Things</Text>
                <Text style={styles.itemMeta}>Online Course • 3 Academic Credits Approved</Text>
              </View>
              <View style={styles.verifiedTag}>
                <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 3 }} />
                <Text style={styles.verifiedTagText}>Verified</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            BOTTOM SHEET MODALS: ASSIGN / CHANGE / REMOVE
        ════════════════════════════════════════════════ */}
        <Modal
          visible={modalMode !== null}
          transparent
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {/* ── 1. ASSIGN MODAL FLOW ── */}
              {modalMode === 'assign' && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalTitle}>
                        {confirmStep
                          ? `Assign ${targetResp === 'proctor' ? 'Proctor' : 'Mentor'}?`
                          : `ASSIGN ${targetResp === 'proctor' ? 'PROCTOR' : 'MENTOR'}`}
                      </Text>
                      <Text style={styles.modalSubtitle}>
                        Student: {student.name} • {student.rollNumber}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
                      <Ionicons name="close" size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  {!confirmStep ? (
                    <>
                      {/* Search Faculty */}
                      <View style={styles.modalSearchBox}>
                        <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                        <TextInput
                          style={styles.modalSearchInput}
                          placeholder="Search Faculty..."
                          placeholderTextColor="#94A3B8"
                          value={facultySearch}
                          onChangeText={setFacultySearch}
                        />
                        {facultySearch.length > 0 && (
                          <TouchableOpacity onPress={() => setFacultySearch('')}>
                            <Ionicons name="close-circle" size={16} color="#94A3B8" />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Faculty List */}
                      <ScrollView style={styles.modalFacultyList} showsVerticalScrollIndicator={false}>
                        {eligibleFaculty.map((f) => (
                          <View key={f.id} style={styles.facultyPickItem}>
                            <View style={styles.facultyPickAvatar}>
                              <Ionicons name="person" size={16} color="#0F766E" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.facultyPickName}>{f.name}</Text>
                              <Text style={styles.facultyPickMeta}>{f.designation}</Text>
                              <Text style={styles.facultyPickSub}>{f.department}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.assignBtnPill}
                              activeOpacity={0.8}
                              onPress={() => handleSelectFaculty(f)}
                            >
                              <Text style={styles.assignBtnPillText}>Assign</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </>
                  ) : (
                    /* Confirmation Step */
                    <View style={styles.confirmContainer}>
                      <View style={styles.confirmCard}>
                        <Text style={styles.confirmCardTitle}>Confirmation</Text>
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmLabel}>Student</Text>
                          <Text style={styles.confirmValue}>{student.name}</Text>
                        </View>
                        <View style={[styles.confirmRow, { borderBottomWidth: 0 }]}>
                          <Text style={styles.confirmLabel}>
                            {targetResp === 'proctor' ? 'Proctor' : 'Mentor'}
                          </Text>
                          <Text style={[styles.confirmValue, { color: '#0F766E', fontWeight: '800' }]}>
                            {selectedFaculty?.name}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.confirmActionsRow}>
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          activeOpacity={0.7}
                          onPress={() => setConfirmStep(false)}
                        >
                          <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.confirmPrimaryBtn}
                          activeOpacity={0.8}
                          onPress={handleConfirmAssignment}
                        >
                          <Text style={styles.confirmPrimaryBtnText}>Assign</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
              )}

              {/* ── 2. CHANGE MODAL FLOW ── */}
              {modalMode === 'change' && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalTitle}>
                        {confirmStep
                          ? `Change ${targetResp === 'proctor' ? 'Proctor' : 'Mentor'}?`
                          : `CHANGE ${targetResp === 'proctor' ? 'PROCTOR' : 'MENTOR'}`}
                      </Text>
                      <Text style={styles.modalSubtitle}>
                        Student: {student.name} • {student.rollNumber}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
                      <Ionicons name="close" size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  {!confirmStep ? (
                    <>
                      {/* Current Faculty Banner */}
                      <View style={styles.currentBanner}>
                        <Text style={styles.currentBannerLabel}>
                          CURRENT {targetResp === 'proctor' ? 'PROCTOR' : 'MENTOR'}
                        </Text>
                        <Text style={styles.currentBannerName}>{currentAssignedFaculty?.name}</Text>
                        <Text style={styles.currentBannerSub}>
                          {currentAssignedFaculty?.designation} • {currentAssignedFaculty?.department}
                        </Text>
                      </View>

                      {/* Select New Faculty Section */}
                      <Text style={styles.selectNewHeader}>
                        SELECT NEW {targetResp === 'proctor' ? 'PROCTOR' : 'MENTOR'}
                      </Text>

                      <View style={styles.modalSearchBox}>
                        <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                        <TextInput
                          style={styles.modalSearchInput}
                          placeholder="Search Faculty..."
                          placeholderTextColor="#94A3B8"
                          value={facultySearch}
                          onChangeText={setFacultySearch}
                        />
                        {facultySearch.length > 0 && (
                          <TouchableOpacity onPress={() => setFacultySearch('')}>
                            <Ionicons name="close-circle" size={16} color="#94A3B8" />
                          </TouchableOpacity>
                        )}
                      </View>

                      <ScrollView style={styles.modalFacultyList} showsVerticalScrollIndicator={false}>
                        {eligibleFaculty.map((f) => (
                          <TouchableOpacity
                            key={f.id}
                            style={styles.facultyPickItem}
                            activeOpacity={0.7}
                            onPress={() => handleSelectFaculty(f)}
                          >
                            <View style={styles.facultyPickAvatar}>
                              <Ionicons name="person" size={16} color="#0F766E" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.facultyPickName}>{f.name}</Text>
                              <Text style={styles.facultyPickMeta}>{f.designation}</Text>
                            </View>
                            <View style={styles.selectTag}>
                              <Text style={styles.selectTagText}>Select →</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </>
                  ) : (
                    /* Confirmation Step */
                    <View style={styles.confirmContainer}>
                      <View style={styles.confirmCard}>
                        <Text style={styles.confirmCardTitle}>Confirm Change</Text>
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmLabel}>Student</Text>
                          <Text style={styles.confirmValue}>{student.name}</Text>
                        </View>
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmLabel}>
                            Current {targetResp === 'proctor' ? 'Proctor' : 'Mentor'}
                          </Text>
                          <Text style={styles.confirmValue}>{currentAssignedFaculty?.name}</Text>
                        </View>
                        <View style={[styles.confirmRow, { borderBottomWidth: 0 }]}>
                          <Text style={styles.confirmLabel}>
                            New {targetResp === 'proctor' ? 'Proctor' : 'Mentor'}
                          </Text>
                          <Text style={[styles.confirmValue, { color: '#0F766E', fontWeight: '800' }]}>
                            {selectedFaculty?.name}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.confirmActionsRow}>
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          activeOpacity={0.7}
                          onPress={() => setConfirmStep(false)}
                        >
                          <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.confirmPrimaryBtn}
                          activeOpacity={0.8}
                          onPress={handleConfirmAssignment}
                        >
                          <Text style={styles.confirmPrimaryBtnText}>Confirm Change</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
              )}

              {/* ── 3. REMOVE MODAL FLOW ── */}
              {modalMode === 'remove' && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.modalTitle, { color: '#DC2626' }]}>
                        REMOVE {targetResp === 'proctor' ? 'PROCTOR' : 'MENTOR'}?
                      </Text>
                      <Text style={styles.modalSubtitle}>Student: {student.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
                      <Ionicons name="close" size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.removeModalBody}>
                    <Text style={styles.removeNoticeText}>
                      <Text style={{ fontWeight: '700', color: '#0F172A' }}>{student.name}</Text> is
                      currently assigned to:
                    </Text>

                    <View style={styles.removeFacultyBox}>
                      <Text style={styles.removeFacultyName}>
                        {currentAssignedFaculty?.name || 'Faculty'}
                      </Text>
                      <Text style={styles.removeFacultyMeta}>
                        {currentAssignedFaculty?.designation} • {currentAssignedFaculty?.department}
                      </Text>
                    </View>

                    <Text style={styles.removeWarningText}>
                      Removing this assignment means the student will temporarily have no assigned{' '}
                      {targetResp === 'proctor' ? 'Proctor' : 'Mentor'}.
                    </Text>

                    <View style={styles.confirmActionsRow}>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        activeOpacity={0.7}
                        onPress={closeModal}
                      >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeDestructiveBtn}
                        activeOpacity={0.8}
                        onPress={handleConfirmRemove}
                      >
                        <Text style={styles.removeDestructiveBtnText}>
                          Remove {targetResp === 'proctor' ? 'Proctor' : 'Mentor'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  authorityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  authorityNoticeText: {
    fontSize: 11,
    color: '#0F766E',
    lineHeight: 16,
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  rollText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 1,
  },
  deptText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  assignmentBlock: {
    paddingVertical: 4,
  },
  assignmentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  respBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  respBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  assignedContent: {
    marginTop: 2,
  },
  facultyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  facultyMiniAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignedFacultyName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  assignedFacultyMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    paddingLeft: 42,
  },
  changeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  changeActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  removeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  removeActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  unassignedContent: {
    marginTop: 2,
  },
  unassignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unassignedTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  assignNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  assignNewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  assignmentDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
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
    fontSize: 12,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 8,
  },
  verifiedTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentBannerLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  currentBannerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  currentBannerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  selectNewHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 2,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 40,
    marginVertical: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  modalFacultyList: {
    maxHeight: 280,
  },
  facultyPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 10,
  },
  facultyPickAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyPickName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  facultyPickMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  facultyPickSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  assignBtnPill: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  assignBtnPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  selectTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },

  /* Confirmation Step */
  confirmContainer: {
    paddingVertical: 12,
  },
  confirmCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  confirmCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  confirmLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  confirmValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  confirmActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmPrimaryBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Remove Modal */
  removeModalBody: {
    paddingVertical: 12,
  },
  removeNoticeText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 12,
  },
  removeFacultyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  removeFacultyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  removeFacultyMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  removeWarningText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 18,
  },
  removeDestructiveBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeDestructiveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
