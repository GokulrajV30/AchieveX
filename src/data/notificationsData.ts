// ─────────────────────────────────────────────────────────────
// AchieveX — Student Notifications Data Model & Mock Dataset
// Supports Achievement, Goal, Academic Credit, and Team notifications
// ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'achievement_approved'
  | 'achievement_review'
  | 'correction_required'
  | 'goal_progress'
  | 'goal_deadline'
  | 'course_verified'
  | 'team_achievement'
  | 'team_certificate_required'
  | 'faculty_assigned';

export interface StudentNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  timeGroup: 'TODAY' | 'YESTERDAY' | 'EARLIER';
  targetType: 'achievement' | 'goal' | 'academic_credit' | 'profile' | 'team_achievement';
  targetId?: string;
  teamAchievementId?: string; // used when targetType === 'team_achievement'
}

export const INITIAL_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 'NOT_001',
    userId: '23ci011',
    type: 'achievement_approved',
    title: 'Achievement Approved',
    message: 'Smart India Hackathon 2026 Winner was verified.',
    isRead: false,
    createdAt: '10 min ago',
    timeGroup: 'TODAY',
    targetType: 'achievement',
    targetId: 'ACH_001',
  },
  {
    id: 'NOT_002',
    userId: '23ci011',
    type: 'goal_progress',
    title: 'Goal Progress Updated',
    message: '3 of 4 milestones completed. Progress is now 75%.',
    isRead: false,
    createdAt: '2 hours ago',
    timeGroup: 'TODAY',
    targetType: 'goal',
    targetId: 'g2',
  },
  {
    id: 'NOT_003',
    userId: '23ci011',
    type: 'course_verified',
    title: 'Course Record Verified',
    message: 'Introduction to Data Science — 4 credits verified.',
    isRead: false,
    createdAt: '5 hours ago',
    timeGroup: 'TODAY',
    targetType: 'academic_credit',
    targetId: 'AX-CR-000101',
  },
  {
    id: 'NOT_004',
    userId: '23ci011',
    type: 'achievement_review',
    title: 'Achievement Under Review',
    message: 'IEEE Conference Presentation is being reviewed.',
    isRead: true,
    createdAt: 'Yesterday, 4:15 PM',
    timeGroup: 'YESTERDAY',
    targetType: 'achievement',
    targetId: 'ACH_002',
  },
  {
    id: 'NOT_005',
    userId: '23ci011',
    type: 'goal_deadline',
    title: 'Goal Deadline Approaching',
    message: 'Final pitch & jury evaluation is due in 19 days.',
    isRead: true,
    createdAt: 'Yesterday',
    timeGroup: 'YESTERDAY',
    targetType: 'goal',
    targetId: 'g2',
  },
  {
    id: 'NOT_006',
    userId: '23ci011',
    type: 'team_achievement',
    title: 'Team Achievement Added',
    message: 'Added to Autonomous Campus Drone Project by Harish K.',
    isRead: true,
    createdAt: '3 days ago',
    timeGroup: 'EARLIER',
    targetType: 'achievement',
    targetId: 'ACH_003',
  },
  {
    id: 'NOT_007',
    userId: '23ci011',
    type: 'correction_required',
    title: 'Correction Required',
    message: 'Update certificate proof for Project Presentation.',
    isRead: true,
    createdAt: '5 days ago',
    timeGroup: 'EARLIER',
    targetType: 'achievement',
    targetId: 'ACH_004',
  },
];

// ─────────────────────────────────────────────────────────────
// TEAM ACHIEVEMENT MEMBER NOTIFICATIONS
// Used for members (not the leader) who need to upload their
// individual certificate after the leader submits the team.
// ─────────────────────────────────────────────────────────────
export const TEAM_MEMBER_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 'TNOT_001',
    userId: '23ci015', // Mohamed Aqdhas
    type: 'team_certificate_required',
    title: 'Team Achievement — Certificate Required',
    message:
      'Gokulraj V added you to Smart India Hackathon 2026 — Team Code Nexus. Your team details and common proofs are ready. Upload your individual certificate to complete your record.',
    isRead: false,
    createdAt: '12 Aug 2026, 3:50 PM',
    timeGroup: 'EARLIER',
    targetType: 'team_achievement',
    targetId: 'TA-SIH-2026-001',
    teamAchievementId: 'TA-SIH-2026-001',
  },
  {
    id: 'TNOT_002',
    userId: '23ci024', // Karthikeyan M
    type: 'team_certificate_required',
    title: 'Team Achievement — Certificate Required',
    message:
      'Gokulraj V added you to Smart India Hackathon 2026 — Team Code Nexus. Upload your individual certificate to complete your record.',
    isRead: false,
    createdAt: '12 Aug 2026, 3:50 PM',
    timeGroup: 'EARLIER',
    targetType: 'team_achievement',
    targetId: 'TA-SIH-2026-001',
    teamAchievementId: 'TA-SIH-2026-001',
  },
  {
    id: 'TNOT_003',
    userId: '23ci019', // Jeeva M
    type: 'team_certificate_required',
    title: 'Team Achievement — Certificate Required',
    message:
      'Gokulraj V added you to Smart India Hackathon 2026 — Team Code Nexus. Upload your individual certificate to complete your record.',
    isRead: false,
    createdAt: '12 Aug 2026, 3:50 PM',
    timeGroup: 'EARLIER',
    targetType: 'team_achievement',
    targetId: 'TA-SIH-2026-001',
    teamAchievementId: 'TA-SIH-2026-001',
  },
  {
    id: 'TNOT_004',
    userId: '23ci031', // Sathishkumar — cert still missing
    type: 'team_certificate_required',
    title: 'Certificate Still Required',
    message:
      'Smart India Hackathon 2026 — Team Code Nexus. Your individual certificate is still required to complete your team achievement record.',
    isRead: false,
    createdAt: '14 Aug 2026, 9:00 AM',
    timeGroup: 'EARLIER',
    targetType: 'team_achievement',
    targetId: 'TA-SIH-2026-001',
    teamAchievementId: 'TA-SIH-2026-001',
  },
];

export interface NotificationVisualConfig {
  iconName: string;
  iconColor: string;
  iconBgColor: string;
}

export function getNotificationVisualConfig(type: NotificationType): NotificationVisualConfig {
  switch (type) {
    case 'achievement_approved':
      return {
        iconName: 'checkmark-circle',
        iconColor: '#16A34A',
        iconBgColor: '#F0FDF4',
      };
    case 'achievement_review':
      return {
        iconName: 'time',
        iconColor: '#D97706',
        iconBgColor: '#FFFBEB',
      };
    case 'correction_required':
      return {
        iconName: 'alert-circle',
        iconColor: '#DC2626',
        iconBgColor: '#FEF2F2',
      };
    case 'goal_progress':
      return {
        iconName: 'flag',
        iconColor: '#4F46E5',
        iconBgColor: '#EEF2FF',
      };
    case 'goal_deadline':
      return {
        iconName: 'calendar',
        iconColor: '#D97706',
        iconBgColor: '#FFFBEB',
      };
    case 'course_verified':
      return {
        iconName: 'school',
        iconColor: '#2563EB',
        iconBgColor: '#EFF6FF',
      };
    case 'team_achievement':
      return {
        iconName: 'people',
        iconColor: '#4F46E5',
        iconBgColor: '#EEF2FF',
      };
    case 'team_certificate_required':
      return {
        iconName: 'document-text',
        iconColor: '#D97706',
        iconBgColor: '#FFFBEB',
      };
    case 'faculty_assigned':
      return {
        iconName: 'person-circle-outline',
        iconColor: '#0F766E',
        iconBgColor: '#CCFBF1',
      };
    default:
      return {
        iconName: 'notifications',
        iconColor: '#2563EB',
        iconBgColor: '#EFF6FF',
      };
  }
}

// ─────────────────────────────────────────────────────────────
// CENTRALIZED NOTIFICATIONS STORE
// ─────────────────────────────────────────────────────────────

let studentNotifications: StudentNotification[] = [
  ...INITIAL_NOTIFICATIONS,
  ...TEAM_MEMBER_NOTIFICATIONS,
];

type NotificationListener = () => void;
const notifListeners = new Set<NotificationListener>();

export function subscribeStudentNotifications(listener: NotificationListener): () => void {
  notifListeners.add(listener);
  return () => notifListeners.delete(listener);
}

function notifyListeners() {
  notifListeners.forEach((l) => l());
}

export function getAllStudentNotifications(): StudentNotification[] {
  return [...studentNotifications];
}

export function getNotificationsForStudent(studentId: string): StudentNotification[] {
  const norm = studentId.toLowerCase();
  return studentNotifications.filter((n) => n.userId.toLowerCase() === norm);
}

export function addStudentNotification(notif: StudentNotification): void {
  studentNotifications = [notif, ...studentNotifications.filter((n) => n.id !== notif.id)];
  notifyListeners();
}

export function markStudentNotificationAsRead(id: string): void {
  studentNotifications = studentNotifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
  notifyListeners();
}

export function markAllStudentNotificationsAsRead(studentId?: string): void {
  studentNotifications = studentNotifications.map((n) => {
    if (!studentId || n.userId.toLowerCase() === studentId.toLowerCase()) {
      return { ...n, isRead: true };
    }
    return n;
  });
  notifyListeners();
}
