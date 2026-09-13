// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Mentee Details Screen (Read-Only MVP)
// Header → Student Summary → Current Project Information → View Project Button
// ─────────────────────────────────────────────────────────────

import React from 'react';
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
  type MentorMentee,
  type MentorProject,
  getProjectById,
} from '../../data/mentorWorkspaceData';

interface MentorMenteeDetailsProps {
  mentee: MentorMentee;
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectProject?: (project: MentorProject) => void;
}

export default function MentorMenteeDetails({
  mentee,
  onGoBack,
  onNavigate,
  onSelectProject,
}: MentorMenteeDetailsProps) {
  const project = mentee?.projectId ? getProjectById(mentee.projectId) : undefined;

  const initials = (mentee?.name || 'Student')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

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
            <Text style={styles.headerTitle}>Mentee Details</Text>
            <Text style={styles.headerSubtitle}>{mentee?.registerNumber || '23CI011'}</Text>
          </View>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. STUDENT SUMMARY CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.profileSummaryCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <Text style={styles.studentName}>{mentee?.name || 'Gokulraj V'}</Text>
            <Text style={styles.studentRegNo}>{mentee?.registerNumber || '23CI011'}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>{mentee?.department || 'CSE (IoT)'}</Text>
              </View>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>{mentee?.yearLabel || '4th Year'}</Text>
              </View>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>Sec {mentee?.section || 'A'}</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              2. PROJECT INFORMATION SECTION
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Project Information</Text>
          </View>

          {mentee?.hasProject && project ? (
            <View style={styles.projectDetailCard}>
              <View style={styles.projectCardHeader}>
                <View style={styles.projectIconWrap}>
                  <Ionicons
                    name={project.projectType === 'Team' ? 'people' : 'person'}
                    size={20}
                    color="#2563EB"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectDomain}>{project.domain}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{project.projectType}</Text>
                </View>
              </View>

              <Text style={styles.projectDesc} numberOfLines={3}>
                {project.description}
              </Text>

              <View style={styles.roleInfoBox}>
                <View style={styles.roleInfoRow}>
                  <Text style={styles.roleLabel}>Student Role</Text>
                  <View style={styles.rolePill}>
                    <Text style={styles.rolePillText}>{mentee.projectRole}</Text>
                  </View>
                </View>

                {project.projectType === 'Team' && (
                  <View style={styles.roleInfoRow}>
                    <Text style={styles.roleLabel}>Team Leader</Text>
                    <Text style={styles.roleValue}>{project.teamLeader.name}</Text>
                  </View>
                )}

                <View style={styles.roleInfoRow}>
                  <Text style={styles.roleLabel}>Academic Year</Text>
                  <Text style={styles.roleValue}>{project.academicYear}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewProjectBtn}
                activeOpacity={0.8}
                onPress={() => {
                  if (onSelectProject) {
                    onSelectProject(project);
                  } else {
                    onNavigate('mentorProjectDetails', { projectId: project.id });
                  }
                }}
              >
                <Text style={styles.viewProjectBtnText}>View Full Project Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noProjectCard}>
              <View style={styles.noProjectIconWrap}>
                <Ionicons name="folder-outline" size={28} color="#94A3B8" />
              </View>
              <Text style={styles.noProjectTitle}>No Project Added</Text>
              <Text style={styles.noProjectSubtitle}>
                No project details available yet for this mentee.
              </Text>
            </View>
          )}

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
  profileSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  studentRegNo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  infoPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  projectDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  projectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  projectTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  projectDomain: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  projectDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 14,
  },
  roleInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
    marginBottom: 16,
  },
  roleInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  roleValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  rolePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rolePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  viewProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  viewProjectBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noProjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noProjectIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  noProjectTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  noProjectSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
});
