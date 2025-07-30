import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useGroupApi } from "../../../hooks/useGroupApi";
import { useToast } from "../../../../../components/ui/useToast";
import type { Group } from "../../../types/api";
import AddGroupModal from "./AddGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";
import CannotDeleteGroupModal from "./CannotDeleteGroupModal";
import {
  ChevronDownIcon,
  ArrowPathIcon,
  UserGroupIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface GroupSelectorProps {
  onGroupSelect: (group: Group | null) => void;
  selectedGroup: Group | null;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  direction: "down" | "up";
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  onGroupSelect,
  selectedGroup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
    direction: "down",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { getGroups, deleteGroup, isLoading, clearError } = useGroupApi();
  const { showToast } = useToast();

  // Calculate dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 400; // Approximate max height
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    const direction =
      spaceBelow >= dropdownHeight || spaceBelow > spaceAbove ? "down" : "up";
    const top =
      direction === "down"
        ? buttonRect.bottom + window.scrollY + 8
        : buttonRect.top + window.scrollY - dropdownHeight - 8;

    setDropdownPosition({
      top,
      left: buttonRect.left + window.scrollX,
      width: buttonRect.width,
      direction,
    });
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, [getGroups]);

  const fetchGroupsAndValidateSelection = useCallback(async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);

      // Check if the currently selected group still exists in the fetched groups
      if (
        selectedGroup &&
        !fetchedGroups.find((group) => group.id === selectedGroup.id)
      ) {
        // Selected group no longer exists, clear the selection
        onGroupSelect(null);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, [getGroups, selectedGroup, onGroupSelect]);

  // Fetch groups on component mount only
  useEffect(() => {
    const initializeGroups = async () => {
      try {
        const fetchedGroups = await getGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    initializeGroups();
  }, [getGroups]); // Only depend on getGroups which is stable

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

      // Show delete confirmation modal - let the API handle validation
      setGroupToDelete(group);
      setDeleteError(null); // Clear any previous errors
      setShowDeleteModal(true);
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
        // Show success toast
        showToast(
          `Group "${groupToDelete.name}" deleted successfully`,
          "success"
        );

        // Refetch groups and validate selection
        await fetchGroupsAndValidateSelection();

        // Close modal and reset state
        setShowDeleteModal(false);
        setGroupToDelete(null);
        setDeleteError(null);

        // Close dropdown to refresh the UI
        setIsOpen(false);
      } else {
        // Check if the group has associated data (CVs)
        if (result.hasAssociatedData) {
          // Close delete modal and show cannot delete modal
          setShowDeleteModal(false);
          setShowCannotDeleteModal(true);
        } else {
          // Handle other API error responses
          const errorMsg =
            result.message || "Failed to delete group. Please try again.";
          setDeleteError(errorMsg);
          showToast(errorMsg, "error");
        }
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      // Handle unexpected errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting the group. Please try again.";
      setDeleteError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [groupToDelete, deleteGroup, fetchGroupsAndValidateSelection, showToast]);

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
    async (newGroup: Group) => {
      // Show success toast
      showToast(`Group "${newGroup.name}" created successfully`, "success");

      // Refetch all groups to ensure we have the latest data
      await fetchGroups();
      // Auto-select the newly created group
      handleGroupSelect(newGroup);
    },
    [fetchGroups, handleGroupSelect, showToast]
  );

  const toggleDropdown = useCallback(() => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError, calculateDropdownPosition]);

  // Handle click outside to close dropdown and window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, calculateDropdownPosition]);

  const openAddModal = useCallback(() => {
    setShowAddModal(true);
    setIsOpen(false); // Close dropdown when opening modal
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  // Render dropdown using portal
  const renderDropdown = () => {
    if (!isOpen) return null;

    const dropdownContent = (
      <div
        ref={dropdownRef}
        className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 40,
        }}
      >
        <div className="py-2">
          {/* Header Actions */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={openAddModal}
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Create New Group
              </button>
              <button
                onClick={handleRefreshGroups}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh groups"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Simplified Groups List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-6">
                <div className="flex items-center justify-center space-x-3">
                  <ArrowPathIcon className="animate-spin w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Loading groups...
                  </span>
                </div>
              </div>
            ) : groups.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  No groups available
                </p>
                <p className="text-xs text-gray-400">
                  Create your first group to get started
                </p>
              </div>
            ) : (
              groups.map((group) => {
                const isSelected = selectedGroup?.id === group.id;

                return (
                  <button
                    key={group.id}
                    onClick={() => handleGroupSelect(group)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-all duration-200 border-l-4 ${
                      isSelected
                        ? "text-blue-900 border-l-blue-500 bg-blue-50"
                        : "border-l-transparent text-gray-700 hover:border-l-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium truncate">
                              {group.name}
                            </span>
                            {isSelected && (
                              <CheckIcon className="w-4 h-4 flex-shrink-0 text-blue-600" />
                            )}
                          </div>
                          {group.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center ml-3">
                        <button
                          onClick={(e) => handleDeleteGroup(group, e)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete group"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );

    // Use portal to render dropdown at document body level
    return createPortal(dropdownContent, document.body);
  };

  return (
    <div className="relative">
      {/* Simplified Main Select Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        disabled={isLoading}
        className={`w-full flex items-center justify-between px-6 py-4 border-2 rounded-xl shadow-sm bg-white text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          selectedGroup
            ? "border-blue-300 hover:bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Simple Icon */}
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              </div>
            ) : selectedGroup ? (
              <div>
                <span className="block text-base font-semibold text-gray-900 truncate">
                  {selectedGroup.name}
                </span>
                {selectedGroup.description && (
                  <span className="block text-sm text-gray-500 truncate">
                    {selectedGroup.description}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <span className="block text-base font-medium text-gray-700">
                  Select Group
                </span>
                <span className="block text-sm text-gray-500">
                  Choose a group to organize your files
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Arrow or Loading Spinner */}
        <div className="flex-shrink-0 ml-4">
          {isLoading ? (
            <div className="w-5 w-5 text-gray-400 animate-spin">
              <ArrowPathIcon className="w-5 h-5" />
            </div>
          ) : (
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          )}
        </div>
      </button>

      {/* Render dropdown using portal */}
      {renderDropdown()}

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
