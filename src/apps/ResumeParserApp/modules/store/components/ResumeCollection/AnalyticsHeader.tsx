import React from "react";
import { FolderIcon } from "@heroicons/react/24/outline";

interface AnalyticsHeaderProps {
  totalFiles: number;
  totalGroups: number;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  totalFiles,
  totalGroups,
}) => {
  return (
    <div className="mb-10">
      {/* Enhanced Hero Section */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-10 h-10 text-white" />
            </div> */}
            {/* Animated rings */}
            {/* <div className="absolute inset-0 rounded-2xl border-2 border-purple-300 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-2xl border border-blue-300 animate-pulse opacity-30"></div> */}
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Resume Analytics
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          AI-Powered Talent Intelligence Dashboard - Track and manage your
          resume collection with advanced insights and analytics
        </p>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Files Card */}
        <div className="group relative">
          {/* Background with glass morphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl transform transition-transform group-hover:scale-105"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/50 p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  Total Files
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {totalFiles}
                </p>
                <p className="text-sm text-gray-600">CVs in your collection</p>
              </div>
            </div>

            {/* Subtle accent line */}
            <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-20"></div>

            {/* Interactive hover effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Total Groups Card */}
        <div className="group relative">
          {/* Background with glass morphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl transform transition-transform group-hover:scale-105"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200/50 p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FolderIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">
                  Total Groups
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {totalGroups}
                </p>
                <p className="text-sm text-gray-600">Organized collections</p>
              </div>
            </div>

            {/* Subtle accent line */}
            <div className="mt-6 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-20"></div>

            {/* Interactive hover effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-green-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
