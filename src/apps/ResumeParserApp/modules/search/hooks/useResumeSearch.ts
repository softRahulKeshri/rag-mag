import { useState, useCallback } from "react";
import type { SearchFilters, SearchResult } from "../types";
import { searchResumes } from "../../../services/api";

interface UseResumeSearchReturn {
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setStatusFilter: (statuses: string[]) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setGroupFilter: (group: string | undefined) => void;
  clearFilters: () => void;
  performSearch: () => Promise<void>;
}

export const useResumeSearch = (): UseResumeSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
    group: undefined,
  });

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setStatusFilter = useCallback((statuses: string[]) => {
    setFilters((prev) => ({ ...prev, status: statuses }));
  }, []);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { start, end },
    }));
  }, []);

  const setGroupFilter = useCallback((group: string | undefined) => {
    setFilters((prev) => ({ ...prev, group }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      query: "",
      status: [],
      dateRange: {
        start: null,
        end: null,
      },
      group: undefined,
    });
  }, []);

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert SearchFilters to Record<string, unknown>
      const searchParams: Record<string, unknown> = {
        query: filters.query,
        status: filters.status,
        dateRange: filters.dateRange,
        group: filters.group || null, // Ensure null is passed for "All Groups"
      };

      const results = await searchResumes(searchParams);

      // Convert API Resume to SearchResult
      const searchResults: SearchResult[] = results.map((resume) => ({
        id: resume.id.toString(),
        fileName: resume.filename,
        original_filename: resume.original_filename,
        fileSize: resume.fileSize,
        uploadDate: new Date(resume.uploadedAt),
        status: resume.status === "failed" ? "error" : resume.status,
        group: resume.group,
      }));

      setSearchResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    searchResults,
    isLoading,
    error,
    filters,
    setQuery,
    setStatusFilter,
    setDateRange,
    setGroupFilter,
    clearFilters,
    performSearch,
  };
};
