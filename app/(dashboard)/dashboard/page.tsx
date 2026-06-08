import { getDashboardData } from "@/service/dashboardService/dashboard.service";
import DashboardMain from "@/components/pages/shared/dashboard/DashboardMain";
import { LayoutGrid, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  
  if (!dashboardData || dashboardData instanceof Error || !dashboardData.success) {
    const errorMsg = dashboardData?.message || "Failed to load dashboard metrics.";
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white max-w-xl mx-auto mt-12 shadow-sm">
        <AlertCircle size={40} className="mb-3 text-gray-700 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Error Loading Dashboard</h3>
        <p className="text-sm text-slate-500 text-center mb-4">{errorMsg}</p>
        <p className="text-xs text-slate-400">Please make sure you have active projects and tasks set up.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DashboardMain initialData={dashboardData} />
    </div>
  );
}
