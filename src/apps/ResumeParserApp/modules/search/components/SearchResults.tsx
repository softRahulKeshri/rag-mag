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
  const [sortBy] = useState<"score" | "name" | "clarity" | "experience">(
    "score"
  );

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Results Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-n1000 mb-2">
              Search Results
            </h2>
            <div className="flex items-center gap-4 text-sm text-neutral-n700">
              <span>
                <strong className="text-neutral-n1000">
                  {searchResults.length}
                </strong>{" "}
                candidates found
              </span>
              {selectedGroup && (
                <>
                  <span>•</span>
                  <span>
                    in{" "}
                    <strong className="text-neutral-n1000">
                      {selectedGroup}
                    </strong>{" "}
                    group
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Clear Search Button */}
            <button
              onClick={onClearSearch}
              className="px-4 py-2 text-neutral-n700 hover:text-neutral-n1000 border border-neutral-n300 rounded-xl hover:bg-neutral-n50 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              Clear Search
            </button>
          </div>
        </div>

        {/* AI Summary */}
        {searchSummary && (
          <div className="bg-primary-ui-blue-p100 rounded-xl p-6 border border-primary-ui-blue-p200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-n1000 mb-2">
                  AI Search Summary
                </h3>
                <p className="text-neutral-n700 leading-relaxed">
                  {searchSummary}
                </p>
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
          <div className="w-24 h-24 bg-neutral-n100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-neutral-n400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-n1000 mb-2">
            No Results Found
          </h3>
          <p className="text-neutral-n700 mb-4">
            We couldn't find any candidates matching your search criteria.
          </p>
          <button
            onClick={onClearSearch}
            className="px-6 py-2 bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            Try New Search
          </button>
        </div>
      )}

      {/* Results Footer */}
      {searchResults.length > 0 && (
        <div className="mt-12 pt-8 border-t border-neutral-n200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-n700">
              Showing <strong>{searchResults.length}</strong> candidates
              {selectedGroup && (
                <span>
                  {" "}
                  from <strong>{selectedGroup}</strong> group
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-n700">Powered by</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-brand-gradient-purple flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
                <span className="text-sm font-medium text-brand-gradient-purple">
                  Magure.AI
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
