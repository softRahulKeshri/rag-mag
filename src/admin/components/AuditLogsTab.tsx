import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

/**
 * AuditLogsTab Component
 *
 * Comprehensive audit logs interface showing user activity across all apps.
 * Provides detailed logs of user actions, system events, and security monitoring.
 *
 * Features:
 * - User activity logs with timestamps
 * - App-specific activity tracking
 * - Search and filtering capabilities
 * - Security event monitoring
 * - Export functionality
 * - Real-time log updates
 * - Pagination for large datasets
 */
interface AuditLog {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  action: string;
  app: "resume-parser" | "pitch-analyzer" | "chat-service" | "system";
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "error" | "warning" | "info";
  details: string;
  sessionId?: string;
}

const AuditLogsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock audit logs data - in real app, this would come from API
  const mockLogs = useMemo<AuditLog[]>(
    () => [
      {
        id: "1",
        userId: "user_123",
        username: "john_doe",
        userEmail: "john@example.com",
        action: "Upload Resume",
        app: "resume-parser",
        timestamp: "2024-01-20T15:30:00Z",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        status: "success",
        details: "Successfully uploaded resume.pdf (2.3MB)",
        sessionId: "sess_abc123",
      },
      {
        id: "2",
        userId: "user_456",
        username: "jane_smith",
        userEmail: "jane@example.com",
        action: "Analyze Pitch",
        app: "pitch-analyzer",
        timestamp: "2024-01-20T14:45:00Z",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        status: "success",
        details: "Pitch analysis completed for startup_pitch.pdf",
        sessionId: "sess_def456",
      },
      {
        id: "3",
        userId: "user_789",
        username: "bob_wilson",
        userEmail: "bob@example.com",
        action: "Send Message",
        app: "chat-service",
        timestamp: "2024-01-20T14:20:00Z",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
        status: "success",
        details: "Message sent to AI assistant",
        sessionId: "sess_ghi789",
      },
      {
        id: "4",
        userId: "user_123",
        username: "john_doe",
        userEmail: "john@example.com",
        action: "Login",
        app: "system",
        timestamp: "2024-01-20T13:15:00Z",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        status: "success",
        details: "User logged in successfully",
        sessionId: "sess_abc123",
      },
      {
        id: "5",
        userId: "user_456",
        username: "jane_smith",
        userEmail: "jane@example.com",
        action: "Failed Login Attempt",
        app: "system",
        timestamp: "2024-01-20T12:30:00Z",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        status: "error",
        details: "Invalid password provided",
        sessionId: "sess_def456",
      },
      {
        id: "6",
        userId: "user_789",
        username: "bob_wilson",
        userEmail: "bob@example.com",
        action: "Download Report",
        app: "pitch-analyzer",
        timestamp: "2024-01-20T11:45:00Z",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
        status: "success",
        details: "Pitch analysis report downloaded",
        sessionId: "sess_ghi789",
      },
      {
        id: "7",
        userId: "user_123",
        username: "john_doe",
        userEmail: "john@example.com",
        action: "Create Chat Session",
        app: "chat-service",
        timestamp: "2024-01-20T10:20:00Z",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        status: "success",
        details: "New chat session created",
        sessionId: "sess_abc123",
      },
      {
        id: "8",
        userId: "user_456",
        username: "jane_smith",
        userEmail: "jane@example.com",
        action: "System Error",
        app: "system",
        timestamp: "2024-01-20T09:15:00Z",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        status: "error",
        details: "API rate limit exceeded",
        sessionId: "sess_def456",
      },
      {
        id: "9",
        userId: "user_101",
        username: "sarah_johnson",
        userEmail: "sarah@example.com",
        action: "Search Resumes",
        app: "resume-parser",
        timestamp: "2024-01-20T08:45:00Z",
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        status: "success",
        details: "Searched for 'software engineer' with 15 results",
        sessionId: "sess_jkl101",
      },
      {
        id: "10",
        userId: "user_202",
        username: "mike_brown",
        userEmail: "mike@example.com",
        action: "Upload Multiple Files",
        app: "resume-parser",
        timestamp: "2024-01-20T08:30:00Z",
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        status: "success",
        details: "Uploaded 5 resume files successfully",
        sessionId: "sess_mno202",
      },
      {
        id: "11",
        userId: "user_303",
        username: "emma_davis",
        userEmail: "emma@example.com",
        action: "Export Data",
        app: "pitch-analyzer",
        timestamp: "2024-01-20T08:15:00Z",
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
        status: "success",
        details: "Exported pitch analysis data to CSV",
        sessionId: "sess_pqr303",
      },
      {
        id: "12",
        userId: "user_404",
        username: "alex_taylor",
        userEmail: "alex@example.com",
        action: "Delete Account",
        app: "system",
        timestamp: "2024-01-20T08:00:00Z",
        ipAddress: "192.168.1.106",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        status: "warning",
        details: "Account deletion requested - pending confirmation",
        sessionId: "sess_stu404",
      },
      {
        id: "13",
        userId: "user_505",
        username: "lisa_anderson",
        userEmail: "lisa@example.com",
        action: "Update Profile",
        app: "system",
        timestamp: "2024-01-20T07:45:00Z",
        ipAddress: "192.168.1.107",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        status: "success",
        details: "Profile information updated successfully",
        sessionId: "sess_vwx505",
      },
      {
        id: "14",
        userId: "user_606",
        username: "david_clark",
        userEmail: "david@example.com",
        action: "API Rate Limit",
        app: "chat-service",
        timestamp: "2024-01-20T07:30:00Z",
        ipAddress: "192.168.1.108",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
        status: "error",
        details: "Rate limit exceeded - too many requests",
        sessionId: "sess_yz606",
      },
      {
        id: "15",
        userId: "user_707",
        username: "rachel_white",
        userEmail: "rachel@example.com",
        action: "Bookmark Pitch",
        app: "pitch-analyzer",
        timestamp: "2024-01-20T07:15:00Z",
        ipAddress: "192.168.1.109",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        status: "success",
        details: "Pitch bookmarked for later review",
        sessionId: "sess_abc707",
      },
    ],
    []
  );

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesApp = selectedApp === "all" || log.app === selectedApp;
      const matchesStatus =
        selectedStatus === "all" || log.status === selectedStatus;
      const matchesUser = selectedUser === "all" || log.userId === selectedUser;

      return matchesSearch && matchesApp && matchesStatus && matchesUser;
    });
  }, [mockLogs, searchTerm, selectedApp, selectedStatus, selectedUser]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedApp, selectedStatus, selectedUser]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: CheckCircleIcon,
      },
      error: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: ExclamationTriangleIcon,
      },
      warning: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: ExclamationTriangleIcon,
      },
      info: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: InformationCircleIcon,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.info;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getAppIcon = (app: string) => {
    const appIcons = {
      "resume-parser": DocumentTextIcon,
      "pitch-analyzer": PresentationChartLineIcon,
      "chat-service": ChatBubbleLeftRightIcon,
      system: UserIcon,
    };

    const Icon = appIcons[app as keyof typeof appIcons] || UserIcon;
    return <Icon className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getUniqueUsers = () => {
    const users = mockLogs.map((log) => ({
      id: log.userId,
      name: log.username,
      email: log.userEmail,
    }));
    return users.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Audit Logs
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor user activity and system events across all applications
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredLogs.length}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(
                  (filteredLogs.filter((log) => log.status === "success")
                    .length /
                    filteredLogs.length) *
                    100
                )}
                %
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-blue-600">
                {getUniqueUsers().length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredLogs.filter((log) => log.status === "error").length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>

        {/* App Filter */}
        <select
          value={selectedApp}
          onChange={(e) => setSelectedApp(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="all">All Apps</option>
          <option value="resume-parser">Resume Parser</option>
          <option value="pitch-analyzer">Pitch Analyzer</option>
          <option value="chat-service">Chat Service</option>
          <option value="system">System</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        {/* User Filter */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="all">All Users</option>
          {getUniqueUsers().map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedApp("all");
            setSelectedStatus("all");
            setSelectedUser("all");
          }}
          className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FunnelIcon className="w-4 h-4 inline mr-2" />
          Clear Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  User
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  App
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {log.username}
                        </div>
                        <div className="text-xs text-gray-600">
                          {log.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-purple-600">
                        {getAppIcon(log.app)}
                      </div>
                      <span className="text-sm text-gray-700 capitalize">
                        {log.app.replace("-", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p
                        className="text-sm text-gray-700 truncate"
                        title={log.details}
                      >
                        {log.details}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {log.ipAddress}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredLogs.length)} of{" "}
                {filteredLogs.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          page === currentPage
                            ? "bg-purple-500 text-white shadow-lg"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsTab;
