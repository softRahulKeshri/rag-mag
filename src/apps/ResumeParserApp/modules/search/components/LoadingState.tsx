import React from "react";
import type { LoadingStateProps } from "../types";

/**
 * LoadingState Component
 *
 * Modern skeleton loading interface with animations.
 *
 * Features:
 * - Animated skeleton cards
 * - Shimmer effects
 * - Realistic content placeholders
 * - Responsive design
 * - Professional loading indicators
 */
const LoadingState: React.FC<LoadingStateProps> = ({ isSearching }) => {
  if (!isSearching) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Status */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
          <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-blue-600 font-medium">
            Analyzing resumes...
          </span>
        </div>
      </div>

      {/* Loading Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header Skeleton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded-md mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-lg ml-3"></div>
            </div>

            {/* Score Cards Skeleton */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[...Array(4)].map((_, scoreIndex) => (
                <div key={scoreIndex} className="bg-gray-100 rounded-lg p-2">
                  <div className="h-3 bg-gray-300 rounded w-2/3 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded-md flex-1"></div>
              <div className="h-8 bg-gray-200 rounded-md w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Loading Indicators */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
        <p className="text-gray-500 text-sm">
          Our AI is carefully analyzing each resume to find the best matches...
        </p>
      </div>


    </div>
  );
};

export default LoadingState;
