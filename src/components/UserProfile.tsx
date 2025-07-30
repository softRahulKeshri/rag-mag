import React from "react";
import { useUser, useSettings, useActions, useIsAuthenticated } from "../store";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import ChatSessionsList from "../apps/ChatServiceApp/components/ChatSessionsList";

/**
 * UserProfile Component
 *
 * Demonstrates the usage of the global Zustand store for:
 * - User authentication state
 * - User profile information
 * - Application settings
 * - Theme switching
 *
 * This component shows how to access and modify global state
 * in a clean, type-safe manner.
 */
const UserProfile: React.FC = () => {
  const user = useUser();
  const settings = useSettings();
  const { updateSettings, toggleTheme, logout } = useActions();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* User Information */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <UserCircleIcon className="h-16 w-16 text-blue-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user.username}
            </h3>
            <p className="text-gray-600">{user.email || "No email provided"}</p>
            <p className="text-sm text-gray-500">User ID: {user.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Role:</span>
            <span className="ml-2 text-gray-600 capitalize">
              {user.role || "user"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {user.lastLoginAt && (
            <div className="col-span-2">
              <span className="font-medium text-gray-700">Last Login:</span>
              <span className="ml-2 text-gray-600">
                {new Date(user.lastLoginAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        </div>

        {/* Theme Setting */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-700">Theme</p>
            <p className="text-sm text-gray-500">Choose your preferred theme</p>
          </div>
          <button
            onClick={handleThemeToggle}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {settings.theme === "dark" ? (
              <>
                <MoonIcon className="h-4 w-4" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <SunIcon className="h-4 w-4" />
                <span>Light</span>
              </>
            )}
          </button>
        </div>

        {/* Language Setting */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-700">Language</p>
            <p className="text-sm text-gray-500">Application language</p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="py-3">
          <p className="font-medium text-gray-700 mb-3">Notifications</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      email: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Email notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      push: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Push notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      sms: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">SMS notifications</span>
            </label>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Debug Information</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p>Current Theme: {settings.theme}</p>
          <p>Language: {settings.language}</p>
          <p>Auto Save: {settings.autoSave ? "Enabled" : "Disabled"}</p>
          <p>Sidebar Collapsed: {settings.sidebarCollapsed ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Chat Sessions */}
      <div className="mt-6">
        <ChatSessionsList
          userId={user.id}
          onSessionSelect={(sessionId) => {
            console.log("Selected chat session:", sessionId);
            // TODO: Navigate to chat session or open in modal
          }}
        />
      </div>
    </div>
  );
};

export default UserProfile;
