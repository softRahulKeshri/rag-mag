import { useCallback } from "react";

/**
 * Simple API Service Hook for ChatServiceApp
 *
 * Provides basic fetch functionality with error handling for API calls
 */
export const useApiService = () => {
  /**
   * Generic fetch wrapper with error handling
   */
  const fetchApi = useCallback(
    async <T>(url: string, options: RequestInit = {}): Promise<T> => {
      try {
        // Prepare headers
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        
        // Add any custom headers
        if (options.headers) {
          Object.assign(headers, options.headers);
        }

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          // Try to extract error message from response
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (parseError) {
            console.warn("Could not parse error response body:", parseError);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
    },
    []
  );

  /**
   * POST request helper
   */
  const post = useCallback(
    async <T>(url: string, data: unknown): Promise<T> => {
      return fetchApi<T>(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    [fetchApi]
  );

  /**
   * GET request helper
   */
  const get = useCallback(
    async <T>(url: string): Promise<T> => {
      return fetchApi<T>(url, {
        method: "GET",
      });
    },
    [fetchApi]
  );

  /**
   * Handle API errors consistently
   */
  const handleApiError = useCallback(
    (error: unknown): { message: string; status?: number } => {
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

  return {
    fetchApi,
    post,
    get,
    handleApiError,
  };
};
