import { useQuery } from "@tanstack/react-query";
import { getChatSessions } from "../services/chatSessionApi";

/**
 * React Query Hook for Fetching Chat Sessions
 *
 * This hook provides a query for fetching chat sessions with:
 * - Automatic caching and background refetching
 * - Proper error handling and retry logic
 * - Loading states for UI feedback
 * - Type-safe API calls
 * - Stale-while-revalidate caching strategy
 *
 * @example
 * ```typescript
 * const { data: sessions, isLoading, error } = useChatSessions('user-123');
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {sessions?.map(session => (
 *       <div key={session.id}>{session.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useChatSessions = (userId: string) => {
  return useQuery({
    queryKey: ["chatSessions", userId],
    queryFn: () => getChatSessions(userId),

    // Only fetch if userId is provided
    enabled: !!userId,

    // Cache configuration
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes("4")) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Enhanced hook with additional utilities for chat session management
 *
 * Provides additional helper functions and better data transformation
 */
export const useChatSessionsEnhanced = (userId: string) => {
  const query = useChatSessions(userId);

  /**
   * Get the most recent chat session
   */
  const getMostRecentSession = () => {
    if (!query.data || !Array.isArray(query.data) || query.data.length === 0)
      return null;

    return query.data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  };

  /**
   * Get sessions sorted by creation date (newest first)
   */
  const getSortedSessions = () => {
    if (!query.data || !Array.isArray(query.data)) return [];

    return query.data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  /**
   * Get sessions filtered by title (case-insensitive search)
   */
  const getSessionsByTitle = (searchTerm: string) => {
    if (!query.data || !Array.isArray(query.data) || !searchTerm.trim())
      return query.data || [];

    const term = searchTerm.toLowerCase().trim();
    return query.data.filter((session) =>
      session.title.toLowerCase().includes(term)
    );
  };

  /**
   * Get session by ID
   */
  const getSessionById = (sessionId: string) => {
    if (!query.data || !Array.isArray(query.data)) return null;

    return query.data.find((session) => session.id === sessionId) || null;
  };

  /**
   * Get total number of sessions
   */
  const getTotalSessions = () => {
    return Array.isArray(query.data) ? query.data.length : 0;
  };

  return {
    ...query,
    getMostRecentSession,
    getSortedSessions,
    getSessionsByTitle,
    getSessionById,
    getTotalSessions,
  };
};
