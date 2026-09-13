// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Performance Analytics Screen
// Analytical center for the assigned student group's progress and category trends.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Svg, { Circle, G } from 'react-native-svg';
import {
  PROCTOR_SUMMARY_DATA,
  PROCTOR_ASSIGNED_STUDENTS,
  PROCTOR_NEEDS_ATTENTION,
  type AssignedStudent,
} from '../../../data/facultyWorkspaceData';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorPerformanceProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onSelectStudent: (student: AssignedStudent) => void;
}

const CATEGORY_DISTRIBUTION = [
  { name: 'Technical & Professional', count: 8, color: '#2563EB', percentage: 44 },
  { name: 'Sports & Games', count: 4, color: '#16A34A', percentage: 22 },
  { name: 'Research & IPR', count: 3, color: '#7C3AED', percentage: 17 },
  { name: 'Cultural Activities', count: 2, color: '#F59E0B', percentage: 11 },
  { name: 'Social Impact', count: 1, color: '#EC4899', percentage: 6 },
];

export default function ProctorPerformance({
  onGoBack,
  onNavigate,
  onSelectStudent,
}: ProctorPerformanceProps) {
  const [selectedSemester, setSelectedSemester] = useState('Semester 5');
  const [semesterDropdownVisible, setSemesterDropdownVisible] = useState(false);

  const topStudents = [...PROCTOR_ASSIGNED_STUDENTS]
    .sort((a, b) => b.performance.points - a.performance.points)
    .slice(0, 5);

  const size = 110;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const achieverPercent = PROCTOR_SUMMARY_DATA.achieverPercentage;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Group Performance</Text>
            <Text style={styles.headerSubtitle}>CSE (IoT) • Assigned 20 Students</Text>
          </View>

          {/* Period Selector Dropdown Button */}
          <TouchableOpacity
            style={styles.periodPill}
            activeOpacity={0.75}
            onPress={() => setSemesterDropdownVisible(!semesterDropdownVisible)}
          >
            <Text style={styles.periodPillText}>{selectedSemester}</Text>
            <Ionicons name="chevron-down" size={12} color="#2563EB" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Dropdown Options */}
        {semesterDropdownVisible && (
          <View style={styles.dropdownBox}>
            {['All Semesters', 'Semester 5', 'Semester 4', 'Semester 3'].map((sem) => (
              <TouchableOpacity
                key={sem}
                style={[
                  styles.dropdownItem,
                  selectedSemester === sem && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedSemester(sem);
                  setSemesterDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedSemester === sem && styles.dropdownItemTextActive,
                  ]}
                >
                  {sem}
                </Text>
                {selectedSemester === sem && (
                  <Ionicons name="checkmark" size={14} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. PERFORMANCE HERO BANNER
          ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadgeCircle}>
                <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.heroTitleCol}>
                <Text style={styles.heroTitle}>Student Group Standing</Text>
                <Text style={styles.heroSubtitle}>20 Assigned Students • {selectedSemester}</Text>
              </View>
            </View>

            <View style={styles.heroBodyRow}>
              <View style={styles.heroLeftCol}>
                <Text style={styles.heroBigNumber}>2,840</Text>
                <Text style={styles.heroNumberLabel}>Total Verified Points</Text>
                <View style={styles.verifiedCountPill}>
                  <Text style={styles.verifiedCountPillText}>
                    18 Approved Achievements
                  </Text>
                </View>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.gaugeBox}>
                <View style={styles.svgWrapper}>
                  <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(99, 102, 241, 0.45)"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FDE047"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - achieverPercent / 100)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </G>
                  </Svg>

                  <View style={styles.gaugeTextOverlay}>
                    <Text style={styles.gaugePercentText}>{achieverPercent}%</Text>
                    <Text style={styles.gaugeLabelText}>Achievers</Text>
                    <Text style={styles.gaugeFractionText}>17 of 20</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              2. SUMMARY METRICS ROW
          ════════════════════════════════════════════════ */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people" size={16} color="#2563EB" />
              </View>
              <Text style={styles.metricCardValue}>{PROCTOR_SUMMARY_DATA.assignedStudents}</Text>
              <Text style={styles.metricCardLabel}>Assigned</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
              </View>
              <Text style={styles.metricCardValue}>{PROCTOR_SUMMARY_DATA.totalApproved}</Text>
              <Text style={styles.metricCardLabel}>Verified</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="hourglass" size={16} color="#D97706" />
              </View>
              <Text style={styles.metricCardValue}>{PROCTOR_SUMMARY_DATA.totalPending}</Text>
              <Text style={styles.metricCardLabel}>Pending</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
              </View>
              <Text style={styles.metricCardValue}>3</Text>
              <Text style={styles.metricCardLabel}>Attention</Text>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              3. CATEGORY DISTRIBUTION
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Category Performance</Text>
            <Text style={styles.sectionSubtitle}>Breakdown across verified student achievements</Text>

            <View style={styles.categoryList}>
              {CATEGORY_DISTRIBUTION.map((cat) => (
                <View key={cat.name} style={styles.categoryRow}>
                  <View style={styles.categoryLabelRow}>
                    <Text style={styles.categoryNameText}>{cat.name}</Text>
                    <Text style={styles.categoryCountText}>{cat.count} Achievements</Text>
                  </View>

                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${cat.percentage}%`, backgroundColor: cat.color },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              4. TOP ASSIGNED STUDENTS
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top Students</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onNavigate('proctorLeaderboard')}
              >
                <Text style={styles.viewLeaderboardText}>Full Leaderboard ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.topStudentsList}>
              {topStudents.map((student, index) => {
                const rank = index + 1;
                return (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.topStudentRow}
                    activeOpacity={0.75}
                    onPress={() => onSelectStudent(student)}
                  >
                    <View
                      style={[
                        styles.rankBadge,
                        rank === 1
                          ? styles.rank1Badge
                          : rank === 2
                          ? styles.rank2Badge
                          : rank === 3
                          ? styles.rank3Badge
                          : styles.rankDefaultBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.rankBadgeText,
                          rank <= 3 && styles.rankBadgeTextHighlight,
                        ]}
                      >
                        #{rank}
                      </Text>
                    </View>

                    <View style={styles.topStudentInfoCol}>
                      <Text style={styles.topStudentName}>{student.name}</Text>
                      <Text style={styles.topStudentMeta}>
                        {student.registerNumber} • {student.performance.verifiedAchievements} Achievements
                      </Text>
                    </View>

                    <View style={styles.topStudentPointsPill}>
                      <Ionicons name="star" size={12} color="#D97706" style={{ marginRight: 3 }} />
                      <Text style={styles.topStudentPointsText}>
                        {student.performance.points} Pts
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              5. NEEDS ATTENTION SUMMARY
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Students Needing Attention</Text>
              <View style={styles.attentionTag}>
                <Text style={styles.attentionTagText}>3 Students</Text>
              </View>
            </View>

            <View style={styles.attentionList}>
              {PROCTOR_NEEDS_ATTENTION.map((att) => {
                const student = PROCTOR_ASSIGNED_STUDENTS.find((s) => s.id === att.studentId);
                return (
                  <TouchableOpacity
                    key={att.id}
                    style={styles.attentionItem}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (student) onSelectStudent(student);
                    }}
                  >
                    <View style={styles.attentionIconCircle}>
                      <Ionicons name="person-outline" size={16} color="#DC2626" />
                    </View>
                    <View style={styles.attentionCol}>
                      <Text style={styles.attentionStudentName}>{att.name}</Text>
                      <Text style={styles.attentionReasonText}>{att.issue}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation (Goals / Standing Tab) */}
        <StudentBottomTab
          variant="proctor"
          activeTab="goals"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
            } else if (tab === 'goals') {
              onNavigate('proctorGoalsOverview');
            } else if (tab === 'leaderboard') {
              onNavigate('proctorLeaderboard');
            } else if (tab === 'profile') {
              onNavigate('facultyProfile');
            }
          }}
        />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF8F5',
    position: 'relative',
    zIndex: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  periodPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  dropdownBox: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 4,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 14,
  },
  heroCard: {
    borderRadius: 22,
    padding: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadgeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroTitleCol: {
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeftCol: {
    flex: 1,
  },
  heroBigNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  heroNumberLabel: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 2,
  },
  verifiedCountPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  verifiedCountPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricDivider: {
    width: 1,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  gaugeBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    position: 'relative',
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugePercentText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  gaugeLabelText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  gaugeFractionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FDE047',
    marginTop: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricCardValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricCardLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewLeaderboardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  categoryList: {
    gap: 10,
  },
  categoryRow: {
    gap: 4,
  },
  categoryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  categoryCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  barBackground: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  topStudentsList: {
    gap: 8,
  },
  topStudentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rank1Badge: {
    backgroundColor: '#FEF3C7',
  },
  rank2Badge: {
    backgroundColor: '#F1F5F9',
  },
  rank3Badge: {
    backgroundColor: '#FFEDD5',
  },
  rankDefaultBadge: {
    backgroundColor: '#F8FAFC',
  },
  rankBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  rankBadgeTextHighlight: {
    color: '#B45309',
  },
  topStudentInfoCol: {
    flex: 1,
  },
  topStudentName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  topStudentMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  topStudentPointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topStudentPointsText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  attentionTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  attentionTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B91C1C',
  },
  attentionList: {
    gap: 8,
  },
  attentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
  },
  attentionIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  attentionCol: {
    flex: 1,
  },
  attentionStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  attentionReasonText: {
    fontSize: 11.5,
    color: '#B91C1C',
    marginTop: 1,
  },
});
