import type { Group, Resume, GroupStat } from "./types";

// Format file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Format date to readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get status color based on resume status
export const getStatusColor = (status: Resume["status"]): string => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-100";
    case "processing":
      return "text-yellow-600 bg-yellow-100";
    case "failed":
      return "text-red-600 bg-red-100";
    case "uploaded":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

// Get status text
export const getStatusText = (status: Resume["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "processing":
      return "Processing";
    case "failed":
      return "Failed";
    case "uploaded":
      return "Uploaded";
    default:
      return "Unknown";
  }
};

// Calculate group statistics
export const calculateGroupStats = (
  groups: Group[],
  resumes: Resume[]
): GroupStat[] => {
  if (!groups.length) return [];

  const groupStatsArray = groups.map((group) => {
    const resumeCount = resumes.filter((resume) => {
      if (!resume.group) return false;
      return (
        resume.group.toLowerCase().trim() === group.name.toLowerCase().trim()
      );
    }).length;

    return {
      group: group.name,
      count: resumeCount,
      hasResumes: resumeCount > 0,
      groupId: group.id,
    };
  });

  // Sort groups: first by whether they have resumes (with resumes first),
  // then by count (descending), then alphabetically
  return groupStatsArray.sort((a, b) => {
    // First, prioritize groups with resumes
    if (a.hasResumes !== b.hasResumes) {
      return b.hasResumes ? 1 : -1; // hasResumes groups first
    }

    // Then sort by count (descending)
    if (a.count !== b.count) {
      return b.count - a.count;
    }

    // Finally, sort alphabetically
    return a.group.localeCompare(b.group);
  });
};

// Filter resumes based on search query and selected group
export const filterResumes = (
  resumes: Resume[],
  searchQuery: string,
  selectedGroup: string | null
): Resume[] => {
  let filtered = resumes;

  // Filter by selected group first
  if (selectedGroup) {
    filtered = filtered.filter(
      (resume) =>
        resume.group?.toLowerCase().trim() ===
        selectedGroup.toLowerCase().trim()
    );
  }

  // Then filter by search query within the group (or all resumes if no group selected)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((resume) => {
      const searchableFilename = resume.original_filename || resume.filename;
      return searchableFilename.toLowerCase().includes(query);
    });
  }

  return filtered;
};
