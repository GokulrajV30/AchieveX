// ─────────────────────────────────────────────────────────────
// AchieveX — Student Achievement Records Viewer (Head Workspace)
// Dedicated records inspection screen for NAAC, NBA, and Custom reports.
// Reusable, lightweight, searchable, and filtered by report context.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import type { CollegeAchievementRecord } from '../../data/headWorkspaceData';

export interface HeadReportRecordsParams {
  reportTitle: string;
  contextText: string;
  records: CollegeAchievementRecord[];
  onGoBack: () => void;
}

const LEVEL_OPTIONS = ['ALL', 'College', 'Zonal', 'District', 'State', 'National', 'International'];

export default function HeadReportRecords({
  reportTitle,
  contextText,
  records,
  onGoBack,
}: HeadReportRecordsParams) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // Filter records based on search query and level
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Level filter
      if (selectedLevel !== 'ALL' && r.level !== selectedLevel) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (r.userName || '').toLowerCase().includes(q);
        const matchRoll = (r.rollOrEmpId || r.userRollOrId || '').toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchDept = (r.department || r.departmentName || '').toLowerCase().includes(q);
        return matchName || matchRoll || matchTitle || matchDept;
      }

      return true;
    });
  }, [records, searchQuery, selectedLevel]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back to Report"
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerMainTitle}>Student Achievement Records</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {contextText || reportTitle}
          </Text>
        </View>
        <View style={styles.recordsCountBadge}>
          <Text style={styles.recordsCountBadgeText}>{filteredRecords.length}</Text>
        </View>
      </View>

      {/* SEARCH BAR & LEVEL CHIPS */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name, roll number, or title..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Level Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {LEVEL_OPTIONS.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[styles.levelChip, isSelected && styles.levelChipActive]}
                onPress={() => setSelectedLevel(lvl)}
                activeOpacity={0.7}
              >
                <Text style={[styles.levelChipText, isSelected && styles.levelChipTextActive]}>
                  {lvl === 'ALL' ? 'All Levels' : lvl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* RECORDS LIST */}
      <ScrollView
        style={styles.recordsScroll}
        contentContainerStyle={[styles.recordsScrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Matching Records</Text>
            <Text style={styles.emptyDesc}>
              No verified student achievements match your search query or level selection.
            </Text>
          </View>
        ) : (
          filteredRecords.map((r, idx) => (
            <View key={r.id || `rec-${idx}`} style={styles.recordCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.studentInfoGroup}>
                  <Text style={styles.studentName}>{r.userName}</Text>
                  <Text style={styles.studentMeta}>
                    {r.rollOrEmpId || r.userRollOrId || '—'} • {r.department || r.departmentName || 'Engineering'}
                  </Text>
                </View>
                <View style={styles.pointsPill}>
                  <Text style={styles.pointsPillText}>+{r.awardedPoints || 0} pts</Text>
                </View>
              </View>

              <Text style={styles.achievementTitle}>{r.title}</Text>

              <View style={styles.cardFooterRow}>
                <View style={styles.badgeGroup}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {r.categoryTitle || r.categoryName || 'Technical'}
                    </Text>
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{r.level}</Text>
                  </View>
                  <View style={styles.yearBadge}>
                    <Text style={styles.yearBadgeText}>AY {r.academicYear}</Text>
                  </View>
                </View>

                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#059669" />
                  <Text style={styles.verifiedBadgeText}>{r.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitles: {
    flex: 1,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  recordsCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recordsCountBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  chipsScroll: {
    marginHorizontal: -4,
  },
  levelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  levelChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  levelChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  levelChipTextActive: {
    color: '#FFFFFF',
  },
  recordsScroll: {
    flex: 1,
  },
  recordsScrollContent: {
    padding: 16,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  studentInfoGroup: {
    flex: 1,
    marginRight: 8,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  pointsPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  levelBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  yearBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  yearBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
