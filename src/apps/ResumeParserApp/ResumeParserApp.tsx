import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { UploadCenter } from "./modules/upload";
import { ResumeSearch } from "./modules/search";
import { ResumeStore } from "./modules/store";
import { Section } from "./types/shared";

const ResumeParserApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.UPLOAD);

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
