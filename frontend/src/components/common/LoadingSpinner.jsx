import React from 'react';

/**
 * LoadingSpinner – Full-page loading spinner
 * 
 * Usage:
 *   <LoadingSpinner />
 */
const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;