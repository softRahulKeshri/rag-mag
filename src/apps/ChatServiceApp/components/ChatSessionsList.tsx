import React, { useEffect } from "react";
import { useFetchUserChatSessions } from "../hooks";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ChatSessionsListSkeleton } from "./ChatSkeleton";

interface ChatSessionsListProps {
  userId: string;
  onSessionSelect?: (sessionId: string) => void;
  className?: string;
}

/**
 * ChatSessionsList Component
 *
 * Displays a list of chat sessions for a specific user with:
 * - Loading states and error handling
 * - Session selection functionality
 * - Clean, responsive UI design
 * - Real-time data fetching
 *
 * @example
 * ```typescript
 * <ChatSessionsList
 *   userId="user-123"
 *   onSessionSelect={(sessionId) => console.log('Selected:', sessionId)}
 * />
 * ```
 */
const ChatSessionsList: React.FC<ChatSessionsListProps> = ({
  userId,
  onSessionSelect,
  className = "",
}) => {
  const {
    fetchUserChatSessions,
    isLoading,
    error,
    getSortedSessions,
    getTotalSessions,
    clearError,
  } = useFetchUserChatSessions();

  // Fetch sessions on component mount
  useEffect(() => {
    if (userId) {
      fetchUserChatSessions(userId).catch(console.error);
    }
  }, [userId, fetchUserChatSessions]);

  // Handle session selection
  const handleSessionClick = (sessionId: string) => {
    if (onSessionSelect) {
      onSessionSelect(sessionId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffInHours < 168) {
        // 7 days
        return date.toLocaleDateString([], { weekday: "short" });
      } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
      }
    } catch {
      return "Unknown";
    }
  };

  // Truncate title for display
  const truncateTitle = (title: string, maxLength: number = 30): string => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
            Chat Sessions
          </h3>
        </div>
        <div className="p-6">
          <ChatSessionsListSkeleton items={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
            Chat Sessions
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-3 text-red-600">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading chat sessions</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearError();
              fetchUserChatSessions(userId);
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sortedSessions = getSortedSessions();
  const totalSessions = getTotalSessions();

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
            Chat Sessions
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {totalSessions} {totalSessions === 1 ? "session" : "sessions"}
          </span>
        </div>
      </div>

      {/* Sessions List */}
      <div className="divide-y divide-gray-100">
        {sortedSessions.length === 0 ? (
          <div className="p-6 text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No chat sessions found</p>
            <p className="text-sm text-gray-400 mt-1">
              Start a new conversation to see your chat history here
            </p>
          </div>
        ) : (
          sortedSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                onSessionSelect ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {truncateTitle(session.title)}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <ClockIcon className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                </div>
                {onSessionSelect && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with refresh button */}
      {sortedSessions.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => fetchUserChatSessions(userId)}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Refresh Sessions
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSessionsList;
