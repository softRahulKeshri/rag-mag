import { useState, useCallback } from "react";
import {
  ExclamationTriangleIcon,
  BookmarkIcon,
  XMarkIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useCompanyPitches } from "./hooks/useCompanyPitches";
import { useBookmarkPitch } from "./hooks/useBookmarkPitch";
import { usePitchDetails } from "./hooks/usePitchDetails";
import { downloadPitch, viewPitch } from "./utils/pitchUtils";
import { useToast } from "../../components/ui/useToast";
import {
  Navigation,
  ChatInterface,
  PitchChat,
  PitchDetailsView,
  UploadArea,
} from "./components";
import type { TabId } from "./types/navigation";
import type { Pitch } from "./types/types";

const PitchAnalyzerApp = () => {
  const [activeTab, setActiveTab] = useState<TabId>("upload");
  const [selectedPitchForChat, setSelectedPitchForChat] =
    useState<Pitch | null>(null);
  const [selectedPitchForDetails, setSelectedPitchForDetails] =
    useState<Pitch | null>(null);
  const [downloadingPitchId, setDownloadingPitchId] = useState<string | null>(
    null
  );

  const { showToast } = useToast();

  const {
    pitches,
    error: pitchesError,
    clearError: clearPitchesError,
  } = useCompanyPitches();

  // Separate hook for bookmarked pitches
  const {
    pitches: bookmarkedPitches,
    fetchCompanyPitches: fetchBookmarkedPitches,
    isLoading: isLoadingBookmarked,
    error: bookmarkedPitchesError,
    clearError: clearBookmarkedPitchesError,
  } = useCompanyPitches();

  const {
    toggleBookmark,
    isLoading: bookmarkLoading,
    error: bookmarkError,
    lastBookmarkAction,
    clearError: clearBookmarkError,
  } = useBookmarkPitch();

  const {
    fetchPitchDetails,
    pitchDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    clearError: clearDetailsError,
  } = usePitchDetails();

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    // Clear selected pitches when changing tabs
    setSelectedPitchForChat(null);
    setSelectedPitchForDetails(null);

    // Fetch bookmarked pitches when switching to bookmarked tab
    if (tabId === "bookmarked") {
      fetchBookmarkedPitches();
    }
    // Note: Chat tab will fetch pitches automatically via ChatInterface component
  };

  const handleToggleBookmark = async (
    pitchId: string,
    currentBookmarkState: boolean
  ) => {
    try {
      await toggleBookmark(pitchId, currentBookmarkState);

      // Refresh the bookmarked pitches list if we're on the bookmarked tab
      if (activeTab === "bookmarked") {
        await fetchBookmarkedPitches();
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const handleViewPitchDetails = async (pitch: Pitch) => {
    setSelectedPitchForDetails(pitch);
    try {
      await fetchPitchDetails(pitch.id);
    } catch (error) {
      console.error("Failed to fetch pitch details:", error);
    }
  };

  const handleBackFromDetails = () => {
    setSelectedPitchForDetails(null);
    clearDetailsError();
  };

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

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userEmail="member1@company1.com"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-h-0 relative">
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Tab Content */}
            {activeTab === "upload" && (
              <UploadArea userEmail="member1@company1.com" />
            )}

            {activeTab === "bookmarked" && (
              <div className="space-y-8">
                {/* Enhanced Header Section */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center mb-6">
                    {/* <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <BookmarkIcon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white"></div>
                    </div> */}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Bookmarked Pitches
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Your saved pitch decks for quick access and analysis
                  </p>
                </div>

                {/* Premium Stats Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-8 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookmarkIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-1">
                          Saved Pitches
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {bookmarkedPitches.length}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total bookmarked</p>
                      <p className="text-xs text-gray-500">
                        Ready for analysis
                      </p>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingBookmarked && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">
                      Loading bookmarked pitches...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Please wait while we fetch your saved content
                    </p>
                  </div>
                )}

                {/* Bookmarked Pitches Grid */}
                {!isLoadingBookmarked && bookmarkedPitches.length > 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookmarkedPitches.map((pitch) => (
                        <div
                          key={pitch.id}
                          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        >
                          {/* Background hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                                  handleToggleBookmark(
                                    pitch.id,
                                    pitch.is_bookmarked
                                  )
                                }
                                disabled={bookmarkLoading}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  pitch.is_bookmarked
                                    ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                                } ${
                                  bookmarkLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title={
                                  pitch.is_bookmarked
                                    ? "Remove bookmark"
                                    : "Add bookmark"
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
                            {pitch.tagsinfo &&
                              Object.keys(pitch.tagsinfo).length > 0 && (
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
                                          {pitch.tagsinfo.Technology.length >
                                            1 && " +"}
                                        </span>
                                      )}
                                  </div>
                                </div>
                              )}

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-2">
                              {/* Primary Chat Button */}
                              <button
                                onClick={() => setSelectedPitchForChat(pitch)}
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
                                  onClick={() => handleViewPitchDetails(pitch)}
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
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingBookmarked && bookmarkedPitches.length === 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookmarkIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No bookmarked pitches yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start bookmarking pitches from the main list to see them
                      here
                    </p>
                    <button
                      onClick={() => handleTabChange("upload")}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Upload Pitch
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "chat" &&
              (selectedPitchForChat ? (
                <PitchChat
                  pitch={selectedPitchForChat}
                  onBack={() => setSelectedPitchForChat(null)}
                />
              ) : (
                <ChatInterface
                  onPitchSelect={(pitch: Pitch) => {
                    setSelectedPitchForChat(pitch);
                  }}
                  onViewDetails={(pitch: Pitch) => {
                    handleViewPitchDetails(pitch);
                  }}
                />
              ))}

            {/* Pitch Details View */}
            {selectedPitchForDetails && (
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleBackFromDetails}
                        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Pitch Details
                        </h2>
                        <p className="text-gray-600 text-lg">
                          {selectedPitchForDetails.title ||
                            selectedPitchForDetails.filename}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoadingDetails && (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
                      <p className="text-gray-600 font-medium text-lg">
                        Loading pitch details...
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Analyzing your pitch deck
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {detailsError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-red-800">
                            Error
                          </h3>
                          <p className="text-red-700 mt-1">{detailsError}</p>
                          <button
                            onClick={clearDetailsError}
                            className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pitch Details Content */}
                  {!isLoadingDetails && pitchDetails && (
                    <PitchDetailsView pitchDetails={pitchDetails} />
                  )}

                  {/* No Details Available */}
                  {!isLoadingDetails && !pitchDetails && !detailsError && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No details available
                      </h3>
                      <p className="text-gray-600">
                        Detailed analysis for this pitch deck is not available.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {pitchesError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-800">
                      Error Loading Pitches
                    </h3>
                    <p className="text-red-700 mt-1">{pitchesError}</p>
                  </div>
                  <button
                    onClick={clearPitchesError}
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {bookmarkedPitchesError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-800">
                      Error Loading Bookmarked Pitches
                    </h3>
                    <p className="text-red-700 mt-1">
                      {bookmarkedPitchesError}
                    </p>
                  </div>
                  <button
                    onClick={clearBookmarkedPitchesError}
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

            {/* Success Messages */}
            {lastBookmarkAction && (
              <div
                className={`rounded-xl p-6 mb-8 ${
                  lastBookmarkAction.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {lastBookmarkAction.success ? (
                      <CheckIcon className="h-6 w-6 text-green-400" />
                    ) : (
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${
                        lastBookmarkAction.success
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {lastBookmarkAction.success ? "Success!" : "Failed"}
                    </h3>
                    <p
                      className={`mt-1 ${
                        lastBookmarkAction.success
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Pitch{" "}
                      {lastBookmarkAction.isBookmarked
                        ? "bookmarked"
                        : "unbookmarked"}
                    </p>
                  </div>
                  <button
                    onClick={clearBookmarkError}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Pitches Display */}
            {pitches.length > 0 && (
              <div className="space-y-8">
                {/* Enhanced Header Section */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white"></div>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Company Pitches
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    AI-Powered Pitch Deck Analysis - Analyze and manage your
                    pitch collection
                  </p>
                </div>

                {/* Premium Stats Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-200/50 p-8 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                          Total Pitches
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pitches.length}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Available for analysis
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to view details
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {pitches.map((pitch) => (
                    <div
                      key={pitch.id}
                      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Background hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {pitch.title || pitch.filename}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Sector: {pitch.sector_category}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              Created:{" "}
                              {new Date(pitch.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleToggleBookmark(
                                  pitch.id,
                                  pitch.is_bookmarked
                                )
                              }
                              disabled={bookmarkLoading}
                              className={`p-3 rounded-xl transition-all duration-200 ${
                                pitch.is_bookmarked
                                  ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                              } ${
                                bookmarkLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                pitch.is_bookmarked
                                  ? "Remove bookmark"
                                  : "Add bookmark"
                              }
                            >
                              <BookmarkIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleViewPitchDetails(pitch)}
                              className="p-3 rounded-xl transition-all duration-200 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                              title="View Details"
                            >
                              <svg
                                className="w-5 h-5"
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
                            </button>
                          </div>
                        </div>

                        {pitch.tagsinfo &&
                          Object.keys(pitch.tagsinfo).length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                              <h4 className="font-medium text-sm mb-3 text-gray-700">
                                Key Information:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {pitch.tagsinfo.Ask && (
                                  <div className="bg-blue-50 rounded-lg p-3">
                                    <span className="font-medium text-blue-700 text-sm">
                                      Ask:
                                    </span>
                                    <p className="text-blue-600 text-sm mt-1">
                                      {pitch.tagsinfo.Ask}
                                    </p>
                                  </div>
                                )}
                                {pitch.tagsinfo.FundingStage && (
                                  <div className="bg-green-50 rounded-lg p-3">
                                    <span className="font-medium text-green-700 text-sm">
                                      Stage:
                                    </span>
                                    <p className="text-green-600 text-sm mt-1">
                                      {pitch.tagsinfo.FundingStage}
                                    </p>
                                  </div>
                                )}
                                {pitch.tagsinfo.Market && (
                                  <div className="bg-purple-50 rounded-lg p-3">
                                    <span className="font-medium text-purple-700 text-sm">
                                      Market:
                                    </span>
                                    <p className="text-purple-600 text-sm mt-1">
                                      {pitch.tagsinfo.Market}
                                    </p>
                                  </div>
                                )}
                                {pitch.tagsinfo.Technology &&
                                  pitch.tagsinfo.Technology.length > 0 && (
                                    <div className="bg-orange-50 rounded-lg p-3">
                                      <span className="font-medium text-orange-700 text-sm">
                                        Tech:
                                      </span>
                                      <p className="text-orange-600 text-sm mt-1">
                                        {pitch.tagsinfo.Technology.join(", ")}
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchAnalyzerApp;
