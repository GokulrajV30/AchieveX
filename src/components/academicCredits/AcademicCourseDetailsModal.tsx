// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Course Details Modal Component
// Structured course information, credits breakdown, and proof files
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
import { type CreditCourseRecord } from '../../data/academicCreditsData';

interface AcademicCourseDetailsModalProps {
  visible: boolean;
  course: CreditCourseRecord | null;
  onClose: () => void;
}

export default function AcademicCourseDetailsModal({
  visible,
  course,
  onClose,
}: AcademicCourseDetailsModalProps) {
  if (!course) return null;

  const isVerified = course.verificationStatus === 'Verified';
  const isPending = course.verificationStatus === 'Pending';
  const isCorrection = course.verificationStatus === 'Correction';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <View style={styles.topBadgeRow}>
                <Text style={styles.typeTag}>{course.courseType}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    isVerified && styles.statusVerified,
                    isPending && styles.statusPending,
                    isCorrection && styles.statusCorrection,
                  ]}
                >
                  <Ionicons
                    name={isVerified ? 'checkmark-circle' : isPending ? 'time' : 'alert-circle'}
                    size={12}
                    color={isVerified ? '#15803D' : isPending ? '#B45309' : '#B91C1C'}
                    style={{ marginRight: 3 }}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      isVerified && styles.statusTextVerified,
                      isPending && styles.statusTextPending,
                      isCorrection && styles.statusTextCorrection,
                    ]}
                  >
                    {course.verificationStatus}
                  </Text>
                </View>
              </View>

              <Text style={styles.courseTitle}>{course.courseName}</Text>
            </View>

            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Correction Note if any */}
            {course.comments && (
              <View style={styles.commentBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
                <Text style={styles.commentText}>{course.comments}</Text>
              </View>
            )}

            {/* 1. Course Information */}
            <Text style={styles.sectionHeader}>COURSE INFORMATION</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Provider</Text>
                <Text style={styles.infoValue}>{course.provider}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Domain</Text>
                <Text style={styles.infoValue}>{course.domain}</Text>
              </View>
              {course.certificateId && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Course ID / Cert No.</Text>
                  <Text style={styles.infoValue}>{course.certificateId}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{course.duration}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Completion Date</Text>
                <Text style={styles.infoValue}>{course.completionDate}</Text>
              </View>
            </View>

            {/* 2. Academic Credit */}
            <Text style={styles.sectionHeader}>ACADEMIC CREDIT</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Credits Earned</Text>
                <Text style={[styles.infoValue, { color: '#2563EB', fontWeight: '800' }]}>
                  {course.creditsEarned || 0} Credits
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Semester</Text>
                <Text style={styles.infoValue}>{course.semester}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Academic Year</Text>
                <Text style={styles.infoValue}>{course.academicYear}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Credit Category</Text>
                <Text style={styles.infoValue}>{course.creditType || 'Academic Credit'}</Text>
              </View>
            </View>

            {/* 3. Result & Certification */}
            <Text style={styles.sectionHeader}>RESULT & CERTIFICATION</Text>
            <View style={styles.infoCard}>
              {course.finalScore && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Final Score</Text>
                  <Text style={styles.infoValue}>{course.finalScore}</Text>
                </View>
              )}
              {course.nptelCategory && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>NPTEL Category</Text>
                  <Text style={styles.infoValue}>{course.nptelCategory}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Exam Status</Text>
                <Text style={styles.infoValue}>{course.examStatus || 'Passed'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Certification Status</Text>
                <Text style={styles.infoValue}>{course.certificationStatus}</Text>
              </View>
            </View>

            {/* 4. Proof Documents */}
            <Text style={styles.sectionHeader}>PROOF DOCUMENTS</Text>
            <View style={styles.proofsContainer}>
              {course.proofs.map((proof, idx) => (
                <View key={idx} style={styles.proofRow}>
                  <Ionicons name="document-text" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                  <View style={{ flex: 1, paddingRight: 6 }}>
                    <Text style={styles.proofName} numberOfLines={1}>
                      {proof.name}
                    </Text>
                    <Text style={styles.proofSize}>{proof.size}</Text>
                  </View>
                  <View style={styles.viewBadge}>
                    <Text style={styles.viewBadgeText}>Attached</Text>
                  </View>
                </View>
              ))}

              {course.assessmentProof && (
                <View style={styles.proofRow}>
                  <Ionicons name="bar-chart" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                  <View style={{ flex: 1, paddingRight: 6 }}>
                    <Text style={styles.proofName} numberOfLines={1}>
                      {course.assessmentProof.name}
                    </Text>
                    <Text style={styles.proofSize}>{course.assessmentProof.size}</Text>
                  </View>
                  <View style={styles.viewBadge}>
                    <Text style={styles.viewBadgeText}>Attached</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Close Action Button */}
          <TouchableOpacity
            style={styles.closeActionBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.closeActionBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  grabber: {
    width: 40,
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
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  typeTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusVerified: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCorrection: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  statusTextVerified: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B45309',
  },
  statusTextCorrection: {
    color: '#B91C1C',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    maxHeight: 420,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  commentText: {
    fontSize: 12,
    color: '#991B1B',
    flex: 1,
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4,
    marginBottom: 6,
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: '58%',
    textAlign: 'right',
  },
  proofsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
  },
  proofName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  proofSize: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  viewBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  closeActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  closeActionBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
});
