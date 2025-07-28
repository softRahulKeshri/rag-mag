export const Tools = () => {
  return (
    <div className="bg-[#FAFAFA] border-b border-[#EAEAEC]">
      <div className="flex items-center space-x-4 px-6 py-3 h-12">
        <button className="text-sm text-[#6D6F7A] hover:text-[#434654] flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 font-medium flex-shrink-0">
          <span>Prompt Library</span>
        </button>
        <button className="text-sm text-[#6D6F7A] hover:text-[#434654] flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 font-medium flex-shrink-0">
          <span>Upload</span>
        </button>
        <button className="text-sm text-[#6D6F7A] hover:text-[#434654] flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 font-medium flex-shrink-0">
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
