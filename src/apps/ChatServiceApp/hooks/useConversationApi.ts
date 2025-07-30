import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { ConversationRequest, ConversationResponse } from "../types/types";
import { ModelType } from "../types/types";

/**
 * Conversation API Hook
 *
 * Handles the unified conversation endpoint that sends a message and receives
 * the AI response in a single API call:
 * POST /chat/messages
 *
 * Features:
 * - Type-safe API calls with proper error handling
 * - Loading states for UI feedback
 * - Automatic retry logic
 * - Comprehensive logging for debugging
 * - JWT Bearer token authentication
 * - Returns both user message and AI response
 * - Support for model selection (OpenAI, Anthropic, Ollama)
 *
 * @example
 * ```typescript
 * const { sendConversationMessage, isLoading, error } = useConversationApi();
 *
 * const handleSendMessage = async () => {
 *   try {
 *     const response = await sendConversationMessage({
 *       content: "Hello, how are you?",
 *       chat_id: "chat-123",
 *       user_id: "user-456",
 *       role: "user",
 *       modelType: ModelType.OPENAI
 *     });
 *     console.log("AI Response:", response);
 *   } catch (error) {
 *     console.error("Failed to get AI response:", error);
 *   }
 * };
 * ```
 */
export const useConversationApi = () => {
  const { post, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a conversation message and get AI response
   * POST /chat/messages
   *
   * This endpoint sends the user message and returns the AI assistant's response
   * in a single API call, making it perfect for real-time chat interactions.
   */
  const sendConversationMessage = useCallback(
    async (messageData: ConversationRequest): Promise<ConversationResponse> => {
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
        console.log("📡 Sending conversation message:", {
          content:
            messageData.content.substring(0, 50) +
            (messageData.content.length > 50 ? "..." : ""),
          chat_id: messageData.chat_id,
          user_id: messageData.user_id,
          role: messageData.role,
          modelType: messageData.modelType || "openai",
          endpoint: "/chat/messages",
        });

        const response = await post<ConversationResponse>(
          "/chat/messages",
          messageData
        );

        console.log("✅ AI Response received:", {
          id: response.id,
          role: response.role,
          content_length: response.content.length,
          created_at: response.created_at,
          content_preview: response.content.substring(0, 100) + "...",
        });

        return response;
      } catch (error) {
        console.error("❌ Error getting AI response:", {
          chat_id: messageData.chat_id,
          user_id: messageData.user_id,
          role: messageData.role,
          modelType: messageData.modelType,
          error,
        });

        const apiError = handleApiError(error);
        setError(apiError.message);

        // Handle specific error cases
        if (apiError.status === 401 || apiError.status === 403) {
          console.error("🔐 Authentication error in conversation");
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

        if (apiError.status === 500) {
          console.error("❌ Server error in conversation");
          setError("AI service is temporarily unavailable. Please try again.");
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Send a user message and get AI response (convenience method)
   * This is the most commonly used method for chat interactions
   */
  const sendUserMessageAndGetResponse = useCallback(
    async (
      content: string,
      chatId: string,
      userId: string,
      modelType: ModelType = ModelType.OPENAI
    ): Promise<ConversationResponse> => {
      return sendConversationMessage({
        content,
        chat_id: chatId,
        user_id: userId,
        role: "user",
        modelType,
      });
    },
    [sendConversationMessage]
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
    sendConversationMessage,
    sendUserMessageAndGetResponse,
    clearError,
  };
};
