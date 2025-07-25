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
  ArrowTopRightOnSquareIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  EyeIcon,
  PresentationChartLineIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import type {
  PitchDetails,
  AnalysisSection,
  ConsolidatedAnalysis,
} from "../types/types";

interface PitchDetailsViewProps {
  pitchDetails: PitchDetails;
}

// Consistent color scheme matching other apps
const sectionColors = {
  problem_solution: {
    primary: "#3B82F6",
    secondary: "#EFF6FF",
    accent: "#1D4ED8",
    icon: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
  product_service: {
    primary: "#8B5CF6",
    secondary: "#F3F4F6",
    accent: "#7C3AED",
    icon: "text-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
  },
  sector: {
    primary: "#10B981",
    secondary: "#ECFDF5",
    accent: "#059669",
    icon: "text-green-600",
    border: "border-green-200",
    bg: "bg-green-50",
  },
  team: {
    primary: "#F59E0B",
    secondary: "#FFFBEB",
    accent: "#D97706",
    icon: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
  },
  financials: {
    primary: "#EF4444",
    secondary: "#FEF2F2",
    accent: "#DC2626",
    icon: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
  },
  funding: {
    primary: "#06B6D4",
    secondary: "#ECFEFF",
    accent: "#0891B2",
    icon: "text-cyan-600",
    border: "border-cyan-200",
    bg: "bg-cyan-50",
  },
  competition: {
    primary: "#84CC16",
    secondary: "#F7FEE7",
    accent: "#65A30D",
    icon: "text-lime-600",
    border: "border-lime-200",
    bg: "bg-lime-50",
  },
  valuation: {
    primary: "#EC4899",
    secondary: "#FDF2F8",
    accent: "#DB2777",
    icon: "text-pink-600",
    border: "border-pink-200",
    bg: "bg-pink-50",
  },
  cap_table: {
    primary: "#6366F1",
    secondary: "#EEF2FF",
    accent: "#4F46E5",
    icon: "text-indigo-600",
    border: "border-indigo-200",
    bg: "bg-indigo-50",
  },
};

const PitchDetailsView = ({ pitchDetails }: PitchDetailsViewProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["consolidated"])
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
    if (score >= 8) return "text-green-700 bg-green-100 border-green-300";
    if (score >= 6) return "text-yellow-700 bg-yellow-100 border-yellow-300";
    return "text-red-700 bg-red-100 border-red-300";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircleIcon className="w-5 h-5" />;
    if (score >= 6) return <ExclamationTriangleIcon className="w-5 h-5" />;
    return <XCircleIcon className="w-5 h-5" />;
  };

  const getScoreTrend = (score: number) => {
    if (score >= 8)
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (score >= 6)
      return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
    return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
  };

  const renderQuickSummary = () => {
    const sections = [
      {
        key: "problem_solution",
        name: "Problem & Solution",
        score: pitchDetails.analysis.problem_solution.score,
        icon: <LightBulbIcon className="w-5 h-5" />,
      },
      {
        key: "product_service",
        name: "Product & Service",
        score: pitchDetails.analysis.product_service.score,
        icon: <RocketLaunchIcon className="w-5 h-5" />,
      },
      {
        key: "sector",
        name: "Market & Sector",
        score: pitchDetails.analysis.sector.score,
        icon: <GlobeAltIcon className="w-5 h-5" />,
      },
      {
        key: "team",
        name: "Team",
        score: pitchDetails.analysis.team.score,
        icon: <UserGroupIcon className="w-5 h-5" />,
      },
      {
        key: "financials",
        name: "Financials",
        score: pitchDetails.analysis.financials.score,
        icon: <BanknotesIcon className="w-5 h-5" />,
      },
      {
        key: "funding",
        name: "Funding",
        score: pitchDetails.analysis.funding.score,
        icon: <BuildingOfficeIcon className="w-5 h-5" />,
      },
      {
        key: "competition",
        name: "Competition",
        score: pitchDetails.analysis.competition.score,
        icon: <AcademicCapIcon className="w-5 h-5" />,
      },
      {
        key: "valuation",
        name: "Valuation",
        score: pitchDetails.analysis.valuation.score,
        icon: <ChartBarIcon className="w-5 h-5" />,
      },
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Executive Dashboard
            </h3>
            <p className="text-gray-600">Key investment metrics at a glance</p>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-900 font-semibold">
              Overall Score: {pitchDetails.analysis.consolidated.final_score}/10
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((section) => {
            const colors =
              sectionColors[section.key as keyof typeof sectionColors];
            return (
              <div
                key={section.key}
                onClick={() => toggleSection(section.key)}
                className={`bg-white rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <div className={colors.icon}>{section.icon}</div>
                  </div>
                  {getScoreTrend(section.score)}
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-3 group-hover:text-gray-700 transition-colors duration-200">
                  {section.name}
                </h4>
                <div
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(
                    section.score
                  )}`}
                >
                  {getScoreIcon(section.score)}
                  <span>{section.score}/10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAnalysisSection = (
    title: string,
    section: AnalysisSection,
    icon: React.ReactNode,
    sectionKey: string
  ) => {
    const isExpanded = expandedSections.has(sectionKey);
    const colors = sectionColors[sectionKey as keyof typeof sectionColors];

    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md`}
      >
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform duration-200`}
            >
              <div className={`${colors.icon} text-xl`}>{icon}</div>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-700 transition-colors duration-200">
                {title}
              </h3>
              <p className="text-gray-600 text-sm max-w-md mt-1">
                {section.summary}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium ${getScoreColor(
                section.score
              )}`}
            >
              {getScoreIcon(section.score)}
              <span>{section.score}/10</span>
            </div>
            <div
              className={`w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDownIcon className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </button>

        {isExpanded && (
          <div
            className={`px-6 pb-6 space-y-6 bg-gray-50 border-t border-gray-200`}
          >
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 text-base mb-3 flex items-center space-x-2">
                <EyeIcon className="w-5 h-5 text-blue-600" />
                <span>Executive Summary</span>
              </h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                {section.summary}
              </p>
            </div>

            {section.suggestions.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-base mb-4 flex items-center space-x-2">
                  <LightBulbIcon className="w-5 h-5 text-yellow-600" />
                  <span>Strategic Recommendations</span>
                </h4>
                <ul className="space-y-3">
                  {section.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div
                        className={`w-2 h-2 bg-${colors.primary} rounded-full mt-2 flex-shrink-0`}
                      ></div>
                      <span className="text-gray-700 font-medium text-sm">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.risk_flag && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center border border-red-200">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 text-base">
                      Critical Risk Alert
                    </h4>
                    <p className="text-red-600 text-sm">
                      Requires immediate attention
                    </p>
                  </div>
                </div>
                <p className="text-red-700 font-medium leading-relaxed text-sm">
                  {section.risk_flag}
                </p>
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <button
          onClick={() => toggleSection("consolidated")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform duration-200">
              <PresentationChartLineIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-xl mb-2 group-hover:text-gray-700 transition-colors duration-200">
                Investment Analysis Report
              </h3>
              <p className="text-gray-600 text-base max-w-2xl">
                {analysis.verdict}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-3 px-4 py-2 rounded-full border text-lg font-semibold ${getScoreColor(
                analysis.final_score
              )}`}
            >
              {getScoreIcon(analysis.final_score)}
              <span>{analysis.final_score}/10</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center space-x-2">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium text-sm">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center space-x-2">
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                  <span>Areas of Concern</span>
                </h4>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium text-sm">
                        {weakness}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center space-x-2">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                <span>Investment Rationale</span>
              </h4>
              <p className="text-gray-700 leading-relaxed text-base">
                {analysis.rationale}
              </p>
            </div>

            {analysis.red_flags.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 text-lg mb-4 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  <span>Critical Red Flags</span>
                </h4>
                <ul className="space-y-3">
                  {analysis.red_flags.map((flag, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-red-100 rounded-lg border border-red-200"
                    >
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-red-800 font-medium text-sm">
                        {flag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.reference_links.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center space-x-2">
                  <ArrowTopRightOnSquareIcon className="w-6 h-6 text-blue-600" />
                  <span>Reference Materials</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.reference_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.reference_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200 group"
                    >
                      <ArrowTopRightOnSquareIcon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-gray-700 font-medium text-sm group-hover:text-gray-900 transition-colors duration-200">
                        {link.text}
                      </span>
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
              {new Date(pitchDetails.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
              <span>Company</span>
            </h3>
            <p className="text-gray-700 font-medium">
              {pitchDetails.title || pitchDetails.filename}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-green-600" />
              <span>Sector</span>
            </h3>
            <p className="text-gray-700 font-medium">
              {pitchDetails.tagsinfo.Market || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
              <span>Funding Stage</span>
            </h3>
            <p className="text-gray-700 font-medium">
              {pitchDetails.tagsinfo.FundingStage || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      {renderQuickSummary()}

      {/* Consolidated Analysis */}
      {renderConsolidatedAnalysis(pitchDetails.analysis.consolidated)}

      {/* Individual Analysis Sections */}
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Detailed Analysis
          </h3>
          <p className="text-gray-600">
            Click on any section to explore detailed insights
          </p>
        </div>

        {renderAnalysisSection(
          "Problem & Solution",
          pitchDetails.analysis.problem_solution,
          <LightBulbIcon className="w-6 h-6" />,
          "problem_solution"
        )}

        {renderAnalysisSection(
          "Product & Service",
          pitchDetails.analysis.product_service,
          <RocketLaunchIcon className="w-6 h-6" />,
          "product_service"
        )}

        {renderAnalysisSection(
          "Market & Sector",
          pitchDetails.analysis.sector,
          <GlobeAltIcon className="w-6 h-6" />,
          "sector"
        )}

        {renderAnalysisSection(
          "Team",
          pitchDetails.analysis.team,
          <UserGroupIcon className="w-6 h-6" />,
          "team"
        )}

        {renderAnalysisSection(
          "Financials",
          pitchDetails.analysis.financials,
          <BanknotesIcon className="w-6 h-6" />,
          "financials"
        )}

        {renderAnalysisSection(
          "Funding",
          pitchDetails.analysis.funding,
          <BuildingOfficeIcon className="w-6 h-6" />,
          "funding"
        )}

        {renderAnalysisSection(
          "Competition",
          pitchDetails.analysis.competition,
          <AcademicCapIcon className="w-6 h-6" />,
          "competition"
        )}

        {renderAnalysisSection(
          "Valuation",
          pitchDetails.analysis.valuation,
          <ChartBarIcon className="w-6 h-6" />,
          "valuation"
        )}

        {renderAnalysisSection(
          "Cap Table",
          pitchDetails.analysis.cap_table,
          <DocumentTextIcon className="w-6 h-6" />,
          "cap_table"
        )}
      </div>

      {/* Thesis Based Analysis */}
      {pitchDetails.analysis.thesis_based && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <AcademicCapIcon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Investment Thesis Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Strategic investment evaluation
                </p>
              </div>
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium ${getScoreColor(
                  pitchDetails.analysis.thesis_based.score
                )}`}
              >
                {getScoreIcon(pitchDetails.analysis.thesis_based.score)}
                <span>{pitchDetails.analysis.thesis_based.score}/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-base mb-3 flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                  <span>Funding Ask</span>
                </h4>
                <p className="text-gray-700 font-medium text-sm">
                  {pitchDetails.analysis.thesis_based.ask}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-base mb-3 flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-purple-600" />
                  <span>Investment Stage</span>
                </h4>
                <p className="text-gray-700 font-medium text-sm">
                  {pitchDetails.analysis.thesis_based.stage}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 md:col-span-2">
                <h4 className="font-semibold text-gray-900 text-base mb-3 flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  <span>Thesis Rationale</span>
                </h4>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {pitchDetails.analysis.thesis_based.rationale}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagewise Summary */}
      {pitchDetails.analysis.pagewise_summary && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <DocumentTextIcon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Slide-by-Slide Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Detailed breakdown of each presentation slide
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pitchDetails.analysis.pagewise_summary.summary.map(
                (summary, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-gray-200">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base mb-2">
                          Slide {index + 1}
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {summary}
                        </p>
                      </div>
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
