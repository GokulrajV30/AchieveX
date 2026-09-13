// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Faculty Assignments Hub Screen
// Architecture: HOD assigns responsibility/scope, not every student.
// Options: Proctor Assignments (Scope-Based) & Project Mentors (Team-Based)
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import HODBottomTab from './HODBottomTab';
import { getHODStore, subscribeHODData } from '../../data/hodWorkspaceData';

interface HODAssignmentsProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HODAssignments({
  onGoBack,
  onNavigate,
}: HODAssignmentsProps) {
  const [storeState, setStoreState] = useState(() => {
    const store = getHODStore();
    return {
      activeProctors: store.getProctorAssignments().length,
      awaitingProjects: store.getProjectsAwaitingMentor().length,
      activeProjects: store.getActiveProjectsCount(),
      activities: store.activities.filter(
        (a) =>
          a.title.includes('Proctor') ||
          a.title.includes('Mentor') ||
          a.category === 'department_activity'
      ).slice(0, 4),
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeHODData(() => {
      const store = getHODStore();
      setStoreState({
        activeProctors: store.getProctorAssignments().length,
        awaitingProjects: store.getProjectsAwaitingMentor().length,
        activeProjects: store.getActiveProjectsCount(),
        activities: store.activities.filter(
          (a) =>
            a.title.includes('Proctor') ||
            a.title.includes('Mentor') ||
            a.category === 'department_activity'
        ).slice(0, 4),
      });
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.mainContainer}>
        {/* 1. TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={onGoBack}
            >
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Faculty Assignments</Text>
              <Text style={styles.headerSubtitle}>Responsibility & Scope Delegation</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. COMPACT HOD HERO CARD (AchieveX Brand Blue → Indigo) */}
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroCategoryPill}>
                <Ionicons name="people-circle" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Text style={styles.heroCategoryText}>FACULTY ASSIGNMENTS</Text>
              </View>
              <View style={styles.deptBadge}>
                <Text style={styles.deptBadgeText}>CSE (IoT)</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Manage Proctors & Project Mentors</Text>
            <Text style={styles.heroSubtext}>
              Assign academic scopes to Proctors and assign Faculty Mentors to student project teams.
            </Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{storeState.activeProctors}</Text>
                <Text style={styles.heroStatLabel}>Active Proctors</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{storeState.activeProjects}</Text>
                <Text style={styles.heroStatLabel}>Project Teams</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={[styles.heroStatValue, { color: storeState.awaitingProjects > 0 ? '#FEF08A' : '#FFFFFF' }]}>
                  {storeState.awaitingProjects}
                </Text>
                <Text style={styles.heroStatLabel}>Awaiting Mentor</Text>
              </View>
            </View>
          </LinearGradient>

          {/* 3. ASSIGNMENT TYPES */}
          <Text style={styles.sectionHeaderTitle}>Assignment Management</Text>

          {/* OPTION 1: PROCTOR ASSIGNMENTS */}
          <TouchableOpacity
            style={styles.assignmentTypeCard}
            activeOpacity={0.8}
            onPress={() => onNavigate('hodProctorAssignments')}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.typeIconBox, { backgroundColor: '#CCFBF1' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#0F766E" />
              </View>
              <View style={styles.typeInfoCol}>
                <View style={styles.typeTitleRow}>
                  <Text style={styles.typeTitle}>PROCTOR ASSIGNMENTS</Text>
                  <View style={styles.typeActiveBadge}>
                    <Text style={styles.typeActiveBadgeText}>{storeState.activeProctors} Active</Text>
                  </View>
                </View>
                <Text style={styles.typeDesc}>
                  Assign Faculty as Proctors and define which academic group they can manage. Proctors select their own students from that scope.
                </Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottomRow}>
              <View style={styles.scopeMetaRow}>
                <Ionicons name="layers-outline" size={14} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.scopeMetaText}>4 Academic Years • Section Scoped</Text>
              </View>
              <View style={styles.cardActionRow}>
                <Text style={styles.cardActionText}>Manage Proctors</Text>
                <Ionicons name="arrow-forward" size={15} color="#0F766E" />
              </View>
            </View>
          </TouchableOpacity>

          {/* OPTION 2: PROJECT MENTORS */}
          <TouchableOpacity
            style={[styles.assignmentTypeCard, { marginTop: 14 }]}
            activeOpacity={0.8}
            onPress={() => onNavigate('hodMentorAssignments')}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.typeIconBox, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="school" size={24} color="#7C3AED" />
              </View>
              <View style={styles.typeInfoCol}>
                <View style={styles.typeTitleRow}>
                  <Text style={styles.typeTitle}>PROJECT MENTORS</Text>
                  {storeState.awaitingProjects > 0 ? (
                    <View style={[styles.typeActiveBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.typeActiveBadgeText, { color: '#B45309' }]}>
                        {storeState.awaitingProjects} Awaiting
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.typeActiveBadge}>
                      <Text style={styles.typeActiveBadgeText}>All Assigned</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.typeDesc}>
                  Assign Faculty Mentors to student project teams. The project team members automatically become the Mentor's mentees.
                </Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottomRow}>
              <View style={styles.scopeMetaRow}>
                <Ionicons name="folder-outline" size={14} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.scopeMetaText}>
                  {storeState.activeProjects} Active Project Teams
                </Text>
              </View>
              <View style={styles.cardActionRow}>
                <Text style={[styles.cardActionText, { color: '#7C3AED' }]}>Manage Mentors</Text>
                <Ionicons name="arrow-forward" size={15} color="#7C3AED" />
              </View>
            </View>
          </TouchableOpacity>

          {/* 4. RECENT ASSIGNMENT ACTIVITY */}
          {storeState.activities.length > 0 && (
            <View style={styles.activitySection}>
              <Text style={styles.sectionHeaderTitle}>Recent Assignment Activity</Text>
              <View style={styles.activityListCard}>
                {storeState.activities.map((act, idx) => (
                  <View key={act.id}>
                    <View style={styles.activityItem}>
                      <View style={[styles.activityIconCircle, { backgroundColor: '#CCFBF1' }]}>
                        <Ionicons
                          name={(act.iconName as any) || 'checkmark-circle'}
                          size={16}
                          color="#0F766E"
                        />
                      </View>
                      <View style={styles.activityTextCol}>
                        <Text style={styles.activityTitle}>{act.title}</Text>
                        <Text style={styles.activitySubtitle}>{act.subtitle}</Text>
                      </View>
                      <Text style={styles.activityTime}>{act.timestamp}</Text>
                    </View>
                    {idx < storeState.activities.length - 1 && <View style={styles.activityDivider} />}
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        <HODBottomTab activeTab="home" onNavigate={onNavigate} />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroCategoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deptBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deptBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroSubtext: {
    fontSize: 12.5,
    color: '#E0E7FF',
    marginTop: 4,
    lineHeight: 18,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#E0F2FE',
    marginTop: 2,
    fontWeight: '500',
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  assignmentTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  typeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  typeInfoCol: {
    flex: 1,
  },
  typeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  typeActiveBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeActiveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  typeDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scopeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scopeMetaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
    marginRight: 4,
  },
  activitySection: {
    marginTop: 24,
  },
  activityListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityTextCol: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  activitySubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 8,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
