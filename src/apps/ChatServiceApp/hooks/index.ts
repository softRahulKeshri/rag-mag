// Export all chat service hooks for easier imports
export { useCreateChatSessionApi } from "./useCreateChatSessionApi";
export { useChatSessions, useChatSessionsEnhanced } from "./useChatSessions";
export { useFetchUserChatSessions } from "./useFetchUserChatSessions";
export { useSendMessageApi } from "./useSendMessageApi";
export { useConversationApi } from "./useConversationApi";
export { useGetMessagesApi } from "./useGetMessagesApi";
export { useFetchChatMessages } from "./useFetchChatMessages";
export { useRegisterApi } from "./useRegisterApi";
export { useApiService } from "./useApiService";

// Re-export types for convenience
export type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  ChatSessionError,
  SendMessageRequest,
  SendMessageResponse,
  ConversationRequest,
  ConversationResponse,
  GetMessagesRequest,
  GetMessagesResponse,
} from "../types/types";
