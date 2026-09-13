// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Student Monitoring List
// Read-only CSE (IoT) Department Student Monitoring
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getHODStore,
  type HODStudentMember,
  HOD_YEAR_OPTIONS,
  type HODYearOption,
} from '../../data/hodWorkspaceData';
import HODHeroCard from './HODHeroCard';
import HODBottomTab from './HODBottomTab';

interface HODStudentListProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectStudent?: (student: HODStudentMember) => void;
}

export default function HODStudentList({
  onGoBack,
  onNavigate,
  onSelectStudent,
}: HODStudentListProps) {
  const store = getHODStore();
  const studentsList = store.students;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');

  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      if (selectedYear !== 'All Years' && s.year !== selectedYear) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchRoll = s.rollNumber.toLowerCase().includes(q);
        const matchSec = s.section.toLowerCase().includes(q);
        if (!matchName && !matchRoll && !matchSec) return false;
      }
      return true;
    });
  }, [studentsList, selectedYear, searchQuery]);

  const handleOpenStudent = (st: HODStudentMember) => {
    if (onSelectStudent) {
      onSelectStudent(st);
    }
    onNavigate('hodStudentDetails', { studentId: st.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Department Students</Text>
            <Text style={styles.headerSubtitle}>CSE (IoT) Monitoring</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Standard HOD Hero Card (Medium Size) */}
          <HODHeroCard
            title="DEPARTMENT STUDENTS"
            subtitle="CSE (IoT)"
            icon="people"
            primaryNumber={store.user.stats.studentsCount}
            primaryLabel="Enrolled Students"
            gaugePercent={store.user.stats.achieversPercentage}
            gaugeNumber={`${store.user.stats.achieversPercentage}%`}
            gaugeLabel="Achievers"
            gaugeSubtext="Rate"
            size="medium"
          />

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by student name, roll number, or sec..."
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

          {/* Year Filter Chips (Horizontal Scrolling with 1st Year support) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}
            style={styles.filterChipsRow}
          >
            {HOD_YEAR_OPTIONS.map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <TouchableOpacity
                  key={yr}
                  style={[styles.yearChip, isSelected && styles.yearChipActive]}
                  onPress={() => setSelectedYear(yr)}
                >
                  <Text style={[styles.yearChipText, isSelected && styles.yearChipTextActive]}>
                    {yr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Student List */}
          {filteredStudents.map((st) => {
            const proctor = store.getStudentProctor(st.id);
            const mentor = store.getStudentMentor(st.id);

            return (
              <TouchableOpacity
                key={st.id}
                style={styles.studentCard}
                activeOpacity={0.75}
                onPress={() => handleOpenStudent(st)}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="school" size={16} color="#0F766E" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stName}>{st.name}</Text>
                    <Text style={styles.stMeta}>
                      {st.rollNumber} • {st.year} • {st.section}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </View>

                {/* Faculty Assignments (Proctor & Mentor) */}
                <View style={styles.assignmentsRow}>
                  <View style={styles.assignmentBadge}>
                    <Ionicons name="shield-outline" size={11} color="#0F766E" />
                    <Text style={styles.assignmentText} numberOfLines={1}>
                      Proctor: <Text style={styles.assignmentBold}>{proctor ? proctor.name : 'Not Assigned'}</Text>
                    </Text>
                  </View>
                  <View style={[styles.assignmentBadge, styles.mentorBadge]}>
                    <Ionicons name="school-outline" size={11} color="#7C3AED" />
                    <Text style={[styles.assignmentText, { color: '#6D28D9' }]} numberOfLines={1}>
                      Mentor: <Text style={[styles.assignmentBold, { color: '#6D28D9' }]}>{mentor ? mentor.name : 'Not Assigned'}</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.statPill}>
                    <Text style={styles.statPillLabel}>Achievements:</Text>
                    <Text style={styles.statPillValue}>{st.achievementsCount}</Text>
                  </View>
                  <View style={[styles.statPill, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.statPillLabel, { color: '#16A34A' }]}>Verified:</Text>
                    <Text style={[styles.statPillValue, { color: '#16A34A' }]}>
                      {st.verifiedCount}
                    </Text>
                  </View>
                  {st.nptelCredits > 0 && (
                    <View style={[styles.statPill, { backgroundColor: '#EFF6FF' }]}>
                      <Text style={[styles.statPillLabel, { color: '#2563EB' }]}>NPTEL:</Text>
                      <Text style={[styles.statPillValue, { color: '#2563EB' }]}>
                        {st.nptelCredits} Cr
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Nav */}
        <HODBottomTab activeTab="students" onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
  },
  filterChipsRow: {
    marginBottom: 12,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  yearChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  yearChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  yearChipTextActive: {
    color: '#0F766E',
    fontWeight: '700',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  stMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  assignmentsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  assignmentBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  mentorBadge: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
  },
  assignmentText: {
    fontSize: 10.5,
    color: '#0F766E',
    flex: 1,
  },
  assignmentBold: {
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    gap: 4,
  },
  statPillLabel: {
    fontSize: 10.5,
    color: '#475569',
  },
  statPillValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
});
