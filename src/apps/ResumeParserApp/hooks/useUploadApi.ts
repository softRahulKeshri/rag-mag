import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import { UPLOAD_CONFIG } from "../theme/constants";
import type { UploadResult } from "../types/api";

/**
 * Upload API Hook
 *
 * Handles file upload operations including:
 * - Uploading CVs to specific groups
 * - Progress tracking
 * - File validation
 * - Error handling and loading states
 */
export const useUploadApi = () => {
  const { handleApiError } = useApiService();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate files before upload
   */
  const validateFiles = useCallback((files: File[]): string[] => {
    const errors: string[] = [];

    files.forEach((file) => {
      // Check file size
      if (file.size > UPLOAD_CONFIG.maxFileSize) {
        errors.push(
          `${file.name} is too large. Maximum size is ${
            UPLOAD_CONFIG.maxFileSize / (1024 * 1024)
          }MB.`
        );
      }

      // Check file type - allow PDF files
      if (file.type !== "application/pdf") {
        errors.push(
          `${file.name} is not a supported file type. Please upload PDF files only.`
        );
      }
    });

    // Check total number of files
    if (files.length > UPLOAD_CONFIG.maxFiles) {
      errors.push(
        `Too many files. Maximum allowed is ${UPLOAD_CONFIG.maxFiles} files.`
      );
    }

    return errors;
  }, []);

  /**
   * Upload CVs to a specific group
   * POST /upload_cv with group name in FormData
   */
  const uploadCVsToGroup = useCallback(
    async (
      files: File[],
      groupName: string,
      onProgress?: (fileName: string, progress: number) => void
    ): Promise<UploadResult> => {
      setIsUploading(true);
      setError(null);
      setUploadProgress({});

      try {
        // Validate files first
        const validationErrors = validateFiles(files);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }

        const url = "/upload_cv";
        console.log(
          `📤 Upload API: Uploading ${files.length} CVs to group "${groupName}" at: ${url}`
        );

        // Create FormData
        const formData = new FormData();
        formData.append("group", groupName);

        files.forEach((file) => {
          formData.append("cv", file);
        });

        // Use XMLHttpRequest for upload progress
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Add upload progress tracking
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);

              // Update progress for all files
              files.forEach((file) => {
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: percentComplete,
                }));
                onProgress?.(file.name, percentComplete);
              });
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response: UploadResult = JSON.parse(xhr.responseText);
                console.log("📡 Upload API Response:", response);
                resolve(response);
              } catch (parseError) {
                console.error("❌ Error parsing upload response:", parseError);
                reject(new Error("Invalid response format"));
              }
            } else {
              console.error("❌ Upload failed with status:", xhr.status);
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          });

          xhr.addEventListener("error", () => {
            console.error("❌ Upload network error");
            reject(new Error("Network error during upload"));
          });

          xhr.open("POST", url);
          xhr.send(formData);
        });
      } catch (error) {
        console.error("❌ Error uploading CVs:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    [validateFiles, handleApiError]
  );

  /**
   * Upload a single CV with progress tracking
   */
  const uploadSingleCV = useCallback(
    async (
      file: File,
      groupName: string,
      onProgress?: (progress: number) => void
    ): Promise<UploadResult> => {
      return uploadCVsToGroup([file], groupName, (fileName, progress) => {
        if (fileName === file.name) {
          onProgress?.(progress);
        }
      });
    },
    [uploadCVsToGroup]
  );

  /**
   * Clear upload progress and errors
   */
  const clearUploadState = useCallback(() => {
    setUploadProgress({});
    setError(null);
  }, []);

  return {
    // State
    isUploading,
    uploadProgress,
    error,

    // Actions
    uploadCVsToGroup,
    uploadSingleCV,
    validateFiles,
    clearUploadState,
  };
};
