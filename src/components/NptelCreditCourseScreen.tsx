// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Credits (NPTEL & Credit Courses) Screen
// Track verified institutional learning credits separate from points
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  INITIAL_CREDIT_RECORDS,
  type CreditCourseRecord,
} from '../data/academicCreditsData';
import AcademicCreditsHero from './academicCredits/AcademicCreditsHero';
import AcademicCourseCard from './academicCredits/AcademicCourseCard';
import AcademicCreditsFilterSheet from './academicCredits/AcademicCreditsFilterSheet';
import AcademicCourseDetailsModal from './academicCredits/AcademicCourseDetailsModal';
import NewCourseRecordFlow from './academicCredits/NewCourseRecordFlow';
import StudentBottomTab from './StudentBottomTab';

interface NptelCreditCourseScreenProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  userRole?: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
}

export default function NptelCreditCourseScreen({
  onGoBack,
  onOpenMenu,
  onNavigate,
  onOpenProfile,
  onOpenLeaderboard,
}: NptelCreditCourseScreenProps) {
  const [courses, setCourses] = useState<CreditCourseRecord[]>(INITIAL_CREDIT_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<'All' | 'Verified' | 'Pending' | 'Correction'>('All');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [newCourseFlowVisible, setNewCourseFlowVisible] = useState(false);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<CreditCourseRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Advanced Filter state
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('All Semesters');
  const [selectedYearFilter, setSelectedYearFilter] = useState('All Years');

  // Stats calculation
  const verifiedCourses = useMemo(
    () => courses.filter((c) => c.verificationStatus === 'Verified'),
    [courses]
  );

  const totalVerifiedCredits = useMemo(
    () =>
      verifiedCourses.reduce((sum, c) => sum + (c.creditsEarned || 0), 0),
    [verifiedCourses]
  );

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 1. Status Filter
      if (activeStatusTab !== 'All' && course.verificationStatus !== activeStatusTab) {
        return false;
      }
      // 2. Type Filter
      if (selectedTypeFilter !== 'All Types' && course.courseType !== selectedTypeFilter) {
        return false;
      }
      // 3. Semester Filter
      if (selectedSemesterFilter !== 'All Semesters' && course.semester !== selectedSemesterFilter) {
        return false;
      }
      // 4. Academic Year Filter
      if (selectedYearFilter !== 'All Years' && course.academicYear !== selectedYearFilter) {
        return false;
      }
      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = course.courseName.toLowerCase().includes(q);
        const matchProvider = course.provider.toLowerCase().includes(q);
        const matchDomain = course.domain.toLowerCase().includes(q);
        if (!matchName && !matchProvider && !matchDomain) return false;
      }
      return true;
    });
  }, [
    courses,
    activeStatusTab,
    selectedTypeFilter,
    selectedSemesterFilter,
    selectedYearFilter,
    searchQuery,
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleAddCourseSubmit = (newCourse: CreditCourseRecord) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleResetFilters = () => {
    setSelectedTypeFilter('All Types');
    setSelectedSemesterFilter('All Semesters');
    setSelectedYearFilter('All Years');
    setActiveStatusTab('All');
    setFilterSheetVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuIconBtn}
            activeOpacity={0.7}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#1F2937" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Academic Credits</Text>
            <Text style={styles.headerSubtitle}>Track your learning credits</Text>
          </View>
        </View>

        {/* Compact Add Course Button */}
        <TouchableOpacity
          style={styles.addCourseBtn}
          activeOpacity={0.85}
          onPress={() => setNewCourseFlowVisible(true)}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 2 }} />
          <Text style={styles.addCourseBtnText}>Add Course</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2563EB" />
        }
      >
        {/* 1. Premium Summary Hero Card */}
        <AcademicCreditsHero
          totalCredits={totalVerifiedCredits}
          verifiedCoursesCount={verifiedCourses.length}
          academicYear="2026–27"
        />

        {/* 2. Non-Point Informational Row */}
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
          <Text style={styles.infoRowText}>
            Academic credits are separate from AchieveX points and leaderboard rankings.
          </Text>
        </View>

        {/* 3. Toolbar: Search Bar + Filter Trigger */}
        <View style={styles.toolbarSection}>
          <View style={styles.toolbarHeaderRow}>
            <Text style={styles.toolbarTitle}>Your Courses</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{filteredCourses.length} records</Text>
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses, providers..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                (selectedTypeFilter !== 'All Types' ||
                  selectedSemesterFilter !== 'All Semesters' ||
                  selectedYearFilter !== 'All Years') &&
                  styles.filterBtnActive,
              ]}
              activeOpacity={0.75}
              onPress={() => setFilterSheetVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color={
                  selectedTypeFilter !== 'All Types' ||
                  selectedSemesterFilter !== 'All Semesters' ||
                  selectedYearFilter !== 'All Years'
                    ? '#2563EB'
                    : '#475569'
                }
              />
            </TouchableOpacity>
          </View>

          {/* Horizontal Status Filter Chips */}
          <View style={styles.statusChipsRow}>
            {(['All', 'Verified', 'Pending', 'Correction'] as const).map((st) => {
              const isActive = activeStatusTab === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.statusChip, isActive && styles.statusChipActive]}
                  activeOpacity={0.75}
                  onPress={() => setActiveStatusTab(st)}
                >
                  <Text style={[styles.statusChipText, isActive && styles.statusChipTextActive]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Course Cards List */}
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="school-outline" size={36} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>
              {courses.length === 0 ? 'No credit courses yet' : 'No matching courses found'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {courses.length === 0
                ? 'Add NPTEL, SWAYAM or approved academic credit courses here.'
                : 'Try adjusting your search query or reset filter options.'}
            </Text>
            {courses.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyAddBtn}
                activeOpacity={0.85}
                onPress={() => setNewCourseFlowVisible(true)}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.emptyAddBtnText}>Add Course</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.emptyResetBtn}
                activeOpacity={0.8}
                onPress={handleResetFilters}
              >
                <Text style={styles.emptyResetBtnText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredCourses.map((c) => (
            <AcademicCourseCard
              key={c.id}
              course={c}
              onPress={() => setSelectedCourseForDetail(c)}
            />
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Modals ── */}
      <AcademicCreditsFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        selectedType={selectedTypeFilter}
        onSelectType={setSelectedTypeFilter}
        selectedSemester={selectedSemesterFilter}
        onSelectSemester={setSelectedSemesterFilter}
        selectedYear={selectedYearFilter}
        onSelectYear={setSelectedYearFilter}
        selectedStatus={activeStatusTab}
        onSelectStatus={(st) => setActiveStatusTab(st as any)}
        onReset={handleResetFilters}
        onApply={() => setFilterSheetVisible(false)}
      />

      <AcademicCourseDetailsModal
        visible={!!selectedCourseForDetail}
        course={selectedCourseForDetail}
        onClose={() => setSelectedCourseForDetail(null)}
      />

      <NewCourseRecordFlow
        visible={newCourseFlowVisible}
        onClose={() => setNewCourseFlowVisible(false)}
        onSubmitCourse={handleAddCourseSubmit}
        onViewRecord={(course) => setSelectedCourseForDetail(course)}
      />

      {/* Shared Student Bottom Navigation Bar */}
      <StudentBottomTab
        activeTab="home"
        onNavigate={(tab) => {
          if (tab === 'home') onNavigate('dashboard');
          else if (tab === 'achievements') onNavigate('myAchievements');
          else if (tab === 'goals') onNavigate('goals');
          else if (tab === 'leaderboard') onNavigate('leaderboard');
          else if (tab === 'profile') onNavigate('profile');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 58,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  addCourseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addCourseBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 14,
  },
  infoRowText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  toolbarSection: {
    marginBottom: 12,
  },
  toolbarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toolbarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  statusChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  statusChipActive: {
    backgroundColor: '#2563EB',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 36,
    paddingHorizontal: 20,
    marginTop: 6,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 260,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyResetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  emptyResetBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
});
