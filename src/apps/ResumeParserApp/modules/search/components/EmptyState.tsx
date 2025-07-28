import React from "react";
import type { EmptyStateProps } from "../types";

/**
 * EmptyState Component
 *
 * Displays when no search has been performed yet.
 *
 * Features:
 * - Friendly welcome message
 * - Visual search illustration
 * - Helpful tips and instructions
 * - Animated elements for engagement
 * - Clean, modern design
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearched,
  isSearching,
}) => {
  if (hasSearched || isSearching) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      {/* Animated Search Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Main Search Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Floating Elements */}
          <div
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 -right-8 w-3 h-3 bg-yellow-400 rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Find Your Perfect Candidates?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Use our AI-powered search to discover the best talent from your resume
          database. Start by describing your ideal candidate or upload a job
          description above.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Natural Language Search
          </h3>
          <p className="text-sm text-gray-600">
            Simply describe what you're looking for in plain English
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Job Description Upload
          </h3>
          <p className="text-sm text-gray-600">
            Upload a JD and let AI find the best matching candidates
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Scoring</h3>
          <p className="text-sm text-gray-600">
            AI-powered scoring across multiple criteria for better decisions
          </p>
        </div>
      </div>

      {/* Search Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">💡 Search Tips</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="text-left">
            <p className="mb-2">
              <strong>Be specific:</strong> "Senior React developer with 5+
              years"
            </p>
            <p>
              <strong>Include skills:</strong> "Python, machine learning, AWS"
            </p>
          </div>
          <div className="text-left">
            <p className="mb-2">
              <strong>Mention experience:</strong> "3-5 years in fintech"
            </p>
            <p>
              <strong>Add industry:</strong> "Healthcare, startup experience"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
