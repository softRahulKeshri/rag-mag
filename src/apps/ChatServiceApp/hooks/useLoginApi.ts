import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { LoginRequest, LoginResponse } from "../types/api";

/**
 * Login API Hook
 *
 * Handles user login API operations including:
 * - User login with username and password
 * - Error handling and loading states
 * - Token storage
 */
export const useLoginApi = () => {
  const { post, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login user
   * POST http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com/api2/auth/login
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔐 Login API: Logging in user:", {
          username: credentials.username,
          // Don't log password for security
        });

        const response = await post<LoginResponse>(
          "http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com/api2/auth/login",
          credentials
        );

        // Store authentication token if provided
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("user_id", response.user_id);
          localStorage.setItem("username", response.username);
          console.log("🔑 Authentication token stored successfully");
        }

        console.log("✅ User logged in successfully:", {
          user_id: response.user_id,
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
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem("access_token");
    return !!token;
  }, []);

  /**
   * Get stored user info
   */
  const getUserInfo = useCallback(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    if (!token || !userId || !username) {
      return null;
    }

    return {
      access_token: token,
      user_id: userId,
      username: username,
    };
  }, []);

  /**
   * Logout user (clear stored tokens)
   */
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    console.log("✅ User logged out successfully");
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    login,
    logout,
    clearError,

    // Utilities
    isAuthenticated,
    getUserInfo,
  };
};
