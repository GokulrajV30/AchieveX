// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Verification Queue
// Fast Review & Triage of HOD Achievement Submissions
// Flow: Safe Header -> Hero -> Search & Filter -> Status Tabs -> Active Chips -> Submissions List -> Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getDeanStore,
  subscribeDeanData,
  type DeanHODSubmission,
} from '../../data/deanWorkspaceData';
import DeanHeroCard from './DeanHeroCard';
import DeanBottomTab from './DeanBottomTab';
import { DEAN_SPACING } from './deanSpacing';

interface DeanVerificationQueueProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  initialStatusFilter?: string;
  initialDepartmentFilter?: string;
}

export default function DeanVerificationQueue({
  onOpenMenu,
  onNavigate,
  initialStatusFilter = 'Pending',
  initialDepartmentFilter,
}: DeanVerificationQueueProps) {
  const store = getDeanStore();
  const [submissions, setSubmissions] = useState<DeanHODSubmission[]>(store.getAuthorizedSubmissions());
  const [assignedDepts, setAssignedDepts] = useState(store.getAssignedDepartments());
  const stats = store.getOverviewStats();

  // Filters State
  const [statusTab, setStatusTab] = useState<'All' | 'Pending' | 'Corrections' | 'Verified' | 'Rejected'>(
    initialStatusFilter === 'Corrections'
      ? 'Corrections'
      : initialStatusFilter === 'All'
      ? 'All'
      : initialStatusFilter === 'Verified'
      ? 'Verified'
      : initialStatusFilter === 'Rejected'
      ? 'Rejected'
      : 'Pending'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>(initialDepartmentFilter || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('ALL');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    return subscribeDeanData(() => {
      setSubmissions(store.getAuthorizedSubmissions());
      setAssignedDepts(store.getAssignedDepartments());
    });
  }, []);

  // Filter Submissions
  const filteredSubmissions = submissions.filter((item) => {
    // 1. Status Tab Filter
    if (statusTab === 'Pending' && item.status !== 'Pending Review') return false;
    if (statusTab === 'Corrections' && item.status !== 'Correction Required') return false;
    if (statusTab === 'Verified' && item.status !== 'Verified') return false;
    if (statusTab === 'Rejected' && item.status !== 'Rejected') return false;

    // 2. Department Filter (Strictly within Dean's authorized scope)
    if (selectedDept !== 'ALL' && item.departmentId !== selectedDept) return false;

    // 3. Category Filter
    if (selectedCategory !== 'ALL' && item.categoryTitle !== selectedCategory) return false;

    // 4. Level Filter
    if (selectedLevel !== 'ALL' && item.level !== selectedLevel) return false;

    // 5. Academic Year Filter
    if (selectedAcademicYear !== 'ALL' && item.academicYear !== selectedAcademicYear) return false;

    // 6. Search Query (HOD Name, Department, Title, Organizer, Type, Employee ID)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = item.hodName.toLowerCase().includes(q);
      const matchEmp = item.hodEmployeeId?.toLowerCase().includes(q);
      const matchDept = item.departmentName.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchOrg = item.organizer?.toLowerCase().includes(q);
      const matchType = item.achievementType?.toLowerCase().includes(q);
      if (!matchName && !matchEmp && !matchDept && !matchTitle && !matchOrg && !matchType) {
        return false;
      }
    }

    return true;
  });

  const activeFilterCount =
    (selectedDept !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedLevel !== 'ALL' ? 1 : 0) +
    (selectedAcademicYear !== 'ALL' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedDept('ALL');
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSelectedAcademicYear('ALL');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return { bg: '#F0FDFA', border: '#99F6E4', text: '#0D9488', label: 'PENDING' };
      case 'Correction Required':
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', label: 'CORRECTION' };
      case 'Verified':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', label: 'VERIFIED' };
      case 'Rejected':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', label: 'REJECTED' };
      default:
        return { bg: '#F1F5F9', border: '#E2E8F0', text: '#64748B', label: status.toUpperCase() };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>HOD Verification Queue</Text>
              <Text style={styles.headerSubtitle}>
                {filteredSubmissions.length} submissions matching scope
              </Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT BODY
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* ════════════════════════════════════════════════
              2. DEAN HERO CARD
          ════════════════════════════════════════════════ */}
          <DeanHeroCard
            eyebrow="HOD REVIEWS"
            value={stats.pendingCount + stats.correctionsCount}
            label="Awaiting Verification"
            context="From your assigned departments"
            icon="checkbox"
            compact
            secondaryTitle="QUEUE STATUS"
            secondaryItems={[
              {
                icon: 'time-outline',
                count: stats.pendingCount,
                label: 'Pending',
                iconColor: '#FEF08A',
              },
              {
                icon: 'alert-circle-outline',
                count: stats.correctionsCount,
                label: 'Corrections',
                iconColor: '#FDBA74',
              },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. SEARCH & FILTER ROW
          ════════════════════════════════════════════════ */}
          <View style={styles.searchFilterRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search HOD, title, ID, dept..."
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
              style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
              activeOpacity={0.8}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={activeFilterCount > 0 ? '#FFFFFF' : '#0D9488'}
              />
              <Text style={[styles.filterBtnText, activeFilterCount > 0 && styles.filterBtnTextActive]}>
                Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              4. STATUS TABS
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollView}
            contentContainerStyle={styles.tabsScroll}
          >
            {(['All', 'Pending', 'Corrections', 'Verified', 'Rejected'] as const).map((t) => {
              const isSelected = statusTab === t;
              let count = submissions.length;
              if (t === 'Pending') count = stats.pendingCount;
              else if (t === 'Corrections') count = stats.correctionsCount;
              else if (t === 'Verified') count = stats.verifiedCount;
              else if (t === 'Rejected') count = stats.rejectedCount;

              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.tabItem, isSelected && styles.tabItemActive]}
                  onPress={() => setStatusTab(t)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                    {t} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ════════════════════════════════════════════════
              5. ACTIVE FILTER CHIPS
          ════════════════════════════════════════════════ */}
          {activeFilterCount > 0 && (
            <View style={styles.activeChipsSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScrollView}
                contentContainerStyle={styles.chipsScroll}
              >
                {selectedDept !== 'ALL' && (
                  <View style={styles.chipPill}>
                    <Text style={styles.chipText}>Dept: {selectedDept}</Text>
                    <TouchableOpacity onPress={() => setSelectedDept('ALL')}>
                      <Ionicons name="close" size={13} color="#0D9488" />
                    </TouchableOpacity>
                  </View>
                )}

                {selectedCategory !== 'ALL' && (
                  <View style={styles.chipPill}>
                    <Text style={styles.chipText}>{selectedCategory}</Text>
                    <TouchableOpacity onPress={() => setSelectedCategory('ALL')}>
                      <Ionicons name="close" size={13} color="#0D9488" />
                    </TouchableOpacity>
                  </View>
                )}

                {selectedLevel !== 'ALL' && (
                  <View style={styles.chipPill}>
                    <Text style={styles.chipText}>{selectedLevel}</Text>
                    <TouchableOpacity onPress={() => setSelectedLevel('ALL')}>
                      <Ionicons name="close" size={13} color="#0D9488" />
                    </TouchableOpacity>
                  </View>
                )}

                {selectedAcademicYear !== 'ALL' && (
                  <View style={styles.chipPill}>
                    <Text style={styles.chipText}>{selectedAcademicYear}</Text>
                    <TouchableOpacity onPress={() => setSelectedAcademicYear('ALL')}>
                      <Ionicons name="close" size={13} color="#0D9488" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity style={styles.clearAllBtn} onPress={clearAllFilters}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* ════════════════════════════════════════════════
              6. SUBMISSION LIST CARDS
          ════════════════════════════════════════════════ */}
          {filteredSubmissions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={38} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No Submissions Found</Text>
              <Text style={styles.emptySub}>
                There are no HOD achievement submissions matching your current filters.
              </Text>
            </View>
          ) : (
            filteredSubmissions.map((item) => {
              const badge = getStatusBadge(item.status);

              return (
                <View key={item.id} style={styles.subCard}>
                  {/* Card Header: HOD info + Status Badge */}
                  <View style={styles.subCardHeader}>
                    <View style={styles.avatarBox}>
                      <Ionicons name="person" size={16} color="#0D9488" />
                    </View>
                    <View style={styles.subCardInfoCol}>
                      <Text style={styles.subHODName} numberOfLines={1}>
                        {item.hodName}
                      </Text>
                      <Text style={styles.subHODDept} numberOfLines={1}>
                        HOD • {item.departmentName}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.subTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  {/* Category & Level meta row */}
                  <View style={styles.subMetaRow}>
                    <View style={styles.subMetaPill}>
                      <Text style={styles.subMetaPillText} numberOfLines={1}>
                        {item.categoryTitle}
                      </Text>
                    </View>
                    <View style={styles.subMetaPill}>
                      <Text style={styles.subMetaPillText}>{item.level}</Text>
                    </View>
                    {item.semester ? (
                      <View style={styles.subMetaPill}>
                        <Text style={styles.subMetaPillText}>{item.semester}</Text>
                      </View>
                    ) : null}
                    <View style={styles.subPtsBadge}>
                      <Text style={styles.subPtsText}>+{item.configuredPoints} pts</Text>
                    </View>
                  </View>

                  {/* Proof indicator */}
                  <View style={styles.proofsRow}>
                    <Ionicons name="document-attach-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.proofsText}>
                      {item.proofs.length} proof file{item.proofs.length !== 1 ? 's' : ''} attached
                    </Text>
                  </View>

                  {/* Card Footer: Submitted Date + Review Action */}
                  <View style={styles.subCardFooter}>
                    <Text style={styles.subDateText}>Submitted {item.submittedAt}</Text>
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      activeOpacity={0.8}
                      onPress={() => onNavigate('deanHODReview', { submissionId: item.id })}
                    >
                      <Text style={styles.reviewBtnText}>Review Submission</Text>
                      <Ionicons name="chevron-forward" size={13} color="#FFFFFF" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setFilterModalVisible(false)}
            />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Filter Reviews</Text>
                  <Text style={styles.sheetSubtitle}>Scope strictly limited to assigned departments</Text>
                </View>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.sheetCloseBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                {/* 1. Department Scope (Authorized Only) */}
                <Text style={styles.filterSectionTitle}>ASSIGNED DEPARTMENT SCOPE</Text>
                <View style={styles.chipSelectionGrid}>
                  <TouchableOpacity
                    style={[styles.choiceChip, selectedDept === 'ALL' && styles.choiceChipActive]}
                    onPress={() => setSelectedDept('ALL')}
                  >
                    <Text style={[styles.choiceChipText, selectedDept === 'ALL' && styles.choiceChipTextActive]}>
                      All Assigned ({assignedDepts.length})
                    </Text>
                  </TouchableOpacity>
                  {assignedDepts.map((d) => (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.choiceChip, selectedDept === d.id && styles.choiceChipActive]}
                      onPress={() => setSelectedDept(d.id)}
                    >
                      <Text style={[styles.choiceChipText, selectedDept === d.id && styles.choiceChipTextActive]}>
                        {d.id}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 2. Achievement Category */}
                <Text style={styles.filterSectionTitle}>ACHIEVEMENT CATEGORY</Text>
                <View style={styles.chipSelectionGrid}>
                  {[
                    'ALL',
                    'Research, Publication & IPR',
                    'Patents & Intellectual Property',
                    'Industry Consultancy & Grants',
                    'Conference & Technical Keynotes',
                    'Professional Societies & Honors',
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.choiceChip, selectedCategory === cat && styles.choiceChipActive]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text style={[styles.choiceChipText, selectedCategory === cat && styles.choiceChipTextActive]}>
                        {cat === 'ALL' ? 'All Categories' : cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 3. Level */}
                <Text style={styles.filterSectionTitle}>LEVEL</Text>
                <View style={styles.chipSelectionGrid}>
                  {['ALL', 'International', 'National', 'State', 'College'].map((lvl) => (
                    <TouchableOpacity
                      key={lvl}
                      style={[styles.choiceChip, selectedLevel === lvl && styles.choiceChipActive]}
                      onPress={() => setSelectedLevel(lvl)}
                    >
                      <Text style={[styles.choiceChipText, selectedLevel === lvl && styles.choiceChipTextActive]}>
                        {lvl === 'ALL' ? 'All Levels' : lvl}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 4. Academic Year */}
                <Text style={styles.filterSectionTitle}>ACADEMIC YEAR</Text>
                <View style={styles.chipSelectionGrid}>
                  {['ALL', '2026-27', '2025-26'].map((yr) => (
                    <TouchableOpacity
                      key={yr}
                      style={[styles.choiceChip, selectedAcademicYear === yr && styles.choiceChipActive]}
                      onPress={() => setSelectedAcademicYear(yr)}
                    >
                      <Text style={[styles.choiceChipText, selectedAcademicYear === yr && styles.choiceChipTextActive]}>
                        {yr === 'ALL' ? 'All Years' : yr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.sheetApplyBtn}
                  activeOpacity={0.8}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.sheetApplyBtnText}>
                    Show {filteredSubmissions.length} Results
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. BOTTOM NAVIGATION TAB BAR
        ════════════════════════════════════════════════ */}
        <DeanBottomTab
          activeTab="reviews"
          onNavigate={(screen) => onNavigate(screen)}
          unreadCount={stats.pendingCount}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: DEAN_SPACING.screenTop,
    paddingBottom: DEAN_SPACING.bottomNavClearance,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DEAN_SPACING.titleToContent,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    gap: 4,
  },
  filterBtnActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  tabsScrollView: {
    marginHorizontal: -DEAN_SPACING.screenHorizontal,
    marginBottom: DEAN_SPACING.titleToContent,
  },
  tabsScroll: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    gap: 8,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  tabItemActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  activeChipsSection: {
    marginBottom: DEAN_SPACING.titleToContent,
  },
  chipsScrollView: {
    marginHorizontal: -DEAN_SPACING.screenHorizontal,
  },
  chipsScroll: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    gap: 8,
    alignItems: 'center',
  },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  clearAllBtn: {
    paddingHorizontal: 6,
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  subCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: DEAN_SPACING.cardRadiusCompact,
    padding: DEAN_SPACING.cardPadding,
    marginBottom: DEAN_SPACING.cardGap,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  subCardInfoCol: {
    flex: 1,
    marginRight: 6,
  },
  subHODName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  subHODDept: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 8,
  },
  subMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  subMetaPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subMetaPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  subPtsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subPtsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  proofsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  proofsText: {
    fontSize: 11,
    color: '#64748B',
  },
  subCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  subDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  filterSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
  },
  chipSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  choiceChipActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0D9488',
  },
  choiceChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  choiceChipTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sheetApplyBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  sheetApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
