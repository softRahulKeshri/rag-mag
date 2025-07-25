import { useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import type {
  PitchDetails,
  AnalysisSection,
  ConsolidatedAnalysis,
} from "../types/types";

interface PitchDetailsViewProps {
  pitchDetails: PitchDetails;
}

const PitchDetailsView = ({ pitchDetails }: PitchDetailsViewProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 6) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircleIcon className="w-5 h-5" />;
    if (score >= 6) return <ExclamationTriangleIcon className="w-5 h-5" />;
    return <XCircleIcon className="w-5 h-5" />;
  };

  const renderAnalysisSection = (
    title: string,
    section: AnalysisSection,
    icon: React.ReactNode,
    sectionKey: string
  ) => {
    const isExpanded = expandedSections.has(sectionKey);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              {icon}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{section.summary}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getScoreColor(
                section.score
              )}`}
            >
              {getScoreIcon(section.score)}
              <span>{section.score}/10</span>
            </div>
            {isExpanded ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {section.summary}
              </p>
            </div>

            {section.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
                <ul className="space-y-2">
                  {section.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.risk_flag && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-800">Risk Flag</h4>
                </div>
                <p className="text-red-700 text-sm">{section.risk_flag}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderConsolidatedAnalysis = (analysis: ConsolidatedAnalysis) => {
    const isExpanded = expandedSections.has("consolidated");

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
        <button
          onClick={() => toggleSection("consolidated")}
          className="w-full p-6 flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">
                Overall Analysis
              </h3>
              <p className="text-sm text-gray-600">{analysis.verdict}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 text-lg font-bold ${getScoreColor(
                analysis.final_score
              )}`}
            >
              {getScoreIcon(analysis.final_score)}
              <span>{analysis.final_score}/10</span>
            </div>
            {isExpanded ? (
              <ChevronDownIcon className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span>Strengths</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                  <span>Weaknesses</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Rationale</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysis.rationale}
              </p>
            </div>

            {analysis.red_flags.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <span>Red Flags</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.red_flags.map((flag, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-700">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.reference_links.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-blue-600" />
                  <span>Reference Links</span>
                </h4>
                <div className="space-y-2">
                  {analysis.reference_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.reference_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      <span>{link.text}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pitch Analysis</h2>
            <p className="text-gray-600">
              Comprehensive AI-powered analysis of your pitch deck
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Analyzed on</p>
            <p className="font-medium text-gray-900">
              {new Date(pitchDetails.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Company</h3>
            <p className="text-gray-600">
              {pitchDetails.title || pitchDetails.filename}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Sector</h3>
            <p className="text-gray-600">
              {pitchDetails.tagsinfo.Market || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Funding Stage</h3>
            <p className="text-gray-600">
              {pitchDetails.tagsinfo.FundingStage || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Consolidated Analysis */}
      {renderConsolidatedAnalysis(pitchDetails.analysis.consolidated)}

      {/* Individual Analysis Sections */}
      <div className="space-y-4">
        {renderAnalysisSection(
          "Problem & Solution",
          pitchDetails.analysis.problem_solution,
          <LightBulbIcon className="w-6 h-6 text-blue-600" />,
          "problem_solution"
        )}

        {renderAnalysisSection(
          "Product & Service",
          pitchDetails.analysis.product_service,
          <RocketLaunchIcon className="w-6 h-6 text-purple-600" />,
          "product_service"
        )}

        {renderAnalysisSection(
          "Market & Sector",
          pitchDetails.analysis.sector,
          <GlobeAltIcon className="w-6 h-6 text-green-600" />,
          "sector"
        )}

        {renderAnalysisSection(
          "Team",
          pitchDetails.analysis.team,
          <UserGroupIcon className="w-6 h-6 text-indigo-600" />,
          "team"
        )}

        {renderAnalysisSection(
          "Financials",
          pitchDetails.analysis.financials,
          <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />,
          "financials"
        )}

        {renderAnalysisSection(
          "Funding",
          pitchDetails.analysis.funding,
          <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />,
          "funding"
        )}

        {renderAnalysisSection(
          "Competition",
          pitchDetails.analysis.competition,
          <AcademicCapIcon className="w-6 h-6 text-red-600" />,
          "competition"
        )}

        {renderAnalysisSection(
          "Valuation",
          pitchDetails.analysis.valuation,
          <ChartBarIcon className="w-6 h-6 text-teal-600" />,
          "valuation"
        )}

        {renderAnalysisSection(
          "Cap Table",
          pitchDetails.analysis.cap_table,
          <DocumentTextIcon className="w-6 h-6 text-gray-600" />,
          "cap_table"
        )}
      </div>

      {/* Thesis Based Analysis */}
      {pitchDetails.analysis.thesis_based && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Thesis-Based Analysis
                </h3>
                <p className="text-sm text-gray-500">
                  Investment thesis evaluation
                </p>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getScoreColor(
                  pitchDetails.analysis.thesis_based.score
                )}`}
              >
                {getScoreIcon(pitchDetails.analysis.thesis_based.score)}
                <span>{pitchDetails.analysis.thesis_based.score}/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Ask</h4>
                <p className="text-gray-700 text-sm">
                  {pitchDetails.analysis.thesis_based.ask}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Stage</h4>
                <p className="text-gray-700 text-sm">
                  {pitchDetails.analysis.thesis_based.stage}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h4 className="font-medium text-gray-900 mb-2">Rationale</h4>
                <p className="text-gray-700 text-sm">
                  {pitchDetails.analysis.thesis_based.rationale}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagewise Summary */}
      {pitchDetails.analysis.pagewise_summary && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Page-by-Page Summary
                </h3>
                <p className="text-sm text-gray-500">
                  Detailed breakdown of each slide
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {pitchDetails.analysis.pagewise_summary.summary.map(
                (summary, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {summary}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDetailsView;
