/**
 * Application Constants
 *
 * Centralized constants for the entire application including API configurations,
 * app-specific settings, and shared values.
 */

import { resumeApi, chatApi, pitchApi, getApiConfig } from "./lib/axios";

// API Service Constants
export const API_SERVICES = {
  RESUME: "resume",
  CHAT: "chat",
  PITCH: "pitch",
} as const;

// App-specific API instances for easy import
export const APP_APIS = {
  // Resume Parser App uses resume API
  RESUME_PARSER: resumeApi,

  // Chat Service App uses chat API
  CHAT_SERVICE: chatApi,

  // Pitch Analyzer App uses pitch API
  PITCH_ANALYZER: pitchApi,
} as const;

// App identifiers
export const APPS = {
  RESUME_PARSER: "ResumeParserApp",
  CHAT_SERVICE: "ChatServiceApp",
  PITCH_ANALYZER: "PitchAnalyzerApp",
} as const;

// Navigation constants
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  PROFILE: "/profile",
  RESUME_PARSER: "/resume-parser",
  CHAT_SERVICE: "/chat-service",
  PITCH_ANALYZER: "/pitch-analyzer",
} as const;

// File upload constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    RESUME: [".pdf", ".doc", ".docx"],
    PITCH: [".pdf", ".ppt", ".pptx"],
    DOCUMENT: [".pdf", ".doc", ".docx", ".txt"],
  },
  MAX_FILES_PER_UPLOAD: 10,
} as const;

// UI Constants
export const UI = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const;

// Theme constants
export const THEME = {
  COLORS: {
    PRIMARY: "#3B82F6",
    SECONDARY: "#8B5CF6",
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
    ERROR: "#EF4444",
    INFO: "#06B6D4",
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
    "2XL": "1536px",
  },
} as const;

// Environment constants
export const ENV = {
  IS_DEVELOPMENT: import.meta.env.MODE === "development",
  IS_PRODUCTION: import.meta.env.MODE === "production",
  IS_TEST: import.meta.env.MODE === "test",
} as const;

/**
 * Helper function to get API instance for specific app
 */
export const getAppApiInstance = (appName: keyof typeof APP_APIS) => {
  return APP_APIS[appName];
};

/**
 * Helper to get full API URLs for debugging
 */
export const getApiUrls = () => {
  const config = getApiConfig();
  return config.FULL_URLS;
};

export default {
  API_SERVICES,
  APP_APIS,
  APPS,
  ROUTES,
  FILE_UPLOAD,
  UI,
  THEME,
  ENV,
  getAppApiInstance,
  getApiUrls,
};
