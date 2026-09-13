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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { VerificationItem, TeamMember } from '../../data/facultyMockData';

interface VerificationDetailsProps {
  itemId: string;
  onGoBack: () => void;
  onActionComplete: (itemId: string, status: string, reason?: string, updatedMembers?: TeamMember[]) => void;
  verificationItem?: VerificationItem; // Fallback or passed directly
}

export default function VerificationDetails({
  itemId,
  onGoBack,
  onActionComplete,
  verificationItem,
}: VerificationDetailsProps) {
  // Let's find the verification item
  const [item, setItem] = useState<VerificationItem | null>(verificationItem || null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(item?.teamMembers || []);
  const [status, setStatus] = useState(item?.status || 'Pending');

  // Input state for reason
  const [showReasonBox, setShowReasonBox] = useState<'none' | 'reject' | 'resubmit'>('none');
  const [actionReason, setActionReason] = useState('');

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>Submission record not found.</Text>
          <TouchableOpacity style={styles.backLink} onPress={onGoBack}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleApproveAllAssigned = () => {
    if (item.participation === 'Team') {
      // Approve all assigned members
      const updated = teamMembers.map((m) =>
        m.assignedProctor ? { ...m, verified: true } : m
      );
      setTeamMembers(updated);
      
      // If all members are verified, mark overall status as Verified
      const allDone = updated.every((m) => m.verified);
      const newStatus = allDone ? 'Verified' : 'Under Review';
      setStatus(newStatus);

      Alert.alert(
        'Submission Approved',
        'Verified status has been updated for all assigned team members.',
        [
          {
            text: 'OK',
            onPress: () => onActionComplete(item.id, newStatus, undefined, updated),
          },
        ]
      );
    } else {
      setStatus('Verified');
      Alert.alert(
        'Submission Approved',
        'Student achievement has been verified and points will be awarded.',
        [
          {
            text: 'OK',
            onPress: () => onActionComplete(item.id, 'Verified'),
          },
        ]
      );
    }
  };

  const handleActionWithReason = () => {
    if (!actionReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a valid explanation for this action.');
      return;
    }

    const finalStatus = showReasonBox === 'reject' ? 'Rejected' : 'Resubmission Required';
    setStatus(finalStatus);

    Alert.alert(
      showReasonBox === 'reject' ? 'Submission Rejected' : 'Resubmission Requested',
      showReasonBox === 'reject'
        ? 'The achievement submission has been rejected.'
        : 'The student has been notified to edit and resubmit.',
      [
        {
          text: 'OK',
          onPress: () => onActionComplete(item.id, finalStatus, actionReason, teamMembers),
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Review Submission</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Student Info Hero Summary Card */}
          <View style={styles.studentHeroCard}>
            <View style={styles.studentAvatarCircle}>
              <Text style={styles.avatarText}>
                {item.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentMeta}>
              <Text style={styles.studentNameText}>{item.studentName}</Text>
              <Text style={styles.studentRollText}>{item.rollNumber} • 3rd Year • CSE (IoT)</Text>
              <View style={[styles.statusBadge, status === 'Verified' ? styles.badgeVerified : status === 'Resubmission Required' ? styles.badgeResubmit : styles.badgePending]}>
                <Text style={[styles.statusBadgeText, status === 'Verified' ? styles.textVerified : status === 'Resubmission Required' ? styles.textResubmit : styles.textPending]}>
                  {status}
                </Text>
              </View>
            </View>
          </View>

          {/* Form Details Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Achievement Details</Text>
            
            <DetailRow label="Category Type" value={item.category} highlight />
            <DetailRow label="Achievement Type" value={item.type} />
            <DetailRow label="Organizer Name" value={item.organization} />
            <DetailRow label="Level Scope" value={item.level} />
            <DetailRow label="Prize Status / Result" value={item.result} />
            <DetailRow label="Points Value" value={`+${item.points} Achievement Points`} />
            <DetailRow label="Participation Type" value={`${item.participation} Achievement`} />
            <DetailRow label="Submission Date" value={item.submittedDate} />
            <DetailRow label="Proof Transcript ID" value={item.proofId} />
          </View>

          {/* Member-level Verification for Team Achievements */}
          {item.participation === 'Team' && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Member-Level Verification</Text>
              <Text style={styles.sectionHelperText}>
                You can only verify students assigned to you. Other members are handled by their respective proctors.
              </Text>
              
              <View style={styles.membersList}>
                {teamMembers.map((member) => (
                  <View key={member.rollNumber} style={styles.memberRow}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRoll}>{member.rollNumber}</Text>
                      {member.assignedProctor && (
                        <View style={styles.proctorPill}>
                          <Text style={styles.proctorPillText}>Your Student</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.memberAction}>
                      {member.verified ? (
                        <View style={styles.verifiedIconRow}>
                          <Ionicons name="checkmark-circle" size={18} color="#0E9F6E" />
                          <Text style={[styles.verifiedStatusText, { color: '#0E9F6E' }]}>Verified</Text>
                        </View>
                      ) : (
                        <View style={styles.verifiedIconRow}>
                          <Ionicons name="time" size={18} color="#D97706" />
                          <Text style={[styles.verifiedStatusText, { color: '#D97706' }]}>Pending</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Uploaded Proof Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Uploaded Verification Proofs</Text>
            
            <View style={styles.proofsGrid}>
              {item.proofFiles.map((filename, index) => (
                <View key={index} style={styles.proofFileItem}>
                  <View style={styles.fileIconContainer}>
                    <Ionicons 
                      name={filename.endsWith('.pdf') ? 'document-text' : 'image'} 
                      size={28} 
                      color="#2563EB" 
                    />
                  </View>
                  <View style={styles.fileMeta}>
                    <Text style={styles.filenameText} numberOfLines={1}>{filename}</Text>
                    <Text style={styles.filesizeText}>1.4 MB • PDF Document</Text>
                  </View>
                  <View style={styles.fileActions}>
                    <TouchableOpacity 
                      style={styles.fileBtn} 
                      onPress={() => Alert.alert('View Proof', `Displaying proof preview: ${filename}`)}
                    >
                      <Feather name="eye" size={16} color="#4B5563" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.fileBtn}
                      onPress={() => Alert.alert('Download Proof', `Downloading ${filename} to local device.`)}
                    >
                      <Feather name="download" size={16} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Action Comment Box */}
          {showReasonBox !== 'none' && (
            <View style={[styles.sectionCard, styles.reasonCard]}>
              <Text style={styles.reasonCardTitle}>
                {showReasonBox === 'reject' ? 'Rejection Comment' : 'Resubmission Feedback'}
              </Text>
              <TextInput
                style={styles.reasonInput}
                placeholder={
                  showReasonBox === 'reject'
                    ? 'Please explain the reason for rejection...'
                    : 'Explain what corrections the student needs to make...'
                }
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={actionReason}
                onChangeText={setActionReason}
              />
              <View style={styles.reasonActions}>
                <TouchableOpacity
                  style={styles.reasonCancelBtn}
                  onPress={() => {
                    setShowReasonBox('none');
                    setActionReason('');
                  }}
                >
                  <Text style={styles.reasonCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reasonSubmitBtn, { backgroundColor: showReasonBox === 'reject' ? '#EF4444' : '#7C3AED' }]}
                  onPress={handleActionWithReason}
                >
                  <Text style={styles.reasonSubmitBtnText}>Submit Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer Primary Buttons (hidden when feedback box is open) */}
          {showReasonBox === 'none' && (
            <View style={styles.buttonActionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnReject]}
                activeOpacity={0.7}
                onPress={() => {
                  setShowReasonBox('reject');
                  setActionReason('');
                }}
              >
                <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnResubmit]}
                activeOpacity={0.7}
                onPress={() => {
                  setShowReasonBox('resubmit');
                  setActionReason('');
                }}
              >
                <Ionicons name="alert-circle-outline" size={18} color="#7C3AED" />
                <Text style={[styles.actionBtnText, { color: '#7C3AED' }]}>Resubmit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnApprove]}
                activeOpacity={0.7}
                onPress={handleApproveAllAssigned}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Approve</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function DetailRow({ label, value, highlight }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && { color: '#2563EB', fontWeight: '700' }]}>
        {value}
      </Text>
    </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  studentHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  studentAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  studentMeta: {
    flex: 1,
    alignItems: 'flex-start',
  },
  studentNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  studentRollText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeVerified: {
    backgroundColor: '#DEF7EC',
  },
  badgeResubmit: {
    backgroundColor: '#F3E8FF',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textPending: {
    color: '#D97706',
  },
  textVerified: {
    color: '#0E9F6E',
  },
  textResubmit: {
    color: '#7C3AED',
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingBottom: 8,
    marginBottom: 12,
  },
  sectionHelperText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F9FAFB',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '65%',
  },
  membersList: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  memberInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  memberName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  memberRoll: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  proctorPill: {
    backgroundColor: '#E0F2FE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  proctorPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0369A1',
  },
  memberAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  proofsGrid: {
    gap: 10,
  },
  proofFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fileMeta: {
    flex: 1,
  },
  filenameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  filesizeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 6,
  },
  fileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
  },
  btnReject: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FEE2E2',
  },
  btnResubmit: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3E8FF',
  },
  btnApprove: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    flex: 1.4,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  reasonCard: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFBEB',
  },
  reasonCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 10,
    fontSize: 13,
    color: '#1F2937',
    textAlignVertical: 'top',
    height: 70,
  },
  reasonActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  reasonCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  reasonCancelBtnText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  reasonSubmitBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  reasonSubmitBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  backLink: {
    marginTop: 12,
  },
  backLinkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
});
