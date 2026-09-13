// ─────────────────────────────────────────────────────────────
// AchieveX — Centralized Academic Coordinator (AC) Bottom Navigation
// Consistent across all AC screens: Home · Submissions · Students · Reports · Profile
// ─────────────────────────────────────────────────────────────

import React from 'react';
import StudentBottomTab, { type StudentTabType } from '../StudentBottomTab';

export type ACTabType = 'home' | 'submissions' | 'students' | 'reports' | 'profile';

interface ACBottomTabProps {
  activeTab: ACTabType;
  onNavigate: (screen: string) => void;
}

export default function ACBottomTab({ activeTab, onNavigate }: ACBottomTabProps) {
  const handleTabPress = (tab: StudentTabType) => {
    switch (tab) {
      case 'home':
        onNavigate('acDashboard');
        break;
      case 'submissions':
      case 'achievements':
        onNavigate('acVerificationQueue');
        break;
      case 'students':
        onNavigate('acStudentList');
        break;
      case 'reports':
      case 'leaderboard':
        onNavigate('acReports');
        break;
      case 'profile':
        onNavigate('facultyProfile');
        break;
      default:
        onNavigate('acDashboard');
        break;
    }
  };

  return (
    <StudentBottomTab
      variant="ac"
      activeTab={activeTab}
      onNavigate={handleTabPress}
    />
  );
}
