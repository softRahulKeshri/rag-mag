import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type { CompanyPitchesResponse, Pitch } from "../types/types";

export const useCompanyPitches = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);

  const fetchCompanyPitches = useCallback(
    async (filterBy: string[] = [], showOnlyBookmarked: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          filterBy,
          show_only_bookmarked: showOnlyBookmarked,
        };

        const response = await pitchApi.post("/pitch/company-pitches", payload);

        const result: CompanyPitchesResponse = response.data;

        // Handle both array response and wrapped response format
        const pitchesData = Array.isArray(result) ? result : result.data || [];
        setPitches(pitchesData);

        return pitchesData;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch pitches";
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshPitches = useCallback(
    async (filterBy: string[] = [], showOnlyBookmarked: boolean = false) => {
      return await fetchCompanyPitches(filterBy, showOnlyBookmarked);
    },
    [fetchCompanyPitches]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPitches = useCallback(() => {
    setPitches([]);
  }, []);

  return {
    fetchCompanyPitches,
    refreshPitches,
    pitches,
    isLoading,
    error,
    clearError,
    clearPitches,
  };
};
