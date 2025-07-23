// Store Module Types
export interface StoreResume {
  id: number;
  filename: string;
  original_filename?: string;
  stored_filename?: string;
  filepath?: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  group?: string;
  comment?: ResumeComment;
  // Backend API specific fields
  cloud_url?: string;
  commented_at?: string;
  upload_time?: string;
}

// Backend API response interface for /cvs endpoint
export interface BackendResumeResponse {
  cloud_url: string;
  comment: string | null;
  commented_at: string | null;
  filepath: string;
  group: string;
  id: number;
  original_filename: string;
  stored_filename: string;
  upload_time: string;
}

export interface ResumeComment {
  id: number;
  resumeId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  hrName?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  created_at?: string;
  resumeCount?: number;
  resume_count?: number;
}

export interface GroupStat {
  group: string;
  count: number;
  hasResumes: boolean;
  groupId: number;
}

export interface ResumeCollectionProps {
  resumes: StoreResume[];
  onDelete?: (resume: StoreResume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  onResumeUpdated?: (resumeId: number, updatedResume: StoreResume) => void;
  onRefreshResumes?: () => Promise<void>;
  isLoading?: boolean;
  isDeleting?: boolean;
  deletingResumeId?: number | null;
}
