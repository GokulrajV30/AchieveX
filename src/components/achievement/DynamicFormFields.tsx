// ─────────────────────────────────────────────────────────────
// AchieveX — Dynamic Form Fields (Step 2)
// Category-specific form fields with type-dependent options,
// conditional visibility, and "Other" custom input handling
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  getFieldsForType,
  type FieldDef,
  getCategoryById,
  getTypeById,
} from '../../data/achievementConfig';
import {
  FormTextInput,
  FormDatePicker,
  FormDropdown,
  FormToggle,
  SectionCard,
} from './FormComponents';

interface DynamicFormFieldsProps {
  categoryId: string;
  typeId: string;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldChange: (fieldId: string, value: any) => void;
}

export default function DynamicFormFields({
  categoryId,
  typeId,
  formData,
  errors,
  onFieldChange,
}: DynamicFormFieldsProps) {
  const category = getCategoryById(categoryId);
  const type = getTypeById(categoryId, typeId);
  const fields = getFieldsForType(categoryId, typeId);

  // Resolve options for a field — optionsByType[typeId] takes priority over static options
  const resolveOptions = (field: FieldDef): string[] => {
    if (field.optionsByType && field.optionsByType[typeId]) {
      return field.optionsByType[typeId];
    }
    return field.options || [];
  };

  // Render a single field definition based on its kind
  const renderField = (field: FieldDef) => {
    // Check conditional visibility (showWhen) based on another field's value
    if (field.showWhen) {
      const parentValue = formData[field.showWhen.fieldId];
      const matchValues = Array.isArray(field.showWhen.value)
        ? field.showWhen.value
        : [field.showWhen.value];
      if (!matchValues.includes(parentValue)) {
        return null;
      }
    }

    const value = formData[field.id] || '';
    const error = errors[field.id];

    let fieldElement = null;

    switch (field.kind) {
      case 'text':
        fieldElement = (
          <FormTextInput
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(v) => onFieldChange(field.id, v)}
            required={field.required}
            error={error}
            maxLength={field.maxLength}
            prefix={field.prefix}
          />
        );
        break;
      case 'textarea':
        fieldElement = (
          <FormTextInput
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(v) => onFieldChange(field.id, v)}
            required={field.required}
            error={error}
            multiline
            maxLength={field.maxLength}
          />
        );
        break;
      case 'number':
        fieldElement = (
          <FormTextInput
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(v) => onFieldChange(field.id, v)}
            required={field.required}
            error={error}
            keyboardType="numeric"
            prefix={field.prefix}
          />
        );
        break;
      case 'url':
        fieldElement = (
          <FormTextInput
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(v) => onFieldChange(field.id, v)}
            required={field.required}
            error={error}
            keyboardType="url"
          />
        );
        break;
      case 'date':
        fieldElement = (
          <FormDatePicker
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(v) => onFieldChange(field.id, v)}
            required={field.required}
            error={error}
          />
        );
        break;
      case 'dropdown':
      case 'searchable-dropdown': {
        const options = resolveOptions(field);
        const displayDropdownValue =
          field.id === 'semester' && typeof value === 'number'
            ? `Semester ${value}`
            : value;

        fieldElement = (
          <FormDropdown
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={displayDropdownValue}
            options={options}
            onSelect={(v) => {
              if (field.id === 'semester') {
                const parsed = parseInt(v.replace(/\D/g, ''), 10);
                onFieldChange(field.id, isNaN(parsed) ? v : parsed);
              } else {
                onFieldChange(field.id, v);
              }
            }}
            required={field.required}
            error={error}
            searchable={field.kind === 'searchable-dropdown'}
          />
        );
        break;
      }
      case 'toggle': {
        const toggleOptions = (field.options || []).map((opt) => ({
          id: opt,
          label: opt,
        }));
        fieldElement = (
          <FormToggle
            key={field.id}
            label={field.label}
            value={value}
            options={toggleOptions}
            onSelect={(v) => onFieldChange(field.id, v)}
            required={field.required}
          />
        );
        break;
      }
      default:
        fieldElement = null;
    }

    // "Other" custom text input — shown when dropdown value is "Other"
    const showCustomInput =
      value === 'Other' &&
      (field.kind === 'dropdown' || field.kind === 'searchable-dropdown');
    const customValue = formData[`custom_${field.id}`] || '';
    const customError = errors[`custom_${field.id}`];

    return (
      <View key={field.id} style={styles.fieldWrap}>
        {fieldElement}
        {showCustomInput && (
          <View style={styles.customFieldContainer}>
            <FormTextInput
              label={field.otherLabel || `Enter Custom ${field.label}`}
              placeholder={field.otherPlaceholder || `Enter custom ${field.label.toLowerCase()}`}
              value={customValue}
              onChangeText={(v) => onFieldChange(`custom_${field.id}`, v)}
              required
              error={customError}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>{category?.title} Details</Text>
        <Text style={styles.pageSubtitle}>
          Enter specific details for your {type?.label} achievement.
        </Text>
      </View>

      <SectionCard title="Achievement Info">
        {fields.map(renderField)}
      </SectionCard>
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
  fieldWrap: {
    marginBottom: 4,
  },
  customFieldContainer: {
    marginTop: -8,
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
  },
});
