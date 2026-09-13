// ─────────────────────────────────────────────────────────────
// AchieveX — Student My Achievements Screen (Premium Redesign)
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { LOGGED_IN_STUDENT } from '../data/achievementConfig';
import { MOCK_ACHIEVEMENTS, type Achievement } from '../data/achievementsData';
import { FACULTY_PROFILES, MOCK_FACULTY_ACHIEVEMENTS } from '../data/facultyMockData';

import AchievementOverviewHero from './myAchievements/AchievementOverviewHero';
import AchievementCard from './myAchievements/AchievementCard';
import AchievementDetailModal from './myAchievements/AchievementDetailModal';
import AchievementExportModal from './myAchievements/AchievementExportModal';
import AchievementFilterSheet from './achievement/AchievementFilterSheet';
import StudentBottomTab from './StudentBottomTab';
import { useBottomNavInset } from '../hooks/useBottomNavInset';
import {
  MOCK_TEAM_ACHIEVEMENTS,
  getTeamAchievementsForStudent,
  getCertificateProgress,
  subscribeTeamAchievements,
  type TeamAchievement,
} from '../data/teamAchievementData';

interface MyAchievementsScreenProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  userRole?: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
  currentStudentId?: string;
}

type StatusFilter = 'All' | 'Verified' | 'Pending' | 'Draft' | 'Correction Required';

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Verified', value: 'Verified' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Corrections', value: 'Correction Required' },
];

export default function MyAchievementsScreen({
  onGoBack,
  onOpenMenu,
  onNavigate,
  onOpenProfile,
  onOpenLeaderboard,
  userRole,
  currentStudentId,
}: MyAchievementsScreenProps) {
  const { contentBottomPadding } = useBottomNavInset();
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t) => t + 1));
  }, []);

  const activeStudentId = (currentStudentId || LOGGED_IN_STUDENT.rollNumber).toLowerCase();
  // ── Search & Filter State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');

  // ── Modals State ──
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedDetailAchievement, setSelectedDetailAchievement] = useState<Achievement | null>(null);

  // ── Pull to refresh State ──
  const [refreshing, setRefreshing] = useState(false);

  // ── Export Generation State ──
  const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [generatedPdfUri, setGeneratedPdfUri] = useState<string | null>(null);

  // Source achievements dataset
  const isStudent = !userRole || userRole === 'Student';
  const achievementsSource = isStudent ? MOCK_ACHIEVEMENTS : (MOCK_FACULTY_ACHIEVEMENTS as any[]);

  // ── Hero Statistics Calculation ──
  const { verifiedAchievements, verifiedCount, totalPoints, pendingCount, correctionCount } =
    useMemo(() => {
      const verified = achievementsSource.filter((a) => a.status === 'Verified');
      const vCount = verified.length;
      const points = verified.reduce((sum, a) => sum + (a.points || 0), 0);
      const pCount = achievementsSource.filter((a) => a.status === 'Pending').length;
      const cCount = achievementsSource.filter(
        (a) => a.status === 'Correction Required' || a.status === 'Rejected'
      ).length;

      return {
        verifiedAchievements: verified,
        verifiedCount: vCount,
        totalPoints: points,
        pendingCount: pCount,
        correctionCount: cCount,
      };
    }, [achievementsSource]);

  // Active filter count (excluding status and search)
  const activeFiltersCount =
    (categoryFilter !== 'All Categories' ? 1 : 0) +
    (semesterFilter !== 'All Semesters' ? 1 : 0);

  // ── Filtered List Computation ──
  const filteredAchievements = useMemo(() => {
    return achievementsSource.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.organization && item.organization.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'All' || item.status === selectedStatus;

      const matchesCategory =
        categoryFilter === 'All Categories' || item.category === categoryFilter;

      const matchesSemester =
        semesterFilter === 'All Semesters' ||
        (item.semester && `Semester ${item.semester}` === semesterFilter);

      return matchesSearch && matchesStatus && matchesCategory && matchesSemester;
    });
  }, [achievementsSource, searchQuery, selectedStatus, categoryFilter, semesterFilter]);

  // Pull to refresh simulation
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const handleResetFilters = () => {
    setCategoryFilter('All Categories');
    setSemesterFilter('All Semesters');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  const handleCardAction = (item: Achievement) => {
    if (item.status === 'Draft' || item.status === 'Correction Required') {
      onNavigate('SubmitAchievement');
    } else {
      setSelectedDetailAchievement(item);
    }
  };

  // ── Export PDF Generation ──
  const getPdfHtml = (itemsToExport: Achievement[]) => {
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const recordId = `AX-REC-${Math.floor(100000 + Math.random() * 900000)}`;

    const profileName = isStudent
      ? LOGGED_IN_STUDENT.name
      : (FACULTY_PROFILES as any)[userRole || 'Faculty']?.name || 'Faculty Member';
    const profileIdLabel = isStudent ? 'Roll No' : 'Staff ID';
    const profileIdValue = isStudent
      ? LOGGED_IN_STUDENT.rollNumber
      : (FACULTY_PROFILES as any)[userRole || 'Faculty']?.staffId || 'NEC-STAFF';
    const profileDept = isStudent
      ? LOGGED_IN_STUDENT.department
      : (FACULTY_PROFILES as any)[userRole || 'Faculty']?.dept || 'Engineering';
    const profileExtraLabel = isStudent ? 'Academic Year' : 'Designation';
    const profileExtraValue = isStudent
      ? LOGGED_IN_STUDENT.year
      : (FACULTY_PROFILES as any)[userRole || 'Faculty']?.designation || 'Staff';

    const tableRowsHtml = itemsToExport
      .map(
        (a, i) => `
        <tr style="background-color: ${i % 2 === 0 ? '#FFFFFF' : '#F9FAFB'};">
          <td style="padding: 9px 8px; border: 1px solid #E5E7EB; font-size: 11px;">${a.category}</td>
          <td style="padding: 9px 8px; border: 1px solid #E5E7EB; font-size: 11px; font-weight: 600;">${a.title}</td>
          <td style="padding: 9px 8px; border: 1px solid #E5E7EB; font-size: 11px;">${a.organization || 'N/A'}</td>
          <td style="padding: 9px 8px; border: 1px solid #E5E7EB; font-size: 11px; white-space: nowrap;">${a.date}</td>
          <td style="padding: 9px 8px; border: 1px solid #E5E7EB; font-size: 11px; font-weight: 700; color: #2563EB;">+${a.points} Pts</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AchieveX - Verified Achievement Record</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 24px; }
          .container { max-width: 800px; margin: 0 auto; }
          .header-section { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563EB; padding-bottom: 12px; margin-bottom: 16px; }
          .brand-title { font-size: 24px; font-weight: 800; color: #2563EB; margin: 0; }
          .doc-subtitle { font-size: 13px; font-weight: 700; color: #4B5563; margin-top: 2px; }
          .meta-info { font-size: 10.5px; color: #6B7280; text-align: right; line-height: 15px; }
          .student-info-box { background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; margin-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 11.5px; }
          .info-label { color: #6B7280; font-weight: 500; }
          .info-value { color: #111827; font-weight: 700; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #2563EB; letter-spacing: 0.5px; margin-top: 16px; margin-bottom: 10px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }
          .achievement-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .achievement-table th { background-color: #2563EB; color: #FFFFFF; font-weight: 700; font-size: 10.5px; text-transform: uppercase; padding: 8px; text-align: left; border: 1px solid #2563EB; }
          .footer { font-size: 9.5px; color: #9CA3AF; text-align: center; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 8px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-section">
            <div>
              <h1 class="brand-title">AchieveX</h1>
              <div class="doc-subtitle">Verified Achievement Record</div>
            </div>
            <div class="meta-info">
              <div>Record ID: <strong>${recordId}</strong></div>
              <div>Generated: <strong>${today}</strong></div>
            </div>
          </div>
          
          <div class="student-info-box">
            <div class="info-grid">
              <div><span class="info-label">Name:</span> <span class="info-value">${profileName}</span></div>
              <div><span class="info-label">${profileIdLabel}:</span> <span class="info-value" style="font-family: monospace;">${profileIdValue}</span></div>
              <div><span class="info-label">Department:</span> <span class="info-value">${profileDept}</span></div>
              <div><span class="info-label">${profileExtraLabel}:</span> <span class="info-value">${profileExtraValue}</span></div>
              <div style="grid-column: span 2;"><span class="info-label">College:</span> <span class="info-value">Nandha Engineering College</span></div>
            </div>
          </div>
          
          <div class="section-title">Verified Achievements (${itemsToExport.length} Records)</div>
          
          <table class="achievement-table">
            <thead>
              <tr>
                <th style="width: 25%;">Category</th>
                <th style="width: 25%;">Achievement Title</th>
                <th style="width: 25%;">Organization</th>
                <th style="width: 13%;">Date</th>
                <th style="width: 12%;">Points</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          
          <div class="footer">
            AchieveX Platform &bull; Institutional Achievement Record &bull; Nandha Educational Institutions
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleGeneratePdf = async (scope: 'all' | 'filtered') => {
    const listToExport = scope === 'all' ? verifiedAchievements : filteredAchievements;

    if (listToExport.length === 0) {
      Alert.alert(
        'No Achievements to Export',
        scope === 'all'
          ? 'You need at least one verified achievement to generate your record.'
          : 'No achievements match your current filter selection.'
      );
      return;
    }

    setGenerationState('generating');

    try {
      const htmlContent = getPdfHtml(listToExport);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      setGeneratedPdfUri(uri);
      setGenerationState('success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setGenerationState('error');
    }
  };

  const handleSharePdf = async () => {
    if (!generatedPdfUri) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(generatedPdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share Achievement Record',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Sharing Unavailable', 'Native sharing is not supported on this device.');
      }
    } catch (error) {
      console.error('Sharing Error:', error);
      Alert.alert('Error', 'Unable to complete PDF download.');
    }
  };

  // ── FlatList Header Component ──
  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {/* 1. Overview Hero Card */}
      <AchievementOverviewHero
        verifiedCount={verifiedCount}
        totalPoints={totalPoints}
        pendingCount={pendingCount}
        correctionCount={correctionCount}
      />

      {/* 2. Section Title Row */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        <Text style={styles.totalCountBadge}>{achievementsSource.length} total</Text>
      </View>

      {/* 3. Search & Filter Toolbar */}
      <View style={styles.toolbarRow}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search achievements..."
            placeholderTextColor="#94A3B8"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterTriggerBtn, activeFiltersCount > 0 && styles.filterTriggerBtnActive]}
          activeOpacity={0.75}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Ionicons
            name="funnel-outline"
            size={14}
            color={activeFiltersCount > 0 ? '#2563EB' : '#475569'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.filterTriggerText, activeFiltersCount > 0 && styles.filterTriggerTextActive]}>
            Filter{activeFiltersCount > 0 ? ` • ${activeFiltersCount}` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Compact Status Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusTabsScroll}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <TouchableOpacity
              key={tab.label}
              style={[styles.statusTabPill, isActive && styles.statusTabPillActive]}
              activeOpacity={0.75}
              onPress={() => setSelectedStatus(tab.value)}
            >
              <Text
                style={[
                  styles.statusTabPillText,
                  isActive && styles.statusTabPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 5. Active Filter Summary Chips */}
      {activeFiltersCount > 0 && (
        <View style={styles.activeChipsContainer}>
          {categoryFilter !== 'All Categories' && (
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText} numberOfLines={1}>
                {categoryFilter}
              </Text>
              <TouchableOpacity onPress={() => setCategoryFilter('All Categories')}>
                <Ionicons name="close-circle" size={14} color="#2563EB" />
              </TouchableOpacity>
            </View>
          )}

          {semesterFilter !== 'All Semesters' && (
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText}>{semesterFilter}</Text>
              <TouchableOpacity onPress={() => setSemesterFilter('All Semesters')}>
                <Ionicons name="close-circle" size={14} color="#2563EB" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.clearAllBtn}
            activeOpacity={0.7}
            onPress={() => {
              setCategoryFilter('All Categories');
              setSemesterFilter('All Semesters');
            }}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // ── FlatList Empty Component ──
  const renderListEmpty = () => {
    const isFiltered = activeFiltersCount > 0 || selectedStatus !== 'All' || searchQuery !== '';

    if (isFiltered) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="filter-outline" size={28} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No matching achievements</Text>
          <Text style={styles.emptySubtitle}>
            Try changing your category, semester, or status filters.
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            activeOpacity={0.8}
            onPress={handleResetFilters}
          >
            <Ionicons name="refresh-outline" size={15} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="trophy-outline" size={28} color="#94A3B8" />
        </View>
        <Text style={styles.emptyTitle}>No achievements yet</Text>
        <Text style={styles.emptySubtitle}>
          Your submitted achievements will appear here.
        </Text>
        <TouchableOpacity
          style={styles.addAchievementBtn}
          activeOpacity={0.85}
          onPress={() => onNavigate('SubmitAchievement')}
        >
          <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addAchievementBtnText}>+ Add Achievement</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />

      {/* ── Top Navigation Header ── */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.menuIconContainer}
          activeOpacity={0.7}
          onPress={onOpenMenu}
        >
          <Ionicons name="menu-outline" size={22} color="#0D4733" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Achievements</Text>

        <TouchableOpacity
          style={styles.exportHeaderBtn}
          activeOpacity={0.75}
          onPress={() => {
            setGenerationState('idle');
            setExportModalVisible(true);
          }}
        >
          <Ionicons name="download-outline" size={14} color="#2563EB" style={{ marginRight: 4 }} />
          <Text style={styles.exportHeaderBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* ── Main High-Performance FlatList ── */}
      <FlatList
        data={filteredAchievements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AchievementCard
            achievement={item}
            onPress={() => setSelectedDetailAchievement(item)}
            onActionPress={() => handleCardAction(item)}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={
          <View>
            {/* ── Team Achievements Section ── */}
            {(() => {
              const myTeams = getTeamAchievementsForStudent(activeStudentId);
              if (myTeams.length === 0) return null;

              return (
                <View style={styles.teamSectionWrapper}>
                  <View style={styles.teamSectionHeaderRow}>
                    <View style={styles.teamSectionIconBox}>
                      <Ionicons name="people" size={14} color="#4F46E5" />
                    </View>
                    <Text style={styles.teamSectionTitle}>Team Achievements</Text>
                    <Text style={styles.teamSectionCount}>{myTeams.length}</Text>
                  </View>

                  {myTeams.map((team: TeamAchievement) => {
                    const progress = getCertificateProgress(team.id);
                    const isLeader = team.teamLeaderId.toLowerCase() === activeStudentId;
                    const memberRec = team.members.find(
                      (m) =>
                        m.studentId.toLowerCase() === activeStudentId ||
                        m.rollNumber.toLowerCase() === activeStudentId
                    );
                    const isMember = !isLeader && !!memberRec;
                    const certMissing = isMember
                      ? memberRec.certificateStatus === 'Not Uploaded' ||
                        memberRec.certificateStatus === 'Correction Required'
                      : progress.uploaded < progress.total;

                    const isUploaded =
                      isMember &&
                      (memberRec?.certificateStatus === 'Uploaded' ||
                        memberRec?.certificateStatus === 'Verified');

                    return (
                      <View key={team.id} style={styles.teamCard}>
                        {/* Team card header */}
                        <View style={styles.teamCardHeader}>
                          <View style={styles.teamCardIconCircle}>
                            <Ionicons name="people" size={18} color="#4F46E5" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.teamCardTeamName}>{team.teamName}</Text>
                            <Text style={styles.teamCardEventName} numberOfLines={1}>
                              {team.eventName}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                              Team Achievement • {team.achievementType} • {team.semester}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.teamCardBadge,
                              isLeader ? styles.teamCardBadgeLeader : styles.teamCardBadgeMember,
                            ]}
                          >
                            <Text
                              style={[
                                styles.teamCardBadgeText,
                                { color: isLeader ? '#1D4ED8' : '#7C3AED' },
                              ]}
                            >
                              {isLeader ? 'TEAM LEADER' : 'TEAM MEMBER'}
                            </Text>
                          </View>
                        </View>

                        {/* Progress row */}
                        <View style={styles.teamCardProgressRow}>
                          <Text style={styles.teamCardProgressText}>
                            {isLeader
                              ? `${progress.uploaded} / ${progress.total} Certificates Uploaded`
                              : isUploaded
                              ? 'Certificate Uploaded • Pending Verification'
                              : 'Certificate Required'}
                          </Text>
                          {isMember && certMissing && (
                            <View style={styles.teamCardAmberChip}>
                              <Text style={styles.teamCardAmberChipText}>Certificate Required</Text>
                            </View>
                          )}
                          {isMember && isUploaded && (
                            <View
                              style={[
                                styles.teamCardAmberChip,
                                { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' },
                              ]}
                            >
                              <Text style={[styles.teamCardAmberChipText, { color: '#16A34A' }]}>
                                Uploaded
                              </Text>
                            </View>
                          )}
                          {isLeader && (
                            <View
                              style={[
                                styles.teamCardAmberChip,
                                { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' },
                              ]}
                            >
                              <Text style={[styles.teamCardAmberChipText, { color: '#2563EB' }]}>
                                Pending Verification
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Subtext for member after upload */}
                        {isMember && isUploaded && (
                          <Text
                            style={{
                              fontSize: 11,
                              color: '#64748B',
                              marginHorizontal: 12,
                              marginBottom: 8,
                            }}
                          >
                            Pending Verification • Your certificate is submitted
                          </Text>
                        )}

                        {/* CTA Button */}
                        <TouchableOpacity
                          style={[
                            styles.teamCardCta,
                            isLeader
                              ? styles.teamCardCtaLeader
                              : certMissing
                              ? styles.teamCardCtaMember
                              : [
                                  styles.teamCardCtaMember,
                                  { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
                                ],
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (isLeader) {
                              onNavigate('studentTeamAchievementDetails', {
                                teamAchievementId: team.id,
                              });
                            } else if (certMissing) {
                              onNavigate('teamMemberCertificate', {
                                teamAchievementId: team.id,
                                studentId: activeStudentId,
                              });
                            } else {
                              onNavigate('studentTeamAchievementDetails', {
                                teamAchievementId: team.id,
                              });
                            }
                          }}
                        >
                          <Ionicons
                            name={
                              isLeader
                                ? 'eye-outline'
                                : certMissing
                                ? 'document-text-outline'
                                : 'eye-outline'
                            }
                            size={14}
                            color={isLeader ? '#2563EB' : certMissing ? '#D97706' : '#16A34A'}
                            style={{ marginRight: 6 }}
                          />
                          <Text
                            style={[
                              styles.teamCardCtaText,
                              {
                                color: isLeader
                                  ? '#2563EB'
                                  : certMissing
                                  ? '#D97706'
                                  : '#16A34A',
                              },
                            ]}
                          >
                            {isLeader
                              ? 'View Team →'
                              : certMissing
                              ? 'Upload Certificate →'
                              : 'View Details →'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              );
            })()}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.flatListContent, { paddingBottom: contentBottomPadding }]}
      />

      {/* ── Modals ── */}
      {/* 1. Filter Bottom Sheet */}
      <AchievementFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        selectedCategory={categoryFilter}
        onSelectCategory={setCategoryFilter}
        selectedSemester={semesterFilter}
        onSelectSemester={setSemesterFilter}
        onReset={() => {
          setCategoryFilter('All Categories');
          setSemesterFilter('All Semesters');
        }}
        onApply={() => setFilterSheetVisible(false)}
      />

      {/* 2. Achievement Detail Modal */}
      <AchievementDetailModal
        visible={!!selectedDetailAchievement}
        achievement={selectedDetailAchievement}
        onClose={() => setSelectedDetailAchievement(null)}
        onAction={() => {
          setSelectedDetailAchievement(null);
          onNavigate('SubmitAchievement');
        }}
      />

      {/* 3. Export PDF Modal */}
      <AchievementExportModal
        visible={exportModalVisible}
        onClose={() => {
          setExportModalVisible(false);
          setGenerationState('idle');
          setGeneratedPdfUri(null);
        }}
        onExport={handleGeneratePdf}
        totalCount={achievementsSource.length}
        filteredCount={filteredAchievements.length}
        generationState={generationState}
        onSharePdf={handleSharePdf}
      />

      {/* ── Unified Student Bottom Navigation Tab Bar ── */}
      <StudentBottomTab
        activeTab="achievements"
        onNavigate={(tab) => {
          if (tab === 'home') onGoBack();
          else if (tab === 'achievements') {
            /* already on achievements */
          } else if (tab === 'goals') onNavigate('goals');
          else if (tab === 'leaderboard') {
            if (onOpenLeaderboard) onOpenLeaderboard();
            else onNavigate('leaderboard');
          } else if (tab === 'profile') {
            if (onOpenProfile) onOpenProfile();
            else onNavigate('profile');
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAF8F5',
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#0D4733',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  exportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
  },
  exportHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  flatListContent: {
    paddingBottom: 24,
  },
  listHeaderContainer: {
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
  },
  filterTriggerBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  filterTriggerText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  filterTriggerTextActive: {
    color: '#2563EB',
  },
  statusTabsScroll: {
    paddingHorizontal: 16,
    gap: 6,
    paddingBottom: 4,
  },
  statusTabPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusTabPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  statusTabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statusTabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginTop: 8,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    maxWidth: '75%',
  },
  activeChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  clearAllBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  addAchievementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addAchievementBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  teamSectionWrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  teamSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  teamSectionIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  teamSectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  teamCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  teamCardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCardTeamName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  teamCardEventName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    marginTop: 1,
  },
  teamCardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamCardBadgeLeader: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  teamCardBadgeMember: {
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  teamCardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  teamCardProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  teamCardProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  teamCardAmberChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamCardAmberChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  teamCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  teamCardCtaLeader: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  teamCardCtaMember: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  teamCardCtaText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF8F5',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
    fontWeight: '500',
  },
});
