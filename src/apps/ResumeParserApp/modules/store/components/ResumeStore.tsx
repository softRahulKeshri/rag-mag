import React from "react";
import { ResumeCollection } from "./ResumeCollection";
import { useResumeStore } from "../hooks/useResumeStore";
import ErrorDisplay from "./ResumeCollection/ErrorDisplay";
import type { ResumeData } from "../types";

const ResumeStore: React.FC = () => {
  const {
    resumes,
    isLoading,
    error,
    clearError,
    refreshResumes,
    handleDeleteResume,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  } = useResumeStore();

  // Map status from ResumeData to expected format
  const mapStatus = (
    status: string
  ): "uploaded" | "processing" | "completed" | "failed" => {
    switch (status) {
      case "uploaded":
        return "uploaded";
      case "processing":
        return "processing";
      case "completed":
        return "completed";
      case "failed":
        return "failed";
      default:
        return "completed"; // Default to completed for existing resumes
    }
  };

  // Transform resumes to match the expected format for ResumeCollection
  const transformedResumes = resumes.map((resume) => ({
    ...resume,
    // Map status if needed
    status: mapStatus(resume.status),
  }));

  // Handle resume deletion
  const handleResumeDeleted = async (resume: ResumeData) => {
    try {
      await handleDeleteResume(resume);
      // Refresh resumes after successful deletion to ensure UI is in sync
      await refreshResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      // Error is already handled in the hook and will be displayed via the error state
      // The UI won't break - it will show the error message and allow retry
    }
  };

  // Handle resume updates (for comments)
  const handleResumeUpdated = async (
    resumeId: number,
    updates: Partial<ResumeData>
  ) => {
    try {
      console.log("🔄 ResumeStore: Handling resume update:", resumeId, updates);

      // If this is a comment update, use the appropriate comment handler
      if ("comment" in updates) {
        const comment = updates.comment;
        if (comment) {
          // Find if this is an add or update operation
          const existingResume = resumes.find((r) => r.id === resumeId);
          if (existingResume?.comment) {
            await handleUpdateComment(resumeId, comment);
          } else {
            await handleAddComment(resumeId, comment);
          }
        } else {
          // Comment was deleted
          await handleDeleteComment(resumeId);
        }
      }

      console.log("✅ ResumeStore: Resume update handled successfully");
    } catch (error) {
      console.error("❌ ResumeStore: Failed to update resume:", error);
    }
  };

  // Individual comment handlers for direct use by ResumeCollection
  const handleCommentAdded = async (
    resumeId: number,
    comment: ResumeData["comment"]
  ) => {
    if (comment) {
      console.log(
        "🔄 ResumeStore: Adding comment via direct handler:",
        resumeId,
        comment
      );
      await handleAddComment(resumeId, comment);
    }
  };

  const handleCommentUpdated = async (
    resumeId: number,
    comment: ResumeData["comment"]
  ) => {
    if (comment) {
      console.log(
        "🔄 ResumeStore: Updating comment via direct handler:",
        resumeId,
        comment
      );
      await handleUpdateComment(resumeId, comment);
    }
  };

  const handleCommentDeleted = async (resumeId: number) => {
    console.log(
      "🔄 ResumeStore: Deleting comment via direct handler:",
      resumeId
    );
    await handleDeleteComment(resumeId);
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            error={error}
            onDismiss={clearError}
            onRetry={refreshResumes}
          />
        </div>
      </div>
    );
  }

  return (
    <ResumeCollection
      resumes={transformedResumes}
      onDelete={handleResumeDeleted}
      onResumeDeleted={(resumeId: number) => {
        // This is handled by the onDelete callback
        console.log("Resume deleted:", resumeId);
      }}
      onResumeUpdated={handleResumeUpdated}
      onRefreshResumes={refreshResumes}
      onCommentAdded={handleCommentAdded}
      onCommentUpdated={handleCommentUpdated}
      onCommentDeleted={handleCommentDeleted}
      isLoading={isLoading}
      isDeleting={false} // Removed isDeleting and deletingResumeId as they are not in useResumeStore
      deletingResumeId={null} // Removed isDeleting and deletingResumeId as they are not in useResumeStore
    />
  );
};

export default ResumeStore;
