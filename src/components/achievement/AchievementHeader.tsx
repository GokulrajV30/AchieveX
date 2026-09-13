// ─────────────────────────────────────────────────────────────
// AchieveX — Achievement Header
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AchievementHeaderProps {
  onBack: () => void;
  onSaveDraft: () => void;
  showSaveDraft?: boolean;
}

export default function AchievementHeader({ onBack, onSaveDraft, showSaveDraft = true }: AchievementHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color="#1F2937" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {showSaveDraft && (
        <TouchableOpacity style={styles.draftBtn} onPress={onSaveDraft} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={16} color="#2563EB" />
          <Text style={styles.draftText}>Save Draft</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#F8F5F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  draftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 6,
  },
});
