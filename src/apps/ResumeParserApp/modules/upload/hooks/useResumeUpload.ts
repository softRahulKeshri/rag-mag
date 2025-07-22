import { useState, useCallback } from "react";
import type { UploadState, UploadedFile } from "../types";
import { uploadResume } from "../../../services/api";

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

export const useResumeUpload = (): UseResumeUploadReturn => {
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

  const uploadFiles = useCallback(
    async (groupId: string) => {
      if (uploadState.selectedFiles.length === 0) return;

      setUploadState((prev) => ({
        ...prev,
        isUploading: true,
        uploadStatus: "uploading",
        uploadProgress: {},
        errors: {},
      }));

      try {
        const uploadPromises = uploadState.selectedFiles.map(async (file) => {
          const progressCallback = (progress: number) => {
            setUploadState((prev) => ({
              ...prev,
              uploadProgress: { ...prev.uploadProgress, [file.name]: progress },
            }));
          };

          const uploadResult = await uploadResume(
            file,
            groupId,
            progressCallback
          );

          // Convert UploadResult to UploadedFile
          const uploadedFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            status: uploadResult.successful > 0 ? "success" : "error",
            uploadedAt: new Date(),
          };

          setUploadState((prev) => ({
            ...prev,
            uploadedFiles: [...prev.uploadedFiles, uploadedFile],
          }));

          return uploadedFile;
        });

        await Promise.all(uploadPromises);

        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          uploadStatus: "success",
          selectedFiles: [],
          uploadProgress: {},
        }));
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          uploadStatus: "error",
          errors: { upload: "Upload failed. Please try again." },
        }));
      }
    },
    [uploadState.selectedFiles]
  );

  return {
    ...uploadState,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
    clearUploadedFiles,
    uploadFiles,
    validateFiles,
  };
};
