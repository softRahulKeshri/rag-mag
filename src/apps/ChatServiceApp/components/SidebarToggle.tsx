import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isOpen,
  onToggle,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer ${className}`}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? (
        <XMarkIcon className="h-5 w-5" />
      ) : (
        <Bars3Icon className="h-5 w-5" />
      )}
    </button>
  );
};
