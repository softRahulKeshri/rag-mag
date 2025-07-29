import React, { useState } from "react";
import { useCreateChatSessionApi, useAuthApi } from "../hooks";
import type { CreateChatSessionResponse } from "../types/types";

/**
 * Example Component: Create Chat Session API Usage
 *
 * This component demonstrates how to use the new useCreateChatSessionApi hook
 * with the real API endpoint and Bearer token authentication.
 */
const CreateChatSessionApiExample: React.FC = () => {
  const {
    createSession,
    createDefaultSession,
    createCustomSession,
    isLoading,
    error,
    clearError,
  } = useCreateChatSessionApi();

  const { isAuthenticated } = useAuthApi();

  const [title, setTitle] = useState("New Chat Session");
  const [userId, setUserId] = useState("7a649226-4bff-4675-b791-c0deabb72226");
  const [sessionResponse, setSessionResponse] =
    useState<CreateChatSessionResponse | null>(null);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSessionResponse(null);

    try {
      console.log("🧪 Testing Create Chat Session API call...");

      const response = await createSession({
        title: title.trim(),
        user_id: userId.trim(),
      });

      setSessionResponse(response);
      console.log("✅ Chat session created successfully:", response);
    } catch (error) {
      console.error("❌ Failed to create chat session:", error);
    }
  };

  const handleCreateDefaultSession = async () => {
    clearError();
    setSessionResponse(null);

    try {
      console.log("🧪 Testing Create Default Chat Session API call...");

      const response = await createDefaultSession(userId.trim());
      setSessionResponse(response);
      console.log("✅ Default chat session created successfully:", response);
    } catch (error) {
      console.error("❌ Failed to create default chat session:", error);
    }
  };

  const handleCreateCustomSession = async () => {
    clearError();
    setSessionResponse(null);

    try {
      console.log("🧪 Testing Create Custom Chat Session API call...");

      const customTitle = `Custom Chat - ${new Date().toLocaleString()}`;
      const response = await createCustomSession(customTitle, userId.trim());
      setSessionResponse(response);
      console.log("✅ Custom chat session created successfully:", response);
    } catch (error) {
      console.error("❌ Failed to create custom chat session:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          🚀 Create Chat Session API Test
        </h2>
        <p className="text-blue-700 mb-4">
          This example demonstrates the new useCreateChatSessionApi hook with
          the real API endpoint.
        </p>
      </div>

      {/* Authentication Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Authentication Status
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Is Authenticated:</strong>{" "}
            {isAuthenticated() ? (
              <span className="text-green-600 font-medium">Yes ✅</span>
            ) : (
              <span className="text-red-600 font-medium">No ❌</span>
            )}
          </p>
          <p>
            <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Error:</strong> {error ? "Yes" : "No"}
          </p>
        </div>

        {!isAuthenticated() && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ Please log in first to test the API. The hook requires a valid
              access token in localStorage.
            </p>
          </div>
        )}
      </div>

      {/* Create Session Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create Chat Session
        </h3>

        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chat Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter chat title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              isLoading || !title.trim() || !userId.trim() || !isAuthenticated()
            }
            className={`w-full px-4 py-2 rounded-md font-medium ${
              isLoading || !title.trim() || !userId.trim() || !isAuthenticated()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Session"}
          </button>
        </form>

        {/* Quick Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleCreateDefaultSession}
            disabled={isLoading || !userId.trim() || !isAuthenticated()}
            className={`w-full px-4 py-2 rounded-md font-medium ${
              isLoading || !userId.trim() || !isAuthenticated()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Default Session"}
          </button>

          <button
            onClick={handleCreateCustomSession}
            disabled={isLoading || !userId.trim() || !isAuthenticated()}
            className={`w-full px-4 py-2 rounded-md font-medium ${
              isLoading || !userId.trim() || !isAuthenticated()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Custom Session"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-red-500 text-xs hover:text-red-700 underline"
            >
              Clear Error
            </button>
          </div>
        )}
      </div>

      {/* Session Response */}
      {sessionResponse && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            ✅ Chat Session Created Successfully
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Session ID:</strong>{" "}
              <span className="font-mono text-xs break-all">
                {sessionResponse.id}
              </span>
            </p>
            <p>
              <strong>Title:</strong> {sessionResponse.title}
            </p>
            <p>
              <strong>Created At:</strong> {sessionResponse.created_at}
            </p>
          </div>
        </div>
      )}

      {/* API Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          📋 API Information
        </h3>
        <ul className="text-yellow-800 text-sm space-y-1">
          <li>
            • <strong>Endpoint:</strong>{" "}
            http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com/api2/chat/chat_sessions
          </li>
          <li>
            • <strong>Method:</strong> POST
          </li>
          <li>
            • <strong>Content-Type:</strong> application/json
          </li>
          <li>
            • <strong>Authorization:</strong> Bearer token (from localStorage)
          </li>
          <li>
            • <strong>Request Payload:</strong> {"{ title, user_id }"}
          </li>
          <li>
            • <strong>Response:</strong> {"{ id, title, created_at }"}
          </li>
        </ul>
      </div>

      {/* Console Logs */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          🔍 Console Logs
        </h3>
        <p className="text-purple-700 text-sm">
          Open browser console to see detailed API call logs:
        </p>
        <ul className="text-purple-700 text-sm space-y-1 mt-2">
          <li>• 🚀 Creating new chat session via API</li>
          <li>• 🔑 Authentication token retrieved from localStorage</li>
          <li>• ✅ Chat session created successfully via API</li>
          <li>• ❌ Error handling for various HTTP status codes</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateChatSessionApiExample;
