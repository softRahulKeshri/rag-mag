import React from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import UserManagementTab from "./UserManagementTab";
import AuditLogsTab from "./AuditLogsTab";

/**
 * AdminDashboard Component
 *
 * Main admin dashboard that combines user management and audit logs functionality.
 * Navigation is now handled by the main navbar, so this component simply renders
 * the appropriate content based on the current route.
 *
 * Features:
 * - User management with search and filtering
 * - Audit logs with detailed activity tracking
 * - Route-based navigation via main navbar
 * - Responsive design with modern UI
 */
const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    if (currentPath.includes("/admin/users")) {
      return <UserManagementTab />;
    } else if (currentPath.includes("/admin/logs")) {
      return <AuditLogsTab />;
    } else {
      // Default to users if no specific route
      return <UserManagementTab />;
    }
  };

  return <AdminLayout>{renderContent()}</AdminLayout>;
};

export default AdminDashboard;
