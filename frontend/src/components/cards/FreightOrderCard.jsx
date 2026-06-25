import React from 'react';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import { CubeIcon, ScaleIcon } from '@heroicons/react/24/outline';

/**
 * FreightOrderCard – Displays freight order in a card format
 * 
 * @param {object} order - Freight order object
 * @param {function} onMatch - Find return load button handler
 */
const FreightOrderCard = ({ 
  order, 
  onMatch,
  className = '',
}) => {
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'badge-warning',
      assigned: 'badge-info',
      in_transit: 'badge-info',
      delivered: 'badge-success',
      customs_hold: 'badge-danger',
    };
    return `badge ${styles[status] || 'badge-gray'}`;
  };

  return (
    <GlassCard className={`p-4 ${className}`} interactive hoverEffect="lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          {/* Pickup → Dropoff */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {order.pickup_city || 'Pickup'}
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {order.dropoff_city || 'Dropoff'}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ScaleIcon className="w-3.5 h-3.5" />
              {order.weight_kg} kg
            </span>
            {order.volume_cbm && (
              <span className="flex items-center gap-1">
                <CubeIcon className="w-3.5 h-3.5" />
                {order.volume_cbm} m³
              </span>
            )}
            {order.status && (
              <span className="text-slate-400">•</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {order.status && (
            <span className={getStatusBadge(order.status)}>
              {order.status}
            </span>
          )}
          {onMatch && order.status === 'pending' && (
            <GradientButton 
              variant="secondary" 
              size="sm" 
              onClick={() => onMatch(order)}
            >
              Find Return Load
            </GradientButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default FreightOrderCard;