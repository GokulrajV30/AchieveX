// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Bottom Navigation Component
// 5-tab bar: Home | Faculty | Students | Reports | Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export type HODTabType = 'home' | 'faculty' | 'students' | 'reports' | 'profile';

interface HODBottomTabProps {
  activeTab: HODTabType;
  onNavigate: (screen: string) => void;
}

export default function HODBottomTab({ activeTab, onNavigate }: HODBottomTabProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
      <View style={styles.bottomTabBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('hodDashboard')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? '#2563EB' : '#94A3B8'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Faculty */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('hodFacultyList')}
        >
          <Ionicons
            name={activeTab === 'faculty' ? 'briefcase' : 'briefcase-outline'}
            size={20}
            color={activeTab === 'faculty' ? '#2563EB' : '#94A3B8'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'faculty' && styles.tabLabelActive]}>
            Faculty
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Students */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('hodStudentList')}
        >
          <Ionicons
            name={activeTab === 'students' ? 'people' : 'people-outline'}
            size={20}
            color={activeTab === 'students' ? '#2563EB' : '#94A3B8'}
          />
          <Text numberOfLines={1} style={[styles.tabLabel, activeTab === 'students' && styles.tabLabelActive]}>
            Students
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Reports */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('hodReports')}
        >
          <Ionicons
            name={activeTab === 'reports' ? 'document-text' : 'document-text-outline'}
            size={20}
            color={activeTab === 'reports' ? '#2563EB' : '#94A3B8'}
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
            color={activeTab === 'profile' ? '#2563EB' : '#94A3B8'}
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
