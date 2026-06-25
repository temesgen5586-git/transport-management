import React from 'react';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import { PencilIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

/**
 * VehicleCapacityCard – Displays vehicle with capacity bar
 * 
 * @param {object} vehicle - Vehicle object with plate_number, vehicle_type, max_capacity, current_occupancy
 * @param {function} onEdit - Edit button handler
 * @param {function} onAdjustCapacity - Adjust capacity button handler
 */
const VehicleCapacityCard = ({ 
  vehicle, 
  onEdit, 
  onAdjustCapacity,
  className = '',
}) => {
  const current = vehicle.current_occupancy || 0;
  const max = vehicle.max_capacity || 0;
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const isFull = current >= max;

  const getStatus = () => {
    if (percentage >= 100) return { label: 'Full', color: 'bg-red-500', text: 'text-red-600' };
    if (percentage >= 80) return { label: 'Almost Full', color: 'bg-yellow-500', text: 'text-yellow-600' };
    if (percentage >= 50) return { label: 'Partially Booked', color: 'bg-blue-500', text: 'text-blue-600' };
    if (percentage > 0) return { label: 'Available', color: 'bg-emerald-500', text: 'text-emerald-600' };
    return { label: 'Empty', color: 'bg-emerald-400', text: 'text-emerald-600' };
  };

  const status = getStatus();

  return (
    <GlassCard className={`p-4 ${isFull ? 'border-red-300 dark:border-red-800' : ''} ${className}`} interactive hoverEffect="lift">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            {vehicle.plate_number}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {vehicle.vehicle_type || vehicle.vehicle_type_name || 'Vehicle'}
          </p>
          {vehicle.model && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {vehicle.model} • {vehicle.year_made || 'N/A'}
            </p>
          )}
        </div>
        <span className={`badge ${isFull ? 'badge-danger' : 'badge-info'}`}>
          {status.label}
        </span>
      </div>

      {/* Capacity Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600 dark:text-slate-300">Capacity</span>
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {current} / {max} seats
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${status.color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Occupied: {current}</span>
          <span>Available: {Math.max(0, max - current)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        {onEdit && (
          <button 
            onClick={() => onEdit(vehicle)}
            className="text-sm text-primary-600 hover:underline dark:text-primary-400 flex items-center gap-1"
          >
            <PencilIcon className="w-4 h-4" /> Edit
          </button>
        )}
        {onAdjustCapacity && (
          <button 
            onClick={() => onAdjustCapacity(vehicle)}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" /> Adjust Capacity
          </button>
        )}
      </div>
    </GlassCard>
  );
};

export default VehicleCapacityCard;