// ─────────────────────────────────────────────────────────────
// AchieveX — Dean Hero Card Component (v4 — Premium Clean)
// Source of Truth: Student Dashboard Hero Design Language
// Single strong primary message, clean typography hierarchy,
// no duplicate metrics, no artificial circular widgets.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DEAN_SPACING } from './deanSpacing';

export interface DeanHeroSecondaryItem {
  icon: keyof typeof Ionicons.glyphMap;
  count: string | number;
  label: string;
  iconColor?: string;
}

export interface DeanHeroCardProps {
  /** L1: Small uppercase eyebrow (e.g. "HOD VERIFICATION") */
  eyebrow?: string;
  /** L2: Dominant number or short text — the strongest visual element */
  value: string | number;
  /** L3: Primary supporting label (e.g. "Pending Reviews") */
  label: string;
  /** L4: One line of supporting context */
  context?: string;
  /** L5: CTA button text (e.g. "Review Now") */
  ctaText?: string;
  /** CTA press handler */
  onCtaPress?: () => void;
  /** Small icon inside subtle frosted circle in eyebrow */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Compact mode for sub-screens (queue, history) */
  compact?: boolean;
  /** Optional container style override */
  style?: StyleProp<ViewStyle>;

  /** Right-side compact verification summary */
  secondaryTitle?: string;
  secondaryItems?: DeanHeroSecondaryItem[];

  // Kept for backward compatibility with existing call sites (safely ignored)
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightVisualLabel?: string;
  rightVisualCount?: string | number;
}

export default function DeanHeroCard({
  eyebrow,
  value,
  label,
  context,
  ctaText,
  onCtaPress,
  icon = 'shield-checkmark',
  compact = false,
  style,
  secondaryTitle,
  secondaryItems,
}: DeanHeroCardProps) {
  const isTextValue = typeof value === 'string' && value.length > 3;
  const hasSecondary = secondaryItems && secondaryItems.length > 0;

  return (
    <LinearGradient
      colors={['#1D4ED8', '#2563EB', '#4338CA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, compact && styles.heroCardCompact, style]}
    >
      {/* Top Eyebrow Row */}
      {eyebrow ? (
        <View style={styles.eyebrowRow}>
          {icon ? (
            <View style={styles.iconCircle}>
              <Ionicons name={icon} size={11} color="#FFFFFF" />
            </View>
          ) : null}
          <Text style={styles.eyebrowText}>{eyebrow.toUpperCase()}</Text>
        </View>
      ) : null}

      {/* Two-Column Content Row: Left Primary Info + Right Secondary Summary */}
      <View style={styles.contentRow}>
        {/* Left Column (60–65% Dominant) */}
        <View style={[styles.leftColumn, !hasSecondary && styles.leftColumnFull]}>
          {/* L2: Dominant Metric Value */}
          <Text
            style={[
              styles.valueText,
              compact && styles.valueTextCompact,
              isTextValue && styles.valueTextLong,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {value}
          </Text>

          {/* L3: Primary Supporting Label */}
          <Text
            style={[styles.labelText, compact && styles.labelTextCompact]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>

          {/* L4: Supporting Context */}
          {context ? (
            <Text
              style={[styles.contextText, compact && styles.contextTextCompact]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {context}
            </Text>
          ) : null}

          {/* L5: Compact Content-Based CTA Button */}
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

        {/* Right Column: Secondary Verification Summary (35–40% Purposeful Support) */}
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
                {secondaryItems.map((item, index) => (
                  <View key={index} style={styles.secondaryRow}>
                    <Ionicons
                      name={item.icon}
                      size={12}
                      color={item.iconColor || '#86EFAC'}
                      style={styles.secondaryRowIcon}
                    />
                    <Text style={styles.secondaryCount}>
                      {typeof item.count === 'number'
                        ? String(item.count).padStart(2, '0')
                        : item.count}
                    </Text>
                    <Text
                      style={styles.secondaryLabel}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.label}
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
    borderRadius: 24, // Matching Student Hero Card radius
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: DEAN_SPACING.betweenSections,
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
    marginBottom: DEAN_SPACING.titleToContent,
  },

  /* L1: Eyebrow Row — Subtle, contextual */
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

  /* L2: Dominant Metric — Connected information group */
  valueText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  valueTextCompact: {
    fontSize: 26,
    lineHeight: 28,
  },
  valueTextLong: {
    fontSize: 22,
    lineHeight: 26,
  },

  /* L3: Primary Supporting Label */
  labelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  labelTextCompact: {
    fontSize: 13.5,
    marginTop: 1,
    lineHeight: 16,
  },

  /* L4: Supporting Context */
  contextText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.80)',
    marginTop: 2,
    lineHeight: 16,
  },
  contextTextCompact: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 14,
  },

  /* L5: Compact Content-Based CTA Button */
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

  /* Two-Column Layout */
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
  verticalDivider: {
    width: 1,
    height: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  rightColumn: {
    justifyContent: 'center',
    minWidth: 104,
    maxWidth: 122,
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
  secondaryCount: {
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
