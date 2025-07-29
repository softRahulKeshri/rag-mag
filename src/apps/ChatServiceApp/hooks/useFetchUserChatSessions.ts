import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { CreateChatSessionResponse } from "../types/types";

/**
 * Fetch User Chat Sessions API Hook
 *
 * Handles fetching all chat sessions for a specific user using the endpoint:
 * GET /chat/chat_sessions/{user_id}
 *
 * Example: GET /chat/chat_sessions/12345 (where 12345 is the user ID)
 *
 * Features:
 * - Type-safe API calls with proper error handling
 * - Loading states for UI feedback
 * - Automatic retry logic
 * - Comprehensive logging for debugging
 * - JWT Bearer token authentication
 *
 * @example
 * ```typescript
 * const { fetchUserChatSessions, isLoading, error, sessions } = useFetchUserChatSessions();
 *
 * const handleFetchSessions = async () => {
 *   try {
 *     const userSessions = await fetchUserChatSessions('user-123');
 *     console.log('User sessions:', userSessions);
 *   } catch (error) {
 *     console.error('Failed to fetch sessions:', error);
 *   }
 * };
 * ```
 */
export const useFetchUserChatSessions = () => {
  const { get, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<CreateChatSessionResponse[]>([]);

  /**
   * Fetch all chat sessions for a specific user
   * GET /chat/chat_sessions/{user_id}
   * Example: GET /chat/chat_sessions/12345
   */
  const fetchUserChatSessions = useCallback(
    async (userId: string): Promise<CreateChatSessionResponse[]> => {
      if (!userId || userId.trim() === "") {
        const errorMessage = "User ID is required to fetch chat sessions";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("📡 Fetching user chat sessions:", {
          userId,
          endpoint: `/chat/chat_sessions/${userId}`,
        });

        const response = await get<CreateChatSessionResponse[]>(
          `/chat/chat_sessions/${userId}`
        );

        // Transform response if needed and update state
        const transformedSessions = Array.isArray(response) ? response : [];
        setSessions(transformedSessions);

        console.log("✅ User chat sessions fetched successfully:", {
          userId,
          count: transformedSessions.length,
          sessions: transformedSessions.map((session) => ({
            id: session.id,
            title: session.title,
            created_at: session.created_at,
          })),
        });

        return transformedSessions;
      } catch (error) {
        console.error("❌ Error fetching user chat sessions:", {
          userId,
          error,
        });

        const apiError = handleApiError(error);
        setError(apiError.message);

        // Handle specific error cases
        if (apiError.status === 404) {
          console.log("ℹ️ No chat sessions found for user:", userId);
          setSessions([]);
          return [];
        }

        if (apiError.status === 401 || apiError.status === 403) {
          console.error("🔐 Authentication error fetching chat sessions");
          setError("Authentication failed. Please login again.");
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [get, handleApiError]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear sessions data
   */
  const clearSessions = useCallback(() => {
    setSessions([]);
  }, []);

  /**
   * Refresh sessions for a user
   */
  const refreshSessions = useCallback(
    async (userId: string): Promise<CreateChatSessionResponse[]> => {
      console.log("🔄 Refreshing chat sessions for user:", userId);
      return fetchUserChatSessions(userId);
    },
    [fetchUserChatSessions]
  );

  /**
   * Get sessions sorted by creation date (newest first)
   */
  const getSortedSessions = useCallback(() => {
    return [...sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [sessions]);

  /**
   * Get sessions filtered by title (case-insensitive search)
   */
  const getSessionsByTitle = useCallback(
    (searchTerm: string): CreateChatSessionResponse[] => {
      if (!searchTerm.trim()) return sessions;

      const term = searchTerm.toLowerCase().trim();
      return sessions.filter((session) =>
        session.title.toLowerCase().includes(term)
      );
    },
    [sessions]
  );

  /**
   * Get session by ID
   */
  const getSessionById = useCallback(
    (sessionId: string): CreateChatSessionResponse | null => {
      return sessions.find((session) => session.id === sessionId) || null;
    },
    [sessions]
  );

  /**
   * Get total number of sessions
   */
  const getTotalSessions = useCallback(() => {
    return sessions.length;
  }, [sessions]);

  return {
    // State
    isLoading,
    error,
    sessions,

    // Actions
    fetchUserChatSessions,
    clearError,
    clearSessions,
    refreshSessions,

    // Utilities
    getSortedSessions,
    getSessionsByTitle,
    getSessionById,
    getTotalSessions,
  };
};
