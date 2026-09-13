// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Governance Notifications
// Dean-focused alerts: HOD submissions, resubmissions & Principal approvals
// Flow: Safe Header -> Filter Tabs -> Notification Cards -> Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
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
  getDeanStore,
  subscribeDeanData,
  type DeanNotification,
} from '../../data/deanWorkspaceData';
import DeanBottomTab from './DeanBottomTab';
import { DEAN_SPACING } from './deanSpacing';

interface DeanNotificationsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function DeanNotifications({
  onOpenMenu,
  onNavigate,
}: DeanNotificationsProps) {
  const store = getDeanStore();
  const [notifications, setNotifications] = useState<DeanNotification[]>(store.getNotifications());
  const [tab, setTab] = useState<'All' | 'Unread' | 'Submissions' | 'System'>('All');

  useEffect(() => {
    return subscribeDeanData(() => {
      setNotifications(store.getNotifications());
    });
  }, []);

  const handleMarkAsRead = (id: string) => {
    store.markNotificationAsRead(id);
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (tab === 'Unread') return !item.isRead;
    if (tab === 'Submissions') return item.type === 'hod_submission' || item.type === 'correction_resubmitted';
    if (tab === 'System') return item.type === 'personal_achievement' || item.type === 'scope_update';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'hod_submission':
        return { name: 'document-text', color: '#0D9488', bg: '#F0FDFA' };
      case 'correction_resubmitted':
        return { name: 'refresh-circle', color: '#D97706', bg: '#FFFBEB' };
      case 'personal_achievement':
        return { name: 'trophy', color: '#059669', bg: '#ECFDF5' };
      case 'scope_update':
        return { name: 'business', color: '#4F46E5', bg: '#EEF2FF' };
      default:
        return { name: 'notifications', color: '#64748B', bg: '#F1F5F9' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Dean Notifications</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
              </Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ════════════════════════════════════════════════
            2. FILTER TABS (CHIPS)
        ════════════════════════════════════════════════ */}
        <View style={styles.tabBar}>
          {(['All', 'Unread', 'Submissions', 'System'] as const).map((t) => {
            const isSelected = tab === t;
            let count = notifications.length;
            if (t === 'Unread') count = unreadCount;
            else if (t === 'Submissions')
              count = notifications.filter((n) => n.type === 'hod_submission' || n.type === 'correction_resubmitted').length;
            else if (t === 'System')
              count = notifications.filter((n) => n.type === 'personal_achievement' || n.type === 'scope_update').length;

            return (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
                onPress={() => setTab(t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {t} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ════════════════════════════════════════════════
            3. NOTIFICATIONS LIST
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={40} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySub}>You have reviewed all alerts for this category.</Text>
            </View>
          ) : (
            filteredNotifications.map((item) => {
              const iconInfo = getNotificationIcon(item.type);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
                  activeOpacity={0.75}
                  onPress={() => {
                    handleMarkAsRead(item.id);
                    if (item.submissionId) {
                      onNavigate('deanHODReview', { submissionId: item.submissionId });
                    }
                  }}
                >
                  <View style={[styles.iconBox, { backgroundColor: iconInfo.bg }]}>
                    <Ionicons name={iconInfo.name as any} size={20} color={iconInfo.color} />
                  </View>

                  <View style={styles.notifContentCol}>
                    <View style={styles.notifHeaderRow}>
                      <Text
                        style={[styles.notifTitle, !item.isRead && styles.notifTitleBold]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>
                      {!item.isRead && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.notifMessage} numberOfLines={2} ellipsizeMode="tail">
                      {item.message}
                    </Text>

                    <View style={styles.notifFooterRow}>
                      <Text style={styles.notifTime}>{item.timestamp || 'Just now'}</Text>
                      {item.actionText ? (
                        <View style={styles.actionPill}>
                          <Text style={styles.actionPillText}>{item.actionText}</Text>
                          <Ionicons name="arrow-forward" size={11} color="#0D9488" style={{ marginLeft: 2 }} />
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            BOTTOM NAVIGATION TAB BAR
        ════════════════════════════════════════════════ */}
        <DeanBottomTab
          activeTab="notifications"
          onNavigate={(screen) => onNavigate(screen)}
          unreadCount={unreadCount}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: DEAN_SPACING.screenHorizontal,
    paddingTop: DEAN_SPACING.screenTop,
    paddingBottom: DEAN_SPACING.bottomNavClearance,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: DEAN_SPACING.cardRadiusCompact,
    padding: DEAN_SPACING.cardPadding,
    marginBottom: DEAN_SPACING.cardGap,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifCardUnread: {
    backgroundColor: '#F8FAFC',
    borderColor: '#99F6E4',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 12,
  },
  notifContentCol: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  notifTitleBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D9488',
    marginLeft: 6,
    flexShrink: 0,
  },
  notifMessage: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 6,
  },
  notifFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});
