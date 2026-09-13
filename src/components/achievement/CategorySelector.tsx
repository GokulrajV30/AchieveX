// ─────────────────────────────────────────────────────────────
// AchieveX — Category Selector (Step 1a)
// Beautiful selectable category cards with icons and type chips
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CATEGORIES, type CategoryDef } from '../../data/achievementConfig';
import { ChipGroup, SectionCard } from './FormComponents';

interface CategorySelectorProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function CategorySelector({ selectedCategoryId, onSelectCategory }: CategorySelectorProps) {
  return (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>What are you adding today?</Text>
        <Text style={styles.pageSubtitle}>Choose the category that best describes your achievement.</Text>
      </View>

      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const typeLabels = cat.types.map((t) => t.label);

        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            activeOpacity={0.7}
            onPress={() => onSelectCategory(cat.id)}
          >
            <View style={styles.cardHeader}>
              {/* Icon */}
              <View style={[styles.iconCircle, { backgroundColor: cat.iconBg }]}>
                <Ionicons name={cat.iconName as any} size={22} color={cat.iconColor} />
              </View>

              {/* Text */}
              <View style={styles.cardTextWrap}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {cat.title}
                </Text>
                <Text style={styles.cardDesc}>{cat.description}</Text>
              </View>

              {/* Selection indicator */}
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </View>

            {/* Type chips */}
            <ChipGroup items={typeLabels} maxVisible={4} />

            {/* Type count */}
            <Text style={styles.typeCount}>
              {typeLabels.length} achievement type{typeLabels.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#FAFBFF',
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 3,
  },
  cardTitleSelected: {
    color: '#1D4ED8',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  radioSelected: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  typeCount: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 8,
  },
});
