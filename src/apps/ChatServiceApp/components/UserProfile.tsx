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
    <div className="p-4 border-t border-gray-800 bg-gray-900/80">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div 
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <UserCircleIcon className="h-9 w-9 text-white/90" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-100 truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate" title={email}>
            {plan} • {email}
          </p>
        </div>
        
        <button 
          className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
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
