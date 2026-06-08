/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import TooltipComponent from "@/components/ui/TooltipComponent";
import { useUser } from "@/provider/AuthProvider";
import { logout } from "@/service/authService";

import { ArrowLeft, ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import NotificationBell from "../boards/components/NotificationBell";

const Navbar: React.FC = () => {
  const { state, isMobile } = useSidebar();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { setUser, user, setIsLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const name = profile?.name || user?.tenantSlug || "User";
  const trimedName = name.length > 15 ? name.slice(0, 15) + "..." : name;
  const avatarUrl = profile?.avatar_secure_url || "https://images.unsplash.com/photo-1676195470090-7c90bf539b3b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687";
  const handleLogOut = async () => {
    const toastId = toast.loading("logging out", { duration: 3000 });
    try {
      const res = await logout();
      if (res.success) {
        setIsLoading(true);
        setUser(null);
        toast.success(res?.message, { id: toastId, duration: 3000 });
        router.push("/login");
      } else {
        toast.error(res.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      const errorInfo =
        error?.error ||
        error?.data?.message ||
        error?.data?.errors[0]?.message ||
        "Something went wrong!";
      toast.error(errorInfo, { id: toastId, duration: 3000 });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 flex h-14 items-center gap-2 transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ${
        scrolled
          ? "silver-metallic border-b border-gray-300 shadow-sm"
          : "bg-transparent"
      }`}
    >
      {(state === "collapsed" || isMobile) && <SidebarTrigger className="cursor-pointer ml-2 text-gray-650 hover:text-gray-850 hover:bg-gray-200/50 p-2 rounded-xl" />}
      <div className={`w-full flex items-center justify-between gap-2 px-4`}>
        <div className="w-full flex items-center justify-between gap-2">
          <div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="cursor-pointer silver-btn border-gray-300 text-gray-850 shadow-sm rounded-lg!"
            >
              <ArrowLeft size={16} />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 text-sm font-medium text-gray-750 hover:bg-gray-200/50 transition-all duration-200 cursor-pointer p-2 rounded-xl">
                  <Avatar className="w-9 h-9 rounded-lg ring-2 ring-gray-300">
                    <AvatarImage src={avatarUrl} />
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-850">
                      <TooltipComponent name={name} trimedName={trimedName} />
                    </p>
                    <span className="text-[11px] text-gray-500 capitalize">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-2 silver-metallic border border-gray-300 shadow-xl rounded-xl!"
                align="end"
              >
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="w-10 h-10 rounded-lg">
                    <AvatarImage src={avatarUrl} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-850">
                      <TooltipComponent name={name} trimedName={trimedName} />
                    </p>
                    <p className="text-xs text-gray-550 capitalize">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <hr className="my-2 border-gray-300" />
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-200/60 hover:text-gray-850 transition-colors"
                >
                  <User size={14} />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings/notification-settings"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-200/60 hover:text-gray-850 transition-colors"
                >
                  <Settings size={14} />
                  My Settings
                </Link>
                <hr className="my-1 border-gray-300" />
                <button
                  onClick={handleLogOut}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50/60 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
