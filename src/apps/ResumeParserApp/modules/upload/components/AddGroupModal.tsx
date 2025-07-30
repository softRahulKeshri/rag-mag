import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useGroupApi } from "../../../hooks/useGroupApi";
import { useToast } from "../../../../../components/ui/useToast";
import type { CreateGroupRequest, Group } from "../../../types/api";
import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AddGroupModalProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: (group: Group) => Promise<void>;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  open,
  onClose,
  onGroupCreated,
}) => {
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createGroup } = useGroupApi();
  const { showToast } = useToast();

  // Validation constants
  const MIN_LENGTH = 2;
  const MAX_LENGTH = 50;

  const handleInputChange = useCallback(
    (value: string) => {
      setGroupName(value);
      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    },
    [error, setError]
  );

  const validateGroupName = useCallback((name: string): string | null => {
    if (!name.trim()) {
      return "Group name is required";
    }
    if (name.trim().length < MIN_LENGTH) {
      return `Group name must be at least ${MIN_LENGTH} characters`;
    }
    if (name.trim().length > MAX_LENGTH) {
      return `Group name must be no more than ${MAX_LENGTH} characters`;
    }
    return null;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateGroupName(groupName);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsCreating(true);
      setError(null);

      try {
        const groupData: CreateGroupRequest = {
          name: groupName.trim(),
        };

        const newGroup = await createGroup(groupData);
        await onGroupCreated(newGroup);
        onClose();
        // Reset form
        setGroupName("");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create group";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setIsCreating(false);
      }
    },
    [groupName, validateGroupName, createGroup, onGroupCreated, onClose]
  );

  const handleCancel = useCallback(() => {
    if (!isCreating) {
      setGroupName("");
      setError(null);
      onClose();
    }
  }, [isCreating, onClose]);

  const isFormValid =
    groupName.trim().length >= MIN_LENGTH &&
    groupName.trim().length <= MAX_LENGTH;

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Enhanced backdrop with blur */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
          {/* Close Button */}
          <button
            onClick={handleCancel}
            disabled={isCreating}
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
                style={{ backgroundColor: "#3077F3" }}
              >
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: "#2E3141" }}>
                  Create New Group
                </h3>
                <p className="text-sm mt-1" style={{ color: "#6D6F7A" }}>
                  Organize your CVs into manageable categories
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Modal Body */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            {/* Group Name Input */}
            <div className="mb-8">
              <label
                htmlFor="groupName"
                className="block text-sm font-semibold text-gray-800 mb-3"
              >
                Group Name
              </label>
              <div className="relative">
                <input
                  id="groupName"
                  type="text"
                  placeholder="Enter a descriptive group name..."
                  value={groupName}
                  onChange={(e) => handleInputChange(e.target.value)}
                  disabled={isCreating}
                  maxLength={MAX_LENGTH}
                  className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    error
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  } ${
                    isCreating ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span
                    className={`text-xs font-medium ${
                      groupName.length > MAX_LENGTH * 0.8
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  >
                    {groupName.length}/{MAX_LENGTH}
                  </span>
                </div>
              </div>

              {/* Enhanced validation feedback */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  {groupName.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {groupName.length < MIN_LENGTH ? (
                        <>
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-xs text-orange-600 font-medium">
                            Min {MIN_LENGTH} characters required
                          </span>
                        </>
                      ) : groupName.length > MAX_LENGTH ? (
                        <>
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-xs text-red-600 font-medium">
                            Exceeds maximum length
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">
                            Valid group name
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCreating}
                className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isCreating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  color: "#6D6F7A",
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D5D6D9",
                }}
                onMouseEnter={(e) => {
                  if (!isCreating) {
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
                type="submit"
                disabled={!isFormValid || isCreating}
                className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg ${
                  isFormValid && !isCreating
                    ? "hover:shadow-xl transform hover:-translate-y-0.5"
                    : "cursor-not-allowed"
                }`}
                style={{
                  backgroundColor:
                    isFormValid && !isCreating ? "#3077F3" : "#C0C1C6",
                  color: isFormValid && !isCreating ? "#FFFFFF" : "#82838D",
                }}
                onMouseEnter={(e) => {
                  if (isFormValid && !isCreating) {
                    e.currentTarget.style.backgroundColor = "#1E50A8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid && !isCreating) {
                    e.currentTarget.style.backgroundColor = "#3077F3";
                  }
                }}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4"
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
                    <span>Creating...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>Create Group</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render modal at body level using portal
  return createPortal(modalContent, document.body);
};

export default AddGroupModal;
