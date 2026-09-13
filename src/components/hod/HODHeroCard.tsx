// ─────────────────────────────────────────────────────────────
// AchieveX — Standardized HOD Hero Card Component
// Exact visual match to Student AchievementJourneyHeroCard:
// Gradient background (#1D4ED8 -> #2563EB -> #4338CA), Icon badge,
// Title, Subtitle, Metric Number & Label, CTA pill button,
// Vertical divider, and Donut Gauge with Progress Arc.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G } from 'react-native-svg';

export interface HODHeroCardProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  primaryNumber: string | number;
  primaryLabel: string;
  primarySubtext?: string;
  gaugePercent?: number; // 0 to 100
  gaugeNumber?: string | number;
  gaugeLabel?: string;
  gaugeSubtext?: string;
  ctaText?: string;
  onCtaPress?: () => void;
  size?: 'large' | 'medium';
}

export default function HODHeroCard({
  title,
  subtitle = 'CSE (IoT)',
  icon = 'business',
  primaryNumber,
  primaryLabel,
  primarySubtext,
  gaugePercent = 85,
  gaugeNumber = '85%',
  gaugeLabel = 'Achievers',
  gaugeSubtext = 'Rate',
  ctaText,
  onCtaPress,
  size = 'large',
}: HODHeroCardProps) {
  const isMedium = size === 'medium';
  const gaugeSize = isMedium ? 72 : 136;
  const strokeWidth = isMedium ? 10 : 20;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(100, Math.max(0, gaugePercent));

  return (
    <LinearGradient
      colors={['#1D4ED8', '#2563EB', '#4338CA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.heroCard,
        isMedium && styles.heroCardMedium,
      ]}
    >
      {/* Top Row: Icon Badge + Category Title + Subtitle */}
      <View style={[styles.topRow, isMedium && styles.topRowMedium]}>
        <View style={[styles.badgeCircle, isMedium && styles.badgeCircleMedium]}>
          <Ionicons name={icon} size={isMedium ? 15 : 20} color="#FFFFFF" />
        </View>
        <View style={styles.titleColumn}>
          <Text style={[styles.heroTitle, isMedium && styles.heroTitleMedium]}>{title}</Text>
          <Text style={[styles.heroSubtitle, isMedium && styles.heroSubtitleMedium]}>{subtitle}</Text>
        </View>
      </View>

      {/* Main Content: Left Column (Metrics + CTA), Divider, Right Donut Gauge */}
      <View style={[styles.contentRow, isMedium && styles.contentRowMedium]}>
        {/* Left Column: Number, Label, Subtext, CTA */}
        <View style={styles.leftColumn}>
          <View style={[styles.primaryMetricWrapper, isMedium && styles.primaryMetricWrapperMedium]}>
            <Text style={[styles.primaryNumber, isMedium && styles.primaryNumberMedium]}>
              {primaryNumber}
            </Text>
            <Text style={[styles.primaryLabel, isMedium && styles.primaryLabelMedium]}>
              {primaryLabel}
            </Text>
            {primarySubtext ? (
              <Text style={[styles.primarySubtext, isMedium && styles.primarySubtextMedium]}>
                {primarySubtext}
              </Text>
            ) : null}
          </View>

          {ctaText && onCtaPress ? (
            <TouchableOpacity
              style={[styles.ctaButton, isMedium && styles.ctaButtonMedium]}
              activeOpacity={0.85}
              onPress={onCtaPress}
            >
              <Text style={[styles.ctaButtonText, isMedium && styles.ctaButtonTextMedium]}>
                {ctaText}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={isMedium ? 11 : 14}
                color="#2563EB"
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Vertical Divider */}
        <View style={[styles.verticalDivider, isMedium && styles.verticalDividerMedium]} />

        {/* Right Column: Donut Gauge */}
        <View style={styles.rightGaugeColumn}>
          <View
            style={[
              styles.svgContainer,
              isMedium && { width: gaugeSize, height: gaugeSize },
            ]}
          >
            <Svg width={gaugeSize} height={gaugeSize} viewBox={`0 0 ${gaugeSize} ${gaugeSize}`}>
              <G rotation="-90" origin={`${gaugeSize / 2}, ${gaugeSize / 2}`}>
                {/* Background Ring */}
                <Circle
                  cx={gaugeSize / 2}
                  cy={gaugeSize / 2}
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Highlight Progress Arc */}
                <Circle
                  cx={gaugeSize / 2}
                  cy={gaugeSize / 2}
                  r={radius}
                  stroke="#FDE047"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - safePercent / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            </Svg>

            {/* Inner Center Text */}
            <View
              style={[
                styles.gaugeCenterTextWrapper,
                isMedium && styles.gaugeCenterTextWrapperMedium,
              ]}
            >
              <Text style={[styles.gaugeNumberText, isMedium && styles.gaugeNumberTextMedium]}>
                {gaugeNumber}
              </Text>
              {gaugeLabel ? (
                <Text style={[styles.gaugeLabelText, isMedium && styles.gaugeLabelTextMedium]}>
                  {gaugeLabel}
                </Text>
              ) : null}
              {gaugeSubtext && !isMedium ? (
                <Text style={styles.gaugeSubText}>{gaugeSubtext}</Text>
              ) : null}
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
  badgeCircle: {
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
    flex: 1,
  },
  heroTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
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
  primaryMetricWrapper: {
    marginBottom: 10,
  },
  primaryNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  primarySubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ctaButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  rightGaugeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeCenterTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  gaugeNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  gaugeLabelText: {
    fontSize: 10,
    color: '#FDE047',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  gaugeSubText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 1,
  },

  /* Medium Size Variants */
  heroCardMedium: {
    height: 128,
    padding: 12,
    marginBottom: 12,
    borderRadius: 18,
    elevation: 4,
    shadowRadius: 8,
  },
  topRowMedium: {
    marginBottom: 6,
  },
  badgeCircleMedium: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  heroTitleMedium: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  heroSubtitleMedium: {
    fontSize: 12,
    marginTop: 1,
  },
  contentRowMedium: {
    minHeight: 62,
  },
  primaryMetricWrapperMedium: {
    marginBottom: 4,
  },
  primaryNumberMedium: {
    fontSize: 24,
    lineHeight: 27,
  },
  primaryLabelMedium: {
    fontSize: 11,
    marginTop: 1,
  },
  primarySubtextMedium: {
    fontSize: 9.5,
  },
  ctaButtonMedium: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 2,
  },
  ctaButtonTextMedium: {
    fontSize: 10,
  },
  verticalDividerMedium: {
    height: '70%',
    marginHorizontal: 8,
  },
  gaugeCenterTextWrapperMedium: {
    width: 48,
    height: 48,
  },
  gaugeNumberTextMedium: {
    fontSize: 13,
  },
  gaugeLabelTextMedium: {
    fontSize: 8.5,
    marginTop: 1,
  },
});
