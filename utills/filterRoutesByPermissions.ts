import { NavRoute } from "@/constants/CRM_Navigation";
type TFilterRoutesByPermission = {
  routes: NavRoute[];
  permissions: string[];
  role: string;
};

type TCanAccessRoute = {
  route: NavRoute;
  permissions: string[];
  role?: string;
};

export const canAccessRoute = ({
  route,
  permissions = [],
  role,
}: TCanAccessRoute): boolean => {
  if (!route) return false;

  const safePermissions = Array.isArray(permissions) ? permissions : [];
  const isOwner = role === "Owner";

  const isPublicRoute =
    !route?.ownerOnly &&
    (!route?.permissions || route.permissions.length === 0) &&
    (!route?.roles || route.roles.length === 0);

  // ✅ Public → everyone can access
  if (isPublicRoute) {
    return true;
  }

  // ✅ Owner → ownerOnly + public (public already handled above)
  if (isOwner) {
    return route?.ownerOnly === true;
  }

  // ✅ Role-based access
  if (route?.roles && route.roles.length > 0 && role) {
    if (route.roles.includes(role)) {
      return true;
    }
  }

  // ✅ Non-owner → only permission routes
  if (route?.permissions && route.permissions.length > 0) {
    return route.permissions.some((p) => safePermissions.includes(p));
  }

  return false;
};

export const filterRoutesByPermissions = ({
  routes,
  permissions,
  role,
}: TFilterRoutesByPermission): NavRoute[] => {
  // Ensure routes is an array
  if (!Array.isArray(routes)) {
    return [];
  }
  
  // Ensure permissions is an array
  const safePermissions = Array.isArray(permissions) ? permissions : [];
  
  return routes
    .map((route) => {
      if (!route) {
        return null;
      }
      
      if (route?.children && Array.isArray(route.children) && route.children.length > 0) {
        const filteredChildren = filterRoutesByPermissions({
          routes: route.children,
          permissions: safePermissions,
          role,
        });
        if (filteredChildren.length > 0) {
          return {
            ...route,
            children: filteredChildren,
          };
        }
        return null;
      }
      
      const hasAccess = canAccessRoute({
        route,
        permissions: safePermissions,
        role,
      });

      return hasAccess ? route : null;
    })
    .filter(Boolean) as NavRoute[];
};
