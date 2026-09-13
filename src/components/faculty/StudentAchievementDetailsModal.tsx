// ─────────────────────────────────────────────────────────────
// AchieveX — Read-Only Student Achievement Details Modal
// Allows Proctors & Mentors to monitor student records without verification authority.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface ReadOnlyAchievementData {
  id: string;
  studentName: string;
  registerNumber: string;
  department: string;
  title: string;
  category: string;
  event: string;
  organizer: string;
  semester: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Correction' | 'Rejected';
  points?: number;
  proofDocumentName?: string;
  proofType?: string;
}

interface StudentAchievementDetailsModalProps {
  visible: boolean;
  achievement: ReadOnlyAchievementData | null;
  onClose: () => void;
}

export default function StudentAchievementDetailsModal({
  visible,
  achievement,
  onClose,
}: StudentAchievementDetailsModalProps) {
  if (!achievement) return null;

  const isApproved = achievement.status === 'Approved';
  const isPending = achievement.status === 'Pending';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <View style={styles.readOnlyBadge}>
                <Ionicons name="eye-outline" size={12} color="#4F46E5" style={{ marginRight: 4 }} />
                <Text style={styles.readOnlyBadgeText}>MONITORING VIEW</Text>
              </View>
              <Text style={styles.headerTitle}>Achievement Details</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Student Info Card */}
            <View style={styles.studentInfoCard}>
              <View style={styles.studentAvatarCircle}>
                <Ionicons name="person" size={20} color="#2563EB" />
              </View>
              <View style={styles.studentDetailsCol}>
                <Text style={styles.studentName}>{achievement.studentName}</Text>
                <Text style={styles.studentRollNo}>
                  {achievement.registerNumber} • {achievement.department}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isApproved
                    ? styles.statusApproved
                    : isPending
                    ? styles.statusPending
                    : styles.statusCorrection,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isApproved
                      ? styles.statusTextApproved
                      : isPending
                      ? styles.statusTextPending
                      : styles.statusTextCorrection,
                  ]}
                >
                  {isApproved ? '● Approved' : isPending ? '● Pending' : '● Correction'}
                </Text>
              </View>
            </View>

            {/* Achievement Details */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeading}>Achievement Overview</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Title</Text>
                <Text style={styles.infoValueBold}>{achievement.title}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category</Text>
                <Text style={styles.infoValue}>{achievement.category}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Event / Competition</Text>
                <Text style={styles.infoValue}>{achievement.event}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Organizer</Text>
                <Text style={styles.infoValue}>{achievement.organizer}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Semester & Date</Text>
                <Text style={styles.infoValue}>
                  {achievement.semester} • {achievement.date}
                </Text>
              </View>

              {achievement.points !== undefined && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Verified Points</Text>
                  <View style={styles.pointsPill}>
                    <Ionicons name="star" size={13} color="#D97706" style={{ marginRight: 3 }} />
                    <Text style={styles.pointsPillText}>+{achievement.points} Pts</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Proof Attachment */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeading}>Proof Verification Document</Text>
              <View style={styles.proofCard}>
                <View style={styles.proofIconCircle}>
                  <MaterialCommunityIcons name="file-pdf-box" size={24} color="#DC2626" />
                </View>
                <View style={styles.proofTextCol}>
                  <Text style={styles.proofName}>
                    {achievement.proofDocumentName || 'Certificate_Proof.pdf'}
                  </Text>
                  <Text style={styles.proofMeta}>
                    {achievement.proofType || 'Certificate / Marksheet • Verified'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewProofButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewProofButtonText}>Preview</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Note for Proctor */}
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle-outline" size={18} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={styles.noticeText}>
                Proctor view is read-only. Institutional verification and point approvals are processed by the Academic Coordinator.
              </Text>
            </View>
          </ScrollView>

          {/* Close Action */}
          <TouchableOpacity
            style={styles.doneButton}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTextCol: {
    flex: 1,
  },
  readOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  readOnlyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    maxHeight: 460,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  studentInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 16,
  },
  studentAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentDetailsCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentRollNo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCorrection: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextApproved: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B45309',
  },
  statusTextCorrection: {
    color: '#B91C1C',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  infoValueBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pointsPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  proofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proofIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  proofTextCol: {
    flex: 1,
  },
  proofName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  proofMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  viewProofButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewProofButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4F46E5',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 10,
    marginTop: 2,
  },
  noticeText: {
    fontSize: 11.5,
    color: '#4338CA',
    flex: 1,
    lineHeight: 16,
  },
  doneButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
