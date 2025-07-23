// Shared types used across all modules

// Application sections for better type safety and maintainability
export const Section = {
  UPLOAD: "upload",
  SEARCH: "search",
  STORE: "store",
} as const;

export type Section = (typeof Section)[keyof typeof Section];

export interface BaseResume {
  id: string | number;
  filename: string;
  original_filename?: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: string;
  group?: string;
}

export interface BaseGroup {
  id: string | number;
  name: string;
  description?: string;
  createdAt: string | Date;
  resumeCount?: number;
}

export interface BaseComment {
  id: number;
  resumeId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  hrName?: string;
}

// Common status types
export type ResumeStatus =
  | "uploaded"
  | "processing"
  | "completed"
  | "failed"
  | "uploading"
  | "error";

// Common file types
export type SupportedFileType = "pdf" | "doc" | "docx";

// Common upload states
export type UploadStatus = "idle" | "uploading" | "success" | "error";
