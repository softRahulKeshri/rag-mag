import { useState, useRef, useEffect } from "react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useUser, useActions } from "../../../store/useGlobalStore";

export const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const { logout } = useActions();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const displayName = user?.username || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200/60 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md border border-indigo-400/30 transition-all duration-200 group-hover:scale-105">
              <UserCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              Hi, {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || "User Account"}
            </p>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <div className="flex-shrink-0 ml-2">
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden">
          {/* User Account Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md border border-indigo-400/30">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  User Account
                </h3>
                <p className="text-xs text-gray-500">
                  Manage your profile and settings
                </p>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-2">
            {/* View Profile */}
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group">
              <UserCircleIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm text-gray-700 group-hover:text-indigo-600 font-medium transition-colors">
                View Profile
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors group"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
              <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
