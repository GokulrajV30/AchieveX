// ─────────────────────────────────────────────────────────────
// AchieveX — Custom Report Builder (Head Workspace)
// Simplified, administrative custom audit report generator.
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

import { getHeadStore } from '../../data/headWorkspaceData';
import {
  type CustomFilterState,
  ORDERED_ACADEMIC_YEARS,
  computeCustomReportData,
  buildCustomHtml,
  generateReportPDF,
  previewReportPDF,
  shareReportPDF,
  addRecentReport,
} from '../../services/reportService';
import { showAchieveXToast, showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface HeadCustomReportProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onViewRecords: (records: any[], reportTitle: string, contextText: string) => void;
}

const DEPARTMENTS = [
  'ALL',
  'CSE (IoT)',
  'CSE',
  'IT',
  'AI & DS',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
];

export default function HeadCustomReport({ onGoBack, onNavigate, onViewRecords }: HeadCustomReportProps) {
  const insets = useSafeAreaInsets();
  const store = getHeadStore();
  const allAchievements = store.getAchievements();
  const categories = store.getCategories();

  const [filters, setFilters] = useState<CustomFilterState>({
    fromAcademicYear: '2022–23',
    toAcademicYear: '2026–27',
    department: 'ALL',
    studentYear: 'ALL',
    semester: 'ALL',
    categoryId: 'ALL',
    level: 'ALL',
    status: 'Verified',
    userType: 'student',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [generatedPdfInfo, setGeneratedPdfInfo] = useState<{
    fileUri: string;
    fileName: string;
    scopeText: string;
    recordsCount: number;
    points: number;
  } | null>(null);

  const reportData = useMemo(() => {
    return computeCustomReportData(allAchievements, filters, 'Nandha Engineering College');
  }, [allAchievements, filters]);

  const handleSetFromYear = (year: string) => {
    const fromIdx = ORDERED_ACADEMIC_YEARS.indexOf(year);
    const toIdx = ORDERED_ACADEMIC_YEARS.indexOf(filters.toAcademicYear);
    if (toIdx !== -1 && fromIdx > toIdx) {
      showAchieveXToast({ type: 'warning', message: 'From year cannot be after To year.' });
      return;
    }
    setFilters((p) => ({ ...p, fromAcademicYear: year }));
  };

  const handleSetToYear = (year: string) => {
    const toIdx = ORDERED_ACADEMIC_YEARS.indexOf(year);
    const fromIdx = ORDERED_ACADEMIC_YEARS.indexOf(filters.fromAcademicYear);
    if (fromIdx !== -1 && toIdx < fromIdx) {
      showAchieveXToast({ type: 'warning', message: 'To year cannot be before From year.' });
      return;
    }
    setFilters((p) => ({ ...p, toAcademicYear: year }));
  };

  const handleGeneratePDF = async () => {
    if (reportData.records.length === 0) {
      showAchieveXToast({
        type: 'warning',
        message: 'No achievements match your custom filter selection.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { fileUri, fileName } = await generateReportPDF('CUSTOM', reportData);

      setGeneratedPdfInfo({
        fileUri,
        fileName,
        scopeText: reportData.reportScopeText,
        recordsCount: reportData.recordsCount,
        points: reportData.totalPoints,
      });
      setReportModalVisible(true);
      showAchieveXToast({
        type: 'success',
        message: 'Custom Report PDF compiled successfully!',
      });
    } catch (err: any) {
      showAchieveXDialog({
        type: 'error',
        title: 'PDF Generation Failed',
        message: err?.message || 'Could not compile custom report PDF.',
        primaryAction: { label: 'Dismiss' },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onGoBack}
          activeOpacity={0.7}
          accessibilityLabel="Back to Reports Hub"
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerMainTitle}>Custom Report Builder</Text>
          <Text style={styles.headerSubtitle}>Create a report using your own criteria</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. ACADEMIC YEAR RANGE ── */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeading}>Academic Year Range</Text>
          <Text style={styles.subLabel}>From Academic Year:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {ORDERED_ACADEMIC_YEARS.map((y) => (
              <TouchableOpacity
                key={`from-${y}`}
                style={[styles.chip, filters.fromAcademicYear === y && styles.chipActive]}
                onPress={() => handleSetFromYear(y)}
              >
                <Text style={[styles.chipText, filters.fromAcademicYear === y && styles.chipTextActive]}>
                  {y}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.subLabel, { marginTop: 10 }]}>To Academic Year:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {ORDERED_ACADEMIC_YEARS.map((y) => (
              <TouchableOpacity
                key={`to-${y}`}
                style={[styles.chip, filters.toAcademicYear === y && styles.chipActive]}
                onPress={() => handleSetToYear(y)}
              >
                <Text style={[styles.chipText, filters.toAcademicYear === y && styles.chipTextActive]}>
                  {y}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 2. DEPARTMENT & USER TYPE ── */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeading}>Department & Stakeholder</Text>
          <Text style={styles.subLabel}>Department:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[styles.chip, filters.department === dept && styles.chipActive]}
                onPress={() => setFilters((p) => ({ ...p, department: dept }))}
              >
                <Text style={[styles.chipText, filters.department === dept && styles.chipTextActive]}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.subLabel, { marginTop: 10 }]}>User Role:</Text>
          <View style={styles.roleToggleRow}>
            {(['student', 'faculty', 'ALL'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleBtn, filters.userType === r && styles.roleBtnActive]}
                onPress={() => setFilters((p) => ({ ...p, userType: r }))}
              >
                <Text style={[styles.roleBtnText, filters.userType === r && styles.roleBtnTextActive]}>
                  {r === 'ALL' ? 'All Users' : r === 'student' ? 'Students' : 'Faculty'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 3. CATEGORY & STATUS ── */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeading}>Category & Status</Text>
          <Text style={styles.subLabel}>Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, filters.categoryId === 'ALL' && styles.chipActive]}
              onPress={() => setFilters((p) => ({ ...p, categoryId: 'ALL' }))}
            >
              <Text style={[styles.chipText, filters.categoryId === 'ALL' && styles.chipTextActive]}>
                All Categories
              </Text>
            </TouchableOpacity>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, filters.categoryId === c.id && styles.chipActive]}
                onPress={() => setFilters((p) => ({ ...p, categoryId: c.id }))}
              >
                <Text style={[styles.chipText, filters.categoryId === c.id && styles.chipTextActive]}>
                  {c.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.subLabel, { marginTop: 10 }]}>Status:</Text>
          <View style={styles.roleToggleRow}>
            {(['Verified', 'ALL'] as const).map((st) => (
              <TouchableOpacity
                key={st}
                style={[styles.roleBtn, filters.status === st && styles.roleBtnActive]}
                onPress={() => setFilters((p) => ({ ...p, status: st }))}
              >
                <Text style={[styles.roleBtnText, filters.status === st && styles.roleBtnTextActive]}>
                  {st === 'ALL' ? 'All Statuses' : 'Verified Only'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 4. REPORT SUMMARY ── */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeading}>Query Summary</Text>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Matching Records</Text>
              <Text style={styles.summaryValue}>{reportData.recordsCount.toLocaleString()} records</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Unique Stakeholders</Text>
              <Text style={styles.summaryValue}>{reportData.uniqueUsersCount.toLocaleString()} achievers</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cumulative Points</Text>
              <Text style={[styles.summaryValue, { color: '#2563EB' }]}>
                {reportData.totalPoints.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Active Scope</Text>
              <Text style={styles.summaryValue}>{reportData.reportScopeText}</Text>
            </View>
          </View>
        </View>

        {/* ── 5. VIEW RECORDS NAVIGATION ROW ── */}
        <TouchableOpacity
          style={styles.viewRecordsCard}
          activeOpacity={0.8}
          onPress={() => {
            onViewRecords(reportData.records, 'Custom Report Records', reportData.reportScopeText);
          }}
        >
          <View style={styles.viewRecordsLeft}>
            <View style={styles.viewRecordsIcon}>
              <Ionicons name="list-outline" size={20} color="#0F172A" />
            </View>
            <View>
              <Text style={styles.viewRecordsTitle}>View Matching Records</Text>
              <Text style={styles.viewRecordsSubtitle}>
                {reportData.recordsCount.toLocaleString()} matching records
              </Text>
            </View>
          </View>
          <View style={styles.viewRecordsBtnPill}>
            <Text style={styles.viewRecordsBtnPillText}>View Records</Text>
            <Ionicons name="arrow-forward" size={14} color="#0F172A" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* ── 6. GENERATE PDF BUTTON ── */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGeneratePDF}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Compiling Custom Report...</Text>
            </>
          ) : (
            <>
              <Ionicons name="document-text" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate Custom PDF Report</Text>
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
            <View style={[styles.modalIconWrap, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="checkmark-circle" size={40} color="#0F172A" />
            </View>
            <Text style={styles.modalTitle}>Custom Report Ready</Text>
            <Text style={styles.modalSub}>
              Your custom institutional achievement report has been compiled as a PDF.
            </Text>

            {generatedPdfInfo && (
              <View style={styles.modalMetaBox}>
                <Text style={styles.metaLine} numberOfLines={1}>
                  <Text style={styles.metaKey}>File: </Text>
                  {generatedPdfInfo.fileName}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaKey}>Scope: </Text>
                  {generatedPdfInfo.scopeText}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaKey}>Records: </Text>
                  {generatedPdfInfo.recordsCount} records
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionPrimary, { backgroundColor: '#0F172A' }]}
                onPress={async () => {
                  if (generatedPdfInfo?.fileUri) await previewReportPDF(generatedPdfInfo.fileUri);
                }}
              >
                <Ionicons name="eye-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalActionPrimaryText}>View / Print PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionSecondary}
                onPress={async () => {
                  if (generatedPdfInfo?.fileUri) await shareReportPDF(generatedPdfInfo.fileUri, 'Share Custom Report');
                }}
              >
                <Ionicons name="share-social-outline" size={16} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={[styles.modalActionSecondaryText, { color: '#0F172A' }]}>Share PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDismiss}
                onPress={() => setReportModalVisible(false)}
              >
                <Text style={styles.modalDismissText}>Done</Text>
              </TouchableOpacity>
            </View>
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitles: {
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  chipRow: {
    marginHorizontal: -2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewRecordsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  viewRecordsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  viewRecordsIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewRecordsTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewRecordsSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  viewRecordsBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  viewRecordsBtnPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  generateBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  modalMetaBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 4,
  },
  metaLine: {
    fontSize: 11.5,
    color: '#1E293B',
  },
  metaKey: {
    fontWeight: '700',
    color: '#64748B',
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
  modalActionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  modalActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalActionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalActionSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalDismiss: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalDismissText: {
    color: '#64748B',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
