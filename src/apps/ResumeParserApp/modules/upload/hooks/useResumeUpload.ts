import { useState, useCallback, useRef } from "react";
import type { UploadState, UploadedFile } from "../types";
import { uploadResume } from "../../../services/api";
import { useToast } from "../../../../../components/ui/useToast";

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
  cancelUpload: () => void;
  validateFiles: (files: File[]) => string[];
}

export const useResumeUpload = (): UseResumeUploadReturn => {
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    selectedFiles: [],
    uploadProgress: {},
    errors: {},
    uploadStatus: "idle",
    uploadedFiles: [],
  });

  const validateFiles = useCallback((files: File[]): string[] => {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [".pdf", ".doc", ".docx"];

    files.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large. Maximum size is 10MB.`);
      }

      // Check file type
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));
      if (!allowedTypes.includes(fileExtension)) {
        errors.push(`${file.name} is not a supported file type.`);
      }
    });

    return errors;
  }, []);

  const handleFileSelect = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const errors = validateFiles(fileArray);

      if (errors.length > 0) {
        setUploadState((prev) => ({
          ...prev,
          errors: errors.reduce(
            (acc, error) => ({ ...acc, [error]: error }),
            {}
          ),
        }));
        return;
      }

      setUploadState((prev) => ({
        ...prev,
        selectedFiles: [...prev.selectedFiles, ...fileArray],
        errors: {},
      }));
    },
    [validateFiles]
  );

  const handleFileDrop = useCallback(
    (files: FileList) => {
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const removeFile = useCallback((fileName: string) => {
    setUploadState((prev) => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter(
        (file) => file.name !== fileName
      ),
      errors: Object.fromEntries(
        Object.entries(prev.errors).filter(([key]) => !key.includes(fileName))
      ),
    }));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadState((prev) => ({
      ...prev,
      selectedFiles: [],
      errors: {},
    }));
  }, []);

  const clearUploadedFiles = useCallback(() => {
    setUploadState((prev) => ({
      ...prev,
      uploadedFiles: [],
      uploadStatus: "idle",
    }));
  }, []);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const uploadFiles = useCallback(
    async (groupId: string) => {
      if (uploadState.selectedFiles.length === 0) return;

      // Create new abort controller for this upload
      abortControllerRef.current = new AbortController();

      setUploadState((prev) => ({
        ...prev,
        isUploading: true,
        uploadStatus: "uploading",
        uploadProgress: {},
        errors: {},
      }));

      try {
        const targetProgress = 90; // Target 90% before API completion
        
        // Use the corrected API that handles multiple files in a single request
        const progressCallback = (progress: number) => {
          // Smooth progress animation - gradually increase to 90%
          const smoothProgress = Math.min(progress * 0.9, targetProgress);
          
          // Update overall progress for all files
          setUploadState((prev) => ({
            ...prev,
            uploadProgress: {
              overall: smoothProgress,
            },
          }));
        };

        const uploadResult = await uploadResume(
          uploadState.selectedFiles,
          groupId,
          progressCallback,
          abortControllerRef.current?.signal
        );



        // Animate progress to 100%
        const progressInterval = setInterval(() => {
          setUploadState((prev) => {
            const currentProgress = prev.uploadProgress.overall || 0;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              return prev;
            }
            return {
              ...prev,
              uploadProgress: {
                overall: Math.min(currentProgress + 2, 100),
              },
            };
          });
        }, 50);

        // Convert UploadResult to UploadedFile array
        const uploadedFilesArray: UploadedFile[] = uploadResult.results.map(
          (result) => {
            // Find the original file to get its size
            const originalFile = uploadState.selectedFiles.find(
              (file) =>
                file.name === (result.original_filename || result.filename)
            );

            return {
              id: result.id.toString(),
              name: result.original_filename || result.filename,
              size: originalFile?.size || 0, // Use original file size instead of API response
              status: "success" as const,
              uploadedAt: new Date(result.uploadedAt),
            };
          }
        );

        // Show success toast
        if (uploadResult.successful > 0) {
          showToast(
            `Successfully uploaded ${uploadResult.successful} file(s)`,
            "success"
          );
        }

        // Show error toast for failed uploads
        if (uploadResult.failed > 0) {
          showToast(
            `${uploadResult.failed} file(s) failed to upload`,
            "error"
          );
        }

        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          uploadStatus: uploadResult.successful > 0 ? "success" : "error",
          selectedFiles: [],
          uploadProgress: {},
          uploadedFiles: [...prev.uploadedFiles, ...uploadedFilesArray],
          errors: uploadResult.errors.reduce(
            (acc, error) => ({ ...acc, [error.filename]: error.error }),
            {}
          ),
        }));
      } catch (error) {
        console.error("Upload failed:", error);
        
        // Check if it's an abort error
        if (error instanceof Error && error.name === 'AbortError') {
          showToast("Upload cancelled", "warning");
        } else {
          showToast("Upload failed. Please try again.", "error");
        }
        
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          uploadStatus: "error",
          errors: { upload: "Upload failed. Please try again." },
        }));
      } finally {
        abortControllerRef.current = null;
      }
    },
    [uploadState.selectedFiles, showToast]
  );

  return {
    ...uploadState,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
    clearUploadedFiles,
    uploadFiles,
    cancelUpload,
    validateFiles,
  };
};
