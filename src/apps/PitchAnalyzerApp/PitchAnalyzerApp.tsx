import { useState } from "react";
import Sidebar from "./components/Sidebar";

const PitchAnalyzerApp = () => {
  const [activeSection, setActiveSection] = useState("analyze");

  const renderContent = () => {
    switch (activeSection) {
      case "analyze":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Analyze Pitch</h1>
            <p>Upload and analyze your pitch deck with AI-powered insights.</p>
          </div>
        );
      case "templates":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Pitch Templates</h1>
            <p>Browse and use professional pitch deck templates.</p>
          </div>
        );
      case "insights":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">AI Insights</h1>
            <p>Get AI-powered recommendations to improve your pitch.</p>
          </div>
        );
      case "history":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Analysis History</h1>
            <p>View your previous pitch analyses and improvements.</p>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Pitch Analyzer App</h1>
            <p>This is the pitch analyzer app landing page.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-h-0">{renderContent()}</div>
    </div>
  );
};

export default PitchAnalyzerApp;
