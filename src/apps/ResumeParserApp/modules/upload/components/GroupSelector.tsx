import React, { useState, useEffect, useCallback } from "react";
import { useGroupApi } from "../../../hooks/useGroupApi";
import type { Group } from "../../../types/api";
import AddGroupModal from "./AddGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";
import CannotDeleteGroupModal from "./CannotDeleteGroupModal";

interface GroupSelectorProps {
  onGroupSelect: (group: Group | null) => void;
  selectedGroup: Group | null;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  onGroupSelect,
  selectedGroup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { getGroups, deleteGroup, isLoading, clearError } = useGroupApi();

  const fetchGroups = useCallback(async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, [getGroups]);

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupSelect = useCallback(
    (group: Group) => {
      onGroupSelect(group);
      setIsOpen(false);
    },
    [onGroupSelect]
  );

  const handleDeleteGroup = useCallback(
    async (group: Group, event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent dropdown from closing

      // Check if group has associated data (resumes)
      const hasResumes = (group.resumeCount || group.resume_count || 0) > 0;

      if (hasResumes) {
        // Show cannot delete modal
        setGroupToDelete(group);
        setShowCannotDeleteModal(true);
      } else {
        // Show delete confirmation modal
        setGroupToDelete(group);
        setDeleteError(null); // Clear any previous errors
        setShowDeleteModal(true);
      }
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!groupToDelete) return;

    setIsDeleting(true);
    setDeleteError(null); // Clear any previous errors

    try {
      const result = await deleteGroup(groupToDelete.id);

      if (result.success) {
        // Refetch groups to ensure we have the latest data
        await fetchGroups();

        // If this was the selected group, clear selection
        if (selectedGroup?.id === groupToDelete.id) {
          onGroupSelect(null);
        }

        // Close modal and reset state
        setShowDeleteModal(false);
        setGroupToDelete(null);
        setDeleteError(null);
      } else {
        // Handle API error response
        setDeleteError(
          result.message || "Failed to delete group. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      // Handle unexpected errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting the group. Please try again.";
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [groupToDelete, deleteGroup, selectedGroup, onGroupSelect, fetchGroups]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
    setDeleteError(null); // Clear error when canceling
  }, []);

  const handleCannotDeleteClose = useCallback(() => {
    setShowCannotDeleteModal(false);
    setGroupToDelete(null);
  }, []);

  const handleRefreshGroups = useCallback(async () => {
    await fetchGroups();
  }, [fetchGroups]);

  const handleGroupCreated = useCallback(
    (newGroup: Group) => {
      setGroups((prev) => [...prev, newGroup]);
      // Auto-select the newly created group
      handleGroupSelect(newGroup);
    },
    [handleGroupSelect]
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const openAddModal = useCallback(() => {
    setShowAddModal(true);
    setIsOpen(false); // Close dropdown when opening modal
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  return (
    <div className="relative">
      {/* Main Select Button */}
      <button
        onClick={toggleDropdown}
        disabled={isLoading}
        className={`w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-left text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          selectedGroup ? "border-blue-300 bg-blue-50" : ""
        }`}
      >
        <span className="truncate">
          {isLoading
            ? "Loading groups..."
            : selectedGroup
            ? selectedGroup.name
            : "Select Group"}
        </span>

        {/* Dropdown Arrow or Loading Spinner */}
        {isLoading ? (
          <svg
            className="animate-spin w-5 h-5 text-gray-400"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
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
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="py-1">
            {/* Header Actions */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex space-x-2">
                <button
                  onClick={openAddModal}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Create New Group</span>
                </button>
                <button
                  onClick={handleRefreshGroups}
                  disabled={isLoading}
                  className="flex items-center justify-center px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh groups"
                >
                  <svg
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Groups List */}
            {isLoading ? (
              <div className="px-4 py-3">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin w-4 h-4 text-gray-400"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm text-gray-500">
                    Loading groups...
                  </span>
                </div>
              </div>
            ) : groups.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No groups available
              </div>
            ) : (
              groups.map((group) => (
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
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{group.name}</div>
                      {group.description && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {group.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center ml-2">
                      <button
                        onClick={(e) => handleDeleteGroup(group, e)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete group"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      <AddGroupModal
        open={showAddModal}
        onClose={closeAddModal}
        onGroupCreated={handleGroupCreated}
      />

      {/* Delete Group Modal */}
      <DeleteGroupModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        group={groupToDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />

      {/* Cannot Delete Group Modal */}
      <CannotDeleteGroupModal
        open={showCannotDeleteModal}
        onClose={handleCannotDeleteClose}
        group={groupToDelete}
      />
    </div>
  );
};

export default GroupSelector;
