// ─────────────────────────────────────────────────────────────
// AchieveX — Profile Section Header Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ProfileSectionHeaderProps {
  title: string;
  iconName: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
}

export default function ProfileSectionHeader({
  title,
  iconName,
  iconFamily = 'Ionicons',
}: ProfileSectionHeaderProps) {
  return (
    <View style={styles.headerRow}>
      {iconFamily === 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons name={iconName as any} size={20} color="#334155" />
      ) : (
        <Ionicons name={iconName as any} size={18} color="#334155" />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 8,
    letterSpacing: -0.1,
  },
});
