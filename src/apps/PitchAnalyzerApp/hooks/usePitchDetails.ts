import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type { PitchDetailsResponse, PitchDetails } from "../types/types";

export const usePitchDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitchDetails, setPitchDetails] = useState<PitchDetails | null>(null);

  const fetchPitchDetails = useCallback(async (pitchId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await pitchApi.post(
        `/pitch/company-pitch/${pitchId}`,
        {}
      );

      const result: PitchDetailsResponse = response.data;

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
  }, []);

  const refreshPitchDetails = useCallback(
    async (pitchId: string) => {
      return await fetchPitchDetails(pitchId);
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
