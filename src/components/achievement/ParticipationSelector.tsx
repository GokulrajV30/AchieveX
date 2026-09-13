// ─────────────────────────────────────────────────────────────
// AchieveX — Participation Selector (Step 1c)
// Individual / Team selection + Team role + Team member picker (by Roll Number)
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FormTextInput, FormToggle, InfoBanner } from './FormComponents';
import { STUDENT_DATABASE, LOGGED_IN_STUDENT, type StudentRecord } from '../../data/achievementConfig';

export interface ParticipationData {
  mode: 'individual' | 'team' | '';
  teamRole: 'lead' | 'member' | '';
  teamName: string;
  teamMembers: StudentRecord[];
}

interface ParticipationSelectorProps {
  data: ParticipationData;
  onChange: (data: ParticipationData) => void;
}

export default function ParticipationSelector({ data, onChange }: ParticipationSelectorProps) {
  const [memberSearchOpen, setMemberSearchOpen] = useState(false);
  const [rollSearch, setRollSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [foundStudent, setFoundStudent] = useState<StudentRecord | null>(null);

  const updateField = <K extends keyof ParticipationData>(key: K, value: ParticipationData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const handleRollSearch = (text: string) => {
    setRollSearch(text);
    setSearchError('');
    setFoundStudent(null);

    if (!text.trim()) return;

    // Check if adding self
    if (text.trim().toUpperCase() === LOGGED_IN_STUDENT.rollNumber.toUpperCase()) {
      setSearchError('You are already the Team Lead.');
      return;
    }

    // Check if duplicate
    const isDuplicate = data.teamMembers.find(
      (m) => m.rollNumber.toUpperCase() === text.trim().toUpperCase()
    );
    if (isDuplicate) {
      setSearchError('Student already added.');
      return;
    }

    // Lookup in database
    const student = STUDENT_DATABASE.find(
      (s) => s.rollNumber.toUpperCase() === text.trim().toUpperCase()
    );

    if (student) {
      setFoundStudent(student);
    } else {
      // Show "Not found" only if roll number format length is somewhat complete
      if (text.length >= 7) {
        setSearchError('Student not found. Check the roll number and try again.');
      }
    }
  };

  const addMember = () => {
    if (foundStudent) {
      updateField('teamMembers', [...data.teamMembers, foundStudent]);
      setRollSearch('');
      setFoundStudent(null);
      setMemberSearchOpen(false);
    }
  };

  const removeMember = (id: string) => {
    updateField('teamMembers', data.teamMembers.filter((m) => m.id !== id));
  };

  return (
    <View>
      {/* Individual / Team selection */}
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>How did you participate?</Text>
        <Text style={styles.pageSubtitle}>Select your participation type for this achievement.</Text>
      </View>

      <FormToggle
        label=""
        value={data.mode}
        onSelect={(v) => updateField('mode', v as 'individual' | 'team')}
        options={[
          { id: 'individual', label: 'Individual', description: 'I participated on my own.', icon: 'person-outline' },
          { id: 'team', label: 'Team', description: 'This achievement was earned with other students.', icon: 'people-outline' },
        ]}
      />

      {/* Team Role */}
      {data.mode === 'team' && (
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>What is your team role?</Text>

          <View style={styles.roleRow}>
            {/* Team Lead Card */}
            <TouchableOpacity
              style={[styles.roleCard, data.teamRole === 'lead' && styles.roleCardActive]}
              activeOpacity={0.7}
              onPress={() => updateField('teamRole', 'lead')}
            >
              <View style={[styles.roleIcon, data.teamRole === 'lead' && styles.roleIconActive]}>
                <Ionicons name="shield-checkmark-outline" size={22} color={data.teamRole === 'lead' ? '#2563EB' : '#6B7280'} />
              </View>
              <Text style={[styles.roleLabel, data.teamRole === 'lead' && styles.roleLabelActive]}>Team Lead</Text>
              <Text style={styles.roleDesc}>I am submitting this achievement for my team.</Text>
              {data.teamRole === 'lead' && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Team Member Card */}
            <TouchableOpacity
              style={[styles.roleCard, data.teamRole === 'member' && styles.roleCardActive]}
              activeOpacity={0.7}
              onPress={() => updateField('teamRole', 'member')}
            >
              <View style={[styles.roleIcon, data.teamRole === 'member' && styles.roleIconActive]}>
                <Ionicons name="person-outline" size={22} color={data.teamRole === 'member' ? '#2563EB' : '#6B7280'} />
              </View>
              <Text style={[styles.roleLabel, data.teamRole === 'member' && styles.roleLabelActive]}>Team Member</Text>
              <Text style={styles.roleDesc}>Another team member is submitting the common achievement.</Text>
              {data.teamRole === 'member' && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Team Lead: Team Name + Members */}
          {data.teamRole === 'lead' && (
            <View style={styles.leadSection}>
              <FormTextInput
                label="Team Name"
                value={data.teamName}
                onChangeText={(v) => updateField('teamName', v)}
                placeholder="Enter team name"
                required
              />

              {/* Team Members List */}
              <Text style={styles.memberLabel}>
                Team Members <Text style={styles.required}>*</Text>
              </Text>

              {/* Added Members */}
              {data.teamMembers.length > 0 && (
                <View style={styles.membersList}>
                  {data.teamMembers.map((member) => (
                    <View key={member.id} style={styles.memberChip}>
                      <View style={styles.checkmarkIcon}>
                        <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.name} ({member.rollNumber})</Text>
                        <Text style={styles.memberDept}>{member.department} • {member.year}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeMember(member.id)} activeOpacity={0.7} style={{ padding: 4 }}>
                        <Ionicons name="close-circle" size={20} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Search trigger */}
              <TouchableOpacity
                style={styles.addMemberBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setRollSearch('');
                  setSearchError('');
                  setFoundStudent(null);
                  setMemberSearchOpen(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
                <Text style={styles.addMemberText}>Add Team Member</Text>
              </TouchableOpacity>

              {/* Team Lead Bonus Info */}
              <InfoBanner
                type="info"
                message="You receive a +2 contribution bonus for completing and submitting the team achievement for your team. Awarded after verification."
              />

              <InfoBanner
                type="info"
                icon="notifications-outline"
                message="Your team members will be notified after submission. They can add their individual certificates to complete their achievement records."
              />
            </View>
          )}

          {/* Team Member Info */}
          {data.teamRole === 'member' && (
            <InfoBanner
              type="info"
              message="Your Team Lead will submit the common achievement details. You can add your individual certificate once the team achievement is submitted."
            />
          )}
        </View>
      )}

      {/* Member Search Modal */}
      <Modal visible={memberSearchOpen} transparent animationType="fade" onRequestClose={() => setMemberSearchOpen(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMemberSearchOpen(false)}
        >
          <View style={styles.searchSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.searchHandle} />
            <Text style={styles.searchTitle}>Add Team Member</Text>
            <Text style={styles.searchHelper}>Enter the student's roll number to add them to your team.</Text>

            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                value={rollSearch}
                onChangeText={handleRollSearch}
                placeholder="Enter Roll Number (e.g. 23CI024)"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                autoFocus
              />
            </View>

            {/* Error Message */}
            {searchError ? (
              <Text style={styles.errorText}>{searchError}</Text>
            ) : null}

            {/* Found Student Result */}
            {foundStudent ? (
              <View style={styles.resultItem}>
                <View style={styles.resultAvatar}>
                  <Text style={styles.resultAvatarText}>{foundStudent.name.charAt(0)}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{foundStudent.name}</Text>
                  <Text style={styles.resultRoll}>{foundStudent.rollNumber}</Text>
                  <Text style={styles.resultDept}>{foundStudent.department} • {foundStudent.year}</Text>
                </View>
                <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={addMember}>
                  <Text style={styles.addButtonText}>+ Add Member</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Close Button */}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setMemberSearchOpen(false)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: { marginBottom: 20 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20 },

  teamSection: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14 },

  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB', padding: 16,
    alignItems: 'center', position: 'relative',
  },
  roleCardActive: { borderColor: '#2563EB', backgroundColor: '#FAFBFF' },
  roleIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  roleIconActive: { backgroundColor: '#DBEAFE' },
  roleLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 4, textAlign: 'center' },
  roleLabelActive: { color: '#1D4ED8' },
  roleDesc: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 16 },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
  },

  leadSection: { marginTop: 8 },
  memberLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 },
  required: { color: '#DC2626' },

  membersList: { marginBottom: 12 },
  memberChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    padding: 12, marginBottom: 8,
  },
  checkmarkIcon: {
    marginRight: 10,
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  memberDept: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  addMemberBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EFF6FF', borderRadius: 12, borderWidth: 1.5,
    borderColor: '#BFDBFE', borderStyle: 'dashed',
    paddingVertical: 14, marginBottom: 16,
  },
  addMemberText: { fontSize: 14, fontWeight: '600', color: '#2563EB', marginLeft: 8 },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  searchSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30,
  },
  searchHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB',
    alignSelf: 'center', marginBottom: 16,
  },
  searchTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 },
  searchHelper: { fontSize: 12, color: '#6B7280', marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, height: 46,
    marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1F2937', marginLeft: 10 },
  errorText: { fontSize: 12, color: '#DC2626', fontWeight: '600', marginTop: 4, marginBottom: 12 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  resultAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  resultAvatarText: { fontSize: 15, fontWeight: '700', color: '#2563EB' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  resultRoll: { fontSize: 12, fontWeight: '600', color: '#4B5563', marginTop: 1 },
  resultDept: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
});
