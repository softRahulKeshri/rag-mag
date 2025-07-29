import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface UserProfileProps {
  name?: string;
  email?: string;
  plan?: string;
  onSettingsClick?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name = "User",
  email = "user@example.com",
  plan = "Free Plan",
  onSettingsClick,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-md p-4">
      <div className="flex items-center space-x-3">
        {/* Enhanced Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Enhanced User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            {name}
          </h3>
          <p className="text-xs text-slate-500 truncate">{email}</p>
          <div className="flex items-center space-x-1 mt-1">
            <SparklesIcon className="h-3 w-3 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-600">{plan}</span>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onSettingsClick}
            className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-110 transform-gpu"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all duration-300 hover:scale-110 transform-gpu"
            aria-label="Sign out"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
