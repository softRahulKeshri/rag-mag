import React, { useMemo } from "react";
import { useResumeStore } from "../hooks/useResumeStore";
import { NewResumeCollection } from "./ResumeCollection";
import type { StoreResume } from "../types";

const ResumeStore: React.FC = () => {
  const {
    resumes,
    groups,
    isLoading,
    error,
    refreshResumes,
    handleDeleteResume,
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

  // Transform groups to match the expected format for the new UI
  const transformedGroups = useMemo(() => {
    // Count resumes in each group
    const groupCounts = new Map<string, number>();
    transformedResumes.forEach((resume) => {
      if (resume.group) {
        groupCounts.set(resume.group, (groupCounts.get(resume.group) || 0) + 1);
      }
    });

    return groups.map((group) => ({
      name: group.name,
      count: groupCounts.get(group.name) || 0,
      isActive: (groupCounts.get(group.name) || 0) > 0,
    }));
  }, [groups, transformedResumes]);

  // Transform resumes to the format expected by NewResumeCollection
  const resumeCards = transformedResumes.map((resume) => ({
    id: resume.id,
    filename: resume.original_filename || resume.filename,
    fileSize: `${(resume.fileSize / (1024 * 1024)).toFixed(1)} MB`,
    fileType: resume.fileType,
    group: resume.group,
    uploadDate: new Date(resume.uploadedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  const handleView = (resume: (typeof resumeCards)[0]) => {
    console.log("View resume:", resume);
    // Implement view functionality
  };

  const handleDownload = (resume: (typeof resumeCards)[0]) => {
    console.log("Download resume:", resume);
    // Implement download functionality
  };

  const handleDelete = (resume: (typeof resumeCards)[0]) => {
    const storeResume = transformedResumes.find((r) => r.id === resume.id);
    if (storeResume) {
      handleDeleteResume(storeResume);
    }
  };

  const handleAddComment = (resume: (typeof resumeCards)[0]) => {
    console.log("Add comment to resume:", resume);
    // Implement comment functionality
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={refreshResumes}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <NewResumeCollection
      resumes={resumeCards}
      groups={transformedGroups}
      totalResumes={transformedResumes.length}
      totalGroups={groups.length}
      isLoading={isLoading}
      onView={handleView}
      onDownload={handleDownload}
      onDelete={handleDelete}
      onAddComment={handleAddComment}
    />
  );
};

export default ResumeStore;
