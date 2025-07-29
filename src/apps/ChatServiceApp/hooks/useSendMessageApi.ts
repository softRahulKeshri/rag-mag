import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { SendMessageRequest, SendMessageResponse } from "../types/types";

/**
 * Send Message API Hook
 *
 * Handles sending messages to chat sessions using the endpoint:
 * POST /chat/messages
 *
 * Features:
 * - Type-safe API calls with proper error handling
 * - Loading states for UI feedback
 * - Automatic retry logic
 * - Comprehensive logging for debugging
 * - JWT Bearer token authentication
 * - Real-time message sending
 *
 * @example
 * ```typescript
 * const { sendUserMessage, isLoading, error } = useSendMessageApi();
 *
 * const handleSendMessage = async () => {
 *   try {
 *     const response = await sendUserMessage(
 *       "Hello, how are you?",
 *       "chat-123",
 *       "user-456"
 *     );
 *     console.log("Message sent:", response);
 *   } catch (error) {
 *     console.error("Failed to send message:", error);
 *   }
 * };
 * ```
 */
export const useSendMessageApi = () => {
  const { post, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message to a chat session
   * POST /chat/messages
   */
  const sendMessage = useCallback(
    async (messageData: SendMessageRequest): Promise<SendMessageResponse> => {
      // Validate required fields
      if (!messageData.content?.trim()) {
        const errorMessage = "Message content is required";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!messageData.chat_id?.trim()) {
        const errorMessage = "Chat ID is required";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!messageData.user_id?.trim()) {
        const errorMessage = "User ID is required";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (
        !messageData.role ||
        !["user", "assistant"].includes(messageData.role)
      ) {
        const errorMessage = "Role must be 'user' or 'assistant'";
        console.error("❌ Validation error:", errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("📡 Sending message:", {
          content:
            messageData.content.substring(0, 50) +
            (messageData.content.length > 50 ? "..." : ""),
          chat_id: messageData.chat_id,
          user_id: messageData.user_id,
          role: messageData.role,
          endpoint: "/chat/messages",
        });

        const response = await post<SendMessageResponse>(
          "/chat/messages",
          messageData
        );

        console.log("✅ Message sent successfully:", {
          id: response.id,
          role: response.role,
          content_length: response.content.length,
          created_at: response.created_at,
        });

        return response;
      } catch (error) {
        console.error("❌ Error sending message:", {
          chat_id: messageData.chat_id,
          user_id: messageData.user_id,
          role: messageData.role,
          error,
        });

        const apiError = handleApiError(error);
        setError(apiError.message);

        // Handle specific error cases
        if (apiError.status === 401 || apiError.status === 403) {
          console.error("🔐 Authentication error sending message");
          setError("Authentication failed. Please login again.");
        }

        if (apiError.status === 404) {
          console.error("❌ Chat session not found");
          setError("Chat session not found. Please check the chat ID.");
        }

        if (apiError.status === 400) {
          console.error("❌ Invalid request data");
          setError("Invalid message data. Please check your input.");
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Send a user message (convenience method)
   */
  const sendUserMessage = useCallback(
    async (
      content: string,
      chatId: string,
      userId: string
    ): Promise<SendMessageResponse> => {
      return sendMessage({
        content,
        chat_id: chatId,
        user_id: userId,
        role: "user",
      });
    },
    [sendMessage]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    sendMessage,
    sendUserMessage,
    clearError,
  };
};
