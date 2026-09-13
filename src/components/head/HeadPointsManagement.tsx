// ─────────────────────────────────────────────────────────────
// AchieveX — Points & Scoring Rules Management (Head Workspace)
// Institutional Governance of Point Matrix with Policy Versioning & Historical Safety
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
  getHeadStore,
  subscribeHeadData,
  type HeadCategoryConfig,
  type HeadAchievementTypeConfig,
  type HeadPointsRuleConfig,
  type InstitutionAchievementPolicy,
} from '../../data/headWorkspaceData';
import HeadHeroCard from './HeadHeroCard';
import StudentBottomTab from '../StudentBottomTab';
import { showAchieveXToast, showAchieveXDialog } from '../feedback/AchieveXFeedback';

interface HeadPointsManagementProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HeadPointsManagement({
  onOpenMenu,
  onNavigate,
}: HeadPointsManagementProps) {
  const store = getHeadStore();
  const [policy, setPolicy] = useState<InstitutionAchievementPolicy>(store.getPolicy());
  const [categories, setCategories] = useState<HeadCategoryConfig[]>(store.getCategories());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'cat_hackathon');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<HeadAchievementTypeConfig | null>(null);
  const [editingRule, setEditingRule] = useState<HeadPointsRuleConfig | null>(null);

  // Edit Form Fields
  const [defaultPoints, setDefaultPoints] = useState('100');
  const [winnerBonus, setWinnerBonus] = useState('100');
  const [runnerBonus, setRunnerBonus] = useState('50');
  const [participantPoints, setParticipantPoints] = useState('30');
  const [reason, setReason] = useState('');

  useEffect(() => {
    return subscribeHeadData(() => {
      setPolicy(store.getPolicy());
      setCategories([...store.getCategories()]);
    });
  }, []);

  const totalSubtypes = categories.reduce((acc, c) => acc + c.types.length, 0);
  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const filteredCategories = categories.filter((c) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q) || c.title?.toLowerCase().includes(q);
      const matchType = c.types?.some((t) => t.name?.toLowerCase().includes(q));
      if (!matchName && !matchType) return false;
    }
    return true;
  });

  const handleOpenEdit = (type: HeadAchievementTypeConfig) => {
    setEditingType(type);
    const rule = type.pointRule || type.scoringRules?.[0] || { id: 'def', points: 100 };
    setEditingRule(rule);
    setDefaultPoints(String(rule.defaultPoints ?? rule.points ?? 100));
    setWinnerBonus(String(rule.winnerBonus ?? 50));
    setRunnerBonus(String(rule.runnerBonus ?? 25));
    setParticipantPoints(String(rule.participantPoints ?? 15));
    setReason('');
    setEditModalVisible(true);
  };

  const handleSaveRule = () => {
    if (!editingType || !editingRule || !activeCategory) return;

    const parsedDefault = parseInt(defaultPoints, 10);
    const parsedWinner = parseInt(winnerBonus, 10);
    const parsedRunner = parseInt(runnerBonus, 10);
    const parsedPart = parseInt(participantPoints, 10);

    if (isNaN(parsedDefault) || parsedDefault < 0) {
      showAchieveXToast({
        type: 'warning',
        message: 'Please enter a valid default point value.',
      });
      return;
    }
    if (!reason.trim()) {
      showAchieveXToast({
        type: 'warning',
        message: 'Please document the reason for updating this institutional scoring rule.',
      });
      return;
    }

    const nextVer = typeof policy.version === 'number' ? policy.version + 1 : `${policy.version}.1`;
    showAchieveXDialog({
      type: 'confirmation',
      title: 'Confirm Point Policy Update',
      message: `Updating scoring rule for "${editingType.label || editingType.name}" will increment institution policy to version ${nextVer}.\n\nExisting records will keep their awarded points. This applies to future submissions only.`,
      primaryAction: {
        label: 'Apply Policy Update',
        onPress: () => {
          store.updatePointRule(
            activeCategory.id,
            editingType.id,
            {
              defaultPoints: parsedDefault,
              winnerBonus: parsedWinner,
              runnerBonus: parsedRunner,
              participantPoints: parsedPart,
            },
            reason.trim()
          );
          setEditModalVisible(false);
          showAchieveXToast({
            type: 'success',
            message: `Scoring rule updated successfully. Policy incremented to v${store.getPolicy().version}.`,
          });
        },
      },
      secondaryAction: {
        label: 'Cancel',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onOpenMenu}>
              <Ionicons name="menu-outline" size={22} color="#1E293B" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Points & Scoring Rules</Text>
              <Text style={styles.headerSubtitle}>College-wide evaluation policy</Text>
            </View>
          </View>

          <View style={styles.versionBadge}>
            <Ionicons name="git-branch" size={13} color="#4F46E5" style={{ marginRight: 4 }} />
            <Text style={styles.versionBadgeText}>v{policy.version}</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE BODY
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* ════════════════════════════════════════════════
              2. SHARED HEAD HERO
          ════════════════════════════════════════════════ */}
          <HeadHeroCard
            overline="SCORING POLICY"
            title="Points Governance Matrix"
            subtitle="Institution evaluation formula & rule versioning"
            icon="trophy"
            badgeText={`v${policy.version}`}
            primaryNumber={`v${policy.version}`}
            primaryLabel="Active Evaluation Policy"
            secondaryMetrics={[
              { number: categories.length, label: 'Categories' },
              { number: totalSubtypes, label: 'Scoring Rules' },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. SEARCH BAR
          ════════════════════════════════════════════════ */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories or achievement types..."
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

          {/* ════════════════════════════════════════════════
              4. PROGRESSIVE CATEGORY SELECTOR CHIPS
          ════════════════════════════════════════════════ */}
          <View style={styles.categoryNav}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryNavScroll}>
              {filteredCategories.map((cat) => {
                const isSelected = cat.id === activeCategory?.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Ionicons
                      name={(cat.icon || 'ribbon') as any}
                      size={14}
                      color={isSelected ? '#FFFFFF' : '#64748B'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextSelected]}>
                      {cat.name || cat.title}
                    </Text>
                    {!cat.isActive && <View style={styles.inactiveDot} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ════════════════════════════════════════════════
              5. ACTIVE CATEGORY OVERVIEW CARD (Requirement 44)
          ════════════════════════════════════════════════ */}
          {activeCategory && (
            <View style={styles.categoryHeaderCard}>
              <View style={styles.categoryTitleRow}>
                <View style={[styles.catIconBox, { backgroundColor: (activeCategory.color || '#4F46E5') + '15' }]}>
                  <Ionicons
                    name={(activeCategory.icon || 'ribbon') as any}
                    size={20}
                    color={activeCategory.color || '#4F46E5'}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.categoryNameText} numberOfLines={1}>
                    {activeCategory.name || activeCategory.title}
                  </Text>
                  <Text style={styles.categoryDescText} numberOfLines={1}>
                    {activeCategory.types.length} Achievement Types configured
                  </Text>
                </View>
                <View style={styles.safetyPill}>
                  <Ionicons name="shield-checkmark" size={12} color="#059669" style={{ marginRight: 4 }} />
                  <Text style={styles.safetyPillText}>Safe Policy</Text>
                </View>
              </View>
            </View>
          )}

          {/* ════════════════════════════════════════════════
              6. SUB-TYPES & SCORING RULES DRILL-DOWN
          ════════════════════════════════════════════════ */}
          <Text style={styles.sectionSubtitle}>ACHIEVEMENT TYPES & SCORING RULES</Text>

          {activeCategory?.types.map((type) => {
            const rule = type.pointRule || type.scoringRules?.[0] || {
              defaultPoints: 100,
              winnerBonus: 50,
              runnerBonus: 25,
              participantPoints: 15,
            };
            const defPts = rule.defaultPoints ?? rule.points ?? 100;

            return (
              <View key={type.id} style={styles.typeCard}>
                <View style={styles.typeCardHeader}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.typeName} numberOfLines={1}>
                      {type.label || type.name}
                    </Text>
                    <Text style={styles.typeCode}>Rule ID: {type.id}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editRuleBtn}
                    activeOpacity={0.7}
                    onPress={() => handleOpenEdit(type)}
                  >
                    <Ionicons name="create-outline" size={13} color="#4F46E5" style={{ marginRight: 4 }} />
                    <Text style={styles.editRuleBtnText}>Manage Points</Text>
                    <Ionicons name="chevron-forward" size={12} color="#4F46E5" style={{ marginLeft: 2 }} />
                  </TouchableOpacity>
                </View>

                {/* Points Grid */}
                <View style={styles.ruleGrid}>
                  <View style={styles.ruleGridItem}>
                    <Text style={styles.ruleLabel}>DEFAULT</Text>
                    <Text style={styles.ruleValue}>{defPts} pts</Text>
                  </View>
                  <View style={styles.ruleGridItem}>
                    <Text style={styles.ruleLabel}>WINNER</Text>
                    <Text style={[styles.ruleValue, { color: '#059669' }]}>+{rule.winnerBonus || 0}</Text>
                  </View>
                  <View style={styles.ruleGridItem}>
                    <Text style={styles.ruleLabel}>RUNNER</Text>
                    <Text style={[styles.ruleValue, { color: '#2563EB' }]}>+{rule.runnerBonus || 0}</Text>
                  </View>
                  <View style={styles.ruleGridItem}>
                    <Text style={styles.ruleLabel}>PARTICIPANT</Text>
                    <Text style={styles.ruleValue}>{rule.participantPoints || 0}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            7. EDIT SCORING RULE MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setEditModalVisible(false)} />
            <View style={styles.editSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.editHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.editOverline}>EDIT INSTITUTIONAL RULE</Text>
                  <Text style={styles.editTitle} numberOfLines={1}>
                    {editingType?.label || editingType?.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.editScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.versionWarningBox}>
                  <Ionicons name="alert-circle" size={18} color="#D97706" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.versionWarningText}>
                    Saving will bump institutional policy to version{' '}
                    {typeof policy.version === 'number' ? policy.version + 1 : `${policy.version}.1`}.
                    Future submissions will use this formula. Historical records are preserved.
                  </Text>
                </View>

                <View style={styles.inputRowGroup}>
                  <View style={styles.inputHalfCol}>
                    <Text style={styles.fieldLabel}>Default Points *</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={defaultPoints}
                      onChangeText={setDefaultPoints}
                    />
                  </View>
                  <View style={styles.inputHalfCol}>
                    <Text style={styles.fieldLabel}>Winner Bonus</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={winnerBonus}
                      onChangeText={setWinnerBonus}
                    />
                  </View>
                </View>

                <View style={styles.inputRowGroup}>
                  <View style={styles.inputHalfCol}>
                    <Text style={styles.fieldLabel}>Runner Bonus</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={runnerBonus}
                      onChangeText={setRunnerBonus}
                    />
                  </View>
                  <View style={styles.inputHalfCol}>
                    <Text style={styles.fieldLabel}>Participant Points</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={participantPoints}
                      onChangeText={setParticipantPoints}
                    />
                  </View>
                </View>

                <View style={styles.inputFullCol}>
                  <Text style={styles.fieldLabel}>Policy Audit Reason *</Text>
                  <TextInput
                    style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                    multiline
                    placeholder="Document reason for IQAC / accreditation review..."
                    placeholderTextColor="#94A3B8"
                    value={reason}
                    onChangeText={setReason}
                  />
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.editFooter}>
                <TouchableOpacity
                  style={styles.saveRuleBtn}
                  activeOpacity={0.8}
                  onPress={handleSaveRule}
                >
                  <Text style={styles.saveRuleBtnText}>Confirm & Apply Policy Bump</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            8. BOTTOM NAVIGATION TAB BAR
        ════════════════════════════════════════════════ */}
        <StudentBottomTab
          activeTab="home"
          variant="head"
          onNavigate={(tab) => {
            if (tab === 'home') {
              onNavigate('headDashboard');
            } else if (tab === 'achievements') {
              onNavigate('headCollegeAchievements');
            } else if (tab === 'analytics') {
              onNavigate('headAnalytics');
            } else if (tab === 'reports') {
              onNavigate('headReports');
            } else if (tab === 'profile') {
              onNavigate('facultyProfile');
            }
          }}
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  versionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  categoryNav: {
    marginBottom: 12,
  },
  categoryNavScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  categoryPillSelected: {
    backgroundColor: '#4F46E5',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginLeft: 6,
  },
  categoryHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  categoryDescText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  safetyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
  safetyPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  typeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  typeCode: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  editRuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexShrink: 0,
  },
  editRuleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  ruleGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  ruleGridItem: {
    alignItems: 'center',
    flex: 1,
  },
  ruleLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  ruleValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  editSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  editOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  editTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  versionWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  versionWarningText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  inputRowGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputHalfCol: {
    flex: 1,
  },
  inputFullCol: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  editFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveRuleBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveRuleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
