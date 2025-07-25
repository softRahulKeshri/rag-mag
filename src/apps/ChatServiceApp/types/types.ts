export interface IFileAttachment {
  name: string;
  size: number;
  type: string;
}

export interface IMessage {
  id: number | string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: string;
  file?: IFileAttachment;
  isStreaming?: boolean;
}

export interface IChat {
  id: number;
  title: string;
  timestamp: string;
  messages: IMessage[];
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
