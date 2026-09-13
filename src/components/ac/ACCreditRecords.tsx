// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Credit Records Screen
// Management and verification of student academic credit courses (NPTEL, VAC, etc.)
// Pure academic credits — Zero achievement points awarded.
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

import {
  INITIAL_CREDIT_RECORDS,
  COURSE_TYPES,
  COURSE_STATUSES,
  type CreditCourseRecord,
} from '../../data/academicCreditsData';
import { AC_SUMMARY_DATA } from '../../data/acWorkspaceData';
import ACBottomTab from './ACBottomTab';

interface ACCreditRecordsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  onSelectRecord: (record: CreditCourseRecord) => void;
}

type TabType = 'All' | 'Pending' | 'Verified' | 'Corrections';

export default function ACCreditRecords({
  onOpenMenu,
  onNavigate,
  onSelectRecord,
}: ACCreditRecordsProps) {
  const [records, setRecords] = useState<CreditCourseRecord[]>(INITIAL_CREDIT_RECORDS);
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const semesters = [
    'All Semesters',
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ];

  const academicYears = ['All Years', '2026–27', '2025–26', '2024–25'];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleResetFilters = () => {
    setSelectedType('All Types');
    setSelectedSemester('All Semesters');
    setSelectedYear('All Years');
    setFilterModalVisible(false);
  };

  const activeFiltersCount =
    (selectedType !== 'All Types' ? 1 : 0) +
    (selectedSemester !== 'All Semesters' ? 1 : 0) +
    (selectedYear !== 'All Years' ? 1 : 0);

  // Derived counts
  const pendingCount = useMemo(
    () => records.filter((r) => r.verificationStatus === 'Pending' || r.verificationStatus === 'Resubmitted').length,
    [records]
  );
  const verifiedCount = useMemo(
    () => records.filter((r) => r.verificationStatus === 'Verified').length,
    [records]
  );
  const correctionCount = useMemo(
    () => records.filter((r) => r.verificationStatus === 'Correction' || r.verificationStatus === 'Correction Required').length,
    [records]
  );

  const totalVerifiedCredits = useMemo(() => {
    return records
      .filter((r) => r.verificationStatus === 'Verified')
      .reduce((sum, r) => sum + (r.recognizedCredits || r.claimedCredits || 0), 0) + 38; // + historical credits in cohort
  }, [records]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Tab filter
      if (activeTab === 'Pending' && rec.verificationStatus !== 'Pending' && rec.verificationStatus !== 'Resubmitted') {
        return false;
      }
      if (activeTab === 'Verified' && rec.verificationStatus !== 'Verified') {
        return false;
      }
      if (activeTab === 'Corrections' && rec.verificationStatus !== 'Correction' && rec.verificationStatus !== 'Correction Required') {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesStudent = rec.studentName?.toLowerCase().includes(q) || false;
        const matchesRoll = rec.rollNo?.toLowerCase().includes(q) || false;
        const matchesCourse = rec.courseName.toLowerCase().includes(q);
        const matchesProvider = rec.provider.toLowerCase().includes(q);
        if (!matchesStudent && !matchesRoll && !matchesCourse && !matchesProvider) {
          return false;
        }
      }

      // Dropdown filters
      if (selectedType !== 'All Types' && rec.courseType !== selectedType) return false;
      if (selectedSemester !== 'All Semesters' && rec.semester !== selectedSemester) return false;
      if (selectedYear !== 'All Years' && rec.academicYear !== selectedYear) return false;

      return true;
    });
  }, [records, activeTab, searchQuery, selectedType, selectedSemester, selectedYear]);

  const renderRecordItem = ({ item }: { item: CreditCourseRecord }) => {
    const isVerified = item.verificationStatus === 'Verified';
    const isPending = item.verificationStatus === 'Pending' || item.verificationStatus === 'Resubmitted';
    const isCorrection = item.verificationStatus === 'Correction' || item.verificationStatus === 'Correction Required';

    return (
      <TouchableOpacity
        style={[styles.recordCard, isCorrection && styles.recordCardCorrection]}
        activeOpacity={0.75}
        onPress={() => onSelectRecord(item)}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.courseIconBox}>
            <Ionicons name="school" size={16} color="#2563EB" />
          </View>
          <View style={styles.studentInfoCol}>
            <Text style={styles.studentNameText}>{item.studentName || 'Student Record'}</Text>
            <Text style={styles.studentMetaText}>
              {item.rollNo || '23CI000'} • {item.department || 'CSE (IoT)'}
            </Text>
          </View>

          <View style={styles.statusPillCol}>
            {isVerified ? (
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={11} color="#16A34A" style={{ marginRight: 2 }} />
                <Text style={styles.verifiedPillText}>Verified</Text>
              </View>
            ) : isPending ? (
              <View style={styles.pendingPill}>
                <Ionicons name="time-outline" size={11} color="#2563EB" style={{ marginRight: 2 }} />
                <Text style={styles.pendingPillText}>Pending</Text>
              </View>
            ) : (
              <View style={styles.correctionPill}>
                <Ionicons name="alert-circle" size={11} color="#DC2626" style={{ marginRight: 2 }} />
                <Text style={styles.correctionPillText}>Attention</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.courseDetailsBox}>
          <Text style={styles.courseNameText} numberOfLines={1}>
            {item.courseName}
          </Text>
          <Text style={styles.courseTypeText}>
            {item.courseType} • {item.provider}
          </Text>
        </View>

        <View style={styles.cardFooterRow}>
          <View style={styles.creditTag}>
            <Ionicons name="ribbon-outline" size={12} color="#4F46E5" style={{ marginRight: 4 }} />
            <Text style={styles.creditTagText}>
              {isVerified
                ? `${item.recognizedCredits || item.claimedCredits} Credits Verified`
                : `Claimed: ${item.claimedCredits} Credits`}
            </Text>
          </View>

          <View style={styles.reviewBtn}>
            <Text style={styles.reviewBtnText}>Review</Text>
            <Ionicons name="chevron-forward" size={13} color="#2563EB" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          1. BLUE -> INDIGO HERO CARD (ACADEMIC CREDITS)
      ════════════════════════════════════════════════ */}
      <View style={styles.heroWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroTagPill}>
              <Ionicons name="school" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.heroTagText}>ACADEMIC CREDITS</Text>
            </View>
            <Text style={styles.heroScopeText}>CSE (IoT) • Section A</Text>
          </View>

          <Text style={styles.heroTitle}>Credit Record Verification</Text>
          <Text style={styles.heroSubtitle}>
            Verify NPTEL, Value Added Courses, and approved institutional academic credits.
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{pendingCount}</Text>
              <Text style={styles.heroStatLabel}>Pending Records</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatVal, { color: '#4ADE80' }]}>{verifiedCount}</Text>
              <Text style={styles.heroStatLabel}>Verified</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatVal, { color: '#FDE047' }]}>{totalVerifiedCredits}</Text>
              <Text style={styles.heroStatLabel}>Credits Verified</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          2. SEARCH & FILTER CONTROLS
      ════════════════════════════════════════════════ */}
      <View style={styles.controlsRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student or course name..."
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
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          activeOpacity={0.7}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="filter-outline"
            size={18}
            color={activeFiltersCount > 0 ? '#FFFFFF' : '#0F172A'}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ════════════════════════════════════════════════
          3. STATUS TABS
      ════════════════════════════════════════════════ */}
      <View style={styles.segmentTabsContainer}>
        {(['All', 'Pending', 'Verified', 'Corrections'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          let count = 0;
          if (tab === 'All') count = records.length;
          if (tab === 'Pending') count = pendingCount;
          if (tab === 'Verified') count = verifiedCount;
          if (tab === 'Corrections') count = correctionCount;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.segmentTabBtn, isActive && styles.segmentTabBtnActive]}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.segmentTabLabel, isActive && styles.segmentTabLabelActive]}>
                {tab}
              </Text>
              <View style={[styles.tabCountPill, isActive && styles.tabCountPillActive]}>
                <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                  {count}
                </Text>
              </View>
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
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7} onPress={onOpenMenu}>
            <Ionicons name="menu-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Credit Records</Text>
            <Text style={styles.headerSubtitle}>
              {AC_SUMMARY_DATA.assignedScope.department} • Section A
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => onNavigate('acNotifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* FlatList */}
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderRecordItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="school-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No credit records found</Text>
              <Text style={styles.emptyDesc}>No course submissions match the current filter.</Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity style={styles.clearFiltersBtn} onPress={handleResetFilters}>
                  <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetTitle}>Filter Credit Records</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Course Type */}
                <Text style={styles.filterSectionLabel}>Course Type</Text>
                <View style={styles.filterOptionsGrid}>
                  {COURSE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOptionPill,
                        selectedType === type && styles.filterOptionPillActive,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedType === type && styles.filterOptionTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Semester */}
                <Text style={styles.filterSectionLabel}>Semester</Text>
                <View style={styles.filterOptionsGrid}>
                  {semesters.map((sem) => (
                    <TouchableOpacity
                      key={sem}
                      style={[
                        styles.filterOptionPill,
                        selectedSemester === sem && styles.filterOptionPillActive,
                      ]}
                      onPress={() => setSelectedSemester(sem)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedSemester === sem && styles.filterOptionTextActive,
                        ]}
                      >
                        {sem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Academic Year */}
                <Text style={styles.filterSectionLabel}>Academic Year</Text>
                <View style={styles.filterOptionsGrid}>
                  {academicYears.map((yr) => (
                    <TouchableOpacity
                      key={yr}
                      style={[
                        styles.filterOptionPill,
                        selectedYear === yr && styles.filterOptionPillActive,
                      ]}
                      onPress={() => setSelectedYear(yr)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedYear === yr && styles.filterOptionTextActive,
                        ]}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.sheetActionRow}>
                <TouchableOpacity style={styles.resetSheetBtn} onPress={handleResetFilters}>
                  <Text style={styles.resetSheetBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applySheetBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.applySheetBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Standardized AC Bottom Navigation */}
        <ACBottomTab activeTab="submissions" onNavigate={onNavigate} />
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
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroScopeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
    lineHeight: 16,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 12,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  segmentTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 6,
  },
  segmentTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  segmentTabBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  segmentTabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabCountPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
  },
  tabCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tabCountTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordCardCorrection: {
    borderColor: '#FECACA',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentInfoCol: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusPillCol: {
    alignItems: 'flex-end',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  correctionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  correctionPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  courseDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  courseNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  courseTypeText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  creditTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  clearFiltersBtn: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearFiltersBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 8,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  filterOptionPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sheetActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resetSheetBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetSheetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  applySheetBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applySheetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
