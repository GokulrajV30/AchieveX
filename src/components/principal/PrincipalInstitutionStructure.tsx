// ─────────────────────────────────────────────────────────────
// AchieveX — Principal Institutional Hierarchy & Structure
// Visual tree representation of institutional governance:
// Principal -> Deans -> Departments -> HODs -> Faculty & Students
// ─────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  principalDataStore,
  DEMO_PRINCIPAL_USER,
} from '../../data/principalWorkspaceData';
import PrincipalHeroCard from './PrincipalHeroCard';
import PrincipalBottomTab from './PrincipalBottomTab';

interface PrincipalInstitutionStructureProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onGoBack: () => void;
}

export default function PrincipalInstitutionStructure({
  onOpenMenu,
  onNavigate,
  onGoBack,
}: PrincipalInstitutionStructureProps) {
  const departments = principalDataStore.getDepartments();
  const activeDeans = principalDataStore.getActiveDeans();

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
            <Text style={styles.screenTitle}>Institution Structure</Text>
            <Text style={styles.screenSubtext}>College Governance Hierarchy</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <PrincipalHeroCard
            overline="ORGANIZATIONAL HIERARCHY"
            title="Institutional Governance Map"
            subtitle="Reporting chains, verification scopes, and administrative leadership"
            icon="git-network-outline"
            badgeText="8 Depts"
            primaryNumber="1"
            primaryLabel="Autonomous College"
            secondaryMetrics={[
              { number: activeDeans.length, label: 'Deans' },
              { number: departments.length, label: 'HODs' },
            ]}
            compact
          />

          {/* Level 1: Institutional Head (Principal) */}
          <View style={styles.treeSection}>
            <View style={styles.principalCard}>
              <View style={styles.principalIconCircle}>
                <Ionicons name="school" size={24} color="#B45309" />
              </View>
              <View style={styles.principalInfoCol}>
                <Text style={styles.principalRoleLabel}>INSTITUTIONAL HEAD</Text>
                <Text style={styles.principalNameText}>{DEMO_PRINCIPAL_USER.name}</Text>
                <Text style={styles.principalSubText}>
                  Principal • Nandha Engineering College
                </Text>
              </View>
              <View style={styles.authorityPill}>
                <Text style={styles.authorityPillText}>Full Authority</Text>
              </View>
            </View>

            {/* Tree Branch Line */}
            <View style={styles.branchLine} />

            {/* Level 2: Deans Scope */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Institutional Deans (Level 2)</Text>
              <TouchableOpacity onPress={() => onNavigate('principalDeanAssignments')}>
                <Text style={styles.sectionLink}>Manage Scopes →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deansRow}>
              {activeDeans.map((dean) => (
                <View key={dean.id} style={styles.deanNodeCard}>
                  <View style={styles.deanNodeHeader}>
                    <Ionicons name="shield-checkmark" size={16} color="#2563EB" style={{ marginRight: 6 }} />
                    <Text style={styles.deanNodeName}>{dean.name}</Text>
                  </View>
                  <Text style={styles.deanNodeDesig}>{dean.designation}</Text>
                  <View style={styles.deanNodeBadge}>
                    <Text style={styles.deanNodeBadgeText}>
                      Oversight: {dean.assignedDepartmentIds.length} Depts
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Tree Branch Line */}
            <View style={styles.branchLine} />

            {/* Level 3: Departments & HODs */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Academic Departments & HODs (Level 3)</Text>
              <TouchableOpacity onPress={() => onNavigate('principalDepartments')}>
                <Text style={styles.sectionLink}>View All →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.departmentsGrid}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept.id}
                  style={styles.deptNodeCard}
                  activeOpacity={0.8}
                  onPress={() => onNavigate('principalDepartmentDetails', { departmentId: dept.id })}
                >
                  <View style={styles.deptNodeTop}>
                    <Text style={styles.deptNodeCode}>{dept.code}</Text>
                    <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                  </View>
                  <Text style={styles.deptNodeName} numberOfLines={1}>
                    {dept.name}
                  </Text>
                  <Text style={styles.deptNodeHod}>HOD: {dept.hodName}</Text>
                  <View style={styles.deptNodeFooter}>
                    <Text style={styles.deptNodeMeta}>
                      {dept.facultyCount} Faculty • {dept.studentsCount} Students
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <PrincipalBottomTab activeTab="departments" onNavigate={onNavigate} />
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
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 24,
  },
  treeSection: {
    paddingHorizontal: 16,
  },
  principalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  principalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEFCE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  principalInfoCol: {
    flex: 1,
  },
  principalRoleLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  principalNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  principalSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  authorityPill: {
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  authorityPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  branchLine: {
    width: 2,
    height: 24,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginVertical: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  deansRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deanNodeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deanNodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deanNodeName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  deanNodeDesig: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 8,
  },
  deanNodeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deanNodeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  departmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deptNodeCard: {
    backgroundColor: '#FFFFFF',
    width: '48.5%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deptNodeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deptNodeCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  deptNodeName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  deptNodeHod: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  deptNodeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 6,
  },
  deptNodeMeta: {
    fontSize: 9,
    color: '#94A3B8',
  },
});
