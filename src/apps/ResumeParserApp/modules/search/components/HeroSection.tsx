import React from "react";
import type { HeroSectionProps } from "../types";

/**
 * HeroSection Component
 *
 * Modern header section with gradient background, tab navigation,
 * and animated elements for the search interface.
 *
 * Features:
 * - Gradient background with decorative elements
 * - Tab-based navigation between search modes
 * - Animated icons and smooth transitions
 * - Responsive design for all screen sizes
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-12 rounded-3xl mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>

      <div className="relative z-10 text-center">
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 text-white animate-bounce flex-shrink-0">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          AI-Powered Resume Matching
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Let our advanced AI find your perfect candidates. We analyze skills,
          experience, and potential matches using state-of-the-art language
          models to deliver precise results.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex">
            <button
              onClick={(e) => onTabChange(e, 0)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 0
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-purple-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              Search by Text
            </button>
            <button
              onClick={(e) => onTabChange(e, 1)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 1
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-purple-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              Upload JD
            </button>
          </div>
        </div>

        {/* Children (Search Input or Upload) */}
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default HeroSection;
