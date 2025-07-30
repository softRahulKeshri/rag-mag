import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type {
  BookmarkPitchRequest,
  BookmarkPitchResponse,
} from "../types/types";

export const useBookmarkPitch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBookmarkAction, setLastBookmarkAction] = useState<{
    success: boolean;
    isBookmarked: boolean;
  } | null>(null);

  const toggleBookmark = useCallback(
    async (pitchId: string, currentBookmarkState: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: BookmarkPitchRequest = {
          userEmail: "member1@company1.com", // Default user email
          pitchId,
          isBookmarked: !currentBookmarkState,
        };

        const response = await pitchApi.post("/bookmark-pitch", payload);
        const result: BookmarkPitchResponse = response.data;

        const success = result.status === 200 || result.status === 201;
        const newBookmarkState = !currentBookmarkState;

        setLastBookmarkAction({
          success,
          isBookmarked: newBookmarkState,
        });

        return result;
      } catch (error) {
        // Show user-friendly error messages instead of technical details
        let userFriendlyMessage =
          "Something went wrong while updating bookmark";

        if (error instanceof Error) {
          if (error.message.includes("404")) {
            userFriendlyMessage = "Pitch not found. It may have been removed";
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
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLastAction = useCallback(() => {
    setLastBookmarkAction(null);
  }, []);

  return {
    toggleBookmark,
    isLoading,
    error,
    lastBookmarkAction,
    clearError,
    clearLastAction,
  };
};
