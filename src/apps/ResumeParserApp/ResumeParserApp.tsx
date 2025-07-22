import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { UploadCenter } from "./modules/upload";
import { ResumeSearch } from "./modules/search";
import { ResumeStore } from "./modules/store";

type Section = "upload" | "search" | "store";

const ResumeParserApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("upload");

  const renderContent = () => {
    switch (activeSection) {
      case "upload":
        return <UploadCenter />;
      case "search":
        return <ResumeSearch />;
      case "store":
        return <ResumeStore />;
      default:
        return <UploadCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default ResumeParserApp;
