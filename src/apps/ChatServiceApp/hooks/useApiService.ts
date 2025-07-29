import { useCallback } from "react";
import { chatApi } from "../../../lib/axios";
import type { AxiosError } from "axios";

/**
 * API Service Hook for ChatServiceApp
 *
 * Provides axios-based functionality with JWT authentication and error handling
 * Uses the centralized chatApi instance which includes:
 * - Automatic JWT Bearer token injection
 * - Token refresh on 401 errors
 * - Consistent error handling
 */
export const useApiService = () => {
  /**
   * POST request helper using axios
   */
  const post = useCallback(
    async <T>(url: string, data: unknown): Promise<T> => {
      try {
        const response = await chatApi.post<T>(url, data);
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
      const response = await chatApi.get<T>(url);
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
      const response = await chatApi.put<T>(url, data);
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
      const response = await chatApi.delete<T>(url);
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
  const handleApiError = useCallback(
    (error: unknown): { message: string; status?: number; code?: string } => {
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
          status,
          code: axiosError.code,
        };
      }

      if (error instanceof Error) {
        return {
          message: error.message,
        };
      }

      return {
        message: "An unexpected error occurred",
      };
    },
    []
  );

  /**
   * Legacy fetchApi method for backward compatibility
   * @deprecated Use post, get, put, or del methods instead
   */
  const fetchApi = useCallback(
    async <T>(url: string, options: RequestInit = {}): Promise<T> => {
      console.warn(
        "⚠️ fetchApi is deprecated. Use post, get, put, or del methods instead."
      );

      const method = options.method?.toUpperCase() || "GET";

      switch (method) {
        case "POST":
          return await post<T>(
            url,
            options.body ? JSON.parse(options.body as string) : undefined
          );
        case "PUT":
          return await put<T>(
            url,
            options.body ? JSON.parse(options.body as string) : undefined
          );
        case "DELETE":
          return await del<T>(url);
        case "GET":
        default:
          return await get<T>(url);
      }
    },
    [post, get, put, del]
  );

  return {
    // Primary methods (recommended)
    post,
    get,
    put,
    delete: del,
    handleApiError,

    // Legacy methods (for backward compatibility)
    fetchApi,
  };
};
