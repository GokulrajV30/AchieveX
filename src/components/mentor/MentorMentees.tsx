// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Mentees Roster Screen (Simplified MVP)
// Header → Hero → Search & Year Filter → Tabs → Mentee Cards → Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G } from 'react-native-svg';
import MentorBottomTab from './MentorBottomTab';
import {
  getDerivedMenteesFromProjects,
  type MentorMentee,
} from '../../data/mentorWorkspaceData';
import { subscribeHODData } from '../../data/hodWorkspaceData';

interface MentorMenteesProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectMentee: (mentee: MentorMentee) => void;
  initialFilter?: string;
}

export default function MentorMentees({
  onOpenMenu,
  onNavigate,
  onSelectMentee,
}: MentorMenteesProps) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribeHODData(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const menteesList = useMemo(() => getDerivedMenteesFromProjects('fac-1'), [tick]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'withProject' | 'noProject'>('all');
  const [selectedYear, setSelectedYear] = useState<'All' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Team' | 'Individual'>('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filtered dataset
  const filteredMentees = useMemo(() => {
    return menteesList.filter((mentee) => {
      // Search filter
      const matchesSearch =
        mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.registerNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filter
      if (activeTab === 'withProject' && !mentee.hasProject) return false;
      if (activeTab === 'noProject' && mentee.hasProject) return false;

      // Year filter
      if (selectedYear !== 'All' && mentee.yearLabel !== selectedYear) return false;

      // Project Type filter
      if (selectedType !== 'All') {
        if (!mentee.hasProject) return false;
        if (mentee.projectType !== selectedType) return false;
      }

      return true;
    });
  }, [menteesList, searchQuery, activeTab, selectedYear, selectedType]);

  const withProjectCount = menteesList.filter((m) => m.hasProject).length;
  const noProjectCount = menteesList.filter((m) => !m.hasProject).length;

  // Donut Gauge Dimensions - exact match to Student & Faculty & Proctor Hero
  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2; // 58
  const circumference = 2 * Math.PI * radius;
  const withProjectPercent = Math.round((withProjectCount / (menteesList.length || 1)) * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. HEADER (Exact Student / Faculty Match)
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuIconContainer}
              activeOpacity={0.7}
              onPress={onOpenMenu}
            >
              <Ionicons name="menu-outline" size={22} color="#0D4733" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.headerMainTitle}>Assigned Mentees</Text>
              <Text style={styles.headerSubtitleText}>CSE (IoT) • Section A</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellIconContainer}
            activeOpacity={0.7}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons
              name={
                selectedYear !== 'All' || selectedType !== 'All'
                  ? 'filter'
                  : 'filter-outline'
              }
              size={20}
              color={
                selectedYear !== 'All' || selectedType !== 'All'
                  ? '#2563EB'
                  : '#0F172A'
              }
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              2. HERO BANNER CARD (Exact Student / Faculty Match)
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Top Row: People Icon Badge + Title + Subtitle */}
            <View style={styles.topRow}>
              <View style={styles.trophyBadgeCircle}>
                <Ionicons name="people" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.titleColumn}>
                <Text style={styles.journeyTitle}>Assigned Mentees</Text>
                <Text style={styles.levelSubtitle}>Cohort 2026–2027</Text>
              </View>
            </View>

            {/* Content Row: Left Column, Vertical Divider, Right Donut Gauge */}
            <View style={styles.contentRow}>
              <View style={styles.leftColumn}>
                <View style={styles.pointsWrapper}>
                  <Text style={styles.pointsNumber}>{menteesList.length}</Text>
                  <Text style={styles.pointsLabel}>Mentees</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewAchievementsButton}
                  activeOpacity={0.85}
                  onPress={() => setActiveTab('withProject')}
                >
                  <Text style={styles.viewAchievementsButtonText}>{withProjectCount} With Project</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.rightGaugeColumn}>
                <View style={styles.svgContainer}>
                  <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(99, 102, 241, 0.45)"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FDE047"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - withProjectPercent / 100)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  <View style={styles.gaugeCenterTextWrapper}>
                    <Text style={styles.gaugeNumberText}>{withProjectPercent}%</Text>
                    <Text style={styles.gaugeSubText}>Projects</Text>
                    <Text style={styles.gaugeLevelText}>{withProjectCount} of {menteesList.length}</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              3. SEARCH & ACTIVE FILTER BAR
          ════════════════════════════════════════════════ */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search name or register number..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.filterButton,
                (selectedYear !== 'All' || selectedType !== 'All') && styles.filterButtonActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color={selectedYear !== 'All' || selectedType !== 'All' ? '#FFFFFF' : '#475569'}
              />
            </TouchableOpacity>
          </View>

          {/* Active Filter Chips */}
          {(selectedYear !== 'All' || selectedType !== 'All') && (
            <View style={styles.activeChipsRow}>
              {selectedYear !== 'All' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{selectedYear}</Text>
                  <TouchableOpacity onPress={() => setSelectedYear('All')}>
                    <Ionicons name="close" size={14} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedType !== 'All' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{selectedType} Projects</Text>
                  <TouchableOpacity onPress={() => setSelectedType('All')}>
                    <Ionicons name="close" size={14} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectedYear('All');
                  setSelectedType('All');
                }}
              >
                <Text style={styles.resetFiltersText}>Reset</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ════════════════════════════════════════════════
              4. TABS (All | With Project | No Project)
          ════════════════════════════════════════════════ */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'all' && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                All ({menteesList.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'withProject' && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('withProject')}
            >
              <Text style={[styles.tabText, activeTab === 'withProject' && styles.tabTextActive]}>
                With Project ({withProjectCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'noProject' && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('noProject')}
            >
              <Text style={[styles.tabText, activeTab === 'noProject' && styles.tabTextActive]}>
                No Project ({noProjectCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              5. MENTEE CARDS LIST
          ════════════════════════════════════════════════ */}
          {filteredMentees.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateTitle}>No mentees found</Text>
              <Text style={styles.emptyStateSub}>
                Try adjusting your search query or filter options.
              </Text>
            </View>
          ) : (
            filteredMentees.map((mentee) => {
              const initials = mentee.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('');

              return (
                <TouchableOpacity
                  key={mentee.id}
                  style={styles.menteeCard}
                  activeOpacity={0.85}
                  onPress={() => onSelectMentee(mentee)}
                >
                  <View style={styles.menteeCardTop}>
                    <View style={styles.avatarWrap}>
                      <Text style={styles.avatarText}>{initials}</Text>
                    </View>

                    <View style={styles.menteeInfo}>
                      <Text style={styles.menteeName}>{mentee.name}</Text>
                      <View style={styles.menteeSubRow}>
                        <Text style={styles.menteeReg}>{mentee.registerNumber}</Text>
                        <Text style={styles.subDot}>•</Text>
                        <Text style={styles.menteeDept}>{mentee.department}</Text>
                        <Text style={styles.subDot}>•</Text>
                        <Text style={styles.menteeYear}>{mentee.yearLabel}</Text>
                      </View>
                    </View>

                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                  </View>

                  {/* Project Summary Banner on Mentee Card */}
                  <View
                    style={[
                      styles.projectStatusBanner,
                      {
                        backgroundColor: mentee.hasProject ? '#F8FAFC' : '#F8FAFC',
                        borderColor: mentee.hasProject ? '#E2E8F0' : '#E2E8F0',
                      },
                    ]}
                  >
                    {mentee.hasProject ? (
                      <View style={styles.projectInfoRow}>
                        <View style={styles.projectIconMini}>
                          <Ionicons name="folder" size={13} color="#2563EB" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardProjectTitle} numberOfLines={1}>
                            {mentee.projectName}
                          </Text>
                          <Text style={styles.cardProjectRole}>
                            {mentee.projectRole} • {mentee.projectDomain}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.noProjectRow}>
                        <Ionicons name="ellipse-outline" size={13} color="#94A3B8" />
                        <Text style={styles.noProjectText}>No Project Added</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* Bottom spacer for floating navigation */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            6. FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterSheet}>
              <View style={styles.filterSheetHeader}>
                <Text style={styles.filterSheetTitle}>Filter Mentees</Text>
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              {/* Year Filter (Prominent) */}
              <Text style={styles.filterGroupLabel}>Student Year</Text>
              <View style={styles.filterPillsGrid}>
                {(['All', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map(
                  (yr) => (
                    <TouchableOpacity
                      key={yr}
                      style={[
                        styles.filterPill,
                        selectedYear === yr && styles.filterPillActive,
                      ]}
                      onPress={() => setSelectedYear(yr)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          selectedYear === yr && styles.filterPillTextActive,
                        ]}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              {/* Project Type Filter */}
              <Text style={styles.filterGroupLabel}>Project Type</Text>
              <View style={styles.filterPillsGrid}>
                {(['All', 'Team', 'Individual'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterPill,
                      selectedType === type && styles.filterPillActive,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        selectedType === type && styles.filterPillTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.resetModalBtn}
                  onPress={() => {
                    setSelectedYear('All');
                    setSelectedType('All');
                  }}
                >
                  <Text style={styles.resetModalBtnText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyModalBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.applyModalBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            7. LOCKED 5-TAB BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <MentorBottomTab activeTab="mentees" onNavigate={onNavigate} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroCard: {
    width: '100%',
    maxWidth: 356,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trophyBadgeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  journeyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  levelSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FDE047',
    marginTop: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minHeight: 120,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  pointsWrapper: {
    marginBottom: 12,
  },
  pointsNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  pointsLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 1,
  },
  viewAchievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAchievementsButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  verticalDivider: {
    width: 1,
    height: 78,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 12,
  },
  rightGaugeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'relative',
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNumberText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  gaugeSubText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 13,
  },
  gaugeLevelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FDE047',
    lineHeight: 16,
  },
  heroMetricBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  activeChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  activeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  resetFiltersText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  menteeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menteeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  menteeInfo: {
    flex: 1,
  },
  menteeName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  menteeSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  menteeReg: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  subDot: {
    fontSize: 11,
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  menteeDept: {
    fontSize: 11.5,
    color: '#64748B',
  },
  menteeYear: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  projectStatusBanner: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
  projectInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectIconMini: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardProjectTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardProjectRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  noProjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noProjectText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptyStateSub: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  filterSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  filterGroupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginTop: 10,
  },
  filterPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  resetModalBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  applyModalBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  applyModalBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
