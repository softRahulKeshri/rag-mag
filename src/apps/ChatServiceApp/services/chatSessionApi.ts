import { chatApi } from "../../../lib/axios";
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
} from "../types/types";
import type { AxiosError } from "axios";

// Type for axios error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
}

/**
 * Real Chat Session API Service
 *
 * Provides real API operations for chat session management.
 * Uses JWT Bearer token authentication via the chatApi instance.
 */

/**
 * Fetch all chat sessions for a user
 *
 * @param userId - The user ID to fetch sessions for
 * @returns Promise<CreateChatSessionResponse[]>
 *
 * @example
 * ```typescript
 * const sessions = await getChatSessions('user-123');
 * console.log('User sessions:', sessions);
 * ```
 */
export const getChatSessions = async (
  userId: string
): Promise<CreateChatSessionResponse[]> => {
  try {
    console.log("📡 Fetching chat sessions for user:", userId);

    const response = await chatApi.get<CreateChatSessionResponse[]>(
      `/chat/chat_sessions/${userId}`
    );

    console.log("✅ Chat sessions fetched successfully:", {
      count: response.data.length,
      sessions: response.data.map((s) => ({ id: s.id, title: s.title })),
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching chat sessions:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;

      if (status === 404) {
        // No sessions found - return empty array
        console.log("ℹ️ No chat sessions found for user");
        return [];
      }

      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to fetch chat sessions"
      );
    }

    throw new Error("Failed to fetch chat sessions: Unknown error");
  }
};

/**
 * Update a chat session
 *
 * @param sessionId - The session ID to update
 * @param updates - The updates to apply
 * @returns Promise<CreateChatSessionResponse>
 */
export const updateChatSession = async (
  sessionId: string,
  updates: Partial<CreateChatSessionRequest>
): Promise<CreateChatSessionResponse> => {
  try {
    console.log("📡 Updating chat session:", { sessionId, updates });

    const response = await chatApi.put<CreateChatSessionResponse>(
      `/chat/chat_sessions/${sessionId}`,
      updates
    );

    console.log("✅ Chat session updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating chat session:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to update chat session"
      );
    }

    throw new Error("Failed to update chat session: Unknown error");
  }
};

/**
 * Delete a chat session
 *
 * @param sessionId - The session ID to delete
 * @returns Promise<void>
 */
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  try {
    console.log("📡 Deleting chat session:", sessionId);

    await chatApi.delete(`/chat/chat_sessions/${sessionId}`);

    console.log("✅ Chat session deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting chat session:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to delete chat session"
      );
    }

    throw new Error("Failed to delete chat session: Unknown error");
  }
};
