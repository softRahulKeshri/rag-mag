import { useState, useCallback, useEffect } from "react";
import { useResumes, useActions } from "../../../../../store";
import type { ResumeData } from "../../../../../types/global";
import type { BackendResumeResponse, Group, ResumeComment } from "../types";
import { getResumesFromCVSEndpoint, deleteResume } from "../../../services/api";
import { useGroupApi } from "../../../hooks/useGroupApi";

interface UseResumeStoreReturn {
  resumes: ResumeData[];
  groups: Group[];
  isLoading: boolean;
  isDeleting: boolean;
  deletingResumeId: number | null;
  error: string | null;
  clearError: () => void;
  refreshResumes: () => Promise<void>;
  refreshGroups: () => Promise<void>;
  handleDeleteResume: (resume: ResumeData) => Promise<void>;
  handleUpdateResume: (
    resumeId: number,
    updates: Partial<ResumeData>
  ) => Promise<void>;
  handleAddComment: (resumeId: number, comment: ResumeComment) => Promise<void>;
  handleUpdateComment: (
    resumeId: number,
    comment: ResumeComment
  ) => Promise<void>;
  handleDeleteComment: (resumeId: number) => Promise<void>;
}

// Utility function to transform backend response to StoreResume
const transformBackendResume = (
  backendResume: BackendResumeResponse
): ResumeData => {
  // Extract file type from filename
  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "unknown";
  };

  // Calculate file size (placeholder - you might want to get this from the API)
  const getFileSize = (): number => {
    return 1024 * 1024; // 1MB placeholder
  };

  const transformed: ResumeData = {
    id: backendResume.id,
    filename: backendResume.original_filename,
    originalFilename: backendResume.original_filename,
    storedFilename: backendResume.stored_filename,
    filepath: backendResume.filepath,
    fileSize: getFileSize(),
    fileType: getFileType(backendResume.original_filename),
    uploadedAt: backendResume.upload_time,
    status: "completed", // Assuming all resumes from API are completed
    group: backendResume.group,
    cloudUrl: backendResume.cloud_url || undefined,
    commentedAt: backendResume.commented_at || undefined,
    uploadTime: backendResume.upload_time,
    // New fields from API response
    name: backendResume.name,
    job_profile: backendResume.job_profile,
    days_available: backendResume.days_available,
    total_experience: backendResume.total_experience,
    // Comment data to preserve across tab switches
    comment: backendResume.comment
      ? {
          id: 0, // Placeholder ID
          resumeId: backendResume.id,
          comment: backendResume.comment,
          createdAt: backendResume.commented_at || new Date().toISOString(),
          updatedAt: backendResume.commented_at || new Date().toISOString(),
        }
      : undefined,
  };

  return transformed;
};

/**
 * Custom hook for managing resume store data with real API integration
 *
 * This hook fetches resumes from the backend API endpoint:
 * - POST /api/cvs with payload "{}"
 * - Transforms backend response to frontend format
 * - Uses useGroupApi hook for group management
 * - Handles loading states and error management
 *
 * Backend API Response Format:
 * {
 *   cloud_url: string,
 *   comment: string | null,
 *   commented_at: string | null,
 *   filepath: string,
 *   group: string,
 *   id: number,
 *   original_filename: string,
 *   stored_filename: string,
 *   upload_time: string
 * }
 */
export const useResumeStore = (): UseResumeStoreReturn => {
  // Global store hooks
  const { setResumes: setGlobalResumes } = useActions();
  const globalResumes = useResumes();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingResumeId, setDeletingResumeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use the Group API hook for group management
  const { getGroups } = useGroupApi();
  const [groups, setGroups] = useState<Group[]>([]);

  const refreshResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the Resume API hook to fetch resumes
      const backendResumes = await getResumesFromCVSEndpoint();
      const transformedResumes = backendResumes.map(transformBackendResume);
      setGlobalResumes(transformedResumes);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load resumes";
      setError(errorMessage);
      // Don't set resumes to empty array, keep existing data if any
    } finally {
      setIsLoading(false);
    }
  }, [setGlobalResumes]);

  const refreshGroups = useCallback(async () => {
    try {
      // Use the Group API hook to fetch groups
      const backendGroups = await getGroups();
      setGroups(backendGroups);
    } catch (err) {
      // Don't set groups to empty array, keep existing data if any
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load groups";
      console.warn(`Groups API error: ${errorMessage}`);
    }
  }, [getGroups]);

  const handleDeleteResume = useCallback(
    async (resume: ResumeData) => {
      setIsDeleting(true);
      setDeletingResumeId(resume.id);
      setError(null);

      try {
        // Call the real API endpoint
        await deleteResume(resume.id);

        // Remove the resume from global state
        setGlobalResumes(globalResumes.filter((r) => r.id !== resume.id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete resume";
        setError(errorMessage);
        throw err; // Re-throw to let the component handle the error
      } finally {
        setIsDeleting(false);
        setDeletingResumeId(null);
      }
    },
    [globalResumes, setGlobalResumes]
  );

  const handleUpdateResume = useCallback(
    async (resumeId: number, updates: Partial<ResumeData>) => {
      try {
        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) =>
            r.id === resumeId ? { ...r, ...updates } : r
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update resume"
        );
      }
    },
    [globalResumes, setGlobalResumes]
  );

  const handleAddComment = useCallback(
    async (resumeId: number, comment: ResumeComment) => {
      try {
        console.log(
          "🔄 useResumeStore: Adding comment for resume:",
          resumeId,
          comment
        );

        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) => (r.id === resumeId ? { ...r, comment } : r))
        );

        console.log("✅ useResumeStore: Comment added to global state");
      } catch (err) {
        console.error("❌ useResumeStore: Failed to add comment:", err);
        setError(err instanceof Error ? err.message : "Failed to add comment");
      }
    },
    [globalResumes, setGlobalResumes]
  );

  const handleUpdateComment = useCallback(
    async (resumeId: number, comment: ResumeComment) => {
      try {
        console.log(
          "🔄 useResumeStore: Updating comment for resume:",
          resumeId,
          comment
        );

        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) => (r.id === resumeId ? { ...r, comment } : r))
        );

        console.log("✅ useResumeStore: Comment updated in global state");
      } catch (err) {
        console.error("❌ useResumeStore: Failed to update comment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update comment"
        );
      }
    },
    [globalResumes, setGlobalResumes]
  );

  const handleDeleteComment = useCallback(
    async (resumeId: number) => {
      try {
        console.log(
          "🔄 useResumeStore: Deleting comment for resume:",
          resumeId
        );

        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) =>
            r.id === resumeId ? { ...r, comment: undefined } : r
          )
        );

        console.log("✅ useResumeStore: Comment deleted from global state");
      } catch (err) {
        console.error("❌ useResumeStore: Failed to delete comment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to delete comment"
        );
      }
    },
    [globalResumes, setGlobalResumes]
  );

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    refreshResumes();
    refreshGroups();
  }, [refreshResumes, refreshGroups]);

  return {
    resumes: globalResumes as ResumeData[], // Use global resumes with type assertion
    groups,
    isLoading,
    isDeleting,
    deletingResumeId,
    error,
    clearError,
    refreshResumes,
    refreshGroups,
    handleDeleteResume,
    handleUpdateResume,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};
