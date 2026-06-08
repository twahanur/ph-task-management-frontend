import { getDashboardWorkload } from "@/service/dashboardService/dashboard.service";
import WorkloadMain from "@/components/pages/shared/dashboard/WorkloadMain";
import { AlertCircle } from "lucide-react";

export default async function WorkloadSummaryPage() {
  const workloadData = await getDashboardWorkload();

  if (!workloadData || workloadData instanceof Error || !workloadData.success) {
    const errorMsg = workloadData?.message || "Failed to load team workload summary.";
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white max-w-xl mx-auto mt-12 shadow-sm">
        <AlertCircle size={40} className="mb-3 text-rose-500 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Error Loading Workload Summary</h3>
        <p className="text-sm text-slate-500 text-center mb-4">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <WorkloadMain initialData={workloadData} />
    </div>
  );
}
