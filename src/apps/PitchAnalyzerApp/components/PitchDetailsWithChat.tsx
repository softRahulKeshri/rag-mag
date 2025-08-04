import { useState, useCallback } from "react";
import {
  ArrowLeftIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import PitchDetailsView from "./PitchDetailsView";
import FloatingChatBot from "./FloatingChatBot";
import FloatingChatToggle from "./FloatingChatToggle";
import type { Pitch, PitchDetailsApiResponse } from "../types/types";

interface PitchDetailsWithChatProps {
  pitch: Pitch;
  pitchDetails: PitchDetailsApiResponse;
  onBack: () => void;
}

const PitchDetailsWithChat = ({
  pitch,
  pitchDetails,
  onBack,
}: PitchDetailsWithChatProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              <DocumentMagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {pitch.title || pitch.filename}
              </h2>
              <p className="text-sm text-gray-500">{pitch.sector_category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">AI Analysis</span>
        </div>
      </div>

      {/* Content Area - Always show details */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <PitchDetailsView pitchDetails={pitchDetails} />
        </div>
      </div>

      {/* Floating Chat Toggle */}
      <FloatingChatToggle onClick={handleToggleChat} isVisible={!isChatOpen} />

      {/* Floating Chat Bot */}
      <FloatingChatBot
        pitch={pitch}
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </div>
  );
};

export default PitchDetailsWithChat;
