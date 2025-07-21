import type { ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface IQuickActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText: string;
  actionColor: string;
  onClick?: () => void;
  disabled?: boolean;
}

const QuickActionCard = ({
  icon,
  title,
  description,
  actionText,
  actionColor,
  onClick,
  disabled = false,
}: IQuickActionCardProps) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
        onClick && !disabled ? "cursor-pointer" : ""
      } ${disabled ? "opacity-50" : ""}`}
      onClick={handleClick}
      role={onClick && !disabled ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={
        onClick && !disabled
          ? `Click to ${actionText.toLowerCase()}`
          : undefined
      }
    >
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className={`inline-flex items-center ${actionColor} font-medium`}>
        {actionText} <ArrowRightIcon className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
};

export default QuickActionCard;
