// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Assigned Students Modal Component
// Allows Proctors to monitor all assigned students with search and filters.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  PROCTOR_ASSIGNED_STUDENTS,
  type AssignedStudent,
} from '../../data/facultyWorkspaceData';

interface ProctorAssignedStudentsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStudent?: (student: AssignedStudent) => void;
}

export default function ProctorAssignedStudentsModal({
  visible,
  onClose,
  onSelectStudent,
}: ProctorAssignedStudentsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'achievers' | 'attention'>('all');

  const filteredStudents = PROCTOR_ASSIGNED_STUDENTS.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (activeFilter === 'achievers') {
      return s.hasVerifiedThisSemester;
    }
    if (activeFilter === 'attention') {
      return s.needsAttention;
    }
    return true;
  });

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
              <Text style={styles.headerTitle}>Assigned Students (20)</Text>
              <Text style={styles.headerSubtitle}>
                Students under your proctor guidance • CSE (IoT)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student by name or roll number..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips */}
          <View style={styles.filterChipsRow}>
            <TouchableOpacity
              style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === 'all' && styles.filterChipTextActive,
                ]}
              >
                All (20)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === 'achievers' && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter('achievers')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === 'achievers' && styles.filterChipTextActive,
                ]}
              >
                Achievers (17)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === 'attention' && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter('attention')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === 'attention' && styles.filterChipTextActive,
                ]}
              >
                Needs Attention (2)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Student List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredStudents.map((student) => {
              return (
                <View key={student.id} style={styles.studentCard}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={18} color="#2563EB" />
                  </View>

                  <View style={styles.infoCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      {student.needsAttention ? (
                        <View style={styles.attentionTag}>
                          <Text style={styles.attentionTagText}>Attention</Text>
                        </View>
                      ) : (
                        <View style={styles.activeTag}>
                          <Text style={styles.activeTagText}>Active</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.rollNo}>
                      {student.registerNumber} • {student.departmentName}
                    </Text>

                    {student.needsAttention ? (
                      <Text style={styles.issueText}>⚠️ {student.attentionReason}</Text>
                    ) : (
                      <View style={styles.metricsRow}>
                        <Text style={styles.metricsText}>
                          🏆 {student.performance.verifiedAchievements} Verified •{' '}
                          <Text style={{ fontWeight: '700', color: '#4F46E5' }}>
                            {student.performance.points} Pts
                          </Text>
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
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
    maxHeight: '80%',
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
    marginBottom: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  scrollView: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingBottom: 8,
    gap: 10,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  activeTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  attentionTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  attentionTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B91C1C',
  },
  rollNo: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 3,
  },
  issueText: {
    fontSize: 11.5,
    color: '#B91C1C',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsText: {
    fontSize: 11.5,
    color: '#475569',
  },
});
