import React from "react";
import {
  UsersIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  SignalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BoltIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import type { SystemAnalytics } from "../../types/admin";

/**
 * SystemAnalyticsTab Component
 *
 * Comprehensive system analytics dashboard with real-time metrics, performance indicators,
 * and system health monitoring. Uses the main app's design system with consistent styling.
 *
 * Features:
 * - Key performance indicators (KPIs)
 * - System health status with visual indicators
 * - Storage usage with progress bars
 * - Real-time metrics display
 * - Performance charts and trends
 * - Responsive grid layout
 * - Modern design using main app's color palette
 */
const SystemAnalyticsTab: React.FC = () => {
  // Mock analytics data - in real app, this would come from API
  const analytics: SystemAnalytics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalResumes: 3456,
    totalChatSessions: 2156,
    totalPitches: 1234,
    storageUsed: 75.6, // GB
    storageLimit: 100, // GB
    systemHealth: "excellent",
    uptime: 99.98, // percentage
    responseTime: 245, // milliseconds
  };

  const getSystemHealthConfig = (health: string) => {
    const config = {
      excellent: {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircleIcon,
        label: "Excellent",
      },
      good: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: CheckCircleIcon,
        label: "Good",
      },
      warning: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: ExclamationTriangleIcon,
        label: "Warning",
      },
      critical: {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: ExclamationTriangleIcon,
        label: "Critical",
      },
    };

    return config[health as keyof typeof config] || config.excellent;
  };

  const getStoragePercentage = () => {
    return (analytics.storageUsed / analytics.storageLimit) * 100;
  };

  const getStorageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getResponseTimeColor = (time: number) => {
    if (time <= 200) return "text-green-600";
    if (time <= 500) return "text-yellow-600";
    return "text-red-600";
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "text-purple-600",
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: "up" | "down";
    trendValue?: string;
    color?: string;
  }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );

  const SystemStatusCard = () => {
    const healthConfig = getSystemHealthConfig(analytics.systemHealth);
    const Icon = healthConfig.icon;

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border ${healthConfig.bgColor} ${healthConfig.borderColor}`}
          >
            <Icon className={`w-4 h-4 ${healthConfig.color}`} />
            <span className={`text-sm font-medium ${healthConfig.color}`}>
              {healthConfig.label}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Uptime</span>
            <span className="text-gray-900 font-medium">
              {analytics.uptime}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Response Time</span>
            <span
              className={`font-medium ${getResponseTimeColor(
                analytics.responseTime
              )}`}
            >
              {analytics.responseTime}ms
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Users</span>
            <span className="text-gray-900 font-medium">
              {analytics.activeUsers} / {analytics.totalUsers}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const StorageCard = () => {
    const percentage = getStoragePercentage();
    const color = getStorageColor(percentage);

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
            <ComputerDesktopIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Storage Usage
            </h3>
            <p className="text-gray-600 text-sm">
              {analytics.storageUsed}GB of {analytics.storageLimit}GB
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Used Space</span>
            <span className="text-sm font-medium text-gray-900">
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${color}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>0 GB</span>
            <span>{analytics.storageLimit} GB</span>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceCard = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg">
          <BoltIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Metrics
          </h3>
          <p className="text-gray-600 text-sm">Real-time system performance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
          <div className="text-2xl font-bold text-gray-900">
            {analytics.responseTime}ms
          </div>
          <div className="text-xs text-gray-600">Avg Response</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
          <div className="text-2xl font-bold text-gray-900">
            {analytics.uptime}%
          </div>
          <div className="text-xs text-gray-600">Uptime</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          System Analytics
        </h2>
        <p className="text-gray-600 text-sm">
          Monitor system performance, health, and analytics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={UsersIcon}
          trend="up"
          trendValue="+12%"
          color="text-purple-600"
        />
        <MetricCard
          title="Active Users"
          value={analytics.activeUsers}
          icon={SignalIcon}
          trend="up"
          trendValue="+8%"
          color="text-green-600"
        />
        <MetricCard
          title="Total Resumes"
          value={analytics.totalResumes}
          icon={DocumentTextIcon}
          trend="up"
          trendValue="+15%"
          color="text-orange-600"
        />
        <MetricCard
          title="Chat Sessions"
          value={analytics.totalChatSessions}
          icon={ChatBubbleLeftRightIcon}
          trend="up"
          trendValue="+22%"
          color="text-blue-600"
        />
      </div>

      {/* System Status and Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemStatusCard />
        <StorageCard />
      </div>

      {/* Performance and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceCard />
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 shadow-lg">
              <ServerIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                System Resources
              </h3>
              <p className="text-gray-600 text-sm">Server and infrastructure</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: "45%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium text-gray-900">62%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-yellow-500"
                style={{ width: "62%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network</span>
              <span className="text-sm font-medium text-gray-900">28%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: "28%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalyticsTab;
