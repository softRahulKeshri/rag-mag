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
    <div className="mb-4">
      {/* Compact Stats Cards */}
      <div className="flex items-center justify-center space-x-6">
        {/* Total Files Card */}
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 px-3 py-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
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
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{totalFiles}</span>
            <span className="text-gray-600 ml-1">CVs</span>
          </div>
        </div>

        {/* Total Groups Card */}
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 px-3 py-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
            <FolderIcon className="w-3 h-3 text-white" />
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{totalGroups}</span>
            <span className="text-gray-600 ml-1">Groups</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
