// ─────────────────────────────────────────────────────────────
// AchieveX — Multi-Select Bottom Sheet Modal for Responsibilities
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AdditionalResponsibility } from '../../data/roles';

interface MultiSelectModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: AdditionalResponsibility[];
  selectedValues: AdditionalResponsibility[];
  onConfirm: (values: AdditionalResponsibility[]) => void;
}

export default function MultiSelectModal({
  visible,
  onClose,
  title,
  options,
  selectedValues,
  onConfirm,
}: MultiSelectModalProps) {
  const [currentSelected, setCurrentSelected] = useState<AdditionalResponsibility[]>(selectedValues);

  useEffect(() => {
    setCurrentSelected(selectedValues);
  }, [selectedValues, visible]);

  const toggleOption = (opt: AdditionalResponsibility) => {
    if (currentSelected.includes(opt)) {
      setCurrentSelected(currentSelected.filter((item) => item !== opt));
    } else {
      setCurrentSelected([...currentSelected, opt]);
    }
  };

  const handleSave = () => {
    onConfirm(currentSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <SafeAreaView style={styles.safeAreaSheet} edges={['top', 'left', 'right']}>
            {/* Grabber Handle */}
            <View style={styles.handleBar} />

            {/* Header Title */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{title}</Text>
                <Text style={styles.sheetSubtitle}>Select any applicable workspaces (optional)</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Checkbox Options List */}
            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
            >
              {options.map((opt) => {
                const isChecked = currentSelected.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionRow, isChecked && styles.optionRowChecked]}
                    activeOpacity={0.75}
                    onPress={() => toggleOption(opt)}
                  >
                    <Ionicons
                      name={isChecked ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={isChecked ? '#6D28D9' : '#94A3B8'}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        isChecked && styles.optionLabelChecked,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Action Done Button */}
            <TouchableOpacity
              style={styles.doneBtn}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.doneBtnText}>Save Responsibilities</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
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
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
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
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 260,
    marginVertical: 10,
  },
  optionsListContent: {
    paddingVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionRowChecked: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  optionLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },
  optionLabelChecked: {
    color: '#6D28D9',
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#6D28D9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
