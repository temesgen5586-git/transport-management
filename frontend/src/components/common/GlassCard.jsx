import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = 'lift',
  interactive = false,
  ...props 
}) => {
  const hoverClasses = {
    none: '',
    lift: 'hover:shadow-[0_12px_48px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_12px_48px_rgba(37,99,235,0.1)] hover:-translate-y-1',
    glow: 'hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] dark:hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]',
  };

  const interactiveClasses = interactive ? 'cursor-pointer transition-all duration-300' : '';

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl 
        bg-white/60 dark:bg-slate-800/60 
        backdrop-blur-xl 
        border border-white/20 dark:border-slate-700/50 
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300
        ${hoverClasses[hoverEffect]}
        ${interactiveClasses}
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 dark:from-blue-500/10 dark:to-violet-500/10 pointer-events-none" />
      {children}
    </div>
  );
};

export default GlassCard;