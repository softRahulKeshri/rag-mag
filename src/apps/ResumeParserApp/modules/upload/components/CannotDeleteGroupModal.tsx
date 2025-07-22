import React from "react";
import type { Group } from "../../../types/api";

interface CannotDeleteGroupModalProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const CannotDeleteGroupModal: React.FC<CannotDeleteGroupModalProps> = ({
  open,
  onClose,
  group,
}) => {
  if (!open || !group) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all">
          {/* Modal Header */}
          <div className="flex items-center mb-4 pt-6 px-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900">
                Cannot Delete Group
              </h3>
            </div>
          </div>

          {/* Modal Content */}
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-700 mb-4">
              The group <span className="font-medium">"{group.name}"</span>{" "}
              cannot be deleted because it contains CVs.
            </p>

            {/* Instructions Box */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    To delete this group:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Navigate to the Resume Collection section</li>
                    <li>Filter by this group name</li>
                    <li>Remove or move all CVs to another group</li>
                    <li>Return here to delete the empty group</li>
                  </ol>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              This prevents accidental data loss and ensures your CVs are safely
              managed.
            </p>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CannotDeleteGroupModal;
