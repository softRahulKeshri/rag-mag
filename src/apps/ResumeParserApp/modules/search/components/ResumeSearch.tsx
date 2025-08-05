import React, { useState, useCallback, useEffect } from "react";
import { useSearchApi } from "../../../hooks/useSearchApi";
import { useGroupApi } from "../../../hooks/useGroupApi";
import type { CandidateResult, Group } from "../types";

// Import components
import SearchResults from "./SearchResults";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import NoResults from "./NoResults";
import CompactSearchInput from "./CompactSearchInput";
import CompactUploadJD from "./CompactUploadJD";

/**
 * ResumeSearch Component - Premium Search Interface
 *
 * AI-powered resume search with sophisticated design and brand colors.
 * Features elegant gradients, smooth animations, and modern UI/UX.
 */
const ResumeSearch: React.FC = () => {
  // API hooks
  const { searchByText, searchByJobDescription, isLoading, error, clearError } =
    useSearchApi();
  const { getGroups } = useGroupApi();

  // State management
  const [searchMode, setSearchMode] = useState<"text" | "jd">("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<CandidateResult[]>([]);
  const [searchSummary, setSearchSummary] = useState<string | null>(null);

  // UI state
  const [hasSearched, setHasSearched] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsLoading(true);
      try {
        const groupsData = await getGroups();
        const transformedGroups: Group[] = groupsData.map((group) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          createdAt:
            group.createdAt || group.created_at || new Date().toISOString(),
          resumeCount: group.resumeCount || group.resume_count || 0,
        }));
        setGroups(transformedGroups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setGroups([]);
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [getGroups]);

  // Handle search mode change
  const handleSearchModeChange = useCallback(
    (mode: "text" | "jd") => {
      setSearchMode(mode);
      if (mode === "text") {
        setSelectedFile(null);
        setUploadError(null);
      } else {
        setSearchQuery("");
      }
      setSearchResults([]);
      setSearchSummary(null);
      setHasSearched(false);
      clearError();
    },
    [clearError]
  );

  // Handle text-based search
  const handleTextSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 5) {
      return;
    }

    setHasSearched(true);
    clearError();

    try {
      const groupParam =
        selectedGroup && selectedGroup.trim() ? selectedGroup : undefined;

      const result = await searchByText(searchQuery, groupParam);
      setSearchResults(result.results);
      setSearchSummary(result.summary);
    } catch (error) {
      console.error("Text search error:", error);
      setSearchResults([]);
      setSearchSummary(null);
    }
  }, [searchQuery, selectedGroup, searchByText, clearError]);

  // Handle job description upload and search
  const handleJDUpload = useCallback(async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }

    setHasSearched(true);
    setUploadError(null);
    clearError();

    try {
      const groupParam =
        selectedGroup && selectedGroup.trim() ? selectedGroup : undefined;

      const result = await searchByJobDescription(selectedFile, groupParam);
      setSearchResults(result.results);
      setSearchSummary(result.summary);
      setSelectedFile(null);
    } catch (error) {
      console.error("JD upload error:", error);
      setSearchResults([]);
      setSearchSummary(null);
    }
  }, [selectedFile, selectedGroup, searchByJobDescription, clearError]);

  // Clear all search states
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedGroup("");
    setSelectedFile(null);
    setSearchResults([]);
    setSearchSummary(null);
    setHasSearched(false);
    setUploadError(null);
    clearError();
  }, [clearError]);

  // Handle search results callback
  const handleSearchResults = useCallback((results: CandidateResult[]) => {
    console.log("Search results updated:", results.length, "candidates found");
  }, []);

  // Effect to call search results callback when results change
  useEffect(() => {
    if (searchResults.length > 0) {
      handleSearchResults(searchResults);
    }
  }, [searchResults, handleSearchResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-n100 via-neutral-n150 to-neutral-n200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Premium Search Interface */}
        <div className="max-w-5xl mx-auto mb-8">
          {/* AI Search Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-gradient-orange via-brand-gradient-purple to-brand-gradient-blue bg-clip-text text-transparent px-6 py-3 rounded-2xl">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-gradient-orange rounded-full animate-ping"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-gradient-orange via-brand-gradient-purple to-brand-gradient-blue bg-clip-text text-transparent">
                AI-Powered Resume Matching
              </span>
            </div>
          </div>

          {/* Premium Search Container */}
          <div className="relative">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-gradient-orange/10 via-brand-gradient-purple/10 to-brand-gradient-blue/10 rounded-3xl blur-xl"></div>

            {/* Main Search Container */}
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-brand-gradient-orange to-brand-gradient-purple rounded-full blur-3xl animate-pulse"></div>
                <div
                  className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-gradient-blue to-brand-gradient-cyan rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              {/* Search Mode Selector */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-neutral-n200 to-neutral-n300 rounded-2xl p-1.5 shadow-inner">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSearchModeChange("text")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                          searchMode === "text"
                            ? "bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple text-white shadow-lg transform scale-105"
                            : "text-neutral-n700 hover:text-neutral-n900 hover:bg-white/50"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        <span>Text Search</span>
                      </button>
                      <button
                        onClick={() => handleSearchModeChange("jd")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                          searchMode === "jd"
                            ? "bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue text-white shadow-lg transform scale-105"
                            : "text-neutral-n700 hover:text-neutral-n900 hover:bg-white/50"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                        <span>Upload JD</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Content */}
              <div className="relative z-10">
                {searchMode === "text" ? (
                  <CompactSearchInput
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    onSearch={handleTextSearch}
                    isSearching={isLoading}
                    groups={groups}
                  />
                ) : (
                  <CompactUploadJD
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    onUpload={handleJDUpload}
                    isUploading={isLoading}
                    groups={groups}
                    error={uploadError}
                    setError={setUploadError}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="text-red-800 font-semibold">Search Error</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Dismiss error"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <p className="text-red-700 mt-3 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        <LoadingState isSearching={isLoading} />

        {/* Empty State - shown when no search has been performed */}
        <EmptyState hasSearched={hasSearched} isSearching={isLoading} />

        {/* Search Results or No Results */}
        {hasSearched && !isLoading && (
          <>
            {searchResults.length > 0 ? (
              <SearchResults
                searchResults={searchResults}
                searchSummary={searchSummary}
                selectedGroup={selectedGroup}
                onClearSearch={clearSearch}
              />
            ) : (
              <NoResults onClearSearch={clearSearch} />
            )}
          </>
        )}

        {/* Groups Loading Indicator (for debugging) */}
        {import.meta.env.DEV && groupsLoading && (
          <div className="fixed bottom-4 left-4 bg-gradient-to-r from-brand-gradient-blue to-brand-gradient-cyan text-white px-4 py-2 rounded-full text-sm shadow-lg">
            Loading groups...
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSearch;
