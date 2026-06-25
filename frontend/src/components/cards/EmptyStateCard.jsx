import React from 'react';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';

/**
 * EmptyStateCard – Displays a friendly empty state message
 * 
 * @param {string} title - Main title
 * @param {string} description - Description text
 * @param {React.ReactNode} icon - Icon component
 * @param {string} actionLabel - Button label (optional)
 * @param {function} onAction - Button click handler (optional)
 * @param {string} variant - 'default', 'primary', 'success' (default: 'default')
 */
const EmptyStateCard = ({ 
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  icon: Icon,
  actionLabel,
  onAction,
  variant = 'default',
  className = '',
}) => {
  const getIconColor = () => {
    switch (variant) {
      case 'primary': return 'text-blue-400 dark:text-blue-500';
      case 'success': return 'text-emerald-400 dark:text-emerald-500';
      default: return 'text-slate-400 dark:text-slate-500';
    }
  };

  return (
    <GlassCard className={`p-8 text-center ${className}`}>
      {Icon && (
        <Icon className={`w-12 h-12 mx-auto mb-4 ${getIconColor()}`} />
      )}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <GradientButton variant={variant} onClick={onAction}>
            {actionLabel}
          </GradientButton>
        </div>
      )}
    </GlassCard>
  );
};

export default EmptyStateCard;