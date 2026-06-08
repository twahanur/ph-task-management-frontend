"use client";

import { useUser } from "@/provider/AuthProvider";
import { can, PermissionKey } from "@/lib/permissions";

export function useRole() {
  const { user } = useUser();
  const role = user?.role ?? null;

  return {
    role,
    can: (action: PermissionKey) => can(role, action),
    isAdmin:          role === "admin",
    isProjectManager: role === "project_manager",
    isTeamMember:     role === "team_member",
  };
}
