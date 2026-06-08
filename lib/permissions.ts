export type UserRole = "admin" | "project_manager" | "team_member";

export const PERMISSIONS = {
  // User management
  CREATE_USER:        ["admin"],
  CHANGE_ROLE:        ["admin"],
  USER_MANAGEMENT:    ["admin"],

  // Project
  CREATE_PROJECT:     ["admin", "project_manager"],
  EDIT_PROJECT:       ["admin", "project_manager"],
  DELETE_PROJECT:     ["admin"],

  // Members
  ADD_MEMBER:         ["admin", "project_manager"],

  // Tasks / Cards
  CREATE_TASK:        ["admin", "project_manager"],
  ASSIGN_TASK:        ["admin", "project_manager"],
  REASSIGN_TASK:      ["admin", "project_manager"],
  DELETE_TASK:        ["admin", "project_manager"],
  UPDATE_OWN_STATUS:  ["admin", "project_manager", "team_member"],

  // Collaboration
  COMMENT:            ["admin", "project_manager", "team_member"],
  UPLOAD_FILE:        ["admin", "project_manager", "team_member"],

  // Analytics
  ANALYTICS_FULL:     ["admin", "project_manager"],
  ANALYTICS_LIMITED:  ["admin", "project_manager", "team_member"],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export function can(role: string | undefined | null, action: PermissionKey): boolean {
  if (!role) return false;
  return (PERMISSIONS[action] as readonly string[]).includes(role);
}
