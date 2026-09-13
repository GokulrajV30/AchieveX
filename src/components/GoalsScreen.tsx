// ─────────────────────────────────────────────────────────────
// AchieveX — Student Goals Screen
// Premium, Achievement-Focused Goal Planning & Tracking
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

import {
  INITIAL_GOALS,
  type Goal,
  type MilestoneProof,
  type GoalPriority,
  type GoalLifecycleStatus,
} from '../data/goalsData';

import GoalOverviewHero from './goals/GoalOverviewHero';
import GoalQuickStats from './goals/GoalQuickStats';
import GoalInsightCard from './goals/GoalInsightCard';
import GoalCard from './goals/GoalCard';
import GoalFilterSheet from './goals/GoalFilterSheet';
import CreateGoalSheet from './goals/CreateGoalSheet';
import GoalDetailsScreen from './goals/GoalDetailsScreen';
import StudentBottomTab from './StudentBottomTab';
import { showAchieveXDialog, showAchieveXToast } from './feedback/AchieveXFeedback';
import { useBottomNavInset } from '../hooks/useBottomNavInset';

interface GoalsScreenProps {
  onGoBack: () => void;
  onOpenSubmitAchievement?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenMyAchievements?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (screen: string) => void;
}

export default function GoalsScreen({
  onGoBack,
  onOpenSubmitAchievement,
  onOpenLeaderboard,
  onOpenMyAchievements,
  onOpenProfile,
  onNavigate,
}: GoalsScreenProps) {
  const { contentBottomPadding } = useBottomNavInset();
  // ── Goals Database State ──
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // ── Tab & Filter States ──
  const [activeTab, setActiveTab] = useState<GoalLifecycleStatus>('Active');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOption, setSortOption] = useState<'Deadline' | 'Priority' | 'Progress'>('Deadline');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);
  const [academicYear, setAcademicYear] = useState('2026–27');

  // Navigation handlers
  const handleNavHome = () => {
    if (onNavigate) onNavigate('dashboard');
    else onGoBack();
  };

  const handleNavAchievements = () => {
    if (onNavigate) onNavigate('myAchievements');
    else if (onOpenMyAchievements) onOpenMyAchievements();
    else if (onOpenSubmitAchievement) onOpenSubmitAchievement();
  };

  const handleNavLeaderboard = () => {
    if (onNavigate) onNavigate('leaderboard');
    else if (onOpenLeaderboard) onOpenLeaderboard();
  };

  const handleNavProfile = () => {
    if (onNavigate) onNavigate('profile');
    else if (onOpenProfile) onOpenProfile();
  };

  // ── Metrics Calculation ──
  const activeGoals = useMemo(
    () => goals.filter((g) => g.status === 'Active'),
    [goals]
  );
  const completedGoals = useMemo(
    () => goals.filter((g) => g.status === 'Completed'),
    [goals]
  );
  const pausedGoals = useMemo(
    () => goals.filter((g) => g.status === 'Paused'),
    [goals]
  );

  const activeCount = activeGoals.length;
  const completedCount = completedGoals.length;
  const overallProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length
        )
      : 0;

  // ── Filtered & Sorted Goals for Current Tab ──
  const displayedGoals = useMemo(() => {
    let list = goals.filter((g) => g.status === activeTab);

    // Category filter
    if (categoryFilter !== 'All Categories') {
      list = list.filter((g) => g.categoryTitle === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      list = list.filter((g) => g.priority === priorityFilter);
    }

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortOption === 'Deadline') {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      }
      if (sortOption === 'Priority') {
        const pOrder: Record<GoalPriority, number> = { High: 1, Medium: 2, Low: 3 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      if (sortOption === 'Progress') {
        return b.progress - a.progress;
      }
      return 0;
    });

    return list;
  }, [goals, activeTab, categoryFilter, priorityFilter, sortOption]);

  // ── Smart Insight (Next Best Step) ──
  const topActiveGoal = useMemo(() => {
    if (activeGoals.length === 0) return null;
    return [...activeGoals].sort((a, b) => b.progress - a.progress)[0];
  }, [activeGoals]);

  const insightText = topActiveGoal
    ? `You're making steady progress on "${topActiveGoal.title}" (${topActiveGoal.progress}%). Complete your next milestone to move closer to your target outcome.`
    : 'Set your next target achievement and break it down into actionable milestones.';

  // ── Goal Action Handlers ──
  const handleCompleteMilestone = (
    goalId: string,
    milestoneId: string,
    proof?: MilestoneProof
  ) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;

        const updatedMilestones = g.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          return {
            ...m,
            completed: true,
            completedAt: new Date().toISOString().split('T')[0],
            proof: proof || m.proof,
          };
        });

        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const total = updatedMilestones.length;
        const calculatedProgress =
          total > 0 ? Math.round((completedCount / total) * 100) : g.progress;

        return {
          ...g,
          milestones: updatedMilestones,
          progress: calculatedProgress,
          status:
            calculatedProgress === 100 && g.status === 'Active'
              ? 'Completed'
              : g.status,
          completedAt:
            calculatedProgress === 100
              ? new Date().toISOString().split('T')[0]
              : g.completedAt,
        };
      })
    );
  };

  const handleUpdateStatus = (
    goalId: string,
    status: 'Active' | 'Completed' | 'Paused'
  ) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          status,
          progress: status === 'Completed' ? 100 : g.progress,
          completedAt:
            status === 'Completed'
              ? new Date().toISOString().split('T')[0]
              : undefined,
        };
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    setSelectedGoalId(null);
    showAchieveXToast({
      type: 'info',
      message: 'Goal deleted',
    });
  };

  const handleCreateGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    setActiveTab('Active');
    showAchieveXDialog({
      type: 'success',
      title: 'Goal Created',
      message: 'Your goal is ready to track.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  // ─────────────────────────────────────────────────────────────
  // IF A GOAL IS SELECTED -> RENDER GOAL DETAILS SCREEN
  // ─────────────────────────────────────────────────────────────
  if (selectedGoalId) {
    const activeGoal = goals.find((g) => g.id === selectedGoalId);
    if (activeGoal) {
      return (
        <GoalDetailsScreen
          goal={activeGoal}
          onBack={() => setSelectedGoalId(null)}
          onCompleteMilestone={handleCompleteMilestone}
          onUpdateStatus={handleUpdateStatus}
          onDeleteGoal={handleDeleteGoal}
          onOpenHome={handleNavHome}
          onOpenAchievements={handleNavAchievements}
          onOpenLeaderboard={handleNavLeaderboard}
          onOpenProfile={handleNavProfile}
        />
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN GOALS HOME VIEW
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5F0" />

      {/* 1. Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Goals</Text>
            <Text style={styles.pageSubtitle}>
              Turn your ambitions into progress.
            </Text>
          </View>
        </View>

        {/* Compact + New Goal Button */}
        <TouchableOpacity
          style={styles.newGoalBtn}
          activeOpacity={0.85}
          onPress={() => setCreateSheetVisible(true)}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.newGoalBtnText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Goal Overview Hero Card */}
        <GoalOverviewHero
          activeCount={activeCount}
          completedCount={completedCount}
          overallProgress={overallProgress}
          academicYear={academicYear}
          onPressYear={() => {
            setAcademicYear((prev) =>
              prev === '2026–27' ? '2025–26' : '2026–27'
            );
          }}
        />

        {/* 3. Quick Stats (3 Compact Cards) */}
        <GoalQuickStats
          activeCount={activeCount}
          completedCount={completedCount}
          avgProgress={overallProgress}
        />

        {/* 4. Smart Insight ("Next Best Step") */}
        <GoalInsightCard
          insightText={insightText}
          onPressAction={
            topActiveGoal ? () => setSelectedGoalId(topActiveGoal.id) : undefined
          }
        />

        {/* 5. Goal Filter Tabs & Filter Icon */}
        <View style={styles.tabsSection}>
          <View style={styles.tabsRow}>
            {(['Active', 'Completed', 'Paused'] as GoalLifecycleStatus[]).map((tab) => {
              const isActive = activeTab === tab;
              const count =
                tab === 'Active'
                  ? activeCount
                  : tab === 'Completed'
                  ? completedCount
                  : pausedGoals.length;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                    {tab} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filter icon button */}
          <TouchableOpacity
            style={[
              styles.filterIconBtn,
              (categoryFilter !== 'All Categories' || priorityFilter !== 'All') &&
                styles.filterIconBtnActive,
            ]}
            activeOpacity={0.75}
            onPress={() => setFilterSheetVisible(true)}
          >
            <Ionicons
              name="funnel-outline"
              size={16}
              color={
                categoryFilter !== 'All Categories' || priorityFilter !== 'All'
                  ? '#2563EB'
                  : '#475569'
              }
            />
          </TouchableOpacity>
        </View>

        {/* Active Filter Indicators */}
        {(categoryFilter !== 'All Categories' || priorityFilter !== 'All') && (
          <View style={styles.activeFiltersRow}>
            {categoryFilter !== 'All Categories' && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>{categoryFilter}</Text>
                <TouchableOpacity onPress={() => setCategoryFilter('All Categories')}>
                  <Ionicons name="close-circle" size={14} color="#2563EB" />
                </TouchableOpacity>
              </View>
            )}
            {priorityFilter !== 'All' && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>{priorityFilter} Priority</Text>
                <TouchableOpacity onPress={() => setPriorityFilter('All')}>
                  <Ionicons name="close-circle" size={14} color="#2563EB" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* 6. Active / Completed / Paused Goal Cards List */}
        <View style={styles.goalsList}>
          {displayedGoals.length > 0 ? (
            displayedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => setSelectedGoalId(goal.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name={
                    activeTab === 'Completed'
                      ? 'trophy-outline'
                      : activeTab === 'Paused'
                      ? 'pause-circle-outline'
                      : 'flag-outline'
                  }
                  size={28}
                  color="#94A3B8"
                />
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === 'Completed'
                  ? 'No completed goals yet'
                  : activeTab === 'Paused'
                  ? 'No paused goals'
                  : 'No active goals'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'Completed'
                  ? 'Your completed goals will appear here as you achieve milestones.'
                  : activeTab === 'Paused'
                  ? 'Goals you pause will be stored here safely.'
                  : 'Set your next achievement target and start tracking your progress.'}
              </Text>
              {activeTab === 'Active' && (
                <TouchableOpacity
                  style={styles.emptyActionBtn}
                  activeOpacity={0.8}
                  onPress={() => setCreateSheetVisible(true)}
                >
                  <Ionicons name="add" size={16} color="#2563EB" />
                  <Text style={styles.emptyActionText}>Create Goal</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ════════════════════════════════════════════════════════
          FILTER & SORT BOTTOM SHEET
      ════════════════════════════════════════════════════════ */}
      <GoalFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        selectedCategory={categoryFilter}
        onSelectCategory={setCategoryFilter}
        selectedPriority={priorityFilter}
        onSelectPriority={setPriorityFilter}
        selectedSort={sortOption}
        onSelectSort={setSortOption}
        onReset={() => {
          setCategoryFilter('All Categories');
          setPriorityFilter('All');
          setSortOption('Deadline');
        }}
        onApply={() => setFilterSheetVisible(false)}
      />

      {/* ════════════════════════════════════════════════════════
          CREATE GOAL 4-STEP WIZARD SHEET
      ════════════════════════════════════════════════════════ */}
      <CreateGoalSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
        onCreateGoal={handleCreateGoal}
        onViewCreatedGoal={(goalId) => {
          setSelectedGoalId(goalId);
        }}
      />

      {/* ── Unified Student Bottom Navigation Tab Bar ── */}
      <StudentBottomTab
        activeTab="goals"
        onNavigate={(tab) => {
          if (tab === 'home') handleNavHome();
          else if (tab === 'achievements') handleNavAchievements();
          else if (tab === 'goals') {
            /* already on goals */
          } else if (tab === 'leaderboard') handleNavLeaderboard();
          else if (tab === 'profile') handleNavProfile();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F5F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 1,
  },
  newGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  newGoalBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 3,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },

  // Tabs Section
  tabsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  filterIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  // Active filters chips
  activeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
  },

  // Goals List
  goalsList: {
    marginTop: 2,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 12,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 4,
  },

  // Bottom Navigation Bar
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 52,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 58,
  },
  tabLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 3,
  },
});
