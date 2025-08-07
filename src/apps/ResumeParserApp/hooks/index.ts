/**
 * ResumeParserApp API Hooks
 *
 * Centralized exports for all custom API hooks.
 * Provides type-safe, consistent API access throughout the application.
 *
 * Features:
 * - Modular hook architecture
 * - Consistent error handling
 * - Loading state management
 * - Type-safe API calls
 * - Retry logic and timeout handling
 */

// Base API service hook
export { useApiService } from "./useApiService";

// Core API hooks
export { useResumeApi } from "./useResumeApi";
export { useCommentApi } from "./useCommentApi";
export { useGroupApi } from "./useGroupApi";
export { useUploadApi } from "./useUploadApi";
export { useSearchApi } from "./useSearchApi";
export { useResumeProcessingStatus } from "./useResumeProcessingStatus";

// API types
export type {
  ApiResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  DeleteGroupResponse,
  GroupListResponse,
  UploadResult,
  CommentResponse,
  ApiError,
  UploadProgress,
  SearchFilters,
  SearchResponse,
  Resume,
  Group,
  ResumeComment,
  CreateCommentRequest,
  UpdateCommentRequest,
  ResumeProcessingStatus,
  ResumeProcessingStatusResponse,
} from "../types/api";
