import { useState, useCallback } from "react";

import type {
  BookmarkPitchRequest,
  BookmarkPitchResponse,
} from "../types/types";

export const useBookmarkPitch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBookmarkAction, setLastBookmarkAction] = useState<{
    pitchId: string;
    isBookmarked: boolean;
    success: boolean;
  } | null>(null);

  const bookmarkPitch = useCallback(
    async (userEmail: string, pitchId: string, isBookmarked: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: BookmarkPitchRequest = {
          userEmail,
          pitchId,
          isBookmarked,
        };

        const response = await fetch(
          "https://api.magure.ai/api/v1/pitch/bookmark-pitch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`Bookmark operation failed: ${response.statusText}`);
        }

        const result: BookmarkPitchResponse = await response.json();

        // Update last bookmark action for potential UI feedback
        setLastBookmarkAction({
          pitchId,
          isBookmarked,
          success: true,
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bookmark operation failed";
        setError(errorMessage);

        // Update last bookmark action to indicate failure
        setLastBookmarkAction({
          pitchId,
          isBookmarked,
          success: false,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const toggleBookmark = useCallback(
    async (
      userEmail: string,
      pitchId: string,
      currentBookmarkState: boolean
    ) => {
      return await bookmarkPitch(userEmail, pitchId, !currentBookmarkState);
    },
    [bookmarkPitch]
  );

  const addBookmark = useCallback(
    async (userEmail: string, pitchId: string) => {
      return await bookmarkPitch(userEmail, pitchId, true);
    },
    [bookmarkPitch]
  );

  const removeBookmark = useCallback(
    async (userEmail: string, pitchId: string) => {
      return await bookmarkPitch(userEmail, pitchId, false);
    },
    [bookmarkPitch]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLastBookmarkAction = useCallback(() => {
    setLastBookmarkAction(null);
  }, []);

  return {
    bookmarkPitch,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    isLoading,
    error,
    lastBookmarkAction,
    clearError,
    clearLastBookmarkAction,
  };
};
