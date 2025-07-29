import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated, useActions } from "../store";
import LoadingScreen from "./LoadingScreen";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard Component
 *
 * Comprehensive authentication protection system that:
 * - Validates access tokens on app initialization
 * - Redirects unauthenticated users to login
 * - Shows loading animation during auth checks
 * - Handles token expiration and cleanup
 * - Protects against manual URL navigation
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { initializeAuth, logout } = useActions();
  const location = useLocation();

  /**
   * Validates if user has valid authentication tokens
   */
  const validateAuthentication = async (): Promise<boolean> => {
    try {
      // Check for access token in localStorage
      const accessToken =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const username = localStorage.getItem("username");

      // If no token found, user is not authenticated
      if (!accessToken) {
        console.log("🔐 AuthGuard: No access token found");
        await cleanup();
        return false;
      }

      // Check if token is expired (basic JWT parsing)
      if (isTokenExpired(accessToken)) {
        console.log("🔐 AuthGuard: Token expired");
        await cleanup();
        return false;
      }

      // If we have token and basic user info, consider authenticated
      if (accessToken && userId && username) {
        console.log("🔐 AuthGuard: Valid authentication found");
        return true;
      }

      // Try to initialize auth from stored token
      console.log("🔐 AuthGuard: Attempting to initialize auth from token");
      const authResult = await initializeAuth();

      if (authResult) {
        console.log("✅ AuthGuard: Authentication initialized successfully");
        return true;
      } else {
        console.log("❌ AuthGuard: Failed to initialize authentication");
        await cleanup();
        return false;
      }
    } catch (error) {
      console.error(
        "❌ AuthGuard: Error during authentication validation:",
        error
      );
      await cleanup();
      return false;
    }
  };

  /**
   * Basic JWT token expiration check
   */
  const isTokenExpired = (token: string): boolean => {
    try {
      // Basic JWT structure check
      const parts = token.split(".");
      if (parts.length !== 3) {
        return true; // Not a valid JWT
      }

      // Decode payload (basic check - in production you'd want more robust validation)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token has exp claim and if it's expired
      if (payload.exp && payload.exp < currentTime) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Assume expired if we can't parse
    }
  };

  /**
   * Clean up authentication data
   */
  const cleanup = async (): Promise<void> => {
    try {
      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      // Clear global state
      await logout();

      console.log("🧹 AuthGuard: Authentication data cleaned up");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  /**
   * Initialize authentication on component mount
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsInitializing(true);

      try {
        console.log("🔐 AuthGuard: Starting authentication check...");

        // Add minimum loading time for better UX (prevent flash)
        const [authValid] = await Promise.all([
          validateAuthentication(),
          new Promise((resolve) => setTimeout(resolve, 1500)), // Minimum 1.5s loading
        ]);

        setAuthCheckComplete(true);

        if (authValid) {
          console.log("✅ AuthGuard: User is authenticated");
        } else {
          console.log("❌ AuthGuard: User is not authenticated");
        }
      } catch (error) {
        console.error(
          "❌ AuthGuard: Authentication initialization failed:",
          error
        );
        setAuthCheckComplete(true);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handle route changes - revalidate auth for sensitive routes
   */
  useEffect(() => {
    if (!isInitializing && authCheckComplete) {
      // For certain sensitive routes, we might want to revalidate
      const sensitiveRoutes = ["/profile", "/settings"];

      if (
        sensitiveRoutes.some((route) => location.pathname.startsWith(route))
      ) {
        const accessToken =
          localStorage.getItem("access_token") || localStorage.getItem("token");

        if (!accessToken || isTokenExpired(accessToken)) {
          console.log("🔐 AuthGuard: Token invalid on sensitive route access");
          cleanup();
        }
      }
    }
  }, [location.pathname, isInitializing, authCheckComplete]);

  /**
   * Show loading screen during initialization
   */
  if (isInitializing || !authCheckComplete) {
    return (
      <LoadingScreen message="Verifying credentials..." fullScreen={true} />
    );
  }

  /**
   * Redirect to login if not authenticated
   */
  if (!isAuthenticated) {
    console.log("🔐 AuthGuard: Redirecting to login - user not authenticated");
    return <Navigate to="/login" replace />;
  }

  /**
   * Render protected content
   */
  return <>{children}</>;
};

export default AuthGuard;
