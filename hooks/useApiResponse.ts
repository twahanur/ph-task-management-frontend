import React from 'react';
import { safeArray, safeString, safeNumber, isEmpty } from './useSafeData';

/**
 * Standard API response structure
 */
export type ApiResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

/**
 * Safe API response helper with optional chaining
 */
export const getSafeApiResponse = <T = unknown>(response: ApiResponse<T> | null | undefined) => {
  const isSuccess = response?.success ?? false;
  const data = response?.data;
  const message = safeString(response?.message, '');
  const error = safeString(response?.error, '');
  const errors = safeArray(response?.errors);
  const meta = response?.meta;

  // Get first error message
  const firstError = errors?.[0] ?? error ?? '';

  // Check if response has data
  const hasData = !isEmpty(data);

  // Get safe data with fallback
  const getSafeData = <K = T>(fallback: K): T | K => {
    return hasData ? (data as T) : fallback;
  };

  // Get array data safely
  const getArrayData = <K = unknown>(fallback: K[] = []): K[] => {
    if (Array.isArray(data)) {
      return data as K[];
    }
    return fallback;
  };

  // Get pagination info safely
  const getPagination = () => ({
    total: safeNumber(meta?.total, 0),
    page: safeNumber(meta?.page, 1),
    limit: safeNumber(meta?.limit, 10),
    totalPages: safeNumber(meta?.totalPages, 1),
  });

  return {
    isSuccess,
    data,
    message,
    error: firstError,
    errors,
    meta,
    hasData,
    getSafeData,
    getArrayData,
    getPagination,
  };
};

/**
 * Hook for handling loading states with API responses
 */
export const useApiState = <T = unknown>() => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<T | null>(null);

  const handleApiCall = async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      const { isSuccess, getSafeData, error: apiError } = getSafeApiResponse(response);
      
      if (isSuccess) {
        setData(getSafeData(null));
      } else {
        setError(apiError || 'An error occurred');
        setData(null);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Network error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    loading,
    error,
    data,
    handleApiCall,
    reset,
  };
};

/**
 * Utility to safely extract nested data from API responses
 */
export const extractNestedData = <T = unknown>(
  response: Record<string, unknown> | null | undefined,
  path: string,
  fallback?: T
): T => {
  const keys = path.split('.');
  let current: unknown = response;

  for (const key of keys) {
    if (current && typeof current === 'object' && (current as Record<string, unknown>)[key] !== undefined) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return fallback as T;
    }
  }

  return (current ?? fallback) as T;
};

/**
 * Safe data transformer for API responses
 */
export const transformApiData = <T, R>(
  data: T[] | null | undefined,
  transformer: (item: T, index: number) => R,
  fallback: R[] = []
): R[] => {
  const safeData = safeArray(data);
  
  if (safeData.length === 0) {
    return fallback;
  }

  return safeData.map((item, index) => {
    try {
      return transformer(item, index);
    } catch (error) {
      console.warn('Error transforming data item:', error);
      return null;
    }
  }).filter(Boolean) as R[];
};

/**
 * Utility to handle chart data transformation safely
 */
export const transformChartData = <T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  config: {
    labelKey: keyof T;
    valueKey: keyof T;
    colorKey?: keyof T;
    defaultColor?: string;
  }
): Array<{
  label: string;
  value: number;
  color: string;
  originalData: T;
}> => {
  const { labelKey, valueKey, colorKey, defaultColor = '#8884d8' } = config;
  
  return transformApiData(data, (item, index) => ({
    label: safeString(item?.[labelKey] as unknown as string, `Item ${index + 1}`),
    value: safeNumber(item?.[valueKey] as unknown as number, 0),
    color: colorKey ? safeString(item?.[colorKey] as unknown as string, defaultColor) : defaultColor,
    originalData: item,
  }));
};