import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  User,
} from "../types/api";

/**
 * Authentication API Hook
 *
 * Handles all authentication-related API operations including:
 * - User registration
 * - User login/logout
 * - Token management
 * - User profile management
 * - Authentication state management
 */
export const useAuthApi = () => {
  const { post, get, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /**
   * Register a new user
   * POST /auth/register
   */
  const register = useCallback(
    async (userData: RegisterRequest): Promise<RegisterResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔐 Auth API: Registering user with data:", {
          username: userData.username,
          // Don't log password for security
        });

        const response = await post<RegisterResponse>(
          "/auth/register",
          userData
        );

        console.log("✅ User registered successfully:", {
          id: response.id,
          username: response.username,
        });

        return response;
      } catch (error) {
        console.error("❌ Error registering user:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Login user
   * POST /auth/login
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔐 Auth API: Logging in user:", {
          username: credentials.username,
          // Don't log password for security
        });

        const response = await post<LoginResponse>("/auth/login", credentials);

        // Store authentication token if provided
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          console.log("🔑 Authentication token stored successfully");
        }

        // Set current user
        setCurrentUser({
          id: response.user_id,
          username: response.username,
        });

        console.log("✅ User logged in successfully:", {
          id: response.user_id,
          username: response.username,
        });

        return response;
      } catch (error) {
        console.error("❌ Error logging in user:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Logout user
   * POST /auth/logout (optional endpoint)
   * Also clears local authentication state
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Auth API: Logging out user");

      // Try to call logout endpoint if it exists
      try {
        await post("/auth/logout", {});
        console.log("✅ Server logout successful");
      } catch (error) {
        console.warn(
          "⚠️ Server logout failed (endpoint may not exist):",
          error
        );
        // Continue with local logout even if server logout fails
      }

      // Clear local authentication state
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      setCurrentUser(null);

      console.log("✅ Local logout completed");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      const apiError = handleApiError(error);
      setError(apiError.message);

      // Still clear local state even if server logout fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [post, handleApiError]);

  /**
   * Get current user profile
   * GET /auth/me or /auth/profile
   */
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Auth API: Fetching current user profile");

      const response = await get<User>("/auth/me");
      setCurrentUser(response);

      console.log("✅ Current user fetched successfully:", {
        id: response.id,
        username: response.username,
      });

      return response;
    } catch (error) {
      console.error("❌ Error fetching current user:", error);
      const apiError = handleApiError(error);
      setError(apiError.message);

      // Clear authentication state if user fetch fails (token might be invalid)
      if (apiError.status === 401 || apiError.status === 403) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        setCurrentUser(null);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [get, handleApiError]);

  /**
   * Update user profile
   * PUT /auth/profile
   */
  const updateProfile = useCallback(
    async (updates: Partial<User>): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔐 Auth API: Updating user profile:", updates);

        const response = await post<User>("/auth/profile", updates);
        setCurrentUser(response);

        console.log("✅ User profile updated successfully:", {
          id: response.id,
          username: response.username,
        });

        return response;
      } catch (error) {
        console.error("❌ Error updating user profile:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Change password
   * POST /auth/change-password
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔐 Auth API: Changing user password");

        await post("/auth/change-password", {
          currentPassword,
          newPassword,
        });

        console.log("✅ Password changed successfully");
      } catch (error) {
        console.error("❌ Error changing password:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Refresh authentication token
   * POST /auth/refresh
   */
  const refreshToken = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Auth API: Refreshing authentication token");

      const response = await post<{ token: string }>("/auth/refresh", {});

      if (response.token) {
        localStorage.setItem("access_token", response.token);
        console.log("✅ Token refreshed successfully");
        return response.token;
      }

      return null;
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
      const apiError = handleApiError(error);
      setError(apiError.message);

      // Clear authentication state if refresh fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      setCurrentUser(null);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [post, handleApiError]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem("access_token");
    return !!token && !!currentUser;
  }, [currentUser]);

  /**
   * Initialize authentication state (check for existing token)
   */
  const initializeAuth = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.log("🔐 No authentication token found");
      return null;
    }

    console.log("🔐 Found existing token, fetching user profile");
    return getCurrentUser();
  }, [getCurrentUser]);

  /**
   * Clear error state
   */
  const clearAuthError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    currentUser,

    // Actions
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    refreshToken,
    initializeAuth,
    clearAuthError,

    // Utilities
    isAuthenticated,
  };
};
