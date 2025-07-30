import {
  BookOpenIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const Tools = () => {
  return (
    <div className="flex items-center space-x-2">
      <button className="text-xs text-gray-600 hover:text-indigo-600 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium flex-shrink-0 group">
        <BookOpenIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-105" />
        <span>Prompt Library</span>
      </button>

      <button className="text-xs text-gray-600 hover:text-indigo-600 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium flex-shrink-0 group">
        <CloudArrowUpIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-105" />
        <span>File Upload</span>
      </button>

      <button className="text-xs text-gray-600 hover:text-indigo-600 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium flex-shrink-0 group">
        <Cog6ToothIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-105" />
        <span>Settings</span>
      </button>
    </div>
  );
};
