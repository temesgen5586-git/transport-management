import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

/**
 * StatsCard – Dashboard statistics card with trend indicator
 * 
 * @param {string} title - Statistic title
 * @param {string|number} value - Statistic value
 * @param {string} color - 'blue', 'green', 'purple', 'gold', 'red', 'emerald'
 * @param {string} trend - 'up' or 'down'
 * @param {string} trendValue - Trend percentage text
 * @param {React.ReactNode} icon - Custom icon (optional)
 */
const StatsCard = ({ 
  title, 
  value, 
  color = 'blue', 
  trend, 
  trendValue, 
  icon: Icon,
  className = '',
}) => {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    gold: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  };

  const borderColors = {
    blue: 'border-blue-200 dark:border-blue-800/30',
    green: 'border-emerald-200 dark:border-emerald-800/30',
    purple: 'border-purple-200 dark:border-purple-800/30',
    gold: 'border-amber-200 dark:border-amber-800/30',
    red: 'border-rose-200 dark:border-rose-800/30',
    emerald: 'border-emerald-200 dark:border-emerald-800/30',
  };

  const defaultIcons = {
    blue: ArrowTrendingUpIcon,
    green: ArrowTrendingUpIcon,
    purple: ArrowTrendingUpIcon,
    gold: ArrowTrendingUpIcon,
    red: ArrowTrendingDownIcon,
    emerald: ArrowTrendingUpIcon,
  };

  const TrendIcon = trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  const iconColor = trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';

  return (
    <div className={`
      relative overflow-hidden rounded-2xl 
      bg-white dark:bg-slate-800/70 
      backdrop-blur-sm
      border ${borderColors[color]}
      shadow-sm hover:shadow-lg 
      transition-all duration-300 
      p-6
      ${className}
    `}>
      {/* Decorative gradient bar at bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-400 to-${color}-600 opacity-50`} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
          {trendValue && (
            <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <TrendIcon className="w-3 h-3" />
              {trendValue} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {Icon ? (
            <Icon className="w-6 h-6" />
          ) : (
            <TrendIcon className="w-6 h-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;