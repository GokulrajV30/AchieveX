// ─────────────────────────────────────────────────────────────
// AchieveX — Manage Responsibilities Modal Component
// Displays all assigned roles with details, active status,
// switch action, delete/remove option, and add new role button.
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
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import {
  type FacultyResponsibility,
  type FacultyWorkspaceId,
} from '../../data/facultyWorkspaceData';

interface ManageResponsibilitiesModalProps {
  visible: boolean;
  currentWorkspace: FacultyWorkspaceId;
  responsibilities: FacultyResponsibility[];
  onClose: () => void;
  onSelectWorkspace: (workspace: FacultyWorkspaceId) => void;
  onDeleteResponsibility: (roleId: FacultyWorkspaceId) => void;
  onOpenAddModal: () => void;
}

export default function ManageResponsibilitiesModal({
  visible,
  currentWorkspace,
  responsibilities,
  onClose,
  onSelectWorkspace,
  onDeleteResponsibility,
  onOpenAddModal,
}: ManageResponsibilitiesModalProps) {
  const getRoleIcon = (id: FacultyWorkspaceId) => {
    switch (id) {
      case 'faculty':
        return <Ionicons name="briefcase-outline" size={22} color="#4F46E5" />;
      case 'tutor':
        return <Ionicons name="people-outline" size={22} color="#0D9488" />;
      case 'proctor':
        return <Ionicons name="shield-checkmark-outline" size={22} color="#D97706" />;
      case 'mentor':
        return <Ionicons name="heart-outline" size={22} color="#E11D48" />;
      case 'academic_coordinator':
        return <Ionicons name="ribbon-outline" size={22} color="#7C3AED" />;
      default:
        return <Ionicons name="grid-outline" size={22} color="#4F46E5" />;
    }
  };

  const getRoleIconBg = (id: FacultyWorkspaceId) => {
    switch (id) {
      case 'faculty':
        return '#EEF2FF';
      case 'tutor':
        return '#F0FDFA';
      case 'proctor':
        return '#FEF3C7';
      case 'mentor':
        return '#FFE4E6';
      case 'academic_coordinator':
        return '#F3E8FF';
      default:
        return '#EEF2FF';
    }
  };

  const handleDeletePress = (role: FacultyResponsibility) => {
    if (responsibilities.length <= 1) {
      showAchieveXDialog({
        type: 'warning',
        title: 'Cannot Remove Role',
        message: 'You must retain at least one active faculty responsibility on your account.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }

    showAchieveXDialog({
      type: 'actionRequired',
      title: `Remove ${role.label}?`,
      message: `Are you sure you want to remove the ${role.label} role from your account? You can add it back anytime.`,
      secondaryAction: {
        label: 'Cancel',
      },
      primaryAction: {
        label: 'Remove',
        destructive: true,
        onPress: () => {
          onDeleteResponsibility(role.id);
        },
      },
    });
  };

  const handleSwitch = (roleId: FacultyWorkspaceId) => {
    onClose();
    onSelectWorkspace(roleId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Workspace & Responsibilities</Text>
              <Text style={styles.headerSubtitle}>
                Manage active roles, switch workspace, or remove responsibilities
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* List of Responsibilities */}
          <ScrollView
            style={styles.rolesScrollView}
            contentContainerStyle={styles.rolesScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {responsibilities.map((role) => {
              const isActive = role.id === currentWorkspace;

              return (
                <View
                  key={role.id}
                  style={[
                    styles.roleCard,
                    isActive && styles.roleCardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.roleIconCircle,
                      { backgroundColor: getRoleIconBg(role.id) },
                    ]}
                  >
                    {getRoleIcon(role.id)}
                  </View>

                  <View style={styles.roleInfoCol}>
                    <View style={styles.roleTitleRow}>
                      <Text style={styles.roleLabel}>{role.label}</Text>
                      {isActive && (
                        <View style={styles.activePill}>
                          <Text style={styles.activePillText}>ACTIVE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.roleDescription} numberOfLines={2}>
                      {role.description}
                    </Text>
                    {role.assignmentDetails && (
                      <Text style={styles.assignmentDetailsText}>
                        📍 {role.assignmentDetails}
                      </Text>
                    )}
                  </View>

                  {/* Actions Column: Switch + Delete */}
                  <View style={styles.actionsCol}>
                    {!isActive && (
                      <TouchableOpacity
                        style={styles.switchButton}
                        activeOpacity={0.8}
                        onPress={() => handleSwitch(role.id)}
                      >
                        <Text style={styles.switchButtonText}>Switch</Text>
                      </TouchableOpacity>
                    )}

                    {/* Delete Option */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      activeOpacity={0.75}
                      onPress={() => handleDeletePress(role)}
                    >
                      <Ionicons name="trash-outline" size={17} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Add Responsibility Button */}
          <TouchableOpacity
            style={styles.addRoleButton}
            activeOpacity={0.85}
            onPress={() => {
              onClose();
              setTimeout(() => {
                onOpenAddModal();
              }, 250);
            }}
          >
            <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.addRoleButtonText}>Add New Responsibility</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  dragHandle: {
    width: 36,
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
    marginBottom: 16,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolesScrollView: {
    maxHeight: 380,
  },
  rolesScrollContent: {
    paddingBottom: 12,
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  roleCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  activePill: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  roleDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 4,
  },
  assignmentDetailsText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  actionsCol: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  switchButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  switchButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4F46E5',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  addRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addRoleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
