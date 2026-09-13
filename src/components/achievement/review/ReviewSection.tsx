// ─────────────────────────────────────────────────────────────
// AchieveX — Review Section Container Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ReviewSectionProps {
  title: string;
  iconName: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
  badgeCount?: number;
  onEdit?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hideDivider?: boolean;
}

export default function ReviewSection({
  title,
  iconName,
  iconFamily = 'Ionicons',
  badgeCount,
  onEdit,
  children,
  style,
  hideDivider = false,
}: ReviewSectionProps) {
  return (
    <View style={[styles.sectionCard, style]}>
      {/* Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            {iconFamily === 'MaterialCommunityIcons' ? (
              <MaterialCommunityIcons name={iconName as any} size={17} color="#2563EB" />
            ) : (
              <Ionicons name={iconName as any} size={16} color="#2563EB" />
            )}
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {badgeCount !== undefined && badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>

        {onEdit && (
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.7}
            onPress={onEdit}
          >
            <Ionicons name="create-outline" size={13} color="#2563EB" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {!hideDivider && <View style={styles.divider} />}

      {/* Content */}
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  contentContainer: {
    // Child items render inside
  },
});
