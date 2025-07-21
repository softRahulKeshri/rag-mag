import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadCenter from "./components/UploadCenter";
import ResumeSearch from "./components/ResumeSearch";
import ResumeStore from "./components/ResumeStore";
import { AppSection } from "./types";
import type { AppSectionType, SectionConfigMap } from "./types";

// Section configuration for dynamic content rendering
const SECTION_CONFIG: SectionConfigMap = {
  [AppSection.UPLOAD]: {
    title: "Upload Resume",
    description: "Seamlessly import resumes with AI parsing",
    component: UploadCenter,
  },
  [AppSection.SEARCH]: {
    title: "Search Resumes",
    description: "Find perfect candidates with AI-powered search",
    component: ResumeSearch,
  },
  [AppSection.STORE]: {
    title: "Resume Store",
    description: "Analyze talent pool with intelligent insights",
    component: ResumeStore,
  },
} as const;

const ResumeParserApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSectionType>(
    AppSection.UPLOAD
  );

  const currentSectionConfig = SECTION_CONFIG[activeSection];

  const renderContent = () => {
    const Component = currentSectionConfig.component;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Horizontal Navigation */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentSectionConfig.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentSectionConfig.description}
            </p>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ResumeParserApp;
