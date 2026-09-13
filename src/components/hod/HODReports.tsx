// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Reports Screen
// Select Report -> Configure Filters -> Generate Report -> Preview -> Download PDF
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HOD_YEAR_OPTIONS } from '../../data/hodWorkspaceData';
import HODHeroCard from './HODHeroCard';
import HODBottomTab from './HODBottomTab';

interface HODReportsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

type ReportType =
  | 'Department Achievement Report'
  | 'Student Achievement Report'
  | 'Faculty Achievement Report'
  | 'Verification Summary';

export default function HODReports({ onGoBack, onNavigate }: HODReportsProps) {
  const [selectedReport, setSelectedReport] =
    useState<ReportType>('Department Achievement Report');
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [selectedStudentYear, setSelectedStudentYear] = useState('All Years');
  const [selectedSemester, setSelectedSemester] = useState('Semester 6');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes: ReportType[] = [
    'Department Achievement Report',
    'Student Achievement Report',
    'Faculty Achievement Report',
    'Verification Summary',
  ];

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    if (isGenerated) {
      setIsGenerated(false); // mark preview stale
    }
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 600);
  };

  const handleDownloadPDF = () => {
    Alert.alert(
      'Download Report',
      `"${selectedReport} (${selectedYear} - ${selectedSemester})" is ready for download. File saved to device downloads.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Department Reports</Text>
            <Text style={styles.headerSubtitle}>CSE (IoT) Official Reports</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Standard HOD Hero Card */}
          <HODHeroCard
            title="DEPARTMENT REPORTS"
            subtitle="CSE (IoT)"
            icon="document-text"
            primaryNumber={4}
            primaryLabel="Report Formats"
            gaugePercent={100}
            gaugeNumber="100%"
            gaugeLabel="Official"
            gaugeSubtext="Verified"
            ctaText="Generate Reports →"
          />

          {/* Step 1: Select Report Type */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>1. Select Report Type</Text>
            </View>

            <View style={styles.reportTypesGrid}>
              {reportTypes.map((rep) => {
                const isSelected = selectedReport === rep;
                return (
                  <TouchableOpacity
                    key={rep}
                    style={[styles.reportTypeBtn, isSelected && styles.reportTypeBtnActive]}
                    onPress={() => {
                      setSelectedReport(rep);
                      if (isGenerated) setIsGenerated(false);
                    }}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={isSelected ? '#2563EB' : '#94A3B8'}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.reportTypeBtnText,
                        isSelected && styles.reportTypeBtnTextActive,
                      ]}
                    >
                      {rep}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 2: Configure Filters */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="options-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>2. Configure Scope & Filters</Text>
            </View>

            {/* Academic Year */}
            <Text style={styles.filterLabel}>Academic Year</Text>
            <View style={styles.chipsRow}>
              {['2025-2026', '2024-2025', '2023-2024'].map((yr) => (
                <TouchableOpacity
                  key={yr}
                  style={[styles.chip, selectedYear === yr && styles.chipActive]}
                  onPress={() => handleFilterChange(setSelectedYear, yr)}
                >
                  <Text style={[styles.chipText, selectedYear === yr && styles.chipTextActive]}>
                    {yr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Semester */}
            <Text style={styles.filterLabel}>Semester</Text>
            <View style={styles.chipsRow}>
              {['All Semesters', 'Semester 6', 'Semester 5', 'Semester 4'].map((sem) => (
                <TouchableOpacity
                  key={sem}
                  style={[styles.chip, selectedSemester === sem && styles.chipActive]}
                  onPress={() => handleFilterChange(setSelectedSemester, sem)}
                >
                  <Text style={[styles.chipText, selectedSemester === sem && styles.chipTextActive]}>
                    {sem}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Student Year */}
            <Text style={styles.filterLabel}>Student Year</Text>
            <View style={styles.chipsRow}>
              {HOD_YEAR_OPTIONS.map((yr) => (
                <TouchableOpacity
                  key={yr}
                  style={[styles.chip, selectedStudentYear === yr && styles.chipActive]}
                  onPress={() => handleFilterChange(setSelectedStudentYear, yr)}
                >
                  <Text style={[styles.chipText, selectedStudentYear === yr && styles.chipTextActive]}>
                    {yr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category */}
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.chipsRow}>
              {['All Categories', 'Research & Publication', 'Hackathons', 'FDP / Certifications'].map(
                (cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                    onPress={() => handleFilterChange(setSelectedCategory, cat)}
                  >
                    <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Generate Action Button */}
            <TouchableOpacity
              style={styles.generateBtn}
              activeOpacity={0.8}
              onPress={handleGenerateReport}
            >
              <Ionicons
                name={isGenerating ? 'hourglass-outline' : 'sparkles'}
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.generateBtnText}>
                {isGenerating ? 'Compiling Report...' : 'Generate Report'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Step 3: Report Preview */}
          {isGenerated ? (
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>{selectedReport}</Text>
                  <Text style={styles.previewMeta}>
                    Nandha Engineering College • CSE (IoT) • AY {selectedYear} • {selectedSemester}
                  </Text>
                </View>
                <View style={styles.generatedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 3 }} />
                  <Text style={styles.generatedBadgeText}>Ready</Text>
                </View>
              </View>

              <View style={styles.summaryStatsRow}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatVal}>320</Text>
                  <Text style={styles.summaryStatLabel}>Total Records</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatVal, { color: '#16A34A' }]}>298</Text>
                  <Text style={styles.summaryStatLabel}>Verified</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatVal, { color: '#D97706' }]}>8</Text>
                  <Text style={styles.summaryStatLabel}>Pending</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.downloadBtn}
                activeOpacity={0.8}
                onPress={handleDownloadPDF}
              >
                <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.downloadBtnText}>Download Official PDF Report</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyPreviewCard}>
              <Ionicons name="document-attach-outline" size={32} color="#94A3B8" />
              <Text style={styles.emptyPreviewTitle}>No Report Generated</Text>
              <Text style={styles.emptyPreviewSub}>
                Select the desired report type and filters above, then tap "Generate Report".
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Nav */}
        <HODBottomTab activeTab="reports" onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  reportTypesGrid: {
    gap: 8,
  },
  reportTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportTypeBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  reportTypeBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  reportTypeBtnTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 11,
    marginTop: 14,
  },
  generateBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  previewMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  generatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 8,
  },
  generatedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  summaryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 14,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryStatLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPreviewTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyPreviewSub: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
