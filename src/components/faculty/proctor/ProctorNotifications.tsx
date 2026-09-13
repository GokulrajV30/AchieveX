// ─────────────────────────────────────────────────────────────
// AchieveX — Proctor Notifications Screen
// Notification center for assigned student achievement submissions, corrections, and goals.
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  PROCTOR_NOTIFICATIONS,
  type ProctorNotificationItem,
  PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS,
  getAllProctorNotifications,
  subscribeProctorNotifications,
} from '../../../data/facultyWorkspaceData';
import StudentAchievementDetailsModal, {
  type ReadOnlyAchievementData,
} from '../StudentAchievementDetailsModal';
import StudentBottomTab from '../../StudentBottomTab';
import ProctorTeamView from './ProctorTeamView';

interface ProctorNotificationsProps {
  onGoBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function ProctorNotifications({
  onGoBack,
  onNavigate,
}: ProctorNotificationsProps) {
  const [notificationsList, setNotificationsList] = useState<ProctorNotificationItem[]>(
    getAllProctorNotifications()
  );
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<ReadOnlyAchievementData | null>(null);
  const [teamViewId, setTeamViewId] = useState<string | null>(null); // for team_achievement notifications

  React.useEffect(() => {
    return subscribeProctorNotifications(() => {
      setNotificationsList(getAllProctorNotifications());
    });
  }, []);

  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (notif: ProctorNotificationItem) => {
    // Mark as read
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    // If it's a team achievement notification → open ProctorTeamView (monitor mode)
    if (notif.type === 'team_achievement' && notif.teamAchievementId) {
      setTeamViewId(notif.teamAchievementId);
      return;
    }

    // If notification has achievement, open read-only details
    if (notif.achievementId) {
      const ach = PROCTOR_STUDENT_DETAILED_ACHIEVEMENTS.find(
        (a) => a.id === notif.achievementId
      );
      if (ach) {
        setSelectedAchievement({
          id: ach.id,
          studentName: ach.studentName,
          registerNumber: ach.rollNo,
          department: ach.department,
          title: ach.title,
          category: ach.category,
          event: ach.event,
          organizer: ach.organizer,
          semester: ach.semester,
          date: ach.date,
          status: ach.status,
          points: ach.points,
          proofDocumentName: ach.proofDocumentName,
          proofType: ach.proofType,
        });
      }
    }
  };

  const filteredNotifications = notificationsList.filter((n) =>
    activeTab === 'all' ? true : !n.isRead
  );

  const todayList = filteredNotifications.filter((n) => n.dateGroup === 'Today');
  const yesterdayList = filteredNotifications.filter((n) => n.dateGroup === 'Yesterday');
  const earlierList = filteredNotifications.filter((n) => n.dateGroup === 'Earlier');

  const renderIcon = (type: ProctorNotificationItem['type']) => {
    switch (type) {
      case 'submission':
        return <Ionicons name="document-text" size={18} color="#2563EB" />;
      case 'approved':
        return <Ionicons name="checkmark-circle" size={18} color="#16A34A" />;
      case 'correction':
        return <Ionicons name="alert-circle" size={18} color="#DC2626" />;
      case 'goal':
        return <MaterialCommunityIcons name="target" size={18} color="#7C3AED" />;
      case 'assigned':
        return <Ionicons name="person-add" size={18} color="#0891B2" />;
      case 'team_achievement':
        return <Ionicons name="people" size={18} color="#4F46E5" />;
      default:
        return <Ionicons name="notifications" size={18} color="#2563EB" />;
    }
  };

  const getIconBg = (type: ProctorNotificationItem['type']) => {
    switch (type) {
      case 'submission': return '#EFF6FF';
      case 'approved':   return '#F0FDF4';
      case 'correction': return '#FEF2F2';
      case 'goal':       return '#F5F3FF';
      case 'assigned':   return '#ECFEFF';
      case 'team_achievement': return '#EEF2FF';
      default:           return '#EFF6FF';
    }
  };

  // If proctor tapped a team achievement notification → show ProctorTeamView
  if (teamViewId) {
    return (
      <ProctorTeamView
        teamAchievementId={teamViewId}
        onGoBack={() => setTeamViewId(null)}
      />
    );
  }

  const renderSection = (title: string, items: ProctorNotificationItem[]) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.notificationGroup}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notificationCard,
                !item.isRead && styles.notificationCardUnread,
              ]}
              activeOpacity={0.75}
              onPress={() => handleNotificationPress(item)}
            >
              <View style={[styles.notifIconCircle, { backgroundColor: getIconBg(item.type) }]}>
                {renderIcon(item.type)}
              </View>

              <View style={styles.notifContentCol}>
                <View style={styles.notifHeaderRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <Text style={styles.notifTime}>{item.time}</Text>
                  {item.type === 'team_achievement' && (
                    <View style={styles.viewTeamChip}>
                      <Text style={styles.viewTeamChipText}>View Team →</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Proctor Notifications</Text>
            <Text style={styles.headerSubtitle}>Activity from your assigned students</Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs Row */}
        <View style={styles.tabButtonsRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'all' && styles.tabButtonTextActive]}>
              All ({notificationsList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'unread' && styles.tabButtonActive]}
            onPress={() => setActiveTab('unread')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'unread' && styles.tabButtonTextActive,
              ]}
            >
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={42} color="#94A3B8" />
              <Text style={styles.emptyTitle}>You're all caught up!</Text>
              <Text style={styles.emptySubtitle}>
                No unread notifications from your assigned students.
              </Text>
            </View>
          ) : (
            <>
              {renderSection('Today', todayList)}
              {renderSection('Yesterday', yesterdayList)}
              {renderSection('Earlier', earlierList)}
            </>
          )}

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Read-Only Modal */}
        <StudentAchievementDetailsModal
          visible={selectedAchievement !== null}
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />

        {/* Bottom Navigation */}
        <StudentBottomTab
          variant="proctor"
          activeTab="home"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('facultyDashboard');
            } else if (tab === 'students' || tab === 'achievements') {
              onNavigate('proctorAssignedStudents');
            } else if (tab === 'goals') {
              onNavigate('proctorGoalsOverview');
            } else if (tab === 'leaderboard') {
              onNavigate('proctorLeaderboard');
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
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  markAllReadText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  tabButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 16,
  },
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationGroup: {
    gap: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  notificationCardUnread: {
    backgroundColor: '#F8FAFF',
    borderColor: '#BFDBFE',
  },
  notifIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContentCol: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  notifMessage: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  viewTeamChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  viewTeamChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4338CA',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
