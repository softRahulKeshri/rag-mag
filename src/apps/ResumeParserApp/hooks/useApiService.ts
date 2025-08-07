import { useCallback, useMemo } from "react";
import { resumeApi } from "../../../lib/axios";
import type { AxiosError } from "axios";
import type { ApiError } from "../types/api";

/**
 * Base API Service Hook
 *
 * Provides axios-based functionality with JWT authentication and error handling
 * Uses the centralized resumeApi instance which includes:
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
        const response = await resumeApi.post<T>(url, data);
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
      const response = await resumeApi.get<T>(url);
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
      const response = await resumeApi.put<T>(url, data);
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
      const response = await resumeApi.delete<T>(url);
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
   * Handle API errors consistently
   */
  const handleApiError = useCallback((error: unknown): ApiError => {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
        detail?: string;
      }>;

      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;

      // Extract error message from response
      let message = "An unexpected error occurred";
      if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        message = responseData.error;
      } else if (responseData?.detail) {
        message = responseData.detail;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      // Handle specific error codes
      if (status === 401) {
        message = "Authentication failed. Please login again.";
      } else if (status === 403) {
        message =
          "Access forbidden. You don't have permission to perform this action.";
      } else if (status === 404) {
        message = "Resource not found.";
      } else if (status === 500) {
        message = "Internal server error. Please try again later.";
      } else if (status === 502 || status === 503 || status === 504) {
        message = "Service temporarily unavailable. Please try again later.";
      }

      return {
        message,
        status: status || 0,
        code: axiosError.code,
      };
    }

    // Handle network errors
    if (error && typeof error === "object" && "request" in error) {
      return {
        message: "Network error - no response received",
        status: 0,
        code: "NETWORK_ERROR",
      };
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      message: errorMessage,
      status: 0,
      code: "UNKNOWN_ERROR",
    };
  }, []);

  /**
   * Build full URL with base URL (for backward compatibility)
   */
  const buildUrl = useCallback((endpoint: string): string => {
    // Since we're using axios with baseURL, this is mainly for logging
    return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  }, []);

  /**
   * Legacy fetchWithRetry for backward compatibility
   * Now uses axios under the hood
   */
  const fetchWithRetry = useCallback(
    async <T>(
      url: string,
      options: RequestInit = {},
      attempt: number = 1
    ): Promise<T> => {
      try {
        const method = options.method?.toLowerCase() || "get";
        const data = options.body
          ? JSON.parse(options.body as string)
          : undefined;

        let response: T;

        switch (method) {
          case "get":
            response = await get<T>(url);
            break;
          case "post":
            response = await post<T>(url, data);
            break;
          case "put":
            response = await put<T>(url, data);
            break;
          case "delete":
            response = await del<T>(url);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return response;
      } catch (error) {
        // If it's an abort error and we have retries left, retry
        if (
          attempt < 3 &&
          error instanceof Error &&
          (error.name === "AbortError" || error.message.includes("fetch"))
        ) {
          console.warn(
            `API call failed (attempt ${attempt}), retrying in 1000ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchWithRetry<T>(url, options, attempt + 1);
        }

        throw error;
      }
    },
    [get, post, put, del]
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
        baseURL: resumeApi.defaults.baseURL,
        timeout: resumeApi.defaults.timeout,
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
