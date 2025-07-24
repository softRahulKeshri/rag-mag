import { useCompanyPitches } from "./hooks/useCompanyPitches";
import { useBookmarkPitch } from "./hooks/useBookmarkPitch";

const PitchAnalyzerApp = () => {
  const {
    fetchCompanyPitches,
    pitches,
    isLoading: pitchesLoading,
    error: pitchesError,
    clearError: clearPitchesError,
  } = useCompanyPitches();

  const {
    toggleBookmark,
    isLoading: bookmarkLoading,
    error: bookmarkError,
    lastBookmarkAction,
    clearError: clearBookmarkError,
  } = useBookmarkPitch();

  const handleFetchPitches = async () => {
    try {
      // Example usage - replace with actual user email
      await fetchCompanyPitches("member1@company1.com", []);
    } catch (error) {
      console.error("Failed to fetch pitches:", error);
    }
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
      // Optionally refresh the pitches list to reflect the bookmark change
      // await fetchCompanyPitches("member1@company1.com", []);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Pitch Analyzer App</h1>
      <p className="mb-4">This is the pitch analyzer app landing page.</p>

      <div className="space-y-4">
        <button
          onClick={handleFetchPitches}
          disabled={pitchesLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {pitchesLoading ? "Fetching..." : "Fetch Company Pitches"}
        </button>

        {pitchesError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{pitchesError}</p>
            <button
              onClick={clearPitchesError}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Clear Error
            </button>
          </div>
        )}

        {bookmarkError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Bookmark Error:</p>
            <p>{bookmarkError}</p>
            <button
              onClick={clearBookmarkError}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Clear Error
            </button>
          </div>
        )}

        {lastBookmarkAction && (
          <div
            className={`p-4 border rounded ${
              lastBookmarkAction.success
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            <p className="font-bold">
              {lastBookmarkAction.success ? "Success!" : "Failed"}
            </p>
            <p>
              Pitch{" "}
              {lastBookmarkAction.isBookmarked ? "bookmarked" : "unbookmarked"}
            </p>
          </div>
        )}

        {pitches.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Company Pitches ({pitches.length})
            </h2>
            <div className="grid gap-4">
              {pitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm"
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
                          bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""
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

                  {pitch.tagsinfo && Object.keys(pitch.tagsinfo).length > 0 && (
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
    </div>
  );
};

export default PitchAnalyzerApp;
