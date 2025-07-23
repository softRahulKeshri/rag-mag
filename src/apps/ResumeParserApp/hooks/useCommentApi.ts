import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { ResumeComment } from "../types/api";

/**
 * Comment API Hook
 *
 * Handles all comment-related API operations including:
 * - Creating comments for resumes
 * - Updating existing comments
 * - Deleting comments
 * - Error handling and loading states
 *
 * API Endpoints:
 * - POST /cv/{cvId}/comment - Create/Update comment
 * - DELETE /cv/{cvId}/comment - Delete comment
 */
export const useCommentApi = () => {
  const { fetchWithRetry, handleApiError, buildUrl } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transform backend comment response to frontend format
   */
  const transformCommentResponse = useCallback(
    (response: Record<string, unknown>): ResumeComment => {
      const cv = response.cv as Record<string, unknown>;

      return {
        id: (cv.id as number) || 0,
        resumeId: (cv.id as number) || 0,
        comment: (cv.comment as string) || "",
        createdAt: (cv.commented_at as string) || new Date().toISOString(),
        updatedAt: (cv.commented_at as string) || new Date().toISOString(),
        hrName: "HR Team", // Default value as per the UI example
      };
    },
    []
  );

  /**
   * Create or update a comment for a resume
   * POST /cv/{cvId}/comment
   *
   * @param cvId - The resume ID
   * @param comment - The comment text
   * @returns Promise<ResumeComment> - The created/updated comment
   */
  const createOrUpdateComment = useCallback(
    async (cvId: number, comment: string): Promise<ResumeComment> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl(`/cv/${cvId}/comment`);
        console.log(
          `💬 Comment API: Creating/updating comment for CV ${cvId} at: ${url}`
        );
        console.log(`📝 Comment content:`, comment);

        const response = await fetchWithRetry<Record<string, unknown>>(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        });

        console.log(`📡 Comment API Response:`, response);

        // Transform the response to match our frontend format
        const transformedComment = transformCommentResponse(response);

        console.log(`✅ Comment operation successful:`, transformedComment);
        return transformedComment;
      } catch (error) {
        console.error("❌ Error creating/updating comment:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw new Error(`Failed to save comment: ${apiError.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithRetry, buildUrl, transformCommentResponse, handleApiError]
  );

  /**
   * Delete a comment for a resume
   * DELETE /cv/{cvId}/comment
   *
   * @param cvId - The resume ID
   * @returns Promise<boolean> - Success status
   */
  const deleteComment = useCallback(
    async (cvId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl(`/cv/${cvId}/comment`);
        console.log(
          `🗑️ Comment API: Deleting comment for CV ${cvId} at: ${url}`
        );

        const response = await fetchWithRetry<Record<string, unknown>>(url, {
          method: "DELETE",
        });

        console.log(`📡 Delete Comment API Response:`, response);

        console.log(`✅ Comment deleted successfully`);
        return true;
      } catch (error) {
        console.error("❌ Error deleting comment:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw new Error(`Failed to delete comment: ${apiError.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithRetry, buildUrl, handleApiError]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    createOrUpdateComment,
    deleteComment,
    clearError,
  };
};
