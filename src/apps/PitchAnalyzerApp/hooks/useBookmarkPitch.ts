import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

import type { BookmarkPitchResponse } from "../types/types";

export const useBookmarkPitch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBookmarkAction, setLastBookmarkAction] = useState<{
    pitchId: string;
    isBookmarked: boolean;
    success: boolean;
  } | null>(null);

  const bookmarkPitch = useCallback(
    async (pitchId: string, isBookmarked: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          pitchId,
          isBookmarked,
        };

        const response = await pitchApi.post("/pitch/bookmark-pitch", payload);

        const result: BookmarkPitchResponse = response.data;

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
      pitchId: string,
      currentBookmarkState: boolean
    ) => {
      return await bookmarkPitch(pitchId, !currentBookmarkState);
    },
    [bookmarkPitch]
  );

  const addBookmark = useCallback(
    async (pitchId: string) => {
      return await bookmarkPitch(pitchId, true);
    },
    [bookmarkPitch]
  );

  const removeBookmark = useCallback(
    async (pitchId: string) => {
      return await bookmarkPitch(pitchId, false);
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
