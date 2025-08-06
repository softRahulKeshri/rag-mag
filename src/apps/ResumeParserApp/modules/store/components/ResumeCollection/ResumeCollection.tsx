/**
 * Resume Analytics - Premium Analytics Dashboard Component
 *
 * A modern, premium analytics interface with elegant design patterns.
 * Features gradient backgrounds, glass morphism effects, and sophisticated animations.
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";

// Import all components
import AnalyticsHeader from "./AnalyticsHeader";
import SearchAndFilter from "./SearchAndFilter";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import ResumeGrid from "./ResumeGrid";
import ErrorDisplay from "./ErrorDisplay";

// Import types and utilities
import type { ResumeCollectionProps, Group } from "../../types";
import type { ResumeData, ResumeComment } from "../../../../../../types/global";
import { calculateGroupStats, filterResumes } from "./utils";
import { useGroupApi } from "../../../../hooks/useGroupApi";

const ResumeCollection = ({
  resumes,
  onDelete = () => {},
  onResumeDeleted = () => {},
  onResumeUpdated = () => {},
  onRefreshResumes,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
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
  const [localResumes, setLocalResumes] = useState<ResumeData[]>(resumes);

  // Update local resumes when prop changes
  useEffect(() => {
    setLocalResumes(resumes);
  }, [resumes]);

  // Fetch groups using the useGroupApi hook
  const {
    getGroups,
    isLoading: groupsLoading,
    error: groupsError,
    clearError: clearGroupsError,
  } = useGroupApi();

  // State for managing groups
  const [groups, setGroups] = useState<Group[]>([]);

  // Function to refresh groups
  const refreshGroups = useCallback(async () => {
    try {
      console.log("🔄 Refreshing groups in ResumeCollection...");
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
      console.log(`✅ Successfully refreshed ${fetchedGroups.length} groups`);
    } catch (error) {
      console.error("❌ Failed to refresh groups in ResumeCollection:", error);
    }
  }, [getGroups]);

  // Load groups on component mount
  useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);

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
    console.log(
      "📝 ResumeCollection: Adding comment to resume:",
      resumeId,
      comment
    );

    try {
      // Use direct handler if available (preferred approach)
      if (onCommentAdded) {
        await onCommentAdded(resumeId, comment);
        console.log("✅ ResumeCollection: Comment added via direct handler");
      } else {
        // Fallback to legacy approach
        console.log("⚠️ ResumeCollection: Using fallback comment handling");

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
          await onRefreshResumes();
          console.log("✅ Resumes refreshed after adding comment");
        }
      }
    } catch (error) {
      console.error("❌ ResumeCollection: Failed to add comment:", error);
    }
  };

  const handleCommentUpdated = async (
    resumeId: number,
    comment: ResumeComment
  ) => {
    console.log(
      "✏️ ResumeCollection: Updating comment for resume:",
      resumeId,
      comment
    );

    try {
      // Use direct handler if available (preferred approach)
      if (onCommentUpdated) {
        await onCommentUpdated(resumeId, comment);
        console.log("✅ ResumeCollection: Comment updated via direct handler");
      } else {
        // Fallback to legacy approach
        console.log("⚠️ ResumeCollection: Using fallback comment handling");

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
          await onRefreshResumes();
          console.log("✅ Resumes refreshed after updating comment");
        }
      }
    } catch (error) {
      console.error("❌ ResumeCollection: Failed to update comment:", error);
    }
  };

  const handleCommentDeleted = async (resumeId: number) => {
    console.log("🗑️ ResumeCollection: Deleting comment from resume:", resumeId);

    try {
      // Use direct handler if available (preferred approach)
      if (onCommentDeleted) {
        await onCommentDeleted(resumeId);
        console.log("✅ ResumeCollection: Comment deleted via direct handler");
      } else {
        // Fallback to legacy approach
        console.log("⚠️ ResumeCollection: Using fallback comment handling");

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
          await onRefreshResumes();
          console.log("✅ Resumes refreshed after deleting comment");
        }
      }
    } catch (error) {
      console.error("❌ ResumeCollection: Failed to delete comment:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
          <div className="mb-6 sm:mb-8">
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
    </div>
  );
};

export default ResumeCollection;
