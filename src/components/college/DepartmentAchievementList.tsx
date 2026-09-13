// ─────────────────────────────────────────────────────────────
// AchieveX — Department Person Achievement List (Level 2 Drill-Down)
// Shared across Head and Principal workspaces.
// Displays student list (with Search + Year Filter) or faculty list (Search only).
// Compact, institutional design with seamless navigation to person detail.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getDepartmentStudents,
  getDepartmentFaculty,
  type CollegePersonSummary,
} from '../../data/collegeDrilldownData';

interface DepartmentAchievementListProps {
  departmentCode: string;
  departmentName: string;
  targetType: 'student' | 'faculty';
  viewerRole: 'head' | 'principal';
  onGoBack: () => void;
  onSelectPerson: (person: CollegePersonSummary) => void;
}

const YEAR_OPTIONS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

export default function DepartmentAchievementList({
  departmentCode,
  departmentName,
  targetType,
  viewerRole,
  onGoBack,
  onSelectPerson,
}: DepartmentAchievementListProps) {
  const insets = useSafeAreaInsets();
  const isStudent = targetType === 'student';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Filter persons
  const people = useMemo(() => {
    if (isStudent) {
      return getDepartmentStudents(departmentCode, selectedYear, searchQuery);
    }
    return getDepartmentFaculty(departmentCode, searchQuery);
  }, [isStudent, departmentCode, selectedYear, searchQuery]);

  const subtitle = isStudent
    ? 'Student achievement activity'
    : 'Faculty achievement activity';

  const bottomPadding = insets.bottom + 80;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        {/* ════════════════════════════════════════════════
            1. TOP HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={onGoBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>{departmentCode}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            2. SEARCH & YEAR FILTER
        ════════════════════════════════════════════════ */}
        <View style={styles.filterSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder={isStudent ? 'Search by name or register no...' : 'Search faculty name or title...'}
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Year Dropdown trigger button ONLY FOR STUDENTS */}
            {isStudent && (
              <TouchableOpacity
                style={[styles.yearDropdownBtn, showYearDropdown && styles.yearDropdownBtnActive]}
                activeOpacity={0.75}
                onPress={() => setShowYearDropdown((prev) => !prev)}
              >
                <Text style={styles.yearDropdownText} numberOfLines={1}>
                  {selectedYear === 'All Years' ? 'All Years' : selectedYear.replace(' Year', ' Yr')}
                </Text>
                <Ionicons
                  name={showYearDropdown ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color="#2563EB"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Expandable Year Filter Options (Only for Students) */}
          {isStudent && showYearDropdown && (
            <View style={styles.yearFilterPillsRow}>
              {YEAR_OPTIONS.map((yr) => {
                const isActive = selectedYear === yr;
                return (
                  <TouchableOpacity
                    key={yr}
                    style={[styles.yearPill, isActive && styles.yearPillActive]}
                    onPress={() => {
                      setSelectedYear(yr);
                      setShowYearDropdown(false);
                    }}
                  >
                    <Text style={[styles.yearPillText, isActive && styles.yearPillTextActive]}>
                      {yr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ════════════════════════════════════════════════
            3. PERSON LIST
        ════════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              {isStudent ? 'STUDENTS' : 'FACULTY'}
            </Text>
            <Text style={styles.listCountBadge}>
              {people.length} {people.length === 1 ? (isStudent ? 'Student' : 'Faculty') : (isStudent ? 'Students' : 'Faculty')}
            </Text>
          </View>

          {people.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name={isStudent ? 'school-outline' : 'briefcase-outline'}
                size={34}
                color="#94A3B8"
              />
              <Text style={styles.emptyTitle}>
                {isStudent ? 'No Student Achievements' : 'No Faculty Achievements'}
              </Text>
              <Text style={styles.emptySub}>
                {isStudent
                  ? 'No verified student achievements match the selected filters.'
                  : 'No verified faculty achievements match the search query.'}
              </Text>
              {(searchQuery.length > 0 || selectedYear !== 'All Years') && (
                <TouchableOpacity
                  style={styles.resetFilterBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedYear('All Years');
                  }}
                >
                  <Text style={styles.resetFilterText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            people.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={styles.personCard}
                activeOpacity={0.75}
                onPress={() => onSelectPerson(person)}
              >
                <View style={styles.personAvatar}>
                  <Text style={styles.personAvatarText}>
                    {person.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>

                <View style={styles.personInfoCol}>
                  <Text style={styles.personName} numberOfLines={1}>
                    {person.name}
                  </Text>

                  {isStudent ? (
                    <Text style={styles.personMetaSub} numberOfLines={1}>
                      {person.registerNumber ? `Reg: ${person.registerNumber}` : ''}
                      {person.registerNumber && person.year ? ' • ' : ''}
                      {person.year || ''}
                    </Text>
                  ) : (
                    <Text style={styles.personMetaSub} numberOfLines={1}>
                      {person.designation || 'Faculty Member'}
                    </Text>
                  )}

                  <View style={styles.achievementBadgeRow}>
                    <Ionicons name="ribbon" size={13} color="#2563EB" style={{ marginRight: 4 }} />
                    <Text style={styles.achievementBadgeText}>
                      <Text style={styles.achievementCountBold}>
                        {person.verifiedAchievementsCount}
                      </Text>{' '}
                      Achievements
                    </Text>
                  </View>
                </View>

                <View style={styles.chevronWrapper}>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
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
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  yearDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  yearDropdownBtnActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  yearDropdownText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  yearFilterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  yearPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  yearPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  yearPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  listHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#64748B',
  },
  listCountBadge: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  personAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  personInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  personName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  personMetaSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  achievementBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  achievementBadgeText: {
    fontSize: 12,
    color: '#334155',
  },
  achievementCountBold: {
    fontWeight: '700',
    color: '#2563EB',
  },
  chevronWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    maxWidth: 280,
  },
  resetFilterBtn: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
