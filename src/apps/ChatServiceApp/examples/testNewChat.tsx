import React from "react";
import { useCreateChatSessionEnhanced } from "../hooks";
import type { CreateChatSessionResponse } from "../types/types";

/**
 * Test Component: New Chat API Call
 *
 * This component demonstrates that clicking "New Chat" calls the API
 * and renders the dummy data properly.
 */
const TestNewChat: React.FC = () => {
  const {
    createDefaultSession,
    isPending: isCreating,
    error: createError,
    isError: hasCreateError,
  } = useCreateChatSessionEnhanced();

  const [lastCreatedSession, setLastCreatedSession] =
    React.useState<CreateChatSessionResponse | null>(null);
  const [apiCallCount, setApiCallCount] = React.useState(0);

  const handleTestNewChat = async () => {
    try {
      console.log("🧪 Testing New Chat API call...");
      setApiCallCount((prev) => prev + 1);

      const userId = "test-user-123";

      const session = await createDefaultSession(
        userId,
        (session) => {
          console.log("✅ API Success Callback:", session);
          setLastCreatedSession(session);
        },
        (error) => {
          console.error("❌ API Error Callback:", error);
        }
      );

      console.log("📡 API call completed, returned session:", session);
    } catch (error) {
      console.error("❌ Test failed:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          🧪 New Chat API Test
        </h2>
        <p className="text-blue-700 mb-4">
          This test demonstrates that clicking "New Chat" calls the API and
          renders dummy data.
        </p>

        <button
          onClick={handleTestNewChat}
          disabled={isCreating}
          className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium ${
            isCreating ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isCreating ? "Creating..." : "Test New Chat API Call"}
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Test Results
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            <strong>API Calls Made:</strong> {apiCallCount}
          </p>
          <p>
            <strong>Is Creating:</strong> {isCreating ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Error:</strong> {hasCreateError ? "Yes" : "No"}
          </p>
          {createError && (
            <p>
              <strong>Error:</strong>{" "}
              <span className="text-red-600">{createError.message}</span>
            </p>
          )}
        </div>
      </div>

      {lastCreatedSession && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ Last Created Session
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>ID:</strong> {lastCreatedSession.id}
            </p>
            <p>
              <strong>Title:</strong> {lastCreatedSession.title}
            </p>
            <p>
              <strong>Created At:</strong> {lastCreatedSession.created_at}
            </p>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          📋 Expected Behavior
        </h3>
        <ul className="text-yellow-800 text-sm space-y-1">
          <li>• Click button → API call is made</li>
          <li>• Network delay is simulated (300-800ms)</li>
          <li>• 10% chance of creation error</li>
          <li>• Success: New session appears in list</li>
          <li>• Error: Fallback to local creation</li>
          <li>• Loading state shows during API call</li>
        </ul>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          🔍 Console Logs
        </h3>
        <p className="text-purple-700 text-sm">
          Open browser console to see detailed API call logs:
        </p>
        <ul className="text-purple-700 text-sm space-y-1 mt-2">
          <li>• 🧪 Testing New Chat API call...</li>
          <li>• 🚀 Creating new chat session with payload</li>
          <li>• ✅ Chat session created successfully</li>
          <li>• 📡 API call completed, returned session</li>
        </ul>
      </div>
    </div>
  );
};

export default TestNewChat;
