// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Executive Institutional Reports
// Executive accreditation, NAAC SSR, NIRF, NBA, and Annual governance reports.
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

import {
  principalDataStore,
  DEMO_PRINCIPAL_USER,
} from '../../data/principalWorkspaceData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';
import { PRINCIPAL_SPACING } from './principalSpacing';

interface PrincipalReportsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalReports({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalReportsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('naac');
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [selectedScope, setSelectedScope] = useState('All 8 Departments');
  const [reportGenerated, setReportGenerated] = useState(true);

  const reportTemplates = [
    {
      id: 'naac',
      title: 'NAAC SSR Criterion 3 & 5',
      code: 'SSR-3.4 & 5.3',
      description: 'Research publications, grants, student awards, and institutional activities.',
      icon: 'ribbon-outline',
      badge: 'Accreditation',
    },
    {
      id: 'nirf',
      title: 'NIRF Research & Professional Practice',
      code: 'NIRF-RPC',
      description: 'Publications in Scopus/WoS, sponsored research, and patents published.',
      icon: 'school-outline',
      badge: 'National Ranking',
    },
    {
      id: 'nba',
      title: 'NBA Department Achievement Matrix',
      code: 'NBA-CRIT-8',
      description: 'Program outcomes, student achievements, and faculty contributions.',
      icon: 'file-tray-full-outline',
      badge: 'Program Audit',
    },
    {
      id: 'annual',
      title: 'Annual College Achievement Summary',
      code: 'ANNUAL-GOV-2026',
      description: 'Comprehensive institutional summary of student and faculty achievements.',
      icon: 'document-text-outline',
      badge: 'Governance',
    },
    {
      id: 'faculty_contribution',
      title: 'Faculty Institutional Contribution Report',
      code: 'FAC-INST-SUMMARY',
      description: 'Individual faculty points, Dean achievements, and academic service records.',
      icon: 'people-outline',
      badge: 'Faculty Audit',
    },
    {
      id: 'dept_comparative',
      title: 'Department Comparative Performance',
      code: 'DEPT-BENCH-2026',
      description: 'Cross-departmental benchmarking on points, participation, and verification.',
      icon: 'stats-chart-outline',
      badge: 'Benchmarking',
    },
  ];

  const currentTemplateObj = reportTemplates.find((t) => t.id === selectedTemplate) || reportTemplates[0];

  const handleDownloadPdf = () => {
    showAchieveXDialog({
      type: 'success',
      title: 'Report Ready',
      message: 'Your report has been generated.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  const handleExportCsv = () => {
    showAchieveXDialog({
      type: 'success',
      title: 'Report Ready',
      message: 'Your data export has been saved.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.identityCol}>
            <Text style={styles.screenTitle}>Institutional Reports</Text>
            <Text style={styles.screenSubtext}>Executive Accreditation & Governance</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <PrincipalHeroCard
            overline="INSTITUTIONAL REPORTS"
            primaryNumber="6"
            primaryLabel="Report Templates"
            subtitle="Accreditation & institutional reporting"
            secondaryTitle="AUDIT"
            secondaryMetrics={[
              { number: '2,840', label: 'Records', icon: 'document-text-outline' },
              { number: '100%', label: 'Audited', icon: 'shield-checkmark-outline' },
            ]}
          />

          {/* Template Selector Cards */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Select Report Template</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templateScroll}
          >
            {reportTemplates.map((item) => {
              const isSelected = selectedTemplate === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.templateCard, isSelected && styles.templateCardActive]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTemplate(item.id);
                    setReportGenerated(true);
                  }}
                >
                  <View style={styles.templateTopRow}>
                    <View
                      style={[
                        styles.templateIconCircle,
                        isSelected && { backgroundColor: '#2563EB' },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={18}
                        color={isSelected ? '#FFFFFF' : '#2563EB'}
                      />
                    </View>
                    <View style={styles.templateBadgePill}>
                      <Text style={styles.templateBadgeText}>{item.badge}</Text>
                    </View>
                  </View>

                  <Text style={[styles.templateTitle, isSelected && styles.templateTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.templateCode}>{item.code}</Text>
                  <Text style={styles.templateDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Filter Summary & Parameters */}
          <View style={styles.filterSummaryCard}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Report Parameters</Text>
              <View style={styles.verifiedOnlyBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#15803D" style={{ marginRight: 4 }} />
                <Text style={styles.verifiedOnlyText}>Verified Records Only</Text>
              </View>
            </View>

            <View style={styles.parametersRow}>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Academic Year</Text>
                <Text style={styles.paramValue}>{selectedYear}</Text>
              </View>
              <View style={styles.paramDivider} />
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Institutional Scope</Text>
                <Text style={styles.paramValue}>{selectedScope}</Text>
              </View>
              <View style={styles.paramDivider} />
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Executive Sign-off</Text>
                <Text style={styles.paramValue}>Dr. S. Arumugam</Text>
              </View>
            </View>
          </View>

          {/* Live Report Preview Card */}
          {reportGenerated && (
            <View style={styles.previewCard}>
              {/* Institution Letterhead Simulation */}
              <View style={styles.letterhead}>
                <View style={styles.emblemCircle}>
                  <Ionicons name="school" size={24} color="#2563EB" />
                </View>
                <View style={styles.letterheadTextCol}>
                  <Text style={styles.collegeName}>NANDHA ENGINEERING COLLEGE</Text>
                  <Text style={styles.collegeSub}>Autonomous Institution • Affiliated to Anna University</Text>
                  <Text style={styles.reportDocTitle}>
                    {currentTemplateObj.title.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.previewDivider} />

              {/* Summary Table */}
              <View style={styles.previewSummaryTable}>
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.tableCell, { flex: 2, fontWeight: '700' }]}>Category</Text>
                  <Text style={[styles.tableCell, { flex: 1, fontWeight: '700', textAlign: 'center' }]}>Records</Text>
                  <Text style={[styles.tableCell, { flex: 1, fontWeight: '700', textAlign: 'right' }]}>Points</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>Research & Publications</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>480</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>15,560</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>Technical Competitions</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>640</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>12,650</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>Certifications & NPTEL</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>980</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>9,730</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowTotal]}>
                  <Text style={[styles.tableCell, { flex: 2, fontWeight: '700' }]}>College Total</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', fontWeight: '700' }]}>2,840</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: '800', color: '#2563EB' }]}>48,650</Text>
                </View>
              </View>

              {/* Sign-off Simulation */}
              <View style={styles.signOffRow}>
                <View>
                  <Text style={styles.signOffDate}>Generated: 2026-09-05</Text>
                  <Text style={styles.signOffRef}>Ref: NEC/PRIN/ACH/{currentTemplateObj.code}</Text>
                </View>
                <View style={styles.signOffRight}>
                  <Text style={styles.signOffName}>{DEMO_PRINCIPAL_USER.name}</Text>
                  <Text style={styles.signOffRole}>Principal, Nandha Engineering College</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.previewActionRow}>
                <TouchableOpacity
                  style={styles.exportCsvBtn}
                  activeOpacity={0.8}
                  onPress={handleExportCsv}
                >
                  <Ionicons name="grid-outline" size={16} color="#0F172A" style={{ marginRight: 6 }} />
                  <Text style={styles.exportCsvBtnText}>Export CSV</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.downloadPdfBtn}
                  activeOpacity={0.8}
                  onPress={handleDownloadPdf}
                >
                  <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.downloadPdfBtnText}>Download PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="reports" onNavigate={onNavigate} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  identityCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  screenSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: PRINCIPAL_SPACING.bottomNavClearance,
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  templateScroll: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 4,
    marginBottom: 12,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    width: 220,
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  templateCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  templateTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  templateIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateBadgePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  templateBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  templateTitleActive: {
    color: '#1D4ED8',
  },
  templateCode: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
  },
  templateDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  filterSummaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifiedOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedOnlyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  parametersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paramItem: {
    flex: 1,
  },
  paramLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },
  paramValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  paramDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 8,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  letterhead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  emblemCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  letterheadTextCol: {
    flex: 1,
  },
  collegeName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  collegeSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },
  reportDocTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 3,
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  previewSummaryTable: {
    marginBottom: 14,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  tableRowTotal: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 0,
    marginTop: 4,
    borderRadius: 6,
  },
  tableCell: {
    fontSize: 11,
    color: '#334155',
  },
  signOffRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 14,
  },
  signOffDate: {
    fontSize: 9,
    color: '#94A3B8',
  },
  signOffRef: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 2,
  },
  signOffRight: {
    alignItems: 'flex-end',
  },
  signOffName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  signOffRole: {
    fontSize: 9,
    color: '#64748B',
  },
  previewActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportCsvBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 6,
  },
  exportCsvBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  downloadPdfBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 6,
  },
  downloadPdfBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
