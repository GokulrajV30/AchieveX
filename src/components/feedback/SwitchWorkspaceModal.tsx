// ─────────────────────────────────────────────────────────────
// AchieveX — Global Switch Workspace Modal / Bottom Sheet
// Consistent, clean UI matching the AchieveX design system
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FacultyWorkspaceId } from '../../data/facultyWorkspaceData';

export interface WorkspaceOption {
  id: string;
  label: string;
  role: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean';
  workspaceId?: FacultyWorkspaceId;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const ACHIEVEX_WORKSPACES: WorkspaceOption[] = [
  {
    id: 'student',
    label: 'Student',
    role: 'Student',
    subtitle: 'Gokulraj V (23CI011)',
    iconName: 'school-outline',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    role: 'Proctor',
    workspaceId: 'faculty',
    subtitle: 'Teaching & Personal Achievements',
    iconName: 'briefcase-outline',
  },
  {
    id: 'proctor',
    label: 'Proctor',
    role: 'Proctor',
    workspaceId: 'proctor',
    subtitle: 'Student Mentorship & Monitoring',
    iconName: 'shield-checkmark-outline',
  },
  {
    id: 'mentor',
    label: 'Mentor',
    role: 'Proctor',
    workspaceId: 'mentor',
    subtitle: 'Project Mentorship & Reviews',
    iconName: 'people-outline',
  },
  {
    id: 'academic_coordinator',
    label: 'Academic Coordinator',
    role: 'Academic Coordinator',
    workspaceId: 'academic_coordinator',
    subtitle: 'NPTEL & Event Level Verification',
    iconName: 'file-tray-full-outline',
  },
  {
    id: 'hod',
    label: 'HOD',
    role: 'HOD',
    workspaceId: 'hod',
    subtitle: 'Head of Department — CSE (IoT)',
    iconName: 'business-outline',
  },
  {
    id: 'head',
    label: 'Head',
    role: 'Head',
    workspaceId: 'head',
    subtitle: 'Achievement Governance & Points',
    iconName: 'ribbon-outline',
  },
  {
    id: 'dean',
    label: 'Dean',
    role: 'Dean',
    workspaceId: 'dean',
    subtitle: 'Academic Affairs & Final Approvals',
    iconName: 'ribbon-outline',
  },
  {
    id: 'principal',
    label: 'Principal',
    role: 'Principal',
    workspaceId: 'principal',
    subtitle: 'Institutional Oversight & Leadership',
    iconName: 'flag-outline',
  },
];

interface SwitchWorkspaceModalProps {
  visible: boolean;
  currentRole: 'Student' | 'Proctor' | 'HOD' | 'Academic Coordinator' | 'Principal' | 'Head' | 'Dean';
  activeWorkspace?: FacultyWorkspaceId;
  onClose: () => void;
  onSelectOption: (option: WorkspaceOption) => void;
}

export default function SwitchWorkspaceModal({
  visible,
  currentRole,
  activeWorkspace,
  onClose,
  onSelectOption,
}: SwitchWorkspaceModalProps) {
  const isCurrentActive = (item: WorkspaceOption) => {
    if (item.id === 'student') {
      return currentRole === 'Student';
    }
    if (currentRole === 'Student') {
      return false;
    }
    if (item.workspaceId && activeWorkspace) {
      return item.workspaceId === activeWorkspace;
    }
    return item.role === currentRole;
  };

  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 16);

  const handleSelect = (item: WorkspaceOption) => {
    if (isCurrentActive(item)) {
      onClose();
      return;
    }
    // 1. Close switch modal FIRST
    onClose();
    // 2. Select option and navigate
    onSelectOption(item);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sheetContainer, { paddingBottom: bottomPadding }]}>
          {/* Grabber bar */}
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>Switch Workspace</Text>
              <Text style={styles.sheetSubtitle}>
                Choose where you want to continue.
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Workspace List */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {ACHIEVEX_WORKSPACES.map((item) => {
              const active = isCurrentActive(item);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.rowItem,
                    active && styles.rowItemActive,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleSelect(item)}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconContainer,
                      active && styles.iconContainerActive,
                    ]}
                  >
                    <Ionicons
                      name={item.iconName}
                      size={20}
                      color={active ? '#2563EB' : '#475569'}
                    />
                  </View>

                  {/* Title & Subtitle */}
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.itemTitle,
                        active && styles.itemTitleActive,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>

                  {/* Right: Current badge or Chevron */}
                  {active ? (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={17}
                      color="#94A3B8"
                      style={styles.chevron}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    paddingTop: 12,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginLeft: 12,
  },
  scrollArea: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 12,
    gap: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowItemActive: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F0F7FF',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: '#DBEAFE',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemTitleActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  currentBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currentBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.1,
  },
  chevron: {
    marginLeft: 4,
  },
});
