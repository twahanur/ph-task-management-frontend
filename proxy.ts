import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const allowedRoles = ["admin", "team_member", "project_manager"];

const authRoutes = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/register",
];

function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

function getUserInfo(token: string): any {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  
  // Create a default response
  let response = NextResponse.next();

  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If there is no refresh token, make sure access token is deleted
  if (!refreshToken) {
    response.cookies.delete("accessToken");
  }

  // Case 1: User is already logged in with a valid token and tries to access auth routes (like /login)
  if (token && authRoutes.includes(pathname)) {
    const userInfo = getUserInfo(token);
    const role = userInfo?.role ?? null;
    
    if (!role || !allowedRoles.includes(role)) {
      // Clear cookies and redirect to login if role is invalid
      const redirectRes = NextResponse.redirect(new URL("/login", request.url));
      redirectRes.cookies.delete("accessToken");
      redirectRes.cookies.delete("refreshToken");
      return redirectRes;
    } else {
      // Redirect logged-in users away from auth routes to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Case 2: Logged-out users can access auth routes freely
  if (!token && authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Case 3: Accessing protected routes (like /dashboard, /projects, etc.)
  // If we don't have a token or it's expired, try to refresh it
  if (!token || isTokenExpired(token)) {
    if (!refreshToken) {
      // No tokens at all, redirect to login
      const redirectRes = NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, request.url)
      );
      redirectRes.cookies.delete("accessToken");
      return redirectRes;
    }

    try {
      // Attempt to refresh the access token via backend direct API call (avoiding Server Actions)
      const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api";
      const refreshRes = await fetch(`${baseApi}/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData?.data?.accessToken || refreshData?.data?.token;

      if (refreshRes.ok && refreshData?.success && newAccessToken) {
        // Successfully got a new access token, set cookie and proceed
        response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
        });
        return response;
      } else {
        // Refresh failed, clear session and redirect to login
        const redirectRes = NextResponse.redirect(
          new URL(`/login?redirectPath=${pathname}`, request.url)
        );
        redirectRes.cookies.delete("accessToken");
        redirectRes.cookies.delete("refreshToken");
        return redirectRes;
      }
    } catch (error) {
      console.error("Proxy refresh token failed:", error);
      const redirectRes = NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, request.url)
      );
      redirectRes.cookies.delete("accessToken");
      redirectRes.cookies.delete("refreshToken");
      return redirectRes;
    }
  }

  // Case 4: Valid token exists, check role/permissions
  const userInfo = getUserInfo(token);
  if (!userInfo) {
    const redirectRes = NextResponse.redirect(
      new URL(`/login?redirectPath=${pathname}`, request.url)
    );
    redirectRes.cookies.delete("accessToken");
    redirectRes.cookies.delete("refreshToken");
    return redirectRes;
  }

  const role = userInfo?.role ?? null;
  if (!role || !allowedRoles.includes(role)) {
    const redirectRes = NextResponse.redirect(new URL(`/login`, request.url));
    redirectRes.cookies.delete("accessToken");
    redirectRes.cookies.delete("refreshToken");
    return redirectRes;
  }

  return response;
};

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/projects/:path*",
    "/login",
    "/register",
  ],
};
