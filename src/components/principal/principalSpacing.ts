// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Workspace Spacing Tokens
// Source of Truth: Student Dashboard visual spacing system
// Provides consistent spacing scales, horizontal screen grid,
// two-tier section rhythm, and safe bottom navigation insets.
// ─────────────────────────────────────────────────────────────

import { Platform } from 'react-native';

export const PRINCIPAL_SPACING = {
  // ── Core Spacing Scale ──
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // ── Screen Alignment Grid (Student Dashboard Reference) ──
  screenHorizontal: 16,
  screenTop: 12,

  // ── Section Spacing System ──
  // Major between-sections gap (Hero -> Section, Section -> Section)
  betweenSections: 20,
  headerToHeroGap: 16,
  heroToNextGap: 20,

  // Section internal gap (Section title -> content/cards)
  titleToContent: 12,

  // ── Cards & List Rhythm ──
  cardPadding: 16,
  cardPaddingCompact: 12,
  cardRadius: 20,
  cardRadiusCompact: 16,
  cardGap: 12,
  horizontalCardGap: 12,
  rowPaddingVertical: 10,
  dividerMarginVertical: 6,

  // ── Bottom Navigation Clearance ──
  // Floating PrincipalBottomTab is ~56px height + paddingBottom (12px Android / 24px iOS) = 68px/80px
  // Plus comfortable breathing space (18-20px) = 90px on Android, 102px on iOS
  bottomNavClearance: Platform.OS === 'ios' ? 102 : 90,
} as const;

export default PRINCIPAL_SPACING;
