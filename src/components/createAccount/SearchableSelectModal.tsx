// ─────────────────────────────────────────────────────────────
// AchieveX — Searchable Bottom Sheet Modal Selector
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface SelectOption {
  label: string;
  value: string;
  subtitle?: string;
  group?: string;
  searchKeywords?: string;
}

interface SearchableSelectModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: (string | SelectOption)[];
  selectedValue: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptySearchTitle?: string;
  emptySearchSubtitle?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export default function SearchableSelectModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyTitle = 'No Colleges Found',
  emptySubtitle = 'No colleges are available for this selection.',
  emptySearchTitle = 'No Matching Results',
  emptySearchSubtitle = 'Try another search term.',
  emptyActionLabel,
  onEmptyAction,
}: SearchableSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize options
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }, [options]);

  // Filter options
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim() || !searchable) {
      return normalizedOptions;
    }
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q)) ||
        (opt.group && opt.group.toLowerCase().includes(q)) ||
        (opt.searchKeywords && opt.searchKeywords.toLowerCase().includes(q))
    );
  }, [normalizedOptions, searchQuery, searchable]);

  const handleSelectOption = (val: string) => {
    onSelect(val);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const renderOptionItem = ({ item, index }: { item: SelectOption; index: number }) => {
    const isSelected = selectedValue === item.value || selectedValue === item.label;
    const showGroupHeader =
      !!item.group &&
      (!searchQuery.trim() || true) &&
      (index === 0 || filteredOptions[index - 1]?.group !== item.group);

    return (
      <View>
        {showGroupHeader && (
          <View style={styles.groupHeaderContainer}>
            <Text style={styles.groupHeaderText}>{item.group}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.optionRow, isSelected && styles.optionRowSelected]}
          activeOpacity={0.7}
          onPress={() => handleSelectOption(item.value)}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={[
                styles.optionLabel,
                isSelected && styles.optionLabelSelected,
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
            {!!item.subtitle && (
              <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
            )}
          </View>

          {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color="#6D28D9" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={34} color="#94A3B8" />
      {searchQuery.trim().length > 0 ? (
        <>
          <Text style={styles.emptyTitleText}>{emptySearchTitle}</Text>
          <Text style={styles.emptySubtitleText}>{emptySearchSubtitle}</Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyTitleText}>{emptyTitle}</Text>
          <Text style={styles.emptySubtitleText}>{emptySubtitle}</Text>
          {!!emptyActionLabel && !!onEmptyAction && (
            <TouchableOpacity
              style={styles.emptyActionBtn}
              activeOpacity={0.8}
              onPress={() => {
                handleClose();
                onEmptyAction();
              }}
            >
              <Text style={styles.emptyActionBtnText}>{emptyActionLabel}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.sheetContainer}>
          <SafeAreaView style={styles.safeAreaSheet} edges={['top', 'left', 'right']}>
            {/* Grabber Handle */}
            <View style={styles.handleBar} />

            {/* Header Title */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Search Input Box */}
            {searchable && (
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#94A3B8"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, idx) => `${item.value}_${idx}`}
              renderItem={renderOptionItem}
              ListEmptyComponent={renderEmptyComponent}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={25}
              maxToRenderPerBatch={30}
              windowSize={10}
            />
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  safeAreaSheet: {
    paddingHorizontal: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  closeBtn: {
    padding: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    marginTop: 14,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  optionsList: {
    maxHeight: 380,
  },
  optionsListContent: {
    paddingVertical: 6,
  },
  groupHeaderContainer: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  groupHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6D28D9',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  optionRowSelected: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  optionLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 20,
  },
  optionLabelSelected: {
    color: '#6D28D9',
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitleText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  emptySubtitleText: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyActionBtn: {
    marginTop: 16,
    backgroundColor: '#6D28D9',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
