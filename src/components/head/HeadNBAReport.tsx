// ─────────────────────────────────────────────────────────────
// AchieveX — NBA Supporting Achievement Report (Head Workspace)
// Final Redesign: Year-wise Program Achievement Summary
// Program-by-Program Benchmark + Category Mix + Level / Outcome
// + Supporting Records Access + Concise Summary PDF Generation
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
  computeNBAReportData,
  generateReportPDF,
  previewReportPDF,
  shareReportPDF,
  ORDERED_ACADEMIC_YEARS,
  NBA_PROGRAM_OPTIONS,
  type NBAFilterState,
  type GeneratedReportItem,
} from '../../services/reportService';
import { INITIAL_COLLEGE_ACHIEVEMENTS } from '../../data/headWorkspaceData';
import { showAchieveXToast } from '../feedback/AchieveXFeedback';

interface HeadNBAReportProps {
  onGoBack: () => void;
  onNavigate?: (screen: string) => void;
  onViewRecords?: (records: any[], reportTitle?: string, contextText?: string) => void;
}

export default function HeadNBAReport({ onGoBack, onViewRecords }: HeadNBAReportProps) {
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<NBAFilterState>({
    academicYear: '2026–27',
    scope: 'all_programs',
    program: 'CSE (IoT)',
  });

  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [progDropdownOpen, setProgDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<GeneratedReportItem | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // Compute live quantitative summary data
  const reportData = useMemo(() => {
    return computeNBAReportData(INITIAL_COLLEGE_ACHIEVEMENTS, filters);
  }, [filters]);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const { reportItem } = await generateReportPDF('NBA', reportData);
      setGeneratedItem(reportItem);
      setReportModalVisible(true);
    } catch {
      showAchieveXToast({ type: 'error', message: 'Failed to compile official NBA PDF.' });
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
      await shareReportPDF(generatedItem.fileUri, 'Share NBA Supporting Report');
    } catch {
      showAchieveXToast({ type: 'error', message: 'Sharing failed or not available.' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>NBA Report</Text>
          <Text style={styles.headerSubtitle}>Year-wise program achievement summary.</Text>
        </View>
        <View style={styles.accreditationBadge}>
          <Text style={styles.accreditationBadgeText}>CRITERION 4</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. REPORTING CONTROLS (Year & Scope) ── */}
        <View style={styles.controlsCard}>
          {/* Academic Year */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Academic Year</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => {
                setYearDropdownOpen(!yearDropdownOpen);
                setProgDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color="#4F46E5" style={{ marginRight: 8 }} />
              <Text style={styles.dropdownBtnText}>Academic Year {filters.academicYear}</Text>
              <Ionicons name={yearDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
            </TouchableOpacity>

            {yearDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {ORDERED_ACADEMIC_YEARS.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[styles.dropdownItem, filters.academicYear === y && styles.dropdownItemActive]}
                    onPress={() => {
                      setFilters((p) => ({ ...p, academicYear: y }));
                      setYearDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        filters.academicYear === y && styles.dropdownItemTextActive,
                      ]}
                    >
                      AY {y}
                    </Text>
                    {filters.academicYear === y && <Ionicons name="checkmark" size={16} color="#4F46E5" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Scope Segmented Control */}
          <View style={[styles.controlGroup, { marginTop: 14 }]}>
            <Text style={styles.controlLabel}>Report Scope</Text>
            <View style={styles.segmentedRow}>
              <TouchableOpacity
                style={[styles.segmentBtn, filters.scope === 'all_programs' && styles.segmentBtnActive]}
                onPress={() => {
                  setFilters((p) => ({ ...p, scope: 'all_programs' }));
                  setProgDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    filters.scope === 'all_programs' && styles.segmentBtnTextActive,
                  ]}
                >
                  All Programs (One PDF)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, filters.scope === 'program' && styles.segmentBtnActive]}
                onPress={() => setFilters((p) => ({ ...p, scope: 'program' }))}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    filters.scope === 'program' && styles.segmentBtnTextActive,
                  ]}
                >
                  Select Program
                </Text>
              </TouchableOpacity>
            </View>

            {/* Program Dropdown (Only revealed if Select Program) */}
            {filters.scope === 'program' && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subLabel}>Program / Department</Text>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setProgDropdownOpen(!progDropdownOpen)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="business-outline" size={16} color="#4F46E5" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownBtnText}>{filters.program}</Text>
                  <Ionicons name={progDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
                </TouchableOpacity>

                {progDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {NBA_PROGRAM_OPTIONS.map((prog) => (
                      <TouchableOpacity
                        key={prog}
                        style={[styles.dropdownItem, filters.program === prog && styles.dropdownItemActive]}
                        onPress={() => {
                          setFilters((p) => ({ ...p, program: prog }));
                          setProgDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            filters.program === prog && styles.dropdownItemTextActive,
                          ]}
                        >
                          {prog}
                        </Text>
                        {filters.program === prog && <Ionicons name="checkmark" size={16} color="#4F46E5" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* ── 2. ANNUAL PROGRAM SUMMARY CARD ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardHeader}>
            <View>
              <Text style={styles.summaryCardTitle}>
                {filters.scope === 'all_programs' ? 'Annual Program Summary' : `${filters.program} Summary`}
              </Text>
              <Text style={styles.summaryCardSub}>Academic Year {reportData.academicYear}</Text>
            </View>
            <View style={styles.nbaPill}>
              <Text style={styles.nbaPillText}>NBA EVIDENCE</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.programsIncludedCount}</Text>
              <Text style={styles.metricLbl}>Programs Evaluated</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.verifiedAchievementsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Verified Achievements</Text>
            </View>
          </View>

          <View style={[styles.metricsGrid, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginTop: 10 }]}>
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.uniqueStudentsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Students Represented</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#16A34A' }]}>{reportData.awardsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Awards / Winning Outcomes</Text>
            </View>
          </View>
        </View>

        {/* ── 3. PROGRAM PERFORMANCE LIST (When All Programs) ── */}
        {filters.scope === 'all_programs' && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <Text style={styles.sectionTitle}>Program Performance</Text>
              <Text style={styles.sectionSubtitle}>Criterion 4 departmental benchmarks</Text>
            </View>

            <View style={styles.progList}>
              {reportData.programSummaries.map((prog) => (
                <TouchableOpacity
                  key={prog.program}
                  style={styles.progRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onViewRecords) {
                      const progRecs = reportData.records.filter((r) => {
                        const dept = (r.department || r.departmentName || '').toLowerCase();
                        return (
                          dept.includes(prog.program.toLowerCase()) ||
                          prog.program.toLowerCase().includes(dept)
                        );
                      });
                      onViewRecords(
                        progRecs,
                        `NBA Supporting Records`,
                        `${prog.program} • AY ${reportData.academicYear}`
                      );
                    }
                  }}
                >
                  <View style={styles.progRowLeft}>
                    <Text style={styles.progName}>{prog.program}</Text>
                    <Text style={styles.progSub}>
                      {prog.studentsCount} Students • {prog.awardsCount} Awards
                    </Text>
                  </View>
                  <View style={styles.progRowRight}>
                    <Text style={styles.progCount}>{prog.achievementsCount} Achv</Text>
                    <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── 4. CATEGORY DISTRIBUTION / MIX ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Achievement Mix</Text>
            <Text style={styles.sectionSubtitle}>Distribution across technical & external areas</Text>
          </View>

          <View style={styles.catGrid}>
            {reportData.categorySummaries.map((c) => (
              <View key={c.categoryId} style={styles.catChip}>
                <Text style={styles.catChipName}>{c.categoryTitle}</Text>
                <Text style={styles.catChipCount}>{c.achievementsCount}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 5. LEVEL & OUTCOME SUMMARY ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Recognition Level & Outcomes</Text>
          </View>

          <View style={styles.levelsRow}>
            {reportData.levelSummaries.map((l) => (
              <View key={l.level} style={styles.levelBadgeItem}>
                <Text style={styles.levelName}>{l.level}</Text>
                <Text style={styles.levelVal}>{l.achievementsCount}</Text>
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
                'NBA Supporting Records',
                `${filters.scope === 'all_programs' ? 'All Programs' : filters.program} • AY ${reportData.academicYear}`
              );
            }
          }}
        >
          <View style={styles.recordsAccessLeft}>
            <View style={styles.recordsIconBox}>
              <Ionicons name="document-text-outline" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.recordsAccessTitle}>Supporting Records</Text>
              <Text style={styles.recordsAccessSub}>
                {reportData.verifiedAchievementsCount.toLocaleString()} verified student records
              </Text>
            </View>
          </View>
          <View style={styles.recordsAccessBtn}>
            <Text style={styles.recordsAccessBtnText}>View Records</Text>
            <Ionicons name="arrow-forward" size={13} color="#4F46E5" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* ── 7. GENERATE NBA PDF BUTTON ── */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGeneratePDF}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Compiling NBA Summary PDF...</Text>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate NBA PDF</Text>
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
              <Ionicons name="checkmark-circle" size={40} color="#4F46E5" />
            </View>
            <Text style={styles.modalTitle}>NBA Report Ready</Text>
            <Text style={styles.modalSub}>
              Program-wise student achievement evidence compiled as an official summary PDF.
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
                <Ionicons name="share-social-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
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
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  accreditationBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4338CA',
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
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
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
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#334155',
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: '#4F46E5',
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#4F46E5',
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
  nbaPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  nbaPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4338CA',
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
  progList: {
    gap: 6,
  },
  progRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  progRowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  progName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 1,
  },
  progSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  progRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  catChipName: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginRight: 6,
  },
  catChipCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  levelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  recordsAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
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
    backgroundColor: '#EEF2FF',
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
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recordsAccessBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#4F46E5',
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
    backgroundColor: '#EEF2FF',
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
    backgroundColor: '#4F46E5',
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
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalShareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
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
