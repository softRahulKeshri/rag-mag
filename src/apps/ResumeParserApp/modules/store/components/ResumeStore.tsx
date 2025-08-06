import React from "react";
import { useResumeStore } from "../hooks/useResumeStore";
import ResumeCollection from "./ResumeCollection/ResumeCollection";
import ErrorDisplay from "./ResumeCollection/ErrorDisplay";
import type { StoreResume } from "../types";

const ResumeStore: React.FC = () => {
  const {
    resumes,
    isLoading,
    isDeleting,
    deletingResumeId,
    error,
    clearError,
    refreshResumes,
    handleDeleteResume,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  } = useResumeStore();

  const mapStatus = (
    status: string
  ): "uploaded" | "processing" | "completed" | "failed" => {
    switch (status) {
      case "uploading":
        return "uploaded";
      case "processing":
        return "processing";
      case "completed":
        return "completed";
      case "error":
        return "failed";
      default:
        return "uploaded";
    }
  };

  // Transform resumes to match the expected format
  const transformedResumes: StoreResume[] = resumes.map((resume) => ({
    ...resume,
    status: mapStatus(resume.status),
  }));

  // Handle resume deletion
  const handleResumeDeleted = async (resume: StoreResume) => {
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
    updates: Partial<StoreResume>
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
    comment: StoreResume["comment"]
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
    comment: StoreResume["comment"]
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
      isDeleting={isDeleting}
      deletingResumeId={deletingResumeId}
    />
  );
};

export default ResumeStore;
