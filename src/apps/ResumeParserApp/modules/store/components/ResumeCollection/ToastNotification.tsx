import React, { useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ToastNotificationProps {
  message: string;
  type: "error" | "success" | "warning";
  onDismiss: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  onDismiss,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-red-100/50",
          border: "border-red-200/60",
          text: "text-red-800",
          icon: "text-red-500",
          iconBg: "bg-red-100",
          button: "text-red-500 hover:bg-red-100 focus:ring-red-500",
          progress: "bg-gradient-to-r from-red-400 to-red-500",
          Icon: ExclamationTriangleIcon,
        };
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-emerald-50/50",
          border: "border-green-200/60",
          text: "text-green-800",
          icon: "text-green-600",
          iconBg: "bg-green-100",
          button: "text-green-500 hover:bg-green-100 focus:ring-green-500",
          progress: "bg-gradient-to-r from-green-400 to-green-500",
          Icon: CheckCircleIcon,
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-50 to-orange-50/50",
          border: "border-yellow-200/60",
          text: "text-yellow-800",
          icon: "text-yellow-600",
          iconBg: "bg-yellow-100",
          button: "text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-500",
          progress: "bg-gradient-to-r from-yellow-400 to-orange-400",
          Icon: InformationCircleIcon,
        };
    }
  };

  const styles = getTypeStyles();
  const { Icon } = styles;

  return (
    <div className="animate-slide-in-right">
      <div
        className={`relative overflow-hidden max-w-sm w-full ${styles.bg} ${styles.border} border backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out`}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gray-200/30">
          <div
            className={`h-full ${styles.progress} transition-all duration-300 ease-out progress-bar`}
            style={{
              animation: `progress-bar ${duration}ms linear forwards`,
            }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center`}
            >
              <Icon className={`h-5 w-5 ${styles.icon}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-5 ${styles.text}`}>
                {message}
              </p>
            </div>

            {/* Close button */}
            <div className="flex-shrink-0">
              <button
                onClick={onDismiss}
                className={`inline-flex rounded-lg p-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover-scale ${styles.button}`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none rounded-2xl" />
      </div>
    </div>
  );
};

export default ToastNotification;
