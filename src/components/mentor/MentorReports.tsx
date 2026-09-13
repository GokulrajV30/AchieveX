// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Project Reports Screen (MVP)
// Purpose: Year-wise filtering and PDF download of mentee project records
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G } from 'react-native-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import MentorBottomTab from './MentorBottomTab';
import {
  MENTOR_PROJECTS,
  MENTOR_ASSIGNED_MENTEES,
  type MentorProject,
} from '../../data/mentorWorkspaceData';

interface MentorReportsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function MentorReports({
  onOpenMenu,
  onNavigate,
}: MentorReportsProps) {
  const [selectedYear, setSelectedYear] = useState<'All Years' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('All Years');
  const [selectedType, setSelectedType] = useState<'All' | 'Team' | 'Individual'>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Donut Gauge Dimensions - exact match to Student & Faculty & Proctor Hero
  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2; // 58
  const circumference = 2 * Math.PI * radius;

  // Available unique domains
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    MENTOR_PROJECTS.forEach((p) => set.add(p.domain));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered dataset combining AND logic
  const filteredProjects = useMemo(() => {
    return MENTOR_PROJECTS.filter((project) => {
      // Year filter
      if (selectedYear !== 'All Years' && project.studentYear !== selectedYear) return false;

      // Type filter
      if (selectedType !== 'All' && project.projectType !== selectedType) return false;

      // Domain filter
      if (selectedDomain !== 'All' && project.domain !== selectedDomain) return false;

      return true;
    });
  }, [selectedYear, selectedType, selectedDomain]);

  // Unique mentees involved in filtered projects
  const involvedMenteeCount = useMemo(() => {
    const studentIds = new Set<string>();
    filteredProjects.forEach((p) => {
      studentIds.add(p.teamLeader.studentId);
      p.teamMembers.forEach((m) => {
        if (m.isMentee) studentIds.add(m.studentId);
      });
    });
    return studentIds.size;
  }, [filteredProjects]);

  const teamCount = filteredProjects.filter((p) => p.projectType === 'Team').length;
  const individualCount = filteredProjects.filter((p) => p.projectType === 'Individual').length;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      Alert.alert(
        'Report Generated! 📄',
        `Mentee Project Report prepared for ${selectedYear} (${filteredProjects.length} Projects, ${involvedMenteeCount} Mentees).`
      );
    }, 600);
  };

  const handleDownloadPDF = async () => {
    if (filteredProjects.length === 0) {
      Alert.alert('No Data', 'No project records match the selected filter criteria.');
      return;
    }

    try {
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 28px; color: #0F172A; }
            .header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: bold; color: #1E3A8A; margin: 0; }
            .sub { font-size: 13px; color: #64748B; margin-top: 4px; }
            .meta-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; }
            .meta-grid { display: flex; justify-content: space-between; }
            .project-card { border: 1px solid #CBD5E1; border-radius: 8px; padding: 14px; margin-bottom: 16px; page-break-inside: avoid; }
            .proj-title { font-size: 16px; font-weight: bold; color: #0F172A; margin: 0 0 4px 0; }
            .proj-tag { display: inline-block; background: #EFF6FF; color: #2563EB; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; margin-right: 6px; }
            .proj-desc { font-size: 12px; color: #475569; margin: 8px 0; line-height: 1.4; }
            .team-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
            .team-table th { background: #F1F5F9; text-align: left; padding: 6px; border: 1px solid #E2E8F0; }
            .team-table td { padding: 6px; border: 1px solid #E2E8F0; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94A3B8; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">AchieveX — Mentee Project Report</h1>
            <div class="sub">Department of Computer Science & Engineering (IoT) • Mentor: Gokulraj V</div>
            <div class="sub">Generated on: ${dateStr}</div>
          </div>

          <div class="meta-box">
            <div class="meta-grid">
              <div><strong>Selected Year:</strong> ${selectedYear}</div>
              <div><strong>Domain:</strong> ${selectedDomain}</div>
              <div><strong>Project Type:</strong> ${selectedType}</div>
              <div><strong>Total Projects:</strong> ${filteredProjects.length} (${teamCount} Team, ${individualCount} Individual)</div>
            </div>
          </div>

          ${filteredProjects
            .map(
              (p, idx) => `
            <div class="project-card">
              <div class="proj-title">${idx + 1}. ${p.title}</div>
              <div>
                <span class="proj-tag">${p.domain}</span>
                <span class="proj-tag">${p.projectType} Project</span>
                <span class="proj-tag">${p.studentYear} (${p.academicYear})</span>
              </div>
              <p class="proj-desc">${p.description}</p>
              
              <table class="team-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Student Name</th>
                    <th>Register No</th>
                    <th>Department & Year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${p.projectType === 'Team' ? 'Team Leader' : 'Project Owner'}</strong></td>
                    <td>${p.teamLeader.name}</td>
                    <td>${p.teamLeader.registerNumber}</td>
                    <td>${p.teamLeader.department} • ${p.teamLeader.yearLabel}</td>
                  </tr>
                  ${p.teamMembers
                    .filter((m) => m.studentId !== p.teamLeader.studentId)
                    .map(
                      (m) => `
                    <tr>
                      <td>Team Member ${m.isMentee ? '(Assigned Mentee)' : ''}</td>
                      <td>${m.name}</td>
                      <td>${m.registerNumber}</td>
                      <td>${m.department} • ${m.yearLabel}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `
            )
            .join('')}

          <div class="footer">
            Report generated via AchieveX Mentor Workspace • NANDHA ENGINEERING COLLEGE
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF document. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. HEADER (Exact Student / Faculty Match)
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuIconContainer}
              activeOpacity={0.7}
              onPress={onOpenMenu}
            >
              <Ionicons name="menu-outline" size={22} color="#0D4733" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.headerMainTitle}>Project Reports</Text>
              <Text style={styles.headerSubtitleText}>PDF Download & Summary</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellIconContainer}
            activeOpacity={0.7}
            onPress={handleDownloadPDF}
          >
            <Ionicons name="download-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              2. HERO BANNER CARD (Exact Student / Faculty Match)
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Top Row: Document Icon Badge + Title + Subtitle */}
            <View style={styles.topRow}>
              <View style={styles.trophyBadgeCircle}>
                <Ionicons name="document-text" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.titleColumn}>
                <Text style={styles.journeyTitle}>Mentee Reports</Text>
                <Text style={styles.levelSubtitle}>Project Documentation</Text>
              </View>
            </View>

            {/* Content Row: Left Column, Vertical Divider, Right Gauge */}
            <View style={styles.contentRow}>
              <View style={styles.leftColumn}>
                <View style={styles.pointsWrapper}>
                  <Text style={styles.pointsNumber}>0{filteredProjects.length}</Text>
                  <Text style={styles.pointsLabel}>Projects</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewAchievementsButton}
                  activeOpacity={0.85}
                  onPress={handleDownloadPDF}
                >
                  <Text style={styles.viewAchievementsButtonText}>Download PDF</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.rightGaugeColumn}>
                <View style={styles.svgContainer}>
                  <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(99, 102, 241, 0.45)"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FDE047"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - 1.0)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  <View style={styles.gaugeCenterTextWrapper}>
                    <Text style={styles.gaugeNumberText}>100%</Text>
                    <Text style={styles.gaugeSubText}>Ready</Text>
                    <Text style={styles.gaugeLevelText}>Export PDF</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              2. PROMINENT YEAR-WISE FILTER (Core Requirement)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. Select Student Year</Text>
          </View>
          <View style={styles.yearPillsGrid}>
            {(['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const).map(
              (yr) => (
                <TouchableOpacity
                  key={yr}
                  style={[
                    styles.yearPill,
                    selectedYear === yr && styles.yearPillActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedYear(yr);
                    setReportGenerated(false);
                  }}
                >
                  <Text
                    style={[
                      styles.yearPillText,
                      selectedYear === yr && styles.yearPillTextActive,
                    ]}
                  >
                    {yr}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* ════════════════════════════════════════════════
              3. OPTIONAL FILTERS (Domain & Project Type)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>2. Project Type & Domain (Optional)</Text>
          </View>

          {/* Project Type */}
          <View style={styles.typePillsRow}>
            {(['All', 'Team', 'Individual'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.subPill,
                  selectedType === type && styles.subPillActive,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedType(type);
                  setReportGenerated(false);
                }}
              >
                <Text
                  style={[
                    styles.subPillText,
                    selectedType === type && styles.subPillTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Domain Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.domainPillsRow}
          >
            {availableDomains.map((dom) => (
              <TouchableOpacity
                key={dom}
                style={[
                  styles.domainPill,
                  selectedDomain === dom && styles.domainPillActive,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedDomain(dom);
                  setReportGenerated(false);
                }}
              >
                <Text
                  style={[
                    styles.domainPillText,
                    selectedDomain === dom && styles.domainPillTextActive,
                  ]}
                >
                  {dom}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ════════════════════════════════════════════════
              4. REPORT SUMMARY PREVIEW
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>3. Report Preview Summary</Text>
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryTopRow}>
              <View style={styles.scopeIconWrap}>
                <Ionicons name="document-text" size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryScopeTitle}>{selectedYear} • CSE (IoT)</Text>
                <Text style={styles.summaryScopeSub}>
                  Domain: {selectedDomain} • Type: {selectedType}
                </Text>
              </View>
            </View>

            <View style={styles.summaryMetricsRow}>
              <View style={styles.summaryMetricItem}>
                <Text style={styles.summaryMetricNum}>{filteredProjects.length}</Text>
                <Text style={styles.summaryMetricLbl}>Projects</Text>
              </View>
              <View style={styles.summaryMetricDivider} />
              <View style={styles.summaryMetricItem}>
                <Text style={styles.summaryMetricNum}>{involvedMenteeCount}</Text>
                <Text style={styles.summaryMetricLbl}>Mentees</Text>
              </View>
              <View style={styles.summaryMetricDivider} />
              <View style={styles.summaryMetricItem}>
                <Text style={styles.summaryMetricNum}>{teamCount}</Text>
                <Text style={styles.summaryMetricLbl}>Team</Text>
              </View>
              <View style={styles.summaryMetricDivider} />
              <View style={styles.summaryMetricItem}>
                <Text style={styles.summaryMetricNum}>{individualCount}</Text>
                <Text style={styles.summaryMetricLbl}>Individual</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              5. ACTION BUTTONS (Generate & Download)
          ════════════════════════════════════════════════ */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.generateBtn}
              activeOpacity={0.8}
              onPress={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  <Text style={styles.generateBtnText}>Generate Report</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.downloadBtn,
                !reportGenerated && styles.downloadBtnDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleDownloadPDF}
            >
              <Ionicons
                name="download"
                size={16}
                color={reportGenerated ? '#2563EB' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.downloadBtnText,
                  !reportGenerated && styles.downloadBtnTextDisabled,
                ]}
              >
                Download PDF
              </Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              6. MATCHING PROJECTS LIST PREVIEW
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Matching Project Records ({filteredProjects.length})
            </Text>
          </View>

          {filteredProjects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="alert-circle-outline" size={36} color="#94A3B8" />
              <Text style={styles.emptyCardTitle}>No project data available</Text>
              <Text style={styles.emptyCardSub}>
                No projects match the selected student year and filters.
              </Text>
            </View>
          ) : (
            filteredProjects.map((p, idx) => (
              <View key={p.id} style={styles.projectPreviewCard}>
                <View style={styles.previewCardHeader}>
                  <Text style={styles.previewIndex}>#{idx + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.previewTitle}>{p.title}</Text>
                    <Text style={styles.previewMeta}>
                      {p.domain} • {p.studentYear} • {p.projectType} Project
                    </Text>
                  </View>
                </View>

                <View style={styles.previewTeamBox}>
                  <Text style={styles.previewLeader}>
                    <Text style={{ fontWeight: '700' }}>
                      {p.projectType === 'Team' ? 'Team Leader: ' : 'Project Owner: '}
                    </Text>
                    {p.teamLeader.name} ({p.teamLeader.registerNumber})
                  </Text>
                  {p.projectType === 'Team' && (
                    <Text style={styles.previewMembers}>
                      <Text style={{ fontWeight: '700' }}>Members: </Text>
                      {p.teamMembers.map((m) => m.name).join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}

          {/* Bottom space for floating nav */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. LOCKED 5-TAB BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <MentorBottomTab activeTab="reports" onNavigate={onNavigate} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroCard: {
    width: '100%',
    maxWidth: 356,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trophyBadgeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  journeyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  levelSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FDE047',
    marginTop: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minHeight: 120,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  pointsWrapper: {
    marginBottom: 12,
  },
  pointsNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  pointsLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 1,
  },
  viewAchievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAchievementsButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  verticalDivider: {
    width: 1,
    height: 78,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 12,
  },
  rightGaugeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'relative',
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNumberText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  gaugeSubText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 13,
  },
  gaugeLevelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FDE047',
    lineHeight: 16,
  },
  heroMetricBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  yearPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  yearPill: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  yearPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  yearPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  yearPillTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  typePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  subPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  subPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  subPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  subPillTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  domainPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    marginBottom: 16,
  },
  domainPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  domainPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  domainPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  domainPillTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  scopeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  summaryScopeTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryScopeSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
  },
  summaryMetricItem: {
    alignItems: 'center',
  },
  summaryMetricNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryMetricLbl: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  summaryMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  generateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  generateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  downloadBtnDisabled: {
    borderColor: '#E2E8F0',
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  downloadBtnTextDisabled: {
    color: '#94A3B8',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
  },
  emptyCardSub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  projectPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  previewCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  previewIndex: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    marginRight: 8,
    marginTop: 1,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewMeta: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  previewTeamBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  previewLeader: {
    fontSize: 12,
    color: '#334155',
  },
  previewMembers: {
    fontSize: 11.5,
    color: '#475569',
  },
});
