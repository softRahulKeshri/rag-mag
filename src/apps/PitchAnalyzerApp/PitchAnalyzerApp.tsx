import { useState } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useCompanyPitches } from "./hooks/useCompanyPitches";
import { useBookmarkPitch } from "./hooks/useBookmarkPitch";
import { Navigation, ChatInterface, PitchChat } from "./components";
import UploadArea from "./components/UploadArea";
import type { TabId } from "./types/navigation";
import type { Pitch } from "./types/types";

const PitchAnalyzerApp = () => {
  const [activeTab, setActiveTab] = useState<TabId>("upload");
  const [selectedPitchForChat, setSelectedPitchForChat] =
    useState<Pitch | null>(null);

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

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);

    // Fetch bookmarked pitches when switching to bookmarked tab
    if (tabId === "bookmarked") {
      fetchBookmarkedPitches("member1@company1.com", [], true);
    }
    // Note: Chat tab will fetch pitches automatically via ChatInterface component
  };

  const handleToggleBookmark = async (
    pitchId: string,
    currentBookmarkState: boolean
  ) => {
    try {
      await toggleBookmark(
        "member1@company1.com",
        pitchId,
        currentBookmarkState
      );

      // Refresh the bookmarked pitches list if we're on the bookmarked tab
      if (activeTab === "bookmarked") {
        await fetchBookmarkedPitches("member1@company1.com", [], true);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userEmail="member1@company1.com"
      />

      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Content */}
          {activeTab === "upload" && (
            <UploadArea userEmail="member1@company1.com" />
          )}

          {activeTab === "bookmarked" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bookmarked Pitches
                </h2>
                <p className="text-gray-600 mb-6">
                  Your saved pitch decks for quick access
                </p>

                {/* Loading State */}
                {isLoadingBookmarked && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">
                      Loading bookmarked pitches...
                    </p>
                  </div>
                )}

                {/* Bookmarked Pitches Display */}
                {!isLoadingBookmarked && bookmarkedPitches.length > 0 && (
                  <div className="grid gap-4">
                    {bookmarkedPitches.map((pitch) => (
                      <div
                        key={pitch.id}
                        className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {pitch.title || pitch.filename}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Sector: {pitch.sector_category}
                            </p>
                            <p className="text-sm text-gray-500">
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
                              className="p-2 rounded-full transition-colors text-yellow-500 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove bookmark"
                            >
                              ⭐
                            </button>
                          </div>
                        </div>

                        {pitch.tagsinfo &&
                          Object.keys(pitch.tagsinfo).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <h4 className="font-medium text-sm mb-2">
                                Key Information:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {pitch.tagsinfo.Ask && (
                                  <div>
                                    <span className="font-medium">Ask:</span>{" "}
                                    {pitch.tagsinfo.Ask}
                                  </div>
                                )}
                                {pitch.tagsinfo.FundingStage && (
                                  <div>
                                    <span className="font-medium">Stage:</span>{" "}
                                    {pitch.tagsinfo.FundingStage}
                                  </div>
                                )}
                                {pitch.tagsinfo.Market && (
                                  <div>
                                    <span className="font-medium">Market:</span>{" "}
                                    {pitch.tagsinfo.Market}
                                  </div>
                                )}
                                {pitch.tagsinfo.Technology &&
                                  pitch.tagsinfo.Technology.length > 0 && (
                                    <div>
                                      <span className="font-medium">Tech:</span>{" "}
                                      {pitch.tagsinfo.Technology.join(", ")}
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
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookmarkIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No bookmarked pitches yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Bookmark pitches from the main list to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "chat" &&
            (selectedPitchForChat ? (
              <PitchChat
                pitch={selectedPitchForChat}
                userEmail="member1@company1.com"
                onBack={() => setSelectedPitchForChat(null)}
              />
            ) : (
              <ChatInterface
                userEmail="member1@company1.com"
                onPitchSelect={(pitch: Pitch) => {
                  setSelectedPitchForChat(pitch);
                }}
              />
            ))}

          {/* Error Display */}
          {pitchesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{pitchesError}</p>
                  <button
                    onClick={clearPitchesError}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {bookmarkedPitchesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Bookmarked Pitches Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {bookmarkedPitchesError}
                  </p>
                  <button
                    onClick={clearBookmarkedPitchesError}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {bookmarkError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Bookmark Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{bookmarkError}</p>
                  <button
                    onClick={clearBookmarkError}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Messages */}
          {lastBookmarkAction && (
            <div
              className={`rounded-lg p-4 ${
                lastBookmarkAction.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {lastBookmarkAction.success ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      lastBookmarkAction.success
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {lastBookmarkAction.success ? "Success!" : "Failed"}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
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
              </div>
            </div>
          )}

          {/* Pitches Display */}
          {pitches.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Company Pitches ({pitches.length})
              </h2>
              <div className="grid gap-4">
                {pitches.map((pitch) => (
                  <div
                    key={pitch.id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {pitch.title || pitch.filename}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sector: {pitch.sector_category}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(pitch.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleToggleBookmark(pitch.id, pitch.is_bookmarked)
                          }
                          disabled={bookmarkLoading}
                          className={`p-2 rounded-full transition-colors ${
                            pitch.is_bookmarked
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-gray-400 hover:text-yellow-500"
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
                          ⭐
                        </button>
                      </div>
                    </div>

                    {pitch.tagsinfo &&
                      Object.keys(pitch.tagsinfo).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h4 className="font-medium text-sm mb-2">
                            Key Information:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {pitch.tagsinfo.Ask && (
                              <div>
                                <span className="font-medium">Ask:</span>{" "}
                                {pitch.tagsinfo.Ask}
                              </div>
                            )}
                            {pitch.tagsinfo.FundingStage && (
                              <div>
                                <span className="font-medium">Stage:</span>{" "}
                                {pitch.tagsinfo.FundingStage}
                              </div>
                            )}
                            {pitch.tagsinfo.Market && (
                              <div>
                                <span className="font-medium">Market:</span>{" "}
                                {pitch.tagsinfo.Market}
                              </div>
                            )}
                            {pitch.tagsinfo.Technology &&
                              pitch.tagsinfo.Technology.length > 0 && (
                                <div>
                                  <span className="font-medium">Tech:</span>{" "}
                                  {pitch.tagsinfo.Technology.join(", ")}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PitchAnalyzerApp;
