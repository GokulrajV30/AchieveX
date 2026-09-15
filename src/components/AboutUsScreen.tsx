// ─────────────────────────────────────────────────────────────
// AchieveX — Shared About Us Screen
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showAchieveXDialog } from './feedback/AchieveXFeedback';

interface AboutUsScreenProps {
  onGoBack: () => void;
}

export default function AboutUsScreen({ onGoBack }: AboutUsScreenProps) {
  const supportEmail = 'avenzotechnologies05@gmail.com';

  const handleOpenEmail = async () => {
    const url = `mailto:${supportEmail}?subject=${encodeURIComponent('AchieveX - Support & Feedback')}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showAchieveXDialog({
          type: 'info',
          title: 'Unable to Open Email',
          message: `Please email us at\n${supportEmail}`,
          primaryAction: {
            label: 'Got It',
          },
        });
      }
    } catch {
      showAchieveXDialog({
        type: 'info',
        title: 'Unable to Open Email',
        message: `Please email us at\n${supportEmail}`,
        primaryAction: {
          label: 'Got It',
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* Top Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onGoBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Brand Card */}
          <View style={styles.brandCard}>
            <Image
              source={require('../../assets/AchieveX logo (2).png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>AchieveX</Text>
            <Text style={styles.brandTagline}>Track. Recognize. Achieve.</Text>
            <Text style={styles.brandDescription}>
              AchieveX is a centralized achievement tracking and analytics platform
              designed for educational institutions to record, manage, verify, and
              recognize student and faculty achievements.
            </Text>
          </View>

          {/* Section: OUR PURPOSE */}
          <View style={styles.infoCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="flag-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.sectionHeading}>OUR PURPOSE</Text>
            </View>
            <Text style={styles.bodyText}>
              AchieveX simplifies achievement management by bringing submissions,
              verification, recognition, analytics, and institutional reporting into
              one connected platform.
            </Text>
          </View>

          {/* Section: PRODUCT INFORMATION */}
          <View style={styles.infoCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="cube-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.sectionHeading}>PRODUCT INFORMATION</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.metaLabel}>Product</Text>
              <Text style={styles.metaValue}>AchieveX</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.rowBetween}>
              <Text style={styles.metaLabel}>Version</Text>
              <Text style={styles.metaValue}>1.0.0</Text>
            </View>
          </View>

          {/* Section: DEVELOPED BY */}
          <View style={styles.infoCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="business-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.sectionHeading}>DEVELOPED BY</Text>
            </View>
            <Text style={styles.developedByText}>Avenzo Technologies Pvt Ltd</Text>
          </View>

          {/* Section: SUPPORT & FEEDBACK */}
          <View style={styles.infoCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="chatbubbles-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.sectionHeading}>SUPPORT & FEEDBACK</Text>
            </View>
            <Text style={styles.bodyText}>
              Have a question, issue, or feedback?
              {'\n'}We'd love to hear from you.
            </Text>

            <TouchableOpacity
              style={styles.emailCard}
              activeOpacity={0.75}
              onPress={handleOpenEmail}
            >
              <View style={styles.mailIconWrapper}>
                <Ionicons name="mail-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.emailAddressText} numberOfLines={1}>
                {supportEmail}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

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
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  brandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  logoImage: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandTagline: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
    marginBottom: 12,
  },
  brandDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#334155',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metaLabel: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  developedByText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  mailIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emailAddressText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1D4ED8',
  },
});
