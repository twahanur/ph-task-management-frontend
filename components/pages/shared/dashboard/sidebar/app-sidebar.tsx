/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LogOut } from "lucide-react";
import * as React from "react";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SidebarButtonEffect from "./buttons/ItemButton";
import { useUser } from "@/provider/AuthProvider";
import { logout } from "@/service/authService";
import { CustomScrollbar } from "@/components/ui/CustomScrollbar";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { setUser, setIsLoading, user } = useUser();
  const companyName = "PH Tasks";
  const logoUrl = null;

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
        toast.error(res?.message, { id: toastId, duration: 3000 });
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
    <Sidebar collapsible="icon" {...props} className="border-r border-gray-300 silver-metallic shadow-sm">
      <div className="flex flex-col justify-between h-full bg-transparent">
        <div className="flex flex-col flex-1 min-h-0 space-y-1">
          <SidebarHeader>
            <TeamSwitcher name={companyName} plan="Workspace" logoUrl={logoUrl} />
            <div className="border-b border-gray-300" />
          </SidebarHeader>

          <div className="flex-1 min-h-0">
            <CustomScrollbar className="h-full">
              <SidebarContent>
                <NavMain />
              </SidebarContent>
            </CustomScrollbar>
          </div>
        </div>

        <SidebarFooter className="gap-0 border-t border-gray-300">
          <div className="p-1">
          </div>

          <SidebarMenuButton tooltip={"Logout"} asChild className="px-0">
            <button
              onClick={handleLogOut}
              className="w-full text-left cursor-pointer"
            >
              <SidebarButtonEffect>
                <div className="relative z-10 flex w-full items-center justify-between px-4 group-data-[collapsible=icon]:p-2 py-1.5">
                  <p className="flex items-center gap-2">
                    <span>
                      <LogOut size={16} className="text-red-600" />
                    </span>
                    <span className="text-red-600 text-sm font-medium">Logout</span>
                  </p>
                </div>
              </SidebarButtonEffect>
            </button>
          </SidebarMenuButton>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
