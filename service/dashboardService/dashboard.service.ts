"use server";

import { noCacheRead } from "../apiService/crud";

export async function getDashboardData() {
  return noCacheRead("/dashboard", ["dashboard"]);
}

export async function getDashboardActivity() {
  return noCacheRead("/dashboard/activity", ["dashboard-activity"]);
}

export async function getDashboardWorkload() {
  return noCacheRead("/dashboard/workload", ["dashboard-workload"]);
}
