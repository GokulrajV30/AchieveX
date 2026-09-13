// ─────────────────────────────────────────────────────────────
// AchieveX — Achievement Type Selector (Step 1b)
// Dynamically shows types for the selected category
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getCategoryById, type AchievementTypeDef } from '../../data/achievementConfig';
import { InfoBanner, FormTextInput } from './FormComponents';

interface AchievementTypeSelectorProps {
  categoryId: string;
  selectedTypeId: string;
  onSelectType: (id: string) => void;
  customTypeValue?: string;
  onCustomTypeChange?: (v: string) => void;
  error?: string;
  onAcademicCreditDetected?: () => void;
}

export default function AchievementTypeSelector({
  categoryId,
  selectedTypeId,
  onSelectType,
  customTypeValue,
  onCustomTypeChange,
  error,
  onAcademicCreditDetected,
}: AchievementTypeSelectorProps) {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const handleSelect = (type: AchievementTypeDef) => {
    onSelectType(type.id);
  };

  return (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>Select Achievement Type</Text>
        <Text style={styles.pageSubtitle}>
          Choose the type that best describes your{' '}
          <Text style={styles.categoryHighlight}>{category.title}</Text> achievement.
        </Text>
      </View>

      {category.types.map((type) => {
        const isSelected = selectedTypeId === type.id;

        return (
          <TouchableOpacity
            key={type.id}
            style={[styles.typeCard, isSelected && styles.typeCardSelected]}
            activeOpacity={0.7}
            onPress={() => handleSelect(type)}
          >
            <View style={styles.typeRow}>
              <View style={[styles.iconDot, isSelected && styles.iconDotSelected]}>
                {isSelected ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <View style={styles.iconDotInner} />
                )}
              </View>
              <View style={styles.typeTextWrap}>
                <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                  {type.label}
                </Text>
              </View>
              {type.scoring && (
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>
                    {type.scoring.basePoints} pts
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {selectedTypeId === 'other' && (
        <View style={{ marginTop: 16 }}>
          <FormTextInput
            label="Enter Achievement Type"
            placeholder="e.g. Technical Symposium"
            value={customTypeValue || ''}
            onChangeText={onCustomTypeChange || (() => {})}
            required
            error={error}
          />
        </View>
      )}
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
  categoryHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 8,
  },
  typeCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#FAFBFF',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconDotSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  iconDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  typeTextWrap: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  typeLabelSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  academicTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    marginTop: 2,
  },
  pointsBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
});
