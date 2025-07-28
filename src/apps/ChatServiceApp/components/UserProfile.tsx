import { useState } from "react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  StarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

interface UserProfileProps {
  name?: string;
  email?: string;
  plan?: string;
  onSettingsClick?: () => void;
}

export const UserProfile = ({
  name = "User Name",
  email = "user@example.com",
  plan = "Free Plan",
  onSettingsClick,
}: UserProfileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPlanIcon = (planType: string) => {
    if (
      planType.toLowerCase().includes("pro") ||
      planType.toLowerCase().includes("premium")
    ) {
      return <StarIcon className="h-3 w-3" />;
    }
    return <CheckBadgeIcon className="h-3 w-3" />;
  };

  const getPlanColors = (planType: string) => {
    if (
      planType.toLowerCase().includes("pro") ||
      planType.toLowerCase().includes("premium")
    ) {
      return "bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple text-white";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex items-center space-x-4">
        {/* Enhanced Avatar with Status Indicator */}
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-3xl bg-gradient-to-br from-brand-gradient-blue to-brand-gradient-purple flex items-center justify-center text-white transition-all duration-300 shadow-md border border-white/50 ${
              isHovered
                ? "scale-110 shadow-xl shadow-brand-gradient-blue/20"
                : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <UserCircleIcon className="h-8 w-8 text-white/90" />
          </div>

          {/* Online Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Subtle Glow Effect - Only on Hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gradient-blue/10 to-brand-gradient-purple/10 rounded-3xl blur-xl"></div>
          )}
        </div>

        {/* User Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-base font-semibold text-neutral-n900 truncate">
              {name}
            </p>
            <div
              className={`px-2 py-1 text-xs font-medium rounded-lg flex items-center space-x-1 ${getPlanColors(
                plan
              )}`}
            >
              {getPlanIcon(plan)}
              <span>{plan}</span>
            </div>
          </div>
          <p className="text-sm text-neutral-n600 truncate" title={email}>
            {email}
          </p>
        </div>

        {/* Settings Button */}
        <button
          className="group p-3 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/30 focus:bg-white border border-transparent hover:border-gray-200"
          onClick={onSettingsClick}
          aria-label="Open profile settings"
        >
          <Cog6ToothIcon className="h-5 w-5 text-neutral-n500 group-hover:text-primary-ui-blue-p600 group-hover:rotate-90 transition-all duration-300" />
        </button>
      </div>

      {/* Subtle Bottom Accent - Less Prominent */}
      <div className="mt-4 h-0.5 bg-gradient-to-r from-gray-200 via-primary-ui-blue-p200 to-gray-200 rounded-full"></div>
    </div>
  );
};

export default UserProfile;
