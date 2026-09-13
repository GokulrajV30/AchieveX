// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Projects Screen (Main Feature MVP)
// Header → Hero → Search & Year/Domain Filter → Tabs → Project Cards → Bottom Nav
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
  getProjectsForMentor,
  type MentorProject,
} from '../../data/mentorWorkspaceData';
import { subscribeHODData } from '../../data/hodWorkspaceData';

interface MentorProjectsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectProject: (project: MentorProject) => void;
  initialTab?: 'All' | 'Team' | 'Individual';
}

export default function MentorProjects({
  onOpenMenu,
  onNavigate,
  onSelectProject,
  initialTab = 'All',
}: MentorProjectsProps) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribeHODData(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const mentorProjectsList = useMemo(() => getProjectsForMentor('fac-1'), [tick]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Team' | 'Individual'>(initialTab);
  const [selectedYear, setSelectedYear] = useState<'All' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Available unique domains
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    mentorProjectsList.forEach((p) => set.add(p.domain));
    return ['All', ...Array.from(set)];
  }, [mentorProjectsList]);

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return mentorProjectsList.filter((project) => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.domain.toLowerCase().includes(query) ||
        project.teamLeader.name.toLowerCase().includes(query) ||
        project.teamMembers.some((m) => m.name.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Tab
      if (activeTab !== 'All' && project.projectType !== activeTab) return false;

      // Student Year Filter
      if (selectedYear !== 'All' && project.studentYear !== selectedYear) return false;

      // Domain Filter
      if (selectedDomain !== 'All' && project.domain !== selectedDomain) return false;

      return true;
    });
  }, [mentorProjectsList, searchQuery, activeTab, selectedYear, selectedDomain]);

  const teamCount = mentorProjectsList.filter((p) => p.projectType === 'Team').length;
  const individualCount = mentorProjectsList.filter((p) => p.projectType === 'Individual').length;

  // Donut Gauge Dimensions - exact match to Student & Faculty & Proctor Hero
  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2; // 58
  const circumference = 2 * Math.PI * radius;

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
              <Text style={styles.headerMainTitle}>Mentee Projects</Text>
              <Text style={styles.headerSubtitleText}>Monitor & Track Work</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellIconContainer}
            activeOpacity={0.7}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons
              name={
                selectedYear !== 'All' || selectedDomain !== 'All'
                  ? 'filter'
                  : 'filter-outline'
              }
              size={20}
              color={
                selectedYear !== 'All' || selectedDomain !== 'All'
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
            {/* Top Row: Folder Icon Badge + Title + Subtitle */}
            <View style={styles.topRow}>
              <View style={styles.trophyBadgeCircle}>
                <Ionicons name="folder-open" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.titleColumn}>
                <Text style={styles.journeyTitle}>Mentee Projects</Text>
                <Text style={styles.levelSubtitle}>Across Assigned Mentees</Text>
              </View>
            </View>

            {/* Content Row: Left Column, Vertical Divider, Right Gauge */}
            <View style={styles.contentRow}>
              <View style={styles.leftColumn}>
                <View style={styles.pointsWrapper}>
                  <Text style={styles.pointsNumber}>
                    {mentorProjectsList.length < 10 ? `0${mentorProjectsList.length}` : mentorProjectsList.length}
                  </Text>
                  <Text style={styles.pointsLabel}>Projects</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewAchievementsButton}
                  activeOpacity={0.85}
                  onPress={() => setActiveTab('All')}
                >
                  <Text style={styles.viewAchievementsButtonText}>{teamCount} Team · {individualCount} Solo</Text>
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
                        strokeDashoffset={circumference * (1 - 1.0)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  <View style={styles.gaugeCenterTextWrapper}>
                    <Text style={styles.gaugeNumberText}>100%</Text>
                    <Text style={styles.gaugeSubText}>Projects</Text>
                    <Text style={styles.gaugeLevelText}>6 of 6 Active</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              3. SEARCH & FILTER ROW
          ════════════════════════════════════════════════ */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search project, student or domain..."
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
                (selectedYear !== 'All' || selectedDomain !== 'All') && styles.filterButtonActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color={selectedYear !== 'All' || selectedDomain !== 'All' ? '#FFFFFF' : '#475569'}
              />
            </TouchableOpacity>
          </View>

          {/* Active Filter Chips */}
          {(selectedYear !== 'All' || selectedDomain !== 'All') && (
            <View style={styles.activeChipsRow}>
              {selectedYear !== 'All' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{selectedYear}</Text>
                  <TouchableOpacity onPress={() => setSelectedYear('All')}>
                    <Ionicons name="close" size={14} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedDomain !== 'All' && (
                <View style={styles.activeChip}>
                  <Text style={styles.activeChipText}>{selectedDomain}</Text>
                  <TouchableOpacity onPress={() => setSelectedDomain('All')}>
                    <Ionicons name="close" size={14} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectedYear('All');
                  setSelectedDomain('All');
                }}
              >
                <Text style={styles.resetFiltersText}>Reset</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ════════════════════════════════════════════════
              4. PROJECT TABS (All | Team | Individual)
          ════════════════════════════════════════════════ */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'All' && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('All')}
            >
              <Text style={[styles.tabText, activeTab === 'All' && styles.tabTextActive]}>
                All ({mentorProjectsList.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'Team' && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('Team')}
            >
              <Text style={[styles.tabText, activeTab === 'Team' && styles.tabTextActive]}>
                Team ({teamCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'Individual' && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('Individual')}
            >
              <Text style={[styles.tabText, activeTab === 'Individual' && styles.tabTextActive]}>
                Individual ({individualCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              5. PROJECT CARDS LIST
          ════════════════════════════════════════════════ */}
          {filteredProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateTitle}>No projects match the selected filters</Text>
              <Text style={styles.emptyStateSub}>
                Try adjusting your search keywords or clearing applied filters.
              </Text>
            </View>
          ) : (
            filteredProjects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                activeOpacity={0.85}
                onPress={() => onSelectProject(project)}
              >
                <View style={styles.projectCardHeader}>
                  <View style={styles.projectIconWrap}>
                    <Ionicons
                      name={project.projectType === 'Team' ? 'people' : 'person'}
                      size={18}
                      color="#2563EB"
                    />
                  </View>
                  <View style={styles.projectTitleWrap}>
                    <Text style={styles.projectTitle} numberOfLines={1}>
                      {project.title}
                    </Text>
                    <View style={styles.projectMetaRow}>
                      <Text style={styles.projectDomainText}>{project.domain}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.projectYearText}>{project.studentYear}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          project.projectType === 'Team' ? '#EFF6FF' : '#F8FAFC',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        {
                          color:
                            project.projectType === 'Team' ? '#2563EB' : '#64748B',
                        },
                      ]}
                    >
                      {project.projectType}
                    </Text>
                  </View>
                </View>

                <Text style={styles.projectDesc} numberOfLines={2}>
                  {project.description}
                </Text>

                <View style={styles.projectCardFooter}>
                  <View style={styles.leadInfoWrap}>
                    <Text style={styles.leadLabel}>
                      {project.projectType === 'Team' ? 'Team Leader: ' : 'Project Owner: '}
                      <Text style={styles.leadName}>{project.teamLeader.name}</Text>
                    </Text>
                    {project.projectType === 'Team' && (
                      <Text style={styles.memberCountBadge}>
                        • {project.teamMembers.length} Members
                      </Text>
                    )}
                  </View>

                  <View style={styles.viewLinkRow}>
                    <Text style={styles.viewLinkText}>View Project</Text>
                    <Ionicons name="arrow-forward" size={13} color="#2563EB" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Bottom spacer for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            6. FILTER BOTTOM SHEET MODAL (Year-Wise Prominent)
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
                <Text style={styles.filterSheetTitle}>Filter Projects</Text>
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

              {/* Domain Filter */}
              <Text style={styles.filterGroupLabel}>Domain</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.domainPillsRow}
              >
                {availableDomains.map((dom) => (
                  <TouchableOpacity
                    key={dom}
                    style={[
                      styles.filterPill,
                      selectedDomain === dom && styles.filterPillActive,
                    ]}
                    onPress={() => setSelectedDomain(dom)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        selectedDomain === dom && styles.filterPillTextActive,
                      ]}
                    >
                      {dom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.resetModalBtn}
                  onPress={() => {
                    setSelectedYear('All');
                    setSelectedDomain('All');
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
        <MentorBottomTab activeTab="projects" onNavigate={onNavigate} />
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
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  projectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  projectTitleWrap: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  projectMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  projectDomainText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  metaDot: {
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  projectYearText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  projectDesc: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  projectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  leadInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  leadName: {
    fontWeight: '700',
    color: '#0F172A',
  },
  memberCountBadge: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 4,
  },
  viewLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
    textAlign: 'center',
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
  domainPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
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
