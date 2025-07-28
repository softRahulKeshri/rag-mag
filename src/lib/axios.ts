import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * API Configuration for different services
 *
 * This configuration supports multiple API endpoints:
 * - Resume API: /api/
 * - Chat Service API: /api2/
 * - Pitch Analyzer API: /api3/
 */

// API Configuration
export const API_CONFIG = {
  // Base URL for all services
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com",

  // Service endpoints
  ENDPOINTS: {
    RESUME: "/api",
    CHAT: "/api2",
    PITCH: "/api3",
  },

  // Default timeout
  TIMEOUT: 100000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

/**
 * Create axios instance with common configuration
 */
const createApiInstance = (endpoint: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}${endpoint}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
  });

  // Request interceptor - add auth token, modify requests
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        `API Request [${endpoint}]:`,
        config.method?.toUpperCase(),
        config.url,
        config.data ? config.data : ""
      );
      return config;
    },
    (error) => {
      console.error(`API Request Error [${endpoint}]:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors globally
  instance.interceptors.response.use(
    (response) => {
      console.log(
        `API Response [${endpoint}]:`,
        response.status,
        response.config.url
      );
      return response;
    },
    (error) => {
      console.error(
        `API Response Error [${endpoint}]:`,
        error.response?.status,
        error.message
      );

      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (error.response?.status === 500) {
        console.error("Server error:", error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create service-specific API instances
export const resumeApi = createApiInstance(API_CONFIG.ENDPOINTS.RESUME);
export const chatApi = createApiInstance(API_CONFIG.ENDPOINTS.CHAT);
export const pitchApi = createApiInstance(API_CONFIG.ENDPOINTS.PITCH);

// Legacy default export (maintains backward compatibility)
export default resumeApi;

/**
 * Service API instances for easy import
 */
export const apiServices = {
  resume: resumeApi,
  chat: chatApi,
  pitch: pitchApi,
} as const;

/**
 * Helper function to get API instance by service type
 */
export const getApiInstance = (
  service: keyof typeof apiServices
): AxiosInstance => {
  return apiServices[service];
};

/**
 * Generic API call helper with service selection
 */
export const makeApiCall = async <T = unknown>(
  service: keyof typeof apiServices,
  config: AxiosRequestConfig
): Promise<T> => {
  const api = getApiInstance(service);
  const response = await api.request<T>(config);
  return response.data;
};

/**
 * Environment-specific configuration
 */
export const getApiConfig = () => {
  const isDevelopment = import.meta.env.MODE === "development";
  const isProduction = import.meta.env.MODE === "production";

  return {
    BASE_URL: API_CONFIG.BASE_URL,
    ENDPOINTS: API_CONFIG.ENDPOINTS,
    IS_DEVELOPMENT: isDevelopment,
    IS_PRODUCTION: isProduction,
    FULL_URLS: {
      RESUME: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESUME}`,
      CHAT: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`,
      PITCH: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PITCH}`,
    },
  };
};

/**
 * Debug helper to log current API configuration
 */
export const logApiConfig = () => {
  const config = getApiConfig();
  console.group("🔧 API Configuration");
  console.log("Base URL:", config.BASE_URL);
  console.log("Environment:", import.meta.env.MODE);
  console.log("Service URLs:", config.FULL_URLS);
  console.groupEnd();
};
