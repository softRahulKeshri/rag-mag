import { useState, useCallback } from "react";
import {
  ExclamationTriangleIcon,
  BookmarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const { showToast } = useToast();

  // Hook for bookmarked pitches
  const {
    pitches: bookmarkedPitches,
    fetchCompanyPitches: fetchBookmarkedPitches,
    isLoading: isLoadingBookmarked,
    error: bookmarkedPitchesError,
    clearError: clearBookmarkedPitchesError,
  } = useCompanyPitches();

  const { toggleBookmark, isLoading: bookmarkLoading } = useBookmarkPitch();

  const {
    fetchPitchDetails,
    pitchDetails,
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

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userEmail="member1@company1.com"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedPitches.map((pitch) => (
                      <div
                        key={pitch.id}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                              {pitch.title || pitch.filename}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Uploaded {formatDate(pitch.created_at)}
                            </p>
                            {pitch.description && (
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {pitch.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewPitch(pitch)}
                              className="p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              title="View Pitch"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadPitch(pitch)}
                              disabled={downloadingPitchId === pitch.id}
                              className="p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-green-600 hover:bg-green-50 disabled:opacity-50"
                              title="Download Pitch"
                            >
                              {downloadingPitchId === pitch.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                              ) : (
                                <ArrowDownTrayIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleToggleBookmark(
                                  pitch.id,
                                  pitch.is_bookmarked
                                )
                              }
                              disabled={bookmarkLoading}
                              className="p-2 rounded-lg transition-all duration-200 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
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
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingBookmarked && bookmarkedPitches.length === 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <BookmarkIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      No bookmarked pitches yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start by uploading pitch decks and bookmarking them for
                      quick access and analysis.
                    </p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                      Upload Your First Pitch
                    </button>
                  </div>
                )}

                {/* Error State */}
                {bookmarkedPitchesError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">
                          Error Loading Bookmarked Pitches
                        </h3>
                        <p className="text-red-600 mt-1">
                          {bookmarkedPitchesError}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearBookmarkedPitchesError}
                      className="mt-4 text-red-600 hover:text-red-800 font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "chat" && (
              <div className="space-y-8">
                {selectedPitchForChat ? (
                  <PitchChat
                    pitch={selectedPitchForChat}
                    onBack={() => setSelectedPitchForChat(null)}
                  />
                ) : selectedPitchForDetails ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleBackFromDetails}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Back to Chat
                      </button>
                    </div>
                    {pitchDetails && (
                      <PitchDetailsView pitchDetails={pitchDetails} />
                    )}
                  </div>
                ) : (
                  <ChatInterface
                    onPitchSelect={setSelectedPitchForChat}
                    onViewDetails={handleViewPitchDetails}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchAnalyzerApp;
