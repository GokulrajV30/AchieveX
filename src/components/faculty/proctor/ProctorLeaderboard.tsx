// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Leaderboard Screen
// Official rankings based strictly on verified achievements for assigned students.
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  PROCTOR_ASSIGNED_STUDENTS,
  PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS,
  type AssignedStudent,
} from '../../../data/facultyWorkspaceData';
import { CATEGORIES } from '../../../data/achievementConfig';
import StudentBottomTab from '../../StudentBottomTab';

interface ProctorLeaderboardProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onSelectStudent: (student: AssignedStudent) => void;
}

export default function ProctorLeaderboard({
  onGoBack,
  onNavigate,
  onSelectStudent,
}: ProctorLeaderboardProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Complete centralized category master: "All Categories" + every active category
  const categoryOptions = useMemo(() => {
    return ['All Categories', ...CATEGORIES.map((c) => c.title)];
  }, []);

  const rankedStudents = useMemo(() => {
    if (selectedCategory === 'All Categories') {
      return [...PROCTOR_ASSIGNED_STUDENTS].sort(
        (a, b) => b.performance.points - a.performance.points
      );
    }
    return PROCTOR_ASSIGNED_STUDENTS.map((student) => {
      const matchingAchievements = PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS.filter((ach) => {
        if (ach.studentId !== student.id) return false;
        if (ach.status !== 'Approved') return false;
        const achCat = ach.category.toLowerCase().trim();
        const selCat = selectedCategory.toLowerCase().trim();
        return achCat === selCat || selCat.includes(achCat) || achCat.includes(selCat);
      });
      const catPoints = matchingAchievements.reduce((sum, a) => sum + (a.points || 0), 0);
      const catCount = matchingAchievements.length;
      return {
        ...student,
        performance: {
          ...student.performance,
          points: catPoints,
          verifiedAchievements: catCount,
        },
      };
    }).sort((a, b) => b.performance.points - a.performance.points);
  }, [selectedCategory]);

  const top1 = rankedStudents[0];
  const top2 = rankedStudents[1];
  const top3 = rankedStudents[2];
  const remaining = rankedStudents.slice(3);

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
            <Text style={styles.headerTitle}>Assigned Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Students under your guidance • CSE (IoT)</Text>
          </View>
        </View>

        {/* Category Filter Chips Row (All Categories + Every Centralized Category) */}
        <View style={styles.filterChipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {categoryOptions.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. TOP 3 PODIUM CARDS
          ════════════════════════════════════════════════ */}
          <View style={styles.podiumContainer}>
            {/* Rank 2 (Silver) */}
            {top2 && (
              <TouchableOpacity
                style={[styles.podiumCard, styles.podiumCard2]}
                activeOpacity={0.8}
                onPress={() => onSelectStudent(top2)}
              >
                <View style={[styles.podiumCrown, { backgroundColor: '#E2E8F0' }]}>
                  <Text style={styles.podiumRankText}>2</Text>
                </View>
                <View style={styles.podiumAvatarCircle}>
                  <Ionicons name="person" size={18} color="#64748B" />
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {top2.name.split(' ')[0]}
                </Text>
                <Text style={styles.podiumPoints}>{top2.performance.points} Pts</Text>
                <Text style={styles.podiumMeta}>
                  {top2.performance.verifiedAchievements} Verified
                </Text>
              </TouchableOpacity>
            )}

            {/* Rank 1 (Gold - Center & Elevated) */}
            {top1 && (
              <TouchableOpacity
                style={[styles.podiumCard, styles.podiumCard1]}
                activeOpacity={0.8}
                onPress={() => onSelectStudent(top1)}
              >
                <View style={[styles.podiumCrown, { backgroundColor: '#FDE047' }]}>
                  <Ionicons name="trophy" size={14} color="#B45309" />
                </View>
                <View style={[styles.podiumAvatarCircle, styles.podiumAvatar1]}>
                  <Ionicons name="person" size={22} color="#2563EB" />
                </View>
                <Text style={[styles.podiumName, styles.podiumName1]} numberOfLines={1}>
                  {top1.name}
                </Text>
                <Text style={styles.podiumRollNo}>{top1.registerNumber}</Text>
                <View style={styles.pointsPillGold}>
                  <Ionicons name="star" size={12} color="#92400E" style={{ marginRight: 3 }} />
                  <Text style={styles.pointsPillGoldText}>
                    {top1.performance.points} Pts
                  </Text>
                </View>
                <Text style={styles.podiumMeta1}>
                  {top1.performance.verifiedAchievements} Achievements
                </Text>
              </TouchableOpacity>
            )}

            {/* Rank 3 (Bronze) */}
            {top3 && (
              <TouchableOpacity
                style={[styles.podiumCard, styles.podiumCard3]}
                activeOpacity={0.8}
                onPress={() => onSelectStudent(top3)}
              >
                <View style={[styles.podiumCrown, { backgroundColor: '#FED7AA' }]}>
                  <Text style={styles.podiumRankText}>3</Text>
                </View>
                <View style={styles.podiumAvatarCircle}>
                  <Ionicons name="person" size={18} color="#C2410C" />
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {top3.name.split(' ')[0]}
                </Text>
                <Text style={styles.podiumPoints}>{top3.performance.points} Pts</Text>
                <Text style={styles.podiumMeta}>
                  {top3.performance.verifiedAchievements} Verified
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ════════════════════════════════════════════════
              2. REMAINING RANKED STUDENTS LIST
          ════════════════════════════════════════════════ */}
          <View style={styles.rankedListCard}>
            <Text style={styles.listTitle}>All Ranked Assigned Students</Text>

            <View style={styles.listItems}>
              {remaining.map((student, idx) => {
                const rank = idx + 4;

                return (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.studentRankRow}
                    activeOpacity={0.75}
                    onPress={() => onSelectStudent(student)}
                  >
                    <View style={styles.rankNumberBox}>
                      <Text style={styles.rankNumberText}>#{rank}</Text>
                    </View>

                    <View style={styles.rankAvatar}>
                      <Ionicons name="person" size={16} color="#2563EB" />
                    </View>

                    <View style={styles.rankInfoCol}>
                      <Text style={styles.rankStudentName}>{student.name}</Text>
                      <Text style={styles.rankStudentMeta}>
                        {student.registerNumber} • {student.performance.verifiedAchievements} Verified
                      </Text>
                    </View>

                    <View style={styles.rankPointsPill}>
                      <Text style={styles.rankPointsText}>
                        {student.performance.points} Pts
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginLeft: 4 }} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <StudentBottomTab
          variant="proctor"
          activeTab="leaderboard"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
            } else if (tab === 'goals') {
              onNavigate('proctorGoalsOverview');
            } else if (tab === 'leaderboard') {
              /* already here */
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
  filterChipsContainer: {
    marginBottom: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  podiumCard1: {
    borderWidth: 2,
    borderColor: '#FDE047',
    paddingVertical: 18,
    backgroundColor: '#FFFEF5',
  },
  podiumCard2: {
    backgroundColor: '#F8FAFC',
  },
  podiumCard3: {
    backgroundColor: '#FFFBF5',
  },
  podiumCrown: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  podiumRankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  podiumAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  podiumAvatar1: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  podiumName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  podiumName1: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  podiumRollNo: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  podiumPoints: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
  },
  podiumMeta: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  podiumMeta1: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  pointsPillGold: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  pointsPillGoldText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  rankedListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  listTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  listItems: {
    gap: 8,
  },
  studentRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rankNumberBox: {
    width: 28,
    alignItems: 'center',
  },
  rankNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  rankAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankInfoCol: {
    flex: 1,
  },
  rankStudentName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  rankStudentMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  rankPointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankPointsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});
