import { useState } from "react";
import {
  ChevronDownIcon,
  SparklesIcon,
  CpuChipIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import { ModelType } from "../types/types";

interface ModelSelectorDropdownProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  className?: string;
}

const modelConfig = {
  [ModelType.OPENAI]: {
    name: "GPT",
    description: "OpenAI GPT",
    icon: SparklesIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  [ModelType.ANTHROPIC]: {
    name: "Claude",
    description: "Anthropic Claude",
    icon: CpuChipIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  [ModelType.OLLAMA]: {
    name: "Ollama",
    description: "Local AI models",
    icon: CloudIcon,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
};

export const ModelSelectorDropdown: React.FC<ModelSelectorDropdownProps> = ({
  selectedModel,
  onModelChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedConfig = modelConfig[selectedModel];
  const SelectedIcon = selectedConfig.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Compact Model Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-300 hover:shadow-sm cursor-pointer text-sm font-medium ${selectedConfig.bgColor} ${selectedConfig.color} border-gray-200 hover:border-gray-300`}
      >
        <SelectedIcon className="h-4 w-4" />
        <span>{selectedConfig.name}</span>
        <ChevronDownIcon
          className={`h-3 w-3 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu - Opens at bottom */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-2">
            {Object.entries(modelConfig).map(([model, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={model}
                  onClick={() => {
                    onModelChange(model as ModelType);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-all duration-300 cursor-pointer text-sm ${
                    selectedModel === model ? "bg-blue-50" : ""
                  }`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{config.name}</p>
                    <p className="text-xs text-gray-500">
                      {config.description}
                    </p>
                  </div>
                  {selectedModel === model && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
