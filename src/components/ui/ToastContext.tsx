import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import ToastNotification from "../../apps/ResumeParserApp/modules/store/components/ResumeCollection/ToastNotification";
import { ToastContext, type Toast, type ToastType } from "./toastTypes";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType, duration = 5000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => hideToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
