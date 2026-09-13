import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PlaceholderScreenProps {
  title: string;
  onGoBack: () => void;
  onOpenMenu: () => void;
}

export default function PlaceholderScreen({
  title,
  onGoBack,
  onOpenMenu,
}: PlaceholderScreenProps) {
  // Resolve icon based on title
  const getIconName = () => {
    const t = title.toLowerCase();
    if (t.includes('setting')) return 'settings-outline';
    if (t.includes('profile')) return 'person-outline';
    if (t.includes('notification')) return 'notifications-outline';
    if (t.includes('history')) return 'time-outline';
    if (t.includes('points')) return 'stats-chart-outline';
    if (t.includes('nptel') || t.includes('credit')) return 'school-outline';
    return 'trophy-outline'; // default to trophy
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuIconContainer}
            activeOpacity={0.7}
            onPress={onOpenMenu}
          >
            <Ionicons name="menu-outline" size={22} color="#0D4733" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name={getIconName() as any} size={42} color="#2563EB" />
            </View>
            <Text style={styles.cardTitle}>Feature Under Construction</Text>
            <Text style={styles.cardDescription}>
              The <Text style={styles.boldText}>{title}</Text> module is currently being built by our design and engineering teams.
            </Text>
            <Text style={styles.cardSubtext}>
              It will be integrated directly with institutional verification workflows in the upcoming phase.
            </Text>

            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={onGoBack}
            >
              <Ionicons name="arrow-back-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.backButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  headerSpacer: {
    width: 40,
  },
  contentBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  cardSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
