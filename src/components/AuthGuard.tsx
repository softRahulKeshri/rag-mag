import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated, useActions } from "../store";
import LoadingScreen from "./LoadingScreen";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard Component
 *
 * Protects routes by checking authentication status.
 * Shows loading screen during authentication check.
 * Redirects to login if not authenticated.
 *
 * @param children - Protected content to render if authenticated
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useActions();
  const location = useLocation();

  /**
   * Check if JWT token is expired
   */
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // Consider expired if we can't parse it
    }
  };

  /**
   * Clean up authentication data
   */
  const cleanup = useCallback(async (): Promise<void> => {
    try {
      console.log("🧹 AuthGuard: Cleaning up authentication data...");

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
  }, [logout]);

  /**
   * Validate current authentication status
   */
  const validateAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔐 AuthGuard: Validating authentication...");

      // Check for access token
      const accessToken =
        localStorage.getItem("access_token") || localStorage.getItem("token");

      if (!accessToken) {
        console.log("❌ AuthGuard: No access token found");
        return false;
      }

      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        console.log("❌ AuthGuard: Token is expired");
        await cleanup();
        return false;
      }

      // Validate token with backend (optional - can be removed if not needed)
      try {
        // You can add a token validation API call here if needed
        // const response = await api.get('/auth/validate');
        // return response.data.valid;
        console.log("✅ AuthGuard: Token validation successful");
        return true;
      } catch (error) {
        console.log("❌ AuthGuard: Token validation failed:", error);
        await cleanup();
        return false;
      }
    } catch (error) {
      console.error("❌ AuthGuard: Authentication validation error:", error);
      return false;
    }
  }, [cleanup]);

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
  }, [validateAuthentication]);

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
  }, [location.pathname, isInitializing, authCheckComplete, cleanup]);

  /**
   * Show loading screen during initialization
   */
  if (isInitializing || !authCheckComplete) {
    return <LoadingScreen message="" fullScreen={true} />;
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
