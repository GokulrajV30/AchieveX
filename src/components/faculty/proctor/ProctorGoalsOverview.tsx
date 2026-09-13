// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Student Goals Screen
// Read-only monitoring of goal progress across assigned students.
// Adheres strictly to the AchieveX SaaS design system:
// Header -> Blue/Indigo Hero Card with Circular Progress Ring -> Controls -> Goal Cards -> Bottom Nav
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
import Svg, { G, Circle } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  PROCTOR_STUDENT_GOALS,
  PROCTOR_ASSIGNED_STUDENTS,
  type StudentGoalProgress,
} from '../../../data/facultyWorkspaceData';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorGoalsOverviewProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onSelectGoal?: (goal: StudentGoalProgress) => void;
}

const ALL_GOAL_CATEGORIES = [
  'All Categories',
  'Research & IPR',
  'Technical & Professional',
  'Certifications & Online Learning',
  'Sports & Games',
  'Leadership',
  'Social Impact',
  'Entrepreneurship',
  'Cultural & Co-Curricular',
];

export default function ProctorGoalsOverview({
  onGoBack,
  onNavigate,
  onSelectGoal,
}: ProctorGoalsOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'All' | 'Active' | 'Completed' | 'Overdue'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Derive counts from centralized proctor dataset
  const allGoals = PROCTOR_STUDENT_GOALS;
  const totalStudentsCount = PROCTOR_ASSIGNED_STUDENTS.length; // 10
  const activeGoalsCount = useMemo(() => allGoals.filter((g) => g.status === 'Active').length, [allGoals]); // 8
  const completedGoalsCount = useMemo(() => allGoals.filter((g) => g.status === 'Completed').length, [allGoals]); // 3
  const overdueGoalsCount = useMemo(() => allGoals.filter((g) => g.status === 'Overdue').length, [allGoals]); // 3

  // Calculate cohort average completion rate
  const overallProgressPercent = useMemo(() => {
    if (allGoals.length === 0) return 0;
    const sum = allGoals.reduce((acc, g) => acc + g.percentage, 0);
    return Math.round(sum / allGoals.length); // ~68%
  }, [allGoals]);

  // Svg Circular Progress Gauge Dimensions
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const filteredGoals = useMemo(() => {
    return allGoals.filter((g) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesTitle = g.title.toLowerCase().includes(query);
        const matchesStudent = g.studentName.toLowerCase().includes(query);
        const matchesRoll = g.rollNo.toLowerCase().includes(query);
        const matchesCategory = g.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesStudent && !matchesRoll && !matchesCategory) return false;
      }

      // Status
      if (selectedStatusTab !== 'All' && g.status !== selectedStatusTab) return false;

      // Category
      if (selectedCategory !== 'All Categories' && g.category !== selectedCategory) return false;

      // Semester
      if (selectedSemester !== 'All' && g.semester !== selectedSemester) return false;

      return true;
    });
  }, [allGoals, searchQuery, selectedStatusTab, selectedCategory, selectedSemester]);

  const activeFiltersCount =
    (selectedCategory !== 'All Categories' ? 1 : 0) + (selectedSemester !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedSemester('All');
    setFilterModalVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleGoalPress = (goal: StudentGoalProgress) => {
    if (onSelectGoal) {
      onSelectGoal(goal);
    } else {
      onNavigate('proctorStudentGoalDetails');
    }
  };

  const renderGoalItem = ({ item }: { item: StudentGoalProgress }) => {
    const isCompleted = item.status === 'Completed';
    const isOverdue = item.status === 'Overdue';

    return (
      <TouchableOpacity
        style={[styles.goalCard, isOverdue && styles.goalCardOverdue]}
        activeOpacity={0.7}
        onPress={() => handleGoalPress(item)}
      >
        {/* Top Header: Student Identity & Status Pill */}
        <View style={styles.goalCardTopRow}>
          <View style={styles.studentBadgeRow}>
            <View style={styles.miniAvatar}>
              <Text style={styles.miniAvatarText}>{item.avatarInitials || 'ST'}</Text>
            </View>
            <Text style={styles.studentNameText} numberOfLines={1}>
              {item.studentName} <Text style={styles.studentRollText}>• {item.rollNo}</Text>
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              isCompleted && styles.statusPillCompleted,
              isOverdue && styles.statusPillOverdue,
            ]}
          >
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 3 }} />
            )}
            {isOverdue && (
              <Ionicons name="alert-circle" size={12} color="#DC2626" style={{ marginRight: 3 }} />
            )}
            <Text
              style={[
                styles.statusPillText,
                isCompleted && styles.statusPillTextCompleted,
                isOverdue && styles.statusPillTextOverdue,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Primary: Goal Title */}
        <Text style={styles.goalTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Category Badge */}
        <View style={styles.categoryBadgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>

        {/* Progress Bar & Percentage */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(item.percentage, 100)}%` },
                isCompleted && { backgroundColor: '#16A34A' },
                isOverdue && { backgroundColor: '#DC2626' },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressPercentText,
              isCompleted && { color: '#16A34A' },
              isOverdue && { color: '#DC2626' },
            ]}
          >
            {isCompleted ? '✓ 100%' : `${item.percentage}%`}
          </Text>
        </View>

        {/* Bottom Metadata: Milestones & Deadline Context */}
        <View style={styles.goalCardBottomRow}>
          <View style={styles.milestoneTracker}>
            <Ionicons name="list-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={styles.milestoneTrackerText}>
              {item.completedMilestones} of {item.totalMilestones} milestones
            </Text>
          </View>

          <View style={styles.deadlineTracker}>
            <Text
              style={[
                styles.deadlineTrackerText,
                isCompleted && { color: '#16A34A', fontWeight: '600' },
                isOverdue && { color: '#DC2626', fontWeight: '700' },
              ]}
            >
              {isCompleted ? `Completed ${item.targetDate}` : item.deadlineContext || `Due ${item.targetDate}`}
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginLeft: 2 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          2. BLUE → INDIGO PREMIUM HERO CARD WITH CIRCULAR PROGRESS
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
              <Ionicons name="compass" size={13} color="#FFFFFF" />
            </View>
            <Text style={styles.heroLabelText}>GOAL PROGRESS</Text>
          </View>

          {/* Body: Left Metrics + Right Gauge */}
          <View style={styles.heroBodyRow}>
            {/* Left: Active Goals + Cohort */}
            <View style={styles.heroLeftCol}>
              <View style={styles.heroNumberGroup}>
                <Text style={styles.heroBigNumber}>{activeGoalsCount}</Text>
                <Text style={styles.heroBigNumberLabel}>Active Goals</Text>
              </View>
              <Text style={styles.heroCohortText}>
                Across {totalStudentsCount} assigned students
              </Text>

              {/* Bottom Breakdown Pills */}
              <View style={styles.heroBreakdownRow}>
                <View style={styles.heroBreakdownPill}>
                  <View style={[styles.heroStatusDot, { backgroundColor: '#4ADE80' }]} />
                  <Text style={styles.heroBreakdownText}>{completedGoalsCount} Completed</Text>
                </View>

                <View style={styles.heroBreakdownPill}>
                  <View style={[styles.heroStatusDot, { backgroundColor: '#FDE047' }]} />
                  <Text style={styles.heroBreakdownText}>{overdueGoalsCount} Need Attention</Text>
                </View>
              </View>
            </View>

            {/* Right: Circular Progress Gauge */}
            <View style={styles.heroGaugeCol}>
              <View style={styles.donutWrapper}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                  <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background Ring */}
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    {/* Progress Arc */}
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke="#FDE047"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - overallProgressPercent / 100)}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </G>
                </Svg>

                <View style={styles.donutTextOverlay}>
                  <Text style={styles.donutPercentText}>{overallProgressPercent}%</Text>
                  <Text style={styles.donutLabelText}>Overall</Text>
                  <Text style={styles.donutFractionText}>Progress</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          3. SECTION TITLE + SEARCH + FILTER
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Student Goals</Text>
      </View>

      <View style={styles.searchFilterRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student or goal..."
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
          4. STATUS SEGMENT TABS (Single Clean Row)
      ════════════════════════════════════════════════ */}
      <View style={styles.segmentContainer}>
        {(['All', 'Active', 'Completed', 'Overdue'] as const).map((tab) => {
          const isSelected = selectedStatusTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.segmentTab, isSelected && styles.segmentTabActive]}
              activeOpacity={0.8}
              onPress={() => setSelectedStatusTab(tab)}
            >
              <Text style={[styles.segmentTabText, isSelected && styles.segmentTabTextActive]}>
                {tab}
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
            <Text style={styles.headerTitle}>Student Goals</Text>
            <Text style={styles.headerSubtitle}>Track progress of students under your guidance</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            5. GOALS LIST
        ════════════════════════════════════════════════ */}
        <FlatList
          data={filteredGoals}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderGoalItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="compass-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>No goals found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery || activeFiltersCount > 0 || selectedStatusTab !== 'All'
                  ? 'Try adjusting your search query or filter selections.'
                  : 'Goals created by your assigned students will appear here.'}
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
            6. CATEGORY & SEMESTER FILTER MODAL
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
                  <Text style={styles.modalTitle}>Filter Goals</Text>
                  <Text style={styles.modalSubtitle}>Filter by standard achievement category & semester</Text>
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
                  {ALL_GOAL_CATEGORIES.map((cat) => (
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
            7. PROCTOR BOTTOM NAVIGATION (Home · Students · Goals · Leaderboard · Profile)
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          variant="proctor"
          activeTab="goals"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
            } else if (tab === 'goals') {
              /* already on goals */
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
  heroBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeftCol: {
    flex: 1,
    marginRight: 10,
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
  heroCohortText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
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
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  heroBreakdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Donut Gauge */
  heroGaugeCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutWrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  donutLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FDE047',
    letterSpacing: 0.3,
  },
  donutFractionText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },

  /* Section Title */
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

  /* Segmented Control Tabs (Single Row) */
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

  /* Goal Card */
  goalCard: {
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
  goalCardOverdue: {
    borderColor: '#FECACA',
  },
  goalCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  studentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 6,
  },
  miniAvatarText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
  },
  studentNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  studentRollText: {
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
  statusPillCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusPillOverdue: {
    backgroundColor: '#FEE2E2',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusPillTextCompleted: {
    color: '#16A34A',
  },
  statusPillTextOverdue: {
    color: '#DC2626',
  },

  /* Primary Goal Title */
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  categoryBadgeRow: {
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },

  /* Progress Bar */
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    width: 44,
    textAlign: 'right',
  },

  /* Bottom Row */
  goalCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  milestoneTracker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneTrackerText: {
    fontSize: 11,
    color: '#64748B',
  },
  deadlineTracker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineTrackerText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
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
