import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type { PitchDetails, PitchDetailsRequest } from "../types/types";

export const usePitchDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitchDetails, setPitchDetails] = useState<PitchDetails | null>(null);

  const fetchPitchDetails = useCallback(async (pitchId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: PitchDetailsRequest = {
        userEmail: "member1@company1.com", // Default user email
      };

      const response = await pitchApi.post(
        `/pitch-details/${pitchId}`,
        payload
      );
      const result = response.data;

      if (result.data) {
        setPitchDetails(result.data);
      } else {
        throw new Error("No pitch details found");
      }

      return result.data;
    } catch (error) {
      // Show user-friendly error messages instead of technical details
      let userFriendlyMessage =
        "Something went wrong while loading pitch details";

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          userFriendlyMessage =
            "Pitch details not found. This pitch may not be available for analysis";
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
        } else if (error.message.includes("No pitch details found")) {
          userFriendlyMessage =
            "Detailed analysis for this pitch deck is not available";
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

  const clearPitchDetails = useCallback(() => {
    setPitchDetails(null);
  }, []);

  return {
    fetchPitchDetails,
    pitchDetails,
    isLoading,
    error,
    clearError,
    clearPitchDetails,
  };
};
