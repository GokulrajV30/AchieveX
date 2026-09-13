// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Notifications Screen
// Displays Department Alerts & Personal Submission Status Updates
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
  getHODStore,
  subscribeHODData,
  type HODNotificationItem,
} from '../../data/hodWorkspaceData';

interface HODNotificationsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HODNotifications({ onGoBack, onNavigate }: HODNotificationsProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribeHODData(() => setTick((t) => t + 1));
  }, []);

  const store = getHODStore();
  const notifications = store.notifications;

  const handleOpenNotification = (notif: HODNotificationItem) => {
    store.markNotificationAsRead(notif.id);
    if (notif.submissionId) {
      onNavigate('hodFacultyReview', { submissionId: notif.submissionId });
    } else if (notif.type === 'hod_own') {
      onNavigate('myAchievements');
    }
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>HOD Workspace</Text>
          </View>
          <TouchableOpacity
            style={styles.markAllBtn}
            activeOpacity={0.7}
            onPress={handleMarkAllRead}
          >
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="notifications-off-outline" size={36} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySub}>You're all caught up with department updates.</Text>
            </View>
          ) : (
            notifications.map((notif) => {
              const isFaculty =
                notif.type === 'faculty_submission' || notif.type === 'correction_resubmitted';

              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[styles.notifCard, !notif.isRead && styles.notifCardUnread]}
                  activeOpacity={0.75}
                  onPress={() => handleOpenNotification(notif)}
                >
                  <View style={styles.notifRow}>
                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor:
                            notif.type === 'faculty_submission'
                              ? '#EFF6FF'
                              : notif.type === 'correction_resubmitted'
                              ? '#FFFBEB'
                              : '#F0FDF4',
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          notif.type === 'faculty_submission'
                            ? 'document-text'
                            : notif.type === 'correction_resubmitted'
                            ? 'alert-circle'
                            : 'ribbon'
                        }
                        size={18}
                        color={
                          notif.type === 'faculty_submission'
                            ? '#2563EB'
                            : notif.type === 'correction_resubmitted'
                            ? '#D97706'
                            : '#16A34A'
                        }
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.notifTitle}>{notif.title}</Text>
                        <Text style={styles.notifTime}>{notif.timestamp}</Text>
                      </View>
                      <Text style={styles.notifMessage}>{notif.message}</Text>

                      {isFaculty && (
                        <View style={styles.actionRow}>
                          <TouchableOpacity
                            style={styles.reviewBtn}
                            activeOpacity={0.8}
                            onPress={() => handleOpenNotification(notif)}
                          >
                            <Text style={styles.reviewBtnText}>Review Submission →</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  notifCardUnread: {
    backgroundColor: '#F8FAFC',
    borderColor: '#BFDBFE',
  },
  notifRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifTime: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  notifMessage: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 17,
  },
  actionRow: {
    marginTop: 8,
  },
  reviewBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  reviewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
});
