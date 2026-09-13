// ─────────────────────────────────────────────────────────────
// AchieveX — Shared Student Bottom Navigation Tab Bar
// Exactly 5 tabs matching Home / Dashboard across all screens:
// Home | Achievements | Goals | Leaderboard | Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export type StudentTabType =
  | 'home'
  | 'achievements'
  | 'submissions'
  | 'students'
  | 'mentees'
  | 'projects'
  | 'goals'
  | 'reports'
  | 'analytics'
  | 'leaderboard'
  | 'profile';

export interface StudentBottomTabProps {
  activeTab: StudentTabType;
  variant?: 'student' | 'faculty' | 'proctor' | 'ac' | 'mentor' | 'head';
  onNavigate: (tab: StudentTabType) => void;
}

export default function StudentBottomTab({
  activeTab,
  variant = 'student',
  onNavigate,
}: StudentBottomTabProps) {
  const isProctor = variant === 'proctor';
  const isAC = variant === 'ac';
  const isMentor = variant === 'mentor';
  const isHead = variant === 'head';

  const isHomeActive = activeTab === 'home';
  const isSubmissionsActive = isAC && (activeTab === 'submissions' || activeTab === 'achievements');
  const isAchievementsActive =
    (isHead && activeTab === 'achievements') ||
    (!isProctor && !isAC && !isMentor && !isHead && activeTab === 'achievements');
  const isStudentsActive =
    (isAC && activeTab === 'students') ||
    (isMentor && (activeTab === 'students' || activeTab === 'mentees')) ||
    (isProctor && (activeTab === 'students' || activeTab === 'achievements'));
  const isProjectsActive = isMentor && activeTab === 'projects';
  const isGoalsActive = !isAC && !isMentor && !isHead && activeTab === 'goals';
  const isReportsActive =
    (isHead && activeTab === 'reports') ||
    (isAC && (activeTab === 'reports' || activeTab === 'leaderboard')) ||
    (isMentor && activeTab === 'reports');
  const isAnalyticsActive = isHead && (activeTab === 'analytics' || activeTab === 'leaderboard' || activeTab === 'goals');
  const isLeaderboardActive = !isAC && !isMentor && !isHead && activeTab === 'leaderboard';
  const isProfileActive = activeTab === 'profile';

  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  if (isHead) {
    const headActiveColor = '#4F46E5';
    return (
      <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
        <View style={styles.bottomTabBar}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('home')}
          >
            <Ionicons
              name={isHomeActive ? 'home' : 'home-outline'}
              size={20}
              color={isHomeActive ? headActiveColor : '#9CA3AF'}
            />
            <Text
              style={[
                styles.tabLabel,
                isHomeActive && { color: headActiveColor, fontWeight: '700' },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Achievements */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('achievements')}
          >
            <Ionicons
              name={isAchievementsActive ? 'trophy' : 'trophy-outline'}
              size={20}
              color={isAchievementsActive ? headActiveColor : '#9CA3AF'}
            />
            <Text
              style={[
                styles.tabLabel,
                isAchievementsActive && { color: headActiveColor, fontWeight: '700' },
              ]}
            >
              Achievements
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Analytics */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('analytics')}
          >
            <Ionicons
              name={isAnalyticsActive ? 'bar-chart' : 'bar-chart-outline'}
              size={20}
              color={isAnalyticsActive ? headActiveColor : '#9CA3AF'}
            />
            <Text
              style={[
                styles.tabLabel,
                isAnalyticsActive && { color: headActiveColor, fontWeight: '700' },
              ]}
            >
              Analytics
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Reports */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('reports')}
          >
            <Ionicons
              name={isReportsActive ? 'document-text' : 'document-text-outline'}
              size={20}
              color={isReportsActive ? headActiveColor : '#9CA3AF'}
            />
            <Text
              style={[
                styles.tabLabel,
                isReportsActive && { color: headActiveColor, fontWeight: '700' },
              ]}
            >
              Reports
            </Text>
          </TouchableOpacity>

          {/* Tab 5: Profile */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('profile')}
          >
            <Ionicons
              name={isProfileActive ? 'person' : 'person-outline'}
              size={20}
              color={isProfileActive ? headActiveColor : '#9CA3AF'}
            />
            <Text
              style={[
                styles.tabLabel,
                isProfileActive && { color: headActiveColor, fontWeight: '700' },
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isMentor) {
    return (
      <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
        <View style={styles.bottomTabBar}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('home')}
          >
            <Ionicons
              name={isHomeActive ? 'home' : 'home-outline'}
              size={20}
              color={isHomeActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text style={[styles.tabLabel, isHomeActive && styles.tabLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Mentees */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('students')}
          >
            <Ionicons
              name={isStudentsActive ? 'people' : 'people-outline'}
              size={20}
              color={isStudentsActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text style={[styles.tabLabel, isStudentsActive && styles.tabLabelActive]}>
              Mentees
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Projects */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('projects' as any)}
          >
            <Ionicons
              name={isProjectsActive ? 'folder' : 'folder-outline'}
              size={20}
              color={isProjectsActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text style={[styles.tabLabel, isProjectsActive && styles.tabLabelActive]}>
              Projects
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Reports */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('reports')}
          >
            <Ionicons
              name={isReportsActive ? 'document-text' : 'document-text-outline'}
              size={20}
              color={isReportsActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text style={[styles.tabLabel, isReportsActive && styles.tabLabelActive]}>
              Reports
            </Text>
          </TouchableOpacity>

          {/* Tab 5: Profile */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('profile')}
          >
            <Ionicons
              name={isProfileActive ? 'person' : 'person-outline'}
              size={20}
              color={isProfileActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text style={[styles.tabLabel, isProfileActive && styles.tabLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isAC) {
    return (
      <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
        <View style={styles.bottomTabBar}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('home')}
          >
            <Ionicons
              name={isHomeActive ? 'home' : 'home-outline'}
              size={20}
              color={isHomeActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text numberOfLines={1} style={[styles.tabLabel, isHomeActive && styles.tabLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Submissions */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('submissions')}
          >
            <Ionicons
              name={isSubmissionsActive ? 'document-text' : 'document-text-outline'}
              size={20}
              color={isSubmissionsActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text numberOfLines={1} style={[styles.tabLabel, isSubmissionsActive && styles.tabLabelActive]}>
              Submissions
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Students */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('students')}
          >
            <Ionicons
              name={isStudentsActive ? 'people' : 'people-outline'}
              size={20}
              color={isStudentsActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text numberOfLines={1} style={[styles.tabLabel, isStudentsActive && styles.tabLabelActive]}>
              Students
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Reports */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('reports')}
          >
            <Ionicons
              name={isReportsActive ? 'document-text' : 'document-text-outline'}
              size={20}
              color={isReportsActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text numberOfLines={1} style={[styles.tabLabel, isReportsActive && styles.tabLabelActive]}>
              Reports
            </Text>
          </TouchableOpacity>

          {/* Tab 5: Profile */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onNavigate('profile')}
          >
            <Ionicons
              name={isProfileActive ? 'person' : 'person-outline'}
              size={20}
              color={isProfileActive ? '#2563EB' : '#9CA3AF'}
            />
            <Text numberOfLines={1} style={[styles.tabLabel, isProfileActive && styles.tabLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
      <View style={styles.bottomTabBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Achievements / Students */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate(isProctor || isMentor ? 'students' : 'achievements')}
        >
          <Ionicons
            name={
              isProctor || isMentor
                ? isStudentsActive
                  ? 'people'
                  : 'people-outline'
                : isAchievementsActive
                ? 'trophy'
                : 'trophy-outline'
            }
            size={20}
            color={
              (isProctor || isMentor ? isStudentsActive : isAchievementsActive)
                ? '#2563EB'
                : '#9CA3AF'
            }
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              (isProctor || isMentor ? isStudentsActive : isAchievementsActive) &&
                styles.tabLabelActive,
            ]}
          >
            {isProctor || isMentor ? 'Students' : 'Achievements'}
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Goals / Projects */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate(isMentor ? 'projects' : 'goals')}
        >
          <Ionicons
            name={
              isMentor
                ? isProjectsActive
                  ? 'folder'
                  : 'folder-outline'
                : isGoalsActive
                ? 'flag'
                : 'flag-outline'
            }
            size={20}
            color={(isMentor ? isProjectsActive : isGoalsActive) ? '#2563EB' : '#9CA3AF'}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              (isMentor ? isProjectsActive : isGoalsActive) && styles.tabLabelActive,
            ]}
          >
            {isMentor ? 'Projects' : 'Goals'}
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Leaderboard / Reports */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate(isMentor ? 'reports' : 'leaderboard')}
        >
          <Ionicons
            name={
              isMentor
                ? isReportsActive
                  ? 'document-text'
                  : 'document-text-outline'
                : isLeaderboardActive
                ? 'podium'
                : 'podium-outline'
            }
            size={20}
            color={(isMentor ? isReportsActive : isLeaderboardActive) ? '#2563EB' : '#9CA3AF'}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              (isMentor ? isReportsActive : isLeaderboardActive) && styles.tabLabelActive,
            ]}
          >
            {isMentor ? 'Reports' : 'Leaderboard'}
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={20}
            color={activeTab === 'profile' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomTabBar: {
    width: '92%',
    maxWidth: 380,
    minWidth: 290,
    alignSelf: 'center',
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
