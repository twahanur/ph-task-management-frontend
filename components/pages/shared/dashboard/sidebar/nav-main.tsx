"use client";
import { SidebarGroup } from "@/components/ui/sidebar";
import CoreManagement from "./sidebarRoutes/CoreManagement";
import { useUser } from "@/provider/AuthProvider";
import { filterRoutesByPermissions } from "@/utills/filterRoutesByPermissions";
import { crmRoutes, NavRoute } from "@/constants/CRM_Navigation";

export function NavMain() {
  const { user } = useUser();
  const role = user?.role as string;
  const permissions = user?.permissions as string[];

  const permittedRoute = filterRoutesByPermissions({
    routes: crmRoutes,
    permissions,
    role,
  });

  return (
    <SidebarGroup>
      {permittedRoute.length ? (
        <div className="space-y-1">
          <CoreManagement
            sidebarRoutes={permittedRoute}
          />
        </div>
      ) : (
        <div>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-8 w-full bg-gray-200 animate-pulse rounded-md mb-2" />
          ))}
        </div>
      )}
    </SidebarGroup>
  );
}
