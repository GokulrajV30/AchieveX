// ─────────────────────────────────────────────────────────────
// AchieveX — Shared Head Hero Card Component
// Standardized Brand Blue -> Indigo (#1D4ED8 -> #2563EB -> #4338CA)
// Exact visual match to Student side hero cards.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface HeadSecondaryMetric {
  number: string | number;
  label: string;
}

export interface HeadHeroCardProps {
  overline?: string;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badgeText?: string;
  primaryNumber: string | number;
  primaryLabel: string;
  secondaryMetrics?: HeadSecondaryMetric[];
  ctaText?: string;
  onCtaPress?: () => void;
  compact?: boolean;
}

export default function HeadHeroCard({
  overline = 'COLLEGE PERFORMANCE',
  title = 'Nandha Engineering College',
  subtitle,
  icon = 'school',
  badgeText,
  primaryNumber,
  primaryLabel,
  secondaryMetrics = [],
  ctaText,
  onCtaPress,
  compact = false,
}: HeadHeroCardProps) {
  return (
    <LinearGradient
      colors={['#1D4ED8', '#2563EB', '#4338CA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, compact && styles.heroCardCompact]}
    >
      {/* Top Header Row: Icon Badge + Overline & Title + Optional Badge Pill */}
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={18} color="#FFFFFF" />
        </View>

        <View style={styles.titleColumn}>
          {overline ? <Text style={styles.overlineText}>{overline.toUpperCase()}</Text> : null}
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {badgeText ? (
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{badgeText}</Text>
          </View>
        ) : null}
      </View>

      {/* Main Metrics Row */}
      <View style={styles.metricsRow}>
        {/* Primary Metric */}
        <View style={styles.primaryMetricCol}>
          <Text style={styles.primaryNumber} numberOfLines={1}>
            {primaryNumber}
          </Text>
          <Text style={styles.primaryLabel} numberOfLines={1}>
            {primaryLabel}
          </Text>
        </View>

        {/* Secondary Metrics */}
        {secondaryMetrics.length > 0 ? (
          <View style={styles.secondaryMetricsCol}>
            {secondaryMetrics.map((m, idx) => (
              <View key={idx} style={styles.secondaryItem}>
                <View style={styles.secondaryDivider} />
                <View style={styles.secondaryTextGroup}>
                  <Text style={styles.secondaryNumber} numberOfLines={1}>
                    {m.number}
                  </Text>
                  <Text style={styles.secondaryLabel} numberOfLines={1}>
                    {m.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* Optional Bottom CTA */}
      {ctaText && onCtaPress ? (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={onCtaPress}
          >
            <Text style={styles.ctaButtonText}>{ctaText}</Text>
            <Ionicons name="arrow-forward" size={13} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardCompact: {
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  titleColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  overlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A5B4FC',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  subtitleText: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 1,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexShrink: 0,
    marginLeft: 8,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0E7FF',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  primaryMetricCol: {
    flex: 1.2,
  },
  primaryNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  primaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C7D2FE',
    marginTop: 2,
  },
  secondaryMetricsCol: {
    flex: 1.4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  secondaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginRight: 8,
  },
  secondaryTextGroup: {
    alignItems: 'flex-start',
  },
  secondaryNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  secondaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#C7D2FE',
    marginTop: 1,
  },
  bottomRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
