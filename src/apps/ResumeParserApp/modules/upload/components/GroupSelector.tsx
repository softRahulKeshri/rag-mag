import React, { useState, useEffect, useCallback } from "react";
import { useGroupApi } from "../../../hooks/useGroupApi";
import type { Group } from "../../../types/api";
import AddGroupModal from "./AddGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";
import CannotDeleteGroupModal from "./CannotDeleteGroupModal";
import {
  ChevronDownIcon,
  PlusIcon,
  ArrowPathIcon,
  UserGroupIcon,
  TrashIcon,
  CheckIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CodeBracketIcon,
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  StarIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

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

  // Function to get varied icons for different groups
  const getGroupIcon = useCallback((groupName: string, index: number) => {
    const iconMap = [
      UserGroupIcon,
      BriefcaseIcon,
      AcademicCapIcon,
      BuildingOfficeIcon,
      CodeBracketIcon,
      HeartIcon,
      LightBulbIcon,
      RocketLaunchIcon,
      ShieldCheckIcon,
      StarIcon,
      CpuChipIcon,
    ];

    // Use a combination of group name hash and index for consistent but varied icons
    const nameHash = groupName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const iconIndex = Math.abs(nameHash + index) % iconMap.length;
    return iconMap[iconIndex];
  }, []);

  // Professional color scheme using brand colors
  const getGroupColor = useCallback((groupName: string, index: number) => {
    const colorMap = [
      // Primary UI Blue variations
      { bg: "#EFF5FF", text: "#1E50A8", selectedBg: "#E3EDFF" }, // p100 bg, p600 text, p200 selected
      { bg: "#E3EDFF", text: "#11397E", selectedBg: "#BFD6FF" }, // p200 bg, p700 text, p300 selected

      // Brand gradient colors with neutral backgrounds
      { bg: "#F5F5F5", text: "#FDA052", selectedBg: "#EAEAEC" }, // Orange with neutral
      { bg: "#F5F5F5", text: "#B96AF7", selectedBg: "#EAEAEC" }, // Purple with neutral
      { bg: "#F5F5F5", text: "#3077F3", selectedBg: "#EAEAEC" }, // Blue with neutral
      { bg: "#F5F5F5", text: "#41E6F8", selectedBg: "#EAEAEC" }, // Cyan with neutral

      // Neutral palette variations
      { bg: "#EAEAEC", text: "#2E3141", selectedBg: "#D5D6D9" }, // n150 bg, n1000 text, n200 selected
      { bg: "#D5D6D9", text: "#434654", selectedBg: "#C0C1C6" }, // n200 bg, n900 text, n300 selected
      { bg: "#C0C1C6", text: "#585A67", selectedBg: "#ABADB3" }, // n300 bg, n800 text, n400 selected

      // Additional professional combinations
      { bg: "#ECECEC", text: "#414141", selectedBg: "#D9D9D9" }, // Greyscale combination
    ];

    const nameHash = groupName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colorIndex = Math.abs(nameHash + index) % colorMap.length;
    return colorMap[colorIndex];
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
          setDeleteError(
            result.message || "Failed to delete group. Please try again."
          );
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
    } finally {
      setIsDeleting(false);
    }
  }, [groupToDelete, deleteGroup, fetchGroupsAndValidateSelection]);

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
      // Refetch all groups to ensure we have the latest data
      await fetchGroups();
      // Auto-select the newly created group
      handleGroupSelect(newGroup);
    },
    [fetchGroups, handleGroupSelect]
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

  // Get icon and color for selected group using professional colors
  const selectedGroupIcon = selectedGroup
    ? getGroupIcon(selectedGroup.name, 0)
    : UserGroupIcon;
  const selectedGroupColor = selectedGroup
    ? getGroupColor(selectedGroup.name, 0)
    : { bg: "#F5F5F5", text: "#6D6F7A", selectedBg: "#EAEAEC" };

  return (
    <div className="relative">
      {/* Enhanced Main Select Button */}
      <button
        onClick={toggleDropdown}
        disabled={isLoading}
        className={`w-full flex items-center justify-between px-6 py-4 border-2 rounded-xl shadow-sm bg-white text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          selectedGroup
            ? "border-blue-300 hover:bg-blue-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
        style={{
          backgroundColor: selectedGroup
            ? selectedGroupColor.selectedBg
            : undefined,
        }}
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Dynamic Icon with Professional Colors */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: selectedGroup
                ? selectedGroupColor.bg
                : "#F5F5F5",
            }}
          >
            {React.createElement(selectedGroupIcon, {
              className: "w-6 h-6",
              style: {
                color: selectedGroup ? selectedGroupColor.text : "#6D6F7A",
              },
            })}
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

      {/* Enhanced Dropdown Menu with Maximum Z-Index */}
      {isOpen && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-hidden">
          <div className="py-2">
            {/* Header Actions with Professional Colors */}
            <div
              className="px-4 py-3 border-b border-gray-100"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <div className="flex space-x-2">
                <button
                  onClick={openAddModal}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border"
                  style={{
                    color: "#1E50A8",
                    backgroundColor: "#EFF5FF",
                    borderColor: "#BFD6FF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#E3EDFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#EFF5FF";
                  }}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create New Group</span>
                </button>
                <button
                  onClick={handleRefreshGroups}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: "#585A67",
                    backgroundColor: "#F5F5F5",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#EAEAEC";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F5F5F5";
                  }}
                  title="Refresh groups"
                >
                  <ArrowPathIcon
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Enhanced Groups List */}
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
                  <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    No groups available
                  </p>
                  <p className="text-xs text-gray-400">
                    Create your first group to get started
                  </p>
                </div>
              ) : (
                groups.map((group, index) => {
                  const GroupIcon = getGroupIcon(group.name, index);
                  const groupColor = getGroupColor(group.name, index);
                  const isSelected = selectedGroup?.id === group.id;

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleGroupSelect(group)}
                      className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-all duration-200 border-l-4 ${
                        isSelected
                          ? "text-blue-900 border-l-blue-500"
                          : "border-l-transparent text-gray-700 hover:border-l-gray-300"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "#EFF5FF" : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: isSelected
                                ? "#E3EDFF"
                                : groupColor.bg,
                            }}
                          >
                            <GroupIcon
                              className="w-4 h-4"
                              style={{
                                color: isSelected ? "#1E50A8" : groupColor.text,
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium truncate">
                                {group.name}
                              </span>
                              {isSelected && (
                                <CheckIcon
                                  className="w-4 h-4 flex-shrink-0"
                                  style={{ color: "#1E50A8" }}
                                />
                              )}
                            </div>
                            {group.description && (
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {group.description}
                              </p>
                            )}
                            {group.resumeCount !== undefined && (
                              <p className="text-xs text-gray-400 mt-1">
                                {group.resumeCount}{" "}
                                {group.resumeCount === 1 ? "resume" : "resumes"}
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
