// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Bottom Navigation Component
// Exact 4-tab floating bar: Home | Achievements | Leaderboard | Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FacultyBottomTabProps {
  activeTab: 'home' | 'achievements' | 'leaderboard' | 'profile';
  onNavigate: (screen: string) => void;
}

export default function FacultyBottomTab({ activeTab, onNavigate }: FacultyBottomTabProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]}>
      <View style={styles.bottomTabBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('facultyDashboard')}
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

        {/* Tab 2: Achievements */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('facultyAchievements')}
        >
          <Ionicons
            name={activeTab === 'achievements' ? 'trophy' : 'trophy-outline'}
            size={20}
            color={activeTab === 'achievements' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'achievements' && styles.tabLabelActive]}>
            Achievements
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Leaderboard */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('facultyLeaderboard')}
        >
          <Ionicons
            name={activeTab === 'leaderboard' ? 'bar-chart' : 'bar-chart-outline'}
            size={20}
            color={activeTab === 'leaderboard' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'leaderboard' && styles.tabLabelActive]}>
            Leaderboard
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('facultyProfile')}
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
    paddingTop: 8,
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
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
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
