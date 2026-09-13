// ─────────────────────────────────────────────────────────────
// AchieveX — College Analytics (Head Workspace)
// Complete Functional Analytics: Centralized Filters, Single Filtered
// Dataset (AND logic), Dynamic Trend Chart, Dynamic Department & Category
// Breakdowns, Sub-Sheet Pickers, and Active Filter Chips.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHeadStore,
  type CollegeAchievementRecord,
  type HeadAchievementFilterQuery,
} from '../../data/headWorkspaceData';
import HeadHeroCard from './HeadHeroCard';
import StudentBottomTab from '../StudentBottomTab';

interface HeadAnalyticsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export interface AnalyticsFilterState {
  academicYear: string; // '2026–27' | '2025–26' | 'ALL'
  semester: string; // 'ALL' | '1' .. '8'
  department: string; // 'ALL' | department name/code
  studentYear: string; // 'ALL' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
  category: string; // 'ALL' | category title
  achievementType: string; // 'ALL' | type label
  level: string; // 'ALL' | 'College' | 'State' | 'National' | 'International'
  result: string; // 'ALL' | 'Winner' | 'Runner Up' | 'Participant'
  userType: 'ALL' | 'Student' | 'Faculty';
}

const DEFAULT_FILTERS: AnalyticsFilterState = {
  academicYear: '2026–27',
  semester: 'ALL',
  department: 'ALL',
  studentYear: 'ALL',
  category: 'ALL',
  achievementType: 'ALL',
  level: 'ALL',
  result: 'ALL',
  userType: 'ALL',
};

const ALL_DEPARTMENTS = [
  { id: 'ALL', name: 'All Departments' },
  { id: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'CSE (IoT)', name: 'CSE (Internet of Things)' },
  { id: 'IT', name: 'Information Technology' },
  { id: 'AI & DS', name: 'Artificial Intelligence & Data Science' },
  { id: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering' },
  { id: 'CIVIL', name: 'Civil Engineering' },
];

const SEMESTERS = ['ALL', '1', '2', '3', '4', '5', '6', '7', '8'];
const STUDENT_YEARS = ['ALL', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const LEVELS = ['ALL', 'College', 'State', 'National', 'International'];
const RESULTS = ['ALL', 'Winner', 'Runner Up', 'Participant'];
const USER_TYPES: ('ALL' | 'Student' | 'Faculty')[] = ['ALL', 'Student', 'Faculty'];

export default function HeadAnalytics({
  onOpenMenu,
  onNavigate,
}: HeadAnalyticsProps) {
  const store = getHeadStore();
  const rawAchievements = store.getAchievements();
  const categories = store.getCategories();
  const studentLeaderboard = store.getStudentLeaderboard();
  const facultyLeaderboard = store.getFacultyLeaderboard();

  // Active Centralized Filters
  const [activeFilters, setActiveFilters] = useState<AnalyticsFilterState>(DEFAULT_FILTERS);

  // Draft Filters in Sheet
  const [draftFilters, setDraftFilters] = useState<AnalyticsFilterState>(DEFAULT_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Sub-picker modals
  const [deptPickerVisible, setDeptPickerVisible] = useState(false);
  const [deptSearchText, setDeptSearchText] = useState('');
  const [catPickerVisible, setCatPickerVisible] = useState(false);
  const [catSearchText, setCatSearchText] = useState('');
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [typeSearchText, setTypeSearchText] = useState('');

  // UI view toggles
  const [trendView, setTrendView] = useState<'Monthly' | 'Semester'>('Monthly');
  const [activeLeaderboard, setActiveLeaderboard] = useState<'Student' | 'Faculty'>('Student');
  const [showLeaderboards, setShowLeaderboards] = useState(false);

  // Helper to query achievements with given filters
  const computeFiltered = (filters: AnalyticsFilterState): CollegeAchievementRecord[] => {
    const query: HeadAchievementFilterQuery = {
      academicYear: filters.academicYear === 'ALL' ? undefined : filters.academicYear,
      semester: filters.semester === 'ALL' ? undefined : filters.semester,
      department: filters.department === 'ALL' ? undefined : filters.department,
      studentYear: filters.studentYear === 'ALL' ? undefined : filters.studentYear,
      category: filters.category === 'ALL' ? undefined : filters.category,
      achievementType: filters.achievementType === 'ALL' ? undefined : filters.achievementType,
      level: filters.level === 'ALL' ? undefined : filters.level,
      result: filters.result === 'ALL' ? undefined : filters.result,
      userType: filters.userType === 'ALL' ? undefined : filters.userType,
    };
    return store.getAchievements(query);
  };

  // 1. Single Centralized Filtered Dataset (AND logic)
  const filteredAchievements = useMemo(() => {
    return computeFiltered(activeFilters);
  }, [activeFilters]);

  // Draft count preview inside sheet
  const draftCount = useMemo(() => {
    return computeFiltered(draftFilters).length;
  }, [draftFilters]);

  // Count how many non-default filters are active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.academicYear !== '2026–27' && activeFilters.academicYear !== 'ALL') count++;
    if (activeFilters.semester !== 'ALL') count++;
    if (activeFilters.department !== 'ALL') count++;
    if (activeFilters.studentYear !== 'ALL') count++;
    if (activeFilters.category !== 'ALL') count++;
    if (activeFilters.achievementType !== 'ALL') count++;
    if (activeFilters.level !== 'ALL') count++;
    if (activeFilters.result !== 'ALL') count++;
    if (activeFilters.userType !== 'ALL') count++;
    return count;
  }, [activeFilters]);

  // 2. Metrics dynamically derived from filteredAchievements
  const totalVerifiedCount = filteredAchievements.length;
  const totalPoints = useMemo(() => {
    return filteredAchievements.reduce((acc, curr) => acc + (curr.awardedPoints || 0), 0);
  }, [filteredAchievements]);

  const studentAchieversCount = useMemo(() => {
    const studentSet = new Set<string>();
    filteredAchievements.forEach((a) => {
      if (a.userType.toLowerCase() === 'student') {
        studentSet.add(a.rollOrEmpId || a.userRollOrId || a.userName);
      }
    });
    return studentSet.size;
  }, [filteredAchievements]);

  const facultyAchieversCount = useMemo(() => {
    const facultySet = new Set<string>();
    filteredAchievements.forEach((a) => {
      if (a.userType.toLowerCase() === 'faculty') {
        facultySet.add(a.rollOrEmpId || a.userRollOrId || a.userName);
      }
    });
    return facultySet.size;
  }, [filteredAchievements]);

  // 3. Trend Data dynamically derived from filteredAchievements
  const monthlyTrendData = useMemo(() => {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const map = new Map<string, number>();
    months.forEach((m) => map.set(m, 0));

    filteredAchievements.forEach((a) => {
      const dateStr = a.date || '';
      for (const m of months) {
        if (dateStr.includes(m)) {
          map.set(m, (map.get(m) || 0) + 1);
          break;
        }
      }
    });

    return months.map((m) => ({
      label: m,
      count: map.get(m) || 0,
    }));
  }, [filteredAchievements]);

  const semesterTrendData = useMemo(() => {
    const sems = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
    const map = new Map<string, number>();
    sems.forEach((s) => map.set(s, 0));

    filteredAchievements.forEach((a) => {
      const semStr = a.semester || '';
      const numMatch = semStr.match(/[1-8]/);
      if (numMatch) {
        const key = `Sem ${numMatch[0]}`;
        map.set(key, (map.get(key) || 0) + 1);
      }
    });

    return sems.slice(0, 6).map((s) => ({
      label: s,
      count: map.get(s) || 0,
    }));
  }, [filteredAchievements]);

  const currentTrend = trendView === 'Monthly' ? monthlyTrendData : semesterTrendData;
  const maxTrendVal = Math.max(...currentTrend.map((t) => t.count), 1);

  // 4. Department Performance dynamically derived from filteredAchievements
  const departmentPerformance = useMemo(() => {
    const map = new Map<string, { count: number; points: number }>();
    filteredAchievements.forEach((a) => {
      const d = a.departmentName || a.department;
      const cur = map.get(d) || { count: 0, points: 0 };
      cur.count += 1;
      cur.points += a.awardedPoints || 0;
      map.set(d, cur);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        points: data.points,
      }))
      .sort((a, b) => b.points - a.points);
  }, [filteredAchievements]);

  // 5. Category Performance dynamically derived from filteredAchievements
  const categoryPerformance = useMemo(() => {
    if (filteredAchievements.length === 0) return [];
    const map = new Map<string, number>();
    filteredAchievements.forEach((a) => {
      const cat = a.categoryTitle || a.categoryName || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    const palette = ['#2563EB', '#059669', '#D97706', '#7C3AED', '#DC2626', '#0891B2'];
    return Array.from(map.entries())
      .map(([name, count], index) => {
        const pct = Math.round((count / filteredAchievements.length) * 100);
        return {
          name,
          count,
          pct: `${pct}%`,
          color: palette[index % palette.length],
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [filteredAchievements]);

  // Open filter modal: copy active -> draft
  const handleOpenFilterModal = () => {
    setDraftFilters({ ...activeFilters });
    setFilterModalVisible(true);
  };

  // Apply filters: copy draft -> active, close modal
  const handleApplyFilters = () => {
    setActiveFilters({ ...draftFilters });
    setFilterModalVisible(false);
  };

  // Reset draft filters
  const handleResetDraft = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  // Clear all active filters
  const handleClearAllActive = () => {
    setActiveFilters(DEFAULT_FILTERS);
  };

  // Remove single active filter
  const handleRemoveActiveFilter = (key: keyof AnalyticsFilterState) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: DEFAULT_FILTERS[key],
    }));
  };

  // Types available under selected Category
  const availableTypes = useMemo(() => {
    if (draftFilters.category === 'ALL') {
      const set = new Set<string>();
      categories.forEach((c) => c.types.forEach((t) => set.add(t.label || t.name || '')));
      return Array.from(set).filter(Boolean);
    }
    const cat = categories.find((c) => c.title === draftFilters.category || c.name === draftFilters.category);
    return cat ? cat.types.map((t) => t.label || t.name || '') : [];
  }, [draftFilters.category, categories]);

  // Helper label getters
  const getDeptDisplay = (id: string) => {
    if (id === 'ALL') return 'All Departments';
    const found = ALL_DEPARTMENTS.find((d) => d.id === id || d.name === id);
    return found ? found.name : id;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#1E1B4B" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>College Analytics</Text>
              <Text style={styles.headerSubtitle}>Cross-department institutional intelligence</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              2. SHARED ACHIEVEX BRAND HERO CARD
          ════════════════════════════════════════════════ */}
          <HeadHeroCard
            overline="COLLEGE ANALYTICS"
            title="Performance Intelligence"
            badgeText={activeFilters.academicYear === 'ALL' ? 'All Years' : activeFilters.academicYear}
            primaryNumber={totalVerifiedCount.toLocaleString()}
            primaryLabel="Verified Achievements"
            secondaryMetrics={[
              { number: totalPoints.toLocaleString(), label: 'Points' },
              { number: `${departmentPerformance.length} Depts`, label: 'Active Scope' },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. COMPACT FILTER BUTTON & SCOPE ROW
          ════════════════════════════════════════════════ */}
          <View style={styles.filterControlRow}>
            <TouchableOpacity
              style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
              activeOpacity={0.8}
              onPress={handleOpenFilterModal}
            >
              <Ionicons
                name="filter"
                size={14}
                color={activeFilterCount > 0 ? '#FFFFFF' : '#2563EB'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.filterBtnText, activeFilterCount > 0 && styles.filterBtnTextActive]}>
                Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </Text>
            </TouchableOpacity>

            <View style={styles.scopeBadge}>
              <Text style={styles.scopeBadgeText}>
                {activeFilters.department === 'ALL'
                  ? 'Institutional Scope'
                  : activeFilters.department}
              </Text>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. ACTIVE FILTER CHIPS (HORIZONTAL SCROLL)
          ════════════════════════════════════════════════ */}
          {activeFilterCount > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScroll}
              style={styles.chipsContainer}
            >
              {activeFilters.academicYear !== '2026–27' && activeFilters.academicYear !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.academicYear}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('academicYear')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.semester !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>Sem {activeFilters.semester}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('semester')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.department !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.department}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('department')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.studentYear !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.studentYear}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('studentYear')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.category !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.category}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('category')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.achievementType !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.achievementType}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('achievementType')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.level !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.level}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('level')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.result !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.result}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('result')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.userType !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.userType}</Text>
                  <TouchableOpacity onPress={() => handleRemoveActiveFilter('userType')}>
                    <Ionicons name="close-circle" size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.clearAllChip} onPress={handleClearAllActive}>
                <Text style={styles.clearAllChipText}>Clear All</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ════════════════════════════════════════════════
              EMPTY STATE WHEN 0 MATCHES
          ════════════════════════════════════════════════ */}
          {totalVerifiedCount === 0 ? (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="filter-circle-outline" size={36} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Data Found</Text>
              <Text style={styles.emptySubtitle}>
                No achievements match the selected filters. Try broadening your criteria.
              </Text>
              <TouchableOpacity
                style={styles.emptyResetBtn}
                activeOpacity={0.8}
                onPress={handleClearAllActive}
              >
                <Text style={styles.emptyResetBtnText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* ════════════════════════════════════════════════
                  5. KEY METRICS (HORIZONTAL SCROLL)
              ════════════════════════════════════════════════ */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.metricsScroll}
                style={styles.metricsContainer}
              >
                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
                  </View>
                  <Text style={styles.metricNumber}>{totalVerifiedCount.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Verified Achievements</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="flash" size={16} color="#D97706" />
                  </View>
                  <Text style={[styles.metricNumber, { color: '#D97706' }]}>
                    {totalPoints.toLocaleString()}
                  </Text>
                  <Text style={styles.metricLabel}>Total Points</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="school" size={16} color="#059669" />
                  </View>
                  <Text style={[styles.metricNumber, { color: '#059669' }]}>
                    {studentAchieversCount.toLocaleString()}
                  </Text>
                  <Text style={styles.metricLabel}>Student Achievers</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="briefcase" size={16} color="#4338CA" />
                  </View>
                  <Text style={[styles.metricNumber, { color: '#4338CA' }]}>
                    {facultyAchieversCount.toLocaleString()}
                  </Text>
                  <Text style={styles.metricLabel}>Faculty Achievers</Text>
                </View>
              </ScrollView>

              {/* ════════════════════════════════════════════════
                  6. ONE PRIMARY CHART: ACHIEVEMENT TREND
              ════════════════════════════════════════════════ */}
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Achievement Trend</Text>
                  <Text style={styles.sectionSubtitle}>Velocity across the selected scope</Text>
                </View>

                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[styles.segmentBtn, trendView === 'Monthly' && styles.segmentBtnActive]}
                    onPress={() => setTrendView('Monthly')}
                  >
                    <Text style={[styles.segmentText, trendView === 'Monthly' && styles.segmentTextActive]}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segmentBtn, trendView === 'Semester' && styles.segmentBtnActive]}
                    onPress={() => setTrendView('Semester')}
                  >
                    <Text style={[styles.segmentText, trendView === 'Semester' && styles.segmentTextActive]}>
                      Semester
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.chartCard}>
                <View style={styles.chartBarsRow}>
                  {currentTrend.map((item, index) => {
                    const barHeight = Math.max(12, Math.round((item.count / maxTrendVal) * 96));
                    const isPeak = item.count === Math.max(...currentTrend.map((t) => t.count)) && item.count > 0;
                    return (
                      <View key={index} style={styles.barCol}>
                        <Text style={[styles.barValueText, isPeak && styles.barValuePeak]}>
                          {item.count}
                        </Text>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              { height: barHeight },
                              isPeak ? styles.barPeakFill : styles.barNormalFill,
                            ]}
                          />
                        </View>
                        <Text style={styles.barLabelText}>{item.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* ════════════════════════════════════════════════
                  7. DEPARTMENT PERFORMANCE (COMPACT ROWS)
              ════════════════════════════════════════════════ */}
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Department Performance</Text>
                  <Text style={styles.sectionSubtitle}>
                    {departmentPerformance.length} department{departmentPerformance.length !== 1 ? 's' : ''} in filtered scope
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewAllBtn}
                  onPress={() => onNavigate('headDepartments')}
                >
                  <Text style={styles.viewAllText}>All Depts</Text>
                  <Ionicons name="chevron-forward" size={13} color="#2563EB" />
                </TouchableOpacity>
              </View>

              <View style={styles.deptCard}>
                {departmentPerformance.slice(0, 5).map((dept, index) => (
                  <View
                    key={dept.name}
                    style={[styles.deptRow, index < Math.min(5, departmentPerformance.length) - 1 && styles.deptRowBorder]}
                  >
                    <View style={styles.deptNameCol}>
                      <Text style={styles.deptName} numberOfLines={1}>
                        {dept.name}
                      </Text>
                      <Text style={styles.deptSub}>
                        {dept.count} Achievement{dept.count !== 1 ? 's' : ''}
                      </Text>
                    </View>

                    <View style={styles.deptPointsCol}>
                      <Text style={styles.deptPoints}>{dept.points.toLocaleString()}</Text>
                      <Text style={styles.deptPointsLabel}>Points</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* ════════════════════════════════════════════════
                  8. CATEGORY INSIGHT
              ════════════════════════════════════════════════ */}
              {categoryPerformance.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={styles.sectionTitle}>Category Share</Text>
                      <Text style={styles.sectionSubtitle}>Distribution in filtered scope</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewAllBtn}
                      onPress={() => onNavigate('headCategoryManagement')}
                    >
                      <Text style={styles.viewAllText}>Categories</Text>
                      <Ionicons name="chevron-forward" size={13} color="#2563EB" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.categoryCard}>
                    {categoryPerformance.map((cat, idx) => (
                      <View
                        key={idx}
                        style={[styles.catRow, idx < categoryPerformance.length - 1 && styles.deptRowBorder]}
                      >
                        <View style={[styles.catIndicator, { backgroundColor: cat.color }]} />
                        <View style={styles.catInfo}>
                          <Text style={styles.catName} numberOfLines={1}>
                            {cat.name}
                          </Text>
                          <Text style={styles.catSub}>{cat.count} verified</Text>
                        </View>
                        <Text style={[styles.catPct, { color: cat.color }]}>{cat.pct}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* ════════════════════════════════════════════════
                  9. OPTIONAL INSTITUTIONAL LEADERBOARD
              ════════════════════════════════════════════════ */}
              <TouchableOpacity
                style={styles.leaderboardExpander}
                activeOpacity={0.8}
                onPress={() => setShowLeaderboards(!showLeaderboards)}
              >
                <View style={styles.leaderboardExpanderLeft}>
                  <Ionicons name="podium-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                  <Text style={styles.leaderboardExpanderTitle}>
                    {showLeaderboards ? 'Hide Leaderboards' : 'View Top Institutional Leaderboards'}
                  </Text>
                </View>
                <Ionicons
                  name={showLeaderboards ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#2563EB"
                />
              </TouchableOpacity>

              {showLeaderboards && (
                <View style={styles.leaderboardSection}>
                  <View style={styles.roleToggleRow}>
                    <TouchableOpacity
                      style={[
                        styles.roleToggleBtn,
                        activeLeaderboard === 'Student' && styles.roleToggleBtnActive,
                      ]}
                      onPress={() => setActiveLeaderboard('Student')}
                    >
                      <Text
                        style={[
                          styles.roleToggleText,
                          activeLeaderboard === 'Student' && styles.roleToggleTextActive,
                        ]}
                      >
                        Top Students
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.roleToggleBtn,
                        activeLeaderboard === 'Faculty' && styles.roleToggleBtnActive,
                      ]}
                      onPress={() => setActiveLeaderboard('Faculty')}
                    >
                      <Text
                        style={[
                          styles.roleToggleText,
                          activeLeaderboard === 'Faculty' && styles.roleToggleTextActive,
                        ]}
                      >
                        Top Faculty
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.deptCard}>
                    {(activeLeaderboard === 'Student' ? studentLeaderboard : facultyLeaderboard)
                      .slice(0, 5)
                      .map((item, idx) => (
                        <View key={idx} style={[styles.lbRow, idx < 4 && styles.deptRowBorder]}>
                          <View style={styles.lbRankBadge}>
                            <Text style={styles.lbRankText}>#{idx + 1}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.lbName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.lbSub} numberOfLines={1}>
                              {'rollNumber' in item ? item.rollNumber : item.department}
                            </Text>
                          </View>
                          <Text style={styles.lbPoints}>
                            {String('totalPoints' in item ? (item as any).totalPoints : (item as any).points)} pts
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              )}
            </>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            10. BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          activeTab="analytics"
          variant="head"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('headDashboard');
            } else if (tab === 'achievements') {
              onNavigate('headCollegeAchievements');
            } else if (tab === 'analytics') {
              // already on analytics
            } else if (tab === 'reports') {
              onNavigate('headReports');
            } else if (tab === 'profile') {
              onNavigate('facultyProfile');
            }
          }}
        />

        {/* ════════════════════════════════════════════════
            11. MAIN FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setFilterModalVisible(false)}
            />
            <View style={styles.filterSheetContainer}>
              {/* Sheet Header */}
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>FILTER ANALYTICS</Text>
                  <Text style={styles.sheetSub}>Scope & attribute constraints</Text>
                </View>
                <TouchableOpacity onPress={handleResetDraft}>
                  <Text style={styles.sheetResetText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.sheetBody}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* ── ACADEMIC SECTION ── */}
                <Text style={styles.filterGroupHeader}>ACADEMIC</Text>
                <View style={styles.filterCard}>
                  {/* Academic Year */}
                  <View style={styles.filterInlineRow}>
                    <Text style={styles.filterLabel}>Academic Year</Text>
                    <View style={styles.chipsRow}>
                      {['2026–27', '2025–26', 'ALL'].map((yr) => (
                        <TouchableOpacity
                          key={yr}
                          style={[
                            styles.smallChip,
                            draftFilters.academicYear === yr && styles.smallChipActive,
                          ]}
                          onPress={() => setDraftFilters((prev) => ({ ...prev, academicYear: yr }))}
                        >
                          <Text
                            style={[
                              styles.smallChipText,
                              draftFilters.academicYear === yr && styles.smallChipTextActive,
                            ]}
                          >
                            {yr === 'ALL' ? 'All' : yr}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Semester */}
                  <View style={styles.filterInlineRow}>
                    <Text style={styles.filterLabel}>Semester</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                      <View style={styles.chipsRow}>
                        {SEMESTERS.map((sem) => (
                          <TouchableOpacity
                            key={sem}
                            style={[
                              styles.smallChip,
                              draftFilters.semester === sem && styles.smallChipActive,
                            ]}
                            onPress={() => setDraftFilters((prev) => ({ ...prev, semester: sem }))}
                          >
                            <Text
                              style={[
                                styles.smallChipText,
                                draftFilters.semester === sem && styles.smallChipTextActive,
                              ]}
                            >
                              {sem === 'ALL' ? 'All' : `S${sem}`}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </View>

                {/* ── SCOPE SECTION ── */}
                <Text style={styles.filterGroupHeader}>SCOPE</Text>
                <View style={styles.filterCard}>
                  {/* Department Drilldown */}
                  <TouchableOpacity
                    style={styles.drilldownRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      setDeptSearchText('');
                      setDeptPickerVisible(true);
                    }}
                  >
                    <Text style={styles.filterLabel}>Department</Text>
                    <View style={styles.drilldownRight}>
                      <Text style={styles.drilldownVal} numberOfLines={1}>
                        {getDeptDisplay(draftFilters.department)}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  {/* Student Year (Hidden if Faculty) */}
                  {draftFilters.userType !== 'Faculty' && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.filterInlineRow}>
                        <Text style={styles.filterLabel}>Student Year</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                          <View style={styles.chipsRow}>
                            {STUDENT_YEARS.map((yr) => (
                              <TouchableOpacity
                                key={yr}
                                style={[
                                  styles.smallChip,
                                  draftFilters.studentYear === yr && styles.smallChipActive,
                                ]}
                                onPress={() => setDraftFilters((prev) => ({ ...prev, studentYear: yr }))}
                              >
                                <Text
                                  style={[
                                    styles.smallChipText,
                                    draftFilters.studentYear === yr && styles.smallChipTextActive,
                                  ]}
                                >
                                  {yr === 'ALL' ? 'All' : yr.split(' ')[0]}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    </>
                  )}
                </View>

                {/* ── ACHIEVEMENT SECTION ── */}
                <Text style={styles.filterGroupHeader}>ACHIEVEMENT</Text>
                <View style={styles.filterCard}>
                  {/* Category Drilldown */}
                  <TouchableOpacity
                    style={styles.drilldownRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      setCatSearchText('');
                      setCatPickerVisible(true);
                    }}
                  >
                    <Text style={styles.filterLabel}>Category</Text>
                    <View style={styles.drilldownRight}>
                      <Text style={styles.drilldownVal} numberOfLines={1}>
                        {draftFilters.category === 'ALL' ? 'All Categories' : draftFilters.category}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {/* Achievement Type Drilldown */}
                  <TouchableOpacity
                    style={styles.drilldownRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      setTypeSearchText('');
                      setTypePickerVisible(true);
                    }}
                  >
                    <Text style={styles.filterLabel}>Achievement Type</Text>
                    <View style={styles.drilldownRight}>
                      <Text style={styles.drilldownVal} numberOfLines={1}>
                        {draftFilters.achievementType === 'ALL' ? 'All Types' : draftFilters.achievementType}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {/* Level */}
                  <View style={styles.filterInlineRow}>
                    <Text style={styles.filterLabel}>Level</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                      <View style={styles.chipsRow}>
                        {LEVELS.map((lvl) => (
                          <TouchableOpacity
                            key={lvl}
                            style={[
                              styles.smallChip,
                              draftFilters.level === lvl && styles.smallChipActive,
                            ]}
                            onPress={() => setDraftFilters((prev) => ({ ...prev, level: lvl }))}
                          >
                            <Text
                              style={[
                                styles.smallChipText,
                                draftFilters.level === lvl && styles.smallChipTextActive,
                              ]}
                            >
                              {lvl === 'ALL' ? 'All' : lvl}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View style={styles.divider} />

                  {/* Result */}
                  <View style={styles.filterInlineRow}>
                    <Text style={styles.filterLabel}>Result</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                      <View style={styles.chipsRow}>
                        {RESULTS.map((res) => (
                          <TouchableOpacity
                            key={res}
                            style={[
                              styles.smallChip,
                              draftFilters.result === res && styles.smallChipActive,
                            ]}
                            onPress={() => setDraftFilters((prev) => ({ ...prev, result: res }))}
                          >
                            <Text
                              style={[
                                styles.smallChipText,
                                draftFilters.result === res && styles.smallChipTextActive,
                              ]}
                            >
                              {res === 'ALL' ? 'All' : res}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </View>

                {/* ── USER ROLE SECTION ── */}
                <Text style={styles.filterGroupHeader}>USER</Text>
                <View style={styles.filterCard}>
                  <View style={styles.filterInlineRow}>
                    <Text style={styles.filterLabel}>User Type</Text>
                    <View style={styles.chipsRow}>
                      {USER_TYPES.map((u) => (
                        <TouchableOpacity
                          key={u}
                          style={[
                            styles.smallChip,
                            draftFilters.userType === u && styles.smallChipActive,
                          ]}
                          onPress={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              userType: u,
                              // If switched to Faculty, reset studentYear
                              studentYear: u === 'Faculty' ? 'ALL' : prev.studentYear,
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.smallChipText,
                              draftFilters.userType === u && styles.smallChipTextActive,
                            ]}
                          >
                            {u === 'ALL' ? 'All Users' : u}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Sheet Footer Dynamic CTA */}
              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.applyBtn}
                  activeOpacity={0.85}
                  onPress={handleApplyFilters}
                >
                  <Text style={styles.applyBtnText}>
                    Show {draftCount} Result{draftCount !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            SUB-PICKER: DEPARTMENT MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={deptPickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDeptPickerVisible(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalBox}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Select Department</Text>
                <TouchableOpacity onPress={() => setDeptPickerVisible(false)}>
                  <Ionicons name="close" size={20} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View style={styles.subSearchBox}>
                <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.subSearchInput}
                  placeholder="Search department..."
                  placeholderTextColor="#94A3B8"
                  value={deptSearchText}
                  onChangeText={setDeptSearchText}
                />
              </View>

              <ScrollView style={{ maxHeight: 320 }}>
                {ALL_DEPARTMENTS.filter(
                  (d) =>
                    d.name.toLowerCase().includes(deptSearchText.toLowerCase()) ||
                    d.id.toLowerCase().includes(deptSearchText.toLowerCase())
                ).map((dept) => {
                  const isSelected = draftFilters.department === dept.id;
                  return (
                    <TouchableOpacity
                      key={dept.id}
                      style={[styles.subOptionRow, isSelected && styles.subOptionRowActive]}
                      onPress={() => {
                        setDraftFilters((prev) => ({ ...prev, department: dept.id }));
                        setDeptPickerVisible(false);
                      }}
                    >
                      <Text style={[styles.subOptionText, isSelected && styles.subOptionTextActive]}>
                        {dept.name}
                      </Text>
                      {isSelected && <Ionicons name="checkmark-sharp" size={18} color="#2563EB" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            SUB-PICKER: CATEGORY MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={catPickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCatPickerVisible(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalBox}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Select Category</Text>
                <TouchableOpacity onPress={() => setCatPickerVisible(false)}>
                  <Ionicons name="close" size={20} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View style={styles.subSearchBox}>
                <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.subSearchInput}
                  placeholder="Search category..."
                  placeholderTextColor="#94A3B8"
                  value={catSearchText}
                  onChangeText={setCatSearchText}
                />
              </View>

              <ScrollView style={{ maxHeight: 320 }}>
                {/* Option: ALL */}
                <TouchableOpacity
                  style={[styles.subOptionRow, draftFilters.category === 'ALL' && styles.subOptionRowActive]}
                  onPress={() => {
                    setDraftFilters((prev) => ({
                      ...prev,
                      category: 'ALL',
                      achievementType: 'ALL',
                    }));
                    setCatPickerVisible(false);
                  }}
                >
                  <Text style={[styles.subOptionText, draftFilters.category === 'ALL' && styles.subOptionTextActive]}>
                    All Categories
                  </Text>
                  {draftFilters.category === 'ALL' && (
                    <Ionicons name="checkmark-sharp" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>

                {categories
                  .filter((c) => c.title.toLowerCase().includes(catSearchText.toLowerCase()))
                  .map((cat) => {
                    const isSelected = draftFilters.category === cat.title;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.subOptionRow, isSelected && styles.subOptionRowActive]}
                        onPress={() => {
                          setDraftFilters((prev) => {
                            // If selected achievementType doesn't belong to new cat, reset it to ALL
                            const validTypes = cat.types.map((t) => t.label || t.name);
                            const keepType = validTypes.includes(prev.achievementType);
                            return {
                              ...prev,
                              category: cat.title,
                              achievementType: keepType ? prev.achievementType : 'ALL',
                            };
                          });
                          setCatPickerVisible(false);
                        }}
                      >
                        <Text style={[styles.subOptionText, isSelected && styles.subOptionTextActive]}>
                          {cat.title}
                        </Text>
                        {isSelected && <Ionicons name="checkmark-sharp" size={18} color="#2563EB" />}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            SUB-PICKER: ACHIEVEMENT TYPE MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={typePickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTypePickerVisible(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalBox}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Select Achievement Type</Text>
                <TouchableOpacity onPress={() => setTypePickerVisible(false)}>
                  <Ionicons name="close" size={20} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View style={styles.subSearchBox}>
                <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.subSearchInput}
                  placeholder="Search type..."
                  placeholderTextColor="#94A3B8"
                  value={typeSearchText}
                  onChangeText={setTypeSearchText}
                />
              </View>

              <ScrollView style={{ maxHeight: 320 }}>
                {/* Option: ALL */}
                <TouchableOpacity
                  style={[styles.subOptionRow, draftFilters.achievementType === 'ALL' && styles.subOptionRowActive]}
                  onPress={() => {
                    setDraftFilters((prev) => ({ ...prev, achievementType: 'ALL' }));
                    setTypePickerVisible(false);
                  }}
                >
                  <Text style={[styles.subOptionText, draftFilters.achievementType === 'ALL' && styles.subOptionTextActive]}>
                    All Types
                  </Text>
                  {draftFilters.achievementType === 'ALL' && (
                    <Ionicons name="checkmark-sharp" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>

                {availableTypes
                  .filter((t) => t.toLowerCase().includes(typeSearchText.toLowerCase()))
                  .map((typeName) => {
                    const isSelected = draftFilters.achievementType === typeName;
                    return (
                      <TouchableOpacity
                        key={typeName}
                        style={[styles.subOptionRow, isSelected && styles.subOptionRowActive]}
                        onPress={() => {
                          setDraftFilters((prev) => ({ ...prev, achievementType: typeName }));
                          setTypePickerVisible(false);
                        }}
                      >
                        <Text style={[styles.subOptionText, isSelected && styles.subOptionTextActive]}>
                          {typeName}
                        </Text>
                        {isSelected && <Ionicons name="checkmark-sharp" size={18} color="#2563EB" />}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  /* Top Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FAF8F5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },

  /* Scroll Area */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  /* Filter Button & Scope Row */
  filterControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  filterBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  scopeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  scopeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Active Filter Chips Scroll */
  chipsContainer: {
    marginBottom: 14,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  clearAllChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearAllChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* Empty State */
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyResetBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },

  /* Metrics Horizontal Scroll */
  metricsContainer: {
    marginBottom: 18,
  },
  metricsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    width: 140,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* Trend Chart Card */
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  chartBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  barValuePeak: {
    color: '#2563EB',
    fontWeight: '800',
  },
  barTrack: {
    width: 22,
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barNormalFill: {
    backgroundColor: '#93C5FD',
  },
  barPeakFill: {
    backgroundColor: '#2563EB',
  },
  barLabelText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },

  /* Department Performance */
  deptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  deptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deptRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  deptNameCol: {
    flex: 1,
    marginRight: 10,
  },
  deptName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  deptSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  deptPointsCol: {
    alignItems: 'flex-end',
  },
  deptPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  deptPointsLabel: {
    fontSize: 9.5,
    color: '#94A3B8',
  },

  /* Category Card */
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  catIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  catSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  catPct: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* Leaderboard Section */
  leaderboardExpander: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  leaderboardExpanderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardExpanderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  leaderboardSection: {
    marginBottom: 16,
  },
  roleToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  roleToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  roleToggleBtnActive: {
    backgroundColor: '#2563EB',
  },
  roleToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  roleToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  lbRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  lbRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  lbName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  lbSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  lbPoints: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Filter Modal Sheet */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  filterSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  sheetSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  sheetResetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  filterGroupHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 6,
  },
  filterCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  filterLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginRight: 10,
    minWidth: 100,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  smallChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  smallChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  drilldownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  drilldownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  drilldownVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 4,
    maxWidth: 160,
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  applyBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Sub Pickers (Modals) */
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subModalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    maxHeight: 440,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  subModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subModalTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  subSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  subSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    padding: 0,
  },
  subOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  subOptionRowActive: {
    backgroundColor: '#EEF2FF',
  },
  subOptionText: {
    fontSize: 13,
    color: '#334155',
  },
  subOptionTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
