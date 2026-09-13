// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Verification Queue
// Principal verifies DEAN PERSONAL ACHIEVEMENTS ONLY.
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
  principalDataStore,
  type DeanPersonalSubmission,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';
import { PRINCIPAL_SPACING } from './principalSpacing';

interface PrincipalVerificationQueueProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  initialStatusFilter?: string;
}

export default function PrincipalVerificationQueue({
  onOpenMenu,
  onNavigate,
  initialStatusFilter = 'Pending',
}: PrincipalVerificationQueueProps) {
  const [submissions, setSubmissions] = useState<DeanPersonalSubmission[]>(
    principalDataStore.getSubmissions()
  );

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
  const [selectedDean, setSelectedDean] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('ALL');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    return principalDataStore.subscribe(() => {
      setSubmissions(principalDataStore.getSubmissions());
    });
  }, []);

  // Filter Submissions
  const filteredSubmissions = submissions.filter((item) => {
    // 1. Status Tab
    if (statusTab === 'Pending' && item.status !== 'Pending Review') return false;
    if (statusTab === 'Corrections' && item.status !== 'Correction Required') return false;
    if (statusTab === 'Verified' && item.status !== 'Verified') return false;
    if (statusTab === 'Rejected' && item.status !== 'Rejected') return false;

    // 2. Dean Filter
    if (selectedDean !== 'ALL' && item.deanId !== selectedDean) return false;

    // 3. Category Filter
    if (selectedCategory !== 'ALL' && item.categoryTitle !== selectedCategory) return false;

    // 4. Level Filter
    if (selectedLevel !== 'ALL' && item.level !== selectedLevel) return false;

    // 5. Academic Year Filter
    if (selectedAcademicYear !== 'ALL' && item.academicYear !== selectedAcademicYear) return false;

    // 6. Search Query (Dean Name, Employee ID, Title, Event, Type, Organizer)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = item.deanName.toLowerCase().includes(q);
      const matchEmp = item.deanEmployeeId?.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.categoryTitle.toLowerCase().includes(q);
      const matchType = item.achievementType.toLowerCase().includes(q);
      const matchOrg = item.organizer?.toLowerCase().includes(q);
      if (!matchName && !matchEmp && !matchTitle && !matchCat && !matchType && !matchOrg) {
        return false;
      }
    }

    return true;
  });

  const pendingCount = submissions.filter((s) => s.status === 'Pending Review').length;
  const correctionsCount = submissions.filter((s) => s.status === 'Correction Required').length;
  const verifiedCount = submissions.filter((s) => s.status === 'Verified').length;
  const rejectedCount = submissions.filter((s) => s.status === 'Rejected').length;

  const activeFiltersCount =
    (selectedDean !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedLevel !== 'ALL' ? 1 : 0) +
    (selectedAcademicYear !== 'ALL' ? 1 : 0);

  const resetFilters = () => {
    setSelectedDean('ALL');
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSelectedAcademicYear('ALL');
  };

  const getStatusBadge = (status: DeanPersonalSubmission['status']) => {
    switch (status) {
      case 'Pending Review':
        return { bg: '#FEFCE8', text: '#B45309', border: '#FEF08A', label: 'Pending Review' };
      case 'Correction Required':
        return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5', label: 'Correction Required' };
      case 'Verified':
        return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7', label: 'Verified' };
      case 'Rejected':
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2', label: 'Rejected' };
      default:
        return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', label: status };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.identityCol}>
              <Text style={styles.screenTitle}>Dean Approvals</Text>
              <Text style={styles.screenSubtext}>Executive Verification Queue</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.historyBtn}
            activeOpacity={0.7}
            onPress={() => onNavigate('principalVerificationHistory')}
          >
            <Ionicons name="time-outline" size={18} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.historyBtnText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Verification Hero */}
          <PrincipalHeroCard
            overline="DEAN APPROVALS"
            primaryNumber={pendingCount}
            primaryLabel="Pending Reviews"
            subtitle="Dean personal achievements awaiting your decision"
            secondaryTitle="STATUS"
            secondaryMetrics={[
              { number: verifiedCount, label: 'Verified', icon: 'checkmark-circle' },
              { number: correctionsCount, label: 'Corrections', icon: 'alert-circle-outline', iconColor: '#FDBA74' },
            ]}
          />

          {/* Search & Filter Bar */}
          <View style={styles.searchFilterRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Dean submissions..."
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
                activeFiltersCount > 0 && styles.filterBtnActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color={activeFiltersCount > 0 ? '#FFFFFF' : '#0F172A'}
              />
              {activeFiltersCount > 0 && (
                <View style={styles.filterCountBadge}>
                  <Text style={styles.filterCountBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Status Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {[
                { key: 'All', label: 'All', count: submissions.length },
                { key: 'Pending', label: 'Pending', count: pendingCount },
                { key: 'Corrections', label: 'Corrections', count: correctionsCount },
                { key: 'Verified', label: 'Verified', count: verifiedCount },
                { key: 'Rejected', label: 'Rejected', count: rejectedCount },
              ].map((tab) => {
                const isActive = statusTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.statusTabItem, isActive && styles.statusTabItemActive]}
                    activeOpacity={0.7}
                    onPress={() => setStatusTab(tab.key as any)}
                  >
                    <Text style={[styles.statusTabLabel, isActive && styles.statusTabLabelActive]}>
                      {tab.label}
                    </Text>
                    <View style={[styles.statusTabBadge, isActive && styles.statusTabBadgeActive]}>
                      <Text style={[styles.statusTabBadgeText, isActive && styles.statusTabBadgeTextActive]}>
                        {tab.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <View style={styles.activeFiltersRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {selectedDean !== 'ALL' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>
                      Dean: {selectedDean === 'faculty_kumar' ? 'Dr. Kumar V' : 'Dr. K. S. Lakshmi'}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedDean('ALL')}>
                      <Ionicons name="close" size={14} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedCategory !== 'ALL' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>{selectedCategory}</Text>
                    <TouchableOpacity onPress={() => setSelectedCategory('ALL')}>
                      <Ionicons name="close" size={14} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedLevel !== 'ALL' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>{selectedLevel}</Text>
                    <TouchableOpacity onPress={() => setSelectedLevel('ALL')}>
                      <Ionicons name="close" size={14} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedAcademicYear !== 'ALL' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>{selectedAcademicYear}</Text>
                    <TouchableOpacity onPress={() => setSelectedAcademicYear('ALL')}>
                      <Ionicons name="close" size={14} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity style={styles.clearAllBtn} onPress={resetFilters}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* Submissions List */}
          <View style={styles.listContainer}>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.submissionCard}
                    activeOpacity={0.85}
                    onPress={() => onNavigate('principalDeanReview', { submissionId: item.id })}
                  >
                    {/* Header Row: Dean Profile Info + Points Badge */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.deanAvatarCircle}>
                        <Text style={styles.deanAvatarText}>
                          {item.deanName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </Text>
                      </View>
                      <View style={styles.deanInfoCol}>
                        <Text style={styles.deanNameText}>{item.deanName}</Text>
                        <Text style={styles.deanMetaText}>
                          {item.designation}
                        </Text>
                      </View>
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsBadgeText}>{item.configuredPoints} pts</Text>
                      </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.achievementTitleText} numberOfLines={2}>
                      {item.title}
                    </Text>

                    {/* Metadata Tags */}
                    <View style={styles.tagRow}>
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText} numberOfLines={1}>
                          {item.categoryTitle}
                        </Text>
                      </View>
                      <View style={styles.levelTag}>
                        <Text style={styles.levelTagText}>{item.level}</Text>
                      </View>
                    </View>

                    {/* Card Footer: Submitted Date + Status + Review CTA */}
                    <View style={styles.cardFooterRow}>
                      <Text style={styles.submittedDateText}>
                        Submitted {item.submittedAt}
                      </Text>

                      <View style={styles.footerRight}>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: badge.bg, borderColor: badge.border },
                          ]}
                        >
                          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                            {badge.label}
                          </Text>
                        </View>

                        <View style={styles.reviewCta}>
                          <Text style={styles.reviewCtaText}>Review</Text>
                          <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="checkmark-done-circle" size={40} color="#16A34A" />
                </View>
                <Text style={styles.emptyTitle}>You're All Caught Up</Text>
                <Text style={styles.emptySub}>
                  No Dean personal achievements currently require your executive review.
                </Text>
                <TouchableOpacity
                  style={styles.emptyHistoryBtn}
                  onPress={() => onNavigate('principalVerificationHistory')}
                >
                  <Text style={styles.emptyHistoryBtnText}>View Verification History</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Reviews</Text>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.modalResetText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Dean Selector */}
                <Text style={styles.modalSectionLabel}>DEAN</Text>
                <View style={styles.chipOptionRow}>
                  {[
                    { id: 'ALL', label: 'All Deans' },
                    { id: 'faculty_kumar', label: 'Dr. Kumar V' },
                    { id: 'faculty_lakshmi', label: 'Dr. K. S. Lakshmi' },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.modalOptionChip,
                        selectedDean === opt.id && styles.modalOptionChipActive,
                      ]}
                      onPress={() => setSelectedDean(opt.id)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedDean === opt.id && styles.modalOptionTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Level */}
                <Text style={styles.modalSectionLabel}>ACHIEVEMENT LEVEL</Text>
                <View style={styles.chipOptionRow}>
                  {['ALL', 'State', 'National', 'International'].map((lvl) => (
                    <TouchableOpacity
                      key={lvl}
                      style={[
                        styles.modalOptionChip,
                        selectedLevel === lvl && styles.modalOptionChipActive,
                      ]}
                      onPress={() => setSelectedLevel(lvl)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedLevel === lvl && styles.modalOptionTextActive,
                        ]}
                      >
                        {lvl === 'ALL' ? 'All Levels' : lvl}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Academic Year */}
                <Text style={styles.modalSectionLabel}>ACADEMIC YEAR</Text>
                <View style={styles.chipOptionRow}>
                  {['ALL', '2026-27', '2025-26'].map((yr) => (
                    <TouchableOpacity
                      key={yr}
                      style={[
                        styles.modalOptionChip,
                        selectedAcademicYear === yr && styles.modalOptionChipActive,
                      ]}
                      onPress={() => setSelectedAcademicYear(yr)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedAcademicYear === yr && styles.modalOptionTextActive,
                        ]}
                      >
                        {yr === 'ALL' ? 'All Years' : yr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Category */}
                <Text style={styles.modalSectionLabel}>CATEGORY</Text>
                <View style={styles.chipOptionRow}>
                  {[
                    { id: 'ALL', label: 'All Categories' },
                    { id: 'Research, Publication & IPR', label: 'Research & IPR' },
                    { id: 'Funded Research Grants & Schemes', label: 'Grants' },
                    { id: 'Professional Societies & Honors', label: 'Professional Honors' },
                    { id: 'Industry Consultancy & Corporate Training', label: 'Consultancy' },
                    { id: 'Faculty Development & Guest Lectures', label: 'FDP & Keynotes' },
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.modalOptionChip,
                        selectedCategory === cat.id && styles.modalOptionChipActive,
                      ]}
                      onPress={() => setSelectedCategory(cat.id)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedCategory === cat.id && styles.modalOptionTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.applyBtn}
                activeOpacity={0.85}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyBtnText}>
                  Show {filteredSubmissions.length} Results
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Bottom Navigation */}
        <PrincipalBottomTab
          activeTab="approvals"
          onNavigate={onNavigate}
          pendingApprovalsCount={pendingCount}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  identityCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  screenSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  historyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: PRINCIPAL_SPACING.bottomNavClearance,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
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
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  filterCountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  tabsContainer: {
    marginBottom: 10,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  statusTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusTabItemActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  statusTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 6,
  },
  statusTabLabelActive: {
    color: '#FFFFFF',
  },
  statusTabBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  statusTabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusTabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  statusTabBadgeTextActive: {
    color: '#FFFFFF',
  },
  activeFiltersRow: {
    marginBottom: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
    marginRight: 4,
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  submissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deanAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 10,
  },
  deanAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  deanInfoCol: {
    flex: 1,
  },
  deanNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  deanMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  pointsBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  achievementTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    maxWidth: '75%',
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  levelTag: {
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  resultText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submittedDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reviewCta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginRight: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyHistoryBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyHistoryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalResetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  modalScroll: {
    marginBottom: 16,
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
  },
  chipOptionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  modalOptionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOptionChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  modalOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  modalOptionTextActive: {
    color: '#FFFFFF',
  },
  applyBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
