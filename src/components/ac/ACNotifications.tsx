// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Notifications
// Low-noise, grouped event notifications for the AC workspace.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  AC_NOTIFICATIONS_DATA,
  AC_EVENT_GROUPS,
  SIH_STUDENT_SUBMISSIONS,
  type ACNotificationItem,
  type ACEventGroup,
  type ACStudentSubmission,
  getAllACNotifications,
  subscribeACNotifications,
} from '../../data/acWorkspaceData';

interface ACNotificationsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectGroup?: (group: ACEventGroup) => void;
  onSelectSubmission?: (submission: ACStudentSubmission) => void;
}

export default function ACNotifications({
  onGoBack,
  onNavigate,
  onSelectGroup,
  onSelectSubmission,
}: ACNotificationsProps) {
  const [notifications, setNotifications] = useState<ACNotificationItem[]>(getAllACNotifications());

  React.useEffect(() => {
    return subscribeACNotifications(() => {
      setNotifications(getAllACNotifications());
    });
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (item: ACNotificationItem) => {
    // Mark this notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );

    if (item.targetType === 'team' || item.teamAchievementId) {
      onNavigate('acTeamReview', {
        teamAchievementId: item.teamAchievementId || item.targetId,
      });
    } else if (item.targetType === 'group' && item.eventGroupId) {
      const group = AC_EVENT_GROUPS.find((g) => g.id === item.eventGroupId) || AC_EVENT_GROUPS[0];
      if (onSelectGroup) onSelectGroup(group);
      else onNavigate('acGroupReview');
    } else if (item.targetType === 'individual' && item.submissionId) {
      const sub = SIH_STUDENT_SUBMISSIONS.find((s) => s.id === item.submissionId) || SIH_STUDENT_SUBMISSIONS[4];
      if (onSelectSubmission) onSelectSubmission(sub);
      else onNavigate('acIndividualReview');
    }
  };

  const renderNotificationItem = ({ item }: { item: ACNotificationItem }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.notificationCardUnread]}
      activeOpacity={0.75}
      onPress={() => handleNotificationPress(item)}
    >
      <View
        style={[
          styles.iconBox,
          item.targetType === 'group' && { backgroundColor: '#EFF6FF' },
          item.targetType === 'individual' && { backgroundColor: '#FEF3C7' },
        ]}
      >
        <Ionicons
          name={item.targetType === 'group' ? 'people' : 'document-text'}
          size={20}
          color={item.targetType === 'group' ? '#2563EB' : '#D97706'}
        />
      </View>

      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.descText}>{item.description}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Coordinator Updates</Text>
          </View>

          <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySubtitle}>You're all caught up with your AC updates.</Text>
            </View>
          }
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  markReadBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markReadText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationCardUnread: {
    backgroundColor: '#F0F7FF',
    borderColor: '#BFDBFE',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
    marginLeft: 6,
  },
  descText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
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
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});
