// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Leaderboard Screen
// Institutional faculty achievement rankings and standing.
// Adheres strictly to the AchieveX SaaS design system:
// Header -> Blue/Indigo Hero Card -> Top 3 Podium -> Ranking Rows -> Bottom Nav
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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { DEFAULT_FACULTY_USER } from '../../data/facultyWorkspaceData';
import FacultyBottomTab from './FacultyBottomTab';

interface FacultyLeaderboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
}

export interface FacultyLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  department: string;
  designation: string;
  verifiedAchievements: number;
  points: number;
  isCurrentUser?: boolean;
}

// Stable Centralized Faculty Leaderboard Dataset
export const FACULTY_LEADERBOARD_ENTRIES: FacultyLeaderboardEntry[] = [
  {
    id: 'FAC-001',
    rank: 1,
    name: 'Dr. Priya S',
    department: 'CSE',
    designation: 'Professor & Head',
    verifiedAchievements: 18,
    points: 1240,
  },
  {
    id: 'FAC-002',
    rank: 2,
    name: 'Dr. Kumar V',
    department: 'CSE (IoT)',
    designation: 'Professor',
    verifiedAchievements: 16,
    points: 1080,
  },
  {
    id: 'FAC-003',
    rank: 3,
    name: 'Dr. Arun K',
    department: 'IT',
    designation: 'Associate Professor',
    verifiedAchievements: 15,
    points: 960,
  },
  {
    id: 'FAC-004',
    rank: 4,
    name: 'Dr. Karthikeyan M',
    department: 'CSE (IoT)',
    designation: 'Associate Professor',
    verifiedAchievements: 14,
    points: 890,
  },
  {
    id: 'FAC-005',
    rank: 5,
    name: 'Dr. Jeeva M',
    department: 'CSE (IoT)',
    designation: 'Assistant Professor',
    verifiedAchievements: 12,
    points: 820,
  },
  {
    id: 'FAC-006',
    rank: 6,
    name: 'Dr. Sathish R',
    department: 'ECE',
    designation: 'Professor',
    verifiedAchievements: 11,
    points: 750,
  },
  {
    id: 'FAC-007',
    rank: 7,
    name: 'Prof. Ramesh D',
    department: 'IT',
    designation: 'Assistant Professor',
    verifiedAchievements: 10,
    points: 620,
  },
  {
    id: 'FAC-024',
    rank: 8,
    name: 'Gokulraj V',
    department: 'CSE (IoT)',
    designation: 'Assistant Professor',
    verifiedAchievements: 12,
    points: 100,
    isCurrentUser: true,
  },
  {
    id: 'FAC-009',
    rank: 9,
    name: 'Prof. Anitha K',
    department: 'CSE',
    designation: 'Assistant Professor',
    verifiedAchievements: 8,
    points: 80,
  },
  {
    id: 'FAC-010',
    rank: 10,
    name: 'Dr. Suresh P',
    department: 'AIDS',
    designation: 'Associate Professor',
    verifiedAchievements: 6,
    points: 60,
  },
  {
    id: 'FAC-011',
    rank: 11,
    name: 'Prof. Meena R',
    department: 'ECE',
    designation: 'Assistant Professor',
    verifiedAchievements: 5,
    points: 50,
  },
  {
    id: 'FAC-012',
    rank: 12,
    name: 'Dr. Balaji T',
    department: 'Mechanical',
    designation: 'Professor',
    verifiedAchievements: 4,
    points: 40,
  },
];

const DEPARTMENTS = [
  'All Departments',
  'CSE (IoT)',
  'CSE',
  'IT',
  'ECE',
  'AIDS',
  'Mechanical',
];

const SEMESTERS = ['All Semesters', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function FacultyLeaderboard({
  onOpenMenu,
  onNavigate,
}: FacultyLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Current logged in faculty stats
  const currentFacultyEntry = useMemo(
    () => FACULTY_LEADERBOARD_ENTRIES.find((f) => f.isCurrentUser) || FACULTY_LEADERBOARD_ENTRIES[7],
    []
  );

  // Filtered Faculty List
  const filteredFaculty = useMemo(() => {
    return FACULTY_LEADERBOARD_ENTRIES.filter((f) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesDept = f.department.toLowerCase().includes(q);
        if (!matchesName && !matchesDept) return false;
      }

      // Department Filter
      if (selectedDept !== 'All Departments' && f.department !== selectedDept) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDept, selectedSemester]);

  // Top 3 Podium vs Regular List
  const top3Faculty = useMemo(() => {
    if (selectedDept !== 'All Departments' || searchQuery.trim() !== '') {
      return [];
    }
    return filteredFaculty.slice(0, 3);
  }, [filteredFaculty, selectedDept, searchQuery]);

  const listFaculty = useMemo(() => {
    if (top3Faculty.length === 3) {
      return filteredFaculty.slice(3);
    }
    return filteredFaculty;
  }, [filteredFaculty, top3Faculty]);

  const activeFiltersCount =
    (selectedDept !== 'All Departments' ? 1 : 0) + (selectedSemester !== 'All Semesters' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedDept('All Departments');
    setSelectedSemester('All Semesters');
    setFilterModalVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const renderRankingItem = ({ item }: { item: FacultyLeaderboardEntry }) => {
    const isCurrent = item.isCurrentUser;

    return (
      <View style={[styles.rankingCard, isCurrent && styles.rankingCardCurrent]}>
        {/* Rank Badge */}
        <View style={[styles.rankNumberBox, isCurrent && styles.rankNumberBoxCurrent]}>
          <Text style={[styles.rankNumberText, isCurrent && styles.rankNumberTextCurrent]}>
            #{item.rank}
          </Text>
        </View>

        {/* Initials Avatar */}
        <View style={[styles.avatarCircle, isCurrent && styles.avatarCircleCurrent]}>
          <Text style={[styles.avatarText, isCurrent && styles.avatarTextCurrent]}>
            {getInitials(item.name)}
          </Text>
        </View>

        {/* Faculty Name & Info */}
        <View style={styles.facultyInfoCol}>
          <View style={styles.nameYouRow}>
            <Text style={styles.facultyName} numberOfLines={1}>
              {item.name}
            </Text>
            {isCurrent && (
              <View style={styles.youBadge}>
                <Text style={styles.youBadgeText}>YOU</Text>
              </View>
            )}
          </View>
          <Text style={styles.facultyDeptText}>
            {item.department} • {item.verifiedAchievements} Achievements
          </Text>
        </View>

        {/* Points Column */}
        <View style={styles.pointsCol}>
          <Text style={[styles.pointsText, isCurrent && styles.pointsTextCurrent]}>
            {item.points.toLocaleString()}
          </Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          2. BLUE → INDIGO PREMIUM HERO CARD
      ════════════════════════════════════════════════ */}
      <View style={styles.heroCardWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4338CA', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Decorative Shape */}
          <View style={styles.decorativeCircle} />

          {/* Top Label */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroHeaderLeft}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="trophy" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroHeaderTitle}>FACULTY LEADERBOARD</Text>
            </View>
            <Text style={styles.heroHeaderSubtitle}>Verified Rankings</Text>
          </View>

          {/* Main Metrics Row */}
          <View style={styles.heroMainMetricsRow}>
            <View style={styles.heroPrimaryMetricCol}>
              <Text style={styles.heroPrimaryNumber}>#{currentFacultyEntry.rank}</Text>
              <Text style={styles.heroPrimaryLabel}>Your Institutional Rank</Text>
            </View>

            <View style={styles.heroPointsPill}>
              <Ionicons name="star" size={14} color="#FDE047" style={{ marginRight: 6 }} />
              <Text style={styles.heroPointsText}>{currentFacultyEntry.points} Pts</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.heroDivider} />

          {/* Bottom Subtext */}
          <View style={styles.heroBottomRow}>
            <Ionicons name="business-outline" size={12} color="#E0E7FF" style={{ marginRight: 5 }} />
            <Text style={styles.heroBottomText}>
              Department: {DEFAULT_FACULTY_USER.department.name} • {currentFacultyEntry.verifiedAchievements} Achievements
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          3. SECTION TITLE + SEARCH + FILTER
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Faculty Rankings</Text>
        {selectedDept !== 'All Departments' && (
          <View style={styles.filterActiveTag}>
            <Text style={styles.filterActiveTagText}>{selectedDept}</Text>
          </View>
        )}
      </View>

      <View style={styles.searchFilterRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search faculty by name or department..."
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
          4. TOP 3 PODIUM
      ════════════════════════════════════════════════ */}
      {top3Faculty.length === 3 && (
        <View style={styles.podiumContainer}>
          {/* Rank 2 (Left / Silver) */}
          <View style={styles.podiumCol}>
            <View style={[styles.podiumAvatarCircle, styles.podiumSilverBorder]}>
              <Text style={styles.podiumAvatarText}>{getInitials(top3Faculty[1].name)}</Text>
              <View style={[styles.podiumRankBadge, styles.podiumSilverBadge]}>
                <Text style={styles.podiumRankBadgeText}>2</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>
              {top3Faculty[1].name}
            </Text>
            <Text style={styles.podiumDept}>{top3Faculty[1].department}</Text>
            <Text style={styles.podiumPoints}>{top3Faculty[1].points.toLocaleString()} pts</Text>
          </View>

          {/* Rank 1 (Center / Gold) */}
          <View style={[styles.podiumCol, styles.podiumCenterCol]}>
            <View style={styles.goldCrownBox}>
              <Ionicons name="trophy" size={18} color="#F59E0B" />
            </View>
            <View style={[styles.podiumAvatarCircle, styles.podiumGoldBorder]}>
              <Text style={styles.podiumAvatarText}>{getInitials(top3Faculty[0].name)}</Text>
              <View style={[styles.podiumRankBadge, styles.podiumGoldBadge]}>
                <Text style={styles.podiumRankBadgeText}>1</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, styles.podiumNameGold]} numberOfLines={1}>
              {top3Faculty[0].name}
            </Text>
            <Text style={styles.podiumDept}>{top3Faculty[0].department}</Text>
            <Text style={[styles.podiumPoints, styles.podiumPointsGold]}>
              {top3Faculty[0].points.toLocaleString()} pts
            </Text>
          </View>

          {/* Rank 3 (Right / Bronze) */}
          <View style={styles.podiumCol}>
            <View style={[styles.podiumAvatarCircle, styles.podiumBronzeBorder]}>
              <Text style={styles.podiumAvatarText}>{getInitials(top3Faculty[2].name)}</Text>
              <View style={[styles.podiumRankBadge, styles.podiumBronzeBadge]}>
                <Text style={styles.podiumRankBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>
              {top3Faculty[2].name}
            </Text>
            <Text style={styles.podiumDept}>{top3Faculty[2].department}</Text>
            <Text style={styles.podiumPoints}>{top3Faculty[2].points.toLocaleString()} pts</Text>
          </View>
        </View>
      )}
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
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7} onPress={onOpenMenu}>
            <Ionicons name="menu-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Faculty achievement rankings</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            5. LEADERBOARD LIST
        ════════════════════════════════════════════════ */}
        <FlatList
          data={listFaculty}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderRankingItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="bar-chart-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>No faculty rankings found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery || activeFiltersCount > 0
                  ? 'Try adjusting your search query or department filter.'
                  : 'Verified faculty achievements will appear here once rankings are available.'}
              </Text>
              {(searchQuery || activeFiltersCount > 0) && (
                <TouchableOpacity style={styles.clearFiltersBtn} onPress={handleResetFilters}>
                  <Text style={styles.clearFiltersBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* ════════════════════════════════════════════════
            6. FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterSheetCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Filter Leaderboard</Text>
                  <Text style={styles.modalSubtitle}>Filter faculty rankings by department & semester</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Department Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>DEPARTMENT</Text>
                <View style={styles.filterChipsGrid}>
                  {DEPARTMENTS.map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      style={[
                        styles.filterModalChip,
                        selectedDept === dept && styles.filterModalChipActive,
                      ]}
                      onPress={() => setSelectedDept(dept)}
                    >
                      <Text
                        style={[
                          styles.filterModalChipText,
                          selectedDept === dept && styles.filterModalChipTextActive,
                        ]}
                      >
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Semester Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SEMESTER</Text>
                <View style={styles.filterChipsGrid}>
                  {SEMESTERS.map((sem) => (
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
                        {sem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.modalResetBtn} onPress={handleResetFilters}>
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
            7. FACULTY BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <FacultyBottomTab activeTab="leaderboard" onNavigate={onNavigate} />
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
  menuButton: {
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
    overflow: 'hidden',
    position: 'relative',
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
  decorativeCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  heroHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  heroHeaderSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  heroMainMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroPrimaryMetricCol: {
    justifyContent: 'center',
  },
  heroPrimaryNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroPrimaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E7FF',
    marginTop: 1,
  },
  heroPointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroPointsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 8,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBottomText: {
    fontSize: 11,
    color: '#E0E7FF',
    fontWeight: '500',
  },

  /* Section Title */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterActiveTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  filterActiveTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Search + Filter */
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
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

  /* Top 3 Podium */
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
  },
  podiumCenterCol: {
    marginTop: -8,
  },
  goldCrownBox: {
    marginBottom: 2,
  },
  podiumAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    marginBottom: 6,
  },
  podiumGoldBorder: {
    borderColor: '#F59E0B',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  podiumSilverBorder: {
    borderColor: '#94A3B8',
  },
  podiumBronzeBorder: {
    borderColor: '#D97706',
  },
  podiumAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  podiumRankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  podiumGoldBadge: {
    backgroundColor: '#F59E0B',
  },
  podiumSilverBadge: {
    backgroundColor: '#94A3B8',
  },
  podiumBronzeBadge: {
    backgroundColor: '#D97706',
  },
  podiumRankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  podiumNameGold: {
    fontSize: 13,
  },
  podiumDept: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    textAlign: 'center',
  },
  podiumPoints: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 3,
  },
  podiumPointsGold: {
    color: '#B45309',
  },

  /* List */
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 130, // Critical: Prevents bottom navigation overlap
  },

  /* Ranking Row Card */
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rankingCardCurrent: {
    backgroundColor: '#F0F7FF',
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  rankNumberBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  rankNumberBoxCurrent: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingVertical: 2,
  },
  rankNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  rankNumberTextCurrent: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarCircleCurrent: {
    backgroundColor: '#DBEAFE',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  avatarTextCurrent: {
    color: '#2563EB',
  },
  facultyInfoCol: {
    flex: 1,
  },
  nameYouRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facultyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  youBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 6,
  },
  youBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  facultyDeptText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  pointsCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  pointsTextCurrent: {
    color: '#2563EB',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
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

  /* Filter Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  filterSheetCard: {
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
