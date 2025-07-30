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
    color: "bg-indigo-500",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
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
    color: "bg-blue-500",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
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
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 hover:shadow-sm ${
          isOpen
            ? "ring-2 ring-indigo-500/20 shadow-sm"
            : "hover:border-gray-300"
        } ${selectedConfig.borderColor} ${selectedConfig.bgColor}`}
      >
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center ${selectedConfig.color}`}
          >
            <SelectedIcon className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium ${selectedConfig.textColor}`}>
              {selectedConfig.name}
            </p>
          </div>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {Object.entries(modelConfig).map(([model, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={model}
                  onClick={() => {
                    onModelChange(model as ModelType);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                    selectedModel === model ? "bg-indigo-50" : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${config.color}`}
                  >
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {config.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {config.description}
                    </p>
                  </div>
                  {selectedModel === model && (
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
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
