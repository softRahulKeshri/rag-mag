import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import type { AdminUser } from "../../types/admin";

/**
 * UserManagementTab Component
 *
 * Comprehensive user management interface with search, filtering, and CRUD operations.
 * Uses the main app's design system with consistent styling and brand colors.
 *
 * Features:
 * - User table with sortable columns
 * - Advanced search and filtering
 * - Role-based actions (view, edit, delete)
 * - Status indicators and badges
 * - Responsive design with mobile optimization
 * - Modern design using main app's color palette
 * - Pagination for large datasets
 */
const UserManagementTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - in real app, this would come from API
  const mockUsers = useMemo<AdminUser[]>(
    () => [
      {
        id: "1",
        username: "admin_user",
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        lastLoginAt: "2024-01-20T14:22:00Z",
        status: "online",
      },
      {
        id: "2",
        username: "john_doe",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        isActive: true,
        createdAt: "2024-01-10T09:15:00Z",
        lastLoginAt: "2024-01-19T16:45:00Z",
        status: "offline",
      },
      {
        id: "3",
        username: "jane_smith",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "moderator",
        isActive: true,
        createdAt: "2024-01-12T11:20:00Z",
        lastLoginAt: "2024-01-20T12:30:00Z",
        status: "away",
      },
      {
        id: "4",
        username: "bob_wilson",
        email: "bob@example.com",
        firstName: "Bob",
        lastName: "Wilson",
        role: "user",
        isActive: false,
        createdAt: "2024-01-08T14:45:00Z",
        lastLoginAt: "2024-01-15T10:20:00Z",
        status: "offline",
      },
      {
        id: "5",
        username: "sarah_johnson",
        email: "sarah@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "user",
        isActive: true,
        createdAt: "2024-01-18T08:30:00Z",
        lastLoginAt: "2024-01-20T09:15:00Z",
        status: "online",
      },
      {
        id: "6",
        username: "mike_brown",
        email: "mike@example.com",
        firstName: "Mike",
        lastName: "Brown",
        role: "moderator",
        isActive: true,
        createdAt: "2024-01-14T13:20:00Z",
        lastLoginAt: "2024-01-20T11:45:00Z",
        status: "online",
      },
      {
        id: "7",
        username: "emma_davis",
        email: "emma@example.com",
        firstName: "Emma",
        lastName: "Davis",
        role: "user",
        isActive: true,
        createdAt: "2024-01-16T15:10:00Z",
        lastLoginAt: "2024-01-19T17:30:00Z",
        status: "away",
      },
      {
        id: "8",
        username: "alex_taylor",
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Taylor",
        role: "user",
        isActive: false,
        createdAt: "2024-01-09T12:00:00Z",
        lastLoginAt: "2024-01-14T08:45:00Z",
        status: "offline",
      },
      {
        id: "9",
        username: "lisa_anderson",
        email: "lisa@example.com",
        firstName: "Lisa",
        lastName: "Anderson",
        role: "moderator",
        isActive: true,
        createdAt: "2024-01-13T10:45:00Z",
        lastLoginAt: "2024-01-20T13:20:00Z",
        status: "online",
      },
      {
        id: "10",
        username: "david_clark",
        email: "david@example.com",
        firstName: "David",
        lastName: "Clark",
        role: "user",
        isActive: true,
        createdAt: "2024-01-17T09:30:00Z",
        lastLoginAt: "2024-01-20T10:15:00Z",
        status: "online",
      },
      {
        id: "11",
        username: "rachel_white",
        email: "rachel@example.com",
        firstName: "Rachel",
        lastName: "White",
        role: "user",
        isActive: true,
        createdAt: "2024-01-11T16:20:00Z",
        lastLoginAt: "2024-01-19T14:30:00Z",
        status: "away",
      },
      {
        id: "12",
        username: "chris_martin",
        email: "chris@example.com",
        firstName: "Chris",
        lastName: "Martin",
        role: "user",
        isActive: false,
        createdAt: "2024-01-07T11:15:00Z",
        lastLoginAt: "2024-01-13T09:20:00Z",
        status: "offline",
      },
      {
        id: "13",
        username: "amanda_lee",
        email: "amanda@example.com",
        firstName: "Amanda",
        lastName: "Lee",
        role: "moderator",
        isActive: true,
        createdAt: "2024-01-19T14:45:00Z",
        lastLoginAt: "2024-01-20T16:10:00Z",
        status: "online",
      },
      {
        id: "14",
        username: "kevin_garcia",
        email: "kevin@example.com",
        firstName: "Kevin",
        lastName: "Garcia",
        role: "user",
        isActive: true,
        createdAt: "2024-01-20T07:30:00Z",
        lastLoginAt: "2024-01-20T18:45:00Z",
        status: "online",
      },
      {
        id: "15",
        username: "sophia_rodriguez",
        email: "sophia@example.com",
        firstName: "Sophia",
        lastName: "Rodriguez",
        role: "user",
        isActive: true,
        createdAt: "2024-01-15T12:00:00Z",
        lastLoginAt: "2024-01-20T15:30:00Z",
        status: "away",
      },
    ],
    []
  );

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      const matchesStatus =
        selectedStatus === "all" || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [mockUsers, searchTerm, selectedRole, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: {
        bg: "bg-gradient-to-r from-purple-500 to-indigo-500",
        text: "text-white",
        border: "border-purple-500",
      },
      moderator: {
        bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
        text: "text-white",
        border: "border-blue-500",
      },
      user: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
      },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.user;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} shadow-sm`}
      >
        {role}
      </span>
    );
  };

  const getStatusIndicator = (status: string) => {
    const statusConfig = {
      online: {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-50",
      },
      offline: {
        dot: "bg-gray-400",
        text: "text-gray-600",
        bg: "bg-gray-50",
      },
      away: {
        dot: "bg-yellow-500",
        text: "text-yellow-700",
        bg: "bg-yellow-50",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;

    return (
      <div
        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${config.bg} border border-transparent`}
      >
        <div
          className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}
        ></div>
        <span className={config.text}>{status}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            User Management
          </h2>
          <p className="text-gray-600 text-sm">
            {filteredUsers.length} of {mockUsers.length} users
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <PlusIcon className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="away">Away</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedRole("all");
            setSelectedStatus("all");
          }}
          className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Clear Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  User
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    {getStatusIndicator(user.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all duration-200">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                        <TrashIcon className="w-4 h-4" />
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
                {Math.min(endIndex, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
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

export default UserManagementTab;
