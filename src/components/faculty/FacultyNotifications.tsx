import React from 'react';
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
import FacultyBottomTab from './FacultyBottomTab';
import { notificationMockData } from '../../data/facultyPortalMockData';

interface FacultyNotificationsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  onSelectNotification: (itemId: string) => void;
}

export default function FacultyNotifications({
  onOpenMenu,
  onNavigate,
  onSelectNotification,
}: FacultyNotificationsProps) {
  const notifications = notificationMockData;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.menuIconContainer}
            activeOpacity={0.7}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={22} color="#0D4733" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Notification Feed */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.notificationCard, item.unread && styles.unreadCard]}
              activeOpacity={0.8}
              onPress={() => onSelectNotification(item.id)}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, item.unread && styles.unreadText]}>
                    {item.title}
                  </Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Shared Bottom Tab */}
        <FacultyBottomTab activeTab="home" onNavigate={onNavigate} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAF8F5',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0D4733',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 85,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFC',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  unreadText: {
    fontWeight: '800',
    color: '#111827',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginLeft: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 16,
    fontWeight: '500',
  },
  cardTime: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 6,
  },
});
