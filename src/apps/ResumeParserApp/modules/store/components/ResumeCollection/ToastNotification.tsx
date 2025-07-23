import React, { useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
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
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: "text-red-400",
          button: "text-red-500 hover:bg-red-100",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: "text-green-400",
          button: "text-green-500 hover:bg-green-100",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: "text-yellow-400",
          button: "text-yellow-500 hover:bg-yellow-100",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} ${styles.border} rounded-md shadow-lg p-4 transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onDismiss}
            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
