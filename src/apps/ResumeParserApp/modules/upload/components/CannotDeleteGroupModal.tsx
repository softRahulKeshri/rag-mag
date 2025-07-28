import React from "react";
import { createPortal } from "react-dom";
import type { Group } from "../../../types/api";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  InformationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

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

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Enhanced backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 z-10"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Enhanced Modal Header */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cannot Delete Group
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  This group contains active CVs
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Modal Content */}
          <div className="px-8 py-6">
            {/* Group info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    Group Information
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          "{group.name}"
                        </p>
                        {group.description && (
                          <p className="text-xs text-gray-500">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    The group contains CVs and cannot be deleted to prevent data
                    loss.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Instructions */}
            <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">
                    How to delete this group:
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Navigate to the Resume Collection section",
                      "Filter by this group name",
                      "Remove or move all CVs to another group",
                      "Return here to delete the empty group",
                    ].map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety note */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Data Protection
                  </p>
                  <p className="text-xs text-green-700">
                    This prevents accidental data loss and ensures your CVs are
                    safely managed.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center space-x-2">
                  <span>Got It</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal at body level using portal
  return createPortal(modalContent, document.body);
};

export default CannotDeleteGroupModal;
