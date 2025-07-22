import React, { useState } from "react";
import { useResumeStore } from "../store/resumeStore";
import type { Group } from "../types";

interface GroupSelectorProps {
  onGroupSelect: (group: Group) => void;
  selectedGroup: Group | null;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  onGroupSelect,
  selectedGroup,
}) => {
  const { groups } = useResumeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleGroupSelect = (group: Group) => {
    onGroupSelect(group);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">Select Group</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Select your target group for CV uploads
      </p>

      {/* Group Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <span className={selectedGroup ? "text-gray-900" : "text-gray-500"}>
            {selectedGroup ? selectedGroup.name : "Select Group"}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {groups.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No groups available. Create a group first.
              </div>
            ) : (
              <div className="py-1">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => handleGroupSelect(group)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                      selectedGroup?.id === group.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{group.name}</div>
                        {group.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {group.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {group.resumeCount} resumes
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Box */}
      {selectedGroup && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-blue-800">
              Perfect! Your CVs will be organized and uploaded to
            </span>
            <div className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
              <span>{selectedGroup.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
