import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * Input – Reusable input field with label, error, and icon support
 * 
 * @param {string} label - Input label
 * @param {string} name - Input name
 * @param {string} type - Input type (text, password, email, number, tel, date, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {function} onBlur - Blur handler
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} icon - Left icon
 * @param {string} className - Additional classes
 * @param {string} variant - 'default', 'filled', 'outline'
 */
const Input = forwardRef(({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
    disabled = false,
    icon: Icon,
    className = '',
    variant = 'default',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const variantClasses = {
        default: 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
        filled: 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600',
        outline: 'bg-transparent border-slate-300 dark:border-slate-600',
    };

    const errorClasses = error
        ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
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
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-5 h-5 text-slate-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={isPassword && showPassword ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full px-4 py-2.5 rounded-xl
                        border ${variantClasses[variant]} ${errorClasses}
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${Icon ? 'pl-10' : ''}
                        ${isPassword ? 'pr-10' : ''}
                        dark:text-slate-100 dark:placeholder-slate-400
                    `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;