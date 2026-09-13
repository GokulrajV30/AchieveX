// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Student Details
// Read-only overview of an individual student's portfolio and verification status.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  AC_SCOPED_STUDENTS,
  SIH_STUDENT_SUBMISSIONS,
  type ACScopedStudent,
  type ACStudentSubmission,
} from '../../data/acWorkspaceData';

interface ACStudentDetailsProps {
  student?: ACScopedStudent;
  onGoBack: () => void;
  onSelectSubmission?: (submission: ACStudentSubmission) => void;
}

export default function ACStudentDetails({
  student = AC_SCOPED_STUDENTS[0],
  onGoBack,
  onSelectSubmission,
}: ACStudentDetailsProps) {
  // Find submissions for this student
  const studentSubmissions = SIH_STUDENT_SUBMISSIONS.filter(
    (s) => s.studentName === student.name || s.rollNo === student.registerNumber
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Student Details</Text>
            <Text style={styles.headerSubtitle}>Portfolio & Verification Status</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {student.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>

            <View style={styles.profileInfoCol}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentSub}>
                {student.registerNumber} • {student.department}
              </Text>
              <Text style={styles.studentScope}>
                Year {student.year} • Section {student.section} • Nandha Engg College
              </Text>
            </View>
          </View>

          {/* Attention Box if any */}
          {student.needsAttention && student.attentionReason && (
            <View style={styles.attentionBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.attentionTitle}>Attention Required</Text>
                <Text style={styles.attentionDesc}>{student.attentionReason}</Text>
              </View>
            </View>
          )}

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricVal}>{student.verifiedAchievementsCount}</Text>
              <Text style={styles.metricLabel}>Verified</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricVal, { color: '#D97706' }]}>{student.pendingCount}</Text>
              <Text style={styles.metricLabel}>Pending</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricVal, { color: '#DC2626' }]}>{student.correctionsCount}</Text>
              <Text style={styles.metricLabel}>Corrections</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricVal, { color: '#2563EB' }]}>{student.points}</Text>
              <Text style={styles.metricLabel}>Points</Text>
            </View>
          </View>

          {/* Submissions Section */}
          <Text style={styles.sectionTitle}>Recent Submissions</Text>

          {studentSubmissions.length > 0 ? (
            studentSubmissions.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={styles.submissionCard}
                activeOpacity={0.75}
                onPress={() => onSelectSubmission && onSelectSubmission(sub)}
              >
                <View style={styles.subTopRow}>
                  <Text style={styles.subCategoryText}>{sub.category.toUpperCase()}</Text>
                  <View
                    style={[
                      styles.subStatusPill,
                      sub.status === 'Ready' && styles.statusReady,
                      sub.status === 'Needs Attention' && styles.statusAttention,
                      sub.status === 'Approved' && styles.statusApproved,
                    ]}
                  >
                    <Text
                      style={[
                        styles.subStatusText,
                        sub.status === 'Ready' && styles.statusTextReady,
                        sub.status === 'Needs Attention' && styles.statusTextAttention,
                        sub.status === 'Approved' && styles.statusTextApproved,
                      ]}
                    >
                      {sub.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.subEventName}>{sub.eventName}</Text>
                <Text style={styles.subMeta}>
                  {sub.achievementType} • {sub.result} • {sub.date}
                </Text>

                <View style={styles.subDivider} />

                <View style={styles.subBottomRow}>
                  <Text style={styles.subProofText}>
                    {sub.individualProofName ? `📄 ${sub.individualProofName}` : '❌ Certificate Missing'}
                  </Text>
                  <View style={styles.inspectBtn}>
                    <Text style={styles.inspectBtnText}>Inspect</Text>
                    <Ionicons name="chevron-forward" size={13} color="#2563EB" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No recent submissions recorded this semester.</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
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
  backBtn: {
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  profileInfoCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  studentScope: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  attentionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  attentionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  attentionDesc: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  submissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  subStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusReady: { backgroundColor: '#DCFCE7' },
  statusAttention: { backgroundColor: '#FEE2E2' },
  statusApproved: { backgroundColor: '#DCFCE7' },
  subStatusText: { fontSize: 10, fontWeight: '700' },
  statusTextReady: { color: '#16A34A' },
  statusTextAttention: { color: '#DC2626' },
  statusTextApproved: { color: '#16A34A' },
  subEventName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  subMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  subDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  subBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subProofText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
  },
});
