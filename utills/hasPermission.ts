import { crmRoutes, NavRoute } from "@/constants/CRM_Navigation";
import { useUser } from "@/provider/AuthProvider";

export type PermissionRoute = {
  path: string;
  pattern: RegExp;
  permissions?: string[];
  ownerOnly?: boolean;
};

export const hasPermission = (
  userPermissions: string[] = [],
  requiredPermissions: string[] = [],
) => {
  const safeUserPermissions = Array.isArray(userPermissions)
    ? userPermissions
    : [];

  const safeRequiredPermissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [];
  const hasPermission = safeRequiredPermissions.some((p) => safeUserPermissions.includes(p))
  return hasPermission;
};

export const extractPermissionRoutes = (
  routes: NavRoute[],
  result: PermissionRoute[] = [],
) => {
  // Ensure routes is an array
  if (!Array.isArray(routes)) {
    return result;
  }

  routes.forEach((route) => {
    if (route?.path) {
      result.push({
        path: route.path,
        pattern: new RegExp(`^${route.path}`),
        permissions: route?.permissions ?? route?.roles ?? [],
        ownerOnly: route?.ownerOnly ?? false,
      });
    }
    if (route?.children && Array.isArray(route.children)) {
      extractPermissionRoutes(route.children, result);
    }
  });
  return result;
};

export const permissionBasedRoutes = [
  ...extractPermissionRoutes(crmRoutes),
].sort((a, b) => b.pattern.source.length - a.pattern.source.length);