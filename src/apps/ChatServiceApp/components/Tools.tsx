export const Tools = () => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-4 px-4 py-2">
        {/* <ModelSelector /> Might Required later */}
        <button className="text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <span>Prompt Library</span>
        </button>
        <button className="text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <span>Upload</span>
        </button>
        <button className="text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
