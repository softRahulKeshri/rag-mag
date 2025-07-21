import React, { useState, useCallback } from "react";
import { useResumeStore } from "../store/resumeStore";
import ResumeCollection from "../ResumeCollection/ResumeCollection";
import type { Resume as ResumeCollectionResume } from "../ResumeCollection/types";
import type { IResume } from "../types";

const ResumeStore: React.FC = () => {
  const { resumes, deleteResume, updateResume } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);

  // Transform resumes from ResumeParserApp format to ResumeCollection format
  const transformResumes = useCallback((): ResumeCollectionResume[] => {
    return resumes.map((resume: IResume) => ({
      id: parseInt(resume.id) || Date.now(), // Convert string ID to number
      filename: resume.fileName,
      original_filename: resume.fileName,
      stored_filename: resume.fileName,
      filepath: `/resumes/${resume.id}`,
      fileSize: resume.fileSize,
      fileType: resume.fileName.split(".").pop() || "pdf",
      uploadedAt: resume.uploadDate.toISOString(),
      status: mapStatus(resume.status),
      group: resume.id.includes("group") ? resume.id.split("-")[0] : undefined,
      comment: undefined, // Will be populated if comments are added
    }));
  }, [resumes]);

  // Map status from ResumeParserApp to ResumeCollection format
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

  // Handle resume view
  const handleView = useCallback((resume: ResumeCollectionResume) => {
    console.log("Viewing resume:", resume);
    // Implement view functionality
  }, []);

  // Handle resume download
  const handleDownload = useCallback((resume: ResumeCollectionResume) => {
    console.log("Downloading resume:", resume);
    // Implement download functionality
  }, []);

  // Handle resume delete
  const handleDelete = useCallback((resume: ResumeCollectionResume) => {
    console.log("Deleting resume:", resume);
    // The actual deletion will be handled by onResumeDeleted
  }, []);

  // Handle resume deleted callback
  const handleResumeDeleted = useCallback(
    (resumeId: number) => {
      const resumeToDelete = resumes.find(
        (r: IResume) =>
          parseInt(r.id) === resumeId || r.id === resumeId.toString()
      );
      if (resumeToDelete) {
        deleteResume(resumeToDelete.id);
      }
    },
    [resumes, deleteResume]
  );

  // Handle resume updated callback
  const handleResumeUpdated = useCallback(
    (resumeId: number, updatedResume: ResumeCollectionResume) => {
      const resumeToUpdate = resumes.find(
        (r: IResume) =>
          parseInt(r.id) === resumeId || r.id === resumeId.toString()
      );
      if (resumeToUpdate) {
        // Transform back to ResumeParserApp format
        const transformedUpdate = {
          ...resumeToUpdate,
          fileName: updatedResume.filename,
          fileSize: updatedResume.fileSize,
          status: mapStatusBack(updatedResume.status),
          uploadDate: new Date(updatedResume.uploadedAt),
        };
        updateResume(resumeToUpdate.id, transformedUpdate);
      }
    },
    [resumes, updateResume]
  );

  // Map status back from ResumeCollection to ResumeParserApp format
  const mapStatusBack = (
    status: string
  ): "uploading" | "processing" | "completed" | "error" => {
    switch (status) {
      case "uploaded":
        return "uploading";
      case "processing":
        return "processing";
      case "completed":
        return "completed";
      case "failed":
        return "error";
      default:
        return "uploading";
    }
  };

  // Handle refresh resumes
  const handleRefreshResumes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API refresh - in real implementation, this would fetch from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Resumes refreshed");
    } catch (error) {
      console.error("Failed to refresh resumes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <ResumeCollection
        resumes={transformResumes()}
        onView={handleView}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onResumeDeleted={handleResumeDeleted}
        onResumeUpdated={handleResumeUpdated}
        onRefreshResumes={handleRefreshResumes}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ResumeStore;
