// Global State Types for Zustand Store

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  sidebarCollapsed: boolean;
  autoSave: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  isActive: boolean;
}

export interface ResumeData {
  id: number;
  filename: string;
  originalFilename: string;
  storedFilename: string;
  filepath: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  group?: string;
  cloudUrl?: string;
  commentedAt?: string;
  uploadTime?: string;
}

export interface GlobalState {
  // User and Authentication
  user: User | null;
  auth: AuthState;
  
  // Application Settings
  settings: AppSettings;
  
  // Chat Sessions
  chatSessions: ChatSession[];
  activeChatSessionId: string | null;
  
  // Resume Data
  resumes: ResumeData[];
  selectedResumeId: number | null;
  
  // UI State
  sidebarOpen: boolean;
  loadingStates: Record<string, boolean>;
  errors: Record<string, string | null>;
  
  // Actions
  actions: {
    // Authentication Actions
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    initializeAuth: () => Promise<User | null>;
    register: (userData: { username: string; email: string; password: string }) => Promise<void>;
    refreshToken: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    
    // Settings Actions
    updateSettings: (settings: Partial<AppSettings>) => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    
    // Chat Actions
    setActiveChatSession: (sessionId: string | null) => void;
    addChatSession: (session: ChatSession) => void;
    updateChatSession: (sessionId: string, updates: Partial<ChatSession>) => void;
    removeChatSession: (sessionId: string) => void;
    
    // Resume Actions
    setResumes: (resumes: ResumeData[]) => void;
    addResume: (resume: ResumeData) => void;
    updateResume: (resumeId: number, updates: Partial<ResumeData>) => void;
    removeResume: (resumeId: number) => void;
    setSelectedResume: (resumeId: number | null) => void;
    
    // Utility Actions
    setLoading: (key: string, isLoading: boolean) => void;
    setError: (key: string, error: string | null) => void;
    clearErrors: () => void;
  };
}

// API Response Types
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user_id: string;
  username: string;
  email?: string;
  expires_in?: number;
}

export interface RegisterResponse {
  user_id: string;
  username: string;
  email: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  USERNAME: 'username',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_collapsed',
} as const;

// Store Persistence Configuration
export interface StorePersistence {
  name: string;
  storage: Storage;
  partialize?: (state: GlobalState) => Partial<GlobalState>;
} 