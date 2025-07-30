import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookmarkIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useCompanyPitches } from "../hooks/useCompanyPitches";
import { useBookmarkPitch } from "../hooks/useBookmarkPitch";
import { downloadPitch, viewPitch } from "../utils/pitchUtils";
import { useToast } from "../../../components/ui/useToast";
import type { Pitch } from "../types/types";

interface ChatInterfaceProps {
  onPitchSelect?: (pitch: Pitch) => void;
  onViewDetails?: (pitch: Pitch) => void;
}

const ITEMS_PER_PAGE = 12; // Increased for grid layout

const ChatInterface = ({
  onPitchSelect,
  onViewDetails,
}: ChatInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [downloadingPitchId, setDownloadingPitchId] = useState<string | null>(
    null
  );

  const { fetchCompanyPitches, pitches, isLoading, error, clearError } =
    useCompanyPitches();

  const {
    toggleBookmark,
    isLoading: bookmarkLoading,
    error: bookmarkError,
    clearError: clearBookmarkError,
  } = useBookmarkPitch();

  const { showToast } = useToast();

  // Fetch pitches on component mount
  useEffect(() => {
    fetchCompanyPitches();
  }, [fetchCompanyPitches]);

  // Filter and search pitches
  const filteredPitches = useMemo(() => {
    let filtered = pitches;

    // Apply bookmarked filter
    if (showOnlyBookmarked) {
      filtered = filtered.filter((pitch) => pitch.is_bookmarked);
    }

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
  }, [pitches, searchQuery, showOnlyBookmarked]);

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
        await toggleBookmark(pitchId, currentBookmarkState);
        // Refresh the pitches list
        await fetchCompanyPitches();

        // Show success toast
        showToast(
          `Pitch ${
            currentBookmarkState ? "removed from" : "added to"
          } bookmarks`,
          "success"
        );
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
        showToast("Failed to update bookmark", "error");
      }
    },
    [toggleBookmark, fetchCompanyPitches, showToast]
  );

  const handleDownloadPitch = useCallback(
    async (pitch: Pitch) => {
      try {
        setDownloadingPitchId(pitch.id);
        await downloadPitch(pitch.id, pitch.filename);
        showToast(`Successfully downloaded "${pitch.filename}"`, "success");
      } catch (error) {
        console.error("Failed to download pitch:", error);
        showToast("Failed to download pitch file", "error");
      } finally {
        setDownloadingPitchId(null);
      }
    },
    [showToast]
  );

  const handleViewPitch = useCallback(
    (pitch: Pitch) => {
      try {
        viewPitch(pitch.id);
        showToast(`Opening "${pitch.filename}" in new tab`, "success");
      } catch (error) {
        console.error("Failed to view pitch:", error);
        showToast("Failed to open pitch file", "error");
      }
    },
    [showToast]
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
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white"></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Chat with AI</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select a pitch deck to start an AI-powered conversation and get
          detailed insights
        </p>
      </div>

      {/* Premium Stats Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-200/50 p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <DocumentMagnifyingGlassIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                Available Pitches
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredPitches.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Ready for analysis</p>
            <p className="text-xs text-gray-500">Click to start chat</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MagnifyingGlassIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Search & Filter
            </h2>
            <p className="text-gray-600">
              Find and filter pitches for AI-powered analysis
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Pitches
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, sector, or keywords..."
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white/90 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                disabled={isLoading}
              />
              {/* Search input glow effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-indigo-300 opacity-0 hover:opacity-20 transition-opacity duration-200 pointer-events-none"></div>
            </div>
          </div>

          {/* Enhanced Filter Toggle */}
          <div className="lg:w-80">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Options
            </label>
            <div className="relative">
              <button
                onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                disabled={isLoading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white flex items-center justify-between ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="flex items-center space-x-2">
                  <BookmarkIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    {showOnlyBookmarked
                      ? "Show All Pitches"
                      : "Show Bookmarked Only"}
                  </span>
                </span>
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    showOnlyBookmarked ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                >
                  {showOnlyBookmarked && (
                    <div className="w-2 h-2 bg-white rounded-full m-1"></div>
                  )}
                </div>
              </button>
            </div>
          </div>
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

      {bookmarkError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800">
                Bookmark Error
              </h3>
              <p className="text-red-700 mt-1">{bookmarkError}</p>
            </div>
            <button
              onClick={clearBookmarkError}
              className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
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
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative">
                  {/* Header with icon and title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <DocumentMagnifyingGlassIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {pitch.title || pitch.filename}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sector: {pitch.sector_category}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleBookmark(pitch.id, pitch.is_bookmarked)
                      }
                      disabled={bookmarkLoading}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        pitch.is_bookmarked
                          ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                          : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                      } ${
                        bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title={
                        pitch.is_bookmarked ? "Remove bookmark" : "Add bookmark"
                      }
                    >
                      <BookmarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Date */}
                  <p className="text-sm text-gray-500 mb-4">
                    Created: {formatDate(pitch.created_at)}
                  </p>

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

                    {/* Secondary Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPitch(pitch)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                        title="View Pitch"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadPitch(pitch)}
                        disabled={downloadingPitchId === pitch.id}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download Pitch"
                      >
                        {downloadingPitchId === pitch.id ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                        ) : (
                          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        )}
                        Download
                      </button>
                      <button
                        onClick={() => onViewDetails?.(pitch)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
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
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery.trim() || showOnlyBookmarked
              ? "No pitches found"
              : "No pitches available"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery.trim()
              ? "Try adjusting your search terms or filters"
              : "Upload some pitch decks to get started with AI-powered analysis"}
          </p>
          {!searchQuery.trim() && !showOnlyBookmarked && (
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
