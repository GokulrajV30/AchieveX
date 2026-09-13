// ─────────────────────────────────────────────────────────────
// AchieveX — Achievement Journey Hero Card Component
// Exact visual match to uploaded screenshot:
// Gradient background, Trophy badge, "Your  Achievement Journey",
// "Bronze Level", "120 Points", "View Achievements >" pill button,
// Vertical divider, and Donut Gauge with "80 Points to Gold".
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G } from 'react-native-svg';

interface AchievementJourneyHeroCardProps {
  onViewAchievements?: () => void;
  points?: number;
  level?: string;
  pointsToNextLevel?: number;
  nextLevelName?: string;
  progressPercent?: number; // e.g. 35% for arc
}

export default function AchievementJourneyHeroCard({
  onViewAchievements,
  points = 120,
  level = 'Bronze Level',
  pointsToNextLevel = 80,
  nextLevelName = 'Gold',
  progressPercent = 35,
}: AchievementJourneyHeroCardProps) {
  const size = 136;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2; // (136 - 20) / 2 = 58
  const circumference = 2 * Math.PI * radius;

  return (
    <LinearGradient
      colors={['#1D4ED8', '#2563EB', '#4338CA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      {/* Top Row: Trophy Badge + Journey Title + Level Subtitle */}
      <View style={styles.topRow}>
        <View style={styles.trophyBadgeCircle}>
          <Ionicons name="trophy" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.titleColumn}>
          <Text style={styles.journeyTitle}>Your  Achievement Journey</Text>
          <Text style={styles.levelSubtitle}>{level}</Text>
        </View>
      </View>

      {/* Main Content: Left Points & CTA, Center Divider, Right Donut Gauge */}
      <View style={styles.contentRow}>
        {/* Left Column: Points & View Achievements Button */}
        <View style={styles.leftColumn}>
          <View style={styles.pointsWrapper}>
            <Text style={styles.pointsNumber}>{points}</Text>
            <Text style={styles.pointsLabel}>Points</Text>
          </View>

          <TouchableOpacity
            style={styles.viewAchievementsButton}
            activeOpacity={0.85}
            onPress={onViewAchievements}
          >
            <Text style={styles.viewAchievementsButtonText}>View Achievements</Text>
            <Ionicons name="chevron-forward" size={15} color="#2563EB" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Right Column: Donut Gauge */}
        <View style={styles.rightGaugeColumn}>
          <View style={styles.svgContainer}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                {/* Background Ring */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(99, 102, 241, 0.45)"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Gold Progress Arc */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#FDE047"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            </Svg>

            {/* Inner Center Text */}
            <View style={styles.gaugeCenterTextWrapper}>
              <Text style={styles.gaugeNumberText}>{pointsToNextLevel}</Text>
              <Text style={styles.gaugeSubText}>Points to</Text>
              <Text style={styles.gaugeLevelText}>{nextLevelName}</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    maxWidth: 356,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trophyBadgeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  journeyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  levelSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FDE047',
    marginTop: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minHeight: 120,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  pointsWrapper: {
    marginBottom: 12,
  },
  pointsNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  pointsLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 1,
  },
  viewAchievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAchievementsButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  verticalDivider: {
    width: 1,
    height: 78,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 12,
  },
  rightGaugeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'relative',
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNumberText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  gaugeSubText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 13,
  },
  gaugeLevelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FDE047',
    lineHeight: 16,
  },
});
