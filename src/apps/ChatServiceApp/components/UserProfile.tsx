import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../../store/useGlobalStore";
import {
  formatDisplayName,
  formatAccountText,
  createGreeting,
} from "../../../utils/textUtils";
import { Tooltip } from "../../../components/ui/Tooltip";

export const UserProfile = () => {
  const user = useUser();
  const displayName = formatDisplayName(user?.username);

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
          <Tooltip content={createGreeting(displayName)} className="block">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {createGreeting(displayName)}
            </h3>
          </Tooltip>
          <Tooltip content={formatAccountText(user?.email)} className="block">
            <p className="text-xs text-slate-500 truncate">
              {formatAccountText(user?.email)}
            </p>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
