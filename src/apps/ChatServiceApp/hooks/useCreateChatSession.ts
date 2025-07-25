import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatSession } from "../services/chatSessionApi";
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
} from "../types/types";

/**
 * React Query Hook for Creating Chat Sessions
 *
 * This hook provides a mutation for creating new chat sessions with:
 * - Optimistic updates for better UX
 * - Proper error handling and retry logic
 * - Loading states for UI feedback
 * - Automatic cache invalidation
 * - Type-safe API calls
 *
 * @example
 * ```typescript
 * const { mutate: createSession, isPending, error } = useCreateChatSession();
 *
 * const handleNewChat = () => {
 *   createSession({
 *     title: "New Chat Session",
 *     user_id: "user-123"
 *   });
 * };
 * ```
 */
export const useCreateChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatSession,

    /**
     * Optimistic update - immediately update the UI before the server responds
     * This provides instant feedback to the user
     */
    onMutate: async (newSession: CreateChatSessionRequest) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["chatSessions"] });

      // Snapshot the previous value for rollback
      const previousSessions = queryClient.getQueryData<
        CreateChatSessionResponse[]
      >(["chatSessions"]);

      // Optimistically add the new session to the cache
      const optimisticSession: CreateChatSessionResponse = {
        id: `temp-${Date.now()}`, // Temporary ID for optimistic update
        title: newSession.title,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<CreateChatSessionResponse[]>(
        ["chatSessions"],
        (old = []) => [optimisticSession, ...old]
      );

      // Return context with the snapshotted value for rollback
      return { previousSessions };
    },

    /**
     * Handle successful mutation
     * Replace the optimistic session with the real one from the server
     */
    onSuccess: (data: CreateChatSessionResponse) => {
      console.log("✅ Chat session created successfully:", data);

      // Update the cache with the real session data
      queryClient.setQueryData<CreateChatSessionResponse[]>(
        ["chatSessions"],
        (old = []) => {
          if (!old) return [data];

          // Replace the optimistic session with the real one
          return old.map((session) =>
            session.id.startsWith("temp-") ? data : session
          );
        }
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },

    /**
     * Handle mutation errors
     * Rollback to the previous state if the mutation fails
     */
    onError: (error: Error, _variables: CreateChatSessionRequest, context) => {
      console.error("❌ Failed to create chat session:", error);

      // Rollback to the previous state
      if (context?.previousSessions) {
        queryClient.setQueryData(["chatSessions"], context.previousSessions);
      }

      // Show error notification (you can integrate with your notification system)
      console.error("Chat session creation failed:", error.message);
    },

    /**
     * Always execute after mutation (success or error)
     * Clean up any temporary state
     */
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });
};

/**
 * Enhanced hook with additional utilities for chat session management
 *
 * Provides additional helper functions and better error handling
 */
export const useCreateChatSessionEnhanced = () => {
  const mutation = useCreateChatSession();

  /**
   * Create a new chat session with enhanced error handling
   */
  const createSession = async (
    title: string,
    userId: string,
    onSuccess?: (session: CreateChatSessionResponse) => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const result = await mutation.mutateAsync({
        title,
        user_id: userId,
      });

      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create chat session";
      const errorObj = new Error(errorMessage);

      onError?.(errorObj);
      throw errorObj;
    }
  };

  /**
   * Create a new chat session with a default title
   */
  const createDefaultSession = async (
    userId: string,
    onSuccess?: (session: CreateChatSessionResponse) => void,
    onError?: (error: Error) => void
  ) => {
    const defaultTitle = `New Chat ${new Date().toLocaleTimeString()}`;
    return createSession(defaultTitle, userId, onSuccess, onError);
  };

  return {
    ...mutation,
    createSession,
    createDefaultSession,
  };
};
