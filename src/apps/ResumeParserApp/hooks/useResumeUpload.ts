import { useState, useCallback } from "react";
import { useResumeStore } from "../store/resumeStore";
import { resumeAPI, handleAPIError } from "../services/api";
import type { Resume, UploadedFile } from "../types";

interface UseResumeUploadReturn {
  isUploading: boolean;
  selectedFiles: File[];
  uploadProgress: Record<string, number>;
  errors: Record<string, string>;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadedFiles: UploadedFile[];
  handleFileSelect: (files: FileList | File[]) => void;
  handleFileDrop: (files: FileList) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
  clearUploadedFiles: () => void;
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
    addUploadedFile,
    clearUploadedFiles: clearUploadedFilesStore,
    setUploadStatus,
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
          (existingFile) =>
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
      setUploadStatus("idle");
    },
    [validateFiles, addSelectedFiles, clearUploadErrors, setUploadStatus]
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
    setUploadStatus("idle");
  }, [clearSelectedFiles, setUploadStatus]);

  const clearUploadedFiles = useCallback(() => {
    clearUploadedFilesStore();
    setUploadStatus("idle");
  }, [clearUploadedFilesStore, setUploadStatus]);

  const uploadFiles = useCallback(
    async (groupId: string) => {
      if (uploadState.selectedFiles.length === 0) {
        throw new Error("No files selected for upload");
      }

      setIsUploading(true);
      setUploadState({ isUploading: true });
      setUploadStatus("uploading");

      try {
        // Create initial resume entries
        const initialResumes: Resume[] = uploadState.selectedFiles.map(
          (file) => ({
            id: `temp-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            original_filename: file.name,
            fileSize: file.size,
            uploadDate: new Date(),
            status: "uploading" as const,
            progress: 0,
            group: groupId,
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

        // Create uploaded file records for success state
        const uploadedFiles: UploadedFile[] = uploadState.selectedFiles.map(
          (file) => ({
            id: `uploaded-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            status: "success" as const,
            uploadedAt: new Date(),
          })
        );

        // Add uploaded files to store
        uploadedFiles.forEach((file) => addUploadedFile(file));

        // Update resumes with actual data from server
        uploadedResumes.forEach(() => {
          // Update the resume in store with actual data
          // This would need to be implemented in the store
        });

        // Clear selected files after successful upload
        clearSelectedFiles();
        setUploadStatus("success");
      } catch (error) {
        const apiError = handleAPIError(error);

        // Set error for each file
        uploadState.selectedFiles.forEach((file) => {
          setUploadError(file.name, apiError.message);
        });

        setUploadStatus("error");
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
      setUploadStatus,
      addUploadedFile,
    ]
  );

  return {
    isUploading,
    selectedFiles: uploadState.selectedFiles,
    uploadProgress: uploadState.uploadProgress,
    errors: uploadState.errors,
    uploadStatus: uploadState.uploadStatus,
    uploadedFiles: uploadState.uploadedFiles,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
    clearUploadedFiles,
    uploadFiles,
    validateFiles,
  };
};
