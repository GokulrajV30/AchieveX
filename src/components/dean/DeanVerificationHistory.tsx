// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Verification History
// Audit log of all completed HOD achievement decisions
// Flow: Safe Header -> Hero -> Search & Filter -> History Cards -> Read-Only Detail Modal -> Bottom Nav
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
  getDeanStore,
  subscribeDeanData,
  type DeanVerificationRecord,
} from '../../data/deanWorkspaceData';
import DeanHeroCard from './DeanHeroCard';
import DeanBottomTab from './DeanBottomTab';
import { DEAN_SPACING } from './deanSpacing';

interface DeanVerificationHistoryProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  initialDecisionFilter?: string;
}

export default function DeanVerificationHistory({
  onOpenMenu,
  onNavigate,
  initialDecisionFilter = 'ALL',
}: DeanVerificationHistoryProps) {
  const store = getDeanStore();
  const [history, setHistory] = useState<DeanVerificationRecord[]>(store.getVerificationHistory());
  const [assignedDepts, setAssignedDepts] = useState(store.getAssignedDepartments());
  const stats = store.getOverviewStats();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<string>(initialDecisionFilter);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Read-only Details Modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DeanVerificationRecord | null>(null);

  useEffect(() => {
    return subscribeDeanData(() => {
      setHistory(store.getVerificationHistory());
      setAssignedDepts(store.getAssignedDepartments());
    });
  }, []);

  const filteredHistory = history.filter((item) => {
    // Decision filter
    if (decisionFilter !== 'ALL' && item.decision !== decisionFilter) return false;

    // Department filter
    if (selectedDept !== 'ALL' && item.departmentId !== selectedDept) return false;

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchHOD = item.hodName.toLowerCase().includes(q);
      const matchDept = item.departmentName.toLowerCase().includes(q);
      const matchTitle = item.achievementTitle.toLowerCase().includes(q);
      const matchCategory = item.categoryTitle?.toLowerCase().includes(q);
      if (!matchHOD && !matchDept && !matchTitle && !matchCategory) return false;
    }

    return true;
  });

  const openDetailModal = (record: DeanVerificationRecord) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'Verified':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', icon: 'checkmark-circle' };
      case 'Correction Required':
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', icon: 'alert-circle' };
      case 'Rejected':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', icon: 'close-circle' };
      default:
        return { bg: '#F1F5F9', border: '#E2E8F0', text: '#64748B', icon: 'help-circle' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Verification History</Text>
              <Text style={styles.headerSubtitle}>
                {history.length} total verification actions logged
              </Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE CONTENT BODY
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* ════════════════════════════════════════════════
              2. DEAN HERO CARD
          ════════════════════════════════════════════════ */}
          <DeanHeroCard
            eyebrow="VERIFICATION HISTORY"
            value={history.length}
            label="Reviews Completed"
            context="Your recent HOD verification decisions"
            icon="time"
            compact
            secondaryTitle="DECISIONS"
            secondaryItems={[
              {
                icon: 'checkmark-circle',
                count: stats.verifiedCount,
                label: 'Verified',
                iconColor: '#86EFAC',
              },
              {
                icon: 'close-circle-outline',
                count: stats.rejectedCount,
                label: 'Rejected',
                iconColor: '#FCA5A5',
              },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. SEARCH BAR
          ════════════════════════════════════════════════ */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search HOD name, department, title..."
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

          {/* ════════════════════════════════════════════════
              4. DECISION FILTER CHIPS
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScrollView}
            contentContainerStyle={styles.chipsScroll}
          >
            {(['ALL', 'Verified', 'Correction Required', 'Rejected'] as const).map((dec) => {
              const isSelected = decisionFilter === dec;
              const count =
                dec === 'ALL'
                  ? history.length
                  : history.filter((h) => h.decision === dec).length;

              return (
                <TouchableOpacity
                  key={dec}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setDecisionFilter(dec)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {dec === 'ALL' ? 'All Decisions' : dec} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ════════════════════════════════════════════════
              5. DEPARTMENT FILTER PILLS
          ════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.deptChipsScrollView}
            contentContainerStyle={styles.deptChipsScroll}
          >
            <TouchableOpacity
              style={[styles.deptPill, selectedDept === 'ALL' && styles.deptPillActive]}
              onPress={() => setSelectedDept('ALL')}
            >
              <Text style={[styles.deptPillText, selectedDept === 'ALL' && styles.deptPillTextActive]}>
                All Depts
              </Text>
            </TouchableOpacity>

            {assignedDepts.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[styles.deptPill, selectedDept === d.id && styles.deptPillActive]}
                onPress={() => setSelectedDept(d.id)}
              >
                <Text style={[styles.deptPillText, selectedDept === d.id && styles.deptPillTextActive]}>
                  {d.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ════════════════════════════════════════════════
              6. HISTORY RECORDS LIST
          ════════════════════════════════════════════════ */}
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={38} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No History Records Found</Text>
              <Text style={styles.emptySub}>
                There are no verification actions matching your current search or decision filters.
              </Text>
            </View>
          ) : (
            filteredHistory.map((item) => {
              const badge = getDecisionBadge(item.decision);

              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.decisionBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                      <Ionicons name={badge.icon as any} size={12} color={badge.text} style={{ marginRight: 4 }} />
                      <Text style={[styles.decisionText, { color: badge.text }]}>
                        {item.decision.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.verifiedDateText}>{item.verifiedAt}</Text>
                  </View>

                  <Text style={styles.achieveTitle} numberOfLines={2}>
                    {item.achievementTitle}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.hodNameText}>
                      {item.hodName} • <Text style={styles.deptNameText}>{item.departmentName}</Text>
                    </Text>
                    {item.awardedPoints > 0 ? (
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsBadgeText}>+{item.awardedPoints} pts</Text>
                      </View>
                    ) : null}
                  </View>

                  {item.reason ? (
                    <Text style={styles.reasonExcerpt} numberOfLines={2}>
                      Note: {item.reason}
                    </Text>
                  ) : null}

                  <View style={styles.cardFooter}>
                    <Text style={styles.verifierText}>Verified by {item.verifiedBy} ({item.verificationRole})</Text>
                    <TouchableOpacity
                      style={styles.viewDetailsBtn}
                      activeOpacity={0.7}
                      onPress={() => openDetailModal(item)}
                    >
                      <Text style={styles.viewDetailsText}>Audit Record</Text>
                      <Ionicons name="chevron-forward" size={13} color="#0D9488" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. READ-ONLY RECORD DETAILS MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={detailModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setDetailModalVisible(false)} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Verification Audit Record</Text>
                  <Text style={styles.sheetSubtitle}>Immutable record logged for institutional NAAC/NBA compliance</Text>
                </View>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                {selectedRecord && (
                  <>
                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>ACHIEVEMENT TITLE</Text>
                      <Text style={styles.fieldValBold}>{selectedRecord.achievementTitle}</Text>
                    </View>

                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>HOD & DEPARTMENT</Text>
                      <Text style={styles.fieldVal}>
                        {selectedRecord.hodName} ({selectedRecord.departmentName})
                      </Text>
                    </View>

                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>CATEGORY</Text>
                      <Text style={styles.fieldVal}>{selectedRecord.categoryTitle}</Text>
                    </View>

                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>DECISION</Text>
                      <Text style={[styles.fieldValBold, { color: selectedRecord.decision === 'Verified' ? '#059669' : '#D97706' }]}>
                        {selectedRecord.decision}
                      </Text>
                    </View>

                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>AWARDED POINTS</Text>
                      <Text style={styles.fieldVal}>+{selectedRecord.awardedPoints} pts</Text>
                    </View>

                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>VERIFIED BY</Text>
                      <Text style={styles.fieldVal}>
                        {selectedRecord.verifiedBy} ({selectedRecord.verificationRole})
                      </Text>
                    </View>

                    <View style={styles.detailField}>
                      <Text style={styles.fieldLabel}>DATE OF VERIFICATION</Text>
                      <Text style={styles.fieldVal}>{selectedRecord.verifiedAt}</Text>
                    </View>

                    {selectedRecord.reason ? (
                      <View style={styles.detailField}>
                        <Text style={styles.fieldLabel}>DOCUMENTED REASON / FEEDBACK</Text>
                        <Text style={styles.fieldValReason}>{selectedRecord.reason}</Text>
                      </View>
                    ) : null}
                  </>
                )}
                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.doneBtn}
                  activeOpacity={0.8}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.doneBtnText}>Close Record</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. BOTTOM NAVIGATION TAB BAR
        ════════════════════════════════════════════════ */}
        <DeanBottomTab
          activeTab="history"
          onNavigate={(screen) => onNavigate(screen)}
          unreadCount={stats.pendingCount}
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: DEAN_SPACING.screenTop,
    paddingBottom: DEAN_SPACING.bottomNavClearance,
  },
  searchSection: {
    marginBottom: DEAN_SPACING.titleToContent,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  chipsScrollView: {
    marginHorizontal: -DEAN_SPACING.screenHorizontal,
    marginBottom: DEAN_SPACING.sm,
  },
  chipsScroll: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  filterPillText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  deptChipsScrollView: {
    marginHorizontal: -DEAN_SPACING.screenHorizontal,
    marginBottom: DEAN_SPACING.titleToContent,
  },
  deptChipsScroll: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    gap: 6,
  },
  deptPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deptPillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  deptPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  deptPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: DEAN_SPACING.cardRadiusCompact,
    padding: DEAN_SPACING.cardPadding,
    marginBottom: DEAN_SPACING.cardGap,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  decisionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  decisionText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  verifiedDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  achieveTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hodNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  deptNameText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  pointsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pointsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  reasonExcerpt: {
    fontSize: 11,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    lineHeight: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  verifierText: {
    fontSize: 10,
    color: '#94A3B8',
    flex: 1,
    marginRight: 6,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  detailField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  fieldVal: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  fieldValBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  fieldValReason: {
    fontSize: 12,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    lineHeight: 16,
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  doneBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
