// ─────────────────────────────────────────────────────────────
// AchieveX — Goal Filter Bottom Sheet Component
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CATEGORY_GOAL_CONFIGS } from '../../data/goalsData';

interface GoalFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedPriority: string;
  onSelectPriority: (pri: string) => void;
  selectedSort: 'Deadline' | 'Priority' | 'Progress';
  onSelectSort: (sort: 'Deadline' | 'Priority' | 'Progress') => void;
  onReset: () => void;
  onApply: () => void;
}

export default function GoalFilterSheet({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  selectedSort,
  onSelectSort,
  onReset,
  onApply,
}: GoalFilterSheetProps) {
  const categories = [
    'All Categories',
    ...CATEGORY_GOAL_CONFIGS.map((c) => c.categoryTitle),
  ];

  const priorities = ['All', 'High', 'Medium', 'Low'];
  const sortOptions: ('Deadline' | 'Priority' | 'Progress')[] = [
    'Deadline',
    'Priority',
    'Progress',
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          {/* Grabber */}
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>Filter & Sort Goals</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {/* 1. Category Filter */}
            <Text style={styles.sectionHeading}>Category</Text>
            <View style={styles.chipWrap}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    activeOpacity={0.75}
                    onPress={() => onSelectCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Priority Filter */}
            <Text style={[styles.sectionHeading, { marginTop: 16 }]}>Priority</Text>
            <View style={styles.segmentedRow}>
              {priorities.map((pri) => {
                const isSelected = selectedPriority === pri;
                return (
                  <TouchableOpacity
                    key={pri}
                    style={[
                      styles.segmentBtn,
                      isSelected && styles.segmentBtnActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => onSelectPriority(pri)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.segmentTextActive,
                      ]}
                    >
                      {pri}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Sort Options */}
            <Text style={[styles.sectionHeading, { marginTop: 16 }]}>Sort By</Text>
            <View style={styles.segmentedRow}>
              {sortOptions.map((opt) => {
                const isSelected = selectedSort === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.segmentBtn,
                      isSelected && styles.segmentBtnActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => onSelectSort(opt)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.segmentTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.resetBtn}
              activeOpacity={0.75}
              onPress={onReset}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              activeOpacity={0.85}
              onPress={() => {
                onApply();
                onClose();
              }}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  bodyScroll: {
    maxHeight: 360,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
