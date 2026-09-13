import React, { useState, useEffect, useMemo } from 'react';
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
  HOD_YEAR_OPTIONS,
  type HODStudentMember,
} from '../../data/hodWorkspaceData';

interface HODFacultyDetailsProps {
  facultyId: string;
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HODFacultyDetails({
  facultyId,
  onGoBack,
  onNavigate,
}: HODFacultyDetailsProps) {
  const [, setTick] = useState(0);
  const store = getHODStore();

  useEffect(() => {
    const unsub = subscribeHODData(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const faculty = store.getFacultyById(facultyId) || store.faculty[0];
  const submissions = store.submissions.filter(
    (s) => s.facultyId === faculty.facultyId || s.facultyName === faculty.name
  );

  const proctorAssignment = store.getProctorAssignmentForFaculty(faculty.id);
  const proctorStudents = store.getProctorStudents(faculty.id);
  const mentoredProjects = store.getProjectsForFacultyMentor(faculty.id);
  const derivedMentees = store.getDerivedMenteesForFaculty(faculty.id);

  // Bulk Assignment Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalResp, setModalResp] = useState<'proctor' | 'mentor'>('proctor');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('All Years');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const openBulkModal = (resp: 'proctor' | 'mentor') => {
    setModalResp(resp);
    setStudentSearch('');
    setSelectedYearFilter('All Years');
    // Pre-select students already assigned to this faculty for this responsibility
    const currentAssignedIds =
      resp === 'proctor'
        ? proctorStudents.map((s) => s.id)
        : derivedMentees.map((m) => m.student.id);
    setSelectedStudentIds(currentAssignedIds);
    setModalVisible(true);
  };

  const filteredStudents = useMemo(() => {
    return store.students.filter((st) => {
      if (selectedYearFilter !== 'All Years' && st.year !== selectedYearFilter) return false;
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        const matchName = st.name.toLowerCase().includes(q);
        const matchRoll = st.rollNumber.toLowerCase().includes(q);
        const matchSec = st.section.toLowerCase().includes(q);
        if (!matchName && !matchRoll && !matchSec) return false;
      }
      return true;
    });
  }, [store.students, selectedYearFilter, studentSearch]);

  const toggleSelectStudent = (stId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
  };

  const handleConfirmBulkAssign = () => {
    if (selectedStudentIds.length === 0) {
      Alert.alert('No Students Selected', 'Please select at least one student to assign.');
      return;
    }

    // Check if any selected student is assigned to another faculty
    const reassignedStudents: { student: HODStudentMember; previousFaculty: string }[] = [];
    selectedStudentIds.forEach((id) => {
      const existing =
        modalResp === 'proctor' ? store.getStudentProctor(id) : store.getStudentMentor(id);
      if (existing && existing.id !== faculty.id) {
        const st = store.getStudentById(id);
        if (st) {
          reassignedStudents.push({ student: st, previousFaculty: existing.name });
        }
      }
    });

    const doAssign = () => {
      store.bulkAssignStudents(selectedStudentIds, faculty.id, modalResp);
      setModalVisible(false);
      Alert.alert(
        'Assignment Successful',
        `Assigned ${selectedStudentIds.length} students to ${faculty.name} as ${
          modalResp === 'proctor' ? 'Proctor' : 'Project Mentor'
        }. All students have been notified.`,
        [{ text: 'OK' }]
      );
    };

    if (reassignedStudents.length > 0) {
      Alert.alert(
        'Reassignment Confirmation',
        `${reassignedStudents.length} student(s) currently have other faculty assigned. Do you want to transfer their assignment to ${faculty.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm Transfer', onPress: doAssign },
        ]
      );
    } else {
      doAssign();
    }
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
            <Text style={styles.headerTitle}>Faculty Portfolio</Text>
            <Text style={styles.headerSubtitle}>{faculty.name}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={28} color="#0F766E" />
            </View>
            <Text style={styles.nameText}>{faculty.name}</Text>
            <Text style={styles.designationText}>{faculty.designation}</Text>
            <Text style={styles.deptText}>
              {faculty.department} • {faculty.facultyId}
            </Text>

            <View style={styles.metaBadgeRow}>
              <View style={styles.metaBadge}>
                <Ionicons name="school-outline" size={12} color="#0F766E" style={{ marginRight: 4 }} />
                <Text style={styles.metaBadgeText}>{faculty.specialization}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{faculty.achievementsCount}</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: '#16A34A' }]}>{faculty.verifiedCount}</Text>
                <Text style={styles.statLabel}>Verified</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: '#D97706' }]}>{faculty.pendingCount}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              ASSIGNED RESPONSIBILITIES (PROCTOR & MENTOR)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="briefcase-outline" size={16} color="#0F766E" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Assigned Responsibilities</Text>
            </View>

            {/* Proctor Box */}
            <View style={styles.respBox}>
              <View style={styles.respBoxTop}>
                <View style={styles.respTitleGroup}>
                  <View style={[styles.respBadge, { backgroundColor: '#CCFBF1' }]}>
                    <Ionicons name="shield" size={12} color="#0F766E" style={{ marginRight: 4 }} />
                    <Text style={[styles.respBadgeText, { color: '#0F766E' }]}>PROCTOR</Text>
                  </View>
                  <Text style={styles.respCountText}>
                    {proctorAssignment
                      ? `${proctorAssignment.year} • ${proctorAssignment.section}`
                      : 'No Active Scope'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.assignBtn}
                  activeOpacity={0.7}
                  onPress={() => onNavigate('hodProctorAssignments')}
                >
                  <Text style={styles.assignBtnText}>
                    {proctorAssignment ? 'Manage Scope →' : 'Assign Scope →'}
                  </Text>
                </TouchableOpacity>
              </View>

              {proctorAssignment ? (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 12.5, color: '#0F766E', fontWeight: '700' }}>
                    {proctorStudents.length} Students Added by Proctor
                  </Text>
                  {proctorStudents.length > 0 && (
                    <View style={styles.assignedStudentsRow}>
                      {proctorStudents.slice(0, 3).map((st) => (
                        <View key={st.id} style={styles.studentChip}>
                          <Text style={styles.studentChipText} numberOfLines={1}>
                            {st.name} ({st.rollNumber})
                          </Text>
                        </View>
                      ))}
                      {proctorStudents.length > 3 && (
                        <View style={[styles.studentChip, { backgroundColor: '#E2E8F0' }]}>
                          <Text style={[styles.studentChipText, { color: '#475569', fontWeight: '700' }]}>
                            +{proctorStudents.length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.noAssignmentText}>No proctor academic scope assigned.</Text>
              )}
            </View>

            {/* Project Mentor Box */}
            <View style={[styles.respBox, { marginTop: 10 }]}>
              <View style={styles.respBoxTop}>
                <View style={styles.respTitleGroup}>
                  <View style={[styles.respBadge, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="school" size={12} color="#7C3AED" style={{ marginRight: 4 }} />
                    <Text style={[styles.respBadgeText, { color: '#7C3AED' }]}>PROJECT MENTOR</Text>
                  </View>
                  <Text style={styles.respCountText}>
                    {mentoredProjects.length} Active {mentoredProjects.length === 1 ? 'Project' : 'Projects'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.assignBtn}
                  activeOpacity={0.7}
                  onPress={() => onNavigate('hodMentorAssignments')}
                >
                  <Text style={[styles.assignBtnText, { color: '#7C3AED' }]}>View Projects →</Text>
                </TouchableOpacity>
              </View>

              {mentoredProjects.length > 0 ? (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 12.5, color: '#7C3AED', fontWeight: '700' }}>
                    {derivedMentees.length} Students Mentored
                  </Text>
                  <View style={styles.assignedStudentsRow}>
                    {mentoredProjects.slice(0, 2).map((p) => (
                      <View key={p.id} style={[styles.studentChip, { backgroundColor: '#FAF5FF', borderColor: '#F3E8FF' }]}>
                        <Text style={[styles.studentChipText, { color: '#6D28D9' }]} numberOfLines={1}>
                          {p.title} ({p.members.length} members)
                        </Text>
                      </View>
                    ))}
                    {mentoredProjects.length > 2 && (
                      <View style={[styles.studentChip, { backgroundColor: '#E2E8F0' }]}>
                        <Text style={[styles.studentChipText, { color: '#475569', fontWeight: '700' }]}>
                          +{mentoredProjects.length - 2} more
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <Text style={styles.noAssignmentText}>No projects currently mentored.</Text>
              )}
            </View>
          </View>

          {/* Contact & Department Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={16} color="#0F766E" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{faculty.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{faculty.department}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joining Date</Text>
              <Text style={styles.infoValue}>{faculty.joiningDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Institution</Text>
              <Text style={styles.infoValue}>Nandha Engineering College</Text>
            </View>
          </View>

          {/* Recent Submissions */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>
                Recent Achievements & Submissions ({submissions.length})
              </Text>
            </View>

            {submissions.length === 0 ? (
              <Text style={styles.emptyText}>No recent submissions recorded.</Text>
            ) : (
              submissions.map((sub) => {
                const isApproved = sub.status === 'Approved';
                return (
                  <TouchableOpacity
                    key={sub.id}
                    style={styles.subItem}
                    activeOpacity={0.75}
                    onPress={() => onNavigate('hodFacultyReview', { submissionId: sub.id })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.subTitle}>{sub.achievementTitle}</Text>
                      <Text style={styles.subMeta}>
                        {sub.category} • {sub.level} • {sub.date}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        isApproved ? styles.statusPillApproved : styles.statusPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isApproved ? styles.statusTextApproved : styles.statusTextPending,
                        ]}
                      >
                        {sub.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            BULK STUDENT ASSIGNMENT MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>
                    Assign Students to {faculty.name}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    Responsibility: {modalResp === 'proctor' ? 'Proctor' : 'Project Mentor'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.modalSearchBox}>
                <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search students by name, roll number, or sec..."
                  placeholderTextColor="#94A3B8"
                  value={studentSearch}
                  onChangeText={setStudentSearch}
                />
                {studentSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setStudentSearch('')}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Year Filter Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsRow}
                style={{ maxHeight: 36, marginBottom: 10 }}
              >
                {HOD_YEAR_OPTIONS.map((yr) => {
                  const isSelected = selectedYearFilter === yr;
                  return (
                    <TouchableOpacity
                      key={yr}
                      style={[styles.yearChip, isSelected && styles.yearChipActive]}
                      onPress={() => setSelectedYearFilter(yr)}
                    >
                      <Text style={[styles.yearChipText, isSelected && styles.yearChipTextActive]}>
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Multi-select Student List */}
              <ScrollView style={styles.studentSelectList} showsVerticalScrollIndicator={false}>
                {filteredStudents.map((st) => {
                  const isSelected = selectedStudentIds.includes(st.id);
                  const existingFaculty =
                    modalResp === 'proctor'
                      ? store.getStudentProctor(st.id)
                      : store.getStudentMentor(st.id);
                  const isOtherFaculty = existingFaculty && existingFaculty.id !== faculty.id;

                  return (
                    <TouchableOpacity
                      key={st.id}
                      style={[
                        styles.studentSelectCard,
                        isSelected && styles.studentSelectCardActive,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => toggleSelectStudent(st.id)}
                    >
                      {/* Checkbox */}
                      <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.selectStudentName}>{st.name}</Text>
                        <Text style={styles.selectStudentMeta}>
                          {st.rollNumber} • {st.year} • {st.section}
                        </Text>
                        {isOtherFaculty && (
                          <View style={styles.reassignNoticePill}>
                            <Ionicons name="warning-outline" size={11} color="#D97706" style={{ marginRight: 3 }} />
                            <Text style={styles.reassignNoticeText}>
                              Currently: {existingFaculty.name}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Selection Bar & Footer */}
              <View style={styles.modalFooter}>
                <Text style={styles.selectedCountText}>
                  {selectedStudentIds.length} Student{selectedStudentIds.length !== 1 ? 's' : ''} Selected
                </Text>
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    activeOpacity={0.7}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmBulkBtn}
                    activeOpacity={0.8}
                    onPress={handleConfirmBulkAssign}
                  >
                    <Text style={styles.confirmBulkBtnText}>
                      Confirm Assignment ({selectedStudentIds.length})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  designationText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 1,
  },
  deptText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  metaBadgeRow: {
    marginTop: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F766E',
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
  respBox: {
    backgroundColor: '#FAF8F5',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  respBoxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  respTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  respCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  assignBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  assignBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  assignedStudentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  studentChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: '48%',
  },
  studentChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F766E',
  },
  noAssignmentText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 2,
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
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  subTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  subMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusPillApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextApproved: {
    color: '#16A34A',
  },
  statusTextPending: {
    color: '#D97706',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    paddingVertical: 8,
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11.5,
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
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 38,
    marginVertical: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  yearChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  yearChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  yearChipTextActive: {
    color: '#0F766E',
    fontWeight: '700',
  },
  studentSelectList: {
    maxHeight: 280,
  },
  studentSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  studentSelectCardActive: {
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  selectStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectStudentMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  reassignNoticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  reassignNoticeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  modalFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  selectedCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmBulkBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBulkBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
