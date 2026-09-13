// ─────────────────────────────────────────────────────────────
// AchieveX — Category Management (Head Workspace)
// Category configuration, sub-type expansion, proof rules, and safe deactivation
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
} from '../../data/headWorkspaceData';
import { showAchieveXDialog, showAchieveXToast } from '../feedback/AchieveXFeedback';
import HeadHeroCard from './HeadHeroCard';
import StudentBottomTab from '../StudentBottomTab';

interface HeadCategoryManagementProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function HeadCategoryManagement({
  onOpenMenu,
  onNavigate,
}: HeadCategoryManagementProps) {
  const store = getHeadStore();
  const [categories, setCategories] = useState<HeadCategoryConfig[]>(store.getCategories());
  const [tab, setTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);

  // Add Category Modal
  const [addCatModalVisible, setAddCatModalVisible] = useState(false);
  const [catName, setCatName] = useState('');
  const [catCode, setCatCode] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('ribbon');
  const [catColor, setCatColor] = useState('#4F46E5');
  const [catDefaultPoints, setCatDefaultPoints] = useState('100');

  // Add Type Modal
  const [addTypeModalVisible, setAddTypeModalVisible] = useState(false);
  const [selectedCatForType, setSelectedCatForType] = useState<HeadCategoryConfig | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeDefaultPoints, setTypeDefaultPoints] = useState('100');
  const [typeWinnerBonus, setTypeWinnerBonus] = useState('50');

  useEffect(() => {
    return subscribeHeadData(() => {
      setCategories([...store.getCategories()]);
    });
  }, []);

  const totalTypes = categories.reduce((acc, c) => acc + c.types.length, 0);
  const activeCount = categories.filter((c) => c.isActive).length;

  const filteredCategories = categories.filter((c) => {
    if (tab === 'Active' && !c.isActive) return false;
    if (tab === 'Inactive' && c.isActive) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q) || c.title?.toLowerCase().includes(q);
      const matchCode = c.code?.toLowerCase().includes(q);
      const matchType = c.types?.some((t) => t.name?.toLowerCase().includes(q));
      if (!matchName && !matchCode && !matchType) return false;
    }
    return true;
  });

  const handleToggleActive = (cat: HeadCategoryConfig) => {
    if (cat.isActive) {
      showAchieveXDialog({
        type: 'actionRequired',
        title: 'Deactivate Category?',
        message: 'This will hide the category from new submissions.',
        secondaryAction: {
          label: 'Cancel',
        },
        primaryAction: {
          label: 'Deactivate',
          destructive: true,
          onPress: () => {
            store.deactivateCategory(cat.id);
          },
        },
      });
    } else {
      store.activateCategory(cat.id);
      showAchieveXDialog({
        type: 'success',
        title: 'Category Activated',
        message: `"${cat.name}" is now active for submissions.`,
        primaryAction: {
          label: 'Done',
        },
      });
    }
  };

  const handleDeleteCategory = (cat: HeadCategoryConfig) => {
    if (cat.usageCount > 0) {
      showAchieveXDialog({
        type: 'warning',
        title: 'Cannot Delete Category',
        message: 'This category has existing records. Deactivate it instead.',
        secondaryAction: {
          label: 'Cancel',
        },
        primaryAction: {
          label: 'Deactivate',
          onPress: () => store.deactivateCategory(cat.id),
        },
      });
      return;
    }

    showAchieveXDialog({
      type: 'actionRequired',
      title: 'Delete Category?',
      message: "This can't be undone.",
      secondaryAction: {
        label: 'Cancel',
      },
      primaryAction: {
        label: 'Delete',
        destructive: true,
        onPress: () => {
          const res = store.deleteCategory(cat.id);
          if (!res.success) {
            showAchieveXDialog({
              type: 'error',
              title: 'Deletion Failed',
              message: res.message || 'Please try again.',
              primaryAction: {
                label: 'Got It',
              },
            });
          }
        },
      },
    });
  };

  const handleCreateCategory = () => {
    if (!catName.trim()) {
      showAchieveXToast({
        type: 'warning',
        message: 'Please provide a category title.',
      });
      return;
    }
    const id = 'cat_' + (catCode.trim() ? catCode.trim().toLowerCase().replace(/\s+/g, '_') : Date.now().toString());
    const pts = parseInt(catDefaultPoints, 10) || 100;

    const newCat: HeadCategoryConfig = {
      id,
      institutionId: 'inst_nandha',
      policyId: 'policy_2025_v2',
      title: catName.trim(),
      name: catName.trim(),
      code: catCode.trim().toUpperCase() || 'GEN',
      description: catDesc.trim() || 'Institution verified category',
      iconName: catIcon,
      icon: catIcon,
      iconColor: catColor,
      color: catColor,
      status: 'active',
      isActive: true,
      usageCount: 0,
      types: [
        {
          id: `${id}_general`,
          name: 'General ' + catName.trim(),
          label: 'General ' + catName.trim(),
          categoryId: id,
          description: 'Standard achievement under ' + catName.trim(),
          status: 'active',
          applicableLevels: ['Department', 'College', 'State', 'National', 'International'],
          applicableResults: ['1st Place', '2nd Place', '3rd Place', 'Participant'],
          individualOrTeam: 'Both',
          scoringRules: [],
          pointRule: {
            id: `rule_${id}`,
            typeId: `${id}_general`,
            defaultPoints: pts,
            winnerBonus: 50,
            runnerBonus: 30,
            participantPoints: 20,
          },
          proofRequirements: [],
          proofRequirement: {
            id: `pr_${id}_gen`,
            label: 'Official Certificate',
            required: true,
            requiredFileTypes: ['pdf', 'png', 'jpg'],
            maxFileSizeMb: 5,
            verificationFields: ['Event Name', 'Date', 'Organized By'],
          },
          usageCount: 0,
        },
      ],
    };

    store.addCategory(newCat);
    setAddCatModalVisible(false);
    setCatName('');
    setCatCode('');
    setCatDesc('');
    showAchieveXToast({
      type: 'success',
      message: `"${newCat.name}" created with default scoring rule.`,
    });
  };

  const handleCreateType = () => {
    if (!selectedCatForType || !typeName.trim()) {
      showAchieveXToast({
        type: 'warning',
        message: 'Please enter a name for the sub-type.',
      });
      return;
    }

    const typeId = `${selectedCatForType.id}_${Date.now()}`;
    const defPts = parseInt(typeDefaultPoints, 10) || 100;
    const winBonus = parseInt(typeWinnerBonus, 10) || 50;

    const newType: HeadAchievementTypeConfig = {
      id: typeId,
      name: typeName.trim(),
      label: typeName.trim(),
      categoryId: selectedCatForType.id,
      description: 'Sub-type under ' + (selectedCatForType.name || selectedCatForType.title || 'Category'),
      status: 'active',
      applicableLevels: ['Department', 'College', 'State', 'National', 'International'],
      applicableResults: ['1st Place', '2nd Place', '3rd Place', 'Participant'],
      individualOrTeam: 'Both',
      scoringRules: [],
      pointRule: {
        id: `rule_${typeId}`,
        typeId,
        defaultPoints: defPts,
        winnerBonus: winBonus,
        runnerBonus: Math.round(winBonus * 0.5),
        participantPoints: Math.round(defPts * 0.3),
      },
      proofRequirements: [],
      proofRequirement: {
        id: `pr_${typeId}`,
        label: 'Official Certificate',
        required: true,
        requiredFileTypes: ['pdf', 'png'],
        maxFileSizeMb: 5,
        verificationFields: ['Certificate Number', 'Issuing Authority'],
      },
      usageCount: 0,
    };

    store.addTypeToCategory(selectedCatForType.id, newType);
    setAddTypeModalVisible(false);
    setTypeName('');
    showAchieveXToast({
      type: 'success',
      message: `"${newType.name}" added to ${selectedCatForType.name}.`,
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
              <Text style={styles.headerTitle}>Category Management</Text>
              <Text style={styles.headerSubtitle}>Institutional category framework</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addHeaderBtn}
            activeOpacity={0.8}
            onPress={() => setAddCatModalVisible(true)}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addHeaderBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            SCROLLABLE BODY
        ════════════════════════════════════════════════ */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* ════════════════════════════════════════════════
              2. SHARED HEAD HERO
          ════════════════════════════════════════════════ */}
          <HeadHeroCard
            overline="CATEGORY GOVERNANCE"
            title="Achievement Framework"
            subtitle="Institutional categorization & validation rules"
            icon="ribbon"
            badgeText={`${activeCount} Active`}
            primaryNumber={`${activeCount} Active`}
            primaryLabel="Categories in catalog"
            secondaryMetrics={[
              { number: totalTypes, label: 'Sub-Types' },
              { number: '100%', label: 'Preserved' },
            ]}
          />

          {/* ════════════════════════════════════════════════
              3. SEARCH & ADD ACTION ROW
          ════════════════════════════════════════════════ */}
          <View style={styles.controlsRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories or sub-types..."
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

            <TouchableOpacity
              style={styles.addCategoryBtn}
              activeOpacity={0.8}
              onPress={() => setAddCatModalVisible(true)}
            >
              <Ionicons name="add-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.addCategoryBtnText}>Add Category</Text>
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════════════════════════
              4. STATUS TABS
          ════════════════════════════════════════════════ */}
          <View style={styles.tabBar}>
            {(['All', 'Active', 'Inactive'] as const).map((t) => {
              const isSelected = tab === t;
              const count =
                t === 'All'
                  ? categories.length
                  : t === 'Active'
                  ? categories.filter((c) => c.isActive).length
                  : categories.filter((c) => !c.isActive).length;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.tabItem, isSelected && styles.tabItemActive]}
                  onPress={() => setTab(t)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                    {t} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ════════════════════════════════════════════════
              5. CATEGORIES LIST
          ════════════════════════════════════════════════ */}
          {filteredCategories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={36} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No Categories Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or tab filter.</Text>
            </View>
          ) : (
            filteredCategories.map((cat) => {
              const isExpanded = expandedCatId === cat.id;

              return (
                <View key={cat.id} style={[styles.categoryCard, !cat.isActive && styles.categoryCardInactive]}>
                  {/* Category Card Header Row per Requirement 43 */}
                  <TouchableOpacity
                    style={styles.cardHeaderRow}
                    activeOpacity={0.75}
                    onPress={() => setExpandedCatId(isExpanded ? null : cat.id)}
                  >
                    {/* Fixed-size Icon Container */}
                    <View style={[styles.iconBox, { backgroundColor: (cat.color || '#4F46E5') + '15' }]}>
                      <Ionicons name={(cat.icon || 'ribbon') as any} size={20} color={cat.color || '#4F46E5'} />
                    </View>

                    {/* Middle Text Column */}
                    <View style={styles.cardMiddleCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.catTitle} numberOfLines={1} ellipsizeMode="tail">
                          {cat.name || cat.title}
                        </Text>
                        <View style={[styles.statusBadge, cat.isActive ? styles.badgeActive : styles.badgeInactive]}>
                          <Text style={[styles.statusBadgeText, cat.isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.catSubtext} numberOfLines={1}>
                        {cat.types.length} Achievement Types • {cat.usageCount} Submissions
                      </Text>
                    </View>

                    {/* Right Action / Arrow */}
                    <View style={styles.cardRightAction}>
                      <Text style={styles.manageLinkText}>{isExpanded ? 'Hide' : 'Manage'}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-forward'}
                        size={14}
                        color="#4F46E5"
                        style={{ marginLeft: 2 }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Details on Demand: Expanded View */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      {cat.description ? (
                        <Text style={styles.expandedDesc}>{cat.description}</Text>
                      ) : null}

                      {/* Details Box */}
                      <View style={styles.catDetailsBox}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Sub-Types Configured:</Text>
                          <Text style={styles.detailVal}>{cat.types.length} types</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Historical Usage:</Text>
                          <Text style={styles.detailVal}>{cat.usageCount} verified submissions</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Proof Formats:</Text>
                          <Text style={styles.detailVal}>PDF, PNG, JPG (Max 5MB)</Text>
                        </View>
                      </View>

                      {/* Sub-types chips list */}
                      <Text style={styles.subtypesHeader}>SUB-TYPES & SCORING</Text>
                      <View style={styles.subtypesList}>
                        {cat.types.map((type) => (
                          <View key={type.id} style={styles.subtypeChip}>
                            <Text style={styles.subtypeChipText} numberOfLines={1}>
                              {type.name}
                            </Text>
                            <Text style={styles.subtypePts}>{type.pointRule?.defaultPoints ?? 100}p</Text>
                          </View>
                        ))}
                        <TouchableOpacity
                          style={styles.addTypeChip}
                          activeOpacity={0.7}
                          onPress={() => {
                            setSelectedCatForType(cat);
                            setAddTypeModalVisible(true);
                          }}
                        >
                          <Ionicons name="add-circle" size={14} color="#4F46E5" style={{ marginRight: 4 }} />
                          <Text style={styles.addTypeChipText}>+ Add Type</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Card Action Buttons */}
                      <View style={styles.cardActionsRow}>
                        <TouchableOpacity
                          style={[styles.actionBtn, cat.isActive ? styles.deactivateBtn : styles.reactivateBtn]}
                          activeOpacity={0.7}
                          onPress={() => handleToggleActive(cat)}
                        >
                          <Ionicons
                            name={cat.isActive ? 'power-outline' : 'checkmark-circle-outline'}
                            size={14}
                            color={cat.isActive ? '#DC2626' : '#059669'}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={[styles.actionBtnText, cat.isActive ? styles.deactivateText : styles.reactivateText]}>
                            {cat.isActive ? 'Deactivate' : 'Reactivate'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteBtn}
                          activeOpacity={0.7}
                          onPress={() => handleDeleteCategory(cat)}
                        >
                          <Ionicons name="trash-outline" size={15} color="#94A3B8" />
                          <Text style={styles.deleteBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ════════════════════════════════════════════════
            6. ADD CATEGORY MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={addCatModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddCatModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setAddCatModalVisible(false)} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>New Achievement Category</Text>
                  <Text style={styles.sheetSubtitle}>Add institutional category to catalog</Text>
                </View>
                <TouchableOpacity onPress={() => setAddCatModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Industrial Certification"
                    placeholderTextColor="#94A3B8"
                    value={catName}
                    onChangeText={setCatName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category Code</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. IND_CERT"
                    placeholderTextColor="#94A3B8"
                    value={catCode}
                    onChangeText={setCatCode}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
                    multiline
                    placeholder="Brief criteria and requirements..."
                    placeholderTextColor="#94A3B8"
                    value={catDesc}
                    onChangeText={setCatDesc}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Default Baseline Points</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={catDefaultPoints}
                    onChangeText={setCatDefaultPoints}
                  />
                </View>

                <Text style={styles.inputLabel}>Choose Category Icon</Text>
                <View style={styles.iconSelectorRow}>
                  {['ribbon', 'trophy', 'medal', 'school', 'flask', 'bulb', 'code-slash', 'fitness'].map((ico) => (
                    <TouchableOpacity
                      key={ico}
                      style={[styles.iconChoice, catIcon === ico && styles.iconChoiceSelected]}
                      onPress={() => setCatIcon(ico)}
                    >
                      <Ionicons name={ico as any} size={20} color={catIcon === ico ? '#FFFFFF' : '#4F46E5'} />
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.primarySaveBtn} activeOpacity={0.8} onPress={handleCreateCategory}>
                  <Text style={styles.primarySaveBtnText}>Create Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ════════════════════════════════════════════════
            7. ADD SUB-TYPE MODAL
        ════════════════════════════════════════════════ */}
        <Modal
          visible={addTypeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddTypeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setAddTypeModalVisible(false)} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Add Sub-Type</Text>
                  <Text style={styles.sheetSubtitle}>To {selectedCatForType?.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setAddTypeModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Sub-Type Title *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Hardware Prototype Hackathon"
                    placeholderTextColor="#94A3B8"
                    value={typeName}
                    onChangeText={setTypeName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Default Points</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={typeDefaultPoints}
                    onChangeText={setTypeDefaultPoints}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Winner Bonus Points</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={typeWinnerBonus}
                    onChangeText={setTypeWinnerBonus}
                  />
                </View>
                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.primarySaveBtn} activeOpacity={0.8} onPress={handleCreateType}>
                  <Text style={styles.primarySaveBtnText}>Save Sub-Type</Text>
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
  addHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
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
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addCategoryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 8,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  tabItemActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryCardInactive: {
    opacity: 0.75,
    backgroundColor: '#F8FAFC',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMiddleCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  badgeActive: {
    backgroundColor: '#ECFDF5',
  },
  badgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextActive: {
    color: '#059669',
  },
  badgeTextInactive: {
    color: '#64748B',
  },
  catSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardRightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  manageLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expandedDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 16,
  },
  catDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  subtypesHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  subtypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  subtypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  subtypeChipText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '500',
    maxWidth: 150,
  },
  subtypePts: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3730A3',
  },
  addTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addTypeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deactivateBtn: {
    backgroundColor: '#FEE2E2',
  },
  reactivateBtn: {
    backgroundColor: '#ECFDF5',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deactivateText: {
    color: '#DC2626',
  },
  reactivateText: {
    color: '#059669',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  sheetContainer: {
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
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
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
  iconSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  iconChoice: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChoiceSelected: {
    backgroundColor: '#4F46E5',
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primarySaveBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primarySaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
