import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
} from "../types/types";

/**
 * Real API Chat Session Creation Hook
 *
 * This hook provides functionality to create new chat sessions using the real API endpoint
 * with JWT Bearer token authentication.
 *
 * Features:
 * - Real API integration with automatic JWT authentication
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
  const { post, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Create a new chat session using the real API
   * POST /chat/chat_sessions
   */
  const createSession = useCallback(
    async (
      payload: CreateChatSessionRequest
    ): Promise<CreateChatSessionResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🚀 Creating new chat session via API:", {
          title: payload.title,
          user_id: payload.user_id,
        });

        const requestBody = {
          title: payload.title,
          user_id: payload.user_id,
        };

        const response = await post<CreateChatSessionResponse>(
          "/chat/chat_sessions",
          requestBody
        );

        console.log("✅ Chat session created successfully:", {
          id: response.id,
          title: response.title,
          created_at: response.created_at,
        });

        return response;
      } catch (error) {
        console.error("❌ Error creating chat session:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Create a chat session with default title
   * Uses the current timestamp as the default title
   */
  const createDefaultSession = useCallback(
    async (userId: string): Promise<CreateChatSessionResponse> => {
      const defaultTitle = `Chat ${new Date().toLocaleString()}`;
      return createSession({
        title: defaultTitle,
        user_id: userId,
      });
    },
    [createSession]
  );

  /**
   * Create a chat session with custom title
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
   * Batch create multiple chat sessions
   * Useful for initializing multiple conversations
   */
  const createMultipleSessions = useCallback(
    async (
      sessions: CreateChatSessionRequest[]
    ): Promise<CreateChatSessionResponse[]> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`🚀 Creating ${sessions.length} chat sessions...`);

        const results = await Promise.allSettled(
          sessions.map((session) => createSession(session))
        );

        const successful: CreateChatSessionResponse[] = [];
        const failed: string[] = [];

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            successful.push(result.value);
          } else {
            failed.push(
              `Session ${index + 1}: ${
                result.reason?.message || "Unknown error"
              }`
            );
          }
        });

        if (failed.length > 0) {
          console.warn("⚠️ Some sessions failed to create:", failed);
          setError(`${failed.length} sessions failed to create`);
        }

        console.log(`✅ Successfully created ${successful.length} sessions`);
        return successful;
      } catch (error) {
        console.error("❌ Error in batch session creation:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [createSession, handleApiError]
  );

  return {
    // State
    isLoading,
    error,

    // Actions
    createSession,
    createDefaultSession,
    createCustomSession,
    createMultipleSessions,
    clearError,
  };
};
