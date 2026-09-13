// ─────────────────────────────────────────────────────────────
// AchieveX — Team Member Certificate Upload Screen
//
// PURPOSE: A SIMPLE, FOCUSED screen for team members who need
// to upload ONLY their individual certificate.
//
// This screen intentionally does NOT show the full achievement form.
// The common event details and team proofs were already submitted
// by the Team Leader. The member only needs to upload their cert.
//
// Flow:
//   Notification → Tap "Upload Certificate" → This screen → Submit
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getTeamAchievementById,
  getMemberRecord,
  getCertificateStatusLabel,
  getRoleLabel,
  updateMemberCertificate,
  subscribeTeamAchievements,
  getCertificateProgress,
  type TeamAchievement,
  type TeamAchievementMember,
} from '../../data/teamAchievementData';
import StudentBottomTab from '../StudentBottomTab';

interface TeamMemberCertificateScreenProps {
  teamAchievementId: string;
  currentStudentId: string;    // the logged-in member's student ID
  onGoBack: () => void;
  onSubmitted?: () => void;
  onNavigate?: (screen: string) => void;
}

export default function TeamMemberCertificateScreen({
  teamAchievementId,
  currentStudentId,
  onGoBack,
  onSubmitted,
  onNavigate,
}: TeamMemberCertificateScreenProps) {
  const [, setTick] = useState(0);

  React.useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t: number) => t + 1));
  }, []);

  const teamAchievement: TeamAchievement | undefined =
    getTeamAchievementById(teamAchievementId) || getTeamAchievementById('TA-SIH-2026-001');
  const memberRecord: TeamAchievementMember | undefined =
    (teamAchievement && currentStudentId
      ? getMemberRecord(teamAchievement.id, currentStudentId)
      : undefined) ||
    teamAchievement?.members.find((m) => m.studentId === '23ci015') ||
    teamAchievement?.members[1];

  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
  } | null>(
    memberRecord?.individualCertificate
      ? {
          name: memberRecord.individualCertificate.fileName,
          size: memberRecord.individualCertificate.fileSize,
        }
      : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [showCommonProofs, setShowCommonProofs] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!teamAchievement || !memberRecord) {
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

  const alreadyUploaded =
    memberRecord.certificateStatus === 'Uploaded' ||
    memberRecord.certificateStatus === 'Verified';

  const handleSimulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadedFile({
        name: `${memberRecord.studentName.replace(/\s+/g, '_')}_SIH2026_Certificate.pdf`,
        size: '1.2 MB',
      });
    }, 600);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = () => {
    if (!uploadedFile) {
      Alert.alert(
        'Certificate Required',
        'Please upload your individual certificate before submitting.'
      );
      return;
    }
    setSubmitting(true);

    updateMemberCertificate(teamAchievement.id, memberRecord.studentId, {
      fileName: uploadedFile.name,
      fileType: 'pdf',
      fileSize: uploadedFile.size,
      uploadedAt: 'Just now',
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const progress = getCertificateProgress(teamAchievementId);

  // ── Success Screen ──────────────────────────────────────────
  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.successContainer}>
          <LinearGradient
            colors={['#DCFCE7', '#F0FDF4']}
            style={styles.successIconCircle}
          >
            <Ionicons name="checkmark-circle" size={56} color="#16A34A" />
          </LinearGradient>
          <Text style={styles.successTitle}>Certificate Added</Text>
          <Text style={styles.successSubtitle}>
            Your certificate is ready for review.
          </Text>
          <Text style={styles.successNote}>
            Team {teamAchievement.teamName} • {progress.uploaded} / {progress.total} Uploaded{'\n'}
            The AC will verify your record once all certificates are collected.
          </Text>
          <TouchableOpacity
            style={styles.successBtn}
            activeOpacity={0.85}
            onPress={() => {
              if (onSubmitted) onSubmitted();
              else onGoBack();
            }}
          >
            <Text style={styles.successBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Screen ─────────────────────────────────────────────
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
            {teamAchievement.teamName} • {teamAchievement.eventName}
          </Text>
        </View>
        <View style={styles.teamBadge}>
          <Text style={styles.teamBadgeText}>TEAM</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Summary Card (Read-only) ── */}
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

          <Text style={styles.heroEventName}>{teamAchievement.eventName}</Text>
          <Text style={styles.heroType}>
            {teamAchievement.achievementType} • {teamAchievement.semester}
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <View>
              <Text style={styles.heroTeamLabel}>Team</Text>
              <Text style={styles.heroTeamName}>{teamAchievement.teamName}</Text>
            </View>
            <View style={styles.heroRoleTag}>
              <Text style={styles.heroRoleTagText}>
                {getRoleLabel(memberRecord.role)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Event Details (Read-only) ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event</Text>
              <Text style={styles.detailValue}>{teamAchievement.eventName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Organizer</Text>
              <Text style={styles.detailValue}>{teamAchievement.organizer}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Level</Text>
              <Text style={[styles.detailValue, { color: '#2563EB', fontWeight: '700' }]}>
                {teamAchievement.level}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Result</Text>
              <Text style={[styles.detailValue, { color: '#16A34A', fontWeight: '700' }]}>
                {teamAchievement.result}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{teamAchievement.eventDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Semester</Text>
              <Text style={styles.detailValue}>{teamAchievement.semester}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Team Leader</Text>
              <Text style={styles.detailValue}>{teamAchievement.teamLeaderName}</Text>
            </View>
            {teamAchievement.cashPrize && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cash Prize</Text>
                <Text style={[styles.detailValue, { color: '#16A34A', fontWeight: '700' }]}>
                  {teamAchievement.cashPrize}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Common Proofs (Collapsible, Read-only) ── */}
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
                <Text style={styles.proofToggleTitle}>Team Common Proofs</Text>
                <Text style={styles.proofToggleSub}>
                  {teamAchievement.commonProofs.length} shared document
                  {teamAchievement.commonProofs.length !== 1 ? 's' : ''} • Uploaded by Team Leader
                </Text>
              </View>
            </View>
            <Ionicons
              name={showCommonProofs ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748B"
            />
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
              <View style={styles.readOnlyNotice}>
                <Ionicons name="lock-closed-outline" size={13} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.readOnlyText}>
                  These are read-only. Uploaded by Team Leader.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Individual Certificate Section ── */}
        <View style={styles.card}>
          <View style={styles.certSectionHeader}>
            <View style={styles.certSectionIcon}>
              <Ionicons name="document-text" size={16} color="#16A34A" />
            </View>
            <Text style={styles.certSectionTitle}>YOUR INDIVIDUAL CERTIFICATE</Text>
          </View>

          <Text style={styles.certInstructions}>
            Upload your personal certificate for{' '}
            <Text style={{ fontWeight: '700' }}>{teamAchievement.eventName}</Text>.
            Each team member uploads their own separately.
          </Text>

          {/* Already uploaded state */}
          {alreadyUploaded && !uploadedFile && (
            <View style={styles.alreadyUploadedBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" style={{ marginRight: 8 }} />
              <Text style={styles.alreadyUploadedText}>
                {getCertificateStatusLabel(memberRecord.certificateStatus)}
              </Text>
            </View>
          )}

          {/* Upload slot */}
          {!uploadedFile ? (
            <TouchableOpacity
              style={styles.uploadZone}
              activeOpacity={0.7}
              onPress={handleSimulateUpload}
              disabled={uploading}
            >
              {uploading ? (
                <View style={styles.uploadingRow}>
                  <ActivityIndicator size="small" color="#2563EB" />
                  <Text style={styles.uploadingText}>Uploading certificate...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="document-text-outline" size={28} color="#2563EB" />
                  </View>
                  <Text style={styles.uploadTitle}>Tap to select your certificate</Text>
                  <Text style={styles.uploadFormats}>Accepted: PDF, JPG, JPEG, PNG</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedFileCard}>
              <View style={styles.uploadedFileIcon}>
                <Ionicons name="document-text" size={22} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.uploadedFileName} numberOfLines={1}>
                  {uploadedFile.name}
                </Text>
                <Text style={styles.uploadedFileSize}>{uploadedFile.size}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" style={{ marginRight: 8 }} />
              {!alreadyUploaded && (
                <TouchableOpacity onPress={handleRemoveFile} style={{ padding: 6 }}>
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      {!alreadyUploaded && (
        <View style={styles.footerBar}>
          <TouchableOpacity
            style={[styles.submitBtn, (!uploadedFile || submitting) && styles.submitBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!uploadedFile || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Submit Certificate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  errorBackBtn: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  errorBackText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },

  // Header
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
  headerTitleCol: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 1 },
  teamBadge: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamBadgeText: { fontSize: 10, fontWeight: '800', color: '#B45309' },

  container: { flex: 1 },
  scrollContent: { padding: 16 },

  // Hero Card
  heroCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroLabelRow: { flexDirection: 'row', alignItems: 'center' },
  heroIconCircle: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  heroLabelText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  heroBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  heroEventName: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  heroType: { fontSize: 12, color: '#E0E7FF' },
  heroDivider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 10,
  },
  heroBottomRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  heroTeamLabel: { fontSize: 10, color: '#C7D2FE', marginBottom: 2 },
  heroTeamName: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  heroRoleTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  heroRoleTagText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12,
  },
  detailsGrid: { gap: 8 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  detailLabel: { fontSize: 12, color: '#64748B' },
  detailValue: { fontSize: 12, fontWeight: '600', color: '#0F172A', maxWidth: '60%', textAlign: 'right' },

  // Common Proofs toggle
  proofToggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  proofToggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  proofIconBox: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  proofToggleTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  proofToggleSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  commonProofsContainer: { marginTop: 12 },
  proofRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 6,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  proofFileIcon: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  proofLabel: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  proofFileName: { fontSize: 11, color: '#64748B', marginTop: 1 },
  viewBtn: {
    backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  viewBtnText: { fontSize: 11, fontWeight: '700', color: '#2563EB' },
  readOnlyNotice: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 8, padding: 8, marginTop: 4,
  },
  readOnlyText: { fontSize: 11, color: '#64748B', flex: 1 },

  // Certificate Section
  certSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  certSectionIcon: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  certSectionTitle: { fontSize: 11, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5 },
  certInstructions: {
    fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 14,
  },
  alreadyUploadedBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#DCFCE7', borderRadius: 10, padding: 10, marginBottom: 12,
  },
  alreadyUploadedText: { fontSize: 13, fontWeight: '700', color: '#16A34A' },

  // Upload zone
  uploadZone: {
    borderWidth: 1.5, borderColor: '#D1D5DB', borderStyle: 'dashed',
    borderRadius: 14, backgroundColor: '#F8FAFC',
    paddingVertical: 28, alignItems: 'center', justifyContent: 'center',
  },
  uploadingRow: { flexDirection: 'row', alignItems: 'center' },
  uploadingText: { fontSize: 14, fontWeight: '600', color: '#2563EB', marginLeft: 10 },
  uploadIconCircle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  uploadFormats: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },

  // Uploaded file card
  uploadedFileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#BBF7D0',
    borderRadius: 14, padding: 12,
  },
  uploadedFileIcon: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  uploadedFileName: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  uploadedFileSize: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // Footer / Submit
  footerBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  submitBtn: {
    backgroundColor: '#2563EB', borderRadius: 14, height: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#93C5FD' },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // Success Screen
  successContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  successIconCircle: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  successTitle: {
    fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 10, textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22, marginBottom: 16,
  },
  successNote: {
    fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18,
    backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 28,
  },
  successBtn: {
    backgroundColor: '#2563EB', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 40, alignItems: 'center',
  },
  successBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
