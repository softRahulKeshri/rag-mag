import { useState, useCallback } from "react";

import type {
  ChatWithAIRequest,
  ChatWithAIResponse,
  UseChatWithAIReturn,
} from "../types/types";

export const useChatWithAI = (): UseChatWithAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatWithAI = useCallback(
    async (pitchId: string, query: string, userEmail: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: ChatWithAIRequest = {
          query,
          userEmail,
        };

        const response = await fetch(
          `https://api.magure.ai/api/v1/pitch/company-pitch/${pitchId}/chat-with-ai`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to chat with AI: ${response.statusText}`);
        }

        const result: ChatWithAIResponse = await response.json();
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to chat with AI";
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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
