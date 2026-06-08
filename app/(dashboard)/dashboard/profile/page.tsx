import { getMyProfile } from "@/service/userService/user.service";
import ProfileMain from "@/components/pages/shared/dashboard/ProfileMain";
import { AlertCircle } from "lucide-react";

export default async function ProfilePage() {
  const profileData = await getMyProfile();

  if (!profileData || profileData instanceof Error || !profileData.success) {
    const errorMsg = profileData?.message || "Failed to load profile details.";
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white max-w-xl mx-auto mt-12 shadow-sm">
        <AlertCircle size={40} className="mb-3 text-gray-700 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Error Loading Profile</h3>
        <p className="text-sm text-slate-500 text-center mb-4">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProfileMain initialData={profileData} />
    </div>
  );
}
