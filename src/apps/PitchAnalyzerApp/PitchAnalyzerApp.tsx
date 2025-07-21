/**
 * Main Pitch Analyzer Application Component
 * Modular design following KISS principle and separation of concerns
 */

import { useState, useEffect, useMemo } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import usePitchAnalyzer from "./hooks/usePitchAnalyzer";
import {
  FileUploadSection,
  PitchDeckListing,
  ErrorAlert,
  PitchChatWidget,
  Sidebar,
  PageHeader,
  LandingSection,
} from "./components";
import type { EAppSection, IPitchAnalyzerAppProps } from "./types";
import { calculateAppStats } from "./utils";

const PitchAnalyzerApp = ({ className = "" }: IPitchAnalyzerAppProps) => {
  const {
    state,
    completedDecks,
    analyzingDecks,
    uploadingDecks,
    handleFileSelect,
    handleFileRemove,
    handleAnalyze,
    handlePitchDeckClick,
    clearError,
    cleanup,
  } = usePitchAnalyzer();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<EAppSection>("landing");

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Memoized stats for performance
  const stats = useMemo(
    () => calculateAppStats(state.pitchDecks),
    [state.pitchDecks]
  );

  // Handle file upload trigger
  const handleUploadClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleFileSelect(target.files[0]);
        setActiveSection("upload");
      }
    };
    fileInput.click();
  };

  // Auto-navigate to processing when analysis starts
  useEffect(() => {
    if (analyzingDecks.length > 0 || uploadingDecks.length > 0) {
      setActiveSection("processing");
    }
  }, [analyzingDecks.length, uploadingDecks.length]);

  // Auto-navigate to results when analysis completes
  useEffect(() => {
    if (completedDecks.length > 0 && analyzingDecks.length === 0) {
      setActiveSection("results");
    }
  }, [completedDecks.length, analyzingDecks.length]);

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "landing":
        return (
          <LandingSection stats={stats} onUploadClick={handleUploadClick} />
        );

      case "upload":
        return (
          <section className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Upload Your Pitch Deck
              </h2>
              <p className="text-gray-600">
                Select your PDF file to begin the analysis process
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <FileUploadSection
                uploadState={state.uploadState}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                onAnalyze={handleAnalyze}
              />
            </div>
          </section>
        );

      case "processing":
        return (
          <section className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Processing Your Deck
              </h2>
              <p className="text-gray-600">
                Our AI is analyzing your pitch deck for insights
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <PitchDeckListing
                pitchDecks={state.pitchDecks}
                onPitchDeckClick={handlePitchDeckClick}
                isLoading={state.isLoading}
              />
            </div>
          </section>
        );

      case "results":
        return (
          <section className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Analysis Results
              </h2>
              <p className="text-gray-600">
                Review your pitch deck insights and recommendations
              </p>
            </div>

            {/* Results Overview Cards */}
            {completedDecks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Average Score
                      </p>
                      <p className="text-2xl font-bold text-gray-900">8.5/10</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Key Insights
                      </p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Recommendations
                      </p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Results Content */}
            <div className="max-w-6xl mx-auto">
              <PitchDeckListing
                pitchDecks={state.pitchDecks}
                onPitchDeckClick={handlePitchDeckClick}
                isLoading={state.isLoading}
              />
            </div>

            {/* Empty State */}
            {completedDecks.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DocumentTextIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Analysis Results Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload a pitch deck to see detailed analysis results,
                    insights, and recommendations.
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Upload Your First Deck
                  </button>
                </div>
              </div>
            )}
          </section>
        );

      default:
        return (
          <LandingSection stats={stats} onUploadClick={handleUploadClick} />
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${className}`}
    >
      {/* Horizontal Navigation */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <PageHeader
          activeSection={activeSection}
          onUploadClick={handleUploadClick}
        />

        {/* Error Alert */}
        <ErrorAlert error={state.error} onClose={clearError} />

        {/* Section Content */}
        {renderSectionContent()}

        {/* Recent Activity */}
        {state.pitchDecks.length > 0 && (
          <section className="mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {state.pitchDecks.slice(0, 3).map((deck) => (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {deck.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deck.uploadDate.toLocaleDateString()} • {deck.status}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePitchDeckClick?.(deck)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Chat Widget */}
      <PitchChatWidget
        pitchDecks={state.pitchDecks}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
};

export default PitchAnalyzerApp;
