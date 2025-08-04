import { useState } from "react";
import { usePitchDetails } from "./hooks/usePitchDetails";
import {
  Navigation,
  ChatInterface,
  PitchChat,
  PitchDetailsView,
  UploadArea,
} from "./components";
import type { TabId } from "./types/navigation";
import type { Pitch } from "./types/types";

const PitchAnalyzerApp = () => {
  const [activeTab, setActiveTab] = useState<TabId>("upload");
  const [selectedPitchForChat, setSelectedPitchForChat] =
    useState<Pitch | null>(null);
  const [selectedPitchForDetails, setSelectedPitchForDetails] =
    useState<Pitch | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const {
    fetchPitchDetails,
    pitchDetails,
    clearError: clearDetailsError,
  } = usePitchDetails();

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    // Clear selected pitches when changing tabs
    setSelectedPitchForChat(null);
    setSelectedPitchForDetails(null);
    // Note: Chat tab will fetch pitches automatically via ChatInterface component
  };

  const handleViewPitchDetails = async (pitch: Pitch) => {
    setSelectedPitchForDetails(pitch);
    try {
      await fetchPitchDetails(pitch.id);
    } catch (error) {
      console.error("Failed to fetch pitch details:", error);
    }
  };

  const handleBackFromDetails = () => {
    setSelectedPitchForDetails(null);
    clearDetailsError();
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-full bg-neutral-100 overflow-hidden">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userEmail="member1@company1.com"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-h-0 relative">
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Tab Content */}
            {activeTab === "upload" && (
              <UploadArea userEmail="member1@company1.com" />
            )}

            {activeTab === "chat" && (
              <div className="space-y-8">
                {selectedPitchForChat ? (
                  <PitchChat
                    pitch={selectedPitchForChat}
                    onBack={() => setSelectedPitchForChat(null)}
                  />
                ) : selectedPitchForDetails ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleBackFromDetails}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Back to Chat
                      </button>
                    </div>
                    {pitchDetails && (
                      <PitchDetailsView pitchDetails={pitchDetails} />
                    )}
                  </div>
                ) : (
                  <ChatInterface
                    onPitchSelect={setSelectedPitchForChat}
                    onViewDetails={handleViewPitchDetails}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchAnalyzerApp;
