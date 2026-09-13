// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Proctor Responsibility & Scope Management
// Flow: HOD assigns Faculty + Scope (Year, Section, Academic Year)
// Proctor will then select their own students within that scope.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import HODBottomTab from './HODBottomTab';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import {
  getHODStore,
  subscribeHODData,
  type ProctorAssignment,
  type HODFacultyMember,
  type HODStudentMember,
} from '../../data/hodWorkspaceData';

interface HODProctorAssignmentsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

const YEAR_OPTIONS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const;
const SECTION_OPTIONS = ['All Sections', 'Section A', 'Section B'] as const;
const ACADEMIC_YEARS = ['2026–27', '2025–26'] as const;

export default function HODProctorAssignments({
  onGoBack,
  onNavigate,
}: HODProctorAssignmentsProps) {
  const [store, setStore] = useState(() => getHODStore());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('All Years');

  // Modal states
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assignStep, setAssignStep] = useState<1 | 2 | 3>(1); // 1: Select Faculty, 2: Define Scope, 3: Review
  const [selectedFacultyForAssign, setSelectedFacultyForAssign] = useState<HODFacultyMember | null>(null);
  const [facultySearchQuery, setFacultySearchQuery] = useState('');
  const [scopeYear, setScopeYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('3rd Year');
  const [scopeSection, setScopeSection] = useState<'Section A' | 'Section B'>('Section A');
  const [scopeAcademicYear, setScopeAcademicYear] = useState<string>('2026–27');

  // Change Scope modal state
  const [editingAssignment, setEditingAssignment] = useState<ProctorAssignment | null>(null);
  const [editYear, setEditYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('3rd Year');
  const [editSection, setEditSection] = useState<'Section A' | 'Section B'>('Section A');
  const [editAcademicYear, setEditAcademicYear] = useState<string>('2026–27');

  // Remove confirmation modal state
  const [removingAssignment, setRemovingAssignment] = useState<ProctorAssignment | null>(null);

  // View students modal state
  const [viewingProctorFaculty, setViewingProctorFaculty] = useState<HODFacultyMember | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeHODData(() => {
      setStore(getHODStore());
    });
    return unsubscribe;
  }, []);

  const activeProctorAssignments = useMemo(() => {
    return store.getProctorAssignments();
  }, [store]);

  const filteredProctors = useMemo(() => {
    return activeProctorAssignments.filter((pa) => {
      const fac = store.getFacultyById(pa.facultyId);
      if (!fac) return false;

      const matchesSearch =
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pa.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pa.year.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedYearFilter !== 'All Years' && pa.year !== selectedYearFilter) return false;

      return true;
    });
  }, [activeProctorAssignments, searchQuery, selectedYearFilter, store]);

  // Eligible faculty for Step 1
  const eligibleFacultyList = useMemo(() => {
    return store.faculty.filter((f) => {
      const query = facultySearchQuery.toLowerCase().trim();
      if (!query) return true;
      return f.name.toLowerCase().includes(query) || f.designation.toLowerCase().includes(query);
    });
  }, [store.faculty, facultySearchQuery]);

  // Handle opening Assign Proctor flow
  const handleOpenAssign = () => {
    setSelectedFacultyForAssign(null);
    setFacultySearchQuery('');
    setScopeYear('3rd Year');
    setScopeSection('Section A');
    setScopeAcademicYear('2026–27');
    setAssignStep(1);
    setIsAssignModalVisible(true);
  };

  // Confirm step 4
  const handleConfirmAssignment = () => {
    if (!selectedFacultyForAssign) return;

    store.assignFacultyProctorScope(
      selectedFacultyForAssign.id,
      scopeYear,
      scopeSection,
      scopeAcademicYear
    );

    setIsAssignModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Proctor Assigned',
      message: 'The responsibility is now active.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  // Confirm change scope
  const handleConfirmScopeChange = () => {
    if (!editingAssignment) return;

    store.updateProctorScope(editingAssignment.id, editYear, editSection, editAcademicYear);
    setEditingAssignment(null);
  };

  // Confirm remove proctor
  const handleConfirmRemove = () => {
    if (!removingAssignment) return;

    store.removeProctorAssignment(removingAssignment.id);
    setRemovingAssignment(null);
  };

  const viewingStudentsList = useMemo(() => {
    if (!viewingProctorFaculty) return [];
    return store.getProctorStudents(viewingProctorFaculty.id);
  }, [viewingProctorFaculty, store]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* 1. TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={onGoBack}
            >
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Proctor Assignments</Text>
              <Text style={styles.headerSubtitle}>Define Academic Responsibility Scopes</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.headerAddBtn}
            activeOpacity={0.8}
            onPress={handleOpenAssign}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.headerAddBtnText}>Assign</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. PROCTOR OVERVIEW HERO (AchieveX Brand Blue → Indigo) */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroCategoryPill}>
                <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Text style={styles.heroCategoryText}>PROCTOR SCOPE MANAGEMENT</Text>
              </View>
              <View style={styles.deptBadge}>
                <Text style={styles.deptBadgeText}>CSE (IoT)</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{activeProctorAssignments.length} Active Proctors</Text>
            <Text style={styles.heroSubtext}>
              Assign Faculty as Proctors and define their scope. Proctors select and manage their own assigned student groups.
            </Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{activeProctorAssignments.length}</Text>
                <Text style={styles.heroStatLabel}>Proctors</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>4</Text>
                <Text style={styles.heroStatLabel}>Academic Years</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>Section</Text>
                <Text style={styles.heroStatLabel}>Scoped Groups</Text>
              </View>
            </View>
          </LinearGradient>

          {/* 3. SEARCH & YEAR FILTERS */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search faculty name, section or year..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Year Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}
          >
            {YEAR_OPTIONS.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.filterChip,
                  selectedYearFilter === year && styles.filterChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedYearFilter(year)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedYearFilter === year && styles.filterChipTextActive,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 4. ACTIVE PROCTOR LIST */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              Active Proctors ({filteredProctors.length})
            </Text>
            <TouchableOpacity
              style={styles.addProctorActionBtn}
              activeOpacity={0.7}
              onPress={handleOpenAssign}
            >
              <Ionicons name="add-circle" size={16} color="#0F766E" style={{ marginRight: 4 }} />
              <Text style={styles.addProctorActionText}>+ Assign Proctor</Text>
            </TouchableOpacity>
          </View>

          {filteredProctors.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Proctors Found</Text>
              <Text style={styles.emptySubtitle}>
                No faculty members match the current search or filter criteria.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                activeOpacity={0.8}
                onPress={handleOpenAssign}
              >
                <Text style={styles.emptyActionBtnText}>+ Assign New Proctor</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredProctors.map((pa) => {
              const faculty = store.getFacultyById(pa.facultyId);
              if (!faculty) return null;
              const assignedStudents = store.getProctorStudents(faculty.id);

              return (
                <View key={pa.id} style={styles.proctorCard}>
                  {/* Top info row */}
                  <View style={styles.proctorHeaderRow}>
                    <View style={styles.avatarCircle}>
                      <Ionicons name="person" size={20} color="#0F766E" />
                    </View>
                    <View style={styles.facultyInfoCol}>
                      <Text style={styles.facultyNameText}>{faculty.name}</Text>
                      <Text style={styles.facultyDesignationText}>
                        {faculty.designation} • {faculty.department}
                      </Text>
                    </View>
                    <View style={styles.statusActivePill}>
                      <View style={styles.greenDot} />
                      <Text style={styles.statusActiveText}>Active</Text>
                    </View>
                  </View>

                  {/* Scope Box */}
                  <View style={styles.scopeSummaryBox}>
                    <View style={styles.scopeRow}>
                      <Ionicons name="business-outline" size={14} color="#0F766E" style={{ marginRight: 6 }} />
                      <Text style={styles.scopeLabel}>Authorized Scope:</Text>
                      <Text style={styles.scopeValue}>
                        {faculty.department} • {pa.year} • {pa.section}
                      </Text>
                    </View>
                    <View style={[styles.scopeRow, { marginTop: 4 }]}>
                      <Ionicons name="calendar-outline" size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.scopeLabel}>Academic Year:</Text>
                      <Text style={[styles.scopeValue, { color: '#64748B' }]}>{pa.academicYear}</Text>
                    </View>
                  </View>

                  {/* Students Count & Action Divider */}
                  <View style={styles.cardDivider} />

                  {/* Card Bottom: Student Count & Action Buttons */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.studentsCountBadge}
                      activeOpacity={0.7}
                      onPress={() => setViewingProctorFaculty(faculty)}
                    >
                      <Ionicons name="people" size={14} color="#0F766E" style={{ marginRight: 5 }} />
                      <Text style={styles.studentsCountText}>
                        {assignedStudents.length} Students Added
                      </Text>
                      <Ionicons name="chevron-forward" size={12} color="#0F766E" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>

                    <View style={styles.rightActionBtnsGroup}>
                      <TouchableOpacity
                        style={styles.actionBtnOutline}
                        activeOpacity={0.7}
                        onPress={() => {
                          setEditingAssignment(pa);
                          setEditYear(pa.year as any);
                          setEditSection(pa.section as any);
                          setEditAcademicYear(pa.academicYear);
                        }}
                      >
                        <Ionicons name="swap-horizontal" size={13} color="#0F766E" style={{ marginRight: 4 }} />
                        <Text style={styles.actionBtnOutlineText}>Change Scope</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtnDestructive}
                        activeOpacity={0.7}
                        onPress={() => setRemovingAssignment(pa)}
                      >
                        <Ionicons name="trash-outline" size={13} color="#DC2626" style={{ marginRight: 4 }} />
                        <Text style={styles.actionBtnDestructiveText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            STEP-BY-STEP ASSIGN PROCTOR MODAL (4 STEPS)
        ════════════════════════════════════════════════ */}
        <Modal
          visible={isAssignModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAssignModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header with Steps Indicator */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Assign Proctor</Text>
                  <Text style={styles.modalSubtitle}>
                    Step {assignStep} of 3 •{' '}
                    {assignStep === 1
                      ? 'Select Faculty'
                      : assignStep === 2
                      ? 'Define Academic Scope'
                      : 'Review & Confirm'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setIsAssignModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Step Progress Bar */}
              <View style={styles.stepsBarContainer}>
                <View style={[styles.stepSegment, assignStep >= 1 && styles.stepSegmentActive]} />
                <View style={[styles.stepSegment, assignStep >= 2 && styles.stepSegmentActive]} />
                <View style={[styles.stepSegment, assignStep >= 3 && styles.stepSegmentActive]} />
              </View>

              {/* ── STEP 1: SELECT FACULTY ── */}
              {assignStep === 1 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepLabel}>Select Eligible Faculty Member:</Text>
                  <View style={styles.modalSearchBar}>
                    <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
                    <TextInput
                      style={styles.modalSearchInput}
                      placeholder="Search faculty..."
                      placeholderTextColor="#94A3B8"
                      value={facultySearchQuery}
                      onChangeText={setFacultySearchQuery}
                    />
                  </View>

                  <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                    {eligibleFacultyList.map((f) => {
                      const isSelected = selectedFacultyForAssign?.id === f.id;
                      const hasActiveScope = activeProctorAssignments.some(
                        (pa) => pa.facultyId === f.id
                      );

                      return (
                        <TouchableOpacity
                          key={f.id}
                          style={[
                            styles.facultySelectItem,
                            isSelected && styles.facultySelectItemActive,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => setSelectedFacultyForAssign(f)}
                        >
                          <View style={styles.facultySelectLeft}>
                            <View
                              style={[
                                styles.selectRadioCircle,
                                isSelected && styles.selectRadioCircleActive,
                              ]}
                            >
                              {isSelected && <View style={styles.selectRadioInner} />}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                              <Text style={styles.selectFacultyName}>{f.name}</Text>
                              <Text style={styles.selectFacultyMeta}>
                                {f.designation} • {f.department}
                              </Text>
                              {hasActiveScope && (
                                <Text style={styles.alreadyProctorNote}>
                                  Currently proctoring another section
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.stepActionsRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setIsAssignModalVisible(false)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.continueBtn,
                        !selectedFacultyForAssign && styles.continueBtnDisabled,
                      ]}
                      disabled={!selectedFacultyForAssign}
                      onPress={() => setAssignStep(2)}
                    >
                      <Text style={styles.continueBtnText}>Continue →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ── STEP 2: DEFINE SCOPE ── */}
              {assignStep === 2 && selectedFacultyForAssign && (
                <View style={styles.stepContent}>
                  <View style={styles.selectedFacultyBanner}>
                    <Ionicons name="person-circle" size={24} color="#0F766E" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.bannerFacultyName}>{selectedFacultyForAssign.name}</Text>
                      <Text style={styles.bannerFacultyMeta}>
                        Department: {selectedFacultyForAssign.department}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.stepLabel}>Define Proctor Scope:</Text>

                  {/* Year Selection */}
                  <Text style={styles.fieldLabel}>Academic Year Level</Text>
                  <View style={styles.chipRow}>
                    {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        style={[styles.scopeChip, scopeYear === yr && styles.scopeChipActive]}
                        onPress={() => setScopeYear(yr)}
                      >
                        <Text style={[styles.scopeChipText, scopeYear === yr && styles.scopeChipTextActive]}>
                          {yr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Section Selection */}
                  <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Section</Text>
                  <View style={styles.chipRow}>
                    {(['Section A', 'Section B'] as const).map((sec) => (
                      <TouchableOpacity
                        key={sec}
                        style={[styles.scopeChip, scopeSection === sec && styles.scopeChipActive]}
                        onPress={() => setScopeSection(sec)}
                      >
                        <Text style={[styles.scopeChipText, scopeSection === sec && styles.scopeChipTextActive]}>
                          {sec}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Academic Year Selection */}
                  <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Academic Year</Text>
                  <View style={styles.chipRow}>
                    {ACADEMIC_YEARS.map((ay) => (
                      <TouchableOpacity
                        key={ay}
                        style={[styles.scopeChip, scopeAcademicYear === ay && styles.scopeChipActive]}
                        onPress={() => setScopeAcademicYear(ay)}
                      >
                        <Text style={[styles.scopeChipText, scopeAcademicYear === ay && styles.scopeChipTextActive]}>
                          {ay}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.scopeNoticeText}>
                    💡 Note: This authorizes {selectedFacultyForAssign.name} to select students ONLY from {scopeYear} {scopeSection}. Students are not automatically enrolled until the Proctor adds them.
                  </Text>

                  <View style={styles.stepActionsRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setAssignStep(1)}
                    >
                      <Text style={styles.cancelBtnText}>← Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.continueBtn}
                      onPress={() => setAssignStep(3)}
                    >
                      <Text style={styles.continueBtnText}>Review →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ── STEP 3: REVIEW & CONFIRM ── */}
              {assignStep === 3 && selectedFacultyForAssign && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepLabel}>Review Assignment Details:</Text>

                  <View style={styles.reviewCard}>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Faculty:</Text>
                      <Text style={styles.reviewValue}>{selectedFacultyForAssign.name}</Text>
                    </View>
                    <View style={styles.reviewDivider} />
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Responsibility:</Text>
                      <Text style={[styles.reviewValue, { color: '#0F766E', fontWeight: '700' }]}>
                        Proctor
                      </Text>
                    </View>
                    <View style={styles.reviewDivider} />
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Department:</Text>
                      <Text style={styles.reviewValue}>{selectedFacultyForAssign.department}</Text>
                    </View>
                    <View style={styles.reviewDivider} />
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Scope:</Text>
                      <Text style={styles.reviewValue}>
                        {scopeYear} • {scopeSection}
                      </Text>
                    </View>
                    <View style={styles.reviewDivider} />
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Academic Year:</Text>
                      <Text style={styles.reviewValue}>{scopeAcademicYear}</Text>
                    </View>
                  </View>

                  <Text style={styles.confirmNote}>
                    Upon confirmation, {selectedFacultyForAssign.name} will be granted Proctor workspace access for this scope.
                  </Text>

                  <View style={styles.stepActionsRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setAssignStep(2)}
                    >
                      <Text style={styles.cancelBtnText}>← Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.continueBtn, { backgroundColor: '#0F766E' }]}
                      onPress={handleConfirmAssignment}
                    >
                      <Text style={styles.continueBtnText}>Confirm Assignment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            CHANGE SCOPE MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={!!editingAssignment}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setEditingAssignment(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Change Proctor Scope</Text>
                  <Text style={styles.modalSubtitle}>
                    {editingAssignment && store.getFacultyById(editingAssignment.facultyId)?.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setEditingAssignment(null)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.fieldLabel}>Academic Year Level</Text>
                <View style={styles.chipRow}>
                  {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map((yr) => (
                    <TouchableOpacity
                      key={yr}
                      style={[styles.scopeChip, editYear === yr && styles.scopeChipActive]}
                      onPress={() => setEditYear(yr)}
                    >
                      <Text style={[styles.scopeChipText, editYear === yr && styles.scopeChipTextActive]}>
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Section</Text>
                <View style={styles.chipRow}>
                  {(['Section A', 'Section B'] as const).map((sec) => (
                    <TouchableOpacity
                      key={sec}
                      style={[styles.scopeChip, editSection === sec && styles.scopeChipActive]}
                      onPress={() => setEditSection(sec)}
                    >
                      <Text style={[styles.scopeChipText, editSection === sec && styles.scopeChipTextActive]}>
                        {sec}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Academic Year</Text>
                <View style={styles.chipRow}>
                  {ACADEMIC_YEARS.map((ay) => (
                    <TouchableOpacity
                      key={ay}
                      style={[styles.scopeChip, editAcademicYear === ay && styles.scopeChipActive]}
                      onPress={() => setEditAcademicYear(ay)}
                    >
                      <Text style={[styles.scopeChipText, editAcademicYear === ay && styles.scopeChipTextActive]}>
                        {ay}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.stepActionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditingAssignment(null)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.continueBtn, { backgroundColor: '#0F766E' }]}
                    onPress={handleConfirmScopeChange}
                  >
                    <Text style={styles.continueBtnText}>Update Scope</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            REMOVE PROCTOR MODAL (Destructive)
        ════════════════════════════════════════════════ */}
        <Modal
          visible={!!removingAssignment}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setRemovingAssignment(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.destructiveHeader}>
                <View style={styles.destructiveIconCircle}>
                  <Ionicons name="alert-circle" size={28} color="#DC2626" />
                </View>
                <Text style={styles.destructiveTitle}>Remove Proctor?</Text>
                <Text style={styles.destructiveDesc}>
                  {removingAssignment &&
                    `Are you sure you want to remove Proctor responsibility for ${
                      store.getFacultyById(removingAssignment.facultyId)?.name
                    } (${removingAssignment.year} • ${removingAssignment.section})?`}
                </Text>
                <Text style={styles.destructiveSubtext}>
                  This will remove active Proctor access for this academic scope.
                </Text>
              </View>

              <View style={styles.stepActionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setRemovingAssignment(null)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.continueBtn, { backgroundColor: '#DC2626' }]}
                  onPress={handleConfirmRemove}
                >
                  <Text style={styles.continueBtnText}>Remove Proctor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            VIEW PROCTOR'S ASSIGNED STUDENTS MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={!!viewingProctorFaculty}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setViewingProctorFaculty(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Proctor Group</Text>
                  <Text style={styles.modalSubtitle}>
                    {viewingProctorFaculty?.name} • {viewingStudentsList.length} Students
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setViewingProctorFaculty(null)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 350, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
                {viewingStudentsList.length === 0 ? (
                  <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                    <Ionicons name="person-outline" size={32} color="#94A3B8" />
                    <Text style={{ color: '#64748B', fontSize: 13, marginTop: 6 }}>
                      No students have been added by this Proctor yet.
                    </Text>
                  </View>
                ) : (
                  viewingStudentsList.map((st) => (
                    <View key={st.id} style={styles.viewStudentItem}>
                      <View style={styles.studentAvatarMini}>
                        <Text style={styles.studentAvatarMiniText}>
                          {st.name.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.studentItemName}>{st.name}</Text>
                        <Text style={styles.studentItemMeta}>
                          {st.rollNumber} • {st.year} {st.section}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeStudentHODBtn}
                        onPress={() => {
                          if (!viewingProctorFaculty) return;
                          Alert.alert(
                            'Remove Student from Proctor?',
                            `Remove ${st.name} from ${viewingProctorFaculty.name}'s proctor group?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Remove',
                                style: 'destructive',
                                onPress: () => {
                                  store.removeStudentFromProctor(viewingProctorFaculty.id, st.id);
                                },
                              },
                            ]
                          );
                        }}
                      >
                        <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={{ padding: 16 }}>
                <TouchableOpacity
                  style={[styles.continueBtn, { width: '100%', backgroundColor: '#0F766E' }]}
                  onPress={() => setViewingProctorFaculty(null)}
                >
                  <Text style={styles.continueBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <HODBottomTab activeTab="home" onNavigate={onNavigate} />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroCategoryText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deptBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deptBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroSubtext: {
    fontSize: 12.5,
    color: '#E0F2FE',
    marginTop: 4,
    lineHeight: 18,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#E0F2FE',
    marginTop: 2,
    fontWeight: '500',
  },
  heroStatDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingRight: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  addProctorActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addProctorActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  emptyActionBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 14,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  proctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: { elevation: 2 },
    }),
  },
  proctorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  facultyInfoCol: {
    flex: 1,
  },
  facultyNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  facultyDesignationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  statusActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  scopeSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scopeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scopeLabel: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
    marginRight: 4,
  },
  scopeValue: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  studentsCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  rightActionBtnsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    backgroundColor: '#F0FDFA',
    marginRight: 6,
  },
  actionBtnOutlineText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  actionBtnDestructive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  actionBtnDestructiveText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
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
  stepsBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  stepSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  stepSegmentActive: {
    backgroundColor: '#0F766E',
  },
  stepContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  facultySelectItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  facultySelectItemActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  facultySelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectRadioCircleActive: {
    borderColor: '#0F766E',
  },
  selectRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F766E',
  },
  selectFacultyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectFacultyMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  alreadyProctorNote: {
    fontSize: 11,
    color: '#D97706',
    marginTop: 2,
    fontWeight: '500',
  },
  selectedFacultyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bannerFacultyName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  bannerFacultyMeta: {
    fontSize: 12,
    color: '#0F766E',
    marginTop: 1,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scopeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scopeChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  scopeChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  scopeChipTextActive: {
    color: '#FFFFFF',
  },
  scopeNoticeText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  reviewLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  confirmNote: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 16,
    textAlign: 'center',
  },
  stepActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  continueBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  continueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  destructiveHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  destructiveIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  destructiveTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  destructiveDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  destructiveSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  viewStudentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentAvatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarMiniText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  studentItemName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  studentItemMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  removeStudentHODBtn: {
    padding: 6,
  },
});
