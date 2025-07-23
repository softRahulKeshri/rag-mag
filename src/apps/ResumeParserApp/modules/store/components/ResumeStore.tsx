import React from "react";
import { useResumeStore } from "../hooks/useResumeStore";
import ResumeCollection from "./ResumeCollection/ResumeCollection";
import type { StoreResume } from "../types";

const ResumeStore: React.FC = () => {
  const { resumes, isLoading, error, refreshResumes, handleDeleteResume } =
    useResumeStore();

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
      // Refresh resumes after deletion
      await refreshResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  // Handle resume updates (for comments)
  const handleResumeUpdated = async () => {
    try {
      // Refresh resumes to get the latest data
      await refreshResumes();
    } catch (error) {
      console.error("Failed to update resume:", error);
    }
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
    <ResumeCollection
      resumes={transformedResumes}
      onDelete={handleResumeDeleted}
      onResumeDeleted={(resumeId: number) => {
        // This is handled by the onDelete callback
        console.log("Resume deleted:", resumeId);
      }}
      onResumeUpdated={handleResumeUpdated}
      onRefreshResumes={refreshResumes}
      isLoading={isLoading}
    />
  );
};

export default ResumeStore;
