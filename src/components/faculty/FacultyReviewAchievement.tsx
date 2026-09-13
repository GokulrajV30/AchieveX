import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FacultyReviewAchievementProps {
  itemId: string;
  onGoBack: () => void;
  onActionComplete: () => void;
}

export default function FacultyReviewAchievement({
  itemId,
  onGoBack,
  onActionComplete,
}: FacultyReviewAchievementProps) {
  const [resubmitModalVisible, setResubmitModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [resubmitReason, setResubmitReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const submissionData = {
    student: {
      name: 'Gokulraj Velusamy',
      department: 'CSE (IoT)',
      year: '3rd Year',
      registerNumber: '22CSE001',
    },
    achievement: {
      category: 'Technical & Professional / Innovation',
      type: 'Hackathon',
      title: 'National Level Innovation Hackathon',
      level: 'Regional',
      participation: 'Team',
      role: 'Team Lead',
      organizer: 'Kongu Engineering College',
      eventDate: '16 August 2026',
      result: 'Winner',
      description:
        "Participated in a regional-level innovation hackathon and secured the Winner position with a team-based technology solution.",
    },
    teamMembers: [
      { name: 'Gokulraj Velusamy', dept: 'CSE (IoT)', year: '3rd Year', role: 'Team Lead' },
      { name: 'Sathish Kumar', dept: 'CSE', year: '3rd Year', role: 'Team Member' },
      { name: 'Jeeva', dept: 'CSE (IoT)', year: '3rd Year', role: 'Team Member' },
      { name: 'Karthikeyan', dept: 'IT', year: '3rd Year', role: 'Team Member' },
    ],
    cashPrize: {
      applicable: true,
      amount: '₹10,000',
      awardedTo: 'Team',
      proof: 'Cash Prize Confirmation',
    },
    proofs: [
      { name: 'Team Achievement Certificate', type: 'PDF', status: 'Verified' },
      { name: 'Official Hackathon Poster', type: 'Image', status: 'Verified' },
      { name: 'Official Winner Announcement', type: 'Image/PDF', status: 'Verified' },
      { name: 'Event Venue Photo', type: 'Location Verified', status: 'Verified' },
    ],
  };

  const handleApprove = () => {
    Alert.alert(
      'Approve Achievement?',
      'This will verify the achievement and make it eligible for points.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            Alert.alert('Success', 'Achievement verified successfully.', [
              {
                text: 'OK',
                onPress: onActionComplete,
              },
            ]);
          },
        },
      ]
    );
  };

  const handleSendResubmit = () => {
    if (!resubmitReason.trim()) {
      Alert.alert('Error', 'Please provide a resubmission reason.');
      return;
    }
    setResubmitModalVisible(false);
    Alert.alert('Request Sent', 'Resubmission request has been sent to the student.', [
      {
        text: 'OK',
        onPress: () => {
          setResubmitReason('');
          onActionComplete();
        },
      },
    ]);
  };

  const handleSendReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a rejection reason.');
      return;
    }
    setRejectModalVisible(false);
    Alert.alert('Achievement Rejected', 'Rejection has been recorded.', [
      {
        text: 'OK',
        onPress: () => {
          setRejectReason('');
          onActionComplete();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionHeaderTitle}>Student Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Student Name</Text>
              <Text style={styles.infoValue}>{submissionData.student.name}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Register Number</Text>
              <Text style={styles.infoValue}>{submissionData.student.registerNumber}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department / Year</Text>
              <Text style={styles.infoValue}>
                {submissionData.student.department} · {submissionData.student.year}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionHeaderTitle}>Achievement Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{submissionData.achievement.category}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Achievement Type</Text>
              <Text style={styles.infoValue}>{submissionData.achievement.type}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Achievement Title</Text>
              <Text style={styles.infoValue}>{submissionData.achievement.title}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Organizer / Level</Text>
              <Text style={styles.infoValue}>
                {submissionData.achievement.organizer} · {submissionData.achievement.level}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Event Date / Result</Text>
              <Text style={styles.infoValue}>
                {submissionData.achievement.eventDate} ·{' '}
                <Text style={{ color: '#16A34A', fontWeight: '800' }}>{submissionData.achievement.result}</Text>
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Participation</Text>
              <Text style={styles.infoValue}>
                {submissionData.achievement.participation} ({submissionData.achievement.role})
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={[styles.infoRow, { flexDirection: 'column', alignItems: 'flex-start', gap: 6 }]}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.descriptionText}>{submissionData.achievement.description}</Text>
            </View>
          </View>

          <Text style={styles.sectionHeaderTitle}>Team Members</Text>
          <View style={styles.detailsCard}>
            {submissionData.teamMembers.map((member, idx) => (
              <View key={idx}>
                <View style={styles.teamMemberRow}>
                  <View style={styles.memberAvatarCircle}>
                    <Text style={styles.memberAvatarText}>
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberNameText}>{member.name}</Text>
                    <Text style={styles.memberSubText}>
                      {member.dept} · {member.year}
                    </Text>
                  </View>
                  <View style={[styles.roleBadge, member.role === 'Team Lead' && styles.roleBadgeLead]}>
                    <Text style={[styles.roleBadgeText, member.role === 'Team Lead' && styles.roleBadgeTextLead]}>
                      {member.role}
                    </Text>
                  </View>
                </View>
                {idx < submissionData.teamMembers.length - 1 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>

          {submissionData.cashPrize.applicable && (
            <>
              <Text style={styles.sectionHeaderTitle}>Cash Prize</Text>
              <View style={styles.detailsCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cash Awarded</Text>
                  <Text style={{ color: '#0E9F6E', fontWeight: '800', fontSize: 14 }}>
                    {submissionData.cashPrize.amount}
                  </Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Awarded To</Text>
                  <Text style={styles.infoValue}>{submissionData.cashPrize.awardedTo}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Proof Document</Text>
                  <Text style={[styles.infoValue, { color: '#2563EB', fontWeight: '700' }]}>
                    {submissionData.cashPrize.proof}
                  </Text>
                </View>
              </View>
            </>
          )}

          <Text style={styles.sectionHeaderTitle}>Submitted Proofs</Text>
          <View style={styles.detailsCard}>
            {submissionData.proofs.map((proof, idx) => (
              <View key={idx}>
                <View style={styles.proofItemRow}>
                  <View style={styles.proofIconCircle}>
                    <Ionicons
                      name={proof.type.includes('Image') ? 'image-outline' : 'document-text-outline'}
                      size={18}
                      color="#2563EB"
                    />
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.proofNameText} numberOfLines={1}>{proof.name}</Text>
                    <Text style={styles.proofTypeTag}>{proof.type}</Text>
                  </View>
                  <View style={styles.proofStatusRow}>
                    <View style={styles.verifiedDot} />
                    <Text style={styles.verifiedText}>{proof.status}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewProofBtn}
                    onPress={() =>
                      Alert.alert('View Proof', `Displaying preview for: ${proof.name}`)
                    }
                  >
                    <Text style={styles.viewProofBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
                {idx < submissionData.proofs.length - 1 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnResubmit]}
              onPress={() => setResubmitModalVisible(true)}
            >
              <Ionicons name="alert-circle-outline" size={16} color="#D97706" style={{ marginRight: 6 }} />
              <Text style={[styles.actionBtnText, { color: '#D97706' }]}>Resubmit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnReject]}
              onPress={() => setRejectModalVisible(true)}
            >
              <Ionicons name="close-circle-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Reject</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.approveBtn}
            onPress={handleApprove}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.approveBtnText}>Approve Achievement</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={resubmitModalVisible}
          onRequestClose={() => setResubmitModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Request Resubmission</Text>
              <Text style={styles.modalSubtitle}>Specify correction details for the student:</Text>
              <TextInput
                style={styles.modalInput}
                multiline
                numberOfLines={4}
                value={resubmitReason}
                onChangeText={setResubmitReason}
                placeholder="e.g. Certificate does not clearly show the participant's name."
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => {
                    setResubmitModalVisible(false);
                    setResubmitReason('');
                  }}
                >
                  <Text style={styles.modalBtnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnConfirm]}
                  onPress={handleSendResubmit}
                >
                  <Text style={styles.modalBtnConfirmText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={rejectModalVisible}
          onRequestClose={() => setRejectModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reject Achievement?</Text>
              <Text style={styles.modalSubtitle}>Provide a reason for rejecting this achievement:</Text>
              <TextInput
                style={styles.modalInput}
                multiline
                numberOfLines={4}
                value={rejectReason}
                onChangeText={setRejectReason}
                placeholder="e.g. Submitted proof does not match the selected achievement."
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => {
                    setRejectModalVisible(false);
                    setRejectReason('');
                  }}
                >
                  <Text style={styles.modalBtnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnConfirm, { backgroundColor: '#EF4444' }]}
                  onPress={handleSendReject}
                >
                  <Text style={styles.modalBtnConfirmText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 14,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  descriptionText: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  teamMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  memberAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  memberNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  memberSubText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  roleBadgeLead: {
    backgroundColor: '#DEF7EC',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  roleBadgeTextLead: {
    color: '#0E9F6E',
  },
  proofItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  proofIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  proofNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#111827',
  },
  proofTypeTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    marginTop: 2.5,
  },
  proofStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0E9F6E',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0E9F6E',
  },
  viewProofBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
  },
  viewProofBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnResubmit: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  actionBtnReject: {
    backgroundColor: '#FDE8E8',
    borderColor: '#FDE8E8',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  approveBtn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    fontSize: 12.5,
    color: '#1F2937',
    fontWeight: '500',
    textAlignVertical: 'top',
    height: 80,
    backgroundColor: '#F9FAFB',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalBtnCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  modalBtnConfirm: {
    backgroundColor: '#2563EB',
  },
  modalBtnConfirmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
