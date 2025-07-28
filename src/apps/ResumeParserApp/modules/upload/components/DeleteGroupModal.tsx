import React from "react";
import { createPortal } from "react-dom";
import type { Group } from "../../../types/api";
import {
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DeleteGroupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  group: Group | null;
  isDeleting?: boolean;
  error?: string | null;
}

const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  open,
  onClose,
  onConfirm,
  group,
  isDeleting = false,
  error = null,
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
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Enhanced Modal Header */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrashIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Group
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Modal Content */}
          <div className="px-8 py-6">
            {/* Warning message */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    Are you sure you want to delete this group?
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TrashIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {group.name}
                        </p>
                        {group.description && (
                          <p className="text-xs text-gray-500">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 mt-2">
                    This will permanently remove the group and cannot be
                    recovered.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 mb-1">
                      Failed to delete group
                    </p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete Group</span>
                  </span>
                )}
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

export default DeleteGroupModal;
