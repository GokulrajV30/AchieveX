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
import { FACULTY_PROFILES } from '../../data/facultyMockData';

interface FacultyReportsProps {
  onGoBack: () => void;
  onOpenMenu: () => void;
  userRole: 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal';
}

export default function FacultyReports({
  onGoBack,
  onOpenMenu,
  userRole,
}: FacultyReportsProps) {
  const profile = FACULTY_PROFILES[userRole] || FACULTY_PROFILES.Proctor;

  const renderProctorReports = () => {
    return (
      <View style={styles.reportContainer}>
        {/* Metric Summary */}
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total Submissions</Text>
            <Text style={styles.metricValue}>18</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Verified Records</Text>
            <Text style={[styles.metricValue, { color: '#0E9F6E' }]}>14</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Awaiting Review</Text>
            <Text style={[styles.metricValue, { color: '#D97706' }]}>4</Text>
          </View>
        </View>

        {/* Category breakdown bar percentages */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Category Distribution</Text>
          <View style={styles.distList}>
            <ReportProgressRow name="Technical & Professional" count={8} percentage={57} color="#2563EB" />
            <ReportProgressRow name="Sports & Games" count={3} percentage={21} color="#0E9F6E" />
            <ReportProgressRow name="Certifications & Learning" count={2} percentage={14} color="#7C3AED" />
            <ReportProgressRow name="Cultural & Co-Curricular" count={1} percentage={8} color="#D97706" />
          </View>
        </View>

        {/* Student Progress Leaderboard list */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Top Performers under Supervision</Text>
          <View style={styles.distList}>
            <ReportStudentRow rank={1} name="Gokulraj Velusamy" points={242} count={14} />
            <ReportStudentRow rank={2} name="Divya Bharathi" points={195} count={10} />
            <ReportStudentRow rank={3} name="Arun Kumar" points={110} count={6} />
          </View>
        </View>
      </View>
    );
  };

  const renderHODReports = () => {
    return (
      <View style={styles.reportContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Dept Submissions</Text>
            <Text style={styles.metricValue}>52</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Dept Points Sum</Text>
            <Text style={[styles.metricValue, { color: '#2563EB' }]}>1,450</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Pending Action</Text>
            <Text style={[styles.metricValue, { color: '#EF4444' }]}>9</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Year-wise Department Tally</Text>
          <View style={styles.distList}>
            <ReportProgressRow name="3rd Year (Batch 2024-28)" count={32} percentage={61} color="#2563EB" />
            <ReportProgressRow name="2nd Year (Batch 2025-29)" count={12} percentage={23} color="#0E9F6E" />
            <ReportProgressRow name="4th Year (Batch 2023-27)" count={8} percentage={16} color="#7C3AED" />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Top Department Achievers</Text>
          <View style={styles.distList}>
            <ReportStudentRow rank={1} name="Gokulraj Velusamy" points={242} count={14} />
            <ReportStudentRow rank={2} name="Divya Bharathi" points={195} count={10} />
            <ReportStudentRow rank={3} name="Rahul" points={160} count={8} />
          </View>
        </View>
      </View>
    );
  };

  const renderCoordinatorReports = () => {
    return (
      <View style={styles.reportContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>College Submissions</Text>
            <Text style={styles.metricValue}>194</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Verified Achievements</Text>
            <Text style={[styles.metricValue, { color: '#0E9F6E' }]}>152</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Verification Rate</Text>
            <Text style={[styles.metricValue, { color: '#2563EB' }]}>78.3%</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Department Points Tally</Text>
          <View style={styles.distList}>
            <ReportProgressRow name="CSE & CSE(IoT)" count={1450} percentage={54} color="#2563EB" labelText="1450 pts" />
            <ReportProgressRow name="Information Technology" count={780} percentage={29} color="#7C3AED" labelText="780 pts" />
            <ReportProgressRow name="ECE" count={450} percentage={17} color="#D97706" labelText="450 pts" />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Category Distribution (College-wide)</Text>
          <View style={styles.distList}>
            <ReportProgressRow name="Technical & Professional" count={92} percentage={60} color="#2563EB" />
            <ReportProgressRow name="Certifications & Learning" count={30} percentage={20} color="#7C3AED" />
            <ReportProgressRow name="Sports & Games" count={18} percentage={12} color="#0E9F6E" />
            <ReportProgressRow name="Research & IPR" count={12} percentage={8} color="#EF4444" />
          </View>
        </View>
      </View>
    );
  };

  const renderPrincipalReports = () => {
    return (
      <View style={styles.reportContainer}>
        {/* Top-Level principal stats */}
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total Points Tally</Text>
            <Text style={[styles.metricValue, { color: '#2563EB' }]}>2,680</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Verified Achievements</Text>
            <Text style={[styles.metricValue, { color: '#0E9F6E' }]}>152</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Pending Institutional</Text>
            <Text style={[styles.metricValue, { color: '#D97706' }]}>24</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Institutional Department Comparison</Text>
          <View style={styles.distList}>
            <ReportProgressRow name="CSE" count={1450} percentage={54} color="#2563EB" labelText="1450 pts" />
            <ReportProgressRow name="Information Technology" count={780} percentage={29} color="#7C3AED" labelText="780 pts" />
            <ReportProgressRow name="ECE" count={450} percentage={17} color="#D97706" labelText="450 pts" />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Institutional Verification Status</Text>
          <View style={styles.distList}>
            <ReportProgressRow name="Verified" count={152} percentage={78} color="#0E9F6E" />
            <ReportProgressRow name="Pending Review" count={24} percentage={12} color="#D97706" />
            <ReportProgressRow name="Rejected" count={12} percentage={6} color="#EF4444" />
            <ReportProgressRow name="Resubmission Required" count={6} percentage={4} color="#7C3AED" />
          </View>
        </View>
      </View>
    );
  };

  const getHeaderTitle = () => {
    if (userRole === 'Proctor') return 'Supervision Reports';
    if (userRole === 'HOD') return 'Department Reports';
    if (userRole === 'Academic Coordinator') return 'College Reports';
    return 'Institution Reports';
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
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.6}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Contents */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Intro Banner */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>{profile.role} Analytics Portal</Text>
            <Text style={styles.welcomeSubtitle}>Monitoring scope: {profile.role} dashboard statistics</Text>
          </View>

          {/* Conditional Layout */}
          {userRole === 'Proctor' && renderProctorReports()}
          {userRole === 'HOD' && renderHODReports()}
          {userRole === 'Academic Coordinator' && renderCoordinatorReports()}
          {userRole === 'Principal' && renderPrincipalReports()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

interface ReportProgressRowProps {
  name: string;
  count: number;
  percentage: number;
  color: string;
  labelText?: string;
}

function ReportProgressRow({ name, count, percentage, color, labelText }: ReportProgressRowProps) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressRowName}>{name}</Text>
        <Text style={[styles.progressRowCount, { color }]}>
          {labelText || `${count} (${percentage}%)`}
        </Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

interface ReportStudentRowProps {
  rank: number;
  name: string;
  points: number;
  count: number;
}

function ReportStudentRow({ rank, name, points, count }: ReportStudentRowProps) {
  return (
    <View style={styles.studentTallyRow}>
      <View style={styles.studentTallyLeft}>
        <View style={[styles.rankBadge, rank === 1 ? styles.goldRank : rank === 2 ? styles.silverRank : styles.bronzeRank]}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        <View style={styles.studentTallyNameBox}>
          <Text style={styles.studentTallyName}>{name}</Text>
          <Text style={styles.studentTallySub}>{count} verified achievements</Text>
        </View>
      </View>
      <Text style={styles.studentTallyPoints}>+{points} Pts</Text>
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
  welcomeBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 14,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
  },
  welcomeSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    marginTop: 4,
  },
  reportContainer: {
    gap: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
  },
  sectionCard: {
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
  distList: {
    gap: 12,
  },
  progressRow: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressRowName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressRowCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  studentTallyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  studentTallyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  goldRank: {
    backgroundColor: '#FEF08A',
  },
  silverRank: {
    backgroundColor: '#E5E7EB',
  },
  bronzeRank: {
    backgroundColor: '#FED7AA',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  studentTallyNameBox: {},
  studentTallyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  studentTallySub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  studentTallyPoints: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
});
