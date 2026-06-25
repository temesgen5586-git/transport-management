import React from 'react';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * PenaltyCard – Displays penalty information in a card format
 * 
 * @param {object} penalty - Penalty object
 * @param {function} onMarkPaid - Mark as paid button handler
 */
const PenaltyCard = ({ 
  penalty, 
  onMarkPaid,
  className = '',
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTypeBadge = (type) => {
    const styles = {
      delay: 'badge-warning',
      overcapacity: 'badge-danger',
      traffic_violation: 'badge-info',
    };
    return `badge ${styles[type] || 'badge-gray'}`;
  };

  return (
    <GlassCard className={`p-4 ${className}`} interactive hoverEffect="lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />
            <span className={`${getTypeBadge(penalty.penalty_type)}`}>
              {penalty.penalty_type}
            </span>
            {penalty.driver_id && (
              <span className="text-xs text-slate-500 font-mono">
                Driver: {penalty.driver_id.slice(0, 8)}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            {penalty.description || 'No description provided'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {formatDate(penalty.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-red-600 dark:text-red-400">
              -ETB {parseFloat(penalty.amount || 0).toFixed(2)}
            </p>
            <span className={`badge ${penalty.is_paid ? 'badge-success' : 'badge-danger'}`}>
              {penalty.is_paid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
          {!penalty.is_paid && onMarkPaid && (
            <GradientButton 
              variant="success" 
              size="sm" 
              onClick={() => onMarkPaid(penalty)}
            >
              Mark Paid
            </GradientButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default PenaltyCard;