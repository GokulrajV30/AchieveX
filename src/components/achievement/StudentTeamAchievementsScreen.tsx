// ─────────────────────────────────────────────────────────────
// AchieveX — Student Team Achievements List Screen
// Header: Team Achievements
// Subtitle: Achievements you participate in as a team
// Displays centralized demo team (Smart India Hackathon 2026)
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
  getTeamAchievementsForStudent,
  isTeamLeader,
  getMemberRecord,
  getCertificateProgress,
  subscribeTeamAchievements,
  type TeamAchievement,
} from '../../data/teamAchievementData';
import StudentBottomTab from '../StudentBottomTab';

interface StudentTeamAchievementsScreenProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  currentStudentId?: string;
  onOpenMenu?: () => void;
}

export default function StudentTeamAchievementsScreen({
  onGoBack,
  onNavigate,
  currentStudentId = '23ci011',
  onOpenMenu,
}: StudentTeamAchievementsScreenProps) {
  const [, setTick] = useState(0);

  // Subscribe to centralized reactive team achievements store
  useEffect(() => {
    return subscribeTeamAchievements(() => setTick((t: number) => t + 1));
  }, []);

  const activeStudentNorm = currentStudentId.toLowerCase();
  const teamAchievements: TeamAchievement[] = getTeamAchievementsForStudent(activeStudentNorm);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={onGoBack}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Team Achievements</Text>
            <Text style={styles.headerSubtitle}>
              Achievements you participate in as a team
            </Text>
          </View>

          {onOpenMenu ? (
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.7}
              onPress={onOpenMenu}
            >
              <Ionicons name="menu-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={18} color="#2563EB" style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={styles.infoBannerText}>
              Team achievements share common event proofs. Each team member only uploads their individual certificate.
            </Text>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Team Achievements</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{teamAchievements.length}</Text>
            </View>
          </View>

          {teamAchievements.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Team Achievements Found</Text>
              <Text style={styles.emptySubtitle}>
                You are not currently enrolled in any team achievements under {currentStudentId.toUpperCase()}.
              </Text>
            </View>
          ) : (
            /* Team Cards List */
            teamAchievements.map((team) => {
              const progress = getCertificateProgress(team.id);
              const isLeader = isTeamLeader(team, activeStudentNorm);
              const memberRecord = getMemberRecord(team.id, activeStudentNorm);
              const isMemberCertUploaded =
                memberRecord?.certificateStatus === 'Uploaded' ||
                memberRecord?.certificateStatus === 'Verified';
              const progressPercent = progress.total > 0 ? (progress.uploaded / progress.total) * 100 : 0;
              const isAllUploaded = progress.uploaded === progress.total;

              return (
                <View key={team.id} style={styles.teamCard}>
                  {/* Team Card Top Row */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.teamIconCircle}>
                      <Ionicons name="people" size={20} color="#4F46E5" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.teamNameText}>{team.teamName}</Text>
                        <View
                          style={[
                            styles.roleBadge,
                            isLeader ? styles.roleBadgeLeader : styles.roleBadgeMember,
                          ]}
                        >
                          <Text
                            style={[
                              styles.roleBadgeText,
                              { color: isLeader ? '#1D4ED8' : '#7C3AED' },
                            ]}
                          >
                            {isLeader ? 'Team Leader' : 'Team Member'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.eventNameText}>{team.eventName}</Text>
                      <Text style={styles.eventMetaText}>
                        {team.achievementType} • {team.level} • {team.semester}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Team Meta & Status Row */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="person-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.metaText}>
                        Leader: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{team.teamLeaderName}</Text>
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="people-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.metaText}>{team.members.length} Members</Text>
                    </View>
                  </View>

                  {/* ── CASE A: TEAM LEADER VIEW ── */}
                  {isLeader ? (
                    <>
                      {/* Certificate Progress Bar Section */}
                      <View style={styles.progressContainer}>
                        <View style={styles.progressLabelRow}>
                          <Text style={styles.progressLabel}>Individual Certificates</Text>
                          <Text
                            style={[
                              styles.progressCount,
                              { color: isAllUploaded ? '#16A34A' : '#D97706' },
                            ]}
                          >
                            {progress.uploaded} / {progress.total} Uploaded
                          </Text>
                        </View>
                        <View style={styles.progressBarTrack}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${progressPercent}%`,
                                backgroundColor: isAllUploaded ? '#16A34A' : '#4F46E5',
                              },
                            ]}
                          />
                        </View>
                      </View>

                      {/* Action CTA Button */}
                      <TouchableOpacity
                        style={styles.viewTeamButton}
                        activeOpacity={0.8}
                        onPress={() =>
                          onNavigate('studentTeamAchievementDetails', {
                            teamAchievementId: team.id,
                          })
                        }
                      >
                        <Text style={styles.viewTeamButtonText}>View Team →</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    /* ── CASE B: TEAM MEMBER VIEW ── */
                    <>
                      <View style={styles.memberStatusBox}>
                        <View style={styles.memberStatusHeader}>
                          <Text style={styles.memberStatusLabel}>Your Certificate Status:</Text>
                          {!isMemberCertUploaded ? (
                            <View style={styles.statusChipAmber}>
                              <Ionicons name="alert-circle" size={12} color="#B45309" style={{ marginRight: 4 }} />
                              <Text style={styles.statusChipAmberText}>Certificate Required</Text>
                            </View>
                          ) : (
                            <View style={styles.statusChipGreen}>
                              <Ionicons name="checkmark-circle" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                              <Text style={styles.statusChipGreenText}>Certificate Uploaded</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.memberStatusHint}>
                          {!isMemberCertUploaded
                            ? 'Your team leader has submitted the event details and common proofs. Upload only your individual certificate.'
                            : 'Your individual certificate is uploaded and pending verification by the Academic Coordinator.'}
                        </Text>
                      </View>

                      {!isMemberCertUploaded ? (
                        <TouchableOpacity
                          style={styles.uploadCertButton}
                          activeOpacity={0.8}
                          onPress={() =>
                            onNavigate('teamMemberCertificate', {
                              teamAchievementId: team.id,
                              studentId: activeStudentNorm,
                            })
                          }
                        >
                          <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.uploadCertButtonText}>Upload Certificate →</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.viewDetailsButton}
                          activeOpacity={0.8}
                          onPress={() =>
                            onNavigate('studentTeamAchievementDetails', {
                              teamAchievementId: team.id,
                            })
                          }
                        >
                          <Ionicons name="eye-outline" size={16} color="#4F46E5" style={{ marginRight: 6 }} />
                          <Text style={styles.viewDetailsButtonText}>View Details →</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Bottom Tab Bar */}
        <StudentBottomTab
          activeTab="achievements"
          onNavigate={(tab) => {
            if (tab === 'home') onNavigate('dashboard');
            else if (tab === 'achievements') onNavigate('myAchievements');
            else if (tab === 'goals') onNavigate('goals');
            else if (tab === 'leaderboard') onNavigate('leaderboard');
            else if (tab === 'profile') onNavigate('profile');
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
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  teamIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeLeader: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  roleBadgeMember: {
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  eventNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  eventMetaText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
  },
  progressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  progressCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewTeamButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTeamButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberStatusBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  memberStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  memberStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  statusChipAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusChipAmberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  statusChipGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusChipGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  memberStatusHint: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  uploadCertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 11,
  },
  uploadCertButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 10,
    paddingVertical: 11,
  },
  viewDetailsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
