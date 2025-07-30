import {
  BookOpenIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const Tools = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="flex items-center space-x-3 px-4 py-2 h-12">
        <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-colors font-medium flex-shrink-0 group">
          <BookOpenIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
          <span>Prompt Library</span>
          <SparklesIcon className="h-2.5 w-2.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-colors font-medium flex-shrink-0 group">
          <CloudArrowUpIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
          <span>File Upload</span>
          <SparklesIcon className="h-2.5 w-2.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-colors font-medium flex-shrink-0 group">
          <Cog6ToothIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
          <span>Settings</span>
          <SparklesIcon className="h-2.5 w-2.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
};
