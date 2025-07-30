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
    <div className="fixed inset-0 z-[60] overflow-y-auto">
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
          <div
            className="relative px-8 py-6 border-b border-gray-100"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#FDA052" }}
              >
                <TrashIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: "#2E3141" }}>
                  Delete Group
                </h3>
                <p className="text-sm mt-1" style={{ color: "#6D6F7A" }}>
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Modal Content */}
          <div className="px-8 py-6">
            {/* Warning message */}
            <div
              className="mb-6 p-4 border rounded-xl"
              style={{ backgroundColor: "#EFF5FF", borderColor: "#BFD6FF" }}
            >
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon
                  className="w-6 h-6 flex-shrink-0 mt-0.5"
                  style={{ color: "#FDA052" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#2E3141" }}
                  >
                    Are you sure you want to delete this group?
                  </p>
                  <div
                    className="bg-white rounded-lg p-3 border"
                    style={{ borderColor: "#D5D6D9" }}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#F5F5F5" }}
                      >
                        <TrashIcon
                          className="w-4 h-4"
                          style={{ color: "#6D6F7A" }}
                        />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#2E3141" }}>
                          {group.name}
                        </p>
                        {group.description && (
                          <p className="text-xs" style={{ color: "#82838D" }}>
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: "#6D6F7A" }}>
                    This will permanently remove the group and cannot be
                    recovered.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-6 p-4 border rounded-xl"
                style={{ backgroundColor: "#FFEAEA", borderColor: "#FFB3B3" }}
              >
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: "#DC2626" }}
                  />
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#7F1D1D" }}
                    >
                      Failed to delete group
                    </p>
                    <p className="text-sm" style={{ color: "#991B1B" }}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  color: "#6D6F7A",
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D5D6D9",
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = "#F5F5F5";
                    e.currentTarget.style.borderColor = "#C0C1C6";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#D5D6D9";
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                style={{
                  backgroundColor: "#FDA052",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = "#FD8F2B";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = "#FDA052";
                  }
                }}
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
