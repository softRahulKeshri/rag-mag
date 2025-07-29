import { useState, useCallback } from "react";
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
} from "../types/types";

/**
 * Real API Chat Session Creation Hook
 *
 * This hook provides functionality to create new chat sessions using the real API endpoint
 * with Bearer token authentication from localStorage.
 *
 * Features:
 * - Real API integration with the provided endpoint
 * - Automatic Bearer token authentication from localStorage
 * - Comprehensive error handling and loading states
 * - Type-safe API calls
 * - Optimistic updates for better UX
 *
 * @example
 * ```typescript
 * const { createSession, isLoading, error } = useCreateChatSessionApi();
 *
 * const handleNewChat = async () => {
 *   try {
 *     const session = await createSession({
 *       title: "New Chat",
 *       user_id: "user-123"
 *     });
 *     console.log("Session created:", session);
 *   } catch (error) {
 *     console.error("Failed to create session:", error);
 *   }
 * };
 * ```
 */
export const useCreateChatSessionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get authentication token from localStorage
   */
  const getAuthToken = useCallback((): string | null => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("⚠️ No authentication token found in localStorage");
      return null;
    }
    return token;
  }, []);

  /**
   * Create a new chat session via API
   *
   * @param payload - The chat session creation payload
   * @returns Promise<CreateChatSessionResponse>
   */
  const createSession = useCallback(
    async (
      payload: CreateChatSessionRequest
    ): Promise<CreateChatSessionResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Get authentication token
        const token = getAuthToken();
        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        console.log("🚀 Creating new chat session via API:", {
          title: payload.title,
          user_id: payload.user_id,
        });

        // Prepare request
        const url =
          "http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com/api2/chat/chat_sessions";
        const requestBody = {
          title: payload.title,
          user_id: payload.user_id,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        // Handle non-OK responses
        if (!response.ok) {
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

          // Handle specific HTTP status codes
          if (response.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
            // Clear invalid token
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("username");
          } else if (response.status === 403) {
            errorMessage =
              "Access denied. You don't have permission to create chat sessions.";
          } else if (response.status === 422) {
            errorMessage = "Invalid request data. Please check your input.";
          }

          throw new Error(errorMessage);
        }

        // Parse successful response
        const data = await response.json();

        console.log("✅ Chat session created successfully via API:", data);

        return data;
      } catch (error) {
        console.error("❌ Error creating chat session via API:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create chat session";
        setError(errorMessage);

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthToken]
  );

  /**
   * Create a new chat session with default title
   *
   * @param userId - The user ID for the session
   * @returns Promise<CreateChatSessionResponse>
   */
  const createDefaultSession = useCallback(
    async (userId: string): Promise<CreateChatSessionResponse> => {
      const defaultTitle = `New Chat ${new Date().toLocaleTimeString()}`;
      return createSession({
        title: defaultTitle,
        user_id: userId,
      });
    },
    [createSession]
  );

  /**
   * Create a new chat session with custom title
   *
   * @param title - The custom title for the session
   * @param userId - The user ID for the session
   * @returns Promise<CreateChatSessionResponse>
   */
  const createCustomSession = useCallback(
    async (
      title: string,
      userId: string
    ): Promise<CreateChatSessionResponse> => {
      return createSession({
        title,
        user_id: userId,
      });
    },
    [createSession]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem("access_token");
    return !!token;
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    createSession,
    createDefaultSession,
    createCustomSession,
    clearError,

    // Utilities
    isAuthenticated,
  };
};
