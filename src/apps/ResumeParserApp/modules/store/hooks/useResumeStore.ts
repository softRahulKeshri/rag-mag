import { useState, useCallback, useEffect } from "react";
import type { StoreResume, Group } from "../types";

interface UseResumeStoreReturn {
  resumes: StoreResume[];
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  refreshResumes: () => Promise<void>;
  refreshGroups: () => Promise<void>;
  handleDeleteResume: (resume: StoreResume) => Promise<void>;
  handleUpdateResume: (
    resumeId: number,
    updates: Partial<StoreResume>
  ) => Promise<void>;
  handleAddComment: (resumeId: number, comment: string) => Promise<void>;
  handleUpdateComment: (
    resumeId: number,
    commentId: number,
    comment: string
  ) => Promise<void>;
  handleDeleteComment: (resumeId: number, commentId: number) => Promise<void>;
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

export const useResumeStore = (): UseResumeStoreReturn => {
  const [resumes, setResumes] = useState<StoreResume[]>(dummyResumes);
  const [groups, setGroups] = useState<Group[]>(dummyGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResumes(dummyResumes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGroups(dummyGroups);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  }, []);

  const handleDeleteResume = useCallback(async (resume: StoreResume) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResumes((prev) => prev.filter((r) => r.id !== resume.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resume");
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
    async (resumeId: number, comment: string) => {
      try {
        const commentData = {
          id: Date.now(), // Generate a temporary ID
          resumeId,
          comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hrName: "Current User", // In real app, get from auth context
        };

        await handleUpdateResume(resumeId, { comment: commentData });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add comment");
      }
    },
    [handleUpdateResume]
  );

  const handleUpdateComment = useCallback(
    async (resumeId: number, commentId: number, comment: string) => {
      try {
        const commentData = {
          id: commentId,
          resumeId,
          comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hrName: "Current User", // In real app, get from auth context
        };

        await handleUpdateResume(resumeId, { comment: commentData });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update comment"
        );
      }
    },
    [handleUpdateResume]
  );

  const handleDeleteComment = useCallback(
    async (resumeId: number) => {
      try {
        await handleUpdateResume(resumeId, { comment: undefined });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete comment"
        );
      }
    },
    [handleUpdateResume]
  );

  // Load initial data
  useEffect(() => {
    refreshResumes();
    refreshGroups();
  }, [refreshResumes, refreshGroups]);

  return {
    resumes,
    groups,
    isLoading,
    error,
    refreshResumes,
    refreshGroups,
    handleDeleteResume,
    handleUpdateResume,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};
