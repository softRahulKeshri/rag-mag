import React, { useState } from "react";
import { useLoginApi } from "../hooks";
import type { LoginResponse } from "../types/api";

/**
 * Example Component: Login API Usage
 *
 * This component demonstrates how to use the login API hook
 * with the specified endpoint and payload structure.
 */
const LoginExample: React.FC = () => {
  const {
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    logout,
  } = useLoginApi();

  const [username, setUsername] = useState("RK");
  const [password, setPassword] = useState("1234");
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(
    null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoginResponse(null);

    try {
      console.log("🧪 Testing Login API call...");

      const response = await login({
        username,
        password,
      });

      setLoginResponse(response);
      console.log("✅ Login successful:", response);
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginResponse(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          🔐 Login API Test
        </h2>
        <p className="text-blue-700 mb-4">
          This example demonstrates the login API hook with the specified
          endpoint.
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Form</h3>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className={`w-full px-4 py-2 rounded-md font-medium ${
              isLoading || !username.trim() || !password.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Authentication Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Authentication Status
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Is Authenticated:</strong>{" "}
            {isAuthenticated() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Error:</strong> {error ? "Yes" : "No"}
          </p>
        </div>

        {isAuthenticated() && (
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Login Response */}
      {loginResponse && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            ✅ Login Response
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Access Token:</strong>{" "}
              <span className="font-mono text-xs break-all">
                {loginResponse.access_token.substring(0, 50)}...
              </span>
            </p>
            <p>
              <strong>Token Type:</strong> {loginResponse.token_type}
            </p>
            <p>
              <strong>User ID:</strong> {loginResponse.user_id}
            </p>
            <p>
              <strong>Username:</strong> {loginResponse.username}
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
            http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com/api2/auth/login
          </li>
          <li>
            • <strong>Method:</strong> POST
          </li>
          <li>
            • <strong>Content-Type:</strong> application/json
          </li>
          <li>
            • <strong>Request Payload:</strong> {"{ username, password }"}
          </li>
          <li>
            • <strong>Response:</strong>{" "}
            {"{ access_token, token_type, user_id, username }"}
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
          <li>• 🔐 Login API: Logging in user</li>
          <li>• 🔑 Authentication token stored successfully</li>
          <li>• ✅ User logged in successfully</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginExample;
