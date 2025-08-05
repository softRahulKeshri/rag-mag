import { useState } from "react";
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  StarIcon,
  ClockIcon,
  PresentationChartLineIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import type { PitchDetailsApiResponse } from "../types/types";

interface PitchDetailsViewProps {
  pitchDetails: PitchDetailsApiResponse;
}

const PitchDetailsView = ({ pitchDetails }: PitchDetailsViewProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview"])
  );

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const getInvestmentDecisionColor = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-100 border-green-300";
      case "pending":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "rejected":
        return "text-red-700 bg-red-100 border-red-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getInvestmentDecisionIcon = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "approved":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "pending":
        return <ClockIcon className="w-5 h-5" />;
      case "rejected":
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOverview = () => {
    const isExpanded = expandedSections.has("overview");

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <button
          onClick={() => toggleSection("overview")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform duration-200">
              <PresentationChartLineIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-xl mb-2 group-hover:text-gray-700 transition-colors duration-200">
                {pitchDetails.company} - Pitch Analysis
              </h3>
              <p className="text-gray-600 text-base max-w-2xl">
                {pitchDetails.insights}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-3 px-4 py-2 rounded-full border text-lg font-semibold ${getInvestmentDecisionColor(
                pitchDetails.investment_decision
              )}`}
            >
              {getInvestmentDecisionIcon(pitchDetails.investment_decision)}
              <span className="capitalize">
                {pitchDetails.investment_decision}
              </span>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 transition-transform duration-200">
              <ChevronDownIcon
                className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center space-x-2">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  <span>Company Information</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Company</p>
                    <p className="text-gray-900 font-semibold">
                      {pitchDetails.company}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Industry
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {pitchDetails.industry}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">File</p>
                    <p className="text-gray-900 font-semibold">
                      {pitchDetails.file_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(pitchDetails.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                  <span>Financial Overview</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Revenue Model
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {pitchDetails.revenue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      ARR (Annual Recurring Revenue)
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {pitchDetails.arr}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Total Turnover
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {pitchDetails.total_turnover}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStrengths = () => {
    const isExpanded = expandedSections.has("strengths");

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
        <button
          onClick={() => toggleSection("strengths")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center border border-green-200 group-hover:scale-105 transition-transform duration-200">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-700 transition-colors duration-200">
                Key Strengths
              </h3>
              <p className="text-gray-600 text-sm max-w-md mt-1">
                Competitive advantages and positive aspects
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 transition-transform duration-200">
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6 bg-gray-50 border-t border-gray-200">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="space-y-3">
                {pitchDetails.strengths.split("\n").map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium text-sm">
                      {strength.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWeaknesses = () => {
    const isExpanded = expandedSections.has("weaknesses");

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
        <button
          onClick={() => toggleSection("weaknesses")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-200 group-hover:scale-105 transition-transform duration-200">
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-700 transition-colors duration-200">
                Areas of Concern
              </h3>
              <p className="text-gray-600 text-sm max-w-md mt-1">
                Challenges and potential risks
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 transition-transform duration-200">
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6 bg-gray-50 border-t border-gray-200">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="space-y-3">
                {pitchDetails.weaknesses.split("\n").map((weakness, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium text-sm">
                      {weakness.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExtras = () => {
    const isExpanded = expandedSections.has("extras");

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
        <button
          onClick={() => toggleSection("extras")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200 group-hover:scale-105 transition-transform duration-200">
              <BriefcaseIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-700 transition-colors duration-200">
                Additional Information
              </h3>
              <p className="text-gray-600 text-sm max-w-md mt-1">
                Partnerships, investments, and strategic details
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 transition-transform duration-200">
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6 bg-gray-50 border-t border-gray-200">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="space-y-3">
                {pitchDetails.extras.split("\n").map((extra, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium text-sm">
                      {extra.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pitch Deck Analysis
            </h2>
            <p className="text-gray-600">
              AI-powered investment analysis and strategic insights
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <p className="text-gray-600 text-sm">Analyzed on</p>
            </div>
            <p className="font-semibold text-lg text-gray-900">
              {formatDate(pitchDetails.created_at)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
              <span>Company</span>
            </h3>
            <p className="text-gray-700 font-medium">{pitchDetails.company}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-green-600" />
              <span>Industry</span>
            </h3>
            <p className="text-gray-700 font-medium">{pitchDetails.industry}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <StarIcon className="w-5 h-5 text-purple-600" />
              <span>Decision</span>
            </h3>
            <p className="text-gray-700 font-medium capitalize">
              {pitchDetails.investment_decision}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      {renderOverview()}

      {/* Strengths Section */}
      {renderStrengths()}

      {/* Weaknesses Section */}
      {renderWeaknesses()}

      {/* Extras Section */}
      {renderExtras()}
    </div>
  );
};

export default PitchDetailsView;
