import { useState, useCallback } from "react";

import type {
  CompanyPitchesRequest,
  CompanyPitchesResponse,
  Pitch,
} from "../types/types";

export const useCompanyPitches = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);

  const fetchCompanyPitches = useCallback(
    async (userEmail: string, filterBy: string[] = []) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: CompanyPitchesRequest = {
          userEmail,
          filterBy,
        };

        const response = await fetch(
          "https://api.magure.ai/api/v1/pitch/company-pitches",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch pitches: ${response.statusText}`);
        }

        const result: CompanyPitchesResponse = await response.json();

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
    async (userEmail: string, filterBy: string[] = []) => {
      return await fetchCompanyPitches(userEmail, filterBy);
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
