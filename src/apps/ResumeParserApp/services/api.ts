import axios from "axios";
import type { Resume, Group, ParsedResumeData } from "../types";

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
  getAll: async (groupId?: string): Promise<Resume[]> => {
    const params = groupId ? { groupId } : {};
    const response = await api.get("/resumes", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Resume> => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}`);
  },

  // Upload resume with progress tracking
  upload: async (
    files: File[],
    groupId: string,
    onProgress?: (fileName: string, progress: number) => void
  ): Promise<Resume[]> => {
    const formData = new FormData();
    formData.append("groupId", groupId);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("/resumes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          files.forEach((file) => onProgress(file.name, progress));
        }
      },
    });

    return response.data;
  },

  // Parse resume content
  parse: async (resumeId: string): Promise<ParsedResumeData> => {
    const response = await api.post(`/resumes/${resumeId}/parse`);
    return response.data;
  },

  // Search resumes
  search: async (
    query: string,
    filters?: Record<string, unknown>
  ): Promise<Resume[]> => {
    const response = await api.get("/resumes/search", {
      params: { query, ...filters },
    });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getUploadStats: async (groupId?: string) => {
    const params = groupId ? { groupId } : {};
    const response = await api.get("/analytics/upload-stats", { params });
    return response.data;
  },

  getProcessingStats: async (groupId?: string) => {
    const params = groupId ? { groupId } : {};
    const response = await api.get("/analytics/processing-stats", { params });
    return response.data;
  },

  getSkillDistribution: async (groupId?: string) => {
    const params = groupId ? { groupId } : {};
    const response = await api.get("/analytics/skill-distribution", { params });
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
