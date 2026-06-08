export const matchRoute = (pathname: string, parentRoute: string) => {
  // exact match → parent active
  if (pathname === parentRoute) return true;

  // must start with parent route
  if (!pathname.startsWith(parentRoute + "/")) return false;

  // get the next segment after parentRoute
  const nextSegment = pathname.slice(parentRoute.length + 1).split("/")[0];

  // if nextSegment is numeric → dynamic route → parent active
  if (/^\d+$/.test(nextSegment)) return true;

  // otherwise, it's a nested child route → parent NOT active
  return false;
};
