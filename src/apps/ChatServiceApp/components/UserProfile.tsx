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
      {/* Premium Profile Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="flex items-center space-x-4">
          {/* Premium Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-blue-500 border-opacity-30 transition-all duration-300 group-hover:scale-110">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Premium User Info */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-base font-bold text-slate-800 truncate">
              {displayName}
            </p>
          </div>
        </div>

        {/* Premium Dropdown Arrow */}
        <div className="flex-shrink-0 ml-3">
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          )}
        </div>
      </button>

      {/* Premium Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl z-50 overflow-hidden">
          {/* Premium User Account Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-blue-500 border-opacity-30">
                <UserCircleIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  User Account
                </h3>
                <p className="text-sm text-slate-500">
                  Manage your profile and settings
                </p>
              </div>
            </div>
          </div>

          {/* Premium Menu Options */}
          <div className="py-3">
            {/* View Profile */}
            <button className="w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors duration-300 group">
              <UserCircleIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-base text-slate-700 group-hover:text-blue-600 font-semibold transition-colors">
                View Profile
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-red-50 transition-colors duration-300 group"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-400 group-hover:text-red-600 transition-colors" />
              <span className="text-base text-slate-700 group-hover:text-red-600 font-semibold transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
