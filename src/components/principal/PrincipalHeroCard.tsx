// ─────────────────────────────────────────────────────────────
// AchieveX — Shared Principal Hero Card Component
// Source of Truth: AchieveX Brand Design Language (Student/Dean Alignment)
// Blue → Indigo gradient, clean typography hierarchy, two-column balance,
// no black/gold luxury clutter, no duplicate metrics.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PRINCIPAL_SPACING } from './principalSpacing';

export interface PrincipalSecondaryMetric {
  number: string | number;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export interface PrincipalHeroCardProps {
  overline?: string;
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badgeText?: string;
  primaryNumber: string | number;
  primaryLabel: string;
  secondaryTitle?: string;
  secondaryMetrics?: PrincipalSecondaryMetric[];
  ctaText?: string;
  onCtaPress?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PrincipalHeroCard({
  overline = 'COLLEGE OVERVIEW',
  title,
  subtitle,
  icon = 'shield-checkmark',
  primaryNumber,
  primaryLabel,
  secondaryTitle,
  secondaryMetrics = [],
  ctaText,
  onCtaPress,
  compact = false,
  style,
}: PrincipalHeroCardProps) {
  const isTextValue = typeof primaryNumber === 'string' && primaryNumber.length > 5;
  const hasSecondary = secondaryMetrics && secondaryMetrics.length > 0;

  return (
    <LinearGradient
      colors={['#1D4ED8', '#2563EB', '#4338CA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, compact && styles.heroCardCompact, style]}
    >
      {/* Top Eyebrow Row */}
      {overline ? (
        <View style={styles.eyebrowRow}>
          {icon ? (
            <View style={styles.iconCircle}>
              <Ionicons name={icon} size={11} color="#FFFFFF" />
            </View>
          ) : null}
          <Text style={styles.eyebrowText}>{overline.toUpperCase()}</Text>
        </View>
      ) : null}

      {/* Two-Column Content Row: Primary Left + Supporting Right */}
      <View style={styles.contentRow}>
        {/* Left Column (60–65% Dominant) */}
        <View style={[styles.leftColumn, !hasSecondary && styles.leftColumnFull]}>
          {/* Dominant Metric Value */}
          <Text
            style={[
              styles.primaryNumber,
              compact && styles.primaryNumberCompact,
              isTextValue && styles.primaryNumberLong,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {primaryNumber}
          </Text>

          {/* Primary Supporting Label */}
          <Text
            style={[styles.primaryLabel, compact && styles.primaryLabelCompact]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {primaryLabel}
          </Text>

          {/* Supporting Context / Subtitle */}
          {subtitle || title ? (
            <Text
              style={[styles.subtitleText, compact && styles.subtitleTextCompact]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle || title}
            </Text>
          ) : null}

          {/* Compact Student-Matched CTA Button */}
          {ctaText && onCtaPress ? (
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={onCtaPress}
            >
              <Text style={styles.ctaButtonText}>{ctaText}</Text>
              <Ionicons name="arrow-forward" size={12} color="#2563EB" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Right Column: Secondary Summary (35–40% Purposeful Support) */}
        {hasSecondary ? (
          <>
            <View style={styles.verticalDivider} />
            <View style={styles.rightColumn}>
              {secondaryTitle ? (
                <Text style={styles.secondaryTitle} numberOfLines={1}>
                  {secondaryTitle.toUpperCase()}
                </Text>
              ) : null}

              <View style={styles.secondaryItemsList}>
                {secondaryMetrics.map((m, idx) => (
                  <View key={idx} style={styles.secondaryRow}>
                    {m.icon ? (
                      <Ionicons
                        name={m.icon}
                        size={12}
                        color={m.iconColor || '#86EFAC'}
                        style={styles.secondaryRowIcon}
                      />
                    ) : null}
                    <Text style={styles.secondaryNumber} numberOfLines={1}>
                      {typeof m.number === 'number' && m.number < 10 && m.number >= 0
                        ? String(m.number).padStart(2, '0')
                        : m.number}
                    </Text>
                    <Text style={styles.secondaryLabel} numberOfLines={1} ellipsizeMode="tail">
                      {m.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginHorizontal: PRINCIPAL_SPACING.screenHorizontal,
    borderRadius: 24, // Matching Student/Dean Hero Card radius
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: PRINCIPAL_SPACING.betweenSections,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  heroCardCompact: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: PRINCIPAL_SPACING.titleToContent,
  },

  /* Eyebrow Row */
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  eyebrowText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.88)',
    letterSpacing: 0.8,
  },

  /* Two-Column Content */
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    marginRight: 6,
  },
  leftColumnFull: {
    marginRight: 0,
  },

  /* Dominant Metric */
  primaryNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  primaryNumberCompact: {
    fontSize: 26,
    lineHeight: 28,
  },
  primaryNumberLong: {
    fontSize: 24,
    lineHeight: 28,
  },

  /* Primary Supporting Label */
  primaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  primaryLabelCompact: {
    fontSize: 13.5,
    marginTop: 1,
    lineHeight: 16,
  },

  /* Context Subtitle */
  subtitleText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.80)',
    marginTop: 2,
    lineHeight: 16,
  },
  subtitleTextCompact: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 14,
  },

  /* CTA Button */
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 13,
    alignSelf: 'flex-start',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Vertical Divider */
  verticalDivider: {
    width: 1,
    height: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 10,
    alignSelf: 'center',
  },

  /* Right Column */
  rightColumn: {
    justifyContent: 'center',
    minWidth: 104,
    maxWidth: 126,
  },
  secondaryTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.70)',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  secondaryItemsList: {
    gap: 6,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryRowIcon: {
    marginRight: 5,
  },
  secondaryNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 4,
    minWidth: 16,
  },
  secondaryLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
    flexShrink: 1,
  },
});
