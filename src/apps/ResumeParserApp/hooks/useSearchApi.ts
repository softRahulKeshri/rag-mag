import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { Resume, SearchFilters, SearchResponse } from "../types/api";

/**
 * Search API Hook
 *
 * Handles resume search operations including:
 * - Text-based search
 * - Filter-based search
 * - Advanced search with multiple criteria
 * - Pagination support
 * - Error handling and loading states
 */
export const useSearchApi = () => {
  const { fetchWithRetry, handleApiError, buildUrl } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Resume[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  /**
   * Transform search result to frontend format
   */
  const transformSearchResult = useCallback(
    (result: Record<string, unknown>): Resume => {
      const comment = result.comment as Record<string, unknown> | undefined;

      return {
        id:
          typeof result.id === "string"
            ? parseInt(result.id, 10)
            : (result.id as number) || 0,
        filename:
          (result.filename as string) ||
          (result.fileName as string) ||
          (result.name as string) ||
          "Unknown File",
        original_filename:
          (result.original_filename as string) ||
          (result.originalFileName as string),
        stored_filename:
          (result.stored_filename as string) ||
          (result.storedFileName as string),
        filepath: (result.filepath as string) || (result.filePath as string),
        fileSize: (result.fileSize as number) || (result.size as number) || 0,
        fileType:
          (result.fileType as string) ||
          (result.type as string) ||
          "application/pdf",
        uploadedAt:
          (result.uploadedAt as string) ||
          (result.uploadDate as string) ||
          (result.createdAt as string) ||
          new Date().toISOString(),
        status: ((result.status as string) || "uploaded") as "uploaded" | "processing" | "completed" | "failed",
        group: (result.group as string) || (result.groupName as string),
        comment: comment
          ? {
              id: (comment.id as number) || 0,
              resumeId:
                (comment.resumeId as number) || (result.id as number) || 0,
              comment: (comment.comment as string) || "",
              createdAt:
                (comment.createdAt as string) || new Date().toISOString(),
              updatedAt:
                (comment.updatedAt as string) || new Date().toISOString(),
              hrName: comment.hrName as string,
            }
          : undefined,
      };
    },
    []
  );

  /**
   * Build search parameters for API request
   */
  const buildSearchParams = useCallback(
    (filters: SearchFilters): URLSearchParams => {
      const params = new URLSearchParams();

      if (filters.query) {
        params.append("q", filters.query);
      }

      if (filters.status && filters.status.length > 0) {
        filters.status.forEach((status) => {
          params.append("status", status);
        });
      }

      if (filters.group) {
        params.append("group", filters.group);
      }

      if (filters.dateRange?.start) {
        params.append("start_date", filters.dateRange.start.toISOString());
      }

      if (filters.dateRange?.end) {
        params.append("end_date", filters.dateRange.end.toISOString());
      }

      return params;
    },
    []
  );

  /**
   * Search resumes with filters
   * GET /search with query parameters
   */
  const searchResumes = useCallback(
    async (filters: SearchFilters): Promise<SearchResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const params = buildSearchParams(filters);
        const url = buildUrl(`/search?${params.toString()}`);

        console.log(`🔍 Search API: Searching resumes at: ${url}`);

        const response = await fetchWithRetry<Record<string, unknown>>(url, {
          method: "GET",
        });

        console.log(`📡 Search API Response:`, response);

        let results: Record<string, unknown>[] = [];
        let total = 0;

        // Handle different response structures
        if (response) {
          if (response.data && Array.isArray(response.data)) {
            // Direct data array
            results = response.data;
            total = (response.total as number) || response.data.length;
          } else if (response.results && Array.isArray(response.results)) {
            // Paginated response
            results = response.results;
            total =
              (response.total as number) ||
              (response.count as number) ||
              response.results.length;
          }
        }

        // Transform results to frontend format
        const transformedResults: Resume[] = results.map(transformSearchResult);

        const searchResponse: SearchResponse = {
          results: transformedResults,
          total,
          page: (response.page as number) || 1,
          limit: (response.limit as number) || results.length,
        };

        setSearchResults(transformedResults);
        setTotalResults(total);

        console.log(
          `✅ Search completed: ${transformedResults.length} results found`
        );
        return searchResponse;
      } catch (error) {
        console.error("❌ Error searching resumes:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);

        // Return empty results instead of throwing
        const emptyResponse: SearchResponse = {
          results: [],
          total: 0,
          page: 1,
          limit: 0,
        };

        setSearchResults([]);
        setTotalResults(0);
        return emptyResponse;
      } finally {
        setIsLoading(false);
      }
    },
    [
      fetchWithRetry,
      buildUrl,
      buildSearchParams,
      transformSearchResult,
      handleApiError,
    ]
  );

  /**
   * Search resumes by text query
   */
  const searchByQuery = useCallback(
    async (query: string): Promise<Resume[]> => {
      const response = await searchResumes({ query });
      return response.results;
    },
    [searchResumes]
  );

  /**
   * Search resumes by status
   */
  const searchByStatus = useCallback(
    async (statuses: string[]): Promise<Resume[]> => {
      const response = await searchResumes({ status: statuses });
      return response.results;
    },
    [searchResumes]
  );

  /**
   * Search resumes by group
   */
  const searchByGroup = useCallback(
    async (group: string): Promise<Resume[]> => {
      const response = await searchResumes({ group });
      return response.results;
    },
    [searchResumes]
  );

  /**
   * Search resumes by date range
   */
  const searchByDateRange = useCallback(
    async (startDate: Date, endDate: Date): Promise<Resume[]> => {
      const response = await searchResumes({
        dateRange: { start: startDate, end: endDate },
      });
      return response.results;
    },
    [searchResumes]
  );

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setTotalResults(0);
    setError(null);
  }, []);

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
    searchResults,
    totalResults,

    // Actions
    searchResumes,
    searchByQuery,
    searchByStatus,
    searchByGroup,
    searchByDateRange,
    clearSearch,
    clearError,

    // Utilities
    transformSearchResult,
  };
};
