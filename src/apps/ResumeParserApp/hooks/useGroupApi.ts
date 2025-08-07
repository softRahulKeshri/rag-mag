import { useState, useCallback } from "react";
import { useApiService } from "./useApiService";
import type { Group } from "../types/api";
import type { CreateGroupRequest } from "../types/api";

/**
 * Group API Hook
 *
 * Handles all group-related API operations including:
 * - Fetching all groups
 * - Creating new groups
 * - Deleting groups
 * - Error handling and loading states
 */
export const useGroupApi = () => {
  const { get, post, put, del, handleApiError } = useApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transform backend group data to frontend format
   */
  const transformGroupData = useCallback(
    (group: Record<string, unknown>): Group => {
      return {
        id:
          typeof group.id === "string"
            ? parseInt(group.id, 10)
            : (group.id as number) || 0,
        name: (group.name as string) || "Unknown Group",
        description: (group.description as string) || "",
        createdAt:
          (group.createdAt as string) ||
          (group.created_at as string) ||
          new Date().toISOString(),
        created_at:
          (group.created_at as string) ||
          (group.createdAt as string) ||
          new Date().toISOString(),
        resumeCount:
          (group.resumeCount as number) || (group.resume_count as number) || 0,
        resume_count:
          (group.resume_count as number) || (group.resumeCount as number) || 0,
      };
    },
    []
  );

  /**
   * Fetch all groups
   * GET /groups
   */
  const getGroups = useCallback(async (): Promise<Group[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const url = "/groups";
      console.log(`🌐 Group API: Fetching groups from: ${url}`);

      const response = await get<Record<string, unknown>>(url);

      console.log(`📡 Groups API Response:`, response);

      // Handle response structure - adapt based on actual API response
      const groups = response.data || response || [];

      // Transform to ensure consistent Group interface
      const transformedGroups: Group[] = Array.isArray(groups)
        ? groups.map(transformGroupData)
        : [];

      console.log(`✅ Successfully fetched ${transformedGroups.length} groups`);
      return transformedGroups;
    } catch (error) {
      console.error("❌ Error fetching groups:", error);
      const apiError = handleApiError(error);
      setError(apiError.message);

      // Return empty array to maintain app functionality
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [get, transformGroupData, handleApiError]);

  /**
   * Create a new group
   * POST /groups
   */
  const createGroup = useCallback(
    async (groupData: CreateGroupRequest): Promise<Group> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = "/groups";
        console.log(`🆕 Group API: Creating group at: ${url}`, groupData);

        const response = await post<Record<string, unknown>>(url, groupData);

        console.log(`📡 Create Group API Response:`, response);

        // Handle different response structures
        let responseGroupData: Record<string, unknown> | null = null;

        // Check if response has a data property (wrapped response)
        if (response && typeof response === "object" && "data" in response) {
          responseGroupData = response.data as Record<string, unknown>;
        }
        // Check if response is the group data directly
        else if (response && typeof response === "object") {
          responseGroupData = response as Record<string, unknown>;
        }

        // Validate that we have group data with required fields
        if (!responseGroupData || typeof responseGroupData !== "object") {
          throw new Error("Invalid response: No group data received");
        }

        // Check for id field (could be named differently)
        const groupId =
          (responseGroupData.id as number) ||
          (responseGroupData.group_id as number) ||
          (responseGroupData.groupId as number);
        if (!groupId) {
          console.warn("Group response missing ID field:", responseGroupData);
          // Don't throw error, try to create a valid group object
        }

        // Transform to ensure consistent Group interface
        const transformedGroup: Group = {
          id:
            typeof groupId === "string"
              ? parseInt(groupId, 10)
              : groupId || Date.now(),
          name:
            (responseGroupData.name as string) ||
            (responseGroupData.group_name as string) ||
            (responseGroupData.groupName as string) ||
            groupData.name ||
            "Untitled Group",
          description:
            (responseGroupData.description as string) ||
            (responseGroupData.group_description as string) ||
            (responseGroupData.groupDescription as string) ||
            "",
          createdAt:
            (responseGroupData.createdAt as string) ||
            (responseGroupData.created_at as string) ||
            new Date().toISOString(),
          created_at:
            (responseGroupData.created_at as string) ||
            (responseGroupData.createdAt as string) ||
            new Date().toISOString(),
          resumeCount:
            (responseGroupData.resumeCount as number) ||
            (responseGroupData.resume_count as number) ||
            0,
          resume_count:
            (responseGroupData.resume_count as number) ||
            (responseGroupData.resumeCount as number) ||
            0,
        };

        console.log(`✅ Successfully created group:`, transformedGroup);
        return transformedGroup;
      } catch (error) {
        console.error("❌ Error creating group:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [post, handleApiError]
  );

  /**
   * Delete a group by ID
   * DELETE /groups/{id}
   */
  const deleteGroup = useCallback(
    async (
      id: number
    ): Promise<{
      success: boolean;
      message?: string;
      hasAssociatedData?: boolean;
    }> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `/groups/${id}`;
        console.log(`🗑️ Group API: Deleting group with ID ${id} at: ${url}`);

        const response = await del<Record<string, unknown>>(url);

        console.log(`📡 Delete Group API Response:`, response);

        // Check for success message
        if (response.message === "Group deleted") {
          return {
            success: true,
            message: "Group deleted successfully",
          };
        }

        // Handle unexpected response
        return {
          success: true,
          message: (response.message as string) || "Group deleted successfully",
        };
      } catch (error) {
        console.error("❌ Error deleting group:", error);

        // Check if it's the specific "Group has associated CVs" error
        if (
          error instanceof Error &&
          error.message.includes("Group has associated CVs")
        ) {
          return {
            success: false,
            message: "Group has associated CVs",
            hasAssociatedData: true,
          };
        }

        const apiError = handleApiError(error);
        setError(apiError.message);

        return {
          success: false,
          message: apiError.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [del, handleApiError]
  );

  /**
   * Update a group by ID
   * PUT /groups/{id}
   */
  const updateGroup = useCallback(
    async (
      id: number,
      updates: Partial<Omit<Group, "id" | "createdAt" | "created_at">>
    ): Promise<Group> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `/groups/${id}`;
        console.log(
          `✏️ Group API: Updating group with ID ${id} at: ${url}`,
          updates
        );

        const response = await put<Record<string, unknown>>(url, updates);

        console.log(`📡 Update Group API Response:`, response);

        // Transform response to Group interface
        const transformedGroup = transformGroupData(
          (response.data || response) as Record<string, unknown>
        );
        console.log(`✅ Successfully updated group:`, transformedGroup);

        return transformedGroup;
      } catch (error) {
        console.error("❌ Error updating group:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [put, transformGroupData, handleApiError]
  );

  /**
   * Get group by ID
   * GET /groups/{id}
   */
  const getGroupById = useCallback(
    async (id: number): Promise<Group | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `/groups/${id}`;
        console.log(`🔍 Group API: Fetching group with ID ${id} from: ${url}`);

        const response = await get<Record<string, unknown>>(url);

        console.log(`📡 Get Group API Response:`, response);

        if (!response) {
          return null;
        }

        const transformedGroup = transformGroupData(
          (response.data || response) as Record<string, unknown>
        );
        console.log(`✅ Successfully fetched group:`, transformedGroup);

        return transformedGroup;
      } catch (error) {
        console.error("❌ Error fetching group:", error);
        const apiError = handleApiError(error);
        setError(apiError.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [get, transformGroupData, handleApiError]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    getGroups,
    createGroup,
    deleteGroup,
    updateGroup,
    getGroupById,
    clearError,

    // Utilities
    transformGroupData,
  };
};
