import { models } from "../constant";

const ModelSelector = () => {
  return (
    <div className="flex items-center space-x-4 px-4 py-2">
      <span className="text-sm text-gray-400">Model:</span>
      <select
        className="bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.name}
            className="bg-gray-800 text-white"
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
