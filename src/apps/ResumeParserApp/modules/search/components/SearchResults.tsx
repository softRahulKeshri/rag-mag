import React, { useState, useCallback, useMemo } from "react";
import type { SearchResultsProps, CandidateResult } from "../types";
import CandidateCard from "./CandidateCard";

/**
 * SearchResults Component
 *
 * Enhanced search results display with elegant UI and comprehensive candidate information.
 *
 * Key Features:
 * - Modern card-based layout with brand colors
 * - Rich candidate data display (education, experience, contact info)
 * - Advanced sorting and filtering capabilities
 * - AI-powered search summary with visual indicators
 * - Responsive grid layout with hover animations
 * - Interactive sort controls with visual feedback
 * - Enhanced accessibility and performance optimizations
 *
 * Design Philosophy:
 * - Uses brand gradient colors for visual hierarchy
 * - Implements consistent spacing and typography
 * - Provides clear visual feedback for user interactions
 * - Maintains clean separation between content sections
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchSummary,
  selectedGroup,
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<
    "score" | "name" | "clarity" | "experience" | "reputation" | "loyalty"
  >("score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sort candidates based on selected criteria with enhanced sorting options
  const sortedResults = useMemo(() => {
    const sorted = [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "clarity":
          return (b.clarityScore || 0) - (a.clarityScore || 0);
        case "experience":
          return (b.experienceScore || 0) - (a.experienceScore || 0);
        case "reputation":
          return (b.reputationScore || 0) - (a.reputationScore || 0);
        case "loyalty":
          return (b.loyaltyScore || 0) - (a.loyaltyScore || 0);
        case "score":
        default:
          return (b.averageScore || 0) - (a.averageScore || 0);
      }
    });
    return sorted;
  }, [searchResults, sortBy]);

  // Calculate search statistics for better insights
  const searchStats = useMemo(() => {
    const totalCandidates = searchResults.length;
    const avgScore =
      totalCandidates > 0
        ? searchResults.reduce(
            (sum, candidate) => sum + (candidate.averageScore || 0),
            0
          ) / totalCandidates
        : 0;
    const highScoreCandidates = searchResults.filter(
      (candidate) => (candidate.averageScore || 0) >= 7
    ).length;

    return {
      totalCandidates,
      avgScore: Math.round(avgScore * 10) / 10,
      highScoreCandidates,
      qualityPercentage:
        totalCandidates > 0
          ? Math.round((highScoreCandidates / totalCandidates) * 100)
          : 0,
    };
  }, [searchResults]);

  const handleViewDetails = useCallback((candidate: CandidateResult) => {
    // Here you would typically open a modal or navigate to a detailed view
    console.log("View details for:", candidate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Enhanced Results Header with Statistics */}
      <div className="mb-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
          {/* Title and Basic Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue bg-clip-text text-transparent">
                Search Results
              </h2>
              <div className="px-3 py-1 bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple rounded-full">
                <span className="text-sm font-semibold text-white">
                  {searchStats.totalCandidates}
                </span>
              </div>
            </div>

            {/* Enhanced Statistics Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-gradient-blue rounded-full"></div>
                <span className="text-neutral-n700">
                  <strong className="text-neutral-n1000">
                    {searchStats.totalCandidates}
                  </strong>{" "}
                  candidates found
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-gradient-cyan rounded-full"></div>
                <span className="text-neutral-n700">
                  Avg Score:{" "}
                  <strong className="text-neutral-n1000">
                    {searchStats.avgScore}/10
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-gradient-orange rounded-full"></div>
                <span className="text-neutral-n700">
                  Quality Match:{" "}
                  <strong className="text-neutral-n1000">
                    {searchStats.qualityPercentage}%
                  </strong>
                </span>
              </div>

              {selectedGroup && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-gradient-purple rounded-full"></div>
                  <span className="text-neutral-n700">
                    Group:{" "}
                    <strong className="text-neutral-n1000">
                      {selectedGroup}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-n700 whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-neutral-n300 rounded-lg text-sm font-medium text-neutral-n700 bg-white hover:border-brand-gradient-blue focus:border-brand-gradient-blue focus:ring-2 focus:ring-primary-ui-blue-p200 transition-all duration-200 outline-none"
              >
                <option value="score">Overall Score</option>
                <option value="clarity">Clarity</option>
                <option value="experience">Experience</option>
                <option value="reputation">Reputation</option>
                <option value="loyalty">Loyalty</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-n150 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-brand-gradient-blue shadow-sm"
                    : "text-neutral-n600 hover:text-neutral-n800"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-brand-gradient-blue shadow-sm"
                    : "text-neutral-n600 hover:text-neutral-n800"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
              </button>
            </div>

            {/* Clear Search Button */}
            <button
              onClick={onClearSearch}
              className="px-4 py-2 text-neutral-n700 hover:text-white border border-neutral-n300 rounded-lg hover:bg-gradient-to-r hover:from-brand-gradient-orange hover:to-brand-gradient-purple hover:border-transparent transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              Clear Search
            </button>
          </div>
        </div>

        {/* Enhanced AI Summary */}
        {searchSummary && (
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-ui-blue-p100 via-primary-ui-blue-p50 to-white rounded-2xl p-6 border border-primary-ui-blue-p200 shadow-sm">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gradient-blue/10 to-brand-gradient-cyan/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-gradient-purple/10 to-brand-gradient-orange/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-neutral-n1000">
                    AI Search Summary
                  </h3>
                  <div className="px-2 py-1 bg-gradient-to-r from-brand-gradient-cyan to-brand-gradient-blue rounded-full">
                    <span className="text-xs font-semibold text-white">
                      POWERED BY AI
                    </span>
                  </div>
                </div>
                <p className="text-neutral-n700 leading-relaxed text-base">
                  {searchSummary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Results Display */}
      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {/* Results count indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-neutral-n900">
                Showing {sortedResults.length} candidates
              </h3>
              {searchStats.highScoreCandidates > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    {searchStats.highScoreCandidates} high-quality matches
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Grid/List Layout */}
          <div
            className={`${
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }`}
          >
            {sortedResults.map((candidate, index) => (
              <div
                key={candidate.id}
                className="stagger-fade-in"
                style={{ animationDelay: `${(index % 6) * 100 + 100}ms` }}
              >
                <CandidateCard
                  candidate={candidate}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative mb-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-brand-gradient-blue/20 to-brand-gradient-cyan/20 rounded-full animate-pulse"></div>
            </div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-neutral-n100 to-neutral-n150 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-12 h-12 text-neutral-n400"
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
          </div>

          <h3 className="text-2xl font-bold text-neutral-n900 mb-3">
            No Results Found
          </h3>
          <p className="text-neutral-n600 mb-6 max-w-md mx-auto leading-relaxed">
            We couldn't find any candidates matching your search criteria. Try
            adjusting your search terms or explore different filters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onClearSearch}
              className="px-8 py-3 bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
              Try New Search
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Results Footer */}
      {searchResults.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-neutral-n200 via-brand-gradient-blue/20 to-neutral-n200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search Statistics Summary */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-gradient-blue to-brand-gradient-cyan rounded-full"></div>
                <span className="text-neutral-n700">
                  <strong className="text-neutral-n900">
                    {searchResults.length}
                  </strong>{" "}
                  candidates analyzed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-orange rounded-full"></div>
                <span className="text-neutral-n700">
                  <strong className="text-neutral-n900">
                    {searchStats.avgScore}/10
                  </strong>{" "}
                  average match score
                </span>
              </div>
              {selectedGroup && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple rounded-full"></div>
                  <span className="text-neutral-n700">
                    From{" "}
                    <strong className="text-neutral-n900">
                      {selectedGroup}
                    </strong>{" "}
                    group
                  </span>
                </div>
              )}
            </div>

            {/* Powered By Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-neutral-n100 to-neutral-n150 rounded-xl border border-neutral-n200">
              <span className="text-sm font-medium text-neutral-n600">
                Powered by
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue bg-clip-text text-transparent">
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
