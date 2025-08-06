import { Bars3Icon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * SidebarToggle Component for PitchAnalyzerApp
 *
 * A reusable toggle button for sidebar collapse/expand functionality.
 * Uses consistent styling with the PitchAnalyzerApp theme.
 *
 * @param isOpen - Whether the sidebar is currently open/expanded
 * @param onToggle - Callback function to toggle sidebar state
 * @param className - Additional CSS classes
 */
export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isOpen,
  onToggle,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 text-gray-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 ${
        isOpen ? "cursor-w-resize" : "cursor-e-resize"
      } ${className}`}
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isOpen ? (
        <ChevronDoubleLeftIcon className="h-5 w-5" />
      ) : (
        <Bars3Icon className="h-5 w-5" />
      )}
    </button>
  );
};

export default SidebarToggle;
