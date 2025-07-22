// API Configuration
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://ec2-13-232-75-51.ap-south-1.compute.amazonaws.com/api",
  timeout: 300000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Debug logging for API configuration (only in development)
if (import.meta.env.DEV) {
  console.log("API Configuration:", {
    baseURL: API_CONFIG.baseURL,
    envVariable: import.meta.env.VITE_API_URL,
    defaultURL: "http://ec2-13-232-75-51.ap-south-1.compute.amazonaws.com/api",
    fullUploadURL: `${API_CONFIG.baseURL}/upload_cv`,
  });
}

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf", // PDF only as per UI requirements
  ],
  maxFiles: 50,
} as const;
