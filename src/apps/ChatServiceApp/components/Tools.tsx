import {
  BookOpenIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const Tools = () => {
  return (
    <div className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-white/20">
      <div className="flex items-center space-x-4 px-6 py-3 h-14">
        <button className="text-sm text-slate-600 hover:text-blue-600 flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold flex-shrink-0 group">
          <BookOpenIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span>Prompt Library</span>
          <SparklesIcon className="h-3 w-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <button className="text-sm text-slate-600 hover:text-blue-600 flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold flex-shrink-0 group">
          <CloudArrowUpIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span>File Upload</span>
          <SparklesIcon className="h-3 w-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <button className="text-sm text-slate-600 hover:text-blue-600 flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold flex-shrink-0 group">
          <Cog6ToothIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span>Settings</span>
          <SparklesIcon className="h-3 w-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
};
