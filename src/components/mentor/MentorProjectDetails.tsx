// ─────────────────────────────────────────────────────────────
// AchieveX — Mentor Project Details Screen (Read-Only MVP)
// Header → Summary Card → About → Project Info → Team / Owner Details
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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  type MentorProject,
  type MentorMentee,
  getMenteeById,
} from '../../data/mentorWorkspaceData';

interface MentorProjectDetailsProps {
  project: MentorProject;
  onGoBack: () => void;
  onSelectMentee?: (mentee: MentorMentee) => void;
}

export default function MentorProjectDetails({
  project,
  onGoBack,
  onSelectMentee,
}: MentorProjectDetailsProps) {
  const isTeam = project.projectType === 'Team';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.warn('Could not open URL:', err)
    );
  };

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
            <Text style={styles.headerTitle}>Project Details</Text>
            <Text style={styles.headerSubtitle}>View Only</Text>
          </View>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ════════════════════════════════════════════════
              1. PROJECT SUMMARY CARD
          ════════════════════════════════════════════════ */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View style={styles.projectIconWrap}>
                <Ionicons
                  name={isTeam ? 'people' : 'person'}
                  size={22}
                  color="#2563EB"
                />
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{project.projectType} Project</Text>
              </View>
            </View>

            <Text style={styles.projectTitle}>{project.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.domainPill}>
                <Text style={styles.domainPillText}>{project.domain}</Text>
              </View>
              <View style={styles.yearPill}>
                <Text style={styles.yearPillText}>{project.studentYear}</Text>
              </View>
              <View style={styles.yearPill}>
                <Text style={styles.yearPillText}>{project.academicYear}</Text>
              </View>
            </View>
          </View>

          {/* ════════════════════════════════════════════════
              2. ABOUT PROJECT
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Project</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>

          {/* ════════════════════════════════════════════════
              3. PROJECT INFORMATION
          ════════════════════════════════════════════════ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Project Information</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Domain</Text>
              <Text style={styles.infoValue}>{project.domain}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Project Type</Text>
              <Text style={styles.infoValue}>{project.projectType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Academic Year</Text>
              <Text style={styles.infoValue}>{project.academicYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Student Year</Text>
              <Text style={styles.infoValue}>{project.studentYear}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{project.department}</Text>
            </View>
          </View>

          {/* External Links if available */}
          {(project.githubUrl || project.demoUrl) && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Repository & Links</Text>
              </View>
              <View style={styles.linksCard}>
                {project.githubUrl && (
                  <TouchableOpacity
                    style={styles.linkRow}
                    activeOpacity={0.7}
                    onPress={() => handleOpenLink(project.githubUrl!)}
                  >
                    <Ionicons name="logo-github" size={20} color="#0F172A" />
                    <Text style={styles.linkText} numberOfLines={1}>
                      {project.githubUrl}
                    </Text>
                    <Ionicons name="open-outline" size={16} color="#2563EB" />
                  </TouchableOpacity>
                )}
                {project.demoUrl && (
                  <TouchableOpacity
                    style={[styles.linkRow, { borderBottomWidth: 0 }]}
                    activeOpacity={0.7}
                    onPress={() => handleOpenLink(project.demoUrl!)}
                  >
                    <Ionicons name="globe-outline" size={20} color="#059669" />
                    <Text style={styles.linkText} numberOfLines={1}>
                      {project.demoUrl}
                    </Text>
                    <Ionicons name="open-outline" size={16} color="#059669" />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          {/* ════════════════════════════════════════════════
              4. TEAM DETAILS OR PROJECT OWNER
          ════════════════════════════════════════════════ */}
          {isTeam ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Project Team</Text>
              </View>

              {/* Team Leader */}
              <View style={styles.leaderCard}>
                <View style={styles.leaderBadge}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={styles.leaderBadgeText}>TEAM LEADER</Text>
                </View>

                <View style={styles.memberRow}>
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>
                      {project.teamLeader.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>{project.teamLeader.name}</Text>
                    <Text style={styles.memberSub}>
                      {project.teamLeader.registerNumber} • {project.teamLeader.department} • {project.teamLeader.yearLabel}
                    </Text>
                  </View>
                  {getMenteeById(project.teamLeader.studentId) && (
                    <TouchableOpacity
                      style={styles.menteePill}
                      onPress={() => {
                        const m = getMenteeById(project.teamLeader.studentId);
                        if (m && onSelectMentee) onSelectMentee(m);
                      }}
                    >
                      <Text style={styles.menteePillText}>Your Mentee</Text>
                      <Ionicons name="chevron-forward" size={12} color="#2563EB" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Team Members */}
              <View style={styles.sectionSubHeader}>
                <Text style={styles.sectionSubTitle}>
                  Team Members ({project.teamMembers.length})
                </Text>
              </View>

              <View style={styles.membersCard}>
                {project.teamMembers.map((member, index) => {
                  const initials = member.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('');

                  const menteeObj = getMenteeById(member.studentId);

                  return (
                    <TouchableOpacity
                      key={member.studentId}
                      style={[
                        styles.memberItem,
                        index === project.teamMembers.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      activeOpacity={menteeObj ? 0.7 : 1}
                      onPress={() => {
                        if (menteeObj && onSelectMentee) {
                          onSelectMentee(menteeObj);
                        }
                      }}
                    >
                      <View style={[styles.avatarWrap, { backgroundColor: '#F1F5F9' }]}>
                        <Text style={[styles.avatarText, { color: '#475569' }]}>
                          {initials}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberSub}>
                          {member.registerNumber} • {member.department} • {member.yearLabel}
                        </Text>
                      </View>

                      {member.isMentee && (
                        <View style={styles.menteePill}>
                          <Text style={styles.menteePillText}>Your Mentee</Text>
                          <Ionicons name="chevron-forward" size={12} color="#2563EB" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Project Owner</Text>
              </View>
              <View style={styles.leaderCard}>
                <View style={[styles.leaderBadge, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="person" size={12} color="#2563EB" />
                  <Text style={[styles.leaderBadgeText, { color: '#2563EB' }]}>
                    INDIVIDUAL OWNER
                  </Text>
                </View>

                <View style={styles.memberRow}>
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>
                      {project.teamLeader.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>{project.teamLeader.name}</Text>
                    <Text style={styles.memberSub}>
                      {project.teamLeader.registerNumber} • {project.teamLeader.department} • {project.teamLeader.yearLabel}
                    </Text>
                  </View>
                  {getMenteeById(project.teamLeader.studentId) && (
                    <TouchableOpacity
                      style={styles.menteePill}
                      onPress={() => {
                        const m = getMenteeById(project.teamLeader.studentId);
                        if (m && onSelectMentee) onSelectMentee(m);
                      }}
                    >
                      <Text style={styles.menteePillText}>Your Mentee</Text>
                      <Ionicons name="chevron-forward" size={12} color="#2563EB" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 23,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  domainPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  domainPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  yearPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  yearPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubHeader: {
    marginBottom: 8,
    marginTop: 10,
  },
  sectionSubTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  linksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkText: {
    flex: 1,
    fontSize: 12.5,
    color: '#2563EB',
    fontWeight: '600',
  },
  leaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  leaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 10,
  },
  leaderBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  memberName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  memberSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  menteePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  menteePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
});
