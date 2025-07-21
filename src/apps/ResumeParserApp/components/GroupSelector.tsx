import React, { useState } from "react";
import { useResumeStore } from "../store/resumeStore";
import type { IGroup } from "../types";

interface GroupSelectorProps {
  onGroupSelect: (group: IGroup) => void;
  selectedGroup: IGroup | null;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  onGroupSelect,
  selectedGroup,
}) => {
  const { groups } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleGroupSelect = (group: IGroup) => {
    onGroupSelect(group);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">Select Group</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Select your target group for CV uploads
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <span className={selectedGroup ? "text-gray-900" : "text-gray-500"}>
            {selectedGroup ? selectedGroup.name : "Select Group"}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
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

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {groups.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No groups available. Create a group first.
              </div>
            ) : (
              <div className="py-1">
                {groups.map((group: IGroup) => (
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

      {!selectedGroup && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-orange-800">
              Please select a group to organize and upload your CVs
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
