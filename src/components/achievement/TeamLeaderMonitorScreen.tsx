// ─────────────────────────────────────────────────────────────
// AchieveX — Team Leader Monitor Screen
//
// PURPOSE: Lets the Team Leader track certificate upload progress
// for all team members after submitting the team achievement.
//
// Shows:
//   • Hero card with event name, team name, progress (4/5 Uploaded)
//   • Event Details (read-only)
//   • Common Proofs (read-only)
//   • Member Certificate Status list with per-member status chips
//
// The leader CANNOT upload on behalf of members.
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
import { LinearGradient } from 'expo-linear-gradient';
import {
  getTeamAchievementById,
  getCertificateProgress,
  getMissingCertificateMembers,
  getCertificateStatusLabel,
  getRoleLabel,
  type TeamAchievement,
  type TeamAchievementMember,
  type CertificateStatus,
  subscribeTeamAchievements,
  simulateMemberUploads,
  simulateSathishkumarUpload,
  resetTeamAchievements,
} from '../../data/teamAchievementData';
import StudentBottomTab from '../StudentBottomTab';

interface TeamLeaderMonitorScreenProps {
  teamAchievementId: string;
  onGoBack: () => void;
  onNavigate?: (screen: string) => void;
}

// ── Status Chip ──────────────────────────────────────────────
function CertStatusChip({ status }: { status: CertificateStatus }) {
  const config: Record<CertificateStatus, { label: string; bg: string; text: string; icon: string }> = {
    'Not Uploaded': { label: 'Certificate Missing', bg: '#FFFBEB', text: '#D97706', icon: 'time-outline' },
    'Uploaded':     { label: 'Certificate Uploaded', bg: '#F0FDF4', text: '#16A34A', icon: 'checkmark-circle' },
    'Correction Required': { label: 'Correction Required', bg: '#FFF7ED', text: '#EA580C', icon: 'alert-circle-outline' },
    'Verified':     { label: 'Verified', bg: '#EFF6FF', text: '#2563EB', icon: 'shield-checkmark' },
  };
  const c = config[status];
  return (
    <View style={[styles.statusChip, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon as any} size={12} color={c.text} style={{ marginRight: 4 }} />
      <Text style={[styles.statusChipText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

export default function TeamLeaderMonitorScreen({
  teamAchievementId,
  onGoBack,
  onNavigate,
}: TeamLeaderMonitorScreenProps) {
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t: number) => t + 1));
  }, []);

  const teamAchievement: TeamAchievement | undefined = getTeamAchievementById(teamAchievementId);
  const [showCommonProofs, setShowCommonProofs] = useState(false);

  if (!teamAchievement) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
          <Text style={styles.errorText}>Team achievement not found.</Text>
          <TouchableOpacity style={styles.errorBackBtn} onPress={onGoBack}>
            <Text style={styles.errorBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = getCertificateProgress(teamAchievementId);
  const missingMembers = getMissingCertificateMembers(teamAchievementId);

  const handleSendReminder = (member: TeamAchievementMember) => {
    Alert.alert(
      'Reminder Sent',
      `A reminder has been sent to ${member.studentName} to upload their certificate.`,
      [{ text: 'OK' }]
    );
  };

  const progressPct = progress.total > 0 ? (progress.uploaded / progress.total) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Team Achievement</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {teamAchievement.teamName} • Monitor
          </Text>
        </View>
        <View style={styles.teamBadge}>
          <Text style={styles.teamBadgeText}>LEAD</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Card ── */}
        <LinearGradient
          colors={['#2563EB', '#4338CA', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroLabelRow}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="ribbon" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabelText}>TEAM ACHIEVEMENT</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{teamAchievement.result}</Text>
            </View>
          </View>

          <Text style={styles.heroTeamName}>{teamAchievement.teamName}</Text>
          <Text style={styles.heroEventName}>{teamAchievement.eventName}</Text>

          <View style={styles.heroDivider} />

          {/* Progress */}
          <View style={styles.heroProgressRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroProgressLabel}>Individual Certificates</Text>
              <View style={styles.heroProgressBarTrack}>
                <View style={[styles.heroProgressBarFill, { width: `${progressPct}%` }]} />
              </View>
            </View>
            <View style={styles.heroProgressPill}>
              <Text style={styles.heroProgressPillText}>
                {progress.uploaded} / {progress.total} Uploaded
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Missing Certificate Alert ── */}
        {missingMembers.length > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertIconRow}>
              <Ionicons name="time-outline" size={18} color="#D97706" style={{ marginRight: 8 }} />
              <Text style={styles.alertTitle}>
                {missingMembers.length} member{missingMembers.length > 1 ? 's' : ''} yet to upload
              </Text>
            </View>
            {missingMembers.map((m) => (
              <Text key={m.id} style={styles.alertMemberName}>• {m.studentName}</Text>
            ))}
          </View>
        )}

        {/* ── Event Details ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event Details</Text>
          <View style={styles.detailsGrid}>
            {[
              { label: 'Event', value: teamAchievement.eventName },
              { label: 'Organizer', value: teamAchievement.organizer },
              { label: 'Type', value: teamAchievement.achievementType },
              { label: 'Level', value: teamAchievement.level, highlight: '#2563EB' },
              { label: 'Date', value: teamAchievement.eventDate },
              { label: 'Semester', value: teamAchievement.semester },
              { label: 'Result', value: teamAchievement.result, highlight: '#16A34A' },
              ...(teamAchievement.cashPrize
                ? [{ label: 'Cash Prize', value: teamAchievement.cashPrize, highlight: '#16A34A' }]
                : []),
            ].map(({ label, value, highlight }) => (
              <View key={label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    highlight ? { color: highlight, fontWeight: '700' } : null,
                  ]}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Common Proofs ── */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.proofToggleRow}
            activeOpacity={0.7}
            onPress={() => setShowCommonProofs(!showCommonProofs)}
          >
            <View style={styles.proofToggleLeft}>
              <View style={styles.proofIconBox}>
                <Ionicons name="folder-open-outline" size={16} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.proofToggleTitle}>Common Team Proofs</Text>
                <Text style={styles.proofToggleSub}>
                  {teamAchievement.commonProofs.length} shared document
                  {teamAchievement.commonProofs.length !== 1 ? 's' : ''} — uploaded by you
                </Text>
              </View>
            </View>
            <Ionicons name={showCommonProofs ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
          </TouchableOpacity>

          {showCommonProofs && (
            <View style={styles.commonProofsContainer}>
              {teamAchievement.commonProofs.map((proof) => (
                <View key={proof.id} style={styles.proofRow}>
                  <View style={styles.proofFileIcon}>
                    <Ionicons
                      name={proof.fileType === 'pdf' ? 'document-text' : 'image'}
                      size={18}
                      color="#2563EB"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.proofLabel}>{proof.label}</Text>
                    <Text style={styles.proofFileName}>
                      {proof.fileName} • {proof.fileSize}
                    </Text>
                  </View>
                  <View style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Member Certificate Status ── */}
        <View style={styles.card}>
          <View style={styles.membersHeader}>
            <Text style={styles.cardTitle}>Individual Certificates</Text>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>
                {progress.uploaded} / {progress.total} Uploaded
              </Text>
            </View>
          </View>

          {teamAchievement.members.map((member) => {
            const isMissing =
              member.certificateStatus === 'Not Uploaded' ||
              member.certificateStatus === 'Correction Required';

            return (
              <View
                key={member.id}
                style={[
                  styles.memberRow,
                  isMissing && styles.memberRowMissing,
                ]}
              >
                {/* Avatar */}
                <View
                  style={[
                    styles.memberAvatar,
                    member.certificateStatus === 'Uploaded' || member.certificateStatus === 'Verified'
                      ? styles.memberAvatarUploaded
                      : styles.memberAvatarMissing,
                  ]}
                >
                  <Text style={styles.memberAvatarText}>
                    {member.studentName.charAt(0)}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.memberInfoCol}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.studentName}</Text>
                    {member.role === 'team_leader' && (
                      <View style={styles.leaderTag}>
                        <Text style={styles.leaderTagText}>You</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.memberRollRole}>
                    {member.rollNumber} • {getRoleLabel(member.role)}
                  </Text>
                  <CertStatusChip status={member.certificateStatus} />
                </View>

                {/* Reminder (only for missing, and only for non-self members) */}
                {isMissing && member.role !== 'team_leader' && (
                  <TouchableOpacity
                    style={styles.reminderBtn}
                    activeOpacity={0.7}
                    onPress={() => handleSendReminder(member)}
                  >
                    <Ionicons name="notifications-outline" size={14} color="#D97706" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {/* Reminder legend */}
          {missingMembers.length > 0 && (
            <View style={styles.reminderLegend}>
              <Ionicons name="notifications-outline" size={13} color="#D97706" style={{ marginRight: 5 }} />
              <Text style={styles.reminderLegendText}>
                Tap the bell icon to remind a member to upload their certificate.
              </Text>
            </View>
          )}

          {/* ── Step 22 & Step 17 Test Simulation Helper Bar ── */}
          <View style={styles.simContainer}>
            <Text style={styles.simTitle}>TEST FLOW SIMULATION (STEP 22 & 17)</Text>
            <View style={styles.simBtnRow}>
              <TouchableOpacity
                style={[styles.simBtn, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}
                activeOpacity={0.8}
                onPress={() => simulateMemberUploads(teamAchievement.id)}
              >
                <Ionicons name="people-outline" size={14} color="#4338CA" style={{ marginRight: 4 }} />
                <Text style={[styles.simBtnText, { color: '#4338CA' }]}>Simulate 3 Uploads (4/5)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.simBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
                activeOpacity={0.8}
                onPress={() => simulateSathishkumarUpload(teamAchievement.id)}
              >
                <Ionicons name="checkmark-done" size={14} color="#16A34A" style={{ marginRight: 4 }} />
                <Text style={[styles.simBtnText, { color: '#16A34A' }]}>Sathishkumar Upload (5/5)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.simResetBtn}
              activeOpacity={0.8}
              onPress={() => resetTeamAchievements()}
            >
              <Ionicons name="refresh" size={12} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.simResetText}>Reset to Initial State (1/5)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <StudentBottomTab
        activeTab="achievements"
        onNavigate={(tab) => {
          if (tab === 'home') onGoBack();
          else if (onNavigate) onNavigate(tab);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 15, color: '#DC2626', fontWeight: '600', marginTop: 12, textAlign: 'center' },
  errorBackBtn: { marginTop: 20, backgroundColor: '#2563EB', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  errorBackText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },

  headerBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  headerTitleCol: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 1 },
  teamBadge: {
    backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  teamBadgeText: { fontSize: 10, fontWeight: '800', color: '#1D4ED8' },

  container: { flex: 1 },
  scrollContent: { padding: 16 },

  heroCard: {
    borderRadius: 20, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroLabelRow: { flexDirection: 'row', alignItems: 'center' },
  heroIconCircle: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  heroLabelText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  heroBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  heroTeamName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  heroEventName: { fontSize: 13, color: '#E0E7FF' },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 12 },
  heroProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroProgressLabel: { fontSize: 11, color: '#C7D2FE', marginBottom: 6 },
  heroProgressBarTrack: {
    height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden',
  },
  heroProgressBarFill: { height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  heroProgressPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  heroProgressPillText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  alertCard: {
    backgroundColor: '#FFFBEB', borderRadius: 14, borderWidth: 1,
    borderColor: '#FEF3C7', padding: 12, marginBottom: 12,
  },
  alertIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  alertTitle: { fontSize: 13, fontWeight: '700', color: '#D97706' },
  alertMemberName: { fontSize: 12, color: '#92400E', marginLeft: 8, lineHeight: 18 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  detailsGrid: { gap: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#64748B' },
  detailValue: { fontSize: 12, fontWeight: '600', color: '#0F172A', maxWidth: '60%', textAlign: 'right' },

  proofToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  proofToggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  proofIconBox: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  proofToggleTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  proofToggleSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  commonProofsContainer: { marginTop: 12 },
  proofRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#E2E8F0',
  },
  proofFileIcon: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  proofLabel: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  proofFileName: { fontSize: 11, color: '#64748B', marginTop: 1 },
  viewBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  viewBtnText: { fontSize: 11, fontWeight: '700', color: '#2563EB' },

  membersHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  progressPill: {
    backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  progressPillText: { fontSize: 11, fontWeight: '700', color: '#2563EB' },

  memberRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1,
    borderColor: '#E2E8F0', padding: 12, marginBottom: 8,
  },
  memberRowMissing: { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
  memberAvatar: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  memberAvatarUploaded: { backgroundColor: '#DCFCE7' },
  memberAvatarMissing: { backgroundColor: '#FEF3C7' },
  memberAvatarText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  memberInfoCol: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  memberName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginRight: 6 },
  leaderTag: {
    backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 1,
    borderRadius: 4, borderWidth: 1, borderColor: '#BFDBFE',
  },
  leaderTagText: { fontSize: 9, fontWeight: '800', color: '#1D4ED8' },
  memberRollRole: { fontSize: 11, color: '#64748B', marginBottom: 5 },

  statusChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  statusChipText: { fontSize: 10, fontWeight: '700' },

  reminderBtn: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFFBEB',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FEF3C7', marginLeft: 8,
  },
  reminderLegend: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBEB', borderRadius: 8, padding: 8, marginTop: 8,
  },
  reminderLegendText: { fontSize: 11, color: '#92400E', flex: 1, lineHeight: 15 },
  simContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  simTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  simBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  simResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  simResetText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
