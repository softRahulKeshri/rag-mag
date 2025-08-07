import React from "react";
import {
  Skeleton,
  ChatListItemSkeleton,
} from "../../../components/ui/Skeleton";
import { SparklesIcon, UserIcon } from "@heroicons/react/24/outline";

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
    <div
      className={`flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30 ${className}`}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-xl">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div
                    className="h-5 bg-gray-200 rounded-lg animate-pulse"
                    style={{ width: "120px" }}
                  />
                  <div
                    className="h-3 bg-gray-200 rounded animate-pulse"
                    style={{ width: "80px" }}
                  />
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl animate-pulse" />
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors animate-pulse"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{ width: `${70 + index * 5}%` }}
                  />
                  <div
                    className="h-3 bg-gray-200 rounded animate-pulse"
                    style={{ width: `${50 + index * 3}%` }}
                  />
                </div>
                <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        {/* Chat Header */}
        {showHeader && (
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div
                    className="h-5 bg-gray-200 rounded-lg animate-pulse"
                    style={{ width: "150px" }}
                  />
                  <div
                    className="h-3 bg-gray-200 rounded animate-pulse"
                    style={{ width: "100px" }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50/30 to-white">
          {/* AI Message */}
          <div className="flex justify-start animate-pulse">
            <div className="max-w-md bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl px-6 py-4 shadow-lg border border-white/20">
              <div className="space-y-3">
                <div
                  className="h-4 bg-white/30 rounded-full"
                  style={{ width: "85%" }}
                />
                <div
                  className="h-4 bg-white/30 rounded-full"
                  style={{ width: "70%" }}
                />
                <div
                  className="h-4 bg-white/30 rounded-full"
                  style={{ width: "90%" }}
                />
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end animate-pulse">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* User Message Bubble */}
              <div className="max-w-md bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl px-4 py-3 shadow-lg">
                <div className="space-y-2">
                  <div
                    className="h-4 bg-white/30 rounded-full"
                    style={{ width: "75%" }}
                  />
                  <div
                    className="h-4 bg-white/30 rounded-full"
                    style={{ width: "60%" }}
                  />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <div
                    className="h-3 bg-white/20 rounded"
                    style={{ width: "60px" }}
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
          <div className="flex justify-start animate-pulse">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* AI Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* AI Message Bubble */}
              <div className="max-w-md bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="space-y-2">
                  <div
                    className="h-4 bg-gray-200 rounded-full"
                    style={{ width: "80%" }}
                  />
                  <div
                    className="h-4 bg-gray-200 rounded-full"
                    style={{ width: "65%" }}
                  />
                  <div
                    className="h-4 bg-gray-200 rounded-full"
                    style={{ width: "85%" }}
                  />
                  <div
                    className="h-4 bg-gray-200 rounded-full"
                    style={{ width: "55%" }}
                  />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <div
                    className="h-3 bg-gray-200 rounded"
                    style={{ width: "60px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end animate-pulse">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* User Message Bubble */}
              <div className="max-w-md bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl px-4 py-3 shadow-lg">
                <div className="space-y-2">
                  <div
                    className="h-4 bg-white/30 rounded-full"
                    style={{ width: "70%" }}
                  />
                  <div
                    className="h-4 bg-white/30 rounded-full"
                    style={{ width: "90%" }}
                  />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <div
                    className="h-3 bg-white/20 rounded"
                    style={{ width: "60px" }}
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
          <div className="flex justify-start animate-pulse">
            <div className="flex items-end space-x-3 max-w-2xl">
              {/* AI Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* AI Message Bubble */}
              <div className="max-w-md bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="space-y-2">
                  <div
                    className="h-4 bg-gray-200 rounded-full"
                    style={{ width: "90%" }}
                  />
                  <div
                    className="h-4 bg-gray-200 rounded-full"
                    style={{ width: "75%" }}
                  />
                </div>
                {/* Timestamp */}
                <div className="mt-2">
                  <div
                    className="h-3 bg-gray-200 rounded"
                    style={{ width: "60px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 shadow-lg">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse border border-gray-200/50" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl animate-pulse shadow-lg" />
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
    <div
      className={`h-full overflow-y-auto bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20 ${className}`}
    >
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {Array.from({ length: messageCount }).map((_, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 1 ? "justify-end" : "justify-start"
            } animate-pulse`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div
              className={`flex ${
                index % 2 === 1 ? "flex-row-reverse" : "flex-row"
              } items-end space-x-3 max-w-2xl`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index % 2 === 1
                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-purple-500 to-blue-600"
                  } animate-pulse`}
                >
                  {index % 2 === 1 ? (
                    <UserIcon className="w-4 h-4 text-white" />
                  ) : (
                    <SparklesIcon className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`relative ${index % 2 === 1 ? "mr-2" : "ml-2"}`}>
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    index % 2 === 1
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-white border border-gray-200 shadow-sm"
                  } rounded-2xl px-4 py-3 shadow-lg`}
                >
                  {/* Message content lines */}
                  <div className="space-y-2">
                    {/* First line - always present */}
                    <div
                      className={`h-4 rounded-full ${
                        index % 2 === 1 ? "bg-white/30" : "bg-gray-200"
                      }`}
                      style={{ width: `${75 + index * 3}%` }}
                    />

                    {/* Second line - most messages have it */}
                    {index !== 0 && (
                      <div
                        className={`h-4 rounded-full ${
                          index % 2 === 1 ? "bg-white/30" : "bg-gray-200"
                        }`}
                        style={{ width: `${60 + index * 2}%` }}
                      />
                    )}

                    {/* Third line - for longer messages */}
                    {(index === 0 || index === 2 || index === 4) && (
                      <div
                        className={`h-4 rounded-full ${
                          index % 2 === 1 ? "bg-white/30" : "bg-gray-200"
                        }`}
                        style={{ width: `${85 - index * 5}%` }}
                      />
                    )}

                    {/* Fourth line - for very long messages */}
                    {index === 0 && (
                      <div
                        className={`h-4 rounded-full ${
                          index % 2 === 1 ? "bg-white/30" : "bg-gray-200"
                        }`}
                        style={{ width: "45%" }}
                      />
                    )}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`mt-2 text-xs ${
                      index % 2 === 1 ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`h-3 rounded ${
                        index % 2 === 1 ? "bg-white/20" : "bg-gray-200"
                      }`}
                      style={{ width: "60px" }}
                    />
                  </div>
                </div>

                {/* Message tail */}
                <div
                  className={`absolute top-3 ${
                    index % 2 === 1 ? "-right-2" : "-left-2"
                  } w-3 h-3 ${
                    index % 2 === 1
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-white border-l border-b border-gray-200"
                  } transform rotate-45`}
                />
              </div>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        <div className="flex justify-start animate-pulse">
          <div className="flex items-end space-x-3 max-w-2xl">
            {/* AI Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse" />
            </div>

            {/* Typing Bubble */}
            <div className="relative ml-2">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    AI is thinking
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>

              {/* Message tail */}
              <div className="absolute top-3 -left-2 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Centered loading state for chat

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
