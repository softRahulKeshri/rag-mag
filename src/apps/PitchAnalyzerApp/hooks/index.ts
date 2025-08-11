/**
 * API Service Hook
 *
 * Centralized API service hook with JWT authentication and error handling
 */

export { useApiService } from "./useApiService";

/**
 * Pitch Upload Hook
 *
 * Simple hook for uploading pitch files to the Magure AI API
 */

export { usePitchUpload } from "./usePitchUpload";
export { usePitchProcessingStatus } from "./usePitchProcessingStatus";

/**
 * Company Pitches Hook
 *
 * Hook for fetching company pitches from the Magure AI API
 */

export { useCompanyPitches } from "./useCompanyPitches";

/**
 * Bookmark Pitch Hook
 *
 * Hook for bookmarking/unbookmarking pitches in the Magure AI API
 */

export { useBookmarkPitch } from "./useBookmarkPitch";

/**
 * Pitch Details Hook
 *
 * Hook for fetching detailed analysis of a specific pitch from the Magure AI API
 */

export { usePitchDetails } from "./usePitchDetails";

/**
 * Chat with AI Hook
 *
 * Hook for chatting with AI about a specific pitch from the Magure AI API
 */

export { useChatWithAI } from "./useChatWithAI";
