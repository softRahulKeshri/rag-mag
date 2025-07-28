import { models } from "../constant";

const ModelSelector = () => {
  return (
    <div className="flex items-center space-x-3 px-4 py-2">
      <span className="text-sm font-medium text-[#6D6F7A]">Model:</span>
      <select className="bg-white text-[#2E3141] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3077F3]/20 border border-[#D5D6D9] hover:border-[#C0C1C6] transition-colors">
        {models.map((model) => (
          <option
            key={model.id}
            value={model.name}
            className="bg-white text-[#2E3141]"
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
