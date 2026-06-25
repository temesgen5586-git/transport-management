import React from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, TruckIcon } from '@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';

/**
 * TripCard – Displays trip information in a card format
 * 
 * @param {object} trip - Trip object
 * @param {function} onAction - Action button handler
 * @param {string} actionLabel - Button label
 * @param {string} actionVariant - 'primary', 'success', 'danger'
 */
const TripCard = ({ 
  trip, 
  onAction, 
  actionLabel = 'View',
  actionVariant = 'primary',
  compact = false,
  className = '',
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'badge-info',
      boarding: 'badge-warning',
      departed: 'badge-warning',
      en_route: 'badge-warning',
      emergency: 'badge-danger',
      completed: 'badge-success',
      cancelled: 'badge-gray',
      confirmed: 'badge-success',
      checked_in: 'badge-info',
    };
    return `badge ${styles[status] || 'badge-gray'}`;
  };

  return (
    <GlassCard className={`p-4 ${compact ? 'p-3' : ''} ${className}`} interactive hoverEffect="lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          {/* Route */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {trip.origin || trip.pickup_city || 'Origin'}
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {trip.destination || trip.dropoff_city || 'Destination'}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {trip.scheduled_departure && (
              <>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {formatDate(trip.scheduled_departure)}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {formatTime(trip.scheduled_departure)}
                </span>
              </>
            )}
            {trip.passenger_count !== undefined && (
              <span className="flex items-center gap-1">
                <UsersIcon className="w-3.5 h-3.5" />
                {trip.passenger_count} passengers
              </span>
            )}
            {trip.plate_number && (
              <span className="flex items-center gap-1">
                <TruckIcon className="w-3.5 h-3.5" />
                {trip.plate_number}
              </span>
            )}
            {trip.driver_name && (
              <span className="text-slate-400">• {trip.driver_name}</span>
            )}
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex items-center gap-3">
          {trip.status && (
            <span className={getStatusBadge(trip.status)}>
              {trip.status}
            </span>
          )}
          {trip.booking_status && (
            <span className={getStatusBadge(trip.booking_status)}>
              {trip.booking_status}
            </span>
          )}
          {onAction && (
            <GradientButton 
              variant={actionVariant} 
              size="sm" 
              onClick={() => onAction(trip)}
            >
              {actionLabel}
            </GradientButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default TripCard;