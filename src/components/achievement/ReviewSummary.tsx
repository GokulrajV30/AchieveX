// ─────────────────────────────────────────────────────────────
// AchieveX — Review Summary (Step 4)
// Modern, Compact & Structured SaaS Review Experience
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  getCategoryById,
  getTypeById,
  getFieldsForType,
  getProofRequirements,
  calculateEstimatedPoints,
} from '../../data/achievementConfig';
import { formatDateDisplay } from './FormComponents';
import ReviewSection from './review/ReviewSection';
import ProofItemRow from './review/ProofItemRow';
import ProofPreviewModal from './review/ProofPreviewModal';
import SubmitConfirmModal from './review/SubmitConfirmModal';

interface ReviewSummaryProps {
  formData: Record<string, any>;
  onEditSection: (stepIndex: number) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  submitting: boolean;
}

export default function ReviewSummary({
  formData,
  onEditSection,
  onSubmit,
  onSaveDraft,
  submitting,
}: ReviewSummaryProps) {
  const [declared, setDeclared] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState(false);

  // Proof Preview Modal state
  const [selectedProof, setSelectedProof] = useState<{
    label: string;
    fileName: string;
    fileType: 'pdf' | 'image';
    fileSize?: string;
  } | null>(null);

  const category = getCategoryById(formData.categoryId);
  const type = getTypeById(formData.categoryId, formData.typeId);
  const fields = getFieldsForType(formData.categoryId, formData.typeId);

  const cashAmount = parseFloat(formData.prizeAmount) || 0;

  // Resolve custom 'Other' inputs
  const getFieldValue = (fieldId: string): string => {
    const rawVal = formData[fieldId];
    if (rawVal === 'Other' && formData[`custom_${fieldId}`]) {
      return formData[`custom_${fieldId}`];
    }
    return rawVal || '';
  };

  // Find result and level values for score calculation
  const resolvedResult = getFieldValue('result') || getFieldValue('resultType') || '';
  const resolvedLevel = getFieldValue('level') || getFieldValue('sportsLevel') || '';

  const isTeamLead =
    formData.participationMode === 'team' && formData.teamRole === 'lead';

  const breakdown = calculateEstimatedPoints({
    basePoints: type?.scoring?.basePoints ?? 0,
    level: resolvedLevel,
    result: resolvedResult,
    cashPrize: cashAmount,
    isTeamLead,
  });

  // ─────────────────────────────────────────────────────────────
  // Dynamic Event Details Fields (Filtered to only non-empty)
  // ─────────────────────────────────────────────────────────────
  const visibleEventFields = useMemo(() => {
    return fields
      .filter((f) => {
        if (f.id === 'description') return false;
        if (f.showWhen) {
          const parentVal = formData[f.showWhen.fieldId];
          const matchVals = Array.isArray(f.showWhen.value)
            ? f.showWhen.value
            : [f.showWhen.value];
          if (!matchVals.includes(parentVal)) return false;
        }
        const val = getFieldValue(f.id);
        return val !== '' && val !== undefined && val !== null;
      })
      .map((f) => {
        let displayVal = getFieldValue(f.id);
        if (f.kind === 'date' && displayVal) {
          displayVal = formatDateDisplay(displayVal);
        } else if (f.id === 'semester' && displayVal) {
          displayVal =
            typeof displayVal === 'number' || !isNaN(Number(displayVal))
              ? `Semester ${displayVal}`
              : displayVal;
        }
        return {
          id: f.id,
          label: f.label,
          value: displayVal,
          isLong:
            f.label.toLowerCase().includes('title') ||
            f.label.toLowerCase().includes('name') ||
            f.label.toLowerCase().includes('description') ||
            displayVal.length > 24,
        };
      });
  }, [fields, formData]);

  // ─────────────────────────────────────────────────────────────
  // Normalized Uploaded Proofs List with Grouping
  // ─────────────────────────────────────────────────────────────
  const groupedProofs = useMemo(() => {
    const uploaded = formData.uploadedFiles || {};
    const reqDefs = getProofRequirements(
      formData.categoryId,
      formData.typeId,
      formData
    );

    // Map of normalized requirement labels
    const labelMap: Record<string, string> = {
      certificate: 'Certificate',
      resultSheet: 'Result Sheet',
      result_sheet: 'Result Sheet',
      projectProof: 'Project Proof',
      project_proof: 'Project Proof',
      presentationProof: 'Presentation Proof',
      presentation_proof: 'Presentation Proof',
      organizerConfirmation: 'Organizer Confirmation',
      organizer_confirmation: 'Organizer Confirmation',
      eventPhoto: 'Event Photo',
      event_photo: 'Event Photo',
      geotaggedPhoto: 'Geotagged Photo',
      geotagPhoto: 'Geotagged Photo',
      cashPrizeProof: 'Cash Prize Proof',
      cash_prize_proof: 'Cash Prize Proof',
    };

    reqDefs.forEach((r) => {
      labelMap[r.id] = r.label;
    });

    const normalizedKeys = new Set<string>();
    const allList: {
      key: string;
      label: string;
      fileName: string;
      fileType: 'pdf' | 'image';
      size: string;
      group: 'required' | 'additional' | 'special';
    }[] = [];

    // Deduplicate and populate
    Object.keys(uploaded).forEach((key) => {
      const file = uploaded[key];
      if (!file) return;

      // Normalize key (e.g. geotagPhoto -> geotaggedPhoto)
      const normKey =
        key === 'geotagPhoto' ? 'geotaggedPhoto' : key === 'cashPrize' ? 'cashPrizeProof' : key;

      if (normalizedKeys.has(normKey)) return;
      normalizedKeys.add(normKey);

      const label =
        labelMap[normKey] ||
        normKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase());

      const fileName = file.name || `${normKey}_document.pdf`;
      const isPdf =
        file.type === 'pdf' ||
        fileName.toLowerCase().endsWith('.pdf') ||
        label.toLowerCase().includes('cert') ||
        label.toLowerCase().includes('proof') ||
        label.toLowerCase().includes('letter');

      let group: 'required' | 'additional' | 'special' = 'additional';
      if (
        normKey === 'certificate' ||
        normKey === 'resultSheet' ||
        normKey === 'projectProof' ||
        normKey === 'paperPdf' ||
        normKey === 'patentDoc'
      ) {
        group = 'required';
      } else if (normKey === 'geotaggedPhoto' || normKey === 'cashPrizeProof') {
        group = 'special';
      }

      allList.push({
        key: normKey,
        label,
        fileName,
        fileType: isPdf ? 'pdf' : 'image',
        size: file.size || (isPdf ? '2.1 MB' : '1.5 MB'),
        group,
      });
    });

    const required = allList.filter((p) => p.group === 'required');
    const additional = allList.filter((p) => p.group === 'additional');
    const special = allList.filter((p) => p.group === 'special');

    return {
      totalCount: allList.length,
      allList,
      required,
      additional,
      special,
    };
  }, [formData]);

  const teamMembersList = formData.teamMembers || [];
  const displayedMembers = expandedMembers
    ? teamMembersList
    : teamMembersList.slice(0, 3);
  const hiddenMembersCount = teamMembersList.length - 3;

  return (
    <View style={styles.container}>
      {/* 1. Page Introduction Header */}
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>Review Achievement</Text>
        <Text style={styles.pageSubtitle}>Check your details before submitting.</Text>
      </View>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1: ACHIEVEMENT CATEGORY & TYPE
      ════════════════════════════════════════════════════════════ */}
      <ReviewSection
        title="Achievement"
        iconName="trophy-outline"
        onEdit={() => onEditSection(0)}
      >
        <Text style={styles.achievementPrimaryText}>
          {type?.label || formData.typeId}
        </Text>
        <Text style={styles.achievementSecondaryText}>
          {category?.title || 'Achievement Category'}
        </Text>
      </ReviewSection>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2: EVENT DETAILS (DYNAMIC GRID)
      ════════════════════════════════════════════════════════════ */}
      {visibleEventFields.length > 0 && (
        <ReviewSection
          title="Event Details"
          iconName="calendar-outline"
          onEdit={() => onEditSection(1)}
        >
          <View style={styles.eventGrid}>
            {visibleEventFields.map((f) => (
              <View
                key={f.id}
                style={[
                  styles.gridField,
                  f.isLong ? styles.gridFieldFull : styles.gridFieldHalf,
                ]}
              >
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <Text style={styles.fieldValue} numberOfLines={2}>
                  {f.value}
                </Text>
              </View>
            ))}
          </View>
        </ReviewSection>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECTION 3: PARTICIPATION & TEAM DETAILS
      ════════════════════════════════════════════════════════════ */}
      <ReviewSection
        title="Participation"
        iconName="people-outline"
        onEdit={() => onEditSection(0)}
      >
        {formData.participationMode === 'team' ? (
          <View>
            {/* Role and Lead Bonus Badge */}
            <View style={styles.teamHeaderRow}>
              <View>
                <Text style={styles.fieldLabel}>Role</Text>
                <Text style={styles.fieldValueBold}>
                  {formData.teamRole === 'lead' ? 'Team Lead' : 'Team Member'}
                </Text>
              </View>
              {isTeamLead && (
                <View style={styles.leadBonusBadge}>
                  <Ionicons name="sparkles" size={12} color="#059669" />
                  <Text style={styles.leadBonusText}>+2 Lead Bonus</Text>
                </View>
              )}
            </View>

            {/* Team Name */}
            {!!formData.teamName && (
              <View style={styles.teamNameRow}>
                <Text style={styles.fieldLabel}>Team Name</Text>
                <Text style={styles.fieldValue}>{formData.teamName}</Text>
              </View>
            )}

            {/* Team Members List */}
            {teamMembersList.length > 0 && (
              <View style={styles.membersSection}>
                <Text style={styles.fieldLabel}>
                  Team Members ({teamMembersList.length})
                </Text>
                <View style={styles.membersList}>
                  {displayedMembers.map((m: any) => {
                    const initials = m.name
                      ? m.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'TM';

                    return (
                      <View key={m.id || m.rollNumber} style={styles.memberCard}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberAvatarText}>{initials}</Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>{m.name}</Text>
                          <Text style={styles.memberMeta}>
                            {m.rollNumber} • {m.department}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Expand / Collapse for > 3 members */}
                {teamMembersList.length > 3 && (
                  <TouchableOpacity
                    style={styles.expandMembersBtn}
                    activeOpacity={0.7}
                    onPress={() => setExpandedMembers(!expandedMembers)}
                  >
                    <Text style={styles.expandMembersText}>
                      {expandedMembers
                        ? 'Show less'
                        : `+${hiddenMembersCount} more member${hiddenMembersCount > 1 ? 's' : ''}`}
                    </Text>
                    <Ionicons
                      name={expandedMembers ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color="#2563EB"
                      style={{ marginLeft: 3 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.individualRow}>
            <Text style={styles.fieldLabel}>Participation Mode</Text>
            <Text style={styles.fieldValueBold}>Individual Participation</Text>
          </View>
        )}
      </ReviewSection>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4: REWARD / CASH PRIZE (CONDITIONAL)
      ════════════════════════════════════════════════════════════ */}
      {formData.hasCashPrize && !!formData.prizeAmount && (
        <ReviewSection
          title="Reward"
          iconName="gift-outline"
          onEdit={() => onEditSection(1)}
        >
          <View style={styles.rewardRow}>
            <View>
              <Text style={styles.fieldLabel}>Cash Prize</Text>
              <Text style={styles.prizeAmountText}>₹{formData.prizeAmount}</Text>
            </View>
            <View style={styles.prizeBadge}>
              <Ionicons name="ribbon-outline" size={13} color="#2563EB" />
              <Text style={styles.prizeBadgeText}>Prize Received</Text>
            </View>
          </View>
        </ReviewSection>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECTION 5: UPLOADED PROOFS (CLEAN GROUPED LIST)
      ════════════════════════════════════════════════════════════ */}
      <ReviewSection
        title="Uploaded Proofs"
        iconName="document-attach-outline"
        badgeCount={groupedProofs.totalCount}
        onEdit={() => onEditSection(2)}
      >
        {groupedProofs.totalCount === 0 ? (
          <Text style={styles.emptyText}>No proof documents uploaded</Text>
        ) : (
          <View>
            {/* Required Proofs Subgroup */}
            {groupedProofs.required.length > 0 && (
              <View style={styles.proofGroup}>
                <Text style={styles.proofGroupTitle}>Required Proofs</Text>
                {groupedProofs.required.map((p) => (
                  <ProofItemRow
                    key={p.key}
                    label={p.label}
                    fileName={p.fileName}
                    fileType={p.fileType}
                    size={p.size}
                    onPress={() =>
                      setSelectedProof({
                        label: p.label,
                        fileName: p.fileName,
                        fileType: p.fileType,
                        fileSize: p.size,
                      })
                    }
                  />
                ))}
              </View>
            )}

            {/* Additional Proofs Subgroup */}
            {groupedProofs.additional.length > 0 && (
              <View style={styles.proofGroup}>
                <Text style={styles.proofGroupTitle}>Additional Proofs</Text>
                {groupedProofs.additional.map((p) => (
                  <ProofItemRow
                    key={p.key}
                    label={p.label}
                    fileName={p.fileName}
                    fileType={p.fileType}
                    size={p.size}
                    onPress={() =>
                      setSelectedProof({
                        label: p.label,
                        fileName: p.fileName,
                        fileType: p.fileType,
                        fileSize: p.size,
                      })
                    }
                  />
                ))}
              </View>
            )}

            {/* Special Proof Subgroup */}
            {groupedProofs.special.length > 0 && (
              <View style={styles.proofGroup}>
                <Text style={styles.proofGroupTitle}>Special Evidence</Text>
                {groupedProofs.special.map((p) => (
                  <ProofItemRow
                    key={p.key}
                    label={p.label}
                    fileName={p.fileName}
                    fileType={p.fileType}
                    size={p.size}
                    onPress={() =>
                      setSelectedProof({
                        label: p.label,
                        fileName: p.fileName,
                        fileType: p.fileType,
                        fileSize: p.size,
                      })
                    }
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ReviewSection>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6: ESTIMATED POINTS SUMMARY
      ════════════════════════════════════════════════════════════ */}
      <ReviewSection
        title="Estimated Points"
        iconName="calculator-outline"
      >
        <View style={styles.pointsTable}>
          {/* Base Points */}
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>
              Base Points ({resolvedResult || 'Participation'})
            </Text>
            <Text style={styles.pointsVal}>{breakdown.levelMultiplied} pts</Text>
          </View>

          {/* Team Lead Bonus */}
          {breakdown.teamLeadBonus > 0 && (
            <View style={styles.pointsRow}>
              <Text style={styles.pointsLabel}>Team Lead Bonus</Text>
              <Text style={styles.pointsBonus}>+{breakdown.teamLeadBonus} pts</Text>
            </View>
          )}

          {/* Cash Prize Bonus */}
          {breakdown.cashBonus > 0 && (
            <View style={styles.pointsRow}>
              <Text style={styles.pointsLabel}>Cash Prize Bonus</Text>
              <Text style={styles.pointsBonus}>+{breakdown.cashBonus} pts</Text>
            </View>
          )}

          <View style={styles.pointsDivider} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <View style={styles.totalValContainer}>
              <Text style={styles.totalNumber}>{breakdown.total}</Text>
              <Text style={styles.totalMax}> / 50 pts</Text>
            </View>
          </View>

          {/* Helper notice */}
          <Text style={styles.pointsNotice}>
            Final points are confirmed after faculty verification.
          </Text>
        </View>
      </ReviewSection>

      {/* ════════════════════════════════════════════════════════════
          7. CONFIRMATION CHECKBOX
      ════════════════════════════════════════════════════════════ */}
      <TouchableOpacity
        style={styles.declarationRow}
        activeOpacity={0.8}
        onPress={() => setDeclared(!declared)}
      >
        <View style={[styles.checkbox, declared && styles.checkboxActive]}>
          {declared && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
        <Text style={styles.declarationText}>
          I confirm that the information and uploaded proofs are accurate.
        </Text>
      </TouchableOpacity>

      {/* ════════════════════════════════════════════════════════════
          8. ACTIONS: SUBMIT & SAVE AS DRAFT
      ════════════════════════════════════════════════════════════ */}
      <View style={styles.actionsBlock}>
        {/* Primary Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, !declared && styles.submitBtnDisabled]}
          activeOpacity={0.85}
          onPress={() => setShowConfirmModal(true)}
          disabled={!declared || submitting}
        >
          <Ionicons
            name="paper-plane"
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.submitBtnText}>
            {submitting ? 'Submitting...' : 'Submit for Verification'}
          </Text>
        </TouchableOpacity>

        {/* Ghost Save as Draft Button */}
        <TouchableOpacity
          style={styles.ghostDraftBtn}
          activeOpacity={0.7}
          onPress={onSaveDraft}
          disabled={submitting}
        >
          <Ionicons name="bookmark-outline" size={16} color="#64748B" />
          <Text style={styles.ghostDraftText}>Save as Draft</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom padding for fixed navigation tab bar */}
      <View style={{ height: 40 }} />

      {/* ════════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════════ */}

      {/* Submission Confirmation Modal */}
      <SubmitConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          onSubmit();
        }}
        submitting={submitting}
      />

      {/* Proof Preview Modal */}
      {selectedProof && (
        <ProofPreviewModal
          visible={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          proofLabel={selectedProof.label}
          fileName={selectedProof.fileName}
          fileType={selectedProof.fileType}
          fileSize={selectedProof.fileSize}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  titleBlock: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  pageSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 2,
  },

  // Achievement Section
  achievementPrimaryText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  achievementSecondaryText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  // Event Details Grid
  eventGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridField: {
    marginBottom: 4,
  },
  gridFieldHalf: {
    width: '47%',
  },
  gridFieldFull: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  fieldValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Participation Section
  teamHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leadBonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  leadBonusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 3,
  },
  teamNameRow: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  membersSection: {
    marginTop: 4,
  },
  membersList: {
    marginTop: 6,
    gap: 6,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  memberMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  expandMembersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginTop: 4,
  },
  expandMembersText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  individualRow: {
    paddingVertical: 2,
  },

  // Reward Section
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prizeAmountText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  prizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  prizeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 4,
  },

  // Uploaded Proofs Section
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  proofGroup: {
    marginBottom: 8,
  },
  proofGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 2,
  },

  // Estimated Points Section
  pointsTable: {
    paddingVertical: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  pointsLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  pointsVal: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  pointsBonus: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#059669',
  },
  pointsDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalNumber: {
    fontSize: 19,
    fontWeight: '900',
    color: '#2563EB',
  },
  totalMax: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  pointsNotice: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // Declaration Checkbox
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  declarationText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },

  // Actions
  actionsBlock: {
    alignItems: 'center',
    gap: 10,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0.05,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ghostDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ghostDraftText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
});
