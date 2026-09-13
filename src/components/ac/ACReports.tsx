// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Reports Screen
// Dynamic Academic Year & All Semesters (1-8) filtering, report generation preview,
// and official PDF download via expo-print & expo-sharing.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import {
  AC_SUMMARY_DATA,
  AC_SCOPED_STUDENTS,
  AC_EVENT_GROUPS,
  ALL_AC_STUDENT_SUBMISSIONS,
} from '../../data/acWorkspaceData';
import { INITIAL_CREDIT_RECORDS, type CreditCourseRecord } from '../../data/academicCreditsData';
import { DEFAULT_FACULTY_USER } from '../../data/facultyWorkspaceData';
import ACBottomTab from './ACBottomTab';

interface ACReportsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
}

type ReportType = 'student_achievement' | 'verification_summary' | 'academic_credit';

export default function ACReports({ onOpenMenu, onNavigate }: ACReportsProps) {
  const [reportType, setReportType] = useState<ReportType>('student_achievement');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2026 - 2027');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewGenerated, setPreviewGenerated] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const academicYears = ['2026 - 2027', '2025 - 2026', '2024 - 2025', '2023 - 2024'];

  const semesters = [
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

  const categories = [
    'All Categories',
    'Technical & Professional',
    'Research & Intellectual Property',
    'Sports & Games',
    'Certifications & Online Learning',
  ];

  const statuses = ['All Statuses', 'Verified', 'Pending', 'Needs Attention'];

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setPreviewGenerated(false); // require re-generation
  };

  const handleGeneratePreview = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewGenerated(true);
    }, 400);
  };

  // Filtered Students for Achievement Report
  const filteredStudents = useMemo(() => {
    return AC_SCOPED_STUDENTS.filter((st) => {
      if (selectedStatus === 'Verified') return st.verifiedAchievementsCount > 0;
      if (selectedStatus === 'Pending') return st.pendingCount > 0;
      if (selectedStatus === 'Needs Attention') return st.needsAttention;
      return true;
    });
  }, [selectedStatus]);

  // Filtered Events for Verification Summary
  const filteredEventGroups = useMemo(() => {
    return AC_EVENT_GROUPS.filter((g) => {
      if (selectedCategory !== 'All Categories' && g.category !== selectedCategory) return false;
      if (selectedSemester !== 'All Semesters' && g.semester !== selectedSemester) return false;
      return true;
    });
  }, [selectedCategory, selectedSemester]);

  // Filtered Credit Records for Academic Credit Report
  const filteredCreditRecords = useMemo(() => {
    return INITIAL_CREDIT_RECORDS.filter((rec) => {
      if (selectedSemester !== 'All Semesters' && rec.semester !== selectedSemester) return false;
      return true;
    });
  }, [selectedSemester]);

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true);

      let html = '';
      if (reportType === 'student_achievement') {
        const rows = filteredStudents
          .map(
            (st, idx) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center;">${idx + 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">
              <strong>${st.name}</strong><br/>
              <span style="font-size: 11px; color: #64748B;">${st.registerNumber}</span>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #16A34A; font-weight: bold;">
              ${st.verifiedAchievementsCount}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #D97706;">
              ${st.pendingCount}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #DC2626;">
              ${st.correctionsCount}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: bold; color: #2563EB;">
              ${st.points} pts
            </td>
          </tr>
        `
          )
          .join('');

        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>AchieveX — Student Achievement Cohort Report</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; padding: 24px; margin: 0; }
                .header { border-bottom: 2px solid #2563EB; padding-bottom: 12px; margin-bottom: 16px; }
                .brand { font-size: 22px; font-weight: 800; color: #2563EB; }
                .subtitle { font-size: 13px; color: #64748B; margin-top: 3px; }
                .info-box { background: #F8FAFC; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; line-height: 1.5; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #F1F5F9; padding: 8px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #CBD5E1; }
                .footer { margin-top: 24px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="brand">AchieveX Academic Coordinator Report</div>
                <div class="subtitle">Student Achievement Portfolio • Academic Year ${selectedAcademicYear} • ${selectedSemester}</div>
              </div>
              <div class="info-box">
                <strong>Institution:</strong> ${DEFAULT_FACULTY_USER.institution}<br/>
                <strong>Department & Cohort:</strong> ${AC_SUMMARY_DATA.assignedScope.department} • ${AC_SUMMARY_DATA.assignedScope.year} ${AC_SUMMARY_DATA.assignedScope.section}<br/>
                <strong>Academic Coordinator:</strong> ${DEFAULT_FACULTY_USER.name} (${DEFAULT_FACULTY_USER.id})<br/>
                <strong>Report Generated At:</strong> ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">#</th>
                    <th>Student Name & Reg No</th>
                    <th style="text-align: center;">Verified</th>
                    <th style="text-align: center;">Pending</th>
                    <th style="text-align: center;">Corrections</th>
                    <th style="text-align: center;">Points</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
              <div class="footer">
                AchieveX Verification Engine • Certified Institutional Document
              </div>
            </body>
          </html>
        `;
      } else if (reportType === 'academic_credit') {
        const rows = filteredCreditRecords
          .map(
            (c, idx) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center;">${idx + 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">
              <strong>${c.studentName || 'Student'}</strong><br/>
              <span style="font-size: 11px; color: #64748B;">${c.rollNo || '23CI000'}</span>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">
              <strong>${c.courseName}</strong><br/>
              <span style="font-size: 11px; color: #64748B;">${c.courseType} • ${c.duration}</span>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center;">
              ${c.semester}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: bold; color: #4F46E5;">
              ${c.recognizedCredits || c.claimedCredits} Credits
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center;">
              <span style="padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${
                c.verificationStatus === 'Verified' ? '#DCFCE7; color: #16A34A;' : '#EFF6FF; color: #2563EB;'
              }">${c.verificationStatus}</span>
            </td>
          </tr>
        `
          )
          .join('');

        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>AchieveX — Academic Credit Audit Report</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; padding: 24px; margin: 0; }
                .header { border-bottom: 2px solid #4F46E5; padding-bottom: 12px; margin-bottom: 16px; }
                .brand { font-size: 22px; font-weight: 800; color: #4F46E5; }
                .subtitle { font-size: 13px; color: #64748B; margin-top: 3px; }
                .info-box { background: #F8FAFC; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; line-height: 1.5; }
                .note-box { background: #EEF2FF; border-left: 4px solid #4F46E5; padding: 10px; margin-bottom: 16px; font-size: 11px; color: #3730A3; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #F1F5F9; padding: 8px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #CBD5E1; }
                .footer { margin-top: 24px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="brand">AchieveX Academic Credit Audit Report</div>
                <div class="subtitle">NPTEL, Value Added & Approved Credit Course Audit • AY ${selectedAcademicYear}</div>
              </div>
              <div class="info-box">
                <strong>Institution:</strong> ${DEFAULT_FACULTY_USER.institution}<br/>
                <strong>Department & Scope:</strong> ${AC_SUMMARY_DATA.assignedScope.department} • Section A<br/>
                <strong>Academic Coordinator:</strong> ${DEFAULT_FACULTY_USER.name} (${DEFAULT_FACULTY_USER.id})<br/>
                <strong>Total Records Audited:</strong> ${filteredCreditRecords.length} Student Submissions
              </div>
              <div class="note-box">
                <strong>Audit Principle:</strong> Academic Credits are official institutional course credits separate from AchieveX achievement points and do not influence leaderboard rankings.
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">#</th>
                    <th>Student Name & Reg No</th>
                    <th>Course & Type</th>
                    <th style="text-align: center;">Semester</th>
                    <th style="text-align: center;">Academic Credits</th>
                    <th style="text-align: center;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
              <div class="footer">
                AchieveX Verification Engine • Certified Institutional Document
              </div>
            </body>
          </html>
        `;
      } else {
        const rows = filteredEventGroups
          .map(
            (g, idx) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center;">${idx + 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">
              <strong>${g.eventName}</strong><br/>
              <span style="font-size: 11px; color: #64748B;">${g.organizer} • ${g.level}</span>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: bold;">
              ${g.totalSubmissions}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #16A34A; font-weight: bold;">
              ${g.readyCount}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #DC2626;">
              ${g.issuesCount}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; text-align: center;">
              ${g.semester}
            </td>
          </tr>
        `
          )
          .join('');

        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>AchieveX — Event Verification Summary</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; padding: 24px; margin: 0; }
                .header { border-bottom: 2px solid #2563EB; padding-bottom: 12px; margin-bottom: 16px; }
                .brand { font-size: 22px; font-weight: 800; color: #2563EB; }
                .subtitle { font-size: 13px; color: #64748B; margin-top: 3px; }
                .info-box { background: #F8FAFC; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; line-height: 1.5; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #F1F5F9; padding: 8px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #CBD5E1; }
                .footer { margin-top: 24px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="brand">AchieveX Event Verification Summary</div>
                <div class="subtitle">Cohort Events & Participation Statistics • Academic Year ${selectedAcademicYear}</div>
              </div>
              <div class="info-box">
                <strong>Institution:</strong> ${DEFAULT_FACULTY_USER.institution}<br/>
                <strong>Department & Scope:</strong> ${AC_SUMMARY_DATA.assignedScope.department} • Section A<br/>
                <strong>Academic Coordinator:</strong> ${DEFAULT_FACULTY_USER.name}<br/>
                <strong>Total Groups Audited:</strong> ${filteredEventGroups.length} Event Groups
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">#</th>
                    <th>Event Details</th>
                    <th style="text-align: center;">Total</th>
                    <th style="text-align: center;">Ready</th>
                    <th style="text-align: center;">Issues</th>
                    <th style="text-align: center;">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
              <div class="footer">
                AchieveX Verification Engine • Certified Institutional Document
              </div>
            </body>
          </html>
        `;
      }

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Download AchieveX Report',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Report Ready', `PDF saved at: ${uri}`);
      }
    } catch (error: any) {
      Alert.alert('Export Failed', error.message || 'Could not export PDF report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7} onPress={onOpenMenu}>
            <Ionicons name="menu-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Official Reports</Text>
            <Text style={styles.headerSubtitle}>
              {AC_SUMMARY_DATA.assignedScope.department} • Section A
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => onNavigate('acNotifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. HERO CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.heroWrapper}>
            <LinearGradient
              colors={['#2563EB', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroTagRow}>
                <View style={styles.heroTagPill}>
                  <Ionicons name="document-text" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.heroTagText}>ACADEMIC AUDIT</Text>
                </View>
                <Text style={styles.heroScopeText}>AY {selectedAcademicYear}</Text>
              </View>

              <Text style={styles.heroTitle}>Student Achievement Records</Text>
              <Text style={styles.heroSubtitle}>
                Generate structured, auditable verification summaries for institutional review.
              </Text>
            </LinearGradient>
          </View>

          {/* ════════════════════════════════════════════════
              2. REPORT TYPE SELECTOR
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Select Report Type</Text>
          </View>

          <View style={styles.reportTypeRow}>
            <TouchableOpacity
              style={[
                styles.reportTypeCard,
                reportType === 'student_achievement' && styles.reportTypeCardActive,
              ]}
              activeOpacity={0.75}
              onPress={() => setReportType('student_achievement')}
            >
              <View
                style={[
                  styles.typeIconCircle,
                  reportType === 'student_achievement' && { backgroundColor: '#2563EB' },
                ]}
              >
                <Ionicons
                  name="people"
                  size={16}
                  color={reportType === 'student_achievement' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <Text
                style={[
                  styles.typeTitleText,
                  reportType === 'student_achievement' && styles.typeTitleTextActive,
                ]}
              >
                Student Portfolio
              </Text>
              <Text style={styles.typeDescText}>
                Student points, verified & pending count.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reportTypeCard,
                reportType === 'verification_summary' && styles.reportTypeCardActive,
              ]}
              activeOpacity={0.75}
              onPress={() => setReportType('verification_summary')}
            >
              <View
                style={[
                  styles.typeIconCircle,
                  reportType === 'verification_summary' && { backgroundColor: '#2563EB' },
                ]}
              >
                <Ionicons
                  name="layers"
                  size={16}
                  color={reportType === 'verification_summary' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <Text
                style={[
                  styles.typeTitleText,
                  reportType === 'verification_summary' && styles.typeTitleTextActive,
                ]}
              >
                Verification Summary
              </Text>
              <Text style={styles.typeDescText}>
                Event groups, ready counts & exception rates.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reportTypeCard,
                reportType === 'academic_credit' && styles.reportTypeCardActive,
              ]}
              activeOpacity={0.75}
              onPress={() => setReportType('academic_credit')}
            >
              <View
                style={[
                  styles.typeIconCircle,
                  reportType === 'academic_credit' && { backgroundColor: '#2563EB' },
                ]}
              >
                <Ionicons
                  name="school"
                  size={16}
                  color={reportType === 'academic_credit' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <Text
                style={[
                  styles.typeTitleText,
                  reportType === 'academic_credit' && styles.typeTitleTextActive,
                ]}
              >
                Academic Credits
              </Text>
              <Text style={styles.typeDescText}>
                NPTEL & VAC verified credits (No points).
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              3. COMPACT VISIBLE FILTERS (ACADEMIC YEAR & SEMESTER)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Report Filters</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
              <Text style={styles.moreFiltersText}>More Filters →</Text>
            </TouchableOpacity>
          </View>

          {/* Academic Year Row */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Academic Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {academicYears.map((yr) => (
                <TouchableOpacity
                  key={yr}
                  style={[
                    styles.filterPill,
                    selectedAcademicYear === yr && styles.filterPillActive,
                  ]}
                  onPress={() => handleFilterChange(setSelectedAcademicYear, yr)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      selectedAcademicYear === yr && styles.filterPillTextActive,
                    ]}
                  >
                    {yr}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Semesters Row (All Semesters + 1 to 8) */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Semester</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {semesters.map((sem) => (
                <TouchableOpacity
                  key={sem}
                  style={[styles.filterPill, selectedSemester === sem && styles.filterPillActive]}
                  onPress={() => handleFilterChange(setSelectedSemester, sem)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      selectedSemester === sem && styles.filterPillTextActive,
                    ]}
                  >
                    {sem}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ════════════════════════════════════════════════
              4. REPORT PREVIEW & GENERATE ACTIONS
          ════════════════════════════════════════════════ */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <View>
                <Text style={styles.previewTitle}>
                  {reportType === 'student_achievement'
                    ? 'Student Achievement Cohort Preview'
                    : reportType === 'academic_credit'
                    ? 'Academic Credit Audit Preview'
                    : 'Event Verification Summary Preview'}
                </Text>
                <Text style={styles.previewSub}>
                  {selectedAcademicYear} • {selectedSemester}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.generateBtn}
                activeOpacity={0.8}
                onPress={handleGeneratePreview}
                disabled={isGenerating}
              >
                <Ionicons name="refresh" size={13} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={styles.generateBtnText}>
                  {isGenerating ? 'Updating...' : 'Generate'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.previewDivider} />

            {reportType === 'student_achievement' ? (
              <View>
                {filteredStudents.slice(0, 4).map((st, idx) => (
                  <View key={st.id} style={styles.previewStudentRow}>
                    <Text style={styles.previewIdxText}>#{idx + 1}</Text>
                    <View style={styles.previewStudentInfo}>
                      <Text style={styles.previewStudentName}>{st.name}</Text>
                      <Text style={styles.previewStudentMeta}>{st.registerNumber}</Text>
                    </View>
                    <View style={styles.previewBadgeCol}>
                      <Text style={styles.previewPointsText}>{st.points} pts</Text>
                      <Text style={styles.previewVerifiedCount}>
                        {st.verifiedAchievementsCount} verified
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : reportType === 'academic_credit' ? (
              <View>
                {filteredCreditRecords.slice(0, 4).map((c, idx) => (
                  <View key={c.id} style={styles.previewStudentRow}>
                    <Text style={styles.previewIdxText}>#{idx + 1}</Text>
                    <View style={styles.previewStudentInfo}>
                      <Text style={styles.previewStudentName}>{c.studentName || 'Student'}</Text>
                      <Text style={styles.previewStudentMeta}>
                        {c.courseName} • {c.semester}
                      </Text>
                    </View>
                    <View style={styles.previewBadgeCol}>
                      <Text style={[styles.previewPointsText, { color: '#4F46E5' }]}>
                        {c.recognizedCredits || c.claimedCredits} Credits
                      </Text>
                      <Text style={styles.previewVerifiedCount}>{c.verificationStatus}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                {filteredEventGroups.slice(0, 3).map((g, idx) => (
                  <View key={g.id} style={styles.previewStudentRow}>
                    <Text style={styles.previewIdxText}>#{idx + 1}</Text>
                    <View style={styles.previewStudentInfo}>
                      <Text style={styles.previewStudentName}>{g.eventName}</Text>
                      <Text style={styles.previewStudentMeta}>
                        {g.totalSubmissions} submissions • {g.semester}
                      </Text>
                    </View>
                    <View style={styles.previewBadgeCol}>
                      <Text style={[styles.previewPointsText, { color: '#16A34A' }]}>
                        {g.readyCount} Ready
                      </Text>
                      <Text style={styles.previewVerifiedCount}>{g.issuesCount} Issues</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.downloadPdfBtn}
              activeOpacity={0.85}
              onPress={handleExportPDF}
              disabled={isGenerating}
            >
              <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.downloadPdfBtnText}>
                {isGenerating ? 'Preparing Document...' : 'Download Certified PDF'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            MORE FILTERS BOTTOM SHEET MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetTitle}>Additional Report Filters</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Category Filter */}
                <Text style={styles.filterSectionLabel}>Category</Text>
                <View style={styles.filterOptionsGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterOptionPill,
                        selectedCategory === cat && styles.filterOptionPillActive,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedCategory === cat && styles.filterOptionTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Status Filter */}
                <Text style={styles.filterSectionLabel}>Student Verification Status</Text>
                <View style={styles.filterOptionsGrid}>
                  {statuses.map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.filterOptionPill,
                        selectedStatus === st && styles.filterOptionPillActive,
                      ]}
                      onPress={() => setSelectedStatus(st)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedStatus === st && styles.filterOptionTextActive,
                        ]}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.sheetActionRow}>
                <TouchableOpacity
                  style={styles.applySheetBtn}
                  onPress={() => {
                    setFilterModalVisible(false);
                    setPreviewGenerated(true);
                  }}
                >
                  <Text style={styles.applySheetBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            AC BOTTOM NAVIGATION (Standardized 5-Tab Bar)
        ════════════════════════════════════════════════ */}
        <ACBottomTab activeTab="reports" onNavigate={onNavigate} />
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
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  heroWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroScopeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  moreFiltersText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  reportTypeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  reportTypeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  reportTypeCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F7FF',
  },
  typeIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  typeTitleTextActive: {
    color: '#2563EB',
  },
  typeDescText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  generateBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  previewStudentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  previewIdxText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    width: 24,
  },
  previewStudentInfo: {
    flex: 1,
  },
  previewStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewStudentMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  previewBadgeCol: {
    alignItems: 'flex-end',
  },
  previewPointsText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  previewVerifiedCount: {
    fontSize: 10.5,
    color: '#64748B',
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 44,
    borderRadius: 12,
    marginTop: 14,
  },
  downloadPdfBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 8,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  filterOptionPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sheetActionRow: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  applySheetBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applySheetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
