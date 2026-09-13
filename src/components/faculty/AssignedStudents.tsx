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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { MOCK_ASSIGNED_STUDENTS, StudentRecord, MOCK_VERIFICATION_HISTORY } from '../../data/facultyMockData';

interface AssignedStudentsProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
  userRole: 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
}

export default function AssignedStudents({
  onGoBack,
  onOpenMenu,
  userRole,
}: AssignedStudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Filter students based on search
  const filteredStudents = MOCK_ASSIGNED_STUDENTS.filter((stu) => {
    return (
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getHeaderTitle = () => {
    if (userRole === 'Proctor') return 'My Assigned Students';
    if (userRole === 'HOD') return 'Department Students';
    return 'All Students';
  };

  const getScopeSubtitle = () => {
    if (userRole === 'Proctor') return 'Students under your direct proctorship';
    if (userRole === 'HOD') return 'Students in Department of CSE';
    return 'All active institutional students';
  };

  // Render the detailed read-only profile for a student
  const renderStudentProfileView = (student: StudentRecord) => {
    // Find verified history items for this student to show under "Recent Achievements"
    const studentHistory = MOCK_VERIFICATION_HISTORY.filter(
      (item) => item.studentName === student.name && item.status === 'Verified'
    );

    return (
      <SafeAreaView style={styles.nestedSafeArea} edges={['top', 'left', 'right']}>
        {/* Header Block */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.6}
            onPress={() => setSelectedStudent(null)}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Hero Card */}
          <View style={styles.profileHeroCard}>
            <View style={styles.studentAvatarBig}>
              <Text style={styles.avatarBigText}>
                {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.studentNameHeader}>{student.name}</Text>
            <Text style={styles.studentRollHeader}>{student.rollNumber} • Nandha Eng College</Text>
            <Text style={styles.studentDeptHeader}>{student.department} • {student.year}</Text>
          </View>

          {/* Performance Summary Cards */}
          <View style={styles.statsSummaryGrid}>
            <View style={styles.statsMiniCard}>
              <Text style={styles.statsMiniLabel}>Achievements</Text>
              <Text style={styles.statsMiniValue}>{student.verifiedCount}</Text>
              <Text style={styles.statsMiniSub}>Verified</Text>
            </View>

            <View style={styles.statsMiniCard}>
              <Text style={styles.statsMiniLabel}>AchieveX Points</Text>
              <Text style={[styles.statsMiniValue, { color: '#2563EB' }]}>{student.points}</Text>
              <Text style={styles.statsMiniSub}>Earned</Text>
            </View>

            <View style={styles.statsMiniCard}>
              <Text style={styles.statsMiniLabel}>Rank</Text>
              <Text style={[styles.statsMiniValue, { color: '#D97706' }]}>#{student.rank}</Text>
              <Text style={styles.statsMiniSub}>Leaderboard</Text>
            </View>
          </View>

          {/* Category Distributions */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardHeaderTitle}>Achievement Categories</Text>
            <View style={styles.categoryDistList}>
              <CategoryRow name="Technical & Professional" count={Math.max(1, student.verifiedCount - 4)} total={student.verifiedCount} />
              <CategoryRow name="Sports & Games" count={2} total={student.verifiedCount} />
              <CategoryRow name="Certifications & Learning" count={Math.max(1, student.verifiedCount - 8)} total={student.verifiedCount} />
              <CategoryRow name="Cultural & Co-Curricular" count={1} total={student.verifiedCount} />
            </View>
          </View>

          {/* Recent Verified Achievements */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardHeaderTitle}>Recent Achievements</Text>
            {studentHistory.length === 0 ? (
              <View style={styles.emptyRecentBox}>
                <Ionicons name="trophy-outline" size={24} color="#9CA3AF" />
                <Text style={styles.emptyRecentText}>No verified records loaded in history.</Text>
              </View>
            ) : (
              studentHistory.map((item) => (
                <View key={item.id} style={styles.historyRowItem}>
                  <View style={styles.historyRowMarker} />
                  <View style={styles.historyRowBody}>
                    <Text style={styles.historyRowTitle}>{item.title}</Text>
                    <Text style={styles.historyRowMeta}>{item.category} • {item.organization}</Text>
                    <Text style={styles.historyRowDate}>Verified on: {item.submittedDate}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  if (selectedStudent) {
    return renderStudentProfileView(selectedStudent);
  }

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
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.6}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Filter Container */}
        <View style={styles.filterContainer}>
          <Text style={styles.scopeSubtitle}>{getScopeSubtitle()}</Text>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student by name, register number..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List View */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredStudents.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="people-outline" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptySubtitle}>No records matched your search query.</Text>
            </View>
          ) : (
            filteredStudents.map((student) => (
              <TouchableOpacity
                key={student.rollNumber}
                style={styles.studentCard}
                activeOpacity={0.8}
                onPress={() => setSelectedStudent(student)}
              >
                <View style={styles.cardMainRow}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>
                      {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.studentInfoGroup}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentRoll}>{student.rollNumber} • {student.department}</Text>
                    <Text style={styles.studentYear}>{student.year}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                </View>

                {/* Substats footer */}
                <View style={styles.cardSubstats}>
                  <View style={styles.substatItem}>
                    <Text style={styles.substatValue}>{student.verifiedCount}</Text>
                    <Text style={styles.substatLabel}>Verified</Text>
                  </View>
                  <View style={styles.substatDivider} />
                  <View style={styles.substatItem}>
                    <Text style={[styles.substatValue, { color: '#2563EB' }]}>{student.points}</Text>
                    <Text style={styles.substatLabel}>Points</Text>
                  </View>
                  <View style={styles.substatDivider} />
                  <View style={styles.substatItem}>
                    <Text style={[styles.substatValue, { color: '#D97706' }]}>#{student.rank}</Text>
                    <Text style={styles.substatLabel}>Rank</Text>
                  </View>
                  {student.pendingCount > 0 && (
                    <>
                      <View style={styles.substatDivider} />
                      <View style={styles.substatItem}>
                        <Text style={[styles.substatValue, { color: '#E53E3E' }]}>{student.pendingCount}</Text>
                        <Text style={[styles.substatLabel, { color: '#E53E3E', fontWeight: '700' }]}>Pending</Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

interface CategoryRowProps {
  name: string;
  count: number;
  total: number;
}

function CategoryRow({ name, count, total }: CategoryRowProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryRowText}>
        <Text style={styles.categoryRowName}>{name}</Text>
        <Text style={styles.categoryRowCount}>{count} record(s)</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  nestedSafeArea: {
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
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  scopeSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  studentCard: {
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
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  studentInfoGroup: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  studentRoll: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  studentYear: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  cardSubstats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
  },
  substatItem: {
    alignItems: 'center',
  },
  substatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  substatLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  substatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
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

  /* Nested Profile Styles */
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  studentAvatarBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarBigText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
  },
  studentNameHeader: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },
  studentRollHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 4,
  },
  studentDeptHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 4,
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statsMiniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statsMiniLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statsMiniValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statsMiniSub: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingBottom: 8,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryDistList: {
    gap: 12,
    marginTop: 4,
  },
  categoryRow: {
    gap: 6,
  },
  categoryRowText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryRowName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryRowCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  emptyRecentBox: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  emptyRecentText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  historyRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  historyRowMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0E9F6E',
    marginTop: 6,
    marginRight: 10,
  },
  historyRowBody: {
    flex: 1,
  },
  historyRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  historyRowMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  historyRowDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
