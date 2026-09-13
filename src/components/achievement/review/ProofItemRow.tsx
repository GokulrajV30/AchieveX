// ─────────────────────────────────────────────────────────────
// AchieveX — Proof Item Row Component for Review
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ProofItemRowProps {
  label: string;
  fileName: string;
  fileType?: 'pdf' | 'image';
  size?: string;
  onPress?: () => void;
}

export default function ProofItemRow({
  label,
  fileName,
  fileType = 'pdf',
  size,
  onPress,
}: ProofItemRowProps) {
  const isPdf =
    fileType === 'pdf' ||
    fileName.toLowerCase().endsWith('.pdf') ||
    label.toLowerCase().includes('certificate') ||
    label.toLowerCase().includes('letter') ||
    label.toLowerCase().includes('proof') ||
    label.toLowerCase().includes('document');

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* File Icon */}
      <View style={[styles.iconWrapper, isPdf ? styles.iconPdf : styles.iconImg]}>
        {isPdf ? (
          <MaterialCommunityIcons name="file-pdf-box" size={24} color="#DC2626" />
        ) : (
          <MaterialCommunityIcons name="file-image-outline" size={22} color="#2563EB" />
        )}
      </View>

      {/* Label and Filename */}
      <View style={styles.textColumn}>
        <Text style={styles.labelText} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.fileNameText} numberOfLines={1} ellipsizeMode="middle">
          {fileName}
          {size ? ` • ${size}` : ''}
        </Text>
      </View>

      {/* Right Action Chevron */}
      <View style={styles.actionRight}>
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconPdf: {
    backgroundColor: '#FEF2F2',
  },
  iconImg: {
    backgroundColor: '#EFF6FF',
  },
  textColumn: {
    flex: 1,
    paddingRight: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  fileNameText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  actionRight: {
    paddingLeft: 4,
  },
});
