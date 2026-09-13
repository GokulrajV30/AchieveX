// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Bottom Navigation Component
// Exactly 5 tabs matching Dean institutional role:
// Home | Reviews | History | Notifications | Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export type DeanTabType = 'home' | 'reviews' | 'history' | 'notifications' | 'profile';

interface DeanBottomTabProps {
  activeTab: DeanTabType;
  onNavigate: (screen: string) => void;
  unreadCount?: number;
}

export default function DeanBottomTab({
  activeTab,
  onNavigate,
  unreadCount = 0,
}: DeanBottomTabProps) {
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
          onPress={() => onNavigate('deanDashboard')}
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

        {/* Tab 2: Reviews */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('deanVerificationQueue')}
        >
          <Ionicons
            name={activeTab === 'reviews' ? 'checkbox' : 'checkbox-outline'}
            size={20}
            color={activeTab === 'reviews' ? activeColor : inactiveColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'reviews' && { color: activeColor, fontWeight: '700' },
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>

        {/* Tab 3: History */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('deanVerificationHistory')}
        >
          <Ionicons
            name={activeTab === 'history' ? 'time' : 'time-outline'}
            size={20}
            color={activeTab === 'history' ? activeColor : inactiveColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'history' && { color: activeColor, fontWeight: '700' },
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Notifications */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onNavigate('deanNotifications')}
        >
          <View style={{ position: 'relative' }}>
            <Ionicons
              name={activeTab === 'notifications' ? 'notifications' : 'notifications-outline'}
              size={20}
              color={activeTab === 'notifications' ? activeColor : inactiveColor}
            />
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              activeTab === 'notifications' && { color: activeColor, fontWeight: '700' },
            ]}
          >
            Alerts
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
    borderRadius: 24,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    paddingVertical: 4,
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
