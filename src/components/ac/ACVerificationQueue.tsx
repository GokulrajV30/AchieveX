// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Verification Queue
// Primary workspace queue for reviewing grouped and individual student submissions.
// Header -> Blue/Indigo Hero Card -> Search + Filter -> Segment Tabs -> Group/Individual Cards -> AC Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from 'react';
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
  AC_SUMMARY_DATA,
  AC_EVENT_GROUPS,
  ALL_AC_STUDENT_SUBMISSIONS,
  type ACEventGroup,
  type ACStudentSubmission,
} from '../../data/acWorkspaceData';
import {
  getCertificateProgress,
  subscribeTeamAchievements,
} from '../../data/teamAchievementData';
import ACBottomTab from './ACBottomTab';

interface ACVerificationQueueProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectGroup: (group: ACEventGroup) => void;
  onSelectSubmission: (submission: ACStudentSubmission) => void;
  initialTab?: QueueTab;
  filterStatus?: string;
}

export type QueueTab = 'All' | 'Groups' | 'Individual' | 'Corrections';

export default function ACVerificationQueue({
  onOpenMenu,
  onNavigate,
  onSelectGroup,
  onSelectSubmission,
  initialTab = 'All',
  filterStatus,
}: ACVerificationQueueProps) {
  const [activeTab, setActiveTab] = useState<QueueTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [, setTeamTick] = useState(0);

  useEffect(() => {
    return subscribeTeamAchievements(() => setTeamTick((t: number) => t + 1));
  }, []);

  const teamProgress = getCertificateProgress('TA-SIH-2026-001');
  const incompleteCount = teamProgress.total - teamProgress.uploaded;

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const categories = [
    'All Categories',
    'Technical & Professional',
    'Research & Intellectual Property',
    'Sports & Games',
    'Certifications & Online Learning',
  ];

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

  const activeFiltersCount =
    (selectedSemester !== 'All Semesters' ? 1 : 0) +
    (selectedCategory !== 'All Categories' ? 1 : 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleResetFilters = () => {
    setSelectedSemester('All Semesters');
    setSelectedCategory('All Categories');
    setFilterModalVisible(false);
  };

  // Filtered Event Groups
  const filteredGroups = useMemo(() => {
    if (activeTab === 'Individual' || activeTab === 'Corrections') return [];
    return AC_EVENT_GROUPS.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = g.eventName.toLowerCase().includes(q);
        const matchesCat = g.category.toLowerCase().includes(q);
        const matchesOrg = g.organizer.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesOrg) return false;
      }
      if (selectedSemester !== 'All Semesters' && g.semester !== selectedSemester) return false;
      if (selectedCategory !== 'All Categories' && g.category !== selectedCategory) return false;
      return true;
    });
  }, [activeTab, searchQuery, selectedSemester, selectedCategory]);

  // Filtered Individual Submissions
  const filteredSubmissions = useMemo(() => {
    if (activeTab === 'Groups') return [];
    return ALL_AC_STUDENT_SUBMISSIONS.filter((sub) => {
      if (
        activeTab === 'Corrections' &&
        sub.status !== 'Needs Attention' &&
        sub.status !== 'Correction Required'
      ) {
        return false;
      }

      if (filterStatus && sub.status !== filterStatus) {
        return false;
      }

      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = sub.studentName.toLowerCase().includes(q);
        const matchesRoll = sub.rollNo.toLowerCase().includes(q);
        const matchesEvent = sub.eventName.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesEvent) return false;
      }

      if (selectedSemester !== 'All Semesters' && sub.semester !== selectedSemester) return false;
      if (selectedCategory !== 'All Categories' && sub.category !== selectedCategory) return false;
      return true;
    });
  }, [activeTab, searchQuery, selectedSemester, selectedCategory, filterStatus]);

  const renderGroupCard = ({ item }: { item: ACEventGroup }) => (
    <TouchableOpacity
      style={styles.groupCard}
      activeOpacity={0.75}
      onPress={() => onSelectGroup(item)}
    >
      <View style={styles.groupCardTopRow}>
        <View style={styles.groupTypePill}>
          <Ionicons name="people" size={11} color="#2563EB" style={{ marginRight: 4 }} />
          <Text style={styles.groupTypePillText}>EVENT GROUP</Text>
        </View>
        <Text style={styles.groupStudentCount}>{item.totalSubmissions} Students</Text>
      </View>

      <Text style={styles.groupEventName}>{item.eventName}</Text>

      <Text style={styles.groupMetaText}>
        {item.achievementType} • {item.level} • {item.semester}
      </Text>

      {item.teamGroups && item.teamGroups.length > 0 && (
        <View style={styles.teamTagRow}>
          <View style={styles.teamTag}>
            <Ionicons name="ribbon-outline" size={12} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={styles.teamTagText}>
              Team: {item.teamGroups[0].teamName} ({item.teamGroups[0].memberCount} Members • Winner)
            </Text>
          </View>
        </View>
      )}

      <View style={styles.groupCardDivider} />

      <View style={styles.groupCardBottomRow}>
        <View style={styles.groupBreakdownCol}>
          <Text style={styles.readyPillText}>{item.readyCount} Ready</Text>
          {item.issuesCount > 0 && (
            <Text style={styles.issuesPillText}>• {item.issuesCount} Issues</Text>
          )}
          {item.resubmittedCount > 0 && (
            <Text style={styles.resubmittedPillText}>• {item.resubmittedCount} Resubmitted</Text>
          )}
        </View>

        <View style={styles.reviewGroupBtn}>
          <Text style={styles.reviewGroupBtnText}>Review Group</Text>
          <Ionicons name="chevron-forward" size={13} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderIndividualCard = ({ item }: { item: ACStudentSubmission }) => {
    const isReady = item.isReady;
    const isNeedsAttention = item.status === 'Needs Attention';
    const isResubmitted = item.status === 'Resubmitted';

    return (
      <TouchableOpacity
        style={[styles.individualCard, isNeedsAttention && styles.individualCardIssue]}
        activeOpacity={0.75}
        onPress={() => onSelectSubmission(item)}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>
              {item.studentName.substring(0, 2).toUpperCase()}
            </Text>
          </View>

          <View style={styles.studentInfoCol}>
            <Text style={styles.studentNameText} numberOfLines={1}>
              {item.studentName}
            </Text>
            <Text style={styles.studentMetaText}>
              {item.rollNo} • {item.department} • {item.result}
            </Text>
          </View>

          <View style={styles.statusCol}>
            {isReady ? (
              <View style={styles.readyBadge}>
                <Ionicons name="checkmark-circle" size={11} color="#16A34A" style={{ marginRight: 2 }} />
                <Text style={styles.readyBadgeText}>Ready</Text>
              </View>
            ) : isResubmitted ? (
              <View style={styles.resubmittedBadge}>
                <Ionicons name="refresh-circle" size={11} color="#2563EB" style={{ marginRight: 2 }} />
                <Text style={styles.resubmittedBadgeText}>Resubmitted</Text>
              </View>
            ) : (
              <View style={styles.issueBadge}>
                <Ionicons name="alert-circle" size={11} color="#DC2626" style={{ marginRight: 2 }} />
                <Text style={styles.issueBadgeText}>Attention</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardEventRow}>
          <Text style={styles.cardEventName} numberOfLines={1}>
            {item.eventName}
          </Text>
          <Text style={styles.cardPointsText}>+{item.calculatedPoints} pts</Text>
        </View>

        <View style={styles.cardFooterRow}>
          <View style={styles.proofBadge}>
            <Ionicons
              name={item.hasIndividualProof ? 'document-text-outline' : 'warning-outline'}
              size={12}
              color={item.hasIndividualProof ? '#64748B' : '#DC2626'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.proofBadgeText,
                !item.hasIndividualProof && { color: '#DC2626', fontWeight: '600' },
              ]}
              numberOfLines={1}
            >
              {item.hasIndividualProof
                ? item.individualProofName || 'Certificate Attached'
                : 'Missing Certificate Proof'}
            </Text>
          </View>

          <View style={styles.inspectBtn}>
            <Text style={styles.inspectBtnText}>Inspect</Text>
            <Ionicons name="chevron-forward" size={12} color="#2563EB" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          1. HERO SUMMARY CARD
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
              <Ionicons name="layers" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.heroTagText}>VERIFICATION QUEUE</Text>
            </View>
            <Text style={styles.heroScopeText}>CSE (IoT) • Section A</Text>
          </View>

          <Text style={styles.heroTitle}>
            {activeTab === 'Groups'
              ? `${AC_SUMMARY_DATA.totalEventGroups} Event Groups`
              : activeTab === 'Corrections'
              ? `${AC_SUMMARY_DATA.needAttentionCount} Require Attention`
              : `${AC_SUMMARY_DATA.totalPendingReviews} Pending Submissions`}
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{AC_SUMMARY_DATA.totalPendingReviews}</Text>
              <Text style={styles.heroStatLabel}>Total Pending</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatValue, { color: '#4ADE80' }]}>
                {AC_SUMMARY_DATA.readyCount}
              </Text>
              <Text style={styles.heroStatLabel}>Ready</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatValue, { color: '#FDE047' }]}>
                {AC_SUMMARY_DATA.needAttentionCount}
              </Text>
              <Text style={styles.heroStatLabel}>Issues</Text>
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
            placeholder="Search event, student, or roll number..."
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

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <View style={styles.filterChipsRow}>
          {selectedSemester !== 'All Semesters' && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedSemester}</Text>
              <TouchableOpacity onPress={() => setSelectedSemester('All Semesters')}>
                <Ionicons name="close" size={13} color="#2563EB" style={{ marginLeft: 3 }} />
              </TouchableOpacity>
            </View>
          )}
          {selectedCategory !== 'All Categories' && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('All Categories')}>
                <Ionicons name="close" size={13} color="#2563EB" style={{ marginLeft: 3 }} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ════════════════════════════════════════════════
          3. QUEUE SEGMENT TABS
      ════════════════════════════════════════════════ */}
      <View style={styles.segmentTabsContainer}>
        {(['All', 'Groups', 'Individual', 'Corrections'] as QueueTab[]).map((tab) => {
          const isActive = activeTab === tab;
          let count = 0;
          if (tab === 'All') count = AC_SUMMARY_DATA.totalPendingReviews;
          if (tab === 'Groups') count = AC_SUMMARY_DATA.totalEventGroups;
          if (tab === 'Individual') count = ALL_AC_STUDENT_SUBMISSIONS.length;
          if (tab === 'Corrections') count = AC_SUMMARY_DATA.needAttentionCount;

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

      {/* ════════════════════════════════════════════════
          4. TEAM ACHIEVEMENT CARD (CENTRALIZED STORE)
      ════════════════════════════════════════════════ */}
      {(activeTab === 'All' || activeTab === 'Groups') && (
        <TouchableOpacity
          style={styles.teamQueueCard}
          activeOpacity={0.8}
          onPress={() => onNavigate('acTeamReview', { teamAchievementId: 'TA-SIH-2026-001' })}
        >
          <View style={styles.groupCardTopRow}>
            <View style={[styles.groupTypePill, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="people" size={11} color="#4F46E5" style={{ marginRight: 4 }} />
              <Text style={[styles.groupTypePillText, { color: '#4F46E5' }]}>TEAM ACHIEVEMENT</Text>
            </View>
            <Text style={styles.groupStudentCount}>5 Members</Text>
          </View>

          <Text style={styles.groupEventName}>Smart India Hackathon 2026</Text>
          <Text style={[styles.groupMetaText, { color: '#4F46E5', fontWeight: '700', marginBottom: 6 }]}>
            Team Code Nexus
          </Text>

          <View style={styles.teamTagRow}>
            <View style={[styles.teamTag, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#2563EB" style={{ marginRight: 5 }} />
              <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#1E293B' }}>
                Team Lead: Gokulraj V • Common Proofs Verified
              </Text>
            </View>
          </View>

          <View style={styles.groupCardDivider} />

          <View style={styles.groupCardBottomRow}>
            <View style={styles.groupBreakdownCol}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '800',
                  color: teamProgress.uploaded === teamProgress.total ? '#16A34A' : '#D97706',
                }}
              >
                {teamProgress.uploaded} / {teamProgress.total} Certificates Uploaded
              </Text>
              {incompleteCount > 0 && (
                <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#DC2626', marginLeft: 6 }}>
                  • {incompleteCount} Incomplete
                </Text>
              )}
            </View>

            <View style={styles.reviewGroupBtn}>
              <Text style={styles.reviewGroupBtnText}>Review Team</Text>
              <Ionicons name="chevron-forward" size={13} color="#2563EB" />
            </View>
          </View>
        </TouchableOpacity>
      )}
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
            <Text style={styles.headerTitle}>Verification Queue</Text>
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
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            MAIN FLATLIST
        ════════════════════════════════════════════════ */}
        <FlatList<any>
          data={activeTab === 'Groups' ? filteredGroups : filteredSubmissions}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={activeTab === 'Groups' ? (renderGroupCard as any) : (renderIndividualCard as any)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="checkmark-done-circle-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>All caught up!</Text>
              <Text style={styles.emptyStateSubtitle}>
                No submissions are currently waiting for verification under this view.
              </Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity style={styles.clearFiltersBtn} onPress={handleResetFilters}>
                  <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* ════════════════════════════════════════════════
            FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetTitle}>Filter Submissions</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Semester Section */}
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

                {/* Category Section */}
                <Text style={styles.filterSectionLabel}>Category</Text>
                <View style={styles.filterOptionsGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterOptionPill,
                        selectedCategory === cat && styles.filterOptionPillActive,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedCategory === cat && styles.filterOptionTextActive,
                        ]}
                      >
                        {cat}
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

        {/* ════════════════════════════════════════════════
            AC BOTTOM NAVIGATION (Standardized 5-Tab Bar)
        ════════════════════════════════════════════════ */}
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
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Hero */
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
  heroStatValue: {
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

  /* Controls */
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
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 4,
  },

  /* Segment Tabs */
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

  /* FlatList & Cards */
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },
  teamQueueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  groupCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  groupTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupTypePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.4,
  },
  groupStudentCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  groupEventName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 3,
  },
  groupMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  teamTagRow: {
    marginTop: 6,
  },
  teamTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  teamTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  groupCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  groupCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupBreakdownCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readyPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  issuesPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  resubmittedPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },
  reviewGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewGroupBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },

  /* Individual Card */
  individualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  individualCardIssue: {
    borderColor: '#FECACA',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
  statusCol: {
    marginLeft: 6,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  resubmittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  resubmittedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  issueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  issueBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  cardEventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  cardEventName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  cardPointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  proofBadgeText: {
    fontSize: 11,
    color: '#64748B',
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },

  /* Empty State */
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyStateSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
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

  /* Bottom Sheet Modal */
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
