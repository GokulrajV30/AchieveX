// ─────────────────────────────────────────────────────────────
// AchieveX — Progress Stepper
// 4-step horizontal indicator: Category → Details → Proof → Review
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const STEPS = ['Category', 'Details', 'Proof', 'Review'] as const;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_COMPACT = SCREEN_WIDTH < 380;

export type StepperIndex = 0 | 1 | 2 | 3;

interface ProgressStepperProps {
  /** 0-based active step index (0=Category, 1=Details, 2=Proof, 3=Review) */
  activeStep: StepperIndex;
}

export default function ProgressStepper({ activeStep }: ProgressStepperProps) {
  if (IS_COMPACT) {
    // Compact mode: "Step 2 of 4" + progress bar
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLabel}>
          Step {activeStep + 1} of {STEPS.length} — <Text style={styles.compactStepName}>{STEPS[activeStep]}</Text>
        </Text>
        <View style={styles.compactBarTrack}>
          <View style={[styles.compactBarFill, { width: `${((activeStep + 1) / STEPS.length) * 100}%` }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {STEPS.map((step, idx) => {
        const isActive = idx === activeStep;
        const isCompleted = idx < activeStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <View key={step} style={styles.stepRow}>
            {/* Circle */}
            <View style={styles.stepGroup}>
              <View style={[
                styles.circle,
                isCompleted && styles.circleCompleted,
                isActive && styles.circleActive,
              ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text style={[
                    styles.circleNum,
                    isActive && styles.circleNumActive,
                  ]}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                isActive && styles.stepLabelActive,
                isCompleted && styles.stepLabelCompleted,
              ]}>
                {step}
              </Text>
            </View>

            {/* Connector line */}
            {!isLast && (
              <View style={styles.lineWrapper}>
                <View style={[styles.line, isCompleted && styles.lineCompleted]} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F5F0',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepGroup: {
    alignItems: 'center',
    width: 56,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  circleCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  circleNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  circleNumActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  stepLabelCompleted: {
    color: '#16A34A',
  },
  lineWrapper: {
    justifyContent: 'center',
    paddingTop: 14,
    marginHorizontal: 4,
  },
  line: {
    width: 36,
    height: 2.5,
    backgroundColor: '#E5E7EB',
    borderRadius: 1.5,
  },
  lineCompleted: {
    backgroundColor: '#16A34A',
  },

  // Compact mode
  compactContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F8F5F0',
  },
  compactLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  compactStepName: {
    color: '#2563EB',
    fontWeight: '700',
  },
  compactBarTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
});
