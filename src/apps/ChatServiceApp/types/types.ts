export interface IFileAttachment {
  name: string;
  size: number;
  type: string;
}

// Model Type Constants
export const ModelType = {
  OLLAMA: "ollama",
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;

export type ModelType = (typeof ModelType)[keyof typeof ModelType];

export interface IMessage {
  id: number | string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: string;
  file?: IFileAttachment;
  isStreaming?: boolean;
}

export interface IChat {
  id: string;
  title: string;
  timestamp: string;
  messages: IMessage[];
  selectedModel?: ModelType; // Add model selection to chat
}

// Chat Session API Types
export interface CreateChatSessionRequest {
  title: string;
  user_id: string;
}

export interface CreateChatSessionResponse {
  id: string;
  title: string;
  created_at: string;
}

export interface ChatSessionError {
  message: string;
  status?: number;
  code?: string;
}

// Message API Types
export interface SendMessageRequest {
  content: string;
  chat_id: string;
  user_id: string;
  role: "user" | "assistant";
}

export interface SendMessageResponse {
  id: string;
  created_at: string;
  content: string;
  role: "user" | "assistant";
}

// New conversation API types for the unified message/response endpoint
export interface ConversationRequest {
  content: string;
  chat_id: string;
  user_id: string;
  role: "user" | "assistant";
  modelType?: ModelType; // Add modelType field
}

export interface ConversationResponse {
  id: string;
  created_at: string;
  content: string;
  role: "user" | "assistant";
}

export interface GetMessagesRequest {
  chat_id: string;
}

export interface GetMessagesResponse {
  id: string;
  created_at: string;
  content: string;
  role: "user" | "assistant";
}
