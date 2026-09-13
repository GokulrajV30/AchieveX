// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Assigned Students Screen
// Operational center for searching, filtering, and inspecting assigned students.
// Adheres strictly to the AchieveX SaaS design system:
// Header -> Blue/Indigo Hero Card with Donut Gauge -> Controls -> Student Cards -> Bottom Nav
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Circle } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  PROCTOR_ASSIGNED_STUDENTS,
  PROCTOR_SUMMARY_DATA,
  type AssignedStudent,
} from '../../../data/facultyWorkspaceData';
import { getHODStore, subscribeHODData } from '../../../data/hodWorkspaceData';
import { Alert } from 'react-native';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorAssignedStudentsProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onSelectStudent: (student: AssignedStudent) => void;
}

// Avatar color helper based on student initials
const AVATAR_COLOR_PALETTES = [
  { bg: '#EFF6FF', text: '#2563EB', border: '#DBEAFE' },
  { bg: '#EEF2FF', text: '#4F46E5', border: '#E0E7FF' },
  { bg: '#F0FDF4', text: '#16A34A', border: '#DCFCE7' },
  { bg: '#FAF5FF', text: '#9333EA', border: '#F3E8FF' },
  { bg: '#FFF7ED', text: '#EA580C', border: '#FFEDD5' },
  { bg: '#ECFEFF', text: '#0891B2', border: '#CFFAFE' },
];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTES.length;
  return AVATAR_COLOR_PALETTES[index];
}

export default function ProctorAssignedStudents({
  onGoBack,
  onNavigate,
  onSelectStudent,
}: ProctorAssignedStudentsProps) {
  const [storeTick, setStoreTick] = useState(0);
  const store = getHODStore();

  useEffect(() => {
    const unsub = subscribeHODData(() => setStoreTick((t) => t + 1));
    return unsub;
  }, []);

  const currentFacultyId = 'fac-9'; // Mr. Rajesh K
  const proctorAssignment = store.getProctorAssignmentForFaculty(currentFacultyId);
  const scopeYear = proctorAssignment?.year || '3rd Year';
  const scopeSection = proctorAssignment?.section || 'Section A';
  const assignedFromStore = store.getProctorStudents(currentFacultyId);

  // Map to AssignedStudent shape
  const studentRoster: AssignedStudent[] = useMemo(() => {
    if (assignedFromStore.length > 0) {
      return assignedFromStore.map((st) => {
        const existingMock = PROCTOR_ASSIGNED_STUDENTS.find(
          (m) => m.registerNumber.toLowerCase() === st.rollNumber.toLowerCase() || m.name.toLowerCase() === st.name.toLowerCase()
        );
        if (existingMock) return existingMock;
        return {
          id: st.id,
          name: st.name,
          registerNumber: st.rollNumber,
          departmentId: 'CSE_IOT',
          departmentName: st.department,
          academicYear: '2026-27',
          currentYear: (st.year === '1st Year' ? 1 : st.year === '2nd Year' ? 2 : st.year === '3rd Year' ? 3 : 4) as any,
          section: (st.section === 'Section B' ? 'B' : 'A') as any,
          performance: {
            verifiedAchievements: st.verifiedCount || 4,
            pendingAchievements: st.pendingCount || 0,
            points: (st.verifiedCount || 4) * 40,
            activeGoals: 1,
          },
          hasVerifiedThisSemester: true,
          assignedProctorId: currentFacultyId,
        };
      });
    }
    return [];
  }, [assignedFromStore, storeTick]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Attention'>('All');
  const [selectedYear, setSelectedYear] = useState<'All' | 1 | 2 | 3 | 4>('All');
  const [selectedSection, setSelectedSection] = useState<'All' | 'A' | 'B'>('All');
  const [selectedSemester, setSelectedSemester] = useState<'All' | string>('All');
  const [refreshing, setRefreshing] = useState(false);

  // Add Students modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStudentSearch, setAddStudentSearch] = useState('');
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);

  // Eligible students within HOD-authorized scope
  const eligibleInScope = useMemo(() => {
    return store.getEligibleStudentsForScope(scopeYear, scopeSection);
  }, [store, scopeYear, scopeSection, storeTick]);

  const filteredEligible = useMemo(() => {
    return eligibleInScope.filter((s) => {
      const q = addStudentSearch.toLowerCase().trim();
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q);
    });
  }, [eligibleInScope, addStudentSearch]);

  // Derive counts directly from the dynamic roster
  const totalCount = studentRoster.length;
  const activeCount = useMemo(
    () => studentRoster.filter((s) => !s.needsAttention).length,
    [studentRoster]
  );
  const attentionCount = useMemo(
    () => studentRoster.filter((s) => s.needsAttention).length,
    [studentRoster]
  );

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  // Svg Donut Gauge Dimensions
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const filteredStudents = useMemo(() => {
    return studentRoster.filter((student) => {
      // Search filter
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesRoll = student.registerNumber.toLowerCase().includes(query);
        const matchesDept = student.departmentName.toLowerCase().includes(query);
        if (!matchesName && !matchesRoll && !matchesDept) return false;
      }

      // Status chip filter
      if (selectedStatus === 'Active' && student.needsAttention) return false;
      if (selectedStatus === 'Attention' && !student.needsAttention) return false;

      // Year filter
      if (selectedYear !== 'All' && student.currentYear !== selectedYear) return false;

      // Section filter
      if (selectedSection !== 'All' && student.section !== selectedSection) return false;

      return true;
    });
  }, [studentRoster, searchQuery, selectedStatus, selectedYear, selectedSection]);


  const activeFiltersCount =
    (selectedYear !== 'All' ? 1 : 0) +
    (selectedSection !== 'All' ? 1 : 0) +
    (selectedSemester !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedYear('All');
    setSelectedSection('All');
    setSelectedSemester('All');
    setFilterModalVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleRemoveStudent = (student: AssignedStudent) => {
    Alert.alert(
      'Remove from My Students?',
      `Remove ${student.name} (${student.registerNumber}) from your proctor group? They will return to the unassigned student pool for ${scopeYear} ${scopeSection}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            store.removeStudentFromProctor(currentFacultyId, student.id);
            Alert.alert('Student Removed', `${student.name} has been removed from your proctor group.`);
          },
        },
      ]
    );
  };

  const renderStudentItem = ({ item }: { item: AssignedStudent }) => {
    const avatar = getAvatarColors(item.name);
    const initials = getInitials(item.name);
    const isAttention = !!item.needsAttention;

    return (
      <TouchableOpacity
        style={[styles.studentCard, isAttention && styles.studentCardAttention]}
        activeOpacity={0.7}
        onPress={() => onSelectStudent(item)}
      >
        {/* Top Row: Avatar, Identity & Status Badge */}
        <View style={styles.cardHeaderRow}>
          <View style={[styles.avatarCircle, { backgroundColor: avatar.bg, borderColor: avatar.border }]}>
            <Text style={[styles.avatarText, { color: avatar.text }]}>{initials}</Text>
          </View>

          <View style={styles.studentInfoCol}>
            <View style={styles.nameStatusRow}>
              <Text style={styles.studentName} numberOfLines={1}>
                {item.name}
              </Text>
              {isAttention ? (
                <View style={styles.attentionTag}>
                  <Ionicons name="alert-circle" size={12} color="#D97706" style={{ marginRight: 3 }} />
                  <Text style={styles.attentionTagText}>Needs Attention</Text>
                </View>
              ) : (
                <View style={styles.activeTag}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeTagText}>Active</Text>
                </View>
              )}
            </View>

            <Text style={styles.studentMetaText}>
              {item.registerNumber} • {item.departmentName} • {item.currentYear}rd Year {item.section}
            </Text>
          </View>
        </View>

        {/* Semantic Needs Attention Reason Banner (Soft Amber Box, Not Red Card) */}
        {isAttention && item.attentionReason && (
          <View style={styles.attentionReasonBox}>
            <Ionicons name="information-circle-outline" size={14} color="#D97706" style={{ marginRight: 6 }} />
            <Text style={styles.attentionReasonText} numberOfLines={1}>
              {item.attentionReason}
            </Text>
          </View>
        )}

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Bottom Metric Row & Action */}
        <View style={styles.cardBottomRow}>
          <View style={styles.metricsGroup}>
            <View style={styles.metricItem}>
              <Ionicons name="trophy-outline" size={14} color="#2563EB" style={{ marginRight: 4 }} />
              <Text style={styles.metricValue}>{item.performance.verifiedAchievements}</Text>
              <Text style={styles.metricLabel}>Verified</Text>
            </View>

            <View style={styles.metricItemDivider} />

            <View style={styles.metricItem}>
              <Ionicons name="star-outline" size={14} color="#D97706" style={{ marginRight: 4 }} />
              <Text style={styles.metricValue}>{item.performance.points}</Text>
              <Text style={styles.metricLabel}>pts</Text>
            </View>

            {item.performance.activeGoals > 0 && (
              <>
                <View style={styles.metricItemDivider} />
                <View style={styles.metricItem}>
                  <Ionicons name="compass-outline" size={14} color="#0891B2" style={{ marginRight: 4 }} />
                  <Text style={styles.metricValue}>{item.performance.activeGoals}</Text>
                  <Text style={styles.metricLabel}>Goals</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={styles.removeStudentBtn}
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                handleRemoveStudent(item);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="person-remove-outline" size={15} color="#94A3B8" />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          2. BLUE → INDIGO PREMIUM HERO CARD WITH DONUT
      ════════════════════════════════════════════════ */}
      <View style={styles.heroCardWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Top Row: Label & Category Icon */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroLabelRow}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="people" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabelText}>YOUR STUDENTS</Text>
            </View>

            <TouchableOpacity
              style={styles.heroActionBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('proctorPerformance')}
            >
              <Text style={styles.heroActionBtnText}>View Performance</Text>
              <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Body Row: Metrics (Left) + Donut Ring (Right) */}
          <View style={styles.heroBodyRow}>
            {/* Left: Big Number + Cohort Subtext */}
            <View style={styles.heroLeftCol}>
              <View style={styles.heroNumberGroup}>
                <Text style={styles.heroBigNumber}>{totalCount}</Text>
                <Text style={styles.heroBigNumberLabel}>Assigned Students</Text>
              </View>
              <Text style={styles.heroCohortText}>CSE (IoT) • {scopeYear} • {scopeSection}</Text>

              {/* Bottom Quick Breakdown Pills */}
              <View style={styles.heroBreakdownRow}>
                <View style={styles.heroBreakdownPill}>
                  <View style={[styles.heroStatusDot, { backgroundColor: '#4ADE80' }]} />
                  <Text style={styles.heroBreakdownText}>{activeCount} Active</Text>
                </View>

                <View style={styles.heroBreakdownPill}>
                  <View style={[styles.heroStatusDot, { backgroundColor: '#FDE047' }]} />
                  <Text style={styles.heroBreakdownText}>{attentionCount} Need Attention</Text>
                </View>
              </View>
            </View>

            {/* Right: Circular Donut Gauge */}
            <View style={styles.heroGaugeCol}>
              <View style={styles.donutWrapper}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                  <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background Ring */}
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    {/* Progress Arc */}
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke="#FDE047"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - activePercent / 100)}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </G>
                </Svg>

                <View style={styles.donutTextOverlay}>
                  <Text style={styles.donutPercentText}>{activePercent}%</Text>
                  <Text style={styles.donutLabelText}>Active</Text>
                  <Text style={styles.donutFractionText}>
                    {activeCount} of {totalCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          3. SECTION TITLE + SEARCH + FILTER
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Assigned Students</Text>
          <Text style={styles.sectionSubtitle}>Scope: CSE (IoT) • {scopeYear} • {scopeSection}</Text>
        </View>
        <TouchableOpacity
          style={styles.addStudentsBtn}
          onPress={() => {
            setSelectedToAdd([]);
            setAddStudentSearch('');
            setIsAddModalOpen(true);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addStudentsBtnText}>+ Add Students</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchFilterRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or register number"
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
          4. STATUS SEGMENT TABS / CHIPS
      ════════════════════════════════════════════════ */}
      <View style={styles.statusChipsContainer}>
        <TouchableOpacity
          style={[styles.statusChip, selectedStatus === 'All' && styles.statusChipActive]}
          activeOpacity={0.8}
          onPress={() => setSelectedStatus('All')}
        >
          <Text style={[styles.statusChipText, selectedStatus === 'All' && styles.statusChipTextActive]}>
            All {totalCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusChip, selectedStatus === 'Active' && styles.statusChipActive]}
          activeOpacity={0.8}
          onPress={() => setSelectedStatus('Active')}
        >
          <Text style={[styles.statusChipText, selectedStatus === 'Active' && styles.statusChipTextActive]}>
            Active {activeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusChip, selectedStatus === 'Attention' && styles.statusChipActive]}
          activeOpacity={0.8}
          onPress={() => setSelectedStatus('Attention')}
        >
          <Text
            style={[
              styles.statusChipText,
              selectedStatus === 'Attention' && styles.statusChipTextActive,
              selectedStatus !== 'Attention' && { color: '#B45309' },
            ]}
          >
            Needs Attention {attentionCount}
          </Text>
        </TouchableOpacity>
      </View>
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
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Assigned Students</Text>
            <Text style={styles.headerSubtitle}>Students under your guidance</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            5. STUDENT LIST WITH HERO HEADER
        ════════════════════════════════════════════════ */}
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderStudentItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            totalCount === 0 ? (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="people-outline" size={36} color="#2563EB" />
                </View>
                <Text style={styles.emptyStateTitle}>No Students Added Yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  {`Your HOD assigned you to: CSE (IoT) • ${scopeYear} • ${scopeSection}.\nAdd the students assigned to you from this group.`}
                </Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={() => {
                    setSelectedToAdd([]);
                    setAddStudentSearch('');
                    setIsAddModalOpen(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.emptyAddBtnText}>+ Add Students from Scope</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="people-outline" size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? 'No matching students' : selectedStatus === 'Attention' ? 'Everyone is on track' : 'No students found'}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  {searchQuery
                    ? 'Try searching with a different name or roll number.'
                    : selectedStatus === 'Attention'
                    ? 'No students currently require attention in your group.'
                    : 'Students assigned to your proctor group will appear here.'}
                </Text>
                {(searchQuery.length > 0 || activeFiltersCount > 0 || selectedStatus !== 'All') && (
                  <TouchableOpacity
                    style={styles.clearFiltersBtn}
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedStatus('All');
                      handleResetFilters();
                    }}
                  >
                    <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
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
            <View style={styles.filterModalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Filter Students</Text>
                  <Text style={styles.modalSubtitle}>Refine by academic cohort and year</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Year Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>ACADEMIC YEAR</Text>
                <View style={styles.filterChipsGrid}>
                  {(['All', 1, 2, 3, 4] as const).map((year) => (
                    <TouchableOpacity
                      key={String(year)}
                      style={[
                        styles.filterModalChip,
                        selectedYear === year && styles.filterModalChipActive,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.filterModalChipText,
                          selectedYear === year && styles.filterModalChipTextActive,
                        ]}
                      >
                        {year === 'All' ? 'All Years' : `${year}rd Year`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Section Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SECTION</Text>
                <View style={styles.filterChipsGrid}>
                  {(['All', 'A', 'B'] as const).map((sec) => (
                    <TouchableOpacity
                      key={sec}
                      style={[
                        styles.filterModalChip,
                        selectedSection === sec && styles.filterModalChipActive,
                      ]}
                      onPress={() => setSelectedSection(sec)}
                    >
                      <Text
                        style={[
                          styles.filterModalChipText,
                          selectedSection === sec && styles.filterModalChipTextActive,
                        ]}
                      >
                        {sec === 'All' ? 'All Sections' : `Section ${sec}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Semester Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SEMESTER</Text>
                <View style={styles.filterChipsGrid}>
                  {['All', 'Semester 5', 'Semester 6'].map((sem) => (
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
                        {sem === 'All' ? 'All Semesters' : sem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalResetBtn}
                  onPress={handleResetFilters}
                >
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
            6B. ADD STUDENTS BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={isAddModalOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.addModalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Add Students to Group</Text>
                  <Text style={styles.modalSubtitle}>
                    Scope: CSE (IoT) • {scopeYear} • {scopeSection}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setIsAddModalOpen(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.modalSearchBox}>
                <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search name or register number..."
                  placeholderTextColor="#94A3B8"
                  value={addStudentSearch}
                  onChangeText={setAddStudentSearch}
                />
                {addStudentSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setAddStudentSearch('')}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Quick helper text */}
              <View style={styles.addScopeInfoRow}>
                <Text style={styles.addScopeInfoText}>
                  {filteredEligible.length} student(s) available in this cohort
                </Text>
              </View>

              {/* Student Selection List */}
              <FlatList
                data={filteredEligible}
                keyExtractor={(item) => item.id}
                style={styles.eligibleStudentList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const existingProctor = store.getStudentProctor(item.id);
                  const isAlreadyInMyGroup = existingProctor?.id === currentFacultyId;
                  const isAssignedToOther = !!existingProctor && existingProctor.id !== currentFacultyId;
                  const isSelected = selectedToAdd.includes(item.id);

                  return (
                    <TouchableOpacity
                      style={[
                        styles.addStudentItemCard,
                        isSelected && styles.addStudentItemCardSelected,
                        isAlreadyInMyGroup && styles.addStudentItemCardDisabled,
                      ]}
                      activeOpacity={isAlreadyInMyGroup ? 1 : 0.7}
                      onPress={() => {
                        if (isAlreadyInMyGroup) return;
                        setSelectedToAdd((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                    >
                      {/* Checkbox */}
                      <View
                        style={[
                          styles.addCheckbox,
                          isSelected && styles.addCheckboxSelected,
                          isAlreadyInMyGroup && styles.addCheckboxDisabled,
                        ]}
                      >
                        {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                        {isAlreadyInMyGroup && <Ionicons name="checkmark" size={14} color="#94A3B8" />}
                      </View>

                      {/* Info */}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.addStudentName}>{item.name}</Text>
                        <Text style={styles.addStudentRoll}>
                          {item.rollNumber} • {item.department} • {item.year}
                        </Text>
                        {isAlreadyInMyGroup && (
                          <View style={styles.alreadyBadge}>
                            <Ionicons name="checkmark-circle" size={11} color="#059669" style={{ marginRight: 3 }} />
                            <Text style={styles.alreadyBadgeText}>Already in your group</Text>
                          </View>
                        )}
                        {isAssignedToOther && (
                          <View style={styles.otherProctorBadge}>
                            <Ionicons name="information-circle" size={11} color="#D97706" style={{ marginRight: 3 }} />
                            <Text style={styles.otherProctorBadgeText}>
                              Assigned to {existingProctor?.name}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* Footer Actions */}
              <View style={styles.addModalFooter}>
                <TouchableOpacity
                  style={styles.modalResetBtn}
                  onPress={() => setIsAddModalOpen(false)}
                >
                  <Text style={styles.modalResetBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalApplyBtn,
                    selectedToAdd.length === 0 && { backgroundColor: '#94A3B8' },
                  ]}
                  disabled={selectedToAdd.length === 0}
                  onPress={() => {
                    Alert.alert(
                      'Add Students Confirmation',
                      `Add ${selectedToAdd.length} student(s) to your proctor group for ${scopeYear} ${scopeSection}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Confirm & Add',
                          onPress: () => {
                            store.addStudentsToProctor(currentFacultyId, selectedToAdd);
                            setIsAddModalOpen(false);
                            setSelectedToAdd([]);
                            Alert.alert('Success', `Added students to your proctor group.`);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.modalApplyBtnText}>
                    Add {selectedToAdd.length > 0 ? `(${selectedToAdd.length}) ` : ''}Students
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            7. PROCTOR BOTTOM NAVIGATION (Home · Students · Goals · Leaderboard · Profile)
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          variant="proctor"
          activeTab="students"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              /* already on students */
            } else if (tab === 'goals') {
              onNavigate('proctorGoalsOverview');
            } else if (tab === 'leaderboard') {
              onNavigate('proctorLeaderboard');
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
  backButton: {
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

  /* Blue -> Indigo Premium Hero Card */
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
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLabelRow: {
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
  heroLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.6,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroActionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 2,
  },
  heroBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeftCol: {
    flex: 1,
    marginRight: 10,
  },
  heroNumberGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  heroBigNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginRight: 6,
  },
  heroBigNumberLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroCohortText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  heroBreakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroBreakdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  heroBreakdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Donut Gauge */
  heroGaugeCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutWrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  donutLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FDE047',
    letterSpacing: 0.3,
  },
  donutFractionText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },

  /* Section Title */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  addStudentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addStudentsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Search + Filter */
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
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

  /* Status Segment Chips */
  statusChipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* List */
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 130, // Critical: Prevents bottom navigation overlap
  },

  /* Student Card (Compact & SaaS Styled) */
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  studentCardAttention: {
    borderColor: '#FED7AA',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  studentInfoCol: {
    flex: 1,
  },
  nameStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  studentMetaText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  attentionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  attentionTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },

  /* Attention Reason Box */
  attentionReasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  attentionReasonText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '500',
    flex: 1,
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 3,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  metricItemDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  viewLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  filterModalCard: {
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

  /* Card Actions */
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  removeStudentBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Add Students Modal */
  addModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 40,
    marginTop: 8,
    marginBottom: 6,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  addScopeInfoRow: {
    marginBottom: 8,
  },
  addScopeInfoText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  eligibleStudentList: {
    maxHeight: 280,
  },
  addStudentItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 12,
  },
  addStudentItemCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  addStudentItemCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  addCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCheckboxSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  addCheckboxDisabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  addStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  addStudentRoll: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  alreadyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  alreadyBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  otherProctorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  otherProctorBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  addModalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
