/**
 * Resume Analytics - Clean Analytics Dashboard Component
 *
 * A focused analytics interface displaying resume statistics.
 * Matches the modern dark theme design with essential metrics only.
 */

import React, { useState, useMemo, useEffect } from "react";

// Import all components
import AnalyticsHeader from "./AnalyticsHeader";
import SearchAndFilter from "./SearchAndFilter";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import ResumeGrid from "./ResumeGrid";
import ErrorDisplay from "./ErrorDisplay";

// Import types and utilities
import type {
  ResumeCollectionProps,
  StoreResume as Resume,
  ResumeComment,
  Group,
} from "../../types";
import { calculateGroupStats, filterResumes } from "./utils";

// Inline useGroups hook (minimal, no API calls)
function useGroups() {
  return {
    groups: [] as Group[],
    loading: false,
    error: null as string | null,
    refreshGroups: () => {},
    clearError: () => {},
  };
}

const ResumeCollection = ({
  resumes,
  onDelete = () => {},
  onResumeDeleted = () => {},
  onResumeUpdated = () => {},
  onRefreshResumes,
  isLoading = false,
  isDeleting = false,
  deletingResumeId = null,
}: ResumeCollectionProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Local state for managing resume updates (for comment changes)
  const [localResumes, setLocalResumes] = useState<Resume[]>(resumes);

  // Update local resumes when prop changes
  useEffect(() => {
    setLocalResumes(resumes);
  }, [resumes]);

  // Fetch groups using the useGroups hook
  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
    refreshGroups,
    clearError: clearGroupsError,
  } = useGroups();

  // Group statistics - now uses fetched groups and counts resumes in each
  const groupStats = useMemo(() => {
    return calculateGroupStats(groups, localResumes);
  }, [groups, localResumes]);

  // Filtered resumes - now considers both search and group filter
  const filteredResumes = useMemo(() => {
    return filterResumes(localResumes, searchQuery, selectedGroup);
  }, [localResumes, searchQuery, selectedGroup]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResumes = filteredResumes.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup]);

  // Enhanced Statistics - Only 2 essential metrics to avoid clutter
  const stats = useMemo(() => {
    const totalFiles = localResumes.length;
    const totalGroups = groups.length;

    return {
      totalFiles,
      totalGroups,
    };
  }, [localResumes, groups]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedGroup(null);
    setSearchQuery("");
  };

  // Comment handling functions
  const handleCommentAdded = async (
    resumeId: number,
    comment: ResumeComment
  ) => {
    console.log("Adding comment to resume:", resumeId, comment);

    // Update local state immediately for optimistic UI
    setLocalResumes((prev) => {
      const updated = prev.map((resume) =>
        resume.id === resumeId ? { ...resume, comment } : resume
      );
      console.log("Updated local resumes:", updated);
      return updated;
    });

    // Notify parent component
    const updatedResume = localResumes.find((r) => r.id === resumeId);
    if (updatedResume) {
      onResumeUpdated(resumeId, { ...updatedResume, comment });
    }

    // Refresh resumes from API to get the latest data
    if (onRefreshResumes) {
      try {
        await onRefreshResumes();
        console.log("✅ Resumes refreshed after adding comment");
      } catch (error) {
        console.error(
          "❌ Failed to refresh resumes after adding comment:",
          error
        );
      }
    }
  };

  const handleCommentUpdated = async (
    resumeId: number,
    comment: ResumeComment
  ) => {
    console.log("Updating comment for resume:", resumeId, comment);

    // Update local state immediately for optimistic UI
    setLocalResumes((prev) => {
      const updated = prev.map((resume) =>
        resume.id === resumeId ? { ...resume, comment } : resume
      );
      console.log("Updated local resumes:", updated);
      return updated;
    });

    // Notify parent component
    const updatedResume = localResumes.find((r) => r.id === resumeId);
    if (updatedResume) {
      onResumeUpdated(resumeId, { ...updatedResume, comment });
    }

    // Refresh resumes from API to get the latest data
    if (onRefreshResumes) {
      try {
        await onRefreshResumes();
        console.log("✅ Resumes refreshed after updating comment");
      } catch (error) {
        console.error(
          "❌ Failed to refresh resumes after updating comment:",
          error
        );
      }
    }
  };

  const handleCommentDeleted = async (resumeId: number) => {
    console.log("Deleting comment from resume:", resumeId);

    // Update local state immediately for optimistic UI
    setLocalResumes((prev) => {
      const updated = prev.map((resume) =>
        resume.id === resumeId ? { ...resume, comment: undefined } : resume
      );
      console.log("Updated local resumes:", updated);
      return updated;
    });

    // Notify parent component
    const updatedResume = localResumes.find((r) => r.id === resumeId);
    if (updatedResume) {
      onResumeUpdated(resumeId, { ...updatedResume, comment: undefined });
    }

    // Refresh resumes from API to get the latest data
    if (onRefreshResumes) {
      try {
        await onRefreshResumes();
        console.log("✅ Resumes refreshed after deleting comment");
      } catch (error) {
        console.error(
          "❌ Failed to refresh resumes after deleting comment:",
          error
        );
      }
    }
  };

  // Handle resume deletion with proper callback chaining
  const handleResumeDeleted = (resumeId: number) => {
    // Clear search if the deleted resume was in the current filtered results
    const deletedResume = filteredResumes.find((r) => r.id === resumeId);
    if (deletedResume && searchQuery.trim()) {
      // Check if this was the only result matching the search
      const remainingMatches = filteredResumes.filter((r) => r.id !== resumeId);
      if (remainingMatches.length === 0) {
        setSearchQuery("");
      }
    }

    // If we're on a page that will be empty after deletion, go to previous page
    if (paginatedResumes.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    // Call the parent callback to refresh data
    onResumeDeleted(resumeId);
  };

  // Handle pagination change
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <div className="w-full min-h-screen bg-white cursor-default px-4 py-4 md:px-8 md:py-6">
      {/* Analytics Header */}
      <AnalyticsHeader
        totalFiles={stats.totalFiles}
        totalGroups={stats.totalGroups}
      />

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groupStats={groupStats}
        groupsLoading={groupsLoading}
        groupsError={groupsError}
        clearGroupsError={clearGroupsError}
        refreshGroups={refreshGroups}
        isLoading={isLoading}
      />

      {/* Error Display */}
      {groupsError && (
        <div className="mb-6">
          <ErrorDisplay
            error={groupsError}
            onDismiss={clearGroupsError}
            onRetry={refreshGroups}
          />
        </div>
      )}

      {/* Content Section */}
      {isLoading ? (
        <LoadingState />
      ) : filteredResumes.length === 0 ? (
        <EmptyState
          selectedGroup={selectedGroup}
          searchQuery={searchQuery}
          clearAllFilters={clearAllFilters}
        />
      ) : (
        <ResumeGrid
          filteredResumes={filteredResumes}
          paginatedResumes={paginatedResumes}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          selectedGroup={selectedGroup}
          searchQuery={searchQuery}
          onDelete={onDelete}
          onResumeDeleted={handleResumeDeleted}
          onCommentAdded={handleCommentAdded}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
          onPageChange={handlePageChange}
          isDeleting={isDeleting}
          deletingResumeId={deletingResumeId}
        />
      )}
    </div>
  );
};

export default ResumeCollection;
