// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Bottom Navigation Bar Component
// Exactly 5 locked tabs matching the AchieveX mobile design system:
// Home | Mentees | Projects | Reports | Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export type MentorTabType = 'home' | 'mentees' | 'projects' | 'reports' | 'profile';

interface MentorBottomTabProps {
  activeTab: MentorTabType;
  onNavigate: (screen: string) => void;
}

export default function MentorBottomTab({
  activeTab,
  onNavigate,
}: MentorBottomTabProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <View style={[styles.container, { bottom: bottomPadding }]} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('mentorDashboard')}
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

        {/* Tab 2: Mentees */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('mentorMentees')}
        >
          <Ionicons
            name={activeTab === 'mentees' ? 'people' : 'people-outline'}
            size={20}
            color={activeTab === 'mentees' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'mentees' && styles.tabLabelActive]}>
            Mentees
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Projects */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('mentorProjects')}
        >
          <Ionicons
            name={activeTab === 'projects' ? 'folder' : 'folder-outline'}
            size={20}
            color={activeTab === 'projects' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'projects' && styles.tabLabelActive]}>
            Projects
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Reports */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('mentorReports')}
        >
          <Ionicons
            name={activeTab === 'reports' ? 'document-text' : 'document-text-outline'}
            size={20}
            color={activeTab === 'reports' ? '#2563EB' : '#9CA3AF'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'reports' && styles.tabLabelActive]}>
            Reports
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
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
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    width: '92%',
    maxWidth: 380,
    minWidth: 290,
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
