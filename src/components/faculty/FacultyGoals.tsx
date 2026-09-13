// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Professional Goals Screen
// Manages the faculty member's own research, academic, and professional development milestones.
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import StudentBottomTab from '../StudentBottomTab';

interface FacultyGoalsProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
  onOpenMenu?: () => void;
}

interface FacultyGoalItem {
  id: string;
  title: string;
  category: 'Research & Publications' | 'Certifications & FDP' | 'Patents & IPR' | 'Consultancy';
  deadline: string;
  percentage: number;
  completedMilestones: number;
  totalMilestones: number;
  status: 'In Progress' | 'Completed' | 'Upcoming';
}

const INITIAL_FACULTY_GOALS: FacultyGoalItem[] = [
  {
    id: 'fg-1',
    title: 'Publish IEEE Conference Paper on IoT Edge Analytics',
    category: 'Research & Publications',
    deadline: '30 Oct 2026',
    percentage: 75,
    completedMilestones: 3,
    totalMilestones: 4,
    status: 'In Progress',
  },
  {
    id: 'fg-2',
    title: 'Complete NPTEL 12-Week Course: Deep Learning & Vision',
    category: 'Certifications & FDP',
    deadline: '15 Nov 2026',
    percentage: 50,
    completedMilestones: 6,
    totalMilestones: 12,
    status: 'In Progress',
  },
  {
    id: 'fg-3',
    title: 'File Indian Patent on Smart Campus Energy Management',
    category: 'Patents & IPR',
    deadline: '20 Dec 2026',
    percentage: 100,
    completedMilestones: 5,
    totalMilestones: 5,
    status: 'Completed',
  },
  {
    id: 'fg-4',
    title: 'Deliver Industry Consultancy Workshop on Cloud DevOps',
    category: 'Consultancy',
    deadline: '10 Jan 2027',
    percentage: 20,
    completedMilestones: 1,
    totalMilestones: 5,
    status: 'In Progress',
  },
];

export default function FacultyGoals({
  onGoBack,
  onNavigate,
  onOpenMenu,
}: FacultyGoalsProps) {
  const [goalsList, setGoalsList] = useState<FacultyGoalItem[]>(INITIAL_FACULTY_GOALS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredGoals = goalsList.filter((g) =>
    selectedCategory === 'All' ? true : g.category === selectedCategory
  );

  const handleAddGoal = () => {
    Alert.alert(
      'Create Professional Goal 🎯',
      'Select a goal type (Research Paper, NPTEL Course, Patent, Consultancy) to add to your semester milestones.',
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Create', style: 'default' }]
    );
  };

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
            <Text style={styles.headerTitle}>Professional Goals</Text>
            <Text style={styles.headerSubtitle}>Your research & academic milestones</Text>
          </View>
          <TouchableOpacity
            style={styles.addGoalBtn}
            activeOpacity={0.8}
            onPress={handleAddGoal}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addGoalBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryStatBox}>
            <Text style={styles.summaryStatValue}>{goalsList.length}</Text>
            <Text style={styles.summaryStatLabel}>Total Goals</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStatBox}>
            <Text style={[styles.summaryStatValue, { color: '#2563EB' }]}>
              {goalsList.filter((g) => g.status === 'In Progress').length}
            </Text>
            <Text style={styles.summaryStatLabel}>In Progress</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStatBox}>
            <Text style={[styles.summaryStatValue, { color: '#16A34A' }]}>
              {goalsList.filter((g) => g.status === 'Completed').length}
            </Text>
            <Text style={styles.summaryStatLabel}>Completed</Text>
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
          style={styles.categoryScrollView}
        >
          {['All', 'Research & Publications', 'Certifications & FDP', 'Patents & IPR', 'Consultancy'].map(
            (cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat === 'All' ? 'All Goals' : cat}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Goals List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredGoals.map((g) => {
            const isCompleted = g.status === 'Completed';

            return (
              <View key={g.id} style={styles.goalCard}>
                <View style={styles.goalHeaderRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{g.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted ? styles.statusBadgeCompleted : styles.statusBadgeProgress,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isCompleted ? styles.statusTextCompleted : styles.statusTextProgress,
                      ]}
                    >
                      {g.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.goalTitle}>{g.title}</Text>

                <View style={styles.deadlineRow}>
                  <Ionicons name="calendar-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.deadlineText}>Target: {g.deadline}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${g.percentage}%`,
                          backgroundColor: isCompleted ? '#16A34A' : '#2563EB',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentageText}>{g.percentage}%</Text>
                </View>

                <View style={styles.goalFooterRow}>
                  <Text style={styles.milestoneText}>
                    {g.completedMilestones} of {g.totalMilestones} Milestones Completed
                  </Text>
                  <TouchableOpacity
                    style={styles.updatePillBtn}
                    activeOpacity={0.7}
                    onPress={() =>
                      Alert.alert(
                        'Update Milestone 📝',
                        `Update your progress on "${g.title}"`,
                        [{ text: 'Done', style: 'default' }]
                      )
                    }
                  >
                    <Text style={styles.updatePillText}>Update</Text>
                    <Ionicons name="chevron-forward" size={12} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <StudentBottomTab
          activeTab="goals"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'achievements') {
              onNavigate('facultyAchievements');
            } else if (tab === 'goals') {
              /* already here */
            } else if (tab === 'leaderboard') {
              onNavigate('facultyLeaderboard');
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
  addGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addGoalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryStatLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  categoryScrollView: {
    maxHeight: 36,
    marginBottom: 8,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#93C5FD',
  },
  categoryChipText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeProgress: {
    backgroundColor: '#EFF6FF',
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  statusTextProgress: {
    color: '#2563EB',
  },
  statusTextCompleted: {
    color: '#15803D',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deadlineText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  goalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  milestoneText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  updatePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  updatePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },
});
