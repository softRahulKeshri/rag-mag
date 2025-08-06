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
  // New fields from API response
  name?: string;
  job_profile?: string;
  days_available?: string;
  total_experience?: string;
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
  // New fields from API response
  name: string;
  job_profile: string;
  days_available: string;
  total_experience: string;
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
  onResumeUpdated?: (resumeId: number, updates: Partial<StoreResume>) => void;
  onRefreshResumes?: () => Promise<void>;
  // Comment handlers for direct state management
  onCommentAdded?: (resumeId: number, comment: ResumeComment) => Promise<void>;
  onCommentUpdated?: (
    resumeId: number,
    comment: ResumeComment
  ) => Promise<void>;
  onCommentDeleted?: (resumeId: number) => Promise<void>;
  isLoading?: boolean;
  isDeleting?: boolean;
  deletingResumeId?: number | null;
}
