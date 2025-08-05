import React from "react";

// Base skeleton component with shimmer animation
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "md",
  animated = true,
}) => {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200";
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
  const animationClasses = animated ? "animate-pulse" : "";

  return (
    <div
      className={`${baseClasses} ${roundedClasses[rounded]} ${animationClasses} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

// Chat message skeleton
interface ChatMessageSkeletonProps {
  isUser?: boolean;
  className?: string;
}

export const ChatMessageSkeleton: React.FC<ChatMessageSkeletonProps> = ({
  isUser = false,
  className = "",
}) => {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } ${className}`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isUser ? "bg-blue-500" : "bg-gray-100"
        } rounded-2xl px-4 py-3`}
      >
        <div className="space-y-2">
          <Skeleton height="16px" width="80%" />
          <Skeleton height="16px" width="60%" />
          <Skeleton height="16px" width="90%" />
        </div>
      </div>
    </div>
  );
};

// Chat list item skeleton
interface ChatListItemSkeletonProps {
  className?: string;
}

export const ChatListItemSkeleton: React.FC<ChatListItemSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg ${className}`}
    >
      <Skeleton width="40px" height="40px" rounded="full" />
      <div className="flex-1 min-w-0">
        <Skeleton height="16px" width="70%" className="mb-1" />
        <Skeleton height="12px" width="50%" />
      </div>
      <Skeleton width="12px" height="12px" rounded="full" />
    </div>
  );
};

// Card skeleton
interface CardSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showActions?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = "",
  showHeader = true,
  showActions = true,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <Skeleton height="20px" width="60%" className="mb-2" />
            <Skeleton height="16px" width="40%" />
          </div>
          <Skeleton width="60px" height="32px" rounded="lg" />
        </div>
      )}

      <div className="space-y-3 mb-4">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="85%" />
        <Skeleton height="16px" width="70%" />
      </div>

      {showActions && (
        <div className="flex gap-2">
          <Skeleton height="36px" width="80px" rounded="md" />
          <Skeleton height="36px" width="60px" rounded="md" />
        </div>
      )}
    </div>
  );
};

// Resume card skeleton
interface ResumeCardSkeletonProps {
  className?: string;
}

export const ResumeCardSkeleton: React.FC<ResumeCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="space-y-4">
        {/* File Icon and Info */}
        <div className="flex items-center space-x-3">
          <Skeleton width="40px" height="40px" rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton height="16px" width="75%" />
            <Skeleton height="12px" width="50%" />
          </div>
        </div>

        {/* Status Badge */}
        <Skeleton height="24px" width="80px" rounded="full" />

        {/* Actions */}
        <div className="flex space-x-2">
          <Skeleton height="32px" width="64px" rounded="md" />
          <Skeleton height="32px" width="64px" rounded="md" />
          <Skeleton height="32px" width="64px" rounded="md" />
        </div>
      </div>
    </div>
  );
};

// Pitch card skeleton
interface PitchCardSkeletonProps {
  className?: string;
}

export const PitchCardSkeleton: React.FC<PitchCardSkeletonProps> = ({
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Skeleton height="24px" width="60px" rounded="full" />
          <Skeleton height="24px" width="80px" rounded="full" />
          <Skeleton height="24px" width="70px" rounded="full" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="90%" />
          <Skeleton height="16px" width="75%" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Skeleton height="36px" width="100px" rounded="md" />
          <Skeleton height="36px" width="80px" rounded="md" />
        </div>
      </div>
    </div>
  );
};

// Search input skeleton
interface SearchInputSkeletonProps {
  className?: string;
}

export const SearchInputSkeleton: React.FC<SearchInputSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex flex-col lg:flex-row gap-4 ${className}`}>
      <div className="flex-1">
        <Skeleton height="40px" width="100%" rounded="lg" />
      </div>
      <div className="lg:w-64">
        <Skeleton height="40px" width="100%" rounded="lg" />
      </div>
    </div>
  );
};

// Table skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} height="20px" width="120px" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height="16px" width="100px" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Grid skeleton
interface GridSkeletonProps {
  items?: number;
  columns?: number;
  className?: string;
  itemComponent?: React.ComponentType<{ className?: string }>;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  items = 6,
  columns = 3,
  className = "",
  itemComponent: ItemComponent = CardSkeleton,
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div
      className={`grid gap-6 ${
        gridCols[columns as keyof typeof gridCols]
      } ${className}`}
    >
      {Array.from({ length: items }).map((_, index) => (
        <ItemComponent key={index} className="animate-pulse" />
      ))}
    </div>
  );
};

// Loading spinner with brand colors
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
};

// Loading dots
interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ className = "" }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
};

// Full page skeleton
interface FullPageSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
}

export const FullPageSkeleton: React.FC<FullPageSkeletonProps> = ({
  className = "",
  showHeader = true,
  showSidebar = true,
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showHeader && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton height="32px" width="200px" />
            <div className="flex items-center space-x-4">
              <Skeleton height="40px" width="40px" rounded="full" />
              <Skeleton height="20px" width="100px" />
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {showSidebar && (
          <div className="w-64 bg-white border-r border-gray-200 p-6">
            <div className="space-y-4">
              <Skeleton height="20px" width="80%" />
              <Skeleton height="16px" width="60%" />
              <Skeleton height="16px" width="70%" />
              <Skeleton height="16px" width="50%" />
            </div>
          </div>
        )}

        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton height="40px" width="300px" />
            <GridSkeleton items={6} columns={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
