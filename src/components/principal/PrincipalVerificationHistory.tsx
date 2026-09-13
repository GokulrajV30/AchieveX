// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Verification History
// Complete immutable audit log of Principal decisions on Dean achievements.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  principalDataStore,
  type PrincipalVerificationRecord,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalVerificationHistoryProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

export default function PrincipalVerificationHistory({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalVerificationHistoryProps) {
  const [history, setHistory] = useState<PrincipalVerificationRecord[]>(
    principalDataStore.getHistory()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<PrincipalVerificationRecord | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    return principalDataStore.subscribe(() => {
      setHistory(principalDataStore.getHistory());
    });
  }, []);

  const filteredHistory = history.filter((item) => {
    if (selectedDecision !== 'ALL' && item.decision !== selectedDecision) return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchDean = item.deanName.toLowerCase().includes(q);
      const matchTitle = item.achievementTitle.toLowerCase().includes(q);
      const matchCat = item.categoryTitle.toLowerCase().includes(q);
      if (!matchDean && !matchTitle && !matchCat) return false;
    }

    return true;
  });

  const verifiedCount = history.filter((h) => h.decision === 'Verified').length;
  const correctionCount = history.filter((h) => h.decision === 'Correction Required').length;
  const rejectedCount = history.filter((h) => h.decision === 'Rejected').length;

  const getDecisionBadge = (decision: PrincipalVerificationRecord['decision']) => {
    switch (decision) {
      case 'Verified':
        return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7' };
      case 'Correction Required':
        return { bg: '#FEFCE8', text: '#B45309', border: '#FEF08A' };
      case 'Rejected':
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' };
      default:
        return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
    }
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
            <Text style={styles.screenTitle}>Verification History</Text>
            <Text style={styles.screenSubtext}>Dean Personal Achievement Audit Trail</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* History Hero */}
          <PrincipalHeroCard
            overline="VERIFICATION AUDIT LOG"
            title={`${history.length} Total Decisions`}
            subtitle="Immutable historical audit records verified by Principal"
            icon="time-outline"
            badgeText="Principal Ledger"
            primaryNumber={history.length}
            primaryLabel="Decisions Recorded"
            secondaryMetrics={[
              { number: verifiedCount, label: 'Verified' },
              { number: correctionCount, label: 'Corrections' },
              { number: rejectedCount, label: 'Rejected' },
            ]}
            compact
          />

          {/* Search & Filter */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search audit records..."
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
          </View>

          {/* Decision Filter Pills */}
          <View style={styles.filterPillsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {[
                { id: 'ALL', label: 'All Decisions' },
                { id: 'Verified', label: `Verified (${verifiedCount})` },
                { id: 'Correction Required', label: `Corrections (${correctionCount})` },
                { id: 'Rejected', label: `Rejected (${rejectedCount})` },
              ].map((pill) => {
                const isActive = selectedDecision === pill.id;
                return (
                  <TouchableOpacity
                    key={pill.id}
                    style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                    onPress={() => setSelectedDecision(pill.id)}
                  >
                    <Text style={[styles.pillBtnText, isActive && styles.pillBtnTextActive]}>
                      {pill.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Records List */}
          <View style={styles.listContainer}>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => {
                const badge = getDecisionBadge(item.decision);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recordCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedRecord(item);
                      setDetailsModalVisible(true);
                    }}
                  >
                    <View style={styles.recordTopRow}>
                      <View
                        style={[
                          styles.decisionBadge,
                          { backgroundColor: badge.bg, borderColor: badge.border },
                        ]}
                      >
                        <Text style={[styles.decisionBadgeText, { color: badge.text }]}>
                          {item.decision}
                        </Text>
                      </View>
                      <Text style={styles.recordDateText}>{item.verifiedAt}</Text>
                    </View>

                    <Text style={styles.recordTitleText} numberOfLines={2}>
                      {item.achievementTitle}
                    </Text>

                    <View style={styles.recordMetaRow}>
                      <Text style={styles.recordDeanText}>{item.deanName} (Dean)</Text>
                      <Text style={styles.recordDot}>•</Text>
                      <Text style={styles.recordCategoryText}>{item.categoryTitle}</Text>
                    </View>

                    <View style={styles.recordFooterRow}>
                      <Text style={styles.verifiedByText}>
                        Verified by {item.verifiedBy} ({item.verificationRole})
                      </Text>
                      {item.awardedPoints > 0 && (
                        <View style={styles.pointsPill}>
                          <Text style={styles.pointsPillText}>+{item.awardedPoints} pts</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="file-tray-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Records Match Filter</Text>
                <Text style={styles.emptySub}>
                  Try clearing your search query or selecting All Decisions.
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            RECORD DETAILS MODAL (READ-ONLY)
        ════════════════════════════════════════════════ */}
        <Modal
          visible={detailsModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setDetailsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Audit Record Details</Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              {selectedRecord && (
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Decision</Text>
                    <View
                      style={[
                        styles.decisionBadge,
                        {
                          backgroundColor: getDecisionBadge(selectedRecord.decision).bg,
                          borderColor: getDecisionBadge(selectedRecord.decision).border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.decisionBadgeText,
                          { color: getDecisionBadge(selectedRecord.decision).text },
                        ]}
                      >
                        {selectedRecord.decision}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Dean Name</Text>
                    <Text style={styles.modalDetailValue}>{selectedRecord.deanName}</Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Achievement</Text>
                    <Text style={styles.modalDetailValueBold}>{selectedRecord.achievementTitle}</Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Category</Text>
                    <Text style={styles.modalDetailValue}>{selectedRecord.categoryTitle}</Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Awarded Points</Text>
                    <Text style={styles.modalDetailValuePoints}>
                      {selectedRecord.awardedPoints} Points
                    </Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Verified By</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedRecord.verifiedBy} ({selectedRecord.verificationRole})
                    </Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Verification Date</Text>
                    <Text style={styles.modalDetailValue}>{selectedRecord.verifiedAt}</Text>
                  </View>

                  {selectedRecord.reason ? (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Remarks / Justification</Text>
                      <View style={styles.reasonBox}>
                        <Text style={styles.reasonText}>{selectedRecord.reason}</Text>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
              )}

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setDetailsModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>Close Record</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="approvals" onNavigate={onNavigate} />
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
    paddingBottom: 24,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterPillsRow: {
    marginBottom: 12,
  },
  pillBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  pillBtnTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  decisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  decisionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recordDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  recordTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 6,
  },
  recordMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordDeanText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  recordDot: {
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  recordCategoryText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  recordFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  verifiedByText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  pointsPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalDetailRow: {
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  modalDetailValue: {
    fontSize: 13,
    color: '#0F172A',
  },
  modalDetailValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
  },
  modalDetailValuePoints: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  reasonBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 2,
  },
  reasonText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  closeBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
