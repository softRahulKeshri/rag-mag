import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type {
  SearchApiResponse,
  CandidateResult,
  CandidateDetail,
  SearchResult,
} from "../modules/search/types";

/**
 * Search API Hook
 *
 * Handles all search-related API operations including:
 * - Text-based resume search
 * - Job description upload and matching
 * - Result transformation and caching
 * - Error handling and loading states
 *
 * API Endpoints:
 * - POST /search_api - Text-based search
 * - POST /upload_jd - Job description upload and search
 */
export const useSearchApi = () => {
  const { fetchWithRetry, handleApiError, buildUrl } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transform API response to frontend-optimized candidate results
   */
  const transformApiResponse = useCallback(
    (data: SearchApiResponse): CandidateResult[] => {
      if (!data.answer?.candidate_details) {
        console.warn("No candidate details in API response:", data);
        return [];
      }

      return data.answer.candidate_details
        .map((detail: CandidateDetail, index: number) => {
          // Find matching chunk data for additional context
          const matchingChunk = data.results?.find(
            (chunk: SearchResult) => chunk.source_file === detail.file_name
          );

          const scoreCard = detail.score_card;
          const averageScore = scoreCard
            ? (scoreCard.clarity_score +
                scoreCard.experience_score +
                scoreCard.loyalty_score +
                scoreCard.reputation_score) /
              4
            : 0;

          // Extract highlights from details string
          const highlights = detail.details
            .split("*")
            .filter((item) => item.trim())
            .map((item) => item.trim().replace(/^,\s*/, ""))
            .slice(0, 3);

          return {
            id: matchingChunk?.id || `candidate-${index}`,
            name: detail.candidate_name,
            filename: detail.file_name,
            details: detail.details,
            clarityScore: scoreCard?.clarity_score || 0,
            experienceScore: scoreCard?.experience_score || 0,
            loyaltyScore: scoreCard?.loyalty_score || 0,
            reputationScore: scoreCard?.reputation_score || 0,
            averageScore,
            matchScore: matchingChunk?.score || averageScore / 10,
            highlights,
            rawText: matchingChunk?.text,
            group: matchingChunk?.group,
            comment: detail.comment || null,
            commentedAt: detail.commented_at || null,
          };
        })
        .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
    },
    []
  );

  /**
   * Search resumes by text query
   * POST /search_api
   *
   * @param query - Search query string
   * @param group - Optional group filter
   * @returns Promise<{results: CandidateResult[], summary: string}> - Search results and summary
   */
  const searchByText = useCallback(
    async (
      query: string,
      group?: string
    ): Promise<{ results: CandidateResult[]; summary: string }> => {
      if (!query.trim() || query.trim().length < 5) {
        throw new Error(
          "Please enter at least 5 characters for your search query."
        );
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl("/search_api");
        console.log(`🔍 Search API: Performing text search at: ${url}`);
        console.log(`📝 Search query:`, {
          query: query.trim(),
          group: group || null,
        });

        const response = await fetchWithRetry<SearchApiResponse>(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            group: group || null,
          }),
        });

        console.log(`📡 Search API Response:`, response);

        const candidates = transformApiResponse(response);
        const summary =
          response.answer?.summary || "Search completed successfully.";

        console.log(
          `✅ Search successful: ${candidates.length} candidates found`
        );
        return { results: candidates, summary };
      } catch (error) {
        console.error("❌ Error in text search:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw new Error(`Search failed: ${apiError.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithRetry, buildUrl, transformApiResponse, handleApiError]
  );

  /**
   * Search resumes by uploading job description
   * POST /upload_jd
   *
   * @param file - Job description file
   * @param group - Optional group filter
   * @returns Promise<{results: CandidateResult[], summary: string}> - Search results and summary
   */
  const searchByJobDescription = useCallback(
    async (
      file: File,
      group?: string
    ): Promise<{ results: CandidateResult[]; summary: string }> => {
      if (!file) {
        throw new Error("Please select a file first");
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Please upload a PDF, DOC, DOCX, or TXT file");
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size must be less than 10MB");
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = buildUrl("/upload_jd");
        console.log(`📄 Upload JD API: Uploading job description at: ${url}`);
        console.log(`📁 File details:`, {
          name: file.name,
          size: file.size,
          type: file.type,
        });
        console.log(`🏷️ Group filter:`, group || "No group selected");

        // Create FormData with exact field names expected by API
        const formData = new FormData();
        
        // Append file with 'file' field name (binary data)
        formData.append("file", file);
        
        // Append group with 'group' field name if provided and not empty
        // Only add group parameter if it has a meaningful value
        if (group && typeof group === 'string' && group.trim() && group.trim() !== "") {
          formData.append("group", group.trim());
          console.log(`✅ Group parameter added: "${group.trim()}"`);
        } else {
          console.log(`ℹ️ No group parameter added (group: "${group}", type: ${typeof group})`);
        }

        // Log FormData contents for debugging (development only)
        if (import.meta.env.DEV) {
          console.log("📤 FormData contents:");
          for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
              console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
            } else {
              console.log(`  ${key}: ${value}`);
            }
          }
          
          // Log the expected payload format
          console.log("📋 Expected API payload format:");
          console.log("  file: (binary data)");
          console.log(`  group: ${group || "not provided"}`);
        }

        const response = await fetchWithRetry<SearchApiResponse>(url, {
          method: "POST",
          body: formData,
          // Don't set any headers for FormData - browser will set Content-Type automatically
        });

        console.log(`📡 Upload JD API Response:`, response);

        const candidates = transformApiResponse(response);
        const summary =
          response.answer?.summary ||
          "Job description analysis completed successfully.";

        console.log(
          `✅ JD upload successful: ${candidates.length} candidates found`
        );
        return { results: candidates, summary };
      } catch (error) {
        console.error("❌ Error in JD upload:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw new Error(`Upload failed: ${apiError.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithRetry, buildUrl, transformApiResponse, handleApiError]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    searchByText,
    searchByJobDescription,
    clearError,
    reset,

    // Utilities
    transformApiResponse,
  };
};
