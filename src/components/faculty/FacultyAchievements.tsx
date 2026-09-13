// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty My Achievements Screen
// Personal professional achievements of the logged-in Faculty member.
// Adheres strictly to the AchieveX SaaS design system:
// Header -> Blue/Indigo Hero Card -> Controls -> Achievement Cards -> Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { CertificateUploadRecord } from '../../data/facultyPortalMockData';
import { DEFAULT_FACULTY_USER } from '../../data/facultyWorkspaceData';
import FacultyBottomTab from './FacultyBottomTab';

interface FacultyAchievementsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  achievementsList?: CertificateUploadRecord[];
}

type StatusFilter = 'All' | 'Verified' | 'Pending' | 'Draft' | 'Correction Required';

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Verified', value: 'Verified' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Corrections', value: 'Correction Required' },
];

const ALL_FACULTY_CATEGORIES = [
  'All Categories',
  'Research, Publication & Intellectual Property',
  'Certifications & Online Learning',
  'Faculty Development Program (FDP)',
  'Awards, Honors & Recognition',
  'Technical & Professional / Innovation',
  'Leadership & Student Responsibility',
  'Consultancy & Industry Projects',
];

const ALL_SEMESTERS = [
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

export default function FacultyAchievements({
  onOpenMenu,
  onNavigate,
  achievementsList = [],
}: FacultyAchievementsProps) {
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');

  // Modals
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<CertificateUploadRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Hero Statistics Calculation
  const { verifiedCount, totalPoints, pendingCount, correctionCount } = useMemo(() => {
    const verified = achievementsList.filter(
      (a) => a.status === 'Verified' || a.status === 'Approved'
    );
    const vCount = verified.length;
    const points = verified.reduce((sum, a) => sum + (a.points || 0), 0);
    const pCount = achievementsList.filter((a) => a.status === 'Pending').length;
    const cCount = achievementsList.filter(
      (a) =>
        a.status === 'Correction Required' ||
        a.status === 'Resubmission Required' ||
        a.status === 'Rejected'
    ).length;

    return {
      verifiedCount: vCount,
      totalPoints: points,
      pendingCount: pCount,
      correctionCount: cCount,
    };
  }, [achievementsList]);

  // Active filters count (excluding search & status)
  const activeFiltersCount =
    (categoryFilter !== 'All Categories' ? 1 : 0) +
    (semesterFilter !== 'All Semesters' ? 1 : 0);

  // Filtered List Computation
  const filteredAchievements = useMemo(() => {
    return achievementsList.filter((item) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesOrganizer = item.organizer ? item.organizer.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesCategory && !matchesOrganizer) return false;
      }

      // Status Filter
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Verified' && item.status !== 'Verified' && item.status !== 'Approved') {
          return false;
        }
        if (selectedStatus === 'Pending' && item.status !== 'Pending') {
          return false;
        }
        if (selectedStatus === 'Draft' && item.status !== 'Draft') {
          return false;
        }
        if (
          selectedStatus === 'Correction Required' &&
          item.status !== 'Correction Required' &&
          item.status !== 'Resubmission Required' &&
          item.status !== 'Rejected'
        ) {
          return false;
        }
      }

      // Category Filter
      if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [achievementsList, searchQuery, selectedStatus, categoryFilter, semesterFilter]);

  const handleResetFilters = () => {
    setCategoryFilter('All Categories');
    setSemesterFilter('All Semesters');
    setFilterSheetVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  // PDF Export Functionality using expo-print
  const handleExportPDF = async (exportAll: boolean) => {
    try {
      setIsExporting(true);
      const itemsToExport = exportAll ? achievementsList : filteredAchievements;

      if (itemsToExport.length === 0) {
        Alert.alert('No Achievements', 'There are no achievements to export in the selected range.');
        setIsExporting(false);
        return;
      }

      const rowsHtml = itemsToExport
        .map(
          (item, idx) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">${idx + 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">
              <strong>${item.title}</strong><br/>
              <span style="font-size: 11px; color: #64748B;">${item.organizer || 'Institution'} • ${item.level || 'National'}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px;">${item.category}</td>
            <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; text-align: center;">${item.eventDate || '2026'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background-color: ${
                item.status === 'Verified' ? '#DCFCE7' : item.status === 'Pending' ? '#FEF3C7' : '#FEE2E2'
              }; color: ${
                item.status === 'Verified' ? '#16A34A' : item.status === 'Pending' ? '#D97706' : '#DC2626'
              };">
                ${item.status}
              </span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-weight: bold; text-align: center; color: #2563EB;">
              ${item.points || 0} pts
            </td>
          </tr>
        `
        )
        .join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>AchieveX — Faculty Achievements Portfolio</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; padding: 30px; margin: 0; }
              .header { border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; }
              .brand { font-size: 24px; font-weight: 800; color: #2563EB; }
              .subtitle { font-size: 14px; color: #64748B; margin-top: 4px; }
              .faculty-info { background: #F8FAFC; border-radius: 8px; padding: 14px; margin-bottom: 24px; display: flex; justify-content: space-between; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
              th { background: #F1F5F9; padding: 10px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #CBD5E1; }
              .footer { margin-top: 30px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="brand">AchieveX</div>
              <div class="subtitle">Official Faculty Professional Achievements Portfolio</div>
            </div>

            <div class="faculty-info">
              <div>
                <strong>${DEFAULT_FACULTY_USER.name}</strong> (${DEFAULT_FACULTY_USER.id})<br/>
                <span>${DEFAULT_FACULTY_USER.designation} • ${DEFAULT_FACULTY_USER.department.name}</span><br/>
                <span style="font-size: 12px; color: #64748B;">${DEFAULT_FACULTY_USER.institution}</span>
              </div>
              <div style="text-align: right;">
                <strong>${verifiedCount} Verified Achievements</strong><br/>
                <span style="color: #2563EB; font-weight: bold; font-size: 16px;">${totalPoints} Points Earned</span><br/>
                <span style="font-size: 11px; color: #64748B;">Generated on ${new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 5%; text-align: center;">#</th>
                  <th style="width: 35%;">Achievement Title & Organizer</th>
                  <th style="width: 25%;">Category</th>
                  <th style="width: 12%; text-align: center;">Date</th>
                  <th style="width: 13%; text-align: center;">Status</th>
                  <th style="width: 10%; text-align: center;">Points</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <div class="footer">
              This document is an official digital record generated from AchieveX Institutional Platform.
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      setExportModalVisible(false);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Faculty Achievements Portfolio',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Exported', `Saved to: ${uri}`);
      }
    } catch (err) {
      Alert.alert('Export Error', 'Unable to generate PDF portfolio. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderAchievementItem = ({ item }: { item: CertificateUploadRecord }) => {
    const isVerified = item.status === 'Verified' || item.status === 'Approved';
    const isPending = item.status === 'Pending';
    const isDraft = item.status === 'Draft';
    const isCorrection =
      item.status === 'Correction Required' ||
      item.status === 'Resubmission Required' ||
      item.status === 'Rejected';

    return (
      <TouchableOpacity
        style={[styles.achievementCard, isCorrection && styles.achievementCardCorrection]}
        activeOpacity={0.7}
        onPress={() => setSelectedAchievement(item)}
      >
        {/* Category Pill Tag */}
        <View style={styles.categoryBadgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {item.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Achievement Title */}
        <Text style={styles.achievementTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Organizer & Level */}
        <View style={styles.organizerRow}>
          <Ionicons name="business-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
          <Text style={styles.organizerText} numberOfLines={1}>
            {item.organizer || 'Institution Event'} {item.level ? `• ${item.level}` : ''}
          </Text>
        </View>

        {/* Date & Semester Metadata */}
        <Text style={styles.dateMetaText}>
          {item.eventDate || 'Academic Year 2026–27'}
        </Text>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Bottom Row: Status Tag & Points */}
        <View style={styles.cardBottomRow}>
          <View
            style={[
              styles.statusPill,
              isVerified && styles.statusPillVerified,
              isPending && styles.statusPillPending,
              isDraft && styles.statusPillDraft,
              isCorrection && styles.statusPillCorrection,
            ]}
          >
            {isVerified && (
              <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 4 }} />
            )}
            {isPending && (
              <Ionicons name="time" size={12} color="#D97706" style={{ marginRight: 4 }} />
            )}
            {isDraft && (
              <Ionicons name="document-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
            )}
            {isCorrection && (
              <Ionicons name="alert-circle" size={12} color="#DC2626" style={{ marginRight: 4 }} />
            )}
            <Text
              style={[
                styles.statusPillText,
                isVerified && styles.statusPillTextVerified,
                isPending && styles.statusPillTextPending,
                isDraft && styles.statusPillTextDraft,
                isCorrection && styles.statusPillTextCorrection,
              ]}
            >
              {isVerified ? 'Verified' : isPending ? 'Pending' : isDraft ? 'Draft' : 'Correction Required'}
            </Text>
          </View>

          <View style={styles.pointsActionCol}>
            {isVerified ? (
              <Text style={styles.verifiedPointsText}>+{item.points || 0} pts</Text>
            ) : isPending && item.points ? (
              <Text style={styles.pendingPointsText}>Est. +{item.points} pts</Text>
            ) : isCorrection ? (
              <Text style={styles.correctionActionText}>Update Proof →</Text>
            ) : isDraft ? (
              <Text style={styles.draftActionText}>Continue →</Text>
            ) : null}
            <Ionicons name="chevron-forward" size={15} color="#94A3B8" style={{ marginLeft: 6 }} />
          </View>
        </View>
      </TouchableOpacity>
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
          {/* Decorative Background Shape */}
          <View style={styles.decorativeCircle} />

          {/* Header Row */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroHeaderLeft}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="trophy" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroHeaderTitle}>ACHIEVEMENT OVERVIEW</Text>
            </View>
            <Text style={styles.heroHeaderSubtitle}>Verified Progress</Text>
          </View>

          {/* Main Metrics Row */}
          <View style={styles.heroMainMetricsRow}>
            <View style={styles.heroPrimaryMetricCol}>
              <Text style={styles.heroPrimaryNumber}>{verifiedCount}</Text>
              <Text style={styles.heroPrimaryLabel}>Verified Achievements</Text>
            </View>

            <View style={styles.heroPointsPill}>
              <Ionicons name="trophy" size={16} color="#FDE047" style={{ marginRight: 6 }} />
              <Text style={styles.heroPointsText}>{totalPoints} Pts</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.heroDivider} />

          {/* Bottom Status Chips */}
          <View style={styles.heroStatusChipsRow}>
            <View style={styles.heroStatusChip}>
              <Ionicons name="time" size={12} color="#FDE68A" style={{ marginRight: 4 }} />
              <Text style={styles.heroStatusChipText}>{pendingCount} Pending</Text>
            </View>

            {correctionCount > 0 ? (
              <View style={[styles.heroStatusChip, styles.heroCorrectionChip]}>
                <Ionicons name="alert-circle" size={12} color="#FECACA" style={{ marginRight: 4 }} />
                <Text style={[styles.heroStatusChipText, styles.heroCorrectionText]}>
                  {correctionCount} Correction{correctionCount > 1 ? 's' : ''}
                </Text>
              </View>
            ) : (
              <View style={styles.heroStatusChip}>
                <Ionicons name="checkmark-circle" size={12} color="#A7F3D0" style={{ marginRight: 4 }} />
                <Text style={styles.heroStatusChipText}>All Clean</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          3. SECTION TITLE + SEARCH + FILTER
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        <Text style={styles.sectionCountText}>{achievementsList.length} total</Text>
      </View>

      <View style={styles.searchFilterRow}>
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
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          activeOpacity={0.8}
          onPress={() => setFilterSheetVisible(true)}
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
          4. STATUS SEGMENT TABS
      ════════════════════════════════════════════════ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusTabsScroll}
      >
        {STATUS_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.statusTabChip, isSelected && styles.statusTabChipActive]}
              activeOpacity={0.8}
              onPress={() => setSelectedStatus(tab.value)}
            >
              <Text style={[styles.statusTabChipText, isSelected && styles.statusTabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
            <Text style={styles.headerTitle}>My Achievements</Text>
            <Text style={styles.headerSubtitle}>Your professional achievements</Text>
          </View>

          <TouchableOpacity
            style={styles.exportHeaderBtn}
            activeOpacity={0.8}
            onPress={() => setExportModalVisible(true)}
          >
            <Ionicons name="download-outline" size={16} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.exportHeaderBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            5. FLATLIST
        ════════════════════════════════════════════════ */}
        <FlatList
          data={filteredAchievements}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderAchievementItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="trophy-outline" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>
                {searchQuery || activeFiltersCount > 0 || selectedStatus !== 'All'
                  ? 'No matching achievements'
                  : 'No achievements yet'}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery || activeFiltersCount > 0 || selectedStatus !== 'All'
                  ? 'Try adjusting your search query or filter criteria.'
                  : 'Your submitted professional achievements and publications will appear here.'}
              </Text>
              {searchQuery || activeFiltersCount > 0 || selectedStatus !== 'All' ? (
                <TouchableOpacity
                  style={styles.clearFiltersBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedStatus('All');
                    handleResetFilters();
                  }}
                >
                  <Text style={styles.clearFiltersBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.addAchievementBtn}
                  onPress={() => onNavigate('facultyAddAchievement')}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.addAchievementBtnText}>Add Achievement</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* ════════════════════════════════════════════════
            6. ACHIEVEMENT DETAILS MODAL (READ-ONLY / INSPECT)
        ════════════════════════════════════════════════ */}
        {selectedAchievement && (
          <Modal
            visible={!!selectedAchievement}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setSelectedAchievement(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.detailModalCard}>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle} numberOfLines={1}>
                      Achievement Details
                    </Text>
                    <Text style={styles.modalSubtitle}>{selectedAchievement.category}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedAchievement(null)}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                  <Text style={styles.modalAchievementTitle}>{selectedAchievement.title}</Text>

                  {/* Key Information Rows */}
                  <View style={styles.detailInfoBox}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Organizer / Body</Text>
                      <Text style={styles.detailValue}>
                        {selectedAchievement.organizer || 'Institution Event'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Recognition Level</Text>
                      <Text style={styles.detailValue}>
                        {selectedAchievement.level || 'National'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Event / Date</Text>
                      <Text style={styles.detailValue}>
                        {selectedAchievement.eventDate || 'Academic Year 2026–27'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          {
                            color:
                              selectedAchievement.status === 'Verified'
                                ? '#16A34A'
                                : selectedAchievement.status === 'Pending'
                                ? '#D97706'
                                : '#DC2626',
                          },
                        ]}
                      >
                        {selectedAchievement.status}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Verified Points</Text>
                      <Text style={[styles.detailValue, { color: '#2563EB', fontWeight: '700' }]}>
                        {selectedAchievement.points || 0} pts
                      </Text>
                    </View>
                  </View>

                  {/* Proof Attachment */}
                  {selectedAchievement.proofFileName && (
                    <View style={styles.proofDocumentBox}>
                      <Ionicons name="document-text" size={24} color="#2563EB" style={{ marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.proofDocLabel}>Attached Verification Document</Text>
                        <Text style={styles.proofDocName} numberOfLines={1}>
                          {selectedAchievement.proofFileName}
                        </Text>
                      </View>
                      <View style={styles.proofVerifiedTag}>
                        <Ionicons name="shield-checkmark" size={12} color="#16A34A" />
                      </View>
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => setSelectedAchievement(null)}
                >
                  <Text style={styles.modalPrimaryBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* ════════════════════════════════════════════════
            7. FILTER BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterSheetVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setFilterSheetVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterSheetCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Filter Achievements</Text>
                  <Text style={styles.modalSubtitle}>Filter by professional category and semester</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setFilterSheetVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Category Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>CATEGORY</Text>
                <ScrollView style={{ maxHeight: 180 }} showsVerticalScrollIndicator={false}>
                  <View style={styles.filterChipsGrid}>
                    {ALL_FACULTY_CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.filterModalChip,
                          categoryFilter === cat && styles.filterModalChipActive,
                        ]}
                        onPress={() => setCategoryFilter(cat)}
                      >
                        <Text
                          style={[
                            styles.filterModalChipText,
                            categoryFilter === cat && styles.filterModalChipTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Semester Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SEMESTER</Text>
                <View style={styles.filterChipsGrid}>
                  {ALL_SEMESTERS.slice(0, 5).map((sem) => (
                    <TouchableOpacity
                      key={sem}
                      style={[
                        styles.filterModalChip,
                        semesterFilter === sem && styles.filterModalChipActive,
                      ]}
                      onPress={() => setSemesterFilter(sem)}
                    >
                      <Text
                        style={[
                          styles.filterModalChipText,
                          semesterFilter === sem && styles.filterModalChipTextActive,
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
                  onPress={() => setFilterSheetVisible(false)}
                >
                  <Text style={styles.modalApplyBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. EXPORT BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={exportModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setExportModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterSheetCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Export Portfolio</Text>
                  <Text style={styles.modalSubtitle}>Generate official PDF achievements portfolio</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setExportModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Export Scope Options */}
              <TouchableOpacity
                style={styles.exportOptionCard}
                activeOpacity={0.8}
                onPress={() => handleExportPDF(false)}
              >
                <View style={styles.exportOptionIconBox}>
                  <Ionicons name="filter" size={20} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exportOptionTitle}>Current Filtered Results</Text>
                  <Text style={styles.exportOptionSub}>
                    Export {filteredAchievements.length} achievements based on your active filters
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportOptionCard}
                activeOpacity={0.8}
                onPress={() => handleExportPDF(true)}
              >
                <View style={[styles.exportOptionIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="document-text" size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exportOptionTitle}>All Achievements Portfolio</Text>
                  <Text style={styles.exportOptionSub}>
                    Complete verified and submitted records ({achievementsList.length} items)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            9. FACULTY BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <FacultyBottomTab activeTab="achievements" onNavigate={onNavigate} />
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

  /* Header Bar */
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
  exportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  exportHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
  heroStatusChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  heroStatusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroCorrectionChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  heroCorrectionText: {
    color: '#FECACA',
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
  sectionCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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

  /* Status Tabs */
  statusTabsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  statusTabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusTabChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  statusTabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statusTabChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* List */
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 130, // Critical: Prevents bottom navigation overlap
  },

  /* Achievement Card */
  achievementCard: {
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
  achievementCardCorrection: {
    borderColor: '#FECACA',
  },
  categoryBadgeRow: {
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.3,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 4,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  organizerText: {
    fontSize: 12,
    color: '#64748B',
  },
  dateMetaText: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillVerified: {
    backgroundColor: '#DCFCE7',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillDraft: {
    backgroundColor: '#F1F5F9',
  },
  statusPillCorrection: {
    backgroundColor: '#FEE2E2',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextVerified: {
    color: '#16A34A',
  },
  statusPillTextPending: {
    color: '#D97706',
  },
  statusPillTextDraft: {
    color: '#64748B',
  },
  statusPillTextCorrection: {
    color: '#DC2626',
  },
  pointsActionCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedPointsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
  },
  pendingPointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  correctionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  draftActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
  addAchievementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  addAchievementBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  detailModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
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
  modalAchievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 12,
  },
  detailInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  proofDocumentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 16,
  },
  proofDocLabel: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
  },
  proofDocName: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
    marginTop: 1,
  },
  proofVerifiedTag: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Filter Modal Content */
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

  /* Export Option Cards */
  exportOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  exportOptionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exportOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  exportOptionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCancelBtn: {
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
