import React, { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * Select – Reusable select dropdown with label and error
 * 
 * @param {string} label - Select label
 * @param {string} name - Select name
 * @param {array} options - Options array [{ value, label }]
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional classes
 */
const Select = forwardRef(({
    label,
    name,
    options = [],
    value,
    onChange,
    onBlur,
    placeholder = 'Select an option',
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    const errorClasses = error
        ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
        : 'focus:ring-primary-500 focus:border-primary-500';

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full px-4 py-2.5 pr-10 rounded-xl
                        bg-white dark:bg-slate-800
                        border border-slate-300 dark:border-slate-600 ${errorClasses}
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        appearance-none
                        dark:text-slate-100
                        ${!value ? 'text-slate-400 dark:text-slate-500' : ''}
                    `}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;