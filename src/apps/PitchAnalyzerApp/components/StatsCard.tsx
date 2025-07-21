import type { ReactNode } from "react";

interface IStatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  className?: string;
}

const StatsCard = ({ icon, title, value, className = "" }: IStatsCardProps) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
