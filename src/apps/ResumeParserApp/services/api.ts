import { resumeApi } from "../../../lib/axios";
import type { Group, UploadResult, Resume as ApiResume } from "../types/api";
import type { BackendResumeResponse } from "../modules/store/types";

// Use centralized API configuration from lib/axios
const api = resumeApi;

// Add interface for the API response format
interface UploadApiResponse {
  errors: Array<{
    filename?: string;
    message?: string;
    error?: string;
  }>;
  uploaded: Array<{
    id: number;
    cloud_url: string | null;
    comment: string | null;
    commented_at: string | null;
    filepath: string;
    group: string;
    original_filename: string;
    stored_filename: string;
    upload_time: string;
  }>;
}

// Updated upload function using axios with JWT authentication
export const uploadResume = async (
  files: File | File[],
  groupId: string,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<UploadResult> => {
  const fileArray = Array.isArray(files) ? files : [files];

  const formData = new FormData();

  // Add each file with the 'cv' field name as per API specification
  fileArray.forEach((file) => {
    formData.append("cv", file);
  });

  // Add group ID to the form data with 'group' field name
  formData.append("group", groupId);

  // Create a mapping of filenames to their sizes for accurate size reporting
  const fileSizeMap = new Map<string, number>();
  fileArray.forEach((file) => {
    fileSizeMap.set(file.name, file.size);
  });

  try {
    console.log("📤 Starting file upload with JWT authentication");

    // Log the request details
    console.log(`🔐 JWT Token for uploadResume API call:`, {
      endpoint: "/upload_cv",
      method: "POST",
      fileCount: fileArray.length,
      fileNames: fileArray.map((f) => f.name),
      groupId,
      timestamp: new Date().toISOString(),
    });

    // Use axios with automatic JWT token injection
    const response = await api.post<UploadApiResponse>("/upload_cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentComplete =
            (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(percentComplete);
        }
      },
    });

    console.log("✅ Upload completed successfully:", response.data);

    // Handle the new API response format
    const uploadResult: UploadResult = {
      successful: response.data.uploaded?.length || 0,
      failed: response.data.errors?.length || 0,
      total: fileArray.length,
      message:
        response.data.uploaded?.length > 0
          ? `Successfully uploaded ${response.data.uploaded.length} file(s)`
          : "Upload completed",
      results:
        response.data.uploaded?.map((item) => ({
          id: item.id,
          filename: item.original_filename || item.stored_filename,
          original_filename: item.original_filename,
          stored_filename: item.stored_filename,
          filepath: item.filepath,
          fileSize: fileSizeMap.get(item.original_filename) || 0,
          fileType: "pdf", // Assuming PDF based on context
          uploadedAt: item.upload_time,
          status: "uploaded" as const,
          group: item.group,
          cloud_url: item.cloud_url,
          comment_text: item.comment,
          commented_at: item.commented_at,
        })) || [],
      errors:
        response.data.errors?.map((error) => ({
          filename: error.filename || "Unknown file",
          error: error.message || error.error || "Upload failed",
        })) || [],
    };

    return uploadResult;
  } catch (error) {
    console.error("❌ Upload failed:", error);

    // Handle specific error cases
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status: number; data?: Record<string, unknown> };
      };

      if (axiosError.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (axiosError.response?.status === 413) {
        throw new Error("File is too large. Please try a smaller file.");
      } else if (axiosError.response?.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
    }

    throw new Error("Upload failed. Please try again.");
  }
};

export const getResumes = async (): Promise<ApiResume[]> => {
  const response = await api.get("/resumes");
  return response.data;
};

// New API function to fetch resumes from /cvs endpoint
export const getResumesFromCVSEndpoint = async (): Promise<
  BackendResumeResponse[]
> => {
  const response = await api.post("/cvs", {});
  return response.data;
};

// New API function to fetch groups from backend
export const getGroupsFromBackend = async (): Promise<Group[]> => {
  const response = await api.get("/groups");
  return response.data;
};

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get("/groups");
  return response.data;
};

export const deleteResume = async (id: number): Promise<void> => {
  try {
    await api.delete(`/delete/${id}`);
  } catch (error) {
    throw handleAPIError(error);
  }
};

export const updateResumeComment = async (
  id: string,
  updates: Partial<ApiResume>
): Promise<ApiResume> => {
  const response = await api.put(`/resumes/${id}`, updates);
  return response.data;
};

export const searchResumes = async (
  filters: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  // Use the new search API endpoint
  const searchPayload = {
    group: filters.group || null,
    query: filters.query || "",
  };

  console.log("🔍 API: Sending search request with payload:", searchPayload);
  const response = await api.post("/search_api", searchPayload);
  console.log("📡 API: Search response received:", response.data);
  return response.data;
};

// Group management API
export const groupAPI = {
  getAll: async (): Promise<Group[]> => {
    const response = await api.get("/groups");
    return response.data;
  },

  create: async (
    group: Omit<Group, "id" | "createdAt" | "resumeCount">
  ): Promise<Group> => {
    const response = await api.post("/groups", group);
    return response.data;
  },

  update: async (id: string, updates: Partial<Group>): Promise<Group> => {
    const response = await api.put(`/groups/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },
};

// Resume management API
export const resumeAPI = {
  getAll: async (groupId?: string): Promise<ApiResume[]> => {
    const params = groupId ? { groupId } : {};
    const response = await api.get("/resumes", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResume> => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}`);
  },

  // Upload resume with progress tracking - uses unified upload function
  upload: async (
    files: File[],
    groupId: string,
    onProgress?: (fileName: string, progress: number) => void
  ): Promise<ApiResume[]> => {
    // Convert the per-file progress callback to overall progress
    const overallProgress = onProgress
      ? (progress: number) => {
          files.forEach((file) => onProgress(file.name, progress));
        }
      : undefined;

    const result = await uploadResume(files, groupId, overallProgress);
    // Return the API Resume type directly
    return result.results || [];
  },

  // Search resumes
  search: async (
    query: string,
    filters?: Record<string, unknown>
  ): Promise<ApiResume[]> => {
    const searchPayload = {
      group: filters?.group || null,
      query: query || "",
    };

    const response = await api.post("/search_api", searchPayload);
    return response.data;
  },
};

// Error handling utilities
export class APIError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
  }
}

export const handleAPIError = (error: unknown): APIError => {
  // Type guard for axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status: number;
        data?: {
          message?: string;
          code?: string;
          error?: string;
        };
      };
    };

    // Handle SQLite errors specifically
    if (axiosError.response?.data?.error) {
      const sqliteError = axiosError.response.data.error;
      if (sqliteError.includes("NOT NULL constraint failed")) {
        return new APIError(
          "Database constraint error: Required data is missing. Please try again or contact support.",
          axiosError.response?.status || 0,
          "CONSTRAINT_ERROR"
        );
      }
      if (sqliteError.includes("UNIQUE constraint failed")) {
        return new APIError(
          "Duplicate entry detected. This item already exists.",
          axiosError.response?.status || 0,
          "UNIQUE_CONSTRAINT_ERROR"
        );
      }
      if (sqliteError.includes("FOREIGN KEY constraint failed")) {
        return new APIError(
          "Reference error: Related data not found. Please refresh and try again.",
          axiosError.response?.status || 0,
          "FOREIGN_KEY_ERROR"
        );
      }
      // Generic SQLite error
      return new APIError(
        "Database error occurred. Please try again or contact support.",
        axiosError.response?.status || 0,
        "DATABASE_ERROR"
      );
    }

    return new APIError(
      axiosError.response?.data?.message || "An error occurred",
      axiosError.response?.status || 0,
      axiosError.response?.data?.code
    );
  }

  // Type guard for network errors
  if (error && typeof error === "object" && "request" in error) {
    return new APIError("Network error - no response received", 0);
  }

  // Handle other errors
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return new APIError(errorMessage, 0);
};

export default api;
