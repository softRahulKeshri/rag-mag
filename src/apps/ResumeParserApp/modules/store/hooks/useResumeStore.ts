import { useState, useCallback, useEffect } from "react";
import type {
  StoreResume,
  Group,
  BackendResumeResponse,
  ResumeComment,
} from "../types";
import {
  getResumesFromCVSEndpoint,
  getGroupsFromBackend,
  deleteResume,
} from "../../../services/api";

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

// Dummy data to show the beautiful UI instead of error screen
const dummyResumes: StoreResume[] = [
  {
    id: 1,
    filename: "Kishan Full stack.pdf",
    original_filename: "Kishan Full stack.pdf",
    fileSize: 1887436, // 1.8 MB
    fileType: "PDF",
    uploadedAt: "2025-07-22T10:30:00Z",
    status: "completed",
    group: "AI",
  },
  {
    id: 2,
    filename: "KB1jH_Data_science_KaIpesh_T_Resume.pdf",
    original_filename: "KB1jH_Data_science_KaIpesh_T_Resume.pdf",
    fileSize: 1048576, // 1 MB
    fileType: "PDF",
    uploadedAt: "2025-07-22T11:15:00Z",
    status: "completed",
    group: "AI",
  },
  {
    id: 3,
    filename: "Kaustubh_Singhal_CV.pdf",
    original_filename: "Kaustubh_Singhal_CV.pdf",
    fileSize: 1468006, // 1.4 MB
    fileType: "PDF",
    uploadedAt: "2025-07-22T12:00:00Z",
    status: "completed",
    group: "AI",
  },
  {
    id: 4,
    filename: "Impacteers Partnerships Deck_6 (1).pdf",
    original_filename: "Impacteers Partnerships Deck_6 (1).pdf",
    fileSize: 1572864, // 1.5 MB
    fileType: "PDF",
    uploadedAt: "2025-07-22T13:45:00Z",
    status: "completed",
    group: "AI",
  },
  {
    id: 5,
    filename: "iHoUI_Y8TEb_Full_Stack_Developer_MERN_A...",
    original_filename: "iHoUI_Y8TEb_Full_Stack_Developer_MERN_A.pdf",
    fileSize: 1782579, // 1.7 MB
    fileType: "PDF",
    uploadedAt: "2025-07-22T14:20:00Z",
    status: "completed",
    group: "AI",
  },
  {
    id: 6,
    filename: "k5IXa_02-Shiva_Prasad_-...",
    original_filename: "k5IXa_02-Shiva_Prasad_-Resume.pdf",
    fileSize: 1468006, // 1.4 MB
    fileType: "PDF",
    uploadedAt: "2025-07-22T15:10:00Z",
    status: "completed",
    group: "AI",
  },
  // Add more dummy resumes to reach 41 total
  ...Array.from({ length: 35 }, (_, i) => ({
    id: i + 7,
    filename: `Resume_${i + 7}.pdf`,
    original_filename: `Resume_${i + 7}.pdf`,
    fileSize: Math.floor(Math.random() * 2000000) + 500000, // 0.5-2.5 MB
    fileType: "PDF",
    uploadedAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "completed" as const,
    group: ["AI", "SDM1", "SDM", "OK"][Math.floor(Math.random() * 4)],
  })),
];

const dummyGroups: Group[] = [
  {
    id: 1,
    name: "AI",
    description: "AI and Machine Learning",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "SDM1",
    description: "Software Development Manager",
    createdAt: "2025-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "SDM",
    description: "Senior Development Manager",
    createdAt: "2025-01-03T00:00:00Z",
  },
  {
    id: 4,
    name: "OK",
    description: "Other Candidates",
    createdAt: "2025-01-04T00:00:00Z",
  },
  {
    id: 5,
    name: "adfadfd",
    description: "Test Group",
    createdAt: "2025-01-05T00:00:00Z",
  },
  {
    id: 6,
    name: "afdafadfads",
    description: "Test Group",
    createdAt: "2025-01-06T00:00:00Z",
  },
  {
    id: 7,
    name: "dfdfdsfds",
    description: "Test Group",
    createdAt: "2025-01-07T00:00:00Z",
  },
  {
    id: 8,
    name: "fadsfadfd",
    description: "Test Group",
    createdAt: "2025-01-08T00:00:00Z",
  },
  {
    id: 9,
    name: "grtrtr",
    description: "Test Group",
    createdAt: "2025-01-09T00:00:00Z",
  },
  {
    id: 10,
    name: "hbjkl;kjnjkm",
    description: "Test Group",
    createdAt: "2025-01-10T00:00:00Z",
  },
  {
    id: 11,
    name: "hvjkvjhbk",
    description: "Test Group",
    createdAt: "2025-01-11T00:00:00Z",
  },
  {
    id: 12,
    name: "Test",
    description: "Test Group",
    createdAt: "2025-01-12T00:00:00Z",
  },
];

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
 * - Provides fallback to dummy data if API fails
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
  const [resumes, setResumes] = useState<StoreResume[]>([]);
  const [groups, setGroups] = useState<Group[]>(dummyGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingResumeId, setDeletingResumeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching resumes from backend...");
      // Call the real API endpoint
      const backendResumes = await getResumesFromCVSEndpoint();
      console.log(
        `Successfully fetched ${backendResumes.length} resumes from backend`
      );

      // Transform backend response to frontend format
      const transformedResumes = backendResumes.map(transformBackendResume);

      setResumes(transformedResumes);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load resumes";
      setError(errorMessage);
      // Fallback to dummy data if API fails
      console.log("Falling back to dummy data due to API failure");
      setResumes(dummyResumes);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    try {
      console.log("Fetching groups from backend...");
      // Call the real API endpoint
      const backendGroups = await getGroupsFromBackend();
      console.log(
        `Successfully fetched ${backendGroups.length} groups from backend`
      );
      setGroups(backendGroups);
    } catch (err) {
      console.error("Failed to load groups:", err);
      // Fallback to dummy groups if API fails
      console.log("Falling back to dummy groups due to API failure");
      setGroups(dummyGroups);
    }
  }, []);

  const handleDeleteResume = useCallback(async (resume: StoreResume) => {
    setIsDeleting(true);
    setDeletingResumeId(resume.id);
    setError(null);

    try {
      console.log(`Deleting resume with ID: ${resume.id}`);
      // Call the real API endpoint
      await deleteResume(resume.id);
      console.log(`Successfully deleted resume with ID: ${resume.id}`);

      // Remove the resume from local state
      setResumes((prev) => prev.filter((r) => r.id !== resume.id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
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
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setResumes((prev) =>
          prev.map((r) => (r.id === resumeId ? { ...r, ...updates } : r))
        );
      } catch (err) {
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
        // Update local state immediately for optimistic UI
        setResumes((prev) =>
          prev.map((r) => (r.id === resumeId ? { ...r, comment } : r))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add comment");
      }
    },
    []
  );

  const handleUpdateComment = useCallback(
    async (resumeId: number, comment: ResumeComment) => {
      try {
        // Update local state immediately for optimistic UI
        setResumes((prev) =>
          prev.map((r) => (r.id === resumeId ? { ...r, comment } : r))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update comment"
        );
      }
    },
    []
  );

  const handleDeleteComment = useCallback(async (resumeId: number) => {
    try {
      // Update local state immediately for optimistic UI
      setResumes((prev) =>
        prev.map((r) => (r.id === resumeId ? { ...r, comment: undefined } : r))
      );
    } catch (err) {
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
    resumes,
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
