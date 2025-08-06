import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../store/useGlobalStore";
import LoadingScreen from "../components/LoadingScreen";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard Component
 *
 * Extends authentication protection to ensure only admin users can access
 * admin-specific routes and functionality.
 *
 * Features:
 * - Validates user authentication (inherited from AuthGuard)
 * - Checks user role for admin privileges
 * - Redirects non-admin users to home page
 * - Shows loading state during role validation
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const user = useUser();

  // Show loading while user data is being fetched
  if (!user) {
    return <LoadingScreen message="Validating admin access..." />;
  }

  // Check if user has admin role
  // For development/testing, allow access if user exists
  // In production, this should be: const isAdmin = user.role === "admin";
  const isAdmin =
    user.role === "admin" || import.meta.env.MODE === "development";

  if (!isAdmin) {
    console.log("🚫 AdminGuard: User is not an admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("✅ AdminGuard: Admin access granted");
  return <>{children}</>;
};

export default AdminGuard;
