// ─────────────────────────────────────────────────────────────
// AchieveX — NAAC Achievement Report (Head Workspace)
// Final Redesign: Five-Year Institutional Student Achievement Summary
// Quantitative Accreditation Summary + Five-Year Trend + Categories
// + Level/Outcome Distribution + Supporting Records Access
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  computeNAACReportData,
  generateReportPDF,
  previewReportPDF,
  shareReportPDF,
  ORDERED_ACADEMIC_YEARS,
  STANDARD_ACCREDITATION_CATEGORIES,
  type NAACFilterState,
  type NAACPeriodPreset,
  type GeneratedReportItem,
} from '../../services/reportService';
import { INITIAL_COLLEGE_ACHIEVEMENTS } from '../../data/headWorkspaceData';
import { showAchieveXToast } from '../feedback/AchieveXFeedback';

interface HeadNAACReportProps {
  onGoBack: () => void;
  onNavigate?: (screen: string) => void;
  onViewRecords?: (records: any[], reportTitle?: string, contextText?: string) => void;
}

export default function HeadNAACReport({ onGoBack, onViewRecords }: HeadNAACReportProps) {
  const insets = useSafeAreaInsets();

  // Primary Controls: Period Preset + Scope
  const [filters, setFilters] = useState<NAACFilterState>({
    periodPreset: 'last5',
    fromAcademicYear: '2022–23',
    toAcademicYear: '2026–27',
    scope: 'all_categories',
    categoryId: 'ALL',
    categoryTitle: 'All Categories',
  });

  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<GeneratedReportItem | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // Compute live quantitative summary data
  const reportData = useMemo(() => {
    return computeNAACReportData(INITIAL_COLLEGE_ACHIEVEMENTS, filters);
  }, [filters]);

  const maxYearAchievements = Math.max(...reportData.yearBreakdowns.map((y) => y.achievementsCount), 1);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const { reportItem } = await generateReportPDF('NAAC', reportData);
      setGeneratedItem(reportItem);
      setReportModalVisible(true);
    } catch {
      showAchieveXToast({ type: 'error', message: 'Failed to compile official NAAC PDF.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!generatedItem?.fileUri) return;
    try {
      await previewReportPDF(generatedItem.fileUri);
    } catch {
      showAchieveXToast({ type: 'error', message: 'Unable to open PDF preview.' });
    }
  };

  const handleShare = async () => {
    if (!generatedItem?.fileUri) return;
    try {
      await shareReportPDF(generatedItem.fileUri, 'Share NAAC Supporting Report');
    } catch {
      showAchieveXToast({ type: 'error', message: 'Sharing failed or not available.' });
    }
  };

  const PERIOD_OPTIONS: { id: NAACPeriodPreset; label: string }[] = [
    { id: 'last5', label: 'Last 5 Academic Years (2022–23 — 2026–27)' },
    { id: 'last3', label: 'Last 3 Academic Years (2024–25 — 2026–27)' },
    { id: 'current', label: 'Current Academic Year (2026–27)' },
    { id: 'custom', label: 'Custom Academic Range...' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>NAAC Report</Text>
          <Text style={styles.headerSubtitle}>Five-year institutional student achievement summary.</Text>
        </View>
        <View style={styles.accreditationBadge}>
          <Text style={styles.accreditationBadgeText}>CRITERION 5.3</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. REPORTING CONTROLS (Period & Scope) ── */}
        <View style={styles.controlsCard}>
          {/* Period Selector */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Reporting Period</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => {
                setPeriodDropdownOpen(!periodDropdownOpen);
                setScopeDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {filters.periodPreset === 'last5'
                  ? 'Last 5 Academic Years (2022–23 — 2026–27)'
                  : filters.periodPreset === 'last3'
                  ? 'Last 3 Academic Years (2024–25 — 2026–27)'
                  : filters.periodPreset === 'current'
                  ? 'Current Academic Year (2026–27)'
                  : `Custom: ${filters.fromAcademicYear} to ${filters.toAcademicYear}`}
              </Text>
              <Ionicons
                name={periodDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748B"
              />
            </TouchableOpacity>

            {periodDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {PERIOD_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.dropdownItem, filters.periodPreset === opt.id && styles.dropdownItemActive]}
                    onPress={() => {
                      setFilters((p) => ({ ...p, periodPreset: opt.id }));
                      setPeriodDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        filters.periodPreset === opt.id && styles.dropdownItemTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {filters.periodPreset === opt.id && (
                      <Ionicons name="checkmark" size={16} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Custom Range Picker (if custom selected) */}
            {filters.periodPreset === 'custom' && (
              <View style={styles.customRangeBox}>
                <Text style={styles.customRangeLabel}>Select Academic Range:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {ORDERED_ACADEMIC_YEARS.map((y) => (
                    <TouchableOpacity
                      key={`from-${y}`}
                      style={[styles.yearChip, filters.fromAcademicYear === y && styles.yearChipActive]}
                      onPress={() => setFilters((p) => ({ ...p, fromAcademicYear: y }))}
                    >
                      <Text
                        style={[styles.yearChipText, filters.fromAcademicYear === y && styles.yearChipTextActive]}
                      >
                        From: {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipScroll, { marginTop: 6 }]}>
                  {ORDERED_ACADEMIC_YEARS.map((y) => (
                    <TouchableOpacity
                      key={`to-${y}`}
                      style={[styles.yearChip, filters.toAcademicYear === y && styles.yearChipActive]}
                      onPress={() => setFilters((p) => ({ ...p, toAcademicYear: y }))}
                    >
                      <Text style={[styles.yearChipText, filters.toAcademicYear === y && styles.yearChipTextActive]}>
                        To: {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Scope Selector */}
          <View style={[styles.controlGroup, { marginTop: 12 }]}>
            <Text style={styles.controlLabel}>Report Scope</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => {
                setScopeDropdownOpen(!scopeDropdownOpen);
                setPeriodDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="layers-outline" size={16} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {filters.scope === 'all_categories'
                  ? 'All Achievement Categories (One Combined Report)'
                  : `Category: ${filters.categoryTitle}`}
              </Text>
              <Ionicons
                name={scopeDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748B"
              />
            </TouchableOpacity>

            {scopeDropdownOpen && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={[styles.dropdownItem, filters.scope === 'all_categories' && styles.dropdownItemActive]}
                  onPress={() => {
                    setFilters((p) => ({
                      ...p,
                      scope: 'all_categories',
                      categoryId: 'ALL',
                      categoryTitle: 'All Categories',
                    }));
                    setScopeDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      filters.scope === 'all_categories' && styles.dropdownItemTextActive,
                    ]}
                  >
                    All Categories (Combined PDF)
                  </Text>
                  {filters.scope === 'all_categories' && (
                    <Ionicons name="checkmark" size={16} color="#2563EB" />
                  )}
                </TouchableOpacity>

                {STANDARD_ACCREDITATION_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.dropdownItem,
                      filters.scope === 'category' && filters.categoryId === cat.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setFilters((p) => ({
                        ...p,
                        scope: 'category',
                        categoryId: cat.id,
                        categoryTitle: cat.title,
                      }));
                      setScopeDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        filters.scope === 'category' &&
                          filters.categoryId === cat.id &&
                          styles.dropdownItemTextActive,
                      ]}
                    >
                      {cat.title}
                    </Text>
                    {filters.scope === 'category' && filters.categoryId === cat.id && (
                      <Ionicons name="checkmark" size={16} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ── 2. 5-YEAR SUMMARY CARD ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardHeader}>
            <View>
              <Text style={styles.summaryCardTitle}>5-Year Achievement Summary</Text>
              <Text style={styles.summaryCardSub}>{reportData.reportingPeriodText}</Text>
            </View>
            <View style={styles.naacPill}>
              <Text style={styles.naacPillText}>NAAC READY</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.verifiedAchievementsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Verified Achievements</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.uniqueStudentsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Students Represented</Text>
            </View>
          </View>

          <View style={[styles.metricsGrid, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginTop: 10 }]}>
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#16A34A' }]}>{reportData.awardsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Awards / Winning Outcomes</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#64748B' }]}>{reportData.totalPoints.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Achievement Points</Text>
            </View>
          </View>
        </View>

        {/* ── 3. FIVE-YEAR QUANTITATIVE PERFORMANCE ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Five-Year Performance</Text>
            <Text style={styles.sectionSubtitle}>Chronological quantitative progression</Text>
          </View>

          <View style={styles.progressionList}>
            {reportData.yearBreakdowns.map((y) => {
              const barWidth = Math.max((y.achievementsCount / maxYearAchievements) * 100, 8);
              return (
                <View key={y.academicYear} style={styles.progressionRow}>
                  <View style={styles.yearCol}>
                    <Text style={styles.yearText}>{y.academicYear}</Text>
                  </View>
                  <View style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${barWidth}%` }]} />
                    </View>
                  </View>
                  <View style={styles.statsCol}>
                    <Text style={styles.achCount}>{y.achievementsCount}</Text>
                    <Text style={styles.achSub}>
                      {y.studentsCount} students • {y.awardsCount} awards
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── 4. CATEGORY DISTRIBUTION ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Achievement Categories</Text>
            <Text style={styles.sectionSubtitle}>
              {reportData.categorySummaries.length} Domain Categories
            </Text>
          </View>

          <View style={styles.categoryList}>
            {reportData.categorySummaries.map((cat) => (
              <TouchableOpacity
                key={cat.categoryId}
                style={styles.catRow}
                activeOpacity={0.7}
                onPress={() => {
                  if (onViewRecords) {
                    const catRecs = reportData.records.filter(
                      (r) =>
                        (r.categoryTitle || r.categoryName || '').toLowerCase() ===
                        cat.categoryTitle.toLowerCase()
                    );
                    onViewRecords(
                      catRecs,
                      `NAAC Supporting Records`,
                      `${cat.categoryTitle} • ${reportData.reportingPeriodText}`
                    );
                  }
                }}
              >
                <View style={styles.catRowLeft}>
                  <Text style={styles.catName}>{cat.categoryTitle}</Text>
                  <Text style={styles.catSub}>
                    {cat.studentsCount} Students • {cat.awardsCount} Awards
                  </Text>
                </View>
                <View style={styles.catRowRight}>
                  <Text style={styles.catCount}>{cat.achievementsCount}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 5. RECOGNITION LEVEL & OUTCOME SUMMARY ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Recognition Level Distribution</Text>
            <Text style={styles.sectionSubtitle}>External participation scope</Text>
          </View>

          <View style={styles.levelsRow}>
            {reportData.levelSummaries.map((lvl) => (
              <View key={lvl.level} style={styles.levelBadgeItem}>
                <Text style={styles.levelName}>{lvl.level}</Text>
                <Text style={styles.levelVal}>{lvl.achievementsCount}</Text>
                <Text style={styles.levelSub}>{lvl.awardsCount} awards</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionCardHeader, { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
            <Text style={styles.sectionTitle}>Outcome Summary</Text>
          </View>

          <View style={styles.outcomeWrap}>
            {reportData.outcomeSummaries.slice(0, 6).map((out) => (
              <View key={out.result} style={styles.outcomeTag}>
                <Text style={styles.outcomeTitle}>{out.result}:</Text>
                <Text style={styles.outcomeCount}>{out.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 6. SUPPORTING RECORDS ACCESS ── */}
        <TouchableOpacity
          style={styles.recordsAccessCard}
          activeOpacity={0.8}
          onPress={() => {
            if (onViewRecords) {
              onViewRecords(
                reportData.records,
                'NAAC Supporting Records',
                `${filters.scope === 'all_categories' ? 'All Categories' : filters.categoryTitle} • ${reportData.reportingPeriodText}`
              );
            }
          }}
        >
          <View style={styles.recordsAccessLeft}>
            <View style={styles.recordsIconBox}>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.recordsAccessTitle}>Supporting Records</Text>
              <Text style={styles.recordsAccessSub}>
                {reportData.verifiedAchievementsCount.toLocaleString()} verified student achievement records
              </Text>
            </View>
          </View>
          <View style={styles.recordsAccessBtn}>
            <Text style={styles.recordsAccessBtnText}>View Records</Text>
            <Ionicons name="arrow-forward" size={13} color="#2563EB" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* ── 7. GENERATE NAAC PDF BUTTON ── */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGeneratePDF}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Compiling NAAC Summary PDF...</Text>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate NAAC PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* REPORT READY MODAL */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="checkmark-circle" size={40} color="#2563EB" />
            </View>
            <Text style={styles.modalTitle}>NAAC Report Ready</Text>
            <Text style={styles.modalSub}>
              Official 5-year student achievement quantitative summary compiled as an institutional PDF.
            </Text>

            <View style={styles.fileDetailsBox}>
              <Text style={styles.fileDetailsName} numberOfLines={1}>
                {generatedItem?.fileName}
              </Text>
              <Text style={styles.fileDetailsMeta}>
                {reportData.verifiedAchievementsCount.toLocaleString()} Verified Records • {reportData.awardsCount} Awards
              </Text>
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity style={styles.modalViewBtn} onPress={handlePreview} activeOpacity={0.8}>
                <Ionicons name="eye-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalViewBtnText}>View PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalShareBtn} onPress={handleShare} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.modalShareBtnText}>Share PDF</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setReportModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 6,
    marginRight: 10,
    borderRadius: 8,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  accreditationBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  accreditationBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  controlsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  controlGroup: {},
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#334155',
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  customRangeBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  customRangeLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
  },
  chipScroll: {
    flexDirection: 'row',
  },
  yearChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    marginRight: 6,
  },
  yearChipActive: {
    backgroundColor: '#2563EB',
  },
  yearChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  yearChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  naacPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  naacPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E40AF',
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricCell: {
    flex: 1,
  },
  metricCellDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  metricLbl: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionCardHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  progressionList: {
    gap: 8,
  },
  progressionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  yearCol: {
    width: 65,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  barCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  statsCol: {
    width: 100,
    alignItems: 'flex-end',
  },
  achCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  achSub: {
    fontSize: 9,
    color: '#64748B',
  },
  categoryList: {
    gap: 6,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  catRowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  catSub: {
    fontSize: 10,
    color: '#64748B',
  },
  catRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  levelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  levelBadgeItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  levelName: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  levelVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  levelSub: {
    fontSize: 8.5,
    color: '#1E40AF',
    fontWeight: '600',
  },
  outcomeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  outcomeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outcomeTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginRight: 4,
  },
  outcomeCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordsAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recordsAccessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  recordsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recordsAccessTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordsAccessSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  recordsAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recordsAccessBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  fileDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
  },
  fileDetailsName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  fileDetailsMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 10,
  },
  modalViewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalViewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalShareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalDoneBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  modalDoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
});
