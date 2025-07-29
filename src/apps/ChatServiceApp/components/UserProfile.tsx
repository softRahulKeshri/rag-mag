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
        className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-[#EAEAEC] hover:border-[#D5D6D9] shadow-sm hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-lg flex items-center justify-center shadow-md border border-[#3077F3] border-opacity-30 transition-all duration-200">
              <UserCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-[#2E3141] truncate">
              {displayName}
            </p>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <div className="flex-shrink-0 ml-2">
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-[#9698A0] group-hover:text-[#6D6F7A] transition-colors" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-[#9698A0] group-hover:text-[#6D6F7A] transition-colors" />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-[#EAEAEC] shadow-xl z-50 overflow-hidden">
          {/* User Account Section */}
          <div className="p-4 border-b border-[#F5F5F5]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-xl flex items-center justify-center shadow-md border border-[#3077F3] border-opacity-30">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#2E3141]">
                  User Account
                </h3>
                <p className="text-xs text-[#9698A0]">
                  Manage your profile and settings
                </p>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-2">
            {/* View Profile */}
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-[#F5F5F5] transition-colors duration-200">
              <UserCircleIcon className="h-4 w-4 text-[#9698A0]" />
              <span className="text-sm text-[#2E3141] font-medium">
                View Profile
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-[#FDA052] hover:bg-opacity-10 transition-colors duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 text-[#9698A0] group-hover:text-[#FDA052] transition-colors" />
              <span className="text-sm text-[#2E3141] group-hover:text-[#FDA052] font-medium transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
