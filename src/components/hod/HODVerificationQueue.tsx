// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Verification Queue
// Faculty & Academic Coordinator Personal Submissions Queue
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHODStore,
  subscribeHODData,
  type HODFacultySubmission,
} from '../../data/hodWorkspaceData';
import HODHeroCard from './HODHeroCard';
import HODBottomTab from './HODBottomTab';

interface HODVerificationQueueProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  initialTab?: 'All' | 'Pending' | 'Corrections' | 'Verified';
}

export default function HODVerificationQueue({
  onGoBack,
  onNavigate,
  initialTab = 'All',
}: HODVerificationQueueProps) {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Corrections' | 'Verified'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    return subscribeHODData(() => setTick((t) => t + 1));
  }, []);

  const store = getHODStore();
  const allSubmissions = store.submissions;

  // Counts
  const pendingCount = allSubmissions.filter((s) => s.status === 'Pending').length;
  const correctionsCount = allSubmissions.filter((s) => s.status === 'Correction Required').length;
  const verifiedCount = allSubmissions.filter((s) => s.status === 'Approved').length;

  const categories = useMemo(() => {
    const cats = new Set(allSubmissions.map((s) => s.category));
    return ['All', ...Array.from(cats)];
  }, [allSubmissions]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((sub) => {
      // Tab filter
      if (activeTab === 'Pending' && sub.status !== 'Pending') return false;
      if (activeTab === 'Corrections' && sub.status !== 'Correction Required') return false;
      if (activeTab === 'Verified' && sub.status !== 'Approved') return false;

      // Category filter
      if (selectedCategory !== 'All' && sub.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sub.facultyName.toLowerCase().includes(q);
        const matchId = sub.facultyId.toLowerCase().includes(q);
        const matchTitle = sub.achievementTitle.toLowerCase().includes(q);
        const matchType = sub.achievementType.toLowerCase().includes(q);
        const matchCategory = sub.category.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchTitle && !matchType && !matchCategory) return false;
      }

      return true;
    });
  }, [allSubmissions, activeTab, selectedCategory, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Faculty Verification</Text>
            <Text style={styles.headerSubtitle}>CSE (IoT) Department</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Standard HOD Hero Card */}
          <HODHeroCard
            title="FACULTY VERIFICATION"
            subtitle="CSE (IoT)"
            icon="shield-checkmark"
            primaryNumber={pendingCount}
            primaryLabel="Pending Reviews"
            gaugePercent={allSubmissions.length > 0 ? Math.round((verifiedCount / allSubmissions.length) * 100) : 0}
            gaugeNumber={`${allSubmissions.length > 0 ? Math.round((verifiedCount / allSubmissions.length) * 100) : 0}%`}
            gaugeLabel="Cleared"
            gaugeSubtext="Rate"
            ctaText="Verification Queue →"
          />

          {/* Search & Filter Bar */}
          <View style={styles.searchFilterRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search faculty or achievement..."
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

            <TouchableOpacity
              style={[
                styles.filterBtn,
                selectedCategory !== 'All' && styles.filterBtnActive,
              ]}
              activeOpacity={0.75}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="filter"
                size={18}
                color={selectedCategory !== 'All' ? '#2563EB' : '#475569'}
              />
            </TouchableOpacity>
          </View>

          {/* Status Tabs */}
          <View style={styles.tabsRow}>
            {(['All', 'Pending', 'Corrections', 'Verified'] as const).map((tab) => {
              const count =
                tab === 'All'
                  ? allSubmissions.length
                  : tab === 'Pending'
                  ? pendingCount
                  : tab === 'Corrections'
                  ? correctionsCount
                  : verifiedCount;
              const isActive = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabChip, isActive && styles.tabChipActive]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                    {tab}
                  </Text>
                  <View style={[styles.tabCountPill, isActive && styles.tabCountPillActive]}>
                    <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Submissions Found</Text>
              <Text style={styles.emptySub}>
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try changing your search or category filters.'
                  : "You're all caught up! No submissions waiting for review."}
              </Text>
            </View>
          ) : (
            filteredSubmissions.map((sub) => {
              const isApproved = sub.status === 'Approved';
              const isCorrection = sub.status === 'Correction Required';
              const isPending = sub.status === 'Pending';

              return (
                <View key={sub.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.facultyAvatar}>
                      <Ionicons name="person" size={14} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.facultyName}>{sub.facultyName}</Text>
                      <Text style={styles.facultyMeta}>
                        {sub.designation} • {sub.facultyId}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusPill,
                        isApproved
                          ? styles.statusPillApproved
                          : isCorrection
                          ? styles.statusPillCorrection
                          : styles.statusPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          isApproved
                            ? styles.statusTextApproved
                            : isCorrection
                            ? styles.statusTextCorrection
                            : styles.statusTextPending,
                        ]}
                      >
                        {sub.status === 'Correction Required' ? 'Correction' : sub.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{sub.achievementTitle}</Text>
                  <Text style={styles.cardCategory}>
                    {sub.category} • {sub.achievementType}
                  </Text>

                  {isCorrection && sub.correctionReason && (
                    <View style={styles.correctionAlertBox}>
                      <Ionicons name="alert-circle" size={14} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.correctionAlertText} numberOfLines={1}>
                        {sub.correctionReason}
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>Submitted {sub.submittedAt}</Text>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      activeOpacity={0.75}
                      onPress={() => onNavigate('hodFacultyReview', { submissionId: sub.id })}
                    >
                      <Text style={styles.actionBtnText}>
                        {isApproved ? 'View Details' : 'Review'}
                      </Text>
                      <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Filter Bottom Sheet Modal */}
        <Modal
          visible={filterModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter by Category</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 300 }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catItem, isSelected && styles.catItemActive]}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setFilterModalVisible(false);
                      }}
                    >
                      <Text style={[styles.catItemText, isSelected && styles.catItemTextActive]}>
                        {cat}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#2563EB" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Bottom Navigation */}
        <HODBottomTab activeTab="home" onNavigate={onNavigate} />
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
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  tabChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  tabCountPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tabCountPillActive: {
    backgroundColor: '#DBEAFE',
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tabCountTextActive: {
    color: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  facultyAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  facultyMeta: {
    fontSize: 10.5,
    color: '#64748B',
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusPillCorrection: {
    backgroundColor: '#FFF7ED',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextApproved: {
    color: '#16A34A',
  },
  statusTextCorrection: {
    color: '#EA580C',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  cardCategory: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  correctionAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 8,
  },
  correctionAlertText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  catItemActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  catItemText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  catItemTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
