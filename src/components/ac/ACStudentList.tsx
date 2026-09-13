// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Coordinator (AC) Student List
// List of students within the AC's assigned academic scope.
// Adheres strictly to the AchieveX SaaS design system:
// Header -> Blue/Indigo Hero Card -> Search + Filter -> Student Cards -> Bottom Nav
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  AC_SUMMARY_DATA,
  AC_SCOPED_STUDENTS,
  type ACScopedStudent,
} from '../../data/acWorkspaceData';
import ACBottomTab from './ACBottomTab';

interface ACStudentListProps {
  onOpenMenu: () => void;
  onNavigate: (screen: string) => void;
  onSelectStudent: (student: ACScopedStudent) => void;
}

export default function ACStudentList({
  onOpenMenu,
  onNavigate,
  onSelectStudent,
}: ACStudentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Achievers' | 'Attention'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const filteredStudents = useMemo(() => {
    return AC_SCOPED_STUDENTS.filter((st) => {
      if (filterType === 'Achievers' && st.verifiedAchievementsCount === 0) return false;
      if (filterType === 'Attention' && !st.needsAttention) return false;

      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = st.name.toLowerCase().includes(q);
        const matchesRoll = st.registerNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll) return false;
      }
      return true;
    });
  }, [filterType, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const renderStudentCard = ({ item }: { item: ACScopedStudent }) => (
    <TouchableOpacity
      style={[styles.studentCard, item.needsAttention && styles.studentCardAttention]}
      activeOpacity={0.75}
      onPress={() => onSelectStudent(item)}
    >
      <View style={[styles.avatarCircle, item.needsAttention && styles.avatarCircleAttention]}>
        <Text style={[styles.avatarText, item.needsAttention && styles.avatarTextAttention]}>
          {item.name.substring(0, 2).toUpperCase()}
        </Text>
      </View>

      <View style={styles.studentInfoCol}>
        <View style={styles.nameRow}>
          <Text style={styles.studentName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.needsAttention && (
            <View style={styles.attentionPill}>
              <Text style={styles.attentionPillText}>Attention</Text>
            </View>
          )}
        </View>

        <Text style={styles.studentSub}>
          {item.registerNumber} • {item.department} • {item.year}th Year {item.section}
        </Text>

        {item.needsAttention && item.attentionReason ? (
          <Text style={styles.attentionReasonText} numberOfLines={1}>
            ⚠️ {item.attentionReason}
          </Text>
        ) : (
          <Text style={styles.achievementsCountText}>
            {item.verifiedAchievementsCount} Verified Achievements
          </Text>
        )}
      </View>

      <View style={styles.pointsCol}>
        <Text style={styles.pointsText}>{item.points} pts</Text>
        <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginTop: 4 }} />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {/* ════════════════════════════════════════════════
          2. BLUE → INDIGO HERO CARD
      ════════════════════════════════════════════════ */}
      <View style={styles.heroCardWrapper}>
        <LinearGradient
          colors={['#2563EB', '#4338CA', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroLabelRow}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="people" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabelText}>YOUR ACADEMIC COHORT</Text>
            </View>
            <Text style={styles.heroSubText}>CSE (IoT) • Section A</Text>
          </View>

          <View style={styles.heroMainMetricsRow}>
            <View>
              <Text style={styles.heroPrimaryNumber}>{AC_SUMMARY_DATA.assignedScope.totalStudents}</Text>
              <Text style={styles.heroPrimaryLabel}>Enrolled Students</Text>
            </View>

            <View style={styles.heroPillContainer}>
              <View style={styles.heroPill}>
                <Ionicons name="trophy" size={14} color="#FDE047" style={{ marginRight: 4 }} />
                <Text style={styles.heroPillText}>{AC_SUMMARY_DATA.assignedScope.activeAchievers} Achievers</Text>
              </View>
              <View style={[styles.heroPill, { marginTop: 4 }]}>
                <Ionicons name="alert-circle" size={14} color="#FECACA" style={{ marginRight: 4 }} />
                <Text style={styles.heroPillText}>{AC_SUMMARY_DATA.assignedScope.attentionStudents} Issues</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ════════════════════════════════════════════════
          3. SEARCH ROW
      ════════════════════════════════════════════════ */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or register number..."
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

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        {(['All', 'Achievers', 'Attention'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, filterType === tab && styles.filterTabActive]}
            onPress={() => setFilterType(tab)}
          >
            <Text style={[styles.filterTabText, filterType === tab && styles.filterTabTextActive]}>
              {tab === 'All'
                ? `All (${AC_SCOPED_STUDENTS.length})`
                : tab === 'Achievers'
                ? 'Active Achievers'
                : 'Needs Attention'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.mainContainer}>
        {/* ════════════════════════════════════════════════
            1. HEADER BAR
        ════════════════════════════════════════════════ */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7} onPress={onOpenMenu}>
            <Ionicons name="menu-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Students</Text>
            <Text style={styles.headerSubtitle}>Enrolled in your academic scope</Text>
          </View>
        </View>

        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderStudentCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
          }
        />

        {/* ════════════════════════════════════════════════
            4. AC BOTTOM NAVIGATION
        ════════════════════════════════════════════════ */}
        <ACBottomTab activeTab="students" onNavigate={onNavigate} />
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

  /* Header */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    marginTop: 1,
  },

  /* Hero */
  heroCardWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  heroLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  heroSubText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  heroMainMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroPrimaryNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroPrimaryLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '600',
    marginTop: 1,
  },
  heroPillContainer: {
    alignItems: 'flex-end',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Search */
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchBar: {
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },

  /* Filter Tabs */
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* List */
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 130, // Prevents bottom navigation overlap
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  studentCardAttention: {
    borderColor: '#FECACA',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarCircleAttention: {
    backgroundColor: '#FEF2F2',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  avatarTextAttention: {
    color: '#DC2626',
  },
  studentInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  attentionPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  attentionPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#DC2626',
  },
  studentSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  attentionReasonText: {
    fontSize: 10.5,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 2,
  },
  achievementsCountText: {
    fontSize: 10.5,
    color: '#475569',
    marginTop: 2,
  },
  pointsCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
});
