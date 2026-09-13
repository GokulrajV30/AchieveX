// ─────────────────────────────────────────────────────────────
// AchieveX — Department Achievement Report (Head Workspace)
// Section 27: Department performance and achievement summary
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
  computeDepartmentReportData,
  generateReportPDF,
  previewReportPDF,
  shareReportPDF,
  ORDERED_ACADEMIC_YEARS,
  NBA_PROGRAM_OPTIONS,
  type DepartmentFilterState,
  type GeneratedReportItem,
} from '../../services/reportService';
import { INITIAL_COLLEGE_ACHIEVEMENTS } from '../../data/headWorkspaceData';
import { showAchieveXToast } from '../feedback/AchieveXFeedback';

interface HeadDepartmentReportProps {
  onGoBack: () => void;
  onNavigate?: (screen: string) => void;
  onViewRecords?: (records: any[], reportTitle?: string, contextText?: string) => void;
}

export default function HeadDepartmentReport({ onGoBack, onViewRecords }: HeadDepartmentReportProps) {
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<DepartmentFilterState>({
    department: 'CSE (IoT)',
    academicYear: '2026–27',
  });

  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<GeneratedReportItem | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const reportData = useMemo(() => {
    return computeDepartmentReportData(INITIAL_COLLEGE_ACHIEVEMENTS, filters);
  }, [filters]);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const { reportItem } = await generateReportPDF('DEPARTMENT', reportData);
      setGeneratedItem(reportItem);
      setReportModalVisible(true);
    } catch {
      showAchieveXToast({ type: 'error', message: 'Failed to compile Department Report PDF.' });
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
      await shareReportPDF(generatedItem.fileUri, 'Share Department Report');
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
          <Text style={styles.headerTitle}>Department Report</Text>
          <Text style={styles.headerSubtitle}>Department performance and achievement summary.</Text>
        </View>
        <View style={styles.deptBadge}>
          <Text style={styles.deptBadgeText}>DEPARTMENT</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. CONTROLS ── */}
        <View style={styles.controlsCard}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Select Department</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => {
                setDeptDropdownOpen(!deptDropdownOpen);
                setYearDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="business-outline" size={16} color="#0891B2" style={{ marginRight: 8 }} />
              <Text style={styles.dropdownBtnText}>{filters.department}</Text>
              <Ionicons name={deptDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
            </TouchableOpacity>

            {deptDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {NBA_PROGRAM_OPTIONS.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.dropdownItem, filters.department === dept && styles.dropdownItemActive]}
                    onPress={() => {
                      setFilters((p) => ({ ...p, department: dept }));
                      setDeptDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        filters.department === dept && styles.dropdownItemTextActive,
                      ]}
                    >
                      {dept}
                    </Text>
                    {filters.department === dept && <Ionicons name="checkmark" size={16} color="#0891B2" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.controlGroup, { marginTop: 12 }]}>
            <Text style={styles.controlLabel}>Academic Year</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => {
                setYearDropdownOpen(!yearDropdownOpen);
                setDeptDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color="#0891B2" style={{ marginRight: 8 }} />
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
                    {filters.academicYear === y && <Ionicons name="checkmark" size={16} color="#0891B2" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ── 2. SUMMARY CARD ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardHeader}>
            <View>
              <Text style={styles.summaryCardTitle}>{reportData.department}</Text>
              <Text style={styles.summaryCardSub}>Academic Year {reportData.academicYear}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>DEPT REVIEW</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.verifiedAchievementsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Verified Achievements</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.studentsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Students Represented</Text>
            </View>
          </View>

          <View style={[styles.metricsGrid, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginTop: 10 }]}>
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#0891B2' }]}>{reportData.awardsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Awards / Winning Outcomes</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#64748B' }]}>{reportData.totalPoints.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Department Points</Text>
            </View>
          </View>
        </View>

        {/* ── 3. CATEGORY DISTRIBUTION ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Category Contributions</Text>
          </View>

          <View style={styles.catList}>
            {reportData.categorySummaries.map((cat) => (
              <View key={cat.categoryId} style={styles.catRow}>
                <Text style={styles.catName}>{cat.categoryTitle}</Text>
                <Text style={styles.catCount}>{cat.achievementsCount} Achv</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 4. SUPPORTING RECORDS ACCESS ── */}
        <TouchableOpacity
          style={styles.recordsAccessCard}
          activeOpacity={0.8}
          onPress={() => {
            if (onViewRecords) {
              onViewRecords(
                reportData.records,
                `Department Records — ${reportData.department}`,
                `AY ${reportData.academicYear}`
              );
            }
          }}
        >
          <View style={styles.recordsAccessLeft}>
            <View style={[styles.recordsIconBox, { backgroundColor: '#ECFEFF' }]}>
              <Ionicons name="document-text-outline" size={20} color="#0891B2" />
            </View>
            <View>
              <Text style={styles.recordsAccessTitle}>Supporting Records</Text>
              <Text style={styles.recordsAccessSub}>
                {reportData.verifiedAchievementsCount.toLocaleString()} verified departmental records
              </Text>
            </View>
          </View>
          <View style={[styles.recordsAccessBtn, { backgroundColor: '#ECFEFF' }]}>
            <Text style={[styles.recordsAccessBtnText, { color: '#0891B2' }]}>View Records</Text>
            <Ionicons name="arrow-forward" size={13} color="#0891B2" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* ── 5. GENERATE BUTTON ── */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGeneratePDF}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Compiling Department PDF...</Text>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate Department PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconCircle, { backgroundColor: '#ECFEFF' }]}>
              <Ionicons name="checkmark-circle" size={40} color="#0891B2" />
            </View>
            <Text style={styles.modalTitle}>Department Report Ready</Text>
            <Text style={styles.modalSub}>
              Performance summary compiled as an official departmental PDF.
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
              <TouchableOpacity
                style={[styles.modalViewBtn, { backgroundColor: '#0891B2' }]}
                onPress={handlePreview}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalViewBtnText}>View PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalShareBtn, { borderColor: '#CFFAFE', backgroundColor: '#ECFEFF' }]}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={16} color="#0891B2" style={{ marginRight: 6 }} />
                <Text style={[styles.modalShareBtnText, { color: '#0891B2' }]}>Share PDF</Text>
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
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { padding: 6, marginRight: 10, borderRadius: 8 },
  headerTitles: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 11, color: '#64748B', marginTop: 1 },
  deptBadge: {
    backgroundColor: '#ECFEFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CFFAFE',
  },
  deptBadgeText: { fontSize: 9, fontWeight: '800', color: '#0E7490', letterSpacing: 0.5 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
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
  dropdownBtnText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#0F172A' },
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
  dropdownItemActive: { backgroundColor: '#ECFEFF' },
  dropdownItemText: { fontSize: 13, color: '#334155' },
  dropdownItemTextActive: { fontWeight: '700', color: '#0891B2' },
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
  summaryCardTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  summaryCardSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  statusPill: {
    backgroundColor: '#ECFEFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: { fontSize: 9, fontWeight: '800', color: '#0E7490' },
  metricsGrid: { flexDirection: 'row', alignItems: 'center' },
  metricCell: { flex: 1 },
  metricCellDivider: { width: 1, height: 32, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
  metricVal: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  metricLbl: { fontSize: 10, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionCardHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.3 },
  catList: { gap: 6 },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  catName: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  catCount: { fontSize: 13, fontWeight: '700', color: '#0891B2' },
  recordsAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFFAFE',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recordsAccessLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  recordsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recordsAccessTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  recordsAccessSub: { fontSize: 10.5, color: '#64748B', marginTop: 1 },
  recordsAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recordsAccessBtnText: { fontSize: 11, fontWeight: '700' },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  generateBtnDisabled: { opacity: 0.7 },
  generateBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  modalSub: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 16, marginBottom: 16 },
  fileDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
  },
  fileDetailsName: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  fileDetailsMeta: { fontSize: 11, color: '#64748B' },
  modalActionsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 10 },
  modalViewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalViewBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  modalShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalShareBtnText: { fontSize: 13, fontWeight: '700' },
  modalDoneBtn: { paddingVertical: 8, paddingHorizontal: 20 },
  modalDoneText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
});
