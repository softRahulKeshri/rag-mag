import {
  BookOpenIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const Tools = () => {
  return (
    <div className="flex items-center space-x-3">
      <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 font-bold flex-shrink-0 group">
        <BookOpenIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span>Prompt Library</span>
      </button>

      <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 font-bold flex-shrink-0 group">
        <CloudArrowUpIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span>File Upload</span>
      </button>

      <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 font-bold flex-shrink-0 group">
        <Cog6ToothIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span>Settings</span>
      </button>
    </div>
  );
};
