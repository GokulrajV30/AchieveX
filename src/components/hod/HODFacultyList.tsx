// ─────────────────────────────────────────────────────────────
// AchieveX — HOD Faculty Directory Screen
// Lists all CSE (IoT) Faculty Members with achievement counts
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getHODStore, type HODFacultyMember } from '../../data/hodWorkspaceData';
import HODHeroCard from './HODHeroCard';
import HODBottomTab from './HODBottomTab';

interface HODFacultyListProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onSelectFaculty?: (faculty: HODFacultyMember) => void;
}

export default function HODFacultyList({
  onGoBack,
  onNavigate,
  onSelectFaculty,
}: HODFacultyListProps) {
  const store = getHODStore();
  const facultyList = store.faculty;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaculty = facultyList.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.facultyId.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q)
    );
  });

  const handleOpenDetails = (fac: HODFacultyMember) => {
    if (onSelectFaculty) {
      onSelectFaculty(fac);
    }
    onNavigate('hodFacultyDetails', { facultyId: fac.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onGoBack}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Department Faculty</Text>
            <Text style={styles.headerSubtitle}>CSE (IoT) Directory</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Standard HOD Hero Card (Medium Size) */}
          <HODHeroCard
            title="DEPARTMENT FACULTY"
            subtitle="CSE (IoT)"
            icon="briefcase"
            primaryNumber={facultyList.length}
            primaryLabel="Total Faculty"
            gaugePercent={94}
            gaugeNumber="94%"
            gaugeLabel="Active"
            gaugeSubtext="Rate"
            size="medium"
          />

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search faculty by name, ID or role..."
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

          {/* Faculty List */}
          {filteredFaculty.map((fac) => (
            <TouchableOpacity
              key={fac.id}
              style={styles.facultyCard}
              activeOpacity={0.75}
              onPress={() => handleOpenDetails(fac)}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={18} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.facName}>{fac.name}</Text>
                  <Text style={styles.facDesignation}>{fac.designation}</Text>
                  <Text style={styles.facMeta}>
                    {fac.facultyId} • {fac.specialization}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.statPill}>
                  <Text style={styles.statPillLabel}>Achievements:</Text>
                  <Text style={styles.statPillValue}>{fac.achievementsCount}</Text>
                </View>
                <View style={[styles.statPill, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.statPillLabel, { color: '#16A34A' }]}>Verified:</Text>
                  <Text style={[styles.statPillValue, { color: '#16A34A' }]}>
                    {fac.verifiedCount}
                  </Text>
                </View>
                {fac.pendingCount > 0 && (
                  <View style={[styles.statPill, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.statPillLabel, { color: '#D97706' }]}>Pending:</Text>
                    <Text style={[styles.statPillValue, { color: '#D97706' }]}>
                      {fac.pendingCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Nav */}
        <HODBottomTab activeTab="faculty" onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
  },
  facultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  facDesignation: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 1,
  },
  facMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    gap: 4,
  },
  statPillLabel: {
    fontSize: 10.5,
    color: '#475569',
  },
  statPillValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
});
