// ─────────────────────────────────────────────────────────────
// AchieveX — Role Selection Card Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RoleConfig } from '../../data/roles';

interface RoleCardProps {
  role: RoleConfig;
  selected: boolean;
  onSelect: () => void;
}

export default function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.75}
      onPress={onSelect}
    >
      {/* Top-Right Selection Radio Indicator */}
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>

      {/* Role Icon Inside Colored Circle */}
      <View style={[styles.iconCircle, { backgroundColor: role.iconBg }]}>
        {role.iconFamily === 'Ionicons' ? (
          <Ionicons name={role.iconName as any} size={26} color={role.iconColor} />
        ) : (
          <MaterialCommunityIcons name={role.iconName as any} size={28} color={role.iconColor} />
        )}
      </View>

      {/* Role Title */}
      <Text style={[styles.roleTitle, selected && styles.roleTitleSelected]}>
        {role.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#6D28D9',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6D28D9',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  radioOuter: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioOuterSelected: {
    borderColor: '#6D28D9',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6D28D9',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  roleTitleSelected: {
    color: '#111827',
    fontWeight: '800',
  },
});
