"use server";

import { noCacheRead, patchData, deleteData } from "../apiService/crud";

/** GET /api/notifications */
export async function getNotifications() {
  return await noCacheRead("/notifications", ["notifications"]);
}

/** GET /api/notifications/unread-count */
export async function getUnreadCount() {
  return await noCacheRead("/notifications/unread-count", ["notifications"]);
}

/** PATCH /api/notifications/:id/read */
export async function markNotificationRead(notificationId: string) {
  return await patchData(`/notifications/${notificationId}/read`, "/notifications");
}

/** PATCH /api/notifications/read-all */
export async function markAllNotificationsRead() {
  return await patchData("/notifications/read-all", "/notifications");
}

/** PATCH /api/notifications/read-multiple */
export async function markMultipleNotificationsRead(ids: string[]) {
  return await patchData("/notifications/read-multiple", "/notifications", { ids });
}

/** DELETE /api/notifications/:id */
export async function deleteNotification(notificationId: string) {
  return await deleteData(`/notifications/${notificationId}`, "/notifications");
}

/** DELETE /api/notifications/all */
export async function deleteAllNotifications() {
  return await deleteData("/notifications/all", "/notifications");
}

/** DELETE /api/notifications/read */
export async function deleteReadNotifications() {
  return await deleteData("/notifications/read", "/notifications");
}
