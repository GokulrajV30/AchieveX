// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Student Achievements Screen
// Read-only monitoring of achievements submitted by assigned students.
// Adheres strictly to the AchieveX SaaS design system:
// Header -> Blue/Indigo Hero Card -> Controls -> Achievement Cards -> Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  type AssignedStudent,
  PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS,
  type StudentAchievementRecord,
  PROCTOR_ASSIGNED_STUDENTS,
} from '../../../data/facultyWorkspaceData';
import StudentAchievementDetailsModal, {
  type ReadOnlyAchievementData,
} from '../StudentAchievementDetailsModal';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorStudentAchievementsProps {
  student?: AssignedStudent;
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
}

const ALL_ACHIEVEMENT_CATEGORIES = [
  'All Categories',
  'Technical & Professional',
  'Research & IPR',
  'Academic & Courses',
  'Sports & Games',
  'Leadership',
  'Social Impact',
  'Cultural & Co-Curricular',
];

export default function ProctorStudentAchievements({
  student,
  onGoBack,
  onNavigate,
}: ProctorStudentAchievementsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'All' | 'Approved' | 'Pending' | 'Correction'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>(student ? student.id : 'All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<ReadOnlyAchievementData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Base list of achievements for proctor's assigned cohort
  const baseAchievements = useMemo(() => {
    if (student) {
      return PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS.filter((a) => a.studentId === student.id);
    }
    return PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS;
  }, [student]);

  // Derive counts from dataset
  const totalAchievements = baseAchievements.length;
  const verifiedCount = useMemo(
    () => baseAchievements.filter((a) => a.status === 'Approved').length,
    [baseAchievements]
  );
  const pendingCount = useMemo(
    () => baseAchievements.filter((a) => a.status === 'Pending').length,
    [baseAchievements]
  );
  const correctionCount = useMemo(
    () => baseAchievements.filter((a) => a.status === 'Correction').length,
    [baseAchievements]
  );

  const filteredAchievements = useMemo(() => {
    return baseAchievements.filter((ach) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesTitle = ach.title.toLowerCase().includes(query);
        const matchesStudent = ach.studentName ? ach.studentName.toLowerCase().includes(query) : false;
        const matchesRoll = ach.rollNo ? ach.rollNo.toLowerCase().includes(query) : false;
        const matchesCategory = ach.category.toLowerCase().includes(query);
        const matchesEvent = ach.event.toLowerCase().includes(query);
        if (!matchesTitle && !matchesStudent && !matchesRoll && !matchesCategory && !matchesEvent) {
          return false;
        }
      }

      // Status Tab
      if (selectedStatusTab !== 'All' && ach.status !== selectedStatusTab) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All Categories' && ach.category !== selectedCategory) {
        return false;
      }

      // Semester
      if (selectedSemester !== 'All' && ach.semester !== selectedSemester) {
        return false;
      }

      // Student Filter (if not pre-scoped)
      if (!student && selectedStudentFilter !== 'All' && ach.studentId !== selectedStudentFilter) {
        return false;
      }

      return true;
    });
  }, [baseAchievements, searchQuery, selectedStatusTab, selectedCategory, selectedSemester, selectedStudentFilter, student]);

  const activeFiltersCount =
    (selectedCategory !== 'All Categories' ? 1 : 0) +
    (selectedSemester !== 'All' ? 1 : 0) +
    (!student && selectedStudentFilter !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedSemester('All');
    if (!student) setSelectedStudentFilter('All');
    setFilterModalVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleOpenAchievementDetails = (ach: StudentAchievementRecord) => {
    setSelectedAchievement({
      id: ach.id,
      title: ach.title,
      category: ach.category,
      event: ach.event,
      organizer: ach.organizer || 'Institution Event',
      semester: ach.semester,
      date: ach.date,
      status: ach.status,
      points: ach.points,
      proofDocumentName: ach.proofDocumentName,
      proofType: ach.proofType,
      studentName: ach.studentName || student?.name || 'Assigned Student',
      registerNumber: ach.rollNo || student?.registerNumber || '23CI011',
      department: ach.department || student?.departmentName || 'CSE (IoT)',
    });
  };

  const renderAchievementItem = ({ item }: { item: StudentAchievementRecord }) => {
    const isApproved = item.status === 'Approved';
    const isPending = item.status === 'Pending';
    const isCorrection = item.status === 'Correction';

    return (
      <TouchableOpacity
        style={[styles.achievementCard, isCorrection && styles.achievementCardCorrection]}
        activeOpacity={0.7}
        onPress={() => handleOpenAchievementDetails(item)}
      >
        {/* Top Row: Student Identity (if multi-student) & Status Tag */}
        <View style={styles.cardTopRow}>
          <View style={styles.studentBadge}>
            <Ionicons name="person-circle-outline" size={14} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.studentBadgeText} numberOfLines={1}>
              {item.studentName || student?.name || 'Assigned Student'}{' '}
              <Text style={styles.rollBadgeText}>• {item.rollNo || student?.registerNumber}</Text>
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              isApproved && styles.statusPillApproved,
              isPending && styles.statusPillPending,
              isCorrection && styles.statusPillCorrection,
            ]}
          >
            {isApproved && <Ionicons name="checkmark-circle" size={11} color="#16A34A" style={{ marginRight: 3 }} />}
            {isPending && <Ionicons name="time" size={11} color="#D97706" style={{ marginRight: 3 }} />}
            {isCorrection && <Ionicons name="alert-circle" size={11} color="#DC2626" style={{ marginRight: 3 }} />}
            <Text
              style={[
                styles.statusPillText,
                isApproved && styles.statusPillTextApproved,
                isPending && styles.statusPillTextPending,
                isCorrection && styles.statusPillTextCorrection,
              ]}
            >
              {isApproved ? 'Verified' : isPending ? 'Pending' : 'Correction'}
            </Text>
          </View>
        </View>

        {/* Primary: Achievement Title */}
        <Text style={styles.achievementTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Event & Category */}
        <View style={styles.categoryRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{item.category}</Text>
          </View>
          {item.level && (
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>{item.level}</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Bottom Row: Semester/Date & Points/Chevron */}
        <View style={styles.cardBottomRow}>
          <View style={styles.metaCol}>
            <Text style={styles.dateMetaText}>
              {item.semester} • {item.date}
            </Text>
            {isCorrection && (
              <Text style={styles.correctionHintText}>⚠ Proof requires update</Text>
            )}
          </View>

          <View style={styles.pointsActionCol}>
            {isApproved ? (
              <Text style={styles.approvedPointsText}>+{item.points} pts</Text>
            ) : isPending ? (
              <Text style={styles.pendingPointsText}>~{item.points} pts est.</Text>
            ) : null}
            <Ionicons name="chevron-forward" size={15} color="#94A3B8" style={{ marginLeft: 6 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          2. BLUE → INDIGO PREMIUM HERO CARD
      ════════════════════════════════════════════════ */}
      <View style={styles.heroCardWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Label Header */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="trophy" size={13} color="#FFFFFF" />
            </View>
            <Text style={styles.heroLabelText}>STUDENT ACHIEVEMENTS</Text>
          </View>

          {/* Primary Metric */}
          <View style={styles.heroNumberGroup}>
            <Text style={styles.heroBigNumber}>{totalAchievements}</Text>
            <Text style={styles.heroBigNumberLabel}>Achievements</Text>
          </View>

          <Text style={styles.heroSubContext}>
            {student
              ? `For ${student.name} • ${student.registerNumber}`
              : `Across ${PROCTOR_ASSIGNED_STUDENTS.length} assigned students`}
          </Text>

          {/* Bottom Breakdown Pills */}
          <View style={styles.heroBreakdownRow}>
            <View style={styles.heroBreakdownPill}>
              <View style={[styles.heroStatusDot, { backgroundColor: '#4ADE80' }]} />
              <Text style={styles.heroBreakdownText}>{verifiedCount} Verified</Text>
            </View>

            <View style={styles.heroBreakdownPill}>
              <View style={[styles.heroStatusDot, { backgroundColor: '#FDE047' }]} />
              <Text style={styles.heroBreakdownText}>{pendingCount} Pending</Text>
            </View>

            <View style={styles.heroBreakdownPill}>
              <View style={[styles.heroStatusDot, { backgroundColor: '#F87171' }]} />
              <Text style={styles.heroBreakdownText}>{correctionCount} Fix</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          3. SECTION TITLE + SEARCH + FILTER
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
      </View>

      <View style={styles.searchFilterRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student or achievement..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          activeOpacity={0.8}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFiltersCount > 0 ? '#FFFFFF' : '#2563EB'}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ════════════════════════════════════════════════
          4. STATUS TABS
      ════════════════════════════════════════════════ */}
      <View style={styles.segmentContainer}>
        {(['All', 'Approved', 'Pending', 'Correction'] as const).map((tab) => {
          const isSelected = selectedStatusTab === tab;
          const label = tab === 'Approved' ? 'Verified' : tab === 'Correction' ? 'Corrections' : tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.segmentTab, isSelected && styles.segmentTabActive]}
              activeOpacity={0.8}
              onPress={() => setSelectedStatusTab(tab)}
            >
              <Text style={[styles.segmentTabText, isSelected && styles.segmentTabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
            <Text style={styles.headerTitle}>Student Achievements</Text>
            <Text style={styles.headerSubtitle}>
              {student ? `Achievements for ${student.name}` : 'Achievements from students under your guidance'}
            </Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            5. ACHIEVEMENTS LIST
        ════════════════════════════════════════════════ */}
        <FlatList
          data={filteredAchievements}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderAchievementItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="trophy-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>No achievements found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery || activeFiltersCount > 0 || selectedStatusTab !== 'All'
                  ? 'Try adjusting your search query or filter selections.'
                  : 'Verified student submissions will appear here.'}
              </Text>
              {(searchQuery.length > 0 || activeFiltersCount > 0 || selectedStatusTab !== 'All') && (
                <TouchableOpacity
                  style={styles.clearFiltersBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedStatusTab('All');
                    handleResetFilters();
                  }}
                >
                  <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* ════════════════════════════════════════════════
            6. READ-ONLY ACHIEVEMENT DETAILS MODAL
        ════════════════════════════════════════════════ */}
        <StudentAchievementDetailsModal
          visible={!!selectedAchievement}
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />

        {/* ════════════════════════════════════════════════
            7. FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterModalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Filter Achievements</Text>
                  <Text style={styles.modalSubtitle}>Filter by standard category & semester</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>CATEGORY</Text>
                <View style={styles.filterChipsGrid}>
                  {ALL_ACHIEVEMENT_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterModalChip,
                        selectedCategory === cat && styles.filterModalChipActive,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.filterModalChipText,
                          selectedCategory === cat && styles.filterModalChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Semester Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SEMESTER</Text>
                <View style={styles.filterChipsGrid}>
                  {['All', 'Semester 5', 'Semester 6'].map((sem) => (
                    <TouchableOpacity
                      key={sem}
                      style={[
                        styles.filterModalChip,
                        selectedSemester === sem && styles.filterModalChipActive,
                      ]}
                      onPress={() => setSelectedSemester(sem)}
                    >
                      <Text
                        style={[
                          styles.filterModalChipText,
                          selectedSemester === sem && styles.filterModalChipTextActive,
                        ]}
                      >
                        {sem === 'All' ? 'All Semesters' : sem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalResetBtn}
                  onPress={handleResetFilters}
                >
                  <Text style={styles.modalResetBtnText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalApplyBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.modalApplyBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. PROCTOR BOTTOM NAVIGATION (Home · Students · Goals · Leaderboard · Profile)
        ════════════════════════════════════════════════ */}
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

  /* Blue -> Indigo Hero Card */
  heroCardWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  heroLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.6,
  },
  heroNumberGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  heroBigNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginRight: 6,
  },
  heroBigNumberLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroSubContext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  heroBreakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroBreakdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  heroBreakdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Section Header */
  sectionHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },

  /* Search + Filter */
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Segment Tabs */
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentTabActive: {
    backgroundColor: '#2563EB',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* List */
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 130, // Critical: Prevents bottom navigation overlap
  },

  /* Achievement Card */
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  achievementCardCorrection: {
    borderColor: '#FECACA',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  studentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  rollBadgeText: {
    color: '#64748B',
    fontWeight: '400',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  statusPillApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillCorrection: {
    backgroundColor: '#FEE2E2',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusPillTextApproved: {
    color: '#16A34A',
  },
  statusPillTextPending: {
    color: '#D97706',
  },
  statusPillTextCorrection: {
    color: '#DC2626',
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  levelPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  levelPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4F46E5',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  dateMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  correctionHintText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 2,
  },
  pointsActionCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedPointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  pendingPointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },

  /* Empty State */
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  clearFiltersBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  clearFiltersBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  filterModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  filterChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterModalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterModalChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  filterModalChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  filterModalChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalResetBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalResetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalApplyBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
