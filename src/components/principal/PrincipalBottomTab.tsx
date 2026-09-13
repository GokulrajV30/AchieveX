// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Bottom Navigation Component
// Exactly 5 tabs matching Principal oversight role:
// Home | Approvals | Departments | Reports | Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export type PrincipalTabType = 'home' | 'approvals' | 'departments' | 'reports' | 'profile';

interface PrincipalBottomTabProps {
  activeTab: PrincipalTabType;
  onNavigate: (screen: string) => void;
  pendingApprovalsCount?: number;
}

export default function PrincipalBottomTab({
  activeTab,
  onNavigate,
  pendingApprovalsCount = 0,
}: PrincipalBottomTabProps) {
  const activeColor = '#2563EB'; // AchieveX Brand Blue
  const inactiveColor = '#94A3B8';

  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <View style={[styles.bottomTabBarContainer, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
      <View style={styles.bottomTabBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('principalDashboard')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? activeColor : inactiveColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'home' && { color: activeColor, fontWeight: '700' },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Approvals */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('principalVerificationQueue')}
        >
          <View style={{ position: 'relative' }}>
            <Ionicons
              name={activeTab === 'approvals' ? 'checkbox' : 'checkbox-outline'}
              size={20}
              color={activeTab === 'approvals' ? activeColor : inactiveColor}
            />
            {pendingApprovalsCount > 0 && (
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{pendingApprovalsCount}</Text>
              </View>
            )}
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'approvals' && { color: activeColor, fontWeight: '700' },
            ]}
          >
            Approvals
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Departments */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('principalDepartments')}
        >
          <Ionicons
            name={activeTab === 'departments' ? 'business' : 'business-outline'}
            size={20}
            color={activeTab === 'departments' ? activeColor : inactiveColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'departments' && { color: activeColor, fontWeight: '700' },
            ]}
          >
            Departments
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Reports */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('principalReports')}
        >
          <Ionicons
            name={activeTab === 'reports' ? 'document-text' : 'document-text-outline'}
            size={20}
            color={activeTab === 'reports' ? activeColor : inactiveColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'reports' && { color: activeColor, fontWeight: '700' },
            ]}
          >
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
            color={activeTab === 'profile' ? activeColor : inactiveColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'profile' && { color: activeColor, fontWeight: '700' },
            ]}
          >
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '92%',
    maxWidth: 380,
    minWidth: 290,
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
