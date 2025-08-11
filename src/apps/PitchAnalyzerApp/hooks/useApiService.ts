import { useCallback, useMemo } from "react";
import { pitchApi } from "../../../lib/axios";
import type { AxiosError } from "axios";

/**
 * API Service Hook for PitchAnalyzerApp
 *
 * Provides axios-based functionality with JWT authentication and error handling
 * Uses the centralized pitchApi instance which includes:
 * - Automatic JWT Bearer token injection
 * - Token refresh on 401 errors
 * - Consistent error handling
 * - Request/response interceptors
 * - Retry logic with exponential backoff
 * - Timeout handling
 */
export const useApiService = () => {
  /**
   * POST request helper using axios
   */
  const post = useCallback(
    async <T>(url: string, data: unknown): Promise<T> => {
      try {
        const response = await pitchApi.post<T>(url, data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ POST request failed:", {
          url,
          status: axiosError.response?.status,
          message: axiosError.message,
        });
        throw error;
      }
    },
    []
  );

  /**
   * GET request helper using axios
   */
  const get = useCallback(async <T>(url: string): Promise<T> => {
    try {
      const response = await pitchApi.get<T>(url);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("❌ GET request failed:", {
        url,
        status: axiosError.response?.status,
        message: axiosError.message,
      });
      throw error;
    }
  }, []);

  /**
   * PUT request helper using axios
   */
  const put = useCallback(async <T>(url: string, data: unknown): Promise<T> => {
    try {
      const response = await pitchApi.put<T>(url, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("❌ PUT request failed:", {
        url,
        status: axiosError.response?.status,
        message: axiosError.message,
      });
      throw error;
    }
  }, []);

  /**
   * DELETE request helper using axios
   */
  const del = useCallback(async <T>(url: string): Promise<T> => {
    try {
      const response = await pitchApi.delete<T>(url);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("❌ DELETE request failed:", {
        url,
        status: axiosError.response?.status,
        message: axiosError.message,
      });
      throw error;
    }
  }, []);

  /**
   * Handle API errors with consistent error handling
   */
  const handleApiError = useCallback((error: unknown): never => {
    if (error instanceof Error) {
      // Log the error for debugging
      console.error("❌ API Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });

      // Re-throw the error for component-level handling
      throw error;
    }

    // Handle unknown error types
    console.error("❌ Unknown API Error:", error);
    throw new Error("An unexpected error occurred");
  }, []);

  /**
   * Build URL with query parameters
   */
  const buildUrl = useCallback(
    (baseUrl: string, params?: Record<string, string | number | boolean>) => {
      if (!params || Object.keys(params).length === 0) {
        return baseUrl;
      }

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      return `${baseUrl}?${searchParams.toString()}`;
    },
    []
  );

  /**
   * Fetch with retry logic and exponential backoff
   */
  const fetchWithRetry = useCallback(
    async <T>(
      url: string,
      options: RequestInit = {},
      retryAttempts = 3,
      retryDelay = 1000
    ): Promise<T> => {
      let lastError: Error;

      for (let attempt = 0; attempt < retryAttempts; attempt++) {
        try {
          const response = await fetch(url, options);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return await response.json();
        } catch (error) {
          lastError = error as Error;
          console.warn(`⚠️ Request attempt ${attempt + 1} failed:`, error);

          if (attempt < retryAttempts - 1) {
            const delay = retryDelay * Math.pow(2, attempt);
            console.log(`⏳ Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError!;
    },
    []
  );

  /**
   * Create request options with common headers and JWT authentication
   * (for backward compatibility)
   */
  const createRequestOptions = useCallback(
    (
      method: string,
      body?: unknown,
      customHeaders?: Record<string, string>
    ): RequestInit => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
      };

      const options: RequestInit = {
        method,
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      return options;
    },
    []
  );

  return useMemo(
    () => ({
      // Axios-based methods (recommended)
      post,
      get,
      put,
      del,
      handleApiError,
      buildUrl,

      // Legacy methods (for backward compatibility)
      fetchWithRetry,
      createRequestOptions,

      // Configuration
      config: {
        baseURL: pitchApi.defaults.baseURL,
        timeout: pitchApi.defaults.timeout,
        retryAttempts: 3,
        retryDelay: 1000,
      },
    }),
    [
      post,
      get,
      put,
      del,
      handleApiError,
      buildUrl,
      fetchWithRetry,
      createRequestOptions,
    ]
  );
};
