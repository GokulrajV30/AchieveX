// ─────────────────────────────────────────────────────────────
// AchieveX — Student Notifications Screen Component (Redesigned)
// Compact SaaS feed with individual cards, segmented tabs & instant routing
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
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  type StudentNotification,
  getNotificationVisualConfig,
} from '../data/notificationsData';
import StudentBottomTab from './StudentBottomTab';

interface StudentNotificationsScreenProps {
  notifications: StudentNotification[];
  onBack: () => void;
  onOpenMenu: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToTarget: (targetType: string, targetId?: string) => void;
  onNavigate: (screen: string) => void;
}

export default function StudentNotificationsScreen({
  notifications,
  onBack,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToTarget,
  onNavigate,
}: StudentNotificationsScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  // Group notifications by timeGroup: TODAY, YESTERDAY, EARLIER
  const groupedData = useMemo(() => {
    const today = filteredNotifications.filter((n) => n.timeGroup === 'TODAY');
    const yesterday = filteredNotifications.filter((n) => n.timeGroup === 'YESTERDAY');
    const earlier = filteredNotifications.filter((n) => n.timeGroup === 'EARLIER');

    const sections: { title: string; data: StudentNotification[] }[] = [];
    if (today.length > 0) sections.push({ title: 'TODAY', data: today });
    if (yesterday.length > 0) sections.push({ title: 'YESTERDAY', data: yesterday });
    if (earlier.length > 0) sections.push({ title: 'EARLIER', data: earlier });

    return sections;
  }, [filteredNotifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  const handleNotificationPress = (item: StudentNotification) => {
    if (!item.isRead) {
      onMarkAsRead(item.id);
    }
    onNavigateToTarget(item.targetType, item.targetId);
  };

  const handleMarkAllPress = () => {
    onMarkAllAsRead();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />

      {/* 1. Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Notifications</Text>

        {unreadCount > 0 ? (
          <TouchableOpacity
            style={styles.markAllBtn}
            activeOpacity={0.7}
            onPress={handleMarkAllPress}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ minWidth: 70 }} />
        )}
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2563EB" />
        }
      >
        {/* Toast confirmation */}
        {showToast && (
          <View style={styles.toastBanner}>
            <Ionicons name="checkmark-circle" size={15} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>All notifications marked as read.</Text>
          </View>
        )}

        {/* 2. Compact Summary Header */}
        <View style={styles.compactHeaderRow}>
          <Text style={styles.unreadSummaryText}>
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
              : 'All notifications caught up'}
          </Text>
          <Text style={styles.contextHintText}>Latest updates</Text>
        </View>

        {/* 3. Segmented Filter Tabs (44px height, 12px radius) */}
        <View style={styles.segmentedTabContainer}>
          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'all' && styles.segmentTabActive]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.segmentTabText, activeTab === 'all' && styles.segmentTabTextActive]}>
              All {notifications.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'unread' && styles.segmentTabActive]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('unread')}
          >
            <Text style={[styles.segmentTabText, activeTab === 'unread' && styles.segmentTabTextActive]}>
              Unread {unreadCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. Notification Grouped Sections (Individual Cards) */}
        {groupedData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={activeTab === 'unread' ? 'checkmark-done-circle-outline' : 'notifications-off-outline'}
                size={32}
                color={activeTab === 'unread' ? '#16A34A' : '#94A3B8'}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'unread' ? "You're all caught up" : 'No notifications yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'unread'
                ? 'No unread notifications at the moment.'
                : 'Updates about achievements, goals, and academic credits will appear here.'}
            </Text>
          </View>
        ) : (
          groupedData.map((section) => (
            <View key={section.title} style={styles.groupSection}>
              {/* Section Label */}
              <Text style={styles.sectionLabel}>{section.title}</Text>

              {/* Individual Notification Cards */}
              <View style={styles.cardsStack}>
                {section.data.map((item) => {
                  const visual = getNotificationVisualConfig(item.type);
                  const isUnread = !item.isRead;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.notificationCard,
                        isUnread && styles.notificationCardUnread,
                      ]}
                      activeOpacity={0.75}
                      onPress={() => handleNotificationPress(item)}
                    >
                      {/* Left: 40x40 Icon Container */}
                      <View
                        style={[
                          styles.iconBox,
                          { backgroundColor: visual.iconBgColor },
                        ]}
                      >
                        <Ionicons
                          name={visual.iconName as any}
                          size={20}
                          color={visual.iconColor}
                        />
                      </View>

                      {/* Middle: Content */}
                      <View style={styles.contentCol}>
                        <Text
                          style={[
                            styles.notificationTitle,
                            isUnread && styles.notificationTitleUnread,
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>

                        <Text style={styles.notificationMessage} numberOfLines={2}>
                          {item.message}
                        </Text>

                        <Text style={styles.timeText}>{item.createdAt}</Text>

                        {/* Direct CTA button for team certificate required (Step 4 & 5) */}
                        {item.type === 'team_certificate_required' && (
                          <TouchableOpacity
                            style={styles.ctaButton}
                            activeOpacity={0.8}
                            onPress={() => {
                              if (!item.isRead) onMarkAsRead(item.id);
                              onNavigateToTarget('team_achievement', item.teamAchievementId || item.targetId);
                            }}
                          >
                            <Ionicons name="cloud-upload-outline" size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                            <Text style={styles.ctaButtonText}>Upload Certificate</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Right: Unread Dot + Chevron */}
                      <View style={styles.rightActionCol}>
                        {isUnread && <View style={styles.unreadDot} />}
                        <Ionicons name="chevron-forward" size={15} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}

        {/* Bottom padding to keep content above floating bottom bar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Shared Student Bottom Navigation Bar */}
      <StudentBottomTab
        activeTab="home"
        onNavigate={(tab) => {
          if (tab === 'home') onNavigate('dashboard');
          else if (tab === 'achievements') onNavigate('myAchievements');
          else if (tab === 'goals') onNavigate('goals');
          else if (tab === 'leaderboard') onNavigate('leaderboard');
          else if (tab === 'profile') onNavigate('profile');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 4,
    minWidth: 70,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 70,
    alignItems: 'flex-end',
  },
  markAllText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  compactHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  unreadSummaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  contextHintText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  segmentedTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    height: 44,
    marginBottom: 14,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    fontWeight: '700',
    color: '#2563EB',
  },
  groupSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingLeft: 2,
  },
  cardsStack: {
    gap: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationCardUnread: {
    backgroundColor: '#F8FAFF',
    borderColor: '#BFDBFE',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
    paddingRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  notificationTitleUnread: {
    color: '#0F172A',
    fontWeight: '800',
  },
  notificationMessage: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  rightActionCol: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingLeft: 4,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  ctaButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
