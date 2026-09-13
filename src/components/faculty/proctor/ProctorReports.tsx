// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Reports Screen
// Generation and PDF export for assigned student performance and achievements.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  PROCTOR_ASSIGNED_STUDENTS,
} from '../../../data/facultyWorkspaceData';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorReportsProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function ProctorReports({
  onGoBack,
  onNavigate,
}: ProctorReportsProps) {
  const [reportType, setReportType] = useState<'students' | 'achievements'>('students');
  const [selectedSemester, setSelectedSemester] = useState('Semester 5');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      Alert.alert(
        'Report Generated! 📄',
        `The ${
          reportType === 'students'
            ? 'Assigned Students Performance'
            : 'Achievement Summary'
        } report for ${selectedSemester} has been compiled and downloaded as PDF.`,
        [{ text: 'Open PDF', style: 'default' }, { text: 'Done', style: 'cancel' }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Proctor Reports</Text>
            <Text style={styles.headerSubtitle}>Download official reports for your assigned students</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. SELECT REPORT TYPE
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionHeading}>1. Select Report Type</Text>

          {/* Option A: Assigned Students Report */}
          <TouchableOpacity
            style={[
              styles.reportTypeCard,
              reportType === 'students' && styles.reportTypeCardActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setReportType('students')}
          >
            <View style={styles.cardRadioRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: reportType === 'students' ? '#EFF6FF' : '#F1F5F9' },
                ]}
              >
                <Ionicons
                  name="people"
                  size={20}
                  color={reportType === 'students' ? '#2563EB' : '#64748B'}
                />
              </View>

              <View style={styles.cardTextCol}>
                <Text style={styles.reportCardTitle}>Assigned Students Performance Report</Text>
                <Text style={styles.reportCardDesc}>
                  Student register numbers, verified achievements, total points, and active status.
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  reportType === 'students' && styles.radioOuterActive,
                ]}
              >
                {reportType === 'students' && <View style={styles.radioInner} />}
              </View>
            </View>
          </TouchableOpacity>

          {/* Option B: Achievement Summary Report */}
          <TouchableOpacity
            style={[
              styles.reportTypeCard,
              reportType === 'achievements' && styles.reportTypeCardActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setReportType('achievements')}
          >
            <View style={styles.cardRadioRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: reportType === 'achievements' ? '#EFF6FF' : '#F1F5F9' },
                ]}
              >
                <Ionicons
                  name="ribbon"
                  size={20}
                  color={reportType === 'achievements' ? '#2563EB' : '#64748B'}
                />
              </View>

              <View style={styles.cardTextCol}>
                <Text style={styles.reportCardTitle}>Achievement Summary Report</Text>
                <Text style={styles.reportCardDesc}>
                  Detailed list of approved, pending, and correction-required student submissions.
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  reportType === 'achievements' && styles.radioOuterActive,
                ]}
              >
                {reportType === 'achievements' && <View style={styles.radioInner} />}
              </View>
            </View>
          </TouchableOpacity>

          {/* ════════════════════════════════════════════════
              2. REPORT PARAMETERS / FILTERS
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionHeading}>2. Select Filters</Text>

          <View style={styles.filtersCard}>
            <Text style={styles.filterLabel}>Academic Semester</Text>
            <View style={styles.optionsRow}>
              {['Semester 5', 'Semester 4', 'All Semesters'].map((sem) => (
                <TouchableOpacity
                  key={sem}
                  style={[
                    styles.filterChip,
                    selectedSemester === sem && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedSemester(sem)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedSemester === sem && styles.filterChipTextActive,
                    ]}
                  >
                    {sem}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Verification Status</Text>
            <View style={styles.optionsRow}>
              {['All', 'Approved Only', 'Pending Only'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.filterChip,
                    selectedStatus === st && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedStatus(st)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedStatus === st && styles.filterChipTextActive,
                    ]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              3. REPORT PREVIEW SUMMARY
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionHeading}>3. Summary Preview</Text>

          <View style={styles.previewCard}>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Assigned Scope</Text>
              <Text style={styles.previewValue}>20 Students • CSE (IoT)</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Academic Period</Text>
              <Text style={styles.previewValue}>{selectedSemester}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>File Format</Text>
              <Text style={styles.previewValue}>PDF Document (.pdf)</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Generated On</Text>
              <Text style={styles.previewValue}>02 Sep 2026</Text>
            </View>
          </View>

          {/* Download Action Button */}
          <TouchableOpacity
            style={styles.generateBtn}
            activeOpacity={0.85}
            onPress={handleDownloadPDF}
            disabled={isGenerating}
          >
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={22}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.generateBtnText}>
              {isGenerating ? 'Compiling Report...' : 'Download PDF Report'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Tab Navigation */}
        <StudentBottomTab
          variant="proctor"
          activeTab="home"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
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
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  reportTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  reportTypeCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFF',
  },
  cardRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  reportCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reportCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  filtersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  previewLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  previewValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  generateBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
