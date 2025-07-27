import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

// Types for the new API
interface QueryPitchRequest {
  pitch_id: string;
  question: string;
}

interface QueryPitchResponse {
  answer: string;
}

import type { ChatWithAIResponse, UseChatWithAIReturn } from "../types/types";

export const useChatWithAI = (): UseChatWithAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatWithAI = useCallback(
    async (pitchId: string, query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: QueryPitchRequest = {
          pitch_id: pitchId,
          question: query,
        };

        const response = await pitchApi.post<QueryPitchResponse>(
          "/query-pitch",
          payload
        );

        const result = response.data;

        // Transform the response to match the expected format
        const transformedResponse: ChatWithAIResponse = {
          queryRespFromAi: result.answer,
          userQuery: query,
        };

        return transformedResponse;
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
