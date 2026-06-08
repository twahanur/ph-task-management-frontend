import { useMemo } from 'react';

/**
 * Custom hook for safe data access with optional chaining and fallbacks
 */
export const useSafeData = <T>(data: T | null | undefined, fallback?: T) => {
  return useMemo(() => {
    if (data === null || data === undefined) {
      return fallback;
    }
    return data;
  }, [data, fallback]);
};

/**
 * Utility function for safe array access
 */
export const safeArray = <T>(arr: T[] | null | undefined): T[] => {
  return arr ?? [];
};

/**
 * Utility function for safe object property access
 */
export const safeGet = <T, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  fallback?: T[K]
): T[K] | undefined => {
  return obj?.[key] ?? fallback;
};

/**
 * Utility function for safe string access with trimming
 */
export const safeString = (str: string | null | undefined, fallback = 'N/A'): string => {
  return str?.trim() || fallback;
};

/**
 * Utility function for safe number access
 */
export const safeNumber = (num: number | null | undefined, fallback = 0): number => {
  return num ?? fallback;
};

/*
 * Utility function to check if data is empty
 */
export const isEmpty = (data: unknown): boolean => {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  if (typeof data === 'string') return data.trim().length === 0;
  return false;
};

/**
 * Utility function for safe date formatting
 */
export const safeDate = (date: string | Date | null | undefined, fallback = 'N/A'): string => {
  if (!date) return fallback;
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return fallback;
  }
};