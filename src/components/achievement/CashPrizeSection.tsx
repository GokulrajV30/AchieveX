// ─────────────────────────────────────────────────────────────
// AchieveX — Cash Prize Section
// Display cash prize toggle, amount input, and display bonus point calculator
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormTextInput, FormToggle, SectionCard, InfoBanner } from './FormComponents';
import { getCashPrizeBonus } from '../../data/achievementConfig';

interface CashPrizeSectionProps {
  hasCashPrize: boolean;
  prizeAmount: string;
  errors: Record<string, string>;
  onHasPrizeChange: (hasPrize: boolean) => void;
  onAmountChange: (amount: string) => void;
}

export default function CashPrizeSection({
  hasCashPrize,
  prizeAmount,
  errors,
  onHasPrizeChange,
  onAmountChange,
}: CashPrizeSectionProps) {
  const amountNum = parseFloat(prizeAmount) || 0;
  const estimatedBonus = getCashPrizeBonus(amountNum);

  return (
    <SectionCard title="Cash Prize / Reward">
      <FormToggle
        label="Did you receive a cash prize?"
        value={hasCashPrize ? 'yes' : 'no'}
        onSelect={(v) => onHasPrizeChange(v === 'yes')}
        options={[
          { id: 'no', label: 'No', description: 'No monetary reward received', icon: 'close-outline' },
          { id: 'yes', label: 'Yes', description: 'Received monetary reward / prize', icon: 'cash-outline' },
        ]}
      />

      {hasCashPrize && (
        <View style={styles.cashDetails}>
          <FormTextInput
            label="Prize Amount"
            placeholder="Enter cash prize amount"
            value={prizeAmount}
            onChangeText={onAmountChange}
            keyboardType="numeric"
            prefix="₹"
            required
            error={errors.prizeAmount}
          />

          {amountNum > 0 && estimatedBonus > 0 && (
            <View style={styles.bonusBanner}>
              <Text style={styles.bonusText}>
                Estimated Bonus Points: <Text style={styles.bonusHighlight}>+{estimatedBonus} Points</Text>
              </Text>
            </View>
          )}

          <InfoBanner
            type="info"
            message="Cash-prize points are added as a bonus after successful verification. Official proof of cash prize (announcement, receipt, payment slip, or award certificate stating prize) is required."
          />
        </View>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  cashDetails: {
    marginTop: 16,
  },
  bonusBanner: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  bonusHighlight: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803D',
  },
});
