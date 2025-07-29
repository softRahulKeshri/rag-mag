import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";

/**
 * Register API Hook
 *
 * Handles user registration API operations including:
 * - User registration with username and password
 * - Error handling and loading states
 */
export const useRegisterApi = () => {
  const { post, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Register a new user
   * POST /auth/register
   */
  const register = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔐 Register API: Registering user:", { username });

        const response = await post("/auth/register", {
          username,
          password,
        });

        console.log("✅ User registered successfully:", response);

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
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    register,
    clearError,
  };
};
