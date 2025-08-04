import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { UploadCenter } from "./modules/upload";
import { ResumeSearch } from "./modules/search";
import { ResumeStore } from "./modules/store";
import { Section } from "./types/shared";

const ResumeParserApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.UPLOAD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("resume-sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "resume-sidebar-collapsed",
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case Section.UPLOAD:
        return <UploadCenter />;
      case Section.SEARCH:
        return <ResumeSearch />;
      case Section.STORE:
        return <ResumeStore />;
      default:
        return <UploadCenter />;
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-h-0 relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResumeParserApp;
