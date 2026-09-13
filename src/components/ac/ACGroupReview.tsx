// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Group Review Screen
// Strictly isolates selected event group, reviews event details & proofs ONCE,
// displays team sections, and enables 1-tap bulk verification with exception isolation.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getGroupById,
  getGroupSubmissions,
  type ACEventGroup,
  type ACStudentSubmission,
  type ACCommonProof,
  type ACTeamGroup,
} from '../../data/acWorkspaceData';

interface ACGroupReviewProps {
  groupId?: string;
  eventGroup?: ACEventGroup;
  onGoBack: () => void;
  onSelectSubmission: (submission: ACStudentSubmission) => void;
  onSelectTeam?: (eventGroupId: string, teamGroupId: string) => void;
  onNavigate?: (screen: string) => void;
}

export default function ACGroupReview({
  groupId,
  eventGroup: propEventGroup,
  onGoBack,
  onSelectSubmission,
  onSelectTeam,
  onNavigate,
}: ACGroupReviewProps) {
  // Resolve the exact selected group
  const activeGroupId = groupId || propEventGroup?.id || 'EVENT_GROUP_SIH_2026';
  const eventGroup: ACEventGroup = useMemo(() => getGroupById(activeGroupId), [activeGroupId]);

  // Load submissions strictly for this group
  const [submissions, setSubmissions] = useState<ACStudentSubmission[]>(() =>
    getGroupSubmissions(activeGroupId)
  );

  // Sync state whenever activeGroupId changes
  useEffect(() => {
    setSubmissions(getGroupSubmissions(activeGroupId));
    setSelectedSubmissionIds(
      getGroupSubmissions(activeGroupId)
        .filter((s) => s.isReady && s.status !== 'Approved')
        .map((s) => s.id)
    );
  }, [activeGroupId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Ready' | 'Issues' | 'Resubmitted'>('All');
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>(() =>
    submissions.filter((s) => s.isReady && s.status !== 'Approved').map((s) => s.id)
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [viewProofModal, setViewProofModal] = useState<ACCommonProof | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'Ready') return sub.isReady && sub.status !== 'Approved';
      if (activeTab === 'Issues') return !sub.isReady && sub.status !== 'Approved';
      if (activeTab === 'Resubmitted') return sub.status === 'Resubmitted';
      return true;
    });
  }, [submissions, searchQuery, activeTab]);

  const readyList = useMemo(
    () => submissions.filter((s) => s.isReady && s.status !== 'Approved'),
    [submissions]
  );
  const issuesList = useMemo(
    () => submissions.filter((s) => !s.isReady && s.status !== 'Approved'),
    [submissions]
  );
  const approvedList = useMemo(
    () => submissions.filter((s) => s.status === 'Approved'),
    [submissions]
  );

  const toggleSelectSubmission = (id: string, isReady: boolean) => {
    if (!isReady) {
      Alert.alert(
        'Validation Issue',
        'This submission has a validation flag. Please inspect it individually to approve or request correction.'
      );
      return;
    }
    setSelectedSubmissionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllReady = () => {
    if (selectedSubmissionIds.length === readyList.length) {
      setSelectedSubmissionIds([]);
    } else {
      setSelectedSubmissionIds(readyList.map((s) => s.id));
    }
  };

  const handleBulkApprove = () => {
    const count = selectedSubmissionIds.length;
    if (count === 0) return;

    // Approve selected items
    setSubmissions((prev) =>
      prev.map((sub) =>
        selectedSubmissionIds.includes(sub.id)
          ? { ...sub, status: 'Approved' as const, isReady: false }
          : sub
      )
    );

    setSelectedSubmissionIds([]);
    setConfirmModalVisible(false);
    setSuccessBanner(`${count} submissions approved via bulk verification!`);

    setTimeout(() => {
      setSuccessBanner(null);
    }, 4500);
  };

  const renderStudentItem = ({ item }: { item: ACStudentSubmission }) => {
    const isSelected = selectedSubmissionIds.includes(item.id);
    const isApproved = item.status === 'Approved';
    const isReady = item.isReady;
    const isNeedsAttention = item.status === 'Needs Attention';

    return (
      <TouchableOpacity
        style={[
          styles.studentCard,
          isSelected && styles.studentCardSelected,
          isApproved && styles.studentCardApproved,
          isNeedsAttention && styles.studentCardIssue,
        ]}
        activeOpacity={0.75}
        onPress={() => onSelectSubmission(item)}
      >
        {/* Checkbox (Excluded for problem records) */}
        {!isApproved && (
          <TouchableOpacity
            style={[
              styles.checkboxBox,
              isSelected && styles.checkboxBoxSelected,
              !isReady && styles.checkboxBoxDisabled,
            ]}
            onPress={() => toggleSelectSubmission(item.id, isReady)}
          >
            {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            {!isReady && <Ionicons name="alert" size={12} color="#DC2626" />}
          </TouchableOpacity>
        )}

        {/* Student Avatar */}
        <View style={[styles.avatarCircle, isApproved && { backgroundColor: '#DCFCE7' }]}>
          <Text style={[styles.avatarText, isApproved && { color: '#16A34A' }]}>
            {item.studentName.substring(0, 2).toUpperCase()}
          </Text>
        </View>

        {/* Info Column */}
        <View style={styles.studentInfoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            {item.teamRole && (
              <View
                style={[
                  styles.teamRoleTag,
                  item.teamRole === 'Team Leader' && { backgroundColor: '#FEF3C7' },
                ]}
              >
                <Text
                  style={[
                    styles.teamRoleText,
                    item.teamRole === 'Team Leader' && { color: '#B45309' },
                  ]}
                >
                  {item.teamRole}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.studentSubText}>
            {item.rollNo} • {item.section} • {item.result} • +{item.calculatedPoints} pts
          </Text>

          {/* Individual Certificate Indicator */}
          <View style={styles.certRow}>
            {item.hasIndividualProof ? (
              <Text style={styles.certGreenText}>
                <Ionicons name="document-text" size={11} color="#16A34A" /> Certificate ✓
              </Text>
            ) : (
              <Text style={styles.certRedText}>
                <Ionicons name="alert-circle" size={11} color="#DC2626" /> Missing Certificate
              </Text>
            )}
            {item.issueReason && (
              <Text style={styles.issueReasonText}> • {item.issueReason}</Text>
            )}
          </View>
        </View>

        {/* Status Pill */}
        <View style={styles.rowRightCol}>
          {isApproved ? (
            <View style={styles.approvedPill}>
              <Ionicons name="checkmark-done" size={11} color="#16A34A" style={{ marginRight: 2 }} />
              <Text style={styles.approvedPillText}>Verified</Text>
            </View>
          ) : isReady ? (
            <View style={styles.readyPill}>
              <Text style={styles.readyPillText}>Ready</Text>
            </View>
          ) : (
            <View style={styles.issuePill}>
              <Text style={styles.issuePillText}>Attention</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginTop: 4 }} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          1. GROUP HERO (DERIVED STRICTLY FROM SELECTED GROUP)
      ════════════════════════════════════════════════ */}
      <View style={styles.heroCardWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroLabelRow}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="layers" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabelText}>GROUP REVIEW</Text>
            </View>
            <Text style={styles.heroSubText}>{eventGroup.level}</Text>
          </View>

          <Text style={styles.heroTitleText}>{eventGroup.eventName}</Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{submissions.length}</Text>
              <Text style={styles.heroStatLabel}>Submissions</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatVal, { color: '#4ADE80' }]}>{readyList.length}</Text>
              <Text style={styles.heroStatLabel}>Ready</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatVal, { color: '#FDE047' }]}>{issuesList.length}</Text>
              <Text style={styles.heroStatLabel}>Attention</Text>
            </View>
            {approvedList.length > 0 && (
              <>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={[styles.heroStatVal, { color: '#FFFFFF' }]}>{approvedList.length}</Text>
                  <Text style={styles.heroStatLabel}>Verified</Text>
                </View>
              </>
            )}
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

      {/* ════════════════════════════════════════════════
          2. EVENT DETAILS (REVIEWED ONCE)
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionCardHeader}>
          <Ionicons name="information-circle-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
          <Text style={styles.sectionCardTitle}>Event Details</Text>
        </View>

        <View style={styles.eventGrid}>
          <View style={styles.eventGridRow}>
            <Text style={styles.eventGridLabel}>Event Name</Text>
            <Text style={styles.eventGridVal}>{eventGroup.eventName}</Text>
          </View>
          <View style={styles.eventGridRow}>
            <Text style={styles.eventGridLabel}>Type & Category</Text>
            <Text style={styles.eventGridVal}>
              {eventGroup.achievementType} • {eventGroup.category}
            </Text>
          </View>
          <View style={styles.eventGridRow}>
            <Text style={styles.eventGridLabel}>Organizer & Level</Text>
            <Text style={styles.eventGridVal}>
              {eventGroup.organizer} ({eventGroup.level})
            </Text>
          </View>
          <View style={styles.eventGridRow}>
            <Text style={styles.eventGridLabel}>Date & Semester</Text>
            <Text style={styles.eventGridVal}>
              {eventGroup.eventDate} • {eventGroup.semester}
            </Text>
          </View>
        </View>
      </View>

      {/* ════════════════════════════════════════════════
          3. EVENT PROOFS (REVIEWED ONCE)
      ════════════════════════════════════════════════ */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionCardHeader}>
          <Ionicons name="document-attach-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
          <Text style={styles.sectionCardTitle}>Event Proofs ({eventGroup.commonProofs.length})</Text>
        </View>

        {eventGroup.commonProofs.map((proof) => (
          <TouchableOpacity
            key={proof.id}
            style={styles.proofItem}
            activeOpacity={0.75}
            onPress={() => setViewProofModal(proof)}
          >
            <View style={styles.proofIconBox}>
              <Ionicons
                name={proof.fileType === 'pdf' ? 'document-text' : 'image'}
                size={18}
                color="#2563EB"
              />
            </View>
            <View style={styles.proofInfoCol}>
              <Text style={styles.proofLabel}>{proof.label}</Text>
              <Text style={styles.proofMeta}>
                {proof.fileName} • {proof.fileSize}
              </Text>
            </View>
            <View style={styles.proofViewBtn}>
              <Text style={styles.proofViewBtnText}>View</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ════════════════════════════════════════════════
          4. TEAMS INSIDE THIS EVENT (IF APPLICABLE)
      ════════════════════════════════════════════════ */}
      {eventGroup.teamGroups && eventGroup.teamGroups.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Ionicons name="ribbon-outline" size={18} color="#D97706" style={{ marginRight: 6 }} />
            <Text style={styles.sectionCardTitle}>Teams ({eventGroup.teamGroups.length})</Text>
          </View>

          {eventGroup.teamGroups.map((team: ACTeamGroup) => (
            <TouchableOpacity
              key={team.id}
              style={styles.teamCard}
              activeOpacity={0.75}
              onPress={() => onSelectTeam && onSelectTeam(eventGroup.id, team.id)}
            >
              <View style={styles.teamCardTop}>
                <View style={styles.teamNameRow}>
                  <Text style={styles.teamName}>{team.teamName}</Text>
                  <View style={styles.teamResultTag}>
                    <Text style={styles.teamResultText}>{team.result}</Text>
                  </View>
                </View>
                <Text style={styles.teamMembersCount}>{team.memberCount} Members</Text>
              </View>

              <Text style={styles.teamLeadText}>Team Lead: {team.teamLeadName}</Text>

              <View style={styles.teamCardBottom}>
                <Text style={styles.teamBreakdownText}>
                  {team.readyCount} Ready • {team.attentionCount} Issues
                </Text>
                <View style={styles.viewTeamBtn}>
                  <Text style={styles.viewTeamBtnText}>View Team →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ════════════════════════════════════════════════
          5. STUDENT SUBMISSIONS SECTION HEADER & CONTROLS
      ════════════════════════════════════════════════ */}
      <View style={styles.submissionsHeaderSection}>
        <View style={styles.submissionsTitleRow}>
          <Text style={styles.submissionsTitle}>
            Student Submissions ({submissions.length})
          </Text>

          {readyList.length > 0 && (
            <TouchableOpacity style={styles.selectAllBtn} onPress={handleSelectAllReady}>
              <Text style={styles.selectAllBtnText}>
                {selectedSubmissionIds.length === readyList.length
                  ? 'Deselect All'
                  : `Select All Ready (${readyList.length})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name or roll number..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Segment Filter Tabs */}
        <View style={styles.segmentTabsRow}>
          {(['All', 'Ready', 'Issues', 'Resubmitted'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.segmentTab, activeTab === tab && styles.segmentTabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.segmentTabText, activeTab === tab && styles.segmentTabTextActive]}>
                {tab === 'All'
                  ? `All (${submissions.length})`
                  : tab === 'Ready'
                  ? `Ready (${readyList.length})`
                  : tab === 'Issues'
                  ? `Issues (${issuesList.length})`
                  : `Resubmitted (1)`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Group Review</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {eventGroup.eventName}
            </Text>
          </View>

          <View style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>EVENT GROUP</Text>
          </View>
        </View>

        {/* Submissions List */}
        <FlatList
          data={filteredSubmissions}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderStudentItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={36} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No matching submissions</Text>
              <Text style={styles.emptyDesc}>Try adjusting your search query or tab filter.</Text>
            </View>
          }
        />

        {/* ════════════════════════════════════════════════
            6. STICKY BULK ACTION BAR
        ════════════════════════════════════════════════ */}
        {selectedSubmissionIds.length > 0 && (
          <View style={styles.stickyActionBar}>
            <View>
              <Text style={styles.selectedCountText}>
                {selectedSubmissionIds.length} Selected
              </Text>
              <Text style={styles.selectedSubText}>
                Ready for institutional approval
              </Text>
            </View>

            <TouchableOpacity
              style={styles.bulkApproveBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmModalVisible(true)}
            >
              <Ionicons name="checkmark-done" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.bulkApproveBtnText}>
                Approve {selectedSubmissionIds.length} Ready
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ════════════════════════════════════════════════
            7. BULK APPROVAL CONFIRMATION MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={confirmModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconCircle}>
                <Ionicons name="shield-checkmark" size={30} color="#2563EB" />
              </View>

              <Text style={styles.confirmTitle}>
                Approve {selectedSubmissionIds.length} Submissions?
              </Text>

              <Text style={styles.confirmDesc}>
                Official points will be automatically calculated and credited to the students' portfolios.
                Problematic records will remain in your attention queue.
              </Text>

              <View style={styles.confirmModalActions}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.cancelModalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmApproveBtn} onPress={handleBulkApprove}>
                  <Text style={styles.confirmApproveBtnText}>
                    Approve {selectedSubmissionIds.length}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. COMMON PROOF PREVIEW MODAL
        ════════════════════════════════════════════════ */}
        {viewProofModal && (
          <Modal
            visible={!!viewProofModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setViewProofModal(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.proofPreviewCard}>
                <View style={styles.proofPreviewHeader}>
                  <Text style={styles.proofPreviewTitle}>{viewProofModal.label}</Text>
                  <TouchableOpacity onPress={() => setViewProofModal(null)}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.proofDocBox}>
                  <Ionicons
                    name={viewProofModal.fileType === 'pdf' ? 'document-text' : 'image'}
                    size={48}
                    color="#2563EB"
                  />
                  <Text style={styles.proofDocName}>{viewProofModal.fileName}</Text>
                  <Text style={styles.proofDocMeta}>
                    {viewProofModal.fileSize} • Uploaded {viewProofModal.uploadedAt}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.proofDoneBtn}
                  onPress={() => setViewProofModal(null)}
                >
                  <Text style={styles.proofDoneBtnText}>Done</Text>
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

  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
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
  groupBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  groupBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* Hero Card */
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
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 12,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  /* Success Banner */
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

  /* Section Card */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  eventGrid: {
    gap: 8,
  },
  eventGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventGridLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  eventGridVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },

  /* Event Proof Item */
  proofItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  proofInfoCol: {
    flex: 1,
  },
  proofLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  proofViewBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  proofViewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Team Card */
  teamCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 8,
  },
  teamCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  teamResultTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  teamResultText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  teamMembersCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  teamLeadText: {
    fontSize: 11.5,
    color: '#B45309',
    marginBottom: 6,
  },
  teamCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamBreakdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  viewTeamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTeamBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },

  /* Submissions Header Section */
  submissionsHeaderSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  submissionsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  submissionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectAllBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectAllBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  segmentTabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  segmentTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    color: '#FFFFFF',
  },

  /* Student Card */
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  studentCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F7FF',
  },
  studentCardApproved: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  studentCardIssue: {
    borderColor: '#FECACA',
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
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
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
  studentInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  teamRoleTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  teamRoleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  studentSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  certGreenText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#16A34A',
  },
  certRedText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#DC2626',
  },
  issueReasonText: {
    fontSize: 10.5,
    color: '#D97706',
    fontWeight: '500',
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
  issuePill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  issuePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  /* Sticky Bulk Action Bar */
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bulkApproveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Confirmation Modal */
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
  confirmIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    marginBottom: 18,
  },
  confirmModalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelModalBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  confirmApproveBtn: {
    flex: 2,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmApproveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Proof Preview Modal */
  proofPreviewCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  proofPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  proofPreviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofDocBox: {
    height: 160,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  proofDocName: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 8,
  },
  proofDocMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  proofDoneBtn: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
