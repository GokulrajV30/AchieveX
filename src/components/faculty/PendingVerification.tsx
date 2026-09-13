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
import Feather from '@expo/vector-icons/Feather';
import { MOCK_VERIFICATION_QUEUE, VerificationItem } from '../../data/facultyMockData';

interface PendingVerificationProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
  onSelectVerification: (itemId: string) => void;
}

const CATEGORIES = [
  'All',
  'Technical & Professional',
  'Sports & Games',
  'Certifications & Online Learning',
  'Research & IPR',
];

export default function PendingVerification({
  onGoBack,
  onOpenMenu,
  onSelectVerification,
}: PendingVerificationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = MOCK_VERIFICATION_QUEUE.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Block */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.6}
            onPress={onGoBack}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pending Verification</Text>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.6}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Filters & Search */}
        <View style={styles.filterContainer}>
          {/* Search bar */}
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student, roll number, title..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Horizontal Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
            style={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, active && styles.categoryPillActive]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Main List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="shield-checkmark-outline" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No Pending Verifications</Text>
              <Text style={styles.emptySubtitle}>You're all caught up.</Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.verificationCard}>
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                    <Text style={styles.studentRoll}>{item.rollNumber} • {item.participation} Record</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                {/* Body details */}
                <View style={styles.cardBody}>
                  <Text style={styles.achievementCategory}>{item.category}</Text>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementOrganizer}>Organizer: {item.organization}</Text>
                  <Text style={styles.achievementDate}>Event Date: {item.date} • Submitted: {item.submittedDate}</Text>
                </View>

                {/* Footer action */}
                <View style={styles.cardFooter}>
                  <View style={styles.proofSummary}>
                    <Ionicons name="document-attach-outline" size={16} color="#6B7280" style={{ marginRight: 4 }} />
                    <Text style={styles.proofText}>{item.proofFiles.length} Proof File(s)</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    activeOpacity={0.7}
                    onPress={() => onSelectVerification(item.id)}
                  >
                    <Text style={styles.reviewBtnText}>Review Submission</Text>
                    <Feather name="chevron-right" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  categoriesScroll: {
    marginHorizontal: -16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  verificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  studentRoll: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  cardBody: {
    marginBottom: 16,
  },
  achievementCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  achievementOrganizer: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 6,
    fontWeight: '500',
  },
  achievementDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 12,
  },
  proofSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proofText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  reviewBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});
