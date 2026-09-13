// ─────────────────────────────────────────────────────────────
// AchieveX — Student Projects Screen (V1)
// Header → "+ Add Project" Action → "My Projects" List → Bottom Tab
// Clean, fast, zero fake-progress or review clutter
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getProjectsForStudent,
  getFacultyMentor,
  type ProjectTeam,
} from '../../../data/studentProjectsData';
import { getHODStore } from '../../../data/hodWorkspaceData';
import StudentBottomTab from '../../StudentBottomTab';
import { useBottomNavInset } from '../../../hooks/useBottomNavInset';

interface StudentProjectsProps {
  currentStudentRoll?: string;
  onGoBack?: () => void;
  onOpenMenu?: () => void;
  onNavigate: (screen: string) => void;
  onViewProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export default function StudentProjects({
  currentStudentRoll = '23CI011',
  onGoBack,
  onOpenMenu,
  onNavigate,
  onViewProject,
  onCreateProject,
}: StudentProjectsProps) {
  const { contentBottomPadding } = useBottomNavInset();
  const [tick, setTick] = useState(0);

  // Subscribe to HOD store updates so edits/creates update live
  useEffect(() => {
    const store = getHODStore();
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const projects = useMemo(
    () => getProjectsForStudent(currentStudentRoll),
    [currentStudentRoll, tick]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── Top Header Bar ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onGoBack ? (
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={onGoBack}
            >
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
          ) : onOpenMenu ? (
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={onOpenMenu}
            >
              <Ionicons name="menu-outline" size={24} color="#0F172A" />
            </TouchableOpacity>
          ) : null}
          <View style={styles.headerTitleWrap}>
            <Text style={styles.screenTitle}>Projects</Text>
            <Text style={styles.screenSubtitle}>
              Manage your academic project details.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerAddBtn}
          activeOpacity={0.8}
          onPress={onCreateProject}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.headerAddBtnText}>Add Project</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: contentBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {projects.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="folder-open-outline" size={36} color="#2563EB" />
            </View>
            <Text style={styles.emptyTitle}>No Projects Yet</Text>
            <Text style={styles.emptyDescription}>
              Add your academic project and team details to AchieveX.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              activeOpacity={0.8}
              onPress={onCreateProject}
            >
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.emptyActionBtnText}>+ Add Project</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Projects List ── */
          <View style={styles.projectsListContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>My Projects</Text>
              <View style={styles.projectCountBadge}>
                <Text style={styles.projectCountText}>{projects.length}</Text>
              </View>
            </View>

            {projects.map((project) => {
              const isTeam = project.projectType === 'team';
              const memberCount = project.members?.filter((m) => m.status === 'active').length || 1;
              const mentorInfo = project.mentorName
                ? project.mentorName
                : project.mentorFacultyId
                ? getFacultyMentor(project.mentorFacultyId)?.name || 'Dr. Priya S'
                : 'Not Assigned Yet';

              const displayType = project.projectCategory || (isTeam ? 'Team Project' : 'Individual Project');
              const statusLabel =
                project.status === 'completed'
                  ? 'Completed'
                  : project.status === 'draft'
                  ? 'Draft'
                  : 'Active';

              return (
                <TouchableOpacity
                  key={project.id}
                  style={styles.projectCard}
                  activeOpacity={0.88}
                  onPress={() => onViewProject(project.id)}
                >
                  {/* Card Top Row: Title & Status */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleArea}>
                      <Text style={styles.projectCardTitle} numberOfLines={1}>
                        {project.title}
                      </Text>
                      {project.teamName ? (
                        <Text style={styles.teamNameText} numberOfLines={1}>
                          {project.teamName}
                        </Text>
                      ) : (
                        <Text style={styles.teamNameText}>Individual Project</Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        statusLabel === 'Completed'
                          ? styles.statusCompleted
                          : statusLabel === 'Draft'
                          ? styles.statusDraft
                          : styles.statusActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          statusLabel === 'Completed'
                            ? styles.dotCompleted
                            : statusLabel === 'Draft'
                            ? styles.dotDraft
                            : styles.dotActive,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          statusLabel === 'Completed'
                            ? styles.textCompleted
                            : statusLabel === 'Draft'
                            ? styles.textDraft
                            : styles.textActive,
                        ]}
                      >
                        {statusLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Card Meta Pills */}
                  <View style={styles.metaRow}>
                    <View style={styles.typePill}>
                      <Ionicons
                        name={isTeam ? 'people-outline' : 'person-outline'}
                        size={13}
                        color="#2563EB"
                      />
                      <Text style={styles.typePillText}>{displayType}</Text>
                    </View>

                    <View style={styles.domainPill}>
                      <Ionicons name="pricetag-outline" size={12} color="#475569" />
                      <Text style={styles.domainPillText}>{project.domain}</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Card Footer: Members Count, Mentor, & View Button */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.footerInfoCol}>
                      <View style={styles.footerMetaItem}>
                        <Ionicons name="people-circle-outline" size={16} color="#64748B" />
                        <Text style={styles.footerMetaText}>
                          {isTeam ? `${memberCount} Team Members` : 'Individual'}
                        </Text>
                      </View>

                      <View style={[styles.footerMetaItem, { marginTop: 4 }]}>
                        <Ionicons name="school-outline" size={15} color="#64748B" />
                        <Text style={styles.footerMetaMentor} numberOfLines={1}>
                          Mentor: <Text style={styles.mentorHighlight}>{mentorInfo}</Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.viewProjectBtn}>
                      <Text style={styles.viewProjectText}>View Project</Text>
                      <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Shared Student Bottom Navigation Bar */}
      <StudentBottomTab
        activeTab="home"
        variant="student"
        onNavigate={(tab) => {
          if (tab === 'home') onNavigate('dashboard');
          else if (tab === 'achievements') onNavigate('myAchievements');
          else if (tab === 'goals') onNavigate('goals');
          else if (tab === 'leaderboard') onNavigate('leaderboard');
          else if (tab === 'profile') onNavigate('profile');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 1,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 13,
    paddingVertical: 8.5,
    borderRadius: 9,
    gap: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  headerAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 42,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
    marginBottom: 20,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  emptyActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  projectsListContainer: {
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  projectCountBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  projectCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleArea: {
    flex: 1,
  },
  projectCardTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  teamNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 5,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusDraft: {
    backgroundColor: '#F1F5F9',
  },
  statusCompleted: {
    backgroundColor: '#F0FDF4',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#10B981',
  },
  dotDraft: {
    backgroundColor: '#64748B',
  },
  dotCompleted: {
    backgroundColor: '#059669',
  },
  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  textActive: {
    color: '#059669',
  },
  textDraft: {
    color: '#475569',
  },
  textCompleted: {
    color: '#047857',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  typePillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  domainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  domainPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfoCol: {
    flex: 1,
    paddingRight: 10,
  },
  footerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerMetaText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  footerMetaMentor: {
    fontSize: 12,
    color: '#64748B',
  },
  mentorHighlight: {
    fontWeight: '600',
    color: '#0F172A',
  },
  viewProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 2,
  },
  viewProjectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
