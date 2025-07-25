import React from "react";

// Common sidebar width - using w-72 (288px) for consistency
const SIDEBAR_WIDTH = "w-72"; // 288px - consistent with ChatServiceApp

interface CommonSidebarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Common Sidebar Component
 *
 * Provides consistent width and base styling across all apps.
 * Uses w-72 (288px) width for premium, spacious feel.
 * Optimized height calculations to prevent scrolling issues.
 *
 * @param children - Sidebar content
 * @param className - Additional CSS classes
 */
export const CommonSidebar: React.FC<CommonSidebarProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`${SIDEBAR_WIDTH} bg-white border-r border-gray-200 h-screen flex flex-col shadow-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonSidebar;
