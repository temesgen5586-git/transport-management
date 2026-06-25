import React, { useState } from 'react';
import { useAuth, useTheme } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import {
    SunIcon,
    MoonIcon,
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import GlassCard from './GlassCard';

const Header = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardTitle = () => {
        if (user?.role === 'super_admin' || user?.role === 'dispatcher') {
            return 'Admin Panel';
        }
        if (user?.role === 'driver') {
            return 'Driver Dashboard';
        }
        if (user?.role === 'auditor') {
            return 'Auditor Dashboard';
        }
        return 'Customer Dashboard';
    };

    return (
        <header className="sticky top-0 z-30 px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 transition-all duration-300">
            <div className="flex justify-between items-center">
                {/* Left - Page Title */}
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {getDashboardTitle()}
                    </h1>
                    <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-3">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {darkMode ? (
                            <SunIcon className="w-5 h-5 text-amber-400" />
                        ) : (
                            <MoonIcon className="w-5 h-5 text-slate-600" />
                        )}
                    </button>

                    {/* Notifications */}
                    <button
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
                        aria-label="Notifications"
                    >
                        <BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="User menu"
                        >
                            <UserCircleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-200">
                                {user?.full_name?.split(' ')[0] || 'User'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-fadeIn">
                                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                        {user?.full_name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {user?.role?.replace('_', ' ')}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {user?.phone}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate('/wallet');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    💰 Wallet
                                </button>
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate('/my-bookings');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    📋 My Bookings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;