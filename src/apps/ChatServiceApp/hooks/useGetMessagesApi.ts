import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { GetMessagesResponse } from "../types/types";

/**
 * Get Messages API Hook
 *
 * Handles fetching messages from a chat session using the endpoint:
 * GET /chat/messages/{chat_id}
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
 * const { getMessages, isLoading, error, messages } = useGetMessagesApi();
 *
 * const handleFetchMessages = async () => {
 *   try {
 *     const chatMessages = await getMessages("chat-123");
 *     console.log("Messages:", chatMessages);
 *   } catch (error) {
 *     console.error("Failed to fetch messages:", error);
 *   }
 * };
 * ```
 */
export const useGetMessagesApi = () => {
  const { get, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<GetMessagesResponse[]>([]);

  /**
   * Fetch messages from a chat session
   * GET /chat/messages/{chat_id}
   */
  const getMessages = useCallback(
    async (chatId: string): Promise<GetMessagesResponse[]> => {
      if (!chatId || chatId.trim() === "") {
        const errorMessage = "Chat ID is required to fetch messages";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("📡 Fetching messages for chat:", {
          chatId,
          endpoint: `/chat/messages/${chatId}`,
        });

        const response = await get<GetMessagesResponse[]>(
          `/chat/messages/${chatId}`
        );

        // Transform response if needed and update state
        const transformedMessages = Array.isArray(response) ? response : [];
        setMessages(transformedMessages);

        console.log("✅ Messages fetched successfully:", {
          chatId,
          count: transformedMessages.length,
          messages: transformedMessages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content_length: msg.content.length,
            created_at: msg.created_at,
          })),
        });

        return transformedMessages;
      } catch (error) {
        console.error("❌ Error fetching messages:", {
          chatId,
          error,
        });

        const apiError = handleApiError(error);
        setError(apiError.message);

        // Handle specific error cases
        if (apiError.status === 404) {
          console.log("ℹ️ No messages found for chat:", chatId);
          setMessages([]);
          return [];
        }

        if (apiError.status === 401 || apiError.status === 403) {
          console.error("🔐 Authentication error fetching messages");
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
   * Clear messages data
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Refresh messages for a chat
   */
  const refreshMessages = useCallback(
    async (chatId: string): Promise<GetMessagesResponse[]> => {
      console.log("🔄 Refreshing messages for chat:", chatId);
      return getMessages(chatId);
    },
    [getMessages]
  );

  /**
   * Get messages sorted by creation date (oldest first for chat display)
   */
  const getSortedMessages = useCallback(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messages]);

  /**
   * Get messages sorted by creation date (newest first)
   */
  const getSortedMessagesDesc = useCallback(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [messages]);

  /**
   * Get messages by role
   */
  const getMessagesByRole = useCallback(
    (role: "user" | "assistant"): GetMessagesResponse[] => {
      return messages.filter((message) => message.role === role);
    },
    [messages]
  );

  /**
   * Get total number of messages
   */
  const getTotalMessages = useCallback(() => {
    return messages.length;
  }, [messages]);

  /**
   * Get the last message in the chat
   */
  const getLastMessage = useCallback(() => {
    if (messages.length === 0) return null;
    return getSortedMessagesDesc()[0];
  }, [messages, getSortedMessagesDesc]);

  return {
    // State
    isLoading,
    error,
    messages,

    // Actions
    getMessages,
    clearError,
    clearMessages,
    refreshMessages,

    // Utilities
    getSortedMessages,
    getSortedMessagesDesc,
    getMessagesByRole,
    getTotalMessages,
    getLastMessage,
  };
};
