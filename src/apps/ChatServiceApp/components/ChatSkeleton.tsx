import React from "react";
import {
  Skeleton,
  ChatMessageSkeleton,
  ChatListItemSkeleton,
  LoadingSpinner,
  LoadingDots,
} from "../../../components/ui/Skeleton";

// Chat interface skeleton - shows the main chat area
interface ChatInterfaceSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
}

export const ChatInterfaceSkeleton: React.FC<ChatInterfaceSkeletonProps> = ({
  className = "",
  showHeader = true,
  showSidebar = true,
}) => {
  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Skeleton height="24px" width="120px" />
              <Skeleton width="40px" height="40px" rounded="lg" />
            </div>
            <Skeleton height="40px" width="100%" rounded="lg" />
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <ChatListItemSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {showHeader && (
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
                <Skeleton width="32px" height="32px" rounded="lg" />
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Message */}
          <ChatMessageSkeleton isUser={false} />

          {/* User Message */}
          <ChatMessageSkeleton isUser={true} />

          {/* AI Message */}
          <ChatMessageSkeleton isUser={false} />

          {/* User Message */}
          <ChatMessageSkeleton isUser={true} />

          {/* AI Message */}
          <ChatMessageSkeleton isUser={false} />
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

// Chat sessions list skeleton
interface ChatSessionsListSkeletonProps {
  className?: string;
  items?: number;
}

export const ChatSessionsListSkeleton: React.FC<
  ChatSessionsListSkeletonProps
> = ({ className = "", items = 6 }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <ChatListItemSkeleton key={index} />
      ))}
    </div>
  );
};

// Chat messages skeleton
interface ChatMessagesSkeletonProps {
  className?: string;
  messageCount?: number;
}

export const ChatMessagesSkeleton: React.FC<ChatMessagesSkeletonProps> = ({
  className = "",
  messageCount = 5,
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: messageCount }).map((_, index) => (
        <ChatMessageSkeleton
          key={index}
          isUser={index % 2 === 1} // Alternate between user and AI
        />
      ))}
    </div>
  );
};

// Centered loading state for chat
interface ChatLoadingStateProps {
  className?: string;
  message?: string;
  showSpinner?: boolean;
  showDots?: boolean;
}

export const ChatLoadingState: React.FC<ChatLoadingStateProps> = ({
  className = "",
  message = "Loading chat...",
  showSpinner = true,
  showDots = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Brand gradient logo container */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#3077F3] via-[#B96AF7] to-[#FDA052] rounded-xl flex items-center justify-center shadow-lg">
          {showSpinner ? (
            <LoadingSpinner size="md" className="text-white" />
          ) : (
            <div className="w-6 h-6 bg-white rounded" />
          )}
        </div>
        {/* Animated accent ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#3077F3] to-[#B96AF7] rounded-xl opacity-20 animate-ping" />
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-sm font-medium text-[#2E3141]">{message}</p>
      </div>

      {/* Animated dots */}
      {showDots && <LoadingDots />}
    </div>
  );
};

// AI typing indicator skeleton
interface AITypingIndicatorSkeletonProps {
  className?: string;
}

export const AITypingIndicatorSkeleton: React.FC<
  AITypingIndicatorSkeletonProps
> = ({ className = "" }) => {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
        <div className="flex items-center space-x-2">
          <Skeleton width="8px" height="8px" rounded="full" />
          <Skeleton width="8px" height="8px" rounded="full" />
          <Skeleton width="8px" height="8px" rounded="full" />
        </div>
      </div>
    </div>
  );
};

// Model selector skeleton
interface ModelSelectorSkeletonProps {
  className?: string;
}

export const ModelSelectorSkeleton: React.FC<ModelSelectorSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Skeleton width="24px" height="24px" rounded="lg" />
      <Skeleton height="16px" width="80px" />
      <Skeleton width="16px" height="16px" rounded="full" />
    </div>
  );
};

// Chat header skeleton
interface ChatHeaderSkeletonProps {
  className?: string;
}

export const ChatHeaderSkeleton: React.FC<ChatHeaderSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton width="40px" height="40px" rounded="full" />
          <div>
            <Skeleton height="18px" width="150px" className="mb-1" />
            <Skeleton height="14px" width="100px" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ModelSelectorSkeleton />
          <Skeleton width="32px" height="32px" rounded="lg" />
          <Skeleton width="32px" height="32px" rounded="lg" />
        </div>
      </div>
    </div>
  );
};

// Message input skeleton
interface MessageInputSkeletonProps {
  className?: string;
}

export const MessageInputSkeleton: React.FC<MessageInputSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <Skeleton height="80px" width="100%" rounded="lg" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton width="40px" height="40px" rounded="lg" />
          <Skeleton width="40px" height="40px" rounded="lg" />
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceSkeleton;
