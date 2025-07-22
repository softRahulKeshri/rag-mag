
export const Tools = () => {
  return (
    <div className="border-b border-gray-700 mb-4">
      <div className="flex space-x-4 px-4 py-2">
        {/* <ModelSelector /> Might Required later */}
        <button className="text-sm text-gray-400 hover:text-white flex items-center space-x-2 px-4 py-2">
          <span>Prompt Library</span>
        </button>
        <button className="text-sm text-gray-400 hover:text-white flex items-center space-x-2 px-4 py-2">
          <span>Upload</span>
        </button>
        <button className="text-sm text-gray-400 hover:text-white flex items-center space-x-2 px-4 py-2">
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};


