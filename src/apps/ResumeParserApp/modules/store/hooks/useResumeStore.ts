import { useState, useCallback, useEffect } from "react";
import type { StoreResume, Group } from "../types";
import {
  getResumes,
  getGroups,
  deleteResume,
  updateResumeComment,
} from "../../../services/api";

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

export const useResumeStore = (): UseResumeStoreReturn => {
  const [resumes, setResumes] = useState<StoreResume[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  }, []);

  const handleDeleteResume = useCallback(async (resume: StoreResume) => {
    try {
      await deleteResume(resume.id.toString());
      setResumes((prev) => prev.filter((r) => r.id !== resume.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resume");
    }
  }, []);

  const handleUpdateResume = useCallback(
    async (resumeId: number, updates: Partial<StoreResume>) => {
      try {
        const updatedResume = await updateResumeComment(
          resumeId.toString(),
          updates
        );
        setResumes((prev) =>
          prev.map((r) => (r.id === resumeId ? { ...r, ...updatedResume } : r))
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
