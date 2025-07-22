import React, { useState, useCallback } from "react";
import { useGroupApi } from "../../../hooks/useGroupApi";
import type { CreateGroupRequest, Group } from "../../../types/api";

interface AddGroupModalProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: (group: Group) => void;
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
    [error]
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
          description: "", // Empty description as requested
        };

        const newGroup = await createGroup(groupData);
        onGroupCreated(newGroup);
        onClose();
        // Reset form
        setGroupName("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create group");
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Gray backdrop that feels like on top of other content */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all">
          {/* Modal Header */}
          <div className="relative px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {/* Blue accent line */}
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Group
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Create a new group to organize your CVs
            </p>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Group Name Input */}
            <div className="mb-6">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={isCreating}
                maxLength={MAX_LENGTH}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error ? "border-red-300 focus:ring-red-500" : ""
                } ${isCreating ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                autoFocus
              />
              {/* Character count and validation */}
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  {groupName.length}/{MAX_LENGTH} characters
                </div>
                {groupName.length > 0 && (
                  <div className="text-xs">
                    {groupName.length < MIN_LENGTH ? (
                      <span className="text-orange-600">
                        Min {MIN_LENGTH} characters
                      </span>
                    ) : groupName.length > MAX_LENGTH ? (
                      <span className="text-red-600">
                        Max {MAX_LENGTH} characters
                      </span>
                    ) : (
                      <span className="text-green-600">✓ Valid</span>
                    )}
                  </div>
                )}
              </div>
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCreating}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isCreating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isCreating}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFormValid && !isCreating
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
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
                  "Add Group"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
