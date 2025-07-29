// Base API Types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: number;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Authentication Types
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Chat Session Types
export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  messageCount?: number;
  lastMessageAt?: string;
}

export interface CreateChatSessionRequest {
  title: string;
  userId?: string;
}

export interface UpdateChatSessionRequest {
  title?: string;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  sessionId: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface CreateMessageRequest {
  content: string;
  role: "user" | "assistant" | "system";
  sessionId: string;
  metadata?: Record<string, unknown>;
  attachments?: File[];
}

export interface UpdateMessageRequest {
  content?: string;
  metadata?: Record<string, unknown>;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: "message" | "typing" | "error" | "status";
  sessionId: string;
  data: unknown;
  timestamp: string;
}

export interface TypingIndicator {
  sessionId: string;
  userId: string;
  isTyping: boolean;
}
