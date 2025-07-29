// Store exports
export {
  useGlobalStore,
  useAuth,
  useUser,
  useSettings,
  useChatSessions,
  useResumes,
  useActions,
  useIsAuthenticated,
  useIsLoading,
  useError,
} from "./useGlobalStore";

// Types
export type {
  GlobalState,
  User,
  AuthState,
  AppSettings,
  ChatSession,
  ResumeData,
  LoginResponse,
  RegisterResponse,
  ApiError,
  StorePersistence,
} from "../types/global";

export { STORAGE_KEYS } from "../types/global";
