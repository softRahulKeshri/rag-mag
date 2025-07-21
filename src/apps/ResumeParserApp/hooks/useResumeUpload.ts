import { useState, useCallback } from "react";
import { useResumeStore } from "../store/resumeStore";
import { resumeAPI, handleAPIError } from "../services/api";
import type { IResume } from "../types";

interface UseResumeUploadReturn {
  isUploading: boolean;
  selectedFiles: File[];
  uploadProgress: Record<string, number>;
  errors: Record<string, string>;
  handleFileSelect: (files: FileList | File[]) => void;
  handleFileDrop: (files: FileList) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
  uploadFiles: (groupId: string) => Promise<void>;
  validateFiles: (files: File[]) => string[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const useResumeUpload = (): UseResumeUploadReturn => {
  const {
    uploadState,
    setUploadState,
    addSelectedFiles,
    removeSelectedFile,
    clearSelectedFiles,
    setUploadProgress,
    setUploadError,
    clearUploadErrors,
    addResume,
  } = useResumeStore();

  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = useCallback(
    (files: File[]): string[] => {
      const errors: string[] = [];

      files.forEach((file) => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name} is too large. Maximum size is 10MB.`);
        }

        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push(
            `${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, or TXT files.`
          );
        }

        // Check for duplicate files
        const existingFiles = uploadState.selectedFiles;
        const isDuplicate = existingFiles.some(
          (existingFile: File) =>
            existingFile.name === file.name && existingFile.size === file.size
        );

        if (isDuplicate) {
          errors.push(`${file.name} is already selected.`);
        }
      });

      return errors;
    },
    [uploadState.selectedFiles]
  );

  const handleFileSelect = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const errors = validateFiles(fileArray);

      if (errors.length > 0) {
        // Show errors to user (you can implement a toast notification here)
        console.error("File validation errors:", errors);
        return;
      }

      addSelectedFiles(fileArray);
      clearUploadErrors();
    },
    [validateFiles, addSelectedFiles, clearUploadErrors]
  );

  const handleFileDrop = useCallback(
    (files: FileList) => {
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const removeFile = useCallback(
    (fileName: string) => {
      removeSelectedFile(fileName);
    },
    [removeSelectedFile]
  );

  const clearFiles = useCallback(() => {
    clearSelectedFiles();
  }, [clearSelectedFiles]);

  const uploadFiles = useCallback(
    async (groupId: string) => {
      if (uploadState.selectedFiles.length === 0) {
        throw new Error("No files selected for upload");
      }

      setIsUploading(true);
      setUploadState({ isUploading: true });

      try {
        // Create initial resume entries
        const initialResumes: IResume[] = uploadState.selectedFiles.map(
          (file: File) => ({
            id: `temp-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileSize: file.size,
            uploadDate: new Date(),
            status: "uploading" as const,
            progress: 0,
          })
        );

        // Add initial resumes to store
        initialResumes.forEach((resume) => addResume(resume));

        // Upload files with progress tracking
        const uploadedResumes = await resumeAPI.upload(
          uploadState.selectedFiles,
          groupId,
          (fileName, progress) => {
            setUploadProgress(fileName, progress);

            // Update resume progress in store
            const resume = initialResumes.find((r) => r.fileName === fileName);
            if (resume) {
              // Find the actual resume in store and update it
              // This would need to be implemented in the store
            }
          }
        );

        // Update resumes with actual data from server
        uploadedResumes.forEach(() => {
          // Update the resume in store with actual data
          // This would need to be implemented in the store
        });

        // Clear selected files after successful upload
        clearSelectedFiles();
      } catch (error) {
        const apiError = handleAPIError(error);

        // Set error for each file
        uploadState.selectedFiles.forEach((file: File) => {
          setUploadError(file.name, apiError.message);
        });

        throw apiError;
      } finally {
        setIsUploading(false);
        setUploadState({ isUploading: false });
      }
    },
    [
      uploadState.selectedFiles,
      setIsUploading,
      setUploadState,
      addResume,
      setUploadProgress,
      clearSelectedFiles,
      setUploadError,
    ]
  );

  return {
    isUploading,
    selectedFiles: uploadState.selectedFiles,
    uploadProgress: uploadState.uploadProgress,
    errors: uploadState.errors,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
    uploadFiles,
    validateFiles,
  };
};
