import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo – Brand logo with Ethiopian Transportation System text
 * 
 * Usage:
 *   <Logo />
 */
const Logo = ({ variant = 'default' }) => {
    const sizes = {
        default: 'w-10 h-10 text-lg',
        small: 'w-8 h-8 text-sm',
        large: 'w-12 h-12 text-xl',
    };

    const textSizes = {
        default: 'text-lg',
        small: 'text-base',
        large: 'text-2xl',
    };

    const subTextSizes = {
        default: 'text-[10px]',
        small: 'text-[8px]',
        large: 'text-xs',
    };

    return (
        <Link to="/" className="flex items-center gap-2">
            <div className={`flex-shrink-0 ${sizes[variant]} bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25`}>
                <span className="text-white font-bold">ET</span>
            </div>
            <div className="flex flex-col leading-tight">
                <span className={`${textSizes[variant]} font-bold text-slate-800 dark:text-white`}>
                    EthioTrans
                </span>
                <span className={`${subTextSizes[variant]} text-primary-600 dark:text-primary-400 font-medium tracking-wider uppercase`}>
                    Ethiopian Transportation System
                </span>
            </div>
        </Link>
    );
};

export default Logo;