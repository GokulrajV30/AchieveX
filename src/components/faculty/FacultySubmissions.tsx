import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FacultyBottomTab from './FacultyBottomTab';
import {
  MOCK_VERIFICATION_QUEUE,
  MOCK_VERIFICATION_HISTORY,
  MOCK_RESUBMISSION_QUEUE,
  VerificationItem,
} from '../../data/facultyMockData';

interface FacultySubmissionsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  onSelectVerification: (itemId: string) => void;
}

type TabType = 'All' | 'Pending' | 'Resubmission' | 'Approved' | 'Rejected';

export default function FacultySubmissions({
  onOpenMenu,
  onNavigate,
  onSelectVerification,
}: FacultySubmissionsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Build unified list representing all statuses
  const allSubmissions: VerificationItem[] = [
    ...MOCK_VERIFICATION_QUEUE.map(item => ({ ...item, status: 'Pending' as const })),
    ...MOCK_RESUBMISSION_QUEUE.map(item => ({ ...item, status: 'Resubmission Required' as const })),
    ...MOCK_VERIFICATION_HISTORY.map(item => ({
      ...item,
      status: item.status as any,
    })),
  ];

  // Filter list
  const filteredSubmissions = allSubmissions.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending') return matchesSearch && item.status === 'Pending';
    if (activeTab === 'Resubmission') return matchesSearch && item.status === 'Resubmission Required';
    if (activeTab === 'Approved') return matchesSearch && item.status === 'Verified';
    if (activeTab === 'Rejected') return matchesSearch && item.status === 'Rejected';
    return matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Verified':
        return { bg: '#DEF7EC', txt: '#0E9F6E', label: 'Approved' };
      case 'Rejected':
        return { bg: '#FDE8E8', txt: '#EF4444', label: 'Rejected' };
      case 'Resubmission Required':
        return { bg: '#FEF3C7', txt: '#D97706', label: 'Resubmission' };
      case 'Pending':
      default:
        return { bg: '#EBF5FF', txt: '#2563EB', label: 'Pending Review' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Section */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.menuIconContainer}
            activeOpacity={0.7}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={22} color="#0D4733" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Submissions</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search bar & filter tabs */}
        <View style={styles.filterSection}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by student, category or title..."
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsScroll}
          >
            {(['All', 'Pending', 'Resubmission', 'Approved', 'Rejected'] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Scroll list */}
        <ScrollView
          style={styles.listScrollView}
          contentContainerStyle={styles.listScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredSubmissions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No submissions found</Text>
              <Text style={styles.emptySubtitle}>No records match your selected status filters.</Text>
            </View>
          ) : (
            filteredSubmissions.map((item) => {
              const statusStyle = getStatusStyle(item.status);
              return (
                <View key={item.id} style={styles.submissionCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.studentName}>{item.studentName}</Text>
                      <Text style={styles.studentMeta}>CSE (IoT) · {item.rollNumber || '22CSE001'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: statusStyle.txt }]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.cardBody}>
                    <Text style={styles.achievementTitle}>{item.title}</Text>
                    <Text style={styles.achievementMeta}>{item.category} · {item.level}</Text>
                    <Text style={styles.submittedDate}>Submitted: {item.submittedDate || '18 Aug 2026'}</Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      activeOpacity={0.8}
                      onPress={() => onSelectVerification(item.id)}
                    >
                      <Text style={styles.reviewBtnText}>Review</Text>
                      <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Shared Bottom Tab */}
        <FacultyBottomTab activeTab="home" onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAF8F5',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0D4733',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
    padding: 0,
  },
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listScrollView: {
    flex: 1,
  },
  listScrollContent: {
    padding: 16,
    paddingBottom: 85,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  submissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  studentMeta: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cardBody: {
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  achievementMeta: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
    marginTop: 4,
  },
  submittedDate: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 6,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 2,
  },
});
