// ─────────────────────────────────────────────────────────────
// AchieveX — Add Responsibility Modal Component
// Allows faculty to browse, select, and add institutional responsibilities.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  ALL_AVAILABLE_RESPONSIBILITIES,
  type FacultyResponsibility,
  type FacultyWorkspaceId,
} from '../../data/facultyWorkspaceData';

interface AddResponsibilityModalProps {
  visible: boolean;
  currentResponsibilities: FacultyResponsibility[];
  onClose: () => void;
  onAddResponsibility: (responsibility: FacultyResponsibility) => void;
}

export default function AddResponsibilityModal({
  visible,
  currentResponsibilities,
  onClose,
  onAddResponsibility,
}: AddResponsibilityModalProps) {
  const currentIds = currentResponsibilities.map((r) => r.id);

  // Available responsibilities that the user does not already have
  const availableToAdd = ALL_AVAILABLE_RESPONSIBILITIES.filter(
    (r) => !currentIds.includes(r.id)
  );

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

  const handleSelectRole = (role: FacultyResponsibility) => {
    Alert.alert(
      `Add ${role.label} Role?`,
      `You will be assigned the ${role.label} responsibility (${role.assignmentDetails || 'Department Level'}).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Role',
          style: 'default',
          onPress: () => {
            onAddResponsibility(role);
            onClose();
          },
        },
      ]
    );
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
          {/* Top Drag Indicator Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Add Responsibility</Text>
              <Text style={styles.headerSubtitle}>
                Select an institutional role to add to your workspace
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

          {/* Roles List */}
          <ScrollView
            style={styles.rolesScrollView}
            contentContainerStyle={styles.rolesScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {availableToAdd.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#16A34A" />
                <Text style={styles.emptyStateTitle}>All Roles Added</Text>
                <Text style={styles.emptyStateSubtitle}>
                  You have already added all available institutional responsibilities.
                </Text>
              </View>
            ) : (
              availableToAdd.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={styles.roleCard}
                  activeOpacity={0.8}
                  onPress={() => handleSelectRole(role)}
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
                    </View>
                    <Text style={styles.roleDescription} numberOfLines={2}>
                      {role.description}
                    </Text>
                    {role.assignmentDetails && (
                      <View style={styles.assignmentDetailsTag}>
                        <Text style={styles.assignmentDetailsText}>
                          📍 {role.assignmentDetails}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Add Action Button */}
                  <View style={styles.addBtnContainer}>
                    <View style={styles.addPill}>
                      <Ionicons name="add" size={14} color="#4F46E5" />
                      <Text style={styles.addPillText}>Add</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
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
    maxHeight: '75%',
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
    paddingBottom: 8,
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
  },
  roleDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 4,
  },
  assignmentDetailsTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  assignmentDetailsText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  addBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  addPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    marginLeft: 2,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
