// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Credits Filter Bottom Sheet Component
// Filters courses by type, semester, academic year, and status
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
import { COURSE_TYPES, COURSE_STATUSES } from '../../data/academicCreditsData';

interface AcademicCreditsFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedSemester: string;
  onSelectSemester: (sem: string) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const SEMESTERS = [
  'All Semesters',
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const ACADEMIC_YEARS = ['All Years', '2026–27', '2025–26', '2024–25'];

export default function AcademicCreditsFilterSheet({
  visible,
  onClose,
  selectedType,
  onSelectType,
  selectedSemester,
  onSelectSemester,
  selectedYear,
  onSelectYear,
  selectedStatus,
  onSelectStatus,
  onReset,
  onApply,
}: AcademicCreditsFilterSheetProps) {
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
            <Text style={styles.sheetTitle}>Filter Courses</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Course Type */}
            <Text style={styles.sectionHeading}>Course Type</Text>
            <View style={styles.chipsWrap}>
              {COURSE_TYPES.map((type) => {
                const active = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.75}
                    onPress={() => onSelectType(type)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Semester */}
            <Text style={styles.sectionHeading}>Semester</Text>
            <View style={styles.chipsWrap}>
              {SEMESTERS.map((sem) => {
                const active = selectedSemester === sem;
                return (
                  <TouchableOpacity
                    key={sem}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.75}
                    onPress={() => onSelectSemester(sem)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {sem}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Academic Year */}
            <Text style={styles.sectionHeading}>Academic Year</Text>
            <View style={styles.chipsWrap}>
              {ACADEMIC_YEARS.map((year) => {
                const active = selectedYear === year;
                return (
                  <TouchableOpacity
                    key={year}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.75}
                    onPress={() => onSelectYear(year)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Status */}
            <Text style={styles.sectionHeading}>Verification Status</Text>
            <View style={styles.chipsWrap}>
              {COURSE_STATUSES.map((status) => {
                const active = selectedStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.75}
                    onPress={() => onSelectStatus(status)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.resetBtn}
              activeOpacity={0.75}
              onPress={onReset}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              activeOpacity={0.85}
              onPress={onApply}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '80%',
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
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    maxHeight: 380,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
    marginTop: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
