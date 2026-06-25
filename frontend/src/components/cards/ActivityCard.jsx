import React from 'react';
import { 
  UserCircleIcon, 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

/**
 * ActivityCard – Displays a single activity item in the feed
 * 
 * @param {object} activity - Activity log object
 */
const ActivityCard = ({ activity, className = '' }) => {
  const getActivityIcon = (actionType) => {
    if (actionType?.includes('USER_REGISTERED')) return <UserCircleIcon className="w-4 h-4" />;
    if (actionType?.includes('TRIP_SCHEDULED')) return <CalendarIcon className="w-4 h-4" />;
    if (actionType?.includes('PENALTY')) return <ExclamationTriangleIcon className="w-4 h-4" />;
    if (actionType?.includes('EMERGENCY')) return <ExclamationTriangleIcon className="w-4 h-4" />;
    if (actionType?.includes('DEPOSIT') || actionType?.includes('PAYMENT')) return <CurrencyDollarIcon className="w-4 h-4" />;
    if (actionType?.includes('FREIGHT')) return <DocumentTextIcon className="w-4 h-4" />;
    return <ClockIcon className="w-4 h-4" />;
  };

  const getActivityColor = (actionType) => {
    if (actionType?.includes('USER_REGISTERED')) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    if (actionType?.includes('TRIP_SCHEDULED')) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    if (actionType?.includes('PENALTY')) return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
    if (actionType?.includes('EMERGENCY')) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (actionType?.includes('DEPOSIT') || actionType?.includes('PAYMENT')) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    if (actionType?.includes('FREIGHT')) return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-700/30';
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getActivityLabel = (actionType) => {
    return actionType?.replace(/_/g, ' ') || 'Action';
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${className}`}>
      <div className={`p-2 rounded-lg ${getActivityColor(activity.action_type)}`}>
        {getActivityIcon(activity.action_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 dark:text-slate-100 font-medium truncate">
          {getActivityLabel(activity.action_type)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {activity.entity_type} · {activity.user_id?.slice(0, 8) || 'System'}
        </p>
      </div>
      <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
        {formatTime(activity.created_at)}
      </div>
    </div>
  );
};

export default ActivityCard;