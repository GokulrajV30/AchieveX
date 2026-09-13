// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Team View (Read-Only Monitor)
//
// PURPOSE: Proctor monitoring screen for team achievements.
//
// IMPORTANT CONSTRAINT: Proctor is MONITOR ONLY.
// There are ZERO approve/reject/verify buttons on this screen.
// Proctor sees: which team, what event, who is the leader,
// who uploaded their certificate, who has not.
//
// Certificate Missing is shown in amber — NOT red.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import {
  getTeamAchievementById,
  getCertificateProgress,
  getMissingCertificateMembers,
  getRoleLabel,
  subscribeTeamAchievements,
  type TeamAchievement,
  type CertificateStatus,
} from '../../../data/teamAchievementData';

interface ProctorTeamViewProps {
  teamAchievementId: string;
  onGoBack: () => void;
}

// ── Status Chip ──────────────────────────────────────────────
// Amber for missing, green for uploaded — no red
function CertStatusChip({ status }: { status: CertificateStatus }) {
  if (status === 'Uploaded' || status === 'Verified') {
    return (
      <View style={[styles.statusChip, { backgroundColor: '#F0FDF4' }]}>
        <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 4 }} />
        <Text style={[styles.statusChipText, { color: '#16A34A' }]}>
          {status === 'Verified' ? 'Verified' : 'Uploaded'}
        </Text>
      </View>
    );
  }
  if (status === 'Correction Required') {
    return (
      <View style={[styles.statusChip, { backgroundColor: '#FFF7ED' }]}>
        <Ionicons name="alert-circle-outline" size={12} color="#EA580C" style={{ marginRight: 4 }} />
        <Text style={[styles.statusChipText, { color: '#EA580C' }]}>Correction Required</Text>
      </View>
    );
  }
  // 'Not Uploaded' — amber, NOT red
  return (
    <View style={[styles.statusChip, { backgroundColor: '#FFFBEB' }]}>
      <Ionicons name="time-outline" size={12} color="#D97706" style={{ marginRight: 4 }} />
      <Text style={[styles.statusChipText, { color: '#D97706' }]}>Certificate Missing</Text>
    </View>
  );
}

export default function ProctorTeamView({ teamAchievementId, onGoBack }: ProctorTeamViewProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t) => t + 1));
  }, []);

  const teamAchievement: TeamAchievement | undefined = getTeamAchievementById(teamAchievementId);

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
  const progressPct = progress.total > 0 ? (progress.uploaded / progress.total) * 100 : 0;
  const missingMembers = getMissingCertificateMembers(teamAchievementId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header — clearly labeled "Monitor Only" */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Team Achievement</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {teamAchievement.teamName} • {teamAchievement.eventName}
          </Text>
        </View>
        <View style={styles.monitorBadge}>
          <Text style={styles.monitorBadgeText}>MONITOR</Text>
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
                <Ionicons name="people" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabelText}>TEAM ACHIEVEMENT</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{teamAchievement.level}</Text>
            </View>
          </View>

          <Text style={styles.heroTeamName}>{teamAchievement.teamName}</Text>
          <Text style={styles.heroEventName}>{teamAchievement.eventName}</Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <View>
              <Text style={styles.heroLeaderLabel}>Team Leader</Text>
              <Text style={styles.heroLeaderName}>{teamAchievement.teamLeaderName}</Text>
            </View>
            <View style={styles.heroProgressPill}>
              <Text style={styles.heroProgressText}>
                {progress.uploaded} / {progress.total} Uploaded
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Monitor-only notice ── */}
        <View style={styles.monitorNotice}>
          <Ionicons name="eye-outline" size={14} color="#64748B" style={{ marginRight: 8 }} />
          <Text style={styles.monitorNoticeText}>
            You are viewing this team as monitor. No actions are available.
          </Text>
        </View>

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

        {/* ── Certificate Status Section ── */}
        <View style={styles.card}>
          <View style={styles.membersHeader}>
            <Text style={styles.cardTitle}>Certificate Status</Text>
            <View
              style={[
                styles.progressPill,
                missingMembers.length > 0 ? styles.progressPillAmber : styles.progressPillGreen,
              ]}
            >
              <Text
                style={[
                  styles.progressPillText,
                  { color: missingMembers.length > 0 ? '#D97706' : '#16A34A' },
                ]}
              >
                {progress.uploaded} / {progress.total} Uploaded
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={{ height: 12 }} />

          {/* Member rows */}
          {teamAchievement.members.map((member) => {
            const isMissing =
              member.certificateStatus === 'Not Uploaded' ||
              member.certificateStatus === 'Correction Required';

            return (
              <View
                key={member.id}
                style={[styles.memberRow, isMissing && styles.memberRowAmber]}
              >
                {/* Avatar */}
                <View
                  style={[
                    styles.memberAvatar,
                    isMissing ? styles.memberAvatarAmber : styles.memberAvatarGreen,
                  ]}
                >
                  <Text style={[styles.memberAvatarText, { color: isMissing ? '#D97706' : '#16A34A' }]}>
                    {member.studentName.charAt(0)}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.memberInfoCol}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.studentName}</Text>
                    {member.role === 'team_leader' && (
                      <View style={styles.leaderTag}>
                        <Text style={styles.leaderTagText}>Leader</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.memberRollRole}>
                    {member.rollNumber} • {getRoleLabel(member.role)}
                  </Text>
                </View>

                {/* Status chip */}
                <CertStatusChip status={member.certificateStatus} />
              </View>
            );
          })}

          {/* Missing summary */}
          {missingMembers.length > 0 && (
            <View style={styles.missingNotice}>
              <Ionicons
                name="time-outline"
                size={14}
                color="#D97706"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.missingNoticeText}>
                {missingMembers.map((m) => m.studentName).join(', ')}{' '}
                {missingMembers.length === 1 ? 'has' : 'have'} not uploaded their certificate yet.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
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
  monitorBadge: {
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  monitorBadgeText: { fontSize: 10, fontWeight: '800', color: '#475569' },

  container: { flex: 1 },
  scrollContent: { padding: 16 },

  heroCard: {
    borderRadius: 20, padding: 16, marginBottom: 12,
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
  heroBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroLeaderLabel: { fontSize: 10, color: '#C7D2FE', marginBottom: 2 },
  heroLeaderName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  heroProgressPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  heroProgressText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  monitorNotice: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 12,
  },
  monitorNoticeText: { fontSize: 12, color: '#64748B', flex: 1 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  detailsGrid: { gap: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#64748B' },
  detailValue: { fontSize: 12, fontWeight: '600', color: '#0F172A', maxWidth: '60%', textAlign: 'right' },

  membersHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  progressPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  progressPillAmber: { backgroundColor: '#FFFBEB' },
  progressPillGreen: { backgroundColor: '#F0FDF4' },
  progressPillText: { fontSize: 11, fontWeight: '700' },

  progressBarTrack: {
    height: 6, borderRadius: 3, backgroundColor: '#F1F5F9', overflow: 'hidden',
  },
  progressBarFill: { height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },

  memberRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1,
    borderColor: '#E2E8F0', padding: 12, marginBottom: 8,
  },
  memberRowAmber: { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
  memberAvatar: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  memberAvatarGreen: { backgroundColor: '#DCFCE7' },
  memberAvatarAmber: { backgroundColor: '#FEF3C7' },
  memberAvatarText: { fontSize: 14, fontWeight: '700' },
  memberInfoCol: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  memberName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginRight: 6 },
  leaderTag: {
    backgroundColor: '#FEF3C7', paddingHorizontal: 5, paddingVertical: 1,
    borderRadius: 4,
  },
  leaderTagText: { fontSize: 9, fontWeight: '800', color: '#B45309' },
  memberRollRole: { fontSize: 11, color: '#64748B' },

  statusChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start',
  },
  statusChipText: { fontSize: 10, fontWeight: '700' },

  missingNotice: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FFFBEB', borderRadius: 10, padding: 10, marginTop: 4,
  },
  missingNoticeText: { fontSize: 12, color: '#92400E', flex: 1, lineHeight: 16 },
});
