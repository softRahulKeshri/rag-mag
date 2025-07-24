import { useState, useCallback } from "react";

import type {
  PitchDetailsRequest,
  PitchDetailsResponse,
  PitchDetails,
} from "../types/types";

export const usePitchDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitchDetails, setPitchDetails] = useState<PitchDetails | null>(null);

  const fetchPitchDetails = useCallback(
    async (pitchId: string, userEmail: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: PitchDetailsRequest = {
          userEmail,
        };

        const response = await fetch(
          `https://api.magure.ai/api/v1/pitch/company-pitch/${pitchId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch pitch details: ${response.statusText}`
          );
        }

        const result: PitchDetailsResponse = await response.json();

        // Handle both direct response and wrapped response format
        const detailsData = result.data || result;
        setPitchDetails(detailsData);

        return detailsData;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch pitch details";
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshPitchDetails = useCallback(
    async (pitchId: string, userEmail: string) => {
      return await fetchPitchDetails(pitchId, userEmail);
    },
    [fetchPitchDetails]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPitchDetails = useCallback(() => {
    setPitchDetails(null);
  }, []);

  return {
    fetchPitchDetails,
    refreshPitchDetails,
    pitchDetails,
    isLoading,
    error,
    clearError,
    clearPitchDetails,
  };
};
