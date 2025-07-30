import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type { ChatWithAIResponse } from "../types/types";

export const useChatWithAI = (): UseChatWithAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatWithAI = useCallback(async (pitchId: string, query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        pitch_id: pitchId,
        question: query,
      };

      const response = await pitchApi.post("/query-pitch", payload);
      console.log("Chat API Response:", response.data);
      const result: ChatWithAIResponse = response.data;

      return result;
    } catch (error) {
      // Show user-friendly error messages instead of technical details
      let userFriendlyMessage =
        "Something went wrong while getting AI response";

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          userFriendlyMessage =
            "Pitch not found. It may have been removed or is not available for chat";
        } else if (error.message.includes("500")) {
          userFriendlyMessage =
            "AI service is temporarily unavailable. Please try again later";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          userFriendlyMessage =
            "Unable to connect to the AI service. Please check your internet connection";
        } else if (error.message.includes("timeout")) {
          userFriendlyMessage = "AI response timed out. Please try again";
        }
      }

      setError(userFriendlyMessage);

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chatWithAI,
    isLoading,
    error,
    clearError,
  };
};

interface UseChatWithAIReturn {
  chatWithAI: (pitchId: string, query: string) => Promise<ChatWithAIResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}
