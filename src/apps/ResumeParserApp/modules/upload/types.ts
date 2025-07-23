// Upload Module Types
export interface UploadState {
  isUploading: boolean;
  selectedFiles: File[];
  uploadProgress: Record<string, number>;
  errors: Record<string, string>;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadedFiles: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "success" | "error";
  uploadedAt: Date;
}

// Re-export the Group type from the comprehensive type definitions
export type { Group } from "../../types/api";
