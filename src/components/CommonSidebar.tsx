import React from "react";

// Common sidebar width - using w-80 (320px) for consistency
const SIDEBAR_WIDTH = "w-80"; // 320px - consistent with ChatServiceApp

interface CommonSidebarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Common Sidebar Component
 *
 * Provides consistent width and base styling across all apps.
 * Uses w-80 (320px) width for premium, spacious feel.
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
      className={`${SIDEBAR_WIDTH} bg-white/90 backdrop-blur-sm border-r border-white/50 h-full flex flex-col shadow-xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonSidebar;
