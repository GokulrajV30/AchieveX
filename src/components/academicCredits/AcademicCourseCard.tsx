// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Course Card Component
// Compact SaaS card for NPTEL, SWAYAM, and VAC course records
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type CreditCourseRecord } from '../../data/academicCreditsData';

interface AcademicCourseCardProps {
  course: CreditCourseRecord;
  onPress: () => void;
}

export default function AcademicCourseCard({ course, onPress }: AcademicCourseCardProps) {
  const isVerified = course.verificationStatus === 'Verified';
  const isPending = course.verificationStatus === 'Pending';
  const isCorrection = course.verificationStatus === 'Correction';

  const getCourseTypeShort = (type: string) => {
    if (type.includes('NPTEL')) return 'NPTEL';
    if (type.includes('SWAYAM')) return 'SWAYAM';
    if (type.includes('VAC') || type.includes('Value Added')) return 'VAC';
    return 'Credit Course';
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.75}
      onPress={onPress}
    >
      {/* Top Meta Row */}
      <View style={styles.topRow}>
        <View style={styles.courseTypeTag}>
          <Text style={styles.courseTypeTagText}>{getCourseTypeShort(course.courseType)}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isVerified && styles.statusVerified,
            isPending && styles.statusPending,
            isCorrection && styles.statusCorrection,
          ]}
        >
          <Ionicons
            name={
              isVerified
                ? 'checkmark-circle'
                : isPending
                ? 'time'
                : 'alert-circle'
            }
            size={12}
            color={
              isVerified
                ? '#15803D'
                : isPending
                ? '#B45309'
                : '#B91C1C'
            }
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

      {/* Course Title & Provider */}
      <Text style={styles.courseName} numberOfLines={2}>
        {course.courseName}
      </Text>
      <Text style={styles.providerText} numberOfLines={1}>
        {course.provider} • {course.domain}
      </Text>

      {/* Structured Metrics Chips */}
      <View style={styles.metricsRow}>
        <View style={styles.metricPill}>
          <Ionicons name="time-outline" size={12} color="#475569" style={{ marginRight: 3 }} />
          <Text style={styles.metricPillText}>{course.duration}</Text>
        </View>

        <View style={styles.metricPillPrimary}>
          <Ionicons name="ribbon-outline" size={12} color="#2563EB" style={{ marginRight: 3 }} />
          <Text style={styles.metricPillPrimaryText}>
            {course.creditsEarned || 0} Credits
          </Text>
        </View>

        <View style={styles.metricPill}>
          <Text style={styles.metricPillText}>{course.semester}</Text>
        </View>
      </View>

      {/* Footer Completion Date */}
      <View style={styles.cardFooter}>
        <Text style={styles.completionDateText}>
          Completed {course.completionDate}
        </Text>
        <View style={styles.actionArrowRow}>
          <Text style={styles.viewDetailsText}>Details</Text>
          <Ionicons name="chevron-forward" size={14} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseTypeTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseTypeTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    fontSize: 11,
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
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 3,
  },
  providerText: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  metricPillPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricPillPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  completionDateText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
});
