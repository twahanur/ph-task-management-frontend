"use server";

import { noCacheRead, patchData } from "../apiService/crud";

export async function getMyProfile() {
  return noCacheRead("/users/me", ["user-profile"]);
}

export async function updateMyProfile(data: { name?: string; bio?: string; avatar_url?: string }) {
  return patchData("/users/me", "/dashboard/profile", data);
}

export async function updateMyPreferences(data: { theme?: string; email_notifications?: boolean }) {
  return patchData("/users/me/preferences", "/dashboard/profile", data);
}

export async function getMyTasks() {
  return noCacheRead("/users/me/tasks", ["user-tasks"]);
}
