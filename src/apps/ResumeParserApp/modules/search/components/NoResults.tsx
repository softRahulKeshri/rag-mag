import React from "react";
import type { NoResultsProps } from "../types";

/**
 * NoResults Component
 *
 * Displays when a search returns no candidates.
 *
 * Features:
 * - Friendly no results message
 * - Search suggestions and tips
 * - Clear search action
 * - Visual illustration
 * - Helpful guidance for better searches
 */
const NoResults: React.FC<NoResultsProps> = ({ onClearSearch }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      {/* No Results Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Main Empty Search Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400 flex-shrink-0"
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

          {/* Empty Indicator */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          No Matching Candidates Found
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We couldn't find any candidates matching your current search criteria.
          Try adjusting your search terms or consider the suggestions below.
        </p>
      </div>

      {/* Search Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          💡 Try These Search Strategies
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Broaden Your Search
                </h4>
                <p className="text-sm text-gray-600">
                  Use fewer specific requirements or synonyms for skills
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Check Group Filters
                </h4>
                <p className="text-sm text-gray-600">
                  Try searching across "All Groups" instead of specific ones
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Use Different Keywords
                </h4>
                <p className="text-sm text-gray-600">
                  Try "JavaScript" instead of "JS", or "UI/UX" instead of
                  "Design"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-sm font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Reduce Experience Requirements
                </h4>
                <p className="text-sm text-gray-600">
                  Search for "2+ years" instead of "5+ years experience"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Searches */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">
          🎯 Example Searches That Work Well
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2 text-left">
            <div className="bg-gray-50 rounded-lg p-3">
              <code className="text-purple-600">
                "Full stack developer React Node.js"
              </code>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <code className="text-purple-600">
                "Marketing manager digital experience"
              </code>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <div className="bg-gray-50 rounded-lg p-3">
              <code className="text-purple-600">
                "Data scientist Python machine learning"
              </code>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <code className="text-purple-600">
                "Project manager agile scrum"
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onClearSearch}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          Try New Search
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
          Back to Top
        </button>
      </div>
    </div>
  );
};

export default NoResults;
