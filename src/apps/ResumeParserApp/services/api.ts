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

// Unified upload function using XMLHttpRequest for better progress tracking
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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled'));
      });
    }

    // Progress tracking
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response: UploadApiResponse = JSON.parse(
            xhr.responseText || "{}"
          );

          // Handle the new API response format
          const uploadResult: UploadResult = {
            successful: response.uploaded?.length || 0,
            failed: response.errors?.length || 0,
            total: fileArray.length,
            message:
              response.uploaded?.length > 0
                ? `Successfully uploaded ${response.uploaded.length} file(s)`
                : "Upload completed",
            results:
              response.uploaded?.map((item) => ({
                id: item.id,
                filename: item.original_filename || item.stored_filename,
                original_filename: item.original_filename,
                stored_filename: item.stored_filename,
                filepath: item.filepath,
                fileSize: fileSizeMap.get(item.original_filename) || 0, // Use actual file size from mapping
                fileType: "pdf", // Assuming PDF based on context
                uploadedAt: item.upload_time,
                status: "uploaded" as const,
                group: item.group,
                cloud_url: item.cloud_url,
                comment_text: item.comment,
                commented_at: item.commented_at,
              })) || [],
            errors:
              response.errors?.map((error) => ({
                filename: error.filename || "Unknown file",
                error: error.message || error.error || "Upload failed",
              })) || [],
          };

          resolve(uploadResult);
        } catch {
          reject(new Error("Invalid response format from server"));
        }
      } else {
        const errorMessage =
          xhr.responseText || `Upload failed: ${xhr.status} ${xhr.statusText}`;
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error: Unable to connect to server"));
    });

    xhr.addEventListener("timeout", () => {
      reject(
        new Error(
          `Upload timeout after ${
            30000 / 1000
          } seconds. Please try with fewer or smaller files.`
        )
      );
    });

    xhr.timeout = 30000;
    xhr.open("POST", `${api.defaults.baseURL}/upload_cv`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Add authorization header if available
    const token = localStorage.getItem("authToken");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.send(formData);
  });
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
