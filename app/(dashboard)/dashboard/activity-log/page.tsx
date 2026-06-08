import { getDashboardActivity } from "@/service/dashboardService/dashboard.service";
import ActivityLogMain from "@/components/pages/shared/dashboard/ActivityLogMain";
import { AlertCircle, Activity } from "lucide-react";

export default async function ActivityLogPage() {
  const activityData = await getDashboardActivity();

  if (!activityData || activityData instanceof Error || !activityData.success) {
    const errorMsg = activityData?.message || "Failed to load activity log.";
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white max-w-xl mx-auto mt-12 shadow-sm">
        <AlertCircle size={40} className="mb-3 text-gray-700 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Error Loading Activity Log</h3>
        <p className="text-sm text-slate-500 text-center mb-4">{errorMsg}</p>
        <p className="text-xs text-slate-400">Please make sure you have the dashboard and active sessions configured.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ActivityLogMain initialData={activityData} />
    </div>
  );
}
