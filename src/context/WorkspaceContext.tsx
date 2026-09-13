// ─────────────────────────────────────────────────────────────
// AchieveX — Global Workspace State & Context
// One User Account -> Multiple Assigned Workspaces -> One Active Workspace
// ─────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DEFAULT_FACULTY_USER,
  type FacultyUser,
  type FacultyWorkspaceId,
  type FacultyResponsibility,
} from '../data/facultyWorkspaceData';
import { showAchieveXDialog, showAchieveXToast } from '../components/feedback/AchieveXFeedback';

interface WorkspaceContextType {
  facultyUser: FacultyUser;
  activeWorkspace: FacultyWorkspaceId;
  assignedWorkspaces: FacultyWorkspaceId[];
  switchWorkspace: (workspaceId: FacultyWorkspaceId, onCompleteNavigate?: () => void) => void;
  addResponsibility: (role: FacultyResponsibility) => void;
  deleteResponsibility: (roleId: FacultyWorkspaceId) => void;
  updateProfileImage: (uri: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [facultyUser, setFacultyUser] = useState<FacultyUser>(DEFAULT_FACULTY_USER);
  const [activeWorkspace, setActiveWorkspace] = useState<FacultyWorkspaceId>('faculty');

  const assignedWorkspaces = facultyUser.responsibilities.map((r) => r.id);

  const switchWorkspace = (
    workspaceId: FacultyWorkspaceId,
    onCompleteNavigate?: () => void
  ) => {
    const targetRole = facultyUser.responsibilities.find((r) => r.id === workspaceId);

    if (!targetRole) {
      showAchieveXDialog({
        type: 'error',
        title: 'Workspace Unavailable',
        message: 'This responsibility is not assigned to your account.',
        primaryAction: {
          label: 'Got It',
        },
      });
      return;
    }

    setActiveWorkspace(workspaceId);
    setFacultyUser((prev) => ({
      ...prev,
      activeWorkspace: workspaceId,
    }));

    if (onCompleteNavigate) {
      onCompleteNavigate();
    }
  };

  const addResponsibility = (role: FacultyResponsibility) => {
    setFacultyUser((prev) => {
      const exists = prev.responsibilities.some((r) => r.id === role.id);
      if (exists) return prev;
      return {
        ...prev,
        responsibilities: [...prev.responsibilities, role],
      };
    });

    showAchieveXToast({
      type: 'success',
      message: `${role.label} responsibility added to account.`,
    });
  };

  const deleteResponsibility = (roleId: FacultyWorkspaceId) => {
    setFacultyUser((prev) => {
      const updated = prev.responsibilities.filter((r) => r.id !== roleId);
      let nextWs = activeWorkspace;
      if (activeWorkspace === roleId) {
        nextWs = updated[0]?.id || 'faculty';
        setActiveWorkspace(nextWs);
      }
      return {
        ...prev,
        responsibilities: updated,
        activeWorkspace: nextWs,
      };
    });
  };

  const updateProfileImage = (uri: string) => {
    setFacultyUser((prev) => ({ ...prev, profileImage: uri }));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        facultyUser,
        activeWorkspace,
        assignedWorkspaces,
        switchWorkspace,
        addResponsibility,
        deleteResponsibility,
        updateProfileImage,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
