import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, TextInput, Alert, Modal, Pressable, Platform, Image, Animated, Dimensions
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { GoalProgressCard } from './GoalTracker';

const { width: SW } = Dimensions.get('window');
const PURPLE = '#7C3AED';
const BG = '#FAFAFC';

export const AcademicCoordinatorModule = ({
  onLogout,
  profileImage,
  currentGoal,
  onNavigateGoalTracker,
  onNavigateMyAchievements,
  onNavigateLeaderboard,
  onNavigateUploadAchievement,
  onNavigateAbout
}) => {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'verify' | 'leaderboard' | 'profile'
  const [activeScreen, setActiveScreen] = useState('dash'); // 'dash' | 'studentList' | 'reports' | 'analytics' | 'studentProfile'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Group Verification State
  const [selectedGroup, setSelectedGroup] = useState(null); // When viewing grouped student list
  const [selectedProofStudent, setSelectedProofStudent] = useState(null); // When viewing individual proof page
  const [selectedStudentIds, setSelectedStudentIds] = useState([]); // For multi-select check boxes

  // Verification state & initial sample grouped event items
  const [verifyTab, setVerifyTab] = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected' | 'Resubmitted'
  const [groupedEvents, setGroupedEvents] = useState([
    {
      id: 'grp-1',
      eventName: 'Smart India Hackathon 2026',
      eventDate: '28 Jul 2026',
      organizer: 'MoE & AICTE',
      location: 'Nandha Engineering College, Erode',
      category: 'Hackathon Finalist',
      points: 7,
      students: [
        { id: 'st-1', name: 'Gokulraj S', regNo: '23CI011', dept: 'CSE (IoT)', section: 'Sec A', status: 'Pending', proofValid: true, proofs: ['SIH_Finalist_Certificate.pdf', 'Registration_Mail.png'] },
        { id: 'st-2', name: 'Priya Dharshini', regNo: '23CI042', dept: 'CSE (IoT)', section: 'Sec A', status: 'Pending', proofValid: true, proofs: ['SIH_Finalist_Certificate.pdf', 'College_NOC.pdf'] },
        { id: 'st-3', name: 'Karthik Raja M', regNo: '23CI025', dept: 'CSE (IoT)', section: 'Sec B', status: 'Pending', proofValid: false, proofs: ['Incomplete_Screenshot.jpg'] }, // Incomplete proof demo
        { id: 'st-4', name: 'Surya Kumar K', regNo: '23CI058', dept: 'CSE (IoT)', section: 'Sec B', status: 'Pending', proofValid: true, proofs: ['SIH_Certificate.pdf'] },
      ]
    },
    {
      id: 'grp-2',
      eventName: 'NPTEL Cloud Computing Workshop',
      eventDate: '20 Jul 2026',
      organizer: 'IIT Madras',
      location: 'Online Platform',
      category: 'Certification',
      points: 4,
      students: [
        { id: 'st-5', name: 'Ananya V', regNo: '23CI005', dept: 'CSE (IoT)', section: 'Sec A', status: 'Pending', proofValid: true, proofs: ['NPTEL_Certificate.pdf', 'Scorecard.png'] },
        { id: 'st-6', name: 'Dinesh Kumar P', regNo: '23CI018', dept: 'CSE (IoT)', section: 'Sec A', status: 'Pending', proofValid: true, proofs: ['NPTEL_Certificate.pdf'] },
      ]
    }
  ]);

  const [approvedList, setApprovedList] = useState([
    { id: '10', name: 'Ananya V', regNo: '23CI005', title: 'National Level Paper Winner', category: 'Paper Presentation', date: '20 Jul 2026', points: 9 }
  ]);
  const [rejectedList, setRejectedList] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Sample student list for Student Directory
  const studentList = [
    { id: 's1', name: 'Gokulraj S', regNo: '23CI011', dept: 'CSE (IoT)', year: 'III Year', section: 'Sec A', cgpa: '8.85', points: 50, approved: 4, pending: 1 },
    { id: 's2', name: 'Priya Dharshini', regNo: '23CI042', dept: 'CSE (IoT)', year: 'III Year', section: 'Sec A', cgpa: '9.12', points: 42, approved: 3, pending: 1 },
    { id: 's3', name: 'Karthik Raja M', regNo: '23CI025', dept: 'CSE (IoT)', year: 'III Year', section: 'Sec B', cgpa: '8.40', points: 35, approved: 2, pending: 1 },
    { id: 's4', name: 'Ananya V', regNo: '23CI005', dept: 'CSE (IoT)', year: 'III Year', section: 'Sec A', cgpa: '9.45', points: 68, approved: 5, pending: 0 },
    { id: 's5', name: 'Surya Kumar K', regNo: '23CI058', dept: 'CSE (IoT)', year: 'III Year', section: 'Sec B', cgpa: '8.20', points: 28, approved: 2, pending: 0 },
  ];

  // Helper functions for Group Verification
  const handleApproveSingleStudent = (groupId, studentId) => {
    setGroupedEvents(prevGroups => prevGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      const updatedStudents = grp.students.map(st => {
        if (st.id === studentId) {
          if (!st.proofValid) {
            Alert.alert('Proof Incomplete ⚠️', `${st.name}'s proof document is incomplete. Please request a resubmission or verify individually.`);
            return st;
          }
          return { ...st, status: 'Approved' };
        }
        return st;
      });
      return { ...grp, students: updatedStudents };
    }));
    Alert.alert('Approved ✅', 'Student achievement approved and points awarded!');
  };

  const handleRejectSingleStudent = (groupId, studentId) => {
    setGroupedEvents(prevGroups => prevGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      const updatedStudents = grp.students.map(st => {
        if (st.id === studentId) return { ...st, status: 'Rejected' };
        return st;
      });
      return { ...grp, students: updatedStudents };
    }));
    Alert.alert('Rejected ❌', 'Student achievement rejected.');
  };

  const handleToggleSelectStudent = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds(prev => [...prev, studentId]);
    }
  };

  const handleBulkApprove = (groupId) => {
    if (selectedStudentIds.length === 0) {
      Alert.alert('No Selection', 'Please select at least one student to approve.');
      return;
    }
    let skippedCount = 0;
    setGroupedEvents(prevGroups => prevGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      const updatedStudents = grp.students.map(st => {
        if (selectedStudentIds.includes(st.id)) {
          if (!st.proofValid) {
            skippedCount++;
            return st; // Remains pending if proof invalid
          }
          return { ...st, status: 'Approved' };
        }
        return st;
      });
      return { ...grp, students: updatedStudents };
    }));
    setSelectedStudentIds([]);
    if (skippedCount > 0) {
      Alert.alert('Bulk Approved ✅', `Valid student achievements approved. ${skippedCount} student(s) remained pending due to incomplete proofs.`);
    } else {
      Alert.alert('Bulk Approved ✅', 'Selected student achievements approved successfully.');
    }
  };

  const handleBulkReject = (groupId) => {
    if (selectedStudentIds.length === 0) {
      Alert.alert('No Selection', 'Please select at least one student to reject.');
      return;
    }
    setGroupedEvents(prevGroups => prevGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      const updatedStudents = grp.students.map(st => {
        if (selectedStudentIds.includes(st.id)) {
          return { ...st, status: 'Rejected' };
        }
        return st;
      });
      return { ...grp, students: updatedStudents };
    }));
    setSelectedStudentIds([]);
    Alert.alert('Bulk Rejected ❌', 'Selected student achievements rejected.');
  };

  const handleExportGroupList = (group) => {
    Alert.alert('Export Complete 📄', `Exported verification list for "${group.eventName}" as PDF/Excel.`);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const slideAnim = React.useRef(new Animated.Value(-SW * 0.82)).current;
  const fadeAnim  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (drawerOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -SW * 0.82, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [drawerOpen]);

  // Side Menu Drawer for Academic Coordinator — rendered as a function, always mounted
  const drawerMenuItems = [
    { label: 'Coordinator Dashboard', icon: 'home', action: () => { setActiveTab('home'); setActiveScreen('dash'); } },
    { label: 'Smart Group Verifications', icon: 'shield-checkmark', lib: 'Ionicons', action: () => { setActiveTab('verify'); } },
    { label: 'Student Directory', icon: 'users', action: () => { setActiveTab('home'); setActiveScreen('studentList'); } },
    { label: 'Academic Records', icon: 'database', action: () => { setActiveTab('home'); setActiveScreen('academicRecords'); } },
    { label: 'Upload My Achievement', icon: 'upload-cloud', action: onNavigateUploadAchievement },
    { label: 'My Achievements', icon: 'award', action: onNavigateMyAchievements },
    { label: 'Goal Tracker', icon: 'target', action: onNavigateGoalTracker },
    { label: 'Staff Leaderboard', icon: 'bar-chart-2', action: onNavigateLeaderboard },
    { label: 'Department Analytics', icon: 'pie-chart', action: () => { setActiveTab('home'); setActiveScreen('analytics'); } },
    { label: 'Academic Reports', icon: 'file-text', action: () => { setActiveTab('home'); setActiveScreen('reports'); } },
    { label: 'Profile & Settings', icon: 'user', action: () => { setActiveTab('profile'); } },
  ];

  const renderDrawer = () => (
    <Modal visible={drawerOpen} transparent animationType="none" statusBarTranslucent onRequestClose={() => setDrawerOpen(false)}>
      <Animated.View style={[styles.drawerOverlay, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setDrawerOpen(false)} />
        <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.drawerHeader}>
            <View style={styles.drawerAvatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 29 }} />
              ) : (
                <Text style={styles.drawerAvatarText}>AC</Text>
              )}
            </View>
            <Text style={styles.drawerName}>Dr. Alamelu</Text>
            <Text style={styles.drawerDept}>Academic Coordinator</Text>
            <View style={styles.drawerBadgeRow}>
              <Ionicons name="shield-checkmark" size={13} color="#FCD34D" />
              <Text style={styles.drawerBadgeText}>CSE (IoT) Department</Text>
            </View>
          </View>

          <ScrollView style={{ flex: 1, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            {drawerMenuItems.map((item, idx) => {
              const Ico = item.lib === 'Ionicons' ? Ionicons : Feather;
              const isActive = (item.label === 'Coordinator Dashboard' && activeTab === 'home' && activeScreen === 'dash') ||
                (item.label === 'Smart Group Verifications' && activeTab === 'verify') ||
                (item.label === 'Student Directory' && activeScreen === 'studentList') ||
                (item.label === 'Profile & Settings' && activeTab === 'profile') ||
                (item.label === 'Academic Reports' && activeScreen === 'reports') ||
                (item.label === 'Department Analytics' && activeScreen === 'analytics');

              return (
                <TouchableOpacity key={idx}
                  style={[styles.drawerItem, isActive && styles.drawerItemActive]}
                  activeOpacity={0.75}
                  onPress={() => { setDrawerOpen(false); setTimeout(() => item.action(), 100); }}>
                  <View style={[styles.drawerItemIcon, isActive && styles.drawerItemIconActive]}>
                    <Ico name={item.icon} size={17} color={isActive ? PURPLE : '#64748B'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.drawerItemLabel, isActive && styles.drawerItemLabelActive]}>{item.label}</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={isActive ? PURPLE : '#CBD5E1'} />
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16, marginVertical: 10 }} />
            <TouchableOpacity style={styles.drawerLogoutBtn} activeOpacity={0.8}
              onPress={() => { setDrawerOpen(false); setTimeout(() => onLogout(), 100); }}>
              <Feather name="log-out" size={17} color="#EF4444" />
              <Text style={styles.drawerLogoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  // Header Bar with Side Menu Hamburger Icon
  const HeaderBar = ({ title, subtitle }) => (
    <View style={styles.topHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} activeOpacity={0.7} style={{ padding: 2 }}>
          <Ionicons name="menu-outline" size={26} color="#1D2939" />
        </TouchableOpacity>
        <View>
          <Text style={styles.topCollege}>Nandha Engineering College</Text>
          <Text style={styles.topTitle}>{title}</Text>
          {subtitle ? <Text style={styles.topSub}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity style={styles.notifBell} activeOpacity={0.7} onPress={() => Alert.alert('Notifications 🔔', '• 3 new student submissions pending review\n• Gokulraj S resubmitted proof for SIH 2026\n• Department report ready for download\n• System update: AchieveX v1.0.1 available')}>
          <Ionicons name="notifications-outline" size={22} color="#1D2939" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileBadge} onPress={() => setActiveTab('profile')}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={{ width: 38, height: 38, borderRadius: 19 }} />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '800', color: PURPLE }}>AC</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Bottom Navigation
  const CoordinatorBottomNav = () => (
    <View style={styles.bottomNav}>
      {[
        { key: 'home', label: 'Home', icon: 'home', lib: 'Feather' },
        { key: 'verify', label: 'Verify', icon: 'shield-checkmark-outline', lib: 'Ionicons' },
        { key: 'leaderboard', label: 'Leaderboard', icon: 'bar-chart-2', lib: 'Feather' },
        { key: 'profile', label: 'Profile', icon: 'person-outline', lib: 'Ionicons' }
      ].map(tab => {
        const isActive = activeTab === tab.key;
        const Ico = tab.lib === 'Ionicons' ? Ionicons : Feather;
        return (
          <TouchableOpacity key={tab.key} style={styles.navTab} activeOpacity={0.7}
            onPress={() => {
              setActiveTab(tab.key);
              if (tab.key === 'home') setActiveScreen('dash');
              setSelectedGroup(null);
              setSelectedProofStudent(null);
            }}>
            {isActive && <View style={styles.activeIndicator} />}
            <Ico name={tab.icon} size={22} color={isActive ? PURPLE : '#94A3B8'} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Calculate total pending student verifications count across all groups
  const totalPendingVerificationsCount = groupedEvents.reduce((acc, grp) => {
    return acc + grp.students.filter(s => s.status === 'Pending').length;
  }, 0);

  // ----------------------------------------------------
  // SCREEN: HOME DASHBOARD
  // ----------------------------------------------------
  if (activeTab === 'home' && activeScreen === 'dash') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {renderDrawer()}
        <HeaderBar title="Coordinator Dashboard 👋" subtitle="Academic Verification Hub" />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          
          {/* Card 1: Pending Student Verifications */}
          <TouchableOpacity 
            style={styles.pendingCard} 
            activeOpacity={0.85}
            onPress={() => setActiveTab('verify')}
          >
            <View style={styles.pendingCardHeader}>
              <View style={styles.pendingBadgeCircle}>
                <Feather name="file-text" size={24} color="#D97706" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.pendingCardTitle}>Smart Group Verifications</Text>
                <Text style={styles.pendingCardCount}>{totalPendingVerificationsCount} Submissions ({groupedEvents.length} Event Groups)</Text>
              </View>
              <View style={styles.reviewBtn}>
                <Text style={styles.reviewBtnText}>Review Now →</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2: Today's Verification Stats */}
          <View style={styles.statsCardGrid}>
            <View style={[styles.statBox, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.statNum, { color: '#16A34A' }]}>{approvedList.length}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.statNum, { color: '#EF4444' }]}>{rejectedList.length}</Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statNum, { color: '#D97706' }]}>{totalPendingVerificationsCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          {/* Card 3: Department Statistics */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>Department Statistics</Text>
            <View style={styles.deptStatsRow}>
              <View style={styles.deptStatItem}>
                <Text style={styles.deptStatNum}>140</Text>
                <Text style={styles.deptStatSub}>Total Students</Text>
              </View>
              <View style={styles.deptStatDivider} />
              <View style={styles.deptStatItem}>
                <Text style={[styles.deptStatNum, { color: '#16A34A' }]}>116</Text>
                <Text style={styles.deptStatSub}>Approved</Text>
              </View>
              <View style={styles.deptStatDivider} />
              <View style={styles.deptStatItem}>
                <Text style={[styles.deptStatNum, { color: '#D97706' }]}>{totalPendingVerificationsCount}</Text>
                <Text style={styles.deptStatSub}>Pending</Text>
              </View>
            </View>
          </View>

          {/* Card 4: Goal Tracker Card */}
          <GoalProgressCard currentGoal={currentGoal} onNavigate={onNavigateGoalTracker} />

          {/* Quick Actions (Student-Style Workspace Card) */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.sectionCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.workspaceContent}>
              {[
                { label: 'Verify', sub: 'Submissions', icon: 'shield-checkmark', lib: 'Ionicons', col: PURPLE, bg: '#F5F0FF', action: () => setActiveTab('verify') },
                { label: 'Directory', sub: 'Students', icon: 'users', lib: 'Feather', col: '#2563EB', bg: '#DBEAFE', action: () => setActiveScreen('studentList') },
                { label: 'Records', sub: 'Academic Records', icon: 'database', lib: 'Feather', col: '#9333EA', bg: '#F3E8FF', action: () => setActiveScreen('academicRecords') },
                { label: 'Upload', sub: 'My Achievement', icon: 'upload-cloud', lib: 'Feather', col: '#16A34A', bg: '#DCFCE7', action: onNavigateUploadAchievement },
                { label: 'My Certificates', sub: 'View all submitted', icon: 'trophy', lib: 'Ionicons', col: '#D97706', bg: '#FEF3C7', action: onNavigateMyAchievements },
                { label: 'Leaderboard', sub: 'Staff Standings', icon: 'bar-chart-2', lib: 'Feather', col: '#CA8A04', bg: '#FEF9C3', action: () => setActiveTab('leaderboard') },
                { label: 'Analytics', sub: 'Department Stats', icon: 'pie-chart', lib: 'Feather', col: '#9333EA', bg: '#F3E8FF', action: () => setActiveScreen('analytics') },
                { label: 'Reports', sub: 'Export Reports', icon: 'file-text', lib: 'Feather', col: '#0891B2', bg: '#CFFAFE', action: () => setActiveScreen('reports') },
              ].map((item, idx) => {
                const Ico = item.lib === 'Ionicons' ? Ionicons : Feather;
                return (
                  <TouchableOpacity key={idx} style={styles.workspaceItem} activeOpacity={0.75} onPress={item.action}>
                    <View style={[styles.workspaceIconBg, { backgroundColor: item.bg }]}>
                      <Ico name={item.icon} size={24} color={item.col} />
                    </View>
                    <Text style={styles.workspaceLabel}>{item.label}</Text>
                    <Text style={styles.workspaceSub}>{item.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // SCREEN: STUDENT LIST
  // ----------------------------------------------------
  if (activeScreen === 'studentList') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setActiveScreen('dash')} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Student Directory</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* Search bar */}
          <View style={styles.searchWrapper}>
            <TextInput style={styles.searchInput} placeholder="Search student name or reg no..."
              placeholderTextColor="#98A2B3" value={searchQuery} onChangeText={setSearchQuery} />
            <Feather name="search" size={18} color="#98A2B3" style={styles.searchIcon} />
          </View>

          {studentList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.regNo.toLowerCase().includes(searchQuery.toLowerCase())).map(st => (
            <TouchableOpacity key={st.id} style={styles.studentCard} activeOpacity={0.8}
              onPress={() => { setSelectedStudent(st); setActiveScreen('studentProfile'); }}>
              <View style={styles.studentAvatar}>
                <Text style={styles.studentAvatarText}>{st.name[0]}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.studentName}>{st.name}</Text>
                <Text style={styles.studentSub}>{st.regNo} • {st.dept} • {st.section}</Text>
              </View>
              <View style={styles.studentPointsBadge}>
                <Text style={styles.studentPointsText}>{st.points} pts</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // SCREEN: STUDENT PROFILE
  // ----------------------------------------------------
  if (activeScreen === 'studentProfile' && selectedStudent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setActiveScreen('studentList')} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Student Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHero}>
            <View style={styles.heroAvatar}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: PURPLE }}>{selectedStudent.name[0]}</Text>
            </View>
            <Text style={styles.heroName}>{selectedStudent.name}</Text>
            <Text style={styles.heroReg}>{selectedStudent.regNo} • {selectedStudent.dept}</Text>

            <View style={styles.heroBadgeRow}>
              <View style={styles.heroPill}><Text style={styles.heroPillText}>{selectedStudent.year}</Text></View>
              <View style={styles.heroPill}><Text style={styles.heroPillText}>{selectedStudent.section}</Text></View>
              <View style={styles.heroPill}><Text style={styles.heroPillText}>CGPA: {selectedStudent.cgpa}</Text></View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Achievement Summary</Text>
          <View style={styles.statsCardGrid}>
            <View style={[styles.statBox, { backgroundColor: '#F5F0FF' }]}>
              <Text style={[styles.statNum, { color: PURPLE }]}>{selectedStudent.points}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.statNum, { color: '#16A34A' }]}>{selectedStudent.approved}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statNum, { color: '#D97706' }]}>{selectedStudent.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.downloadReportBtn} activeOpacity={0.85}
            onPress={async () => {
              try {
                const htmlContent = `
                  <html>
                    <head>
                      <style>
                        body { font-family: sans-serif; padding: 24px; color: #1D2939; }
                        h1 { color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; }
                        p { font-size: 14px; margin: 6px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #E4E7EC; padding: 10px; text-align: left; }
                        th { backgroundColor: #F9FAFB; color: #475569; }
                        .footer { margin-top: 40px; font-size: 11px; color: #98A2B3; text-align: center; }
                      </style>
                    </head>
                    <body>
                      <h1>Student Achievement Profile</h1>
                      <p><strong>Name:</strong> ${selectedStudent.name}</p>
                      <p><strong>Register Number:</strong> ${selectedStudent.regNo}</p>
                      <p><strong>Department:</strong> ${selectedStudent.dept}</p>
                      <p><strong>Year & Section:</strong> ${selectedStudent.year} - ${selectedStudent.section}</p>
                      <p><strong>CGPA:</strong> ${selectedStudent.cgpa}</p>
                      
                      <h3>Summary Stands</h3>
                      <table>
                        <tr><th>Total Points</th><th>Approved Achievements</th><th>Pending Review</th></tr>
                        <tr><td>${selectedStudent.points} pts</td><td>${selectedStudent.approved}</td><td>${selectedStudent.pending}</td></tr>
                      </table>

                      <div class="footer">
                        Generated securely by AchieveX v1.0.0. Avenzo Technologies Pvt. Ltd. All Rights Reserved.
                      </div>
                    </body>
                  </html>
                `;
                const { uri } = await Print.printToFileAsync({ html: htmlContent });
                await Sharing.shareAsync(uri);
              } catch (error) {
                Alert.alert('Error', 'Failed to generate and share PDF.');
              }
            }}>
            <Feather name="download" size={16} color="#FFFFFF" />
            <Text style={styles.downloadReportBtnText}>Download Student Achievement Report</Text>
          </TouchableOpacity>
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }
  // ----------------------------------------------------
  // SCREEN: ACADEMIC RECORDS (Import CGPA, Attendance, etc.)
  // ----------------------------------------------------
  if (activeScreen === 'academicRecords') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setActiveScreen('dash')} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Academic Records</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 13.5, color: '#64748B', marginVertical: 8, paddingHorizontal: 4 }}>
            Select a category to import student records. Updates are automatically synced with student profiles.
          </Text>

          {[
            { title: 'Upload Attendance Excel / CSV', desc: 'Sync student attendance registers automatically', icon: 'calendar', color: '#16A34A', bg: '#DCFCE7' },
            { title: 'Upload CGPA Excel / CSV', desc: 'Update student cumulative grade point averages', icon: 'award', color: PURPLE, bg: '#F5F0FF' },
            { title: 'Upload Internal Marks', desc: 'Import periodic test assessments data', icon: 'edit-3', color: '#2563EB', bg: '#DBEAFE' },
            { title: 'Upload Semester Results', desc: 'Sync end-semester grade cards', icon: 'file-text', color: '#D97706', bg: '#FEF3C7' },
          ].map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert(
                  'Upload Record 📤',
                  `Simulate uploading data for "${item.title}". Choose action:`,
                  [
                    { 
                      text: 'Select File & Import', 
                      onPress: () => {
                        Alert.alert('Import Success ✅', 'Student academic profiles updated successfully.');
                      } 
                    },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: item.bg, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Feather name={item.icon} size={22} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14.5, fontWeight: '800', color: '#1D2939' }}>{item.title}</Text>
                <Text style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>{item.desc}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // SCREEN: REPORTS MODULE
  // ----------------------------------------------------
  if (activeScreen === 'reports') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setActiveScreen('dash')} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Academic Reports</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {[
            { title: 'Download Student Achievement Report', desc: 'Detailed list of all student submissions and verification logs', type: 'PDF' },
            { title: 'Download Student Points Report', desc: 'Consolidated list of student points and rank standings', type: 'Excel' },
            { title: 'Download Department Report', desc: 'Overall department statistics and performance metrics', type: 'CSV' },
          ].map((item, idx) => (
            <View key={idx} style={styles.reportCard}>
              <View style={styles.reportIconBox}>
                <Feather name={item.type === 'PDF' ? 'file-text' : item.type === 'Excel' ? 'grid' : 'database'} size={22} color={PURPLE} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reportTitle}>{item.title}</Text>
                <Text style={styles.reportDesc}>{item.desc}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <TouchableOpacity style={styles.exportBtn} activeOpacity={0.8}
                  onPress={async () => {
                    try {
                      if (item.type === 'PDF') {
                        const htmlContent = `
                          <html>
                            <head>
                              <style>
                                body { font-family: sans-serif; padding: 24px; color: #1D2939; }
                                h1 { color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; }
                                h2 { color: #344054; margin-top: 20px; }
                                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                                th, td { border: 1px solid #E4E7EC; padding: 10px; text-align: left; }
                                th { backgroundColor: #F9FAFB; color: #475569; }
                                .footer { margin-top: 40px; font-size: 11px; color: #98A2B3; text-align: center; }
                              </style>
                            </head>
                            <body>
                              <h1>AchieveX — Academic Coordinator Report</h1>
                              <p><strong>Report:</strong> ${item.title}</p>
                              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                              <p><strong>Institution:</strong> Nandha Engineering College</p>
                              <p><strong>Department:</strong> Department of Computer Science & Engineering (CSE - IoT)</p>
                              <h2>Summary Statistics</h2>
                              <table>
                                <tr><th>Metric</th><th>Value</th></tr>
                                <tr><td>Total Students Registered</td><td>140</td></tr>
                                <tr><td>Approved achievements</td><td>116</td></tr>
                                <tr><td>Pending verifications</td><td>6</td></tr>
                              </table>
                              <div class="footer">
                                © 2026 Avenzo Technologies Pvt. Ltd. All Rights Reserved. Generated securely via AchieveX v1.0.0.
                              </div>
                            </body>
                          </html>
                        `;
                        const { uri } = await Print.printToFileAsync({ html: htmlContent });
                        await Sharing.shareAsync(uri);
                      } else {
                        // Generate mock data for Excel / CSV sharing
                        const htmlContent = `
                          <html>
                            <body>
                              <h1>Export Data - ${item.title} (${item.type})</h1>
                              <p>Report Type: ${item.type}</p>
                              <p>Generated: ${new Date().toLocaleString()}</p>
                            </body>
                          </html>
                        `;
                        const { uri } = await Print.printToFileAsync({ html: htmlContent });
                        await Sharing.shareAsync(uri);
                      }
                    } catch (error) {
                      Alert.alert('Error', 'Failed to generate and share report.');
                    }
                  }}>
                  <Text style={styles.exportBtnText}>Export {item.type}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // SCREEN: ANALYTICS MODULE
  // ----------------------------------------------------
  if (activeScreen === 'analytics') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setActiveScreen('dash')} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Department Analytics</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={styles.statsCardGrid}>
            <View style={[styles.statBox, { backgroundColor: '#F5F0FF' }]}>
              <Text style={[styles.statNum, { color: PURPLE }]}>140</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.statNum, { color: '#16A34A' }]}>116</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statNum, { color: '#D97706' }]}>{totalPendingVerificationsCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Achievement Categories</Text>
          <View style={styles.sectionCard}>
            {[
              { cat: 'Certifications', pct: '45%' },
              { cat: 'Workshops', pct: '30%' },
              { cat: 'Hackathons', pct: '15%' },
              { cat: 'Paper Presentation', pct: '10%' },
            ].map(c => (
              <View key={c.cat} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#1D2939' }}>{c.cat}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: PURPLE }}>{c.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#EDE9FE', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: c.pct, backgroundColor: PURPLE, borderRadius: 3 }} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // SUB-SCREEN: INDIVIDUAL PROOF PAGE (from Group Verification)
  // ----------------------------------------------------
  if (selectedProofStudent && selectedGroup) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setSelectedProofStudent(null)} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Proof Document Verification</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* Student Banner */}
          <View style={styles.studentProofBanner}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentAvatarText}>{selectedProofStudent.name[0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.studentName}>{selectedProofStudent.name}</Text>
              <Text style={styles.studentSub}>{selectedProofStudent.regNo} • {selectedProofStudent.dept}</Text>
            </View>
            <View style={[
              styles.statusPill,
              selectedProofStudent.status === 'Approved' ? { backgroundColor: '#DCFCE7' } :
              selectedProofStudent.status === 'Rejected' ? { backgroundColor: '#FEE2E2' } :
              { backgroundColor: '#FEF3C7' }
            ]}>
              <Text style={[
                styles.statusPillText,
                selectedProofStudent.status === 'Approved' ? { color: '#16A34A' } :
                selectedProofStudent.status === 'Rejected' ? { color: '#EF4444' } :
                { color: '#D97706' }
              ]}>{selectedProofStudent.status}</Text>
            </View>
          </View>

          {/* Event Context */}
          <View style={styles.eventContextCard}>
            <Text style={styles.groupCardEventTitle}>{selectedGroup.eventName}</Text>
            <Text style={styles.groupCardSubText}>{selectedGroup.organizer} • {selectedGroup.eventDate}</Text>
            <Text style={styles.groupCardLocationText}>📍 {selectedGroup.location}</Text>
          </View>

          {/* Proof Validity Status */}
          <View style={[styles.validityBox, selectedProofStudent.proofValid ? { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' } : { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            <Feather name={selectedProofStudent.proofValid ? "check-circle" : "alert-circle"} size={18} color={selectedProofStudent.proofValid ? "#16A34A" : "#EF4444"} />
            <Text style={[styles.validityText, selectedProofStudent.proofValid ? { color: "#15803D" } : { color: "#B91C1C" }]}>
              {selectedProofStudent.proofValid ? "All mandatory proof documents attached and valid." : "Incomplete proof attached. Mandatory certificate missing."}
            </Text>
          </View>

          {/* Attached Files List */}
          <Text style={styles.sectionTitle}>Uploaded Proof Files</Text>
          {selectedProofStudent.proofs.map((file, idx) => (
            <View key={idx} style={styles.proofFileRow}>
              <Feather name="file-text" size={20} color={PURPLE} />
              <Text style={styles.proofFileName} numberOfLines={1}>{file}</Text>
              <TouchableOpacity style={styles.viewFileBtn} activeOpacity={0.7} onPress={() => Alert.alert('Viewing File 📄', `Opened ${file}`)}>
                <Text style={styles.viewFileBtnText}>View File</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Verification Action Buttons */}
          {selectedProofStudent.status === 'Pending' && (
            <View style={styles.proofActionRow}>
              <TouchableOpacity 
                style={styles.rejectBtnLarge} 
                onPress={() => {
                  handleRejectSingleStudent(selectedGroup.id, selectedProofStudent.id);
                  setSelectedProofStudent(null);
                }}
              >
                <Text style={styles.rejectBtnText}>Reject Proof</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.approveBtnLarge, !selectedProofStudent.proofValid && { backgroundColor: '#94A3B8' }]} 
                onPress={() => {
                  handleApproveSingleStudent(selectedGroup.id, selectedProofStudent.id);
                  setSelectedProofStudent(null);
                }}
              >
                <Text style={styles.approveBtnText}>Approve & Award {selectedGroup.points} pts</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // SUB-SCREEN: GROUPED STUDENT LIST (from Smart Event Verification)
  // ----------------------------------------------------
  if (selectedGroup && activeTab === 'verify') {
    const pendingStudentsInGroup = selectedGroup.students.filter(s => s.status === 'Pending');
    
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => { setSelectedGroup(null); setSelectedStudentIds([]); }} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Group Student Verification</Text>
          <TouchableOpacity onPress={() => handleExportGroupList(selectedGroup)} style={styles.exportHeaderBtn} activeOpacity={0.8}>
            <Feather name="download" size={16} color={PURPLE} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          
          {/* Event Details Card */}
          <View style={styles.eventGroupHeroCard}>
            <Text style={styles.groupCardBadgeText}>GROUPED EVENT</Text>
            <Text style={styles.groupHeroTitle}>{selectedGroup.eventName}</Text>
            <Text style={styles.groupHeroSub}>{selectedGroup.organizer} • {selectedGroup.eventDate}</Text>
            <Text style={styles.groupHeroLoc}>📍 {selectedGroup.location}</Text>
            <View style={styles.groupHeroStatsRow}>
              <Text style={styles.groupHeroStatText}>Total: {selectedGroup.students.length} Students</Text>
              <Text style={styles.groupHeroStatText}>Pending: {pendingStudentsInGroup.length}</Text>
            </View>
          </View>

          {/* Bulk Selection Actions */}
          {pendingStudentsInGroup.length > 0 && (
            <View style={styles.bulkActionBar}>
              <Text style={styles.bulkSelectCountText}>{selectedStudentIds.length} Selected</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.bulkRejectBtn} onPress={() => handleBulkReject(selectedGroup.id)}>
                  <Text style={styles.bulkRejectBtnText}>Reject Selected</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bulkApproveBtn} onPress={() => handleBulkApprove(selectedGroup.id)}>
                  <Text style={styles.bulkApproveBtnText}>Approve Selected</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Student Rows List */}
          <Text style={styles.sectionTitle}>Students List</Text>
          {selectedGroup.students.map(st => {
            const isSelected = selectedStudentIds.includes(st.id);
            return (
              <View key={st.id} style={styles.groupStudentRow}>
                {st.status === 'Pending' && (
                  <TouchableOpacity style={styles.checkboxTouch} onPress={() => handleToggleSelectStudent(st.id)}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Feather name="check" size={12} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} 
                  activeOpacity={0.8}
                  onPress={() => setSelectedProofStudent(st)}
                >
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentAvatarText}>{st.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.studentName}>{st.name}</Text>
                      {!st.proofValid && st.status === 'Pending' && (
                        <View style={styles.warningPill}>
                          <Text style={styles.warningPillText}>Incomplete</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.studentSub}>{st.regNo} • {st.dept} ({st.section})</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <View style={[
                    styles.statusPillSmall,
                    st.status === 'Approved' ? { backgroundColor: '#DCFCE7' } :
                    st.status === 'Rejected' ? { backgroundColor: '#FEE2E2' } :
                    { backgroundColor: '#FEF3C7' }
                  ]}>
                    <Text style={[
                      styles.statusPillSmallText,
                      st.status === 'Approved' ? { color: '#16A34A' } :
                      st.status === 'Rejected' ? { color: '#EF4444' } :
                      { color: '#D97706' }
                    ]}>{st.status}</Text>
                  </View>

                  {st.status === 'Pending' && (
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <TouchableOpacity style={styles.quickApproveBtn} onPress={() => handleApproveSingleStudent(selectedGroup.id, st.id)}>
                        <Feather name="check" size={14} color="#16A34A" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.quickRejectBtn} onPress={() => handleRejectSingleStudent(selectedGroup.id, st.id)}>
                        <Feather name="x" size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // TAB: VERIFICATION MODULE (Smart Group Verification Main View)
  // ----------------------------------------------------
  if (activeTab === 'verify') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {renderDrawer()}
        <HeaderBar title="Verification Module" subtitle="Verify Student Achievements ONLY" />

        <View style={styles.pillTabRow}>
          {['Pending', 'Approved', 'Rejected', 'Resubmitted'].map(t => (
            <TouchableOpacity key={t} style={[styles.pillTab, verifyTab === t && styles.pillTabActive]}
              onPress={() => setVerifyTab(t)}>
              <Text style={[styles.pillTabText, verifyTab === t && styles.pillTabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          
          {verifyTab === 'Pending' && (
            <>
              <Text style={styles.sectionTitle}>Smart Event Verification Groups</Text>
              {groupedEvents.map(group => {
                const pendingCount = group.students.filter(s => s.status === 'Pending').length;
                const status = pendingCount === 0 ? 'Fully Verified' : `${pendingCount} Pending`;

                return (
                  <TouchableOpacity 
                    key={group.id} 
                    style={styles.eventGroupCard} 
                    activeOpacity={0.85}
                    onPress={() => setSelectedGroup(group)}
                  >
                    <View style={styles.eventGroupHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.groupCardEventTitle}>{group.eventName}</Text>
                        <Text style={styles.groupCardSubText}>{group.organizer} • {group.eventDate}</Text>
                        <Text style={styles.groupCardLocationText}>📍 {group.location}</Text>
                      </View>
                      <View style={[styles.groupStatusBadge, pendingCount === 0 ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.groupStatusText, pendingCount === 0 ? { color: '#16A34A' } : { color: '#D97706' }]}>{status}</Text>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.eventGroupFooterRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Feather name="users" size={14} color="#64748B" />
                        <Text style={styles.groupFooterStatText}>{group.students.length} Total Students Uploaded</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: PURPLE }}>View Group</Text>
                        <Feather name="chevron-right" size={16} color={PURPLE} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {verifyTab === 'Approved' && approvedList.map(item => (
            <View key={item.id} style={styles.verifyCard}>
              <Text style={styles.studentNameText}>{item.name} ({item.regNo})</Text>
              <Text style={styles.verifyTitleText}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '700', marginTop: 4 }}>✓ Approved & Points Awarded</Text>
            </View>
          ))}

          {verifyTab === 'Pending' && groupedEvents.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#64748B' }}>🎉 All Student Submissions Verified!</Text>
            </View>
          )}
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // TAB: LEADERBOARD MODULE
  // ----------------------------------------------------
  if (activeTab === 'leaderboard') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {renderDrawer()}
        <HeaderBar title="Leaderboard" subtitle="Academic Standings" />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {studentList.map((st, idx) => (
            <View key={st.id} style={styles.lbRow}>
              <Text style={styles.lbRank}>#{idx + 1}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.studentName}>{st.name}</Text>
                <Text style={styles.studentSub}>{st.regNo} • {st.section}</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '900', color: PURPLE }}>{st.points} pts</Text>
            </View>
          ))}
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // TAB: PROFILE & SETTINGS
  // ----------------------------------------------------
  // ----------------------------------------------------
  // TAB: PROFILE & SETTINGS
  // ----------------------------------------------------
  if (activeTab === 'profile') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {renderDrawer()}
        <HeaderBar title="Coordinator Profile" subtitle="Academic Coordinator Account" />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#101828', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
            <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden', borderWidth: 2, borderColor: '#EDE9FE' }}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 42 }} />
              ) : (
                <Text style={{ fontSize: 28, fontWeight: '900', color: PURPLE }}>AC</Text>
              )}
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1D2939' }}>Dr. Alamelu</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' }}>Coordinator ID: NEC-CSE-AC01</Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ backgroundColor: '#F5F0FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#EDE9FE' }}><Text style={{ fontSize: 11, fontWeight: '700', color: PURPLE }}>CSE Department</Text></View>
              <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE' }}><Text style={{ fontSize: 11, fontWeight: '700', color: '#1D6FD8' }}>Academic Coordinator</Text></View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <Feather name="mail" size={14} color="#64748B" />
              <Text style={{ fontSize: 13.5, color: '#64748B', fontWeight: '500' }}>alamelu@nandhaengg.org</Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 24, marginBottom: 10, paddingHorizontal: 4 }}>Quick Actions</Text>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
            {[
              { icon: 'award',         iconLib: 'Feather',  bg: '#EDE8FF', col: PURPLE,    label: 'My Certificates',          action: onNavigateMyAchievements },
              { icon: 'upload-cloud',  iconLib: 'Feather',  bg: '#DCFCE7', col: '#16A34A', label: 'Upload Achievement',       action: onNavigateUploadAchievement },
              { icon: 'target',        iconLib: 'Feather',  bg: '#FEF3C7', col: '#D97706', label: 'Goal Tracking',            action: onNavigateGoalTracker },
              { icon: 'settings',      iconLib: 'Feather',  bg: '#DBEAFE', col: '#2563EB', label: 'About AchieveX',            action: onNavigateAbout },
            ].map(({ icon, iconLib, bg, col, label, action }, i, arr) => {
              const Ico = iconLib === 'Ionicons' ? Ionicons : Feather;
              return (
                <React.Fragment key={label}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }} activeOpacity={0.7} onPress={action}>
                    <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: bg, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}><Ico name={icon} size={18} color={col} /></View>
                    <Text style={{ flex: 1, fontSize: 14.5, fontWeight: '700', color: '#1D2939' }}>{label}</Text>
                    <Feather name="chevron-right" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                  {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />}
                </React.Fragment>
              );
            })}
          </View>

          <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 24, marginBottom: 10, paddingHorizontal: 4 }}>App Information</Text>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
              <Feather name="info" size={16} color="#64748B" style={{ marginRight: 12 }} />
              <Text style={{ flex: 1, fontSize: 14.5, fontWeight: '600', color: '#475569' }}>App Version</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D2939' }}>v1.0.0 (Build 12)</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
              <Feather name="shield" size={16} color="#64748B" style={{ marginRight: 12 }} />
              <Text style={{ flex: 1, fontSize: 14.5, fontWeight: '600', color: '#475569' }}>Institution</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D2939' }}>Nandha Eng. College</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F5', borderWidth: 1.5, borderColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, marginTop: 24 }} 
            activeOpacity={0.85} 
            onPress={onLogout}
          >
            <Feather name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14.5, fontWeight: '800', color: '#EF4444' }}>Logout Account</Text>
          </TouchableOpacity>
        </ScrollView>
        <CoordinatorBottomNav />
      </SafeAreaView>
    );
  }

  return null;
};

const SAFE_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG, paddingTop: SAFE_TOP },
  topHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  topCollege: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  topTitle: { fontSize: 18, fontWeight: '900', color: '#1D2939' },
  topSub: { fontSize: 11.5, color: '#64748B' },
  profileBadge: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center' },
  notifBell: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },
  
  bottomNav: {
    flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9',
    paddingVertical: 8, paddingHorizontal: 16, justifyContent: 'space-around'
  },
  navTab: { alignItems: 'center', flex: 1, paddingVertical: 4 },
  navLabel: { fontSize: 10.5, fontWeight: '600', color: '#94A3B8', marginTop: 3 },
  navLabelActive: { color: PURPLE, fontWeight: '800' },
  activeIndicator: { position: 'absolute', top: -8, width: 24, height: 3, backgroundColor: PURPLE, borderRadius: 2 },

  pendingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, marginTop: 14, marginBottom: 14,
    borderWidth: 1.5, borderColor: '#FDE68A', shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 4
  },
  pendingCardHeader: { flexDirection: 'row', alignItems: 'center' },
  pendingBadgeCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  pendingCardTitle: { fontSize: 16, fontWeight: '800', color: '#1D2939' },
  pendingCardCount: { fontSize: 12.5, color: '#D97706', fontWeight: '700', marginTop: 3 },
  reviewBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  reviewBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },

  statsCardGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statBox: { flex: 1, borderRadius: 18, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 2 },

  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1D2939', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#1D2939', marginBottom: 14 },
  deptStatsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  deptStatItem: { alignItems: 'center' },
  deptStatNum: { fontSize: 20, fontWeight: '900', color: '#1D2939' },
  deptStatSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  deptStatDivider: { width: 1, height: 24, backgroundColor: '#F1F5F9' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1D2939', marginVertical: 10 },
  workspaceContent: { flexDirection: 'row', paddingHorizontal: 4 },
  workspaceItem: { alignItems: 'center', width: 96, marginHorizontal: 4 },
  workspaceIconBg: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  workspaceLabel: { fontSize: 11.5, fontWeight: '700', color: '#1D2939', textAlign: 'center' },
  workspaceSub: { fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 2 },

  pillTabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: '#FFFFFF' },
  pillTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9' },
  pillTabActive: { backgroundColor: PURPLE },
  pillTabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  pillTabTextActive: { color: '#FFFFFF' },

  eventGroupCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginTop: 12, borderWidth: 1.5, borderColor: '#EDE9FE', elevation: 2 },
  eventGroupHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  groupCardEventTitle: { fontSize: 15, fontWeight: '900', color: '#1D2939' },
  groupCardSubText: { fontSize: 12, color: PURPLE, fontWeight: '700', marginTop: 2 },
  groupCardLocationText: { fontSize: 11.5, color: '#64748B', marginTop: 3 },
  groupStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  groupStatusText: { fontSize: 11, fontWeight: '800' },
  eventGroupFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupFooterStatText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  eventGroupHeroCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#EDE9FE' },
  groupCardBadgeText: { fontSize: 10, fontWeight: '900', color: PURPLE, letterSpacing: 0.8, marginBottom: 4 },
  groupHeroTitle: { fontSize: 18, fontWeight: '900', color: '#1D2939' },
  groupHeroSub: { fontSize: 12.5, color: PURPLE, fontWeight: '700', marginTop: 2 },
  groupHeroLoc: { fontSize: 12, color: '#64748B', marginTop: 4 },
  groupHeroStatsRow: { flexDirection: 'row', gap: 14, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  groupHeroStatText: { fontSize: 12, fontWeight: '700', color: '#1D2939' },

  bulkActionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F5FF', padding: 12, borderRadius: 14, marginTop: 12, borderWidth: 1, borderColor: '#EDE9FE' },
  bulkSelectCountText: { fontSize: 12.5, fontWeight: '800', color: PURPLE },
  bulkRejectBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  bulkRejectBtnText: { fontSize: 11.5, fontWeight: '800', color: '#EF4444' },
  bulkApproveBtn: { backgroundColor: PURPLE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  bulkApproveBtnText: { fontSize: 11.5, fontWeight: '800', color: '#FFFFFF' },

  groupStudentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, marginTop: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  checkboxTouch: { paddingRight: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: PURPLE, borderColor: PURPLE },
  warningPill: { backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  warningPillText: { fontSize: 9.5, fontWeight: '800', color: '#EF4444' },

  statusPillSmall: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusPillSmallText: { fontSize: 10.5, fontWeight: '800' },
  quickApproveBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' },
  quickRejectBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },

  studentProofBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  eventContextCard: { backgroundColor: '#F8F5FF', borderRadius: 16, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#EDE9FE' },
  validityBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, marginTop: 12, borderWidth: 1 },
  validityText: { flex: 1, fontSize: 12, fontWeight: '700' },
  proofFileRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  proofFileName: { flex: 1, fontSize: 12.5, fontWeight: '700', color: '#1D2939', marginLeft: 10 },
  viewFileBtn: { backgroundColor: '#F5F0FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  viewFileBtnText: { fontSize: 11, fontWeight: '800', color: PURPLE },

  proofActionRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  rejectBtnLarge: { flex: 1, backgroundColor: '#FEE2E2', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  approveBtnLarge: { flex: 2, backgroundColor: PURPLE, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },

  verifyCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  verifyHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  studentNameText: { fontSize: 14, fontWeight: '800', color: '#1D2939' },
  verifyTitleText: { fontSize: 13, color: PURPLE, fontWeight: '700', marginTop: 2 },
  verifySubText: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  pointsPill: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pointsPillText: { fontSize: 11.5, fontWeight: '800', color: '#16A34A' },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },

  screenHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F5FF', justifyContent: 'center', alignItems: 'center' },
  exportHeaderBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center' },
  screenHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#1D2939' },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, height: 44, marginVertical: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, fontSize: 13.5, color: '#1D2939' },
  searchIcon: { marginLeft: 8 },

  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  studentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center' },
  studentAvatarText: { fontSize: 16, fontWeight: '800', color: PURPLE },
  studentName: { fontSize: 14, fontWeight: '800', color: '#1D2939' },
  studentSub: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  studentPointsBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  studentPointsText: { fontSize: 11.5, fontWeight: '800', color: '#16A34A' },

  profileHero: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  heroAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  heroName: { fontSize: 18, fontWeight: '900', color: '#1D2939' },
  heroReg: { fontSize: 12.5, color: '#64748B', marginTop: 2 },
  heroBadgeRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  heroPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  heroPillText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  downloadReportBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: PURPLE, paddingVertical: 14, borderRadius: 14, marginTop: 16 },
  downloadReportBtnText: { fontSize: 13.5, fontWeight: '800', color: '#FFFFFF' },

  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  reportIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center' },
  reportTitle: { fontSize: 13.5, fontWeight: '800', color: '#1D2939' },
  reportDesc: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  exportBtn: { backgroundColor: PURPLE, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  exportBtnText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },

  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusPillText: { fontSize: 11, fontWeight: '800' },
  lbRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  lbRank: { fontSize: 16, fontWeight: '900', color: PURPLE, width: 30 },
  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  menuText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1D2939', marginLeft: 12 },

  // Drawer Menu Styles
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawerContainer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: SW * 0.82, backgroundColor: '#FFFFFF', borderTopRightRadius: 28, borderBottomRightRadius: 28, shadowColor: '#000', shadowOffset: { width: 6, height: 0 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  drawerHeader: { paddingTop: (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44) + 16, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#7C3AED', borderBottomLeftRadius: 0, borderTopRightRadius: 28 },
  drawerAvatarCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  drawerAvatarText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  drawerName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  drawerDept: { fontSize: 12.5, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  drawerBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  drawerBadgeText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 16, marginHorizontal: 8, borderRadius: 12 },
  drawerItemActive: { backgroundColor: '#F5F0FF' },
  drawerItemIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  drawerItemIconActive: { backgroundColor: '#EDE9FE' },
  drawerItemLabel: { fontSize: 13.5, fontWeight: '600', color: '#475569' },
  drawerItemLabelActive: { color: '#7C3AED', fontWeight: '800' },
  drawerLogoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 24 },
  drawerLogoutText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
});
