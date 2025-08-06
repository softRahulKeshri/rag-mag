import { useState, useEffect } from "react";
import { usePitchDetails } from "./hooks/usePitchDetails";
import {
  Navigation,
  ChatInterface,
  PitchChat,
  PitchDetailsWithChat,
  UploadArea,
  FloatingPitchProcessingStatus,
} from "./components";
import type { TabId } from "./types/navigation";
import type { Pitch } from "./types/types";

const PitchAnalyzerApp = () => {
  const [activeTab, setActiveTab] = useState<TabId>("upload");
  const [selectedPitchForChat, setSelectedPitchForChat] =
    useState<Pitch | null>(null);
  const [selectedPitchForDetails, setSelectedPitchForDetails] =
    useState<Pitch | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("pitch-sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "pitch-sidebar-collapsed",
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

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

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <UploadArea userEmail="member1@company1.com" />;
      case "chat":
        return (
          <div className="space-y-8">
            {selectedPitchForChat ? (
              <PitchChat
                pitch={selectedPitchForChat}
                onBack={() => setSelectedPitchForChat(null)}
              />
            ) : selectedPitchForDetails && pitchDetails ? (
              <PitchDetailsWithChat
                pitch={selectedPitchForDetails}
                pitchDetails={pitchDetails}
                onBack={handleBackFromDetails}
              />
            ) : (
              <ChatInterface
                onPitchSelect={setSelectedPitchForChat}
                onViewDetails={handleViewPitchDetails}
              />
            )}
          </div>
        );
      default:
        return <UploadArea userEmail="member1@company1.com" />;
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
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
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Floating Pitch Processing Status */}
      <FloatingPitchProcessingStatus />
    </div>
  );
};

export default PitchAnalyzerApp;
