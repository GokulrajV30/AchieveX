// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Institutional Leaderboard
// 4-tab institutional leaderboard:
// Departments | Top Students | Top Faculty | Deans
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

import {
  principalDataStore,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalLeaderboardProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

export default function PrincipalLeaderboard({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'departments' | 'students' | 'faculty' | 'deans'>('departments');

  const departments = principalDataStore.getDepartments().sort((a, b) => b.pointsTotal - a.pointsTotal);

  // Top College Students across departments
  const topStudents = [
    { rank: 1, name: 'Kavitha M', dept: 'CSE (IoT)', points: 480, achievements: 6, avatar: 'KM' },
    { rank: 2, name: 'Sanjay S', dept: 'CSE', points: 430, achievements: 5, avatar: 'SS' },
    { rank: 3, name: 'Pooja R', dept: 'AIDS', points: 390, achievements: 5, avatar: 'PR' },
    { rank: 4, name: 'Vignesh R', dept: 'CSE (IoT)', points: 360, achievements: 4, avatar: 'VR' },
    { rank: 5, name: 'Ananya T', dept: 'IT', points: 340, achievements: 4, avatar: 'AT' },
  ];

  // Top College Faculty across departments
  const topFaculty = [
    { rank: 1, name: 'Dr. Arun Kumar', dept: 'CSE (IoT)', points: 680, achievements: 5, avatar: 'AK' },
    { rank: 2, name: 'Dr. Deepa N', dept: 'AIDS', points: 610, achievements: 4, avatar: 'DN' },
    { rank: 3, name: 'Dr. Rajesh P', dept: 'CSE', points: 590, achievements: 4, avatar: 'RP' },
    { rank: 4, name: 'Dr. Suresh M', dept: 'ECE', points: 520, achievements: 3, avatar: 'SM' },
  ];

  // Dean verified records leaderboard
  const topDeans = [
    { rank: 1, name: 'Dr. Kumar V', title: 'Dean of Academic Affairs', points: 450, verified: 3, avatar: 'KV' },
    { rank: 2, name: 'Dr. K. S. Lakshmi', title: 'Dean of Student Affairs', points: 280, verified: 2, avatar: 'KL' },
  ];

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
            <Text style={styles.screenTitle}>Institutional Rankings</Text>
            <Text style={styles.screenSubtext}>Whole College Leaderboard</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <PrincipalHeroCard
            overline="COLLEGE RANKINGS"
            title="Institutional Honor Roll"
            subtitle="Top performing academic divisions, students, faculty, and deans"
            icon="trophy"
            badgeText="Rankings"
            primaryNumber="Top 1%"
            primaryLabel="Institutional Excellence"
            secondaryMetrics={[
              { number: departments[0]?.name || 'CSE', label: 'Leading Dept' },
              { number: topStudents[0]?.name || 'Kavitha M', label: 'Top Student' },
            ]}
            compact
          />

          {/* Leaderboard Tabs */}
          <View style={styles.tabBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {[
                { id: 'departments', label: 'Departments' },
                { id: 'students', label: 'Top Students' },
                { id: 'faculty', label: 'Top Faculty' },
                { id: 'deans', label: 'Deans' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.tabItem, isActive && styles.tabItemActive]}
                    onPress={() => setActiveTab(tab.id as any)}
                  >
                    <Text style={[styles.tabItemText, isActive && styles.tabItemTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* List Content */}
          <View style={styles.listContainer}>
            {/* 1. Departments Tab */}
            {activeTab === 'departments' &&
              departments.map((dept, idx) => (
                <TouchableOpacity
                  key={dept.id}
                  style={styles.rankCard}
                  activeOpacity={0.8}
                  onPress={() => onNavigate('principalDepartmentDetails', { departmentId: dept.id })}
                >
                  <View style={[styles.rankMedal, idx === 0 ? styles.goldMedal : idx === 1 ? styles.silverMedal : idx === 2 ? styles.bronzeMedal : null]}>
                    <Text style={[styles.rankMedalText, idx < 3 && { color: '#FFFFFF' }]}>
                      #{idx + 1}
                    </Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.nameText}>{dept.name}</Text>
                    <Text style={styles.metaText}>
                      {dept.achievementsCount} Achievements • {dept.studentsCount} Students
                    </Text>
                  </View>

                  <View style={styles.pointsCol}>
                    <Text style={styles.pointsText}>{dept.pointsTotal.toLocaleString()} pts</Text>
                    <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              ))}

            {/* 2. Students Tab */}
            {activeTab === 'students' &&
              topStudents.map((std) => (
                <View key={std.rank} style={styles.rankCard}>
                  <View style={[styles.rankMedal, std.rank === 1 ? styles.goldMedal : std.rank === 2 ? styles.silverMedal : std.rank === 3 ? styles.bronzeMedal : null]}>
                    <Text style={[styles.rankMedalText, std.rank <= 3 && { color: '#FFFFFF' }]}>
                      #{std.rank}
                    </Text>
                  </View>

                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{std.avatar}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.nameText}>{std.name}</Text>
                    <Text style={styles.metaText}>
                      {std.dept} • {std.achievements} Achievements
                    </Text>
                  </View>

                  <View style={styles.pointsCol}>
                    <Text style={styles.pointsText}>{std.points} pts</Text>
                  </View>
                </View>
              ))}

            {/* 3. Faculty Tab */}
            {activeTab === 'faculty' &&
              topFaculty.map((fac) => (
                <View key={fac.rank} style={styles.rankCard}>
                  <View style={[styles.rankMedal, fac.rank === 1 ? styles.goldMedal : fac.rank === 2 ? styles.silverMedal : null]}>
                    <Text style={[styles.rankMedalText, fac.rank <= 3 && { color: '#FFFFFF' }]}>
                      #{fac.rank}
                    </Text>
                  </View>

                  <View style={[styles.avatarCircle, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={[styles.avatarText, { color: '#2563EB' }]}>{fac.avatar}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.nameText}>{fac.name}</Text>
                    <Text style={styles.metaText}>
                      {fac.dept} • {fac.achievements} Achievements
                    </Text>
                  </View>

                  <View style={styles.pointsCol}>
                    <Text style={styles.pointsText}>{fac.points} pts</Text>
                  </View>
                </View>
              ))}

            {/* 4. Deans Tab */}
            {activeTab === 'deans' &&
              topDeans.map((d) => (
                <View key={d.rank} style={styles.rankCard}>
                  <View style={[styles.rankMedal, d.rank === 1 ? styles.goldMedal : null]}>
                    <Text style={[styles.rankMedalText, d.rank === 1 && { color: '#FFFFFF' }]}>
                      #{d.rank}
                    </Text>
                  </View>

                  <View style={[styles.avatarCircle, { backgroundColor: '#FEFCE8' }]}>
                    <Text style={[styles.avatarText, { color: '#B45309' }]}>{d.avatar}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.nameText}>{d.name}</Text>
                    <Text style={styles.metaText}>
                      {d.title} • {d.verified} Verified Submissions
                    </Text>
                  </View>

                  <View style={styles.pointsCol}>
                    <Text style={styles.pointsText}>{d.points} pts</Text>
                  </View>
                </View>
              ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="reports" onNavigate={onNavigate} />
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
  tabBar: {
    marginBottom: 12,
  },
  tabItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabItemActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabItemTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rankMedal: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  goldMedal: {
    backgroundColor: '#F59E0B',
  },
  silverMedal: {
    backgroundColor: '#94A3B8',
  },
  bronzeMedal: {
    backgroundColor: '#B45309',
  },
  rankMedalText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEFCE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pointsCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 4,
  },
});
