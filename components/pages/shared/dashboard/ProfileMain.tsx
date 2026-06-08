"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Layers,
  Bell,
  Save,
  Palette,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateMyProfile, updateMyPreferences } from "@/service/userService/user.service";

interface ProfileMainProps {
  initialData: any;
}

export default function ProfileMain({ initialData }: ProfileMainProps) {
  const profile = initialData?.data || {};

  // Form states
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Preference states
  const preferences = profile.preferences || { theme: "light", email_notifications: true };
  const [theme, setTheme] = useState<string>(preferences.theme || "light");
  const [emailNotifications, setEmailNotifications] = useState<boolean>(
    preferences.email_notifications !== false
  );
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const initials = name ? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "US";
  const joinedDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "N/A";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const toastId = toast.loading("Updating profile...", { duration: 3000 });
    try {
      const res = await updateMyProfile({ name, bio, avatar_url: avatarUrl });
      if (res.success) {
        toast.success("Profile updated successfully", { id: toastId, duration: 3000 });
      } else {
        toast.error(res.message || "Failed to update profile", { id: toastId, duration: 3000 });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId, duration: 3000 });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    const toastId = toast.loading("Updating preferences...", { duration: 3000 });
    try {
      const res = await updateMyPreferences({ theme, email_notifications: emailNotifications });
      if (res.success) {
        toast.success("Preferences updated successfully", { id: toastId, duration: 3000 });
      } else {
        toast.error(res.message || "Failed to update preferences", { id: toastId, duration: 3000 });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId, duration: 3000 });
    } finally {
      setIsSavingPrefs(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Greet */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <User size={12} />
              Account Settings
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            MY PROFILE
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your personal profile information, preferences, and account setup.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Meta */}
        <div className="space-y-6">
          {/* User Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 rounded-2xl border-2 border-slate-100 shadow-sm">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="rounded-2xl bg-blue-50 text-blue-600 text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">{name || "Unnamed User"}</h2>
              <p className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full inline-block capitalize">
                {profile.role?.replace("_", " ")}
              </p>
            </div>
            {profile.bio && (
              <p className="text-sm text-slate-500 max-w-xs italic">
                "{profile.bio}"
              </p>
            )}
            <hr className="w-full border-slate-100" />
            <div className="w-full text-left space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={16} className="text-slate-400" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Activity Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <Layers className="text-blue-500 mb-2" size={20} />
                <span className="text-2xl font-black text-slate-800">
                  {profile._count?.card_assignments || 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                  Assigned Cards
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <Bell className="text-amber-500 mb-2" size={20} />
                <span className="text-2xl font-black text-slate-800">
                  {profile._count?.notifications || 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                  Unread Alerts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editing Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                Edit Profile Information
              </h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-600 uppercase">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ""}
                    disabled
                    className="rounded-xl bg-slate-50 cursor-not-allowed border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="avatarUrl" className="text-xs font-bold text-slate-600 uppercase">
                  Avatar Image URL
                </Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-bold text-slate-600 uppercase">
                  Short Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little bit about yourself..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold px-5 flex items-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </div>

          {/* Preferences Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                System Preferences
              </h3>
            </div>

            <div className="space-y-6">
              {/* Theme preference */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Palette size={16} className="text-blue-500" />
                    Interface Theme
                  </h4>
                  <p className="text-xs text-slate-400">
                    Select your preferred system color theme.
                  </p>
                </div>
                <div className="w-[180px]">
                  <Select value={theme} onValueChange={(val) => setTheme(val)}>
                    <SelectTrigger className="bg-white border-slate-200 rounded-xl">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200">
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Email notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Bell size={16} className="text-amber-500" />
                    Email Notifications
                  </h4>
                  <p className="text-xs text-slate-400">
                    Receive summaries, due dates, and update logs directly in your email inbox.
                  </p>
                </div>
                <div className="flex items-center">
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={(val) => setEmailNotifications(val)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSavingPrefs}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold px-5 flex items-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  {isSavingPrefs ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
