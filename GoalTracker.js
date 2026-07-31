import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, TextInput, Alert, Modal, Pressable
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#7C3AED';
const PURPLE_LIGHT = '#F5F0FF';
const BG = '#FAFAFC';

// Goal Progress Card Component to embed in Dashboards
export const GoalProgressCard = ({ currentGoal, onNavigate }) => {
  const currentPoints = currentGoal?.currentPoints || 34;
  const targetPoints = currentGoal?.targetPoints || 50;
  const goalTitle = currentGoal?.title || 'Become Gold Explorer';
  const targetDate = currentGoal?.targetDate || '31 Dec 2026';
  
  const percentage = Math.min(100, Math.round((currentPoints / targetPoints) * 100));
  const remainingPoints = Math.max(0, targetPoints - currentPoints);

  return (
    <View style={styles.goalCardContainer}>
      <View style={styles.goalCardHeader}>
        <View style={styles.goalTitleRow}>
          <Text style={styles.goalEmoji}>🎯</Text>
          <Text style={styles.goalCardCategory}>GOAL TRACKER</Text>
        </View>
        <TouchableOpacity style={styles.viewGoalBtn} onPress={onNavigate} activeOpacity={0.8}>
          <Text style={styles.viewGoalBtnText}>View Goal →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.goalTitleText}>{goalTitle}</Text>

      <View style={styles.goalProgressInfoRow}>
        <Text style={styles.goalProgressLabel}>Progress</Text>
        <Text style={styles.goalProgressValue}>{currentPoints} / {targetPoints} Points</Text>
      </View>

      <View style={styles.goalProgressBarTrack}>
        <View style={[styles.goalProgressBarFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.goalMetricsRow}>
        <View style={styles.goalBadgePill}>
          <Text style={styles.goalBadgeText}>{percentage}% Completed</Text>
        </View>
        <Text style={styles.goalMetricSubText}>{remainingPoints} Points Remaining</Text>
        <Text style={styles.goalMetricDateText}>Target: {targetDate}</Text>
      </View>
    </View>
  );
};

// Main Goal Tracker Screen Component
export const GoalTrackerScreen = ({ onBack, currentGoal, onNavigateCreateGoal, goalHistory = [] }) => {
  const goal = currentGoal || {
    title: 'Become Gold Explorer',
    targetPoints: 50,
    currentPoints: 34,
    deadline: '31 Dec 2026',
    category: 'General Achievement',
    status: 'On Track', // 'On Track' | 'Needs Attention' | 'Completed'
    createdDate: '15 Jan 2026'
  };

  const currentPoints = goal.currentPoints || 34;
  const targetPoints = goal.targetPoints || 50;
  const percentage = Math.min(100, Math.round((currentPoints / targetPoints) * 100));
  const remainingPoints = Math.max(0, targetPoints - currentPoints);

  // Default history if none provided
  const contributingItems = goalHistory.length > 0 ? goalHistory : [
    { id: '1', title: 'Smart India Hackathon 2026', points: 7, date: '20 Jul 2026', category: 'Hackathon' },
    { id: '2', title: 'NPTEL Cloud Computing', points: 4, date: '18 Jul 2026', category: 'Certification' },
    { id: '3', title: 'IoT Systems & Sensors Workshop', points: 3, date: '10 Jun 2026', category: 'Workshop' },
    { id: '4', title: 'National Level Paper Presentation', points: 9, date: '15 May 2026', category: 'Paper' },
    { id: '5', title: 'College Sports Championship', points: 6, date: '02 Apr 2026', category: 'Sports' },
    { id: '6', title: 'Web Dev Workshop', points: 5, date: '12 Feb 2026', category: 'Workshop' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Goal Tracker</Text>
        <TouchableOpacity onPress={onNavigateCreateGoal} style={styles.addGoalHeaderBtn} activeOpacity={0.8}>
          <Feather name="plus" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        
        {/* Status Chip Header */}
        <View style={styles.statusRow}>
          <View style={[
            styles.statusPill, 
            goal.status === 'Completed' ? { backgroundColor: '#DCFCE7' } :
            goal.status === 'Needs Attention' ? { backgroundColor: '#FEE2E2' } :
            { backgroundColor: '#EDE9FE' }
          ]}>
            <Text style={[
              styles.statusPillText,
              goal.status === 'Completed' ? { color: '#16A34A' } :
              goal.status === 'Needs Attention' ? { color: '#EF4444' } :
              { color: PURPLE }
            ]}>
              ● {goal.status || 'On Track'}
            </Text>
          </View>
          <Text style={styles.createdDateText}>Created {goal.createdDate}</Text>
        </View>

        {/* Current Goal Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>CURRENT GOAL</Text>
            <Text style={styles.heroTitle}>{goal.title}</Text>
            {goal.category ? <Text style={styles.heroCategoryTag}>Tag: {goal.category}</Text> : null}
          </View>

          <View style={styles.progressCircleContainer}>
            <View style={styles.progressRingOuter}>
              <View style={styles.progressRingInner}>
                <Text style={styles.progressRingPct}>{percentage}%</Text>
                <Text style={styles.progressRingSub}>Achieved</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricVal}>{currentPoints}</Text>
              <Text style={styles.metricSub}>Current Points</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#D97706' }]}>{remainingPoints}</Text>
              <Text style={styles.metricSub}>Remaining</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: '#2563EB' }]}>{targetPoints}</Text>
              <Text style={styles.metricSub}>Target Points</Text>
            </View>
          </View>

          <View style={styles.linearTrack}>
            <View style={[styles.linearFill, { width: `${percentage}%` }]} />
          </View>
        </View>

        {/* Timeline Details Box */}
        <View style={styles.detailGridBox}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={16} color={PURPLE} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>{goal.deadline}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Feather name="clock" size={16} color="#16A34A" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.detailLabel}>Estimated Completion</Text>
              <Text style={styles.detailValue}>In ~45 Days</Text>
            </View>
          </View>
        </View>

        {/* Action button to change goal */}
        <TouchableOpacity style={styles.setNewGoalBtn} onPress={onNavigateCreateGoal} activeOpacity={0.85}>
          <Feather name="target" size={16} color={PURPLE} />
          <Text style={styles.setNewGoalBtnText}>Set New Goal</Text>
        </TouchableOpacity>

        {/* Goal History / Contributing Achievements */}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionHeaderTitle}>Achievements Contributing to Goal</Text>

          {contributingItems.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyIconBox}>
                <Ionicons name="trophy-outline" size={20} color={PURPLE} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historySub}>{item.category} • {item.date}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsBadgeText}>+{item.points} pts</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// Create Goal Screen Component
export const CreateGoalScreen = ({ onBack, onSaveGoal }) => {
  const [goalName, setGoalName] = useState('');
  const [targetPoints, setTargetPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');

  const suggestedGoals = [
    { title: 'Reach Bronze Explorer', points: '50', category: 'Milestone' },
    { title: 'Reach Silver Explorer', points: '100', category: 'Milestone' },
    { title: 'Reach Gold Explorer', points: '200', category: 'Milestone' },
    { title: 'Earn 50 Achievement Points', points: '50', category: 'Points' },
    { title: 'Publish 2 Research Papers', points: '20', category: 'Research' },
    { title: 'Complete 5 Certifications', points: '15', category: 'Certification' },
    { title: 'Win 3 Technical Competitions', points: '25', category: 'Hackathon' },
  ];

  const handleSelectSuggested = (item) => {
    setGoalName(item.title);
    setTargetPoints(item.points);
    setCategory(item.category);
    setDeadline('31 Dec 2026');
  };

  const handleSave = () => {
    if (!goalName.trim() || !targetPoints.trim()) {
      Alert.alert('Required Fields', 'Please enter Goal Name and Target Points.');
      return;
    }
    const newGoalObj = {
      title: goalName,
      targetPoints: parseInt(targetPoints) || 50,
      currentPoints: 34,
      deadline: deadline || '31 Dec 2026',
      category: category || 'General',
      status: 'On Track',
      createdDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    onSaveGoal(newGoalObj);
    Alert.alert('Goal Saved 🎯', `Your new goal "${goalName}" is now active!`);
    onBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Set New Goal</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        
        {/* Suggested Goals Quick Chips */}
        <Text style={styles.formSectionTitle}>⚡ Suggested Goals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {suggestedGoals.map((s, idx) => (
            <TouchableOpacity key={idx} style={styles.suggestedChip} onPress={() => handleSelectSuggested(s)}>
              <Text style={styles.suggestedChipText}>{s.title}</Text>
              <Text style={styles.suggestedChipSub}>Target: {s.points} pts</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.formSectionTitle}>Goal Details</Text>

        <Text style={styles.inputLabel}>Goal Name *</Text>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="e.g. Become Gold Explorer"
            placeholderTextColor="#98A2B3" value={goalName} onChangeText={setGoalName} />
          <Feather name="target" size={18} color={PURPLE} style={styles.inputIcon} />
        </View>

        <Text style={styles.inputLabel}>Target Points *</Text>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="e.g. 50" keyboardType="numeric"
            placeholderTextColor="#98A2B3" value={targetPoints} onChangeText={setTargetPoints} />
          <Ionicons name="star-outline" size={18} color={PURPLE} style={styles.inputIcon} />
        </View>

        <Text style={styles.inputLabel}>Deadline</Text>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="DD / MM / YYYY (e.g. 31 Dec 2026)"
            placeholderTextColor="#98A2B3" value={deadline} onChangeText={setDeadline} />
          <Feather name="calendar" size={18} color="#98A2B3" style={styles.inputIcon} />
        </View>

        <Text style={styles.inputLabel}>Category (Optional)</Text>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="e.g. Research, Hackathon, Milestone"
            placeholderTextColor="#98A2B3" value={category} onChangeText={setCategory} />
          <Feather name="tag" size={18} color="#98A2B3" style={styles.inputIcon} />
        </View>

        {/* Buttons */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Save Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  screenHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F5FF', justifyContent: 'center', alignItems: 'center' },
  screenHeaderTitle: { fontSize: 17, fontWeight: '800', color: '#1D2939' },
  addGoalHeaderBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  
  // Dashboard Widget Styles
  goalCardContainer: {
    marginHorizontal: 16, marginTop: 10, marginBottom: 18,
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18,
    borderWidth: 1.5, borderColor: '#EDE9FE',
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3
  },
  goalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  goalEmoji: { fontSize: 16, marginRight: 6 },
  goalCardCategory: { fontSize: 11, fontWeight: '800', color: PURPLE, letterSpacing: 0.8 },
  viewGoalBtn: { backgroundColor: '#F5F0FF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  viewGoalBtnText: { fontSize: 11.5, fontWeight: '800', color: PURPLE },
  goalTitleText: { fontSize: 17, fontWeight: '900', color: '#1D2939', marginBottom: 12 },
  goalProgressInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalProgressLabel: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  goalProgressValue: { fontSize: 12.5, fontWeight: '800', color: PURPLE },
  goalProgressBarTrack: { height: 8, backgroundColor: '#EDE9FE', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  goalProgressBarFill: { height: '100%', backgroundColor: PURPLE, borderRadius: 4 },
  goalMetricsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goalBadgePill: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  goalBadgeText: { fontSize: 10.5, fontWeight: '800', color: '#16A34A' },
  goalMetricSubText: { fontSize: 11.5, fontWeight: '700', color: '#D97706' },
  goalMetricDateText: { fontSize: 11, color: '#94A3B8' },

  // Goal Tracker Page Styles
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusPillText: { fontSize: 12, fontWeight: '800' },
  createdDateText: { fontSize: 12, color: '#94A3B8' },
  heroCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20,
    borderWidth: 1, borderColor: '#EDE9FE',
    shadowColor: '#101828', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 3, marginBottom: 16
  },
  heroHeader: { alignItems: 'center', marginBottom: 16 },
  heroLabel: { fontSize: 10, fontWeight: '800', color: PURPLE, letterSpacing: 1 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#1D2939', marginTop: 4, textAlign: 'center' },
  heroCategoryTag: { fontSize: 11.5, color: '#64748B', marginTop: 4 },
  progressCircleContainer: { alignItems: 'center', marginVertical: 10 },
  progressRingOuter: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 8, borderColor: PURPLE,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5FF'
  },
  progressRingInner: { alignItems: 'center' },
  progressRingPct: { fontSize: 24, fontWeight: '900', color: PURPLE },
  progressRingSub: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  metricGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 16, marginBottom: 14 },
  metricCell: { alignItems: 'center' },
  metricVal: { fontSize: 20, fontWeight: '900', color: '#1D2939' },
  metricSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  metricDivider: { width: 1, height: 26, backgroundColor: '#F1F5F9' },
  linearTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  linearFill: { height: '100%', backgroundColor: PURPLE },
  detailGridBox: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  detailItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  detailLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  detailValue: { fontSize: 12.5, fontWeight: '800', color: '#1D2939', marginTop: 2 },
  setNewGoalBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F0FF', paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#EDE9FE'
  },
  setNewGoalBtnText: { fontSize: 14, fontWeight: '800', color: PURPLE },
  sectionHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#1D2939', marginBottom: 12 },
  historyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  historyIconBox: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center' },
  historyTitle: { fontSize: 13.5, fontWeight: '700', color: '#1D2939' },
  historySub: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  pointsBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pointsBadgeText: { fontSize: 12, fontWeight: '800', color: '#16A34A' },

  // Create Goal Styles
  formSectionTitle: { fontSize: 14, fontWeight: '800', color: '#1D2939', marginTop: 16, marginBottom: 10 },
  suggestedChip: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginRight: 10,
    borderWidth: 1, borderColor: '#EDE9FE', width: 170
  },
  suggestedChipText: { fontSize: 12.5, fontWeight: '700', color: '#1D2939' },
  suggestedChipSub: { fontSize: 11, color: PURPLE, fontWeight: '600', marginTop: 4 },
  inputLabel: { fontSize: 12.5, fontWeight: '700', color: '#344054', marginTop: 12, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D0D5DD',
    borderRadius: 12, paddingHorizontal: 14, height: 46
  },
  input: { flex: 1, fontSize: 14, color: '#1D2939' },
  inputIcon: { marginLeft: 8 },
  saveBtn: { backgroundColor: PURPLE, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  cancelBtn: { backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
});
