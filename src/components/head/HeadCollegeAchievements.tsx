// ─────────────────────────────────────────────────────────────
// AchieveX — College Achievements (Head Workspace)
// Institutional Achievement Feed with Grouped Filter Sheet,
// Sub-Sheet Selectors, Dynamic Result CTA, and Shared Head Hero.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
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
  getHeadStore,
  type CollegeAchievementRecord,
  type HeadAchievementFilterQuery,
} from '../../data/headWorkspaceData';
import HeadHeroCard from './HeadHeroCard';
import StudentBottomTab from '../StudentBottomTab';

interface HeadCollegeAchievementsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HeadCollegeAchievements({
  onOpenMenu,
  onNavigate,
}: HeadCollegeAchievementsProps) {
  const store = getHeadStore();
  const allAchievements = store.getAchievements();
  const categories = store.getCategories();
  const departments = store.getDepartmentMetrics();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CollegeAchievementRecord | null>(null);

  // Sub-selector states for modal
  const [deptSelectorVisible, setDeptSelectorVisible] = useState(false);
  const [deptSearchText, setDeptSearchText] = useState('');
  const [catSelectorVisible, setCatSelectorVisible] = useState(false);
  const [catSearchText, setCatSearchText] = useState('');

  // Active filters
  const [activeFilters, setActiveFilters] = useState<HeadAchievementFilterQuery>({
    department: 'ALL',
    academicYear: 'ALL',
    semester: 'ALL',
    categoryId: 'ALL',
    level: 'ALL',
    result: 'ALL',
    status: 'ALL',
    userType: 'ALL',
  });

  // Working state inside filter modal
  const [tempFilters, setTempFilters] = useState<HeadAchievementFilterQuery>({ ...activeFilters });

  const handleOpenFilters = () => {
    setTempFilters({ ...activeFilters });
    setFilterModalVisible(true);
  };

  const handleApplyFilters = () => {
    setActiveFilters({ ...tempFilters });
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    const reset: HeadAchievementFilterQuery = {
      department: 'ALL',
      academicYear: 'ALL',
      semester: 'ALL',
      categoryId: 'ALL',
      level: 'ALL',
      result: 'ALL',
      status: 'ALL',
      userType: 'ALL',
    };
    setTempFilters(reset);
    setActiveFilters(reset);
  };

  const clearSpecificFilter = (key: keyof HeadAchievementFilterQuery) => {
    setActiveFilters((prev) => ({ ...prev, [key]: 'ALL' }));
  };

  // Filtered List for main screen
  const filteredAchievements = useMemo(() => {
    return allAchievements.filter((rec) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = (rec.title || '').toLowerCase().includes(q);
        const matchesEvent = (rec.eventName || rec.organizer || '').toLowerCase().includes(q);
        const matchesUser = (rec.userName || '').toLowerCase().includes(q);
        const matchesRoll = (rec.userRollOrId || rec.rollOrEmpId || '').toLowerCase().includes(q);
        const matchesDept = (rec.departmentName || rec.department || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesEvent && !matchesUser && !matchesRoll && !matchesDept) {
          return false;
        }
      }

      // Filters
      if (activeFilters.department && activeFilters.department !== 'ALL' && rec.departmentId !== activeFilters.department) {
        return false;
      }
      if (activeFilters.academicYear && activeFilters.academicYear !== 'ALL' && rec.academicYear !== activeFilters.academicYear) {
        return false;
      }
      if (activeFilters.semester && activeFilters.semester !== 'ALL' && rec.semester !== activeFilters.semester) {
        return false;
      }
      if (activeFilters.categoryId && activeFilters.categoryId !== 'ALL' && rec.categoryId !== activeFilters.categoryId) {
        return false;
      }
      if (activeFilters.level && activeFilters.level !== 'ALL' && rec.level !== activeFilters.level) {
        return false;
      }
      if (activeFilters.result && activeFilters.result !== 'ALL' && rec.result !== activeFilters.result) {
        return false;
      }
      if (activeFilters.status && activeFilters.status !== 'ALL' && rec.status !== activeFilters.status) {
        return false;
      }
      if (activeFilters.userType && activeFilters.userType !== 'ALL' && rec.userType !== activeFilters.userType) {
        return false;
      }

      return true;
    });
  }, [allAchievements, searchQuery, activeFilters]);

  // Dynamic matching count for modal CTA
  const tempMatchingCount = useMemo(() => {
    return allAchievements.filter((rec) => {
      if (tempFilters.department && tempFilters.department !== 'ALL' && rec.departmentId !== tempFilters.department) {
        return false;
      }
      if (tempFilters.academicYear && tempFilters.academicYear !== 'ALL' && rec.academicYear !== tempFilters.academicYear) {
        return false;
      }
      if (tempFilters.semester && tempFilters.semester !== 'ALL' && rec.semester !== tempFilters.semester) {
        return false;
      }
      if (tempFilters.categoryId && tempFilters.categoryId !== 'ALL' && rec.categoryId !== tempFilters.categoryId) {
        return false;
      }
      if (tempFilters.level && tempFilters.level !== 'ALL' && rec.level !== tempFilters.level) {
        return false;
      }
      if (tempFilters.result && tempFilters.result !== 'ALL' && rec.result !== tempFilters.result) {
        return false;
      }
      if (tempFilters.status && tempFilters.status !== 'ALL' && rec.status !== tempFilters.status) {
        return false;
      }
      if (tempFilters.userType && tempFilters.userType !== 'ALL' && rec.userType !== tempFilters.userType) {
        return false;
      }
      return true;
    }).length;
  }, [allAchievements, tempFilters]);

  const appliedFilterCount = Object.entries(activeFilters).filter(
    ([, val]) => val && val !== 'ALL'
  ).length;

  const getDepartmentLabel = (deptId?: string) => {
    if (!deptId || deptId === 'ALL') return 'All Departments';
    const found = departments.find((d) => d.departmentId === deptId);
    return found ? found.departmentName : deptId;
  };

  const getCategoryLabel = (catId?: string) => {
    if (!catId || catId === 'ALL') return 'All Categories';
    const found = categories.find((c) => c.id === catId);
    return found ? found.title : catId;
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
              <Text style={styles.headerTitle}>College Achievements</Text>
              <Text style={styles.headerSubtitle}>Verified institutional records</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE MAIN CONTENT
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              2. SHARED HEAD HERO CARD
          ════════════════════════════════════════════════ */}
          <HeadHeroCard
            overline="COLLEGE ACHIEVEMENTS"
            title="Verified Institutional Repository"
            primaryNumber="2,840"
            primaryLabel="Verified Achievements"
            secondaryMetrics={[
              { number: '48,650', label: 'Total Points' },
              { number: '8', label: 'Departments' },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. SEARCH BAR + FILTER ENTRY BUTTON
          ════════════════════════════════════════════════ */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search achievements..."
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
              style={[styles.filterBtn, appliedFilterCount > 0 && styles.filterBtnActive]}
              activeOpacity={0.8}
              onPress={handleOpenFilters}
            >
              <Ionicons
                name={appliedFilterCount > 0 ? 'filter' : 'filter-outline'}
                size={16}
                color={appliedFilterCount > 0 ? '#FFFFFF' : '#4F46E5'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.filterBtnText, appliedFilterCount > 0 && styles.filterBtnTextActive]}>
                {appliedFilterCount > 0 ? `Filter (${appliedFilterCount})` : 'Filter'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              4. ACTIVE FILTER CHIPS (HORIZONTAL SCROLL)
          ════════════════════════════════════════════════ */}
          {appliedFilterCount > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeChipsScroll}
              style={styles.activeChipsContainer}
            >
              {activeFilters.department && activeFilters.department !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText} numberOfLines={1}>
                    {getDepartmentLabel(activeFilters.department)}
                  </Text>
                  <TouchableOpacity onPress={() => clearSpecificFilter('department')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.categoryId && activeFilters.categoryId !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText} numberOfLines={1}>
                    {getCategoryLabel(activeFilters.categoryId)}
                  </Text>
                  <TouchableOpacity onPress={() => clearSpecificFilter('categoryId')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.userType && activeFilters.userType !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.userType}</Text>
                  <TouchableOpacity onPress={() => clearSpecificFilter('userType')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.status && activeFilters.status !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.status}</Text>
                  <TouchableOpacity onPress={() => clearSpecificFilter('status')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.academicYear && activeFilters.academicYear !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{activeFilters.academicYear}</Text>
                  <TouchableOpacity onPress={() => clearSpecificFilter('academicYear')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              {activeFilters.semester && activeFilters.semester !== 'ALL' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>Sem {activeFilters.semester}</Text>
                  <TouchableOpacity onPress={() => clearSpecificFilter('semester')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.clearAllBtn} onPress={handleResetFilters}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ════════════════════════════════════════════════
              5. RESULTS SUMMARY BAR
          ════════════════════════════════════════════════ */}
          <View style={styles.summaryBar}>
            <Text style={styles.summaryText}>
              Showing <Text style={styles.summaryCount}>{filteredAchievements.length}</Text> verified achievements
            </Text>
          </View>

          {/* ════════════════════════════════════════════════
              6. ACHIEVEMENT LIST
          ════════════════════════════════════════════════ */}
          {filteredAchievements.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Achievements Found</Text>
              <Text style={styles.emptySubtitle}>
                No verified records match your current search and filter criteria.
              </Text>
              <TouchableOpacity style={styles.emptyResetBtn} onPress={handleResetFilters}>
                <Text style={styles.emptyResetText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredAchievements.map((rec) => {
              const isStudent = (rec.userType || '').toLowerCase() === 'student';
              return (
                <TouchableOpacity
                  key={rec.id}
                  style={styles.card}
                  activeOpacity={0.75}
                  onPress={() => setSelectedRecord(rec)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.roleBadge, isStudent ? styles.studentBadge : styles.facultyBadge]}>
                        <Text style={[styles.roleBadgeText, isStudent ? styles.studentBadgeText : styles.facultyBadgeText]}>
                          {isStudent ? 'STUDENT' : 'FACULTY'}
                        </Text>
                      </View>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{rec.level}</Text>
                      </View>
                    </View>

                    <View style={styles.pointsPill}>
                      <Ionicons name="flash" size={11} color="#4F46E5" style={{ marginRight: 2 }} />
                      <Text style={styles.pointsVal}>+{rec.awardedPoints} pts</Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {rec.title}
                  </Text>

                  <View style={styles.cardEventRow}>
                    <Ionicons name="ribbon-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.cardEventText} numberOfLines={1}>
                      {rec.eventName || rec.organizer || 'Institution Verified Event'}
                    </Text>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.userInfoCol}>
                      <Text style={styles.userNameText} numberOfLines={1}>
                        {rec.userName}
                      </Text>
                      <Text style={styles.userSubText} numberOfLines={1}>
                        {rec.userRollOrId || rec.rollOrEmpId} • {rec.departmentName || rec.department}
                      </Text>
                    </View>
                    <View style={styles.dateCol}>
                      <Text style={styles.dateText}>{rec.date || 'Jan 2026'}</Text>
                      <View style={styles.verifiedRow}>
                        <Ionicons name="checkmark-circle" size={13} color="#059669" style={{ marginRight: 2 }} />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. GROUPED FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setFilterModalVisible(false)} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />

              {/* Header */}
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>FILTER ACHIEVEMENTS</Text>
                  <Text style={styles.sheetSubtitle}>Multi-criteria institutional filter</Text>
                </View>
                <TouchableOpacity onPress={handleResetFilters} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.sheetResetBtn}>Reset</Text>
                </TouchableOpacity>
              </View>

              {/* Grouped Rows */}
              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                {/* ── ACADEMIC SECTION ── */}
                <Text style={styles.filterGroupHeader}>ACADEMIC</Text>
                <View style={styles.filterGroupCard}>
                  {/* Academic Year */}
                  <View style={styles.filterRow}>
                    <Text style={styles.filterRowLabel}>Academic Year</Text>
                    <View style={styles.filterChipsSmall}>
                      {['ALL', '2025-26', '2026-27'].map((yr) => (
                        <TouchableOpacity
                          key={yr}
                          style={[
                            styles.chipSmall,
                            tempFilters.academicYear === yr && styles.chipSmallActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, academicYear: yr }))}
                        >
                          <Text
                            style={[
                              styles.chipSmallText,
                              tempFilters.academicYear === yr && styles.chipSmallTextActive,
                            ]}
                          >
                            {yr === 'ALL' ? 'All' : yr}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.groupDivider} />

                  {/* Semester */}
                  <View style={styles.filterRow}>
                    <Text style={styles.filterRowLabel}>Semester</Text>
                    <View style={styles.filterChipsSmall}>
                      {['ALL', '1', '2', '3', '4', '5', '6'].map((sem) => (
                        <TouchableOpacity
                          key={sem}
                          style={[
                            styles.chipSmall,
                            tempFilters.semester === sem && styles.chipSmallActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, semester: sem }))}
                        >
                          <Text
                            style={[
                              styles.chipSmallText,
                              tempFilters.semester === sem && styles.chipSmallTextActive,
                            ]}
                          >
                            {sem === 'ALL' ? 'All' : `S${sem}`}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* ── STUDENT & DEPARTMENT SECTION ── */}
                <Text style={styles.filterGroupHeader}>STUDENT & DEPARTMENT</Text>
                <View style={styles.filterGroupCard}>
                  {/* Department Picker Trigger */}
                  <TouchableOpacity
                    style={styles.drilldownRow}
                    activeOpacity={0.7}
                    onPress={() => setDeptSelectorVisible(true)}
                  >
                    <Text style={styles.filterRowLabel}>Department</Text>
                    <View style={styles.drilldownRight}>
                      <Text style={styles.drilldownVal} numberOfLines={1}>
                        {getDepartmentLabel(tempFilters.department)}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.groupDivider} />

                  {/* Year */}
                  <View style={styles.filterRow}>
                    <Text style={styles.filterRowLabel}>Student Year</Text>
                    <View style={styles.filterChipsSmall}>
                      {['ALL', '1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
                        <TouchableOpacity
                          key={yr}
                          style={[
                            styles.chipSmall,
                            tempFilters.studentYear === yr && styles.chipSmallActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, studentYear: yr }))}
                        >
                          <Text
                            style={[
                              styles.chipSmallText,
                              tempFilters.studentYear === yr && styles.chipSmallTextActive,
                            ]}
                          >
                            {yr === 'ALL' ? 'All' : yr.split(' ')[0]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* ── ACHIEVEMENT SECTION ── */}
                <Text style={styles.filterGroupHeader}>ACHIEVEMENT</Text>
                <View style={styles.filterGroupCard}>
                  {/* Category Picker Trigger */}
                  <TouchableOpacity
                    style={styles.drilldownRow}
                    activeOpacity={0.7}
                    onPress={() => setCatSelectorVisible(true)}
                  >
                    <Text style={styles.filterRowLabel}>Category</Text>
                    <View style={styles.drilldownRight}>
                      <Text style={styles.drilldownVal} numberOfLines={1}>
                        {getCategoryLabel(tempFilters.categoryId)}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.groupDivider} />

                  {/* Level */}
                  <View style={styles.filterRow}>
                    <Text style={styles.filterRowLabel}>Level</Text>
                    <View style={styles.filterChipsSmall}>
                      {['ALL', 'College', 'State', 'National', 'International'].map((lvl) => (
                        <TouchableOpacity
                          key={lvl}
                          style={[
                            styles.chipSmall,
                            tempFilters.level === lvl && styles.chipSmallActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, level: lvl }))}
                        >
                          <Text
                            style={[
                              styles.chipSmallText,
                              tempFilters.level === lvl && styles.chipSmallTextActive,
                            ]}
                          >
                            {lvl === 'ALL' ? 'All' : lvl}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* ── STATUS & TARGET ROLE SECTION ── */}
                <Text style={styles.filterGroupHeader}>STATUS & ROLE</Text>
                <View style={styles.filterGroupCard}>
                  {/* User Type */}
                  <View style={styles.filterRow}>
                    <Text style={styles.filterRowLabel}>User Type</Text>
                    <View style={styles.filterChipsSmall}>
                      {['ALL', 'Student', 'Faculty'].map((role) => (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.chipSmall,
                            tempFilters.userType === role && styles.chipSmallActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, userType: role as any }))}
                        >
                          <Text
                            style={[
                              styles.chipSmallText,
                              tempFilters.userType === role && styles.chipSmallTextActive,
                            ]}
                          >
                            {role === 'ALL' ? 'All Roles' : role}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.groupDivider} />

                  {/* Status */}
                  <View style={styles.filterRow}>
                    <Text style={styles.filterRowLabel}>Status</Text>
                    <View style={styles.filterChipsSmall}>
                      {['ALL', 'Verified', 'Pending'].map((st) => (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.chipSmall,
                            tempFilters.status === st && styles.chipSmallActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, status: st }))}
                        >
                          <Text
                            style={[
                              styles.chipSmallText,
                              tempFilters.status === st && styles.chipSmallTextActive,
                            ]}
                          >
                            {st === 'ALL' ? 'All' : st}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              {/* Sticky Bottom CTA with Dynamic Result Count */}
              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.applyBtn}
                  activeOpacity={0.85}
                  onPress={handleApplyFilters}
                >
                  <Text style={styles.applyBtnText}>
                    Show {tempMatchingCount} Results
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. SUB-MODAL: SELECT DEPARTMENT
        ════════════════════════════════════════════════ */}
        <Modal
          visible={deptSelectorVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDeptSelectorVisible(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContent}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Select Department</Text>
                <TouchableOpacity onPress={() => setDeptSelectorVisible(false)}>
                  <Ionicons name="close" size={22} color="#1E1B4B" />
                </TouchableOpacity>
              </View>

              <View style={styles.subModalSearchBar}>
                <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.subModalSearchInput}
                  placeholder="Search department..."
                  placeholderTextColor="#94A3B8"
                  value={deptSearchText}
                  onChangeText={setDeptSearchText}
                />
              </View>

              <ScrollView style={{ maxHeight: 380 }}>
                {/* All Departments Option */}
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => {
                    setTempFilters((prev) => ({ ...prev, department: 'ALL' }));
                    setDeptSelectorVisible(false);
                  }}
                >
                  <Ionicons
                    name={tempFilters.department === 'ALL' ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={tempFilters.department === 'ALL' ? '#4F46E5' : '#94A3B8'}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.radioText, tempFilters.department === 'ALL' && styles.radioTextActive]}>
                    All Departments
                  </Text>
                </TouchableOpacity>

                {departments
                  .filter((d) =>
                    (d.departmentName || d.department || '').toLowerCase().includes(deptSearchText.toLowerCase())
                  )
                  .map((d) => (
                    <TouchableOpacity
                      key={d.departmentId}
                      style={styles.radioOption}
                      onPress={() => {
                        setTempFilters((prev) => ({ ...prev, department: d.departmentId }));
                        setDeptSelectorVisible(false);
                      }}
                    >
                      <Ionicons
                        name={tempFilters.department === d.departmentId ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={tempFilters.department === d.departmentId ? '#4F46E5' : '#94A3B8'}
                        style={{ marginRight: 10 }}
                      />
                      <Text
                        style={[
                          styles.radioText,
                          tempFilters.department === d.departmentId && styles.radioTextActive,
                        ]}
                      >
                        {d.departmentName}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            9. SUB-MODAL: SELECT CATEGORY
        ════════════════════════════════════════════════ */}
        <Modal
          visible={catSelectorVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCatSelectorVisible(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContent}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Select Category</Text>
                <TouchableOpacity onPress={() => setCatSelectorVisible(false)}>
                  <Ionicons name="close" size={22} color="#1E1B4B" />
                </TouchableOpacity>
              </View>

              <View style={styles.subModalSearchBar}>
                <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.subModalSearchInput}
                  placeholder="Search category..."
                  placeholderTextColor="#94A3B8"
                  value={catSearchText}
                  onChangeText={setCatSearchText}
                />
              </View>

              <ScrollView style={{ maxHeight: 380 }}>
                {/* All Categories Option */}
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => {
                    setTempFilters((prev) => ({ ...prev, categoryId: 'ALL' }));
                    setCatSelectorVisible(false);
                  }}
                >
                  <Ionicons
                    name={tempFilters.categoryId === 'ALL' ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={tempFilters.categoryId === 'ALL' ? '#4F46E5' : '#94A3B8'}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.radioText, tempFilters.categoryId === 'ALL' && styles.radioTextActive]}>
                    All Categories
                  </Text>
                </TouchableOpacity>

                {categories
                  .filter((c) => c.title.toLowerCase().includes(catSearchText.toLowerCase()))
                  .map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={styles.radioOption}
                      onPress={() => {
                        setTempFilters((prev) => ({ ...prev, categoryId: c.id }));
                        setCatSelectorVisible(false);
                      }}
                    >
                      <Ionicons
                        name={tempFilters.categoryId === c.id ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={tempFilters.categoryId === c.id ? '#4F46E5' : '#94A3B8'}
                        style={{ marginRight: 10 }}
                      />
                      <Text
                        style={[
                          styles.radioText,
                          tempFilters.categoryId === c.id && styles.radioTextActive,
                        ]}
                      >
                        {c.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            10. READ-ONLY AUDIT DETAIL MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={!!selectedRecord}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedRecord(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setSelectedRecord(null)} />
            <View style={[styles.sheetContainer, { maxHeight: '88%' }]}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.sheetTitle} numberOfLines={1}>
                    Achievement Audit Detail
                  </Text>
                  <Text style={styles.sheetSubtitle}>Read-only verification review</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                  <Ionicons name="close-circle" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                {selectedRecord && (
                  <>
                    <View style={styles.detailHighlightCard}>
                      <View style={styles.highlightCol}>
                        <Text style={styles.highlightLabel}>AWARDED POINTS</Text>
                        <Text style={styles.highlightPoints}>+{selectedRecord.awardedPoints} pts</Text>
                      </View>
                      <View style={styles.highlightDivider} />
                      <View style={styles.highlightCol}>
                        <Text style={styles.highlightLabel}>STATUS</Text>
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark-circle" size={14} color="#059669" style={{ marginRight: 4 }} />
                          <Text style={styles.verifiedBadgeText}>Verified</Text>
                        </View>
                      </View>
                    </View>

                    {/* Submitter Profile */}
                    <Text style={styles.detailSectionTitle}>SUBMITTER PROFILE</Text>
                    <View style={styles.infoCard}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Name</Text>
                        <Text style={styles.infoVal}>{selectedRecord.userName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Roll / Employee ID</Text>
                        <Text style={styles.infoVal}>{selectedRecord.userRollOrId || selectedRecord.rollOrEmpId}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Department</Text>
                        <Text style={styles.infoVal}>{selectedRecord.departmentName || selectedRecord.department}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>User Type</Text>
                        <Text style={styles.infoVal}>{selectedRecord.userType}</Text>
                      </View>
                    </View>

                    {/* Event & Category Details */}
                    <Text style={styles.detailSectionTitle}>EVENT & CATEGORY DETAILS</Text>
                    <View style={styles.infoCard}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Category</Text>
                        <Text style={styles.infoVal}>{selectedRecord.categoryName || selectedRecord.categoryTitle}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Type</Text>
                        <Text style={styles.infoVal}>{selectedRecord.typeName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Event Name</Text>
                        <Text style={styles.infoVal}>{selectedRecord.eventName || selectedRecord.organizer}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Level</Text>
                        <Text style={styles.infoVal}>{selectedRecord.level}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Result</Text>
                        <Text style={styles.infoVal}>{selectedRecord.result}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>Academic Scope</Text>
                        <Text style={styles.infoVal}>{selectedRecord.academicYear} • Sem {selectedRecord.semester || '5'}</Text>
                      </View>
                    </View>

                    {/* Governance Audit Trail */}
                    <Text style={styles.detailSectionTitle}>GOVERNANCE AUDIT TRAIL</Text>
                    <View style={styles.auditCard}>
                      <Ionicons name="shield-checkmark" size={20} color="#4F46E5" style={{ marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.auditTitle}>Verified by Department Coordinator</Text>
                        <Text style={styles.auditSub}>
                          Approved by {selectedRecord.verifiedBy || 'Academic Coordinator'} on {selectedRecord.verifiedDate || selectedRecord.verifiedAt || '12 Feb 2026'}.
                        </Text>
                      </View>
                    </View>

                    {/* Attached Proof */}
                    <Text style={styles.detailSectionTitle}>ATTACHED PROOF DOCUMENT</Text>
                    <View style={styles.proofCard}>
                      <Ionicons name="document-attach" size={22} color="#2563EB" style={{ marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.proofName}>Official Certificate.pdf</Text>
                        <Text style={styles.proofMeta}>Verified Document • 1.2 MB</Text>
                      </View>
                      <View style={styles.viewBadge}>
                        <Text style={styles.viewBadgeText}>Attached</Text>
                      </View>
                    </View>

                    <View style={{ height: 30 }} />
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            11. BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          activeTab="achievements"
          variant="head"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('headDashboard');
            } else if (tab === 'achievements') {
              // already on achievements
            } else if (tab === 'analytics') {
              onNavigate('headAnalytics');
            } else if (tab === 'reports') {
              onNavigate('headReports');
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
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  /* Header */
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
    borderColor: '#1E1B4B',
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

  /* Search & Filter Row */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    padding: 0,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  filterBtnActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Active Filter Chips */
  activeChipsContainer: {
    marginBottom: 10,
  },
  activeChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    maxWidth: 180,
  },
  activeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  clearAllBtn: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },

  /* Summary Bar */
  summaryBar: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryCount: {
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studentBadge: {
    backgroundColor: '#EEF2FF',
  },
  facultyBadge: {
    backgroundColor: '#ECFDF5',
  },
  roleBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  studentBadgeText: {
    color: '#4F46E5',
  },
  facultyBadgeText: {
    color: '#059669',
  },
  levelBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  levelBadgeText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pointsVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  cardEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardEventText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  userNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  userSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  dateCol: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginBottom: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  emptyResetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  /* Filter Bottom Sheet Modal */
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  sheetSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  sheetResetBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  sheetBody: {
    maxHeight: 460,
  },
  filterGroupHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 10,
  },
  filterGroupCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  filterRow: {
    marginBottom: 2,
  },
  filterRowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  groupDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  filterChipsSmall: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSmallActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  chipSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  chipSmallTextActive: {
    color: '#FFFFFF',
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
    marginLeft: 12,
  },
  drilldownVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 4,
  },
  sheetFooter: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  applyBtn: {
    backgroundColor: '#1E1B4B',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Sub Modal (Radio List) */
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  subModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  subModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subModalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  subModalSearchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    padding: 0,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  radioText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  radioTextActive: {
    fontWeight: '700',
    color: '#4F46E5',
  },

  /* Audit Detail Modal */
  detailScroll: {
    paddingTop: 4,
  },
  detailHighlightCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightCol: {
    flex: 1,
    alignItems: 'center',
  },
  highlightLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  highlightPoints: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4F46E5',
  },
  highlightDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  detailSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoKey: {
    fontSize: 12,
    color: '#64748B',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'right',
    maxWidth: '65%',
  },
  auditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 14,
  },
  auditTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#312E81',
  },
  auditSub: {
    fontSize: 11,
    color: '#4338CA',
    marginTop: 2,
    lineHeight: 15,
  },
  proofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  proofName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  viewBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  viewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
});
