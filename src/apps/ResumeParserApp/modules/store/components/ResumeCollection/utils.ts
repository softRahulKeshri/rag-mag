import type { StoreResume as Resume, Group, GroupStat } from "../../types";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Today";
  } else if (diffDays === 2) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getStatusColor = (status: Resume["status"]): string => {
  switch (status) {
    case "uploaded":
      return "bg-gray-100 text-gray-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: Resume["status"]): string => {
  switch (status) {
    case "uploaded":
      return "Uploaded";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
};

export const calculateGroupStats = (
  groups: Group[],
  resumes: Resume[]
): GroupStat[] => {
  // Create a map of group names to their counts
  const groupCounts = new Map<string, number>();

  // Count resumes in each group
  resumes.forEach((resume) => {
    if (resume.group) {
      groupCounts.set(resume.group, (groupCounts.get(resume.group) || 0) + 1);
    }
  });

  // Create GroupStat objects for each group
  const groupStats: GroupStat[] = groups.map((group) => ({
    group: group.name,
    count: groupCounts.get(group.name) || 0,
    hasResumes: (groupCounts.get(group.name) || 0) > 0,
    groupId: group.id,
  }));

  // Add stats for groups that exist in resumes but not in the groups list
  const existingGroupNames = new Set(groups.map((g) => g.name));
  const resumeGroups = new Set(resumes.map((r) => r.group).filter(Boolean));

  resumeGroups.forEach((groupName) => {
    if (groupName && !existingGroupNames.has(groupName)) {
      groupStats.push({
        group: groupName,
        count: groupCounts.get(groupName) || 0,
        hasResumes: true,
        groupId: Date.now() + Math.random(), // Generate a temporary ID
      });
    }
  });

  return groupStats.sort((a, b) => b.count - a.count);
};

export const filterResumes = (
  resumes: Resume[],
  searchQuery: string,
  selectedGroup: string | null
): Resume[] => {
  return resumes.filter((resume) => {
    // Group filter
    if (selectedGroup && resume.group !== selectedGroup) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filename = (
        resume.original_filename || resume.filename
      ).toLowerCase();

      return filename.includes(query);
    }

    return true;
  });
};

/**
 * Build API URL for resume operations using the new API endpoint
 * This URL is used for both viewing and downloading files
 * @param cvId - The CV/Resume ID
 * @returns The complete API URL
 */
export const buildResumeApiUrl = (cvId: string | number): string => {
  const baseURL =
    "http://ec2-65-2-188-195.ap-south-1.compute.amazonaws.com/api";
  return `${baseURL}/download/${cvId}`;
};
