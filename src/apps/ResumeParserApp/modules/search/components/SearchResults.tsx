import React, { useState, useCallback } from "react";
import type { SearchResultsProps, CandidateResult } from "../types";
import CandidateCard from "./CandidateCard";

/**
 * SearchResults Component
 *
 * Displays search results with summary and candidate grid.
 *
 * Features:
 * - Search summary display
 * - Results count and filtering info
 * - Grid of candidate cards
 * - Sort and filter options
 * - Clear search functionality
 * - Responsive design
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchSummary,
  selectedGroup,
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<
    "score" | "name" | "clarity" | "experience"
  >("score");

  // Sort candidates based on selected criteria
  const sortedResults = useCallback(() => {
    const sorted = [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "clarity":
          return (b.clarityScore || 0) - (a.clarityScore || 0);
        case "experience":
          return (b.experienceScore || 0) - (a.experienceScore || 0);
        case "score":
        default:
          return (b.averageScore || 0) - (a.averageScore || 0);
      }
    });
    return sorted;
  }, [searchResults, sortBy]);

  const handleViewDetails = useCallback((candidate: CandidateResult) => {
    // Here you would typically open a modal or navigate to a detailed view
    console.log("View details for:", candidate);
  }, []);

  const sortOptions = [
    { value: "score", label: "Best Match" },
    { value: "clarity", label: "Clarity Score" },
    { value: "experience", label: "Experience Score" },
    { value: "name", label: "Name (A-Z)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Results Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Search Results
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong className="text-gray-900">
                  {searchResults.length}
                </strong>{" "}
                candidates found
              </span>
              {selectedGroup && (
                <>
                  <span>•</span>
                  <span>
                    in{" "}
                    <strong className="text-gray-900">{selectedGroup}</strong>{" "}
                    group
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Search Button */}
            <button
              onClick={onClearSearch}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              Clear Search
            </button>
          </div>
        </div>

        {/* AI Summary */}
        {searchSummary && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  AI Search Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{searchSummary}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedResults().map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any candidates matching your search criteria.
          </p>
          <button
            onClick={onClearSearch}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            Try New Search
          </button>
        </div>
      )}

      {/* Results Footer */}
      {searchResults.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <strong>{searchResults.length}</strong> candidates
              {selectedGroup && (
                <span>
                  {" "}
                  from <strong>{selectedGroup}</strong> group
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Powered by</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
                <span className="text-sm font-medium text-purple-600">
                  Magure.AI
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics (for development/debugging) */}
      {import.meta.env.DEV && searchResults.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Performance Metrics
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Total Results: {searchResults.length}</div>
            <div>
              Average Score:{" "}
              {(
                searchResults.reduce(
                  (sum, c) => sum + (c.averageScore || 0),
                  0
                ) / searchResults.length
              ).toFixed(2)}
            </div>
            <div>Group Filter: {selectedGroup || "All Groups"}</div>
            <div>
              Sort By: {sortOptions.find((opt) => opt.value === sortBy)?.label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
