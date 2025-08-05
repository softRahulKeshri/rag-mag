import { useState, useCallback, useEffect } from "react";
import {
  ArrowLeftIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePitchDetails } from "../hooks/usePitchDetails";
import PitchDetailsView from "./PitchDetailsView";
import FloatingChatBot from "./FloatingChatBot";
import FloatingChatToggle from "./FloatingChatToggle";
import { PitchDetailsSkeleton } from "./PitchSkeleton";
import type { Pitch } from "../types/types";

interface PitchChatProps {
  pitch: Pitch;
  onBack: () => void;
}

const PitchChat = ({ pitch, onBack }: PitchChatProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    fetchPitchDetails,
    pitchDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    clearError: clearDetailsError,
  } = usePitchDetails();

  // Fetch pitch details when component mounts
  useEffect(() => {
    fetchPitchDetails(pitch.id);
  }, [pitch.id, fetchPitchDetails]);

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
        {isLoadingDetails ? (
          <PitchDetailsSkeleton />
        ) : pitchDetails ? (
          <div className="p-6">
            <PitchDetailsView pitchDetails={pitchDetails} />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analysis not available
            </h3>
            <p className="text-gray-500">
              Detailed analysis for this pitch deck is not available.
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {detailsError && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{detailsError}</p>
            </div>
            <button
              onClick={clearDetailsError}
              className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

export default PitchChat;
