import React from 'react';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import { EyeIcon, QrCodeIcon } from '@heroicons/react/24/outline';

/**
 * BookingCard – Displays booking information in a card format
 * 
 * @param {object} booking - Booking object
 * @param {function} onCancel - Cancel button handler
 * @param {function} onView - View details button handler
 */
const BookingCard = ({ 
  booking, 
  onCancel, 
  onView,
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
      confirmed: 'badge-success',
      checked_in: 'badge-info',
      cancelled: 'badge-danger',
      no_show: 'badge-gray',
      completed: 'badge-success',
      pending: 'badge-warning',
    };
    return `badge ${styles[status] || 'badge-gray'}`;
  };

  return (
    <GlassCard className={`p-4 ${className}`} interactive hoverEffect="lift">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          {/* Route */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {booking.origin || 'Origin'}
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {booking.destination || 'Destination'}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="font-medium">Seat:</span> {booking.seat_number}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {formatDate(booking.scheduled_departure)} at {formatTime(booking.scheduled_departure)}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              ETB {parseFloat(booking.price || 0).toFixed(2)}
            </span>
          </div>

          {/* QR Code (if available) */}
          {booking.qr_code_hash && (
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <QrCodeIcon className="w-3.5 h-3.5" />
              <span className="font-mono">QR: {booking.qr_code_hash.slice(0, 12)}...</span>
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3">
          <span className={getStatusBadge(booking.booking_status || booking.status)}>
            {booking.booking_status || booking.status}
          </span>
          {onView && (
            <button 
              onClick={() => onView(booking)}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              title="View Details"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          )}
          {(booking.booking_status === 'confirmed' || booking.status === 'confirmed') && onCancel && (
            <GradientButton 
              variant="danger" 
              size="sm" 
              onClick={() => onCancel(booking)}
            >
              Cancel
            </GradientButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default BookingCard;