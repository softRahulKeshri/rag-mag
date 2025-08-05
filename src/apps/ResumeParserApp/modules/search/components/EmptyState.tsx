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
          <div className="w-24 h-24 bg-gradient-to-br from-primary-ui-blue-p100 to-primary-ui-blue-p200 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-brand-gradient-blue flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gradient-cyan rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-brand-gradient-orange rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 -right-8 w-3 h-3 bg-brand-gradient-purple rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-n1000 mb-4">
          Ready to Find Your Perfect Candidates?
        </h2>
        <p className="text-lg text-neutral-n700 max-w-2xl mx-auto leading-relaxed">
          Use our AI-powered search to discover the best talent from your resume
          database. Start by describing your ideal candidate or upload a job
          description above.
        </p>
      </div>

      {/* Search Tips */}
      <div className="bg-primary-ui-blue-p100 rounded-xl p-6 border border-primary-ui-blue-p200">
        <h4 className="font-semibold text-neutral-n1000 mb-3">
          💡 Search Tips
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-n700">
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
