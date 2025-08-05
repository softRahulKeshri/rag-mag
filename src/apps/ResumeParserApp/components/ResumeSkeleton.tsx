import React from "react";
import {
  Skeleton,
  CardSkeleton,
  ResumeCardSkeleton,
  SearchInputSkeleton,
  GridSkeleton,
  LoadingSpinner,
  LoadingDots,
} from "../../../components/ui/Skeleton";

// Resume search skeleton
interface ResumeSearchSkeletonProps {
  className?: string;
}

export const ResumeSearchSkeleton: React.FC<ResumeSearchSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${className}`}>
      {/* Search Status */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-3 rounded-full border border-blue-200">
          <LoadingSpinner size="sm" />
          <span className="text-blue-700 font-medium">
            Analyzing resumes...
          </span>
        </div>
      </div>

      {/* Loading Cards Grid */}
      <GridSkeleton
        items={6}
        columns={3}
        itemComponent={CardSkeleton}
        className="mb-8"
      />

      {/* Additional Loading Indicators */}
      <div className="mt-12 text-center space-y-4">
        <LoadingDots />
        <p className="text-gray-500 text-sm">
          Our AI is carefully analyzing each resume to find the best matches...
        </p>
      </div>
    </div>
  );
};

// Resume store skeleton
interface ResumeStoreSkeletonProps {
  className?: string;
}

export const ResumeStoreSkeleton: React.FC<ResumeStoreSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Loading Header */}
      <div className="animate-pulse">
        <Skeleton height="32px" width="200px" className="mb-2" />
        <Skeleton height="16px" width="300px" />
      </div>

      {/* Loading Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center">
              <Skeleton width="48px" height="48px" rounded="lg" />
              <div className="ml-4 space-y-2">
                <Skeleton height="16px" width="80px" />
                <Skeleton height="24px" width="64px" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Search and Filter */}
      <SearchInputSkeleton />

      {/* Loading Resume Cards */}
      <GridSkeleton items={6} columns={3} itemComponent={ResumeCardSkeleton} />

      {/* Loading Pagination */}
      <div className="flex justify-center animate-pulse">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="40px" height="40px" rounded="md" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Resume upload skeleton
interface ResumeUploadSkeletonProps {
  className?: string;
}

export const ResumeUploadSkeleton: React.FC<ResumeUploadSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Zone Skeleton */}
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

      {/* Group Selector Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Skeleton height="20px" width="120px" className="mb-4" />
        <Skeleton height="40px" width="100%" rounded="lg" />
      </div>

      {/* Uploaded Files Skeleton */}
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

// Candidate card skeleton
interface CandidateCardSkeletonProps {
  className?: string;
}

export const CandidateCardSkeleton: React.FC<CandidateCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton height="20px" width="80%" className="mb-2" />
            <Skeleton height="16px" width="60%" />
          </div>
          <Skeleton width="64px" height="32px" rounded="lg" />
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-2">
              <Skeleton height="12px" width="60%" className="mb-1" />
              <Skeleton height="16px" width="40%" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="90%" />
          <Skeleton height="16px" width="75%" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton height="36px" width="100px" rounded="md" />
          <Skeleton height="36px" width="80px" rounded="md" />
        </div>
      </div>
    </div>
  );
};

// Search results skeleton
interface SearchResultsSkeletonProps {
  className?: string;
  candidateCount?: number;
}

export const SearchResultsSkeleton: React.FC<SearchResultsSkeletonProps> = ({
  className = "",
  candidateCount = 6,
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" className="mt-2" />
      </div>

      {/* Candidate Cards */}
      <GridSkeleton
        items={candidateCount}
        columns={3}
        itemComponent={CandidateCardSkeleton}
      />
    </div>
  );
};

// Upload progress skeleton
interface UploadProgressSkeletonProps {
  className?: string;
  fileCount?: number;
}

export const UploadProgressSkeleton: React.FC<UploadProgressSkeletonProps> = ({
  className = "",
  fileCount = 3,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fileCount }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Skeleton width="32px" height="32px" rounded="lg" />
              <Skeleton height="16px" width="150px" />
            </div>
            <Skeleton height="16px" width="60px" />
          </div>
          <div className="space-y-2">
            <Skeleton height="8px" width="100%" rounded="full" />
            <div className="flex justify-between text-sm">
              <Skeleton height="12px" width="80px" />
              <Skeleton height="12px" width="60px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Group selector skeleton
interface GroupSelectorSkeletonProps {
  className?: string;
}

export const GroupSelectorSkeleton: React.FC<GroupSelectorSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Skeleton height="40px" width="100%" rounded="lg" />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Skeleton width="16px" height="16px" rounded="full" />
      </div>
    </div>
  );
};

// Loading state with brand colors
interface ResumeLoadingStateProps {
  className?: string;
  message?: string;
  showSpinner?: boolean;
  showDots?: boolean;
}

export const ResumeLoadingState: React.FC<ResumeLoadingStateProps> = ({
  className = "",
  message = "Loading resumes...",
  showSpinner = true,
  showDots = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Brand gradient logo container */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          {showSpinner ? (
            <LoadingSpinner size="md" className="text-white" />
          ) : (
            <div className="w-6 h-6 bg-white rounded" />
          )}
        </div>
        {/* Animated accent ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-20 animate-ping" />
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

export default ResumeSearchSkeleton;
