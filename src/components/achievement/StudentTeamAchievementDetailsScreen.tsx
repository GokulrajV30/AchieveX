// ─────────────────────────────────────────────────────────────
// AchieveX — Student Team Achievement Details Screen
// Unified, compact screen for both Team Leader and Team Members.
// Structure is identical for everyone; only "YOUR CERTIFICATE"
// reflects the logged-in student's individual certificate status.
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
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getTeamAchievementById,
  getCertificateProgress,
  subscribeTeamAchievements,
  simulateMemberUploads,
  simulateSathishkumarUpload,
  resetTeamAchievements,
  updateMemberCertificate,
  type TeamAchievement,
  type TeamAchievementMember,
  type TeamCommonProof,
} from '../../data/teamAchievementData';

interface StudentTeamAchievementDetailsScreenProps {
  teamAchievementId?: string;
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectPreviewMember?: (studentId: string) => void;
  currentStudentId?: string;
}

export default function StudentTeamAchievementDetailsScreen({
  teamAchievementId = 'TA-SIH-2026-001',
  onGoBack,
  onNavigate,
  onSelectPreviewMember,
  currentStudentId = '23ci011',
}: StudentTeamAchievementDetailsScreenProps) {
  const [, setTick] = useState(0);

  // Active persona state for dev simulation if prop is static
  const [activePersonaId, setActivePersonaId] = useState<string>(currentStudentId);

  // Subscribe to centralized reactive store
  useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t: number) => t + 1));
  }, []);

  // Update active persona if prop changes
  useEffect(() => {
    setActivePersonaId(currentStudentId);
  }, [currentStudentId]);

  const activeStudentNorm = (activePersonaId || '23ci011').toLowerCase();
  const team: TeamAchievement | undefined =
    getTeamAchievementById(teamAchievementId) || getTeamAchievementById('TA-SIH-2026-001');

  // Modal states
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [selectedProof, setSelectedProof] = useState<{
    title: string;
    fileName: string;
    fileSize?: string;
    fileType?: string;
    isIndividual?: boolean;
    studentName?: string;
  } | null>(null);

  if (!team) {
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

  // Identify current logged-in student record
  const currentMember: TeamAchievementMember =
    team.members.find(
      (m) =>
        m.studentId.toLowerCase() === activeStudentNorm ||
        m.rollNumber.toLowerCase() === activeStudentNorm
    ) || team.members[0];

  const isMyCertUploaded =
    currentMember.certificateStatus === 'Uploaded' ||
    currentMember.certificateStatus === 'Verified';

  const myCertFileName =
    currentMember.individualCertificate?.fileName ||
    `${currentMember.studentName.split(' ')[0].toLowerCase()}_certificate.pdf`;

  const progress = getCertificateProgress(team.id);

  // Handlers for viewing proofs
  const handleOpenCommonProof = (proof: TeamCommonProof) => {
    setSelectedProof({
      title: proof.label,
      fileName: proof.fileName,
      fileSize: proof.fileSize,
      fileType: proof.fileType,
      isIndividual: false,
    });
    setProofModalVisible(true);
  };

  const handleOpenMyCertificate = () => {
    setSelectedProof({
      title: 'Your Individual Certificate',
      fileName: myCertFileName,
      fileSize: currentMember.individualCertificate?.fileSize || '1.2 MB',
      fileType: 'pdf',
      isIndividual: true,
      studentName: currentMember.studentName,
    });
    setProofModalVisible(true);
  };

  const handleOpenMemberCert = (member: TeamAchievementMember) => {
    const isUploaded =
      member.certificateStatus === 'Uploaded' || member.certificateStatus === 'Verified';
    if (!isUploaded) {
      Alert.alert(
        'Certificate Pending',
        `${member.studentName} has not uploaded their individual certificate yet.`
      );
      return;
    }
    const certFile =
      member.individualCertificate?.fileName ||
      `${member.studentName.split(' ')[0].toLowerCase()}_certificate.pdf`;

    setSelectedProof({
      title: `${member.studentName}'s Certificate`,
      fileName: certFile,
      fileSize: member.individualCertificate?.fileSize || '1.1 MB',
      fileType: 'pdf',
      isIndividual: true,
      studentName: member.studentName,
    });
    setProofModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Team Details</Text>
            <Text style={styles.headerSubtitle}>{team.teamName}</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. ACHIEVEMENT SUMMARY (COMPACT & PREMIUM)
          ════════════════════════════════════════════════ */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEventTitle}>{team.eventName}</Text>

            <View style={styles.tagRow}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{team.achievementType}</Text>
              </View>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{team.level}</Text>
              </View>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{team.semester}</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Result</Text>
              <View style={styles.resultBadge}>
                <Ionicons name="trophy" size={13} color="#16A34A" style={{ marginRight: 4 }} />
                <Text style={styles.resultBadgeText}>{team.result}</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              2. TEAM (COMPACT)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="people-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Team</Text>
            </View>

            <View style={styles.teamCompactRow}>
              <View style={styles.teamLeaderCol}>
                <Text style={styles.metaSubLabel}>Team Leader</Text>
                <Text style={styles.metaMainText}>{team.teamLeaderName}</Text>
              </View>
              <View style={styles.teamMetaDivider} />
              <View style={styles.teamCountCol}>
                <Text style={styles.metaSubLabel}>Members</Text>
                <Text style={styles.metaMainText}>{team.members.length}</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              3. COMMON PROOFS (COMPACT ROWS)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="document-attach-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Common Proofs</Text>
            </View>
            <Text style={styles.helperSubtext}>
              Uploaded once by the Team Leader.
            </Text>

            <View style={styles.proofsContainer}>
              {team.commonProofs.map((proof, idx) => (
                <View
                  key={proof.id}
                  style={[
                    styles.proofRow,
                    idx < team.commonProofs.length - 1 && styles.proofRowBorder,
                  ]}
                >
                  <View style={styles.proofLeftCol}>
                    <Ionicons
                      name={proof.fileType === 'pdf' ? 'document-text-outline' : 'image-outline'}
                      size={16}
                      color="#475569"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.proofLabelText}>{proof.label}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    activeOpacity={0.7}
                    onPress={() => handleOpenCommonProof(proof)}
                  >
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. YOUR CERTIFICATE (PERSONALIZED SECTION)
          ════════════════════════════════════════════════ */}
          <View style={styles.yourCertCard}>
            <View style={styles.yourCertHeaderRow}>
              <Text style={styles.yourCertTitle}>YOUR CERTIFICATE</Text>
              <Text style={styles.yourCertUserHint}>
                {currentMember.studentName} ({currentMember.role === 'team_leader' ? 'Leader' : 'Member'})
              </Text>
            </View>

            {isMyCertUploaded ? (
              // ── IF CURRENT STUDENT HAS UPLOADED ──
              <View style={styles.certUploadedBox}>
                <View style={styles.certStatusHeaderRow}>
                  <View style={styles.certCheckCircle}>
                    <Ionicons name="checkmark" size={14} color="#16A34A" />
                  </View>
                  <Text style={styles.certUploadedTitle}>Certificate Uploaded</Text>
                </View>

                <View style={styles.certFileActionRow}>
                  <View style={styles.certFileCol}>
                    <Ionicons name="document-text" size={16} color="#2563EB" style={{ marginRight: 6 }} />
                    <Text style={styles.certFileNameText} numberOfLines={1}>
                      {myCertFileName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewMyCertBtn}
                    activeOpacity={0.75}
                    onPress={handleOpenMyCertificate}
                  >
                    <Text style={styles.viewMyCertBtnText}>View</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.certVerificationRow}>
                  <Text style={styles.verificationLabel}>Status:</Text>
                  <View style={styles.verificationChip}>
                    <Ionicons name="time" size={11} color="#D97706" style={{ marginRight: 3 }} />
                    <Text style={styles.verificationChipText}>Pending Verification</Text>
                  </View>
                </View>
              </View>
            ) : (
              // ── IF CURRENT STUDENT HAS NOT UPLOADED ──
              <View style={styles.certRequiredBox}>
                <View style={styles.certStatusHeaderRow}>
                  <View style={styles.certAlertCircle}>
                    <Ionicons name="alert" size={13} color="#D97706" />
                  </View>
                  <Text style={styles.certRequiredTitle}>Certificate Required</Text>
                </View>

                <Text style={styles.certRequiredDesc}>
                  Upload your individual certificate to complete this team achievement.
                </Text>

                <TouchableOpacity
                  style={styles.uploadCertBtn}
                  activeOpacity={0.8}
                  onPress={() =>
                    onNavigate('teamMemberCertificate', {
                      teamAchievementId: team.id,
                      studentId: currentMember.studentId,
                    })
                  }
                >
                  <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.uploadCertBtnText}>Upload Certificate</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ════════════════════════════════════════════════
              5. TEAM CERTIFICATE STATUS (COMPACT ROWS)
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="ribbon-outline" size={16} color="#0F172A" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Team Certificates</Text>
              <View style={styles.statusCountPill}>
                <Text style={styles.statusCountText}>
                  {progress.uploaded} of {progress.total} Uploaded
                </Text>
              </View>
            </View>

            {/* Member compact rows */}
            <View style={styles.memberRowsList}>
              {team.members.map((member, idx) => {
                const isUploaded =
                  member.certificateStatus === 'Uploaded' ||
                  member.certificateStatus === 'Verified';
                const isLead = member.role === 'team_leader';
                const isCurrent = member.studentId.toLowerCase() === activeStudentNorm;

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberStatusRow,
                      idx < team.members.length - 1 && styles.memberRowBorder,
                      isCurrent && styles.memberRowCurrentHighlight,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleOpenMemberCert(member)}
                  >
                    {/* Status indicator: green check for uploaded, soft circle for pending */}
                    <View
                      style={[
                        styles.indicatorCircle,
                        isUploaded ? styles.indicatorUploaded : styles.indicatorPending,
                      ]}
                    >
                      {isUploaded ? (
                        <Ionicons name="checkmark" size={11} color="#16A34A" />
                      ) : (
                        <View style={styles.pendingDot} />
                      )}
                    </View>

                    {/* Member name & role */}
                    <View style={styles.memberNameCol}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text
                          style={[
                            styles.memberNameText,
                            isCurrent && { fontWeight: '800', color: '#1E3A8A' },
                          ]}
                        >
                          {member.studentName}
                        </Text>
                        {isLead && (
                          <View style={styles.leaderMiniBadge}>
                            <Text style={styles.leaderMiniBadgeText}>Leader</Text>
                          </View>
                        )}
                        {isCurrent && (
                          <View style={styles.youMiniBadge}>
                            <Text style={styles.youMiniBadgeText}>You</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Status label: Uploaded or Pending */}
                    <View style={styles.memberStatusCol}>
                      <Text
                        style={[
                          styles.memberStatusLabel,
                          isUploaded ? styles.statusUploadedColor : styles.statusPendingColor,
                        ]}
                      >
                        {isUploaded ? 'Uploaded' : 'Pending'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              DEV / DEMO TOOLBAR (COMPACT TESTING HELPER)
          ════════════════════════════════════════════════ */}
          <View style={styles.devCard}>
            <View style={styles.devHeader}>
              <View style={styles.devTag}>
                <Text style={styles.devTagText}>DEV / DEMO TOOLBAR</Text>
              </View>
              <Text style={styles.devHint}>Switch persona or test live updates:</Text>
            </View>

            <View style={styles.devPersonaRow}>
              <TouchableOpacity
                style={[
                  styles.devPersonaBtn,
                  activeStudentNorm === '23ci011' && styles.devPersonaBtnActive,
                ]}
                onPress={() => {
                  setActivePersonaId('23ci011');
                  if (onSelectPreviewMember) onSelectPreviewMember('23ci011');
                }}
              >
                <Text
                  style={[
                    styles.devPersonaBtnText,
                    activeStudentNorm === '23ci011' && styles.devPersonaBtnTextActive,
                  ]}
                >
                  Gokulraj (Leader)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.devPersonaBtn,
                  activeStudentNorm === '23ci015' && styles.devPersonaBtnActive,
                ]}
                onPress={() => {
                  setActivePersonaId('23ci015');
                  if (onSelectPreviewMember) onSelectPreviewMember('23ci015');
                }}
              >
                <Text
                  style={[
                    styles.devPersonaBtnText,
                    activeStudentNorm === '23ci015' && styles.devPersonaBtnTextActive,
                  ]}
                >
                  Mohamed (Member)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.devActionRow}>
              <TouchableOpacity
                style={styles.devActionChip}
                onPress={() => {
                  updateMemberCertificate(team.id, '23ci015', {
                    fileName: 'mohamed_certificate.pdf',
                    fileType: 'pdf',
                    fileSize: '1.2 MB',
                    uploadedAt: 'Today',
                  });
                  Alert.alert('Uploaded', 'Mohamed Aqdhas certificate uploaded (2/5)!');
                }}
              >
                <Ionicons name="flash" size={13} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={styles.devActionChipText}>+ Mohamed (2/5)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.devActionChip}
                onPress={() => {
                  simulateMemberUploads(team.id);
                  Alert.alert('Simulated 4/5', 'Mohamed, Karthikeyan, & Jeeva uploaded!');
                }}
              >
                <Text style={styles.devActionChipText}>⚡ 4/5</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.devActionChip}
                onPress={() => {
                  simulateSathishkumarUpload(team.id);
                  Alert.alert('Simulated 5/5', 'All 5 certificates uploaded!');
                }}
              >
                <Text style={styles.devActionChipText}>✓ 5/5</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.devActionChip, { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
                onPress={() => {
                  resetTeamAchievements();
                  Alert.alert('Reset', 'Reset to initial 1/5 state.');
                }}
              >
                <Text style={[styles.devActionChipText, { color: '#64748B' }]}>↺ Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* ════════════════════════════════════════════════
            PROOF PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={proofModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setProofModalVisible(false)}
        >
          <View style={styles.proofModalOverlay}>
            <View style={styles.proofModalCard}>
              <View style={styles.proofModalHeader}>
                <Text style={styles.proofModalTitle}>{selectedProof?.title || 'Proof Preview'}</Text>
                <TouchableOpacity onPress={() => setProofModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.proofModalBody}>
                <Ionicons
                  name={selectedProof?.fileType === 'pdf' ? 'document-text' : 'image'}
                  size={46}
                  color="#2563EB"
                />
                <Text style={styles.proofModalFileName}>{selectedProof?.fileName}</Text>
                {selectedProof?.fileSize && (
                  <Text style={styles.proofModalFileSize}>{selectedProof?.fileSize}</Text>
                )}

                <View
                  style={[
                    styles.proofModalTag,
                    selectedProof?.isIndividual
                      ? { backgroundColor: '#DCFCE7' }
                      : { backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <Ionicons
                    name={selectedProof?.isIndividual ? 'ribbon' : 'shield-checkmark'}
                    size={13}
                    color={selectedProof?.isIndividual ? '#16A34A' : '#2563EB'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.proofModalTagText,
                      { color: selectedProof?.isIndividual ? '#16A34A' : '#2563EB' },
                    ]}
                  >
                    {selectedProof?.isIndividual
                      ? `Verified Individual Certificate (${selectedProof?.studentName})`
                      : 'Official Common Team Proof'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.proofCloseBtn}
                onPress={() => setProofModalVisible(false)}
              >
                <Text style={styles.proofCloseBtnText}>Close Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 36,
  },

  // 1. Achievement Summary
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  summaryEventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
  },

  // Section Container Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  helperSubtext: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 10,
  },

  // 2. Team Section
  teamCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  teamLeaderCol: {
    flex: 1,
  },
  metaSubLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  metaMainText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  teamMetaDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  teamCountCol: {
    minWidth: 70,
  },

  // 3. Common Proofs
  proofsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  proofRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  proofLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  proofLabelText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },

  // 4. Your Certificate (Prominent Personal Card)
  yourCertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  yourCertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  yourCertTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.6,
  },
  yourCertUserHint: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  // State A: Uploaded
  certUploadedBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
  },
  certStatusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  certCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certUploadedTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  certFileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 8,
  },
  certFileCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  certFileNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  viewMyCertBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewMyCertBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  certVerificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationLabel: {
    fontSize: 11,
    color: '#64748B',
    marginRight: 6,
  },
  verificationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verificationChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D97706',
  },

  // State B: Required
  certRequiredBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 12,
  },
  certAlertCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certRequiredTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#D97706',
  },
  certRequiredDesc: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
    marginTop: 2,
    marginBottom: 10,
  },
  uploadCertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 9,
  },
  uploadCertBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // 5. Team Certificate Status
  statusCountPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  statusCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  memberRowsList: {
    marginTop: 4,
  },
  memberStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  memberRowCurrentHighlight: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  indicatorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  indicatorUploaded: {
    backgroundColor: '#DCFCE7',
  },
  indicatorPending: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  pendingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  memberNameCol: {
    flex: 1,
  },
  memberNameText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  leaderMiniBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  leaderMiniBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  youMiniBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  youMiniBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#4F46E5',
  },
  memberStatusCol: {
    alignItems: 'flex-end',
  },
  memberStatusLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusUploadedColor: {
    color: '#16A34A',
  },
  statusPendingColor: {
    color: '#94A3B8',
  },

  // DEV Toolbar
  devCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 4,
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  devTag: {
    backgroundColor: '#64748B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  devTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  devHint: {
    fontSize: 10.5,
    color: '#64748B',
  },
  devPersonaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  devPersonaBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  devPersonaBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  devPersonaBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  devPersonaBtnTextActive: {
    color: '#2563EB',
  },
  devActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  devActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  devActionChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Proof Modal
  proofModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  proofModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },
  proofModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  proofModalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  proofModalBody: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  proofModalFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    textAlign: 'center',
  },
  proofModalFileSize: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  proofModalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 10,
  },
  proofModalTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  proofCloseBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 10,
  },
  proofCloseBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 16,
  },
  errorBackBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  errorBackText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
