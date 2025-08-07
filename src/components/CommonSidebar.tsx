import React from "react";

// Common sidebar width - using w-80 (320px) for consistency
const SIDEBAR_WIDTH = "w-80"; // 320px - consistent with ChatServiceApp
const COLLAPSED_WIDTH = "w-16"; // 64px - collapsed width

interface CommonSidebarProps {
  children: React.ReactNode;
  className?: string;
  isCollapsed?: boolean;
}

/**
 * Common Sidebar Component
 *
 * Provides consistent width and base styling across all apps.
 * Uses w-80 (320px) width for premium, spacious feel.
 * Optimized height calculations to prevent scrolling issues.
 * Supports collapse functionality for better space utilization.
 * Enhanced shadow effects for better visual separation.
 *
 * @param children - Sidebar content
 * @param className - Additional CSS classes
 * @param isCollapsed - Whether the sidebar is collapsed
 */
export const CommonSidebar: React.FC<CommonSidebarProps> = ({
  children,
  className = "",
  isCollapsed = false,
}) => {
  return (
    <div
      className={`${
        isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH
      } bg-white/90 backdrop-blur-sm border-r border-white/50 h-full flex flex-col ${
        isCollapsed
          ? "shadow-2xl shadow-gray-900/20"
          : "shadow-xl shadow-gray-800/15"
      } overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonSidebar;
