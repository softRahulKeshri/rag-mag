import { useState } from "react";
import {
  ChevronDownIcon,
  SparklesIcon,
  CpuChipIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import { ModelType } from "../types/types";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  className?: string;
}

const modelConfig = {
  [ModelType.OPENAI]: {
    name: "OpenAI GPT",
    description: "Advanced language model",
    icon: SparklesIcon,
    color: "bg-blue-500",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  [ModelType.ANTHROPIC]: {
    name: "Anthropic Claude",
    description: "Constitutional AI",
    icon: CpuChipIcon,
    color: "bg-purple-500",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
  },
  [ModelType.OLLAMA]: {
    name: "Ollama",
    description: "Local AI models",
    icon: CloudIcon,
    color: "bg-gray-500",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
  },
};

export const ModelSelector = ({
  selectedModel,
  onModelChange,
  className = "",
}: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedConfig = modelConfig[selectedModel];
  const SelectedIcon = selectedConfig.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Selected Model Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
          isOpen
            ? "ring-2 ring-blue-500/20 shadow-lg"
            : "hover:border-gray-300 hover:shadow-lg"
        } ${selectedConfig.borderColor} ${selectedConfig.bgColor}`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${selectedConfig.color}`}
          >
            <SelectedIcon className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-bold ${selectedConfig.textColor}`}>
              {selectedConfig.name}
            </p>
          </div>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="py-3">
            {Object.entries(modelConfig).map(([model, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={model}
                  onClick={() => {
                    onModelChange(model as ModelType);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 px-5 py-4 text-left hover:bg-gray-50 transition-all duration-300 ${
                    selectedModel === model ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${config.color}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      {config.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {config.description}
                    </p>
                  </div>
                  {selectedModel === model && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
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
