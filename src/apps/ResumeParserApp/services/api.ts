import axios from "axios";
import type { Group, UploadResult, Resume as ApiResume } from "../types/api";

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Unified upload function using XMLHttpRequest for better progress tracking
export const uploadResume = async (
  files: File | File[],
  groupId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const fileArray = Array.isArray(files) ? files : [files];

  const formData = new FormData();
  fileArray.forEach((file) => {
    formData.append("cv", file);
  });

  // Add group ID to the form data
  formData.append("group", groupId);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Progress tracking
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        let result: Record<string, unknown> = {};
        const actualFileCount = formData.getAll("cv").length;

        try {
          result = JSON.parse(xhr.responseText || "{}");
        } catch {
          result = {
            message: "Files uploaded successfully",
            successful: actualFileCount,
          };
        }

        const uploadResult: UploadResult = {
          successful:
            (result.successful as number) ||
            (result.files as unknown[])?.length ||
            (result.count as number) ||
            actualFileCount,
          failed: (result.failed as number) || 0,
          total:
            (result.total as number) ||
            (result.files as unknown[])?.length ||
            (result.count as number) ||
            actualFileCount,
          message:
            (result.message as string) ||
            (result.status as string) ||
            "Files uploaded successfully to group!",
          results:
            (result.files as ApiResume[]) || (result.data as ApiResume[]) || [],
          errors:
            (result.errors as Array<{ filename: string; error: string }>) || [],
        };

        resolve(uploadResult);
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
    xhr.setRequestHeader("X-Upload-Group", groupId);

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

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get("/groups");
  return response.data;
};

export const deleteResume = async (id: string): Promise<void> => {
  await api.delete(`/resumes/${id}`);
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
): Promise<ApiResume[]> => {
  const response = await api.get("/resumes/search", { params: filters });
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
    const response = await api.get("/resumes/search", {
      params: { query, ...filters },
    });
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
      response?: { status: number; data?: { message?: string; code?: string } };
    };
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
