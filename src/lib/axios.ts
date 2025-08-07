import axios from "axios";
import type { AxiosInstance } from "axios";
import { STORAGE_KEYS } from "../types/global";

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
 * Token management utilities
 */
const TokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  clearTokens: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    // Legacy token cleanup
    localStorage.removeItem("token");
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // Consider invalid tokens as expired
    }
  },
};

/**
 * Refresh token function
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = TokenManager.getRefreshToken();

  if (!refreshToken) {
    console.warn("⚠️ No refresh token available for token refresh");
    return null;
  }

  try {
    console.log("🔄 Attempting to refresh access token");

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    const { access_token, refresh_token } = response.data;

    if (access_token) {
      TokenManager.setTokens(access_token, refresh_token);
      console.log("✅ Access token refreshed successfully");
      return access_token;
    }

    return null;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    TokenManager.clearTokens();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return null;
  }
};

/**
 * Create axios instance with JWT authentication and auto-refresh
 */
const createApiInstance = (endpoint: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}${endpoint}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
  });

  // Request interceptor - add JWT Bearer token
  instance.interceptors.request.use(
    (config) => {
      const accessToken = TokenManager.getAccessToken();

      if (accessToken) {
        // Check if token is expired before making request
        if (TokenManager.isTokenExpired(accessToken)) {
          console.warn(
            "⚠️ Access token is expired, will attempt refresh on 401"
          );
        }

        config.headers.Authorization = `Bearer ${accessToken}`;

        // Log token and endpoint for debugging
        console.log(`🔐 JWT Token attached to request:`, {
          endpoint: `${endpoint}${config.url}`,
          method: config.method?.toUpperCase(),
          tokenPreview: `${accessToken.substring(
            0,
            20
          )}...${accessToken.substring(accessToken.length - 10)}`,
          fullToken: accessToken, // Full token for debugging
          hasData: !!config.data,
          dataPreview: config.data
            ? typeof config.data === "string"
              ? config.data.substring(0, 100) + "..."
              : "Object/FormData"
            : "No data",
        });
      } else {
        console.warn(`⚠️ No JWT token available for request:`, {
          endpoint: `${endpoint}${config.url}`,
          method: config.method?.toUpperCase(),
        });
      }

      console.log(
        `🚀 API Request [${endpoint}]:`,
        config.method?.toUpperCase(),
        config.url,
        config.data ? "with data" : "no data"
      );

      return config;
    },
    (error) => {
      console.error(`❌ API Request Error [${endpoint}]:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token refresh on 401
  instance.interceptors.response.use(
    (response) => {
      console.log(
        `✅ API Response [${endpoint}]:`,
        response.status,
        response.config.url
      );
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      console.error(
        `❌ API Response Error [${endpoint}]:`,
        error.response?.status,
        error.response?.statusText,
        error.config?.url
      );

      // Handle 401 Unauthorized - attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        console.log("🔄 Received 401, attempting token refresh...");

        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("🔄 Retrying original request with new token");
          return instance(originalRequest);
        } else {
          // Refresh failed, redirect to login
          console.error("❌ Token refresh failed, redirecting to login");
          TokenManager.clearTokens();

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(error);
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error("🚫 Access forbidden - insufficient permissions");
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        console.error("🔥 Server error:", error.response.data);
      }

      // Handle network errors
      if (!error.response) {
        console.error("🌐 Network error - no response received");
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
 * Authentication utilities for manual token management
 */
export const authUtils = {
  ...TokenManager,
  refreshToken: refreshAccessToken,

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = TokenManager.getAccessToken();
    return token !== null && !TokenManager.isTokenExpired(token);
  },

  // Force logout and cleanup
  logout: () => {
    TokenManager.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
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
