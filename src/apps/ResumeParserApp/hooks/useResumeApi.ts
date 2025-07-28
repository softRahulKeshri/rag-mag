import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { BaseResume as Resume } from "../types/shared";

/**
 * Resume API Hook
 *
 * Handles all resume-related API operations including:
 * - Fetching resumes with optional group filtering
 * - Deleting resumes
 * - Managing resume comments
 * - Error handling and loading states
 */
export const useResumeApi = () => {
  const { fetchWithRetry, handleApiError, buildUrl } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract file type from filename
   */
  const extractFileType = useCallback((filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "unknown";
  }, []);

  /**
   * Estimate file size based on file type (since not provided by API)
   * This is a fallback until the backend provides actual file sizes
   */
  const estimateFileSize = useCallback(
    (filename: string): number => {
      const extension = extractFileType(filename);

      // Provide reasonable estimates based on file type
      switch (extension) {
        case "pdf":
          return Math.floor(Math.random() * 2000000) + 500000; // 0.5-2.5MB
        case "doc":
        case "docx":
          return Math.floor(Math.random() * 1000000) + 200000; // 0.2-1.2MB
        case "txt":
          return Math.floor(Math.random() * 100000) + 10000; // 10-110KB
        default:
          return Math.floor(Math.random() * 1500000) + 300000; // 0.3-1.8MB
      }
    },
    [extractFileType]
  );

  /**
   * Normalize status to match frontend enum
   * Since the API doesn't provide status, we default to completed
   */
  const normalizeStatus = useCallback(
    (status: string): "uploaded" | "processing" | "completed" | "failed" => {
      const statusLower = status.toLowerCase();

      switch (statusLower) {
        case "uploaded":
        case "pending":
          return "uploaded";
        case "processing":
        case "in_progress":
          return "processing";
        case "completed":
        case "done":
        case "finished":
          return "completed";
        case "failed":
        case "error":
          return "failed";
        default:
          return "completed";
      }
    },
    []
  );

  /**
   * Transform backend resume data to frontend format
   */
  const transformResumeData = useCallback(
    (resume: Record<string, unknown>): Resume => {
      return {
        id: (resume.id as number) || 0,
        filename: (resume.original_filename as string) || "Unknown file",
        original_filename: (resume.original_filename as string) || undefined,
        fileSize: estimateFileSize((resume.original_filename as string) || ""), // Estimate since not provided
        fileType: extractFileType((resume.original_filename as string) || ""),
        uploadedAt: (resume.upload_time as string) || new Date().toISOString(),
        status: "completed" as const, // Default to completed since no status field
        group: (resume.group as string) || undefined, // Include group field from API response
      };
    },
    [estimateFileSize, extractFileType]
  );

  /**
   * Fetch all resumes from the CVs endpoint
   * POST /cvs
   * @param groupName - Optional group name to filter resumes by specific group
   */
  const getResumes = useCallback(
    async (groupName?: string): Promise<Resume[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl("/cvs");
        console.log(`🌐 Resume API: Fetching resumes from: ${url}`);

        // Prepare payload: empty object for all CVs, or object with group name for specific group
        const payload = groupName ? { group: groupName } : {};
        console.log(`📦 API Payload:`, payload);

        const response = await fetchWithRetry<Record<string, unknown>>(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log(`📡 API Response received:`, response);

        // Handle the actual API response structure
        // The API returns a direct array of resume objects
        const resumesArray = Array.isArray(response) ? response : [];

        // Transform backend data to match frontend Resume interface
        const transformedResumes: Resume[] =
          resumesArray.map(transformResumeData);

        console.log(
          `✅ Successfully transformed ${transformedResumes.length} resumes`
        );
        console.log(`📋 Sample transformed resume:`, transformedResumes[0]);

        return transformedResumes;
      } catch (error) {
        console.error("❌ Error fetching resumes:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);

        // Return empty array instead of crashing the app
        // This provides better UX and allows the app to continue functioning
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithRetry, buildUrl, transformResumeData, handleApiError]
  );

  /**
   * Delete a resume by ID
   * DELETE /delete/{id}
   */
  const deleteResume = useCallback(
    async (id: number): Promise<{ success: boolean; message?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl(`/delete/${id}`);
        console.log(`🗑️ Resume API: Deleting resume with ID ${id} at: ${url}`);

        const response = await fetchWithRetry<Record<string, unknown>>(url, {
          method: "DELETE",
        });

        console.log(`📡 Delete API Response:`, response);

        // Handle success response
        return {
          success: true,
          message: (response.message as string) || "Resume deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting resume:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);

        // Return error instead of throwing to allow graceful handling
        return {
          success: false,
          message: apiError.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithRetry, buildUrl, handleApiError]
  );

  /**
   * Add or update a comment for a CV
   * POST /api/cv/{cvId}/comment
   */
  const addOrUpdateComment = useCallback(
    async (cvId: number, comment: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl(`/cv/${cvId}/comment`);
        console.log(
          `💬 Resume API: Adding/updating comment for CV ${cvId} at: ${url}`
        );
        console.log(`📝 Comment content:`, comment);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
        });

        console.log(`📡 Comment API Status:`, response.status);

        if (response.status === 200) {
          console.log(`✅ Comment operation successful`);
          return true;
        } else {
          console.error(
            `❌ Comment operation failed with status:`,
            response.status
          );
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("❌ Error adding/updating comment:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [buildUrl, handleApiError]
  );

  /**
   * Delete a comment for a CV
   * POST /api/cv/{cvId}/comment
   */
  const deleteComment = useCallback(
    async (cvId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl(`/cv/${cvId}/comment`);
        console.log(
          `🗑️ Resume API: Deleting comment for CV ${cvId} at: ${url}`
        );

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "delete" }),
        });

        console.log(`📡 Delete Comment API Status:`, response.status);

        if (response.status === 200) {
          console.log(`✅ Comment deleted successfully`);
          return true;
        } else {
          console.error(
            `❌ Comment deletion failed with status:`,
            response.status
          );
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("❌ Error deleting comment:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [buildUrl, handleApiError]
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
    getResumes,
    deleteResume,
    addOrUpdateComment,
    deleteComment,
    clearError,

    // Utilities
    transformResumeData,
    normalizeStatus,
  };
};
