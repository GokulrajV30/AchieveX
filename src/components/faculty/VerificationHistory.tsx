import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MOCK_VERIFICATION_HISTORY } from '../../data/facultyMockData';

interface VerificationHistoryProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
}

const HISTORY_STATUSES = ['All', 'Verified', 'Rejected'];

export default function VerificationHistory({
  onGoBack,
  onOpenMenu,
}: VerificationHistoryProps) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredHistory = MOCK_VERIFICATION_HISTORY.filter((item) => {
    return selectedFilter === 'All' || item.status === selectedFilter;
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
          <Text style={styles.headerTitle}>Verification History</Text>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.6}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills Header */}
        <View style={styles.filterContainer}>
          <View style={styles.pillsRow}>
            {HISTORY_STATUSES.map((status) => {
              const active = selectedFilter === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.pillBtn, active && styles.pillBtnActive]}
                  onPress={() => setSelectedFilter(status)}
                >
                  <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Scrollable list */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No History Available</Text>
              <Text style={styles.emptySubtitle}>Verification actions will populate here.</Text>
            </View>
          ) : (
            filteredHistory.map((item) => {
              const verified = item.status === 'Verified';
              return (
                <View key={item.id} style={styles.historyCard}>
                  {/* Student row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{item.studentName}</Text>
                      <Text style={styles.studentRoll}>{item.rollNumber} • {item.participation} Record</Text>
                    </View>
                    <View style={[styles.statusBadge, verified ? styles.badgeVerified : styles.badgeRejected]}>
                      <Text style={[styles.statusBadgeText, verified ? styles.textVerified : styles.textRejected]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Body details */}
                  <View style={styles.cardBody}>
                    <Text style={styles.achievementCategory}>{item.category}</Text>
                    <Text style={styles.achievementTitle}>{item.title}</Text>
                    <Text style={styles.achievementOrganizer}>Organizer: {item.organization} • Event Date: {item.date}</Text>
                    <Text style={styles.achievementResult}>Prize Result: {item.result} • Reward Value: +{item.points} Pts</Text>
                    {item.rejectionReason && (
                      <View style={styles.reasonCallout}>
                        <Text style={styles.reasonLabel}>Reason:</Text>
                        <Text style={styles.reasonText}>{item.rejectionReason}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  pillLabelActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeVerified: {
    backgroundColor: '#DEF7EC',
  },
  badgeRejected: {
    backgroundColor: '#FDE8E8',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textVerified: {
    color: '#0E9F6E',
  },
  textRejected: {
    color: '#E53E3E',
  },
  cardBody: {
    marginBottom: 4,
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
  achievementResult: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },
  reasonCallout: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 3,
    borderColor: '#E53E3E',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9B1C1C',
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 12,
    color: '#C81E1E',
    marginTop: 2,
    lineHeight: 16,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
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
