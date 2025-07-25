import { models } from "../constant";

const ModelSelector = () => {
  return (
    <div className="flex items-center space-x-4 px-4 py-2">
      <span className="text-sm text-neutral-n700">Model:</span>
      <select className="bg-neutral-n-white text-neutral-n-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500 border border-neutral-n300">
        {models.map((model) => (
          <option
            key={model.id}
            value={model.name}
            className="bg-neutral-n-white text-neutral-n-black"
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
