import { useState } from "react";
import {
  ChevronDownIcon,
  SparklesIcon,
  CpuChipIcon,
  CloudIcon,
  CheckIcon,
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
    color: "text-[#3077F3]",
    bgColor: "bg-[#F7F7F8]",
  },
  [ModelType.ANTHROPIC]: {
    name: "Claude",
    description: "Anthropic Claude",
    icon: CpuChipIcon,
    color: "text-[#B96AF7]",
    bgColor: "bg-[#F7F7F8]",
  },
  [ModelType.OLLAMA]: {
    name: "Ollama",
    description: "Local AI models",
    icon: CloudIcon,
    color: "text-[#6D6F7A]",
    bgColor: "bg-[#F7F7F8]",
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
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-300 hover:shadow-sm cursor-pointer text-sm font-medium ${selectedConfig.bgColor} ${selectedConfig.color} border-[#EAEAEC] hover:border-[#D5D6D9]`}
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
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#EAEAEC] rounded-lg shadow-lg z-50 overflow-hidden">
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#F7F7F8] transition-all duration-300 cursor-pointer text-sm ${
                    selectedModel === model ? "bg-[#F7F7F8]" : ""
                  }`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-[#2E3141]">{config.name}</p>
                    <p className="text-xs text-[#6D6F7A]">
                      {config.description}
                    </p>
                  </div>
                  {selectedModel === model && (
                    <CheckIcon className="h-4 w-4 text-[#3077F3]" />
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
