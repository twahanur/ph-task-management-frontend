import { PermissionRoute } from "./hasPermission";

export const getRedirectPath = (
  role: string,
  userPermissions: string[],
  routes: PermissionRoute[],
) => {
  // Default fallback path
  const defaultPath = "/dashboard";
  
  if (role === "Owner") {
    return defaultPath;
  }
  
  // Ensure routes is an array
  if (!Array.isArray(routes) || routes.length === 0) {
    return defaultPath;
  }
  
  // Ensure userPermissions is an array
  if (!Array.isArray(userPermissions) || userPermissions.length === 0) {
    return defaultPath;
  }
  
  const sortedRoutes = [...routes].sort(
    (a, b) => (b?.path?.length ?? 0) - (a?.path?.length ?? 0),
  );
  
  const accessibleRoutes = sortedRoutes.filter((route) => {
    return route?.permissions?.some((p) => userPermissions.includes(p));
  });
  
  const lastRoute = accessibleRoutes?.[0];
  
  // Return the path if it exists, otherwise return default
  return lastRoute?.path ?? defaultPath;
};
