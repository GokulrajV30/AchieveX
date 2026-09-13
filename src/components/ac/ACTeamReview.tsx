// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Team Review Screen
// Focused review of team-based achievements, shared team proofs, and member validation.
// Connected to Centralized Team Achievement Store.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getTeamAchievementById,
  subscribeTeamAchievements,
  approveTeamMembers,
  getCertificateProgress,
  getRoleLabel,
  type TeamAchievement,
  type TeamAchievementMember,
  type TeamCommonProof,
} from '../../data/teamAchievementData';

interface ACTeamReviewProps {
  teamAchievementId?: string;
  eventGroupId?: string;
  teamGroupId?: string;
  onGoBack: () => void;
  onSelectSubmission?: (submission: any) => void;
}

export default function ACTeamReview({
  teamAchievementId = 'TA-SIH-2026-001',
  eventGroupId,
  teamGroupId,
  onGoBack,
  onSelectSubmission,
}: ACTeamReviewProps) {
  const [, setTick] = useState(0);

  // Subscribe to centralized team achievements store
  useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t: number) => t + 1));
  }, []);

  const team: TeamAchievement | undefined = useMemo(() => {
    return getTeamAchievementById(teamAchievementId) || getTeamAchievementById('TA-SIH-2026-001');
  }, [teamAchievementId, setTick]);

  const members: TeamAchievementMember[] = team?.members || [];

  const progress = team ? getCertificateProgress(team.id) : { uploaded: 0, total: 0 };

  const readyMembers = useMemo(
    () => members.filter((m) => (m.certificateStatus === 'Uploaded' || m.certificateStatus === 'Verified') && m.verificationStatus !== 'Verified'),
    [members]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [viewProofModal, setViewProofModal] = useState<{
    label: string;
    fileName: string;
  } | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

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

  const toggleSelection = (id: string, canSelect: boolean) => {
    if (!canSelect) {
      Alert.alert(
        'Certificate Missing',
        'Cannot approve this student until their individual certificate has been uploaded.'
      );
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApproveSelected = () => {
    const count = selectedIds.length;
    if (count === 0) return;

    approveTeamMembers(team.id, selectedIds);
    setSelectedIds([]);
    setConfirmModalVisible(false);
    setSuccessBanner(`${count} team members verified & points applied!`);

    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  const renderMemberItem = ({ item }: { item: TeamAchievementMember }) => {
    const isSelected = selectedIds.includes(item.id);
    const isApproved = item.verificationStatus === 'Verified';
    const isUploaded = item.certificateStatus === 'Uploaded';
    const isMissing = item.certificateStatus === 'Not Uploaded' || item.certificateStatus === 'Correction Required';
    const canSelect = isUploaded && !isApproved;

    return (
      <TouchableOpacity
        style={[
          styles.memberCard,
          isSelected && styles.memberCardSelected,
          isApproved && styles.memberCardApproved,
          // Amber for cert missing — NOT red
          isMissing && styles.memberCardCertMissing,
        ]}
        activeOpacity={0.75}
        onPress={() => {
          if (item.individualCertificate) {
            setViewProofModal({
              label: `${item.studentName} — Individual Certificate`,
              fileName: item.individualCertificate.fileName,
            });
          } else {
            Alert.alert(
              'Certificate Missing',
              `${item.studentName} has not uploaded their individual certificate yet.`
            );
          }
        }}
      >
        {/* Checkbox — disabled if certificate is missing */}
        {!isApproved && (
          <TouchableOpacity
            style={[
              styles.checkboxBox,
              isSelected && styles.checkboxBoxSelected,
              !canSelect && styles.checkboxBoxDisabled,
            ]}
            onPress={() => toggleSelection(item.id, canSelect)}
          >
            {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            {isMissing && <Ionicons name="time" size={12} color="#D97706" />}
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.avatarCircle,
            isApproved && { backgroundColor: '#DCFCE7' },
            isMissing && { backgroundColor: '#FEF3C7' },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              isApproved && { color: '#16A34A' },
              isMissing && { color: '#D97706' },
            ]}
          >
            {item.studentName.substring(0, 2).toUpperCase()}
          </Text>
        </View>

        <View style={styles.memberInfoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.memberName}>{item.studentName}</Text>
            <View
              style={[
                styles.roleTag,
                item.role === 'team_leader' && { backgroundColor: '#FEF3C7' },
              ]}
            >
              <Text
                style={[
                  styles.roleTagText,
                  item.role === 'team_leader' && { color: '#B45309' },
                ]}
              >
                {getRoleLabel(item.role)}
              </Text>
            </View>
          </View>

          <Text style={styles.memberSub}>
            {item.rollNumber} • {item.department} • +50 pts
          </Text>

          {/* Certificate status in plain language */}
          <View style={styles.certStatusRow}>
            {isApproved ? (
              <>
                <Ionicons name="checkmark-done" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                <Text style={[styles.proofStatusText, { color: '#16A34A', fontWeight: '700' }]}>
                  Verified
                </Text>
              </>
            ) : isUploaded ? (
              <>
                <Ionicons name="document-text" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                <Text style={[styles.proofStatusText, { color: '#16A34A' }]}>
                  Certificate Uploaded
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="time-outline" size={12} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={[styles.proofStatusText, { color: '#D97706', fontWeight: '700' }]}>
                  Certificate Missing
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.rowRightCol}>
          {isApproved ? (
            <View style={styles.approvedPill}>
              <Ionicons name="checkmark-done" size={11} color="#16A34A" style={{ marginRight: 2 }} />
              <Text style={styles.approvedPillText}>Verified</Text>
            </View>
          ) : isMissing ? (
            // Amber pill for missing cert — NOT red
            <View style={styles.certMissingPill}>
              <Text style={styles.certMissingPillText}>Missing</Text>
            </View>
          ) : (
            <View style={styles.readyPill}>
              <Text style={styles.readyPillText}>Ready</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginTop: 4 }} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ── 1. TEAM SUMMARY (Hero Card) ── */}
      <View style={styles.heroCardWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4338CA', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroLabelRow}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="ribbon" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabelText}>TEAM ACHIEVEMENT REVIEW</Text>
            </View>
            <Text style={styles.heroSubText}>{team.result}</Text>
          </View>

          <Text style={styles.heroTeamName}>{team.teamName}</Text>
          <Text style={styles.heroParentEvent}>{team.eventName}</Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <Text style={styles.heroLeadText}>
              Lead: {team.teamLeaderName} • {members.length} Members
            </Text>
            <View style={styles.heroReadyTag}>
              <Text style={styles.heroReadyText}>
                {progress.uploaded} / {progress.total} Uploaded
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Success Notification Banner */}
      {successBanner && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#16A34A" style={{ marginRight: 8 }} />
          <Text style={styles.successBannerText}>{successBanner}</Text>
        </View>
      )}

      {/* ── 2. EVENT DETAILS ── */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardHeaderTitle}>Event Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Event Name</Text>
            <Text style={styles.detailVal}>{team.eventName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Team Name</Text>
            <Text style={styles.detailVal}>{team.teamName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Organizer</Text>
            <Text style={styles.detailVal}>{team.organizer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Level</Text>
            <Text style={[styles.detailVal, { color: '#2563EB', fontWeight: '700' }]}>
              {team.level}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Result & Standing</Text>
            <Text style={[styles.detailVal, { color: '#16A34A', fontWeight: '700' }]}>
              {team.result}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Semester</Text>
            <Text style={styles.detailVal}>{team.semester}</Text>
          </View>
          {team.cashPrize && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cash Prize Awarded</Text>
              <Text style={[styles.detailVal, { color: '#16A34A', fontWeight: '700' }]}>
                {team.cashPrize}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── 3. TEAM PROOFS (Shared Once) ── */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardHeaderTitle}>Team Proofs (Shared Evidence)</Text>
        {team.commonProofs.map((proof) => (
          <TouchableOpacity
            key={proof.id}
            style={styles.proofRow}
            activeOpacity={0.7}
            onPress={() => setViewProofModal({ label: proof.label, fileName: proof.fileName })}
          >
            <Ionicons
              name={proof.fileType === 'pdf' ? 'document-text' : 'image'}
              size={20}
              color="#2563EB"
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.proofTitle}>{proof.label}</Text>
              <Text style={styles.proofSub}>
                {proof.fileName} • {proof.fileSize}
              </Text>
            </View>
            <View style={styles.inspectBtn}>
              <Text style={styles.inspectBtnText}>View</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 4. MEMBER CERTIFICATES (Header) ── */}
      <View style={styles.membersHeaderRow}>
        <View>
          <Text style={styles.membersSectionTitle}>Member Certificates</Text>
          <Text style={styles.membersSectionSub}>
            {progress.uploaded} of {progress.total} Uploaded
          </Text>
        </View>

        {readyMembers.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              if (selectedIds.length === readyMembers.length) setSelectedIds([]);
              else setSelectedIds(readyMembers.map((m) => m.id));
            }}
          >
            <Text style={styles.selectAllText}>
              {selectedIds.length === readyMembers.length
                ? 'Deselect All'
                : `Select Ready (${readyMembers.length})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
            <Text style={styles.headerTitle}>AC Team Review</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {team.teamName} • {team.eventName}
            </Text>
          </View>

          <View style={styles.teamBadge}>
            <Text style={styles.teamBadgeText}>VERIFICATION</Text>
          </View>
        </View>

        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderMemberItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* ── 5. VERIFICATION ACTIONS (Sticky Bulk Action Bar) ── */}
        {selectedIds.length > 0 && (
          <View style={styles.stickyActionBar}>
            <View>
              <Text style={styles.selectedCountText}>{selectedIds.length} Members Selected</Text>
              <Text style={styles.selectedSubText}>Ready for verification</Text>
            </View>

            <TouchableOpacity
              style={styles.bulkApproveBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmModalVisible(true)}
            >
              <Ionicons name="checkmark-done" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.bulkApproveBtnText}>Approve {selectedIds.length} Members</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirmation Modal */}
        <Modal
          visible={confirmModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmCard}>
              <Ionicons name="ribbon" size={32} color="#2563EB" style={{ marginBottom: 10 }} />
              <Text style={styles.confirmTitle}>Approve {selectedIds.length} Team Members?</Text>
              <Text style={styles.confirmDesc}>
                Official points (+50 pts / member) will be applied. Members with missing certificates will remain pending until uploaded.
              </Text>

              <View style={styles.confirmRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleApproveSelected}>
                  <Text style={styles.submitBtnText}>Approve {selectedIds.length}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Proof Viewer Modal */}
        {viewProofModal && (
          <Modal
            visible={!!viewProofModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setViewProofModal(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.proofCard}>
                <View style={styles.proofHeader}>
                  <Text style={styles.proofModalTitle}>{viewProofModal.label}</Text>
                  <TouchableOpacity onPress={() => setViewProofModal(null)}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
                <View style={styles.docBox}>
                  <Ionicons name="document-text" size={48} color="#2563EB" />
                  <Text style={styles.docName}>{viewProofModal.fileName}</Text>
                </View>
                <TouchableOpacity style={styles.doneBtn} onPress={() => setViewProofModal(null)}>
                  <Text style={styles.doneBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
  teamBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  heroCardWrapper: {
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
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  heroLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroSubText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  heroTeamName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroParentEvent: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 10,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeadText: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  heroReadyTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroReadyText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  detailsGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofSub: {
    fontSize: 11,
    color: '#64748B',
  },
  inspectBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inspectBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  membersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  membersSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  membersSectionSub: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F7FF',
  },
  memberCardApproved: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  // Amber styles for "Certificate Missing" state (not red)
  memberCardCertMissing: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxBoxSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxBoxDisabled: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  memberInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  memberSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  certStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  proofStatusText: {
    fontSize: 10.5,
    color: '#475569',
  },
  rowRightCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  approvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  approvedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  readyPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readyPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  certMissingPill: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  certMissingPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },

  stickyActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectedSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  bulkApproveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bulkApproveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  confirmDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  proofCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  proofHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  proofModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  docBox: {
    height: 160,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  docName: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 8,
  },
  doneBtn: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
