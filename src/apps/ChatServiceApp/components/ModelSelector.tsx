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
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    bgColor: "bg-gradient-to-r from-indigo-50 to-indigo-100/50",
  },
  [ModelType.ANTHROPIC]: {
    name: "Anthropic Claude",
    description: "Constitutional AI",
    icon: CpuChipIcon,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    bgColor: "bg-gradient-to-r from-purple-50 to-purple-100/50",
  },
  [ModelType.OLLAMA]: {
    name: "Ollama",
    description: "Local AI models",
    icon: CloudIcon,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    bgColor: "bg-gradient-to-r from-blue-50 to-blue-100/50",
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
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
          isOpen
            ? "ring-2 ring-indigo-500/20 shadow-lg"
            : "hover:border-gray-300 hover:shadow-sm"
        } ${selectedConfig.borderColor} ${
          selectedConfig.bgColor
        } backdrop-blur-sm`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${selectedConfig.color}`}
          >
            <SelectedIcon className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-semibold ${selectedConfig.textColor}`}>
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl z-50 overflow-hidden">
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50/80 transition-all duration-200 ${
                    selectedModel === model ? "bg-indigo-50/80" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${config.color}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {config.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {config.description}
                    </p>
                  </div>
                  {selectedModel === model && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-sm"></div>
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
