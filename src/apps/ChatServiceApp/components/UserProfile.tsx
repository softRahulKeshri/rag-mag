import { useRef, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../../store/useGlobalStore";

export const UserProfile = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Dropdown close logic removed since dropdown is not used
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = user?.username || "User";

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-md p-3">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md border border-blue-400/30">
            <UserCircleIcon className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            {displayName}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {user?.email || "User Account"}
          </p>
        </div>
      </div>
    </div>
  );
};
