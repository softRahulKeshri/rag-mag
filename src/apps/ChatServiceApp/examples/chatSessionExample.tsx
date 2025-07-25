import React from "react";
import {
  useCreateChatSessionEnhanced,
  useChatSessionsEnhanced,
} from "../hooks";
import type { CreateChatSessionResponse } from "../types/types";

/**
 * Example Component: Chat Session Management with Dummy Data
 *
 * This component demonstrates how to use the React Query hooks for:
 * - Creating new chat sessions
 * - Fetching existing chat sessions
 * - Handling loading and error states
 * - Optimistic updates
 *
 * Uses dummy data to simulate backend API calls
 *
 * @example
 * ```tsx
 * <ChatSessionExample userId="user-123" />
 * ```
 */
const ChatSessionExample: React.FC<{ userId: string }> = ({ userId }) => {
  // Hook for creating chat sessions
  const {
    createSession,
    createDefaultSession,
    isPending: isCreating,
    error: createError,
    isError: hasCreateError,
  } = useCreateChatSessionEnhanced();

  // Hook for fetching chat sessions
  const {
    isLoading: isLoadingSessions,
    error: fetchError,
    isError: hasFetchError,
    getMostRecentSession,
    getSessionsByTitle,
    getTotalSessions,
    refetch: refetchSessions,
  } = useChatSessionsEnhanced(userId);

  // State for search functionality
  const [searchTerm, setSearchTerm] = React.useState("");
  const [customTitle, setCustomTitle] = React.useState("");

  // Handle creating a session with custom title
  const handleCreateCustomSession = async () => {
    if (!customTitle.trim()) return;

    try {
      await createSession(
        customTitle,
        userId,
        (session: CreateChatSessionResponse) => {
          console.log("✅ Custom session created:", session);
          setCustomTitle(""); // Clear input after success
        },
        (error: Error) => {
          console.error("❌ Failed to create custom session:", error);
          // You could show a toast notification here
        }
      );
    } catch (error) {
      console.error("❌ Error in handleCreateCustomSession:", error);
    }
  };

  // Handle creating a session with default title
  const handleCreateDefaultSession = async () => {
    try {
      await createDefaultSession(
        userId,
        (session: CreateChatSessionResponse) => {
          console.log("✅ Default session created:", session);
        },
        (error: Error) => {
          console.error("❌ Failed to create default session:", error);
        }
      );
    } catch (error) {
      console.error("❌ Error in handleCreateDefaultSession:", error);
    }
  };

  // Get filtered sessions based on search term
  const filteredSessions = getSessionsByTitle(searchTerm);
  const mostRecentSession = getMostRecentSession();
  const totalSessions = getTotalSessions();

  // Loading state
  if (isLoadingSessions) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-center mt-2 text-gray-600">
          Loading chat sessions...
        </p>
      </div>
    );
  }

  // Error state for fetching
  if (hasFetchError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">
            Failed to load chat sessions
          </h3>
          <p className="text-red-600 mt-1">{fetchError?.message}</p>
          <button
            onClick={() => refetchSessions()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Chat Session Management (Dummy Data)
        </h2>
        <p className="text-gray-600 mt-1">
          Total sessions: {totalSessions} | User ID: {userId}
        </p>
        <p className="text-sm text-blue-600 mt-2">
          💡 This example uses dummy data to simulate API calls. Network delays
          and occasional errors are simulated.
        </p>
      </div>

      {/* Create Session Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Session
        </h3>

        {/* Custom Title Creation */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="custom-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Create with custom title:
            </label>
            <div className="flex gap-2">
              <input
                id="custom-title"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter session title..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateCustomSession}
                disabled={isCreating || !customTitle.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>

          {/* Default Title Creation */}
          <div>
            <button
              onClick={handleCreateDefaultSession}
              disabled={isCreating}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "Create Default Session"}
            </button>
          </div>
        </div>

        {/* Create Error Display */}
        {hasCreateError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{createError?.message}</p>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Search Sessions
        </h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sessions by title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sessions List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chat Sessions {searchTerm && `(Filtered: ${filteredSessions.length})`}
        </h3>

        {filteredSessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchTerm
              ? "No sessions match your search."
              : "No chat sessions found."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 border rounded-lg ${
                  session.id === mostRecentSession?.id
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {session.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(session.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">ID: {session.id}</p>
                  </div>
                  {session.id === mostRecentSession?.id && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Most Recent
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Debug Information
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Total Sessions:</strong> {totalSessions}
          </p>
          <p>
            <strong>Most Recent Session:</strong>{" "}
            {mostRecentSession?.title || "None"}
          </p>
          <p>
            <strong>Search Term:</strong> "{searchTerm}"
          </p>
          <p>
            <strong>Filtered Results:</strong> {filteredSessions.length}
          </p>
          <p>
            <strong>Is Creating:</strong> {isCreating ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Create Error:</strong> {hasCreateError ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Fetch Error:</strong> {hasFetchError ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Dummy Data Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-yellow-800 font-medium mb-2">
          Dummy Data Features
        </h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Simulated network delays (300-800ms)</li>
          <li>• 10% chance of creation errors</li>
          <li>• 5% chance of fetch errors</li>
          <li>• Persistent dummy data storage</li>
          <li>• Realistic API response format</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatSessionExample;
