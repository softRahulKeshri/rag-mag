import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { GetMessagesResponse } from "../types/types";

/**
 * Fetch Chat Messages API Hook
 *
 * Handles fetching all messages from a specific chat session using the endpoint:
 * GET /chat/messages/{chat_id}
 *
 * Features:
 * - Type-safe API calls with proper error handling
 * - Loading states for UI feedback
 * - Automatic retry logic
 * - Comprehensive logging for debugging
 * - JWT Bearer token authentication
 * - Message sorting and filtering utilities
 * - Real-time message refresh capabilities
 *
 * @example
 * ```typescript
 * const { fetchMessages, isLoading, error, messages } = useFetchChatMessages();
 *
 * const handleFetchMessages = async () => {
 *   try {
 *     const chatMessages = await fetchMessages("5dd33215-2693-4582-8fb0-1bcd136fa94f");
 *     console.log("Messages:", chatMessages);
 *   } catch (error) {
 *     console.error("Failed to fetch messages:", error);
 *   }
 * };
 * ```
 */
export const useFetchChatMessages = () => {
  const { get, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<GetMessagesResponse[]>([]);

    /**
   * Fetch all messages from a specific chat session
   * GET /chat/messages/{chat_id}
   * 
   * @param chatId - The unique identifier of the chat session
   * @returns Promise<GetMessagesResponse[]> - Array of messages for the chat
   */
  const fetchMessages = useCallback(
    async (chatId: string): Promise<GetMessagesResponse[]> => {
      // Input validation
      if (!chatId || chatId.trim() === "") {
        const errorMessage = "Chat ID is required to fetch messages";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Validate UUID format (basic check)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(chatId)) {
        const errorMessage = "Invalid Chat ID format. Expected UUID format.";
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

        // Handle specific error cases with detailed logging
        if (apiError.status === 404) {
          console.log("ℹ️ No messages found for chat:", chatId);
          setMessages([]);
          return [];
        }

        if (apiError.status === 401 || apiError.status === 403) {
          console.error("🔐 Authentication error fetching messages");
          setError("Authentication failed. Please login again.");
        }

        if (apiError.status === 400) {
          console.error("❌ Bad request - invalid chat ID format");
          setError("Invalid chat ID format. Please check the chat ID.");
        }

        if (apiError.status === 500) {
          console.error("🔥 Server error while fetching messages");
          setError("Server error. Please try again later.");
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
   * Refresh messages for a chat (alias for fetchMessages)
   */
  const refreshMessages = useCallback(
    async (chatId: string): Promise<GetMessagesResponse[]> => {
      console.log("🔄 Refreshing messages for chat:", chatId);
      return fetchMessages(chatId);
    },
    [fetchMessages]
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
   * Get messages by role (user or assistant)
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

  /**
   * Get messages within a specific time range
   */
  const getMessagesInTimeRange = useCallback(
    (startDate: Date, endDate: Date): GetMessagesResponse[] => {
      return messages.filter((message) => {
        const messageDate = new Date(message.created_at);
        return messageDate >= startDate && messageDate <= endDate;
      });
    },
    [messages]
  );

  /**
   * Search messages by content
   */
  const searchMessages = useCallback(
    (searchTerm: string): GetMessagesResponse[] => {
      if (!searchTerm.trim()) return messages;

      const term = searchTerm.toLowerCase();
      return messages.filter((message) =>
        message.content.toLowerCase().includes(term)
      );
    },
    [messages]
  );

  /**
   * Get messages count by role
   */
  const getMessageCountByRole = useCallback(() => {
    const userMessages = getMessagesByRole("user");
    const assistantMessages = getMessagesByRole("assistant");

    return {
      user: userMessages.length,
      assistant: assistantMessages.length,
      total: messages.length,
    };
  }, [messages, getMessagesByRole]);

  return {
    // State
    isLoading,
    error,
    messages,

    // Primary Actions
    fetchMessages,
    refreshMessages,
    clearError,
    clearMessages,

    // Message Utilities
    getSortedMessages,
    getSortedMessagesDesc,
    getMessagesByRole,
    getTotalMessages,
    getLastMessage,
    getMessagesInTimeRange,
    searchMessages,
    getMessageCountByRole,
  };
};
