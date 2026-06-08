/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { customFetch } from "@/service/customFetch";
import { getValidToken } from "../authService/validToken";
import { revalidatePath } from "next/cache";
import { config } from "@/config";
import { cookies } from "next/headers";
import { buildParams } from "@/utills/paramsBuilder";

type Query = Record<string, any>;

//create
export async function createData<T>(
  endPoint: string,
  revalPath: string,
  data?: T,
) {
  const token = await getValidToken();
  try {
    const res = await customFetch(`${config.next_public_base_api}${endPoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidatePath(revalPath);
    return result;
  } catch (error: any) {
    return Error(error);
  }
}

// upload file
export async function uploadFile<T>(
  endPoint: string,
  revalPath: string,
  data?: T,
) {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_api}${endPoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data"
      },
      body: data as any,
    });
    const result = await res.json();
    revalidatePath(revalPath);
    return result;
  } catch (error: any) {
    return Error(error);
  }
}

//get
export async function readData(
  endPoint: string,
  tags: string[],
  query?: Query,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  try {
    const res = await customFetch(
      `${config.next_public_base_api}${endPoint}?${query ? buildParams(query) : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          tags: [...tags],
          revalidate: 15,
        },
      } as RequestInit,
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return error;
  }
}

// delete
export async function deleteData<T>(
  endPoint: string,
  revalPath: string,
  data?: T,
) {
  const token = await getValidToken();
  try {
    const res = await customFetch(`${config.next_public_base_api}${endPoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({customerIds:[1,2]}),
      body: JSON.stringify(data),
    } as RequestInit);
    revalidatePath(revalPath);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return error;
  }
}

// update
export async function patchData<T>(
  endPoint: string,
  revalPath: string,
  data?: T,
) {
  const token = await getValidToken();
  try {
    const res = await customFetch(`${config.next_public_base_api}${endPoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    } as RequestInit);
    const result = await res.json();
    revalidatePath(revalPath);
    return result;
  } catch (error: any) {
    return error;
  }
}
export async function putData<T>(
  endPoint: string,
  revalPath: string,
  data?: T,
) {
  const token = await getValidToken();
  try {
    const res = await fetch(`${config.next_public_base_api}${endPoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    } as RequestInit);
    const result = await res.json();
    revalidatePath(revalPath);
    return result;
  } catch (error: any) {
    return error;
  }
}

// ========================================= public api ===========================
// public read
export async function readPublicData(
  endPoint: string,
  tags: string[],
  query?: Query,
) {
  try {
    const res = await fetch(
      `${config.next_public_base_api}${endPoint}?${query ? buildParams(query) : ""}`,
      {
        method: "GET",
        next: {
          tags: [...tags],
          revalidate: 30,
        },
      } as RequestInit,
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return error;
  }
}

//public create
export async function createPublicData<T>(
  endPoint: string,
  revalPath: string,
  data?: T,
) {
  try {
    const res = await fetch(`${config.next_public_base_api}${endPoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidatePath(revalPath);
    return result;
  } catch (error: any) {
    return Error(error);
  }
}

export async function noCacheRead(
  endPoint: string,
  tags: string[],
  query?: Query,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  try {
    const res = await customFetch(
      `${config.next_public_base_api}${endPoint}?${query ? buildParams(query) : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      } as RequestInit,
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    return error;
  }
}
