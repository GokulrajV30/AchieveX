// ─────────────────────────────────────────────────────────────
// AchieveX — Head Governance Notifications
// Institutional milestone alerts, policy update confirmations, and accreditation warnings
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
  getHeadStore,
  subscribeHeadData,
  type HeadNotification,
} from '../../data/headWorkspaceData';
import StudentBottomTab from '../StudentBottomTab';

interface HeadNotificationsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HeadNotifications({
  onOpenMenu,
  onNavigate,
}: HeadNotificationsProps) {
  const store = getHeadStore();
  const [notifications, setNotifications] = useState<HeadNotification[]>(store.getNotifications());
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Policy' | 'Milestone'>('All');

  useEffect(() => {
    return subscribeHeadData(() => {
      setNotifications([...store.getNotifications()]);
    });
  }, []);

  const handleMarkAsRead = (id: string) => {
    store.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead();
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Policy') return n.type === 'policy_update';
    if (filter === 'Milestone') return n.type === 'milestone';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
              <Ionicons name="menu-outline" size={22} color="#1E293B" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Governance Alerts</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
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
          {(['All', 'Unread', 'Policy', 'Milestone'] as const).map((t) => {
            const isSelected = filter === t;
            const count =
              t === 'All'
                ? notifications.length
                : t === 'Unread'
                ? unreadCount
                : t === 'Policy'
                ? notifications.filter((n) => n.type === 'policy_update').length
                : notifications.filter((n) => n.type === 'milestone').length;

            return (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
                onPress={() => setFilter(t)}
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
          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={40} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySub}>You have reviewed all alerts for this category.</Text>
            </View>
          ) : (
            filtered.map((item) => {
              const iconName =
                item.type === 'policy_update'
                  ? 'shield-checkmark'
                  : item.type === 'milestone'
                  ? 'trophy'
                  : item.type === 'report_ready'
                  ? 'document-text'
                  : 'alert-circle';
              const iconBg =
                item.type === 'policy_update'
                  ? '#EEF2FF'
                  : item.type === 'milestone'
                  ? '#FEF3C7'
                  : item.type === 'report_ready'
                  ? '#ECFDF5'
                  : '#FEE2E2';
              const iconColor =
                item.type === 'policy_update'
                  ? '#4F46E5'
                  : item.type === 'milestone'
                  ? '#D97706'
                  : item.type === 'report_ready'
                  ? '#059669'
                  : '#DC2626';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
                  activeOpacity={0.75}
                  onPress={() => handleMarkAsRead(item.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                    <Ionicons name={iconName as any} size={20} color={iconColor} />
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
                      {item.type && (
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>
                            {item.type.replace('_', ' ').toUpperCase()}
                          </Text>
                        </View>
                      )}
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
        <StudentBottomTab
          activeTab="home"
          variant="head"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('headDashboard');
            } else if (tab === 'achievements') {
              onNavigate('headCollegeAchievements');
            } else if (tab === 'analytics') {
              onNavigate('headAnalytics');
            } else if (tab === 'reports') {
              onNavigate('headReports');
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
    color: '#4F46E5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifCardUnread: {
    backgroundColor: '#F8FAFC',
    borderColor: '#C7D2FE',
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
    backgroundColor: '#4F46E5',
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
  typeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
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
