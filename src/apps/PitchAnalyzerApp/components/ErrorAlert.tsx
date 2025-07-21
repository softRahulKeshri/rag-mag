import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface IErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

const ErrorAlert = ({ error, onClose }: IErrorAlertProps) => {
  if (!error) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            Error Occurred
          </h3>
          <p className="text-red-800 leading-relaxed">{error}</p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            aria-label="Close error"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
