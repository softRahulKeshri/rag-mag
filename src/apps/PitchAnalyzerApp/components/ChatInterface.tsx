import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useCompanyPitches } from "../hooks/useCompanyPitches";

import type { Pitch } from "../types/types";

interface ChatInterfaceProps {
  onPitchSelect?: (pitch: Pitch) => void;
  onViewDetails?: (pitch: Pitch) => void;
}

const ITEMS_PER_PAGE = 12;

const ChatInterface = ({
  onPitchSelect,
  onViewDetails,
}: ChatInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchCompanyPitches, pitches, isLoading, error, clearError } =
    useCompanyPitches();

  // Fetch pitches on component mount
  useEffect(() => {
    fetchCompanyPitches();
  }, [fetchCompanyPitches]);

  // Filter and search pitches
  const filteredPitches = useMemo(() => {
    let filtered = pitches;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((pitch) => {
        const title = pitch.title?.toLowerCase() || "";
        const filename = pitch.filename.toLowerCase();
        const sector = pitch.sector_category.toLowerCase();
        const tags = Object.values(pitch.tagsinfo || {})
          .join(" ")
          .toLowerCase();

        return (
          title.includes(query) ||
          filename.includes(query) ||
          sector.includes(query) ||
          tags.includes(query)
        );
      });
    }

    return filtered;
  }, [pitches, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPitches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPitches = filteredPitches.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePitchSelect = useCallback(
    (pitch: Pitch) => {
      onPitchSelect?.(pitch);
    },
    [onPitchSelect]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pitch Store</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a pitch deck to start an AI-powered conversation and get
          detailed insights
        </p>
      </div>

      {/* Compact Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <DocumentMagnifyingGlassIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Available Pitches
              </p>
              <p className="text-lg font-bold text-gray-900">
                {filteredPitches.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pitches..."
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800">
                Error Loading Pitches
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pitches...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we fetch your pitch collection
          </p>
        </div>
      )}

      {/* Pitches Grid */}
      {!isLoading && currentPitches.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
              >
                {/* Header with icon and title */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <DocumentMagnifyingGlassIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {pitch.title || pitch.filename}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pitch.sector_category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Information Tags */}
                {pitch.tagsinfo && Object.keys(pitch.tagsinfo).length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pitch.tagsinfo.Ask && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Ask: {pitch.tagsinfo.Ask}
                        </span>
                      )}
                      {pitch.tagsinfo.FundingStage && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {pitch.tagsinfo.FundingStage}
                        </span>
                      )}
                      {pitch.tagsinfo.Technology &&
                        pitch.tagsinfo.Technology.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {pitch.tagsinfo.Technology[0]}
                            {pitch.tagsinfo.Technology.length > 1 && " +"}
                          </span>
                        )}
                    </div>
                  </div>
                )}

                {/* Uploaded Date */}
                <p className="text-xs text-gray-500 mb-4">
                  Uploaded {formatDate(pitch.created_at)}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {/* Primary Chat Button */}
                  <button
                    onClick={() => handlePitchSelect(pitch)}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Start AI Chat
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={() => onViewDetails?.(pitch)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    title="View Details"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredPitches.length)} of{" "}
                  {filteredPitches.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? "bg-indigo-600 text-white shadow-lg"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && currentPitches.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery.trim() ? "No pitches found" : "No pitches available"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery.trim()
              ? "Try adjusting your search terms"
              : "Upload some pitch decks to get started with AI-powered analysis"}
          </p>
          {!searchQuery.trim() && (
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Upload Pitch Deck
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
