// ─────────────────────────────────────────────────────────────
// AchieveX — Leaderboard Screen
// Premium, SaaS-level institutional leaderboard dashboard
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

import { LOGGED_IN_STUDENT } from '../data/achievementConfig';
import { LEADERBOARD_DATA, type LeaderboardStudent } from '../data/leaderboardData';
import StudentBottomTab from './StudentBottomTab';
import { useBottomNavInset } from '../hooks/useBottomNavInset';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LeaderboardScreenProps {
  onGoBack: () => void;
  onOpenSubmitAchievement: () => void;
  onOpenGoals?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenProfile?: () => void;
  onOpenMyAchievements?: () => void;
}

export default function LeaderboardScreen({
  onGoBack,
  onOpenSubmitAchievement,
  onOpenGoals,
  onOpenProfile,
  onOpenMyAchievements,
}: LeaderboardScreenProps) {
  const { totalNavHeight, contentBottomPadding, insets } = useBottomNavInset();
  // Navigation active state highlight helper
  // Tab 3 is active (Leaderboard)

  // Filters State
  const [academicYear, setAcademicYear] = useState('2026–27');
  const [semester, setSemester] = useState('All Semesters');
  const [scope, setScope] = useState('Institution'); // 'Institution' | 'Department' | 'Year'
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Modal Sheet Visibility
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Table Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Visual/Interactive State
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userRowVisible, setUserRowVisible] = useState(true);

  // References for scroll anchoring
  const scrollRef = useRef<ScrollView>(null);
  const progressCardY = useRef<number>(0);

  // Logged-in user stats mapping (Gokulraj Velusamy)
  const loggedInStudentData = LEADERBOARD_DATA.find((s) => s.rollNumber === LOGGED_IN_STUDENT.rollNumber);
  const currentRank = loggedInStudentData?.rank || 18;
  const currentPoints = loggedInStudentData?.points || 242;
  const currentBadge = loggedInStudentData?.badge || 'Gold';
  const currentMovement = loggedInStudentData?.movementAmount || 4;

  // Dynamic context generation
  const nextRankPointsDiff = 12; // 254 (Divya P) - 242 = 12
  const pointsToPlatinum = 58; // 300 - 242 = 58

  // Simulated Loading State on filter apply
  const triggerFilterSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Filter lists
  const DEPARTMENTS = [
    'All Departments', 'CSE (IoT)', 'CSE', 'CSE (CS)', 'IT', 'AIDS', 'ECE', 'EEE', 'BME', 'Mechanical',
  ];
  const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const CATEGORIES = [
    'All Categories',
    'Technical & Professional',
    'Sports & Games',
    'Certifications & Online Learning',
    'Research & Intellectual Property',
    'Competitive Exams',
    'Internship & Placement',
    'Entrepreneurship',
    'Leadership',
    'Social & Cultural',
    'Membership & Professional Activities',
  ];

  // Dynamic Filtering Logic
  const getFilteredData = (): LeaderboardStudent[] => {
    let list = [...LEADERBOARD_DATA];

    // Department Filter
    if (selectedDept !== 'All Departments') {
      list = list.filter((s) => s.department === selectedDept);
    }

    // Year Filter
    if (selectedYear !== 'All Years') {
      list = list.filter((s) => s.year === selectedYear);
    }

    // Category Point Recalculation & Sorting
    if (selectedCategory !== 'All Categories') {
      list = list
        .map((s) => {
          const categoryPoints = s.categoryBreakdown[selectedCategory] || 0;
          return {
            ...s,
            points: categoryPoints,
          };
        })
        // Filter out students who have 0 points in that category
        .filter((s) => s.points > 0);
    }

    // Search Query (Name or Roll Number)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
      );
    }

    // Sort deterministically:
    // 1. Points (Descending)
    // 2. Rank (Original rank index for tie-break)
    list.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return a.rank - b.rank;
    });

    // Re-assign ranks dynamically after filters
    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  };

  const filteredList = getFilteredData();

  // Top 3 Podium extraction
  const podiumStudents = filteredList.slice(0, 3);
  const tableStudents = filteredList.slice(3);

  // Paginated table students
  const totalPages = Math.ceil(tableStudents.length / itemsPerPage);
  const paginatedTableStudents = tableStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Dynamic Insight Text
  const getStrongestCategoryInsight = (): string => {
    if (!loggedInStudentData) return '';
    const breakdown = loggedInStudentData.categoryBreakdown;
    let strongestCat = '';
    let maxPoints = 0;
    Object.keys(breakdown).forEach((cat) => {
      if (breakdown[cat] > maxPoints) {
        maxPoints = breakdown[cat];
        strongestCat = cat;
      }
    });

    const percentage = Math.round((maxPoints / currentPoints) * 100);
    return `${strongestCat} achievements are your strongest category, contributing ${percentage}% of your verified points.`;
  };

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
    setPage(1);
    triggerFilterSimulation();
  };

  const handleClearFilters = () => {
    setSelectedDept('All Departments');
    setSelectedYear('All Years');
    setSelectedCategory('All Categories');
    setScope('Institution');
    setSearchQuery('');
    setPage(1);
    setFilterModalVisible(false);
    triggerFilterSimulation();
  };

  // Scroll anchor to next badge progress card
  const scrollToProgressCard = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: progressCardY.current, animated: true });
    }
  };

  // Monitor layout change to grab y-position of Next Badge card
  const handleProgressCardLayout = (event: any) => {
    progressCardY.current = event.nativeEvent.layout.y;
  };

  // Render a skeleton loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonPerformanceCard} />
          <View style={styles.skeletonFilters} />
          <View style={styles.skeletonPodium} />
          <View style={styles.skeletonRow} />
          <View style={styles.skeletonRow} />
          <View style={styles.skeletonRow} />
        </View>
      </SafeAreaView>
    );
  }

  // Render Error State
  if (hasError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#DC2626" />
          <Text style={styles.errorTitle}>Unable to load leaderboard</Text>
          <Text style={styles.errorSubtitle}>
            Something went wrong while loading the rankings.
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setHasError(false);
              triggerFilterSimulation();
            }}
          >
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />

      {/* Main Container */}
      <View style={styles.mainContainer}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: contentBottomPadding + (!userRowVisible ? 64 : 0) },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            // Hide sticky user card if the user scrolls to top
            const y = e.nativeEvent.contentOffset.y;
            setUserRowVisible(y < 120);
          }}
          scrollEventThrottle={16}
        >
          {/* 1. Page Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Leaderboard</Text>
              <Text style={styles.headerSubtitle}>
                Track achievement performance, compare your progress, and see where you stand.
              </Text>
            </View>

            {/* Academic Year Selector Dropdown */}
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.academicSelector}
                onPress={() => setYearDropdownVisible(!yearDropdownVisible)}
                activeOpacity={0.7}
              >
                <Text style={styles.academicText}>{academicYear}</Text>
                <Ionicons name="chevron-down" size={12} color="#6B7280" />
              </TouchableOpacity>

              {yearDropdownVisible && (
                <View style={styles.yearDropdownCard}>
                  {['2025–26', '2026–27'].map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setAcademicYear(y);
                        setYearDropdownVisible(false);
                        triggerFilterSimulation();
                      }}
                    >
                      <Text style={[styles.dropdownOptionText, academicYear === y && styles.dropdownOptionTextActive]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* 2. Personal Performance Card */}
          <View style={styles.performanceCard}>
            <LinearGradient
              colors={['#1D4ED8', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.performanceGradient}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.performanceCardTitle}>YOUR PERFORMANCE</Text>
              </View>

              <View style={styles.performanceStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>#{currentRank}</Text>
                  <Text style={styles.statLabel}>Current Rank</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{currentPoints}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{currentBadge.toUpperCase()}</Text>
                  <Text style={styles.statLabel}>Badge</Text>
                </View>
              </View>

              <View style={styles.performanceMovementRow}>
                <View style={styles.movementItem}>
                  <Ionicons name="arrow-up" size={14} color="#34D399" />
                  <Text style={styles.movementText}>
                    {currentMovement} positions this month
                  </Text>
                </View>
                <View style={styles.badgeProgressAlert}>
                  <Ionicons name="ribbon-outline" size={14} color="#FDE047" />
                  <Text style={styles.badgeAlertText}>
                    {pointsToPlatinum} points to reach Platinum
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.progressBtn}
                onPress={scrollToProgressCard}
                activeOpacity={0.8}
              >
                <Text style={styles.progressBtnText}>View My Progress</Text>
                <Feather name="arrow-right" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* 3. Personal Rank Context */}
          <View style={styles.contextMessageCard}>
            <View style={styles.contextRow}>
              <Ionicons name="information-circle" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.contextText}>
                You're <Text style={{ fontWeight: '700' }}>{nextRankPointsDiff} points</Text> away from #17. Keep going!
              </Text>
            </View>
          </View>

          {/* 4. Filter Bar */}
          <View style={styles.filterSection}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search student by name or roll..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setPage(1);
                }}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                (selectedDept !== 'All Departments' ||
                  selectedYear !== 'All Years' ||
                  selectedCategory !== 'All Categories') &&
                  styles.filterBtnActive,
              ]}
              onPress={() => setFilterModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="funnel-outline" size={16} color="#1F2937" />
              <Text style={styles.filterBtnText}>Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Scope Selector Tabs */}
          <View style={styles.scopeTabsContainer}>
            {['Institution', 'Department', 'Year'].map((tab) => {
              const active = scope === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.scopeTab, active && styles.scopeTabActive]}
                  onPress={() => {
                    setScope(tab);
                    setPage(1);
                    if (tab === 'Department') {
                      setSelectedDept('CSE (IoT)'); // Default to current student dept scope
                      setSelectedYear('All Years');
                    } else if (tab === 'Year') {
                      setSelectedDept('All Departments');
                      setSelectedYear('3rd Year'); // Default to current student year scope
                    } else {
                      setSelectedDept('All Departments');
                      setSelectedYear('All Years');
                    }
                    triggerFilterSimulation();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.scopeTabLabel, active && styles.scopeTabLabelActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 5. Top 3 Podium Section */}
          {filteredList.length > 0 ? (
            <View style={styles.podiumContainer}>
              {/* Rank 2 (Left) */}
              {podiumStudents[1] && (
                <View style={styles.podiumColumn}>
                  <View style={[styles.avatarOutline, { borderColor: '#9CA3AF' }]}>
                    <Text style={styles.avatarInitials}>
                      {podiumStudents[1].name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                    <View style={[styles.podiumBadgeTag, { backgroundColor: '#9CA3AF' }]}>
                      <Text style={styles.podiumBadgeTagText}>🥈</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {podiumStudents[1].name}
                  </Text>
                  <Text style={styles.podiumMeta}>
                    {podiumStudents[1].department} • {podiumStudents[1].year}
                  </Text>
                  <View style={[styles.podiumPointsBadge, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={[styles.podiumPointsText, { color: '#4B5563' }]}>
                      {podiumStudents[1].points} Pts
                    </Text>
                  </View>
                  <Text style={styles.podiumBadgeLabel}>{podiumStudents[1].badge}</Text>
                </View>
              )}

              {/* Rank 1 (Center) */}
              {podiumStudents[0] && (
                <View style={[styles.podiumColumn, styles.podiumCenter]}>
                  <View style={[styles.avatarOutline, styles.avatarOutlineLarge, { borderColor: '#FBBF24' }]}>
                    <Text style={[styles.avatarInitials, styles.avatarInitialsLarge]}>
                      {podiumStudents[0].name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                    <View style={[styles.podiumBadgeTag, styles.podiumBadgeTagLarge, { backgroundColor: '#FBBF24' }]}>
                      <Text style={styles.podiumBadgeTagText}>🥇</Text>
                    </View>
                  </View>
                  <Text style={[styles.podiumName, styles.podiumNameLarge]} numberOfLines={1}>
                    {podiumStudents[0].name}
                  </Text>
                  <Text style={styles.podiumMeta}>
                    {podiumStudents[0].department} • {podiumStudents[0].year}
                  </Text>
                  <View style={[styles.podiumPointsBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.podiumPointsText, { color: '#D97706' }]}>
                      {podiumStudents[0].points} Pts
                    </Text>
                  </View>
                  <Text style={[styles.podiumBadgeLabel, { color: '#CA8A04', fontWeight: '800' }]}>
                    {podiumStudents[0].badge}
                  </Text>
                </View>
              )}

              {/* Rank 3 (Right) */}
              {podiumStudents[2] && (
                <View style={styles.podiumColumn}>
                  <View style={[styles.avatarOutline, { borderColor: '#D97706' }]}>
                    <Text style={styles.avatarInitials}>
                      {podiumStudents[2].name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                    <View style={[styles.podiumBadgeTag, { backgroundColor: '#D97706' }]}>
                      <Text style={styles.podiumBadgeTagText}>🥉</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {podiumStudents[2].name}
                  </Text>
                  <Text style={styles.podiumMeta}>
                    {podiumStudents[2].department} • {podiumStudents[2].year}
                  </Text>
                  <View style={[styles.podiumPointsBadge, { backgroundColor: '#FAF8F5' }]}>
                    <Text style={[styles.podiumPointsText, { color: '#D97706' }]}>
                      {podiumStudents[2].points} Pts
                    </Text>
                  </View>
                  <Text style={styles.podiumBadgeLabel}>{podiumStudents[2].badge}</Text>
                </View>
              )}
            </View>
          ) : null}

          {/* 6. Main Rankings List (Mobile Optimized) */}
          <View style={styles.rankingSection}>
            <Text style={styles.rankingTitle}>
              {selectedDept !== 'All Departments' ? selectedDept : 'Institution'} Rankings
            </Text>

            {filteredList.length === 0 ? (
              // Empty State
              <View style={styles.emptyContainer}>
                <Ionicons name="filter-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No students found</Text>
                <Text style={styles.emptySubtitle}>
                  There are no verified achievements matching the selected filters.
                </Text>
                <TouchableOpacity style={styles.clearFiltersLink} onPress={handleClearFilters}>
                  <Text style={styles.clearFiltersLinkText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Student Rows List
              <View style={styles.rankingList}>
                {/* Headers */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.thText, { width: 35 }]}>Rank</Text>
                  <Text style={[styles.thText, { flex: 1 }]}>Student</Text>
                  <Text style={[styles.thText, { width: 50, textAlign: 'center' }]}>Pts</Text>
                  <Text style={[styles.thText, { width: 60, textAlign: 'right' }]}>Badge</Text>
                </View>

                {/* Top 3 items included compactly if query is set, otherwise display elements starting from 4 */}
                {(searchQuery !== '' ? filteredList : paginatedTableStudents).map((student) => {
                  const isCurrentUser = student.rollNumber === LOGGED_IN_STUDENT.rollNumber;
                  const isUp = student.movement === 'up';
                  const isDown = student.movement === 'down';

                  return (
                    <View
                      key={student.rollNumber}
                      style={[styles.rankingRow, isCurrentUser && styles.rankingRowHighlight]}
                    >
                      {/* Rank Column */}
                      <View style={styles.rankCol}>
                        <Text style={[styles.rankText, isCurrentUser && styles.rankTextHighlight]}>
                          {student.rank < 10 ? `0${student.rank}` : student.rank}
                        </Text>
                      </View>

                      {/* Student Column */}
                      <View style={styles.studentCol}>
                        <View style={styles.rowAvatar}>
                          <Text style={styles.rowAvatarInitials}>
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </Text>
                        </View>
                        <View style={styles.studentInfo}>
                          <Text style={[styles.studentName, isCurrentUser && styles.studentNameHighlight]} numberOfLines={1}>
                            {student.name} {isCurrentUser && <Text style={styles.youText}>(YOU)</Text>}
                          </Text>
                          <Text style={styles.studentDeptYear}>
                            {student.department} • {student.year}
                          </Text>
                        </View>
                      </View>

                      {/* Points Column */}
                      <View style={styles.pointsCol}>
                        <Text style={styles.pointsText}>{student.points}</Text>
                        <View style={styles.movementBadge}>
                          {isUp && <Ionicons name="arrow-up" size={10} color="#16A34A" />}
                          {isDown && <Ionicons name="arrow-down" size={10} color="#DC2626" />}
                          <Text
                            style={[
                              styles.movementLabel,
                              isUp && styles.movementLabelUp,
                              isDown && styles.movementLabelDown,
                            ]}
                          >
                            {student.movementAmount > 0 ? student.movementAmount : '—'}
                          </Text>
                        </View>
                      </View>

                      {/* Badge Column */}
                      <View style={styles.badgeCol}>
                        <View
                          style={[
                            styles.badgePill,
                            student.badge === 'Platinum' && styles.badgePillPlat,
                            student.badge === 'Gold' && styles.badgePillGold,
                            student.badge === 'Silver' && styles.badgePillSilv,
                            student.badge === 'Bronze' && styles.badgePillBron,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgePillText,
                              student.badge === 'Platinum' && styles.badgePillTextPlat,
                              student.badge === 'Gold' && styles.badgePillTextGold,
                              student.badge === 'Silver' && styles.badgePillTextSilv,
                              student.badge === 'Bronze' && styles.badgePillTextBron,
                            ]}
                          >
                            {student.badge}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

                {/* Pagination Controls */}
                {searchQuery === '' && totalPages > 1 && (
                  <View style={styles.paginationRow}>
                    <TouchableOpacity
                      style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                      disabled={page === 1}
                      onPress={() => setPage((p) => p - 1)}
                    >
                      <Ionicons name="chevron-back" size={16} color={page === 1 ? '#9CA3AF' : '#2563EB'} />
                    </TouchableOpacity>
                    <Text style={styles.paginationText}>
                      Page {page} of {totalPages}
                    </Text>
                    <TouchableOpacity
                      style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
                      disabled={page === totalPages}
                      onPress={() => setPage((p) => p + 1)}
                    >
                      <Ionicons name="chevron-forward" size={16} color={page === totalPages ? '#9CA3AF' : '#2563EB'} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 7. Achievement Category Performance Chart */}
          {loggedInStudentData && (
            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Achievement Performance</Text>
              <Text style={styles.cardSubtitle}>Your points distribution across verified categories</Text>

              <View style={styles.chartContainer}>
                {Object.keys(loggedInStudentData.categoryBreakdown).map((cat) => {
                  const score = loggedInStudentData.categoryBreakdown[cat];
                  if (score === 0) return null;

                  // Compute percentage out of max points (say 200 for technical)
                  const maxPossible = 200;
                  const percentWidth = `${Math.min((score / maxPossible) * 100, 100)}%`;

                  return (
                    <View key={cat} style={styles.chartRow}>
                      <View style={styles.chartInfoRow}>
                        <Text style={styles.chartRowLabel}>{cat}</Text>
                        <Text style={styles.chartRowScore}>{score} Pts</Text>
                      </View>
                      <View style={styles.chartTrack}>
                        <View style={[styles.chartFill, { width: percentWidth as any }]} />
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.insightBox}>
                <Ionicons name="bulb-outline" size={16} color="#D97706" style={{ marginRight: 6, marginTop: 1 }} />
                <Text style={styles.insightText}>{getStrongestCategoryInsight()}</Text>
              </View>
            </View>
          )}

          {/* 8. Next Badge Progress Card */}
          <View style={styles.badgeProgressCard} onLayout={handleProgressCardLayout}>
            <Text style={styles.cardTitle}>Next Badge Progress</Text>
            
            <View style={styles.badgeProgressDetails}>
              {/* Current Badge */}
              <View style={styles.badgeTargetCol}>
                <View style={[styles.badgeIconBg, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="ribbon" size={24} color="#D97706" />
                </View>
                <Text style={styles.badgeTargetName}>{currentBadge}</Text>
                <Text style={styles.badgeTargetStatus}>Unlocked</Text>
              </View>

              <View style={styles.badgeConnectionLine} />

              {/* Next Target Badge */}
              <View style={styles.badgeTargetCol}>
                <View style={[styles.badgeIconBg, { backgroundColor: '#E0E7FF' }]}>
                  <Ionicons name="ribbon" size={24} color="#4F46E5" />
                </View>
                <Text style={styles.badgeTargetName}>Platinum</Text>
                <Text style={styles.badgeTargetStatus}>Next Target</Text>
              </View>
            </View>

            <View style={styles.badgeProgressBarSection}>
              <View style={styles.badgeProgressHeader}>
                <Text style={styles.badgeProgressPointsText}>
                  {currentPoints} <Text style={{ color: '#9CA3AF', fontWeight: '500' }}>/ 300 Pts</Text>
                </Text>
                <Text style={styles.badgeRemainingText}>{pointsToPlatinum} Pts remaining</Text>
              </View>
              {/* Progress Track */}
              <View style={styles.badgeProgressTrack}>
                <View
                  style={[
                    styles.badgeProgressFill,
                    { width: `${Math.min((currentPoints / 300) * 100, 100)}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* 9. Recent Verified Achievements */}
          {loggedInStudentData && (
            <View style={styles.recentActivityCard}>
              <Text style={styles.cardTitle}>Recent Verified Achievements</Text>
              <View style={styles.activityFeed}>
                {loggedInStudentData.recentAchievements.map((item, index) => (
                  <View key={index} style={styles.activityItem}>
                    <View style={styles.activityIconCircle}>
                      <Ionicons
                        name={item.category.includes('Sports') ? 'fitness' : 'trophy'}
                        size={18}
                        color="#2563EB"
                      />
                    </View>
                    <View style={styles.activityMain}>
                      <Text style={styles.activityItemTitle}>{item.title}</Text>
                      <Text style={styles.activityItemSub}>{item.category}</Text>
                      <Text style={styles.activityItemTime}>Verified {item.verifiedAgo}</Text>
                    </View>
                    <View style={styles.activityPoints}>
                      <Text style={styles.activityPointsText}>+{item.points} Pts</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* 10. Sticky Position Footer Card (Hidden when user scrolls past row) */}
        {!userRowVisible && loggedInStudentData && (
          <View style={[styles.stickyUserFooter, { bottom: totalNavHeight }]}>
            <View style={styles.stickyRow}>
              <View style={styles.stickyLeft}>
                <Text style={styles.stickyRankNum}>#{currentRank}</Text>
                <View style={styles.stickyStudentAvatar}>
                  <Text style={styles.rowAvatarInitials}>GV</Text>
                </View>
                <View style={styles.stickyStudentText}>
                  <Text style={styles.stickyStudentName}>Gokulraj Velusamy (YOU)</Text>
                  <Text style={styles.stickyStudentSub}>CSE (IoT) • 3rd Year</Text>
                </View>
              </View>
              <View style={styles.stickyRight}>
                <View style={styles.stickyPointsBadge}>
                  <Text style={styles.stickyPointsVal}>{currentPoints} Pts</Text>
                </View>
                <TouchableOpacity style={styles.stickyAnchorBtn} onPress={scrollToProgressCard}>
                  <Text style={styles.stickyAnchorText}>Progress</Text>
                  <Ionicons name="arrow-up" size={12} color="#2563EB" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── Unified Student Bottom Navigation Tab Bar ── */}
      <StudentBottomTab
        activeTab="leaderboard"
        onNavigate={(tab) => {
          if (tab === 'home') onGoBack();
          else if (tab === 'achievements') {
            if (onOpenMyAchievements) onOpenMyAchievements();
            else onOpenSubmitAchievement();
          } else if (tab === 'goals') {
            if (onOpenGoals) onOpenGoals();
          } else if (tab === 'leaderboard') {
            /* already on leaderboard */
          } else if (tab === 'profile') {
            if (onOpenProfile) onOpenProfile();
          }
        }}
      />

      {/* Clean Bottom Filter Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseOverlay}
            activeOpacity={1}
            onPress={() => setFilterModalVisible(false)}
          />
          <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 16) }]}>
            {/* Sheet Handle */}
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={styles.modalClearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* 1. Scope Option */}
              <Text style={styles.filterGroupTitle}>Scope</Text>
              <View style={styles.modalTabsRow}>
                {['Institution', 'Department', 'Year'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.modalScopeTab, scope === s && styles.modalScopeTabActive]}
                    onPress={() => setScope(s)}
                  >
                    <Text
                      style={[styles.modalScopeTabText, scope === s && styles.modalScopeTabTextActive]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. Department Selector */}
              <Text style={styles.filterGroupTitle}>Department</Text>
              <View style={styles.optionsWrap}>
                {DEPARTMENTS.map((dept) => {
                  const active = selectedDept === dept;
                  return (
                    <TouchableOpacity
                      key={dept}
                      style={[styles.optionPill, active && styles.optionPillActive]}
                      onPress={() => setSelectedDept(dept)}
                    >
                      <Text style={[styles.optionPillText, active && styles.optionPillTextActive]}>
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 3. Year Selector */}
              <Text style={styles.filterGroupTitle}>Academic Year</Text>
              <View style={styles.optionsWrap}>
                {YEARS.map((y) => {
                  const active = selectedYear === y;
                  return (
                    <TouchableOpacity
                      key={y}
                      style={[styles.optionPill, active && styles.optionPillActive]}
                      onPress={() => setSelectedYear(y)}
                    >
                      <Text style={[styles.optionPillText, active && styles.optionPillTextActive]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 4. Category Selector */}
              <Text style={styles.filterGroupTitle}>Achievement Category</Text>
              <View style={styles.optionsWrap}>
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.optionPill, active && styles.optionPillActive]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text style={[styles.optionPillText, active && styles.optionPillTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ height: 30 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={handleApplyFilters}
                activeOpacity={0.8}
              >
                <Text style={styles.modalApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Simple Alert replacement mock for compiler stability
const Alert = {
  alert: (title: string, desc: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${desc}`);
    } else {
      require('react-native').Alert.alert(title, desc);
    }
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* Skeleton Loading Styles */
  skeletonContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  skeletonHeader: {
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  skeletonPerformanceCard: {
    height: 180,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
  },
  skeletonFilters: {
    height: 50,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
  skeletonPodium: {
    height: 160,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
  },
  skeletonRow: {
    height: 55,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },

  /* Error Container */
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 16,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  /* Header Section */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  headerRight: {
    position: 'relative',
    zIndex: 100,
  },
  academicSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  academicText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 4,
  },
  yearDropdownCard: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 100,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownOptionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  dropdownOptionTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* Personal Performance Card */
  performanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  performanceGradient: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  performanceCardTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  performanceStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  performanceMovementRow: {
    flexDirection: 'column',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movementText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  badgeProgressAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badgeAlertText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 8,
  },
  progressBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Personal Rank Context Message */
  contextMessageCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },

  /* Search & Filter Section */
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 4,
  },
  filterBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },

  /* Scope tabs (Overall, Dept, Year) */
  scopeTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  scopeTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  scopeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scopeTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  scopeTabLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* Podium Section */
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  podiumColumn: {
    alignItems: 'center',
    width: 90,
  },
  podiumCenter: {
    marginBottom: 12,
  },
  avatarOutline: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  avatarOutlineLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  avatarInitialsLarge: {
    fontSize: 18,
  },
  podiumBadgeTag: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBadgeTagLarge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    bottom: -8,
  },
  podiumBadgeTagText: {
    fontSize: 11,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  podiumNameLarge: {
    fontSize: 13,
  },
  podiumMeta: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  podiumPointsBadge: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  podiumPointsText: {
    fontSize: 10,
    fontWeight: '800',
  },
  podiumBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
  },

  /* Ranking Table Section */
  rankingSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  rankingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  clearFiltersLink: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearFiltersLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  rankingList: {
    gap: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  thText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  rankingRowHighlight: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  rankCol: {
    width: 35,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  rankTextHighlight: {
    color: '#1E40AF',
  },
  studentCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarInitials: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  studentNameHighlight: {
    color: '#1E40AF',
  },
  youText: {
    fontSize: 9,
    color: '#2563EB',
    fontWeight: '800',
  },
  studentDeptYear: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 1,
  },
  pointsCol: {
    width: 50,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  movementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 1,
  },
  movementLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  movementLabelUp: {
    color: '#16A34A',
  },
  movementLabelDown: {
    color: '#DC2626',
  },
  badgeCol: {
    width: 60,
    alignItems: 'flex-end',
  },
  badgePill: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  badgePillPlat: { backgroundColor: '#EEF2FF' },
  badgePillGold: { backgroundColor: '#FEF3C7' },
  badgePillSilv: { backgroundColor: '#F3F4F6' },
  badgePillBron: { backgroundColor: '#FFEDD5' },
  badgePillText: { fontSize: 9, fontWeight: '800' },
  badgePillTextPlat: { color: '#4F46E5' },
  badgePillTextGold: { color: '#D97706' },
  badgePillTextSilv: { color: '#4B5563' },
  badgePillTextBron: { color: '#B45309' },

  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  pageBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pageBtnDisabled: {
    borderColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  paginationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  /* Card Common Layout */
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 16,
  },

  /* Category performance Chart Card */
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  chartContainer: {
    gap: 12,
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'column',
    gap: 4,
  },
  chartInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartRowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  chartRowScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  chartTrack: {
    height: 6,
    backgroundColor: '#E0E7FF',
    borderRadius: 3,
  },
  chartFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  insightText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
    lineHeight: 15,
  },

  /* Next Badge Progress Card */
  badgeProgressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  badgeProgressDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badgeTargetCol: {
    alignItems: 'center',
    width: 90,
  },
  badgeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeTargetName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  badgeTargetStatus: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 1,
  },
  badgeConnectionLine: {
    height: 2,
    backgroundColor: '#E5E7EB',
    flex: 1,
    marginHorizontal: 10,
    marginTop: -20,
  },
  badgeProgressBarSection: {
    marginTop: 4,
  },
  badgeProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeProgressPointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  badgeRemainingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  badgeProgressTrack: {
    height: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
  },
  badgeProgressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },

  /* Recent Verified Achievements Card */
  recentActivityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  activityFeed: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityMain: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  activityItemSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 1,
  },
  activityItemTime: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  activityPoints: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activityPointsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },

  /* Sticky Position Footer Bar */
  stickyUserFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EFF6FF',
    borderTopWidth: 1.5,
    borderTopColor: '#BFDBFE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  stickyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stickyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stickyRankNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E40AF',
  },
  stickyStudentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyStudentText: {
    justifyContent: 'center',
  },
  stickyStudentName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
  stickyStudentSub: {
    fontSize: 9,
    color: '#1E40AF',
    fontWeight: '600',
    marginTop: 1,
  },
  stickyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stickyPointsBadge: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  stickyPointsVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stickyAnchorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  stickyAnchorText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* Fixed Bottom Tab Bar Navigation matching DashboardScreen exactly */
  bottomTabBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: '#FAF8F5',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  bottomTabBar: {
    width: 337,
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },

  /* Modal Bottom Sheet styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCloseOverlay: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    height: SCREEN_HEIGHT * 0.75,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalClearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterGroupTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  modalTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  modalScopeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  modalScopeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalScopeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalScopeTabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  optionPillActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  optionPillText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  optionPillTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  modalApplyBtn: {
    flex: 2.2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
