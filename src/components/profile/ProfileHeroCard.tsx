// ─────────────────────────────────────────────────────────────
// AchieveX — Student Profile Hero Card Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StudentProfile, StudentStats } from '../../data/studentProfileData';

interface ProfileHeroCardProps {
  profile: StudentProfile;
  stats: StudentStats;
  onPressCamera: () => void;
}

export default function ProfileHeroCard({
  profile,
  stats,
  onPressCamera,
}: ProfileHeroCardProps) {
  // Extract clean department prefix for subtitle (e.g., 'CSE(IoT)' -> 'CSE')
  const deptPrefix = profile.department.split('(')[0].trim() || profile.department;

  return (
    <LinearGradient
      colors={['#2563EB', '#4338CA', '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      {/* Centered Avatar Area */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
            ) : (
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                }}
                style={styles.avatarImage}
              />
            )}
          </View>

          {/* Small Overlapping Camera Icon Button */}
          <TouchableOpacity
            style={styles.cameraBadge}
            activeOpacity={0.8}
            onPress={onPressCamera}
          >
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Student Name */}
      <Text style={styles.studentName}>{profile.fullName}</Text>

      {/* Department & Study Year */}
      <Text style={styles.studentMeta}>
        {deptPrefix} • {profile.currentYear}
      </Text>

      {/* Embedded White Statistics Card */}
      <View style={styles.statsCard}>
        {/* Stat 1: Achievements */}
        <View style={styles.statCol}>
          <Ionicons name="trophy" size={22} color="#2563EB" />
          <Text style={styles.statNumber}>{stats.achievements}</Text>
          <Text style={styles.statTitle}>Achievements</Text>
        </View>

        {/* Divider */}
        <View style={styles.statDivider} />

        {/* Stat 2: Points */}
        <View style={styles.statCol}>
          <MaterialCommunityIcons name="star-circle" size={24} color="#2563EB" />
          <Text style={styles.statNumber}>{stats.points}</Text>
          <Text style={styles.statTitle}>Points</Text>
        </View>

        {/* Divider */}
        <View style={styles.statDivider} />

        {/* Stat 3: Approved */}
        <View style={styles.statCol}>
          <MaterialCommunityIcons name="text-box-check" size={22} color="#2563EB" />
          <Text style={styles.statNumber}>{stats.approved}</Text>
          <Text style={styles.statTitle}>Approved</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    width: 92,
    height: 92,
  },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  studentName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  studentMeta: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#E0E7FF',
    marginTop: 2,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  statTitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#F1F5F9',
  },
});
