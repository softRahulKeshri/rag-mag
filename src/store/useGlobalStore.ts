import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";
import { chatApi } from "../lib/axios";
import type {
  GlobalState,
  User,
  AuthState,
  AppSettings,
  ChatSession,
  ResumeData,
  LoginResponse,
  RegisterResponse,
} from "../types/global";
import { STORAGE_KEYS } from "../types/global";

// Default Settings
const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  language: "en",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  sidebarCollapsed: false,
  autoSave: true,
};

// Default Auth State
const DEFAULT_AUTH_STATE: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Global Zustand Store with Persistence
 *
 * This store centralizes all application state including:
 * - User authentication and profile data
 * - Application settings and preferences
 * - Chat sessions and resume data
 * - UI state and loading indicators
 *
 * Features:
 * - Persistent storage with localStorage
 * - Automatic token management
 * - Error handling and loading states
 * - Type-safe actions and state
 * - Optimistic updates for better UX
 */
export const useGlobalStore = create<GlobalState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        auth: DEFAULT_AUTH_STATE,
        settings: DEFAULT_SETTINGS,
        chatSessions: [],
        activeChatSessionId: null,
        resumes: [],
        selectedResumeId: null,
        sidebarOpen: true,
        loadingStates: {},
        errors: {},

        // Actions
        actions: {
          // Authentication Actions
          login: async (credentials: {
            username: string;
            password: string;
          }) => {
            const { setLoading, setError } = get().actions;

            setLoading("auth", true);
            setError("auth", null);

            try {
              console.log("🔐 Global Store: Logging in user:", {
                username: credentials.username,
              });

              const response = await chatApi.post<LoginResponse>(
                "/auth/login",
                credentials
              );

              const { access_token, refresh_token, user_id, username, email } =
                response.data;

              // Update auth state
              set((state) => ({
                auth: {
                  ...state.auth,
                  accessToken: access_token,
                  refreshToken: refresh_token || null,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                },
                user: {
                  id: user_id,
                  username,
                  email,
                  isActive: true,
                  lastLoginAt: new Date().toISOString(),
                },
              }));

              // Store in localStorage for compatibility
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
              localStorage.setItem(STORAGE_KEYS.USER_ID, user_id);
              localStorage.setItem(STORAGE_KEYS.USERNAME, username);
              if (refresh_token) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
              }

              console.log("✅ Global Store: User logged in successfully");
            } catch (error) {
              console.error("❌ Global Store: Login failed:", error);

              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Login failed. Please check your credentials.";

              setError("auth", errorMessage);
              throw error;
            } finally {
              setLoading("auth", false);
            }
          },

          logout: () => {
            console.log("🚪 Global Store: Logging out user");

            // Clear all stored data
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_ID);
            localStorage.removeItem(STORAGE_KEYS.USERNAME);
            localStorage.removeItem("token"); // Legacy compatibility

            // Reset state
            set({
              user: null,
              auth: DEFAULT_AUTH_STATE,
              chatSessions: [],
              activeChatSessionId: null,
              resumes: [],
              selectedResumeId: null,
              errors: {},
            });

            console.log("✅ Global Store: User logged out successfully");
          },

          initializeAuth: async (): Promise<User | null> => {
            const { setLoading, setError } = get().actions;

            setLoading("auth", true);
            setError("auth", null);

            try {
              console.log(
                "🔐 Global Store: Initializing authentication from stored tokens"
              );

              // Check for stored tokens
              const accessToken =
                localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
                localStorage.getItem("token");
              const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
              const username = localStorage.getItem(STORAGE_KEYS.USERNAME);

              if (!accessToken || !userId || !username) {
                console.log("❌ Global Store: Missing authentication data");
                return null;
              }

              // Update auth state with stored data
              set((state) => ({
                auth: {
                  ...state.auth,
                  accessToken,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                },
                user: {
                  id: userId,
                  username,
                  email: localStorage.getItem("email") || "",
                  isActive: true,
                  lastLoginAt: new Date().toISOString(),
                },
              }));

              console.log(
                "✅ Global Store: Authentication initialized successfully"
              );
              return { id: userId, username, isActive: true };
            } catch (error) {
              console.error(
                "❌ Global Store: Failed to initialize authentication:",
                error
              );
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Authentication initialization failed";
              setError("auth", errorMessage);
              return null;
            } finally {
              setLoading("auth", false);
            }
          },

          register: async (userData: {
            username: string;
            email: string;
            password: string;
          }) => {
            const { setLoading, setError } = get().actions;

            setLoading("auth", true);
            setError("auth", null);

            try {
              console.log("📝 Global Store: Registering new user:", {
                username: userData.username,
              });

              const response = await chatApi.post<RegisterResponse>(
                "/auth/register",
                userData
              );

              console.log(
                "✅ Global Store: User registered successfully:",
                response.data
              );

              // Auto-login after successful registration
              await get().actions.login({
                username: userData.username,
                password: userData.password,
              });
            } catch (error) {
              console.error("❌ Global Store: Registration failed:", error);

              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Registration failed. Please try again.";

              setError("auth", errorMessage);
              throw error;
            } finally {
              setLoading("auth", false);
            }
          },

          refreshToken: async () => {
            const { auth, actions } = get();
            const { setError } = actions;

            if (!auth.refreshToken) {
              console.warn("⚠️ Global Store: No refresh token available");
              return;
            }

            try {
              console.log("🔄 Global Store: Refreshing access token");

              const response = await chatApi.post<LoginResponse>(
                "/auth/refresh",
                { refresh_token: auth.refreshToken }
              );

              const { access_token, refresh_token } = response.data;

              set((state) => ({
                auth: {
                  ...state.auth,
                  accessToken: access_token,
                  refreshToken: refresh_token || auth.refreshToken,
                },
              }));

              // Update localStorage
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
              if (refresh_token) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
              }

              console.log("✅ Global Store: Token refreshed successfully");
            } catch (error) {
              console.error("❌ Global Store: Token refresh failed:", error);
              setError("auth", "Session expired. Please login again.");

              // Force logout on refresh failure
              actions.logout();
              throw error;
            }
          },

          updateUser: (userData: Partial<User>) => {
            console.log("👤 Global Store: Updating user data:", userData);

            set((state) => ({
              user: state.user ? { ...state.user, ...userData } : null,
            }));
          },

          // Settings Actions
          updateSettings: (settings: Partial<AppSettings>) => {
            console.log("⚙️ Global Store: Updating settings:", settings);

            set((state) => ({
              settings: { ...state.settings, ...settings },
            }));
          },

          toggleTheme: () => {
            const { settings, actions } = get();
            const newTheme = settings.theme === "light" ? "dark" : "light";

            actions.updateSettings({ theme: newTheme });
            console.log("🎨 Global Store: Theme toggled to:", newTheme);
          },

          toggleSidebar: () => {
            set((state) => ({ sidebarOpen: !state.sidebarOpen }));
          },

          // Chat Actions
          setActiveChatSession: (sessionId: string | null) => {
            console.log(
              "💬 Global Store: Setting active chat session:",
              sessionId
            );

            set({ activeChatSessionId: sessionId });
          },

          addChatSession: (session: ChatSession) => {
            console.log("➕ Global Store: Adding chat session:", session);

            set((state) => ({
              chatSessions: [...state.chatSessions, session],
            }));
          },

          updateChatSession: (
            sessionId: string,
            updates: Partial<ChatSession>
          ) => {
            console.log(
              "✏️ Global Store: Updating chat session:",
              sessionId,
              updates
            );

            set((state) => ({
              chatSessions: state.chatSessions.map((session) =>
                session.id === sessionId ? { ...session, ...updates } : session
              ),
            }));
          },

          removeChatSession: (sessionId: string) => {
            console.log("🗑️ Global Store: Removing chat session:", sessionId);

            set((state) => ({
              chatSessions: state.chatSessions.filter(
                (session) => session.id !== sessionId
              ),
              activeChatSessionId:
                state.activeChatSessionId === sessionId
                  ? null
                  : state.activeChatSessionId,
            }));
          },

          // Resume Actions
          setResumes: (resumes: ResumeData[]) => {
            console.log("📄 Global Store: Setting resumes:", resumes.length);

            set({ resumes });
          },

          addResume: (resume: ResumeData) => {
            console.log("➕ Global Store: Adding resume:", resume.filename);

            set((state) => ({
              resumes: [...state.resumes, resume],
            }));
          },

          updateResume: (resumeId: number, updates: Partial<ResumeData>) => {
            console.log("✏️ Global Store: Updating resume:", resumeId, updates);

            set((state) => ({
              resumes: state.resumes.map((resume) =>
                resume.id === resumeId ? { ...resume, ...updates } : resume
              ),
            }));
          },

          removeResume: (resumeId: number) => {
            console.log("🗑️ Global Store: Removing resume:", resumeId);

            set((state) => ({
              resumes: state.resumes.filter((resume) => resume.id !== resumeId),
              selectedResumeId:
                state.selectedResumeId === resumeId
                  ? null
                  : state.selectedResumeId,
            }));
          },

          setSelectedResume: (resumeId: number | null) => {
            console.log("📄 Global Store: Setting selected resume:", resumeId);

            set({ selectedResumeId: resumeId });
          },

          // Utility Actions
          setLoading: (key: string, isLoading: boolean) => {
            set((state) => ({
              loadingStates: { ...state.loadingStates, [key]: isLoading },
            }));
          },

          setError: (key: string, error: string | null) => {
            set((state) => ({
              errors: { ...state.errors, [key]: error },
            }));
          },

          clearErrors: () => {
            set({ errors: {} });
          },
        },
      }),
      {
        name: "magure-ai-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Only persist non-sensitive data
          user: state.user,
          auth: {
            ...state.auth,
            accessToken: null, // Don't persist tokens for security
            refreshToken: null,
          },
          settings: state.settings,
          chatSessions: state.chatSessions,
          activeChatSessionId: state.activeChatSessionId,
          resumes: state.resumes,
          selectedResumeId: state.selectedResumeId,
          sidebarOpen: state.sidebarOpen,
        }),
        onRehydrateStorage: () => (state) => {
          // Restore tokens from localStorage on rehydration
          if (state) {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(
              STORAGE_KEYS.REFRESH_TOKEN
            );

            if (accessToken) {
              state.auth.accessToken = accessToken;
              state.auth.isAuthenticated = true;
            }

            if (refreshToken) {
              state.auth.refreshToken = refreshToken;
            }

            console.log("🔄 Global Store: State rehydrated from localStorage");
          }
        },
      }
    )
  )
);

// Selector hooks for better performance
export const useAuth = () => useGlobalStore((state) => state.auth);
export const useUser = () => useGlobalStore((state) => state.user);
export const useSettings = () => useGlobalStore((state) => state.settings);
export const useChatSessions = () =>
  useGlobalStore((state) => state.chatSessions);
export const useResumes = () => useGlobalStore((state) => state.resumes);
export const useActions = () => useGlobalStore((state) => state.actions);

// Computed selectors
export const useIsAuthenticated = () =>
  useGlobalStore((state) => state.auth.isAuthenticated);
export const useIsLoading = (key: string) =>
  useGlobalStore((state) => state.loadingStates[key] || false);
export const useError = (key: string) =>
  useGlobalStore((state) => state.errors[key]);

// Subscribe to auth changes for automatic token refresh
// Note: JWT token management is now handled by axios interceptors in lib/axios.ts
// No need to manually set Authorization headers here

// Subscribe to theme changes for automatic theme switching
useGlobalStore.subscribe(
  (state) => state.settings.theme,
  (theme) => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      if (theme !== "system") {
        document.documentElement.classList.add(theme);
      } else {
        // Use system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.classList.add(systemTheme);
      }
    }
  }
);
