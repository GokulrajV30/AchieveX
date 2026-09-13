// ─────────────────────────────────────────────────────────────
// AchieveX — Faculty Workspace Switcher Bottom Sheet Component
// Lists assigned responsibilities with 1-tap switching & toast feedback
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
import {
  FacultyWorkspaceId,
  FacultyResponsibility,
} from '../../data/facultyWorkspaceData';

interface WorkspaceSwitcherModalProps {
  visible: boolean;
  currentWorkspace: FacultyWorkspaceId;
  responsibilities: FacultyResponsibility[];
  onClose: () => void;
  onSelectWorkspace: (workspace: FacultyWorkspaceId) => void;
}

export default function WorkspaceSwitcherModal({
  visible,
  currentWorkspace,
  responsibilities,
  onClose,
  onSelectWorkspace,
}: WorkspaceSwitcherModalProps) {
  const activeResp = responsibilities.find((r) => r.id === currentWorkspace) || responsibilities[0];

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
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.sheetTitle}>Workspace & Responsibilities</Text>
              <Text style={styles.sheetSubtitle}>Choose how you want to use AchieveX.</Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Current Active Workspace Banner */}
            <Text style={styles.sectionHeading}>CURRENT ACTIVE WORKSPACE</Text>
            <View style={styles.currentActiveCard}>
              <View style={styles.currentIconBox}>
                <Ionicons name={activeResp.icon as any} size={22} color="#2563EB" />
              </View>
              <View style={{ flex: 1, paddingRight: 6 }}>
                <View style={styles.activeTitleRow}>
                  <Text style={styles.currentTitle}>{activeResp.label} Workspace</Text>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                </View>
                <Text style={styles.currentMeta}>
                  {activeResp.assignmentDetails || 'Primary Faculty Account'}
                </Text>
              </View>
            </View>

            {/* 2. Available Workspaces */}
            <Text style={styles.sectionHeading}>ASSIGNED RESPONSIBILITIES</Text>
            <View style={styles.respList}>
              {responsibilities.map((resp) => {
                const isSelected = resp.id === currentWorkspace;

                return (
                  <View
                    key={resp.id}
                    style={[
                      styles.respCard,
                      isSelected && styles.respCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.respIconBox,
                        isSelected && styles.respIconBoxSelected,
                      ]}
                    >
                      <Ionicons
                        name={resp.icon as any}
                        size={20}
                        color={isSelected ? '#2563EB' : '#64748B'}
                      />
                    </View>

                    <View style={styles.respContentCol}>
                      <Text
                        style={[
                          styles.respTitle,
                          isSelected && styles.respTitleSelected,
                        ]}
                      >
                        {resp.label}
                      </Text>
                      <Text style={styles.respDetails}>
                        {resp.assignmentDetails || 'Department Faculty'}
                      </Text>
                      <Text style={styles.respDesc} numberOfLines={2}>
                        {resp.description}
                      </Text>
                    </View>

                    {/* Switch / Current Button */}
                    {isSelected ? (
                      <View style={styles.currentIndicator}>
                        <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={{ marginRight: 3 }} />
                        <Text style={styles.currentIndicatorText}>Current</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.switchBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                          onClose();
                          onSelectWorkspace(resp.id);
                        }}
                      >
                        <Text style={styles.switchBtnText}>Switch</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Institutional Security Notice */}
            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.securityNoteText}>
                Responsibilities are assigned by institution administration.
              </Text>
            </View>

            <View style={{ height: 20 }} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '82%',
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
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    maxHeight: 440,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  currentActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  currentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  currentTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E40AF',
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  currentMeta: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  respList: {
    gap: 10,
    marginBottom: 12,
  },
  respCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  respCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFF',
  },
  respIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  respIconBoxSelected: {
    backgroundColor: '#EFF6FF',
  },
  respContentCol: {
    flex: 1,
    paddingRight: 8,
  },
  respTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 1,
  },
  respTitleSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },
  respDetails: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 3,
  },
  respDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 15,
  },
  switchBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  switchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  currentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  currentIndicatorText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  securityNoteText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
});
