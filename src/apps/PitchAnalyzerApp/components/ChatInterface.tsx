import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookmarkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useCompanyPitches } from "../hooks/useCompanyPitches";
import { useBookmarkPitch } from "../hooks/useBookmarkPitch";
import type { Pitch } from "../types/types";

interface ChatInterfaceProps {
  userEmail: string;
  onPitchSelect?: (pitch: Pitch) => void;
}

const ITEMS_PER_PAGE = 8;

const ChatInterface = ({ userEmail, onPitchSelect }: ChatInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const { fetchCompanyPitches, pitches, isLoading, error, clearError } =
    useCompanyPitches();

  const {
    toggleBookmark,
    isLoading: bookmarkLoading,
    error: bookmarkError,
    clearError: clearBookmarkError,
  } = useBookmarkPitch();

  // Fetch pitches on component mount
  useEffect(() => {
    if (userEmail) {
      fetchCompanyPitches(userEmail, [], showOnlyBookmarked);
    }
  }, [userEmail, showOnlyBookmarked, fetchCompanyPitches]);

  // Filter and search pitches
  const filteredPitches = useMemo(() => {
    if (!searchQuery.trim()) return pitches;

    const query = searchQuery.toLowerCase();
    return pitches.filter((pitch) => {
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
  }, [pitches, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPitches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPitches = filteredPitches.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, showOnlyBookmarked]);

  const handlePitchSelect = useCallback(
    (pitch: Pitch) => {
      onPitchSelect?.(pitch);
    },
    [onPitchSelect]
  );

  const handleToggleBookmark = useCallback(
    async (pitchId: string, currentBookmarkState: boolean) => {
      try {
        await toggleBookmark(userEmail, pitchId, currentBookmarkState);
        // Refresh the pitches list
        await fetchCompanyPitches(userEmail, [], showOnlyBookmarked);
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
      }
    },
    [userEmail, toggleBookmark, fetchCompanyPitches, showOnlyBookmarked]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getSectorColor = useCallback((sector: string) => {
    const colors = {
      Fintech: "bg-blue-50 text-blue-700 border-blue-200",
      Healthcare: "bg-green-50 text-green-700 border-green-200",
      "E-commerce": "bg-purple-50 text-purple-700 border-purple-200",
      SaaS: "bg-indigo-50 text-indigo-700 border-indigo-200",
      "AI/ML": "bg-orange-50 text-orange-700 border-orange-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[sector as keyof typeof colors] || colors.default;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chat & Analysis
              </h2>
              <p className="text-gray-600">
                Select a pitch deck to start chatting with AI
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredPitches.length} pitch
              {filteredPitches.length !== 1 ? "es" : ""} found
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search pitches by title, sector, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showOnlyBookmarked
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {showOnlyBookmarked ? "Bookmarked Only" : "All Pitches"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {bookmarkError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {bookmarkError}
              </p>
              <button
                onClick={clearBookmarkError}
                className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your pitch decks...</p>
          </div>
        </div>
      )}

      {/* Pitches Grid */}
      {!isLoading && currentPitches.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="group relative bg-white border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer border-gray-200 hover:border-gray-300"
                onClick={() => handlePitchSelect(pitch)}
              >
                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(pitch.id, pitch.is_bookmarked);
                  }}
                  disabled={bookmarkLoading}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                    pitch.is_bookmarked
                      ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50"
                      : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                  } ${bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={
                    pitch.is_bookmarked ? "Remove bookmark" : "Add bookmark"
                  }
                >
                  <StarIcon className="w-5 h-5" />
                </button>

                {/* Pitch Icon */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <DocumentMagnifyingGlassIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {pitch.title || pitch.filename}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(pitch.created_at)}
                    </p>
                  </div>
                </div>

                {/* Sector Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSectorColor(
                      pitch.sector_category
                    )}`}
                  >
                    {pitch.sector_category}
                  </span>
                </div>

                {/* Key Information */}
                {pitch.tagsinfo && Object.keys(pitch.tagsinfo).length > 0 && (
                  <div className="space-y-2">
                    {pitch.tagsinfo.Ask && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Ask:</span>{" "}
                        <span className="text-gray-600">
                          {pitch.tagsinfo.Ask}
                        </span>
                      </div>
                    )}
                    {pitch.tagsinfo.FundingStage && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Stage:
                        </span>{" "}
                        <span className="text-gray-600">
                          {pitch.tagsinfo.FundingStage}
                        </span>
                      </div>
                    )}
                    {pitch.tagsinfo.Market && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Market:
                        </span>{" "}
                        <span className="text-gray-600">
                          {pitch.tagsinfo.Market}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Chat Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePitchSelect(pitch);
                    }}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>Start Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredPitches.length)} of{" "}
                {filteredPitches.length} pitches
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
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
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPitches.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentMagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No pitches found" : "No pitches available"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "Upload your first pitch deck to get started with AI-powered analysis"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
