// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Project Mentor Assignment Screen
// Flow: HOD assigns ONE Mentor to the PROJECT TEAM.
// Mentees are automatically derived from the project members.
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
  type ProjectTeam,
  type HODFacultyMember,
} from '../../data/hodWorkspaceData';

interface HODMentorAssignmentsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

const MENTOR_STATUS_FILTERS = ['All', 'Not Assigned', 'Assigned'] as const;
const YEAR_FILTERS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const;
const TYPE_FILTERS = ['All Types', 'Team', 'Individual'] as const;

export default function HODMentorAssignments({
  onGoBack,
  onNavigate,
}: HODMentorAssignmentsProps) {
  const [store, setStore] = useState(() => getHODStore());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('All Years');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All Types');

  // Assign / Change Modal state
  const [assigningProject, setAssigningProject] = useState<ProjectTeam | null>(null);
  const [facultySearchQuery, setFacultySearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<HODFacultyMember | null>(null);
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);

  // Remove Mentor confirmation state
  const [removingProject, setRemovingProject] = useState<ProjectTeam | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeHODData(() => {
      setStore(getHODStore());
    });
    return unsubscribe;
  }, []);

  const allProjects = useMemo(() => {
    return store.getAllProjects();
  }, [store]);

  const awaitingCount = useMemo(() => {
    return store.getProjectsAwaitingMentor().length;
  }, [store]);

  const activeProjectsCount = useMemo(() => {
    return store.getActiveProjectsCount();
  }, [store]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchTeam = (p.teamName || '').toLowerCase().includes(query);
        const matchLeader = p.teamLeaderName.toLowerCase().includes(query);
        const matchDomain = p.domain.toLowerCase().includes(query);
        if (!matchTitle && !matchTeam && !matchLeader && !matchDomain) return false;
      }

      // Status filter
      if (selectedStatusFilter === 'Assigned' && !p.mentorFacultyId) return false;
      if (selectedStatusFilter === 'Not Assigned' && !!p.mentorFacultyId) return false;

      // Year filter
      if (selectedYearFilter !== 'All Years' && p.studentYear !== selectedYearFilter) return false;

      // Type filter
      if (selectedTypeFilter === 'Team' && p.projectType !== 'team') return false;
      if (selectedTypeFilter === 'Individual' && p.projectType !== 'individual') return false;

      return true;
    });
  }, [allProjects, searchQuery, selectedStatusFilter, selectedYearFilter, selectedTypeFilter]);

  // Eligible Faculty List with Workload visibility
  const eligibleFacultyWithWorkload = useMemo(() => {
    return store.faculty
      .map((f) => ({
        faculty: f,
        activeProjectsMentored: store.getFacultyProjectMentoredCount(f.id),
      }))
      .filter((item) => {
        const query = facultySearchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
          item.faculty.name.toLowerCase().includes(query) ||
          item.faculty.designation.toLowerCase().includes(query)
        );
      });
  }, [store, facultySearchQuery]);

  const handleOpenAssign = (project: ProjectTeam) => {
    setAssigningProject(project);
    setFacultySearchQuery('');
    // Pre-select existing mentor if editing
    if (project.mentorFacultyId) {
      const current = store.getFacultyById(project.mentorFacultyId);
      setSelectedFaculty(current || null);
    } else {
      setSelectedFaculty(null);
    }
    setIsConfirmationStep(false);
  };

  const handleConfirmAssignment = () => {
    if (!assigningProject || !selectedFaculty) return;

    store.assignProjectMentor(assigningProject.id, selectedFaculty.id);

    const projTitle = assigningProject.title;
    const facName = selectedFaculty.name;
    const memberCount = assigningProject.members.length;

    setAssigningProject(null);
    setSelectedFaculty(null);
    setIsConfirmationStep(false);

    showAchieveXDialog({
      type: 'success',
      title: 'Mentor Assigned',
      message: 'The project has been assigned.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  const handleConfirmRemove = () => {
    if (!removingProject) return;

    store.removeProjectMentor(removingProject.id);
    setRemovingProject(null);
  };

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
              <Text style={styles.headerTitle}>Project Mentors</Text>
              <Text style={styles.headerSubtitle}>Assign Faculty Mentors to Teams</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. MENTOR MANAGEMENT HERO (AchieveX Brand Blue → Indigo) */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroCategoryPill}>
                <Ionicons name="school" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Text style={styles.heroCategoryText}>PROJECT MENTORS</Text>
              </View>
              <View style={styles.deptBadge}>
                <Text style={styles.deptBadgeText}>CSE (IoT)</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>
              {awaitingCount > 0 ? `${awaitingCount} Awaiting Mentor` : 'All Teams Assigned'}
            </Text>
            <Text style={styles.heroSubtext}>
              Assign one Mentor per project team. Project team members automatically become the Mentor's mentees.
            </Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={[styles.heroStatValue, { color: awaitingCount > 0 ? '#FEF08A' : '#FFFFFF' }]}>
                  {awaitingCount}
                </Text>
                <Text style={styles.heroStatLabel}>Awaiting Mentor</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{activeProjectsCount}</Text>
                <Text style={styles.heroStatLabel}>Active Teams</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{activeProjectsCount - awaitingCount}</Text>
                <Text style={styles.heroStatLabel}>Mentored</Text>
              </View>
            </View>
          </LinearGradient>

          {/* 3. SEARCH BAR */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search project, team, leader or domain..."
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

          {/* Filter 1: Status Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}
          >
            {MENTOR_STATUS_FILTERS.map((st) => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.filterChip,
                  selectedStatusFilter === st && styles.filterChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedStatusFilter(st)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatusFilter === st && styles.filterChipTextActive,
                  ]}
                >
                  {st === 'All' ? 'All Projects' : st}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.filterGroupDivider} />

            {YEAR_FILTERS.map((yr) => (
              <TouchableOpacity
                key={yr}
                style={[
                  styles.filterChip,
                  selectedYearFilter === yr && styles.filterChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedYearFilter(yr)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedYearFilter === yr && styles.filterChipTextActive,
                  ]}
                >
                  {yr}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.filterGroupDivider} />

            {TYPE_FILTERS.map((tp) => (
              <TouchableOpacity
                key={tp}
                style={[
                  styles.filterChip,
                  selectedTypeFilter === tp && styles.filterChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedTypeFilter(tp)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedTypeFilter === tp && styles.filterChipTextActive,
                  ]}
                >
                  {tp}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 4. PROJECT TEAMS LIST */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              Project Teams ({filteredProjects.length})
            </Text>
            {awaitingCount > 0 && selectedStatusFilter !== 'Not Assigned' && (
              <TouchableOpacity
                onPress={() => setSelectedStatusFilter('Not Assigned')}
                style={styles.quickFilterBadge}
              >
                <Text style={styles.quickFilterText}>Show {awaitingCount} Unassigned</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredProjects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Projects Found</Text>
              <Text style={styles.emptySubtitle}>
                No student project teams match the selected filter criteria.
              </Text>
            </View>
          ) : (
            filteredProjects.map((proj) => {
              const mentor = proj.mentorFacultyId ? store.getFacultyById(proj.mentorFacultyId) : undefined;
              const isAssigned = !!mentor;

              return (
                <View key={proj.id} style={styles.projectCard}>
                  {/* Top row: Title + Domain Badge */}
                  <View style={styles.cardTopHeader}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.projectTitleText}>{proj.title}</Text>
                      <View style={styles.badgeRow}>
                        <View style={styles.domainBadge}>
                          <Text style={styles.domainBadgeText}>{proj.domain}</Text>
                        </View>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>
                            {proj.projectType === 'team' ? 'Team Project' : 'Individual'}
                          </Text>
                        </View>
                        <View style={styles.yearBadge}>
                          <Text style={styles.yearBadgeText}>{proj.studentYear}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Team Details & Members */}
                  <View style={styles.teamMetaBox}>
                    {proj.projectType === 'team' && proj.teamName && (
                      <View style={styles.metaRowItem}>
                        <Ionicons name="people-outline" size={14} color="#64748B" style={{ marginRight: 6 }} />
                        <Text style={styles.metaRowLabel}>Team:</Text>
                        <Text style={[styles.metaRowValue, { fontWeight: '700' }]}>{proj.teamName}</Text>
                      </View>
                    )}

                    <View style={[styles.metaRowItem, { marginTop: 3 }]}>
                      <Ionicons name="person-outline" size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.metaRowLabel}>Leader:</Text>
                      <Text style={styles.metaRowValue}>
                        {proj.teamLeaderName} ({proj.teamLeaderRoll})
                      </Text>
                    </View>

                    <View style={[styles.metaRowItem, { marginTop: 3 }]}>
                      <Ionicons name="people" size={14} color="#64748B" style={{ marginRight: 6 }} />
                      <Text style={styles.metaRowLabel}>Members:</Text>
                      <Text style={styles.metaRowValue}>{proj.members.length} Students</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Mentor Assignment Section */}
                  <View style={styles.mentorAssignmentRow}>
                    <View style={styles.mentorInfoCol}>
                      <Text style={styles.mentorStatusLabel}>Faculty Mentor:</Text>
                      {isAssigned ? (
                        <View style={styles.mentorAssignedRow}>
                          <View style={styles.mentorAvatarMini}>
                            <Ionicons name="school" size={14} color="#7C3AED" />
                          </View>
                          <View>
                            <Text style={styles.mentorNameText}>{mentor?.name}</Text>
                            <Text style={styles.mentorDeptText}>
                              {mentor?.designation} • {mentor?.department}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.unassignedMentorBadge}>
                          <Ionicons name="alert-circle-outline" size={14} color="#D97706" style={{ marginRight: 4 }} />
                          <Text style={styles.unassignedMentorText}>Not Assigned Yet</Text>
                        </View>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.mentorActionsGroup}>
                      {isAssigned ? (
                        <>
                          <TouchableOpacity
                            style={styles.changeMentorBtn}
                            activeOpacity={0.7}
                            onPress={() => handleOpenAssign(proj)}
                          >
                            <Ionicons name="swap-horizontal" size={13} color="#7C3AED" style={{ marginRight: 4 }} />
                            <Text style={styles.changeMentorBtnText}>Change</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.removeMentorBtn}
                            activeOpacity={0.7}
                            onPress={() => setRemovingProject(proj)}
                          >
                            <Ionicons name="trash-outline" size={13} color="#DC2626" />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.assignMentorBtn}
                          activeOpacity={0.8}
                          onPress={() => handleOpenAssign(proj)}
                        >
                          <Ionicons name="add" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                          <Text style={styles.assignMentorBtnText}>Assign Mentor</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            ASSIGN / CHANGE PROJECT MENTOR BOTTOM SHEET
        ════════════════════════════════════════════════ */}
        <Modal
          visible={!!assigningProject}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAssigningProject(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    {assigningProject?.mentorFacultyId ? 'Change Project Mentor' : 'Assign Project Mentor'}
                  </Text>
                  <Text style={styles.modalSubtitle}>{assigningProject?.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setAssigningProject(null)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Project & Team Summary Card */}
              {assigningProject && (
                <View style={styles.projectSummaryModalCard}>
                  <View style={styles.projectSummaryHeader}>
                    <Text style={styles.projectSummaryTitle}>{assigningProject.title}</Text>
                    <View style={styles.domainBadge}>
                      <Text style={styles.domainBadgeText}>{assigningProject.domain}</Text>
                    </View>
                  </View>
                  <Text style={styles.projectSummaryMeta}>
                    {assigningProject.teamName ? `${assigningProject.teamName} • ` : ''}
                    Leader: {assigningProject.teamLeaderName} • {assigningProject.members.length} Team Members
                  </Text>
                </View>
              )}

              {!isConfirmationStep ? (
                /* Step 1: Select Faculty with Workload Visibility */
                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={styles.stepLabel}>Select Faculty Mentor:</Text>

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

                  <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
                    {eligibleFacultyWithWorkload.map(({ faculty, activeProjectsMentored }) => {
                      const isSelected = selectedFaculty?.id === faculty.id;

                      return (
                        <TouchableOpacity
                          key={faculty.id}
                          style={[
                            styles.facultyCardSelect,
                            isSelected && styles.facultyCardSelectActive,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => setSelectedFaculty(faculty)}
                        >
                          <View style={styles.facultyCardLeft}>
                            <View
                              style={[
                                styles.selectRadioCircle,
                                isSelected && styles.selectRadioCircleActive,
                              ]}
                            >
                              {isSelected && <View style={styles.selectRadioInner} />}
                            </View>
                            <View style={{ marginLeft: 10, flex: 1 }}>
                              <Text style={styles.facultyNameSelect}>{faculty.name}</Text>
                              <Text style={styles.facultyMetaSelect}>
                                {faculty.designation} • {faculty.department}
                              </Text>
                            </View>
                          </View>

                          {/* Workload Badge */}
                          <View style={styles.workloadBadge}>
                            <Ionicons name="folder-outline" size={11} color="#475569" style={{ marginRight: 3 }} />
                            <Text style={styles.workloadBadgeText}>
                              {activeProjectsMentored} Active {activeProjectsMentored === 1 ? 'Project' : 'Projects'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.modalActionsRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setAssigningProject(null)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.continueBtn,
                        !selectedFaculty && styles.continueBtnDisabled,
                      ]}
                      disabled={!selectedFaculty}
                      onPress={() => setIsConfirmationStep(true)}
                    >
                      <Text style={styles.continueBtnText}>Continue →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Step 2: Confirmation Dialog */
                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={styles.stepLabel}>Confirm Mentor Assignment:</Text>

                  <View style={styles.confirmDetailsCard}>
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>Project:</Text>
                      <Text style={styles.confirmValue}>{assigningProject?.title}</Text>
                    </View>
                    <View style={styles.confirmDivider} />
                    {assigningProject?.teamName && (
                      <>
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmLabel}>Team:</Text>
                          <Text style={styles.confirmValue}>{assigningProject.teamName}</Text>
                        </View>
                        <View style={styles.confirmDivider} />
                      </>
                    )}
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>Assigned Mentor:</Text>
                      <Text style={[styles.confirmValue, { color: '#7C3AED', fontWeight: '700' }]}>
                        {selectedFaculty?.name}
                      </Text>
                    </View>
                    <View style={styles.confirmDivider} />
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>Team Members:</Text>
                      <Text style={styles.confirmValue}>
                        {assigningProject?.members.length} Students (Auto-derived)
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.confirmExplainerText}>
                    Upon confirmation, {assigningProject?.title} will automatically appear in {selectedFaculty?.name}'s Mentor workspace, and all {assigningProject?.members.length} students will become their mentees.
                  </Text>

                  <View style={styles.modalActionsRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setIsConfirmationStep(false)}
                    >
                      <Text style={styles.cancelBtnText}>← Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.continueBtn, { backgroundColor: '#7C3AED' }]}
                      onPress={handleConfirmAssignment}
                    >
                      <Text style={styles.continueBtnText}>Assign Mentor</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            REMOVE PROJECT MENTOR MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={!!removingProject}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setRemovingProject(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.destructiveHeader}>
                <View style={styles.destructiveIconCircle}>
                  <Ionicons name="alert-circle" size={28} color="#DC2626" />
                </View>
                <Text style={styles.destructiveTitle}>Remove Project Mentor?</Text>
                <Text style={styles.destructiveDesc}>
                  {removingProject &&
                    `Are you sure you want to remove the assigned Mentor from "${removingProject.title}"?`}
                </Text>
                <Text style={styles.destructiveSubtext}>
                  This project will temporarily have no assigned Mentor until a new Faculty Mentor is designated.
                </Text>
              </View>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setRemovingProject(null)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.continueBtn, { backgroundColor: '#DC2626' }]}
                  onPress={handleConfirmRemove}
                >
                  <Text style={styles.continueBtnText}>Remove Mentor</Text>
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
    marginBottom: 14,
  },
  filterScrollContent: {
    paddingRight: 10,
    alignItems: 'center',
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
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterGroupDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
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
  quickFilterBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quickFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
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
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
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
  cardTopHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  projectTitleText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  domainBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  domainBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  typeBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  yearBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  yearBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  teamMetaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRowLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  metaRowValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  mentorAssignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mentorInfoCol: {
    flex: 1,
  },
  mentorStatusLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  mentorAssignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorAvatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  mentorNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  mentorDeptText: {
    fontSize: 11,
    color: '#64748B',
  },
  unassignedMentorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  unassignedMentorText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  mentorActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  assignMentorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  assignMentorBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  changeMentorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  changeMentorBtnText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
  },
  removeMentorBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    padding: 6,
    borderRadius: 8,
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
  projectSummaryModalCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  projectSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  projectSummaryMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  stepLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 8,
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
    marginBottom: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  facultyCardSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  facultyCardSelectActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  facultyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    borderColor: '#7C3AED',
  },
  selectRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C3AED',
  },
  facultyNameSelect: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  facultyMetaSelect: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  workloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  workloadBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  confirmDetailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  confirmLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  confirmValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  confirmExplainerText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
    textAlign: 'center',
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
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
    backgroundColor: '#7C3AED',
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
});
