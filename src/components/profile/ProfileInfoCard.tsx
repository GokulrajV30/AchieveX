// ─────────────────────────────────────────────────────────────
// AchieveX — Student Profile Information Card Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ProfileInfoCardProps {
  iconName: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
  label: string;
  value: string;
  onPress?: () => void;
  isAction?: boolean;
}

export default function ProfileInfoCard({
  iconName,
  iconFamily = 'Ionicons',
  label,
  value,
  onPress,
  isAction = false,
}: ProfileInfoCardProps) {
  const ContainerComponent = isAction ? TouchableOpacity : View;

  return (
    <ContainerComponent
      style={styles.card}
      activeOpacity={isAction ? 0.75 : 1}
      onPress={onPress}
    >
      {/* Soft Gray Icon Circle */}
      <View style={styles.iconCircle}>
        {iconFamily === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={iconName as any} size={22} color="#475569" />
        ) : (
          <Ionicons name={iconName as any} size={20} color="#475569" />
        )}
      </View>

      {/* Label and Value Text */}
      <View style={styles.textContainer}>
        <Text style={styles.labelText}>{label}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>

      {/* Right chevron if action */}
      {isAction && (
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" style={styles.chevron} />
      )}
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  valueText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
});
