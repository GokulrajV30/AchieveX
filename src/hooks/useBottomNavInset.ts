import { Platform } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';

/**
 * Standard floating bottom navigation bar height across AchieveX (Student, Faculty, HOD, Dean, Principal).
 * The inner tab bar itself is ~56-60px tall.
 */
export const BASE_BOTTOM_NAV_HEIGHT = 60;
export const BOTTOM_NAV_HEIGHT = BASE_BOTTOM_NAV_HEIGHT;

/**
 * Normal comfortable visual gap between the bottom-most content element and the top edge of the bottom nav.
 */
export const NORMAL_CONTENT_GAP = 20;

/**
 * Calculates the exact bottom padding required for scrollable content containers
 * so that the bottom-most item (e.g. Logout button, Recent Activities, last card)
 * scrolls completely above the floating bottom navigation bar with a comfortable 20px gap.
 *
 * It respects safeAreaInsets.bottom exactly as computed by the bottom navigation bar itself,
 * preventing double-counting while ensuring proper clearance on both iOS (home indicator)
 * and Android (gesture or 3-button navigation).
 */
export function getBottomNavClearance(insetsBottom: number): number {
  const navContainerBottomPadding = Math.max(insetsBottom, Platform.OS === 'ios' ? 14 : 10);
  const totalNavHeight = BASE_BOTTOM_NAV_HEIGHT + navContainerBottomPadding;
  return totalNavHeight + NORMAL_CONTENT_GAP;
}

/**
 * Single source of truth hook providing all bottom navigation dimensions and padding values.
 *
 * @returns {
 *   insets: EdgeInsets,
 *   safeBottom: number,                // Safe area inset at bottom
 *   navContainerBottomPadding: number, // Bottom offset applied to bottom nav container
 *   navHeight: number,                 // Total effective bottom nav height from screen edge
 *   totalNavHeight: number,            // Alias for navHeight
 *   contentBottomPadding: number       // Recommended contentContainerStyle paddingBottom
 * }
 */
export function useBottomNavInset() {
  const insets = useSafeAreaInsets();
  const navContainerBottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);
  const totalNavHeight = BASE_BOTTOM_NAV_HEIGHT + navContainerBottomPadding;
  const contentBottomPadding = totalNavHeight + NORMAL_CONTENT_GAP;

  return {
    insets,
    safeBottom: insets.bottom,
    navContainerBottomPadding,
    navHeight: totalNavHeight,
    totalNavHeight,
    contentBottomPadding,
  };
}

export default useBottomNavInset;
