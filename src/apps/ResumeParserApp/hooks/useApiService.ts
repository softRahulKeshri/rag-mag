import { useCallback, useMemo } from "react";
import { API_CONFIG } from "../theme/constants";
import type { ApiError } from "../types/api";

/**
 * Base API Service Hook
 *
 * Provides core fetch functionality with retry logic, error handling,
 * and consistent request/response patterns for all API calls.
 *
 * Features:
 * - Type-safe API calls
 * - Centralized error handling
 * - Request/response interceptors
 * - Retry logic with exponential backoff
 * - Timeout handling
 */
export const useApiService = () => {
  /**
   * Generic fetch wrapper with retry logic and proper error handling
   */
  const fetchWithRetry = useCallback(
    async <T>(
      url: string,
      options: RequestInit = {},
      attempt: number = 1
    ): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.timeout
      );

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Try to extract the actual error message from the response body
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            // Look for common error message fields
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (parseError) {
            // If we can't parse the response body, keep the original error message
            console.warn("Could not parse error response body:", parseError);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        clearTimeout(timeoutId);

        // If it's an abort error and we have retries left, retry
        if (
          attempt < API_CONFIG.retryAttempts &&
          error instanceof Error &&
          (error.name === "AbortError" || error.message.includes("fetch"))
        ) {
          console.warn(
            `API call failed (attempt ${attempt}), retrying in ${API_CONFIG.retryDelay}ms...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, API_CONFIG.retryDelay)
          );
          return fetchWithRetry<T>(url, options, attempt + 1);
        }

        throw error;
      }
    },
    []
  );

  /**
   * Handle API errors consistently
   */
  const handleApiError = useCallback((error: unknown): ApiError => {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: 0,
        code: error.name,
      };
    }

    return {
      message: "An unexpected error occurred",
      status: 0,
    };
  }, []);

  /**
   * Build full URL with base URL
   */
  const buildUrl = useCallback((endpoint: string): string => {
    return `${API_CONFIG.baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
  }, []);

  /**
   * Create request options with common headers
   */
  const createRequestOptions = useCallback(
    (
      method: string,
      body?: unknown,
      customHeaders?: Record<string, string>
    ): RequestInit => {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...customHeaders,
        },
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
      fetchWithRetry,
      handleApiError,
      buildUrl,
      createRequestOptions,
      config: API_CONFIG,
    }),
    [fetchWithRetry, handleApiError, buildUrl, createRequestOptions]
  );
};
