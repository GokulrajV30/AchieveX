// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Dean Responsibility Management
// Assigns department oversight to Deans (routes HOD submissions).
// Supports assignment conflict detection, explicit reassignment, and unassigned alerts.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  principalDataStore,
  type PrincipalDeanAssignment,
  type PrincipalDepartmentMetric,
} from '../../data/principalWorkspaceData';
import { showAchieveXDialog } from '../feedback/AchieveXFeedback';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalDeanAssignmentsProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalDeanAssignments({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalDeanAssignmentsProps) {
  const [departments, setDepartments] = useState<PrincipalDepartmentMetric[]>(
    principalDataStore.getDepartments()
  );
  const [assignments, setAssignments] = useState<PrincipalDeanAssignment[]>(
    principalDataStore.getAssignments()
  );
  const [activeDeans, setActiveDeans] = useState(principalDataStore.getActiveDeans());
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [selectedDeptForAssign, setSelectedDeptForAssign] = useState<string | null>(null);
  const [selectedDeanForAssign, setSelectedDeanForAssign] = useState<string>('faculty_kumar');
  const [conflictDetails, setConflictDetails] = useState<{
    deptId: string;
    deptName: string;
    currentDeanName: string;
    newDeanId: string;
    newDeanName: string;
    newDeanDesignation: string;
  } | null>(null);

  useEffect(() => {
    return principalDataStore.subscribe(() => {
      setDepartments(principalDataStore.getDepartments());
      setAssignments(principalDataStore.getAssignments());
      setActiveDeans(principalDataStore.getActiveDeans());
    });
  }, []);

  const unassignedDepts = departments.filter((d) => d.assignedDeanName === 'Unassigned');

  // Filtered Deans by search
  const filteredDeans = activeDeans.filter((dean) => {
    if (searchQuery.trim().length === 0) return true;
    const q = searchQuery.toLowerCase();
    const matchName = dean.name.toLowerCase().includes(q);
    const matchDesig = dean.designation.toLowerCase().includes(q);
    const matchDepts = dean.assignedDepartmentIds.some((deptId) => {
      const dept = departments.find((d) => d.id === deptId);
      return dept?.name.toLowerCase().includes(q) || dept?.code.toLowerCase().includes(q);
    });
    return matchName || matchDesig || matchDepts;
  });

  const availableDeansList = [
    {
      id: 'faculty_kumar',
      name: 'Dr. Kumar V',
      employeeId: 'NEC-DEAN-001',
      designation: 'Dean of Academic Affairs',
    },
    {
      id: 'faculty_lakshmi',
      name: 'Dr. K. S. Lakshmi',
      employeeId: 'NEC-DEAN-002',
      designation: 'Dean of Student Affairs & Technology',
    },
  ];

  const handleStartAssign = (departmentId?: string) => {
    setSelectedDeptForAssign(departmentId || departments[0]?.id || null);
    setSelectedDeanForAssign(availableDeansList[0].id);
    setAssignModalVisible(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedDeptForAssign) return;

    const chosenDean = availableDeansList.find((d) => d.id === selectedDeanForAssign);
    if (!chosenDean) return;

    const dept = departments.find((d) => d.id === selectedDeptForAssign);
    const res = principalDataStore.assignDepartmentToDean(
      chosenDean.id,
      chosenDean.name,
      chosenDean.designation,
      selectedDeptForAssign,
      false
    );

    if (res.conflict) {
      setConflictDetails({
        deptId: selectedDeptForAssign,
        deptName: dept?.name || selectedDeptForAssign,
        currentDeanName: res.currentDeanName || 'Another Dean',
        newDeanId: chosenDean.id,
        newDeanName: chosenDean.name,
        newDeanDesignation: chosenDean.designation,
      });
      setAssignModalVisible(false);
      setConflictModalVisible(true);
      return;
    }

    setAssignModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Dean Scope Updated',
      message: 'Department access has been updated.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  const handleConfirmConflictReassign = () => {
    if (!conflictDetails) return;

    principalDataStore.assignDepartmentToDean(
      conflictDetails.newDeanId,
      conflictDetails.newDeanName,
      conflictDetails.newDeanDesignation,
      conflictDetails.deptId,
      true
    );

    setConflictModalVisible(false);
    showAchieveXDialog({
      type: 'success',
      title: 'Dean Scope Updated',
      message: 'Department access has been updated.',
      primaryAction: {
        label: 'Done',
      },
    });
  };

  const handleRemoveDept = (deanId: string, deanName: string, deptId: string, deptName: string) => {
    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Unassign Department?',
      message: `Remove ${deptName} from ${deanName}'s scope?`,
      secondaryAction: {
        label: 'Cancel',
      },
      primaryAction: {
        label: 'Unassign',
        destructive: true,
        onPress: () => {
          principalDataStore.removeDepartmentFromDean(deanId, deptId);
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.identityCol}>
            <Text style={styles.screenTitle}>Dean Responsibilities</Text>
            <Text style={styles.screenSubtext}>HOD Verification Scope Management</Text>
          </View>
          <TouchableOpacity
            style={styles.addAssignBtn}
            activeOpacity={0.8}
            onPress={() => handleStartAssign()}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addAssignBtnText}>Assign</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Assignment Hero */}
          <PrincipalHeroCard
            overline="GOVERNANCE MATRIX"
            title={`${activeDeans.length} Active Deans`}
            subtitle="Department assignment determines HOD submission routing"
            icon="people"
            badgeText="Governance Scope"
            primaryNumber={`${departments.length - unassignedDepts.length}/${departments.length}`}
            primaryLabel="Assigned Departments"
            secondaryMetrics={[
              { number: unassignedDepts.length, label: 'Unassigned' },
              { number: activeDeans.length, label: 'Deans' },
            ]}
            compact
          />

          {/* Unassigned Department Warning Card (if any) */}
          {unassignedDepts.length > 0 && (
            <View style={styles.unassignedCard}>
              <View style={styles.unassignedTop}>
                <View style={styles.unassignedIcon}>
                  <Ionicons name="alert-circle" size={22} color="#DC2626" />
                </View>
                <View style={styles.unassignedTextCol}>
                  <Text style={styles.unassignedTitle}>Unassigned Department Alert</Text>
                  <Text style={styles.unassignedSub}>
                    {unassignedDepts.map((d) => d.name).join(', ')} currently {unassignedDepts.length > 1 ? 'have' : 'has'} no active Dean assigned for HOD verification.
                  </Text>
                </View>
              </View>

              <View style={styles.unassignedBtnRow}>
                {unassignedDepts.map((dept) => (
                  <TouchableOpacity
                    key={dept.id}
                    style={styles.assignNowBtn}
                    activeOpacity={0.8}
                    onPress={() => handleStartAssign(dept.id)}
                  >
                    <Ionicons name="shield-checkmark-outline" size={14} color="#DC2626" style={{ marginRight: 4 }} />
                    <Text style={styles.assignNowBtnText}>Assign Dean to {dept.code}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Search Box */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Dean or Department..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Active Deans List */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Institutional Deans</Text>
            <Text style={styles.sectionMeta}>{activeDeans.length} Officers</Text>
          </View>

          <View style={styles.deanListContainer}>
            {filteredDeans.map((dean) => {
              const assignedDeptObjects = departments.filter((d) =>
                dean.assignedDepartmentIds.includes(d.id)
              );

              return (
                <View key={dean.id} style={styles.deanCard}>
                  <View style={styles.deanHeaderRow}>
                    <View style={styles.deanAvatarCircle}>
                      <Text style={styles.deanAvatarText}>
                        {dean.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>
                    <View style={styles.deanInfoCol}>
                      <Text style={styles.deanNameText}>{dean.name}</Text>
                      <Text style={styles.deanDesigText}>{dean.designation}</Text>
                    </View>
                    <View style={styles.deanScopeCountBadge}>
                      <Text style={styles.deanScopeCountText}>
                        {dean.assignedDepartmentIds.length} Depts
                      </Text>
                    </View>
                  </View>

                  {/* Assigned Department Badges */}
                  <Text style={styles.assignedDeptsLabel}>ASSIGNED OVERSIGHT SCOPE</Text>
                  <View style={styles.deptBadgeGrid}>
                    {assignedDeptObjects.length > 0 ? (
                      assignedDeptObjects.map((dept) => (
                        <View key={dept.id} style={styles.deptBadgeItem}>
                          <Text style={styles.deptBadgeText}>{dept.name}</Text>
                          <TouchableOpacity
                            style={styles.deptBadgeRemoveBtn}
                            onPress={() =>
                              handleRemoveDept(dean.id, dean.name, dept.id, dept.name)
                            }
                          >
                            <Ionicons name="close-circle" size={16} color="#94A3B8" />
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noDeptsText}>No departments currently assigned.</Text>
                    )}
                  </View>

                  <View style={styles.deanCardFooter}>
                    <TouchableOpacity
                      style={styles.manageScopeBtn}
                      activeOpacity={0.8}
                      onPress={() => handleStartAssign()}
                    >
                      <Ionicons name="add-circle-outline" size={16} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.manageScopeBtnText}>Add Department to Scope</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            ASSIGN DEAN MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={assignModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setAssignModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Assign Department Oversight</Text>
                <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ marginBottom: 16 }} showsVerticalScrollIndicator={false}>
                {/* Select Department */}
                <Text style={styles.inputGroupLabel}>1. SELECT DEPARTMENT</Text>
                <View style={styles.optionsList}>
                  {departments.map((dept) => {
                    const isSelected = selectedDeptForAssign === dept.id;
                    const isAssigned = dept.assignedDeanName !== 'Unassigned';

                    return (
                      <TouchableOpacity
                        key={dept.id}
                        style={[
                          styles.deptOptionRow,
                          isSelected && styles.deptOptionRowSelected,
                        ]}
                        onPress={() => setSelectedDeptForAssign(dept.id)}
                      >
                        <View style={styles.deptOptionLeft}>
                          <Text style={[styles.deptOptionName, isSelected && { color: '#0F172A', fontWeight: '700' }]}>
                            {dept.name}
                          </Text>
                          <Text style={styles.deptOptionSub}>
                            HOD: {dept.hodName} • Current Dean: {dept.assignedDeanName}
                          </Text>
                        </View>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isSelected ? '#D97706' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Select Dean */}
                <Text style={[styles.inputGroupLabel, { marginTop: 14 }]}>2. SELECT DEAN OFFICER</Text>
                <View style={styles.optionsList}>
                  {availableDeansList.map((dean) => {
                    const isSelected = selectedDeanForAssign === dean.id;

                    return (
                      <TouchableOpacity
                        key={dean.id}
                        style={[
                          styles.deptOptionRow,
                          isSelected && styles.deptOptionRowSelected,
                        ]}
                        onPress={() => setSelectedDeanForAssign(dean.id)}
                      >
                        <View style={styles.deptOptionLeft}>
                          <Text style={[styles.deptOptionName, isSelected && { color: '#0F172A', fontWeight: '700' }]}>
                            {dean.name}
                          </Text>
                          <Text style={styles.deptOptionSub}>
                            {dean.designation} • {dean.employeeId}
                          </Text>
                        </View>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isSelected ? '#D97706' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.confirmAssignBtn}
                activeOpacity={0.85}
                onPress={handleConfirmAssignment}
              >
                <Text style={styles.confirmAssignBtnText}>Confirm Responsibility Scope</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            CONFLICT REASSIGNMENT MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={conflictModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setConflictModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.conflictCard}>
              <View style={styles.conflictIconCircle}>
                <Ionicons name="swap-horizontal" size={28} color="#D97706" />
              </View>

              <Text style={styles.conflictTitle}>Reassign Department?</Text>
              <Text style={styles.conflictDesc}>
                <Text style={{ fontWeight: '700', color: '#0F172A' }}>{conflictDetails?.deptName}</Text> is currently assigned to{' '}
                <Text style={{ fontWeight: '700', color: '#0F172A' }}>{conflictDetails?.currentDeanName}</Text>.
              </Text>

              <View style={styles.conflictNoticeBox}>
                <Text style={styles.conflictNoticeText}>
                  Reassigning will route future HOD submissions from this department to{' '}
                  <Text style={{ fontWeight: '700' }}>{conflictDetails?.newDeanName}</Text>.
                  Historical verified records and points remain permanently intact.
                </Text>
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setConflictModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmReassignBtn}
                  onPress={handleConfirmConflictReassign}
                >
                  <Text style={styles.modalConfirmReassignBtnText}>Reassign Department</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="home" onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  identityCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  screenSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  addAssignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addAssignBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  unassignedCard: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  unassignedTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  unassignedIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  unassignedTextCol: {
    flex: 1,
  },
  unassignedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  unassignedSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 2,
    lineHeight: 16,
  },
  unassignedBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  assignNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginRight: 8,
    marginTop: 4,
  },
  assignNowBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  deanListContainer: {
    paddingHorizontal: 16,
  },
  deanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deanAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEFCE8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginRight: 10,
  },
  deanAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
  deanInfoCol: {
    flex: 1,
  },
  deanNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  deanDesigText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  deanScopeCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deanScopeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  assignedDeptsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  deptBadgeGrid: {
    marginBottom: 12,
  },
  deptBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deptBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  deptBadgeRemoveBtn: {
    padding: 2,
  },
  noDeptsText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  deanCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  manageScopeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageScopeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  inputGroupLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  optionsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  deptOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deptOptionRowSelected: {
    backgroundColor: '#FEFCE8',
  },
  deptOptionLeft: {
    flex: 1,
    marginRight: 10,
  },
  deptOptionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  deptOptionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  confirmAssignBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmAssignBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conflictCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  conflictIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEFCE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  conflictTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  conflictDesc: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  conflictNoticeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  conflictNoticeText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirmReassignBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  modalConfirmReassignBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
