import {
  BookOpenIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const Tools = () => {
  return (
    <div className="bg-[#F5F5F5] border-b border-[#EAEAEC]">
      <div className="flex items-center space-x-4 px-6 py-3 h-14">
        <button className="text-xs text-[#6D6F7A] hover:text-[#3077F3] flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium flex-shrink-0 group">
          <BookOpenIcon className="h-4 w-4 transition-transform duration-200" />
          <span>Prompt Library</span>
          <SparklesIcon className="h-3 w-3 text-[#B96AF7] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        <button className="text-xs text-[#6D6F7A] hover:text-[#3077F3] flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium flex-shrink-0 group">
          <CloudArrowUpIcon className="h-4 w-4 transition-transform duration-200" />
          <span>File Upload</span>
          <SparklesIcon className="h-3 w-3 text-[#B96AF7] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        <button className="text-xs text-[#6D6F7A] hover:text-[#3077F3] flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 font-medium flex-shrink-0 group">
          <Cog6ToothIcon className="h-4 w-4 transition-transform duration-200" />
          <span>Settings</span>
          <SparklesIcon className="h-3 w-3 text-[#B96AF7] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
      </div>
    </div>
  );
};
