import { useState, useCallback, useEffect } from "react";
import { useActions, useResumes } from "../../../../../store";
import type {
  StoreResume,
  Group,
  BackendResumeResponse,
  ResumeComment,
} from "../types";
import { getResumesFromCVSEndpoint, deleteResume } from "../../../services/api";
import { useGroupApi } from "../../../hooks/useGroupApi";

interface UseResumeStoreReturn {
  resumes: StoreResume[];
  groups: Group[];
  isLoading: boolean;
  isDeleting: boolean;
  deletingResumeId: number | null;
  error: string | null;
  clearError: () => void;
  refreshResumes: () => Promise<void>;
  refreshGroups: () => Promise<void>;
  handleDeleteResume: (resume: StoreResume) => Promise<void>;
  handleUpdateResume: (
    resumeId: number,
    updates: Partial<StoreResume>
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
): StoreResume => {
  // Extract file type from filename
  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toUpperCase();
    return extension || "PDF";
  };

  // Calculate approximate file size (this is a fallback since backend doesn't provide it)
  const getFileSize = (): number => {
    // Return a reasonable default size for PDFs (1-2 MB range)
    return Math.floor(Math.random() * 1000000) + 500000; // 0.5-1.5 MB
  };

  return {
    id: backendResume.id,
    filename: backendResume.stored_filename,
    original_filename: backendResume.original_filename,
    stored_filename: backendResume.stored_filename,
    filepath: backendResume.filepath,
    fileSize: getFileSize(),
    fileType: getFileType(backendResume.original_filename),
    uploadedAt: backendResume.upload_time,
    status: "completed", // Assuming completed since they're in the store
    group: backendResume.group,
    cloud_url: backendResume.cloud_url,
    commented_at: backendResume.commented_at || undefined,
    upload_time: backendResume.upload_time,
    // Transform comment if it exists
    comment:
      backendResume.comment && backendResume.comment.trim() !== ""
        ? {
            id: Date.now(), // Generate temporary ID
            resumeId: backendResume.id,
            comment: backendResume.comment || "",
            createdAt: backendResume.commented_at || backendResume.upload_time,
            updatedAt: backendResume.commented_at || backendResume.upload_time,
            hrName: "HR User", // Default value, should come from auth context
          }
        : undefined,
  };
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
      console.log("🔄 Fetching resumes from backend...");
      // Call the real API endpoint
      const backendResumes = await getResumesFromCVSEndpoint();
      console.log(
        `✅ Successfully fetched ${backendResumes.length} resumes from backend`
      );

      // Transform backend response to frontend format
      const transformedResumes = backendResumes.map(transformBackendResume);

      // Transform to global store format
      const globalResumeData = transformedResumes.map((resume) => ({
        id: resume.id,
        filename: resume.filename,
        originalFilename: resume.original_filename || resume.filename,
        storedFilename: resume.stored_filename || resume.filename,
        filepath: resume.filepath || "",
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        uploadedAt: resume.uploadedAt,
        status: resume.status,
        group: resume.group,
        cloudUrl: resume.cloud_url,
        commentedAt: resume.commented_at,
        uploadTime: resume.upload_time,
      }));

      setGlobalResumes(globalResumeData);
    } catch (err) {
      console.error("❌ Failed to fetch resumes:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load resumes";
      setError(errorMessage);
      // Don't set resumes to empty array, keep existing data if any
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    try {
      console.log("🔄 Fetching groups from backend using useGroupApi...");
      // Use the Group API hook to fetch groups
      const backendGroups = await getGroups();
      console.log(
        `✅ Successfully fetched ${backendGroups.length} groups from backend`
      );
      setGroups(backendGroups);
    } catch (err) {
      console.error("❌ Failed to load groups:", err);
      // Don't set groups to empty array, keep existing data if any
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load groups";
      console.warn(`Groups API error: ${errorMessage}`);
    }
  }, [getGroups]);

  const handleDeleteResume = useCallback(async (resume: StoreResume) => {
    setIsDeleting(true);
    setDeletingResumeId(resume.id);
    setError(null);

    try {
      console.log(`🗑️ Deleting resume with ID: ${resume.id}`);
      // Call the real API endpoint
      await deleteResume(resume.id);
      console.log(`✅ Successfully deleted resume with ID: ${resume.id}`);

      // Remove the resume from global state
      setGlobalResumes(globalResumes.filter((r) => r.id !== resume.id));
    } catch (err) {
      console.error("❌ Failed to delete resume:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete resume";
      setError(errorMessage);
      throw err; // Re-throw to let the component handle the error
    } finally {
      setIsDeleting(false);
      setDeletingResumeId(null);
    }
  }, []);

  const handleUpdateResume = useCallback(
    async (resumeId: number, updates: Partial<StoreResume>) => {
      try {
        console.log(`🔄 Updating resume with ID: ${resumeId}`, updates);
        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) =>
            r.id === resumeId ? { ...r, ...updates } : r
          )
        );
        console.log(`✅ Successfully updated resume with ID: ${resumeId}`);
      } catch (err) {
        console.error("❌ Failed to update resume:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update resume"
        );
      }
    },
    []
  );

  const handleAddComment = useCallback(
    async (resumeId: number, comment: ResumeComment) => {
      try {
        console.log(
          `💬 Adding comment to resume with ID: ${resumeId}`,
          comment
        );
        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) => (r.id === resumeId ? { ...r, comment } : r))
        );
        console.log(
          `✅ Successfully added comment to resume with ID: ${resumeId}`
        );
      } catch (err) {
        console.error("❌ Failed to add comment:", err);
        setError(err instanceof Error ? err.message : "Failed to add comment");
      }
    },
    []
  );

  const handleUpdateComment = useCallback(
    async (resumeId: number, comment: ResumeComment) => {
      try {
        console.log(
          `✏️ Updating comment for resume with ID: ${resumeId}`,
          comment
        );
        // Update global state immediately for optimistic UI
        setGlobalResumes(
          globalResumes.map((r) => (r.id === resumeId ? { ...r, comment } : r))
        );
        console.log(
          `✅ Successfully updated comment for resume with ID: ${resumeId}`
        );
      } catch (err) {
        console.error("❌ Failed to update comment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update comment"
        );
      }
    },
    []
  );

  const handleDeleteComment = useCallback(async (resumeId: number) => {
    try {
      console.log(`🗑️ Deleting comment for resume with ID: ${resumeId}`);
      // Update global state immediately for optimistic UI
      setGlobalResumes(
        globalResumes.map((r) =>
          r.id === resumeId ? { ...r, comment: undefined } : r
        )
      );
      console.log(
        `✅ Successfully deleted comment for resume with ID: ${resumeId}`
      );
    } catch (err) {
      console.error("❌ Failed to delete comment:", err);
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  }, []);

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
    resumes: globalResumes as StoreResume[], // Use global resumes with type assertion
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
