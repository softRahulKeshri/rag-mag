import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../../store/useGlobalStore";
import {
  formatDisplayName,
  formatAccountText,
  createGreeting,
} from "../../../utils/textUtils";
import { Tooltip } from "../../../components/ui/Tooltip";

interface UserProfileProps {
  isCollapsed?: boolean;
}

export const UserProfile = ({ isCollapsed = false }: UserProfileProps) => {
  const user = useUser();
  const displayName = formatDisplayName(user?.username);

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center group relative">
        <div className="w-10 h-10 bg-gradient-to-br from-[#3077F3] via-[#B96AF7] to-[#FDA052] rounded-lg flex items-center justify-center shadow-md border border-[#3077F3]/30">
          <UserCircleIcon className="h-5 w-5 text-white" />
        </div>

        {/* Tooltip for collapsed state */}
        <div className="absolute left-full ml-2 px-3 py-2 bg-[#2E3141] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-max">
          <div className="font-semibold">{createGreeting(displayName)}</div>
          <div className="text-[#C0C1C6] mt-1">
            {formatAccountText(user?.email)}
          </div>
          <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-[#2E3141]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-[#EAEAEC] shadow-sm p-3">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3077F3] via-[#B96AF7] to-[#FDA052] rounded-lg flex items-center justify-center shadow-md border border-[#3077F3]/30">
            <UserCircleIcon className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <Tooltip content={createGreeting(displayName)} className="block">
            <h3 className="text-sm font-semibold text-[#2E3141] truncate">
              {createGreeting(displayName)}
            </h3>
          </Tooltip>
          <Tooltip content={formatAccountText(user?.email)} className="block">
            <p className="text-xs text-[#6D6F7A] truncate">
              {formatAccountText(user?.email)}
            </p>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
