import React from "react";
import {
  Skeleton,
  PitchCardSkeleton,
  SearchInputSkeleton,
  GridSkeleton,
  LoadingSpinner,
  LoadingDots,
} from "../../../components/ui/Skeleton";
import { SparklesIcon, UserIcon } from "@heroicons/react/24/outline";

// Pitch list skeleton
interface PitchListSkeletonProps {
  className?: string;
  pitchCount?: number;
}

export const PitchListSkeleton: React.FC<PitchListSkeletonProps> = ({
  className = "",
  pitchCount = 6,
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height="24px" width="200px" />
          <Skeleton height="16px" width="300px" />
        </div>
        <Skeleton width="120px" height="40px" rounded="lg" />
      </div>

      {/* Search and Filter */}
      <SearchInputSkeleton />

      {/* Pitch Cards Grid */}
      <GridSkeleton
        items={pitchCount}
        columns={3}
        itemComponent={PitchCardSkeleton}
      />

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="40px" height="40px" rounded="md" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Pitch details skeleton
interface PitchDetailsSkeletonProps {
  className?: string;
}

export const PitchDetailsSkeleton: React.FC<PitchDetailsSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton height="24px" width="80%" className="mb-2" />
            <Skeleton height="16px" width="60%" />
          </div>
          <Skeleton width="100px" height="32px" rounded="lg" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton width="40px" height="40px" rounded="full" />
          <div className="space-y-1">
            <Skeleton height="16px" width="120px" />
            <Skeleton height="12px" width="80px" />
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Skeleton height="20px" width="120px" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton height="16px" width="80px" />
              <Skeleton height="24px" width="60px" />
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Sections */}
      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton height="20px" width="150px" />
            <Skeleton width="60px" height="24px" rounded="full" />
          </div>
          <div className="space-y-3">
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="90%" />
            <Skeleton height="16px" width="80%" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, tagIndex) => (
              <Skeleton
                key={tagIndex}
                height="24px"
                width="80px"
                rounded="full"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Pitch upload skeleton
interface PitchUploadSkeletonProps {
  className?: string;
}

export const PitchUploadSkeleton: React.FC<PitchUploadSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Zone */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="space-y-4">
          <Skeleton
            width="64px"
            height="64px"
            rounded="lg"
            className="mx-auto"
          />
          <div className="space-y-2">
            <Skeleton height="20px" width="200px" className="mx-auto" />
            <Skeleton height="16px" width="300px" className="mx-auto" />
          </div>
          <Skeleton
            height="40px"
            width="120px"
            rounded="lg"
            className="mx-auto"
          />
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Skeleton height="20px" width="150px" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
            >
              <Skeleton width="40px" height="40px" rounded="lg" />
              <div className="flex-1 space-y-2">
                <Skeleton height="16px" width="200px" />
                <Skeleton height="12px" width="100px" />
              </div>
              <Skeleton width="60px" height="24px" rounded="full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pitch chat skeleton
interface PitchChatSkeletonProps {
  className?: string;
}

export const PitchChatSkeleton: React.FC<PitchChatSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton width="40px" height="40px" rounded="full" />
              <div>
                <Skeleton height="18px" width="150px" className="mb-1" />
                <Skeleton height="14px" width="100px" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton width="32px" height="32px" rounded="lg" />
              <Skeleton width="32px" height="32px" rounded="lg" />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Message */}
          <div className="flex justify-start">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* AI Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* AI Message Bubble */}
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm max-w-xs">
                <div className="space-y-2">
                  <Skeleton height="16px" width="80%" />
                  <Skeleton height="16px" width="60%" />
                  <Skeleton height="16px" width="90%" />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <Skeleton height="12px" width="60px" />
                </div>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* User Message Bubble */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl px-4 py-3 shadow-lg max-w-xs">
                <div className="space-y-2">
                  <Skeleton height="16px" width="70%" className="bg-white/30" />
                  <Skeleton height="16px" width="85%" className="bg-white/30" />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <Skeleton
                    height="12px"
                    width="60px"
                    className="bg-white/20"
                  />
                </div>
              </div>
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center animate-pulse">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex justify-start">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* AI Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* AI Message Bubble */}
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm max-w-xs">
                <div className="space-y-2">
                  <Skeleton height="16px" width="90%" />
                  <Skeleton height="16px" width="75%" />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <Skeleton height="12px" width="60px" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Skeleton height="80px" width="100%" rounded="lg" />
            </div>
            <Skeleton width="40px" height="40px" rounded="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating chat skeleton
interface FloatingChatSkeletonProps {
  className?: string;
}

export const FloatingChatSkeleton: React.FC<FloatingChatSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Skeleton width="32px" height="32px" rounded="full" />
          <div className="flex-1">
            <Skeleton height="16px" width="120px" />
            <Skeleton height="12px" width="80px" />
          </div>
          <Skeleton width="24px" height="24px" rounded="lg" />
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
              <div className="space-y-1">
                <Skeleton height="12px" width="80%" />
                <Skeleton height="12px" width="60%" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Skeleton height="32px" width="100%" rounded="lg" />
          <Skeleton width="32px" height="32px" rounded="lg" />
        </div>
      </div>
    </div>
  );
};

// Pitch analysis skeleton
interface PitchAnalysisSkeletonProps {
  className?: string;
}

export const PitchAnalysisSkeleton: React.FC<PitchAnalysisSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Investment Decision */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton height="20px" width="150px" />
          <Skeleton width="100px" height="32px" rounded="full" />
        </div>
        <div className="space-y-3">
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="90%" />
          <Skeleton height="16px" width="80%" />
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Skeleton height="20px" width="120px" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton height="16px" width="80px" />
              <Skeleton height="24px" width="60px" />
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Skeleton height="20px" width="100px" className="mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton width="16px" height="16px" rounded="full" />
                <Skeleton height="16px" width="80%" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Skeleton height="20px" width="120px" className="mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton width="16px" height="16px" rounded="full" />
                <Skeleton height="16px" width="80%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading state with brand colors
interface PitchLoadingStateProps {
  className?: string;
  message?: string;
  showSpinner?: boolean;
  showDots?: boolean;
}

export const PitchLoadingState: React.FC<PitchLoadingStateProps> = ({
  className = "",
  message = "Analyzing pitch...",
  showSpinner = true,
  showDots = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Brand gradient logo container */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          {showSpinner ? (
            <LoadingSpinner size="md" className="text-white" />
          ) : (
            <div className="w-6 h-6 bg-white rounded" />
          )}
        </div>
        {/* Animated accent ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl opacity-20 animate-ping" />
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>

      {/* Animated dots */}
      {showDots && <LoadingDots />}
    </div>
  );
};

export default PitchListSkeleton;
