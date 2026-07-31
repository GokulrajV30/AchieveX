import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Image,
  StatusBar, SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView, Modal, Pressable, ActivityIndicator, Dimensions,
  Animated, Switch, Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { GoalProgressCard, GoalTrackerScreen, CreateGoalScreen } from './GoalTracker';
import { AcademicCoordinatorModule } from './AcademicCoordinatorModule';

const { width: SW } = Dimensions.get('window');
const SAFE_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
const PURPLE = '#7C3AED';
const PURPLE_LIGHT = '#F5F0FF';
const BG = '#FAFAFC';

/* ═══════════════════════════════════════════════════════════
   CATEGORY → POINTS TABLE (for ℹ modal only)
═══════════════════════════════════════════════════════════ */
const CATEGORY_POINTS = [
  { label: 'Participation',          points: 2  },
  { label: 'Workshop',               points: 3  },
  { label: 'Seminar',                points: 3  },
  { label: 'Course / Certification', points: 4  },
  { label: 'Paper Presentation',     points: 5  },
  { label: 'Project Expo',           points: 5  },
  { label: 'Sports Achievement',     points: 6  },
  { label: 'Cultural Achievement',   points: 6  },
  { label: 'Hackathon Finalist',     points: 7  },
  { label: 'Internship Completion',  points: 7  },
  { label: 'Patent Published',       points: 8  },
  { label: 'National Level Winner',  points: 9  },
  { label: 'International Winner',   points: 10 },
];

/* ═══════════════════════════════════════════════════════════
   BACKGROUND ORNAMENTS  (auth screens)
═══════════════════════════════════════════════════════════ */
const BackgroundOrnaments = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Ionicons name="school-outline" size={78} color="rgba(47,128,237,0.05)"
      style={{ position: 'absolute', top: 50, alignSelf: 'center' }} />
    <MaterialCommunityIcons name="file-certificate-outline" size={58}
      color="rgba(47,128,237,0.05)" style={{ position: 'absolute', top: 125, left: 35 }} />
    <Feather name="book-open" size={48} color="rgba(47,128,237,0.05)"
      style={{ position: 'absolute', top: 130, right: 40 }} />
    <Ionicons name="trophy-outline" size={54} color="rgba(47,128,237,0.05)"
      style={{ position: 'absolute', top: 250, left: 35 }} />
    <Ionicons name="ribbon-outline" size={54} color="rgba(47,128,237,0.05)"
      style={{ position: 'absolute', top: 255, right: 35 }} />
  </View>
);

/* ═══════════════════════════════════════════════════════════
   FORGOT PASSWORD MODAL
═══════════════════════════════════════════════════════════ */
const ForgotPasswordModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [fpState, setFpState] = useState('input');
  useEffect(() => { if (visible) { setEmail(''); setFpState('input'); } }, [visible]);
  const handleSend = () => {
    if (!email.trim()) return;
    setFpState(email.includes('@') ? 'success' : 'error');
  };
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalCard, { paddingTop: 28 }]} onPress={() => {}}>
          <View style={[styles.fpIconRing,
            fpState === 'success' && { backgroundColor: '#E8FFF4' },
            fpState === 'error'   && { backgroundColor: '#FFF3F3' }]}>
            {fpState === 'input'   && <Feather name="lock"         size={26} color="#1B59F8" />}
            {fpState === 'success' && <Feather name="check-circle" size={28} color="#12B76A" />}
            {fpState === 'error'   && <Feather name="alert-circle" size={28} color="#F04438" />}
          </View>
          {fpState === 'input'   && <><Text style={styles.fpTitle}>Forgot Password</Text><Text style={styles.fpSubtitle}>Reset your password</Text></>}
          {fpState === 'success' && <Text style={[styles.fpTitle, { color: '#12B76A' }]}>Verification code sent!</Text>}
          {fpState === 'error'   && <Text style={[styles.fpTitle, { color: '#F04438' }]}>Email not found</Text>}
          <View style={styles.modalDivider} />
          {fpState === 'input'   && <Text style={styles.fpBody}>Enter your registered college email address. We'll send a verification code to reset your password.</Text>}
          {fpState === 'success' && <Text style={styles.fpBody}>Please check your college email for the reset code.</Text>}
          {fpState === 'error'   && <Text style={styles.fpBody}>Please enter the email address linked to your <Text style={{ fontWeight: '700', color: '#1B59F8' }}>AchieveX</Text> account.</Text>}
          {fpState === 'input' && (
            <>
              <View style={[styles.inputWrapper, { width: '100%', marginBottom: 20 }]}>
                <TextInput style={styles.input} placeholder="College Email" placeholderTextColor="#98A2B3"
                  value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <Feather name="at-sign" size={20} color="#98A2B3" style={styles.inputIcon} />
              </View>
              <TouchableOpacity style={[styles.blueButton, { width: '100%', marginBottom: 16 }]} activeOpacity={0.85} onPress={handleSend}>
                <Text style={styles.buttonText}>Send Verification Code</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={onClose} style={styles.fpBackLink}>
            <Feather name="arrow-left" size={14} color="#1B59F8" />
            <Text style={styles.fpBackText}> Back to Sign In</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ═══════════════════════════════════════════════════════════
   POINTS INFO MODAL (Compact Premium Bottom Sheet / Modal)
═══════════════════════════════════════════════════════════ */
const NEW_CATEGORY_POINTS = [
  { emoji: '🏅', label: 'Participation',                   points: 2  },
  { emoji: '📜', label: 'Online Course / Certification',   points: 3  },
  { emoji: '🛠', label: 'Workshop / FDP',                  points: 3  },
  { emoji: '💡', label: 'Project Exhibition',              points: 4  },
  { emoji: '🥉', label: '3rd Prize',                       points: 5  },
  { emoji: '🥈', label: '2nd Prize',                       points: 6  },
  { emoji: '🥇', label: '1st Prize',                       points: 7  },
  { emoji: '🏆', label: 'National Level Winner',           points: 8  },
  { emoji: '🌍', label: 'International Achievement',       points: 10 },
];

const PointsInfoModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
        {/* Drag Handle */}
        <View style={styles.sheetDragHandle} />

        {/* Header Section */}
        <View style={styles.sheetHeaderRow}>
          <View style={styles.sheetIconCircle}>
            <Ionicons name="star" size={26} color={PURPLE} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.sheetHeaderTitle}>⭐ Achievement Points</Text>
            <Text style={styles.sheetHeaderSub}>Maximum 10 points can be earned for a single achievement.</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn} activeOpacity={0.7}>
            <Feather name="x" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalDivider} />

        {/* Column Labels */}
        <View style={styles.sheetColHeader}>
          <Text style={styles.sheetColText}>Category</Text>
          <Text style={styles.sheetColText}>Points</Text>
        </View>

        {/* 2-Column Compact List */}
        <ScrollView style={{ maxHeight: 310 }} showsVerticalScrollIndicator={false}>
          {NEW_CATEGORY_POINTS.map((item) => (
            <View key={item.label} style={styles.compactCategoryRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>{item.emoji}</Text>
                <Text style={styles.compactCategoryText} numberOfLines={1}>{item.label}</Text>
              </View>
              <View style={styles.compactStarBadge}>
                <Ionicons name="star" size={11} color={PURPLE} />
                <Text style={styles.compactStarBadgeText}> {item.points}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.modalDivider, { marginTop: 10 }]} />

        {/* Bottom Information Box */}
        <View style={styles.sheetInfoBox}>
          <Feather name="info" size={15} color={PURPLE} style={{ marginTop: 1 }} />
          <Text style={styles.sheetInfoBoxText}>
            Points are awarded only after verification by the Academic Coordinator.
          </Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.sheetPrimaryBtn} activeOpacity={0.85} onPress={onClose}>
          <Text style={styles.sheetPrimaryBtnText}>Got it</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

/* ═══════════════════════════════════════════════════════════
   DRAWER MENU
═══════════════════════════════════════════════════════════ */
const DrawerMenu = ({ visible, onClose, onNav, currentScreen, profileImage, isFaculty = false }) => {
  const slideAnim = useRef(new Animated.Value(-SW * 0.82)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  const studentItems = [
    { key: 'home',             icon: 'home',          label: 'Dashboard',           sub: 'Back to dashboard'    },
    { key: 'goalTracker',      icon: 'target',        label: 'Goal Tracker',        sub: 'Track target points'  },
    { key: 'uploadAchievement',icon: 'upload-cloud',  label: 'Upload Achievement',  sub: 'Submit a certificate' },
    { key: 'myAchievements',   icon: 'award',         label: 'My Certificates',     sub: 'View all achievements'},
    { key: 'attendance',       icon: 'calendar',      label: 'Attendance',           sub: 'Track your attendance'},
    { key: 'leaderboard',      icon: 'bar-chart-2',   label: 'Leaderboard',          sub: 'See college rankings' },
    { key: 'notifications',    icon: 'bell',          label: 'Notifications',        sub: 'Updates & alerts'    },
    { key: 'settings',         icon: 'settings',      label: 'Settings',             sub: 'App preferences'     },
  ];

  const facultyItems = [
    { key: 'facultyHome',         icon: 'home',          label: 'Dashboard',              sub: 'Back to dashboard'         },
    { key: 'goalTracker',         icon: 'target',        label: 'Goal Tracker',           sub: 'Track target points'       },
    { key: 'facultyUpload',       icon: 'upload-cloud',  label: 'Upload Achievement',     sub: 'Submit faculty achievement'},
    { key: 'facultyAchievements', icon: 'award',         label: 'My Achievements',        sub: 'View all achievements'     },
    { key: 'leaderboard',         icon: 'bar-chart-2',   label: 'Faculty Leaderboard',    sub: 'See faculty rankings'      },
    { key: 'notifications',       icon: 'bell',          label: 'Notifications',          sub: 'Updates & alerts'          },
    { key: 'facultySettings',     icon: 'settings',      label: 'Settings',               sub: 'App preferences'           },
  ];

  const drawerItems = isFaculty ? facultyItems : studentItems;

  if (!visible && slideAnim._value <= -SW * 0.8) return null;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.drawerOverlay, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.drawerHeader}>
            <View style={styles.drawerAvatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 29 }} />
              ) : (
                <Text style={styles.drawerAvatarText}>{isFaculty ? 'J' : 'G'}</Text>
              )}
            </View>
            <Text style={styles.drawerName}>{isFaculty ? 'Dr. John Mathew' : 'Gokulraj'}</Text>
            <Text style={styles.drawerDept}>{isFaculty ? 'Dept. of CSE • Associate Professor' : 'CSE (IoT) · III Year · Sec A'}</Text>
            <View style={styles.drawerBadgeRow}>
              <Ionicons name={isFaculty ? "shield-checkmark" : "medal"} size={13} color="#FCD34D" />
              <Text style={styles.drawerBadgeText}>{isFaculty ? 'Verified Evaluator • 140 pts' : 'Bronze Explorer · 50 pts'}</Text>
            </View>
          </View>

          <ScrollView style={{ flex: 1, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            {drawerItems.map(item => {
              const isActive = currentScreen === item.key ||
                (!isFaculty && item.key === 'home' && (currentScreen === 'dashboardFirst' || currentScreen === 'dashboardSecond'));
              return (
                <TouchableOpacity key={item.key}
                  style={[styles.drawerItem, isActive && styles.drawerItemActive]}
                  activeOpacity={0.75}
                  onPress={() => { onClose(); setTimeout(() => onNav(item.key), 100); }}>
                  <View style={[styles.drawerItemIcon, isActive && styles.drawerItemIconActive]}>
                    <Feather name={item.icon} size={17} color={isActive ? PURPLE : '#64748B'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.drawerItemLabel, isActive && styles.drawerItemLabelActive]}>{item.label}</Text>
                    <Text style={styles.drawerItemSub}>{item.sub}</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={isActive ? PURPLE : '#CBD5E1'} />
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16, marginVertical: 10 }} />
            <TouchableOpacity style={styles.drawerLogoutBtn} activeOpacity={0.8}
              onPress={() => { onClose(); setTimeout(() => onNav('logout'), 100); }}>
              <Feather name="log-out" size={17} color="#EF4444" />
              <Text style={styles.drawerLogoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAVIGATION (used on ALL screens)
═══════════════════════════════════════════════════════════ */
const BottomNav = ({ active, onNav, isFaculty = false }) => {
  const studentTabs = [
    { key: 'home',         icon: 'home',           lib: 'Feather',  label: 'Home' },
    { key: 'achievements', icon: 'trophy-outline',  lib: 'Ionicons', label: 'Achievements' },
    { key: 'leaderboard',  icon: 'bar-chart-2',     lib: 'Feather',  label: 'Leaderboard' },
    { key: 'profile',      icon: 'person-outline',  lib: 'Ionicons', label: 'Profile' },
  ];

  const facultyTabs = [
    { key: 'facultyHome',         icon: 'home',          lib: 'Feather',  label: 'Home'         },
    { key: 'facultyAchievements', icon: 'trophy-outline', lib: 'Ionicons', label: 'Achievements' },
    { key: 'leaderboard',         icon: 'bar-chart-2',   lib: 'Feather',  label: 'Leaderboard'  },
    { key: 'facultyProfile',      icon: 'person-outline', lib: 'Ionicons', label: 'Profile'      },
  ];

  const tabs = isFaculty ? facultyTabs : studentTabs;
  return (
    <View style={styles.bottomNav}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        const Ico = tab.lib === 'Ionicons' ? Ionicons : Feather;
        return (
          <TouchableOpacity key={tab.key} style={styles.navTab} activeOpacity={0.7}
            onPress={() => onNav && onNav(tab.key)}>
            {isActive && <View style={styles.navActiveIndicator} />}
            <Ico name={tab.icon} size={22} color={isActive ? PURPLE : '#94A3B8'} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════
   UPLOAD ACHIEVEMENT — OLD 3-STEP UI + Workable Pickers
═══════════════════════════════════════════════════════════ */
const UploadAchievementScreen = ({ onBack, onSubmitSuccess, navTo }) => {
  const [step, setStep]               = useState(1);
  const [focusedField, setFocusedField] = useState(null);
  const [showPointsInfo, setShowPointsInfo] = useState(false);

  // Step 1 fields
  const [category, setCategory]     = useState('');
  const [title, setTitle]           = useState('');
  const [event, setEvent]           = useState('');
  const [organizer, setOrganizer]   = useState('');
  const [date, setDate]             = useState('');
  const [level, setLevel]           = useState('');
  const [errors, setErrors]         = useState({});

  // Step 2
  const [achieveType, setAchieveType] = useState(null); // 'online' | 'offline'

  // Step 3 files
  const [certificate, setCertificate]           = useState(null);
  const [regEmail, setRegEmail]                 = useState(null);
  const [completionProof, setCompletionProof]   = useState(null);
  const [brochure, setBrochure]                 = useState(null);
  const [geoPhoto, setGeoPhoto]                 = useState(null);
  const [eventPhoto, setEventPhoto]             = useState(null);
  const [optionalFile, setOptionalFile]         = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);

  const levelOptions = ['College', 'District', 'State', 'National', 'International'];

  // Custom Proof Document Picker Bottom Sheet State
  const [activePickerTarget, setActivePickerTarget] = useState(null); // { label, setFile }

  const triggerPicker = (label, setFile) => {
    setActivePickerTarget({ label, setFile });
  };
  const pickDocument = triggerPicker;

  const handlePickSource = (sourceType) => {
    if (!activePickerTarget) return;
    const { label, setFile } = activePickerTarget;
    if (sourceType === 'camera') {
      setFile({ name: `${label.replace(/\s+/g,'_')}_capture.jpg`, size: '1.8 MB' });
    } else {
      setFile({ name: `${label.replace(/\s+/g,'_')}_doc.pdf`, size: '2.4 MB' });
    }
    setActivePickerTarget(null);
  };

  const onlineReady  = certificate && regEmail && completionProof;
  const offlineReady = certificate && brochure && geoPhoto && eventPhoto;

  const handleStep1Continue = () => {
    const errs = {};
    if (!category.trim())  errs.category  = 'Category is required';
    if (!title.trim())     errs.title     = 'Title is required';
    if (!event.trim())     errs.event     = 'Event name is required';
    if (!organizer.trim()) errs.organizer = 'Organizer is required';
    if (!date.trim())      errs.date      = 'Date is required';
    if (!level.trim())     errs.level     = 'Achievement level is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (!achieveType) return;
    setStep(3);
  };

  const handleStep3Submit = () => {
    const ready = achieveType === 'online' ? onlineReady : offlineReady;
    if (!ready) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setShowSuccess(true); }, 1500);
  };

  const stepBack = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const StepIndicator = () => (
    <View style={styles.stepIndicatorRow}>
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
              {step > s
                ? <Feather name="check" size={13} color="#fff" />
                : <Text style={[styles.stepDotText, step >= s && styles.stepDotTextActive]}>{s}</Text>
              }
            </View>
            <Text style={[styles.stepDotLabel, step === s && styles.stepDotLabelActive]}>
              {s === 1 ? 'Details' : s === 2 ? 'Type' : 'Proofs'}
            </Text>
          </View>
          {i < 2 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </React.Fragment>
      ))}
    </View>
  );

  const UploadCard = ({ label, required, file, onPick, onRemove, iconName = 'upload-cloud' }) => (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={styles.inputLabel}>{label}</Text>
        {required && <View style={styles.requiredBadge}><Text style={styles.requiredText}>Required</Text></View>}
      </View>
      {!file ? (
        <TouchableOpacity style={styles.uploadCardLarge} activeOpacity={0.8} onPress={onPick}>
          <View style={styles.uploadIconCircle}><Feather name={iconName} size={26} color={PURPLE} /></View>
          <Text style={styles.uploadCardTitle}>Tap to select or take photo</Text>
          <Text style={styles.uploadCardSub}>PNG • JPG • PDF • Max 10 MB</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.filePreviewCard}>
          <View style={styles.fileIconBox}><Feather name="file-text" size={22} color={PURPLE} /></View>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <Text style={styles.fileNameText} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.fileSizeText}>{file.size} • Ready for upload</Text>
          </View>
          <TouchableOpacity style={[styles.fileActionIconBtn, { backgroundColor: '#FFF1F2' }]}
            activeOpacity={0.7} onPress={onRemove}>
            <Feather name="trash-2" size={14} color="#E11D48" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PointsInfoModal visible={showPointsInfo} onClose={() => setShowPointsInfo(false)} />

      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={stepBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Upload Achievement</Text>
        <TouchableOpacity onPress={() => setShowPointsInfo(true)} style={styles.infoBtn} activeOpacity={0.7}>
          <Ionicons name="information-circle-outline" size={22} color={PURPLE} />
        </TouchableOpacity>
      </View>

      <StepIndicator />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.stepScrollContent}
          showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* STEP 1 */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepTitleWrapper}>
                <Text style={styles.stepTitle}>Achievement Details</Text>
                <Text style={styles.stepSubtitle}>Enter your achievement details below.</Text>
              </View>

              <Text style={styles.inputLabel}>Achievement Category</Text>
              <View style={[styles.roundedInputWrapper,
                focusedField === 'cat' && styles.roundedInputFocused,
                errors.category && styles.roundedInputError]}>
                <TextInput style={styles.roundedInput} placeholder="e.g. Hackathon, Workshop, Sports"
                  placeholderTextColor="#98A2B3" value={category}
                  onChangeText={t => { setCategory(t); setErrors(e => ({ ...e, category: null })); }}
                  onFocus={() => setFocusedField('cat')} onBlur={() => setFocusedField(null)} />
                <Feather name="tag" size={17} color={focusedField === 'cat' ? PURPLE : '#98A2B3'} />
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Achievement Title</Text>
              <View style={[styles.roundedInputWrapper,
                focusedField === 'title' && styles.roundedInputFocused,
                errors.title && styles.roundedInputError]}>
                <TextInput style={styles.roundedInput} placeholder="e.g. 1st Place - SIH 2026"
                  placeholderTextColor="#98A2B3" value={title}
                  onChangeText={t => { setTitle(t); setErrors(e => ({ ...e, title: null })); }}
                  onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField(null)} />
                <Feather name="award" size={17} color={focusedField === 'title' ? PURPLE : '#98A2B3'} />
              </View>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Event Name</Text>
              <View style={[styles.roundedInputWrapper,
                focusedField === 'event' && styles.roundedInputFocused,
                errors.event && styles.roundedInputError]}>
                <TextInput style={styles.roundedInput} placeholder="e.g. Smart India Hackathon"
                  placeholderTextColor="#98A2B3" value={event}
                  onChangeText={t => { setEvent(t); setErrors(e => ({ ...e, event: null })); }}
                  onFocus={() => setFocusedField('event')} onBlur={() => setFocusedField(null)} />
                <Feather name="flag" size={17} color={focusedField === 'event' ? PURPLE : '#98A2B3'} />
              </View>
              {errors.event && <Text style={styles.errorText}>{errors.event}</Text>}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Organizer</Text>
              <View style={[styles.roundedInputWrapper,
                focusedField === 'org' && styles.roundedInputFocused,
                errors.organizer && styles.roundedInputError]}>
                <TextInput style={styles.roundedInput} placeholder="e.g. MoE / AICTE"
                  placeholderTextColor="#98A2B3" value={organizer}
                  onChangeText={t => { setOrganizer(t); setErrors(e => ({ ...e, organizer: null })); }}
                  onFocus={() => setFocusedField('org')} onBlur={() => setFocusedField(null)} />
                <Feather name="briefcase" size={17} color={focusedField === 'org' ? PURPLE : '#98A2B3'} />
              </View>
              {errors.organizer && <Text style={styles.errorText}>{errors.organizer}</Text>}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Achievement Date</Text>
              <View style={[styles.roundedInputWrapper,
                focusedField === 'date' && styles.roundedInputFocused,
                errors.date && styles.roundedInputError]}>
                <TextInput style={styles.roundedInput} placeholder="DD / MM / YYYY"
                  placeholderTextColor="#98A2B3" value={date}
                  onChangeText={t => { setDate(t); setErrors(e => ({ ...e, date: null })); }}
                  onFocus={() => setFocusedField('date')} onBlur={() => setFocusedField(null)} />
                <Feather name="calendar" size={17} color={focusedField === 'date' ? PURPLE : '#98A2B3'} />
              </View>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Achievement Level</Text>
              {errors.level && <Text style={styles.errorText}>{errors.level}</Text>}
              <View style={styles.levelChipRow}>
                {levelOptions.map(l => (
                  <TouchableOpacity key={l}
                    style={[styles.levelChip, level === l && styles.levelChipActive]}
                    onPress={() => { setLevel(l); setErrors(e => ({ ...e, level: null })); }}
                    activeOpacity={0.8}>
                    <Text style={[styles.levelChipText, level === l && styles.levelChipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.primaryGradientBtn, { marginTop: 28 }]}
                activeOpacity={0.85} onPress={handleStep1Continue}>
                <Text style={styles.primaryBtnText}>Continue</Text>
                <Feather name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepTitleWrapper}>
                <Text style={styles.stepTitle}>Select Achievement Type</Text>
                <Text style={styles.stepSubtitle}>Choose the type that best describes your achievement.</Text>
              </View>

              <TouchableOpacity
                style={[styles.typeCard, achieveType === 'online' && styles.typeCardSelected]}
                activeOpacity={0.85}
                onPress={() => setAchieveType('online')}>
                <View style={styles.typeCardHeader}>
                  <View style={[styles.typeIconCircle, { backgroundColor: '#EDE9FE' }]}>
                    <Feather name="monitor" size={28} color={PURPLE} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.typeCardTitle}>📱  Online Achievement</Text>
                    <Text style={styles.typeCardDesc}>Completed on a digital or online platform</Text>
                  </View>
                  <View style={[styles.typeRadio, achieveType === 'online' && styles.typeRadioSelected]}>
                    {achieveType === 'online' && <View style={styles.typeRadioDot} />}
                  </View>
                </View>
                <View style={styles.typeExampleRow}>
                  {['NPTEL', 'Coursera', 'Udemy', 'Google', 'Microsoft', 'LinkedIn', 'Coding Platforms'].map(ex => (
                    <View key={ex} style={styles.typeExampleChip}>
                      <Text style={styles.typeExampleText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeCard, achieveType === 'offline' && styles.typeCardSelected]}
                activeOpacity={0.85}
                onPress={() => setAchieveType('offline')}>
                <View style={styles.typeCardHeader}>
                  <View style={[styles.typeIconCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="trophy-outline" size={28} color="#16A34A" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.typeCardTitle}>🏆  Offline Achievement</Text>
                    <Text style={styles.typeCardDesc}>Physical event, competition, or activity</Text>
                  </View>
                  <View style={[styles.typeRadio, achieveType === 'offline' && styles.typeRadioSelected]}>
                    {achieveType === 'offline' && <View style={styles.typeRadioDot} />}
                  </View>
                </View>
                <View style={styles.typeExampleRow}>
                  {['Workshop', 'Symposium', 'Sports', 'Hackathon', 'NSS', 'Cultural', 'Paper Presentation'].map(ex => (
                    <View key={ex} style={styles.typeExampleChip}>
                      <Text style={styles.typeExampleText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              {!achieveType && (
                <View style={styles.typeInfoCard}>
                  <Feather name="info" size={15} color={PURPLE} />
                  <Text style={styles.typeInfoText}>Please select an achievement type to continue.</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryGradientBtn, { marginTop: 24 }, !achieveType && styles.primaryGradientBtnDisabled]}
                activeOpacity={achieveType ? 0.85 : 1}
                onPress={handleStep2Continue}
                disabled={!achieveType}>
                <Text style={styles.primaryBtnText}>Continue</Text>
                <Feather name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepTitleWrapper}>
                <Text style={styles.stepTitle}>Upload Proofs</Text>
                <Text style={styles.stepSubtitle}>
                  {achieveType === 'online'
                    ? 'Upload required online proof documents.'
                    : 'Upload required offline event documents.'}
                </Text>
              </View>

              <Text style={styles.proofSectionLabel}>✅  Required Documents</Text>
              <UploadCard label="Certificate" required
                file={certificate} iconName="file-text"
                onPick={() => triggerPicker('Certificate', setCertificate)}
                onRemove={() => setCertificate(null)} />

              {achieveType === 'online' && (<>
                <UploadCard label="Registration Email Screenshot" required
                  file={regEmail} iconName="mail"
                  onPick={() => triggerPicker('Registration Email', setRegEmail)}
                  onRemove={() => setRegEmail(null)} />
                <UploadCard label="Course Completion / Dashboard Screenshot" required
                  file={completionProof} iconName="monitor"
                  onPick={() => triggerPicker('Course Completion Screenshot', setCompletionProof)}
                  onRemove={() => setCompletionProof(null)} />
              </>)}

              {achieveType === 'offline' && (<>
                <UploadCard label="Event Brochure / Invitation Letter" required
                  file={brochure} iconName="book-open"
                  onPick={() => triggerPicker('Event Brochure', setBrochure)}
                  onRemove={() => setBrochure(null)} />
                <UploadCard label="Geo-tagged Event Photo" required
                  file={geoPhoto} iconName="map-pin"
                  onPick={() => triggerPicker('Geo-tagged Photo', setGeoPhoto)}
                  onRemove={() => setGeoPhoto(null)} />
                <UploadCard label="Student Photo at Event" required
                  file={eventPhoto} iconName="camera"
                  onPick={() => triggerPicker('Student Photo at Event', setEventPhoto)}
                  onRemove={() => setEventPhoto(null)} />
              </>)}

              <Text style={[styles.proofSectionLabel, { marginTop: 4 }]}>📎  Optional Documents</Text>
              <UploadCard
                label={achieveType === 'online' ? 'Badge Screenshot / Score Report' : 'Team Photo / Appreciation Letter'}
                file={optionalFile} iconName="image"
                onPick={() => triggerPicker('Optional Document', setOptionalFile)}
                onRemove={() => setOptionalFile(null)} />

              {achieveType === 'online' && !(certificate && regEmail && completionProof) && (
                <View style={styles.validationCard}>
                  <Feather name="alert-circle" size={15} color="#DC2626" />
                  <Text style={styles.validationText}>Please upload all required proof documents before submitting.</Text>
                </View>
              )}
              {achieveType === 'offline' && !(certificate && brochure && geoPhoto && eventPhoto) && (
                <View style={styles.validationCard}>
                  <Feather name="alert-circle" size={15} color="#DC2626" />
                  <Text style={styles.validationText}>Please upload all required proof documents before submitting.</Text>
                </View>
              )}

              <View style={styles.verifyInfoCard}>
                <View style={styles.verifyInfoHeader}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={PURPLE} />
                  <Text style={styles.verifyInfoTitle}>Verification Requirements</Text>
                </View>
                <View style={styles.verifyInfoDivider} />
                {[
                  'Upload clear, high-quality images.',
                  'Fake or edited certificates will be rejected.',
                  'All proofs are reviewed by the Academic Coordinator.',
                  'Missing proof may delay or deny approval.',
                ].map((item, i) => (
                  <View key={i} style={styles.verifyInfoRow}>
                    <Text style={styles.verifyInfoBullet}>•</Text>
                    <Text style={styles.verifyInfoText}>{item}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryGradientBtn, { marginTop: 24 },
                  (achieveType === 'online'  && !onlineReady)  && styles.primaryGradientBtnDisabled,
                  (achieveType === 'offline' && !offlineReady) && styles.primaryGradientBtnDisabled,
                ]}
                activeOpacity={0.85}
                onPress={handleStep3Submit}
                disabled={isSubmitting}>
                {isSubmitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <>
                      <Text style={styles.primaryBtnText}>Submit Achievement</Text>
                      <Feather name="check-circle" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </>
                }
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showSuccess} transparent animationType="fade" statusBarTranslucent
        onRequestClose={() => { setShowSuccess(false); onSubmitSuccess(); }}>
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successRingOuter}>
              <View style={styles.successRingInner}>
                <Feather name="check" size={36} color="#fff" />
              </View>
            </View>
            <Text style={styles.successTitle}>Achievement Submitted{'\n'}Successfully!</Text>
            <View style={styles.successStatusBadge}>
              <View style={styles.pendingDot} />
              <Text style={styles.successStatusText}>🟡 Pending Verification</Text>
            </View>
            <Text style={styles.successBody}>
              Your achievement has been submitted successfully. It will be reviewed by your Academic Coordinator. You will receive points after approval.
            </Text>
            <TouchableOpacity style={[styles.primaryGradientBtn, { width: '100%', marginTop: 20 }]}
              activeOpacity={0.85}
              onPress={() => { setShowSuccess(false); onSubmitSuccess(); }}>
              <Text style={styles.primaryBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Proof Picker Modal sheet */}
      <Modal visible={!!activePickerTarget} transparent animationType="slide" statusBarTranslucent
        onRequestClose={() => setActivePickerTarget(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActivePickerTarget(null)}>
          <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Feather name="upload-cloud" size={24} color={PURPLE} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetHeaderTitle}>Upload {activePickerTarget?.label || 'Proof'}</Text>
                <Text style={styles.sheetHeaderSub}>Select or capture the proof document</Text>
              </View>
              <TouchableOpacity onPress={() => setActivePickerTarget(null)} style={styles.sheetCloseBtn}>
                <Feather name="x" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.compactCategoryRow} activeOpacity={0.8}
              onPress={() => handlePickSource('camera')}>
              <Text style={styles.compactCategoryText}>📸 Take Photo with Camera</Text>
              <Feather name="chevron-right" size={16} color={PURPLE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.compactCategoryRow} activeOpacity={0.8}
              onPress={() => handlePickSource('gallery')}>
              <Text style={styles.compactCategoryText}>🖼 Choose from Files / Gallery</Text>
              <Feather name="chevron-right" size={16} color={PURPLE} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetPrimaryBtn, { backgroundColor: '#F1F5F9', shadowOpacity: 0, marginTop: 12 }]}
              onPress={() => setActivePickerTarget(null)}>
              <Text style={[styles.sheetPrimaryBtnText, { color: '#475569' }]}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <BottomNav active="achievements" onNav={navTo} />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   ABOUT SCREEN — shared across Student, Faculty & AC
═══════════════════════════════════════════════════════════ */
const AboutScreen = ({ onBack }) => (
  <SafeAreaView style={styles.safeAreaContainer}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <View style={styles.screenHeaderRow}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Feather name="arrow-left" size={20} color="#1D2939" />
      </TouchableOpacity>
      <Text style={styles.screenHeaderTitle}>About AchieveX</Text>
      <View style={{ width: 36 }} />
    </View>

    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
      {/* App Logo & Hero */}
      <View style={{ alignItems: 'center', paddingVertical: 32 }}>
        <View style={{ width: 84, height: 84, borderRadius: 24, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginBottom: 14, shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 6 }}>
          <Ionicons name="trophy" size={42} color={PURPLE} />
        </View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#1D2939', letterSpacing: -0.5 }}>AchieveX</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: '#F5F0FF', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 }}>
          <Feather name="tag" size={12} color={PURPLE} style={{ marginRight: 5 }} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: PURPLE }}>v1.0.0 — Stable Release</Text>
        </View>
      </View>

      {/* About Description */}
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1D2939', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Feather name="info" size={18} color={PURPLE} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1D2939' }}>About AchieveX</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22 }}>
          AchieveX is a smart achievement management platform that helps educational institutions manage, verify, and track student and faculty achievements with a secure, transparent, and user-friendly experience.
        </Text>
      </View>

      {/* Developer Card */}
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1D2939', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Feather name="code" size={18} color="#16A34A" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1D2939' }}>Developed By</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#1D2939', marginBottom: 4 }}>Avenzo Technologies Pvt. Ltd.</Text>
        <Text style={{ fontSize: 13.5, color: '#64748B', lineHeight: 20 }}>
          Building innovative digital solutions that empower education through modern technology and user-centric design.
        </Text>
      </View>

      {/* Institution */}
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1D2939', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="school-outline" size={18} color="#2563EB" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1D2939' }}>Institution</Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D2939', marginBottom: 2 }}>Nandha Engineering College</Text>
        <Text style={{ fontSize: 13, color: '#64748B' }}>Erode, Tamil Nadu, India</Text>
      </View>

      {/* Version & Copyright */}
      <View style={{ backgroundColor: '#F8F5FF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#EDE9FE' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Version</Text>
          <Text style={{ fontSize: 13, fontWeight: '800', color: PURPLE }}>AchieveX v1.0.0</Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#EDE9FE', marginBottom: 10 }} />
        <Text style={{ fontSize: 12.5, color: '#94A3B8', textAlign: 'center', lineHeight: 18 }}>
          © 2026 Avenzo Technologies Pvt. Ltd.{'\n'}All Rights Reserved.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

/* ═══════════════════════════════════════════════════════════
   CLEANED & WORKABLE SETTINGS SCREEN
═══════════════════════════════════════════════════════════ */
const SettingsScreen = ({ onBack, onLogout, navTo, profileImage, onUpdateProfileImage, onNavigateAbout }) => {
  const [notifAchievement, setNotifAchievement] = useState(true);
  const [notifAttendance,  setNotifAttendance]  = useState(true);
  const [notifCollege,     setNotifCollege]     = useState(true);
  const [notifLeaderboard, setNotifLeaderboard] = useState(true);

  // Edit Profile modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('Gokulraj');
  const [editDept, setEditDept] = useState('CSE (IoT)');
  const [editYear, setEditYear] = useState('III Year - Sec A');

  // Change Password modal
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Custom Modal States
  const [showFaqModal, setShowFaqModal]         = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showReportModal, setShowReportModal]   = useState(false);
  const [showPhotoPicker, setShowPhotoPicker]   = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage]         = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2200);
  };

  const handleSelectPhoto = (url) => {
    onUpdateProfileImage(url);
    setShowPhotoPicker(false);
    triggerToast('Profile picture updated successfully!');
  };

  const handleSaveProfile = () => {
    setShowEditProfileModal(false);
    triggerToast('Profile details updated successfully!');
  };

  const handleSavePassword = () => {
    if (!oldPass || !newPass) return;
    setShowChangePassModal(false);
    setOldPass(''); setNewPass('');
    triggerToast('Password changed successfully!');
  };

  const SectionHeader = ({ title }) => (
    <Text style={styles.settingsSectionTitle}>{title}</Text>
  );

  const SettingRow = ({ icon, iconLib, label, subtitle, onPress, rightEl, isLast = false }) => {
    const Ico = iconLib === 'Ionicons' ? Ionicons : iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;
    return (
      <>
        <TouchableOpacity
          style={styles.settingRow}
          activeOpacity={onPress ? 0.7 : 1}
          onPress={onPress}>
          <View style={styles.settingRowIcon}>
            <Ico name={icon} size={18} color={PURPLE} />
          </View>
          <View style={styles.settingRowContent}>
            <Text style={styles.settingRowLabel}>{label}</Text>
            {subtitle ? <Text style={styles.settingRowSub}>{subtitle}</Text> : null}
          </View>
          {rightEl ?? <Feather name="chevron-right" size={16} color="#CBD5E1" />}
        </TouchableOpacity>
        {!isLast && <View style={styles.settingDivider} />}
      </>
    );
  };

  const ToggleRow = ({ icon, iconLib, label, subtitle, value, onChange, isLast = false }) => (
    <SettingRow icon={icon} iconLib={iconLib} label={label} subtitle={subtitle} isLast={isLast}
      rightEl={
        <Switch value={value} onValueChange={onChange}
          trackColor={{ false: '#E2E8F0', true: '#DDD6FE' }}
          thumbColor={value ? PURPLE : '#94A3B8'}
          ios_backgroundColor="#E2E8F0" />
      } />
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.settingsPageSub}>Manage your account preferences and notification controls.</Text>

        {/* Account */}
        <SectionHeader title="Account Settings" />
        <View style={styles.settingsCard}>
          <SettingRow icon="user" label="Edit Profile" subtitle="Update your name, section, and details"
            onPress={() => setShowEditProfileModal(true)} />
          <SettingRow icon="key" label="Change Password" subtitle="Update your account password"
            onPress={() => setShowChangePassModal(true)} />
          <SettingRow icon="camera" label="Upload / Change Profile Picture" subtitle="Set a photo for your dashboard & rank card"
            isLast onPress={() => setShowPhotoPicker(true)} />
        </View>

        {/* Notifications with contextual icons */}
        <SectionHeader title="Notification Preferences" />
        <View style={styles.settingsCard}>
          <ToggleRow icon="award" iconLib="Feather" label="Achievement Updates"
            subtitle="Get notified when certificates are reviewed"
            value={notifAchievement} onChange={setNotifAchievement} />

          <ToggleRow icon="calendar-outline" iconLib="Ionicons" label="Attendance Alerts"
            subtitle="Alerts when attendance falls below 90%"
            value={notifAttendance} onChange={setNotifAttendance} />

          <ToggleRow icon="megaphone-outline" iconLib="Ionicons" label="College Announcements"
            subtitle="Official notices from Nandha College"
            value={notifCollege} onChange={setNotifCollege} />

          <ToggleRow icon="trophy-outline" iconLib="Ionicons" label="Leaderboard & Rank Changes"
            subtitle="Updates when your class rank changes"
            value={notifLeaderboard} onChange={setNotifLeaderboard} isLast />
        </View>

        {/* Help & Support */}
        <SectionHeader title="Support & Help" />
        <View style={styles.settingsCard}>
          <SettingRow icon="help-circle" label="Frequently Asked Questions"
            onPress={() => setShowFaqModal(true)} />
          <SettingRow icon="mail" label="Contact Academic Support"
            onPress={() => setShowSupportModal(true)} />
          <SettingRow icon="alert-triangle" label="Report a Technical Issue"
            onPress={() => setShowReportModal(true)} />
          {onNavigateAbout ? (
            <SettingRow icon="info" label="About AchieveX" isLast
              onPress={onNavigateAbout} />
          ) : null}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.settingsLogoutBtn} activeOpacity={0.85} onPress={onLogout}>
          <Feather name="log-out" size={17} color="#EF4444" />
          <Text style={styles.settingsLogoutText}>Logout Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Photo Picker Bottom Sheet ──────────────────── */}
      <Modal visible={showPhotoPicker} transparent animationType="slide" onRequestClose={() => setShowPhotoPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPhotoPicker(false)}>
          <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Feather name="camera" size={24} color={PURPLE} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetHeaderTitle}>Change Profile Picture</Text>
                <Text style={styles.sheetHeaderSub}>Choose a photo for your profile & leaderboard badge.</Text>
              </View>
            </View>
            <View style={styles.modalDivider} />
            {[
              { label: '📷 Take Photo with Camera', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop' },
              { label: '🖼 Choose from Photo Gallery', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' },
              { label: '👤 Use Student Default Avatar', url: null },
            ].map(opt => (
              <TouchableOpacity key={opt.label} style={styles.compactCategoryRow}
                activeOpacity={0.8} onPress={() => handleSelectPhoto(opt.url)}>
                <Text style={styles.compactCategoryText}>{opt.label}</Text>
                <Feather name="chevron-right" size={16} color={PURPLE} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.sheetPrimaryBtn, { backgroundColor: '#F1F5F9', shadowOpacity: 0, marginTop: 12 }]}
              onPress={() => setShowPhotoPicker(false)}>
              <Text style={[styles.sheetPrimaryBtnText, { color: '#475569' }]}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── FAQs Bottom Sheet ─────────────────────────── */}
      <Modal visible={showFaqModal} transparent animationType="slide" onRequestClose={() => setShowFaqModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowFaqModal(false)}>
          <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Feather name="help-circle" size={26} color={PURPLE} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetHeaderTitle}>❓ Frequently Asked Questions</Text>
                <Text style={styles.sheetHeaderSub}>Everything you need to know about points & verification.</Text>
              </View>
            </View>
            <View style={styles.modalDivider} />
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {[
                { q: 'How are achievement points calculated?', a: 'Points range from 2 to 10 based on category (e.g. Workshop=3, Hackathon=7, International=10).' },
                { q: 'Who verifies submitted certificates?', a: 'Your department Academic Coordinator reviews and approves all submitted proof documents.' },
                { q: 'When are points added to my leaderboard?', a: 'Points update automatically once your Coordinator marks the status as Approved.' },
              ].map(item => (
                <View key={item.q} style={{ backgroundColor: '#F8F5FF', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#EDE9FE' }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: PURPLE, marginBottom: 4 }}>{item.q}</Text>
                  <Text style={{ fontSize: 12.5, color: '#475569', lineHeight: 18 }}>{item.a}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.sheetPrimaryBtn} onPress={() => setShowFaqModal(false)}>
              <Text style={styles.sheetPrimaryBtnText}>Got it</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Contact Support Bottom Sheet ───────────────── */}
      <Modal visible={showSupportModal} transparent animationType="slide" onRequestClose={() => setShowSupportModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowSupportModal(false)}>
          <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="mail" size={26} color="#16A34A" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetHeaderTitle}>📞 Academic Support</Text>
                <Text style={styles.sheetHeaderSub}>Get in touch with Nandha Engineering College helpdesk.</Text>
              </View>
            </View>
            <View style={styles.modalDivider} />
            <View style={{ backgroundColor: '#F8F5FF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EDE9FE' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Feather name="mail" size={16} color={PURPLE} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D2939' }}>support@nandha.edu.in</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Feather name="phone" size={16} color={PURPLE} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D2939' }}>+91 98765 43210</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="clock" size={16} color={PURPLE} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 13, color: '#64748B' }}>Mon - Fri • 9:00 AM - 5:00 PM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.sheetPrimaryBtn} onPress={() => setShowSupportModal(false)}>
              <Text style={styles.sheetPrimaryBtnText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Report Issue Modal ───────────────────────── */}
      <Modal visible={showReportModal} transparent animationType="slide" onRequestClose={() => setShowReportModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowReportModal(false)}>
          <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#FEF2F2' }]}>
                <Feather name="alert-triangle" size={26} color="#EF4444" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetHeaderTitle}>🐞 Report Technical Issue</Text>
                <Text style={styles.sheetHeaderSub}>Describe what went wrong and our team will fix it.</Text>
              </View>
            </View>
            <View style={styles.modalDivider} />
            <Text style={styles.inputLabel}>Issue Summary</Text>
            <View style={[styles.roundedInputWrapper, { marginBottom: 16, width: '100%', height: 74, paddingVertical: 10 }]}>
              <TextInput style={[styles.roundedInput, { height: '100%', textAlignVertical: 'top' }]}
                multiline placeholder="Describe the problem you faced..." placeholderTextColor="#94A3B8" />
            </View>
            <TouchableOpacity style={[styles.sheetPrimaryBtn, { backgroundColor: '#EF4444', shadowColor: '#EF4444' }]}
              onPress={() => {
                setShowReportModal(false);
                triggerToast('Issue reported successfully. Thank you!');
              }}>
              <Text style={styles.sheetPrimaryBtnText}>Submit Report</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfileModal} transparent animationType="slide" onRequestClose={() => setShowEditProfileModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowEditProfileModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={[styles.sheetIconCircle, { marginBottom: 12 }]}>
              <Feather name="user" size={26} color={PURPLE} />
            </View>
            <Text style={styles.modalTitle}>Edit Profile Details</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[styles.roundedInputWrapper, { marginBottom: 12, width: '100%' }]}>
              <TextInput style={styles.roundedInput} value={editName} onChangeText={setEditName} />
            </View>
            <Text style={styles.inputLabel}>Department</Text>
            <View style={[styles.roundedInputWrapper, { marginBottom: 12, width: '100%' }]}>
              <TextInput style={styles.roundedInput} value={editDept} onChangeText={setEditDept} />
            </View>
            <Text style={styles.inputLabel}>Year & Section</Text>
            <View style={[styles.roundedInputWrapper, { marginBottom: 20, width: '100%' }]}>
              <TextInput style={styles.roundedInput} value={editYear} onChangeText={setEditYear} />
            </View>
            <TouchableOpacity style={[styles.primaryGradientBtn, { width: '100%' }]} onPress={handleSaveProfile}>
              <Text style={styles.primaryBtnText}>Save Profile</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassModal} transparent animationType="slide" onRequestClose={() => setShowChangePassModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowChangePassModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={[styles.sheetIconCircle, { backgroundColor: '#EDE9FE', marginBottom: 12 }]}>
              <Feather name="key" size={26} color={PURPLE} />
            </View>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={[styles.roundedInputWrapper, { marginBottom: 12, width: '100%' }]}>
              <TextInput style={styles.roundedInput} secureTextEntry placeholder="Enter current password" value={oldPass} onChangeText={setOldPass} />
            </View>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={[styles.roundedInputWrapper, { marginBottom: 20, width: '100%' }]}>
              <TextInput style={styles.roundedInput} secureTextEntry placeholder="Enter new password" value={newPass} onChangeText={setNewPass} />
            </View>
            <TouchableOpacity style={[styles.primaryGradientBtn, { width: '100%' }]} onPress={handleSavePassword}>
              <Text style={styles.primaryBtnText}>Update Password</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <BottomNav active="profile" onNav={navTo} />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   WORKABLE NOTIFICATIONS SCREEN
═══════════════════════════════════════════════════════════ */
const NotificationsScreen = ({ onBack, navTo }) => {
  const [filter, setFilter] = useState('All');
  const notifications = [
    { id: '1', title: 'Achievement Under Review', body: 'Your SIH 2026 certificate has been received and sent to your Academic Coordinator.', time: '10 mins ago', type: 'achievement', read: false, icon: 'award', iconBg: '#EDE8FF', iconCol: PURPLE },
    { id: '2', title: 'Attendance Alert 🌟', body: 'Great job! Your monthly attendance reached 96%. Eligible for exams.', time: '2 hours ago', type: 'attendance', read: false, icon: 'calendar', iconBg: '#DCFCE7', iconCol: '#16A34A' },
    { id: '3', title: 'Leaderboard Update 🏆', body: 'You moved up +3 positions in your Class Leaderboard! Now Ranked #1 in Class.', time: 'Yesterday', type: 'leaderboard', read: true, icon: 'bar-chart-2', iconBg: '#FEF9C3', iconCol: '#CA8A04' },
    { id: '4', title: 'College Notice: Hackathon 2026', body: 'Smart India Hackathon registrations open for III Year students. Submit before 30th July.', time: '2 days ago', type: 'notice', read: true, icon: 'megaphone', iconBg: '#DBEAFE', iconCol: '#2563EB' },
  ];

  const filtered = filter === 'All'
    ? notifications
    : filter === 'Unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter.toLowerCase());

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Notifications</Text>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => Alert.alert('Cleared', 'All notifications marked as read.')}>
          <Feather name="check-circle" size={18} color={PURPLE} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14 }}>
          {['All', 'Unread', 'Achievement', 'Attendance'].map(f => {
            const isActive = filter === f;
            return (
              <TouchableOpacity key={f}
                style={[styles.lbFilterChip, isActive && styles.lbFilterChipActive]}
                onPress={() => setFilter(f)} activeOpacity={0.7}>
                <Text style={[styles.lbFilterChipText, isActive && styles.lbFilterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filtered.map(item => (
          <TouchableOpacity key={item.id} style={[styles.notifCard, !item.read && styles.notifCardUnread]} activeOpacity={0.8}>
            <View style={[styles.notifIconBg, { backgroundColor: item.iconBg }]}>
              <Feather name={item.icon} size={20} color={item.iconCol} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNav active="home" onNav={navTo} />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   ATTENDANCE SCREEN
═══════════════════════════════════════════════════════════ */
const AttendanceScreen = ({ onBack, navTo }) => {
  const overallPct = 96;
  const subjects = [
    { code: 'CS3501', name: 'Internet of Things Architecture',     pct: 98, present: 24, total: 25 },
    { code: 'CS3502', name: 'Cloud Computing & Virtualization',    pct: 95, present: 21, total: 22 },
    { code: 'CS3503', name: 'Machine Learning Fundamentals',       pct: 96, present: 23, total: 24 },
    { code: 'CS3504', name: 'Embedded Systems & Sensors',          pct: 92, present: 22, total: 24 },
  ];
  const monthlyData = [
    { month: 'Apr', pct: 94 }, { month: 'May', pct: 97 },
    { month: 'Jun', pct: 93 }, { month: 'Jul', pct: 96 },
  ];
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Attendance</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.attOverviewCard}>
          <View style={styles.attCircleOuter}>
            <View style={styles.attCircleInner}>
              <Text style={styles.attPctNumber}>{overallPct}%</Text>
              <Text style={styles.attPctSub}>Overall</Text>
            </View>
          </View>
          <View style={styles.attOverviewDetails}>
            <Text style={styles.attStatusTitle}>Excellent Attendance! 🌟</Text>
            <Text style={styles.attStatusSub}>You meet the 75% minimum requirement easily.</Text>
            <View style={styles.attBadgeTag}>
              <Feather name="check-circle" size={13} color="#16A34A" />
              <Text style={styles.attBadgeText}>Eligible for Semester Exams</Text>
            </View>
          </View>
        </View>
        <View style={styles.attSummaryGrid}>
          {[['90','Present Days','#F0FDF4','#16A34A'],['4','Absent Days','#FEF2F2','#EF4444'],['94','Working Days','#F5F0FF',PURPLE]].map(([v,l,bg,col]) => (
            <View key={l} style={[styles.attSummaryBox, { backgroundColor: bg }]}>
              <Text style={[styles.attSummaryNum, { color: col }]}>{v}</Text>
              <Text style={styles.attSummaryLabel}>{l}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.attSectionTitle}>Monthly Attendance</Text>
        <View style={styles.attMonthlyCard}>
          {monthlyData.map(m => (
            <View key={m.month} style={styles.attMonthItem}>
              <View style={styles.attMonthBarTrack}>
                <View style={[styles.attMonthBarFill, { height: `${m.pct}%` }]} />
              </View>
              <Text style={styles.attMonthPct}>{m.pct}%</Text>
              <Text style={styles.attMonthLabel}>{m.month}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.attSectionTitle}>Subject-wise Attendance</Text>
        {subjects.map(sub => (
          <View key={sub.code} style={styles.attSubjectCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.attSubCode}>{sub.code}</Text>
              <Text style={[styles.attSubPct, { color: sub.pct >= 95 ? '#16A34A' : sub.pct >= 75 ? '#D97706' : '#EF4444' }]}>
                {sub.pct}%
              </Text>
            </View>
            <Text style={styles.attSubName}>{sub.name}</Text>
            <View style={styles.attProgressTrack}>
              <View style={[styles.attProgressFill, { width: `${sub.pct}%` }]} />
            </View>
            <Text style={styles.attSubClasses}>{sub.present} of {sub.total} classes attended</Text>
          </View>
        ))}
        <View style={styles.attMotivationCard}>
          <Ionicons name="sparkles" size={22} color={PURPLE} style={{ marginBottom: 6 }} />
          <Text style={styles.attMotivationTitle}>Keep up the 90%+ Streak!</Text>
          <Text style={styles.attMotivationBody}>
            Maintaining high attendance boosts your academic eligibility and unlocks exclusive campus achievement badges.
          </Text>
        </View>
      </ScrollView>
      <BottomNav active="home" onNav={navTo} />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   PROFILE SCREEN
═══════════════════════════════════════════════════════════ */
const ProfileScreen = ({ onBack, onLogout, navTo, profileImage, onUpdateProfileImage }) => (
  <SafeAreaView style={styles.safeAreaContainer}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <View style={styles.screenHeaderRow}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Feather name="arrow-left" size={20} color="#1D2939" />
      </TouchableOpacity>
      <Text style={styles.screenHeaderTitle}>My Profile</Text>
      <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => navTo('settings')}>
        <Feather name="edit-3" size={18} color={PURPLE} />
      </TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.profHeroCard}>
        <View style={styles.profAvatarWrapper}>
          <View style={styles.profAvatarCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 42 }} />
            ) : (
              <Text style={styles.profAvatarInitial}>G</Text>
            )}
          </View>
          <TouchableOpacity style={styles.profAvatarEditBadge} activeOpacity={0.8}
            onPress={() => {
              Alert.alert('Update Photo', 'Set new profile photo:', [
                { text: '📷 Photo 1', onPress: () => onUpdateProfileImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop') },
                { text: '🖼 Photo 2', onPress: () => onUpdateProfileImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop') },
                { text: 'Cancel', style: 'cancel' }
              ]);
            }}>
            <Feather name="camera" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profHeroName}>Gokulraj</Text>
        <Text style={styles.profHeroReg}>Reg No: 731821104042</Text>
        <View style={styles.profTagsRow}>
          <View style={styles.profTagPill}><Text style={styles.profTagText}>CSE (IoT)</Text></View>
          <View style={styles.profTagPill}><Text style={styles.profTagText}>III Year - Sec A</Text></View>
        </View>
        <View style={styles.profEmailRow}>
          <Feather name="mail" size={14} color="#64748B" />
          <Text style={styles.profEmailText}>gokulraj@nandha.edu.in</Text>
        </View>
      </View>

      <View style={styles.profAchieveLevelCard}>
        <View style={styles.profAchieveHeader}>
          <View style={styles.profMedalBox}><Ionicons name="medal" size={22} color="#D97706" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profBadgeTitle}>Bronze Explorer</Text>
            <Text style={styles.profBadgeSub}>Current Rank Level</Text>
          </View>
          <Text style={styles.profPointsText}>50 pts</Text>
        </View>
        <View style={styles.profProgressTrack}>
          <View style={[styles.profProgressFill, { width: '50%' }]} />
        </View>
        <Text style={styles.profNextLevelText}>50 / 100 points to Silver Scholar</Text>
      </View>

      <Text style={styles.profSectionTitle}>Quick Actions</Text>
      <View style={styles.profCardGroup}>
        {[
          { icon: 'award',         iconLib: 'Feather',  bg: '#EDE8FF', col: PURPLE,    label: 'My Certificates',          screen: 'myAchievements' },
          { icon: 'clock',         iconLib: 'Feather',  bg: '#FEF3C7', col: '#D97706', label: 'Achievement History',       screen: 'myAchievements' },
          { icon: 'trophy-outline',iconLib: 'Ionicons', bg: '#DCFCE7', col: '#16A34A', label: 'My Rank (#1 in Class)',     screen: 'leaderboard'    },
          { icon: 'settings',      iconLib: 'Feather',  bg: '#DBEAFE', col: '#2563EB', label: 'Settings & Preferences',   screen: 'settings'       },
        ].map(({ icon, iconLib, bg, col, label, screen }, i, arr) => {
          const Ico = iconLib === 'Ionicons' ? Ionicons : Feather;
          return (
            <React.Fragment key={label}>
              <TouchableOpacity style={styles.profActionRow} activeOpacity={0.7} onPress={() => navTo(screen)}>
                <View style={[styles.profActionIconBg, { backgroundColor: bg }]}><Ico name={icon} size={18} color={col} /></View>
                <Text style={styles.profActionLabel}>{label}</Text>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.profRowDivider} />}
            </React.Fragment>
          );
        })}
      </View>

      <Text style={styles.profSectionTitle}>App Information</Text>
      <View style={styles.profCardGroup}>
        <View style={styles.profActionRow}>
          <Feather name="info" size={16} color="#64748B" style={{ marginRight: 12 }} />
          <Text style={styles.profInfoKey}>App Version</Text>
          <Text style={styles.profInfoVal}>v2.4.0 (Build 54)</Text>
        </View>
        <View style={styles.profRowDivider} />
        <View style={styles.profActionRow}>
          <Feather name="shield" size={16} color="#64748B" style={{ marginRight: 12 }} />
          <Text style={styles.profInfoKey}>Institution</Text>
          <Text style={styles.profInfoVal}>Nandha Eng. College</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.profLogoutBtn} activeOpacity={0.85} onPress={onLogout}>
        <Feather name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={styles.profLogoutText}>Logout Account</Text>
      </TouchableOpacity>
    </ScrollView>
    <BottomNav active="profile" onNav={navTo} />
  </SafeAreaView>
);

/* ═══════════════════════════════════════════════════════════
   LEADERBOARD DATA
═══════════════════════════════════════════════════════════ */
const COLLEGE_LEADERBOARD = [
  { rank: 1, name: 'Kavya S.',       dept: 'ECE • 4th Year',           points: 520, level: 'Gold Explorer',   levelBadge: 'medal',            levelColor: '#EAB308', move: 'up',   moveCount: 2, isUser: false, avatarBg: '#FEF08A' },
  { rank: 2, name: 'Praveen Kumar',  dept: 'Mech • 4th Year',          points: 485, level: 'Silver Scholar',  levelBadge: 'medal-outline',    levelColor: '#94A3B8', move: 'same', moveCount: 0, isUser: false, avatarBg: '#E2E8F0' },
  { rank: 3, name: 'Ananya R.',      dept: 'IT • 3rd Year',            points: 410, level: 'Bronze Explorer', levelBadge: 'ribbon-outline',   levelColor: '#D97706', move: 'down', moveCount: 1, isUser: false, avatarBg: '#FFEDD5' },
  { rank: 4, name: 'Siddharth M.',   dept: 'EEE • 3rd Year',           points: 345, level: 'Bronze Explorer', levelBadge: 'ribbon-outline',   levelColor: '#D97706', move: 'up',   moveCount: 4, isUser: false, avatarBg: '#F1F5F9' },
  { rank: 5, name: 'Gokulraj',       dept: 'CSE (IoT) • III Year - A', points: 50,  level: 'Bronze Explorer', levelBadge: 'ribbon-outline',   levelColor: PURPLE,    move: 'up',   moveCount: 3, isUser: true,  avatarBg: '#EDE9FE' },
  { rank: 6, name: 'Nisha V.',       dept: 'Civil • 4th Year',         points: 35,  level: 'Novice Learner',  levelBadge: 'sparkles-outline', levelColor: '#64748B', move: 'down', moveCount: 2, isUser: false, avatarBg: '#F1F5F9' },
  { rank: 7, name: 'Rahul K.',       dept: 'AI & DS • 2nd Year',       points: 28,  level: 'Novice Learner',  levelBadge: 'sparkles-outline', levelColor: '#64748B', move: 'up',   moveCount: 1, isUser: false, avatarBg: '#F1F5F9' },
];
const DEPARTMENT_LEADERBOARD = [
  { rank: 1, name: 'Vikas Sharma',   dept: 'CSE (IoT) • IV Year',      points: 380, level: 'Gold Explorer',   levelBadge: 'medal',          levelColor: '#EAB308', move: 'same', moveCount: 0, isUser: false, avatarBg: '#FEF08A' },
  { rank: 2, name: 'Gokulraj',       dept: 'CSE (IoT) • III Year - A', points: 50,  level: 'Bronze Explorer', levelBadge: 'ribbon-outline', levelColor: PURPLE,    move: 'up',   moveCount: 2, isUser: true,  avatarBg: '#EDE9FE' },
  { rank: 3, name: 'Harish N.',      dept: 'CSE (IoT) • III Year - B', points: 45,  level: 'Bronze Explorer', levelBadge: 'ribbon-outline', levelColor: '#D97706', move: 'down', moveCount: 1, isUser: false, avatarBg: '#FFEDD5' },
  { rank: 4, name: 'Divya P.',       dept: 'CSE (IoT) • II Year',      points: 40,  level: 'Novice Learner',  levelBadge: 'sparkles-outline',levelColor: '#64748B',move: 'up',  moveCount: 1, isUser: false, avatarBg: '#E2E8F0' },
  { rank: 5, name: 'Arun Kumar',     dept: 'CSE (IoT) • IV Year',      points: 30,  level: 'Novice Learner',  levelBadge: 'sparkles-outline',levelColor: '#64748B',move: 'same',moveCount: 0, isUser: false, avatarBg: '#F1F5F9' },
];
const CLASS_LEADERBOARD = [
  { rank: 1, name: 'Gokulraj',       dept: 'CSE (IoT) • III Year - A', points: 50, level: 'Bronze Explorer', levelBadge: 'medal',           levelColor: PURPLE,    move: 'up',   moveCount: 1, isUser: true,  avatarBg: '#EDE9FE' },
  { rank: 2, name: 'Deepak Raj',     dept: 'CSE (IoT) • III Year - A', points: 40, level: 'Bronze Explorer', levelBadge: 'medal-outline',   levelColor: '#94A3B8', move: 'same', moveCount: 0, isUser: false, avatarBg: '#E2E8F0' },
  { rank: 3, name: 'Monika K.',      dept: 'CSE (IoT) • III Year - A', points: 35, level: 'Bronze Explorer', levelBadge: 'ribbon-outline',  levelColor: '#D97706', move: 'down', moveCount: 1, isUser: false, avatarBg: '#FFEDD5' },
  { rank: 4, name: 'Sanjay V.',      dept: 'CSE (IoT) • III Year - A', points: 20, level: 'Novice Learner',  levelBadge: 'sparkles-outline',levelColor: '#64748B', move: 'same', moveCount: 0, isUser: false, avatarBg: '#F1F5F9' },
  { rank: 5, name: 'Riya T.',        dept: 'CSE (IoT) • III Year - A', points: 15, level: 'Novice Learner',  levelBadge: 'sparkles-outline',levelColor: '#64748B', move: 'up',   moveCount: 2, isUser: false, avatarBg: '#F1F5F9' },
];

/* STAFF / FACULTY LEADERBOARDS */
const FACULTY_COLLEGE_LEADERBOARD = [
  { rank: 1, name: 'Dr. John Mathew',    dept: 'Dept of CSE • Assoc. Prof', points: 240, level: 'Senior Researcher', levelBadge: 'medal',          levelColor: '#EAB308', move: 'same', moveCount: 0, isUser: true,  avatarBg: '#FEF08A' },
  { rank: 2, name: 'Dr. Meenakshi S.',   dept: 'Dept of ECE • Professor',   points: 215, level: 'Lead Researcher',   levelBadge: 'medal-outline',  levelColor: '#94A3B8', move: 'up',   moveCount: 1, isUser: false, avatarBg: '#E2E8F0' },
  { rank: 3, name: 'Prof. Ramesh K.',    dept: 'Dept of IT • Asst. Prof',   points: 190, level: 'Active Educator',   levelBadge: 'ribbon-outline', levelColor: '#D97706', move: 'down', moveCount: 1, isUser: false, avatarBg: '#FFEDD5' },
  { rank: 4, name: 'Dr. Suresh Kumar',   dept: 'Dept of EEE • Assoc. Prof', points: 165, level: 'Active Educator',   levelBadge: 'ribbon-outline', levelColor: '#D97706', move: 'up',   moveCount: 2, isUser: false, avatarBg: '#F1F5F9' },
  { rank: 5, name: 'Prof. Alamelu M.',   dept: 'Dept of CSE • Coordinator', points: 150, level: 'Academic Guide',    levelBadge: 'sparkles-outline',levelColor: PURPLE,   move: 'same', moveCount: 0, isUser: false, avatarBg: '#EDE9FE' },
];
const FACULTY_DEPT_LEADERBOARD = [
  { rank: 1, name: 'Dr. John Mathew',    dept: 'CSE (IoT) • Assoc. Prof',   points: 240, level: 'Senior Researcher', levelBadge: 'medal',          levelColor: '#EAB308', move: 'same', moveCount: 0, isUser: true,  avatarBg: '#FEF08A' },
  { rank: 2, name: 'Prof. Alamelu M.',   dept: 'CSE (IoT) • Coordinator',   points: 150, level: 'Academic Guide',    levelBadge: 'ribbon-outline', levelColor: PURPLE,    move: 'up',   moveCount: 1, isUser: false, avatarBg: '#EDE9FE' },
  { rank: 3, name: 'Prof. Karthik S.',   dept: 'CSE (IoT) • Asst. Prof',    points: 120, level: 'Active Educator',   levelBadge: 'ribbon-outline', levelColor: '#D97706', move: 'down', moveCount: 1, isUser: false, avatarBg: '#FFEDD5' },
  { rank: 4, name: 'Dr. Kavitha R.',     dept: 'CSE (IoT) • Assoc. Prof',   points: 105, level: 'Academic Guide',    levelBadge: 'sparkles-outline',levelColor: '#64748B',move: 'same', moveCount: 0, isUser: false, avatarBg: '#F1F5F9' },
];

/* ═══════════════════════════════════════════════════════════
   LEADERBOARD SCREEN
═══════════════════════════════════════════════════════════ */
const LeaderboardScreen = ({ onBack, navTo, profileImage, isFaculty = false }) => {
  const [activeTab, setActiveTab]       = useState('College');
  const [activeFilter, setActiveFilter] = useState('This Month');
  const [searchQuery, setSearchQuery]   = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => { setActiveTab(newTab); setIsTransitioning(false); }, 150);
  };

  const getDataset = () => {
    if (isFaculty) {
      if (activeTab === 'Department' || activeTab === 'Class') return FACULTY_DEPT_LEADERBOARD;
      return FACULTY_COLLEGE_LEADERBOARD;
    }
    if (activeTab === 'Department') return DEPARTMENT_LEADERBOARD;
    if (activeTab === 'Class')      return CLASS_LEADERBOARD;
    return COLLEGE_LEADERBOARD;
  };

  const currentDataset = getDataset();
  const top3            = [currentDataset[0], currentDataset[1], currentDataset[2]];
  const remainingStudents = currentDataset.slice(3).filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentUserObj  = currentDataset.find(s => s.isUser) || { rank: 4, points: 50 };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: BG }]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <View style={[styles.screenHeaderRow, { backgroundColor: BG }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Leaderboard</Text>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="share-2" size={18} color={PURPLE} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.lbPillTabContainer}>
          {['College', 'Department', 'Class'].map(t => {
            const isActive = activeTab === t;
            return (
              <TouchableOpacity key={t}
                style={[styles.lbPillTab, isActive && styles.lbPillTabActive]}
                onPress={() => handleTabChange(t)} activeOpacity={0.8}>
                <Text style={[styles.lbPillTabText, isActive && styles.lbPillTabTextActive]}>
                  {t === 'College' ? '🏫 College' : t === 'Department' ? '🏢 Dept' : '👨‍🎓 Class'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.lbSearchWrapper}>
          <Feather name="search" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput style={styles.lbSearchInput} placeholder={`Search in ${activeTab}...`}
            placeholderTextColor="#94A3B8" value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {['Today', 'This Month', 'Semester', 'Overall'].map(f => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity key={f}
                style={[styles.lbFilterChip, isActive && styles.lbFilterChipActive]}
                onPress={() => setActiveFilter(f)} activeOpacity={0.7}>
                <Text style={[styles.lbFilterChipText, isActive && styles.lbFilterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ opacity: isTransitioning ? 0.3 : 1 }}>
          <View style={styles.lbPodiumContainer}>
            {[top3[1], top3[0], top3[2]].map((s, idx) => {
              if (!s) return <View key={idx} style={{ flex: 1 }} />;
              const isGold   = idx === 1;
              const isSilver = idx === 0;
              const pillarH  = isGold ? 56 : isSilver ? 42 : 32;
              const pillarBg = isGold ? '#FDE047' : isSilver ? '#E2E8F0' : '#FED7AA';
              const rankNum  = isGold ? 1 : isSilver ? 2 : 3;
              const cardStyle = isGold ? styles.lbPodiumGold : isSilver ? styles.lbPodiumSilver : styles.lbPodiumBronze;
              return (
                <View key={s.name + idx}
                  style={[styles.lbPodiumCard, cardStyle, s.isUser && styles.lbPodiumUserHighlight]}>
                  {isGold && (
                    <View style={styles.lbCrownIconWrapper}>
                      <MaterialCommunityIcons name="crown" size={22} color="#EAB308" />
                    </View>
                  )}
                  <View style={[styles.lbPodiumAvatarCircle, { backgroundColor: s.avatarBg, width: isGold ? 60 : 52, height: isGold ? 60 : 52, borderRadius: isGold ? 30 : 26 }]}>
                    {s.isUser && profileImage ? (
                      <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: isGold ? 30 : 26 }} />
                    ) : (
                      <Text style={[styles.lbPodiumAvatarInitial, { fontSize: isGold ? 22 : 18 }]}>{s.name[0]}</Text>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={styles.lbPodiumName} numberOfLines={1}>{s.name}</Text>
                    {s.isUser && <View style={styles.lbYouBadge}><Text style={styles.lbYouBadgeText}>YOU</Text></View>}
                  </View>
                  <Text style={styles.lbPodiumDept} numberOfLines={1}>{s.dept}</Text>
                  <View style={[styles.lbPodiumPointsBadge, isGold && { backgroundColor: '#FEF08A' }]}>
                    <Text style={[styles.lbPodiumPointsText, isGold && { color: '#854D0E' }]}>{s.points} pts</Text>
                  </View>
                  <View style={[styles.lbPodiumPillar, { height: pillarH, backgroundColor: pillarBg }]}>
                    <Text style={[styles.lbPodiumRankNum, isGold && { fontSize: 22, color: '#854D0E' }]}>{rankNum}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.lbListSectionTitle}>{activeTab} Rankings</Text>

          {remainingStudents.map(student => (
            <View key={`${activeTab}-${student.rank}-${student.name}`}
              style={[styles.lbStudentCard, student.isUser && styles.lbUserStudentCard]}>
              <View style={styles.lbRankCol}>
                <Text style={[styles.lbRankText, student.isUser && { color: PURPLE }]}>#{student.rank}</Text>
                {student.move === 'up'   && <Text style={styles.lbMoveUpText}>▲ {student.moveCount}</Text>}
                {student.move === 'down' && <Text style={styles.lbMoveDownText}>▼ {student.moveCount}</Text>}
                {student.move === 'same' && <Text style={styles.lbMoveSameText}>•</Text>}
              </View>
              <View style={[styles.lbStudentAvatar, { backgroundColor: student.avatarBg }]}>
                {student.isUser && profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 22 }} />
                ) : (
                  <Text style={styles.lbStudentAvatarText}>{student.name[0]}</Text>
                )}
              </View>
              <View style={styles.lbStudentInfoCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.lbStudentName, student.isUser && styles.lbUserName]}>{student.name}</Text>
                  {student.isUser && <View style={styles.lbYouBadge}><Text style={styles.lbYouBadgeText}>YOU</Text></View>}
                </View>
                <Text style={styles.lbStudentDept}>{student.dept}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name={student.levelBadge} size={11} color={student.levelColor} />
                  <Text style={[styles.lbLevelText, { color: student.levelColor }]}>{student.level}</Text>
                </View>
              </View>
              <Text style={[styles.lbStudentPoints, student.isUser && { color: PURPLE }]}>
                {student.points}<Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '500' }}> pts</Text>
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.lbStatsCard}>
          <View style={styles.lbStatsHeader}>
            <Ionicons name="sparkles" size={20} color={PURPLE} />
            <Text style={styles.lbStatsTitle}>Your {activeTab} Statistics</Text>
          </View>
          <View style={styles.lbStatsDivider} />
          <View style={styles.lbStatsGrid}>
            {[['#'+currentUserObj.rank,`${activeTab} Rank`],[currentUserObj.points+'','Total Points'],[currentUserObj.rank===1?'Top 1%':`Top ${currentUserObj.rank*10}%`,'Percentile'],['2','Achievements']].map(([v,k]) => (
              <View key={k} style={styles.lbStatGridItem}>
                <Text style={styles.lbStatGridVal}>{v}</Text>
                <Text style={styles.lbStatGridKey}>{k}</Text>
              </View>
            ))}
          </View>
          <View style={styles.lbProgressBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={styles.lbProgressLabel}>Level Progress</Text>
              <Text style={styles.lbProgressValue}>{currentUserObj.points} / 100 pts</Text>
            </View>
            <View style={styles.lbProgressTrack}>
              <View style={[styles.lbProgressFill, { width: `${Math.min((currentUserObj.points/100)*100,100)}%` }]} />
            </View>
            <Text style={styles.lbProgressNote}>
              ⚡ {currentUserObj.rank === 1 ? 'You are currently #1 in your Class! 🏆' : `Need ${100 - currentUserObj.points} more points to level up!`}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="leaderboard" onNav={navTo} />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   PREMIUM REDESIGNED MY ACHIEVEMENTS SCREEN
═══════════════════════════════════════════════════════════ */
const MyAchievementsScreen = ({ onBack, hasSubmitted, onGoUpload, navTo, initialTab, isFaculty = false }) => {
  const [tab, setTab] = useState(initialTab || 'All');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const items = [
    { id: '1', title: 'Smart India Hackathon 2026', category: 'Hackathon Finalist', organizer: 'Ministry of Education (MoE)', date: '20 Jul 2026', level: 'National Level', status: 'Under review', statusBg: '#FEF3C7', statusCol: '#D97706', points: '+7 pts (Pending)', icon: 'code-slash' },
    { id: '2', title: 'NPTEL Cloud Computing', category: 'Certification', organizer: 'NPTEL / IIT Madras', date: '18 Jul 2026', level: 'National Level', status: 'Approved', statusBg: '#DCFCE7', statusCol: '#16A34A', points: '+4 Achievement Points', icon: 'ribbon' },
    { id: '3', title: 'IoT Systems & Sensors Workshop', category: 'Workshop', organizer: 'Sri Ramakrishna Engineering College', date: '10 Jun 2026', level: 'College Level', status: 'Approved', statusBg: '#DCFCE7', statusCol: '#16A34A', points: '+3 Achievement Points', icon: 'hardware-chip' },
  ];

  const displayItems = !hasSubmitted
    ? []
    : tab === 'Approved'
    ? items.filter(i => i.status === 'Approved')
    : tab === 'Pending'
    ? items.filter(i => i.status === 'Under review')
    : items;

  const handleDownloadPdf = async () => {
    if (!hasSubmitted || items.length === 0) {
      Alert.alert('No Achievements', 'You have no achievements to export yet.');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const userName = isFaculty ? 'Dr. John Mathew' : 'Gokulraj';
      const userRole = isFaculty ? 'Associate Professor · Dept. of CSE' : 'CSE (IoT) · III Year · Sec A';
      const generatedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

      const achievementCards = items.map((item, idx) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;border:1.5px solid #EDE9FE;border-radius:12px;background:#ffffff;overflow:hidden;">
          <tr>
            <td style="background:#7C3AED;padding:12px 16px;border-radius:10px 10px 0 0;">
              <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);letter-spacing:0.5px;">ACHIEVEMENT ${idx + 1}</span>
              <span style="font-size:14px;font-weight:800;color:#ffffff;display:block;margin-top:2px;">${item.title}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-bottom:10px;vertical-align:top;">
                    <div style="font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Category</div>
                    <div style="font-size:13px;color:#1D2939;font-weight:600;">${item.category}</div>
                  </td>
                  <td width="50%" style="padding-bottom:10px;vertical-align:top;">
                    <div style="font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">College / Organization</div>
                    <div style="font-size:13px;color:#1D2939;font-weight:600;">${item.organizer || 'N/A'}</div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding-bottom:10px;vertical-align:top;">
                    <div style="font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Achievement Level</div>
                    <div style="font-size:13px;color:#1D2939;font-weight:600;">${item.level}</div>
                  </td>
                  <td width="50%" style="padding-bottom:10px;vertical-align:top;">
                    <div style="font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Date Submitted</div>
                    <div style="font-size:13px;color:#1D2939;font-weight:600;">${item.date}</div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align:top;">
                    <div style="font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Points Earned</div>
                    <div style="font-size:13px;color:#7C3AED;font-weight:800;">${item.points}</div>
                  </td>
                  <td width="50%" style="vertical-align:top;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `).join('');

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
</head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#7C3AED;border-radius:12px;margin-bottom:20px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">AchieveX</div>
                    <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:2px;">Achievement Report</div>
                  </td>
                  <td align="right">
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);">Generated on</div>
                    <div style="font-size:13px;font-weight:700;color:#ffffff;margin-top:2px;">${generatedDate}</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid rgba(255,255,255,0.2);padding-top:16px;">
                <tr>
                  <td>
                    <div style="font-size:18px;font-weight:800;color:#ffffff;">${userName}</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:3px;">${userRole}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Section Title -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="4" style="background:#7C3AED;border-radius:3px;">&nbsp;</td>
                  <td style="padding-left:10px;font-size:15px;font-weight:800;color:#1D2939;">My Achievements</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Achievement Cards -->
        ${achievementCards}

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-top:1px solid #EDE9FE;padding-top:16px;">
          <tr>
            <td align="center" style="font-size:11px;color:#94A3B8;">
              This report was auto-generated by <span style="color:#7C3AED;font-weight:700;">AchieveX</span>. For verification, contact your Academic Coordinator.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share your Achievements PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Saved!', `PDF saved to: ${uri}`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>{isFaculty ? 'My Achievements' : 'My Certificates'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {hasSubmitted && (
            <TouchableOpacity
              onPress={handleDownloadPdf}
              style={[styles.infoBtn, { backgroundColor: isGeneratingPdf ? '#EDE9FE' : '#7C3AED', borderRadius: 10, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }]}
              activeOpacity={0.8}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf
                ? <ActivityIndicator size="small" color="#7C3AED" />
                : <Feather name="download" size={17} color="#fff" />
              }
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onGoUpload} style={styles.infoBtn} activeOpacity={0.7}>
            <Feather name="plus" size={20} color={PURPLE} />
          </TouchableOpacity>
        </View>
      </View>

      {!hasSubmitted ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyFolderCircle}><Text style={{ fontSize: 44 }}>📂</Text></View>
          <Text style={styles.emptyTitle}>No Achievements Yet</Text>
          <Text style={styles.emptyDesc}>Upload your first achievement to start building your verified portfolio.</Text>
          <TouchableOpacity style={[styles.primaryGradientBtn, { width: 220, marginTop: 24 }]}
            activeOpacity={0.85} onPress={onGoUpload}>
            <Text style={styles.primaryBtnText}>Upload Achievement</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Summary stats */}
          <View style={styles.achieveStatsHero}>
            <View style={styles.achieveStatItem}>
              <Text style={styles.achieveStatVal}>3</Text>
              <Text style={styles.achieveStatLabel}>Submitted</Text>
            </View>
            <View style={styles.achieveStatDivider} />
            <View style={styles.achieveStatItem}>
              <Text style={[styles.achieveStatVal, { color: '#16A34A' }]}>2</Text>
              <Text style={styles.achieveStatLabel}>Approved</Text>
            </View>
            <View style={styles.achieveStatDivider} />
            <View style={styles.achieveStatItem}>
              <Text style={[styles.achieveStatVal, { color: '#D97706' }]}>1</Text>
              <Text style={styles.achieveStatLabel}>Pending</Text>
            </View>
          </View>

          {/* Download Banner */}
          <TouchableOpacity
            onPress={handleDownloadPdf}
            activeOpacity={0.85}
            disabled={isGeneratingPdf}
            style={styles.pdfBannerBtn}
          >
            <View style={styles.pdfBannerIconBox}>
              {isGeneratingPdf
                ? <ActivityIndicator size="small" color="#fff" />
                : <Feather name="download" size={18} color="#fff" />
              }
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pdfBannerTitle}>{isGeneratingPdf ? 'Generating PDF…' : 'Download as PDF'}</Text>
              <Text style={styles.pdfBannerSub}>Export your achievement report</Text>
            </View>
            <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Filter Tabs */}
          <View style={[styles.lbPillTabContainer, { marginVertical: 14 }]}>
            {['All', 'Approved', 'Pending'].map(t => {
              const isActive = tab === t;
              return (
                <TouchableOpacity key={t}
                  style={[styles.lbPillTab, isActive && styles.lbPillTabActive]}
                  onPress={() => setTab(t)} activeOpacity={0.8}>
                  <Text style={[styles.lbPillTabText, isActive && styles.lbPillTabTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Premium Cards */}
          {displayItems.map(item => (
            <View key={item.id} style={styles.premiumAchieveCard}>
              <View style={styles.premiumAchieveHeader}>
                <View style={styles.premiumAchieveIconBox}>
                  <Ionicons name={item.icon} size={22} color={PURPLE} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.premiumAchieveTitle}>{item.title}</Text>
                  <Text style={styles.premiumAchieveCategory}>{item.category} • {item.level}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                  <Text style={[styles.statusText, { color: item.statusCol }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.premiumAchieveDivider} />

              <View style={styles.premiumAchieveFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="calendar" size={13} color="#94A3B8" />
                  <Text style={styles.premiumAchieveDate}>Submitted {item.date}</Text>
                </View>
                <Text style={[styles.premiumAchievePoints, item.status === 'Approved' && { color: '#16A34A' }]}>
                  {item.points}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <BottomNav active="achievements" onNav={navTo} />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   FACULTY REVIEWS SCREEN (Review Submissions & Verification)
═══════════════════════════════════════════════════════════ */
const FacultyReviewsScreen = ({ onBack, navTo }) => {
  const [tab, setTab] = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected'
  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState(null); // for detail modal
  const [remarks, setRemarks] = useState('');

  const submissions = [
    {
      id: 'sub-1', studentName: 'Gokulraj S', regNo: '731821104042', dept: 'CSE (IoT)',
      title: 'Smart India Hackathon 2026 Finalist', category: 'Hackathon Finalist', date: '28 Jul 2026',
      status: 'Pending', points: 7, type: 'online',
      proofs: ['Certificate', 'Registration Email Screenshot', 'Dashboard Leaderboard Screenshot'],
      remarks: ''
    },
    {
      id: 'sub-2', studentName: 'Kavya M', regNo: '731821104018', dept: 'CSE (IoT)',
      title: 'NPTEL Cloud Computing Certification (Score: 92%)', category: 'Course / Certification', date: '26 Jul 2026',
      status: 'Approved', points: 4, type: 'online',
      proofs: ['NPTEL Certificate', 'Score Report PDF'],
      remarks: 'Verified & approved by Dr. John Mathew.'
    },
    {
      id: 'sub-3', studentName: 'Rahul R', regNo: '731821104033', dept: 'CSE (IoT)',
      title: 'National Level Paper Presentation 1st Prize', category: 'Paper Presentation', date: '25 Jul 2026',
      status: 'Pending', points: 5, type: 'offline',
      proofs: ['1st Prize Certificate', 'Geo-tagged Event Photo', 'Event Brochure', 'Group Photo'],
      remarks: ''
    },
    {
      id: 'sub-4', studentName: 'Anitha P', regNo: '731821104005', dept: 'CSE (IoT)',
      title: 'AI & ML 5-Day Workshop', category: 'Workshop', date: '22 Jul 2026',
      status: 'Rejected', points: 3, type: 'offline',
      proofs: ['Workshop Certificate'],
      remarks: 'Missing geo-tagged event photo proof.'
    },
  ];

  const filtered = submissions.filter(s => {
    const matchTab = s.status === tab;
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        s.title.toLowerCase().includes(search.toLowerCase()) ||
                        s.regNo.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Review Achievements</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.roundedInputWrapper, { marginVertical: 12 }]}>
          <Feather name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput style={styles.roundedInput} placeholder="Search student name, reg no, title..."
            placeholderTextColor="#94A3B8" value={search} onChangeText={setSearch} />
        </View>

        {/* Status Filter Tabs */}
        <View style={styles.lbPillTabContainer}>
          {['Pending', 'Approved', 'Rejected'].map(t => {
            const isActive = tab === t;
            return (
              <TouchableOpacity key={t} style={[styles.lbPillTab, isActive && styles.lbPillTabActive]}
                onPress={() => setTab(t)} activeOpacity={0.8}>
                <Text style={[styles.lbPillTabText, isActive && styles.lbPillTabTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submissions List */}
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginVertical: 40 }}>
            <Feather name="inbox" size={38} color="#CBD5E1" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B', marginTop: 8 }}>No Submissions Found</Text>
          </View>
        ) : (
          filtered.map(sub => (
            <View key={sub.id} style={[styles.premiumAchieveCard, { marginTop: 12 }]}>
              <View style={styles.premiumAchieveHeader}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: PURPLE_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: PURPLE }}>{sub.studentName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1D2939' }}>{sub.studentName}</Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>Reg: {sub.regNo} • {sub.dept}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sub.status === 'Approved' ? '#DCFCE7' : sub.status === 'Pending' ? '#FEF3C7' : '#FEE2E2' }]}>
                  <Text style={[styles.statusText, { color: sub.status === 'Approved' ? '#16A34A' : sub.status === 'Pending' ? '#D97706' : '#EF4444' }]}>{sub.status}</Text>
                </View>
              </View>

              <View style={{ marginTop: 10, paddingHorizontal: 4 }}>
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: '#1D2939' }}>{sub.title}</Text>
                <Text style={{ fontSize: 12, color: PURPLE, fontWeight: '600', marginTop: 2 }}>{sub.category} • ⭐ {sub.points} Points Awardable</Text>
              </View>

              <View style={styles.premiumAchieveDivider} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#94A3B8' }}>Submitted {sub.date}</Text>
                <TouchableOpacity style={{ backgroundColor: PURPLE, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}
                  onPress={() => setSelectedSub(sub)}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── ACHIEVEMENT DETAILS MODAL ───────────────────────── */}
      <Modal visible={!!selectedSub} transparent animationType="slide" onRequestClose={() => setSelectedSub(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedSub(null)}>
          <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Feather name="file-text" size={24} color={PURPLE} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sheetHeaderTitle}>Achievement Details</Text>
                <Text style={styles.sheetHeaderSub}>Review student submission & proof documents</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedSub(null)} style={styles.sheetCloseBtn}>
                <Feather name="x" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />

            {selectedSub && (
              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: '#F8F5FF', padding: 14, borderRadius: 14, marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#1D2939' }}>{selectedSub.studentName}</Text>
                  <Text style={{ fontSize: 12.5, color: '#64748B' }}>Reg: {selectedSub.regNo} | {selectedSub.dept}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: PURPLE, marginTop: 8 }}>{selectedSub.title}</Text>
                  <Text style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Category: {selectedSub.category} ({selectedSub.points} Points)</Text>
                </View>

                <Text style={{ fontSize: 13, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', marginBottom: 6 }}>Uploaded Proof Documents ({selectedSub.type.toUpperCase()})</Text>
                {selectedSub.proofs.map((proof, idx) => (
                  <View key={proof} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDE9FE', padding: 10, borderRadius: 12, marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="check-circle" size={16} color="#16A34A" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#1D2939' }}>{proof}</Text>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert('Proof Preview', `Displaying verified document file for ${proof}`)}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: PURPLE }}>Preview</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <Text style={{ fontSize: 13, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', marginTop: 10, marginBottom: 6 }}>Faculty Remarks</Text>
                <View style={[styles.roundedInputWrapper, { height: 60, paddingVertical: 6 }]}>
                  <TextInput style={[styles.roundedInput, { height: '100%' }]} placeholder="Add feedback or change requests..."
                    placeholderTextColor="#94A3B8" value={remarks} onChangeText={setRemarks} multiline />
                </View>

                {/* 3 Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                  <TouchableOpacity style={{ flex: 1, height: 46, borderRadius: 14, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      setSelectedSub(null);
                      Alert.alert('Approved ✅', `Achievement approved! ⭐ ${selectedSub.points} Points awarded to student.`);
                    }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#16A34A' }}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flex: 1, height: 46, borderRadius: 14, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      setSelectedSub(null);
                      Alert.alert('Changes Requested ⚠️', 'Notification sent to student to re-upload required proof documents.');
                    }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#D97706' }}>Request Changes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flex: 1, height: 46, borderRadius: 14, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      setSelectedSub(null);
                      Alert.alert('Rejected ❌', 'Achievement submission rejected.');
                    }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#EF4444' }}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <BottomNav active="facultyReviews" onNav={navTo} isFaculty />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   FACULTY STUDENT PROGRESS SCREEN
═══════════════════════════════════════════════════════════ */
const FacultyStudentProgressScreen = ({ onBack, navTo }) => {
  const [search, setSearch] = useState('');
  const students = [
    { name: 'Gokulraj S', regNo: '731821104042', dept: 'CSE (IoT)', year: 'III Year', attendance: '96%', cgpa: '8.9', points: 50, approved: 3, pending: 1 },
    { name: 'Kavya M', regNo: '731821104018', dept: 'CSE (IoT)', year: 'III Year', attendance: '92%', cgpa: '9.2', points: 85, approved: 6, pending: 0 },
    { name: 'Rahul R', regNo: '731821104033', dept: 'CSE (IoT)', year: 'III Year', attendance: '88%', cgpa: '8.4', points: 30, approved: 2, pending: 1 },
  ];

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.includes(search));

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Student Academic Progress</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.roundedInputWrapper, { marginVertical: 12 }]}>
          <Feather name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput style={styles.roundedInput} placeholder="Search student name or register no..."
            placeholderTextColor="#94A3B8" value={search} onChangeText={setSearch} />
        </View>

        {filtered.map(st => (
          <View key={st.regNo} style={[styles.premiumAchieveCard, { marginTop: 12 }]}>
            <View style={styles.premiumAchieveHeader}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: PURPLE_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: PURPLE }}>{st.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1D2939' }}>{st.name}</Text>
                <Text style={{ fontSize: 12, color: '#64748B' }}>Reg: {st.regNo} • {st.dept} ({st.year})</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
              <View style={{ flex: 1, backgroundColor: '#F8F5FF', borderRadius: 12, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Attendance</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#2563EB' }}>{st.attendance}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#F8F5FF', borderRadius: 12, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#64748B' }}>CGPA</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: PURPLE }}>{st.cgpa}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#F8F5FF', borderRadius: 12, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Points</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#16A34A' }}>{st.points} pts</Text>
              </View>
            </View>

            <View style={styles.premiumAchieveDivider} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>{st.approved} Approved • {st.pending} Pending</Text>
              <TouchableOpacity style={{ backgroundColor: PURPLE_LIGHT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
                onPress={() => Alert.alert('Student Report', `Generated detailed academic report card for ${st.name}`)}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: PURPLE }}>Performance Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomNav active="facultyDashboard" onNav={navTo} isFaculty />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════
   FACULTY ACHIEVEMENT UPLOAD SCREEN
═══════════════════════════════════════════════════════════ */
const FacultyUploadScreen = ({ onBack, navTo }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle]       = useState('');
  const [journal, setJournal]   = useState('');
  const [date, setDate]         = useState('');
  const [proof, setProof]       = useState(null);

  const categories = ['Workshop / FDP', 'Conference Paper', 'Journal Publication', 'Patent Filed / Granted', 'Book Chapter', 'Guest Lecture', 'Project Guidance'];

  const handleSubmit = () => {
    if (!category || !title || !journal || !date) {
      Alert.alert('Required Fields', 'Please fill in all mandatory fields.');
      return;
    }
    Alert.alert('Success ✅', 'Faculty achievement submitted successfully to HOD dashboard!');
    onBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#1D2939" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Upload Faculty Achievement</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 13.5, color: '#64748B', marginVertical: 10 }}>Submit your research publications, FDPs, and academic achievements.</Text>

        <Text style={styles.inputLabel}>Select Achievement Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {categories.map(c => (
            <TouchableOpacity key={c} style={[styles.levelChip, category === c && styles.levelChipActive]}
              onPress={() => setCategory(c)}>
              <Text style={[styles.levelChipText, category === c && styles.levelChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.inputLabel}>Title of Publication / Event</Text>
        <View style={[styles.roundedInputWrapper, { marginBottom: 12 }]}>
          <TextInput style={styles.roundedInput} placeholder="e.g. Deep Learning in IoT"
            placeholderTextColor="#98A2B3" value={title} onChangeText={setTitle} />
        </View>

        <Text style={styles.inputLabel}>Journal / Publisher / Organizer</Text>
        <View style={[styles.roundedInputWrapper, { marginBottom: 12 }]}>
          <TextInput style={styles.roundedInput} placeholder="e.g. IEEE Transactions / Springer"
            placeholderTextColor="#98A2B3" value={journal} onChangeText={setJournal} />
        </View>

        <Text style={styles.inputLabel}>Date of Publication / Completion</Text>
        <View style={[styles.roundedInputWrapper, { marginBottom: 14 }]}>
          <TextInput style={styles.roundedInput} placeholder="DD / MM / YYYY"
            placeholderTextColor="#98A2B3" value={date} onChangeText={setDate} />
        </View>

        <Text style={styles.inputLabel}>Upload Proof Document (PDF / Image)</Text>
        <TouchableOpacity style={styles.uploadCardLarge} activeOpacity={0.8}
          onPress={() => setProof({ name: 'Faculty_Research_Proof.pdf', size: '3.2 MB' })}>
          <Feather name="upload-cloud" size={26} color={PURPLE} />
          <Text style={styles.uploadCardTitle}>{proof ? proof.name : 'Tap to select document'}</Text>
          <Text style={styles.uploadCardSub}>{proof ? proof.size : 'PDF • PNG • JPG • Max 15 MB'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sheetPrimaryBtn, { marginTop: 20 }]} onPress={handleSubmit}>
          <Text style={styles.sheetPrimaryBtnText}>Submit Faculty Achievement</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="facultyDashboard" onNav={navTo} isFaculty />
    </SafeAreaView>
  );
};
const AchievementCard = ({ points, total, pointsToNext, profileImage }) => {
  const pct = total > 0 ? Math.round((points / total) * 100) : 0;
  return (
    <View style={styles.achieveCard}>
      <View style={styles.achieveRow}>
        <View style={styles.medalCol}>
          <Ionicons name="medal" size={38} color="#C8860A" />
          <View style={styles.medalRibbon} />
        </View>
        <View style={styles.achieveContent}>
          <Text style={styles.achieveTitle}>Bronze Explorer</Text>
          <Text style={styles.achieveSubLabel}>Achievement Points</Text>
          <View style={styles.achievePointsRow}>
            <Text style={styles.achievePointsNum}>{points}</Text>
            <Text style={styles.achievePointsDen}> /{total}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressPct}>{pct}%</Text>
        </View>

        {/* User profile picture circle */}
        <View style={styles.avatarCircle}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 25 }} />
          ) : (
            <Text style={{ fontSize: 20, fontWeight: '800', color: PURPLE }}>G</Text>
          )}
        </View>
      </View>
      <View style={styles.achieveDivider} />
      <View style={styles.nextLevelRow}>
        <Ionicons name="ribbon-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
        <View>
          <Text style={styles.nextLevelLabel}>Next Level</Text>
          <Text style={styles.nextLevelName}>Silver Scholar</Text>
        </View>
        <Text style={styles.nextLevelPoints}>{pointsToNext} more points to reach</Text>
      </View>
    </View>
  );
};

const WorkspaceItem = ({ iconName, iconLib, bgColor, iconColor, label, subtitle, onPress }) => {
  const Ico = iconLib === 'Ionicons' ? Ionicons : iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;
  return (
    <TouchableOpacity style={styles.workspaceItem} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.workspaceIconBg, { backgroundColor: bgColor }]}>
        <Ico name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={styles.workspaceLabel}>{label}</Text>
      {subtitle ? <Text style={styles.workspaceSub}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
};

const AcademicCard = ({ title, icon, iconLib, iconColor, bgColor, value, label, onPress }) => {
  const Ico = iconLib === 'Ionicons' ? Ionicons : iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;
  return (
    <TouchableOpacity style={styles.academicCard} activeOpacity={onPress ? 0.7 : 1} onPress={onPress}>
      <Text style={styles.academicTitle}>{title}</Text>
      <View style={styles.academicMainRow}>
        <View style={[styles.academicIconBg, { backgroundColor: bgColor }]}>
          <Ico name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.academicValue}>{value}</Text>
      </View>
      <Text style={styles.academicLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP ROUTER
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [userRole, setUserRole] = useState('student'); // 'student' | 'faculty' | 'coordinator'
  const [hasUploadedCertificate, setHasUploadedCertificate] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Goal Tracking State
  const [currentGoal, setCurrentGoal] = useState({
    title: 'Become Gold Explorer',
    targetPoints: 50,
    currentPoints: 34,
    deadline: '31 Dec 2026',
    category: 'Milestone',
    status: 'On Track',
    createdDate: '15 Jan 2026'
  });

  // User Profile Image State (synced across Settings, Profile & Dashboard)
  const [profileImage, setProfileImage] = useState(null);

  const [loginEmail,       setLoginEmail]       = useState('');
  const [loginPassword,    setLoginPassword]    = useState('');
  const [registerName,     setRegisterName]     = useState('');
  const [registerCollege,  setRegisterCollege]  = useState('');
  const [registerEmail,    setRegisterEmail]    = useState('');
  const [registerCode,     setRegisterCode]     = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showInfoModal,    setShowInfoModal]    = useState(false);
  const [showForgotModal,  setShowForgotModal]  = useState(false);
  const [showLoginPass,    setShowLoginPass]    = useState(false);
  const [showRegisterPass, setShowRegisterPass] = useState(false);

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 2500);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const currentDash = hasUploadedCertificate ? 'dashboardSecond' : 'dashboardFirst';

  const navTo = (key) => {
    if (key === 'logout')   { setScreen('login'); return; }
    if (key === 'home')     { setScreen(currentDash); return; }
    setScreen(key);
  };

  const dashNavTo = (key) => {
    if (key === 'home')         setScreen(currentDash);
    if (key === 'achievements') setScreen('myAchievements');
    if (key === 'leaderboard')  setScreen('leaderboard');
    if (key === 'profile')      setScreen('profile');
    if (key === 'notifications')setScreen('notifications');
  };

  // Faculty equivalent of dashNavTo — mirrors student exactly
  const [hasFacultyUploaded, setHasFacultyUploaded] = useState(false);
  const facultyDash = hasFacultyUploaded ? 'facultyDashSecond' : 'facultyDashFirst';
  const [facultyAchievementsTab, setFacultyAchievementsTab] = useState('All');

  const facultyNavTo = (key) => {
    if (key === 'logout')              { setScreen('login'); return; }
    if (key === 'facultyHome')         { setScreen(facultyDash); return; }
    if (key === 'facultyAchievements') { setScreen('facultyAchievements'); return; }
    if (key === 'leaderboard')         { setScreen('leaderboard'); return; }
    if (key === 'facultyProfile')      { setScreen('facultyProfile'); return; }
    if (key === 'notifications')       { setScreen('notifications'); return; }
    setScreen(key);
  };

  const DashHeader = () => (
    <View style={styles.dashTopBar}>
      <TouchableOpacity onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
        <Ionicons name="menu-outline" size={28} color="#1D2939" />
      </TouchableOpacity>
      <View style={styles.dashGreeting}>
        <Text style={styles.dashCollegeName}>Nandha Engineering College</Text>
        <Text style={styles.dashName}>Good Morning, Gokulraj 👋</Text>
        <Text style={styles.dashTagline}>Make today count</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setScreen('notifications')}>
        <View>
          <Ionicons name="notifications-outline" size={25} color="#1D2939" />
          <View style={styles.dashNotifBadge} />
        </View>
      </TouchableOpacity>
    </View>
  );

  /* SPLASH */
  if (screen === 'splash') {
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: '#F4F8FF' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F8FF" />
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1} onPress={() => setScreen('login')}>
          <Image source={require('./assets/splash_uploaded.png')}
            style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /* LOGIN */
  if (screen === 'login') {
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: '#FFFDF8' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF8" />
        <BackgroundOrnaments />
        <ForgotPasswordModal visible={showForgotModal} onClose={() => setShowForgotModal(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            <View style={styles.logoContainer}>
              <Image source={require('./assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.titleText}>Welcome Back 👋</Text>
              <Text style={styles.subtitleText}>Sign in using your college account to continue.</Text>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="College email" placeholderTextColor="#98A2B3"
                  value={loginEmail} onChangeText={setLoginEmail} keyboardType="email-address" autoCapitalize="none" />
                <Feather name="at-sign" size={20} color="#98A2B3" style={styles.inputIcon} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#98A2B3"
                  value={loginPassword} onChangeText={setLoginPassword} secureTextEntry={!showLoginPass} />
                <TouchableOpacity onPress={() => setShowLoginPass(v => !v)} style={{ padding: 4, marginLeft: 6 }} activeOpacity={0.7}>
                  <Feather name={showLoginPass ? 'eye' : 'eye-off'} size={20} color="#98A2B3" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}
                onPress={() => setShowForgotModal(true)}>
                <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
              </TouchableOpacity>
            </View>


            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.blueButton} activeOpacity={0.8}
                onPress={() => {
                  if (!loginEmail.trim()) {
                    Alert.alert('Required Field Missing', 'Please enter your college email address to sign in.');
                    return;
                  }
                  if (!loginPassword.trim()) {
                    Alert.alert('Required Field Missing', 'Please enter your password to sign in.');
                    return;
                  }
                  const localPart = (loginEmail.split('@')[0] || '').toLowerCase();
                  // Academic Coordinator check: alamelu@nandhaengg.org, academiciot@nandhaengg.org, aciot@nandhaengg.org
                  const isCoordinatorEmail = localPart === 'alamelu' || localPart === 'academiciot' || localPart === 'aciot';
                  // Faculty check: mohan@nandhaengg.org or any non-coordinator name starting with letters
                  const isFacultyEmail = !isCoordinatorEmail && localPart.length > 0 && /^[a-zA-Z]/.test(localPart);

                  if (isCoordinatorEmail) {
                    setUserRole('coordinator');
                    setScreen('coordinatorModule');
                  } else if (isFacultyEmail) {
                    setUserRole('faculty');
                    setScreen(facultyDash);
                  } else {
                    setUserRole('student');
                    setScreen(currentDash);
                  }
                }}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerContainer}>
              <Text style={styles.footerLabel}>First time using AchieveX?</Text>
              <TouchableOpacity onPress={() => setScreen('createAccount')} activeOpacity={0.7}>
                <Text style={styles.blueLinkText}>Activate Account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /* CREATE ACCOUNT */
  if (screen === 'createAccount') {
    const regLocalPart = (registerEmail.split('@')[0] || '').toLowerCase();
    const isRegCoordinator = regLocalPart === 'alamelu' || regLocalPart === 'academiciot' || regLocalPart === 'aciot';
    const isRegFaculty = !isRegCoordinator && regLocalPart.length > 0 && /^[a-zA-Z]/.test(regLocalPart);

    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: '#FFFDF8' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF8" />
        <BackgroundOrnaments />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            <View style={styles.logoContainer}>
              <Image source={require('./assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.titleText}>Create Account</Text>
              <Text style={styles.subtitleText}>Use your official college credentials to continue.</Text>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#98A2B3"
                  value={registerName} onChangeText={setRegisterName} />
                <Feather name="user" size={20} color="#667085" style={styles.inputIcon} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="College name" placeholderTextColor="#98A2B3"
                  value={registerCollege} onChangeText={setRegisterCollege} />
                <Ionicons name="school-outline" size={20} color="#667085" style={styles.inputIcon} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input}
                  placeholder={isRegFaculty ? 'Faculty email (e.g. ramesh@nandhaengg.org)' : 'Student email (e.g. 23ci011@nandhaengg.org)'}
                  placeholderTextColor="#98A2B3"
                  value={registerEmail} onChangeText={setRegisterEmail}
                  keyboardType="email-address" autoCapitalize="none" />
                <Feather name="at-sign" size={20} color={isRegFaculty ? '#1D6FD8' : PURPLE} style={styles.inputIcon} />
              </View>
              {/* Role detected badge */}
              {registerEmail.length > 3 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: (registerEmail.toLowerCase().startsWith('academiciot') || registerEmail.toLowerCase().startsWith('aciot')) ? '#F3E8FF' : isRegFaculty ? '#EFF6FF' : '#F5F0FF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 8, borderWidth: 1, borderColor: (registerEmail.toLowerCase().startsWith('academiciot') || registerEmail.toLowerCase().startsWith('aciot')) ? '#D8B4FE' : isRegFaculty ? '#BFDBFE' : '#EDE9FE' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: (registerEmail.toLowerCase().startsWith('academiciot') || registerEmail.toLowerCase().startsWith('aciot')) ? PURPLE : isRegFaculty ? '#1D6FD8' : PURPLE }}>
                    {(registerEmail.toLowerCase().startsWith('academiciot') || registerEmail.toLowerCase().startsWith('aciot')) ? '🛡️ Academic Coordinator Account Detected' : isRegFaculty ? '👨‍🏫 Faculty Account Detected' : '🎓 Student Account Detected'}
                  </Text>
                </View>
              )}
              <View style={styles.rowInputContainer}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput style={styles.input} placeholder="Activation Code"
                    placeholderTextColor="#98A2B3" value={registerCode} onChangeText={setRegisterCode} />
                  <Feather name="key" size={20} color="#667085" style={styles.inputIcon} />
                </View>
                <TouchableOpacity style={styles.infoIconWrapper} activeOpacity={0.7}
                  onPress={() => setShowInfoModal(true)}>
                  <View style={styles.infoBadge}>
                    <Feather name="info" size={16} color="#6927DA" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#98A2B3"
                  value={registerPassword} onChangeText={setRegisterPassword} secureTextEntry={!showRegisterPass} />
                <TouchableOpacity onPress={() => setShowRegisterPass(v => !v)} style={{ padding: 4, marginLeft: 6 }} activeOpacity={0.7}>
                  <Feather name={showRegisterPass ? 'eye' : 'eye-off'} size={20} color="#667085" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity style={isRegFaculty ? [styles.purpleButton, { backgroundColor: '#1D6FD8' }] : styles.purpleButton} activeOpacity={0.8}
                onPress={() => {
                  if (!registerName.trim()) {
                    Alert.alert('Required Field Missing', 'Please enter your full name.');
                    return;
                  }
                  if (!registerEmail.trim()) {
                    Alert.alert('Required Field Missing', 'Please enter your college email address.');
                    return;
                  }
                  if (!registerCode.trim()) {
                    Alert.alert('Required Field Missing', 'Please enter your activation code.');
                    return;
                  }
                  if (!registerPassword.trim()) {
                    Alert.alert('Required Field Missing', 'Please enter a password.');
                    return;
                  }
                  const regLocal = (registerEmail.split('@')[0] || '').toLowerCase();
                  if (regLocal === 'academiciot' || regLocal === 'aciot' || regLocal === 'alamelu') {
                    setUserRole('coordinator');
                    setScreen('coordinatorModule');
                  } else if (isRegFaculty) {
                    setUserRole('faculty');
                    setScreen(facultyDash);
                  } else {
                    setUserRole('student');
                    setScreen(currentDash);
                  }
                }}>
                <Text style={styles.buttonText}>{(registerEmail.toLowerCase().startsWith('academiciot') || registerEmail.toLowerCase().startsWith('aciot')) ? '🛡️ Activate Coordinator Account' : isRegFaculty ? '👨‍🏫 Activate Faculty Account' : '🎓 Activate Student Account'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerContainer}>
              <Text style={styles.footerLabel}>Already have an account?</Text>
              <TouchableOpacity onPress={() => setScreen('login')} activeOpacity={0.7}>
                <Text style={styles.purpleLinkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={showInfoModal} transparent animationType="slide" statusBarTranslucent
              onRequestClose={() => setShowInfoModal(false)}>
              <Pressable style={styles.modalOverlay} onPress={() => setShowInfoModal(false)}>
                <Pressable style={styles.compactBottomSheet} onPress={() => {}}>
                  {/* Drag Handle */}
                  <View style={styles.sheetDragHandle} />

                  {/* Header */}
                  <View style={styles.sheetHeaderRow}>
                    <View style={[styles.sheetIconCircle, { backgroundColor: '#EDE9FE', width: 54, height: 54, borderRadius: 27 }]}>
                      <Feather name="key" size={24} color={PURPLE} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={[styles.sheetHeaderTitle, { fontSize: 18 }]}>🔑 Activation Code</Text>
                      <Text style={styles.sheetHeaderSub}>Required to activate your AchieveX account</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.sheetCloseBtn} activeOpacity={0.7}>
                      <Feather name="x" size={18} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalDivider} />

                  {/* Steps */}
                  {[
                    { step: '1', icon: 'user', title: 'Contact Your Coordinator', desc: 'Reach out to your Academic Coordinator or HOD to obtain the code.' },
                    { step: '2', icon: 'mail', title: 'Check College Email', desc: 'The code is sometimes sent to your registered college email address.' },
                    { step: '3', icon: 'shield', title: 'One-Time Use Code', desc: 'Each activation code is unique and can only be used once per account.' },
                  ].map((item) => (
                    <View key={item.step} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginRight: 12, flexShrink: 0 }}>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: PURPLE }}>{item.step}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#1D2939', marginBottom: 2 }}>{item.title}</Text>
                        <Text style={{ fontSize: 12.5, color: '#64748B', lineHeight: 18 }}>{item.desc}</Text>
                      </View>
                    </View>
                  ))}

                  {/* Contact Card */}
                  <View style={{ backgroundColor: '#F8F5FF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EDE9FE', marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Feather name="phone" size={14} color={PURPLE} style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1D2939' }}>Need Help?</Text>
                    </View>
                    <Text style={{ fontSize: 12.5, color: '#475569', lineHeight: 18 }}>
                      Contact{' '}
                      <Text style={{ fontWeight: '700', color: PURPLE }}>Academic Coordinator</Text>
                      {' '}or{' '}
                      <Text style={{ fontWeight: '700', color: PURPLE }}>College Administration</Text>
                      {' '}to get your activation code.
                    </Text>
                  </View>

                  <TouchableOpacity style={[styles.sheetPrimaryBtn, { marginTop: 14 }]} activeOpacity={0.85}
                    onPress={() => setShowInfoModal(false)}>
                    <Text style={styles.sheetPrimaryBtnText}>Got it, Thanks!</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /* SUB-SCREENS */
  if (screen === 'uploadAchievement') {
    return (
      <UploadAchievementScreen
        onBack={() => setScreen(currentDash)}
        navTo={dashNavTo}
        onSubmitSuccess={() => {
          setHasUploadedCertificate(true);
          setScreen('dashboardSecond');
        }}
      />
    );
  }
  if (screen === 'myAchievements') {
    return <MyAchievementsScreen onBack={() => setScreen(currentDash)} navTo={dashNavTo}
      hasSubmitted={hasUploadedCertificate} onGoUpload={() => setScreen('uploadAchievement')} isFaculty={false} />;
  }
  if (screen === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setScreen(userRole === 'faculty' ? 'facultyDashSecond' : userRole === 'coordinator' ? 'coordinatorModule' : currentDash)} navTo={userRole === 'faculty' ? facultyNavTo : dashNavTo} profileImage={profileImage} isFaculty={userRole === 'faculty' || userRole === 'coordinator'} />;
  }
  if (screen === 'attendance') {
    return <AttendanceScreen onBack={() => setScreen(currentDash)} navTo={dashNavTo} />;
  }
  if (screen === 'profile') {
    return <ProfileScreen onBack={() => setScreen(currentDash)} onLogout={() => setScreen('login')}
      profileImage={profileImage} onUpdateProfileImage={setProfileImage}
      navTo={(key) => {
        if (key === 'settings') { setScreen('settings'); return; }
        if (key === 'myAchievements') { setScreen('myAchievements'); return; }
        if (key === 'leaderboard') { setScreen('leaderboard'); return; }
        dashNavTo(key);
      }} />;
  }
  if (screen === 'settings') {
    return <SettingsScreen onBack={() => setScreen(userRole === 'faculty' ? facultyDash : currentDash)} onLogout={() => setScreen('login')}
      navTo={dashNavTo} profileImage={profileImage} onUpdateProfileImage={setProfileImage}
      onNavigateAbout={() => setScreen('about')} />;
  }
  if (screen === 'facultySettings') {
    return <SettingsScreen onBack={() => setScreen(facultyDash)} onLogout={() => setScreen('login')}
      navTo={facultyNavTo} profileImage={profileImage} onUpdateProfileImage={setProfileImage}
      onNavigateAbout={() => setScreen('about')} />;
  }
  if (screen === 'about') {
    return <AboutScreen onBack={() => setScreen(screen === 'coordinatorModule' ? 'coordinatorModule' : userRole === 'faculty' ? facultyDash : currentDash)} />;
  }
  if (screen === 'notifications') {
    return <NotificationsScreen onBack={() => setScreen(userRole === 'faculty' ? facultyDash : currentDash)} navTo={userRole === 'faculty' ? facultyNavTo : dashNavTo} />;
  }

  /* ═══════════════════════════════════════════════════════════
     FACULTY MODULE SCREENS
  ═══════════════════════════════════════════════════════════ */

  /* FACULTY DASHBOARDS (identical layout to student) */
  if (screen === 'facultyDashFirst' || screen === 'facultyDashSecond') {
    const isFirst = screen === 'facultyDashFirst';
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: BG }]}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)}
          onNav={facultyNavTo} currentScreen={screen} profileImage={profileImage} isFaculty />

        <ScrollView contentContainerStyle={styles.dashScroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.dashTopBar}>
            <TouchableOpacity onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
              <Ionicons name="menu-outline" size={28} color="#1D2939" />
            </TouchableOpacity>
            <View style={styles.dashGreeting}>
              <Text style={styles.dashCollegeName}>Nandha Engineering College</Text>
              <Text style={styles.dashName}>Good Morning, Dr. Rajesh 👋</Text>
              <Text style={styles.dashTagline}>Keep inspiring minds</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setScreen('notifications')}>
              <View>
                <Ionicons name="notifications-outline" size={25} color="#1D2939" />
                <View style={styles.dashNotifBadge} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Achievement Points Card (identical style to student) */}
          <View style={styles.achieveCard}>
            <View style={styles.achieveRow}>
              <View style={styles.medalCol}>
                <Ionicons name="medal" size={38} color="#C8860A" />
                <View style={styles.medalRibbon} />
              </View>
              <View style={styles.achieveContent}>
                <Text style={styles.achieveTitle}>Gold Researcher</Text>
                <Text style={styles.achieveSubLabel}>Faculty Achievement Points</Text>
                <View style={styles.achievePointsRow}>
                  <Text style={styles.achievePointsNum}>{isFirst ? 0 : 10}</Text>
                  <Text style={styles.achievePointsDen}> /50</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: isFirst ? '0%' : '20%' }]} />
                </View>
                <Text style={styles.progressPct}>{isFirst ? 0 : 20}%</Text>
              </View>

              {/* User profile picture circle */}
              <View style={styles.avatarCircle}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 25 }} />
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: '800', color: PURPLE }}>R</Text>
                )}
              </View>
            </View>
            <View style={styles.achieveDivider} />
            <View style={styles.nextLevelRow}>
              <Ionicons name="ribbon-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.nextLevelLabel}>Next Level</Text>
                <Text style={styles.nextLevelName}>Senior Researcher</Text>
              </View>
              <Text style={styles.nextLevelPoints}>{isFirst ? 50 : 40} more points to reach</Text>
            </View>
          </View>

          {/* Getting Started — First Dashboard only */}
          {isFirst && (
            <>
              <Text style={styles.sectionTitle}>Getting Started</Text>
              <View style={styles.sectionCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.stepsContent}>
                  <TouchableOpacity style={styles.stepItem} onPress={() => setScreen('facultyUpload')}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#EDE8FF', borderWidth: 2, borderColor: PURPLE }]}>
                      <Feather name="upload-cloud" size={22} color={PURPLE} />
                    </View>
                    <Text style={styles.stepLabel}>Upload{'\n'}Achievement</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepDots}>• • • •</Text>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#DCFCE7' }]}>
                      <Feather name="check-circle" size={22} color="#16A34A" />
                    </View>
                    <Text style={styles.stepLabel}>Get{'\n'}Verified</Text>
                  </View>
                  <Text style={styles.stepDots}>• • • •</Text>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#FEF9C3' }]}>
                      <Ionicons name="document-text-outline" size={22} color="#CA8A04" />
                    </View>
                    <Text style={styles.stepLabel}>Earn 10{'\n'}Points</Text>
                  </View>
                  <Text style={styles.stepDots}>• • • •</Text>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#F1F5F9' }]}>
                      <Ionicons name="ribbon-outline" size={22} color="#94A3B8" />
                    </View>
                    <Text style={[styles.stepLabel, { color: '#94A3B8' }]}>Unlock{'\n'}Senior</Text>
                  </View>
                </ScrollView>
              </View>
            </>
          )}

          {/* Goal Tracker Card */}
          <GoalProgressCard 
            currentGoal={currentGoal} 
            onNavigate={() => setScreen('goalTracker')} 
          />

          {/* Workspace */}
          <Text style={styles.sectionTitle}>Your Workspace</Text>
          <View style={styles.sectionCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.workspaceContent}>
              <WorkspaceItem iconName="upload-cloud" iconLib="Feather"
                bgColor="#EDE8FF" iconColor={PURPLE} label="Add Achievement"
                subtitle="Upload Achievement" onPress={() => setScreen('facultyUpload')} />
              <WorkspaceItem iconName="trophy-outline" iconLib="Ionicons"
                bgColor="#DCFCE7" iconColor="#16A34A" label="My Achievements"
                subtitle="View all submitted" onPress={() => setScreen('facultyAchievements')} />
              <WorkspaceItem iconName="bar-chart-2" iconLib="Feather"
                bgColor="#FEF9C3" iconColor="#CA8A04" label="Leaderboard"
                subtitle="See rankings" onPress={() => setScreen('leaderboard')} />
              <WorkspaceItem iconName="settings" iconLib="Feather"
                bgColor="#F1F5F9" iconColor="#64748B" label="Settings"
                subtitle="Preferences" onPress={() => setScreen('facultySettings')} />
            </ScrollView>
          </View>

          {/* ── STATS CARDS GRID — Faculty ── */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>

            {/* Stat 1 — Pending */}
            <TouchableOpacity style={styles.statCard} activeOpacity={0.82}
              onPress={() => { setFacultyAchievementsTab('Pending'); setScreen('facultyAchievements'); }}>
              <View style={[styles.statIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Feather name="file-text" size={22} color="#D97706" />
              </View>
              <Text style={[styles.statNum, { color: '#D97706' }]}>2</Text>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statSub}>Awaiting HOD</Text>
            </TouchableOpacity>

            {/* Stat 2 — Total Points */}
            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="medal" size={22} color={PURPLE} />
              </View>
              <Text style={[styles.statNum, { color: PURPLE }]}>{isFirst ? '0' : '10'}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
              <Text style={styles.statSub}>Faculty Points</Text>
            </View>

            {/* Stat 3 — Approved */}
            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="check-circle" size={22} color="#16A34A" />
              </View>
              <Text style={[styles.statNum, { color: '#16A34A' }]}>{isFirst ? '0' : '35'}</Text>
              <Text style={styles.statLabel}>Approved</Text>
              <Text style={styles.statSub}>All Time</Text>
            </View>

            {/* Stat 4 — Dept Rank */}
            <TouchableOpacity style={styles.statCard} activeOpacity={0.82}
              onPress={() => setScreen('leaderboard')}>
              <View style={[styles.statIconBg, { backgroundColor: '#DBEAFE' }]}>
                <Feather name="bar-chart-2" size={22} color="#2563EB" />
              </View>
              <Text style={[styles.statNum, { color: '#2563EB' }]}>#3</Text>
              <Text style={styles.statLabel}>Dept Rank</Text>
              <Text style={styles.statSub}>View Board →</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        <BottomNav active="facultyHome" onNav={facultyNavTo} isFaculty />
      </SafeAreaView>
    );
  }

  /* GOAL TRACKER SCREENS */
  if (screen === 'goalTracker') {
    return (
      <GoalTrackerScreen
        onBack={() => setScreen(userRole === 'coordinator' ? 'coordinatorModule' : userRole === 'faculty' ? facultyDash : currentDash)}
        currentGoal={currentGoal}
        onNavigateCreateGoal={() => setScreen('createGoal')}
      />
    );
  }

  if (screen === 'createGoal') {
    return (
      <CreateGoalScreen
        onBack={() => setScreen('goalTracker')}
        onSaveGoal={(newGoal) => {
          setCurrentGoal(newGoal);
        }}
      />
    );
  }

  /* ACADEMIC COORDINATOR MODULE */
  if (screen === 'coordinatorModule' || userRole === 'coordinator') {
    return (
      <AcademicCoordinatorModule
        onLogout={() => setScreen('login')}
        profileImage={profileImage}
        currentGoal={currentGoal}
        onNavigateGoalTracker={() => setScreen('goalTracker')}
        onNavigateMyAchievements={() => setScreen('myAchievements')}
        onNavigateLeaderboard={() => setScreen('leaderboard')}
        onNavigateUploadAchievement={() => setScreen('uploadAchievement')}
        onNavigateAbout={() => setScreen('about')}
      />
    );
  }

  /* FACULTY MY ACHIEVEMENTS SCREEN (exactly duplicates student MyAchievements UI) */
  if (screen === 'facultyAchievements') {
    return (
      <MyAchievementsScreen
        onBack={() => { setFacultyAchievementsTab('All'); setScreen(facultyDash); }}
        navTo={facultyNavTo}
        hasSubmitted={hasFacultyUploaded}
        onGoUpload={() => setScreen('facultyUpload')}
        initialTab={facultyAchievementsTab}
        isFaculty={true}
      />
    );
  }

  /* FACULTY UPLOAD ACHIEVEMENT SCREEN (reuses identical 3-step student upload UI layout) */
  if (screen === 'facultyUpload') {
    const facultyCategories = ['Conference', 'Workshop', 'FDP', 'Patent', 'Journal', 'Book Chapter', 'Guest Lecture', 'Industrial Training', 'Seminar', 'Professional Certification'];
    return (
      <UploadAchievementScreen
        onBack={() => setScreen(facultyDash)}
        navTo={facultyNavTo}
        onSubmitSuccess={() => {
          setHasFacultyUploaded(true);
          setScreen('facultyDashSecond');
        }}
      />
    );
  }

  /* FACULTY PROFILE SCREEN (duplicates student profile UI exactly) */
  if (screen === 'facultyProfile') {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity onPress={() => setScreen(facultyDash)} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color="#1D2939" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Faculty Profile</Text>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => setScreen('facultySettings')}>
            <Feather name="edit-3" size={18} color={PURPLE} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View style={styles.profHeroCard}>
            <View style={styles.avatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 25 }} />
              ) : (
                <Text style={{ fontSize: 20, fontWeight: '800', color: PURPLE }}>R</Text>
              )}
            </View>
            <Text style={styles.profHeroName}>Dr. Rajesh</Text>
            <Text style={styles.profHeroReg}>Emp ID: NEC-CSE-108</Text>
            <View style={styles.profTagsRow}>
              <View style={styles.profTagPill}><Text style={styles.profTagText}>CSE Department</Text></View>
              <View style={styles.profTagPill}><Text style={styles.profTagText}>Associate Professor</Text></View>
            </View>
            <View style={styles.profEmailRow}>
              <Feather name="mail" size={14} color="#64748B" />
              <Text style={styles.profEmailText}>rajeshcse@nandhaengg.org</Text>
            </View>
          </View>

          <Text style={styles.profSectionTitle}>Professional Details</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Designation', val: 'Professor', bg: '#EDE8FF', col: PURPLE },
              { label: 'Faculty Points', val: hasFacultyUploaded ? '10' : '0', bg: '#DCFCE7', col: '#16A34A' },
              { label: 'Experience', val: '8 Yrs', bg: '#DBEAFE', col: '#2563EB' },
            ].map(st => (
              <View key={st.label} style={{ flex: 1, backgroundColor: st.bg, borderRadius: 16, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: st.col }} numberOfLines={1}>{st.val}</Text>
                <Text style={{ fontSize: 11, color: '#475569', marginTop: 2, fontWeight: '600' }}>{st.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.profSectionTitle}>Quick Actions</Text>
          <View style={styles.profCardGroup}>
            <TouchableOpacity style={styles.profActionRow} onPress={() => setScreen('facultyUpload')}>
              <View style={[{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 }]}>
                <Feather name="upload-cloud" size={17} color={PURPLE} />
              </View>
              <Text style={styles.profActionLabel}>Upload Achievement</Text>
              <Feather name="chevron-right" size={16} color="#CBD5E1" />
            </TouchableOpacity>
            <View style={styles.profRowDivider} />
            <TouchableOpacity style={styles.profActionRow} onPress={() => setScreen('facultyAchievements')}>
              <View style={[{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }]}>
                <Feather name="award" size={17} color="#16A34A" />
              </View>
              <Text style={styles.profActionLabel}>My Achievements</Text>
              <Feather name="chevron-right" size={16} color="#CBD5E1" />
            </TouchableOpacity>
            <View style={styles.profRowDivider} />
            <TouchableOpacity style={styles.profActionRow} onPress={() => setScreen('facultySettings')}>
              <View style={[{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 12 }]}>
                <Feather name="settings" size={17} color="#2563EB" />
              </View>
              <Text style={styles.profActionLabel}>Account Settings</Text>
              <Feather name="chevron-right" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomNav active="facultyProfile" onNav={facultyNavTo} isFaculty />
      </SafeAreaView>
    );

  }

  /* DASHBOARDS */
  if (screen === 'dashboardFirst' || screen === 'dashboardSecond') {
    const isFirst = screen === 'dashboardFirst';
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: BG }]}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)}
          onNav={navTo} currentScreen={screen} profileImage={profileImage} />

        <ScrollView contentContainerStyle={styles.dashScroll} showsVerticalScrollIndicator={false}>
          <DashHeader />
          <AchievementCard points={isFirst ? 0 : 10} total={50} pointsToNext={isFirst ? 50 : 40} profileImage={profileImage} />

          {/* Goal Tracker Card */}
          <GoalProgressCard 
            currentGoal={currentGoal} 
            onNavigate={() => setScreen('goalTracker')} 
          />

          {/* Getting Started — First Dashboard only */}
          {isFirst && (
            <>
              <Text style={styles.sectionTitle}>Getting Started</Text>
              <View style={styles.sectionCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.stepsContent}>
                  <TouchableOpacity style={styles.stepItem} onPress={() => setScreen('uploadAchievement')}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#EDE8FF', borderWidth: 2, borderColor: PURPLE }]}>
                      <Feather name="upload-cloud" size={22} color={PURPLE} />
                    </View>
                    <Text style={styles.stepLabel}>Upload{'\n'}Certificate</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepDots}>• • • •</Text>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#DCFCE7' }]}>
                      <Feather name="check-circle" size={22} color="#16A34A" />
                    </View>
                    <Text style={styles.stepLabel}>Get{'\n'}Verified</Text>
                  </View>
                  <Text style={styles.stepDots}>• • • •</Text>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#FEF9C3' }]}>
                      <Ionicons name="document-text-outline" size={22} color="#CA8A04" />
                    </View>
                    <Text style={styles.stepLabel}>Earn 10{'\n'}Points</Text>
                  </View>
                  <Text style={styles.stepDots}>• • • •</Text>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconBg, { backgroundColor: '#F1F5F9' }]}>
                      <Ionicons name="ribbon-outline" size={22} color="#94A3B8" />
                    </View>
                    <Text style={[styles.stepLabel, { color: '#94A3B8' }]}>Unlock{'\n'}Silver</Text>
                  </View>
                </ScrollView>
              </View>
            </>
          )}

          {/* Workspace */}
          <Text style={styles.sectionTitle}>Your Workspace</Text>
          <View style={styles.sectionCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.workspaceContent}>
              <WorkspaceItem iconName="upload-cloud" iconLib="Feather"
                bgColor="#EDE8FF" iconColor={PURPLE} label="Add Certificate"
                subtitle="Upload Achievement" onPress={() => setScreen('uploadAchievement')} />
              <WorkspaceItem iconName="trophy-outline" iconLib="Ionicons"
                bgColor="#DCFCE7" iconColor="#16A34A" label="Achievements"
                subtitle="View all submitted" onPress={() => setScreen('myAchievements')} />
              <WorkspaceItem iconName="bar-chart-2" iconLib="Feather"
                bgColor="#FEF9C3" iconColor="#CA8A04" label="Leaderboard"
                subtitle="See rankings" onPress={() => setScreen('leaderboard')} />
              <WorkspaceItem iconName="calendar" iconLib="Feather"
                bgColor="#DBEAFE" iconColor="#2563EB" label="Attendance"
                subtitle="View schedule" onPress={() => setScreen('attendance')} />
              <WorkspaceItem iconName="settings" iconLib="Feather"
                bgColor="#F1F5F9" iconColor="#64748B" label="Settings"
                subtitle="Preferences" onPress={() => setScreen('settings')} />
            </ScrollView>
          </View>

          {/* ── STATS CARDS GRID — Student ── */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>

            {/* Stat 1 — Total Points */}
            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="medal" size={22} color={PURPLE} />
              </View>
              <Text style={[styles.statNum, { color: PURPLE }]}>{isFirst ? '0' : '10'}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
              <Text style={styles.statSub}>Gold Explorer</Text>
            </View>

            {/* Stat 2 — Dept Rank */}
            <TouchableOpacity style={styles.statCard} activeOpacity={0.82}
              onPress={() => setScreen('leaderboard')}>
              <View style={[styles.statIconBg, { backgroundColor: '#DBEAFE' }]}>
                <Feather name="bar-chart-2" size={22} color="#2563EB" />
              </View>
              <Text style={[styles.statNum, { color: '#2563EB' }]}>#8</Text>
              <Text style={styles.statLabel}>Dept Rank</Text>
              <Text style={styles.statSub}>View Board →</Text>
            </TouchableOpacity>

            {/* Stat 3 — Approved */}
            <TouchableOpacity style={styles.statCard} activeOpacity={0.82}
              onPress={() => setScreen('myAchievements')}>
              <View style={[styles.statIconBg, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="check-circle" size={22} color="#16A34A" />
              </View>
              <Text style={[styles.statNum, { color: '#16A34A' }]}>{isFirst ? '0' : '2'}</Text>
              <Text style={styles.statLabel}>Approved</Text>
              <Text style={styles.statSub}>Achievements</Text>
            </TouchableOpacity>

            {/* Stat 4 — Pending */}
            <TouchableOpacity style={styles.statCard} activeOpacity={0.82}
              onPress={() => setScreen('myAchievements')}>
              <View style={[styles.statIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Feather name="clock" size={22} color="#D97706" />
              </View>
              <Text style={[styles.statNum, { color: '#D97706' }]}>{isFirst ? '0' : '1'}</Text>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statSub}>Under Review</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        <BottomNav active="home" onNav={dashNavTo} />
      </SafeAreaView>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════
   STYLESHEET
═══════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: BG, paddingTop: SAFE_TOP },
  keyboardView:      { flex: 1 },
  scrollContent:     { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40, justifyContent: 'center' },
  logoContainer:     { alignItems: 'center', marginTop: 40, marginBottom: 10 },
  logoImage:         { width: 130, height: 110 },
  headerContainer:   { alignItems: 'center', marginBottom: 35 },
  titleText:         { fontSize: 30, fontWeight: '700', color: '#1D2939', textAlign: 'center', marginBottom: 8 },
  subtitleText:      { fontSize: 16, color: '#667085', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  formContainer:     { width: '100%', marginBottom: 20 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1.2, borderColor: '#E4E7EC', borderRadius: 14, height: 56,
    paddingHorizontal: 16, marginBottom: 16,
    shadowColor: '#101828', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1,
  },
  rowInputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  infoIconWrapper:   { justifyContent: 'center', alignItems: 'center', paddingLeft: 10, height: 56, marginBottom: 16 },
  infoBadge:         { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0E9FF', justifyContent: 'center', alignItems: 'center' },
  input:             { flex: 1, fontSize: 16, color: '#1D2939', height: '100%' },
  inputIcon:         { marginLeft: 10 },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 20 },
  forgotPasswordText: { fontSize: 15, fontWeight: '600', color: '#1B59F8' },
  actionContainer:   { width: '100%', marginBottom: 30 },
  blueButton: {
    backgroundColor: '#1B59F8', height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#1B59F8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  purpleButton: {
    backgroundColor: PURPLE, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  buttonText:        { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  footerContainer:   { alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  footerLabel:       { fontSize: 15, color: '#667085', marginBottom: 4 },
  blueLinkText:      { fontSize: 15, fontWeight: '700', color: '#1B59F8' },
  purpleLinkText:    { fontSize: 15, fontWeight: '700', color: PURPLE },

  // ── Forgot Password ────────────────────────────────────────
  fpIconRing:   { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EBF0FF', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  fpTitle:      { fontSize: 20, fontWeight: '700', color: '#1D2939', marginBottom: 4, textAlign: 'center' },
  fpSubtitle:   { fontSize: 14, color: '#667085', marginBottom: 14 },
  fpBody:       { fontSize: 14, color: '#344054', textAlign: 'center', lineHeight: 21, marginBottom: 16 },
  fpBackLink:   { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  fpBackText:   { fontSize: 14, fontWeight: '600', color: '#1B59F8' },

  // ── Unified Modal & Bottom Sheet System ─────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
    marginBottom: 24,
  },
  modalDivider: { width: '100%', height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  // Bottom Sheet
  compactBottomSheet: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 20,
  },
  sheetDragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sheetIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeaderTitle: { fontSize: 20, fontWeight: '800', color: '#1D2939', letterSpacing: -0.3 },
  sheetHeaderSub:   { fontSize: 13, color: '#64748B', marginTop: 3, lineHeight: 18 },
  sheetCloseBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  sheetColHeader:   { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, marginBottom: 8 },
  sheetColText:     { fontSize: 12, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 0.5 },

  compactCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#F8F5FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  compactCategoryText: { fontSize: 13.5, fontWeight: '600', color: '#1D2939' },
  compactStarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  compactStarBadgeText: { fontSize: 12, fontWeight: '800', color: PURPLE },

  sheetInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F5F0FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 16,
  },
  sheetInfoBoxText: { flex: 1, fontSize: 12.5, color: PURPLE, fontWeight: '600', lineHeight: 18 },
  sheetPrimaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  sheetPrimaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // ── Drawer ─────────────────────────────────────────────────
  drawerOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawerContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, width: SW * 0.82, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 20 },
  drawerHeader:    { paddingTop: SAFE_TOP + 20, paddingBottom: 24, paddingHorizontal: 20, backgroundColor: PURPLE, alignItems: 'flex-start' },
  drawerAvatarCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 12, overflow: 'hidden' },
  drawerAvatarText:{ fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  drawerName:      { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  drawerDept:      { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 8 },
  drawerBadgeRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  drawerBadgeText: { fontSize: 12, fontWeight: '700', color: '#FCD34D' },
  drawerItem:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 10, marginVertical: 2, borderRadius: 14 },
  drawerItemActive:{ backgroundColor: PURPLE_LIGHT },
  drawerItemIcon:  { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F8F7FC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  drawerItemIconActive: { backgroundColor: '#EDE9FE' },
  drawerItemLabel: { fontSize: 14.5, fontWeight: '600', color: '#374151' },
  drawerItemLabelActive: { color: PURPLE, fontWeight: '800' },
  drawerItemSub:   { fontSize: 11.5, color: '#94A3B8', marginTop: 1 },
  drawerLogoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 26, paddingVertical: 12 },
  drawerLogoutText:{ fontSize: 15, fontWeight: '700', color: '#EF4444' },

  // ── Bottom Nav ─────────────────────────────────────────────
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    paddingHorizontal: 8,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 14,
  },
  navTab:            { flex: 1, alignItems: 'center', gap: 2 },
  navActiveIndicator:{ width: 24, height: 3, backgroundColor: PURPLE, borderRadius: 2, marginBottom: 3 },
  navLabel:          { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
  navLabelActive:    { color: PURPLE, fontWeight: '700' },

  // ── Screen Header ──────────────────────────────────────────
  screenHeaderRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn:           { width: 36, height: 36, borderRadius: 18, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' },
  infoBtn:           { width: 36, height: 36, borderRadius: 18, backgroundColor: PURPLE_LIGHT, justifyContent: 'center', alignItems: 'center' },
  screenHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#1D2939' },

  // ── Upload Achievement ─────────────────────
  stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  stepDot:          { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  stepDotActive:    { backgroundColor: PURPLE },
  stepDotText:      { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  stepDotTextActive:{ color: '#FFFFFF' },
  stepDotLabel:     { fontSize: 12, fontWeight: '600', color: '#94A3B8', marginLeft: 5, marginRight: 8, marginTop: 3 },
  stepDotLabelActive:{ color: PURPLE },
  stepLine:         { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 4 },
  stepLineActive:   { backgroundColor: PURPLE },
  stepScrollContent:{ paddingHorizontal: 20, paddingBottom: 100 },
  stepContainer:    { paddingTop: 12 },
  stepTitleWrapper: { marginBottom: 20 },
  stepTitle:        { fontSize: 22, fontWeight: '800', color: '#1D2939', letterSpacing: -0.4 },
  stepSubtitle:     { fontSize: 13.5, color: '#64748B', marginTop: 4 },
  inputLabel:       { fontSize: 13, fontWeight: '700', color: '#344054', marginBottom: 6 },
  roundedInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#E2E8F0', height: 52, paddingHorizontal: 14, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  roundedInputFocused: { borderColor: PURPLE, backgroundColor: '#FDFBFF' },
  roundedInputError:   { borderColor: '#F04438' },
  roundedInput:        { flex: 1, fontSize: 15, color: '#1D2939' },
  errorText:           { fontSize: 11.5, color: '#F04438', marginTop: 3, marginLeft: 4, marginBottom: 8 },
  levelChipRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  levelChip:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F8F7FC', borderWidth: 1.5, borderColor: '#E2E8F0' },
  levelChipActive:     { backgroundColor: PURPLE_LIGHT, borderColor: PURPLE },
  levelChipText:       { fontSize: 13, fontWeight: '600', color: '#64748B' },
  levelChipTextActive: { color: PURPLE, fontWeight: '800' },

  // Type Cards
  typeCard:         { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#101828', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  typeCardSelected: { borderColor: PURPLE, backgroundColor: '#FDFBFF', shadowColor: PURPLE, shadowOpacity: 0.12 },
  typeCardHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  typeIconCircle:   { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  typeCardTitle:    { fontSize: 16, fontWeight: '800', color: '#1D2939' },
  typeCardDesc:     { fontSize: 12.5, color: '#64748B', marginTop: 3 },
  typeRadio:        { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  typeRadioSelected:{ borderColor: PURPLE },
  typeRadioDot:     { width: 12, height: 12, borderRadius: 6, backgroundColor: PURPLE },
  typeExampleRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeExampleChip:  { backgroundColor: '#F8F7FC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeExampleText:  { fontSize: 11.5, color: '#64748B', fontWeight: '500' },
  typeInfoCard:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: PURPLE_LIGHT, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#DDD6FE' },
  typeInfoText:     { flex: 1, fontSize: 13, color: PURPLE, fontWeight: '600' },

  // Proof Cards
  proofSectionLabel:{ fontSize: 14, fontWeight: '800', color: '#1D2939', marginBottom: 12, marginTop: 8 },
  requiredBadge:    { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8 },
  requiredText:     { fontSize: 10.5, fontWeight: '700', color: '#D97706' },
  uploadCardLarge:  { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#DDD6FE', borderStyle: 'dashed', borderRadius: 20, paddingVertical: 28, alignItems: 'center', justifyContent: 'center' },
  uploadIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  uploadCardTitle:  { fontSize: 15, fontWeight: '700', color: '#1D2939' },
  uploadCardSub:    { fontSize: 12, color: '#64748B', marginTop: 3 },
  filePreviewCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#DDD6FE', padding: 12, shadowColor: PURPLE, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  fileIconBox:      { width: 42, height: 42, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  fileNameText:     { fontSize: 13.5, fontWeight: '700', color: '#1D2939' },
  fileSizeText:     { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  fileActionIconBtn:{ width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  validationCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FEF2F2', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#FECACA', marginBottom: 14 },
  validationText:   { flex: 1, fontSize: 12.5, color: '#DC2626', fontWeight: '600', lineHeight: 18 },
  verifyInfoCard:   { backgroundColor: '#F8F7FC', borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: '#EDE9FE', marginTop: 8 },
  verifyInfoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  verifyInfoTitle:  { fontSize: 14, fontWeight: '800', color: PURPLE },
  verifyInfoDivider:{ height: 1, backgroundColor: '#EDE9FE', marginBottom: 10 },
  verifyInfoRow:    { flexDirection: 'row', gap: 6, marginBottom: 6 },
  verifyInfoBullet: { fontSize: 14, color: PURPLE, fontWeight: '800' },
  verifyInfoText:   { flex: 1, fontSize: 12.5, color: '#475569', lineHeight: 18 },
  primaryGradientBtn: { backgroundColor: PURPLE, height: 54, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  primaryGradientBtnDisabled: { opacity: 0.45, shadowOpacity: 0 },
  primaryBtnText:   { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // Success
  successOverlay:   { flex: 1, backgroundColor: 'rgba(15,10,30,0.72)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  successCard:      { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 28, padding: 28, alignItems: 'center', shadowColor: PURPLE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 20 },
  successRingOuter: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  successRingInner: { width: 66, height: 66, borderRadius: 33, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  successTitle:     { fontSize: 22, fontWeight: '800', color: '#1D2939', textAlign: 'center', marginBottom: 12, letterSpacing: -0.4 },
  successStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF9E6', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 14, borderWidth: 1, borderColor: '#FCD34D' },
  pendingDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EAB308' },
  successStatusText:{ fontSize: 13, fontWeight: '700', color: '#D97706' },
  successBody:      { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 16 },

  // ── Settings ────────────────────────────────────────────────
  settingsPageSub:     { fontSize: 13, color: '#64748B', marginTop: 6, marginBottom: 18, lineHeight: 18 },
  settingsSectionTitle:{ fontSize: 12.5, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 20, marginBottom: 8 },
  settingsCard:        { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  settingRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  settingRowIcon:      { width: 36, height: 36, borderRadius: 12, backgroundColor: PURPLE_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingRowContent:   { flex: 1 },
  settingRowLabel:     { fontSize: 14.5, fontWeight: '600', color: '#1D2939' },
  settingRowSub:       { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  settingDivider:      { height: 1, backgroundColor: '#F8F7FC', marginLeft: 60 },
  settingsLogoutBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 28, height: 54, borderRadius: 18, borderWidth: 1.5, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  settingsLogoutText:  { fontSize: 15, fontWeight: '800', color: '#EF4444' },

  // ── Notifications ──────────────────────────────────────────
  notifCard:        { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  notifCardUnread:  { backgroundColor: '#FDFBFF', borderColor: PURPLE, borderWidth: 1.5 },
  notifIconBg:      { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  notifTitle:       { fontSize: 14, fontWeight: '800', color: '#1D2939' },
  notifBody:        { fontSize: 12.5, color: '#64748B', lineHeight: 18, marginVertical: 3 },
  notifTime:        { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  unreadDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: PURPLE },

  // ── Attendance ───────────────────────────────────────────────
  attOverviewCard:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginVertical: 16, shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, borderWidth: 1, borderColor: '#F1F5F9' },
  attCircleOuter:    { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5F0FF', borderWidth: 5, borderColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  attCircleInner:    { alignItems: 'center' },
  attPctNumber:      { fontSize: 24, fontWeight: '900', color: PURPLE },
  attPctSub:         { fontSize: 10, color: '#64748B', fontWeight: '600' },
  attOverviewDetails:{ flex: 1 },
  attStatusTitle:    { fontSize: 16, fontWeight: '800', color: '#1D2939', marginBottom: 2 },
  attStatusSub:      { fontSize: 12, color: '#64748B', lineHeight: 16, marginBottom: 8 },
  attBadgeTag:       { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  attBadgeText:      { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  attSummaryGrid:    { flexDirection: 'row', gap: 10, marginBottom: 20 },
  attSummaryBox:     { flex: 1, borderRadius: 18, padding: 14, alignItems: 'center' },
  attSummaryNum:     { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  attSummaryLabel:   { fontSize: 11, fontWeight: '600', color: '#64748B' },
  attSectionTitle:   { fontSize: 16, fontWeight: '800', color: '#1D2939', marginBottom: 12 },
  attMonthlyCard:    { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 20, justifyContent: 'space-around', alignItems: 'flex-end', height: 120, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  attMonthItem:      { alignItems: 'center', flex: 1 },
  attMonthBarTrack:  { width: 28, height: 60, backgroundColor: '#F1F5F9', borderRadius: 8, overflow: 'hidden', justifyContent: 'flex-end' },
  attMonthBarFill:   { width: '100%', backgroundColor: PURPLE, borderRadius: 8 },
  attMonthPct:       { fontSize: 10.5, fontWeight: '700', color: PURPLE, marginTop: 4 },
  attMonthLabel:     { fontSize: 11, color: '#64748B', fontWeight: '600' },
  attSubjectCard:    { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, marginBottom: 10, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  attSubCode:        { fontSize: 12, fontWeight: '800', color: PURPLE },
  attSubPct:         { fontSize: 15, fontWeight: '900', color: '#1D2939' },
  attSubName:        { fontSize: 13.5, fontWeight: '700', color: '#1D2939', marginBottom: 8 },
  attProgressTrack:  { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  attProgressFill:   { height: '100%', backgroundColor: PURPLE, borderRadius: 3 },
  attSubClasses:     { fontSize: 11, color: '#94A3B8' },
  attMotivationCard: { backgroundColor: '#F5F0FF', borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: '#EDE9FE', marginTop: 8, alignItems: 'center' },
  attMotivationTitle:{ fontSize: 15, fontWeight: '800', color: PURPLE, marginBottom: 4 },
  attMotivationBody: { fontSize: 12.5, color: '#475569', lineHeight: 18, textAlign: 'center' },

  // ── Profile ─────────────────────────────────────────────────
  profHeroCard:       { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 12, marginBottom: 16, shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, borderWidth: 1, borderColor: '#F1F5F9' },
  profAvatarWrapper:  { position: 'relative', marginBottom: 14 },
  profAvatarCircle:   { width: 84, height: 84, borderRadius: 42, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: PURPLE, overflow: 'hidden' },
  profAvatarInitial:  { fontSize: 34, fontWeight: '900', color: PURPLE },
  profAvatarEditBadge:{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  profHeroName:       { fontSize: 22, fontWeight: '800', color: '#1D2939', letterSpacing: -0.3 },
  profHeroReg:        { fontSize: 13, color: '#94A3B8', marginTop: 2, marginBottom: 12 },
  profTagsRow:        { flexDirection: 'row', gap: 8, marginBottom: 12 },
  profTagPill:        { backgroundColor: '#F5F0FF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1, borderColor: '#EDE9FE' },
  profTagText:        { fontSize: 12, fontWeight: '700', color: PURPLE },
  profEmailRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profEmailText:      { fontSize: 13, color: '#64748B', fontWeight: '500' },
  profAchieveLevelCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 20, shadowColor: '#101828', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  profAchieveHeader:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  profMedalBox:       { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  profBadgeTitle:     { fontSize: 16, fontWeight: '800', color: '#1D2939' },
  profBadgeSub:       { fontSize: 12, color: '#94A3B8' },
  profPointsText:     { fontSize: 18, fontWeight: '900', color: PURPLE },
  profProgressTrack:  { height: 7, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  profProgressFill:   { height: '100%', backgroundColor: PURPLE, borderRadius: 4 },
  profNextLevelText:  { fontSize: 11.5, color: '#64748B', fontWeight: '500' },
  profSectionTitle:   { fontSize: 16, fontWeight: '800', color: '#1D2939', marginBottom: 10 },
  profCardGroup:      { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 20, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  profActionRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  profActionIconBg:   { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  profActionLabel:    { flex: 1, fontSize: 14.5, fontWeight: '600', color: '#1D2939' },
  profRowDivider:     { height: 1, backgroundColor: '#F1F5F9' },
  profInfoKey:        { flex: 1, fontSize: 14, color: '#64748B' },
  profInfoVal:        { fontSize: 14, fontWeight: '700', color: '#1D2939' },
  profLogoutBtn:      { flexDirection: 'row', height: 54, borderRadius: 20, backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#FCA5A5', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  profLogoutText:     { fontSize: 15, fontWeight: '800', color: '#EF4444' },

  // ── Leaderboard ──────────────────────────────────────────────
  lbPillTabContainer: { flexDirection: 'row', backgroundColor: '#F1F0F8', borderRadius: 24, padding: 4, marginVertical: 10 },
  lbPillTab:          { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  lbPillTabActive:    { backgroundColor: PURPLE, shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  lbPillTabText:      { fontSize: 12.5, fontWeight: '600', color: '#64748B' },
  lbPillTabTextActive:{ color: '#FFFFFF', fontWeight: '800' },
  lbSearchWrapper:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', height: 46, paddingHorizontal: 14, marginVertical: 8, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  lbSearchInput:      { flex: 1, fontSize: 14, color: '#1D2939' },
  lbFilterChip:       { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  lbFilterChipActive: { backgroundColor: '#F4F0FF', borderColor: PURPLE },
  lbFilterChipText:   { fontSize: 12.5, fontWeight: '600', color: '#64748B' },
  lbFilterChipTextActive: { color: PURPLE, fontWeight: '800' },
  lbPodiumContainer:  { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginVertical: 18, gap: 8 },
  lbPodiumCard:       { flex: 1, alignItems: 'center', borderRadius: 20, paddingTop: 14, shadowColor: '#101828', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  lbPodiumGold:       { backgroundColor: '#FEFCE8', borderWidth: 1.5, borderColor: '#FDE047' },
  lbPodiumSilver:     { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#CBD5E1' },
  lbPodiumBronze:     { backgroundColor: '#FFF7ED', borderWidth: 1.5, borderColor: '#FDBA74' },
  lbPodiumUserHighlight: { borderColor: PURPLE, borderWidth: 2, backgroundColor: '#F5F0FF' },
  lbCrownIconWrapper: { position: 'absolute', top: -14 },
  lbPodiumAvatarCircle: { justifyContent: 'center', alignItems: 'center', marginTop: 4, marginBottom: 6, overflow: 'hidden' },
  lbPodiumAvatarInitial: { fontWeight: '800', color: '#1D2939' },
  lbPodiumName:       { fontSize: 12, fontWeight: '700', color: '#1D2939', textAlign: 'center', paddingHorizontal: 4 },
  lbPodiumDept:       { fontSize: 9.5, color: '#64748B', textAlign: 'center', marginTop: 2 },
  lbPodiumPointsBadge:{ backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 6, marginBottom: 8 },
  lbPodiumPointsText: { fontSize: 11, fontWeight: '800', color: PURPLE },
  lbPodiumPillar:     { width: '100%', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, justifyContent: 'center', alignItems: 'center' },
  lbPodiumRankNum:    { fontSize: 19, fontWeight: '900', color: '#475569' },
  lbYouBadge:         { backgroundColor: PURPLE, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  lbYouBadgeText:     { fontSize: 9, fontWeight: '900', color: '#FFFFFF' },
  lbListSectionTitle: { fontSize: 16, fontWeight: '800', color: '#1D2939', marginTop: 10, marginBottom: 10 },
  lbStudentCard:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  lbUserStudentCard:  { backgroundColor: '#F5F0FF', borderColor: PURPLE, borderWidth: 1.8, shadowColor: PURPLE, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  lbRankCol:          { width: 34, alignItems: 'center' },
  lbRankText:         { fontSize: 15, fontWeight: '800', color: '#1D2939' },
  lbMoveUpText:       { fontSize: 10, fontWeight: '700', color: '#16A34A', marginTop: 2 },
  lbMoveDownText:     { fontSize: 10, fontWeight: '700', color: '#DC2626', marginTop: 2 },
  lbMoveSameText:     { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 2 },
  lbStudentAvatar:    { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 6, marginRight: 12, overflow: 'hidden' },
  lbStudentAvatarText:{ fontSize: 16, fontWeight: '800', color: '#1D2939' },
  lbStudentInfoCol:   { flex: 1 },
  lbStudentName:      { fontSize: 14, fontWeight: '700', color: '#1D2939' },
  lbUserName:         { color: PURPLE, fontWeight: '800' },
  lbLevelText:        { fontSize: 10.5, fontWeight: '700' },
  lbStudentPoints:    { fontSize: 16, fontWeight: '800', color: '#1D2939' },
  lbStatsCard:        { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginTop: 16, marginBottom: 20, borderWidth: 1.5, borderColor: '#EDE9FE', shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 14, elevation: 4 },
  lbStatsHeader:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lbStatsTitle:       { fontSize: 16, fontWeight: '800', color: '#1D2939' },
  lbStatsDivider:     { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  lbStatsGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  lbStatGridItem:     { width: '47%', backgroundColor: BG, borderRadius: 14, padding: 12 },
  lbStatGridVal:      { fontSize: 20, fontWeight: '900', color: PURPLE },
  lbStatGridKey:      { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '500' },
  lbProgressBox:      { backgroundColor: '#F5F0FF', borderRadius: 16, padding: 14, marginTop: 14 },
  lbProgressLabel:    { fontSize: 12.5, fontWeight: '700', color: '#1D2939' },
  lbProgressValue:    { fontSize: 12.5, fontWeight: '800', color: PURPLE },
  lbProgressTrack:    { height: 7, backgroundColor: '#EDE9FE', borderRadius: 4, overflow: 'hidden' },
  lbProgressFill:     { height: '100%', backgroundColor: PURPLE, borderRadius: 4 },
  lbProgressNote:     { fontSize: 11.5, fontWeight: '600', color: PURPLE, marginTop: 8 },

  // ── Redesigned Achievements Screen ─────────────────────────
  achieveStatsHero:   { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 16, paddingHorizontal: 20, justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#EDE9FE', shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, marginTop: 10 },
  achieveStatItem:    { alignItems: 'center' },
  achieveStatVal:     { fontSize: 22, fontWeight: '900', color: '#1D2939' },
  achieveStatLabel:   { fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 2 },
  achieveStatDivider: { width: 1, height: 28, backgroundColor: '#F1F5F9' },
  pdfBannerBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 16, padding: 14,
    marginTop: 14, marginBottom: 4,
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  pdfBannerIconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  pdfBannerTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  pdfBannerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  premiumAchieveCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#101828', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  premiumAchieveHeader: { flexDirection: 'row', alignItems: 'center' },
  premiumAchieveIconBox:{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F0FF', justifyContent: 'center', alignItems: 'center' },
  premiumAchieveTitle:  { fontSize: 15, fontWeight: '800', color: '#1D2939' },
  premiumAchieveCategory: { fontSize: 12, color: '#64748B', marginTop: 2 },
  premiumAchieveDivider:  { height: 1, backgroundColor: '#F8F7FC', marginVertical: 12 },
  premiumAchieveFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  premiumAchieveDate:     { fontSize: 11.5, color: '#94A3B8', fontWeight: '500' },
  premiumAchievePoints:   { fontSize: 12, fontWeight: '800', color: '#D97706' },

  // ── Dashboard ────────────────────────────────────────────────
  dashTopBar:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  dashGreeting:   { flex: 1, marginHorizontal: 12 },
  dashCollegeName:{ fontSize: 12, color: '#94A3B8', marginBottom: 1 },
  dashName:       { fontSize: 17, fontWeight: '800', color: '#1D2939', letterSpacing: -0.3 },
  dashTagline:    { fontSize: 12, color: '#94A3B8' },
  dashNotifBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  achieveCard:    { marginHorizontal: 16, marginBottom: 22, backgroundColor: '#EDE9FE', borderRadius: 20, padding: 18, shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  achieveRow:     { flexDirection: 'row', alignItems: 'flex-start' },
  medalCol:       { alignItems: 'center', marginRight: 14, marginTop: 2 },
  medalRibbon:    { width: 10, height: 14, backgroundColor: '#C8860A', borderRadius: 2, marginTop: -4 },
  achieveContent: { flex: 1 },
  achieveTitle:   { fontSize: 15, fontWeight: '800', color: '#C8860A', marginBottom: 1 },
  achieveSubLabel:{ fontSize: 11, color: '#64748B', marginBottom: 6 },
  achievePointsRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  achievePointsNum: { fontSize: 30, fontWeight: '900', color: '#1D2939' },
  achievePointsDen: { fontSize: 16, color: '#94A3B8' },
  progressTrack:  { height: 6, backgroundColor: '#C4BAE8', borderRadius: 3, marginBottom: 4, marginRight: 8, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: PURPLE, borderRadius: 3 },
  progressPct:    { fontSize: 11, fontWeight: '700', color: PURPLE, textAlign: 'right', marginRight: 8 },
  avatarCircle:   { width: 50, height: 50, borderRadius: 25, backgroundColor: '#C4BAE8', marginLeft: 6, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  achieveDivider: { height: 1, backgroundColor: '#C4BAE8', marginVertical: 12 },
  nextLevelRow:   { flexDirection: 'row', alignItems: 'center' },
  nextLevelLabel: { fontSize: 10, color: '#94A3B8' },
  nextLevelName:  { fontSize: 12, fontWeight: '700', color: '#1D2939' },
  nextLevelPoints:{ marginLeft: 'auto', fontSize: 11, color: '#64748B', fontStyle: 'italic' },
  sectionTitle:   { fontSize: 17, fontWeight: '800', color: '#1D2939', paddingHorizontal: 20, marginBottom: 10, marginTop: 2 },
  sectionCard:    { marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 16, marginBottom: 22, shadowColor: '#1D2939', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  stepsContent:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  stepItem:       { alignItems: 'center', width: 82 },
  stepIconBg:     { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  stepLabel:      { fontSize: 11.5, color: '#475569', textAlign: 'center', lineHeight: 16, fontWeight: '500' },
  stepDots:       { fontSize: 12, color: '#C8BDF5', letterSpacing: 3, paddingHorizontal: 2, paddingBottom: 22 },
  workspaceContent: { flexDirection: 'row', paddingHorizontal: 12 },
  workspaceItem:  { alignItems: 'center', width: 96, marginHorizontal: 2 },
  workspaceIconBg:{ width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  workspaceLabel: { fontSize: 11.5, fontWeight: '600', color: '#1D2939', textAlign: 'center' },
  workspaceSub:   { fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 2 },
  academicContent:{ paddingHorizontal: 16, gap: 12 },
  academicCard:   { width: 124, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, shadowColor: '#1D2939', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  academicTitle:  { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginBottom: 10 },
  academicMainRow:{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  academicIconBg: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  academicValue:  { fontSize: 22, fontWeight: '800', color: '#1D2939' },
  academicLabel:  { fontSize: 11, color: '#94A3B8' },
  recentContent:  { paddingHorizontal: 16, gap: 12 },
  recentCard:     { width: 172, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, shadowColor: '#1D2939', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  recentCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recentCardTitle:{ fontSize: 13, fontWeight: '700', color: '#1D2939', flex: 1, marginRight: 6 },
  statusBadge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText:     { fontSize: 10, fontWeight: '700' },
  recentIconBg:   { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  recentDate:     { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  recentSubText:  { fontSize: 12, color: '#475569' },
  dashScroll:     { paddingBottom: 100 },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyFolderCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle:     { fontSize: 20, fontWeight: '800', color: '#1D2939', marginBottom: 8 },
  emptyDesc:      { fontSize: 14, color: '#667085', textAlign: 'center', lineHeight: 20 },

  /* ── STATS CARD GRID ── */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    shadowColor: '#6C3EF4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNum: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1D2939',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11.5,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  /* ── (kept for reference, unused now) ── */
  premCard: { display: 'none' },
  premCardAccent: {},
  premCardInner: {},
  premCardHeader: {},
  premIconCircle: {},
  premCardTitle: {},
  premCardSub: {},
  premBigNum: {},
  premDivider: {},
  premStatRow: {},
  premStatItem: {},
  premStatDot: {},
  premStatLabel: {},
  premStatVal: {},
  premProgressLabel: {},
  premProgressTrack: {},
  premProgressFill: {},
  premProgressSub: {},
  premActionBtn: {},
  premActionText: {},
  premActivityRow: {},
  premActivityBorder: {},
  premActivityDot: {},
  premActivityName: {},
});
