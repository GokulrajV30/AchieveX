// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Achievement Policy Inspection
// Read-only inspection of institutional points matrix and proof standards.
// Maintained by Achievement Head; endorsed by Principal.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalAchievementPolicyProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalAchievementPolicy({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalAchievementPolicyProps) {
  const policyCategories = [
    {
      id: 'cat_research',
      name: 'Research, Publication & IPR',
      typesCount: 8,
      pointRange: '30 - 300 Pts',
      proofs: 'Certificate, Journal DOI / Scopus Link, First Page Copy',
      authorityFlow: 'Faculty → HOD → Dean (or Dean → Principal)',
      badge: 'Core Academic',
    },
    {
      id: 'cat_technical',
      name: 'Technical Competitions & Hackathons',
      typesCount: 6,
      pointRange: '20 - 150 Pts',
      proofs: 'Participation Certificate, Award Certificate, Geo-tagged Photo',
      authorityFlow: 'Student → Mentor / Class Advisor → HOD',
      badge: 'Student Excellence',
    },
    {
      id: 'cat_grants',
      name: 'Funded Research Grants & Schemes',
      typesCount: 5,
      pointRange: '50 - 500 Pts',
      proofs: 'Sanction Order, Project Summary, Fund Release Letter',
      authorityFlow: 'Principal Investigator → HOD → Dean → Principal',
      badge: 'Institutional Grants',
    },
    {
      id: 'cat_certifications',
      name: 'Industry Certification & Online MOOCs',
      typesCount: 7,
      pointRange: '10 - 100 Pts',
      proofs: 'Scorecard, Authenticity URL, Completion Certificate',
      authorityFlow: 'Student/Faculty → Coordinator → HOD',
      badge: 'Skill Development',
    },
    {
      id: 'cat_consultancy',
      name: 'Industry Consultancy & Corporate Training',
      typesCount: 4,
      pointRange: '40 - 250 Pts',
      proofs: 'MOU / Work Order, Institutional Finance Receipt, Completion Letter',
      authorityFlow: 'Faculty Lead → HOD → Dean',
      badge: 'Revenue & Industry',
    },
  ];

  const handleContactAchievementHead = () => {
    Alert.alert(
      'Policy Revision Request',
      'Policy updates are managed by the Achievement Head. An executive notification will be dispatched to the Achievement Head workspace.',
      [{ text: 'Notify Achievement Head', onPress: () => {} }, { text: 'Cancel', style: 'cancel' }]
    );
  };

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
            <Text style={styles.screenTitle}>Achievement Policy</Text>
            <Text style={styles.screenSubtext}>Institutional Scoring Matrix (Read-Only)</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Policy Hero */}
          <PrincipalHeroCard
            overline="INSTITUTIONAL POLICY"
            title="Policy Version v2.1"
            subtitle="Whole college scoring policy, verified under Anna University standards"
            icon="shield-checkmark"
            badgeText="v2.1 Endorsed"
            primaryNumber="8"
            primaryLabel="Active Categories"
            secondaryMetrics={[
              { number: '42', label: 'Types' },
              { number: 'Head', label: 'Admin' },
            ]}
            compact
          />

          {/* Governance Context Banner */}
          <View style={styles.governanceBanner}>
            <View style={styles.govBannerIcon}>
              <Ionicons name="information-circle" size={20} color="#2563EB" />
            </View>
            <View style={styles.govBannerTextCol}>
              <Text style={styles.govBannerTitle}>Governance Authority Note</Text>
              <Text style={styles.govBannerBody}>
                Policy rules, categories, and proof matrices are configured and maintained by the{' '}
                <Text style={{ fontWeight: '700' }}>Achievement Head</Text>. The Principal reviews and endorses college alignment without altering individual values.
              </Text>
            </View>
          </View>

          {/* Category Policy Cards */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Category Scoring Matrices</Text>
            <Text style={styles.sectionMeta}>{policyCategories.length} Categories</Text>
          </View>

          <View style={styles.listContainer}>
            {policyCategories.map((cat) => (
              <View key={cat.id} style={styles.policyCard}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardCategoryName}>{cat.name}</Text>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{cat.badge}</Text>
                  </View>
                </View>

                <View style={styles.specsRow}>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Achievement Types</Text>
                    <Text style={styles.specValue}>{cat.typesCount} Types Defined</Text>
                  </View>
                  <View style={styles.specDivider} />
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Point Range</Text>
                    <Text style={styles.specValuePoints}>{cat.pointRange}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Required Proof Documentation</Text>
                  <Text style={styles.detailValue}>{cat.proofs}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Governance & Verification Chain</Text>
                  <Text style={styles.detailValueFlow}>{cat.authorityFlow}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Contact Achievement Head Button */}
          <View style={styles.contactBtnContainer}>
            <TouchableOpacity
              style={styles.contactHeadBtn}
              activeOpacity={0.85}
              onPress={handleContactAchievementHead}
            >
              <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.contactHeadBtnText}>Contact Achievement Head for Policy Revision</Text>
            </TouchableOpacity>
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
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  governanceBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  govBannerIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  govBannerTextCol: {
    flex: 1,
  },
  govBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  govBannerBody: {
    fontSize: 11,
    color: '#1E40AF',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardCategoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  badgePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  specsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 1,
  },
  specValuePoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 1,
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  detailRow: {
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 11,
    color: '#334155',
    marginTop: 1,
  },
  detailValueFlow: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
    marginTop: 1,
  },
  contactBtnContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  contactHeadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
  },
  contactHeadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
