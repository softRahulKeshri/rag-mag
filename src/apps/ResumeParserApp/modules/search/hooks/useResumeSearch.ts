import { useState, useCallback } from "react";
import type {
  SearchFilters,
  SearchApiResponse,
  CandidateDetail,
} from "../types";
import { searchResumes } from "../../../services/api";

interface UseResumeSearchReturn {
  searchResults: CandidateDetail[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  summary: string;
  setQuery: (query: string) => void;
  setStatusFilter: (statuses: string[]) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setGroupFilter: (group: string | undefined) => void;
  clearFilters: () => void;
  performSearch: () => Promise<void>;
}

export const useResumeSearch = (): UseResumeSearchReturn => {
  const [searchResults, setSearchResults] = useState<CandidateDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");
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
    if (!filters.query.trim()) {
      setSearchResults([]);
      setSummary("");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare search payload based on group selection
      const searchPayload: Record<string, unknown> = {
        query: filters.query.trim(),
        group: filters.group || null, // null for "All Groups"
      };

      console.log("🔍 Performing search with payload:", searchPayload);

      const response = await searchResumes(searchPayload);

      // Handle the new API response format
      if (response && typeof response === "object" && "answer" in response) {
        const searchResponse = response as unknown as SearchApiResponse;
        const candidates = searchResponse.answer.candidate_details || [];

        // Sort candidates by average score (descending order)
        const sortedCandidates = candidates.sort((a, b) => {
          const avgScoreA =
            (a.score_card.clarity_score +
              a.score_card.experience_score +
              a.score_card.loyalty_score +
              a.score_card.reputation_score) /
            4;
          const avgScoreB =
            (b.score_card.clarity_score +
              b.score_card.experience_score +
              b.score_card.loyalty_score +
              b.score_card.reputation_score) /
            4;
          return avgScoreB - avgScoreA;
        });

        setSearchResults(sortedCandidates);
        setSummary(searchResponse.answer.summary || "");
      } else {
        // Fallback for legacy response format
        setSearchResults([]);
        setSummary("No results found");
      }
    } catch (err) {
      console.error("❌ Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
      setSummary("");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    searchResults,
    isLoading,
    error,
    filters,
    summary,
    setQuery,
    setStatusFilter,
    setDateRange,
    setGroupFilter,
    clearFilters,
    performSearch,
  };
};
