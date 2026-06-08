/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { customFetch } from "@/service/customFetch";

import { config } from "@/config";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { TForgetPasswordData } from "@/components/auth/forgetPassword/ForgetPasswordComponent";
import { createData, readData } from "../apiService/crud";
import { TSetNewPass } from "@/components/auth/resetPassword/SetNewPassword";

type TLogin = {
  email: string;
  password: string;
};

type TRegister = {
  name: string;
  email: string;
  password: string;
  role: string;
}
//register
export const register = async (data: TRegister) => {
  const res = await createData<TRegister>(
    `/auth/register`,
    "/register",
    data,
  );
  return res;
};

// login functionality
export const login = async (loginData: TLogin) => {
  try {

    const res = await customFetch(
      `${config?.next_public_base_api ?? ''}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      },
    );
    const result = await res?.json();
    console.log("result",result)
    if (result?.success) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", result?.data?.accessToken ?? '', {
        maxAge: 60 * 60 * 24 * 7, // 7 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      cookieStore.set("refreshToken", result?.data?.refreshToken ?? '', {
        maxAge: 60 * 60 * 24 * 30, // 30 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
    }
    return result;
  } catch (error: any) {
    return new Error(error?.message ?? 'Login failed');
  }
};

// get new token functionality
export const getNewToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore?.get("refreshToken")?.value;
    if (!token) {
      throw new Error("you are not authorized");
    }
    const res = await customFetch(
      `${config?.next_public_base_api ?? ''}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res?.json();
  } catch (error: any) {
    return new Error(error?.message ?? 'Token refresh failed');
  }
};

// get current user functionality
export const getCurrentUser = async () => {
  const accessToken = (await cookies())?.get("accessToken")?.value;
  let decodedData = null;
  if (accessToken) {
    try {
      decodedData = await jwtDecode(accessToken);
      return decodedData;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  } else {
    return null;
  }
};

// logout functionality
export const logout = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore?.get("accessToken")?.value;
    if (!token) {
      throw new Error("you are not authorized");
    }
    const res = await customFetch(
      `${config?.next_public_base_api ?? ''}/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = await res?.json();
    if (result?.success) {
      (await cookies())?.delete("accessToken");
      (await cookies())?.delete("refreshToken");
    }
    return result;
  } catch (error: any) {
    return new Error(error?.message ?? 'Logout failed');
  }
};

export const getAccesstoken = async () => {
  const accessToken = (await cookies())?.get("accessToken")?.value;
  return accessToken ?? null;
};

export const forgetPassword = async (data: TForgetPasswordData) => {
  const res = await createData<TForgetPasswordData>(
    `/auth/forgot-password`,
    "/forgot-password",
    data as TForgetPasswordData,
  );
  return res;
};

export const verifyForgetPassToken = async (token: string) => {
  const res = await readData(`/auth/reset-password/${token}/validate`, [
    "Verify Token",
  ]);
  return res;
};

export const setNewPassword = async (data: TSetNewPass, token: string) => {
  const res = await createData<TSetNewPass>(
    `/auth/reset-password/${token}`,
    "/forgot-password",
    data as TSetNewPass,
  );
  return res;
};


export type TUpdatePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const updatePassword = async (data: TUpdatePassword) => {
  const res = await createData<TUpdatePassword>(
    `/update-password`,
    "/dashboard/profile",
    data as TUpdatePassword,
  );
  return res;
};