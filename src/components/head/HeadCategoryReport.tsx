// ─────────────────────────────────────────────────────────────
// AchieveX — Category Achievement Report (Head Workspace)
// Section 28: Analyze achievements by category and recognition level
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
  computeCategoryReportData,
  generateReportPDF,
  previewReportPDF,
  shareReportPDF,
  STANDARD_ACCREDITATION_CATEGORIES,
  type CategoryFilterState,
  type GeneratedReportItem,
} from '../../services/reportService';
import { INITIAL_COLLEGE_ACHIEVEMENTS } from '../../data/headWorkspaceData';
import { showAchieveXToast } from '../feedback/AchieveXFeedback';

interface HeadCategoryReportProps {
  onGoBack: () => void;
  onNavigate?: (screen: string) => void;
  onViewRecords?: (records: any[], reportTitle?: string, contextText?: string) => void;
}

export default function HeadCategoryReport({ onGoBack, onViewRecords }: HeadCategoryReportProps) {
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<CategoryFilterState>({
    categoryId: 'cat_tech',
    categoryTitle: 'Technical & Professional Innovation',
    periodPreset: 'last5',
    fromAcademicYear: '2022–23',
    toAcademicYear: '2026–27',
  });

  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<GeneratedReportItem | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const reportData = useMemo(() => {
    return computeCategoryReportData(INITIAL_COLLEGE_ACHIEVEMENTS, filters);
  }, [filters]);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const { reportItem } = await generateReportPDF('CATEGORY', reportData);
      setGeneratedItem(reportItem);
      setReportModalVisible(true);
    } catch {
      showAchieveXToast({ type: 'error', message: 'Failed to compile Category Report PDF.' });
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
      await shareReportPDF(generatedItem.fileUri, 'Share Category Report');
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
          <Text style={styles.headerTitle}>Category Report</Text>
          <Text style={styles.headerSubtitle}>Analyze achievements by category and recognition level.</Text>
        </View>
        <View style={styles.catBadge}>
          <Text style={styles.catBadgeText}>ANALYSIS</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. CATEGORY CONTROLS ── */}
        <View style={styles.controlsCard}>
          <Text style={styles.controlLabel}>Select Category Domain</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setCatDropdownOpen(!catDropdownOpen)}
            activeOpacity={0.7}
          >
            <Ionicons name="layers-outline" size={16} color="#9333EA" style={{ marginRight: 8 }} />
            <Text style={styles.dropdownBtnText} numberOfLines={1}>
              {filters.categoryTitle}
            </Text>
            <Ionicons name={catDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
          </TouchableOpacity>

          {catDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {STANDARD_ACCREDITATION_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.dropdownItem, filters.categoryId === cat.id && styles.dropdownItemActive]}
                  onPress={() => {
                    setFilters((p) => ({ ...p, categoryId: cat.id, categoryTitle: cat.title }));
                    setCatDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      filters.categoryId === cat.id && styles.dropdownItemTextActive,
                    ]}
                  >
                    {cat.title}
                  </Text>
                  {filters.categoryId === cat.id && <Ionicons name="checkmark" size={16} color="#9333EA" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            <Text style={styles.controlLabel}>Assessment Period</Text>
            <View style={styles.periodPill}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.periodPillText}>{reportData.reportingPeriodText}</Text>
            </View>
          </View>
        </View>

        {/* ── 2. SUMMARY CARD ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.summaryCardTitle} numberOfLines={1}>
                {reportData.categoryTitle}
              </Text>
              <Text style={styles.summaryCardSub}>{reportData.reportingPeriodText}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>DOMAIN REPORT</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.verifiedAchievementsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Total Achievements</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{reportData.studentsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Students Represented</Text>
            </View>
          </View>

          <View style={[styles.metricsGrid, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginTop: 10 }]}>
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#9333EA' }]}>{reportData.awardsCount.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Awards / Winning Outcomes</Text>
            </View>
            <View style={styles.metricCellDivider} />
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#64748B' }]}>{reportData.totalPoints.toLocaleString()}</Text>
              <Text style={styles.metricLbl}>Category Points</Text>
            </View>
          </View>
        </View>

        {/* ── 3. DEPARTMENT CONTRIBUTIONS ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Department Contributions</Text>
            <Text style={styles.sectionSubtitle}>Branches active in this category</Text>
          </View>

          <View style={styles.progList}>
            {reportData.programSummaries
              .filter((p) => p.achievementsCount > 0)
              .map((prog) => (
                <View key={prog.program} style={styles.progRow}>
                  <View style={styles.progRowLeft}>
                    <Text style={styles.progName}>{prog.program}</Text>
                    <Text style={styles.progSub}>
                      {prog.studentsCount} Students • {prog.awardsCount} Awards
                    </Text>
                  </View>
                  <Text style={styles.progCount}>{prog.achievementsCount} Achv</Text>
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
                `Category Records — ${reportData.categoryTitle}`,
                reportData.reportingPeriodText
              );
            }
          }}
        >
          <View style={styles.recordsAccessLeft}>
            <View style={[styles.recordsIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="document-text-outline" size={20} color="#9333EA" />
            </View>
            <View>
              <Text style={styles.recordsAccessTitle}>Supporting Records</Text>
              <Text style={styles.recordsAccessSub}>
                {reportData.verifiedAchievementsCount.toLocaleString()} verified category records
              </Text>
            </View>
          </View>
          <View style={[styles.recordsAccessBtn, { backgroundColor: '#F3E8FF' }]}>
            <Text style={[styles.recordsAccessBtnText, { color: '#9333EA' }]}>View Records</Text>
            <Ionicons name="arrow-forward" size={13} color="#9333EA" style={{ marginLeft: 4 }} />
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
              <Text style={styles.generateBtnText}>Compiling Category PDF...</Text>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate Category PDF</Text>
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
            <View style={[styles.modalIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="checkmark-circle" size={40} color="#9333EA" />
            </View>
            <Text style={styles.modalTitle}>Category Report Ready</Text>
            <Text style={styles.modalSub}>
              Domain achievement summary compiled as an institutional PDF.
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
                style={[styles.modalViewBtn, { backgroundColor: '#9333EA' }]}
                onPress={handlePreview}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalViewBtnText}>View PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalShareBtn, { borderColor: '#E9D5FF', backgroundColor: '#F3E8FF' }]}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={16} color="#9333EA" style={{ marginRight: 6 }} />
                <Text style={[styles.modalShareBtnText, { color: '#9333EA' }]}>Share PDF</Text>
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
  catBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  catBadgeText: { fontSize: 9, fontWeight: '800', color: '#7C3AED', letterSpacing: 0.5 },
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
  dropdownItemActive: { backgroundColor: '#F5F3FF' },
  dropdownItemText: { fontSize: 13, color: '#334155' },
  dropdownItemTextActive: { fontWeight: '700', color: '#9333EA' },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodPillText: { fontSize: 12, fontWeight: '600', color: '#334155' },
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
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: { fontSize: 9, fontWeight: '800', color: '#7C3AED' },
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
  sectionSubtitle: { fontSize: 11, color: '#64748B', marginTop: 1 },
  progList: { gap: 6 },
  progRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  progRowLeft: { flex: 1, paddingRight: 10 },
  progName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 1 },
  progSub: { fontSize: 10.5, color: '#64748B' },
  progCount: { fontSize: 13, fontWeight: '800', color: '#9333EA' },
  recordsAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
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
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#9333EA',
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
