import React from 'react';
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
import { MOCK_RESUBMISSION_QUEUE } from '../../data/facultyMockData';

interface ResubmissionRequiredProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
}

export default function ResubmissionRequired({
  onGoBack,
  onOpenMenu,
}: ResubmissionRequiredProps) {
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
          <Text style={styles.headerTitle}>Resubmission Required</Text>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.6}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Scrollable list */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_RESUBMISSION_QUEUE.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="alert-circle-outline" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No Resubmissions Pending</Text>
              <Text style={styles.emptySubtitle}>All corrected records are reviewed.</Text>
            </View>
          ) : (
            MOCK_RESUBMISSION_QUEUE.map((item) => (
              <View key={item.id} style={styles.resubmitCard}>
                {/* Student header row */}
                <View style={styles.cardHeader}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                    <Text style={styles.studentRoll}>{item.rollNumber} • {item.participation} Record</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                  </View>
                </View>

                {/* Details body */}
                <View style={styles.cardBody}>
                  <Text style={styles.achievementCategory}>{item.category}</Text>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementOrganizer}>Organizer: {item.organization} • Event Date: {item.date}</Text>

                  {/* Comment box details */}
                  <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackTitle}>Correction Feedback Sent:</Text>
                    <Text style={styles.feedbackText}>{item.rejectionReason}</Text>
                  </View>

                  <View style={styles.proofSummary}>
                    <Ionicons name="document-attach-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
                    <Text style={styles.proofLabel}>Previous Proof File: </Text>
                    <Text style={styles.proofValue}>{item.proofFiles.join(', ')}</Text>
                  </View>
                </View>

                {/* Instructions footer */}
                <View style={styles.cardFooter}>
                  <Ionicons name="information-circle-outline" size={16} color="#4B5563" style={{ marginRight: 6 }} />
                  <Text style={styles.footerNote}>
                    Awaiting student's corrected update.
                  </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  resubmitCard: {
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
    backgroundColor: '#F3E8FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  cardBody: {
    marginBottom: 12,
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
  feedbackContainer: {
    backgroundColor: '#FAF5FF',
    borderLeftWidth: 3,
    borderColor: '#7C3AED',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B21B6',
    textTransform: 'uppercase',
  },
  feedbackText: {
    fontSize: 12,
    color: '#6B21A8',
    marginTop: 2,
    lineHeight: 16,
    fontWeight: '500',
  },
  proofSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  proofLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  proofValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerNote: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
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
