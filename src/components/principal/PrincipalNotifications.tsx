// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Notifications & Alert Center
// High-priority institutional alerts: Dean submissions, Governance alerts,
// College Milestones, and Accreditation notices.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
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

import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalNotificationsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalNotifications({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalNotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Approvals' | 'Governance' | 'Milestones'>('All');

  const [notifications, setNotifications] = useState([
    {
      id: 'p_notif_1',
      title: 'Dean Achievement Awaiting Review',
      desc: 'Dr. Kumar V submitted a new Research Paper in IEEE Transactions on Cloud Computing for your executive approval.',
      time: '2 hours ago',
      type: 'Approvals',
      read: false,
      actionRoute: 'principalDeanReview',
      actionParams: { submissionId: 'dean_sub_1' },
      actionLabel: 'Review Submission',
      icon: 'checkbox-outline',
      iconColor: '#D97706',
    },
    {
      id: 'p_notif_2',
      title: 'Unassigned Department Detected',
      desc: 'Artificial Intelligence & Data Science currently has no active Dean assigned for HOD verification routing.',
      time: '1 day ago',
      type: 'Governance',
      read: false,
      actionRoute: 'principalDeanAssignments',
      actionLabel: 'Assign Dean',
      icon: 'alert-circle-outline',
      iconColor: '#DC2626',
    },
    {
      id: 'p_notif_3',
      title: 'College Points Milestone Exceeded',
      desc: 'Nandha Engineering College officially crossed 48,000 verified institutional points across 8 departments.',
      time: '3 days ago',
      type: 'Milestones',
      read: false,
      actionRoute: 'principalPerformance',
      actionLabel: 'View Performance',
      icon: 'trophy-outline',
      iconColor: '#2563EB',
    },
    {
      id: 'p_notif_4',
      title: 'Accreditation Reporting Window Open',
      desc: 'NAAC SSR Criterion 3 data compilation for 2026-27 is ready for institutional export.',
      time: '5 days ago',
      type: 'Governance',
      read: true,
      actionRoute: 'principalReports',
      actionLabel: 'Export Report',
      icon: 'document-text-outline',
      iconColor: '#059669',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    return n.type === activeFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.identityCol}>
            <Text style={styles.screenTitle}>Institutional Alerts</Text>
            <Text style={styles.screenSubtext}>Principal Governance Notifications</Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Notifications Hero */}
          <PrincipalHeroCard
            overline="INSTITUTIONAL ALERTS"
            title={`${unreadCount} Unread Notifications`}
            subtitle="Executive alerts requiring principal review and authority"
            icon="notifications"
            badgeText={unreadCount > 0 ? 'Action Required' : 'Up to Date'}
            primaryNumber={unreadCount}
            primaryLabel="Unread Alerts"
            secondaryMetrics={[
              { number: notifications.length, label: 'Total Alerts' },
              { number: '4', label: 'Channels' },
            ]}
            compact
          />

          {/* Filter Chips */}
          <View style={styles.filterPillsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {['All', 'Approvals', 'Governance', 'Milestones'].map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                    onPress={() => setActiveFilter(cat as any)}
                  >
                    <Text style={[styles.pillBtnText, isActive && styles.pillBtnTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Notifications List */}
          <View style={styles.listContainer}>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.notifCard,
                    !item.read && styles.notifCardUnread,
                  ]}
                >
                  <View style={styles.notifTopRow}>
                    <View style={[styles.notifIconCircle, { backgroundColor: '#F8FAFC' }]}>
                      <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                    </View>
                    <View style={styles.notifHeaderCol}>
                      <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                        {item.title}
                      </Text>
                      <Text style={styles.notifTime}>{item.time}</Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.notifDesc}>{item.desc}</Text>

                  <View style={styles.notifFooterRow}>
                    <TouchableOpacity
                      style={styles.actionCtaBtn}
                      activeOpacity={0.8}
                      onPress={() => {
                        markSingleAsRead(item.id);
                        onNavigate(item.actionRoute, item.actionParams);
                      }}
                    >
                      <Text style={styles.actionCtaText}>{item.actionLabel}</Text>
                      <Ionicons name="arrow-forward" size={12} color="#D97706" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    {!item.read && (
                      <TouchableOpacity
                        style={styles.markReadBtn}
                        onPress={() => markSingleAsRead(item.id)}
                      >
                        <Text style={styles.markReadBtnText}>Dismiss</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptySub}>
                  No notifications in this category.
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="home" onNavigate={onNavigate} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  identityCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  screenSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  markAllReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  filterPillsRow: {
    marginBottom: 12,
  },
  pillBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  pillBtnTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifCardUnread: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#D97706',
    backgroundColor: '#FEFDFB',
  },
  notifTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notifIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifHeaderCol: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  notifTitleUnread: {
    fontWeight: '700',
    color: '#0F172A',
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
    marginLeft: 6,
  },
  notifDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  notifFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  actionCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionCtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  markReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markReadBtnText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
  },
});
