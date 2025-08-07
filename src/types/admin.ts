export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
}

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalResumes: number;
  totalChatSessions: number;
  totalPitches: number;
  storageUsed: number;
  storageLimit: number;
  systemHealth: "excellent" | "good" | "warning" | "critical";
  uptime: number;
  responseTime: number;
}

export interface AdminAction {
  id: string;
  type: "user_created" | "user_updated" | "user_deleted" | "system_maintenance" | "backup_created" | "security_alert";
  description: string;
  timestamp: string;
  userId?: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "completed" | "failed";
}

export interface AdminTab {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
}

export interface AdminFilters {
  role?: "user" | "admin" | "moderator";
  status?: "online" | "offline" | "away";
  isActive?: boolean;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface AdminPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
