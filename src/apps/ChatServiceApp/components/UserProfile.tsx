import { useState } from 'react';
import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface UserProfileProps {
  name?: string;
  email?: string;
  plan?: string;
  onSettingsClick?: () => void;
}

export const UserProfile = ({
  name = 'User Name',
  email = 'user@example.com',
  plan = 'Free Plan',
  onSettingsClick,
}: UserProfileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-4 border-t border-neutral-n200 bg-neutral-n150">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div 
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary-ui-blue-p500 to-primary-ui-blue-p600 flex items-center justify-center text-neutral-n-white transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <UserCircleIcon className="h-9 w-9 text-neutral-n-white/90" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-n-white"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-n-black truncate">{name}</p>
          <p className="text-xs text-neutral-n600 truncate" title={email}>
            {plan} • {email}
          </p>
        </div>
        
        <button 
          className="text-neutral-n600 hover:text-neutral-n800 p-1.5 rounded-full hover:bg-neutral-n200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50 cursor-pointer"
          onClick={onSettingsClick}
          aria-label="Settings"
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
