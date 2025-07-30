import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type { Pitch } from "../types/types";

// Define the API response interface
interface ApiPitchResponse {
  pitch_id: string;
  file_name: string;
  file_path: string;
}

export const useCompanyPitches = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);

  const fetchCompanyPitches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the new API endpoint for fetching all pitches
      const response = await pitchApi.get("/all-pitches");

      // Handle the response format from the new API
      const result = response.data;

      // Transform the API response to match our Pitch interface
      const transformedPitches: Pitch[] = Array.isArray(result)
        ? result.map((pitch: ApiPitchResponse) => ({
            id: pitch.pitch_id,
            filename: pitch.file_name,
            file_url: pitch.file_path,
            title: pitch.file_name, // Use filename as title if no title available
            created_at: new Date().toISOString(), // Use current date as fallback
            description: null,
            sector_category: "Unknown", // Default sector
            is_bookmarked: false, // Default bookmark state
            tagsinfo: {}, // Empty tags info
          }))
        : [];

      setPitches(transformedPitches);

      return transformedPitches;
    } catch (error) {
      // Show user-friendly error messages instead of technical details
      let userFriendlyMessage = "Something went wrong while loading pitches";

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          userFriendlyMessage = "No pitches found at the moment";
        } else if (error.message.includes("500")) {
          userFriendlyMessage =
            "Server is temporarily unavailable. Please try again later";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          userFriendlyMessage =
            "Unable to connect to the server. Please check your internet connection";
        } else if (error.message.includes("timeout")) {
          userFriendlyMessage = "Request timed out. Please try again";
        }
      }

      setError(userFriendlyMessage);

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPitches = useCallback(async () => {
    return await fetchCompanyPitches();
  }, [fetchCompanyPitches]);

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
