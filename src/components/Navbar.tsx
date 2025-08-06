import { useLocation, useNavigate } from "react-router-dom";
import { useActions, useUser } from "../store";
import { ROUTES } from "../constants";
import {
  formatDisplayName,
  formatAccountText,
  createGreeting,
} from "../utils/textUtils";
import { Tooltip } from "./ui/Tooltip";

// Apps configuration for navbar
const apps = [
  { name: "Resume Parser", path: ROUTES.RESUME_PARSER },
  { name: "Pitch Analyzer", path: ROUTES.PITCH_ANALYZER },
  { name: "Chat Service", path: ROUTES.CHAT_SERVICE },
];
import {
  UserCircleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

// Icon mapping for each app
const appIcons = {
  "Resume Parser": DocumentTextIcon,
  "Pitch Analyzer": PresentationChartLineIcon,
  "Chat Service": ChatBubbleLeftRightIcon,
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Global store hooks
  const { logout } = useActions();
  const user = useUser();

  // Check if we're in admin mode
  const isAdminMode = currentPath.startsWith("/admin");

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAppChange = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get display name from user data with proper noun case formatting
  const displayName = formatDisplayName(user?.username);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
          : "bg-white/90 backdrop-blur-lg border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo & Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleAppChange("/")}
              className={`relative flex items-center space-x-3 px-4 py-2.5 rounded-2xl transition-all duration-300 ease-out group cursor-pointer ${
                currentPath === "/"
                  ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                  : "text-gray-900 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50"
              }`}
            >
              {/* Logo */}
              <div className="relative">
                <img
                  src="/magure_ai_logo.svg"
                  alt="Magure AI Logo"
                  className="h-8 w-8 transition-all duration-300 group-hover:scale-110 drop-shadow-sm"
                />
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-blue-400/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Brand Name */}
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold tracking-tight leading-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Magure.AI
                </span>
                <span className="text-xs font-medium text-gray-500 group-hover:text-purple-500 transition-colors duration-300 leading-tight">
                  Labs
                </span>
              </div>

              {/* Enhanced hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>

          {/* Center: App Links or Admin Navigation */}
          <div className="hidden sm:ml-6 sm:flex space-x-2">
            {isAdminMode ? (
              // Admin Navigation
              <>
                <div className="flex items-center space-x-3 mr-4">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <ShieldCheckIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse border border-white shadow-sm"></div>
                  </div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Admin Panel
                  </span>
                </div>

                {/* Admin Navigation Tabs */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleAppChange("/admin/users")}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      currentPath.includes("/admin/users")
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    <UsersIcon className="w-4 h-4" />
                    <span>User Management</span>
                  </button>

                  <button
                    onClick={() => handleAppChange("/admin/logs")}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      currentPath.includes("/admin/logs")
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Audit Logs</span>
                  </button>
                </div>
              </>
            ) : (
              // Regular App Links
              apps.map((app) => {
                const IconComponent =
                  appIcons[app.name as keyof typeof appIcons];
                const isActive = currentPath.startsWith(app.path);

                return (
                  <button
                    key={app.name}
                    onClick={() => handleAppChange(app.path)}
                    className={`relative group px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
                      isActive
                        ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-purple-50/80"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IconComponent
                        className={`h-4 w-4 transition-all duration-300 ${
                          isActive
                            ? "text-purple-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span>{app.name}</span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-sm"></div>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: User Menu */}
          <div className="ml-4 flex items-center relative">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ease-out group cursor-pointer ${
                  isProfileOpen
                    ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-purple-50/80"
                }`}
              >
                <div className="relative">
                  <UserCircleIcon
                    className={`h-8 w-8 transition-all duration-300 ${
                      isProfileOpen
                        ? "text-purple-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                </div>
                <Tooltip
                  content={createGreeting(displayName)}
                  className="flex-1 min-w-0"
                >
                  <span className="truncate block">
                    {createGreeting(displayName)}
                  </span>
                </Tooltip>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              <div
                className={`absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300 ease-out ${
                  isProfileOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
              >
                <div className="py-3">
                  {/* User info section */}
                  <div className="px-4 py-4 border-b border-gray-100/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <UserCircleIcon className="h-10 w-10 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Tooltip
                          content={createGreeting(displayName)}
                          className="block"
                        >
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {createGreeting(displayName)}
                          </p>
                        </Tooltip>
                        <Tooltip
                          content={formatAccountText(user?.email)}
                          className="block"
                        >
                          <p className="text-xs text-gray-500 truncate">
                            {formatAccountText(user?.email)}
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <button
                      disabled
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-400 cursor-not-allowed opacity-60 group border-l-4 border-transparent"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span>View Profile</span>
                    </button>

                    <button
                      disabled
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-400 cursor-not-allowed opacity-60 group border-l-4 border-transparent"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span>Settings</span>
                    </button>

                    {/* Admin Dashboard Link - Only show for admin users */}
                    {(user?.role === "admin" ||
                      import.meta.env.MODE === "development") && (
                      <button
                        onClick={() => {
                          handleAppChange(ROUTES.ADMIN);
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 ease-out group border-l-4 border-transparent hover:border-purple-200"
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-3 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" />
                        <span className="font-medium">Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-gray-200/60 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 ease-out group border-l-4 border-transparent hover:border-red-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Click outside to close */}
            {isProfileOpen && (
              <div
                className="fixed inset-0 z-40 cursor-pointer"
                onClick={() => setIsProfileOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
