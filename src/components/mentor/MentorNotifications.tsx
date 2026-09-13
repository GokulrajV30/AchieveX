// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Notifications Screen (Simplified MVP)
// Focused on: New project added, Project updated, Mentee assigned
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  MENTOR_NOTIFICATIONS,
  type MentorNotification,
  getProjectById,
  getMenteeById,
  type MentorProject,
  type MentorMentee,
} from '../../data/mentorWorkspaceData';

interface MentorNotificationsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectProject?: (project: MentorProject) => void;
  onSelectMentee?: (mentee: MentorMentee) => void;
}

export default function MentorNotifications({
  onGoBack,
  onNavigate,
  onSelectProject,
  onSelectMentee,
}: MentorNotificationsProps) {
  const [notifications, setNotifications] = useState<MentorNotification[]>(MENTOR_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemPress = (notif: MentorNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    if (notif.targetScreen === 'mentorProjectDetails') {
      const p = getProjectById(notif.targetId);
      if (p && onSelectProject) {
        onSelectProject(p);
      } else {
        onNavigate('mentorProjectDetails', { projectId: notif.targetId });
      }
    } else if (notif.targetScreen === 'mentorMenteeDetails') {
      const m = getMenteeById(notif.targetId);
      if (m && onSelectMentee) {
        onSelectMentee(m);
      } else {
        onNavigate('mentorMenteeDetails', { studentId: notif.targetId });
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0 ? `${unreadCount} Unread Updates` : 'All Caught Up'}
            </Text>
          </View>

          {unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.markReadBtn}
              activeOpacity={0.7}
              onPress={handleMarkAllRead}
            >
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerRightPlaceholder} />
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((notif) => {
            const iconName =
              notif.type === 'project_added'
                ? 'folder-open'
                : notif.type === 'project_updated'
                ? 'create'
                : 'person-add';

            const iconColor =
              notif.type === 'project_added'
                ? '#7C3AED'
                : notif.type === 'project_updated'
                ? '#2563EB'
                : '#059669';

            const iconBg =
              notif.type === 'project_added'
                ? '#F5F3FF'
                : notif.type === 'project_updated'
                ? '#EFF6FF'
                : '#ECFDF5';

            return (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifCard,
                  !notif.isRead && styles.notifCardUnread,
                ]}
                activeOpacity={0.8}
                onPress={() => handleItemPress(notif)}
              >
                <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                  <Ionicons name={iconName as any} size={20} color={iconColor} />
                </View>

                <View style={styles.contentWrap}>
                  <View style={styles.topRow}>
                    <Text
                      style={[
                        styles.notifTitle,
                        !notif.isRead && styles.notifTitleUnread,
                      ]}
                    >
                      {notif.title}
                    </Text>
                    <Text style={styles.timeText}>{notif.timeAgo}</Text>
                  </View>

                  <Text style={styles.messageText}>{notif.message}</Text>

                  <View style={styles.actionPromptRow}>
                    <Text style={styles.actionPromptText}>Tap to view details</Text>
                    <Ionicons name="chevron-forward" size={13} color="#2563EB" />
                  </View>
                </View>

                {!notif.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  markReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    alignItems: 'flex-start',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  notifCardUnread: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentWrap: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  notifTitleUnread: {
    fontWeight: '700',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  messageText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  actionPromptText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 6,
    marginTop: 4,
  },
});
