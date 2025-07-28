import React, { useState, useCallback, useEffect } from "react";
import { useSearchApi } from "../../../hooks/useSearchApi";
import { useGroupApi } from "../../../hooks/useGroupApi";
import type { CandidateResult, Group } from "../types";

// Import all the new components
import HeroSection from "./HeroSection";
import SearchInput from "./SearchInput";
import UploadJD from "./UploadJD";
import SearchResults from "./SearchResults";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import NoResults from "./NoResults";

/**
 * ResumeSearch Component - Main Search Interface
 *
 * AI-powered resume search with text and job description upload capabilities.
 *
 * Features:
 * - Dual search modes (text search and JD upload)
 * - Real-time group filtering
 * - AI-powered candidate scoring and ranking
 * - Modern UI with loading states and error handling
 * - Responsive design with professional animations
 * - Integration with existing API architecture
 */
const ResumeSearch: React.FC = () => {
  // API hooks
  const { searchByText, searchByJobDescription, isLoading, error, clearError } =
    useSearchApi();
  const { getGroups } = useGroupApi();

  // State management
  const [activeTab, setActiveTab] = useState(0); // 0 = text search, 1 = JD upload
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
        // Transform to match our Group interface
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
        // Continue with empty groups - don't block the search functionality
        setGroups([]);
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [getGroups]);

  // Handle tab change between text search and JD upload
  const handleTabChange = useCallback(
    (_: React.MouseEvent<HTMLButtonElement>, newValue: number) => {
      setActiveTab(newValue);
      // Clear relevant states when switching tabs
      if (newValue === 0) {
        // Switching to text search
        setSelectedFile(null);
        setUploadError(null);
      } else {
        // Switching to JD upload
        setSearchQuery("");
      }

      // Clear previous results and errors
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
      const result = await searchByText(
        searchQuery,
        selectedGroup || undefined
      );
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
      const result = await searchByJobDescription(
        selectedFile,
        selectedGroup || undefined
      );
      setSearchResults(result.results);
      setSearchSummary(result.summary);
      setSelectedFile(null); // Clear file after successful upload
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

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearError]);

  // Handle search results callback (for potential parent component integration)
  const handleSearchResults = useCallback((results: CandidateResult[]) => {
    // This could be used to notify parent components about search results
    console.log("Search results updated:", results.length, "candidates found");
  }, []);

  // Effect to call search results callback when results change
  useEffect(() => {
    if (searchResults.length > 0) {
      handleSearchResults(searchResults);
    }
  }, [searchResults, handleSearchResults]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section with Tab Navigation */}
        <HeroSection activeTab={activeTab} onTabChange={handleTabChange}>
          {activeTab === 0 ? (
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              onSearch={handleTextSearch}
              isSearching={isLoading}
              groups={groups}
            />
          ) : (
            <UploadJD
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
        </HeroSection>

        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-red-800 font-medium">Search Error</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 p-1"
                title="Dismiss error"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
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
          <div className="fixed bottom-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
            Loading groups...
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSearch;
