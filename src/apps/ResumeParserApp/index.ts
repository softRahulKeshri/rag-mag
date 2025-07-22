// Main ResumeParserApp exports
export { default as ResumeParserApp } from "./ResumeParserApp";

// Module exports
export * from "./modules/upload";
export * from "./modules/search";
export * from "./modules/store";

// Shared components
export { default as Sidebar } from "./components/Sidebar";

// Shared services
export * from "./services/api";

// API Hooks
export {
  useApiService,
  useResumeApi,
  useGroupApi,
  useUploadApi,
  useSearchApi,
} from "./hooks";

// API Types
export type {
  // API types
  ApiResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  DeleteGroupResponse,
  GroupListResponse,
  UploadResult,
  CommentResponse,
  ApiError,
  UploadProgress,
  SearchFilters as ApiSearchFilters,
  SearchResponse,
  Resume,
  Group,
  ResumeComment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "./hooks";

// Shared types
export type {
  BaseResume,
  BaseGroup,
  BaseComment,
  ResumeStatus,
  SupportedFileType,
  UploadStatus,
} from "./types/shared";
